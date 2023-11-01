---
title: How to create and manage prompt flow runtimes
titleSuffix: Azure AI services
description: Learn how to create and manage prompt flow runtimes in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
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

1. Enter a custom name for your compute.

    :::image type="content" source="../media/compute/runtime-create.png" alt-text="Screenshot of the create runtime button." lightbox="../media/compute/runtime-create.png":::


    :::image type="content" source="../media/compute/runtime-select-compute.png" alt-text="Screenshot of the option to select a compute instance during runtime creation." lightbox="../media/compute/runtime-select-compute.png":::


    :::image type="content" source="../media/compute/runtime-create-confirm.png" alt-text="Screenshot of the option to confirm auto restart via the runtime creation." lightbox="../media/compute/runtime-create-confirm.png":::

    :::image type="content" source="../media/compute/runtime-creation-in-progress.png" alt-text="Screenshot of the runtime not yet available status." lightbox="../media/compute/runtime-creation-in-progress.png":::

    :::image type="content" source="../media/compute/runtime-running.png" alt-text="Screenshot of the runtime is running status." lightbox="../media/compute/runtime-running.png":::

    :::image type="content" source="../media/compute/runtime-details.png" alt-text="Screenshot of the runtime details including environment." lightbox="../media/compute/runtime-details.png":::



1. Select add runtime in runtime list page.
1. Select compute instance you want to use as runtime.
    Because compute instances are isolated by user, you can only see your own compute instances or the ones assigned to you. To learn more, see [Create and manage compute instance](./create-manage-compute.md).
1. Authenticate on the compute instance. You only need to do auth one time per region in 6 month.



## Using runtime in prompt flow authoring

When you're authoring your prompt flow, you can select and change the runtime from left top corner of the flow page.


When performing evaluation, you can use the original runtime in the flow or change to a more powerful runtime.


## Update runtime from UI

We regularly update our base image (`mcr.microsoft.com/azureml/promptflow/promptflow-runtime-stable`) to include the latest features and bug fixes. We recommend that you update your runtime to the [latest version](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime-stable/tags/list) if possible.

Every time you open the runtime details page, we'll check whether there are new versions of the runtime. If there are new versions available, you'll see a notification at the top of the page. You can also manually check the latest version by clicking the **check version** button.


Try to keep your runtime up to date to get the best experience and performance.

Go to the runtime details page and select the "Update" button at the top. Here you can update the environment to use in your runtime. If you select **use default environment**, system will attempt to update your runtime to the latest version.

## Next steps

- [Learn more about prompt flow](./prompt-flow.md)
- [Develop a flow](./flow-develop.md)
- [Develop an evaluation flow](./flow-develop-evaluation.md)