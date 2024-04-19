---
title: Create and manage prompt flow runtimes
titleSuffix: Azure AI Studio
description: Learn how to create and manage prompt flow runtimes in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 2/22/2024
ms.reviewer: eur
ms.author: sgilley
author: sdgilley
---

# Create and manage prompt flow runtimes in Azure AI Studio

In Azure AI Studio, you can create and manage prompt flow runtimes. You need a runtime to use prompt flow.

A prompt flow runtime has computing resources that are required for the application to run, including a Docker image that contains all necessary dependency packages. In addition to flow execution, Azure AI Studio uses the runtime to ensure the accuracy and functionality of the tools incorporated within the flow when you make updates to the prompt or code content.

## Create a runtime on a flow page

You can start a runtime by selecting an option from the runtime dropdown list on a flow page:

Sign in to [Azure AI Studio](https://ai.azure.com) and select your prompt flow.

Then select either **Start** or **Start with advanced settings** from the runtime dropdown list.

- Select **Start**. Start creating an automatic runtime by using the environment defined in `flow.dag.yaml` in the flow folder, it runs on the virtual machine (VM) size of serverless compute which you have enough quota in the workspace.

  :::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-init.png" alt-text="Screenshot of prompt flow with default settings for starting an automatic runtime on a flow page." lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-init.png":::

- Select **Start with advanced settings**. In the advanced settings, you can:

  - Select compute type. You can choose between serverless compute and compute instance. 
    - If you choose serverless compute, you can set following settings:
        - Customize the VM size that the runtime uses.
        - Customize the idle time, which saves code by deleting the runtime automatically if it isn't in use.
        - Set the user-assigned managed identity. The automatic runtime uses this identity to pull a base image and install packages. Make sure that the user-assigned managed identity has Azure Container Registry pull permission.
            
            If you don't set this identity, we use the user identity by default. [Learn more about how to create and update user-assigned identities for a workspace](../../machine-learning/how-to-identity-based-service-authentication.md#to-create-a-workspace-with-multiple-user-assigned-identities-use-one-of-the-following-methods).

            :::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-settings.png" alt-text="Screenshot of prompt flow with advanced settings using serverless compute for starting an automatic runtime on a flow page." lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-settings.png":::

## Create a compute instance runtime on a runtime page

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select your project. If you don't have a project, create one.

1. On the collapsible left menu, select **Settings**.

1. In the **Compute instances** section, select **View all**.

    :::image type="content" source="../media/compute/compute-view-settings.png" alt-text="Screenshot of project settings with the option to view all compute instances." lightbox="../media/compute/compute-view-settings.png":::

1. Make sure that a compute instance is available and running. If you don't have a compute instance, select **New** to create one.

1. Select the **Prompt flow runtimes** tab.

    :::image type="content" source="../media/compute/compute-runtime.png" alt-text="Screenshot of where to select prompt flow runtimes from the compute instances page." lightbox="../media/compute/compute-runtime.png":::

1. Select **Create**.

    :::image type="content" source="../media/compute/runtime-create.png" alt-text="Screenshot of the button for creating a runtime." lightbox="../media/compute/runtime-create.png":::

1. Select the compute instance for the runtime, and then select **Create**.

    :::image type="content" source="../media/compute/runtime-select-compute.png" alt-text="Screenshot of the option to select a compute instance during runtime creation." lightbox="../media/compute/runtime-select-compute.png":::

1. Acknowledge the warning that the compute instance will be restarted by selecting **Confirm**.

1. On the page for runtime details, monitor the status of the runtime. The runtime has a status of **Not available** until it's ready. This process can take a few minutes.

    :::image type="content" source="../media/compute/runtime-creation-in-progress.png" alt-text="Screenshot of a runtime with a status that shows it's not yet available." lightbox="../media/compute/runtime-creation-in-progress.png":::

1. When the runtime is ready, the status changes to **Running**. You might need to select **Refresh** to see the updated status.

    :::image type="content" source="../media/compute/runtime-running.png" alt-text="Screenshot of a runtime with a running status." lightbox="../media/compute/runtime-running.png":::

1. Select the runtime on the **Prompt flow runtimes** tab to see its details.

    :::image type="content" source="../media/compute/runtime-details.png" alt-text="Screenshot of runtime details, including environment." lightbox="../media/compute/runtime-details.png":::

## Update a runtime

Azure AI Studio gets regular updates to the base image (`mcr.microsoft.com/azureml/promptflow/promptflow-runtime-stable`) to include the latest features and bug fixes. To get the best experience and performance, periodically update your runtime to the [latest version](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime-stable/tags/list).

Go to the page for runtime details and select **Update**. 

Every time you open the page for runtime details, AI Studio checks whether there are new versions of the runtime. If new versions are available, a notification appears at the top of the page. You can also manually check the latest version by selecting the **Check version** button.

## Next steps

- [Learn more about prompt flow](./prompt-flow.md)
- [Develop a flow](./flow-develop.md)
- [Develop an evaluation flow](./flow-develop-evaluation.md)
