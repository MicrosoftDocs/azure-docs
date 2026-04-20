---
title: Migrate an app from Heroku to Container Apps
description: Deploy a Heroku application to Azure Container Apps with data migration, CI/CD pipelines, custom domains, and scaling configuration.
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 02/12/2026
ms.author: simonjakesch
author: simonjj
ms.reviewer: cshoe
ms.custom: migration-heroku
ms.ai-usage: ai-assisted
---

# Migrate an app from Heroku to Azure Container Apps

This article shows you how to migrate a Heroku application to Azure Container Apps. You export your Heroku configuration, deploy your app, migrate data services, set up CI/CD, and configure custom domains.

For a conceptual overview of Heroku-to-Azure concept mapping, service equivalents, and common pitfalls, see [Heroku to Azure Container Apps migration overview](migrate-heroku-overview.md).

## Learning objectives

In this article, you learn how to:

> [!div class="checklist"]
> - Export Heroku app configuration and deploy it to Azure Container Apps
> - Migrate PostgreSQL and Redis data to Azure managed services
> - Configure a CI/CD pipeline with GitHub Actions
> - Set up custom domains with managed TLS certificates
> - Configure autoscaling rules for your migrated app

## Prerequisites

- **Azure account** with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Azure CLI** (version 2.53.0 or later) with the Container Apps extension installed.

  ```bash
  az extension add --name containerapp --upgrade
  az provider register --namespace Microsoft.App
  ```

- **Heroku CLI** installed and authenticated (used to export configuration and data).
- **Docker** (optional - only needed if you build images locally).
- Your app's **source code in a Git repository**.
- **Familiarity with**: Heroku app management, basic Azure CLI commands, and container concepts.

## 1 - Export your Heroku configuration

Start by exporting your Heroku app's configuration variables. Use this file as a reference when you set environment variables in Azure.

```bash
heroku config -a <HEROKU_APP_NAME> --json > heroku-config.json
```

> [!NOTE]
> Replace `<HEROKU_APP_NAME>` with your Heroku app name. In this article, replace values in angle brackets (`< >`) with your own values.

## 2 - Create Azure resources

Define the shell variables used throughout this procedure. Then create a resource group and Container Apps environment.

```bash
# Define variables used throughout this migration.
# Replace the placeholder values with your own.
RESOURCE_GROUP="<RESOURCE_GROUP>"
LOCATION="eastus"
ENVIRONMENT="<ENVIRONMENT_NAME>"
APP_NAME="<APP_NAME>"
```

Register the required resource providers. Create the resource group and environment.

```bash
# Register resource providers (required once per subscription)
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights

# Create a resource group to hold all migration resources
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Create a Container Apps environment, which automatically
# provisions a Log Analytics workspace for logging
az containerapp env create \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

> [!NOTE]
> Environment creation automatically provisions a Log Analytics workspace. This step can take one to two minutes.

**Verify**: Confirm the environment is running.

```bash
az containerapp env show \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --query "properties.provisioningState" -o tsv
```

The output should display `Succeeded`.

## 3 - Deploy your app

Choose one of the following deployment options based on your app's setup.

### Option A: Deploy from source (no Dockerfile needed)

This command uses Cloud Native Buildpacks to detect your language, build, and deploy
automatically - similar to the Heroku `git push` experience.

```bash
az containerapp up \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --source . \
  --ingress external \
  --target-port 3000
```

> [!NOTE]
> The `--source` flag uses Container Apps Cloud Build, which might not be available in all regions or for all language stacks. If it fails, use Option B instead.

### Option B: Deploy with a Dockerfile (recommended)

If your app doesn't already have a Dockerfile, create one. The following example shows a minimal Node.js Dockerfile that installs production dependencies, copies the application code, and starts the server.

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Build the image through Azure Container Registry (ACR) and deploy to Container Apps. This sequence creates a registry, builds the image in the cloud, registers the registry with Container Apps, and updates the container app to use the new image.

```bash
# Create an Azure Container Registry
az acr create \
  --name <REGISTRY_NAME> \
  --resource-group $RESOURCE_GROUP \
  --sku Basic \
  --admin-enabled true

# Build the image in ACR (no local Docker required)
az acr build \
  --registry <REGISTRY_NAME> \
  --image $APP_NAME:v1 .

# Retrieve the ACR password for registry authentication
ACR_PASSWORD=$(az acr credential show \
  --name <REGISTRY_NAME> \
  --query "passwords[0].value" -o tsv)

# Register ACR with the container app
az containerapp registry set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --server <REGISTRY_NAME>.azurecr.io \
  --username <REGISTRY_NAME> \
  --password $ACR_PASSWORD

# Deploy the image to the container app
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image <REGISTRY_NAME>.azurecr.io/$APP_NAME:v1
```

> [!TIP]
> `az acr build` builds the Docker image in the cloud - you don't need Docker installed locally. This approach is the most reliable deployment path.

**Verify**: Confirm the container app is running.

```bash
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "properties.runningStatus" -o tsv
```

## 4 - Set environment variables

Container Apps uses [secrets](/azure/container-apps/manage-secrets) for sensitive values such as connection strings and API keys. You must set secrets before referencing them in environment variables.

> [!IMPORTANT]
> Set secrets *before* referencing them as environment variables. The order matters – referencing a secret that doesn't exist yet causes an error.

The following commands create secrets in Container Apps and then set environment variables that reference those secrets. Updating secrets alone doesn't restart the app – the `az containerapp update` command creates a new revision that picks up the new values.

```bash
# Set secrets (connection strings, API keys)
az containerapp secret set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secrets "redis-url=<AZURE_REDIS_CONNECTION_STRING>" \
            "api-key=<YOUR_API_KEY>"

# Set environment variables that reference the secrets
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars "REDIS_URL=secretref:redis-url" \
                 "API_KEY=secretref:api-key"
```

> [!TIP]
> Use a script to convert `heroku-config.json` into `az containerapp update` commands for bulk migration of environment variables.

## 5 - Verify the deployment

Retrieve the application URL, then test your app in a browser or by using `curl`. Use the log stream to monitor for startup errors.

```bash
# Get the app URL
az containerapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "properties.configuration.ingress.fqdn" -o tsv

# Stream live console logs to check for errors
az containerapp logs show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --type console \
  --follow
```

## 6 - Migrate data services

### Migrate PostgreSQL

The following sequence exports a backup from Heroku Postgres, creates an Azure Database for PostgreSQL Flexible Server, restores the data, and updates the connection string in your container app.

```bash
# Export a backup from Heroku Postgres
heroku pg:backups:capture -a <HEROKU_APP_NAME>
heroku pg:backups:download -a <HEROKU_APP_NAME>
```

Create the Azure Database for PostgreSQL Flexible Server and database.

```bash
# Create the PostgreSQL Flexible Server instance
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name <PG_SERVER_NAME> \
  --location $LOCATION \
  --admin-user <ADMIN_USER> \
  --admin-password '<STRONG_PASSWORD>' \
  --sku-name Standard_B1ms \
  --tier Burstable

# Create the application database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name <PG_SERVER_NAME> \
  --database-name <DATABASE_NAME>
```

Restore the Heroku backup to the new Azure database and update the connection string.

```bash
# Restore the Heroku backup to Azure PostgreSQL
pg_restore \
  --host=<PG_SERVER_NAME>.postgres.database.azure.com \
  --port=5432 \
  --username=<ADMIN_USER> \
  --dbname=<DATABASE_NAME> \
  --no-owner --no-acl \
  latest.dump

# Update the Container App with the new connection string
az containerapp secret set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secrets "database-url=postgresql://<ADMIN_USER>:<PASSWORD>@<PG_SERVER_NAME>.postgres.database.azure.com:5432/<DATABASE_NAME>?sslmode=require"
```

**Verify**: Connect to the Azure database and confirm your tables and row counts match the Heroku source.

### Migrate Redis

Create an Azure Cache for Redis instance and connect it to your container app. The following commands provision the cache, retrieve the access key, and set the connection string as a secret.

```bash
# Create Azure Cache for Redis (provisioning takes 10–20 minutes)
az redis create \
  --resource-group $RESOURCE_GROUP \
  --name <REDIS_NAME> \
  --location $LOCATION \
  --sku Basic \
  --vm-size c0

# Retrieve the primary access key
az redis list-keys \
  --resource-group $RESOURCE_GROUP \
  --name <REDIS_NAME> \
  --query "primaryKey" -o tsv

# Store the connection string as a Container App secret
az containerapp secret set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secrets "redis-url=rediss://:<ACCESS_KEY>@<REDIS_NAME>.redis.cache.windows.net:6380"

# Set the environment variable referencing the secret
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars "REDIS_URL=secretref:redis-url"
```

> [!NOTE]
> Azure Cache for Redis provisioning can take 10–20 minutes. Redis is typically used as a cache, so unless you use it as a primary data store, there's no data to migrate. Point your app at the new instance.

**Verify**: Confirm the Redis connection by checking your app's health endpoint or logs after the update.

### Other add-ons

For other Heroku add-ons, see the [Service equivalents](migrate-heroku-overview.md#service-equivalents) table in the migration overview.

For each add-on: provision the Azure equivalent service, update the connection details in your Container App environment variables, validate the integration, and then remove the Heroku add-on.

## 7 - Set up CI/CD

### GitHub Actions

Create a GitHub Actions workflow that builds your Docker image, pushes it to ACR, and deploys it to Container Apps on every push to the `main` branch. Save the following file as `.github/workflows/deploy.yml` in your repository.

This workflow does the following steps:

1. Checks out your source code.
1. Signs in to Azure by using a service principal stored as a GitHub secret.
1. Builds and pushes a Docker image to ACR, tagged with the Git commit SHA.
1. Updates the container app to use the new image, which triggers a new revision.

```yaml
name: Deploy to Azure Container Apps

on:
  push:
    branches: [main]

# Environment variables shared across all jobs.
# Update these values to match your Azure resource names.
env:
  AZURE_CONTAINER_REGISTRY: <REGISTRY_NAME>.azurecr.io
  IMAGE_NAME: <APP_NAME>
  RESOURCE_GROUP: <RESOURCE_GROUP>
  CONTAINER_APP_NAME: <APP_NAME>

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # Check out the repository source code
      - uses: actions/checkout@v4

      # Authenticate to Azure using the service principal credentials
      - uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      # Build the Docker image and push it to ACR
      - name: Build and push image
        run: |
          az acr login --name <REGISTRY_NAME>
          docker build -t ${{ env.AZURE_CONTAINER_REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} .
          docker push ${{ env.AZURE_CONTAINER_REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

      # Deploy the new image to the container app
      - name: Deploy to Container Apps
        run: |
          az containerapp update \
            --name ${{ env.CONTAINER_APP_NAME }} \
            --resource-group ${{ env.RESOURCE_GROUP }} \
            --image ${{ env.AZURE_CONTAINER_REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
```

**Create the service principal**: Run the following command to create a service principal with `Contributor` access scoped to your resource group. Store the JSON output as the `AZURE_CREDENTIALS` secret in your GitHub repository settings.

```bash
az ad sp create-for-rbac \
  --name "github-deploy" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/$RESOURCE_GROUP \
  --json-auth
```

### Azure DevOps

Use the [Azure Container Apps Deploy task](/azure/container-apps/azure-pipelines) in your Azure DevOps pipeline. The workflow is similar: build the image, push to ACR, and update the container app.

## 8 - Configure custom domains and TLS

The following commands add a custom domain to your container app, retrieve the DNS verification records, and bind a free managed TLS certificate. You need to add DNS records at your domain provider between steps 2 and 4.

```bash
# Add your custom domain to the container app
az containerapp hostname add \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname <YOUR_DOMAIN>

# List hostnames to get the required DNS verification records
az containerapp hostname list \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  -o table
```

At your DNS provider, add the following records:

- **TXT record**: For domain verification (value shown in the previous command output).
- **CNAME record**: Point `<YOUR_DOMAIN>` to `<APP_NAME>.<REGION>.azurecontainerapps.io`.

After DNS propagation, bind the managed certificate.

```bash
# Bind a free managed TLS certificate (auto-renews)
az containerapp hostname bind \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname <YOUR_DOMAIN> \
  --environment $ENVIRONMENT \
  --validation-method CNAME
```

**Verify**: Confirm the certificate is bound.

```bash
az containerapp hostname list \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  -o table
```

Managed certificates are free and autorenew, equivalent to Heroku's Automated Certificate Management.

## 9 - Configure scaling

Set up autoscaling rules to replace Heroku's manual dyno scaling. The following command configures HTTP-based autoscaling that scales between 0 and 10 replicas based on concurrent request load, with a new replica added whenever any single instance exceeds 50 concurrent requests.

```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --min-replicas 0 \
  --max-replicas 10 \
  --scale-rule-name http-rule \
  --scale-rule-type http \
  --scale-rule-http-concurrency 50
```

For worker processes, deploy a separate container app with queue-based scaling. The following command creates a worker container app that scales from 0 to 5 replicas based on the number of messages in an Azure Storage queue.

```bash
az containerapp create \
  --name <APP_NAME>-worker \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image <REGISTRY_NAME>.azurecr.io/<APP_NAME>-worker:latest \
  --min-replicas 0 \
  --max-replicas 5 \
  --scale-rule-name queue-rule \
  --scale-rule-type azure-queue \
  --scale-rule-metadata "queueName=jobs" "queueLength=10" \
  --scale-rule-auth "connection=queue-connection-string"
```

> [!TIP]
> For production apps that need to respond immediately, set `--min-replicas 1`. For development and staging environments, use `--min-replicas 0` to take advantage of scale-to-zero and eliminate idle costs.

## Troubleshooting

| Problem | Cause | Resolution |
| --- | --- | --- |
| App doesn't respond to HTTP requests after deployment | Container Apps expects your app to listen on the port specified by the `PORT` environment variable (default `80`). Your app might be listening on a different port. | Set `--target-port` to the port your app listens on when creating or updating the container app. |
| `az containerapp up --source` fails with builder errors | Cloud Build isn't available in all regions or for all language stacks. | Use the Dockerfile-based approach: build with `az acr build` and deploy the image. See [Option B: Deploy with a Dockerfile](#option-b-deploy-with-a-dockerfile-recommended). |
| Environment variables referencing secrets are empty | Secrets must exist before you reference them in environment variables. | Run `az containerapp secret set` first, then `az containerapp update` to set the env vars. See [Step 4](#4---set-environment-variables). |
| Azure service provisioning takes longer than expected | Azure managed services have longer provisioning times than Heroku add-ons. | Azure Cache for Redis: 10–20 minutes. PostgreSQL Flexible Server: 5–10 minutes. Provision services in parallel while deploying your app. |
| Files written at runtime disappear after restart | Container Apps uses an ephemeral filesystem, similar to Heroku. | [Mount an Azure Files share](/azure/container-apps/storage-mounts) for persistent storage. |

## Clean up resources

If you created resources specifically for this migration walkthrough, delete the resource group to remove all associated resources and stop incurring charges.

```bash
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

> [!CAUTION]
> This command deletes the resource group and all resources within it, including databases, container registries, and container apps. This action can't be undone.

## Related content

- [Heroku to Azure Container Apps migration overview](migrate-heroku-overview.md)
- [Set up Azure Application Insights](/azure/azure-monitor/app/app-insights-overview) for monitoring and alerting
- [Add Azure Front Door](/azure/frontdoor/front-door-overview) for CDN, WAF, and global load balancing
- [Use Dapr with Azure Container Apps](/azure/container-apps/dapr-overview) for microservice communication
- [Azure Container Apps documentation](/azure/container-apps/)
