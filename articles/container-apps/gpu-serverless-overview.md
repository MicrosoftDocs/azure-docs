---
title: Using serverless GPUs in Azure Container Apps (preview)
description: Learn to how to use GPUs with apps and jobs in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 11/06/2024
ms.author: cshoe
---

# Using serverless GPUs in Azure Container Apps (preview)

Azure Container Apps provides access to GPUs on-demand without you having to manage the underlying infrastructure. As a serverless feature, you only pay for GPUs in use. When enabled, the number of GPUs used for your app rises and falls to meet the load demands of your application. Serverless GPUs enable you to seamlessly run your workloads with automatic scaling, optimized cold start, per-second billing with scale down to zero when not in use, and reduced operational overhead. 

Serverless GPUs are only supported for Consumption workload profiles. The feature is not supported for Consumption-only environments.

> [!NOTE]
> Access to GPUs is only available after you request GPU quotas. You can submit your GPU quota request via a [customer support case](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Benefits

Serverless GPUs accelerate AI development by allowing you to focus on your core AI code and less on managing infrastructure when using GPUs. This feature provides a middle layer option between the [Azure AI model catalog](/azure/machine-learning/concept-model-catalog)'s serverless APIs and hosting models on managed compute.

The Container Apps serverless GPU support provides full data governance as your data never leaves the boundaries of your container while still providing a managed, serverless platform from which to build your applications.

When you use serverless GPUs in Container Apps, your apps get:

- **Scale-to zero GPUs**: Support for automatic serverless scaling of NVIDIA A100 and NVIDIA T4 GPUs.

- **Per-second billing**: Pay only for the GPU compute you use.

- **Built-in data governance**: Your data never leaves the container boundary.

- **Flexible compute options**: You can choose between the NVIDIA A100 or T4 GPU types.

- **Middle-layer for AI development**: Bring your own model on a managed, serverless compute platform.

## Common scenarios

The following scenarios, while not comprehensive, describe common use cases for serverless GPUs.

- **Real-time and batch inferencing**: Using custom open-source models with fast startup times, automatic scaling, and a per-second billing model. Serverless GPUs are ideal for dynamic applications. You pay only for the compute you use, and your apps automatically scale in and out to meet demand.

- **Machine learning scenarios**: Significantly speed up applications that implement fine-tuned custom generative AI models, deep learning, neural networks, or large-scale data analysis.

- **High-Performance Computing (HPC)**: Applications that require complex calculations and simulations, such as scientific computing, financial modeling, or weather forecasting use GPUs as resources for high computational demands.

- **Rendering and Visualization**: Applications that involve 3D rendering, image processing, or video transcoding often use GPUs to accelerate rendering process and enable real-time visualization.

- **Big Data Analytics**: GPUs can accelerate data processing and analysis among massive datasets.

## Considerations

Keep in mind the following items as you use serverless GPUs:

- **CUDA version**: Serverless GPUs support the latest CUDA version

- **Support limitations**:
  - Only one container in an app can use the GPU at a time. If you have multiple containers in an app, the first container gets access to the GPU.
  - Multiple apps can share the same GPU workload profile but each requires their own replica.
  - Multi and fractional GPU replicas aren't supported.
  - The first container in your application gets access to the GPU.

- **IP addresses**: Consumption GPUs use one IP address per replica when you set up integration with your own virtual network.

## Request serverless GPU quota

Access to this feature is only available after you have serverless GPU quota. You can submit your GPU quota request via a [customer support case](/azure/azure-portal/supportability/how-to-create-azure-support-request). When opening a support case for a GPU quota request, select issue type "Technical."

> [!NOTE]
> Customers with enterprise agreements have a single T4 GPU quota enabled by default.

## Supported regions

Serverless GPUs are available in preview in the *West US 3*, *Australia East*, and *Sweden Central* regions.

## Use serverless GPUs

When you create a container app through the Azure portal, you can set up your container to use GPU resources.

In the *Container* tab of the create process, set the following settings:

1. Under the *Container resource allocation* section, check the **GPU** checkbox.

1. For the *GPU Type**, select either the NVIDIA A100 or NVIDIA T4 option.

## Manage serverless GPU workload profile

Serverless GPUs are run on consumption GPU workload profiles. You manage a consumption GPU workload profile in the same manner as any other workload profile. You can manage your workload profile using the [CLI](workload-profiles-manage-cli.md) or the [Azure portal](workload-profiles-manage-portal.md).

## Improve GPU cold start

You can improve cold start on your GPU-enabled containers by enabling artifact streaming on your Azure Container Registry.

> [!NOTE]
> To use artifact streaming, your container images must be hosted in Azure Container Registry.

Use the following steps to enable image streaming:

1. Open your Azure Container Registry in the Azure portal.

1. Search for **Repositories**, and select **Repositories**.

1. Select your repository name.

1. From the *Repository* window, select **Start artifact streaming**.

1. Select the image tag that you want to stream.

1. In the window that pops up, select **Create streaming artifact**.

## Submit feedback

Submit issue to the [Azure Container Apps GitHub repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Generate images using serverless GPUs](gpu-image-generation.md)
