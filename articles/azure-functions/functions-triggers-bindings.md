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
Azure Functions allows you to write code in response to events in Azure and other services. This is accomplished through *triggers* and *bindings*.

This article is a conceptual overview of triggers and bindings and is not specific to a programming language.

For details on a specific trigger or binding, see one of the reference topics below. 

| | | | |  
| --- | --- | --- | --- |  
| [HTTP/webhook](functions-bindings-http-webhook.md) | [Timer](functions-bindings-timer.md) | [Mobile Apps](functions-bindings-mobile-apps.md) | [Service Bus](functions-bindings-service-bus.md)  |  
| [DocumentDB](functions-bindings-documentdb.md) |  [Storage Blob](functions-bindings-storage-blob.md) | [Storage Queue](functions-bindings-storage-queue.md) |  [Storage Table](functions-bindings-storage-table.md) |  
| [Event Hubs](functions-bindings-event-hubs.md) | [Notification Hubs](functions-bindings-notification-hubs.md) | [SendGrid](functions-bindings-sendgrid.md) | [Twilio](functions-bindings-twilio.md) |   
| | | | |  

## Overview
A *trigger* determines how a function is invoked and a function must have exactly one trigger. Triggers always have associated data, which is often the payload that triggered the function. Input and output *bindings* provide a declarative way to connect to services from within your code. Bindings are optional and a function can have multiple input and output bindings.

You can configure triggers and bindings in the Integrate tab in the Azure Functions portal. Under the covers, the UI changes a filed called *function.json* file in the function directory. Triggers and bindings typically have a **name** property, which is an identifier you use in your code to access the binding. 

The following table shows the triggers and bindings that are suppored with Azure Functions. 

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

### Example: queue trigger and table output binding

Suppose you want to write a new row to Azure Table Storage whenever a new message appears in Azure Queue Storage. You would use an Azure Queue trigger and provide the following information in the **Integrate** tab:

* The storage account containing the queue
* The queue name
* The identifier you'll use in your code to read the contents of the queue message, such as `order`.

To write to Azure Table Storage, use an output binding with the following details:

* The storage account containing the table
* The table name
* The identifier you'll use in your code to create output items. You can also use the return value from the function.

Your code will then refer to these identifiers when integrating with Azure Storage.

```cs
#r "Newtonsoft.Json"

using Newtonsoft.Json.Linq;

public static Person Run(JObject order, TraceWriter log)
{
    // Input is a JSON object with the name and number of a new customer
    // The returned value will be written to Table Storage
    return new Person() { 
            PartitionKey = "Test", 
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
module.exports = function (context, myQueueItem) {
    myQueueItem.PartitionKey = "Test";
    myQueueItem.RowKey = generateQuickGuid();

    context.done(null, myQueueItem);
};

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
```

Here is the *function.json* that corresponds to the code above:

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
For more code examples and more specific information regarding Azure storage types that are supported, see [Azure Functions triggers and bindings for Azure Storage](functions-bindings-storage.md).

To view and edit the contents of *function.json* in the Azure portal, click the **Advanced editor** option on the **Integrate** tab of your function.

## Using the function return type to return a single output
In cases where your function code returns a single output, you can use an output binding named `$return` to retain a more natural function signature in your code. This can only be used with languages that support a return value (C#, Node.js, F#). The binding would be similar to the following blob output binding that is used with a queue trigger.

```json
{
  "bindings": [
    {
      "type": "queueTrigger",
      "name": "input",
      "direction": "in",
      "queueName": "test-input-node"
    },
    {
      "type": "blob",
      "name": "$return",
      "direction": "out",
      "path": "test-output-node/{id}"
    }
  ]
}
```

The following C# code returns the output more naturally without using an `out` parameter in the function signature.

```cs
public static string Run(WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return json;
}
```

Async example:

```cs
public static Task<string> Run(WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return json;
}
```


This same approach is demonstrated with Node.js, as follows:

```javascript
module.exports = function (context, input) {
    var json = JSON.stringify(input);
    context.log('Node.js script processed queue message', json);
    context.done(null, json);
}
```

The following is an F# example:

```fsharp
let Run(input: WorkItem, log: TraceWriter) =
    let json = String.Format("{{ \"id\": \"{0}\" }}", input.Id)   
    log.Info(sprintf "F# script processed queue message '%s'" json)
    json
```

This can also be used with multiple output parameters by designating a single output with `$return`.

## Resolving app settings
It is a best practice to store sensitive information as part of the run-time environment using app settings. By keeping sensitive information out of your app's configuration files, you limit exposure when a public repository is used to store app files.  

The Azure Functions run-time resolves app settings to values when the app setting name is enclosed in percent signs, `%your app setting%`. The following [Twilio binding](functions-bindings-twilio.md) uses an app setting named `TWILIO_ACCT_PHONE` for the `from` field of the binding. 

```json
{
  "type": "twilioSms",
  "name": "$return",
  "accountSid": "TwilioAccountSid",
  "authToken": "TwilioAuthToken",
  "to": "{mobileNumber}",
  "from": "%TWILIO_ACCT_PHONE%",
  "body": "Thank you {name}, your order was received Node.js",
  "direction": "out"
},
```



## Parameter binding and templates
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
Azure Functions provides a syntax to generate random GUIDs with your bindings. The following binding syntax writes output to a new BLOB with a unique name in a Storage container: 

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{rand-guid}"
}
```


## Advanced binding at runtime (imperative binding)

The standard input and output binding pattern using *function.json* is called [*declarative*](https://en.wikipedia.org/wiki/Declarative_programming) binding,
where the binding is defined by the JSON declaration. However, you can use [imperative](https://en.wikipedia.org/wiki/Imperative_programming)
binding. With this patttern, you can bind to any number of supported input and output binding on-the-fly in your function code.
You might need imperative binding in cases where the computation of binding path or other inputs needs to happen at run time in your function
instead of design time. 

Define an imperative binding as follows:

- **Do not** include an entry in *function.json* for your desired imperative bindings.
- Pass in an input parameter [`Binder binder`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Host/Bindings/Runtime/Binder.cs) 
or [`IBinder binder`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/IBinder.cs). 
- Use the following C# pattern to perform the data binding.

```cs
using (var output = await binder.BindAsync<T>(new BindingTypeAttribute(...)))
{
    ...
}
```

where `BindingTypeAttribute` is the .NET attribute that defines your binding and `T` is the input or output type that's 
supported by that binding type. `T` also cannot be an `out` parameter type (such as `out JObject`). For example, the 
Mobile Apps table output binding supports 
[six output types](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.MobileApps/MobileTableAttribute.cs#L17-L22),
but you can only use [ICollector<T>](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/ICollector.cs) 
or [IAsyncCollector<T>](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/IAsyncCollector.cs) for `T`.
	
The following example code creates a [Storage blob output binding](functions-bindings-storage-blob.md#storage-blob-output-binding)
with blob path that's defined at run time, then writes a string to the blob.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host.Bindings.Runtime;

public static async Task Run(string input, Binder binder)
{
    using (var writer = await binder.BindAsync<TextWriter>(new BlobAttribute("samples-output/path")))
    {
        writer.Write("Hello World!!");
    }
}
```

[BlobAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/BlobAttribute.cs)
defines the [Storage blob](functions-bindings-storage-blob.md) input or output binding, and 
[TextWriter](https://msdn.microsoft.com/library/system.io.textwriter.aspx) is a supported output binding type.
As is, the code gets the default app setting for the Storage account connection string (which is `AzureWebJobsStorage`). You can specify a 
custom app setting to use by adding the 
[StorageAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs)
and passing the attribute array into `BindAsync<T>()`. For example,

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host.Bindings.Runtime;

public static async Task Run(string input, Binder binder)
{
    var attributes = new Attribute[]
    {    
        new BlobAttribute("samples-output/path"),
        new StorageAccountAttribute("MyStorageAccount")
    };

    using (var writer = await binder.BindAsync<TextWriter>(attributes))
    {
        writer.Write("Hello World!");
    }
}
```

The following table shows you the corresponding .NET attribute to use for each binding type and which package to reference.

> [!div class="mx-codeBreakAll"]
| Binding | Attribute | Add reference |
|------|------|------|
| DocumentDB | [`Microsoft.Azure.WebJobs.DocumentDBAttribute`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.DocumentDB/DocumentDBAttribute.cs) | `#r "Microsoft.Azure.WebJobs.Extensions.DocumentDB"` |
| Event Hubs | [`Microsoft.Azure.WebJobs.ServiceBus.EventHubAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/EventHubs/EventHubAttribute.cs), [`Microsoft.Azure.WebJobs.ServiceBusAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/ServiceBusAccountAttribute.cs) | `#r "Microsoft.Azure.Jobs.ServiceBus"` |
| Mobile Apps | [`Microsoft.Azure.WebJobs.MobileTableAttribute`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.MobileApps/MobileTableAttribute.cs) | `#r "Microsoft.Azure.WebJobs.Extensions.MobileApps"` |
| Notification Hubs | [`Microsoft.Azure.WebJobs.NotificationHubAttribute`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.NotificationHubs/NotificationHubAttribute.cs) | `#r "Microsoft.Azure.WebJobs.Extensions.NotificationHubs"` |
| Service Bus | [`Microsoft.Azure.WebJobs.ServiceBusAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/ServiceBusAttribute.cs), [`Microsoft.Azure.WebJobs.ServiceBusAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.ServiceBus/ServiceBusAccountAttribute.cs) | `#r "Microsoft.Azure.WebJobs.ServiceBus"` |
| Storage queue | [`Microsoft.Azure.WebJobs.QueueAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/QueueAttribute.cs), [`Microsoft.Azure.WebJobs.StorageAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs) | |
| Storage blob | [`Microsoft.Azure.WebJobs.BlobAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/BlobAttribute.cs), [`Microsoft.Azure.WebJobs.StorageAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs) | |
| Storage table | [`Microsoft.Azure.WebJobs.TableAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/TableAttribute.cs), [`Microsoft.Azure.WebJobs.StorageAccountAttribute`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs) | |
| Twilio | [`Microsoft.Azure.WebJobs.TwilioSmsAttribute`](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.Twilio/TwilioSMSAttribute.cs) | `#r "Microsoft.Azure.WebJobs.Extensions.Twilio"` |



## Next steps
For more information, see the following resources:

* [Testing a function](functions-test-a-function.md)
* [Scale a function](functions-scale.md)

