---
title: Deploy self-hosted gateway to Azure Container Apps - Azure API Management
description: Learn how to deploy a self-hosted gateway component of Azure API Management to Azure Container Apps.
author: dlepow
manager: gwallace
ms.service: api-management
ms.topic: article
ms.date: 02/14/2024
ms.author: danlep
---

# Deploy an Azure API Management self-hosted gateway to Azure Container Apps

This article provides the steps for deploying the [self-hosted gateway](self-hosted-gateway-overview.md) component of Azure API Management to [Azure Container Apps](../container-apps/overview.md). Deploy the self-hosted gateway to a container app to access APIs that are hosted in container apps in the same environment.

> [!NOTE]
> Deploying the self-hosted gateway in Azure Container Apps is best suited for evaluation and development use cases. Kubernetes is recommended for production use. Learn how to deploy to Kubernetes with [Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md) or using a [deployment YAML file](how-to-deploy-self-hosted-gateway-kubernetes.md).

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
- [Provision a gateway resource in your API Management instance](api-management-howto-provision-self-hosted-gateway.md). 

    Make a note of the gateway's **Token** and **Configuration endpoint** values. You can find them in the Azure portal:

    1. Navigate to your API Management instance.
    1. In the left menu, under **Deployment and infrastructure**, select **Gateways**.
    1. Select the gateway resource you intend to deploy, and select **Deployment**.     

## Deploy the self-hosted gateway to a container app

You can deploy the self-hosted gateway [container image] to a container app using the [Azure portal](../container-apps/quickstart-portal.md), [Azure CLI](../container-apps/get-started.md), or other tools.

For example, to deploy the self-hosted gateway to a container app using the Azure CLI:

```azurecli-interactive
endpoint=<API Management configuration endpoint
token=<API Management gateway token>


az containerapp up --name my-container-app \
    --resource-group myResourceGroup --location centralus \
    --environment 'my-container-apps' \
    --image "mcr.microsoft.com/azure-api-management/gateway:2.5.0" \
    --target-port 80 --ingress external \
    --env-vars "config.service.endpoint"="$endpoint" "config.service.auth"="$token"
```

1. Sign in to the [Azure portal](https://portal.azure.com), and search for and select **Container Apps**.
1. Select **+ Create**.
1.

## Confirm that the gateway is running


## Example scenario 


## Related content

* See the following deployment samples on GitHub:
    * ...
    *...
