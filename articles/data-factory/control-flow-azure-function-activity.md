---
title: Azure Function Activity in Azure Data Factory | Microsoft Docs
description: Learn how to use the Azure Function activity to run an Azure Function in a Data Factory pipeline
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/09/2019
author: sharonlo101
ms.author: shlo
manager: craigg
---

# Azure Function activity in Azure Data Factory

The Azure Function activity allows you to run [Azure Functions](../azure-functions/functions-overview.md) in a Data Factory pipeline. To run an Azure Function, you need to create a linked service connection and an activity that specifies the Azure Function that you plan to execute.

For an eight-minute introduction and demonstration of this feature, watch the following video:

> [!VIDEO https://channel9.msdn.com/shows/azure-friday/Run-Azure-Functions-from-Azure-Data-Factory-pipelines/player]

## Azure Function linked service

The return type of the Azure function has to be a valid `JObject`. (Keep in mind that [JArray](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Linq_JArray.htm) is *not* a `JObject`.) Any return type other than `JObject` fails and raises the user error *Response Content is not a valid JObject*.

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| type   | The type property must be set to: **AzureFunction** | yes |
| function app url | URL for the Azure Function App. Format is `https://<accountname>.azurewebsites.net`. This URL is the value under **URL** section when viewing your Function App in the Azure portal  | yes |
| function key | Access key for the Azure Function. Click on the **Manage** section for the respective function, and copy either the **Function Key** or the **Host key**. Find out more here: [Azure Functions HTTP triggers and bindings](../azure-functions/functions-bindings-http-webhook.md#authorization-keys) | yes |
|   |   |   |

## Azure Function activity

| **Property**  | **Description** | **Allowed values** | **Required** |
| --- | --- | --- | --- |
| name  | Name of the activity in the pipeline  | String | yes |
| type  | Type of activity is ‘AzureFunctionActivity’ | String | yes |
| linked service | The Azure Function linked service for the corresponding Azure Function App  | Linked service reference | yes |
| function name  | Name of the function in the Azure Function App that this activity calls | String | yes |
| method  | REST API method for the function call | String Supported Types: "GET", "POST", "PUT"   | yes |
| header  | Headers that are sent to the request. For example, to set the language and type on a request: "headers": { "Accept-Language": "en-us", "Content-Type": "application/json" } | String (or expression with resultType of string) | No |
| body  | body that is sent along with the request to the function api method  | String (or expression with resultType of string) or object.   | Required for PUT/POST methods |
|   |   |   | |

See the schema of the request payload in [Request payload schema](control-flow-web-activity.md#request-payload-schema) section.

## Routing and Queries

The Azure Function Activity supports **routing**. For example, if your Azure Function has the following endpoint - `https://functionAPP.azurewebsites.net/api/<functionName>/<value>?code=<secret>` - then the `functionName` to use in the Azure Function Activity is `<functionName>/<value>`, which you also can parameterize to provide the desired `functionName` at runtime.

The Azure Function Activity also supports **queries**. A query has to be included as part of the `functionName`. For example when the function's name is `HttpTriggerCSharp` and the query you want to include is `name=hello`, then you can construct the `functionName` in the Azure Function Activity as `HttpTriggerCSharp?name=hello`. This can also be parameterized so that the value can be determined at runtime.

## Timeout and Long Running Functions

Azure Functions will timeout after 230 seconds regardless of the `functionTimeout` setting you have configured in the settings. Read about it [here](../../includes/functions-timeout-duration.md). To work around this, you will have to follow an async pattern or use Durable Functions. The benefit of Durable Functions is that they also offer their own state-tracking mechanism, so you will not have to implement your own.

Learn more about Durable Functions [here](../azure-functions/durable/durable-functions-overview.md). You can set up an Azure Function Activity to call the Durable Function, which will return a response with a different URIs like [this](../azure-functions/durable/durable-functions-http-api.md#http-api-url-discovery). Since `statusQueryGetUri` returns HTTP Status 202 while the function is running, you can poll the status of the function using a Web Activity. Simply setup a Web Activity with the `url` field set to `@activity('<AzureFunctionActivityName>').output.statusQueryGetUri`. When the Durable Function completes, the output of the function will be the output of the Web Activity.


## Next steps

Learn more about activities in Data Factory in [Pipelines and activities in Azure Data Factory](concepts-pipelines-activities.md).
