---
title: 'Quickstart: Deploy your first container app'
description: Deploy your first application to Azure Container Apps Preview.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: quickstart
ms.date: 11/02/2021
ms.author: cshoe
ms.custom: ignite-fall-2021, mode-other
---

# Quickstart: Deploy your first container app

Azure Container Apps Preview enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this quickstart, you create a secure Container Apps environment and deploy your first container app.

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

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 80 \
  --ingress 'external' \
  --query configuration.ingress.fqdn
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp create `
  --name my-container-app `
  --resource-group $RESOURCE_GROUP `
  --environment $CONTAINERAPPS_ENVIRONMENT `
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest `
  --target-port 80 `
  --ingress 'external' `
  --query configuration.ingress.fqdn
```

---

By setting `--ingress` to `external`, you make the container app available to public requests.

## Verify deployment

The `create` command returned the container app's fully qualified domain name. Copy this location to a web browser and you'll see the following message.

:::image type="content" source="media/get-started/azure-container-apps-quickstart.png" alt-text="Your first Azure Container Apps deployment.":::

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
