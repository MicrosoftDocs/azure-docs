---
title: Deploy OpenAI gpt-oss models with Ollama on Azure Container Apps serverless GPUs
description: "Learn how to deploy and run OpenAIs open-source gpt-oss-120b and gpt-oss-20b language models using Ollama on Azure Container Apps with serverless GPU support."
#customer intent: As a developer, I want to deploy OpenAI's gpt-oss models on Azure Container Apps so that I can leverage serverless GPUs for scalable AI workloads.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.topic: tutorial
ms.date: 12/12/2025
---

# Deploy OpenAI gpt-oss models with Ollama on Azure Container Apps serverless GPUs

OpenAI recently announced the release of [gpt-oss-120b and gpt-oss-20b](https://openai.com/index/introducing-gpt-oss/), two new open-weight language models designed to run on lighter weight GPU resources. These models make powerful language capabilities highly accessible for developers who want to self-host language models within their own environments.

This article shows you how to deploy these models by using [Azure Container Apps serverless GPUs](./gpu-serverless-overview.md) with Ollama, providing a cost-efficient and scalable platform with minimal infrastructure overhead.

By the end of this article, you can:

> [!div class="checklist"]
> * Use Azure Container Apps serverless GPUs for AI workloads
> * Choose the right gpt-oss model for your needs
> * Deploy an Ollama container on Azure Container Apps with GPU support
> * Configure and interact with deployed models
> * Call model APIs from external applications

## Prerequisites

* **An Azure subscription**: If you don't have one, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* **Quota for serverless GPUs**: If you don't have quota, [request a GPU quota](gpu-serverless-overview.md#request-serverless-gpu-quota).

## What are Azure Container Apps serverless GPUs?

Azure Container Apps is a fully managed, serverless container platform that simplifies the deployment and operation of containerized applications. By using serverless GPU support, you can bring your own containers and deploy them to GPU-backed environments that automatically scale based on demand.

### Benefits of using serverless GPUs

Azure Container Apps serverless GPUs provide the following advantages for deploying AI models:

* **Autoscaling**: Scale to zero when idle, scale out based on demand.

* **Pay-per-second billing**: Pay only for the compute you use.

* **Ease of use**: Accelerate developer velocity and easily bring any container to run on GPUs in the cloud.

* **No infrastructure management**: Focus on your model and application.

* **Enterprise-grade features**: Built-in support for virtual networks, managed identity, private endpoints, and full data governance.

## Choose the right gpt-oss model

The [gpt-oss models](https://openai.com/index/introducing-gpt-oss/) deliver strong performance across common language benchmarks and are optimized for different use cases:

| Model | Performance | Use cases | Recommended GPU |
|-------|-------------|-----------|-----------------|
| `gpt-oss-120b` | Comparable to OpenAI's gpt-4o-mini | High-performance reasoning workloads | A100 |
| `gpt-oss-20b` | Comparable to gpt-o3-mini | Lightweight applications, cost-effective small language model (SLM) apps | T4 or A100 |

### Regional availability

Choose your deployment region based on the model you want to use and GPU availability:

| Region | A100 | T4 |
| --- | --- | --- |
| West US | ✅ | |
| West US 3 | ✅ | ✅ |
| Sweden Central | ✅ | ✅ |
| Australia East | ✅ | ✅ |
| West Europe | | ✅ |

> [!NOTE]
> To run the 120 billion parameter model, select one of the A100 regions. To run the 20 billion parameter model, select either a T4 or A100 region.

## Deploy your container app

### Step 1: Create the container app resource

1. Go to the [Azure portal](https://portal.azure.com/).

1. Select **Create a resource**.

1. Search for **Container Apps**.

1. Select **Container App** and then select **Create**.

1. On the **Basics** tab, configure the following settings:

   * Keep most default values.
   * For **Region**, select a region that supports your chosen model based on the regional availability table.

### Step 2: Configure container settings

1. Select the **Container** tab.

1. Configure the Ollama container settings:

   | Field | Value |
   | --- | --- |
   | **Image source** | Select **Docker Hub or other registries** |
   | **Image type** | Select **Public** |
   | **Registry login server** | docker.io |
   | **Image and tag** | Enter **ollama/ollama:latest** |
   | **Workload profile** | Select **Consumption** |
   | **GPU** | Select the **GPU** box |
   | **GPU type** | Select **A100** for gpt-oss:120b, select **T4**, or **A100** for gpt-oss:20b |

   > [!IMPORTANT]
   > By default, pay-as-you-go and enterprise agreement customers have quota. If you don't have quota for serverless GPUs in Azure Container Apps, [request a GPU quota](gpu-serverless-overview.md#request-serverless-gpu-quota).

### Step 3: Configure ingress

Configure ingress to allow external access to your Ollama container and enable API calls to your deployed models.

1. Select the **Ingress** tab.

1. Configure the following settings:

   | Field | Value |
   | --- | --- |
   | **Ingress** | Enabled |
   | **Ingress traffic** | Accepting traffic from anywhere |
   | **Target port** | 11434 |

1. Select **Review + Create** at the bottom of the page.

1. Select **Create** to deploy your container app.

## Deploy and use your gpt-oss model

After creating your container app with GPU support and ingress, you're ready to pull and run the gpt-oss model.

### Step 1: Access your deployed application

1. Once your deployment is complete, select **Go to resource**.

1. Note the **Application URL** for your container app. You use this URL later for API calls.

### Step 2: Pull and run the model

> [!TIP]
> Console commands in the container app aren't counted as traffic for the container app to stay scaled out, so your application might scale back after a set period. If you want the container app to remain active for a longer duration, go to **Application** > **Scaling** and set the minimum replica count to 1 or increase the cooldown period duration. Remember to reset the minimum replica count to 0 when not in use to avoid ongoing billing.

1. In the Azure portal, select the **Monitoring** dropdown, and then select **Console**.

1. Under **Choose start up command**, select **Connect**.

1. Pull the gpt-oss model by running the following command. Use `120b` or `20b` depending on which model you want to run:

   ```bash
   ollama pull gpt-oss:120b
   ```

1. Run the gpt-oss model:

   ```bash
   ollama run gpt-oss:120b
   ```

1. Test the model with a sample prompt:

   ```text
   Can you explain LLMs and recent developments in AI the last few years?
   ```

You successfully deployed and ran an OpenAI gpt-oss model on Azure Container Apps serverless GPUs.

## (Optional) Call the API from external applications

You can interact with your deployed model by using REST API calls from your local machine or other applications.

### Set up the environment

1. Open your local command line or terminal.

1. Copy your container app URL from the Azure portal.

1. Set the OLLAMA_URL environment variable:

    Make sure to replace the placeholder surrounded by `<>` with your value before running the following command.

   ```bash
   export OLLAMA_URL="<YOUR_APPLICATION_URL>"
   ```

### Make API calls

Use the following curl command to prompt the gpt-oss model:

```bash
curl -X POST "$OLLAMA_URL/api/generate" -H "Content-Type: application/json" -d '{
  "model": "gpt-oss:120b",
  "prompt": "Can you explain LLMs and recent developments in AI the last few years?",
  "stream": false
}'
```

This curl request has streaming set to false, so it returns the fully generated response.

## Clean up resources

To avoid charges on your Azure subscription, clean up the resources you created in this article.

1. In the Azure portal, go to your resource group.
1. Select **Delete resource group**.
1. To confirm the delete operation, enter your resource group name.
1. Select **Delete**.

## Next steps

Now that you successfully deployed a gpt-oss model, consider the following ways to further develop your application:

* **Add persistent storage**: Azure Container Apps is fully ephemeral and doesn't feature mounted storage by default. To persist your data and conversations, [add a volume mount to your container app](storage-mounts.md).

* **Explore other models**: Follow these same steps to run any model available in [Ollama's library](https://ollama.com/search).

* **Learn more about serverless GPUs**: Review the [Azure Container Apps serverless GPU documentation](gpu-serverless-overview.md) for advanced configuration options.

## Related content

* [Azure Container Apps serverless GPU overview](gpu-serverless-overview.md)
* [Storage mounts in Azure Container Apps](storage-mounts.md)
* [Scale rules in Azure Container Apps](scale-app.md)
