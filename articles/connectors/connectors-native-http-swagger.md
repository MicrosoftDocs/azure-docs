---
title: Call REST API endpoints from workflows
description: Call REST API endpoints from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 12/13/2024
---

# Call REST API endpoints from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To call a REST API endpoint from a logic app workflow in Azure Logic Apps, you can use the built-in **HTTP + Swagger** operations to call any REST API endpoint through a [Swagger file](https://swagger.io). The **HTTP + Swagger** trigger and action work the same as the [HTTP trigger and action](/azure/connectors/connectors-native-http) but provide a better experience in the workflow designer by exposing the API structure and outputs described by the Swagger file. To implement a polling trigger, follow the polling pattern that's described in [Create custom APIs to call other APIs, services, and systems from logic app workflows](/azure/logic-apps/logic-apps-create-api-app#polling-triggers).

## Limitations

The **HTTP + Swagger** built-in operations currently support only OpenAPI 2.0, not OpenAPI 3.0.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The URL for the Swagger file that describes the target REST API endpoint that you want to call

  Typically, the REST endpoint has to meet the following criteria for the trigger or action to work:

  * The Swagger file must be hosted on an HTTPS URL that's publicly accessible.
  
  * The Swagger file must contain an **operationID** property for each operation in the definition. If not, the connector only shows the last operation in the Swagger file. 

  * The Swagger file must have [Cross-Origin Resource Sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) enabled.

  > [!NOTE]
  >
  > To reference a Swagger file that's unhosted or that doesn't meet the security and cross-origin requirements, 
  > you can [upload the Swagger file to a blob container in an Azure storage account](#host-swagger), and enable 
  > CORS on that storage account so that you can reference the file.

* The Consumption or Standard logic app workflow from where you want to call the target endpoint. To start with the **HTTP + Swagger** trigger, create a logic app resource with a blank workflow. To use the **HTTP + Swagger** action, start your workflow with any trigger that you want. This example uses the **HTTP + Swagger** trigger as the first operation.

## Add an HTTP + Swagger trigger

This built-in trigger sends an HTTP request to a URL for a Swagger file that describes a REST API. The trigger then returns a response that contains that file's content.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource and blank workflow in the designer.

1. Based on whether you have a Consumption or Standard workflow, [follow these general steps to add the **HTTP** trigger named **HTTP + Swagger**](/azure/logic-apps/create-workflow-with-trigger-or-action#add-trigger).

1. In the **Swagger endpoint** box, enter the URL for the Swagger file that you want, and select **Add action**.

   The following example uses a non-functional Swagger URL. Your URL might use a different format.

   :::image type="content" source="media/connectors-native-http-swagger/http-swagger-trigger-parameters.png" alt-text="Screenshot shows workflow designer with selected Add trigger shape and information pane for HTTP + Swagger trigger. The Swagger endpoint property is set to an example URL.":::

1. After the designer shows the operations described by the Swagger file, select the operation that you want to use.

1. Provide the values for the trigger parameters, which vary based on the selected operation, that you want to include in the endpoint call.

1. If the trigger requires that you specify a firing schedule, specify the recurrence for how often you want the trigger to call the endpoint.

1. To add other available parameters, open the **Advanced parameters** list, and select the parameters that you want.

   For more information about authentication types available for HTTP + Swagger, see [Add authentication to outbound calls](/azure/logic-apps/logic-apps-securing-a-logic-app#add-authentication-outbound).

1. Continue building your workflow with the actions that you want to run when the trigger fires.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

## Add an HTTP + Swagger action

This built-in action sends an HTTP request to the URL for the Swagger file that describes a REST API. The action then returns a response that contains that file's content.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource and workflow in the designer.

1. Based on whether you have a Consumption or Standard workflow, [follow these general steps to add the **HTTP** action named **HTTP + Swagger**](/azure/logic-apps/create-workflow-with-trigger-or-action#add-action).

1. In the **Swagger endpoint** box, enter the URL for the Swagger file that you want, and select **Add action**.

   The following example uses a non-functional Swagger URL. Your URL might use a different format.

   :::image type="content" source="media/connectors-native-http-swagger/http-swagger-action-parameters.png" alt-text="Screenshot shows workflow designer with trigger named Fabrikam API - Create order and open information pane for HTTP + Swagger action. The Swagger endpoint property is set to a URL.":::

1. After the designer shows the operations described by the Swagger file, select the operation that you want to use.

1. Provide the values for the action parameters, which vary based on the selected operation, that you want to include in the endpoint call.

1. To add other available parameters, open the **Advanced parameters** list, and select the parameters that you want.

   For more information about authentication types available for HTTP + Swagger, see [Add authentication to outbound calls](/azure/logic-apps/logic-apps-securing-a-logic-app#add-authentication-outbound).

1. Continue building your workflow with any other actions that you want to run.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

<a name="host-swagger"></a>

## Host Swagger in Azure Storage

You can still reference a Swagger file that's not hosted or that doesn't meet the security and cross-origin requirements. Upload the Swagger file to blob container in an Azure storage account and enable CORS on that storage account. To create, set up, and store Swagger files in Azure Storage, follow these steps:

1. [Create an Azure storage account](/azure/storage/common/storage-account-create).

1. Now enable CORS for the blob. On your storage account's menu, select **CORS**. On the **Blob service** tab, specify these values, and select **Save**.

   | Property | Value |
   |----------|-------|
   | **Allowed origins** | `*` |
   | **Allowed methods** | `GET`, `HEAD`, `PUT` |
   | **Allowed headers** | `*` |
   | **Exposed headers** | `*` |
   | **Max age** (in seconds) | `200` |

   Although this example uses the [Azure portal](https://portal.azure.com), you can use a tool such as [Azure Storage Explorer](https://storageexplorer.com/), or automatically configure this setting by using this sample [PowerShell script](https://github.com/logicappsio/EnableCORSAzureBlob/blob/master/EnableCORSAzureBlob.ps1).

1. [Create a blob container](/azure/storage/blobs/storage-quickstart-blobs-portal). On the container's **Overview** pane, select **Change access level**. From the **Public access level** list, select **Blob (anonymous read access for blobs only)**, and select **OK**.

1. [Upload the Swagger file to the blob container](/azure/storage/blobs/storage-quickstart-blobs-portal#upload-a-block-blob), either through the [Azure portal](https://portal.azure.com) or [Azure Storage Explorer](https://storageexplorer.com/).

1. To reference the file in the blob container, get the HTTPS URL that follows this format, which is case-sensitive, from Azure Storage Explorer:

   `https://<storage-account-name>.blob.core.windows.net/<blob-container-name>/<complete-swagger-file-name>?<query-parameters>`

## Connector technical reference

This section provides more information about the outputs from an **HTTP + Swagger** trigger and action. 

### Outputs

The **HTTP + Swagger** call returns the following information:

| Property name | Type | Description |
|---------------|------|-------------|
| **headers** | Object | The headers from the request |
| **body** | Object | The object with the body content from the request |
| **status code** | Integer | The status code from the request |

| Status code | Description |
|-------------|-------------|
| 200 | OK |
| 202 | Accepted |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal server error. Unknown error occurred. |

## Related content

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](/azure/connectors/built-in)

