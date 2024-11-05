---
title: Using serverless GPUs in Azure Container Apps (preview)
description: Learn to how to use GPUs with apps and jobs in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 11/05/2024
ms.author: cshoe
---

## Using serverless GPUs in Azure Container Apps (preview)

Azure Container Apps provides access to GPUs on-demand without you having to manage the underlying infrastructure. As a serverless feature, you only pay for GPUs in use. When enabled, the number of GPUs used for your app rises and falls to meet the load demands of your application.

Serverless GPUs work exclusively with both dedicated and consumption workload profiles in a Workload profiles environment. Serverless GPU support isn't available for Consumption-only environments.

> [!NOTE]
> Access to GPUs is only available after you request GPU quotas. You can submit your GPU quota request via a [customer support case](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Common scenarios

The following scenarios, while not comprehensive, describe common use cases for serverless GPUs.

- **Artificial Intelligence**: Applications that involve deep learning, neural networks, or large-scale data analysis can use GPUs to significantly accelerate computation speed. Including applications that support:

  - Real-time inferencing with open-source models such as Llama3
  - Batch-inferencing for periodic workloads with automatic scale-to-zero
  - Custom fine-tuning of generative AI models
  - Machine learning scenarios

- **High-Performance Computing (HPC)**: Applications that require complex calculations and simulations, such as scientific computing, financial modeling, or weather forecasting use GPUs as resources for high computational demands.

- **Rendering and Visualization**: Applications that involve 3D rendering, image processing, or video transcoding often use GPUs to accelerate rendering process and enable real-time visualization.

- **Big Data Analytics**: GPUs can accelerate data processing and analysis among massive datasets.

## Benefits

Serverless GPUs accelerate AI development by allowing you to focus on your core AI code and less on managing infrastructure when using GPUs. This feature can provide a middle layer option between the Azure AI model catalog's serverless APIs and hosting models on managed compute.

The Container Apps serverless GPU support provides full data governance as your data never leaves the boundaries of your container while still providing a managed, serverless platform from which to build your applications.

When you use serverless GPUs in Container Apps, your apps get:

- **Scale-to zero GPUs**: Support for serverless scaling of NVIDIA A100 and T4 GPUs.

- **Per-second billing**: Fine-grained cost calculations reduced down to the second.

- **Built-in data governance**: Your data never leave the container boundary.

- **Flexible compute options**: You can choose between the NVIDIA A100 or T4 compute profiles.

- **Middle-layer for AI development**: Use any AI model of your choice on a compute platform that requires no setup.

## Considerations

Keep in mind the following items as you use serverless GPUs:

- **CUDA version**: Your application must run the latest CUDA version.

- **Single container**: Only one container in an app can use the GPU at a time. Multiple apps can share the same GPU workload profile but each requires their own replica.

## Request GPU access

Access to GPUs is only available after you request GPU quotas. You can submit your GPU quota request via a [customer support case](/azure/azure-portal/supportability/how-to-create-azure-support-request).

> [!NOTE]
> Customer with enterprise agreements have a single T4 GPU quota enabled by default.

## Supported regions

Serverless GPUs are available in preview in the *West US 3* and *Australia East* regions.

## Use consumption GPUs

When you create a container app through the Azure portal, you can set up your container to use GPU resources.

In the *Container* tab of the create process, set the following settings:

1. Under the *Container resource allocation* section, check the **GPU** checkbox.

1. For the *GPU Type**, select either the A100 or T4 option.

## Reduce cold start

You can reduce cold start on your GPU-enabled containers by enabling artifact streaming. With artifact streaming, image layers are sent directly to your container app in sections instead of all at once. Splitting up the image layer into smaller pieces allows your app to bring up the image after than having to process a single large payload.

> [!NOTE]
> To use artifact streaming, your container images must be hosted in Azure Container Registry.

Use the following steps to enable image streaming:

1. Open your container registry in the Azure portal.

1. Search for **Repositories**, and then select your repository name.

1. From the *Repository* window, select **Start artifact streaming** and save your changes.

1. Select the image tag that you want to stream and select **Create streaming artifact**.

## Feedback

Submit issue to the [Azure Container Apps GitHub repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Generate images using serverless GPUs](gpu-image-generation.md)
