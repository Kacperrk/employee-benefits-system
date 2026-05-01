# Etap budowania (SDK musi wspierać .NET 10)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Kopiujemy projekt i przywracamy paczki NuGet
COPY ["Api.csproj", "./"]
RUN dotnet restore "Api.csproj"

# Kopiujemy całą resztę kodu źródłowego
COPY . .

# Publikujemy aplikację do folderu /app/out
RUN dotnet publish "Api.csproj" -c Release -o /app/out

# Etap uruchamiania (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .

# Ustawienia portów
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

# Start aplikacji - plik musi nazywać się Api.dll (zgodnie z Api.csproj)
ENTRYPOINT ["dotnet", "Api.dll"]