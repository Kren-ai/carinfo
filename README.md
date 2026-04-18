# CarInfo
Technical Assessment

## Start

## Backend (Laravel API)

### 1. Install PHP dependencies

```bash
cd Backend
composer install
```

### 2. Create the environment file

```bash
cp .env.example .env
```

### 3. Generate the application key

```bash
php artisan key:generate
```

### 4. Configure the database

Open `Backend/.env` and update these values to match your MySQL credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=carinfo_dbo
DB_USERNAME=
DB_PASSWORD=
```

### 5. Run migrations

```bash
php artisan migrate
```

### 6. Start the backend server

```bash
php artisan serve
```

The API will be available at `http://127.0.0.1:8000/api`.

---

## Frontend (Vue 3 + Quasar)

### 1. Install Node dependencies

```bash
cd Frontend
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> Make sure the Laravel backend (`php artisan serve`) is running before opening the frontend.

---

## Running the Full Application

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd Backend
php artisan serve
```

**Terminal 2 — Frontend:**
```bash
cd Frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Available API Endpoints

Base URL: `http://127.0.0.1:8000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List all products (supports filters) |
| POST | `/products` | Create a new product |
| GET | `/products/{id}` | Get a single product |
| PATCH | `/products/{id}` | Update a product |
| DELETE | `/products/{id}` | Delete a product |

### Query Parameters for GET `/products`

| Parameter | Description |
|---|---|
| `product_name` | Filter by partial name match |
| `product_type` | Filter by exact type |
| `product_parent_id` | Filter by parent ID (`null` for top-level) |