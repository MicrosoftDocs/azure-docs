---
title: Azure Functions triggers and bindings | Microsoft Docs
description: Understand how to use triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: christopheranderson
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
ms.date: 11/08/2016
ms.author: chrande

---
# Azure Functions triggers and bindings developer reference
This topic provides general reference for triggers and bindings. It includes some of the advanced binding features and syntax supported by all binding types.  

If you are looking for detailed information around configuring and coding a specific type of trigger or binding, you may want to click on one of the trigger or bindings listed below instead:

[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

These articles assume that you've read the [Azure Functions developer reference](functions-reference.md), and the [C#](functions-reference-csharp.md), [F#](functions-reference-fsharp.md), or [Node.js](functions-reference-node.md) developer reference articles.

## Overview
Triggers are event responses used to trigger your custom code. They allow you to respond to events across the Azure platform or on premise. Bindings represent the necessary meta data used to connect your code to the desired trigger or associated input or output data. The *function.json* file for each function contains all related bindings. There is no limit to the number of input and output bindings a function can have. However, only a single trigger binding is supported for each function.  

To get a better idea of the different bindings you can integrate with your Azure Function app, refer to the following table.

[!INCLUDE [dynamic compute](../../includes/functions-bindings.md)]

To better understand triggers and bindings in general, suppose you want to execute some code to process a new item dropped into an Azure Storage queue. Azure Functions provides an Azure Queue trigger to support this. You would need, the following information to monitor the queue:

* The storage account where the queue exists.
* The queue name.
* A variable name that your code would use to refer to the new item that was dropped into the queue.  

A queue trigger binding contains this information for an Azure function. Here is an example *function.json* containing a queue trigger binding. 

```json
{
  "bindings": [
    {
      "name": "myNewUserQueueItem",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "queue-newusers",
      "connection": "MY_STORAGE_ACCT_APP_SETTING"
    }
  ],
  "disabled": false
}
```

Your code may send different types of output depending on how the new queue item is processed. For example, you might want to write a new record to an Azure Storage table.  To accomplish this, you can setup an output binding to an Azure Storage table. Here is an example *function.json* that includes a storage table output binding that could be used with a queue trigger. 

```json
{
  "bindings": [
    {
      "name": "myNewUserQueueItem",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "queue-newusers",
      "connection": "MY_STORAGE_ACCT_APP_SETTING"
    },
    {
      "type": "table",
      "name": "myNewUserTableBinding",
      "tableName": "newUserTable",
      "connection": "MY_TABLE_STORAGE_ACCT_APP_SETTING",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The following C# function responds to a new item being dropped into the queue and writes a new user entry into an Azure Storage table.

```cs
#r "Newtonsoft.Json"

using System;
using Newtonsoft.Json;

public static async Task Run(string myNewUserQueueItem, IAsyncCollector<Person> myNewUserTableBinding, 
                                TraceWriter log)
{
    // In this example the queue item is a JSON string representing an order that contains the name, 
    // address and mobile number of the new customer.
    dynamic order = JsonConvert.DeserializeObject(myNewUserQueueItem);

    await myNewUserTableBinding.AddAsync(
        new Person() { 
            PartitionKey = "Test", 
            RowKey = Guid.NewGuid().ToString(), 
            Name = order.name,
            Address = order.address,
            MobileNumber = order.mobileNumber }
        );
}

public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string MobileNumber { get; set; }
}
```

For more code examples and more specific information regarding Azure storage types that are supported, see [Azure Functions triggers and bindings for Azure Storage](functions-bindings-storage.md).

To use the more advanced binding features in the Azure portal, click the **Advanced editor** option on the **Integrate** tab of your function. The advanced editor allows you to edit the *function.json* directly in the portal.

## Random GUIDs
Azure Functions provides a syntax to generate random GUIDs with your bindings. The following binding syntax will write output to a new BLOB with a unique name in an Azure Storage container: 

```json
{
  "type": "blob",
  "name": "blobOutput",
  "direction": "out",
  "path": "my-output-container/{rand-guid}"
}
```


## Returning a single output
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


This same approach is demonstrated below with Node.js.

```javascript
module.exports = function (context, input) {
    var json = JSON.stringify(input);
    context.log('Node.js script processed queue message', json);
    context.done(null, json);
}
```

F# example provided below.

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



## Parameter binding
Instead of a static configuration setting for your output binding properties, you can configure the settings to be dynamically bound to data that is part of your trigger's input binding. Consider a scenario where new orders are processed using an Azure Storage queue. Each new queue item is a JSON string containing at least the following properties:

```json
{
  "name" : "Customer Name",
  "address" : "Customer's Address".
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

Now your function code only has to initialize the output parameter as follows. During execution the output properties will be bound to the desired input data.

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

## Advanced binding with Binder
Using `Binder`/ `IBinder` is an advanced binding technique that allows you to perform bindings imperatively in your code as opposed to declarative via the *function.json* metadata file. You might need to do this in cases where the computation of binding path or other inputs needs to happen at run-time in your function. Note that when using an `Binder` parameter, you **should not** include a corresponding entry in *function.json* for that parameter.

In the below example, we're dynamically binding to a blob output. As you can see, because you're declaring the binding in code, your path info can be computed in any way you wish. Note that you can bind to any of the other raw binding attributes as well (e.g. QueueAttribute/EventHubAttribute/ServiceBusAttribute/etc.) You can also do so iteratively to bind multiple times.

Note that the type parameter passed to `BindAsyn`c (in this case TextWriter) must be a type that the target binding supports.

Bindings in function.json:

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ]
}
```

C# function code:

```cs
using System;
using System.Net;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host.Bindings.Runtime;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, Binder binder, TraceWriter log)
{
    log.Verbose($"C# HTTP function processed RequestUri={req.RequestUri}");

    // determine the path at runtime in any way you choose
    string path = "samples-output/path";

    using (var writer = await binder.BindAsync<TextWriter>(new BlobAttribute(path)))
    {
        writer.Write("Hello World!!");
    }

    return new HttpResponseMessage(HttpStatusCode.OK); 
}
```

There are bind overloads that take an array of attributes. In cases where you need to control the target storage account, you pass in a collection of attributes, starting with the binding type attribute (e.g. `BlobAttribute`) and inlcuding a `StorageAccountAttribute` instance pointing to the account to use. For example:

```cs
var attributes = new Attribute[]
{
    new BlobAttribute(path),
    new StorageAccountAttribute("MyStorageAccount")
};

using (var writer = await binder.BindAsync<TextWriter>(attributes))
{
    writer.Write("Hello World!");
}
```



## Next steps
For more information, see the following resources:

* [Testing a function](functions-test-a-function.md)
* [Scale a function](functions-scale.md)

