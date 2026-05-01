# employee-benefits-system

## Uruchomienie

```bash
docker compose up --build -d
```

## Zakończenie

```bash
docker compose down
```

## Sprawdzenie stanu

```bash
docker ps
```

## Usunięcie danych Postgres

```bash
docker compose down -v
```

## Aplikacja

* Frontend: [http://localhost:5173](http://localhost:5173)
* Swagger:  [http://localhost:5000/swagger](http://localhost:5000/swagger)

## API

* Users: [http://localhost:5000/api/users](http://localhost:5000/api/users)
* Benefits: [http://localhost:5000/api/benefits](http://localhost:5000/api/benefits)
* Benefit Requests: [http://localhost:5000/api/benefitrequests](http://localhost:5000/api/benefitrequests)

## Baza danych

* Host: localhost
* Port: 5433
* Database: mojadatabaza
* User: admin
* Password: secret
