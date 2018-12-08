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

The concepts of [triggers and bindings](functions-triggers-bindings.md) are fundamental to Azure Functions. Triggers start the execution of your code. Bindings give you a way to pass data to and return data from a function, without having to write custom data access code.

A function should be a stateless method to process input and produce output. Your function should not depend on any instance fields of the class. All the function methods should be `public` and method with annotation @FunctionName must be unique as method name defines the entry for a function.

## Folder structure

Here is the folder structure of an Azure Function Java project:

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

There's a shared [host.json](functions-host-json.md) file that can be used to configure the function app. Each function has its own code file (.java) and binding configuration file (function.json).

You can put more than one function in a project. Avoid putting your functions into separate jars. The FunctionApp in the target directory is what gets deployed to your function app in Azure.

## Triggers and annotations

 Azure functions are invoked by a trigger, such as an HTTP request, a timer, or an update to data. Your function needs to process that trigger and any other inputs to produce one or more outputs.

Use the Java annotations included in the [com.microsoft.azure.functions.annotation.*](/java/api/com.microsoft.azure.functions.annotation) package to bind input and outputs to your methods. For more information see [Java reference docs](/java/api/com.microsoft.azure.functions.annotation).

> [!IMPORTANT] 
> You must configure an Azure Storage account in your [local.settings.json](/azure/azure-functions/functions-run-local#local-settings-file) to run Azure Storage Blob, Queue, or Table triggers locally.

Example:

```java
public class Function {
    public String echo(@HttpTrigger(name = "req", 
      methods = {"post"},  authLevel = AuthorizationLevel.ANONYMOUS) 
        String req, ExecutionContext context) {
        return String.format(req);
    }
}
```

here is the generated corresponding `function.json` by the [azure-functions-maven-plugin](https://mvnrepository.com/artifact/com.microsoft.azure/azure-functions-maven-plugin):

```json
{
  "scriptFile": "azure-functions-example.jar",
  "entryPoint": "com.example.Function.echo",
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

Download and use the [Azul Zulu for Azure](https://assets.azul.com/files/Zulu-for-Azure-FAQ.pdf) JDKs from [Azul Systems](https://www.azul.com/downloads/azure-only/zulu/) for local development of Java function apps. JDKs are available for Windows, Linux, and macOS. [Azure support](https://support.microsoft.com/en-us/help/4026305/sql-contact-microsoft-azure-support) is available with a [qualified support plan](https://azure.microsoft.com/support/plans/).

## Third-party libraries 

Azure Functions supports the use of third-party libraries. By default, all dependencies specified in your project `pom.xml` file will be automatically bundled during the [`mvn package`](https://github.com/Microsoft/azure-maven-plugins/blob/master/azure-functions-maven-plugin/README.md#azure-functionspackage) goal. For libraries not specified as dependencies in the `pom.xml` file, place them in a `lib` directory in the function's root directory. Dependencies placed in the `lib` directory will be added to the system class loader at runtime.

The `com.microsoft.azure.functions:azure-functions-java-library` dependency is provided on the classpath by default, and does not need to be included in the `lib` directory. Also, dependencies listed [here](https://github.com/Azure/azure-functions-java-worker/wiki/Azure-Java-Functions-Worker-Dependencies) are added to the classpath by [azure-functions-java-worker](https://github.com/Azure/azure-functions-java-worker).

## Data type support

You can use Plain old Java objects (POJOs), types defined in `azure-functions-java-library` or primitive dataTypes such as String, Integer to bind to input/output bindings.

### Plain old Java objects (POJOs)

For converting input data to POJO, [azure-functions-java-worker](https://github.com/Azure/azure-functions-java-worker) uses [gson](https://github.com/google/gson) library. POJO types used as inputs to functions should be `public`.

### Binary data

Bind binary inputs or outputs to `byte[]` by setting the `dataType` field in your function.json to `binary`:

```java
   @FunctionName("BlobTrigger")
    @StorageAccount("AzureWebJobsStorage")
     public void blobTrigger(
        @BlobTrigger(name = "content", path = "myblob/{fileName}", dataType = "binary") byte[] content,
        @BindingName("fileName") String fileName,
        final ExecutionContext context
    ) {
        context.getLogger().info("Java Blob trigger function processed a blob.\n Name: " + fileName + "\n Size: " + content.length + " Bytes");
    }
```

Use `Optional<T>` for if null values are expected

## Bindings

Input and output bindings provide a declarative way to connect to data from within your code. A function can have multiple input and output bindings.

### Example Input binding

```java
package com.example;

import com.microsoft.azure.functions.annotation.*;

public class Function {
    @FunctionName("echo")
    public static String echo(
        @HttpTrigger(name = "req", methods = { "put" }, authLevel = AuthorizationLevel.ANONYMOUS, route = "items/{id}") String inputReq,
        @TableInput(name = "item", tableName = "items", partitionKey = "Example", rowKey = "{id}", connection = "AzureWebJobsStorage") TestInputData inputData
		@TableOutput(name = "myOutputTable", tableName = "Person", connection = "AzureWebJobsStorage") OutputBinding<Person> testOutputData,
    ) {
		testOutputData.setValue(new Person(httpbody + "Partition", httpbody + "Row", httpbody + "Name"));
        return "Hello, " + inputReq + " and " + inputData.getKey() + ".";
    }

    public static class TestInputData {
        public String getKey() { return this.RowKey; }
        private String RowKey;
    }
	public static class Person {
        public String PartitionKey;
        public String RowKey;
        public String Name;

        public Person(String p, String r, String n) {
            this.PartitionKey = p;
            this.RowKey = r;
            this.Name = n;
        }
    }
}
```

This function is invoked with an HTTP request. 
- HTTP request payload is passed as a `String` for the argument `inputReq`
- One entry is retrieved from the Azure Table Storage and is passed as `TestInputData` to the argument `inputData`.

To receive a batch of inputs, you can bind to `String[]`, `POJO[]`, `List<String>` or `List<POJO>`.

```java
@FunctionName("ProcessIotMessages")
    public void processIotMessages(
        @EventHubTrigger(name = "message", eventHubName = "%AzureWebJobsEventHubPath%", connection = "AzureWebJobsEventHubSender", cardinality = Cardinality.MANY) List<TestEventData> messages,
        final ExecutionContext context)
    {
        context.getLogger().info("Java Event Hub trigger received messages. Batch size: " + messages.size());
    }
    
    public class TestEventData {
    public String id;
}

```

This function gets triggered whenever there is new data in the configured event hub. As the `cardinality` is set to `MANY`, function receives a batch of messages from event hub. EventData from event hub gets converted to `TestEventData` for the function execution.

### Example Output binding

You can bind an output binding to the return value using `$return` 

```java
package com.example;

import com.microsoft.azure.functions.annotation.*;

public class Function {
    @FunctionName("copy")
    @StorageAccount("AzureWebJobsStorage")
    @BlobOutput(name = "$return", path = "samples-output-java/{name}")
    public static String copy(@BlobTrigger(name = "blob", path = "samples-input-java/{name}") String content) {
        return content;
    }
}
```

If there are multiple output bindings, use the return value for only one of them.

To send multiple output values, use `OutputBinding<T>` defined in the `azure-functions-java-library` package. 

```java
@FunctionName("QueueOutputPOJOList")
    public HttpResponseMessage QueueOutputPOJOList(@HttpTrigger(name = "req", methods = { HttpMethod.GET,
            HttpMethod.POST }, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<String>> request,
            @QueueOutput(name = "itemsOut", queueName = "test-output-java-pojo", connection = "AzureWebJobsStorage") OutputBinding<List<TestData>> itemsOut, 
            final ExecutionContext context) {
        context.getLogger().info("Java HTTP trigger processed a request.");
       
        String query = request.getQueryParameters().get("queueMessageId");
        String queueMessageId = request.getBody().orElse(query);
        itemsOut.setValue(new ArrayList<TestData>());
        if (queueMessageId != null) {
            TestData testData1 = new TestData();
            testData1.id = "msg1"+queueMessageId;
            TestData testData2 = new TestData();
            testData2.id = "msg2"+queueMessageId;

            itemsOut.getValue().add(testData1);
            itemsOut.getValue().add(testData2);

            return request.createResponseBuilder(HttpStatus.OK).body("Hello, " + queueMessageId).build();
        } else {
            return request.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Did not find expected items in CosmosDB input list").build();
        }
    }

     public static class TestData {
        public String id;
    }
```

Above function is invoked on an HttpRequest and writes multiple values to the Azure Queue

## HttpRequestMessage and HttpResponseMessage

 HttpRequestMessage and HttpResponseMessage types are defined in `azure-functions-java-library` are helper types to work with HttpTrigger functions

| Specialized Type      |       Target        | Typical Usage                  |
| --------------------- | :-----------------: | ------------------------------ |
| `HttpRequestMessage<T>`  |    HTTP Trigger     | Get method, headers, or queries |
| `HttpResponseMessage` | HTTP Output Binding | Return status other than 200   |

## Metadata

Few triggers send [trigger metadata](/azure/azure-functions/functions-triggers-bindings#trigger-metadata-properties) along with input data. You can use annotation `@BindingName` to bind to trigger metadata


```Java
package com.example;

import java.util.Optional;
import com.microsoft.azure.functions.annotation.*;


public class Function {
    @FunctionName("metadata")
    public static String metadata(
        @HttpTrigger(name = "req", methods = { "get", "post" }, authLevel = AuthorizationLevel.ANONYMOUS) Optional<String> body,
        @BindingName("name") String queryValue
    ) {
        return body.orElse(queryValue);
    }
}
```
In the example above, the `queryValue` is bound to query string parameter `name` in the Http request URL `http://{example.host}/api/metadata?name=test`. Following is another example to binding to `Id` from queue trigger metadata

```java
 @FunctionName("QueueTriggerMetadata")
    public void QueueTriggerMetadata(
        @QueueTrigger(name = "message", queueName = "test-input-java-metadata", connection = "AzureWebJobsStorage") String message,@BindingName("Id") String metadataId,
        @QueueOutput(name = "output", queueName = "test-output-java-metadata", connection = "AzureWebJobsStorage") OutputBinding<TestData> output,
        final ExecutionContext context
    ) {
        context.getLogger().info("Java Queue trigger function processed a message: " + message + " whith metadaId:" + metadataId );
        TestData testData = new TestData();
        testData.id = metadataId;
        output.setValue(testData);
    }
```

> [!NOTE]
> Name provided in the annotation needs to match the metadata property

## Execution context

`ExecutionContext` defined in the `azure-functions-java-library` contains helper methods to communicate with the functions runtime.

### Logger

Use `getLogger` defined in `ExecutionContext` to write logs from function code.

Example:

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

You can use the Azure CLI to stream Java stdout and stderr logging as well as other application logging. 

Configure your Function application to write application logging using the Azure CLI:

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

In Functions, [app settings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-app-settings), such as service connection strings, are exposed as environment variables during execution. You can access these settings using, `System.getenv("AzureWebJobsStorage")`

Example:

Add [AppSetting](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings) with name testAppSetting and value testAppSettingValue

```java

public class Function {
    public String echo(@HttpTrigger(name = "req", methods = {"post"}, authLevel = AuthorizationLevel.ANONYMOUS) String req, ExecutionContext context) {
        context.getLogger().info("testAppSetting "+ System.getenv("testAppSettingValue"));
        return String.format(req);
    }
}

```

## Next steps

For more information about Azure Function Java development, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
- Local development and debug with [Visual Studio Code](https://code.visualstudio.com/docs/java/java-azurefunctions), [IntelliJ](functions-create-maven-intellij.md), and [Eclipse](functions-create-maven-eclipse.md). 
* [Remote Debug Java Azure Functions with Visual Studio Code](https://code.visualstudio.com/docs/java/java-serverless#_remote-debug-functions-running-in-the-cloud)
* [Maven plugin for Azure Functions](https://github.com/Microsoft/azure-maven-plugins/blob/develop/azure-functions-maven-plugin/README.md) - Streamline function creation through the `azure-functions:add` goal and prepare a staging directory for [ZIP file deployment](deployment-zip-push.md).
