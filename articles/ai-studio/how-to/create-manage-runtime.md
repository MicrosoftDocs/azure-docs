---
title: Create and manage prompt flow compute sessions
titleSuffix: Azure AI Studio
description: Learn how to create and manage prompt flow compute sessions in Azure AI Studio.
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

# Create and manage prompt flow compute sessions in Azure AI Studio

In Azure AI Studio, you can create and manage prompt flow compute sessions. You need a compute session to use prompt flow.

A prompt flow compute session has computing resources that are required for the application to run, including a Docker image that contains all necessary dependency packages. In addition to flow execution, Azure AI Studio uses the compute session to ensure the accuracy and functionality of the tools incorporated within the flow when you make updates to the prompt or code content.

## Create a compute session 

Sign in to [Azure AI Studio](https://ai.azure.com) and select your prompt flow.

Then select **Start compute session** from top toolbar.

- Select the button **Start compute session**, or select **Start compute session** after using the arrow to drop down the list. Start creating an automatic compute session by using the environment defined in `flow.dag.yaml` in the flow folder, it runs on the virtual machine (VM) size of serverless compute which you have enough quota in the workspace.

  :::image type="content" source="../media/prompt-flow/how-to-create-manage-compute session/compute session-create-automatic-init.png" alt-text="Screenshot of prompt flow with default settings for starting an automatic compute session on a flow page." lightbox = "../media/prompt-flow/how-to-create-manage-compute session/compute session-create-automatic-init.png":::

- Use the arrow to the right to access **Start with advanced settings**. In the advanced settings, you can:
- Select **Start with advanced settings**. In the advanced settings, you can select the compute type. You can choose between serverless compute and compute instance.
    - If you choose serverless compute, you can set following settings:
        - Customize the VM size that the runtime uses.
        - Customize the idle time, which saves code by deleting the runtime automatically if it isn't in use.
        - Set the user-assigned managed identity. The automatic runtime uses this identity to pull a base image and install packages. Make sure that the user-assigned managed identity has Azure Container Registry pull permission.
            
            If you don't set this identity, we use the user identity by default. [Learn more about how to create and update user-assigned identities for a workspace](../../machine-learning/how-to-identity-based-service-authentication.md#to-create-a-workspace-with-multiple-user-assigned-identities-use-one-of-the-following-methods).

            :::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-settings.png" alt-text="Screenshot of prompt flow with advanced settings using serverless compute for starting an automatic runtime on a flow page." lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-settings.png":::

    - If you choose compute instance, you can only set idle shutdown time. 
        - As it is running on an existing compute instance the VM size is fixed and cannot change in runtime side.
        - Identity used for this runtime also is defined in compute instance, by default it uses the user identity. [Learn more about how to assign identity to compute instance](../../machine-learning/how-to-create-compute-instance.md#assign-managed-identity)
        - For the idle shutdown time it is used to define life cycle of the runtime, if the runtime is idle for the time you set, it will be deleted automatically. And of you have idle shut down enabled on compute instance, then it will continue 

            :::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-compute-instance-settings.png" alt-text="Screenshot of prompt flow with advanced settings using compute instance for starting an automatic runtime on a flow page." lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-compute-instance-settings.png":::
    - Select **Next** to specify the base image settings. You can choose between the default base image and a customized base image.
        - If you choose a customized base image, you need to provide the image URL and the image tag. Only images in a public docker registry or the Azure Container Registry are supported. If you specify image in the Azure Container Registry,  make sure you (or the user assigned manage identity) have ACR pull permission.
    - Select **Next** to review your settings.
    - Select **Apply and start compute session** to start the compute session.

## Next steps

- [Learn more about prompt flow](./prompt-flow.md)
- [Develop a flow](./flow-develop.md)
- [Develop an evaluation flow](./flow-develop-evaluation.md)
