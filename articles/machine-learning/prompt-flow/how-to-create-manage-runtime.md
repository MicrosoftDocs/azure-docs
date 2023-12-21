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

To assign role, you need to have `owner` or have `Microsoft.Authorization/roleAssignments/write` permission on the resource.

To use the runtime, assigning the `AzureML Data Scientist` role of workspace to user (if using Compute instance as runtime) or endpoint (if using managed online endpoint as runtime). To learn more, see [Manage access to an Azure Machine Learning workspace](../how-to-assign-roles.md?view=azureml-api-2&tabs=labeler&preserve-view=true)

Role assignment might take several minutes to take effect.

## Permissions and roles for deployments

After deploying a prompt flow, the endpoint must be assigned the `AzureML Data Scientist` role to the workspace for successful inferencing. This operation can be done at any point after the endpoint has been created.

## Create a runtime on the UI

Before you use Azure Machine Learning studio to create a runtime, make sure that:

- You have the `AzureML Data Scientist` role in the workspace.
- The default data store (usually `workspaceblobstore`) in your workspace is the blob type.
- `workspaceworkingdirectory` exists in the workspace.
- If you use a virtual network for prompt, you understand the considerations in [Network isolation in prompt flow](how-to-secure-prompt-flow.md).

### Create an automatic runtime (preview) on a flow page

Automatic is the default option for runtime, you can start automatic runtime (preview) in runtime dropdown on a flow page.

> [!IMPORTANT]
> Automatic runtime is currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

1. Start creates automatic runtime (preview) using the environment defined in`flow.dag.yaml` in flow folder on the VM size you have quota in the workspace.

    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-create-automatic-init.png" alt-text="Screenshot of prompt flow on the start automatic with default settings on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-create-automatic-init.png":::

2. Start with advanced settings, you can customize the VM size used by the runtime. You can also customize the idle time, which will delete runtime automatically if it isn't in use to save code. Meanwhile, you can set the user assigned manage identity used by automatic runtime, it's used to pull base image (please make sure user assigned manage identity have ACR pull permission) and install packages. If you don't set it, we use user identity as default. Learn more about [how to create update user assigned identities to workspace](../how-to-identity-based-service-authentication.md#to-create-a-workspace-with-multiple-user-assigned-identities-use-one-of-the-following-methods).

    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-automatic-settings.png" alt-text="Screenshot of prompt flow on the start automatic with advanced setting on a flow page." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-automatic-settings.png":::

### Create a compute instance runtime on a runtime page

If you don't have a compute instance, create a new one: [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md).

1. Select add runtime in runtime list page.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png" alt-text="Screenshot of prompt flow on the runtime add with compute instance runtime selected." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png":::
1. Select compute instance you want to use as runtime.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png" alt-text="Screenshot of add compute instance runtime with select compute instance highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png":::
    Because compute instances is isolated by user, you can only see your own compute instances or the ones assigned to you. To learn more, see [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md).
1. Authenticate on the compute instance. You only need to do auth one time per region in six months.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-authentication.png" alt-text="Screenshot of doing the authentication on compute instance." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-authentication.png":::
1. Select create new custom application or existing custom application as runtime:

   - Select create new custom application as runtime.

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png" alt-text="Screenshot of add compute instance runtime with custom application highlighted." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png":::

     This is recommended for most users of prompt flow. The prompt flow system creates a new custom application on a compute instance as a runtime.

     To choose the default environment, select this option. This is the recommended choice for new users of prompt flow.

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png" alt-text="Screenshot of add compute instance runtime with environment highlighted." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png":::

     If you want to install other packages in your project, you should create a custom environment. To learn how to build your own custom environment, see [Customize environment with docker context for runtime](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime).

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png" alt-text="Screenshot of add compute instance runtime with customized environment and choose an environment highlighted." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png":::

     > [!NOTE]
     > We are going to perform an automatic restart of your compute instance. Please ensure that you do not have any tasks or jobs running on it, as they may be affected by the restart.

   - To use an existing custom application as a runtime, choose the option "existing".

     This option is available if you have previously created a custom application on a compute instance. For more information on how to create and use a custom application as a runtime, learn more about [how to create custom application as runtime](how-to-customize-environment-runtime.md#create-a-custom-application-on-compute-instance-that-can-be-used-as-prompt-flow-compute-instance-runtime).

     :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png" alt-text="Screenshot of add compute instance runtime with custom application dropdown highlighted." lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png":::

## Use a runtime in prompt flow authoring

When you're authoring your prompt flow, you can select and change the runtime from left top corner of the flow page.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png" alt-text="Screenshot of Chat with Wikipedia with the runtime dropdown highlighted." lightbox = "./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png":::

When performing evaluation, you can use the original runtime in the flow or change to a more powerful runtime.

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
