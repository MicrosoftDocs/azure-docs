---
title: 'Quickstart: Deploy an existing container image using the Azure CLI'
description: Deploy an existing container image to Azure Container Apps Preview with the Azure CLI.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: quickstart
ms.date: 12/16/2021
ms.author: cshoe
zone_pivot_groups: container-apps-registry-types
---

# Quickstart: Deploy an existing container image with the Azure CLI

Azure Container Apps Preview enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

This article demonstrates how to deploy an existing container to Azure Container Apps.

> [!NOTE]
> Private registry authorization is supported via registry username and password.

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

To create the environment, run the following command:

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET \
  --location "$LOCATION"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp env create `
  --name $CONTAINERAPPS_ENVIRONMENT `
  --resource-group $RESOURCE_GROUP `
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID `
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET `
  --location "$LOCATION"
```

---

## Create a container app

Now that you have an environment created, you can deploy your first container app. Using the `containerapp create` command, deploy a container image to Azure Container Apps.

The example shown in this article demonstrates how to use a custom container image with common commands. Your container image may need more parameters including the following items:

- Setting the revision mode
- Defining secrets
- Defining environment variables
- Setting container CPU or memory requirements
- Enabling and configuring Dapr
- Enabling internal or internal ingress
- Providing minimum and maximum replica values or scale rules

For details on how to provide values for any of these parameters to the `create` command, run `az containerapp create --help`.

::: zone pivot="container-apps-private-registry"

# [Bash](#tab/bash)

```bash
CONTAINER_IMAGE_NAME=<CONTAINER_IMAGE_NAME>
REGISTRY_LOGIN_SERVER=<REGISTRY_LOGIN_URL>
REGISTRY_USERNAME=<REGISTRY_USERNAME>
REGISTRY_PASSWORD=<REGISTRY_PASSWORD>
```

As you define these variables, replace the placeholders surrounded by `<>` with your values.

```azurecli
az containerapp create \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --image $CONTAINER_IMAGE_NAME \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --registry-login-server $REGISTRY_LOGIN_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD
```

# [PowerShell](#tab/powershell)

```powershell
$CONTAINER_IMAGE_NAME=<CONTAINER_IMAGE_NAME>
$REGISTRY_LOGIN_SERVER=<REGISTRY_LOGIN_URL>
$REGISTRY_USERNAME=<REGISTRY_USERNAME>
$REGISTRY_PASSWORD=<REGISTRY_PASSWORD>
```

As you define these variables, replace the placeholders surrounded by `<>` with your values.

```powershell
az containerapp create `
  --name my-container-app `
  --resource-group $RESOURCE_GROUP `
  --image $CONTAINER_IMAGE_NAME `
  --environment $CONTAINERAPPS_ENVIRONMENT `
  --registry-login-server $REGISTRY_LOGIN_SERVER `
  --registry-username $REGISTRY_USERNAME `
  --registry-password $REGISTRY_PASSWORD 
```

---

::: zone-end

::: zone pivot="container-apps-public-registry"

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --image <REGISTRY_CONTAINER_URL> \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --image <REGISTRY_CONTAINER_URL> `
  --name my-container-app `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINERAPPS_ENVIRONMENT
```

---

Before you run this command, replace `<REGISTRY_CONTAINER_URL>` with the URL to the public container registry location including tag.

::: zone-end

If you have enabled ingress on your container app, you can add `--query configuration.ingress.fqdn` to the `create` command to return the app's public URL.

## Verify deployment

To verify a successful deployment, you can query the Log Analytics workspace. You may need to wait a 5 to 10 minutes for the analytics to arrive for the first time before you are able to query the logs.

After about 5 to 10 minutes has passed after creating the container app, use the following steps to view logged messages.

# [Bash](#tab/bash)

```azurecli
az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated" \
  --out table
```

# [PowerShell](#tab/powershell)

```azurecli
az monitor log-analytics query `
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID `
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'my-container-app' | project ContainerAppName_s, Log_s, TimeGenerated" `
  --out table
```

---

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```azurecli
az group delete `
  --name $RESOURCE_GROUP
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
