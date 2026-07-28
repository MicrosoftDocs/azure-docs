---
title: Use GPUs with Azure Functions on Azure Container Apps
description: Learn how to create and deploy GPU-accelerated function apps on Azure Container Apps for AI inference, image processing, and machine learning workloads.
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.date: 05/14/2026
ms.topic: how-to
ms.custom:
  - build-2025
  - linux-related-content
---

# Use GPUs with Azure Functions on Azure Container Apps

In this guide, you create and deploy a GPU-enabled function app on Azure Container Apps. You package your function code with GPU libraries into a container image, then deploy it to access NVIDIA T4 or A100 GPUs on demand.

By combining Azure Functions' serverless model with GPU compute on Container Apps, you can run compute-intensive AI inference, image processing, and machine learning workloads that automatically scale based on demand. You pay only for GPU compute time when your functions are actively processing requests.

## Overview

When you host Azure Functions on [Azure Container Apps](overview.md), you can access [serverless GPUs](gpu-serverless-overview.md) with NVIDIA A100 and T4 resources. Serverless GPUs scale to zero when idle, so you're billed only for active compute time.

GPU-enabled functions require:

- A [Container Apps environment](environment.md) with GPU workload profiles
- A custom container image that includes the Functions runtime and GPU libraries (CUDA, cuDNN, AI frameworks)
- GPU quota approved for your Azure subscription

## Prerequisites

Before you start, verify that you have the following items:

- An Azure subscription with an active account. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account).
- GPU quota approved for your subscription. [Request GPU quota](gpu-serverless-overview.md#request-serverless-gpu-quota) if needed. Enterprise and pay-as-you-go subscriptions typically have A100 and T4 quota enabled by default.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.62.0 or later.
- [Azure Functions Core Tools](../azure-functions/functions-run-local.md) version 4.x.
- [Docker](https://docs.docker.com/get-docker/) installed locally to build container images.

## Container image requirements for GPU

To run Azure Functions with GPU on Container Apps, you must provide a custom container image that includes the Functions runtime, GPU libraries, and your application code. This section describes what your image must contain.

### Base image

Your container image must start with an official Azure Functions base image that includes the Functions host runtime. Choose the image that matches your runtime:

| Runtime | Base Image |
|---------|-----------|
| Python 3.11 | `mcr.microsoft.com/azure-functions/python:4-python3.11` |
| Node.js 20 | `mcr.microsoft.com/azure-functions/node:4-node20` |
| .NET 8 | `mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0` |
| Java 17 | `mcr.microsoft.com/azure-functions/java:4-java17` |
| Custom handler | `mcr.microsoft.com/azure-functions/base:4` |

The quickstart image (`mcr.microsoft.com/k8se/gpu-quickstart:latest`) is useful for testing GPU access in your environment, but it doesn't include the Functions runtime. Use it only to validate that GPU support is working.

> [!TIP]
> When you create a Functions project with `func init --docker`, the generated Dockerfile already uses the correct base image for your chosen runtime.

### CUDA and GPU libraries

Azure Container Apps provides both the NVIDIA driver and a [platform-provided CUDA runtime](gpu-serverless-overview.md#gpu-software-stack) (currently CUDA 12.x). If your application can use the platform CUDA version, you don't need extra CUDA setup. However, you must include AI/ML frameworks and additional libraries like cuDNN in your container image.

Choose one of these approaches:

**Recommended: Use the platform-provided CUDA runtime with GPU frameworks**

Most AI/ML frameworks like PyTorch and TensorFlow include their own CUDA runtime. Install them with the CUDA variant that matches the platform version:

```dockerfile
FROM mcr.microsoft.com/azure-functions/python:4-python3.11

# PyTorch includes CUDA runtime
RUN pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

COPY . /home/site/wwwroot
ENV AzureWebJobsScriptRoot=/home/site/wwwroot
```

**Alternative: Pin a specific CUDA version using multi-stage build**

If your application requires a CUDA version different from the platform default, use a multi-stage build:

```dockerfile
# Stage 1: CUDA runtime
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04 AS cuda-base

# Stage 2: Functions image with CUDA libraries
FROM mcr.microsoft.com/azure-functions/python:4-python3.11

# Copy CUDA libraries from the NVIDIA base image
COPY --from=cuda-base /usr/local/cuda /usr/local/cuda
ENV PATH="/usr/local/cuda/bin:${PATH}"
ENV LD_LIBRARY_PATH="/usr/local/cuda/lib64:${LD_LIBRARY_PATH}"

COPY requirements.txt /
RUN pip install -r /requirements.txt

COPY . /home/site/wwwroot
ENV AzureWebJobsScriptRoot=/home/site/wwwroot
```

> [!IMPORTANT]
> If you provide your own CUDA runtime, verify it's compatible with the NVIDIA driver version on the platform. Generally, the NVIDIA driver is backward-compatible with older CUDA versions. Check the [NVIDIA CUDA compatibility matrix](https://docs.nvidia.com/deploy/cuda-compatibility/) for details. If you use the platform-provided CUDA, verify your application works with the [current platform versions](gpu-serverless-overview.md#gpu-software-stack).

### Optimize container image size

GPU container images are typically large (5-15 GB) because they include CUDA libraries and model files. Large images increase pull times and cold start latency. Use these strategies to reduce startup time:

- Use multi-stage Docker builds to exclude build dependencies from the final image.
- Store large model files in [Azure Storage mounts](cold-start.md#manage-large-downloads) instead of bundling them in the image.
- Enable [artifact streaming](/azure/container-registry/container-registry-artifact-streaming) on your Azure Container Registry (Premium SKU required) for faster image pulls.
- Use `.dockerignore` to exclude unnecessary files from the build context.

### Sample Dockerfiles and resources

For examples and templates, see:

- [Azure Functions on Container Apps GPU sample](https://github.com/Azure-Samples/function-on-aca-gpu): Complete example with Dockerfile, function code, and deployment configuration.
- [Azure Container Apps GPU templates](https://github.com/microsoft/azure-container-apps/tree/main/templates/azml-app): Templates for deploying models to serverless GPUs.
- [Azure Functions base images](https://mcr.microsoft.com/catalog?search=functions): Official Functions runtime images for all supported languages.

## Create and deploy a GPU-enabled function app

In this section, you create a GPU-enabled function, package it in a container, and deploy it to Azure Container Apps.

### Step 1: Create a Functions project with Docker support

Run the `func init` command to create a new Functions project with a Dockerfile:

```bash
func init MyGpuFunctionApp --worker-runtime python --docker
cd MyGpuFunctionApp
```

### Step 2: Add a function

Run the `func new` command to create an HTTP-triggered function:

```bash
func new --name GpuProcess --template "HTTP trigger"
```

### Step 3: Update the Dockerfile for GPU support

Edit your `Dockerfile` to use a GPU-enabled base image and add GPU dependencies. This example uses PyTorch for AI inference:

```dockerfile
FROM mcr.microsoft.com/azure-functions/python:4-python3.11

# Install GPU dependencies
RUN pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
RUN pip install -r requirements.txt

ENV AzureWebJobsScriptRoot=/home/site/wwwroot
COPY . /home/site/wwwroot
```

> [!IMPORTANT]
> The platform provides a CUDA runtime by default. If your workload requires specific CUDA versions or additional GPU libraries, include them in your container image. Verify compatibility with the [GPU software stack versions](gpu-serverless-overview.md#gpu-software-stack) supported by Azure Container Apps.

### Step 4: Create a Container Apps environment with GPU

Set your environment variables:

```bash
RESOURCE_GROUP="myGpuFunctionRg"
ENVIRONMENT_NAME="myGpuEnv"
LOCATION="swedencentral"
```

Create a resource group:

```bash
az group create --name $RESOURCE_GROUP --location $LOCATION
```

Create a Container Apps environment:

```bash
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

Add a GPU workload profile to your environment:

```bash
az containerapp env workload-profile add \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --workload-profile-name gpu-t4 \
  --workload-profile-type Consumption-GPU-NC8as-T4
```

### Step 5: Build and push the container image

Set your container registry variables:

```bash
REGISTRY_NAME="myGpuRegistry"
```

Create a container registry (Premium SKU enables artifact streaming for faster image pulls):

```bash
az acr create \
  --name $REGISTRY_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku Premium
```

Build and push the container image:

```bash
az acr build \
  --registry $REGISTRY_NAME \
  --image my-gpu-function:v1 \
  .
```

### Step 6: Deploy the function app with GPU

Set your app variables:

```bash
APP_NAME="myGpuFunction"
```

Deploy the container app with GPU support:

```bash
az containerapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $REGISTRY_NAME.azurecr.io/my-gpu-function:v1 \
  --registry-server $REGISTRY_NAME.azurecr.io \
  --workload-profile-name gpu-t4 \
  --cpu 8.0 \
  --memory 56.0Gi \
  --ingress external \
  --target-port 80 \
  --kind functionapp \
  --min-replicas 0 \
  --max-replicas 5
```

The `--kind functionapp` flag enables Azure Functions integration. Setting `--min-replicas 0` enables scale-to-zero behavior for cost savings.

## Verify the deployment

After deployment completes, test that your function is running:

1. Get the function app URL:

   ```bash
   az containerapp show \
     --name $APP_NAME \
     --resource-group $RESOURCE_GROUP \
     --query "properties.configuration.ingress.fqdn" \
     --output tsv
   ```

1. Call your function:

```bash
curl https://<YOUR-FUNCTION-URL>/api/GpuProcess
```

If the function responds successfully, your deployment is working. You can now call it with your own data.

## Optimize cold start

GPU workloads often involve large container images and model files. These strategies reduce startup latency:

- **Enable artifact streaming**: Use [artifact streaming](/azure/container-registry/container-registry-artifact-streaming) on your Azure Container Registry (Premium SKU required) to speed up image pulls.
- **Use storage mounts**: Store large model files in an [Azure storage mount](cold-start.md#manage-large-downloads) instead of bundling them in the container image.
- **Set minimum replicas**: Set `--min-replicas 1` to keep a warm instance, eliminating cold starts. This setting incurs continuous charges, but it's worth the cost for production workloads with strict latency requirements.

For a complete tutorial that demonstrates GPU deployment with performance monitoring, see [Tutorial: Deploy AI image generation with serverless GPUs with Azure Functions on ACA](tutorial-gpu-image-generation.md).

## Considerations and limitations

Keep the following constraints in mind:

- **One GPU per container**: Only one container in a function app can access the GPU. If you use sidecars, only the first container gets GPU access.
- **Workload profiles environment required**: Serverless GPUs require a workload profiles environment. Consumption-only environments don't support GPU.
- **Region availability**: GPU workload profiles are available only in specific regions. See [supported regions](gpu-serverless-overview.md#supported-regions).
- **GPU quota required**: You must have GPU quota approved for your subscription. See [Request GPU quota](gpu-serverless-overview.md#request-serverless-gpu-quota).

## Monitor GPU usage

Use Azure Container Apps observability tools to monitor GPU utilization and application performance.

### Check GPU status in the console

1. In the Azure portal, go to your container app.
1. Select **Monitoring** > **Console**.
1. Select your replica and container, and then choose **/bin/bash**.
1. Run `nvidia-smi` to view GPU memory usage, utilization percentage, and running processes.

### View logs and metrics

1. Select **Monitoring** > **Log stream** to view real-time container logs.
1. Select **Monitoring** > **Metrics** to view CPU, memory, and replica count metrics.
1. Select **Monitoring** > **Logs** to run KQL queries against your container app's log data.

For more information on observability, see [Monitor Azure Container Apps](observability.md). You can also configure [Application Insights](../azure-functions/configure-monitoring.md) for detailed function execution telemetry.

## Next steps

- [Tutorial: Deploy AI image generation with serverless GPUs with Azure Functions on ACA](tutorial-gpu-image-generation.md): Step-by-step guide for deploying a complete image generation solution
- [Azure Functions on Azure Container Apps overview](functions-overview.md)
- [Using serverless GPUs in Azure Container Apps](gpu-serverless-overview.md)
- [Improve cold start for serverless GPUs](gpu-serverless-overview.md#improve-gpu-cold-start)
- [Monitor Azure Container Apps](observability.md)
