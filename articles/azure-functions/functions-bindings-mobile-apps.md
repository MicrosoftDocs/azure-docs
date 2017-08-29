---
title: Azure Functions Mobile Apps bindings | Microsoft Docs
description: Understand how to use Azure Mobile Apps bindings in Azure Functions.
services: functions
documentationcenter: na
author: ggailey777
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.assetid: faad1263-0fa5-41a9-964f-aecbc0be706a
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 10/31/2016
ms.author: glenga

---
# Azure Functions Mobile Apps bindings
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and code [Azure Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md) bindings in Azure Functions. 
Azure Functions supports input and output bindings for Mobile Apps.

The Mobile Apps input and output bindings let you [read from and write to data tables](../app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md#TableOperations)
in your mobile app.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

<a name="input"></a>

## Mobile Apps input binding
The Mobile Apps input binding loads a record from a mobile table endpoint and passes it into your function. 
In a C# and F# functions, any changes made to the record are automatically sent back to the table when the function exits successfully.

The Mobile Apps input to a function uses the following JSON object in the `bindings` array of function.json:

```json
{
    "name": "<Name of input parameter in function signature>",
    "type": "mobileTable",
    "tableName": "<Name of your mobile app's data table>",
    "id" : "<Id of the record to retrieve - see below>",
    "connection": "<Name of app setting that has your mobile app's URL - see below>",
    "apiKey": "<Name of app setting that has your mobile app's API key - see below>",
    "direction": "in"
}
```

Note the following:

* `id` can be static, or it can be based on the trigger that invokes the function. For example, if you use a [queue trigger]() for your function, then 
  `"id": "{queueTrigger}"` uses the string value of the queue message as the record ID to retrieve.
* `connection` should contain the name of an app setting in your function app, which in turn contains the URL of your mobile app. The function 
  uses this URL to construct the required REST operations against your mobile app. You [create an app setting in your function app]() that contains 
  your mobile app's URL (which looks like `http://<appname>.azurewebsites.net`), then specify the name of the app setting in the `connection` property 
  in your input binding. 
* You need to specify `apiKey` if you [implement an API key in your Node.js mobile app backend](https://github.com/Azure/azure-mobile-apps-node/tree/master/samples/api-key),
  or [implement an API key in your .NET mobile app backend](https://github.com/Azure/azure-mobile-apps-net-server/wiki/Implementing-Application-Key). To do this,
  you [create an app setting in your function app]() that contains the API key, then add the `apiKey` property in your input binding with the name of the 
  app setting. 
  
  > [!IMPORTANT]
  > This API key must not be shared with your mobile app clients. It should only be distributed securely to service-side clients, like Azure Functions. 
  > 
  > [!NOTE]
  > Azure Functions stores your connection information and API keys as app settings so that they are not checked into your 
  > source control repository. This safeguards your sensitive information.
  > 
  > 

<a name="inputusage"></a>

## Input usage
This section shows you how to use your Mobile Apps input binding in your function code. 

When the record with the specified table and record ID is found, it is passed into the named 
[JObject](http://www.newtonsoft.com/json/help/html/t_newtonsoft_json_linq_jobject.htm) parameter (or, in Node.js,
it is passed into the `context.bindings.<name>` object). When the record is not found, the parameter is `null`. 

In C# and F# functions, any changes you make to the input record (input parameter) is automatically sent back to the 
Mobile Apps table when the function exits successfully. 
In Node.js functions, use `context.bindings.<name>` to access the input record. You cannot modify a record in Node.js.

<a name="inputsample"></a>

## Input sample
Suppose you have the following function.json, that retrieves a Mobile App table record with the id of the queue trigger message:

```json
{
"bindings": [
    {
    "name": "myQueueItem",
    "queueName": "myqueue-items",
    "connection":"",
    "type": "queueTrigger",
    "direction": "in"
    },
    {
        "name": "record",
        "type": "mobileTable",
        "tableName": "MyTable",
        "id" : "{queueTrigger}",
        "connection": "My_MobileApp_Url",
        "apiKey": "My_MobileApp_Key",
        "direction": "in"
    }
],
"disabled": false
}
```

See the language-specific sample that uses the input record from the binding. The C# and F# samples also modify the record's `text` property.

* [C#](#inputcsharp)
* [Node.js](#inputnodejs)

<a name="inputcsharp"></a>

### Input sample in C# #

```cs
#r "Newtonsoft.Json"    
using Newtonsoft.Json.Linq;

public static void Run(string myQueueItem, JObject record)
{
    if (record != null)
    {
        record["Text"] = "This has changed.";
    }    
}
```

<!--
<a name="inputfsharp"></a>
### Input sample in F# ## 

```fsharp
#r "Newtonsoft.Json"    
open Newtonsoft.Json.Linq
let Run(myQueueItem: string, record: JObject) =
  inputDocument?text <- "This has changed."
```
-->

<a name="inputnodejs"></a>

### Input sample in Node.js

```javascript
module.exports = function (context, myQueueItem) {    
    context.log(context.bindings.record);
    context.done();
};
```

<a name="output"></a>

## Mobile Apps output binding
Use the Mobile Apps output binding to write a new record to a Mobile Apps table endpoint.  

The Mobile Apps output for a function uses the following JSON object in the `bindings` array of function.json:

```json
{
    "name": "<Name of output parameter in function signature>",
    "type": "mobileTable",
    "tableName": "<Name of your mobile app's data table>",
    "connection": "<Name of app setting that has your mobile app's URL - see below>",
    "apiKey": "<Name of app setting that has your mobile app's API key - see below>",
    "direction": "out"
}
```

Note the following:

* `connection` should contain the name of an app setting in your function app, which in turn contains the URL of your mobile app. The function 
  uses this URL to construct the required REST operations against your mobile app. You [create an app setting in your function app]() that contains 
  your mobile app's URL (which looks like `http://<appname>.azurewebsites.net`), then specify the name of the app setting in the `connection` property 
  in your input binding. 
* You need to specify `apiKey` if you [implement an API key in your Node.js mobile app backend](https://github.com/Azure/azure-mobile-apps-node/tree/master/samples/api-key),
  or [implement an API key in your .NET mobile app backend](https://github.com/Azure/azure-mobile-apps-net-server/wiki/Implementing-Application-Key). To do this,
  you [create an app setting in your function app]() that contains the API key, then add the `apiKey` property in your input binding with the name of the 
  app setting. 
  
  > [!IMPORTANT]
  > This API key must not be shared with your mobile app clients. It should only be distributed securely to service-side clients, like Azure Functions. 
  > 
  > [!NOTE]
  > Azure Functions stores your connection information and API keys as app settings so that they are not checked into your 
  > source control repository. This safeguards your sensitive information.
  > 
  > 

<a name="outputusage"></a>

## Output usage
This section shows you how to use your Mobile Apps output binding in your function code. 

In C# functions, use a named output parameter of type `out object` to access the output record. In Node.js functions, use 
`context.bindings.<name>` to access the output record.

<a name="outputsample"></a>

## Output sample
Suppose you have the following function.json, that defines a queue trigger and a Mobile Apps output:

```json
{
"bindings": [
    {
    "name": "myQueueItem",
    "queueName": "myqueue-items",
    "connection":"",
    "type": "queueTrigger",
    "direction": "in"
    },
    {
    "name": "record",
    "type": "mobileTable",
    "tableName": "MyTable",
    "connection": "My_MobileApp_Url",
    "apiKey": "My_MobileApp_Key",
    "direction": "out"
    }
],
"disabled": false
}
```

See the language-specific sample that creates a record in the Mobile Apps table endpoint with the content of the queue message.

* [C#](#outcsharp)
* [Node.js](#outnodejs)

<a name="outcsharp"></a>

### Output sample in C# #

```cs
public static void Run(string myQueueItem, out object record)
{
    record = new {
        Text = $"I'm running in a C# function! {myQueueItem}"
    };
}
```

<!--
<a name="outfsharp"></a>
### Output sample in F# ## 
```fsharp

```
-->
<a name="outnodejs"></a>

### Output sample in Node.js

```javascript
module.exports = function (context, myQueueItem) {

    context.bindings.record = {
        text : "I'm running in a Node function! Data: '" + myQueueItem + "'"
    }   

    context.done();
};
```

## Next steps
[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]

