
<properties
	pageTitle="Add the HTTP + Swagger action in Logic apps | Microsoft Azure"
	description="Overview of the HTTP + Swagger action and operations"
	services=""
	documentationCenter=""
	authors="jeffhollan"
	manager="erikre"
	editor=""
	tags="connectors"/>

<tags
   ms.service="app-service-logic"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/18/2016"
   ms.author="jehollan"/>

# Get started with the HTTP + Swagger action

With the HTTP + Swagger action, you can create a first-class connector to any REST endpoint through a [Swagger document](https://swagger.io). You can also extend a logic app to call any REST endpoint with a first-class Logic App Designer experience.

To get started with the HTTP + Swagger action in a logic app, see [Create a new logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

---

## Use HTTP + Swagger as a trigger or an action

The HTTP + Swagger trigger and action function the same as the [HTTP action](connectors-native-http.md) but provide a better design experience by showing the shape of the API and outputs in the designer from the [Swagger metadata](https://swagger.io). In addition, you can use HTTP + Swagger as a trigger. If you want to implement a polling trigger, it should follow the polling pattern that's described in [Creating a custom API to use with logic apps](../app-service-logic/app-service-logic-create-api-app.md#polling-triggers).

[Learn more about logic app triggers and actions.](connectors-overview.md)

Here's an example of how to use the HTTP + Swagger operation as an action in a workflow in a logic app.

1. Select the **New Step** button.
2. Select **Add an action**.
3. In the action search box, type **swagger** to list the HTTP + Swagger action.

	![Select HTTP + Swagger action](./media/connectors-native-http-swagger/using-action-1.png)

4. Type the URL for a Swagger document:
	- To work from the Logic App Designer, the URL must be an HTTPS endpoint and have CORS enabled.
	- If the Swagger document doesn't meet this requirement, you can use [Azure Storage with CORS enabled](#hosting-swagger-from-storage) to store the document.
5. Click **Next** to read and render from the Swagger document.
6. Add in any parameters that are required for the HTTP call.

	![Complete HTTP action](./media/connectors-native-http-swagger/using-action-2.png)

1. Click **Save** on the upper-left corner of the toolbar, and your logic app will both save and publish (activate).

### Host Swagger from Azure Storage

You might want to reference a Swagger document that's either not hosted, or that doesn't meet the security and cross-origin requirements for the designer. To resolve this issue, you can store the Swagger document in Azure Storage and enable CORS to reference the document.  

Here are the steps to create, configure, and store Swagger documents in Azure Storage:

1. [Create an Azure storage account with Azure Blob storage](../storage/storage-create-storage-account.md) (to do this, set permissions to **Public Access**).
2. Enable CORS on the blob. You can use [this PowerShell script](https://github.com/logicappsio/EnableCORSAzureBlob/blob/master/EnableCORSAzureBlob.ps1) to configure that setting automatically.
3. Upload the Swagger file into the blob. You can do this from the [Azure portal](https://portal.azure.com) or from a tool like [Azure Storage Explorer](http://storageexplorer.com/).
1. Reference an HTTPS link to the document in Azure Blob storage (the link follows the format `https://*storageAccountName*.blob.core.windows.net/*container*/*filename*`).



## Technical details

Following are the details for the triggers and actions that this HTTP + Swagger connector supports.

## HTTP + Swagger triggers

A trigger is an event that can be used to start the workflow that's defined in a logic app. [Learn more about triggers.](connectors-overview.md) The HTTP + Swagger connector has one trigger.

|Trigger|Description|
|---|---|
|HTTP + Swagger|Make an HTTP call and return the response content|

## HTTP + Swagger actions

An action is an operation that's carried out by the workflow that's defined in a logic app. [Learn more about actions.](connectors-overview.md) The HTTP + Swagger connector has one possible action.

|Action|Description|
|---|---|
|HTTP + Swagger|Make an HTTP call and return the response content|

### Action details

The HTTP + Swagger connector comes with one possible action. Following is information about each of the actions, their required and optional input fields, and the corresponding output details that are associated with their usage.

#### HTTP + Swagger

Make an HTTP outbound request with assistance of Swagger metadata.
An asterisk (*) means a required field.

|Display name|Property name|Description|
|---|---|---|
|Method*|method|HTTP verb to use.|
|URI*|uri|URI for the HTTP request.|
|Headers|headers|A JSON object of HTTP headers to include.|
|Body|body|The HTTP request body.|
|Authentication|authentication|Authentication to use for request. [For more details, see HTTP](./connectors-native-http.md#authentication).|

**Output details**

HTTP response

|Property Name|Data type|Description|
|---|---|---|
|Headers|object|Response headers|
|Body|object|Response object|
|Status Code|int|HTTP status code|

### HTTP responses

When making calls to various actions, you might get certain responses. Following is a table that outlines corresponding responses and descriptions.

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal server error. Unknown error occurred.|

---

## Next steps

Try out the platform and [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md) now. You can explore the other available connectors in logic apps by looking at our [list of APIs](apis-list.md).
