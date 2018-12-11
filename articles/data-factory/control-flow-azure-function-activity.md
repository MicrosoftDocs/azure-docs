---
title: Azure Function Activity in Azure Data Factory | Microsoft Docs
description: Learn how to use the Azure Function activity to run an Azure Function in a Data Factory pipeline
services: data-factory
documentationcenter: ''
author: douglaslMS
manager: craigg
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: douglasl
---

# Azure Function activity in Azure Data Factory

The Azure Function activity allows you to run [Azure Functions](../azure-functions/functions-overview.md) in a Data Factory pipeline. To run an Azure Function, you need to create a linked service connection and an activity that specifies the Azure Function that you plan to execute.

## Azure Function linked service

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
| body  | body that is sent along with the request to the function api method  | String (or expression with resultType of string).   | Required for PUT/POST methods |
|   |   |   | |

See the schema of the request payload in [Request payload schema](control-flow-web-activity.md#request-payload-schema) section.

## Next steps

Learn more about activities in Data Factory in [Pipelines and activities in Azure Data Factory](concepts-pipelines-activities.md).