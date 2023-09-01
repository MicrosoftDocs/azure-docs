---
title: Call or connect to REST endpoints from workflows
description: Learn how to call or connect to REST endpoints from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 11/01/2019
tags: connectors
---

# Call REST endpoints from workflows in Azure Logic Apps

With the built-in **HTTP + Swagger** operation and [Azure Logic Apps](../logic-apps/logic-apps-overview.md), you can create automated integration workflows that regularly call any REST endpoint through a [Swagger file](https://swagger.io). The **HTTP + Swagger** trigger and action work the same as the [HTTP trigger and action](connectors-native-http.md) but provide a better experience in the workflow designer by exposing the API structure and outputs described by the Swagger file. To implement a polling trigger, follow the polling pattern that's described in [Create custom APIs to call other APIs, services, and systems from logic app workflows](../logic-apps/logic-apps-create-api-app.md#polling-triggers).

## Prerequisites

* An account and Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The URL for the Swagger file (OpenAPI 2.0, not OpenAPI 3.0) that describes the target REST endpoint that you want to call

  Typically, the REST endpoint has to meet the following criteria for the trigger or action to work:

  * The Swagger file must be hosted on an HTTPS URL that's publicly accessible.
  
  * The Swagger file must contain an **operationID** property for each operation in the definition. If not, the connector only shows the last operation in the Swagger file. 

  * The Swagger file must have [Cross-Origin Resource Sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services) enabled.

  The examples in this topic uses [Azure AI Face](../ai-services/computer-vision/overview-identity.md), which requires an [Azure AI services resource key and region](../ai-services/multi-service-resource.md?pivots=azportal).

  > [!NOTE]
  > To reference a Swagger file that's unhosted or that doesn't meet the security and cross-origin requirements, 
  > you can [upload the Swagger file to a blob container in an Azure storage account](#host-swagger), and enable 
  > CORS on that storage account so that you can reference the file.

* The logic app workflow from where you want to call the target endpoint. To start with the **HTTP + Swagger** trigger, create a blank logic app workflow. To use the **HTTP + Swagger** action, start your workflow with any trigger that you want. This example uses the **HTTP + Swagger** trigger as the first step. 

## Add an HTTP + Swagger trigger

This built-in trigger sends an HTTP request to a URL for a Swagger file that describes a REST API. The trigger then returns a response that contains that file's content.

1. Sign in to the [Azure portal](https://portal.azure.com). Open your blank logic app workflow in the designer.

1. On the designer, in the search box, enter **swagger**. From the **Triggers** list, select the **HTTP + Swagger** trigger.

   ![Select HTTP + Swagger trigger](./media/connectors-native-http-swagger/select-http-swagger-trigger.png)

1. In the **SWAGGER ENDPOINT URL** box, enter the URL for the Swagger file that you want, and select **Next**.

   Make sure to use or create your own endpoint. As an example only, these steps use the following [Azure AI Face API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) Swagger URL located in the West US region and might not work in your specific trigger:

   `https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/export?DocumentFormat=Swagger&ApiName=Face%20API%20-%20V1.0`

   ![Screenshot that shows the workflow designer with the "H T T P + Swagger" trigger and the "Swagger Endpoint U R L" property set to a U R L value.](./media/connectors-native-http-swagger/http-swagger-trigger-parameters.png)

1. When the designer shows the operations described by the Swagger file, select the operation that you want to use.

   ![Screenshot that shows the workflow designer with the "H T T P + Swagger" trigger and a list that displays Swagger operations.](./media/connectors-native-http-swagger/http-swagger-trigger-operations.png)

1. Provide the values for the trigger parameters, which vary based on the selected operation, that you want to include in the endpoint call. Set up the recurrence for how often you want the trigger to call the endpoint.

   This example renames the trigger to "HTTP + Swagger trigger: Face - Detect" so that the step has a more descriptive name.

   ![Screenshot that shows the workflow designer with the "H T T P + Swagger" trigger that displays the "Face - Detect" operation.](./media/connectors-native-http-swagger/http-swagger-trigger-operation-details.png)

1. To add other available parameters, open the **Add new parameter** list, and select the parameters that you want.

   For more information about authentication types available for HTTP + Swagger, review [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound).

1. Continue building your workflow with actions that run when the trigger fires.

1. When you're finished, remember to save your workflow. On the designer toolbar, select **Save**.

## Add an HTTP + Swagger action

This built-in action sends an HTTP request to the URL for the Swagger file that describes a REST API. The action then returns a response that contains that file's content.

1. Sign in to the [Azure portal](https://portal.azure.com). Open your logic app workflow in designer.

1. Under the step where you want to add the **HTTP + Swagger** action, select **New step**.

   To add an action between steps, move your pointer over the arrow between steps. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. On the designer, in the search box, enter **swagger**. From the **Actions** list, select the **HTTP + Swagger** action.

    ![Select HTTP + Swagger action](./media/connectors-native-http-swagger/select-http-swagger-action.png)

1. In the **SWAGGER ENDPOINT URL** box, enter the URL for the Swagger file that you want, and select **Next**.

   Make sure to use or create your own endpoint. As an example only, these steps use the following [Azure AI Face API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) Swagger URL located in the West US region and might not work in your specific action:

   `https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/export?DocumentFormat=Swagger&ApiName=Face%20API%20-%20V1.0`

   ![Enter URL for Swagger endpoint](./media/connectors-native-http-swagger/http-swagger-action-parameters.png)

1. When the designer shows the operations described by the Swagger file, select the operation that you want to use.

   ![Operations in Swagger file](./media/connectors-native-http-swagger/http-swagger-action-operations.png)

1. Provide the values for the action parameters, which vary based on the selected operation, that you want to include in the endpoint call.

   This example has no parameters, but renames the action to "HTTP + Swagger action: Face - Identify" so that the step has a more descriptive name.

   ![Operation details](./media/connectors-native-http-swagger/http-swagger-action-operation-details.png)

1. To add other available parameters, open the **Add new parameter** list, and select the parameters that you want.

   For more information about authentication types available for HTTP + Swagger, review [Add authentication to outbound calls](../logic-apps/logic-apps-securing-a-logic-app.md#add-authentication-outbound).

1. When you're finished, remember to save your logic app workflow. On the designer toolbar, select **Save**.

<a name="host-swagger"></a>

## Host Swagger in Azure Storage

You can still reference a Swagger file that's not hosted or that doesn't meet the security and cross-origin requirements. Upload the Swagger file to blob container in an Azure storage account and enable CORS on that storage account. To create, set up, and store Swagger files in Azure Storage, follow these steps:

1. [Create an Azure storage account](../storage/common/storage-account-create.md).

1. Now enable CORS for the blob. On your storage account's menu, select **CORS**. On the **Blob service** tab, specify these values, and then select **Save**.

   | Property | Value |
   |----------|-------|
   | **Allowed origins** | `*` |
   | **Allowed methods** | `GET`, `HEAD`, `PUT` |
   | **Allowed headers** | `*` |
   | **Exposed headers** | `*` |
   | **Max age** (in seconds) | `200` |
   |||

   Although this example uses the [Azure portal](https://portal.azure.com), you can use a tool such as [Azure Storage Explorer](https://storageexplorer.com/), or automatically configure this setting by using this sample [PowerShell script](https://github.com/logicappsio/EnableCORSAzureBlob/blob/master/EnableCORSAzureBlob.ps1).

1. [Create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md). On the container's **Overview** pane, select **Change access level**. From the **Public access level** list, select **Blob (anonymous read access for blobs only)**, and select **OK**.

1. [Upload the Swagger file to the blob container](../storage/blobs/storage-quickstart-blobs-portal.md#upload-a-block-blob), either through the [Azure portal](https://portal.azure.com) or [Azure Storage Explorer](https://storageexplorer.com/).

1. To reference the file in the blob container, get the HTTPS URL that follows this format, which is case-sensitive, from Azure Storage Explorer:

   `https://<storage-account-name>.blob.core.windows.net/<blob-container-name>/<complete-swagger-file-name>?<query-parameters>`

## Connector reference

This section provides more information about the outputs from an **HTTP + Swagger** trigger or action. The **HTTP + Swagger** call returns this information:

| Property name | Type | Description |
|---------------|------|-------------|
| **headers** | Object | The headers from the request |
| **body** | Object | The object with the body content from the request |
| **status code** | Integer | The status code from the request |
||||

| Status code | Description |
|-------------|-------------|
| 200 | OK |
| 202 | Accepted |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal server error. Unknown error occurred. |
|||

## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](built-in.md)
