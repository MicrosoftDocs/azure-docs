---
title: Deploy a self-hosted gateway to Azure Container Apps - Azure API Management
description: Learn how to deploy a self-hosted gateway component of Azure API Management to an Azure Container Apps environment.
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 02/28/2024
ms.author: danlep
---

# Deploy an Azure API Management self-hosted gateway to Azure Container Apps

This article provides the steps to deploy the [self-hosted gateway](self-hosted-gateway-overview.md) component of Azure API Management to [Azure Container Apps](../container-apps/overview.md). Deploy a self-hosted gateway to a container app to access APIs that are hosted in container apps in the same environment.

> [!NOTE]
> Hosting the API Management self-hosted gateway in Azure Container Apps is best suited for evaluation and development use cases. Kubernetes is recommended for production use. Learn how to deploy to Kubernetes with [Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md) or using a [deployment YAML file](how-to-deploy-self-hosted-gateway-kubernetes.md).

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).

- For Azure CLI:
    [!INCLUDE [include](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > The Azure CLI command examples in this article require the `containerapp` Azure CLI extension. If you haven't used `az containerapp` commands, the extension is installed dynamically when you run your first `az containerapp` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

## Provision gateway in your API Management instance

Before deploying a self-hosted gateway, provision a gateway resource in your Azure API Management instance. For steps, see [Provision a self-hosted gateway](api-management-howto-provision-self-hosted-gateway.md). In the examples in this article, the gateway is named `my-gateway`.

## Get gateway deployment settings from API Management

To deploy the gateway, you need the gateway's **Token** and **Configuration endpoint** values. You can find them in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. In the left menu, under **Deployment and infrastructure**, select **Gateways**.
1. Select the gateway resource you provisioned, and select **Deployment**. 
1. Copy the **Token** and **Configuration endpoint** values.  

## Deploy the self-hosted gateway to a container app

You can deploy the self-hosted gateway [container image](https://aka.ms/apim/shgw/registry-portal) to a container app using the [Azure portal](../container-apps/quickstart-portal.md), [Azure CLI](../container-apps/get-started.md), or other tools. This article shows steps using the Azure CLI.

### Create a container apps environment

First, create a container apps environment using the [az containerapp env create](/cli/azure/containerapp#az-containerapp-env-create) command:

```azurecli-interactive
az containerapp env create --name my-environment --resource-group myResourceGroup \
    --location centralus
```

This command creates:
* A container app environment named `my-environment` that you use to group container apps.
* A log analytics workspace

### Create a container app for the self-hosted gateway

To deploy the self-hosted gateway to a container app in the environment, run the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command. 

First set variables for the **Token** and **Configuration endpoint** values from the API Management gateway resource.

```azurecli-interactive
#!/bin/bash

endpoint="<API Management configuration endpoint>"
token="<API Management gateway token>"
```

```azurecli-interactive
# PowerShell syntax

$endpoint="<API Management configuration endpoint>"
$token="<API Management gateway token>"
```

Create the container app using the `az containerapp create` command:

```azurecli-interactive
az containerapp create --name my-gateway \
    --resource-group myResourceGroup --environment 'my-environment' \
    --image "mcr.microsoft.com/azure-api-management/gateway:2.5.0" \
    --target-port 8080 --ingress external \
    --min-replicas 1 --max-replicas 3 \
    --env-vars "config.service.endpoint"="$endpoint" "config.service.auth"="$token"
```

This command creates:
* A container app named `my-gateway` in the `myResourceGroup` resource group. In this example, the container app is created using the `mcr.microsoft.com/azure-api-management/gateway:2.5.0` image.
* Support for external ingress to the container app on port 8080.
* A minimum of 1 and a maximum of 3 replicas of the container app.
* A connection from the self-hosted gateway to the API Management instance using values passed in environment variables.

### Confirm that the container app is running

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your container app.
1. On the container app's **Overview** page, check that the **Status** is **Running**.

> [!TIP]
> Using the CLI, you can also run the [az containerapp show](/cli/azure/containerapp#az-containerapp-show) command to check the status of the container app.

### Confirm that the gateway is healthy

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. In the left menu, under **Deployment and infrastructure**, select **Gateways**.
1. Check the **Status** of your gateway. If the gateway is healthy, it reports regular gateway heartbeats.

## Example scenario 

The following example shows how you can use the self-hosted gateway to access an API hosted in a container app in the same environment. In this example, the self-hosted gateway can be accessed from the internet, while the API is only accessible within the container apps environment.

* **Step 1.** Deploy a container app hosting an API in the same environment as the self-hosted gateway
* **Step 2.** Add the API to your API Management instance 
* **Step 4.** Call the API through the self-hosted gateway

### Step 1. Deploy a container app hosting an API in the same environment as the self-hosted gateway

For example, deploy an example music album API to a container app. For later access to the API using the self-hosted gateway, deploy the API in the same environment as the self-hosted gateway. For detailed steps and information about the resources used in this example, see [Quickstart: Build and deploy from local source code to Azure Container Apps](../container-apps/quickstart-code-to-cloud.md). Abbreviated steps follow:

1. Download [Python source code](https://codeload.github.com/azure-samples/containerapps-albumapi-python/zip/refs/heads/main) to your local machine. If you prefer, download the source code in another language of your choice.
1. Extract the source code to a local folder and change to the *containerapps-albumapi-python-main/src* folder.
1. Run the following [az containerapp up](/cli/azure/containerapp#az-containerapp-up) command to deploy the API to a container app in the same environment as the self-hosted gateway. Note the `.` at the end of the command, which specifies the current folder as the source for the container app.

    ```azurecli-interactive
    az containerapp up --name albums-api \
        --resource-group myResourceGroup --location centralus \
        --environment my-environment --source .
    ```
1. Confirm that the container app is running and accessible externally at the FQDN returned in the command output. By default the API is accessible at the `/albums` endpoint. Example: `https://albums-api.happyvalley-abcd1234.centralus.azurecontainerapps.io/albums/albums`.

### Configure the API for internal ingress

Now update the container app hosting the sample API to enable ingress only in the container environment. This setting restricts access to the API from the self-hosted gateway that you deployed.

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your container app.
1. In the left menu, select **Ingress**.
1. Set **Ingress** to **Enabled**.
1. In **Ingress traffic**, select **Limited to Container Apps Environment**.
1. Review the remaining settings and select **Save**.

### Step 2. Add the API to your API Management instance 

The following are example steps to add an API to your API Management instance and configure an API backend. For more information, see [Add an API to Azure API Management](api-management-howto-add-api.md).

#### Add the API to your API Management instance

1. In the portal, navigate to the API Management instance where you configured the self-hosted gateway.
1. In the left menu, select **APIs** > **+ Add API**.
1. Select **HTTP** and select **Full**. Enter the following settings:
    1. **Display name**: Enter a descriptive name. Example: *Albums API*.
    1. **Web service URL**: Enter the *internal* FQDN of the container app hosting the API. Example: `http://albums-api.internal.happyvalley-abcd1234.centralus.azurecontainerapps.io`.
    1. **URL scheme**: Select **HTTP(S)**.
    1. **API URL suffix**: Enter a suffix of your choice. Example: *albumapi*.
    1. **Gateways**: Select the self-hosted gateway you provisioned. Example: *my-gateway*.
1. Configure other API settings according to your scenario. Select **Create**.

#### Add an API operation

1. In the left menu, select **APIs** > **Albums API**.
1. Select **+ Add operation**.
1. Enter operation settings:
    1. **Display name**: Enter a descriptive name for the operation. Example: *Get albums*.
    1. **URL**: Select **Get** and enter `/albums` for the endpoint.
    1. Select **Save**.

### Step 4. Call the API through the self-hosted gateway

Call the API using the FQDN of the self-hosted gateway running in the container app. Find the FQDN on the container app's **Overview** page in the Azure portal, or run the following `az containerapp show` command.

```azurecli-interactive
az containerapp show ----name my-gateway --resource-group myResourceGroup \
    --query "properties.configuration.ingress.fqdn" --output tsv
```

For example, use the following `curl` command to call the API  at the `/albumapi/albums` endpoint. If your API requires a subscription key, pass a valid subscription key for your API Management instance as a header in the request:

```bash
curl -i https://my-gateway.happyvalley-abcd1234.centralus.azurecontainerapps.io/albumapi/albums -H "Ocp-Apim-Subscription-Key: <subscription-key>"
```
When the test is successful, the backend responds with a successful HTTP response code and some data.

```output
HTTP/1.1 200 OK
content-length: 751
content-type: application/json
date: Wed, 28 Feb 2024 22:45:09 GMT
[...]

[{"id":1,"title":"You, Me and an App Id","artist":"Daprize","price":10.99,"image_url":"https://aka.ms/albums-daprlogo"},{"id":2,"title":"Seven Revision Army","artist":"The Blue-Green Stripes","price":13.99,"image_url":"https://aka.ms/albums-containerappslogo"},{"id":3,"title":"Scale It Up","artist":"KEDA Club","price":13.99,"image_url":"https://aka.ms/albums-kedalogo"},{"id":4,"title":"Lost in Translation","artist":"MegaDNS","price":12.99,"image_url":"https://aka.ms/albums-envoylogo"},{"id":5,"title":"Lock Down Your Love","artist":"V is for VNET","price":12.99,"image_url":"https://aka.ms/albums-vnetlogo"},{"id":6,"title":"Sweet Container O' Mine","artist":"Guns N Probeses","price":14.99,"image_url":"https://aka.ms/albums-containerappslogo"}]
```

## Related content

* [Connected microservices with Azure Container Apps](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/connected-microservices-with-azure-container-apps/ba-p/3072158)
* [Azure API Management's Self-Hosted Gateway on Azure Container Apps](https://github.com/tomkerkhove/azure-apim-on-container-apps)
