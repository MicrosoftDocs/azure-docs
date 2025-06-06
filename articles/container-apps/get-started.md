---
title: 'Quickstart: Deploy your first container app with containerapp up'
description: Deploy your first application to Azure Container Apps using the Azure CLI containerapp up command.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 02/03/2025
ms.author: cshoe
ms.custom: devx-track-azurecli
ms.devlang: azurecli
---

# Quickstart: Deploy your first container app with containerapp up

The Azure Container Apps service enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while you leave behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this quickstart, you create and deploy your first container app using the `az containerapp up` command.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

## Create and deploy the container app

Create and deploy your first container app with the `containerapp up` command. This command will:

- Create the Container Apps environment
- Create the Log Analytics workspace
- Create and deploy the container app using a public container image

Note that if any of these resources already exist, the command will use them instead of creating new ones.


# [Bash](#tab/bash)

```azurecli
az containerapp up \
  --name my-container-app \
  --resource-group my-container-apps \
  --location centralus \
  --environment 'my-container-apps' \
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 80 \
  --ingress external \
  --query properties.configuration.ingress.fqdn
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp up `
  --name my-container-app `
  --resource-group my-container-apps `
  --location centralus `
  --environment  my-container-apps `
  --image mcr.microsoft.com/k8se/quickstart:latest `
  --target-port 80 `
  --ingress external `
  --query properties.configuration.ingress.fqdn
```

---

> [!NOTE]
> Make sure the value for the `--image` parameter is in lower case.

By setting `--ingress` to `external`, you make the container app available to public requests.

## Verify deployment

The `up` command returns the fully qualified domain name for the container app. Copy this location to a web browser.

The following message is displayed when the container app is deployed:

:::image type="content" source="media/get-started/azure-container-apps-quickstart.png" alt-text="Screenshot of container app web page.":::

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.


```azurecli
az group delete --name my-container-apps
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)
