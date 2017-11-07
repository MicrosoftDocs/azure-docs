---
title: Java developer reference for Azure Functions | Microsoft Docs
description: Understand how to develop functions with Java.
services: functions
documentationcenter: na
author: rloutlaw
manager: justhe
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture, java
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
[!INCLUDE [functions-selector-languages](../../includes/functions-selector-languages.md)]

## Programming model 

Your Azure function should be a stateless class method that processes input and produces output. Although you are allowed to write instance methods, your function must not depend on any instance fields of the class. All function methods must have a `public` access modifier.

## Triggers and annotations

Typically an Azure function is invoked because of an external trigger. Your function needs to process that trigger and its associated inputs and produce one or more outputs.

Java annotations are included in the `azure-functions-java-core` package to bind input and outputs to your methods. The supported input triggers and output binding annotations are included in the following table:

Binding | Annotation
---|---
CosmosDB | N/A
HTTP | <ul><li>`HttpTrigger`</li><li>`HttpOutput`</li></ul>
Mobile Apps | N/A
Notification Hubs | N/A
Storage Blob | <ul><li>`BlobTrigger`</li><li>`BlobOutput`</li><li>`BlobOutput`</li></ul>
Storage Queue | <ul><li>`QueueTrigger`</li><li>`QueueOutput`</li></ul>
Storage Table | <ul><li>`TableInput`</li><li>`TableOutput`</li></ul>
Timer | <ul><li>`TimerTrigger`</li></ul>
Twilio | N/A

Trigger inputs and outputs can also be defined in the [function.json](/azure/azure-functions/functions-reference#function-code) for your application.

> [!IMPORTANT] 
> You must configure an Azure Storage account in your [local.settings.json](/azure/azure-functions/functions-run-local#local-settings-file) to run Azure Storage Blob, Queue, or Table triggers locally.

Example using annotations:

```java
import com.microsoft.azure.serverless.functions.annotation.HttpTrigger;
import com.microsoft.azure.serverless.functions.ExecutionContext;

public class Function {
    public String echo(@HttpTrigger(name = "req", methods = {"post"},  authLevel = AuthorizationLevel.ANONYMOUS) 
        String req, ExecutionContext context) {
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
      "methods": [ "post" ]
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

You are free to use all the data types in Java for the input and output data, including native types; customized Java types and specialized Azure types defined in `azure-functions-java-core` package. The Azure Functions runtime attempts convert the input received into the type requested by your code.

### Strings

Values passed into function methods will be cast to Strings if the corresponding input parameter type for the function is of type `String`. 

### Plain old Java objects (POJOs)

Strings formatted with JSON will be cast to Java types if the input of the function method expects that Java type. This conversion allows you to pass JSON inputs into your functions and work with Java types in your code without having to implement the conversion in your own code.

POJO types used as inputs to functions must the same `public` access modifier as the function methods they are being used in. You don't have to declare POJO class fields `public`. For example, a JSON string `{ "x": 3 }` is able to be converted to the following POJO type:

```Java
public class MyData {
    private int x;
}
```

### Binary data

Binary data is represented as a `byte[]` in your Azure functions code. Bind binary inputs or outputs to your functions by setting the `dataType` field in your function.json to `binary`:

```json
 {
  "scriptFile": "azure-functions-example.jar",
  "entryPoint": "com.example.MyClass.echo",
  "bindings": [
    {
      "type": "blob",
      "name": "content",
      "direction": "in",
      "dataType": "binary",
      "path": "container/myfile.bin",
      "connection": "ExampleStorageAccount"
    },
  ]
}
```

Then use it in your function code:

```java
// Class definition and imports are omitted here
public static String echoLength(byte[] content) {
}
```

Use `OutputBinding<byte[]>` type to make a binary output binding.


## Function method overloading

You are allowed to overload function methods with the same name but with different types. For example, you can have both `String echo(String s)` and `String echo(MyType s)` in one class, and Azure Functions runtime decides which one to invoke by examine the actual input type (for HTTP input, MIME type `text/plain` leads to `String` while `application/json` represents `MyType`).

## Inputs

Input are divided into two categories in Azure Functions: one is the trigger input and the other is the additional input. Although they are different in `function.json`, the usage is identical in Java code. Let's take the following code snippet as an example:

```java
package com.example;

import com.microsoft.azure.serverless.functions.annotation.BindingName;
import java.util.Optional;

public class MyClass {
    public static String echo(Optional<String> in, @BindingName("item") MyObject obj) {
        return "Hello, " + in.orElse("Azure") + " and " + obj.getKey() + ".";
    }

    private static class MyObject {
        public String getKey() { return this.RowKey; }
        private String RowKey;
    }
}
```

The `@BindingName` annotation accepts a `String` property that represents the name of the binding/trigger defined in `function.json`:

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

So when this function is invoked, the HTTP request payload passes an optional `String` for argument `in` and an Azure Table Storage `MyObject` type passed to argument `obj`. Use the `Optional<T>` type to handle inputs into your functions that can be null.

## Outputs

Outputs can be expressed both in return value or output parameters. If there is only one output, you are recommended to use the return value. For multiple outputs, you have to use output parameters.

Return value is the simplest form of output, you just return the value of any type, and Azure Functions runtime will try to marshal it back to the actual type (such as an HTTP response). In `functions.json`, you use `$return` as the name of the output binding.

To produce multiple output values, use `OutputBinding<T>` type defined in the `azure-functions-java-core` package. If you need to make an HTTP response and push a message to a queue as well, you can write something like:

```java
package com.example;

import com.microsoft.azure.serverless.functions.OutputBinding;
import com.microsoft.azure.serverless.functions.annotation.BindingName;

public class MyClass {
    public static String echo(String body, 
    @QueueOutput(queueName = "messages", connection = "AzureWebJobsStorage", name = "queue") OutputBinding<String> queue) {
        String result = "Hello, " + body + ".";
        queue.setValue(result);
        return result;
    }
}
```

which should define the output binding in `function.json`:

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
      "name": "queue",
      "direction": "out",
      "queueName": "messages",
      "connection": "AzureWebJobsStorage"
    },
    {
      "type": "http",
      "name": "$return",
      "direction": "out"
    }
  ]
}
```
## Specialized Types

Sometimes a function must have detailed control over inputs and outputs. Specialized types in the `azure-functions-java-core` package are provided for you to manipulate request information and tailor the return status of a HTTP trigger:

| Specialized Type      |       Target        | Typical Usage                  |
| --------------------- | :-----------------: | ------------------------------ |
| `HttpRequestMessage<T>`  |    HTTP Trigger     | Get method, headers, or queries |
| `HttpResponseMessage<T>` | HTTP Output Binding | Return status other than 200   |

> [!NOTE] 
> You can also use `@BindingName` annotation to get HTTP headers and queries. For example, `@Bind("name") String query` iterates the HTTP request headers and queries and pass that value to the method. For example,  `query` will be `"test"` if the request URL is `http://example.org/api/echo?name=test`.

### Metadata

Metadata comes from different sources, like HTTP headers, HTTP queries, and [trigger metadata](/azure/azure-functions/functions-triggers-bindings#trigger-metadata-properties). Use the `@BindingName` annotation together with the metadata name to get the value.

For example, the `queryValue` in the following code snippet will be `"test"` if the requested URL is `http://{example.host}/api/metadata?name=test`.

```Java
package com.example;

import java.util.Optional;
import com.microsoft.azure.serverless.functions.annotation.*;

public class MyClass {
    @FunctionName("metadata")
    public static String metadata(
        @HttpTrigger(name = "req", methods = { "get", "post" }, authLevel = AuthorizationLevel.ANONYMOUS) Optional<String> body,
        @BindingName("name") String queryValue
    ) {
        return body.orElse(queryValue);
    }
}
```

## Functions execution context

You interact with Azure Functions execution environment via the `ExecutionContext` object defined in the `azure-functions-java-core` package. Use the `ExecutionContext` object to use invocation information and functions runtime information in your code.

### Logging

Access to the Functions runtime logger is available through the `ExecutionContext` object. This logger is tied to the Azure monitor and allows you to flag warnings and errors encountered during function execution.

The following example code logs a warning message when the request body received is empty.

```java
import com.microsoft.azure.serverless.functions.annotation.HttpTrigger;
import com.microsoft.azure.serverless.functions.ExecutionContext;

public class Function {
    public String echo(@HttpTrigger(name = "req", methods = {"post"}, authLevel = AuthorizationLevel.ANONYMOUS) String req, ExecutionContext context) {
        if (req.isEmpty()) {
            context.getLogger().warning("Empty request body received by function " + context.getFunctionName() + " with invocation " + context.getInvocationId());
        }
        return String.format(req);
    }
}
```

## Next steps
For more information, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
