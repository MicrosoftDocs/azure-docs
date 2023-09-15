---
title: Create and manage runtimes in Prompt flow (preview)
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

# Create and manage runtimes (preview)

Prompt flow's runtime provides the computing resources required for the application to run, including a Docker image that contains all necessary dependency packages. This reliable and scalable runtime environment enables Prompt flow to efficiently execute its tasks and functions, ensuring a seamless user experience for users.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Permissions/roles need to use runtime

You need to assign enough permission to use runtime in Prompt flow. To assign a role, you need to have `owner` or have `Microsoft.Authorization/roleAssignments/write` permission on resource.

To create and use runtime to author prompt flow, you need to have `AzureML Data Scientist` role in the workspace. To learn more, see [Prerequisites](#prerequisites)

## Create runtime in UI

### Prerequisites

- You need `AzureML Data Scientist` role in the workspace to create a runtime.

> [!IMPORTANT]
> Prompt flow is **not supported** in the workspace which has data isolation enabled. The enableDataIsolation flag can only be set at the workspace creation phase and can't be updated.
>
>Prompt flow is **not supported** in the project workspace which was created with a workspace hub. The workspace hub is a private preview feature.
>

### Create compute instance runtime in UI

If you didn't have compute instance, create a new one: [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md).

1. Select add compute instance runtime in runtime list page.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png" alt-text="Screenshot of Prompt flow on the runtime add with compute instance runtime selected. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add.png":::
1. Select compute instance you want to use as runtime.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png" alt-text="Screenshot of add compute instance runtime with select compute instance highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-ci.png":::
    Because compute instances are isolated by user, you can only see your own compute instances or the ones assigned to you. To learn more, see [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md).
1. Select create new custom application or existing custom application as runtime.
    1. Select create new custom application as runtime.
        :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png" alt-text="Screenshot of add compute instance runtime with custom application highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-runtime-select-custom-application.png":::

        This is recommended for most users of Prompt flow. The Prompt flow system creates a new custom application on a compute instance as a runtime.

        - To choose the default environment, select this option. This is the recommended choice for new users of Prompt flow.
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

When you're authoring your Prompt flow, you can select and change the runtime from left top corner of the flow page.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png" alt-text="Screenshot of Chat with Wikipedia with the runtime dropdown highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-authoring-dropdown.png":::

When performing a bulk test, you can use the original runtime in the flow or change to a more powerful runtime.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-authoring-bulktest.png" alt-text="Screenshot of the bulk run and evaluate wizard on the bulk run setting page with runtime highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-authoring-bulktest.png":::

## Update runtime from UI

We regularly update our base image (`mcr.microsoft.com/azureml/promptflow/promptflow-runtime`) to include the latest features and bug fixes. We recommend that you update your runtime to the [latest version](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime/tags/list) if possible.

Every time you open the runtime detail page, we'll check whether there are new versions of the runtime. If there are new versions available, you'll see a notification at the top of the page. You can also manually check the latest version by clicking the **check version** button.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-update-env-notification.png" alt-text="Screenshot of the runtime detail page with checkout version highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-update-env-notification.png":::

Try to keep your runtime up to date to get the best experience and performance.

Go to runtime detail page and select update button at the top. You can change new environment to update. If you select **use default environment** to update, system will attempt to update your runtime to the latest version.

:::image type="content" source="./media/how-to-create-manage-runtime/runtime-update-env.png" alt-text="Screenshot of the runtime detail page with updated selected. " lightbox = "./media/how-to-create-manage-runtime/runtime-update-env.png":::

> [!NOTE]
> If you used a custom environment, you need to rebuild it using latest prompt flow image first, and then update your runtime with the new custom environment.


### Common issues

#### My runtime is failed with a system error **runtime not ready** when using a custom environment

:::image type="content" source="./media/how-to-create-manage-runtime/ci-failed-runtime-not-ready.png" alt-text="Screenshot of a failed run on the runtime detail page. " lightbox = "./media/how-to-create-manage-runtime/ci-failed-runtime-not-ready.png":::

First, go to the Compute Instance terminal and run `docker ps` to find the root cause. 

Use  `docker images`  to check if the image was pulled successfully. If your image was pulled successfully, check if the Docker container is running. If it's already running, locate this runtime, which will attempt to restart the runtime and compute instance.

#### Run failed due to "No module named XXX"

This type error usually related to runtime lack required packages. If you're using default environment, make sure image of your runtime is using the latest version, learn more: [runtime update](#update-runtime-from-ui), if you're using custom image and you're using conda environment, make sure you have installed all required packages in your conda environment, learn more: [customize Prompt flow environment](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime).

#### Request timeout issue

##### Request timeout error shown in UI

**MIR runtime request timeout error in the UI:**

:::image type="content" source="./media/how-to-create-manage-runtime/mir-runtime-request-timeout.png" alt-text="Screenshot of a MIR runtime timeout error in the studio UI. " lightbox = "./media/how-to-create-manage-runtime/mir-runtime-request-timeout.png":::

Error in the example says "UserError: Upstream request timeout".

**Compute instance runtime request timeout error:**

:::image type="content" source="./media/how-to-create-manage-runtime/ci-runtime-request-timeout.png" alt-text="Screenshot of a compute instance runtime timeout error in the studio UI. " lightbox = "./media/how-to-create-manage-runtime/ci-runtime-request-timeout.png":::

Error in the example says "UserError: Invoking runtime gega-ci timeout, error message: The request was canceled due to the configured HttpClient.Timeout of 100 seconds elapsing".

#### How to identify which node consume the most time

1. Check the runtime logs

2. Trying to find below warning log format

    {node_name} has been running for {duration} seconds.

    For example:

   - Case 1: Python script node running for long time.

        :::image type="content" source="./media/how-to-create-manage-runtime/runtime-timeout-running-for-long-time.png" alt-text="Screenshot of a timeout run logs in the studio UI. " lightbox = "./media/how-to-create-manage-runtime/runtime-timeout-running-for-long-time.png":::

        In this case, you can find that the `PythonScriptNode` was running for a long time (almost 300s), then you can check the node details to see what's the problem.

   - Case 2: LLM node running for long time.

        :::image type="content" source="./media/how-to-create-manage-runtime/runtime-timeout-by-language-model-timeout.png" alt-text="Screenshot of a timeout logs caused by LLM timeout in the studio UI. " lightbox = "./media/how-to-create-manage-runtime/runtime-timeout-by-language-model-timeout.png":::

        In this case, if you find the message `request canceled` in the logs, it may be due to the OpenAI API call taking too long and exceeding the runtime limit.

        An OpenAI API Timeout could be caused by a network issue or a complex request that requires more processing time. For more information, see [OpenAI API Timeout](https://help.openai.com/en/articles/6897186-timeout).

        You can try waiting a few seconds and retrying your request. This usually resolves any network issues.

        If retrying doesn't work, check whether you're using a long context model, such as ‘gpt-4-32k’, and have set a large value for `max_tokens`. If so, it's expected behavior because your prompt may generate a very long response that takes longer than the interactive mode upper threshold. In this situation, we recommend trying 'Bulk test', as this mode doesn't have a timeout setting.

3. If you can't find anything in runtime logs to indicate it's a specific node issue

    Contact the Prompt Flow team ([promptflow-eng](mailto:aml-pt-eng@microsoft.com)) with the runtime logs. We'll try to identify the root cause.

### Compute instance runtime related

#### How to find the compute instance runtime log for further investigation?

Go to the compute instance terminal and run  `docker logs -<runtime_container_name>`

#### User doesn't have access to this compute instance. Please check if this compute instance is assigned to you and you have access to the workspace. Additionally, verify that you are on the correct network to access this compute instance.

:::image type="content" source="./media/how-to-create-manage-runtime/ci-flow-clone-others.png" alt-text="Screenshot of a don't have access error on the flow page. " lightbox = "./media/how-to-create-manage-runtime/ci-flow-clone-others.png":::

This because you're cloning a flow from others that is using compute instance as runtime. As compute instance runtime is user isolated, you need to create your own compute instance runtime or select a managed online deployment/endpoint runtime, which can be shared with others.

## Next steps

- [Develop a standard flow](how-to-develop-a-standard-flow.md)
- [Develop a chat flow](how-to-develop-a-chat-flow.md)