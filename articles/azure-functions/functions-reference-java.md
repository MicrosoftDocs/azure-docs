---
title: Java developer reference for Azure Functions | Microsoft Docs
description: Understand how to develop functions with Java.
services: functions
documentationcenter: na
author: rloutlaw
manager: justhe
editor: ''
tags: ''
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

## Programming Model

Your Azure function should be a stateless method to process input and produce output. Although you are allowed to write instance methods, your function must not depend on any instance fields of the class. You need to make sure all the function methods are `public` accessible.

Typically an Azure function is invoked because of one trigger. Your function needs to process that trigger (sometimes with additional inputs) and gives one or more output values.

All the input and output bindings can be defined in `function.json`, or in the Java method by using annotations. All the types and annotations used in this document are included in the `azure-functions-java-core` package.

Here is an example for a simple Azure function written in Java:

```java
package com.example;

public class MyClass {
    public static String echo(String in) {
        return "Hello, " + in + ".";
    }
}
```

and the corresponding `function.json` would be:

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

You are free to use all the data types in Java for the input and output data, including native types; customized POJO types and specialized Azure types defined in `azure-functions-java-core` package. The Azure Functions runtime will try to convert the actual input value to the type you need (for example, a `String` input will be treated as a JSON string and be parsed to a POJO type defined in your code).

The POJO types you defined have the same accessible requirements as the function methods, it needs to be `public` accessible. While the POJO class fields are not; for example a JSON string `{ "x": 3 }` is able to be converted to the following POJO type:

```Java
public class MyData {
    private int x;
}
```

You are also allowed to overload methods with the same name but with different types. For example, you can have both `String echo(String s)` and `String echo(MyType s)` in one class, and Azure Functions runtime will decide which one to invoke by examine the actual input type (for HTTP input, MIME type `text/plain` leads to `String` while `application/json` represents `MyType`).

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

## Context

You interact with Azure Functions execution environment via the `ExecutionContext` object defined in the `azure-functions-java-core` package. You are able to get the invocation ID and a built-in logger (which is integrated prefectly with Azure Function Portal experience as well as App Insights) from the context object.

What you need to do is just add one more `ExecutionContext` typed parameter to your function method (leave all other stuffs unchanged including `function.json`). Let's take a timer triggered function as an example:

```java
package com.example;

import com.microsoft.azure.serverless.functions.ExecutionContext;

public class MyClass {
    public static String heartbeat(String timerInfo, ExecutionContext context) {
        context.getLogger().info("Heartbeat triggered by " + context.getInvocationId());
        return "Processed " + timerInfo;
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