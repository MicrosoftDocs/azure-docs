---
title: 'Quickstart: Deploy an existing container image with the Azure CLI'
description: Deploy an existing container image to Azure Container Apps with the Azure CLI.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: quickstart
ms.date: 03/21/2022
ms.author: cshoe
zone_pivot_groups: container-apps-registry-types
---

# Quickstart: Deploy an existing container image with the Azure CLI

The Azure Container Apps service enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while you leave behind the concerns of manual cloud infrastructure configuration and complex container orchestrators.

This article demonstrates how to deploy an existing container to Azure Container Apps.

> [!NOTE]
> Private registry authorization is supported via registry username and password.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Access to a public or private container registry.

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

To create the environment, run the following command:

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp env create `
  --name $CONTAINERAPPS_ENVIRONMENT `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION
```

---

## Create a container app

Now that you have an environment created, you can deploy your first container app. With the `containerapp create` command, deploy a container image to Azure Container Apps.

The example shown in this article demonstrates how to use a custom container image with common commands. Your container image might need more parameters for the following items:

- Set the revision mode
- Define secrets
- Define environment variables
- Set container CPU or memory requirements
- Enable and configure Dapr
- Enable internal or internal ingress
- Provide minimum and maximum replica values or scale rules

For details on how to provide values for any of these parameters to the `create` command, run `az containerapp create --help`.

::: zone pivot="container-apps-private-registry"

If you are using Azure Container Registry (ACR), you can login to your registry and forego the need to use the `--registry-username` and `--registry-password` parameters in the `az containerapp create` command and eliminate the need to set the REGISTRY_USERNAME and REGISTRY_PASSWORD variables.

# [Bash](#tab/bash)

```azurecli
az acr login --name <REGISTRY_NAME>
```

# [PowerShell](#tab/powershell)

```powershell
az acr login --name <REGISTRY_NAME>
```

---

# [Bash](#tab/bash)

```bash
CONTAINER_IMAGE_NAME=<CONTAINER_IMAGE_NAME>
REGISTRY_SERVER=<REGISTRY_SERVER>
REGISTRY_USERNAME=<REGISTRY_USERNAME>
REGISTRY_PASSWORD=<REGISTRY_PASSWORD>
```

(Replace the \<placeholders\> with your values.)

If you have logged in to ACR, you can omit the `--registry-username` and `--registry-password` parameters in the `az containerapp create` command.

```azurecli
az containerapp create \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --image $CONTAINER_IMAGE_NAME \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --registry-server $REGISTRY_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD
```

# [PowerShell](#tab/powershell)

```powershell
$CONTAINER_IMAGE_NAME=<CONTAINER_IMAGE_NAME>
$REGISTRY_SERVER=<REGISTRY_SERVER>
$REGISTRY_USERNAME=<REGISTRY_USERNAME>
$REGISTRY_PASSWORD=<REGISTRY_PASSWORD>
```

(Replace the \<placeholders\> with your values.)

If you have logged in to ACR, you can omit the `--registry-username` and `--registry-password` parameters in the `az containerapp create` command.

```powershell
az containerapp create `
  --name my-container-app `
  --resource-group $RESOURCE_GROUP `
  --image $CONTAINER_IMAGE_NAME `
  --environment $CONTAINERAPPS_ENVIRONMENT `
  --registry-server $REGISTRY_SERVER `
  --registry-username $REGISTRY_USERNAME `
  --registry-password $REGISTRY_PASSWORD 
```

---

::: zone-end

::: zone pivot="container-apps-public-registry"

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --image <REGISTRY_CONTAINER_NAME> \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --image <REGISTRY_CONTAINER_NAME> `
  --name my-container-app `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINERAPPS_ENVIRONMENT
```

---

Before you run this command, replace `<REGISTRY_CONTAINER_NAME>` with the full name the public container registry location, including the registry path and tag. For example, a valid container name is `mcr.microsoft.com/azuredocs/containerapps-helloworld:latest`.

::: zone-end

If you have enabled ingress on your container app, you can add `--query properties.configuration.ingress.fqdn` to the `create` command to return the public URL for the application.

## Verify deployment

To verify a successful deployment, you can query the Log Analytics workspace. You might have to wait 5–10 minutes after deployment for the analytics to arrive for the first time before you are able to query the logs.

After about 5-10 minutes has passed, use the following steps to view logged messages.

# [Bash](#tab/bash)

```azurecli
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv`

az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated" \
  --out table
```

# [PowerShell](#tab/powershell)

```powershell
$LOG_ANALYTICS_WORKSPACE_CLIENT_ID=(az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --out tsv)


az monitor log-analytics query `
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID `
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated" `
  --out table
```

---

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
az group delete `
  --name $RESOURCE_GROUP
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
