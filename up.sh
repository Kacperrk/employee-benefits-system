#!/usr/bin/env bash

# 1. Zatrzymuje kontenery i USUWA VOLUMES (-v), czyli czyści bazę danych
#docker compose -f docker-compose.yml down -v

# 2. Czyści system z nieużywanych obrazów, kontenerów i sieci
# UWAGA: To usunie wszystko, co nie jest aktualnie używane w Dockerze
#docker system prune -a --force

# 3. Buduje wszystko od zera i uruchamia w tle
docker compose -f docker-compose.yml up --build -d

# 4. Pokazuje status
docker ps