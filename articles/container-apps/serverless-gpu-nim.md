---
title: 'Tutorial: Deploy an NVIDIA Llama3 NIM to Azure Container Apps'
description: Deploy a NVIDIA NIM to Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 03/16/2025
ms.author: cachai
ms.devlang: azurecli
---

# Tutorial: Deploy an NVIDIA Llama3 NIM to Azure Container Apps

NVIDIA Inference Microservices (NIMs) are optimized, containerized AI inference microservices which simplify and accelerate how you build AI applications. These models are pre-packaged, scalable, and performance-tuned for direct deployment as secure endpoints on Azure Container Apps. When you use Azure Container Apps with serverless GPUs, you can run these NIMs efficiently without having to manage the underlying infrastructure.​

In this tutorial, you learn to deploy a Llama3 NVIDIA NIM to Azure Container Apps using serverless GPUs.

This tutorial uses a premium instance of Azure Container Registry to improve cold start performance when working with serverless GPUs. If you don't want to use a premium Azure Container Registry, make sure to modify the `az acr create` command in this tutorial to set `--sku` to `basic`.

## Prerequisites

| Resource | Description |
|---|---|
| Azure account | An Azure account with an active subscription.<br><br>If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli). |
| NVIDIA NGC API key | You can get an API key from the [NVIDIA GPU Cloud (NGC) website](https://catalog.ngc.nvidia.com). |

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

1. Set up environment variables by naming the resource group and setting the location.

    ```bash
    RESOURCE_GROUP="my-resource-group"
    LOCATION="swedencentral"
    ```

    Next, generate a unique container registry name.

    ```bash
    SUFFIX=$(head /dev/urandom | tr -dc 'a-z0-9' | head -c 6)
    ACR_NAME="mygpututorialacr${SUFFIX}"
    ```

    Finally, set variables to name the environment and identify the environment, workload profile type, container app name, and container.

    ```bash
    CONTAINERAPPS_ENVIRONMENT="my-environment-name"
    GPU_TYPE="Consumption-GPU-NC24-A100"
    CONTAINER_APP_NAME="llama3-nim"
    CONTAINER_AND_TAG="llama-3.1-8b-instruct:latest"
    ```

[!INCLUDE [container-apps-create-resource-group.md](../../includes/container-apps-create-resource-group.md)]


1. Create an Azure Container Registry (ACR).

    > [!NOTE]
    > This tutorial uses a premium Azure Container Registry to improve cold start performance when working with serverless GPUs. If you don't want to use a premium Azure Container Registry, modify the following command and set `--sku` to `basic`.

    ```azurecli
    az acr create \
      --resource-group $RESOURCE_GROUP \
      --name $ACR_NAME \
      --location $LOCATION \
      --sku premium
    ```

## Pull, tag, and push your image

Next, pull the image from NVIDIA GPU Cloud and push to Azure Container Registry.

> [!NOTE]
> NVIDIA NICs each have their own hardware requirements. Make sure the GPU type you select supports the [NIM](https://build.nvidia.com/models?filters=nimType%3Anim_type_run_anywhere&q=llama) of your choice. The Llama3 NIM used in this tutorial can run on NVIDIA A100 GPUs.

1. Authenticate to the NVIDIA container registry.

    ```bash
    docker login nvcr.io
    ```

    After you run this command, the sign in process prompts you to enter a username. Enter **$oauthtoken** for your user name value.

    Then you're prompted for a password. Enter your NVIDIA NGC API key here. Once authenticated to the NVIDIA registry, you can authenticate to the Azure registry.

1. Authenticate to Azure Container Registry.

    ```bash
    az acr login --name $ACR_NAME
    ```

1. Pull the Llama3 NIM image.

    ```azurecli
    docker pull nvcr.io/nim/meta/$CONTAINER_AND_TAG
    ```

1. Tag the image.

    ```azurecli
    docker tag nvcr.io/nim/meta/$CONTAINER_AND_TAG $ACR_NAME.azurecr.io/$CONTAINER_AND_TAG
    ```

1. Push the image to Azure Container Registry.

    ```azurecli
    docker push $ACR_NAME.azurecr.io/$CONTAINER_AND_TAG
    ```

## Enable artifact streaming (recommended but optional)

When your container app runs, it pulls the container from your container registry. When you have larger images like in the case of AI workloads, this image pull may take some time. By enabling artifact streaming, you reduce the time needed, and your container app can take a long time to start if you don't enable artifact streaming. Use the following steps to enable artifact streaming.

> [!NOTE]
> The following commands can take a few minutes to complete.

1. Enable artifact streaming on your container registry.

    ```azurecli
    az acr artifact-streaming update \
        --name $ACR_NAME \
        --repository llama-3.1-8b-instruct \
        --enable-streaming True
    ```

1. Enable artifact streaming on the container image.

    ```azurecli
    az acr artifact-streaming create \
      --name $ACR_NAME \
      --image $CONTAINER_AND_TAG
    ```

## Create your container app

Next you create a container app with the NVIDIA GPU Cloud API key.

1. Create the container app.

    ```azurecli
    az containerapp env create \
      --name $CONTAINERAPPS_ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --enable-workload-profiles
    ```

1. Add the GPU workload profile to your environment.

    ```azurecli
    az containerapp env workload-profile add \
        --resource-group $RESOURCE_GROUP \
        --name $CONTAINERAPPS_ENVIRONMENT \
        --workload-profile-type $GPU_TYPE \
        --workload-profile-name LLAMA_PROFILE
    ```

1. Create the container app.

    ```azurecli
    az containerapp create \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $CONTAINERAPPS_ENVIRONMENT \
      --image $ACR_NAME.azurecr.io/$CONTAINER_AND_TAG \
      --cpu 24 \
      --memory 220 \
      --target-port 8000 \
      --ingress external \
      --secrets ngc-api-key=<PASTE_NGC_API_KEY_HERE> \
      --env-vars NGC_API_KEY=secretref:ngc-api-key \
      --registry-server $ACR_NAME.azurecr.io \
      --workload-profile-name LLAMA_PROFILE \
      --query properties.configuration.ingress.fqdn
    ```

    This command returns the URL of your container app. Set this value aside in a text editor for use in a following command.

## Verify the application works

You can verify a successful deployment by sending a request `POST` request to your application.

Before you run this command, make  sure you replace the `<YOUR_CONTAINER_APP_URL>` URL with your container app URL returned from the previous command.

```bash
curl -X POST \
  'http://<YOUR_CONTAINER_APP_URL>/v1/completions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "meta/llama-3.1-8b-instruct",
    "prompt":  [{"role":"user", "content":"Once upon a time..."}],
    "max_tokens": 64
  }'
```

## Improving performance with volume mounts (optional)

When starting up and using artifact streaming with Azure Container Registry, Azure Container Apps is still pulling the images from the container registry at startup. This action results in a cold start even with the optimized artifact streaming.

For even faster cold start times, many of the NIMs provide a volume mount path to store your image in a cache directory. You can use this cache directory to store the model weights and other files that the NIM needs to run.

To set up a volume mount for the Llama3 NIM, you need to set a volume mount on the `./opt/nim/.cache` as specified in the [NVIDIA Llama-3.1-8b documentation](https://build.nvidia.com/meta/llama-3_1-8b-instruct/deploy). To do so, follow the steps in the [volume mounts tutorial](./storage-mounts-azure-files.md) and set the volume mount path to `/opt/nim/.cache`.

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this tutorial.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. This command also deletes any resources outside the scope of this tutorial that exist in this resource group.

```azurecli
az group delete --name $RESOURCE_GROUP
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Related content

- [Serverless GPUs overview](./gpu-serverless-overview.md)
- [Tutorial: Generate image with GPUs](./gpu-image-generation.md)
