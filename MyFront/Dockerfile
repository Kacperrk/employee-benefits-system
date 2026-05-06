# ── ETAP BUDOWANIA ────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Kopiujemy pliki zależności
COPY package*.json ./
RUN npm install

# Kopiujemy resztę kodu źródłowego
COPY . .

# USUNIĘCIE STORYBOOKA: Pozbywamy się plików demo i konfiguracji
RUN rm -rf src/stories .storybook

# Budujemy aplikację
RUN npm run build

# ── ETAP SERWOWANIA (NGINX) ───────────────────────────────
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]