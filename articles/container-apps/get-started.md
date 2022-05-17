---
title: 'Quickstart: Deploy your first container app'
description: Deploy your first application to Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: quickstart
ms.date: 03/21/2022
ms.author: cshoe
ms.custom: ignite-fall-2021, mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Deploy your first container app

The Azure Container Apps service enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while you leave behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this quickstart, you create a secure Container Apps environment and deploy your first container app.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).

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

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 80 \
  --ingress 'external' \
  --query properties.configuration.ingress.fqdn
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
  --query properties.configuration.ingress.fqdn
```

---

> [!NOTE]
> Make sure the value for the `--image` parameter is in lower case.

By setting `--ingress` to `external`, you make the container app available to public requests.

## Verify deployment

The `create` command returned the fully qualified domain name for the container app. Copy this location to a web browser and see the following message:

:::image type="content" source="media/get-started/azure-container-apps-quickstart.png" alt-text="Your first Azure Container Apps deployment.":::

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
Remove-AzResourceGroup -Name $RESOURCE_GROUP -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
