---
title: Java developer reference for Azure Functions | Microsoft Docs
description: Understand how to develop functions with Java.
services: functions
documentationcenter: na
author: rloutlaw
manager: justhe
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture, java
ms.service: azure-functions
ms.devlang: java
ms.topic: conceptual
ms.date: 09/14/2018
ms.author: routlaw
---

# Azure Functions Java developer guide

[!INCLUDE [functions-java-preview-note](../../includes/functions-java-preview-note.md)]

## Programming model 

Your Azure function should be a stateless class method that processes input and produces output. Although you can write instance methods, your function must not depend on any instance fields of the class. All function methods must have a `public` access modifier.

## Folder structure

The folder structure for a Java project looks like the following:

```
FunctionsProject
 | - src
 | | - main
 | | | - java
 | | | | - FunctionApp
 | | | | | - MyFirstFunction.java
 | | | | | - MySecondFunction.java
 | - target
 | | - azure-functions
 | | | - FunctionApp
 | | | | - FunctionApp.jar
 | | | | - host.json
 | | | | - MyFirstFunction
 | | | | | - function.json
 | | | | - MySecondFunction
 | | | | | - function.json
 | | | | - bin
 | | | | - lib
 | - pom.xml
```

There's a shared [host.json] (functions-host-json.md) file that can be used to configure the function app. Each function has its own code file (.java) and binding configuration file (function.json).

You can put more than one function in a project. Avoid putting your functions into separate jars. The FunctionApp in the target directory is what gets deployed to your function app in Azure.

## Triggers and annotations

 Azure functions are invoked by a trigger, such as an HTTP request, a timer, or an update to data. Your function needs to process that trigger and any other inputs to produce one or more outputs.

Use the Java annotations included in the [com.microsoft.azure.functions.annotation.*](/java/api/com.microsoft.azure.functions.annotation) package to bind input and outputs to your methods. Sample code using the annotations is available in the [Java reference docs](/java/api/com.microsoft.azure.functions.annotation) for each annotation and in the Azure Functions binding reference documentation, such as the one for [HTTP triggers](/azure/azure-functions/functions-bindings-http-webhook).

Trigger inputs and outputs can also be defined in the [function.json](/azure/azure-functions/functions-reference#function-code) for your function instead of through annotations. Using `function.json` instead of annotations in this way is not recommended.

> [!IMPORTANT] 
> You must configure an Azure Storage account in your [local.settings.json](/azure/azure-functions/functions-run-local#local-settings-file) to run Azure Storage Blob, Queue, or Table triggers locally.

Example using annotations:

```java
public class Function {
    public String echo(@HttpTrigger(name = "req", 
      methods = {"post"},  authLevel = AuthorizationLevel.ANONYMOUS) 
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

## JDK runtime availability and support 

Download and use the [Azul Zulu for Azure](https://assets.azul.com/files/Zulu-for-Azure-FAQ.pdf) JDKs from [Azul Systems](https://www.azul.com/downloads/azure-only/zulu/) for local development of Java function apps. JDKs are available for Windows, Linux, and macOS and [Azure support](https://support.microsoft.com/en-us/help/4026305/sql-contact-microsoft-azure-support) is available for issues encountered during development with a [qualified support plan](https://azure.microsoft.com/support/plans/).

## Third-party libraries 

Azure Functions supports the use of third-party libraries. By default, all dependencies specified in your project `pom.xml` file will be automatically bundled during the `mvn package` goal. For libraries not specified as dependencies in the `pom.xml` file, place them in a `lib` directory in the function's root directory. Dependencies placed in the `lib` directory will be added to the system class loader at runtime.

The `com.microsoft.azure.functions:azure-functions-java-library` dependency is provided on the classpath by default, and does not need to be included in the `lib` directory.

## Data type support

You can use any data types in Java for the input and output data, including native types; customized Java types and specialized Azure types defined in `azure-functions-java-library` package. The Azure Functions runtime attempts convert the input received into the type requested by your code.

### Strings

Values passed into function methods will be cast to Strings if the corresponding input parameter type for the function is of type `String`. 

### Plain old Java objects (POJOs)

Strings formatted with JSON will be cast to Java types if the input signature of the function expects that Java type. This conversion allows you to pass in JSON and work with Java types.

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

Empty input values could be `null` as your functions argument, but a recommended way to deal with potential empty values is to use `Optional<T>`.


## Function method overloading

You are allowed to overload function methods with the same name but with different types. For example, you can have both `String echo(String s)` and `String echo(MyType s)` in a class. Azure Functions decides which method to invoke based on the input type (for HTTP input, MIME type `text/plain` leads to `String` while `application/json` represents `MyType`).

## Inputs

Input are divided into two categories in Azure Functions: one is the trigger input and the other is the additional input. Although they are different in `function.json`, the usage is identical in Java code. Let's take the following code snippet as an example:

```java
package com.example;

import com.microsoft.azure.functions.annotation.*;

public class MyClass {
    @FunctionName("echo")
    public static String echo(
        @HttpTrigger(name = "req", methods = { "put" }, authLevel = AuthorizationLevel.ANONYMOUS, route = "items/{id}") String in,
        @TableInput(name = "item", tableName = "items", partitionKey = "Example", rowKey = "{id}", connection = "AzureWebJobsStorage") MyObject obj
    ) {
        return "Hello, " + in + " and " + obj.getKey() + ".";
    }

    public static class MyObject {
        public String getKey() { return this.RowKey; }
        private String RowKey;
    }
}
```

When this function is triggered, the HTTP request is passed to the function by `String in`. An entry will be retrieved from the Azure Table Storage based on the ID in the route URL and made avaialble as `obj` in the function body.

## Outputs

Outputs can be expressed both in return value or output parameters. If there is only one output, you are recommended to use the return value. For multiple outputs, you have to use output parameters.

Return value is the simplest form of output, you just return the value of any type, and Azure Functions runtime will try to marshal it back to the actual type (such as an HTTP response).  You could apply any output annotations to the function method (the name property of the annotation has to be $return) to define the return value output.

To produce multiple output values, use `OutputBinding<T>` type defined in the `azure-functions-java-library` package. If you need to make an HTTP response and push a message to a queue as well, you can write something like:

For example, a blob content copying function could be defined as the following code. `@StorageAccount` annotation is used here to prevent the duplicating of the connection property for both `@BlobTrigger` and `@BlobOutput`.

```java
package com.example;

import com.microsoft.azure.functions.annotation.*;

public class MyClass {
    @FunctionName("copy")
    @StorageAccount("AzureWebJobsStorage")
    @BlobOutput(name = "$return", path = "samples-output-java/{name}")
    public static String copy(@BlobTrigger(name = "blob", path = "samples-input-java/{name}") String content) {
        return content;
    }
}
```

Use `OutputBinding<byte[]`>  to make a binary output value (for parameters); for return values, just use `byte[]`.

## Specialized Types

Sometimes a function must have detailed control over inputs and outputs. Specialized types in the `azure-functions-java-core` package are provided for you to manipulate request information and tailor the return status of an HTTP trigger:

| Specialized Type      |       Target        | Typical Usage                  |
| --------------------- | :-----------------: | ------------------------------ |
| `HttpRequestMessage<T>`  |    HTTP Trigger     | Get method, headers, or queries |
| `HttpResponseMessage<T>` | HTTP Output Binding | Return status other than 200   |

> [!NOTE] 
> You can also use `@BindingName` annotation to get HTTP headers and queries. For example, `@BindingName("name") String query` iterates the HTTP request headers and queries and pass that value to the method. For example,  `query` will be `"test"` if the request URL is `http://example.org/api/echo?name=test`.

### Metadata

Metadata comes from different sources, like HTTP headers, HTTP queries, and [trigger metadata](/azure/azure-functions/functions-triggers-bindings#trigger-metadata-properties). Use the `@BindingName` annotation together with the metadata name to get the value.

For example, the `queryValue` in the following code snippet will be `"test"` if the requested URL is `http://{example.host}/api/metadata?name=test`.

```Java
package com.example;

import java.util.Optional;
import com.microsoft.azure.functions.annotation.*;


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

## Execution context

Interact with Azure Functions execution environment via the `ExecutionContext` object defined in the `azure-functions-java-library` package. Use the `ExecutionContext` object to use invocation information and functions runtime information in your code.

### Custom logging

Access to the Functions runtime logger is available through the `ExecutionContext` object. This logger is tied to the Azure monitor and allows you to flag warnings and errors encountered during function execution.

The following example code logs a warning message when the request body received is empty.

```java

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;

public class Function {
    public String echo(@HttpTrigger(name = "req", methods = {"post"}, authLevel = AuthorizationLevel.ANONYMOUS) String req, ExecutionContext context) {
        if (req.isEmpty()) {
            context.getLogger().warning("Empty request body received by function " + context.getFunctionName() + " with invocation " + context.getInvocationId());
        }
        return String.format(req);
    }
}
```

## View logs and trace

You can use the Azure CLI to stream Java standard out and error logging as well as other application logging. First, Configure your Function application to write application logging using the Azure CLI:

```azurecli-interactive
az webapp log config --name functionname --resource-group myResourceGroup --application-logging true
```

To stream logging output for your Function app using the Azure CLI, open a new command prompt, Bash, or Terminal session and enter the following command:

```azurecli-interactive
az webapp log tail --name webappname --resource-group myResourceGroup
```
The [az webapp log tail](/cli/azure/webapp/log) command has options to filter output using the `--provider` option. 

To download the log files as a single ZIP file using the Azure CLI, open a new command prompt, Bash, or Terminal session and enter the following command:

```azurecli-interactive
az webapp log download --resource-group resourcegroupname --name functionappname
```

You must have enabled file system logging in the Azure Portal or Azure CLI before running this command.

## Environment variables

Keep secret information such as keys or tokens out of your source code for security reasons. Use keys and tokens in your function code by reading them from environment variables.

To set environment variables when running Azure Functions locally, you may choose to add these variables to the local.settings.json file. If one is not present in the root directory of your function project, you can create one. Here is what the file should look like:

```xml
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "AzureWebJobsDashboard": ""
  }
}
```

Each key / value mapping in the `values` map will be made available at runtime as an environment variable, accessible by calling `System.getenv("<keyname>")`, for example, `System.getenv("AzureWebJobsStorage")`. Adding additional key / value pairs is accepted and recommended practice.

> [!NOTE]
> If this approach is taken, be sure to add the local.settings.json file to your repository ignore file, so that it is not committed.

With your code now depending on these environment variables, you can sign in to the Azure portal to set the same key / value pairs in your function app settings, so that your code functions equivalently when testing locally and when deployed to Azure.

## Next steps

For more information about Azure Function Java development, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
- Local development and debug with [Visual Studio Code](https://code.visualstudio.com/docs/java/java-azurefunctions), [IntelliJ](functions-create-maven-intellij.md), and [Eclipse](functions-create-maven-eclipse.md). 
* [Remote Debug Java Azure Functions with Visual Studio Code](https://code.visualstudio.com/docs/java/java-serverless#_remote-debug-functions-running-in-the-cloud)
* [Maven plugin for Azure Functions](https://github.com/Microsoft/azure-maven-plugins/blob/develop/azure-functions-maven-plugin/README.md) - Streamline function creation through the `azure-functions:add` goal and prepare a staging directory for [ZIP file deployment](deployment-zip-push.md).
