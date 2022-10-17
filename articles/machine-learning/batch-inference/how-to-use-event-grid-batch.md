---
title: "Invoking batch endpoints from Even Grid events in storage"
titleSuffix: Azure Machine Learning
description: Learn how to use batch endpoints to be automatically triggered when new files are generated in storage.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: larryfr
ms.custom: devplatv2
---

# Invoking batch endpoints from Even Grid events in storage

[!INCLUDE [ml v2](../../../includes/machine-learning-dev-v2.md)]

Event Grid is a fully managed service that enables you to easily manage events across many different Azure services and applications. It simplifies building event-driven and serverless applications. In this tutorial we are going to learn how to create a Logic App that can subscribe to the Event Grid event associated with new files created in a storage account and trigger a batch endpoint to process the given file.

The workflow will work in the following way:

1. It will be triggered when a new blob is created in a specific storage account.
2. Since the storage account can contain multiple data assets, event filtering will be applied to only react to events happening in a specific folder inside of it. Further filtering can be done is needed.
3. It will get an authorization token to invoke batch endpoints using the credentials from a Service Principal.
4. It will trigger the batch endpoint (default deployment) using the newly created file as input.

## Prerequisites

* This example assumes that you have a model correctly deployed as a batch endpoint. Particularly, we are using the *heart condition classifier* created in the tutorial [Using MLflow models in batch deployments](how-to-mlflow-batch.md).
* The Logic App we are creating will communicate with Azure Machine Learning batch endpoints using REST. To know more about how to use the REST API of batch endpoints read [Deploy models with REST for batch scoring](../how-to-deploy-batch-with-rest.md). 

## Authentication for Batch Endpoints in Logic Apps

Logic Apps can invoke the REST APIs of batch endpoints by using the [HTTP](../../connectors/connectors-native-http.md) activity. Batch endpoints support Azure Active Directory for authorization and hence the request made to the APIs require a proper authentication handling.

We recommend to using a `Managed Identity` for authentication and interaction with batch endpoints in this scenario. 

1. Create a service principal following the steps at [Register an application with Azure AD and create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal).
1. Create a secret to use for authentication as explained at [Option 2: Create a new application secret](../../active-directory/develop/howto-create-service-principal-portal.md#option-2-create-a-new-application-secret).
1. Take note of the `client secret` generated.
1. Take note of the `client ID` and the `tenant id` as explained at [Get tenant and app ID values for signing in](../../active-directory/develop/howto-create-service-principal-portal.md#option-2-create-a-new-application-secret).
1. Grant access for the managed identity you created to your workspace as explained at [Grant access](../../role-based-access-control/quickstart-assign-role-user-portal.md#grant-access). In this example the managed identity will require:

   1. Permission in the workspace to read batch deployments and perform actions over them.
   1. Permissions to read/write in data stores. 


## Create a Logic App

1. In the [Azure portal](https://portal.azure.com), sign in with your Azure account.

1. On the Azure home page, select **Create a resource**.

1. On the Azure Marketplace menu, select **Integration** > **Logic App**.

   ![Screenshot that shows Azure Marketplace menu with "Integration" and "Logic App" selected.](./../../logic-apps/media/tutorial-build-scheduled-recurring-logic-app-workflow/create-new-logic-app-resource.png)

1. On the **Create Logic App** pane, on the **Basics** tab, provide the following information about your logic app resource.

   ![Screenshot showing Azure portal, logic app creation pane, and info for new logic app resource.](./../../logic-apps/media/tutorial-build-scheduled-recurring-logic-app-workflow/create-logic-app-settings.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Your Azure subscription name. This example uses **Pay-As-You-Go**. |
   | **Resource Group** | Yes | **LA-TravelTime-RG** | The [Azure resource group](../../azure-resource-manager/management/overview.md) where you create your logic app resource and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`). |
   | **Name** | Yes | **LA-TravelTime** | Your logic app resource name, which must be unique across regions and can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`). |

1. Before you continue making selections, go to the **Plan** section. For **Plan type**, select **Consumption** to show only the settings for a Consumption logic app workflow, which runs in multi-tenant Azure Logic Apps.

   The **Plan type** property also specifies the billing model to use.

   | Plan type | Description |
   |-----------|-------------|
   | **Standard** | This logic app type is the default selection and runs in single-tenant Azure Logic Apps and uses the [Standard billing model](../../logic-apps/logic-apps-pricing.md#standard-pricing). |
   | **Consumption** | This logic app type runs in global, multi-tenant Azure Logic Apps and uses the [Consumption billing model](../../logic-apps/logic-apps-pricing.md#consumption-pricing). |

1. Now continue with the following selections:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Region** | Yes | **West US** | The Azure datacenter region for storing your app's information. This example deploys the sample logic app to the **West US** region in Azure. <br><br>**Note**: If your subscription is associated with an integration service environment, this list includes those environments. |
   | **Enable log analytics** | Yes | **No** | This option appears and applies only when you select the **Consumption** logic app type. Change this option only when you want to enable diagnostic logging. For this tutorial, keep the default selection. |

1. When you're done, select **Review + create**. After Azure validates the information about your logic app resource, select **Create**.

1. After Azure deploys your app, select **Go to resource**.

   Azure opens the workflow template selection pane, which shows an introduction video, commonly used triggers, and workflow template patterns.

1. Scroll down past the video and common triggers sections to the **Templates** section, and select **Blank Logic App**.

   ![Screenshot that shows the workflow template selection pane with "Blank Logic App" selected.](./../../logic-apps/media/tutorial-build-scheduled-recurring-logic-app-workflow/select-logic-app-template.png)


## Configure the workflow parameters

This Logic App will use parameters to store specific pieces of information that you will need to run the batch deployment. On the workflow designer, under the tool bar, select the option __Parameters__ and configure them as follows:

| Parameter             | Description  | Sample value |
| --------------------- | -------------|------------- |
| `tenant_id`           | Tenant ID where the endpoint is deployed  | `00000000-0000-0000-00000000` |
| `client_id`           | The client ID of the Managed Identity used to invoke the endpoint  | `00000000-0000-0000-00000000` |
| `client_secret`       | The client secret of the Managed Identity used to invoke the endpoint  | `ABCDEFGhijkLMNOPQRstUVwz` |
| `endpoint_uri`        | The endpoint scoring URI  | `https://<endpoint_name>.<region>.inference.ml.azure.com/jobs` |

## Add the trigger

1. On the workflow designer, under the search box, select **Built-in**.

1. In the search box, enter **event grid**, and select the trigger named **When a resource event occurs**.

1. Configure the trigger as follows:

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Subscription** | Your subscription name | The subscription where the Azure Storage Account is placed. |
   | **Resource Type** | `Microsoft.Storage.StorageAccounts` | The resource type emitting the events. |
   | **Resource Name** | Your storage account name | The name of the Storage Account where the files will be generated. |
   | **Event Type Item** | `Microsoft.Storage.BlobCreated` | The event type. |

1. Click on __Add new parameter__ and select __Prefix Filter__. Add the value `/blobServices/default/containers/<container_name>/blobs/<path_to_data_folder>`.

   > [!IMPORTANT]
   > __Prefix Filter__ allows Event Grid to only notify the workflow when a blob is created in the specific path we indicated. In this case, we are assumming that files will be created by some external process in the folder `<path_to_data_folder>` inside the container `<container_name>` in the selected Storage Account. Configure this parameter to match the location of your data. Otherwise, the event will be fired for any file created at any location of the Storage Account. See [Event filtering for Event Grid](../../event-grid/event-filtering.md) for more details.

   The trigger will look as follows:
   
   :::image type="content" source="./media/how-to-use-event-grid-batch/create-trigger.png" alt-text="The trigger activity of the Logic App.":::

## Configure the actions

1. Click on __+ New step__. 

1. On the workflow designer, under the search box, select **Built-in** and then click on __HTTP__:

1. Configure the action as follows:

   | Property | Value | Notes |
   |----------|-------|-------------|
   | **Method** | `POST` | The HTTP method |
   | **URI** | `concat('https://login.microsoftonline.com/', parameters('tenant_id'), '/oauth2/token')` | Click on __Add dynamic context__, then __Expression__, to enter this expression. |
   | **Headers** | `Content-Type` with value `application/x-www-form-urlencoded` |  |
   | **Body**    | `concat('grant_type=client_credentials&client_id=', parameters('client_id'), '&client_secret=', parameters('client_secret'), '&resource=https://ml.azure.com')` | Click on __Add dynamic context__, then __Expression__, to enter this expression. |
   
   The action will look as follows:
   
   :::image type="content" source="./media/how-to-use-event-grid-batch/authorize.png" alt-text="The authorize activity of the Logic App.":::

1. Click on __+ New step__. 

1. On the workflow designer, under the search box, select **Built-in** and then click on __HTTP__:

1. Configure the action as follows:

   | Property | Value | Notes |
   |----------|-------|-------------|
   | **Method** | `POST` | The HTTP method |
   | **URI** | `endpoint_uri` | Click on __Add dynamic context__, then select it under `parameters`. |
   | **Headers** | `Content-Type` with value `application/json` |  |
   | **Headers** | `Authorization` with value `concat('Bearer ', body('Authorize')['access_token'])` | Click on __Add dynamic context__, then __Expression__, to enter this expression. |
   
1. In the parameter __Body__, click on __Add dynamic context__, then __Expression__, to enter the following expression:

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
   
   The action will look as follows:
   
   :::image type="content" source="./media/how-to-use-event-grid-batch/invoke.png" alt-text="The invoke activity of the Logic App.":::

1. Click on __Save__.

1. The Logic App is ready to be executed and it will trigger automatically each time a new file is created under the indicated path. You will notice the app has successfully received the event by checking the __Run history__ of it:

   :::image type="content" source="./media/how-to-use-event-grid-batch/invoke-history.png" alt-text="The invoke history of the Logic App.":::

## Next steps

* [Invoking batch endpoints from Azure Data Factory](how-to-use-batch-adf.md)
