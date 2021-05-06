---
title: Azure Function Activity in Azure Data Factory 
description: Learn how to use the Azure Function activity to run an Azure Function in a Data Factory pipeline
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: conceptual
ms.date: 01/09/2019
---

# Azure Function activity in Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]
The Azure Function activity allows you to run [Azure Functions](../azure-functions/functions-overview.md) in a Data Factory pipeline. To run an Azure Function, you need to create a linked service connection and an activity that specifies the Azure Function that you plan to execute.

For an eight-minute introduction and demonstration of this feature, watch the following video:

> [!VIDEO https://channel9.msdn.com/shows/azure-friday/Run-Azure-Functions-from-Azure-Data-Factory-pipelines/player]

## Azure Function linked service

The return type of the Azure function has to be a valid `JObject`. (Keep in mind that [JArray](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Linq_JArray.htm) is *not* a `JObject`.) Any return type other than `JObject` fails and raises the user error *Response Content is not a valid JObject*.

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| type   | The type property must be set to: **AzureFunction** | yes |
| function app url | URL for the Azure Function App. Format is `https://<accountname>.azurewebsites.net`. This URL is the value under **URL** section when viewing your Function App in the Azure portal  | yes |
| function key | Access key for the Azure Function. Click on the **Manage** section for the respective function, and copy either the **Function Key** or the **Host key**. Find out more here: [Azure Functions HTTP triggers and bindings](../azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) | yes |
|   |   |   |

## Azure Function activity

| **Property**  | **Description** | **Allowed values** | **Required** |
| --- | --- | --- | --- |
| name  | Name of the activity in the pipeline  | String | yes |
| type  | Type of activity is ‘AzureFunctionActivity’ | String | yes |
| linked service | The Azure Function linked service for the corresponding Azure Function App  | Linked service reference | yes |
| function name  | Name of the function in the Azure Function App that this activity calls | String | yes |
| method  | REST API method for the function call | String Supported Types: "GET", "POST", "PUT"   | yes |
| header  | Headers that are sent to the request. For example, to set the language and type on a request: "headers": { "Accept-Language": "en-us", "Content-Type": "application/json" } | String (or expression with resultType of string) | No |
| body  | body that is sent along with the request to the function api method  | String (or expression with resultType of string) or object.   | Required for PUT/POST methods |
|   |   |   | |

See the schema of the request payload in [Request payload schema](control-flow-web-activity.md#request-payload-schema) section.

## Routing and queries

The Azure Function Activity supports **routing**. For example, if your Azure Function has the endpoint  `https://functionAPP.azurewebsites.net/api/<functionName>/<value>?code=<secret>`, then the `functionName` to use in the Azure Function Activity is `<functionName>/<value>`. You can parameterize this function to provide the desired `functionName` at runtime.

The Azure Function Activity also supports **queries**. A query has to be included as part of the `functionName`. For example, when the function name is `HttpTriggerCSharp` and the query that you want to include is `name=hello`, then you can construct the `functionName` in the Azure Function Activity as `HttpTriggerCSharp?name=hello`. This function can be parameterized so the value can be determined at runtime.

## Timeout and long running functions

Azure Functions times out after 230 seconds regardless of the `functionTimeout` setting you've configured in the settings. For more information, see [this article](../azure-functions/functions-versions.md#timeout). To work around this behavior, follow an async pattern or use Durable Functions. The benefit of Durable Functions is that they offer their own state-tracking mechanism, so you won't have to implement your own.

Learn more about Durable Functions in [this article](../azure-functions/durable/durable-functions-overview.md). You can set up an Azure Function Activity to call the Durable Function, which will return a response with a different URI, such as [this example](../azure-functions/durable/durable-functions-http-features.md#http-api-url-discovery). Because `statusQueryGetUri` returns HTTP Status 202 while the function is running, you can poll the status of the function by using a Web Activity. Simply set up a Web Activity with the `url` field set to `@activity('<AzureFunctionActivityName>').output.statusQueryGetUri`. When the Durable Function completes, the output of the function will be the output of the Web Activity.


## Sample

You can find a sample of a Data Factory that uses an Azure Function to extract the content of a tar file [here](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV2/UntarAzureFilesWithAzureFunction).

## Next steps

Learn more about activities in Data Factory in [Pipelines and activities in Azure Data Factory](concepts-pipelines-activities.md).
