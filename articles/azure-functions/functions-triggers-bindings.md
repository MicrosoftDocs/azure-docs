---
title: Work with triggers and bindings in Azure Functions | Microsoft Docs
description: Learn how to use triggers and bindings in Azure Functions to connect your code execution to online events and cloud-based services.
services: functions
documentationcenter: na
author: lindydonna
manager: erikre
editor: ''
tags: ''
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: cbc7460a-4d8a-423f-a63e-1cd33fef7252
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/03/2017
ms.author: donnam

---

# Learn how to work with triggers and bindings in Azure Functions 
Azure Functions allows you to write code in response to events in Azure and other services, through *triggers* and *bindings*. This article is a conceptual overview of triggers and bindings and is not specific to programming language or binding. Features that are common to all bindings are described here.

For details on a specific trigger or binding, see one of the following reference topics. 

<!--TODO: remove this table -->
| | | | |  
| --- | --- | --- | --- |  
| [HTTP/webhook](functions-bindings-http-webhook.md) | [Timer](functions-bindings-timer.md) | [Mobile Apps](functions-bindings-mobile-apps.md) | [Service Bus](functions-bindings-service-bus.md)  |  
| [DocumentDB](functions-bindings-documentdb.md) |  [Storage Blob](functions-bindings-storage-blob.md) | [Storage Queue](functions-bindings-storage-queue.md) |  [Storage Table](functions-bindings-storage-table.md) |  
| [Event Hubs](functions-bindings-event-hubs.md) | [Notification Hubs](functions-bindings-notification-hubs.md) | [SendGrid](functions-bindings-sendgrid.md) | [Twilio](functions-bindings-twilio.md) |   
| | | | |  

## Overview

Triggers and bindings are a declarative way to define how a function is invoked and what data it works with. A *trigger* defines how a function is invoked. A function must have exactly one trigger. Triggers have associated data, which is usually the payload that triggered the function. 

Input and output *bindings* provide a declarative way to connect to data from within your code. Similar to triggers, you specify connection strings and other properties in your function configuration. Bindings are optional and a function can have multiple input and output bindings. 

Using triggers and bindings, you can write code that is more generic and does not hardcode the details of the services with which it interacts. Data coming from services simply become input values for your function code. To output data to another service (such as creating a new row in Azure Table Storage), use the return value of the method. Or, if you need to output multiple values, use a helper object. Triggers and bindings have a **name** property, which is an identifier you use in your code to access the binding.

You can configure triggers and bindings in the **Integrate** tab in the Azure Functions portal. Under the covers, the UI modifies a file called *function.json* file in the function directory. You can edit this file by changing to the **Advanced editor**.

The following table shows the triggers and bindings that are supported with Azure Functions. 

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

### Example: queue trigger and table output binding

Suppose you want to write a new row to Azure Table Storage whenever a new message appears in Azure Queue Storage. This scenario can be implemented using an Azure Queue trigger and a Table output binding. 

For the queue trigger, you would provide the following information in the **Integrate** tab:

* The name of the app setting that contains the storage account connection string for the queue
* The queue name
* The identifier in your code to read the contents of the queue message, such as `order`.

To write to Azure Table Storage, use an output binding with the following details:

* The name of the app setting that contains the storage account connection string for the table
* The table name
* The identifier in your code to create output items. You can also use the return value from the function.

Bindings use app settings for connection strings to enforce the best practice that *function.json* does not contain service secrets.

Then, use the identifiers you provided to integrate with Azure Storage in your code.

```cs
#r "Newtonsoft.Json"

using Newtonsoft.Json.Linq;

// From an incoming queue message that is a JSON object, add fields and write to Table Storage
// The method return value creates a new row in Table Storage
public static Person Run(JObject order, TraceWriter log)
{
    return new Person() { 
            PartitionKey = "Orders", 
            RowKey = Guid.NewGuid().ToString(),  
            Name = order["Name"].ToString(),
            MobileNumber = order["MobileNumber"].ToString() };  
}
 
public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
    public string MobileNumber { get; set; }
}
```

```javascript
// From an incoming queue message that is a JSON object, add fields and write to Table Storage
// The second parameter to context.done is used as the value for the new row
module.exports = function (context, order) {
    order.PartitionKey = "Orders";
    order.RowKey = generateQuickGuid(); // simple pseudo-GUID generator

    context.done(null, order);
};

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
```

Here is the *function.json* that corresponds to the preceding code. Note that the same configuration can be used, regardless of the language of the function implementation.

```json
{
  "bindings": [
    {
      "name": "order",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "myqueue-items",
      "connection": "MY_STORAGE_ACCT_APP_SETTING"
    },
    {
      "type": "table",
      "name": "$return",
      "tableName": "outTable",
      "direction": "out",
      "connection": "MY_TABLE_STORAGE_ACCT_APP_SETTING"
    }
  ],
  "disabled": false
}
```
To view and edit the contents of *function.json* in the Azure portal, click the **Advanced editor** option on the **Integrate** tab of your function.

For more code examples and details on integrating with Azure Storage, see [Azure Functions triggers and bindings for Azure Storage](functions-bindings-storage.md).

## Using the function return type to return a single output

The preceding example shows how to use the function return value to provide output to a binding, which is achieved by using the special name parameter `$return`. (This is only supported in languages that have a return value, such as C#, JavaScript, and F#.) If a function has multiple output bindings, use `$return` for only one of the output bindings. 

```json
// excerpt of function.json
{
    "type": "blob",
    "name": "$return",
    "direction": "out",
    "path": "output-container/{id}"
}
```

The examples below show how return types are used with output bindings in C#, JavaScript, and F#.

```cs
// C# example: use method return value for output binding
public static string Run(WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return json;
}
```

```cs
// C# example: async method, using return value for output binding
public static Task<string> Run(WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return json;
}
```

```javascript
// JavaScript: return a value in the second parameter to context.done
module.exports = function (context, input) {
    var json = JSON.stringify(input);
    context.log('Node.js script processed queue message', json);
    context.done(null, json);
}
```

```fsharp
// F# example: use return value for output binding
let Run(input: WorkItem, log: TraceWriter) =
    let json = String.Format("{{ \"id\": \"{0}\" }}", input.Id)   
    log.Info(sprintf "F# script processed queue message '%s'" json)
    json
```

## Resolving app settings
As a best practice, secrets and connection strings should be managed using app settings, rather than configuration files. This limits access to these secrets and makes it possible to store `function.json` in a public source control repository.

App settings are also useful whenever you want to change configuration based on the environment. For example, in a test environment, you may want to monitor a different queue or blob storage container.

App settings are resolved whenever a value is enclosed in percent signs, such as `%MyAppSetting`. Note that the `connection` property of triggers and bindings is a special case and automatically resolves values as app settings. 

The following example is a queue trigger that uses an app setting `%input-queue-name%` to define the queue to trigger on.

```json
{
  "bindings": [
    {
      "name": "order",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "%input-queue-name%",
      "connection": "MY_STORAGE_ACCT_APP_SETTING"
    }
  ]
}
```

## Binding expressions and patterns
Instead of a static configuration setting for your output binding properties, you can configure the settings to be dynamically bound to data that is part of your trigger's input binding. Consider a scenario where new orders are processed using an Azure Storage queue. Each new queue item is a JSON string containing at least the following properties:

```json
{
  "name" : "Customer Name",
  "address" : "Customer's Address",
  "mobileNumber" : "Customer's mobile number in the format - +1XXXYYYZZZZ."
}
```

You might want to send the customer an SMS text message using your Twilio account as an update that the order was received.  You can configure the `body` and `to` field of your Twilio output binding to be dynamically bound to the `name` and `mobileNumber` that were part of the input as follows.

```json
{
  "name": "myNewOrderItem",
  "type": "queueTrigger",
  "direction": "in",
  "queueName": "queue-newOrders",
  "connection": "orders_STORAGE"
},
{
  "type": "twilioSms",
  "name": "$return",
  "accountSid": "TwilioAccountSid",
  "authToken": "TwilioAuthToken",
  "to": "{mobileNumber}",
  "from": "%TWILIO_ACCT_PHONE%",
  "body": "Thank you {name}, your order was received",
  "direction": "out"
},
```

Now your function code only has to initialize the output parameter as follows. During execution, the output properties are bound to the desired input data.

```cs
#r "Newtonsoft.Json"
#r "Twilio.Api"

using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Twilio;

public static async Task<SMSMessage> Run(string myNewOrderItem, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myNewOrderItem}");

    dynamic order = JsonConvert.DeserializeObject(myNewOrderItem);    

    // Even if you want to use a hard coded message and number in the binding, you must at least 
    // initialize the SMSMessage variable.
    SMSMessage smsText = new SMSMessage();

    // The following isn't needed since we use parameter binding for this
    //string msg = "Hello " + order.name + ", thank you for your order.";
    //smsText.Body = msg;
    //smsText.To = order.mobileNumber;

    return smsText;
}
```

Node.js:

```javascript
module.exports = function (context, myNewOrderItem) {    
    context.log('Node.js queue trigger function processed work item', myNewOrderItem);    

    // No need to set the properties of the text, we use parameters in the binding. We do need to 
    // initialize the object.
    var smsText = {};    

    context.done(null, smsText);
}
```

## Random GUIDs
Azure Functions provides a convenience syntax for generating GUIDs in your bindings, through the `{rand-guid}` template. The following example uses this to generate a unique blob name: 

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{rand-guid}"
}
```

## Next steps
For more information, see the following resources:

* [Testing a function](functions-test-a-function.md)
* [Scale a function](functions-scale.md)

