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

* Frontend: [http://127.0.0.1:5173](http://127.0.0.1:5173)
* Swagger:  [http://127.0.0.1:5000/swagger](http://127.0.0.1:5000/swagger)

## API

* Users: [http://127.0.0.1:5000/api/users](http://127.0.0.1:5000/api/users)
* Benefits: [http://127.0.0.1:5000/api/benefits](http://127.0.0.1:5000/api/benefits)
* Benefit Requests: [http://127.0.0.1:5000/api/benefitrequests](http://127.0.0.1:5000/api/benefitrequests)

## Baza danych

* Host: 127.0.0.1
* Port: 5433
* Database: mojadatabaza
* User: admin
* Password: secret
