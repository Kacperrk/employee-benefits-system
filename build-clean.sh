#!/usr/bin/env bash

# awaryjny up kontenera gdy coś nie działa
# usuwa wszystkie nieużywane zasoby Dockera z systemu

docker compose down -v 

# -f (--force) = bez pytania o potwierdzenie
# -a (--all) = usuń także nieużywane obrazy
docker system prune -f -a
docker compose up --build --force-recreate
docker ps -a
