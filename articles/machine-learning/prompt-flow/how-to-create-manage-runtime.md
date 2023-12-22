---
title: Create and manage prompt flow runtimes
titleSuffix: Azure Machine Learning
description: Learn how to create and manage prompt flow runtimes in Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 09/13/2023
---

# Create and manage prompt flow runtimes in Azure Machine Learning studio

A prompt flow runtime provides computing resources that are required for the application to run, including a Docker image that contains all necessary dependency packages. This reliable and scalable runtime environment enables prompt flow to efficiently execute its tasks and functions, for a seamless user experience.

Azure Machine Learning supports the following types of runtimes:

|Runtime type|Underlying compute type|Life cycle management|Customize environment              |
|------------|----------------------|---------------------|---------------------|
|Automatic runtime (preview)        |Serverless compute| Automatic | Customized by image + `requirements.txt` in `flow.dag.yaml`|
|Compute instance runtime | Compute instance | Manual | Manually customized via Azure Machine Learning environment|

If you're a new user, we recommend that you use the automatic runtime (preview). You can easily customize the environment by adding packages in the `requirements.txt` file in `flow.dag.yaml` in the flow folder. If you're already familiar with the Azure Machine Learning environment and compute instances, you can use your existing compute instance and environment to build a compute instance runtime.

## Permissions and roles for runtime management

To assign roles, you need to have `owner` or `Microsoft.Authorization/roleAssignments/write` permission on the resource.

For users of the runtime, assign the `AzureML Data Scientist` role on the workspace (if you're using a compute instance as a runtime) or endpoint (if you're using a managed online endpoint as a runtime). To learn more, see [Manage access to an Azure Machine Learning workspace](../how-to-assign-roles.md?view=azureml-api-2&tabs=labeler&preserve-view=true).

Role assignment might take several minutes to take effect.

## Permissions and roles for deployments

After you deploy a prompt flow, the endpoint must be assigned the `AzureML Data Scientist` role to the workspace for successful inferencing. You can do this operation at any point after you create the endpoint.

## Create a runtime on the UI

Before you use Azure Machine Learning studio to create a runtime, make sure that:

- You have the `AzureML Data Scientist` role in the workspace.
- The default data store (usually `workspaceblobstore`) in your workspace is the blob type.
- `workspaceworkingdirectory` exists in the workspace.
- If you use a virtual network for prompt flow, you understand the considerations in [Network isolation in prompt flow](how-to-secure-prompt-flow.md).

### Create an automatic runtime (preview) on a flow page

Automatic is the default option for a runtime. You can start an automatic runtime (preview) from the runtime dropdown list on a flow page.

> [!IMPORTANT]
> Automatic runtime is currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

1. Start creating an automatic runtime (preview) by using the environment defined in `flow.dag.yaml` in the flow folder on the virtual machine (VM) size where you have a quota in the workspace.

    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-create-automatic-init.png" alt-text="Screenshot of prompt flow with default settings for starting an automatic runtime on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-create-automatic-init.png":::

2. In advanced settings, you can:

   - Customize the VM size that the runtime uses.
   - Customize the idle time, which saves code by deleting the runtime automatically if it isn't in use.
   - Set the user-assigned managed identity. The automatic runtime uses this identity to pull a base image and install packages. Make sure that the user-assigned managed identity has Azure Container Registry pull permission.

     If you don't set this identity, you use the user identity by default. [Learn more about how to create and update user-assigned identities for a workspace](../how-to-identity-based-service-authentication.md#to-create-a-workspace-with-multiple-user-assigned-identities-use-one-of-the-following-methods).

    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-automatic-settings.png" alt-text="Screenshot of prompt flow with advanced settings for starting an automatic runtime on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-automatic-settings.png":::

### Create a compute instance runtime on a runtime page

Before you create a compute instance runtime, make sure that you have a compute instance available and running. If you don't have a compute instance, [create one in an Azure Machine Learning workspace](../how-to-create-compute-instance.md).

1. On the page that lists runtimes, select **Create**.
  
   :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png" alt-text="Screenshot of the page that lists runtimes and the button for creating a runtime." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png":::

1. Select the compute instance that you want to use as a runtime.
  
   :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png" alt-text="Screenshot of the box for selecting a compute instance." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png":::

   Because compute instances are isolated by user, only your own compute instances (or the ones assigned to you) are available. To learn more, see [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md).

1. Select the **Authenticate** button to authenticate on the compute instance. You need to do authentication only one time per region in six months.

   :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-authentication.png" alt-text="Screenshot of the button for authenticating on a compute instance." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-authentication.png":::

1. Decide whether to create a custom application or select an existing one as a runtime:

   - To create a custom application, under **Custom application**, select **New**.

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png" alt-text="Screenshot of the option for creating a new custom application." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png":::

     We recommend this option for most users of prompt flow. The prompt flow system creates a new custom application on a compute instance as a runtime.

     Under **Environment**, if you want to use the default environment, select **Use default environment**. We recommend this choice for new users of prompt flow.

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png" alt-text="Screenshot of the option for using a default environment." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png":::

     If you want to install other packages in your project, you should use a custom environment. Select **Use customized environment**, and then choose an environment from the list that appears. To learn how to build your own custom environment, see [Customize an environment with a Docker context for a runtime](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime).

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png" alt-text="Screenshot of the option for using a customized environment, along with a list of environments." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png":::

     > [!NOTE]
     > Your compute instance restarts automatically. Ensure that you don't have any tasks or jobs running on it, because the restart might affect them.

   - To use an existing custom application as a runtime, under **Custom application**, select **Existing**. Then select an application in the **Custom application** box.

     This option is available if you previously created a custom application on a compute instance. [Learn more about how to create and use a custom application as a runtime](how-to-customize-environment-runtime.md#create-a-custom-application-on-compute-instance-that-can-be-used-as-prompt-flow-compute-instance-runtime).

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png" alt-text="Screenshot of the option to use an existing custom application and the box for selecting an application." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png":::

## Use a runtime in prompt flow authoring

When you're authoring a flow, you can select and change the runtime from the **Runtime** drop-down list on the upper right of the flow page.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png" alt-text="Screenshot of a flow page and the dropdown list for selecting a runtime." lightbox = "./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png":::

When you're performing evaluation, you can use the original runtime in the flow or change to a more powerful runtime.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-authoring-bulktest.png" alt-text="Screenshot of evaluate wizard with runtime highlighted." lightbox = "./media/how-to-create-manage-runtime/runtime-authoring-bulktest.png":::

## Update a runtime from the UI

### Update an automatic runtime (preview) on a flow page

You can operate automatic runtime (preview) on a flow page. Here are options you can use:

- Install packages, this triggers the `pip install -r requirements.txt` in flow folder. It takes minutes depends on the packages you install.
- Reset, will delete current runtime and create a new one with the same environment. If you encounter package conflict issue, you can try this option.
- Edit, will open runtime config page, you can define the VM side and idle time for the runtime.
- Stop, will delete current runtime. If there's no active runtime on underlining compute, compute resource will also be deleted.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-create-automatic-actions.png" alt-text="Screenshot of actions on automatic runtime (preview) on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-create-automatic-actions.png":::

You can also customize environment used to run this flow by adding packages in `requirements.txt` file in flow folder. After you add more packages in this file, you can choose either save and install or save only. Save and install will trigger the `pip install -r requirements.txt` in flow folder. It takes minutes depends on the packages you install. Save only will only save the `requirements.txt` file, you can install the packages later by yourself.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-create-automatic-save-install.png" alt-text="Screenshot of save and install packages for automatic runtime (preview) on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-create-automatic-save-install.png":::

#### Add packages in a private feed in Azure DevOps

If you want to use private feed in Azure DevOps, add the Managed Identity in the Azure DevOps organization. To learn more, see [Use service principals & managed identities](/azure/devops/integrate/get-started/authentication/service-principal-managed-identity)

> [!NOTE]
> If the **Add Users** button isn't visible, you probably don't have the necessary permissions to perform this action.

You need add `{private}` to your private feed url. Such as if you want to install `test_package` from `test_feed` in Azure devops, you need add `-i https://{private}@{test_feed_url_in_azure_devops}` in `requirements.txt`.

```txt
-i https://{private}@{test_feed_url_in_azure_devops}
test_package
```

By default, we use latest prompt flow image as base image. If you want to use a different base image, you can build custom base image learn more, see [Customize environment with docker context for runtime](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime), then you can use put it under `environment` in `flow.dag.yaml` file in flow folder. You need `reset` runtime to use the new base image, this takes several minutes as it pulls the new base image and install packages again.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-automatic-image-flow-dag.png" alt-text="Screenshot of customize environment for automatic runtime on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-automatic-image-flow-dag.png":::

### Update a compute instance runtime on a runtime page

We regularly update our base image (`mcr.microsoft.com/azureml/promptflow/promptflow-runtime-stable`) to include the latest features and bug fixes. We recommend that you update your runtime to the [latest version](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime-stable/tags/list) if possible.

Every time you open the runtime details page, we check whether there are new versions of the runtime. If there are new versions available, you see a notification at the top of the page. You can also manually check the latest version by selecting the **check version** button.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-update-env-notification.png" alt-text="Screenshot of the runtime detail page with checkout version highlighted." lightbox = "./media/how-to-create-manage-runtime/runtime-update-env-notification.png":::

Try to keep your runtime up to date to get the best experience and performance.

Go to the runtime details page and select the "Update" button at the top. Here you can update the environment to use in your runtime. If you select **use default environment**, system attempts to update your runtime to the latest version.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-update-env.png" alt-text="Screenshot of the runtime detail page with updated selected." lightbox = "./media/how-to-create-manage-runtime/runtime-update-env.png":::

> [!NOTE]
> If you used a custom environment, you need to rebuild it using the latest prompt flow image first, and then update your runtime with the new custom environment.

## Next steps

- [Develop a standard flow](how-to-develop-a-standard-flow.md)
- [Develop a chat flow](how-to-develop-a-chat-flow.md)
