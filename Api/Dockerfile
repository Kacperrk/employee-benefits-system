# ── ETAP 1: BUILD ─────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Kopiuj tylko csproj i przywróć zależności (cache layer)
COPY ["Api.csproj", "./"]
RUN dotnet restore "Api.csproj"

# Kopiuj resztę i publikuj
COPY . .
RUN dotnet publish "Api.csproj" \
    -c Release \
    -o /app/out \
    --no-restore

# ── ETAP 2: RUNTIME ───────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Kopiuj tylko opublikowane pliki
COPY --from=build /app/out .

# Zmienne środowiskowe
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "Api.dll"]