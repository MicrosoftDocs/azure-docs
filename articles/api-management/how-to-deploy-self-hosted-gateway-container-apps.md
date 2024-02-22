---
title: Deploy self-hosted gateway to Azure Container Apps - Azure API Management
description: Learn how to deploy a self-hosted gateway component of Azure API Management to Azure Container Apps.
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 02/22/2024
ms.author: danlep
---

# Deploy an Azure API Management self-hosted gateway to Azure Container Apps

This article provides the steps for deploying the [self-hosted gateway](self-hosted-gateway-overview.md) component of Azure API Management to [Azure Container Apps](../container-apps/overview.md). Deploy the self-hosted gateway to a container app to access APIs that are hosted in container apps in the same environment.

> [!NOTE]
> Deploying the self-hosted gateway in Azure Container Apps is best suited for evaluation and development use cases. Kubernetes is recommended for production use. Learn how to deploy to Kubernetes with [Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md) or using a [deployment YAML file](how-to-deploy-self-hosted-gateway-kubernetes.md).

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance].(get-started-create-service-instance.md)

- For Azure CLI:
    [!INCLUDE [include](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > The Azure CLI command examples in this article require the `containerapp` Azure CLI extension. If you haven't used `az containerapp` commands, the extension is installed dynamically when you run your first `az containerapp` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

## Provision gateway in your API Management instance

Before deploying a self-hosted gateway, provision a gateway resource in your Azure API Management instance. For steps, see [Provision a self-hosted gateway](api-management-howto-provision-self-hosted-gateway.md).

## Get gateway deployment information from API Management

To deploy the gateway, you need the gateway's **Token** and **Configuration endpoint** values. You can find them in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. In the left menu, under **Deployment and infrastructure**, select **Gateways**.
1. Select the gateway resource you provisioned, and select **Deployment**. 
1. Copy the **Token** and **Configuration endpoint** values.  

## Deploy the self-hosted gateway to a container app

You can deploy the self-hosted gateway [container image](https://aka.ms/apim/shgw/registry-portal) to a container app using the [Azure portal](../container-apps/quickstart-portal.md), [Azure CLI](../container-apps/get-started.md), or other tools.

### Create a container app environment

First, create an environment for your container apps using the Azure CLI. For example, run the [az containerapp env create](/cli/azure/containerapp#az-containerapp-env-create) command:

```azurecli-interactive
az containerapp env create --name my-environment --resource-group myResourceGroup \
    --location centralus
```

This command creates:
* A container app environment named `my-environment` that you use to group container apps.
* A log analytics workspace

### Create a container app for the self-hosted gateway

To deploy the self-hosted gateway to a container app using the Azure CLI, run the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command:

```azurecli-interactive
# Replace the placeholder values with your own values from the API Management gateway resource.

endpoint="<API Management configuration endpoint>"
token="<API Management gateway token>"

az containerapp create --name my-container-app \
    --resource-group myResourceGroup --environment 'my-environment' \
    --image "mcr.microsoft.com/azure-api-management/gateway:2.5.0" \
    --target-port 8080 --ingress external \
    --min-replicas 1 --max-replicas 3 \
    --env-vars "config.service.endpoint"="$endpoint" "config.service.auth"="$token"
```

This command creates:
* A container app named `my-container-app` in the `myResourceGroup` resource group. In this example, the container app is created using the `mcr.microsoft.com/azure-api-management/gateway:2.5.0` image.
* Support for external ingress to the container app on port 8080.
* A minimum of 1 and a maximum of 3 replicas of the container app.
* Configuration environment variables for the gateway's **Token** and **Configuration endpoint** values.

### Confirm that the container app is running

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your container app.
1. On the container app's **Overview** page, check that the **Status** is **Running**.

### Confirm that the gateway is healthy

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. In the left menu, under **Deployment and infrastructure**, select **Gateways**.
1. Check the **Status** of your gateway. If the gateway is healthy, it reports regular gateway heartbeats.


## Example scenario 

* Step 1. Deploy a container app hosting an API in the same environment as the self-hosted gateway
* Step 2. Add the API to your API Management instance
* Step 3. Configure a policy to route traffic to the self-hosted gateway
* Step 4. Test the API

### Step 1. Deploy a container app hosting an API in the same environment as the self-hosted gateway

For example, deploy an example music album API to a container app. To access the API using the self-hosted gateway, deploy it in the same environment as the self-hosted gateway. Abbreviated steps follow. For more information about deploying this API, see [Quickstart: Build and deploy from local source code to Azure Container Apps](../container-apps/quickstart-code-to-cloud.md).

1. 

### Step 2. Add the API to your API Management instance


### Step 3. Configure a policy to route traffic to the self-hosted gateway


### Step 4. Test the API



## Related content

* See the following deployment samples on GitHub:
    * ...
    *...
