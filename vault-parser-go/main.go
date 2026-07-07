package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"

	"github.com/hschendel/stl"
)

type AnalyzeRequest struct {
	FileUrl string `json:"fileUrl"`
}

type AnalyzeResponse struct {
	Volume     float64 `json:"volume"`
	Dimensions string  `json:"dimensions"`
	Message    string  `json:"message"`
}

func analyzeModelHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var reqData AnalyzeRequest
	err := json.NewDecoder(r.Body).Decode(&reqData)
	if err != nil || reqData.FileUrl == "" {
		http.Error(w, "Invalid JSON or missing fileUrl", http.StatusBadRequest)
		return
	}

	fmt.Println("Downloading file from cloud:", reqData.FileUrl)

	resp, err := http.Get(reqData.FileUrl)
	if err != nil || resp.StatusCode != http.StatusOK {
		http.Error(w, "Failed to download file from Cloudinary", http.StatusBadRequest)
		return
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read file bytes", http.StatusInternalServerError)
		return
	}

	dataReader := bytes.NewReader(bodyBytes)

	solid, err := stl.ReadAll(dataReader)
	if err != nil {
		http.Error(w, "Failed to parse STL file", http.StatusInternalServerError)
		return
	}

	var volume float64
	var minX, minY, minZ float32 = math.MaxFloat32, math.MaxFloat32, math.MaxFloat32
	var maxX, maxY, maxZ float32 = -math.MaxFloat32, -math.MaxFloat32, -math.MaxFloat32

	for _, t := range solid.Triangles {
		p1, p2, p3 := t.Vertices[0], t.Vertices[1], t.Vertices[2]

		for _, p := range t.Vertices {
			if p[0] < minX {
				minX = p[0]
			}
			if p[0] > maxX {
				maxX = p[0]
			}
			if p[1] < minY {
				minY = p[1]
			}
			if p[1] > maxY {
				maxY = p[1]
			}
			if p[2] < minZ {
				minZ = p[2]
			}
			if p[2] > maxZ {
				maxZ = p[2]
			}
		}

		volume += float64(p1[0]*p2[1]*p3[2] - p1[0]*p3[1]*p2[2] - p2[0]*p1[1]*p3[2] + p2[0]*p3[1]*p1[2] + p3[0]*p1[1]*p2[2] - p3[0]*p2[1]*p1[2])
	}

	volume = math.Abs(volume) / 6.0

	dimensions := fmt.Sprintf("%.2fx%.2fx%.2f", maxX-minX, maxY-minY, maxZ-minZ)

	fmt.Printf("Analiza zakończona! Objętość: %.2f, Wymiary: %s\n", volume, dimensions)

	w.Header().Set("Content-Type", "application/json")

	response := AnalyzeResponse{
		Volume:     volume,
		Dimensions: dimensions,
		Message:    "File analyzed successfully",
	}

	json.NewEncoder(w).Encode(response)

}

func main() {
	http.HandleFunc("/analyze", analyzeModelHandler)

	port := ":8080"
	fmt.Printf("GO STL Parser listening on port %s", port)

	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Println("Error while starting the server:", err)
	}
}
