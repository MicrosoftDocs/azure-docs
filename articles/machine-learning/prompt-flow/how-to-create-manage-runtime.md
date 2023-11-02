---
title: Create and manage runtimes in Prompt flow
titleSuffix: Azure Machine Learning
description: Learn how to create and manage runtimes in Prompt flow with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 09/13/2023
---

# Create and manage runtimes

Prompt flow's runtime provides the computing resources required for the application to run, including a Docker image that contains all necessary dependency packages. This reliable and scalable runtime environment enables prompt flow to efficiently execute its tasks and functions, ensuring a seamless user experience for users.

## Permissions/roles for runtime management

To create and use a runtime for prompt flow authoring, you need to have the `AzureML Data Scientist` role in the workspace. To learn more, see [Prerequisites](#prerequisites).

## Permissions/roles for deployments

After deploying a prompt flow, the endpoint must be assigned the `AzureML Data Scientist` role to the workspace for successful inferencing. This can be done at any point after the endpoint has been created.

## Create runtime in UI

### Prerequisites

- You need `AzureML Data Scientist` role in the workspace to create a runtime.
- Make sure the default data store in your workspace is blob type. 
- If you secure prompt flow with virtual network, please follow [Network isolation in prompt flow](how-to-secure-prompt-flow.md) to learn more detail.

> [!IMPORTANT]
> Prompt flow is **not supported** in the workspace which has data isolation enabled. The enableDataIsolation flag can only be set at the workspace creation phase and can't be updated.
>
> Prompt flow is **not supported** in the project workspace which was created with a workspace hub. The workspace hub is a private preview feature.
>

### Create compute instance runtime in UI

If you do not have a compute instance, create a new one: [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md).

1. Select add runtime in runtime list page.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png" alt-text="Screenshot of prompt flow on the runtime add with compute instance runtime selected. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png":::
1. Select compute instance you want to use as runtime.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png" alt-text="Screenshot of add compute instance runtime with select compute instance highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png":::
    Because compute instances are isolated by user, you can only see your own compute instances or the ones assigned to you. To learn more, see [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md).
1. Authenticate on the compute instance. You only need to do auth one time per region in 6 month.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-authentication.png" alt-text="Screenshot of doing the authentication on compute instance. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-authentication.png":::
1. Select create new custom application or existing custom application as runtime.
    1. Select create new custom application as runtime.
        :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png" alt-text="Screenshot of add compute instance runtime with custom application highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png":::

        This is recommended for most users of prompt flow. The prompt flow system creates a new custom application on a compute instance as a runtime.

        - To choose the default environment, select this option. This is the recommended choice for new users of prompt flow.
        :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png" alt-text="Screenshot of add compute instance runtime with environment highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png":::

        - If you want to install other packages in your project, you should create a custom environment. To learn how to build your own custom environment, see [Customize environment with docker context for runtime](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime).

         :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png" alt-text="Screenshot of add compute instance runtime with customized environment and choose an environment highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png":::

        > [!NOTE]
        > - We are going to perform an automatic restart of your compute instance. Please ensure that you do not have any tasks or jobs running on it, as they may be affected by the restart.

    1. To use an existing custom application as a runtime, choose the option "existing".
        This option is available if you have previously created a custom application on a compute instance. For more information on how to create and use a custom application as a runtime, learn more about [how to create custom application as runtime](how-to-customize-environment-runtime.md#create-a-custom-application-on-compute-instance-that-can-be-used-as-prompt-flow-runtime).

       :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png" alt-text="Screenshot of add compute instance runtime with custom application dropdown highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png":::

## Grant sufficient permissions to use the runtime

After creating the runtime, you need to grant the necessary permissions to use it.

### Permissions required to assign roles

To assign role, you need to have `owner` or have `Microsoft.Authorization/roleAssignments/write` permission on the resource.

To use the runtime, assigning the `AzureML Data Scientist` role of workspace to user (if using Compute instance as runtime) or endpoint (if using managed online endpoint as runtime). To learn more, see [Manage access to an Azure Machine Learning workspace](../how-to-assign-roles.md?view=azureml-api-2&tabs=labeler&preserve-view=true)

> [!NOTE]
> This operation may take several minutes to take effect.

## Using runtime in prompt flow authoring

When you're authoring your prompt flow, you can select and change the runtime from left top corner of the flow page.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png" alt-text="Screenshot of Chat with Wikipedia with the runtime dropdown highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png":::

When performing evaluation, you can use the original runtime in the flow or change to a more powerful runtime.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-authoring-bulktest.png" alt-text="Screenshot of evaluate wizard with runtime highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-authoring-bulktest.png":::

## Update runtime from UI

We regularly update our base image (`mcr.microsoft.com/azureml/promptflow/promptflow-runtime-stable`) to include the latest features and bug fixes. We recommend that you update your runtime to the [latest version](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime-stable/tags/list) if possible.

Every time you open the runtime details page, we'll check whether there are new versions of the runtime. If there are new versions available, you'll see a notification at the top of the page. You can also manually check the latest version by clicking the **check version** button.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-update-env-notification.png" alt-text="Screenshot of the runtime detail page with checkout version highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-update-env-notification.png":::

Try to keep your runtime up to date to get the best experience and performance.

Go to the runtime details page and select the "Update" button at the top. Here you can update the environment to use in your runtime. If you select **use default environment**, system will attempt to update your runtime to the latest version.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-update-env.png" alt-text="Screenshot of the runtime detail page with updated selected. " lightbox = "./media/how-to-create-manage-runtime/runtime-update-env.png":::

> [!NOTE]
> If you used a custom environment, you need to rebuild it using the latest prompt flow image first, and then update your runtime with the new custom environment.


## Next steps

- [Develop a standard flow](how-to-develop-a-standard-flow.md)
- [Develop a chat flow](how-to-develop-a-chat-flow.md)
