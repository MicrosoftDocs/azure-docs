---
title: Deploy a flow as a managed online endpoint for real-time inference (preview)
titleSuffix: Azure Machine Learning
description: Learn how to deploy a flow as a managed online endpoint for real-time inference with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 10/24/2023
---


# Deploy a flow as a managed online endpoint for real-time inference (preview)

After you build a flow and test it properly, you might want to deploy it as an endpoint so that you can invoke the endpoint for real-time inference.

In this article, you'll learn how to deploy a flow as a managed online endpoint for real-time inference. The steps you'll take are:

- [Test your flow and get it ready for deployment](#build-the-flow-and-get-it-ready-for-deployment)
- [Create an online endpoint](#create-an-online-endpoint)
- [Grant permissions to the endpoint](#grant-permissions-to-the-endpoint)
- [Test the endpoint](#test-the-endpoint-with-sample-data)
- [Consume the endpoint](#consume-the-endpoint)

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

1. Learn [how to build and test a flow in the Prompt flow](get-started-prompt-flow.md).

1. Have basic understanding on managed online endpoints. Managed online endpoints work with powerful CPU and GPU machines in Azure in a scalable, fully managed way that frees you from the overhead of setting up and managing the underlying deployment infrastructure. For more information on managed online endpoints, see [Online endpoints and deployments for real-time inference](../concept-endpoints-online.md#online-endpoints).
1. Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To be able to deploy an endpoint in Prompt flow, your user account must be assigned the **AzureML Data scientist** or role with more privileges for the **Azure Machine Learning workspace**.
1. Have basic understanding on managed identities. [Learn more about managed identities.](../../active-directory/managed-identities-azure-resources/overview.md)

## Build the flow and get it ready for deployment

If you already completed the [get started tutorial](get-started-prompt-flow.md), you've already tested the flow properly by submitting bulk tests and evaluating the results.

If you didn't complete the tutorial, you need to build a flow. Testing the flow properly by bulk tests and evaluation before deployment is a recommended best practice.

We'll use the sample flow **Web Classification** as example to show how to deploy the flow. This sample flow is a standard flow. Deploying chat flows is similar. Evaluation flow doesn't support deployment.

## Define the environment used by deployment

When you deploy prompt flow to managed online endpoint in UI. You need define the environment used by this flow. By default, it will use the latest prompt image version. You can specify extra packages you needed in `requirements.txt`. You can find `requirements.txt` in the root folder of your flow folder, which is system generated file.

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/requirements-text.png" alt-text="Screenshot of Web requirements-text. " lightbox = "./media/how-to-deploy-for-real-time-inference/requirements-text.png":::

## Create an online endpoint

Now that you have built a flow and tested it properly, it's time to create your online endpoint for real-time inference. 

The Prompt flow supports you to deploy endpoints from a flow, or a bulk test run. Testing your flow before deployment is recommended best practice.

In the flow authoring page or run detail page, select **Deploy**.

**Flow authoring page**:
    
:::image type="content" source="./media/how-to-deploy-for-real-time-inference/deploy-flow-authoring-page.png" alt-text="Screenshot of Web Classification on the flow authoring page. " lightbox = "./media/how-to-deploy-for-real-time-inference/deploy-flow-authoring-page.png":::
    
**Run detail page**:
    
:::image type="content" source="./media/how-to-deploy-for-real-time-inference/deploy-run-detail-page.png" alt-text="Screenshot of Web Classification on the run detail page. " lightbox = "./media/how-to-deploy-for-real-time-inference/deploy-run-detail-page.png":::

A wizard for you to configure the endpoint occurs and include following steps.

### Endpoint

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/deploy-wizard.png" alt-text="Screenshot of the deploy wizard on the endpoint page. " lightbox = "./media/how-to-deploy-for-real-time-inference/deploy-wizard.png":::

This step allows you to configure the basic settings of an endpoint.

You can select whether you want to deploy a new endpoint or update an existing endpoint. Select **New** means that a new endpoint will be created and the current flow will be deployed to the new endpoint.Select **Existing** means that the current flow will be deployed to an existing endpoint and replace the previous deployment. 
    
You can also add description and tags for you to better identify the endpoint.

#### Authentication type

The authentication method for the endpoint. Key-based authentication provides a primary and secondary key that doesn't expire. Azure Machine Learning token-based authentication provides a token that periodically refreshes automatically. For more information on authenticating, see [Authenticate to an online endpoint](../how-to-authenticate-online-endpoint.md).

#### Identity type

The endpoint needs to access Azure resources such as the Azure Container Registry or your workspace connections for inferencing. You can allow the endpoint permission to access Azure resources via giving permission to its managed identity.

System-assigned identity will be autocreated after your endpoint is created, while user-assigned identity is created by user. The advantage of user-assigned identity is that you can assign multiple endpoints with the same user-assigned identity, and you just need to grant needed permissions to the user-assigned identity once. [Learn more about managed identities.](../../active-directory/managed-identities-azure-resources/overview.md)

Select the identity you want to use, and you'll notice a warning message to remind you to grant correct permissions to the identity.

> [!IMPORTANT]
> When creating the deployment, Azure tries to pull the user container image from the workspace Azure Container Registry (ACR) and mount the user model and code artifacts into the user container from the workspace storage account.
> 
> To do these, Azure uses managed identities to access the storage account and the container registry.
>
>    - If you created the associated endpoint with **System Assigned Identity**, Azure role-based access control (RBAC) permission is automatically granted, and no further permissions are needed.
>
>    - If you created the associated endpoint with **User Assigned Identity**, the user's managed identity must have Storage blob data reader permission on the storage account for the workspace, and AcrPull permission on the Azure Container Registry (ACR) for the workspace. Make sure your User Assigned Identity has the right permission **before the deployment creation**; otherwise, the deployment creation will fail. If you need to create multiple endpoints, it is recommended to use the same user-assigned identity for all endpoints in the same workspace, so that you only need to grant the permissions to the identity once.

|Property| System Assigned Identity | User Assigned Identity|
|---|---|---|
|| if you select system assigned identity, it will be auto-created by system for this endpoint <br> | created by user. [Learn more about how to create user assigned identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity). <br> one user assigned identity can be assigned to multiple endpoints|
|Pros| Permissions needed to pull image and mount model and code artifacts from workspace storage are auto-granted.| Can be shared by multiple endpoints.|
|Required permissions|**Workspace**: **AzureML Data Scientist** role **OR** a customized role with "Microsoft.MachineLearningServices/workspaces/connections/listsecrets/action" <br> |**Workspace**: **AzureML Data Scientist** role **OR** a customized role with "Microsoft.MachineLearningServices/workspaces/connections/listsecrets/action" <br> **Workspace container registry**: **Acr pull** <br> **Workspace default storage**: **Storage Blob Data Reader**|

See detailed guidance about how to grant permissions to the endpoint identity in [Grant permissions to the endpoint](#grant-permissions-to-the-endpoint).

### Deployment

In this step, you can specify the following properties:

|Property| Description |
|---|-----|
|Deployment name| - Within the same endpoint, deployment name should be unique. <br> - If you select an existing endpoint in the previous step, and input an existing deployment name, then that deployment will be overwritten with the new configurations. |
|Inference data collection| If you enable this, the flow inputs and outputs will be auto collected in an Azure Machine Learning data asset, and can be used for later monitoring. To learn more, see [model monitoring.](how-to-monitor-generative-ai-applications.md)|
|Application Insights diagnostics| If you enable this, system metrics during inference time (such as token count, flow latency, flow request, and etc.) will be collected into workspace default Application Insights. To learn more, see [prompt flow serving metrics](#view-prompt-flow-endpoints-specific-metrics-optional).|

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/deploy-wizard-deployment.png" alt-text="Screenshot of the deployment step in the deploy wizard in the studio UI." lightbox = "./media/how-to-deploy-for-real-time-inference/deploy-wizard-deployment.png":::

### Outputs

In this step, you can view all flow outputs, and specify which outputs will be included in the response of the endpoint you deploy. By default all flow outputs are selected.

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/deploy-wizard-outputs.png" alt-text="Screenshot of the outputs step in the deploy wizard." lightbox = "./media/how-to-deploy-for-real-time-inference/deploy-wizard-outputs.png":::

### Connections

In this step, you can view all connections within your flow, and change connections used by the endpoint when it performs inference later.

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/connection.png" alt-text="Screenshot of the deploy wizard on the connections page. " lightbox = "./media/how-to-deploy-for-real-time-inference/connection.png":::

### Compute

In this step, you can select the virtual machine size and instance count for your deployment.

> [!NOTE]
> For **Virtual machine**, to ensure that your endpoint can serve smoothly, it's better to select a virtual machine SKU with more than 8GB of memory.  For the list of supported sizes, see [Managed online endpoints SKU list](../reference-managed-online-endpoints-vm-sku-list.md).
>
> For **Instance count**, base the value on the workload you expect. For high availability, we recommend that you set the value to at least 3. We reserve an extra 20% for performing upgrades. For more information, see [virtual machine quota allocation for deployment](../how-to-deploy-online-endpoints.md#virtual-machine-quota-allocation-for-deployment).

Once you configured and reviewed all the steps above, you can select **Create** to finish the creation.

> [!NOTE]
> Expect the endpoint creation to take approximately several minutes.

## Check the status of the endpoint

There will be notifications after you finish the deploy wizard. After the endpoint and deployment are created successfully, you can select **Deploy details** in the notification to endpoint detail page.

You can also directly go to the **Endpoints** page in the studio, and check the status of the endpoint you deployed.

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/successful-deployment.png" alt-text="Screenshot of the endpoint details page showing a successful deployment." lightbox = "./media/how-to-deploy-for-real-time-inference/successful-deployment.png":::

## Grant permissions to the endpoint

 > [!IMPORTANT]
 > If you select **System Assigned Identity**, make sure you have granted correct permissions by adding role assignment to the managed identity of the endpoint **before you test or consume the endpoint**. Otherwise, the endpoint will fail to perform inference due to lacking of permissions.
 > 
 > If you select **User Assigned Identity**, the user's managed identity must have Storage blob data reader permission on the storage account for the workspace, and AcrPull permission on the Azure Container Registry (ACR) for the workspace. Make sure your User Assigned Identity has the right permission **before the deployment creation** - better do it before you finisht the deploy wizard; otherwise, the deployment creation will fail. If you need to create multiple endpoints, it is recommended to use the same user-assigned identity for all endpoints in the same workspace, so that you only need to grant the permissions to the identity once.
 >
 > Granting permissions (adding role assignment) is only enabled to the **Owner** of the specific Azure resources. You may need to ask your IT admin for help.
 > 
 > It may take more than 15 minutes for the granted permission to take effect.

Following are the roles you need to assign to the managed identity of the endpoint, and why the permission of such role is needed.

For **System-assigned** identity:

|Resource|Role|Why it's needed|
|---|---|---|
|Azure Machine Learning Workspace|**AzureML Data Scientist** role **OR** a customized role with "Microsoft.MachineLearningServices/workspaces/connections/listsecrets/action" | Get workspace connections. |


For **User-assigned** identity:

|Resource|Role|Why it's needed|
|---|---|---|
|Azure Machine Learning Workspace|**AzureML Data Scientist** role **OR** a customized role with "Microsoft.MachineLearningServices/workspaces/connections/listsecrets/action" | Get workspace connections|
|Workspace container registry |Acr pull |Pull container image |
|Workspace default storage| Storage Blob Data Reader| Load model from storage |
|(Optional) Azure Machine Learning Workspace|Workspace metrics writer| After you deploy then endpoint, if you want to monitor the endpoint related metrics like CPU/GPU/Disk/Memory utilization, you need to give this permission to the identity.|


To grant permissions to the endpoint identity, there are two ways:

- You can use Azure Resource Manager template to grant all permissions. You can find related Azure Resource Manager templates in [Prompt flow GitHub repo](https://github.com/cloga/azure-quickstart-templates/tree/lochen/promptflow/quickstarts/microsoft.machinelearningservices/machine-learning-prompt-flow). 

- You can also grant all permissions in Azure portal UI by following steps.

    1. Go to the Azure Machine Learning workspace overview page in [Azure portal](https://ms.portal.azure.com/#home).
    1. Select **Access control**, and select **Add role assignment**.
        :::image type="content" source="./media/how-to-deploy-for-real-time-inference/access-control.png" alt-text="Screenshot of Access control with add role assignment highlighted. " lightbox = "./media/how-to-deploy-for-real-time-inference/access-control.png":::

    1. Select **AzureML Data Scientist**, go to **Next**.
        > [!NOTE]
        > AzureML Data Scientist is a built-in role which has permission to get workspace connections. 
        >
        > If you want to use a customized role, make sure the customized role has the permission of "Microsoft.MachineLearningServices/workspaces/connections/listsecrets/action". Learn more about [how to create custom roles](../../role-based-access-control/custom-roles-portal.md#step-3-basics).

    1. Select **Managed identity** and select members.
        For **system-assigned identity**, select **Machine learning online endpoint** under **System-assigned managed identity**, and search by endpoint name.

        :::image type="content" source="./media/how-to-deploy-for-real-time-inference/select-si.png" alt-text="Screenshot of add role assignment and select managed identities. " lightbox = "./media/how-to-deploy-for-real-time-inference/select-si.png":::

        For **user-assigned identity**, select **User-assigned managed identity**, and search by identity name.

        :::image type="content" source="./media/how-to-deploy-for-real-time-inference/select-ui.png" alt-text="Screenshot of add role assignment and select managed identities with user-assigned managed identity highlighted. " lightbox = "./media/how-to-deploy-for-real-time-inference/select-ui.png":::

    1. For user-assigned identity, you need to grant permissions to the workspace container registry as well. Go to the workspace container registry overview page, select **Access control**, and select **Add role assignment**, and assign **Acr pull |Pull container image** to the endpoint identity.
    
        :::image type="content" source="./media/how-to-deploy-for-real-time-inference/storage-container-registry.png" alt-text="Screenshot of the overview page with storage and container registry highlighted. " lightbox = "./media/how-to-deploy-for-real-time-inference/storage-container-registry.png":::

    1. Currently the permissions on workspace default storage aren't required. If you want to enable tracing data including node level outputs/trace/logs when performing inference, you can grant permissions to the workspace default storage as well. Go to the workspace default storage overview page, select **Access control**, and select **Add role assignment**, and assign *Storage Blob Data Contributor* and *Storage Table Data Contributor* to the endpoint identity respectively.

## Test the endpoint with sample data

In the endpoint detail page, switch to the **Test** tab.

If you select **Allow sharing sample input data for testing purpose only** when you deploy the endpoint, you can see the input data values are already preloaded.

If there's no sample value, you'll need to input a URL.

The **Test result** shows as following: 

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/test-endpoint.png" alt-text="Screenshot of end point detail page on the test tab. " lightbox = "./media/how-to-deploy-for-real-time-inference/test-endpoint.png":::

### Test the endpoint deployed from a chat flow

For endpoints deployed from chat flow, you can test it in an immersive chat window.

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/test-chat-endpoint.png" alt-text="Screenshot of an endpoint deployed from chat flow. " lightbox = "./media/how-to-deploy-for-real-time-inference/test-chat-endpoint.png":::

The `chat_input` was set during development of the chat flow. You can input the `chat_input` message in the input box. The **Inputs** panel on the right side is for you to specify the values for other inputs besides the `chat_input`. Learn more about [how to develop a chat flow](./how-to-develop-a-chat-flow.md).

## Consume the endpoint

In the endpoint detail page, switch to the **Consume** tab. You can find the REST endpoint and key/token to consume your endpoint. There is also sample code for you to consume the endpoint in different languages.

## View endpoint metrics 

### View managed online endpoints common metrics using Azure Monitor (optional)

You can view various metrics (request numbers, request latency, network bytes, CPU/GPU/Disk/Memory utilization, and more) for an online endpoint and its deployments by following links from the endpoint's **Details** page in the studio. Following these links take you to the exact metrics page in the Azure portal for the endpoint or deployment.

> [!NOTE]
> If you specify user-assigned identity for your endpoint, make sure that you have assigned **Workspace metrics writer** of **Azure Machine Learning Workspace** to your user-assigned identity. Otherwise, the endpoint will not be able to log the metrics.

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/view-metrics.png" alt-text="Screenshot of the endpoint detail page with view metrics highlighted. " lightbox = "./media/how-to-deploy-for-real-time-inference/view-metrics.png":::

For more information on how to view online endpoint metrics, see [Monitor online endpoints](../how-to-monitor-online-endpoints.md#metrics).

### View prompt flow endpoints specific metrics (optional)

If you enable **Application Insights diagnostics** in the UI deploy wizard, or set `app_insights_enabled=true` in the deployment definition using code, there will be following prompt flow endpoints specific metrics collected in the workspace default Application Insights.

| Metrics Name                         | Type      | Dimensions                                | Description                                                                     |
|--------------------------------------|-----------|-------------------------------------------|---------------------------------------------------------------------------------|
| token_consumption                    | counter   | - flow <br> - node<br> - llm_engine<br> - token_type:  `prompt_tokens`: LLM API input tokens;  `completion_tokens`: LLM API response tokens ; `total_tokens` = `prompt_tokens + completion tokens`          | openai token consumption metrics                                                |
| flow_latency                         | histogram | flow,response_code,streaming,response_type| request execution cost, response_type means whether it's full/firstbyte/lastbyte|
| flow_request                         | counter   | flow,response_code,exception,streaming    | flow request count                                                              |
| node_latency                         | histogram | flow,node,run_status                      | node execution cost                                                             |
| node_request                         | counter   | flow,node,exception,run_status            | node execution count                                                    |
| rpc_latency                          | histogram | flow,node,api_call                        | rpc cost                                                                        |
| rpc_request                          | counter   | flow,node,api_call,exception              | rpc count                                                                       |
| flow_streaming_response_duration     | histogram | flow                                      | streaming response sending cost, from sending first byte to sending last byte   |

You can find the workspace default Application Insights in your workspace page in Azure portal.

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/workspace-default-app-insights.png" alt-text="Screenshot of the workspace default Application Insights. " lightbox = "./media/how-to-deploy-for-real-time-inference/workspace-default-app-insights.png":::

Open the Application Insights, and select **Usage and estimated costs** from the left navigation. Select **Custom metrics (Preview)**, and select **With dimensions**, and save the change.

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/enable-multidimensional-metrics.png" alt-text="Screenshot of enable multidimensional metrics. " lightbox = "./media/how-to-deploy-for-real-time-inference/enable-multidimensional-metrics.png":::

Select **Metrics** tab in the left navigation. Select **promptflow standard metrics** from the **Metric Namespace**, and you can explore the metrics from the **Metric** dropdown list with different aggregation methods.

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/prompt-flow-metrics.png" alt-text="Screenshot of prompt flow endpoint metrics. " lightbox = "./media/how-to-deploy-for-real-time-inference/prompt-flow-metrics.png":::

## Troubleshoot endpoints deployed from prompt flow

### Model response taking too long

Sometimes, you might notice that the deployment is taking too long to respond. There are several potential factors for this to occur. 

- Model is not powerful enough (ex. use gpt over text-ada)
- Index query is not optimized and taking too long
- Flow has many steps to process

Consider optimizing the endpoint with above considerations to improve the performance of the model.

### Unable to fetch deployment schema

After you deploy the endpoint and want to test it in the **Test tab** in the endpoint detail page, if the **Test tab** shows **Unable to fetch deployment schema** like following, you can try the following 2 methods to mitigate this issue:

:::image type="content" source="./media/how-to-deploy-for-real-time-inference/unable-to-fetch-deployment-schema.png" alt-text="Screenshot of the error unable to fetch deployment schema in Test tab in endpoint detail page. " lightbox = "./media/how-to-deploy-for-real-time-inference/unable-to-fetch-deployment-schema.png":::

- Make sure you have granted the correct permission to the endpoint identity. Learn more about [how to grant permission to the endpoint identity](#grant-permissions-to-the-endpoint).
- It might be because you ran your flow in an old version runtime and then deployed the flow, the deployment used the environment of the runtime which was in old version as well. Update the runtime following [this guidance](./how-to-create-manage-runtime.md#update-runtime-from-ui) and rerun the flow in the latest runtime and then deploy the flow again.

### Access denied to list workspace secret

If you encounter error like "Access denied to list workspace secret", check whether you have granted the correct permission to the endpoint identity. Learn more about [how to grant permission to the endpoint identity](#grant-permissions-to-the-endpoint).

## Clean up resources

If you aren't going use the endpoint after completing this tutorial, you should delete the endpoint.

> [!NOTE]
> The complete deletion may take approximately 20 minutes.

## Next Steps

- [Iterate and optimize your flow by tuning prompts using variants](how-to-tune-prompts-using-variants.md)
- [View costs for an Azure Machine Learning managed online endpoint](../how-to-view-online-endpoints-costs.md)
