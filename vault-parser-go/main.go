package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Response struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}

func healthCheck(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	response := Response{
		Message: "GO STL parser is online",
		Status:  "success",
	}

	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/analyze", healthCheck)

	port := ":8080"
	fmt.Printf("GO server started on port %s", port)

	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Println("Error while starting the server:", err)
	}
}
