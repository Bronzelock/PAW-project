
# 3D Vault - System webowy do udostępniania i analizy modeli 3D

System to aplikacja webowa służąca do bezpiecznego udostępniania, katalogowania oraz automatycznej analizy geometrycznej modeli przestrzennych (STL).

## Architektura i Technologie

Projekt wykorzystuje nowoczesną architekturę opartą na mikrousługach:
* Backend (Główne API): Node.js + Express.js
* Mikroserwis analityczny: Golang
* Baza Danych: MongoDB + Mongoose
* Przechowywanie plików: Cloudinary
* Frontend (Prototyp UI): React.js + Vite + Tailwind CSS / DaisyUI

## Projekt REST API

API zostało zabezpieczone autoryzacją opartą na tokenach JWT. Umożliwia ono pełne zarządzanie cyklem życia modeli 3D.

**Główne endpointy:**
* `POST /auth/register` - Rejestracja nowego użytkownika.
* `POST /auth/login` - Logowanie i wydawanie tokenu JWT.
* `GET /models` - Pobieranie całego katalogu modeli wraz z metadanymi twórcy.
* `POST /models` - Upload pliku STL. Serwer integruje się z Cloudinary, a następnie odpytuje mikroserwis w Go o analizę geometrii.
* `DELETE /models/:id` - Usuwanie modelu i zwalnianie przestrzeni dyskowej w chmurze.

## Projekt Bazy Danych

Baza wykorzystuje strukturę no-SQL (MongoDB)

**Kolekcja `Users`:**
* `_id` (ObjectId) - Identyfikator
* `email` (String) - Login użytkownika
* `passwordHash` (String) - Zahaszowane hasło
* `createdAt` (Date) - Znacznik czasu

**Kolekcja `VaultModels`:**
* `_id` (ObjectId)
* `title` (String) - Nazwa modelu
* `description` (String) - Opis techniczny
* `fileUrl` (String) - URL do zasobu fizycznego (Cloudinary)
* `cloudinaryId` (String) - Wewnętrzny ID chmury (do usuwania)
* `userId` (ObjectId) - Reference do twórcy w kolekcji Users
* `status` (String) - Status analizy
* `volume` (Number) - Wyliczona objętość
* `dimensions` (String) - Wymiary graniczne bounding box'a (x y z)
