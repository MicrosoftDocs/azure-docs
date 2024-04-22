---
title: Create and manage prompt flow compute sessions
titleSuffix: Azure AI Studio
description: Learn how to create and manage prompt flow compute sessions in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 04/22/2024
ms.reviewer: eur
ms.author: sgilley
author: sdgilley
---

# Create and manage prompt flow compute sessions in Azure AI Studio

In Azure AI Studio, you can create and manage prompt flow compute sessions. You need a compute session to use prompt flow.

A prompt flow compute session has computing resources that are required for the application to run, including a Docker image that contains all necessary dependency packages. In addition to flow execution, Azure AI Studio uses the compute session to ensure the accuracy and functionality of the tools incorporated within the flow when you make updates to the prompt or code content.

## Create a compute session

Sign in to [Azure AI Studio](https://ai.azure.com) and select your prompt flow.

Then select **Start compute session** from the top toolbar.

- Select the button **Start compute session**, or select **Start compute session** after using the arrow to drop down the list. The automatic compute session uses the environment defined in `flow.dag.yaml` in the [flow folder](flow-develop.md#authoring-the-flow). It runs on a serverless compute with a virtual machine (VM) size for which you have sufficient quota in your workspace.

  :::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-init.png" alt-text="Screenshot of prompt flow with default settings for starting an automatic compute session on a flow page." lightbox = "../media/prompt-flow/how-to-create-manage-compute session/compute session-create-automatic-init.png":::

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
    - Select **Next** to specify the base image settings. Use the default base image or provide a custom base image.
        - If you choose a customized base image, provide the image URL and the image tag. Only images in a public docker registry or the Azure Container Registry (ACR) are supported. If you specify an image in the ACR,  make sure you (or the user assigned manage identity) have ACR pull permission.
    - Select **Next** to review your settings.
    - Select **Apply and start compute session** to start the compute session.

### Update an automatic runtime on a flow page

To manage an automatic runtime, select the **Compute session running** on the top toolbar:

- **Change compute session settings** opens the runtime configuration page, where you can define the VM side and the idle time for the runtime.
- **Install packages from requirements.txt** Open `requirements.txt` in prompt flow UI, you can add packages in it.
- **View installed packages** shows the packages that are installed in the runtime. It includes the packages baked to base image and packages specify in the `requirements.txt` file in the flow folder.
- **Reset compute session** deletes the current runtime and creates a new one with the same environment. If you encounter a package conflict, you can try this option.
- **Stop compute session** deletes the current runtime. If there's no active runtime on the underlying compute, the compute resource is also deleted.

:::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-actions.png" alt-text="Screenshot of actions for an automatic runtime on a flow page." lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-actions.png":::

You can also customize the environment that you use to run this flow by adding packages in the `requirements.txt` file in the flow folder. After you add more packages in this file, you can choose either of these options:

- **Save and install** triggers `pip install -r requirements.txt` in the flow folder. The process can take a few minutes, depending on the packages that you install.
- **Save only** just saves the `requirements.txt` file. You can install the packages later yourself.

:::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-save-install.png" alt-text="Screenshot of the option to save and install packages for an automatic runtime on a flow page." lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-save-install.png":::

> [!NOTE]
> You can change the location and even the file name of `requirements.txt`, but be sure to also change it in the `flow.dag.yaml` file in the flow folder.
>
> Don't pin the version of `promptflow` and `promptflow-tools` in `requirements.txt`, because they are already included in the runtime base image.

#### Add packages in a private feed in Azure DevOps

If you want to use a private feed in Azure DevOps, follow these steps:

1. Create a user-assigned managed identity and add this identity in the Azure DevOps organization. To learn more, see [Use service principals and managed identities](/azure/devops/integrate/get-started/authentication/service-principal-managed-identity).

   > [!NOTE]
   > If the **Add Users** button isn't visible, you probably don't have the necessary permissions to perform this action.

1. [Add or update user-assigned identities to your project](../../machine-learning/how-to-identity-based-service-authentication.md#to-create-a-workspace-with-multiple-user-assigned-identities-use-one-of-the-following-methods).

1. Add `{private}` to your private feed URL. For example, if you want to install `test_package` from `test_feed` in Azure devops, add `-i https://{private}@{test_feed_url_in_azure_devops}` in `requirements.txt`:

    ```txt
    -i https://{private}@{test_feed_url_in_azure_devops}
    test_package
    ```

1. Specify the user-assigned managed identity in **Start with advanced settings** if automatic runtime isn't running, or use the **Edit** button if automatic runtime is running.

    :::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-advanced-setting-msi.png" alt-text="Screenshot that shows the toggle for using a workspace user-assigned managed identity." lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-advanced-setting-msi.png":::

#### Change the base image for automatic runtime (preview)

By default, we use the latest prompt flow image as the base image. If you want to use a different base image, you need build your own base image, this docker image should be built from prompt flow base image that is `mcr.microsoft.com/azureml/promptflow/promptflow-runtime:<newest_version>`. If possible use the [latest version of the base image](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime/tags/list). To use the new base image, you need to reset the runtime via the `reset` command. This process takes several minutes as it pulls the new base image and reinstalls packages.

:::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-image-flow-dag.png" alt-text="Screenshot of actions for customizing a base image for an automatic runtime on a flow page." lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-image-flow-dag.png":::

```yaml
environment:
    image: <your-custom-image>
    python_requirements_txt: requirements.txt
```

## Next steps

- [Learn more about prompt flow](./prompt-flow.md)
- [Develop a flow](./flow-develop.md)
- [Develop an evaluation flow](./flow-develop-evaluation.md)
