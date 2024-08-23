---
title: "Run batch endpoints from Event Grid events in storage"
titleSuffix: Azure Machine Learning
description: Learn how to use batch endpoints to be automatically triggered when new files are generated in storage.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: core
ms.topic: how-to
author: msakande
ms.author: mopeakande
ms.date: 10/10/2022
ms.reviewer: cacrest
ms.custom:
  - devplatv2
  - ignite-2023
---

# Run batch endpoints from Event Grid events in storage

[!INCLUDE [ml v2](includes/machine-learning-dev-v2.md)]

Event Grid is a fully managed service that you can use to easily manage events across many different Azure services and applications. The service simplifies the way that you build event-driven and serverless applications. This tutorial shows you how to trigger a batch endpoint's job to process files as soon as they're created in a storage account. The architecture uses a logic app workflow to subscribe to those events and trigger the endpoint.

The following diagram shows the architecture for this solution:

:::image type="content" source="./media/how-to-use-event-grid-batch/batch-endpoint-event-grid-arch.png" alt-text="Conceptual diagram shows the components for this architecture.":::

The following steps describe the high-level steps in this solution:

1. When a new blob is created in a specific storage account, a **file created** event is triggered.

1. The event is sent to Event Grid to get processed to all the subscribers.

1. The logic app workflow subscribes and listens to those events.

   The storage account can contain multiple data assets, so event filtering is applied to react only to events happening in a specific folder in the storage account. Further filtering can be done if needed, for example, based on file extensions.

1. The logic app workflow triggers, and performs the following actions:

   1. Gets an authorization token to invoke batch endpoints using the credentials from a service principal.

   1. Triggers the batch endpoint (default deployment) using the newly created file as input.

1. The batch endpoint returns the name of the job that was created to process the file.

> [!IMPORTANT]
>
> When you use a logic app workflow that connects with Event Grid to invoke batch endpoint, you generate one job per *each blob file* created in the storage account. Keep in mind that batch endpoints distribute the work at the file level, so no parallelization happens. Instead, you use the batch endpoints's capability to execute multiple jobs on the same compute cluster. If you need to run jobs on entire folders in an automatic fashion, we recommend that you to switch to [Invoking batch endpoints from Azure Data Factory](how-to-use-batch-azure-data-factory.md).

## Prerequisites

* You have a model correctly deployed as a batch endpoint. You can extend this architecture to work with [Pipeline component deployments](concept-endpoints-batch.md?#pipeline-component-deployment) if needed.

* Your batch deployment runs in a compute cluster called `batch-cluster`.

* The logic app that you create communicates with Azure Machine Learning batch endpoints using REST.

  For more information about how to use the REST API for batch endpoints, see [Create jobs and input data for batch endpoints](how-to-access-data-batch-endpoints-jobs.md?tabs=rest).

## Authenticate against batch endpoints

Azure Logic Apps can invoke the REST APIs of batch endpoints by using the [HTTP](../connectors/connectors-native-http.md) action. Batch endpoints support Microsoft Entra ID for authorization and hence the request made to the APIs require a proper authentication handling.

This tutorial uses a service principal for authentication and interaction with batch endpoints in this scenario.

1. Create a service principal by following [Register an application with Microsoft Entra ID and create a service principal](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal).

1. Create a secret to use for authentication by following [Option 3: Create a new client secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret).

1. Make sure to save the generated client secret **Value**, which appears only once.

1. Make sure to save the `client ID` and the `tenant id` in the application's **Overview** pane.

1. Grant your service principal access to your workspace by following [Grant access](../role-based-access-control/quickstart-assign-role-user-portal.md#grant-access). For this example, the service principal requires the following:

   - Permission in the workspace to read batch deployments and perform actions over them.
   - Permissions to read/write in data stores.

## Enable data access

To indicate the input data that you want to send to the deployment job, this tutorial uses cloud URIs provided by Event Grid. Batch endpoints use the identity of the compute to mount the data, while keeping the identity of the job to read the mounted data. So, you have to assign a user-assigned managed identity to the compute cluster, and make sure the cluster has access to mount the underlying data. To ensure data access, follow these steps:

1. Create a [managed identity resource](../active-directory/managed-identities-azure-resources/overview.md):

   # [Azure CLI](#tab/cli)

   ```azurecli
   IDENTITY=$(az identity create  -n azureml-cpu-cluster-idn  --query id -o tsv)
   ```

   # [Python](#tab/sdk)

   ```python
   # Use the Azure CLI to create the managed identity. Then copy the value of the variable IDENTITY into a Python variable
   identity="/subscriptions/<subscription>/resourcegroups/<resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/azureml-cpu-cluster-idn"
   ```

1. Update the compute cluster to use the managed identity that we created:

   > [!NOTE]
   >
   > This examples assumes that you have a compute cluster created named `cpu-cluster` that is used for the default deployment in the endpoint.

   # [Azure CLI](#tab/cli)

   ```azurecli
   az ml compute update --name cpu-cluster --identity-type user_assigned --user-assigned-identities $IDENTITY
   ```

   # [Python](#tab/sdk)

   ```python
   from azure.ai.ml import MLClient
   from azure.ai.ml.entities import AmlCompute, ManagedIdentityConfiguration
   from azure.ai.ml.constants import ManagedServiceIdentityType

   compute_name = "batch-cluster"
   compute_cluster = ml_client.compute.get(name=compute_name)

   compute_cluster.identity.type = ManagedServiceIdentityType.USER_ASSIGNED
   compute_cluster.identity.user_assigned_identities = [
       ManagedIdentityConfiguration(resource_id=identity)
   ]

   ml_client.compute.begin_create_or_update(compute_cluster)
   ```

1. In the [Azure portal](https://portal.azure.com), make sure the managed identity has the correct permissions to read the data. 

   To access storage services, you must have at least [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) access to the storage account. Only storage account owners can [change your access level via the Azure portal](../storage/blobs/assign-azure-role-data-access.md).

## Create a logic app

1. In the [Azure portal](https://portal.azure.com), on the Azure home page, select **Create a resource**.

1. On the Azure Marketplace menu, select **Integration** > **Logic App**.

   ![Screenshot that shows Azure Marketplace menu with selected options for Integration and Logic App.](~/reusable-content/ce-skilling/azure/media/logic-apps/create-new-logic-app-resource.png)

1. On the **Create Logic App** pane, on the **Basics** tab, provide the following information about your logic app resource.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Your Azure subscription name. This example uses **Pay-As-You-Go**. |
   | **Resource Group** | Yes | **LA-TravelTime-RG** | The [Azure resource group](../azure-resource-manager/management/overview.md) where you create your logic app resource and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`). |
   | **Name** | Yes | **LA-TravelTime** | Your logic app resource name, which must be unique across regions and can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`). |

   ![Screenshot showing Azure portal, logic app creation pane, and info for new logic app resource.](~/reusable-content/ce-skilling/azure/media/logic-apps/create-logic-app-settings.png)
   
1. Before you continue making selections, go to the **Plan** section. For **Plan type**, select **Consumption** to show only the settings for a Consumption logic app workflow, which runs in multitenant Azure Logic Apps.

   > [!IMPORTANT]
   >
   > For private-link enabled workspaces, you need to use the Standard plan for Azure Logic Apps with allow private networking configuration.

   The **Plan type** property also specifies the billing model to use.

   | Plan type | Description |
   |-----------|-------------|
   | **Standard** | This logic app type is the default selection and runs in single-tenant Azure Logic Apps and uses the [Standard pricing model](../logic-apps/logic-apps-pricing.md#standard-pricing). |
   | **Consumption** | This logic app type runs in global, multitenant Azure Logic Apps and uses the [Consumption pricing model](../logic-apps/logic-apps-pricing.md#consumption-pricing). |

1. Now continue with the following selections:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Region** | Yes | **West US** | The Azure datacenter region for storing your app's information. This example deploys the sample logic app to the **West US** region in Azure. |
   | **Enable log analytics** | Yes | **No** | This option appears and applies only when you select the **Consumption** logic app type. Change this option only when you want to enable diagnostic logging. For this tutorial, keep the default selection. |

1. When you're done, select **Review + create**. After Azure validates the information about your logic app resource, select **Create**.

1. After Azure deploys your app, select **Go to resource**.

   Azure opens the workflow designer for your logic app.

## Configure the workflow parameters

This logic app workflow uses parameters to store specific pieces of information that you need to run the batch deployment.

1. On the workflow designer toolbar, select **Parameters**.

    :::image type="content" source="./media/how-to-use-event-grid-batch/parameters.png" alt-text="Screenshot shows Parameters pane for defining parameters required for the workflow.":::

1. On the **Parameters** pane, select **Create parameter**, and provide the following information about each parameter to create:

   > [!TIP]
   >
   > Use the values configured at [Authenticating against batch endpoints](#authenticate-against-batch-endpoints).

   | Parameter name | Description | Sample value |
   |----------------|-------------|--------------|
   | `tenant_id`    | The tenant ID where the endpoint is deployed. |`00000000-0000-0000-00000000` |
   | `client_id`    | The client ID for the service principal used to invoke the endpoint. | `00000000-0000-0000-00000000` |
   | `client_secret` | The client secret of the service principal used to invoke the endpoint. | `ABCDEFGhijkLMNOPQRstUVwz` |
   | `endpoint_uri`  | The endpoint scoring URI. <br><br>**Important**: This URI is for the endpoint that you want to execute. The endpoint must have a default deployment configured. | `https://<endpoint_name>.<region>.inference.ml.azure.com/jobs` |

   The following example shows a sample parameter:

   :::image type="content" source="./media/how-to-use-event-grid-batch/parameter.png" alt-text="Screenshot shows how to add one parameter in designer.":::

   For more information, see [Create cross-environment parameters for workflow inputs in Azure Logic Apps](../logic-apps/create-parameters-workflows.md).

## Add the trigger

We want to trigger the logic app workflow each time a new file is created in a specific folder (data asset) of a storage account. The logic app uses the information from the event to invoke the batch endpoint and pass the specific file to process.

1. On the workflow designer, [follow these general steps to add an **Event Grid** trigger named **When a resource event occurs**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger).

1. In the connection information box, select the authentication type to use, and then select **Sign in**.

1. In the trigger box, provide the following information:

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Resource Type** | `Microsoft.Storage.StorageAccounts` | The resource type emitting the events. |
   | **Subscription** | Your subscription name | The subscription for the storage account. |
   | **Resource Name** | Your storage account name | The name of the storage account where the files are generated. |
   | **Event Type Item** | `Microsoft.Storage.BlobCreated` | The event type. |

1. From the **Advanced parameters** list, select **Prefix Filter**, and provide the following value:

   **/blobServices/default/containers/<*container-name*>/blobs/<*path-to-data-folder*>**

   > [!IMPORTANT]
   >
   > The **Prefix Filter** property allows Event Grid to only notify the workflow when a blob is created in the specific path we indicated. In this case, we assume that files are created by some external process in the folder specified by **<*path-to-data-folder*>** inside the container **<*container-name*>**, which is in the selected storage account. Configure this parameter to match the location of your data. Otherwise, the event is fired for any file created at any location of the storage account. For more information, see [Event filtering for Event Grid](../event-grid/event-filtering.md).

   The following example shows how the trigger appears:

   :::image type="content" source="./media/how-to-use-event-grid-batch/create-trigger.png" alt-text="Screenshot of the trigger activity of the logic app.":::

## Configure the actions

1. Under the **When a resource event occurs** trigger, [follow these general steps to add the **HTTP** action](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-action). Rename the action to **Authorize**.

1. In the **Authorize** action, provide the following information:

   | Property | Value | Notes |
   |----------|-------|-------|
   | **Method** | `POST` | The HTTP method |
   | **URI** | `concat('https://login.microsoftonline.com/', parameters('tenant_id'), '/oauth2/token')` | To enter this expression, select inside the **URI** box. From the options that appear, select the expression editor (formula icon). |
   | **Headers** | `Content-Type` with value `application/x-www-form-urlencoded` | |
   | **Body**    | `concat('grant_type=client_credentials&client_id=', parameters('client_id'), '&client_secret=', parameters('client_secret'), '&resource=https://ml.azure.com')` | To enter this expression, select inside the **Body** box. From the options that appear, select the expression editor (formula icon). |

   The following example shows a sample **Authorize** action:

   :::image type="content" source="./media/how-to-use-event-grid-batch/authorize.png" alt-text="Screenshot shows sample Authorize action in the logic app workflow.":::

1. Under the **Authorize** action, add another **HTTP** action, and rename the title to **Invoke**.

1. In the **Invoke** action, provide the following information:

   | Property | Value | Notes |
   |----------|-------|-------------|
   | **Method** | `POST` | The HTTP method |
   | **URI** | `endpoint_uri` | Select inside the **URI** box, and then under **Parameters**, select **endpoint_uri**. |
   | **Headers** | `Content-Type` with value `application/json` |  |
   | **Headers** | `Authorization` with value `concat('Bearer ', body('Authorize')['access_token'])` | To enter this expression, select inside the **Headers** box. From the options that appear, select the expression editor (formula icon). |

1. Select inside the **Body** box, and from the options that appear, select the expression editor (formula icon) to enter the following expression:

   ```fx
   replace('{
    "properties": {
      "InputData": {
        "mnistinput": {
           "JobInputType" : "UriFile",
           "Uri" : "<JOB_INPUT_URI>"
        }
      }
     }
   }', '<JOB_INPUT_URI>', triggerBody()?[0]['data']['url'])
   ```

   > [!TIP]
   >
   > The previous payload corresponds to a **Model deployment**. If you're working with a **Pipeline component deployment**, adapt the format according to the expectations of the pipeline's inputs. For more information about how to structure the input in REST calls, see [Create jobs and input data for batch endpoints (REST)](how-to-access-data-batch-endpoints-jobs.md?tabs=rest).

   The following example shows a sample **Invoke** action:

   :::image type="content" source="./media/how-to-use-event-grid-batch/invoke.png" alt-text="Screenshot shows sample Invoke action in the logic app workflow.":::

   > [!NOTE]
   >
   > The **Invoke** action triggers the batch job, but the action won't wait for its completion. By default, Azure Logic Apps isn't set up for long-running applications. If you need to wait for the job to complete, we recommend you to switch to [Run batch endpoints from Azure Data Factory](how-to-use-batch-azure-data-factory.md).

1. When you're done, save your workflow.

   The logic app workflow is ready to execute and automatically triggers each time a new file is created under the indicated path.

1. To confirm that the app successfully received an event, check the app's **Runs history**:

   :::image type="content" source="./media/how-to-use-event-grid-batch/invoke-history.png" alt-text="Screenshot shows run history for the logic app workflow.":::

## Next steps

* [Run batch endpoints from Azure Data Factory](how-to-use-batch-azure-data-factory.md)
