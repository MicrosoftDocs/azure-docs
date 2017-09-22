---
title: Java developer reference for Azure Functions | Microsoft Docs
description: Understand how to develop functions with Java.
services: functions
documentationcenter: na
author: rloutlaw
manager: justhe
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture
ms.service: functions
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/20/2017
ms.author: routlaw
---
# Azure Functions Java developer guide
> [!div class="op_single_selector"]
> * [C# script](functions-reference-csharp.md)
> * [F# script](functions-reference-fsharp.md)
> * [JavaScript](functions-reference-node.md)
> * [Java](functions-reference-java.md)
> 

## Programming model 

Your Azure function should be a stateless class method that processes input and produces output. Although you are allowed to write instance methods, your function must not depend on any instance fields of the class. All  function methods must have a `public` access modifier.

### Triggers and annotations

Typically an Azure function is invoked because of an external trigger. Your function needs to process that trigger and its associated inputs and produce one or more outputs.

Java annotations are included in the `azure-functions-java-core` package to bind input and outputs to your methods. The supported input triggers and output binding annotations are included in the following table:

Binding | Annotation
---|---
CosmosDB | N/A
Event Hubs | <ul><li>`EventHubTrigger`</li><li>`EventHubOutput`</li></ul> 
HTTP | <ul><li>`HttpTrigger`</li><li>`HttpOutput`</li></ul>
Mobile Apps | N/A
Notification Hubs | N/A
Service Bus | <ul><li>`ServiceBusQueueTrigger`</li><li>`ServiceBusQueueOutput`</li><li>`ServiceBusTopicTrigger`</li><li>`ServiceBusTopicOutput`</li></ul>
Storage Blob | <ul><li>`BlobTrigger`</li><li>`BlobOutput`</li><li>`StorageAccount`</li></ul>
Storage Queue | <ul><li>`QueueTrigger`</li><li>`QueueOutput`</li><li>`StorageAccount`</li></ul>
Storage Table | <ul><li>`TableInput`</li><li>`TableOutput`</li><li>`StorageAccount`</li></ul>
Timer | <ul><li>`TimerTrigger`</li></ul>
Twilio | N/A

Trigger inputs and outputs can also be defined in the [function.json](/azure/azure-functions/functions-reference#function-code) for your application.

Example using annotations:

```java
import com.microsoft.azure.serverless.functions.annotation.HttpTrigger;
import com.microsoft.azure.serverless.functions.ExecutionContext;

public class Function {
    public String echo(@HttpTrigger(name = "req", methods = {"get"}, authLevel = AuthorizationLevel.ANONYMOUS) String req, ExecutionContext context) {
        return String.format(req);
    }
}
```

The same function written without annotations:

```java
package com.example;

public class MyClass {
    public static String echo(String in) {
        return in;
    }
}
```

with the corresponding `function.json`:

```json
{
  "scriptFile": "azure-functions-example.jar",
  "entryPoint": "com.example.MyClass.echo",
  "bindings": [
    {
      "type": "httpTrigger",
      "name": "req",
      "direction": "in",
      "authLevel": "anonymous",
      "methods": [ "get" ]
    },
    {
      "type": "http",
      "name": "$return",
      "direction": "out"
    }
  ]
}

```

## Data Types

You are free to use all the data types in Java for the input and output data, including native types; customized Java types and specialized Azure types defined in `azure-functions-java-core` package. The Azure Functions runtime will try to convert the input received into the type requested by your code.

### Strings

Strings passed into function methods will be interpreted directly as Strings by the function method if the input parameter type for the function is of type `String`. 

### Plain old Java objects (POJOs)

Strings formatted with JSON will be convered to Java types if the input of the function method expects that Java type. This allows you to pass deserialized JSON objects into your functions and then work with the Java types in your function code.

POJO types used as inputs to functions must the same `public` access modififer as the function methods they are being used in. The POJO class fields do not have to be declared `public`; for example a JSON string `{ "x": 3 }` is able to be converted to the following POJO type:

```Java
public class MyData {
    private int x;
}
```

### Byte arrays

## Function method overloading

You are  allowed to overload function methods with the same name but with different types. For example, you can have both `String echo(String s)` and `String echo(MyType s)` in one class, and Azure Functions runtime will decide which one to invoke by examine the actual input type (for HTTP input, MIME type `text/plain` leads to `String` while `application/json` represents `MyType`).

## Inputs

Input are divided into two categories in Azure Functions: one is the trigger input and the other is the additional input. Although they are different in `function.json`, the usage are identical in Java code. Let's take the following code snippet as an example:

```java
package com.example;

import com.microsoft.azure.serverless.functions.annotation.Bind;

public class MyClass {
    public static String echo(String in, @Bind("item") MyObject obj) {
        return "Hello, " + in + " and " + obj.getKey() + ".";
    }

    private static class MyObject {
        public String getKey() { return this.RowKey; }
        private String RowKey;
    }
}
```

The `@Bind` annotation accepts a `String` property which represents the name of the binding/trigger defined in `function.json`:

```json
{
  "scriptFile": "azure-functions-example.jar",
  "entryPoint": "com.example.MyClass.echo",
  "bindings": [
    {
      "type": "httpTrigger",
      "name": "req",
      "direction": "in",
      "authLevel": "anonymous",
      "methods": [ "put" ],
      "route": "items/{id}"
    },
    {
      "type": "table",
      "name": "item",
      "direction": "in",
      "tableName": "items",
      "partitionKey": "Example",
      "rowKey": "{id}",
      "connection": "ExampleStorageAccount"
    },
    {
      "type": "http",
      "name": "$return",
      "direction": "out"
    }
  ]
}
```

So when this function is invoked, the HTTP request payload will be passed as the `String` for argument `in`; and one specific item will be retrieved from the Azure Table Storage and be parsed to `MyObject` type and be passed to argument `obj`.

## Outputs

Outputs can be expressed both in return value or output parameters. If there is only one output, you are recommended to use the return value. For multiple outputs, you have to use output parameters.

Return value is the simplest form of output, you just return the value of any type, and Azure Functions runtime will try to marshal it back to the actual type (such as an HTTP response). In `functions.json`, you use `$return` as the name of the output binding.

To produce multiple output values, use `OutputParameter<T>` type defined in the `azure-functions-java-core` package. If you need to make an HTTP response and push a message to a queue as well, you can write something like:

```java
package com.example;

import com.microsoft.azure.serverless.functions.OutputParameter;
import com.microsoft.azure.serverless.functions.annotation.Bind;

public class MyClass {
    public static String echo(String body, @Bind("message") OutputParameter<String> queue) {
        String result = "Hello, " + body + ".";
        queue.setValue(result);
        return result;
    }
}
```

and define the output binding in `function.json`:

```json
{
  "scriptFile": "azure-functions-example.jar",
  "entryPoint": "com.example.MyClass.echo",
  "bindings": [
    {
      "type": "httpTrigger",
      "name": "req",
      "direction": "in",
      "authLevel": "anonymous",
      "methods": [ "post" ]
    },
    {
      "type": "queue",
      "name": "message",
      "direction": "out",
      "queueName": "myqueue",
      "connection": "ExampleStorageAccount"
    },
    {
      "type": "http",
      "name": "$return",
      "direction": "out"
    }
  ]
}
```

## Functions execution context

You interact with Azure Functions execution environment via the `ExecutionContext` object defined in the `azure-functions-java-core` package. Use the `ExecutionContext` object to use invocation information and functions runtime information in your code.

<insert sample>

### Logging

Access to the Functions runtime logger is available through the `ExecutionContext` object. This logger is tied to the Azure monitor and allows you to flag warnings and errors encountered during function execution.

The following example code logs a warning message if the request body received is empty.

```java
import com.microsoft.azure.serverless.functions.annotation.HttpTrigger;
import com.microsoft.azure.serverless.functions.ExecutionContext;

public class Function {
    public String echo(@HttpTrigger(name = "req", methods = {"get"}, authLevel = AuthorizationLevel.ANONYMOUS) String req, ExecutionContext context) {
        if (req.isEmpty()) {
            context.getLogger().warning("Empty request body received in " + context.getInvocationId());
        }
        return String.format(req);
    }
}
```


## Specialized Types

Sometimes a function need to take a more detailed control of the input and output, and that's why we also provide some specialized types in the `azure-functions-java-core` package for you to manipulate:

| Specialized Type      |       Target        | Typical Usage                  |
| --------------------- | :-----------------: | ------------------------------ |
| `HttpRequestMessage`  |    HTTP Trigger     | Get method, headers or queries |
| `HttpResponseMessage` | HTTP Output Binding | Return status other than 200   |

> [NOTE] You can also use `@Bind` annotation to get HTTP headers and queries. For example, `@Bind("name") String query` will try to iterate the HTTP request headers and queries and pass that value to the method; `query` will be `"test"` if the request URL is `http://example.org/api/echo?name=test`.