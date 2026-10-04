---
title: Containerize Java Web Apps and Migrate to Azure Container Apps
description: Learn how to containerize an existing Java web application and migrate it to Azure Container Apps.
author: deepganguly
ms.author: deepganguly
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 09/07/2026
ms.update-cycle: 365-days
ms.custom:
  - devx-track-java
  - devx-track-javaee
  - migration-java
  - devx-track-azurecli
  - devx-track-extended-java
# Customer intent: "As a software developer, I want to containerize an existing Java web application and deploy it to Azure Container Apps so that I can modernize the application without managing container orchestration infrastructure."
---
# Containerize Java web apps and migrate to Azure Container Apps

In this tutorial, you containerize an existing Java web application and migrate it to [Azure Container Apps](/azure/container-apps/overview). You create a Dockerfile, build the image in Azure Container Registry, and deploy the image to a serverless container platform that provides managed ingress, revisions, and scaling.

This article uses an Apache Tomcat application packaged as a web application archive (WAR). Adapt the build and startup steps if your application uses Spring Boot, Quarkus, WebSphere Liberty, JBoss EAP, or another Java runtime.

> [!IMPORTANT]
> App Containerization Tool doesn't support Azure Container Apps as a deployment target. To complete this tutorial, you need access to the application source code or a deployable application artifact. This tutorial doesn't use the App Containerization Tool.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Evaluate the application for a container environment.
> * Externalize configuration and persistent state.
> * Create and test a Dockerfile.
> * Build and store the image in Azure Container Registry.
> * Deploy the image to Azure Container Apps by using managed identity.
> * Validate and monitor the migrated application.

## Prerequisites

Before you begin, ensure that you have:

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Permission to create a resource group, an Azure container registry, a user-assigned managed identity, a role assignment, a Container Apps environment, and a container app.
- The [Azure CLI](/cli/azure/install-azure-cli), including the Azure Container Apps extension.
- Docker Desktop or another Docker-compatible container runtime for local image testing.
- The application source code or a deployable Java artifact, such as a WAR or JAR file.
- The Java build tools required by the application, such as Maven or Gradle.

This tutorial requires that your application:

- Runs in a Linux container.
- Listens for HTTP requests on port `8080`.
- Is packaged as a WAR file in the `target` directory.

## Assess the application

Before you create a container image, inventory the application's runtime, operating system, configuration, storage, networking, and external service dependencies. Use [Azure Migrate application and code assessment for Java](./appcat/java.md) to identify changes that help prepare the application for Azure Container Apps.

Review the following areas:

| Area | Migration consideration |
| --- | --- |
| Java and application server | Choose a supported base image that's compatible with the application's Java bytecode, Jakarta EE or Java EE APIs, and application server version. For example, applications that use `javax.*` APIs generally require Tomcat 9 or earlier unless you migrate them to `jakarta.*`. |
| Configuration | Move environment-specific settings out of property files packaged in the application. Supply nonsecret values through environment variables and sensitive values through Container Apps secrets or Azure Key Vault references. |
| Session state | Don't depend on in-memory session state when the application has multiple replicas. Use an external session store or enable sticky sessions only when necessary. |
| File system | Treat the container file system as ephemeral. Store durable data in a database, object storage, or an Azure Files mount. |
| Logging | Write application logs to `stdout` and errors to `stderr` so that Container Apps can collect them. |
| Health | Provide startup, readiness, and liveness endpoints appropriate for the application. |
| Shutdown | Ensure the application handles `SIGTERM` and completes in-flight work before it exits. |
| Networking | Identify outbound endpoints, DNS requirements, certificates, private network dependencies, and the application's listening port. |

For Java-specific platform considerations, see [Java on Azure Container Apps](/azure/container-apps/java-overview).

## Prepare the application

Before you build the image, make the application portable:

1. Replace environment-specific values with environment variables or another external configuration provider.
1. Move credentials, connection strings, and keys out of the source code and packaged configuration.
1. Move durable file writes to an external data store. If the application requires a shared file system, plan an [Azure Files storage mount](/azure/container-apps/storage-mounts).
1. Configure application logging for the console.
1. Confirm that the application listens on all network interfaces, not only `localhost`.
1. Build and test the application outside a container.

For a Maven application, create the deployable artifact from the project root:

```bash
mvn clean package
```

Confirm that the build creates a WAR file in the `target` directory.

## Create the container files

Create a file named `Dockerfile` in the project root. The following example deploys a WAR file to Apache Tomcat 9:

```dockerfile
FROM tomcat:9-jre17-temurin

RUN rm -rf /usr/local/tomcat/webapps/*
COPY target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
```

Select a base image that matches the application's requirements. In production, pin the base image to a specific version or digest and establish a process to rebuild the application when security updates become available.

Create a `.dockerignore` file to keep local and repository files out of the build context:

```dockerignore
.git
.github
.idea
.vscode
*.log
```

Don't exclude the `target` directory because the Dockerfile copies the WAR file from that directory.

## Build and test the image locally

Build the container image from the project root:

```console
docker build --tag java-web-app:local .
```

Run the image and map local port `8080` to the container port:

```console
docker run --rm --publish 8080:8080 java-web-app:local
```

Open `http://localhost:8080` and test the application's critical paths. Verify that:

- The application starts without manual intervention.
- You can supply configuration values through environment variables.
- Logs appear in the container output.
- The application doesn't rely on files created in a previous container instance.
- The process exits cleanly when you stop the container.

## Prepare Azure resources

Sign in to Azure and install or update the Container Apps extension:

```azurecli
az login
az extension add --name containerapp --upgrade
```

Register the resource providers used by Azure Container Apps:

```azurecli
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights
```

Set variables for the resources. Resource names must meet the naming requirements for each Azure service.

```azurecli
RESOURCE_GROUP=<resource-group-name>
LOCATION=<azure-region>
ACR_NAME=<unique-registry-name>
ENVIRONMENT_NAME=<container-apps-environment-name>
CONTAINER_APP_NAME=<container-app-name>
IDENTITY_NAME=<managed-identity-name>
IMAGE_NAME=java-web-app
IMAGE_TAG=v1
```

Create a resource group and container registry:

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

az acr create \
  --name $ACR_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku Basic
```

Create a Container Apps environment:

```azurecli
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

## Build the image in Azure Container Registry

From the directory that contains the Dockerfile and application artifact, submit the build to Azure Container Registry:

```azurecli
az acr build \
  --registry $ACR_NAME \
  --image "$IMAGE_NAME:$IMAGE_TAG" \
  .
```

Azure Container Registry builds the image and stores it as:

```text
<registry-name>.azurecr.io/java-web-app:v1
```

Use a unique image tag for every build. Avoid mutable tags such as `latest` because unique tags make deployments and rollbacks easier to identify.

## Configure registry access with managed identity

Create a user-assigned managed identity:

```azurecli
az identity create \
  --name $IDENTITY_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

Get the resource IDs and principal ID needed for deployment and role assignment:

```azurecli
IDENTITY_ID=$(az identity show \
  --name $IDENTITY_NAME \
  --resource-group $RESOURCE_GROUP \
  --query id \
  --output tsv)

IDENTITY_PRINCIPAL_ID=$(az identity show \
  --name $IDENTITY_NAME \
  --resource-group $RESOURCE_GROUP \
  --query principalId \
  --output tsv)

ACR_ID=$(az acr show \
  --name $ACR_NAME \
  --resource-group $RESOURCE_GROUP \
  --query id \
  --output tsv)
```

Assign the **AcrPull** role to the managed identity at the registry scope:

```azurecli
az role assignment create \
  --assignee-object-id $IDENTITY_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal \
  --role AcrPull \
  --scope $ACR_ID
```

For more information, see [Azure Container Apps image pull from Azure Container Registry with managed identity](/azure/container-apps/managed-identity-image-pull).

## Deploy the container app

Create the container app with external ingress and the user-assigned identity:

```azurecli
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image "$ACR_NAME.azurecr.io/$IMAGE_NAME:$IMAGE_TAG" \
  --user-assigned $IDENTITY_ID \
  --registry-server "$ACR_NAME.azurecr.io" \
  --registry-identity $IDENTITY_ID \
  --ingress external \
  --target-port 8080 \
  --cpu 1.0 \
  --memory 2.0Gi \
  --min-replicas 1 \
  --max-replicas 3
```

Change the ingress setting, target port, CPU, memory, and replica range to match the application's requirements. For an application that must only be reachable from within the Container Apps environment, use internal ingress instead of external ingress.

Role assignments can take several minutes to propagate. If the first revision reports an image pull authorization failure immediately after you create the role assignment, wait for propagation and create a new revision.

## Configure application settings and secrets

Set nonsecret configuration as environment variables.

```azurecli
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars "APP_ENV=production"
```

Create a secret and expose it to the application through a secret-referencing environment variable.  

```azurecli
az containerapp secret set \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secrets "database-password=<secret-value>"

az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars "DB_PASSWORD=secretref:database-password"
```

Don't place real secret values in shell history, source control, or deployment logs. For production workloads, consider [Azure Key Vault secret references](/azure/container-apps/manage-secrets#reference-secret-from-key-vault) and use managed identity to access the vault.

## Configure health probes and storage

Add startup, readiness, and liveness probes that reflect the application's behavior. A slow-starting Java application might require a startup probe with enough time to complete initialization before liveness checks begin. For more information, see [Health probes in Azure Container Apps](/azure/container-apps/health-probes).

If the application requires shared persistent files, add an Azure Files storage definition to the Container Apps environment and mount the volume in a new revision. Don't use the container file system for durable application data. For more information, see [Use storage mounts in Azure Container Apps](/azure/container-apps/storage-mounts).

## Validate the migration

Get the application's fully qualified domain name:

```azurecli
az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

Open the HTTPS endpoint and validate:

- Application startup and health.
- Authentication and authorization flows.
- Database and external service connectivity.
- Session behavior across multiple replicas.
- File upload and download behavior.
- Graceful shutdown during a revision change.
- Scaling behavior under representative load.

Don't redirect production traffic until the containerized application passes your functional, performance, security, and operational acceptance criteria.

## Monitor the application

View the application console logs:

```azurecli
az containerapp logs show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --follow
```

Azure Container Apps can send console and system logs to Log Analytics. For more information, see [Monitor logs in Azure Container Apps with Log Analytics](/azure/container-apps/log-monitoring).

Configure alerts for application availability, HTTP errors, replica restarts, resource utilization, and dependency failures. If you instrument the application with Application Insights or OpenTelemetry, verify that telemetry and correlation data reach the intended monitoring resource.

## Update the application

Build the updated application with a new image tag, submit it to Azure Container Registry, and update the container app:

```azurecli
IMAGE_TAG=v2

az acr build \
  --registry $ACR_NAME \
  --image "$IMAGE_NAME:$IMAGE_TAG" \
  .

az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image "$ACR_NAME.azurecr.io/$IMAGE_NAME:$IMAGE_TAG"
```

Updating the image creates a new revision. You can use multiple revision mode and traffic splitting for gradual migration or rollback scenarios. For more information, see [Traffic splitting in Azure Container Apps](/azure/container-apps/traffic-splitting).

## Clean up resources

If you no longer need the tutorial resources, delete the resource group:

```azurecli
az group delete \
  --name $RESOURCE_GROUP
```

> [!CAUTION]
> Deleting the resource group permanently deletes all resources that it contains.

## Next steps

- [Java on Azure Container Apps overview](/azure/container-apps/java-overview)
- [Azure Container Apps application lifecycle management](/azure/container-apps/application-lifecycle-management)
- [Deploy to Azure Container Apps with GitHub Actions](/azure/container-apps/github-actions)
- [Azure Container Apps security considerations](/azure/container-apps/security)
