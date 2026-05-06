docker compose -f docker-compose.yml down -v 
docker system prune -a
docker compose -f docker-compose.yml up --force-recreate
docker ps