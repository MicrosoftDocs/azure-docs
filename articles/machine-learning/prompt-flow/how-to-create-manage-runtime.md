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
ms.date: 07/14/2023
---

# Create and manage runtimes (preview)

Prompt flow's runtime provides the computing resources required for the application to run, including a Docker image that contains all necessary dependency packages. This reliable and scalable runtime environment enables Prompt flow to efficiently execute its tasks and functions, ensuring a seamless user experience for users.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Runtime type

You can choose between two types of runtimes for Prompt flow: [managed online endpoint/deployment](../concept-endpoints-online.md) and [compute instance (CI)](../concept-compute-instance.md). Here are some differences between them to help you decide which one suits your needs.

| Runtime type                                 | Managed online deployment runtime | Compute instance runtime |
|----------------------------------------------|-----------------------------------|--------------------------|
| Team shared                                  | Y                                 | N                        |
| User isolation                               | N                                 | Y                        |
| OBO/identity support                         | N                                 | Y                        |
| Easily manually customization of environment | N                                 | Y                        |
| Multiple runtimes on single resource         | N                                 | Y                        |

If you're new to Prompt flow, we recommend you to start with compute instance runtime first.

## Permissions/roles need to use runtime

You need to assign enough permission to use runtime in Prompt flow. To assign a role, you need to have `owner` or have `Microsoft.Authorization/roleAssignments/write` permission on resource.

- To create runtime, you need to have `AzureML Data Scientist` role of the workspace. To learn more, see [Prerequisites](#prerequisites)
- To use a runtime in flow authoring, you or identity associate with managed online endpoint need to have `AzureML Data Scientist` role of workspace, `Storage Blob Data Contributor` and `Storage Table Data Contributor` role of workspace default storage. To learn more, see [Grant sufficient permissions to use the runtime](#grant-sufficient-permissions-to-use-the-runtime).

## Create runtime in UI

### Prerequisites

- Make sure your workspace linked with ACR, you can link an existing ACR when you're creating a new workspace, or you can trigger environment build, which may auto link ACR to Azure Machine Learning workspace. To learn more, see [How to trigger environment build in workspace](#potential-root-cause-and-solution).
- You need `AzureML Data Scientist` role of the workspace to create a runtime.

> [!IMPORTANT]
> Prompt flow is **not supported** in the workspace which has data isolation enabled. The enableDataIsolation flag can only be set at the workspace creation phase and can't be updated.
>
>Prompt flow is **not supported** in the project workspace which was created with a workspace hub. The workspace hub is a private preview feature.
>
> Prompt flow is **not supported** in workspaces that enable managed VNet. Managed VNet is a private preview feature.
>
>Prompt flow is **not supported** if you secure your Azure AI services account (Azure openAI, Azure cognitive search, Azure content safety) with virtual networks. If you want to use these as connection in prompt flow please allow access from all networks.

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

        This is recommended for most users of Prompt flow. The Prompt flow system will create a new custom application on a compute instance as a runtime.

        - To choose the default environment, select this option. This is the recommended choice for new users of Prompt flow.
        :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png" alt-text="Screenshot of add compute instance runtime with environment highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-default-env.png":::

        - If you want to install additional packages in your project, you should create a custom environment. To learn how to build your own custom environment, see [Customize environment with docker context for runtime](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime).

         :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png" alt-text="Screenshot of add compute instance runtime with customized environment and choose an environment highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-runtime-list-add-custom-env.png":::

        > [!NOTE]
        > - We are going to perform an automatic restart of your compute instance. Please ensure that you do not have any tasks or jobs running on it, as they may be affected by the restart.

    1. To use an existing custom application as a runtime, choose the option "existing".
        This option is available if you have previously created a custom application on a compute instance. For more information on how to create and use a custom application as a runtime, learn more about [how to create custom application as runtime](how-to-customize-environment-runtime.md#create-a-custom-application-on-compute-instance-that-can-be-used-as-prompt-flow-runtime).

       :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png" alt-text="Screenshot of add compute instance runtime with custom application dropdown highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-ci-existing-custom-application-ui.png":::

### Create managed online endpoint runtime in UI

1. Specify the runtime name.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-runtime-name.png" alt-text="Screenshot of add managed online deployment runtime. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-runtime-name.png":::

1. Select existing or create a new deployment as runtime
    1. Select create new deployment as runtime.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-deployment-new.png" alt-text="Screenshot of add managed online deployment runtime with deployment highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-deployment-new.png":::

        There are two options for deployment as runtime: `new` and `existing`. If you choose `new`, we'll create a new deployment for you. If you choose `existing`, you need to provide the name of an existing deployment as runtime.

        If you're new to Prompt flow, select `new` and we'll create a new deployment for you.

        - Select identity type of endpoint.
            :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-identity.png" alt-text="Screenshot of add managed online deployment runtime with endpoint identity type highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-identity.png":::
    
            You need [assign sufficient permission](#grant-sufficient-permissions-to-use-the-runtime) to system assigned identity or user assigned identity.
    
            To learn more, see [Access Azure resources from an online endpoint with a managed identity](../how-to-access-resources-from-endpoints-managed-identities.md)

        - Select environment used for this runtime.
            :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-env.png" alt-text="Screenshot of add managed online deployment runtime wizard on the environment page. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-env.png":::
            
            Follow [Customize environment with docker context for runtime](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime) to build your custom environment.

        - Choose the appropriate SKU and instance count.
        
            > [!NOTE]
            > For **Virtual machine**, since the Prompt flow runtime is memory-bound, it’s better to select a virtual machine SKU with more than 8GB of memory. For the list of supported sizes, see [Managed online endpoints SKU list](../reference-managed-online-endpoints-vm-sku-list.md).
    
             :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-compute.png" alt-text="Screenshot of add managed online deployment runtime wizard on the compute page. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-compute.png":::

            > [!NOTE]
            > Creating a managed online deployment runtime using new deployment may take several minutes.

    1. Select existing deployment as runtime.

        -  To use an existing managed online deployment as a runtime, you can choose it from the available options. Each runtime corresponds to one managed online deployment.

            :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-existing-deployment.png" alt-text="Screenshot of add managed online deployment runtime wizard on the runtime page. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-existing-deployment.png":::

        -  You can select from existing endpoint and existing deployment as runtime.

            :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-existing-deployment-select-endpoint.png" alt-text="Screenshot of add managed online deployment runtime on the endpoint page with an endpoint selected. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-existing-deployment-select-endpoint.png":::

         -  We'll verify that this deployment meets the runtime requirements.

            :::image type="content" source="./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-existing-deployment-select-deployment.png" alt-text="Screenshot of add managed online deployment runtime on the deployment page. " lightbox = "./media/how-to-create-manage-runtime/runtime-creation-mir-runtime-existing-deployment-select-deployment.png":::

    To learn, see [[how to create managed online deployment, which can be used as Prompt flow runtime](how-to-customize-environment-runtime.md#create-managed-online-deployment-that-can-be-used-as-prompt-flow-runtime).]

## Grant sufficient permissions to use the runtime

After creating the runtime, you need to grant the necessary permissions to use it.

### Permissions required to assign roles

To assign role, you need to have `owner` or have `Microsoft.Authorization/roleAssignments/write` permission on the resource.

### Assign built-in roles

To use runtime, assigning the following roles to user (if using Compute instance as runtime) or endpoint (if using managed online endpoint as runtime).

| Resource                  | Role                                  | Why do I need this?                      |
|---------------------------|---------------------------------------|------------------------------------------|
| Workspace                 | Azure Machine Learning Data Scientist | Used to write to run history, log metrics |
| Workspace default ACR     | AcrPull                               | Pull image from ACR                      |
| Workspace default storage | Storage Blob Data Contributor         | Write intermediate data and tracing data |
| Workspace default storage | Storage Table Data Contributor        | Write intermediate data and tracing data |

You can use this Azure Resource Manager template to assign these roles to your user or endpoint.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fcloga%2Fazure-quickstart-templates%2Flochen%2Fpromptflow%2Fquickstarts%2Fmicrosoft.machinelearningservices%2Fmachine-learning-prompt-flow%2Fassign-built-in-roles%2Fazuredeploy.json)

To find the minimal permissions required, and use an Azure Resource Manager template to create a custom role and assign relevant permissions, visit: [Permissions/roles need to use runtime](./how-to-create-manage-runtime.md#permissionsroles-need-to-use-runtime)

You can also assign these permissions manually through the UI.

- Select top-right corner to access the Azure Machine Learning workspace detail page.
    :::image type="content" source="./media/how-to-create-manage-runtime/mir-without-acr-runtime-workspace-top-right.png" alt-text="Screenshot of the Azure Machine Learning workspace detail page. " lightbox = "./media/how-to-create-manage-runtime/mir-without-acr-runtime-workspace-top-right.png":::
- Locate the **default storage account** and **ACR** on the Azure Machine Learning workspace detail page.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-permission-workspace-detail-storage-acr.png" alt-text="Screenshot of Azure Machine Learning workspace detail page with storage account and ACR highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-permission-workspace-detail-storage-acr.png":::
- Navigate to `access control` to grant the relevant roles to the workspace, storage account, and ACR. 
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-permission-workspace-access-control.png" alt-text="Screenshot of the access control page highlighting the add role assignment button. " lightbox = "./media/how-to-create-manage-runtime/runtime-permission-workspace-access-control.png":::
- Select user if you're using compute instance
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-permission-rbac-user.png" alt-text="Screenshot of add role assignment with assign access to highlighted. " lightbox = "./media/how-to-create-manage-runtime/runtime-permission-rbac-user.png":::
- Alternatively, choose the managed identity and machine learning online endpoint for the MIR runtime.
    :::image type="content" source="./media/how-to-create-manage-runtime/runtime-permission-rbac-msi.png" alt-text="Screenshot of add role assignment with assign access to highlighted and managed identity selected. " lightbox = "./media/how-to-create-manage-runtime/runtime-permission-rbac-msi.png":::

    > [!NOTE]
    > This operation may take several minutes to take effect.
    > If your compute instance behind VNet, please follow [Compute instance behind VNet](#compute-instance-behind-vnet) to configure the network.

To learn more:
- [Manage access to an Azure Machine Learning workspace](../how-to-assign-roles.md?view=azureml-api-2&tabs=labeler&preserve-view=true)
- [Assign an Azure role for access to blob data](../../storage/blobs/assign-azure-role-data-access.md?tabs=portal)
- [Azure Container Registry roles and permissions](../../container-registry/container-registry-roles.md?tabs=azure-cli)

## Using runtime in Prompt flow authoring

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

## Troubleshooting guide for runtime

### Common issues

#### Failed to perform workspace run operations due to invalid authentication

:::image type="content" source="./media/how-to-create-manage-runtime/mir-without-ds-permission.png" alt-text="Screenshot of a long error on the flow page. " lightbox = "./media/how-to-create-manage-runtime/mir-without-ds-permission.png":::

This means the identity of the managed endpoint doesn't have enough permissions, see [Grant sufficient permissions to use the runtime](#grant-sufficient-permissions-to-use-the-runtime) to grant sufficient permissions to the identity or user.

If you just assigned the permissions, it will take a few minutes to take effect.

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

    Please contact the Prompt Flow team ([promptflow-eng](mailto:aml-pt-eng@microsoft.com)) with the runtime logs. We'll try to identify the root cause.

### Compute instance runtime related

#### How to find the compute instance runtime log for further investigation?

Go to the compute instance terminal and run  `docker logs -<runtime_container_name>`

#### User doesn't have access to this compute instance. Please check if this compute instance is assigned to you and you have access to the workspace. Additionally, verify that you are on the correct network to access this compute instance.

:::image type="content" source="./media/how-to-create-manage-runtime/ci-flow-clone-others.png" alt-text="Screenshot of a do not have access error on the flow page. " lightbox = "./media/how-to-create-manage-runtime/ci-flow-clone-others.png":::

This because you're cloning a flow from others that is using compute instance as runtime. As compute instance runtime is user isolated, you need to create your own compute instance runtime or select a managed online deployment/endpoint runtime, which can be shared with others.

#### Compute instance behind VNet

If your compute instance is behind a VNet, you need to make the following changes to ensure that your compute instance can be used in prompt flow:
- See [required-public-internet-access](../how-to-secure-workspace-vnet.md#required-public-internet-access) to set your compute instance network configuration.
- If your storage account also behind vnet, see [Secure Azure storage accounts](../how-to-secure-workspace-vnet.md#secure-azure-storage-accounts) to create private endpoints for both table and blob.
- Make sure the managed identity of workspace have `Storage Blob Data Contributor`, `Storage Table Data Contributor` roles on the workspace default storage account.

> [!NOTE] 
> This only works if your AOAI and other cognitive services allow access from all networks.

### Managed endpoint runtime related

#### Managed endpoint failed with an internal server error. Endpoint creation was successful, but failed to create deployment for the newly created workspace.

- Runtime status shows as failed with an internal server error.
    :::image type="content" source="./media/how-to-create-manage-runtime/mir-without-acr-runtime-detail-error.png" alt-text="Screenshot of the runtime status showing failed on the runtime detail page. " lightbox = "./media/how-to-create-manage-runtime/mir-without-acr-runtime-detail-error.png":::
- Check the related endpoint.
    :::image type="content" source="./media/how-to-create-manage-runtime/mir-without-acr-runtime-detail-endpoint.png" alt-text="Screenshot of the runtime detail page, highlighting the managed endpoint. " lightbox = "./media/how-to-create-manage-runtime/mir-without-acr-runtime-detail-endpoint.png":::
- Endpoint was created successfully, but there are no deployments created.
    :::image type="content" source="./media/how-to-create-manage-runtime/mir-without-acr-runtime-endpoint-detail.png" alt-text="Screenshot of the endpoint detail page with successful creation. " lightbox = "./media/how-to-create-manage-runtime/mir-without-acr-runtime-endpoint-detail.png":::

##### Potential root cause and solution

The issue may occur when you create a managed endpoint using a system-assigned identity. The system tries to grant ACR pull permission to this identity, but for a newly created workspace, please go to the workspace detail page in Azure to check whether the workspace has a linked ACR.

:::image type="content" source="./media/how-to-create-manage-runtime/mir-without-acr-runtime-workspace-top-right.png" alt-text="Screenshot of workspace detail page in Azure. " lightbox = "./media/how-to-create-manage-runtime/mir-without-acr-runtime-workspace-top-right.png":::

:::image type="content" source="./media/how-to-create-manage-runtime/mir-without-acr-runtime-workspace-non-acr.png" alt-text="Screenshot of the overview page with container registry highlighted. " lightbox = "./media/how-to-create-manage-runtime/mir-without-acr-runtime-workspace-non-acr.png":::

If there's no ACR, you can create a new custom environment from curated environments on the environment page.

:::image type="content" source="./media/how-to-create-manage-runtime/mir-without-acr-runtime-acr-creation.png" alt-text="Screenshot of the create environment wizard on the settings page. " lightbox = "./media/how-to-create-manage-runtime/mir-without-acr-runtime-acr-creation.png":::

After creating a new custom environment, a linked ACR will be automatically created for the workspace. You can return to the workspace detail page in Azure to confirm.

:::image type="content" source="./media/how-to-create-manage-runtime/mir-without-acr-runtime-workspace-with-acr.png" alt-text="Screenshot of the overview and workspace detail page with container registry highlighted. " lightbox = "./media/how-to-create-manage-runtime/mir-without-acr-runtime-workspace-with-acr.png":::

Delete the failed managed endpoint runtime and create a new one to test.

#### We are unable to connect to this deployment as runtime. Please make sure this deployment is ready to use.

:::image type="content" source="./media/how-to-create-manage-runtime/mir-existing-unable-connected.png" alt-text="Screenshot of. " lightbox = "./media/how-to-create-manage-runtime/mir-existing-unable-connected.png":::

If you encounter with this issue, please check the deployment status and make sure it's build on top of runtime base image. 

## Next steps

- [Develop a standard flow](how-to-develop-a-standard-flow.md)
- [Develop a chat flow](how-to-develop-a-chat-flow.md)
