---
title: Call REST APIs from Workflows with HTTP Swagger
description: Call REST API endpoints from workflows in Azure Logic Apps by using HTTP Swagger operations.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.update-cycle: 365-days
ai-usage: ai-assisted
ms.date: 03/23/2026
# Customer intent: As an integration developer who works with Azure Logic Apps, I want to call a REST API endpoint URL from my workflow by using HTTP Swagger operations.
---

# Call REST API endpoints from workflows in Azure Logic Apps by using HTTP Swagger

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To call a REST API from your workflow in Azure Logic Apps without manually building a request, add the native, built-in **HTTP + Swagger** trigger or action to your workflow. These operations call any REST API endpoint by using a [Swagger file](https://swagger.io) to discover callable operations and get structured inputs and outputs.

The **HTTP + Swagger** trigger and action work the same as the [HTTP trigger and action](/azure/connectors/connectors-native-http), but they provide a better experience in the workflow designer by exposing the API structure and outputs described by the Swagger file.
  
This article shows how to add and use the **HTTP + Swagger** trigger and action in your workflow.

## Limitations

The **HTTP + Swagger** built-in operations support only OpenAPI 2.0, not OpenAPI 3.0.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The URL for the Swagger file that describes the target REST API endpoint to call.

  Typically, the REST endpoint needs to meet the following criteria for the trigger or action to work:

  - The Swagger file is hosted on a publicly accessible HTTPS URL.
  
  - The Swagger file contains an `operationID` property for each operation in the API definition. If not, the workflow designer shows only the last operation in the Swagger file.

  - The Swagger file needs to turn on [Cross-Origin Resource Sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services).

    > [!NOTE]
    >
    > To reference a Swagger file that's unhosted or doesn't meet security and cross-origin requirements, [upload the Swagger file to a blob container in an Azure storage account](#host-swagger), and enable CORS on that storage account.

- A Consumption or Standard logic app workflow where you want to call the REST API endpoint.

  To start your workflow with the **HTTP + Swagger** trigger, create a logic app resource that has a blank workflow. To use the **HTTP + Swagger** action, start your workflow with any trigger that works best for your business scenario.

## Add an HTTP + Swagger trigger

This trigger sends an HTTP request to the URL for a Swagger file that describes a REST API. The trigger returns a response that contains the Swagger file content to the workflow.

To implement a polling trigger, follow the [polling trigger pattern](/azure/logic-apps/logic-apps-create-api-app#polling-triggers).

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. In the designer, open your blank workflow.

1. Based on whether your workflow is Consumption or Standard, follow the [general steps](/azure/logic-apps/add-trigger-action-workflow#add-trigger) to add the **HTTP** trigger named **HTTP + Swagger**.

1. In the **Swagger endpoint** box, enter the URL for the Swagger file, and select **Add action**.

   The following example shows an example Swagger URL format. Your URL might use a different format.

   :::image type="content" source="media/connectors-native-http-swagger/http-swagger-trigger-parameters.png" alt-text="Screenshot that shows the Azure portal, workflow designer, and HTTP + Swagger trigger pane. An example URL is entered for the Swagger endpoint parameter.":::

   The trigger information pane shows the operations in the Swagger file.

1. Select the operation you want.

1. For the selected operation, enter the parameter values to use in the REST API call.

   Parameters vary based on the selected operation.

1. If the trigger runs on a schedule, set up the recurrence to specify when the trigger calls the REST API.

1. If other parameters exist, open the **Advanced parameters** list, and select the parameters you want.

   For more information about authentication, see [Add authentication to outbound calls](/azure/logic-apps/logic-apps-securing-a-logic-app#add-authentication-outbound).

1. Continue building the workflow with actions to run when the trigger fires.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

## Add an HTTP + Swagger action

This action sends an HTTP request to the URL for a Swagger file that describes a REST API. The action returns a response that contains the Swagger file content to the workflow.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. In the designer, open your blank workflow.

1. Based on whether your workflow is Consumption or Standard, follow the [general steps](/azure/logic-apps/add-trigger-action-workflow#add-action) to add the **HTTP** action named **HTTP + Swagger**.

1. In the **Swagger endpoint** box, enter the URL for the Swagger file, and select **Add action**.

   The following example shows an example Swagger URL format. Your URL might use a different format.

   :::image type="content" source="media/connectors-native-http-swagger/http-swagger-action-parameters.png" alt-text="Screenshot that shows the Azure portal, workflow designer, and HTTP + Swagger action pane. An example URL is entered for the Swagger endpoint parameter.":::

   The action information pane shows the operations in the Swagger file.

1. Select the operation you want.

1. For the selected operation, enter the parameter values to use in the REST API call.

   Parameters vary based on the selected operation.

1. If other parameters exist, open the **Advanced parameters** list, and select the parameters you want.

   For more information about authentication, see [Add authentication to outbound calls](/azure/logic-apps/logic-apps-securing-a-logic-app#add-authentication-outbound).

1. Continue building the workflow with actions to run when the trigger fires.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

## Outputs from HTTP + Swagger operations

This section provides more information about the outputs from the **HTTP + Swagger** trigger and action. The **HTTP + Swagger** operation returns the following information:

| Property name | Type | Description |
|---------------|------|-------------|
| **headers** | Object | The headers from the request. |
| **body** | Object | The object with the body content from the request. |
| **status code** | Integer | The status code from the request. |

| Status code | Description |
|-------------|-------------|
| 200 | OK |
| 202 | Accepted |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal server error. Unknown error occurred. |

<a name="host-swagger"></a>

## Host the Swagger in Azure Storage

You can still reference a Swagger file that's not hosted or that doesn't meet the security and cross-origin requirements. Upload the Swagger file to a blob container in an Azure storage account and turn on CORS on the storage account.

To create, set up, and store Swagger files in Azure Storage, follow these steps:

1. In the Azure portal, [create an Azure storage account](/azure/storage/common/storage-account-create).

1. Turn on CORS for the blob by following these steps:

   1. On the storage account sidebar, under **Settings**, select **CORS**.
   
   1. On the **Blob service** tab, enter the following values, and select **Save**.

      | Parameter | Value |
      |-----------|-------|
      | **Allowed origins** | `*` |
      | **Allowed methods** | `GET`, `HEAD`, `PUT` |
      | **Allowed headers** | `*` |
      | **Exposed headers** | `*` |
      | **Max age** in seconds | `200` |

   This example uses the Azure portal, but you can use a tool like [Azure Storage Explorer](https://storageexplorer.com/) to configure this setting. To automate configuration, see the [sample PowerShell script](https://github.com/logicappsio/EnableCORSAzureBlob/blob/master/EnableCORSAzureBlob.ps1).

1. [Create a blob container](/azure/storage/blobs/storage-quickstart-blobs-portal) and follow these steps:

   1. On the container sidebar, select **Overview**.

   1. On the **Overview** page, select **Change access level**.
   
   1. From the **Public access level** list, select **Blob (anonymous read access for blobs only)**, and then select **OK**.

1. In the Azure portal or Azure Storage Explorer, [upload the Swagger file to the blob container](/azure/storage/blobs/storage-quickstart-blobs-portal#upload-a-block-blob).

1. To reference the file in the blob container, from Azure Storage Explorer, get the HTTPS URL that uses the following case-sensitive format:

   `https://<storage-account-name>.blob.core.windows.net/<blob-container-name>/<complete-swagger-file-name>?<query-parameters>`

## Related content

- [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in connectors for Azure Logic Apps](/azure/connectors/built-in)
