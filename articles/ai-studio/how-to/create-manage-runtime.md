---
title: How to create and manage prompt flow runtimes
titleSuffix: Azure AI Studio
description: Learn how to create and manage prompt flow runtimes in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# How to create and manage prompt flow runtimes in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In Azure AI Studio, you can create and manage prompt flow runtimes. You need a runtime to use prompt flow. 

Prompt flow runtime has the computing resources required for the application to run, including a Docker image that contains all necessary dependency packages. In addition to flow execution, the runtime is also utilized to validate and ensure the accuracy and functionality of the tools incorporated within the flow, when you make updates to the prompt or code content.

## Create a runtime

A runtime requires a compute instance. If you don't have a compute instance, you can [create one in Azure AI Studio](./create-manage-compute.md).

To create a prompt flow runtime in Azure AI Studio:

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select your project from the **Build** page. If you don't have a project already, first create a project.

1. From the collapsible left menu, select **Settings**.
1. In the **Compute instances** section, select **View all**.

    :::image type="content" source="../media/compute/compute-view-settings.png" alt-text="Screenshot of project settings with the option to view all compute instances." lightbox="../media/compute/compute-view-settings.png":::

1. Make sure that you have a compute instance available and running. If you don't have a compute instance, you can [create one in Azure AI Studio](./create-manage-compute.md).
1. Select the **Prompt flow runtimes** tab.

    :::image type="content" source="../media/compute/compute-runtime.png" alt-text="Screenshot of where to select prompt flow runtimes from the compute instances page." lightbox="../media/compute/compute-runtime.png":::

1. Select **Create**.

    :::image type="content" source="../media/compute/runtime-create.png" alt-text="Screenshot of the create runtime button." lightbox="../media/compute/runtime-create.png":::

1. Select a compute instance for the runtime and then select **Create**. 

    :::image type="content" source="../media/compute/runtime-select-compute.png" alt-text="Screenshot of the option to select a compute instance during runtime creation." lightbox="../media/compute/runtime-select-compute.png":::

1. Acknowledge the warning that the compute instance will be restarted and select **Confirm**.

    :::image type="content" source="../media/compute/runtime-create-confirm.png" alt-text="Screenshot of the option to confirm auto restart via the runtime creation." lightbox="../media/compute/runtime-create-confirm.png":::

1. You'll be taken to the runtime details page. The runtime will be in the **Not available** status until the runtime is ready. This can take a few minutes.

    :::image type="content" source="../media/compute/runtime-creation-in-progress.png" alt-text="Screenshot of the runtime not yet available status." lightbox="../media/compute/runtime-creation-in-progress.png":::

1. When the runtime is ready, the status will change to **Running**. You might need to select **Refresh** to see the updated status.

    :::image type="content" source="../media/compute/runtime-running.png" alt-text="Screenshot of the runtime is running status." lightbox="../media/compute/runtime-running.png":::

1. Select the runtime from the **Prompt flow runtimes** tab to see the runtime details.

    :::image type="content" source="../media/compute/runtime-details.png" alt-text="Screenshot of the runtime details including environment." lightbox="../media/compute/runtime-details.png":::


## Update runtime from UI

Azure AI Studio gets regular updates to the base image (`mcr.microsoft.com/azureml/promptflow/promptflow-runtime-stable`) to include the latest features and bug fixes. You should periodically update your runtime to the [latest version](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime-stable/tags/list) to get the best experience and performance.

Go to the runtime details page and select **Update**. Here you can update the runtime environment. If you select **use default environment**, system will attempt to update your runtime to the latest version.

Every time you view the runtime details page, AI Studio will check whether there are new versions of the runtime. If there are new versions available, you'll see a notification at the top of the page. You can also manually check the latest version by selecting the **check version** button.


## Next steps

- [Learn more about prompt flow](./prompt-flow.md)
- [Develop a flow](./flow-develop.md)
- [Develop an evaluation flow](./flow-develop-evaluation.md)
