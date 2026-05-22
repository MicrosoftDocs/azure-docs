---
title: Develop and test apps locally for Azure Container Apps express (preview)
description: Build, run, test, and publish container images before you deploy them to Azure Container Apps express.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 05/20/2026
ms.author: cshoe
---

# Develop and test apps locally for Azure Container Apps express (preview)

You can build and test your container locally before you deploy to Azure Container Apps express. This article shows you how to build an image, run it locally with Docker or Docker Compose, push it to a registry, and verify the deployment.

> [!NOTE]
> Replace placeholders in code listing with your values before running commands. For example, replace text like `<CONTAINER_APP_NAME>` with the name of your container app.

## Prerequisites

The following items are required to run your express app locally:

- Docker Desktop or a compatible container runtime installed locally.
- Access to a container registry that Azure Container Apps express can pull from.
- Azure CLI installed and signed in for deployment verification.

## Local development workflow

Azure Container Apps express runs standard Open Container Initiative (OCI) containers, so your local development workflow follows this process:

- Code your application
- Build the container
- Test locally
- Push to registry
- Deploy to Container Apps express

No special SDK, CLI, or configuration format is required. If your app runs in a container locally, it runs on Azure Container Apps express.

## Build your container image

Your app needs a Dockerfile and a build step to produce a container image that Azure Container Apps express can run.

This Dockerfile produces a container image listening on an HTTP port. Here's a sample Docker file that listens to port `3000`.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

The local configuration requires a few specific settings. Your app must:

- Listen on a single HTTP port (the same port you configure as `targetPort` in Azure Container Apps express).
- Start quickly, ideally in less than 5 seconds.
- Write logs to `stdout` and `stderr`. Azure Container Apps express captures these streams automatically.

### Build the image

Use the `docker build` command to create a local image from your Dockerfile.

```bash
docker build -t <CONTAINER_APP_NAME>:dev .
```

## Test locally with Docker

To verify it works before deploying, run your container image locally with Docker.

Run your container with the following command:

```bash
docker run -d \
  -p 8080:3000 \
  -e DATABASE_URL="postgres://localhost:5432/mydb" \
  -e LOG_LEVEL="debug" \
  --name <CONTAINER_APP_NAME> \
  <CONTAINER_APP_NAME>:dev
```

Then, check that the app is running by requesting the health endpoint and the app itself.

```bash
curl http://localhost:8080/health
curl http://localhost:8080/
```

### View container logs

Use `docker logs` to stream your container's output in real time.

```bash
docker logs -f <CONTAINER_APP_NAME>
```

### Stop and clean up

When you're done testing, stop and remove the container to free up local resources.

```bash
docker stop <CONTAINER_APP_NAME> && docker rm <CONTAINER_APP_NAME>
```

## Environment parity

To match the Azure Container Apps express runtime locally, verify the following configuration:

| Aspect | Local | Container Apps express |
|--------|-------|-------------|
| Port binding | `-p 8080:3000` | `targetPort: 3000` |
| Env vars | `-e KEY=value` | Container app environment variables |
| Secrets | `-e SECRET=value` | Container app secrets |
| CPU/memory | Docker resource limits | CPU/memory allocation |

### Simulate resource limits

Use the `docker run` command to mimic Azure Container Apps express resource constraints locally.

```bash
docker run -d \
  --cpus="0.5" \
  --memory="1g" \
  -p 8080:3000 \
  <CONTAINER_APP_NAME>:dev
```

## Test with Docker Compose

For apps with local dependencies like databases and caches, use Docker Compose:

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "8080:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/mydb
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

Use the `docker compose up` command to build and start all services defined in your Compose file.

```bash
docker compose up --build
```

> [!NOTE]
> In Azure Container Apps express, you must host your external dependencies, like databases and caches, separately as Azure services or make them accessible through public endpoints. Azure Container Apps express doesn't provide built-in managed databases or caches.

## Push to a container registry

After you verify your image works locally, push it to a registry that Azure Container Apps express can pull from.

### Azure Container Registry

Sign in to your registry on Azure Container Registry (ACR), tag the image, and push it.

```bash
# Log in to ACR
az acr login --name <REGISTRY_NAME>

# Tag for ACR
docker tag <CONTAINER_APP_NAME>:dev <REGISTRY_NAME>.azurecr.io/<CONTAINER_APP_NAME>:v1

# Push
docker push <REGISTRY_NAME>.azurecr.io/<CONTAINER_APP_NAME>:v1
```

### Docker Hub

Tag and push your image to Docker Hub.

```bash
docker tag <CONTAINER_APP_NAME>:dev mydockerhub/<CONTAINER_APP_NAME>:v1
docker push mydockerhub/<CONTAINER_APP_NAME>:v1
```

### GitHub Container Registry

Tag and push your image to GitHub Container Registry.

```bash
docker tag <CONTAINER_APP_NAME>:dev ghcr.io/<ORGANIZATION_NAME>/<CONTAINER_APP_NAME>:v1
docker push ghcr.io/<ORGANIZATION_NAME>/<CONTAINER_APP_NAME>:v1
```

## Test the deployment

After you push the image, deploy it to Azure Container Apps express and check the deployment.

```bash
# Deploy
az containerapp update \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --image <REGISTRY_NAME>.azurecr.io/<CONTAINER_APP_NAME>:v1

# Get the URL
az containerapp show \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --query properties.configuration.ingress.fqdn \
  --output tsv

# Check the endpoint
curl https://<APP_URL>/health
```

## Development tips

The following tips help you streamline your development workflow when building for Azure Container Apps express.

### Use a fast iteration cycle with ACR

For rapid development, use `az acr build` to build images in the cloud without pulling or pushing images locally.

```bash
az acr build \
  --registry <REGISTRY_NAME> \
  --image <CONTAINER_APP_NAME>:latest \
  .
```

Then, update your app:

```bash
az containerapp update \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --image <REGISTRY_NAME>.azurecr.io/<CONTAINER_APP_NAME>:latest
```

### Follow logging best practices

Write structured JSON logs to stdout for easier querying in Log Analytics:

#### [JavaScript](#tab/javascript)

```javascript
// Node.js example
console.log(JSON.stringify({
  level: "info",
  message: "Request handled",
  method: "GET",
  path: "/api/users",
  duration_ms: 23,
  status: 200
}));
```

#### [Python](#tab/python)

```python
import json
import logging

logging.basicConfig(format="%(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info(json.dumps({
    "level": "info",
    "message": "Request handled",
    "method": "GET",
    "path": "/api/users",
    "duration_ms": 23,
    "status": 200,
}))
```

---

### Handle graceful shutdown with SIGTERM

Handle `SIGTERM` for clean shutdowns during rolling updates:

#### [JavaScript](#tab/javascript)

```javascript
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});
```

#### [Python](#tab/python)

```python
# Python example
import signal
import sys

def handle_sigterm(signum, frame):
    print("SIGTERM received, shutting down")
    sys.exit(0)

signal.signal(signal.SIGTERM, handle_sigterm)
```

---

## Related content

- [Deploy to express](deploy-express-cli.md)
