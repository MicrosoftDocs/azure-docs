---
title: 'Tutorial: Deploy your first container app'
description: Deploy a NVIDIA NIM to Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 03/16/2025
ms.author: cachai
ms.custom: mode-api, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli
---

# Tutorial: Deploy an NVIDIA LLAMA3 NIM to Azure Container Apps

NVIDIA Inference Microservices (NIMs) are optimized, containerized AI inference microservices designed to simplify and accelerate the deployment of AI models across various environments. By leveraging Azure Container Apps with serverless GPUs, you can run these NIMs efficiently without managing the underlying infrastructure.​

In this tutorial, you'll deploy a Llama3 NVIDIA NIM to Azure Container Apps using serverless GPUs.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Have a NVIDIA NGC API Key. Obtain an API key from the [NVIDIA NGC website](https://catalog.ngc.nvidia.com).

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

[!INCLUDE [container-apps-set-environment-variables.md](../../includes/container-apps-set-environment-variables.md)]

[!INCLUDE [container-apps-create-resource-group.md](../../includes/container-apps-create-resource-group.md)]

[!INCLUDE [container-apps-create-environment.md](../../includes/container-apps-create-environment.md)]

## Initial setup

1. Set up environment variables

```bash
RESOURCE_GROUP="my-resource-group"
LOCATION="swedencentral"
ACR_NAME="myacrname"
CONTAINERAPPS_ENVIRONMENT="my-environment-name"
CONTAINER_APP_NAME="llama3-nim"
GPU_TYPE="Consumption-GPU-NC24-A100"
```

1. Create an Azure resource group

```azurecli
az group create --name $RESOURCE_GROUP --location $LOCATION
```

1. Create an Azure Container Registry (ACR)

> [!NOTE]
> This tutorial uses a premium Azure Contianer Registry as it is recommended when using serverless GPUs for improved cold start performance. If you do not wish to use a premium Azure Container Registry, modify the below command, so --sku is set to Basic.

```azurecli
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Premium --location $LOCATION
```

## Pull the image from NGC and push to ACR

> [!NOTE]
> NVIDIA NICs each have their own hardware requirements. [Make sure the NIM](link) you select is supported by the GPU types available in Azure Container Apps. The Llama3 NIM used in this tutorial can run on NVIDIA A100 GPUs.

1. Authenticate with both the NVIDIA and azure container registries

```bash
docker login nvcr.io
Username: $oauthtoken
Password: <PASTE_API_KEY_HERE>
```

```bash
az acr login --name $ACR_NAME
```

1. Pull the Llama3 NIM image and push it to your Azure Container Registry

Pull the image
```azurecli
docker pull nvcr.io/nim/meta/llama3-8b-instruct:1.0.0
```

Tag the image
```azurecli
docker tag nvcr.io/nim/meta/llama3-8b-instruct:1.0.0 $ACR_NAME.azurecr.io/llama3-8b-instruct:1.0.0
```

Push the image
```azurecli
docker push $ACR_NAME.azurecr.io/llama3-8b-instruct:1.0.0
```

## (Recommended: Optional) Enable artifact streaming.

Many of the NIM images are large, and your container app may take a long time to start if you don't enable artifact streaming. To enable artifact streaming, follow these steps:

```azurecli
az acr artifact-streaming create --image jupyter/all-spark-notebook:latest
```

```azurecli
az acr artifact-streaming update --repository jupyter/all-spark-notebook --enable-streaming true
```

```azurecli
az acr artifact-streaming operation show --image jupyter/all-spark-notebook:newtag
```

Note: Tis may take a few minutes.

## Create your container app with the NGC API Key

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --workload-profiles enabled
```

az containerapp env workload-profile add \
    --resource-group $RESOURCE_GROUP \
    --name $CONTAINERAPPS_ENVIRONMENT \
    --workload-profile-type $GPU_TYPE \
    --workload-profile-name <WORKLOAD_PROFILE_NAME> \

az containerapp secret set \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secrets ngc-api-key=<PASTE_NGC_API_KEY_HERE>

```azurecli ///need add workload profile and verify
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image $ACR_NAME.azurecr.io/llama3-8b-instruct:1.0.0 \
  --cpu 24 \
  --memory 220 \
  --gpu "NvidiaA100" \
  --secrets ngc-api-key=<PASTE_NGC_API_KEY_HERE> \
  --env-vars NGC_API_KEY=secretref:ngc-api-key \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username <ACR_USERNAME> \
  --registry-password <ACR_PASSWORD>

## Test your NIM
Once deployed, test the NIM by sending a request:
```bash
curl -X POST \
  'http://<YOUR_CONTAINER_APP_URL>/v1/completions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "meta/llama3-8b-instruct",
    "prompt": "Once upon a time",
    "max_tokens": 64
  }'
```

## (Optional) Improving performance with volume mounts
For even faster cold start times, many of the NIMs provide a volume mount path to mount a cache directory. This cache directory can be used to store the model weights and other files that the NIM needs to run. To set up a volume mount for the Llama3 NIM, see this article.

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this tutorial.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)
