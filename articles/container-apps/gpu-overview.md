---
title: Using serverless GPUs in Azure Container Apps (preview)
description: Learn to how to use GPUs with apps and jobs in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 11/01/2024
ms.author: cshoe
---

## Using serverless GPUs in Azure Container Apps (preview)

Azure Container Apps provides access to GPUs on-demand without you having to manage the underlying infrastructure. As a serverless feature, you only pay for GPUs in use. When enabled, the number of GPUs used for your app rises and falls to meet the load demands of your application.

Serverless GPUs work exclusively with both dedicated and consumption workload profiles in a Workload profiles environment. Serverless GPU support isn't available for Consumption-only environments.

> [!NOTE]
> Access to GPUs is only available after you request GPU quotas. You can submit your GPU quota request via a [customer support case](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Common scenarios

The following scenarios, while not comprehensive, describe common context where serverless GPU support might best fit the situation.

- **Machine Learning and AI**: Applications that involve deep learning, neural networks, or large-scale data analysis can use GPUs to significantly accelerate computation speed.

- **High-Performance Computing (HPC)**: Applications that require complex calculations and simulations, such as scientific computing, financial modeling, or weather forecasting use GPUs as resources for high computational demands.

- **Rendering and Visualization**: Applications that involve 3D rendering, image processing, or video transcoding often use GPUs to accelerate rendering process and enable real-time visualization.

- **Big Data Analytics**: GPUs can accelerate data processing and analysis among massive datasets.

- **Virtual Desktops and Workstations**: GPUs can provide the resources needed to support virtual desktops with high-end graphics capabilities.

## Requirements

The following items are required for you to use serverless GPUs in your workload profile.

- **CUDA version**: Your application must run the latest CUDA version.

- **Single container**: Only one container in an app can use the GPU at a time. Multiple apps can share the same GPU workload profile but each requires their own replica.

- **Request GPU access**: Access to GPUs is only available after you request GPU quotas. You can submit your GPU quota request via a customer support case.

## Use consumption GPUs

Select **enable GPU** checkbox. TODO:

## Feedback

Submit issue to the [Azure Container Apps GitHub repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Generate images using serverless GPUs](gpu-image-generation.md)
