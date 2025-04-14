---
title: JavaScript on Azure Container Apps overview
description: Learn about the tools and resources needed to run JavaScript applications on Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-js
ms.topic: conceptual
ms.date: 02/14/2025
ms.author: cshoe
#CustomerIntent: As a developer new to Azure, I want to understand how to use Azure Container Apps to build, deploy, and manage my applications efficiently.
---

# JavaScript on Azure Container Apps overview

Azure Container Apps can run any containerized JavaScript application in the cloud while giving flexible options for how you deploy your applications.

## Configuration

Azure Container Apps enable you for streamlining the deployment of your JavaScript applications through effective containerization including setting up environment variables, designing efficient Dockerfiles, and organizing your application's build process. 

### Environment Variables
Environment variables are crucial for configuring your application. Use a `.env` file to manage these variables locally and ensure they're securely managed in production with a service like [Azure Key Vault](/azure/key-vault/).

The following example shows you how to create variables for your application.

```bash
# .env
NODE_ENV=production
PORT=3000
AZURE_COSMOS_DB_ENDPOINT=https://<YOUR_COSMOSDB_RESOURCE_NAME>.documents.azure.com:443/
```

### Containers

A well-configured Dockerfile is essential for containerizing your application:
* **Use a base Dockerfile**: If multiple projects share a common setup, you can create a base Dockerfile that includes these common steps. Each project's Dockerfile can then start with `FROM` this base image and add project-specific configurations.

* **Parameterization of build arguments**: You can use build arguments (`ARG`) in your Dockerfile to make it more flexible. This way, you can pass in different values for these arguments when building for development, staging or production.

* **Optimized Node.js base image**: Ensure you're using an appropriate **Node.js base image**. Consider using smaller, optimized images such as the Alpine variants to reduce overhead.
* **Minimal Files – Copy Only Essentials**: Focus on copying only the necessary files into your container. Create a `.dockerignore` file to ensure development files aren't copied in such as `.env` and `node_modules`. This file helps speed up builds in cases where developers copied in unnecessary files.
* **Separate build and runtime with multi-stage builds**: Use multi-stage builds to create a lean final image by separating the build environment from the runtime environment.

* **Prebuild artifacts by compiling and bundling**: Prebuilding your application artifacts (such as compiling TypeScript or bundling JavaScript) before copying them into the runtime stage can minimize image size, speed up container deployment, and improve cold start performance. Careful ordering of instructions in your Dockerfile also optimizes caching and rebuild times.
* **Docker Compose for development environments**: Docker Compose allows you to define and run multi-container Docker applications. This multi-container approach is useful for setting up development environments. You can include the build context and Dockerfile in the compose file. This level of encapsulation allows you to use different Dockerfiles for different services when necessary.

### Base Dockerfile

This file serves as a common starting point for your Node.js images. You can use it with a `FROM` directive in Dockerfiles that reference this base image. Use either a version number or a commit to support the recent and secure version of the image. 

```yaml
# Dockerfile.base

FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Define build arguments with default values
ARG PORT_DEFAULT=3000
ARG ENABLE_DEBUG_DEFAULT=false

# Set environment variables using the build arguments
ENV PORT=${PORT_DEFAULT}
ENV ENABLE_DEBUG=${ENABLE_DEBUG_DEFAULT}

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install

# Expose the application and debugging ports
EXPOSE $PORT
EXPOSE 9229

# This image focuses on common steps; project-specific Dockerfiles can extend this.
```

When you pass in values using the `--build-arg` flag during the build process, the passed in values override the hardcoded default values in your Dockerfile.

For example:

```bash
docker build \
  --build-arg PORT_DEFAULT=4000 \
  --build-arg ENABLE_DEBUG_DEFAULT=true \
  --tag <IMAGE>:<TAG> \
  --file Dockerfile.base .
```

In this example, the environment variables `PORT` and `ENABLE_DEBUG` are set to explicit values, instead of their default values.

Container image tagging conventions such as the use of `latest` are a convention. Learn more about [recommendations for tagging and versioning container images](/azure/container-registry/container-registry-image-tag-version).

### Set up development environment with Docker Compose

The following example configuration uses a dedicated development Dockerfile (*Dockerfile.dev*) along with volume mounts for live reloading and local source sync.

```yaml
version: "3.8"
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.base
      args:
        PORT_DEFAULT: ${PORT:-3000}
        ENABLE_DEBUG_DEFAULT: ${ENABLE_DEBUG:-false}
    ports:
      - "${PORT:-3000}:3000"
      - "9229:9229"  # Expose debug port if needed
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    environment:
      - NODE_ENV=development
      - PORT=${PORT:-3000}
      - ENABLE_DEBUG=${ENABLE_DEBUG:-false}
```

To start Docker Compose with custom values, you can export the environment variables on the command line. For example:

```bash
PORT=4000 ENABLE_DEBUG=true docker compose up
```

### Production Dockerfile

This multi-stage Dockerfile builds your application and produces a lean runtime image. Make sure to have your `.dockerignore` file already in your source code so that the `COPY . .` command doesn't copy in any files specific to the development environment that you don't need in production. 

```yaml
# Stage 1: Builder
FROM node:22 AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Build your project (e.g., compile TypeScript or bundle JavaScript)
RUN npm run build

# Stage 2: Runtime
FROM my-base-image:latest AS runtime

WORKDIR /usr/src/app

# Copy only the compiled output and essential files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the entrypoint script for remote debugging
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# Expose the application port (using the PORT environment variable) and the debug port (9229)
EXPOSE $PORT
EXPOSE 9229

# Use the entrypoint script to conditionally enable debugging
ENTRYPOINT ["sh", "/usr/src/app/entrypoint.sh"]
```
The entrypoint script allows you to connect to your container app for [remote debugging](#remote-debugging). 

To run a container from the built production image with custom environment variables, run:

```bash
docker run \
  --env PORT=4000 \
  --env ENABLE_DEBUG=true \
  --publish 4000:4000 \
  --publish 9229:9229 \
  <IMAGE>:<TAG>
```

For production builds, make sure you use the correct version tag, which may not be `latest`. Container image tagging conventions such as the use of `latest` are a convention. Learn more about [recommendations for tagging and versioning container images](/azure/container-registry/container-registry-image-tag-version).


## Deployment

To support continuous integration/continuous deployment (CI/CD), set up a CI/CD pipeline using GitHub Actions, Azure DevOps, or another CI/CD tool to automate the deployment process.

```yaml
# .github/workflows/deploy.yml
name: Deploy to Azure

on:
push:
    branches:
    - main

jobs:
build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
          node-version: '22'

    - name: Install dependencies
      run: npm ci

    - name: Build the app
      run: npm run build

    - name: Log in to Azure
      uses: azure/login@v2
      with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Deploy to Azure Container Apps
      run: |
          az containerapp up \
          --name my-container-app \
          --resource-group my-resource-group \
          --image my-image:my_tag \
          --environment my-environment \
          --cpu 1 --memory 2Gi \
          --env-vars NODE_ENV=production PORT=3000
```

When you use Docker Registry, sign into your registry then push your Docker images to a container registry like Azure Container Registry (ACR) or Docker Hub.

```bash
# Tag the image
docker tag \
  <IMAGE>:<TAG> \
  <AZURE_REGISTRY>.azurecr.io/<IMAGE>:<TAG>

# Push the image
docker push <AZURE_REGISTRY>.azurecr.io/<IMAGE>:<TAG>
```

## Cold starts

Optimize your production build by including only the essential code and dependencies. To ensure your payload is as lean as possible, use one of the following approaches:

- **Multi-stage Docker builds or bundlers**: Use build and bundling tools like Webpack or Rollup to help you create the smallest payload possible for your container. When you compile and bundle only what is needed for production, you help minimize your container size and aid in improving cold start times.

- **Manage dependencies carefully:** Keep your `node_modules` folder lean by including only the packages required for running production code. Don't list development or test dependencies in the `dependencies` section of your `package.json`.  Remove any unused dependencies and ensure your `package.json` and lock file remain consistent.

## Security

Security considerations for JavaScript developers using Azure Container Apps includes securing environment variables (such as using Azure Key Vault), ensuring HTTPS with proper certificate management, maintaining up-to-date dependencies with regular audits, and implementing robust logging and monitoring to quickly detect and respond to threats.

### Secure environment variables

Ensure sensitive information such as database connection strings and API keys are stored securely. Use Azure Key Vault to manage secrets and environment variables securely. 

Before running this command, make sure to replace the placeholders surrounded by `<>` with your values.

```azurecli
az keyvault secret set \
  --vault-name <KEY_VAULT_APP> \
  --name "<SECRET_NAME>" \
  --value "<CONNECTION_STRING>"
```

### HTTPS and certificates

Ensure your application is served over HTTPS. Azure Container Apps can manage [certificates](certificates-overview.md) for you. Configure your [custom domain](custom-domains-managed-certificates.md) and certificate in the Azure portal.

### Dependency Management

Regularly update your dependencies to avoid security vulnerabilities. Use tools like `npm audit` to check for vulnerabilities.

```bash
npm audit
```


## Error handling

Implement robust error handling in your Node.js application. Use middleware in Express or Fastify to handle errors gracefully.

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}
```

## Graceful shut downs

Properly shutting down your application is crucial to ensure that in-flight requests complete and resources are released correctly. This helps prevent data loss and maintains a smooth user experience during deployments or scale-in events. The following example demonstrates one approach using Node.js and Express to handle shutdown signals gracefully. 

```typescript
import express from 'express';
import healthRouter from './health.js';

const app = express();

app.use(healthRouter);

const server = app.listen(process.env.PORT || 3000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  // Force close after 30s
  setTimeout(() => {
    console.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 30000);
});
```

## Logging

In Azure Container Apps, both `console.log` and `console.error` calls are automatically captured and logged. Azure Container Apps captures the standard output (`stdout`) and standard error (`stderr`) streams from your application and makes them available in Azure Monitor and Log Analytics.

### Setting Up Logging in Azure Container Apps


To ensure that your logs are properly captured and accessible, you need to configure diagnostic settings for your Azure Container App. Setup is a two-step process.

1. Enable Diagnostic Settings: Use the Azure CLI to enable diagnostic settings for your Azure Container App.

    Before running this command, make sure to replace the placeholders surrounded by `<>` with your values.
 
    ```azurecli
    az monitor diagnostic-settings create \
    --resource /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Web/containerApps/<CONTAINER_APP_NAME> \
    --name "containerapp-logs" \
    --workspace <LOG_ANALYTICS_WORKSPACE_ID> \
    --logs '[{"category": "ContainerAppConsoleLogs","enabled": true}]'
    ```


1. Access logs in the portal by going to your Log Analytics workspace and querying the logs.

### Using Logging Libraries

While `console.log` and `console.error` are automatically captured, using a logging library like Winston provides more flexibility and control over your logging. This flexibility allows you to format logs, set log levels, and output logs to multiple destinations like files or external logging services.

The following example demonstrates how to configure Winston to store high-fidelity logs.

```typescript
// src/logger.ts
import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
  ]
});

export default logger;
```

To use the logger, use the following syntax in your application:

```typescript
import logger from './logger';

logger.info('This is an info message');
logger.error('This is an error message');
```

## Remote debugging

To enable remote debugging, you can use Node’s built-in inspector. Instead of hardcoding debug settings into your Dockerfile’s `CMD`, you can dynamically enable remote debugging by using a shell script as your container's entrypoint. 

The following script checks an environment variable (for example, `ENABLE_DEBUG`) when the container starts. If the variable is set to `true`, the script launches Node.js in debug mode (using `--inspect` or `--inspect-brk`). Otherwise, the container starts the application normally.

You can implement remote debugging with the following steps:

1. Create an entry point script in a file named `entrypoint.sh` at the root of your project with the following content:

   ```bash
   #!/bin/sh
   # If ENABLE_DEBUG is set to "true", start Node with debugging enabled
   if [ "$ENABLE_DEBUG" = "true" ]; then
     echo "Debug mode enabled: starting Node with inspector"
     exec node --inspect=0.0.0.0:9229 dist/index.js
   else
     echo "Starting Node without debug mode"
     exec node dist/index.js
   fi
   ```

1. Modify your Dockerfile to copy the `entrypoint.sh` script into the container and set it as the entry point. Also, expose the debug port if needed:

    ```yaml
    # Copy the entrypoint script to the container
    COPY entrypoint.sh /usr/src/app/entrypoint.sh
    
    # Ensure the script is executable
    RUN chmod +x /usr/src/app/entrypoint.sh
    
    # Expose the debugging port (if using debug mode)
    EXPOSE 9229
    
    # Set the shell script as the container’s entrypoint
    ENTRYPOINT ["sh", "/usr/src/app/entrypoint.sh"]
    ```

1. Trigger debug mode by setting the environment variable `ENABLE_DEBUG` to `true`. For example, using the Azure CLI:

   ```azurecli
   az containerapp update \
     --name <CONTAINER_APP> \
     --env-vars ENABLE_DEBUG=true
   ```

Before running this command, make sure to replace the placeholders surrounded by `<>` with your values.

This approach offers a flexible solution that allows you to restart the container in debug mode by updating an environment variable at startup. It avoids the need to create a new revision with different `CMD` settings every time you need to debug your application.

## Maintenance and performance considerations

To maintain and optimize your application's performance over time, ensure you efficiently manage environment variable changes, monitor your resources, keep your dependencies up-to-date, configure scaling correctly, and set up monitoring alerts.

### Environment variable changes

Since each change to environment variables requires a new deployed revision, make all changes to the app's secrets at once. When changes are complete, link the secrets to the revision's environment variables. This approach minimizes the number of revisions and helps maintain a clean deployment history.

### Resource allocation

Monitor and adjust CPU and memory allocation for your containers based on the application's performance and usage patterns. Over-provisioning can lead to unnecessary costs, while under-provisioning can cause performance issues. 

### Dependency updates

Regularly update your dependencies to benefit from performance improvements and security patches. Use tools like `npm-check-updates` to automate this process.

```bash
npm install -g npm-check-updates
ncu -u
npm install
```

### Scaling

Configure autoscaling based on the application's load. Azure Container Apps supports horizontal scaling, which automatically adjusts the number of container instances based on CPU or memory usage.

The following example demonstrates how to set a CPU-based scale rule. Before running this command, make sure to replace the placeholders surrounded by `<>` with your values.

```azurecli
az containerapp revision set-scale \
  --name <CONTAINER_APP> \
  --resource-group <RESOURCE_GROUP> \
  --min-replicas 1 \
  --max-replicas 10 \
  --cpu 80
```

### Monitoring alerts

Set up monitoring and alerts to track the performance and health of your application. Use Azure Monitor to create alerts for specific metrics such as CPU usage, memory usage, and response times.

Before running this command, make sure to replace the placeholders surrounded by `<>` with your values.

```azurecli
az monitor metrics alert create \
  --name "HighCPUUsage" \
  --resource-group <RESOURCE_GROUP> \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerInstance/containerGroups/<CONTAINER_GROUP> \
  --condition "avg Percentage CPU > 80" \
  --description "Alert when CPU usage is above 80%"
```

## Resource management

Use the [Azure Container Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps) extension for Visual Studio Code to quickly create, edit, and deploy containerized apps directly from Visual Studio Code.

## Troubleshooting

When your application runs into run time issues on Azure Container Apps, you can use logging, remote debugging, and health check alerts to find and resolve the issue. 

### Logging

Enable and configure logging to capture application logs. Use Azure Monitor and Log Analytics to collect and analyze logs. Before running these commands, make sure to replace the placeholders surrounded by `<>` with your values.

1. Create a new workspace.

    ```azurecli
    az monitor log-analytics workspace create \
        --resource-group <RESOURCE_GROUP> \
        --workspace-name <WORKSPACE_NAME>
    ```

1. Then create a new workspace setting.

    ```azurecli            
    az monitor diagnostic-settings create \
        --resource <CONTAINER_APP> \
        --workspace <WORKSPACE_NAME> \
        --logs '[{"category": "ContainerAppConsoleLogs","enabled": true}]'
    ```

### Debugging

You use [remote debugging](#remote-debugging) tools to connect to the running container. Ensure your Dockerfile exposes the necessary ports for debugging.

```yaml
# Expose the debugging port
EXPOSE 9229
```

### Health checks

Configure health checks to monitor the health of your application. This feature ensures that Azure Container Apps can restart your container if it becomes unresponsive.

```yaml
# Azure Container Apps YAML configuration
properties:
configuration:
    livenessProbe:
    httpGet:
        path: /health
        port: 3000
    initialDelaySeconds: 30
    periodSeconds: 10
```

## Related content

* [Development container prebuilds](https://containers.dev/guide/prebuild#tips)
* [Containers in development and production](https://github.com/orgs/devcontainers/discussions/123)