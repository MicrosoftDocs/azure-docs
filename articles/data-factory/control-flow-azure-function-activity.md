---
title: Azure Function Activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to use the Azure Function activity to run an Azure Function in an Azure Data Factory or Azure Synapse Analytics pipeline
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023

---

# Azure Function activity in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]
The Azure Function activity allows you to run [Azure Functions](../azure-functions/functions-overview.md) in an Azure Data Factory or Synapse pipeline. To run an Azure Function, you must create a linked service connection.  Then you can use the linked service with an activity that specifies the Azure Function that you plan to execute.

## Create an Azure Function activity with UI

To use an Azure Function activity in a pipeline, complete the following steps:

1. Expand the Azure Function section of the pipeline Activities pane, and drag an Azure Function activity to the pipeline canvas.

2. Select the new Azure Function activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.

   :::image type="content" source="media/control-flow-azure-function-activity/azure-function-activity-configuration.png" alt-text="Shows the UI for an Azure Function activity.":::

3. If you do not already have an Azure Function linked service defined, select New to create a new one.  In the new Azure Function linked service pane, choose your existing Azure Function App url and provide a Function Key.

   :::image type="content" source="media/control-flow-azure-function-activity/new-azure-function-linked-service.png" alt-text="Shows the new Azure Function linked service creation pane.":::

4. After selecting the Azure Function linked service, provide the function name and other details to complete the configuration.

## Azure Function linked service


The return type of the Azure function has to be a valid `JObject`. (Keep in mind that [JArray](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Linq_JArray.htm) is *not* a `JObject`.) Any return type other than `JObject` fails and raises the user error *Response Content is not a valid JObject*.

Function Key provides secure access to function name with each one having separate unique keys or master key within a function app. Managed identity provides secure access to the entire function app. User needs to provide key to access function name. For more information, see the function documentation for more details about [Function access key](../azure-functions/functions-bindings-http-webhook-trigger.md?tabs=csharp#configuration)


| **Property**     | **Description**                                              | **Required** |
| ---------------- | ------------------------------------------------------------ | ------------ |
| Type             | The type property must be set to: **AzureFunction**          | Yes          |
| Function app url | URL for the Azure Function App. Format is `https://<accountname>.azurewebsites.net`. This URL is the value under **URL** section when viewing your Function App in the Azure portal | Yes          |
| Function key     | Access key for the Azure Function. Click on the **Manage** section for the respective function, and copy either the **Function Key** or the **Host key**. Find out more here: [Azure Functions HTTP triggers and bindings](../azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) | Yes          |
| Authentication   | The authentication method used for calling the Azure Function. The supported values are 'System-assigned managed identity' or 'anonymous'.| Yes          |
| Resource ID  | The App (client) ID of the Azure Function. Switch to **Authentication** section for the respective function, and get the App (client) ID under **Identity provider**. This property will be displayed when you use system-assigned managed identity. For more information, see [Configure your App Service or Azure Functions app to use Microsoft Entra login](../app-service/configure-authentication-provider-aad.md).| No         |

>[!Note]
> When you use anonymous authentication, ensure that you have taken down your identity on the Azure Function side.

## Azure Function activity

| **Property**   | **Description**                                              | **Allowed values**                                          | **Required**                  |
| -------------- | ------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------- |
| Name           | Name of the activity in the pipeline                         | String                                                      | Yes                           |
| Type           | Type of activity is ‘AzureFunctionActivity’                  | String                                                      | Yes                           |
| Linked service | The Azure Function linked service for the corresponding Azure Function App | Linked service reference                                    | Yes                           |
| Function name  | Name of the function in the Azure Function App that this activity calls | String                                                      | Yes                           |
| Method         | REST API method for the function call                        | String Supported Types: "GET", "POST", "PUT"                | Yes                           |
| Header         | Headers that are sent to the request. For example, to set the language and type on a request: "headers": { "Accept-Language": "en-us", "Content-Type": "application/json" } | String (or expression with resultType of string)            | No                            |
| Body           | Body that is sent along with the request to the function api method | String (or expression with resultType of string) or object. | Required for PUT/POST methods |

See the schema of the request payload in [Request payload schema](control-flow-web-activity.md#request-payload-schema) section.

## Routing and queries

The Azure Function Activity supports **routing**. For example, if your Azure Function has the endpoint  `https://functionAPP.azurewebsites.net/api/<functionName>/<value>?code=<secret>`, then the `functionName` to use in the Azure Function Activity is `<functionName>/<value>`. You can parameterize this function to provide the desired `functionName` at runtime.

>[!NOTE]
>The `functionName` for Durable Functions should be taken from the **route** property of the function's binding in its JSON definition, to include its routing information.  Simply using the `functionName` without the route detail included will result in a failure because the Function App cannot be found.

The Azure Function Activity also supports **queries**. A query must be included as part of the `functionName`. For example, when the function name is `HttpTriggerCSharp` and the query that you want to include is `name=hello`, then you can construct the `functionName` in the Azure Function Activity as `HttpTriggerCSharp?name=hello`. This function can be parameterized so the value can be determined at runtime.

## Timeout and long-running functions

Azure Functions times out after 230 seconds regardless of the `functionTimeout` setting you've configured in the settings. For more information, see [this article](../azure-functions/functions-versions.md#timeout). To work around this behavior, follow an async pattern or use Durable Functions. The benefit of Durable Functions is that they offer their own state-tracking mechanism, so you don't need to implement your own state-tracking.

Learn more about Durable Functions in [this article](../azure-functions/durable/durable-functions-overview.md). You can set up an Azure Function Activity to call the Durable Function, which will return a response with a different URI, such as [this example](../azure-functions/durable/durable-functions-http-features.md#http-api-url-discovery). Because `statusQueryGetUri` returns HTTP Status 202 while the function is running, you can poll the status of the function by using a Web Activity. Set up a Web Activity with the `url` field set to `@activity('<AzureFunctionActivityName>').output.statusQueryGetUri`. When the Durable Function completes, the output of the function will be the output of the Web Activity.


## Sample

You can find a sample that uses an Azure Function to extract the content of a tar file [here](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV2/UntarAzureFilesWithAzureFunction).

## Next steps

Learn more about supported activities in [Pipelines and activities](concepts-pipelines-activities.md).
