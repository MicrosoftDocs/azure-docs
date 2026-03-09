---
title: "Tutorial: Deploy AI image generation with serverless GPUs"
description: Deploy Stable Diffusion for AI image generation using serverless GPUs in Azure Container Apps with Azure Functions or containers.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 02/11/2026
ms.ai-usage: ai-assisted
zone_pivot_groups: container-apps-portal-or-cli
#customer intent: As a developer, I want to deploy an AI-powered image generation service using serverless GPUs so that I can create images from text prompts without managing GPU infrastructure.
---

# Tutorial: Deploy AI image generation with serverless GPUs

In this tutorial, you deploy a Stable Diffusion-powered image generator using serverless GPUs in Azure Container Apps. You can deploy this solution either as an Azure Functions app or as a standard container app, depending on your needs.

Serverless GPUs provide on-demand access to GPU compute resources without infrastructure management. You pay only for the GPU time you use, and the solution automatically scales to zero when idle.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a Container Apps environment with GPU workload profiles
> * Deploy an AI image generation API using serverless GPUs
> * Test the deployment with text-to-image requests
> * Monitor GPU utilization and optimize performance
> * Clean up resources to avoid unnecessary costs

## Prerequisites

| Requirement | Description |
| --- | --- |
| Azure subscription | If you don't have one, [create a free account](https://azure.microsoft.com/free/). |
| GPU quota | [Request GPU quota access](https://aka.ms/aca-gpu-request). Approval typically takes one to two business days. |
| Azure CLI | [Install the Azure CLI](/cli/azure/install-azure-cli) version 2.62.0 or later. |
| Azure Developer CLI | [Install the Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) for streamlined deployment. |
| Docker Desktop | Required for local container development. [Install Docker Desktop](https://www.docker.com/products/docker-desktop/). |

> [!IMPORTANT]
> Request GPU quota access before starting this tutorial. You can continue reading while you wait for approval, but deployment requires an approved quota.

To verify your tools are installed correctly, run the following commands:

```bash
az --version
azd version
docker --version
```

## Architecture overview

This solution uses the following Azure services:

| Component | Purpose |
| --- | --- |
| **Azure Container Apps** | Hosts your application with serverless GPU support |
| **GPU workload profile** | Provides NVIDIA T4 GPU compute for AI inference |
| **Azure Container Registry** | Stores your custom container image |
| **Azure Storage** | Required for Azure Functions runtime (Functions deployment only) |
| **Application Insights** | Provides monitoring and diagnostics |

The application follows a straightforward request flow. When a client sends a request, it first reaches the Container Apps ingress endpoint. Your application then processes the request and passes it to the Stable Diffusion model running on the GPU. The model generates the requested image based on your prompt and returns the generated image as a response to the client.

### Cost considerations

Serverless GPUs use per-second billing. Review these cost factors before deploying:

| Factor | Impact |
| --- | --- |
| GPU type | NVIDIA T4 costs less than A100 |
| Minimum replicas | Set to 0 for development (scales to zero when idle) |
| Cold start time | First request takes 1-2 minutes (model loading) |
| Request duration | Image generation typically takes 5-15 seconds |

For detailed pricing, see [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/).

## Get the sample code

Clone the sample repository that contains the Azure Functions implementation:

```bash
git clone https://github.com/Azure-Samples/function-on-aca-gpu.git
cd function-on-aca-gpu
```

The repository contains:

| File | Purpose |
| --- | --- |
| `function_app.py` | HTTP-triggered function for image generation |
| `requirements.txt` | Python dependencies including the diffusers library |
| `Dockerfile` | Container image definition with GPU support |
| `host.json` | Azure Functions configuration |
| `azure.yaml` | Azure Developer CLI deployment configuration |

::: zone pivot="azure-portal"

## Deploy by using the Azure portal

Follow these steps to create a GPU-enabled container app and deploy the image generation solution by using the Azure portal.

### Create a Container Apps environment with GPU

1. In the [Azure portal](https://portal.azure.com), search for **Container Apps** and select it.

1. Select **Create** > **Container App**.

1. On the **Basics** tab, configure the following settings:

    | Setting | Value |
    | --- | --- |
    | **Subscription** | Select your Azure subscription |
    | **Resource group** | Select **Create new** and enter `rg-gpu-image-gen` |
    | **Container app name** | Enter `ca-image-gen` |
    | **Deployment source** | Select **Container image** |
    | **Region** | Select **Sweden Central** |

1. Under **Container Apps environment**, select **Create new**.

1. In the **Create Container Apps environment** pane, enter `cae-gpu-image-gen` for the environment name.

1. Select **Create** to create the environment.

1. Select **Next: Container >**.

### Configure the container with GPU

1. On the **Container** tab, configure the following settings:

    | Setting | Value |
    | --- | --- |
    | **Name** | Enter `gpu-image-gen-container` |
    | **Image source** | Select **Docker Hub or other registries** |
    | **Image type** | Select **Public** |
    | **Registry login server** | Enter `mcr.microsoft.com` |
    | **Image and tag** | Enter `k8se/gpu-quickstart:latest` |
    | **Workload profile** | Select **Consumption - Up to 4 vCPUs, 8 GiB memory** |
    | **GPU** | To enable GPU, select the checkbox |
    | **GPU Type** | Select **Consumption-GPU-NC8as-T4** and select the link to add the profile |

1. Select **Next: Ingress >**.

### Configure ingress

1. On the **Ingress** tab, configure the following settings:

    | Setting | Value |
    | --- | --- |
    | **Ingress** | Select **Enabled** |
    | **Ingress traffic** | Select **Accepting traffic from anywhere** |
    | **Target port** | Enter `80` |

1. Select **Review + create**.

1. Review your settings and select **Create**.

1. Wait for the deployment to complete (approximately 5 minutes), then select **Go to resource**.

### Verify the deployment

1. On the container app **Overview** page, copy the **Application URL**.

1. Open the URL in a browser to access the image generation interface.

::: zone-end

::: zone pivot="azure-cli"

## Deploy with Azure CLI

You can deploy by using either the Azure Developer CLI (recommended for the Functions app) or the Azure CLI (for more control over individual resources).

### Option A: Deploy as Azure Functions app with azd

The Azure Developer CLI provides the fastest deployment experience for the Azure Functions implementation.

1. Navigate to the cloned repository:

    ```bash
    cd function-on-aca-gpu
    ```

1. Initialize and deploy the application:

    ```bash
    azd up
    ```

1. When prompted, provide the following values:

    | Prompt | Value |
    | --- | --- |
    | **Environment name** | Enter a unique name (for example, `gpufunc-dev`) |
    | **Azure location** | Select `swedencentral` |
    | **Azure subscription** | Select your subscription |

    The deployment takes approximately 15-20 minutes.

1. When deployment completes, note the endpoint URL displayed in the output.

The `azd up` command creates the following resources:

| Resource | Purpose |
| --- | --- |
| Resource group | Container for all resources |
| Resource group | Container for all resources |
| Container Apps environment | Hosts the app with GPU workload profile |
| Container registry | Stores your custom container image |
| Storage account | Required for Azure Functions runtime |
| Application Insights | Monitoring and diagnostics |
| Function App | The image generation API |

### Option B: Deploy as container app by using Azure CLI

For more control over the deployment, use Azure CLI to create each resource individually.

1. Set the environment variables:

    ```bash
    RESOURCE_GROUP="rg-gpu-image-gen"
    ENVIRONMENT_NAME="cae-gpu-image-gen"
    LOCATION="swedencentral"
    CONTAINER_APP_NAME="ca-image-gen"
    CONTAINER_IMAGE="mcr.microsoft.com/k8se/gpu-quickstart:latest"
    WORKLOAD_PROFILE_NAME="NC8as-T4"
    WORKLOAD_PROFILE_TYPE="Consumption-GPU-NC8as-T4"
    ```

    This script defines the configuration values used throughout the deployment. The `WORKLOAD_PROFILE_TYPE` specifies the NVIDIA T4 GPU configuration.

1. Create the resource group:

    ```bash
    az group create \
      --name $RESOURCE_GROUP \
      --location $LOCATION \
      --query "properties.provisioningState" \
      --output tsv
    ```

    The command creates a resource group in Sweden Central, which supports GPU workload profiles. The output should display `Succeeded`.

1. Create the Container Apps environment:

    ```bash
    az containerapp env create \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --query "properties.provisioningState" \
      --output tsv
    ```

    This command creates the managed environment that hosts your container apps. The output should display `Succeeded`.

1. Add the GPU workload profile to your environment:

    ```bash
    az containerapp env workload-profile add \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --workload-profile-name $WORKLOAD_PROFILE_NAME \
      --workload-profile-type $WORKLOAD_PROFILE_TYPE
    ```

    This command adds the NVIDIA T4 GPU workload profile to your environment. The profile enables GPU compute for containers that require it.

1. Create the container app with GPU support:

    ```bash
    az containerapp create \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT_NAME \
      --image $CONTAINER_IMAGE \
      --target-port 80 \
      --ingress external \
      --cpu 8.0 \
      --memory 56.0Gi \
      --workload-profile-name $WORKLOAD_PROFILE_NAME \
      --query properties.configuration.ingress.fqdn \
      --output tsv
    ```

    This command creates the container app and assigns it to the GPU workload profile. The `--cpu` and `--memory` values match the T4 profile requirements. The command outputs the application URL.

1. Copy the output URL for testing in the next section.

::: zone-end

## Test the image generation API

> [!NOTE]
> The first request takes one to two minutes while the model downloads (approximately 5 GB) and loads into GPU memory. Subsequent requests complete in 5-15 seconds.

### Verify the application is running

Open the application URL in a browser. You should see the image generation interface.

### Generate an image using the UI

1. In the text field, enter a prompt such as:

    ```text
    A friendly robot chef cooking pasta in a cozy kitchen, digital art style
    ```

1. Select **Generate Image**.

1. Wait for the image to appear. The first generation takes longer due to model loading.

### Generate an image using the API (Functions deployment)

If you deployed the Azure Functions version, you can call the API directly:

```bash
curl -X POST "https://<YOUR-FUNCTION-URL>/api/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A friendly robot chef cooking pasta in a cozy kitchen",
    "num_steps": 25
  }'
```

Replace `<YOUR-FUNCTION-URL>` with your actual function app URL. The `num_steps` parameter controls image quality (higher values produce better results but takes longer).

Expected response format:

```json
{
  "success": true,
  "image": "iVBORw0KGgoAAAANSUhEUgAA...(base64 PNG data)..."
}
```

The response contains a base64-encoded PNG image that you can decode and save.

## Monitor GPU usage

Monitoring helps you understand GPU utilization and optimize costs.

### View GPU status in the console

1. In the Azure portal, go to your container app.

1. Under **Monitoring**, select **Console**.

1. Select your replica and container.

1. Select **Reconnect**, and then choose **/bin/bash** as the startup command.

1. Run the following command to view GPU status:

    ```bash
    nvidia-smi
    ```

    The output shows GPU memory usage, utilization percentage, and running processes.

### View metrics in Azure Monitor

1. In the Azure portal, go to your container app.

1. Under **Monitoring**, select **Metrics**.

1. Add metrics for:
   * **CPU Usage**
   * **Memory Usage**
   * **Replica Count**

For detailed observability options, see [Monitor Azure Container Apps](observability.md).

### Optimize cold start performance

To reduce cold start time for production workloads:

1. **Enable artifact streaming** to speed up container image pulls.

1. **Set minimum replicas** to 1 to keep an instance warm:

    ```bash
    az containerapp update \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --min-replicas 1
    ```

    This command keeps one instance always running, eliminating cold start delays but incurring continuous costs.

For more optimization techniques, see [Improve cold start for serverless GPUs](gpu-serverless-overview.md#improve-gpu-cold-start).

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| "GPU quota exceeded" error | No GPU quota approved | [Request GPU quota](https://aka.ms/aca-gpu-request) and wait for approval |
| Container fails to start | Image pull timeout | Enable artifact streaming or use a smaller base image |
| First request times out | Model download in progress | Wait 2-3 minutes and retry. This short delay is expected behavior. |
| "CUDA out of memory" error | Model exceeds GPU memory | Reduce batch size or use a smaller model variant |
| 502 Bad Gateway | Container not ready | Check container logs; ensure health probes are configured |
| Slow image generation | Insufficient inference steps | Increase `num_steps` parameter (higher values = better quality, slower) |

To view container logs for debugging:

```bash
az containerapp logs show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --follow
```

This command streams real-time logs from your container, helping you identify startup issues or runtime errors.

## Clean up resources

When you finish with the resources, delete them to avoid ongoing charges.

::: zone pivot="azure-portal"

1. In the Azure portal, search for **Resource groups**.

1. Select the resource group you created (for example, `rg-gpu-image-gen`).

1. Select **Delete resource group**.

1. To confirm deletion, enter the resource group name.

1. Select **Delete**.

::: zone-end

::: zone pivot="azure-cli"

If you deployed by using Azure Developer CLI:

```bash
azd down
```

If you deployed by using Azure CLI:

```bash
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

The `--no-wait` flag returns immediately while deletion continues in the background.

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Improve cold start for serverless GPUs](gpu-serverless-overview.md#improve-gpu-cold-start)
