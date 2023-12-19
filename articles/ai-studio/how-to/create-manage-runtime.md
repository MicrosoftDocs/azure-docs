---
title: How to create and manage prompt flow runtimes
titleSuffix: Azure AI Studio
description: Learn how to create and manage prompt flow runtimes in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
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

We support following types of runtimes:

|Runtime type|Underlying compute type|Life cycle management| Customize packages              |
|------------|----------------------|---------------------|---------------------|
|automatic runtime        |Serverless compute| Automatically | Easily customize python packages|
|Compute instance runtime | Compute instance | Manually | Manually via Azure AI Studio environment.|

If you're a new user, we recommend using the automatic runtime that can be used out of box.  You can easily customize the environment for this runtime.  

If you have a compute instance, you can use it to build your compute instance runtime.

## Create a runtime

### Create automatic runtime in flow page

Automatic is the default option for runtime, you can start automatic runtime in runtime dropdown in flow page. 


1. Start creates automatic runtime using the environment defined in`flow.dag.yaml` in flow folder on the VM size you have quota in the project.

    :::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-init.png" alt-text="Screenshot of prompt flow on the start automatic with default settings on flow page. " lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-init.png":::    

2. Start with advanced settings, you can customize the VM size used by the runtime. You can also customize the idle time, which will delete runtime automatically if it isn't in use to save code. Meanwhile, you can set the user assigned manage identity used by automatic runtime, it's used to pull base image (please make sure user assigned manage identity have ACR pull permission) and install packages. If you don't set it, we use user identity as default. Learn more about [how to create update user assigned identities to project](../../machine-learning/how-to-identity-based-service-authentication.md#to-create-a-workspace-with-multiple-user-assigned-identities-use-one-of-the-following-methods).

    :::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-settings.png" alt-text="Screenshot of prompt flow on the start automatic with advanced setting on flow page. " lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-creation-automatic-settings.png":::    

### Create compute instance runtime in runtime page

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

### Update automatic runtime in flow page

You can manage automatic runtime in the flow page. Here are options you can use:
-** Install packages** triggers the `pip install -r requirements.txt` in the flow folder. It takes minutes depends on the packages you install.
- **Reset** deletes the current runtime and creates a new one with the same environment. If you encounter package conflict issue, you can try this option.
- **Edit** opens the runtime config page where you can define the VM side and idle time for the runtime.
- **Stop** deletes the current runtime. If there's no active runtime on the underlining compute, the compute resource will also be deleted.

:::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-actions.png" alt-text="Screenshot of actions on automatic runtime on flow page. " lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-actions.png":::

You can also customize the environment used to run this flow. 

- You can easily customize the environment by adding packages in `requirements.txt` file in the flow folder. After you add more packages in this file, you can choose either save and install or save only. Save and install will trigger the `pip install -r requirements.txt` in flow folder. It takes minutes depends on the packages you install. Save only will only save the `requirements.txt` file, you can install the packages later by yourself.

    :::image type="content" source="../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-save-install.png" alt-text="Screenshot of save and install packages for automatic runtime on flow page. " lightbox = "../media/prompt-flow/how-to-create-manage-runtime/runtime-create-automatic-save-install.png":::

#### Add packages in private feed in Azure DevOps

If you want to use a private feed in Azure DevOps, add the Managed Identity in the Azure DevOps organization. To learn more, see [Use service principals & managed identities](/azure/devops/integrate/get-started/authentication/service-principal-managed-identity)

> [!NOTE]
>  If the 'Add Users' button isn't visible, it's likely you don't have the necessary permissions to perform this action.

You need to add `{private}` to your private feed URL. For example, if you want to install `test_package` from `test_feed` in Azure devops, add `-i https://{private}@{test_feed_url_in_azure_devops}` in `requirements.txt`.

```txt
-i https://{private}@{test_feed_url_in_azure_devops}
test_package
```

### Update compute instance runtime in runtime page

Azure AI Studio gets regular updates to the base image (`mcr.microsoft.com/azureml/promptflow/promptflow-runtime-stable`) to include the latest features and bug fixes. You should periodically update your runtime to the [latest version](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime-stable/tags/list) to get the best experience and performance.

Go to the runtime details page and select **Update**. Here you can update the runtime environment. If you select **use default environment**, system will attempt to update your runtime to the latest version.

Every time you view the runtime details page, AI Studio will check whether there are new versions of the runtime. If there are new versions available, you'll see a notification at the top of the page. You can also manually check the latest version by selecting the **check version** button.


## Next steps

- [Learn more about prompt flow](./prompt-flow.md)
- [Develop a flow](./flow-develop.md)
- [Develop an evaluation flow](./flow-develop-evaluation.md)