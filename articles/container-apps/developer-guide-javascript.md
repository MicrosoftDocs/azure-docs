---
title: Developer Guide for JavaScript, TypeScript, and Node.js
description: Learn how to build, deploy, and manage your applications using Azure Container Apps. This guide covers everything from setting up your development environment to deploying and scaling your applications.
ms.topic: conceptual
ms.date: 08/01/2024
ms.custom: devx-track-js
#CustomerIntent: As a developer new to Azure, I want to understand how to use Azure Container Apps to build, deploy, and manage my applications efficiently.
---

# Hosting JavaScript and TypeScript Applications on Azure Container Apps: Key Considerations

As a seasoned developer venturing into Azure Container Apps for hosting your JavaScript and TypeScript applications, there are several hosting issues you need to be aware of. This article covers configuration, security, deployment, and troubleshooting specific to the JavaScript/TypeScript ecosystem.

## Configuration

### Environment Variables
Environment variables are crucial for configuring your application. Use a `.env` file to manage these variables locally and ensure they're securely managed in production.

```bash
# .env
NODE_ENV=production
PORT=3000
AZURE_COSMOS_DB_ENDPOINT=https://your-cosmos-db.documents.azure.com:443/
```

### Containers

A well-configured Dockerfile is essential for containerizing your application:
* **Common Setup – Use a Base Dockerfile**: If multiple projects share a common setup, you can create a base Dockerfile that includes these common steps. Each project's Dockerfile can then start with `FROM` this base image and add project-specific configurations.
* **Parameterization – Build Arguments**: You can use build arguments (`ARG`) in your Dockerfile to make it more flexible. This way, you can pass in different values for these arguments when building for development or production.
* **Optimized Base Image – Node.js Variant**: Ensure you're using an appropriate **Node.js base image**. Consider using smaller, optimized images such as the Alpine variants to reduce overhead.
* **Minimal Files – Copy Only Essentials**: Focus on copying only the necessary files into your container.
* **Multi-stage Builds – Separate Build and Runtime**: Use multi-stage builds to create a lean final image by separating the build environment from the runtime environment.
* **Prebuild Artifacts – Compile/Bundling**: Prebuilding your application artifacts (such as compiling TypeScript or bundling JavaScript) before copying them into the runtime stage can further minimize image size, speed up container deployment, and improve cold start performance. Careful ordering of instructions in your Dockerfile will also optimize caching and rebuild times.
* **Development Environments – Docker Compose**: Use Docker Compose for development environments. Docker Compose allows you to define and run multi-container Docker applications, which can be useful for setting up development environments. You can include the build context and Dockerfile in the compose file, allowing you to use different Dockerfiles for different services if necessary.

### Base Dockerfile

This file serves as a common starting point for your Node.js images. You can use it with a FROM directive in your other Dockerfiles.

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

When you pass in values using the --build-arg flag during the build process, those values override the hardcoded default values in your Dockerfile. For example, using:

```bash
docker build \
  --build-arg PORT_DEFAULT=4000 \
  --build-arg ENABLE_DEBUG_DEFAULT=true \
  -t my-custom-image:latest \
  -f Dockerfile.base .
```

In this build, the environment variables PORT and ENABLE_DEBUG are set to 4000 and true, respectively, instead of their default values.

### Development environment with Docker Compose

This configuration uses a dedicated development Dockerfile (Dockerfile.dev) along with volume mounts for live reloading and local source sync.

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

This multi-stage Dockerfile builds your application and produces a lean runtime image. 

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
docker run -e PORT=4000 -e ENABLE_DEBUG=true -p 4000:4000 -p 9229:9229 my-production-image:latest
```

## Deployment
* Continuous Integration/Continuous Deployment (CI/CD) - Set up a CI/CD pipeline using GitHub Actions, Azure DevOps, or another CI/CD tool to automate the deployment process.

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
        run: npm install

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
            --image my-docker-image \
            --environment my-environment \
            --cpu 1 --memory 2Gi \
            --env-vars NODE_ENV=production PORT=3000
    ```

* Docker Registry - Push your Docker images to a container registry like Azure Container Registry (ACR) or Docker Hub.

    ```bash
    # Tag the image
    docker tag my-app:latest myregistry.azurecr.io/my-app:latest

    # Push the image
    docker push myregistry.azurecr.io/my-app:latest
    ```

## Cold starts

Optimize your production build by including only the essential code and dependencies. Use one of the following approaches:

- **Multi-stage Docker builds or bundlers (e.g., Webpack, Rollup):**  
  Compile and bundle only what is needed for production. This minimizes your container size and improves cold start times.

- **Manage your dependencies carefully:**  
  Keep your `node_modules` folder lean by including only the packages required for running the production code.  
  - Don't list development or test dependencies in the `dependencies` section of your `package.json`.  
  - Remove any unused dependencies.  
  - Ensure your `package.json` and lock file remain consistent.

## Security

* Secure Environment Variables
Ensure sensitive information such as database connection strings and API keys are stored securely. Use Azure Key Vault to manage secrets and environment variables securely.

    ```bash
    az keyvault secret set --vault-name myKeyVault --name "CosmosDBConnectionString" --value "<your-connection-string>"
    ```

* HTTPS and Certificates
Ensure your application is served over HTTPS. Azure Container Apps can manage [certificates](certificates-overview.md) for you. Configure your [custom domain](custom-domains-managed-certificates.md) and certificate in the Azure portal.

* Dependency Management
Regularly update your dependencies to avoid security vulnerabilities. Use tools like npm audit to check for vulnerabilities.

    ```bash
    npm audit
    ```


## Error handling

Implement robust error handling in your Node.js application. Use middleware in Express to handle errors gracefully.

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}
```

## Gracefully shutting down

Properly shutting down your application is crucial to ensure that in-flight requests complete and resources are released correctly. This helps prevent data loss and maintains a smooth user experience during deployments or scale-in events. The following example demonstrates one approach using Node.js and Express to handle shutdown signals gracefully. 

```javascript
const express = require('express');
const app = express();
const healthRouter = require('./health');

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

In Azure Container Apps, both console.log and console.error calls are automatically captured and logged. Azure Container Apps captures the standard output (stdout) and standard error (stderr) streams from your application and makes them available in Azure Monitor and Log Analytics.

### Setting Up Logging in Azure Container Apps


To ensure that your logs are properly captured and accessible, you need to configure diagnostic settings for your Azure Container App. Here’s how you can set it up:

1. Enable Diagnostic Settings: Use the Azure CLI to enable diagnostic settings for your Azure Container App.

    ```bash
    az monitor diagnostic-settings create \
    --resource /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Web/containerApps/{container-app-name} \
    --name "containerapp-logs" \
    --workspace {log-analytics-workspace-id} \
    --logs '[{"category": "ContainerAppConsoleLogs","enabled": true}]'
    ```

Replace {subscription-id}, {resource-group}, {container-app-name}, and {log-analytics-workspace-id} with your actual values.

2. Access Logs in Azure portal: You can access the logs in the Azure portal by navigating to your Log Analytics workspace and querying the logs.

### Using Logging Libraries

While `console.log` and `console.error` are automatically captured, using a logging library like **Winston** provides more flexibility and control over your logging. This flexibility allows you to format logs, set log levels, and output logs to multiple destinations (for example, files, external logging services).

Here’s an example using winston:

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

Here's an example of using the logger in your application:

```typescript
import logger from './logger';

logger.info('This is an info message');
logger.error('This is an error message');
```

## Remote debugging

For JavaScript and Node.js developers, remote debugging in Azure Container Apps is made easy with Node’s built-in inspector. Instead of hardcoding debug settings into your Dockerfile’s CMD, you can dynamically enable remote debugging by using a shell script as your container's entrypoint. This script checks an environment variable (for example, `ENABLE_DEBUG`) when the container starts. If the variable is set to `true`, the script launches Node.js in debug mode (using `--inspect` or `--inspect-brk`); otherwise, it starts the application normally.

Implement debugging with the following steps:

1. **Create an Entrypoint Script**  
   Create a file named `entrypoint.sh` at the root of your project with the following content:

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

2. **Update Your Dockerfile**  
   Modify your Dockerfile to copy the `entrypoint.sh` script into the container and set it as the entrypoint. Also, expose the debug port if needed:

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

3. **Triggering Debug Mode**  
   When deploying your Azure Container App, set the environment variable `ENABLE_DEBUG` to `true` to start the container in debug mode. For example, using the Azure CLI:

   ```bash
   az containerapp update --name my-container-app --env-vars ENABLE_DEBUG=true
   ```

This approach offers a flexible solution that allows you to restart the container in debug mode by updating an environment variable at startup. It avoids the need to create a new revision with different CMD settings every time you need to debug your application.

## Maintenance and Performance Considerations

### Environment Variable Changes
Each change to environment variables requires a new deployed revision. It's best to make all the changes to the app's secrets at once, then link the secrets to the revision's environment variables. This minimizes the number of revisions and helps maintain a clean deployment history.

### Resource Allocation

Monitor and adjust the CPU and memory allocation for your containers based on the application's performance and usage patterns. Over-provisioning can lead to unnecessary costs, while under-provisioning can cause performance issues. 

### Dependency Updates

Regularly update your dependencies to benefit from performance improvements and security patches. Use tools like npm-check-updates to automate this process.

```bash
npm install -g npm-check-updates
ncu -u
npm install
```

### Scaling

Configure autoscaling based on the application's load. Azure Container Apps supports horizontal scaling, which can automatically adjust the number of container instances based on CPU or memory usage.

```bash
az containerapp revision set-scale \
  --name my-container-app \
  --resource-group my-resource-group \
  --min-replicas 1 \
  --max-replicas 10 \
  --cpu 80
```

### Monitoring alerts

Set up monitoring and alerts to track the performance and health of your application. Use Azure Monitor to create alerts for specific metrics such as CPU usage, memory usage, and response times.

```bash
az monitor metrics alert create \
  --name "HighCPUUsage" \
  --resource-group my-resource-group \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.ContainerInstance/containerGroups/{container-group} \
  --condition "avg Percentage CPU > 80" \
  --description "Alert when CPU usage is above 80%"
```

## Resource management

Use the [Azure Container Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps) extension for Visual Studio Code to quickly create and deploy containerized apps directly from VS Code:

* Create your first container app
* Edit and deploy your app

## Troubleshooting

* Logging - Enable and configure logging to capture application logs. Use Azure Monitor and Log Analytics to collect and analyze logs.

    ```bash
    az monitor log-analytics workspace create --resource-group my-resource-group --workspace-name myWorkspace
    az monitor diagnostic-settings create --resource my-container-app --workspace myWorkspace --logs '[{"category": "ContainerAppConsoleLogs","enabled": true}]'
    ```

* Debugging - Use [remote debugging](#remote-debugging) tools to connect to your running container. Ensure your Dockerfile exposes the necessary ports for debugging.

    ```yaml
    # Expose the debugging port
    EXPOSE 9229
    ```

* Health Checks - Configure health checks to monitor the health of your application. This ensures that Azure Container Apps can restart your container if it becomes unresponsive.

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

## More resources

* [Development container prebuilds](https://containers.dev/guide/prebuild#tips)
* [Containers in development and production](https://github.com/orgs/devcontainers/discussions/123)