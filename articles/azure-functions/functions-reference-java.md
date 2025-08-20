---
title: Java developer reference for Azure Functions
description: Understand how to develop functions with Java.
ms.topic: conceptual
ms.date: 06/04/2025
ms.devlang: java
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Azure Functions Java developer guide

This guide contains detailed information to help you succeed developing Azure Functions using Java.

As a Java developer, if you're new to Azure Functions, consider first reading one of the following articles:

| Getting started | Concepts| Scenarios/samples |
| -- | -- | -- |
| <ul><li>[Java function using Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-java)</li><li>[Java/Maven function with terminal/command prompt](./how-to-create-function-azure-cli.md?pivots=programming-language-java)</li><li>[Java function using Gradle](functions-create-first-java-gradle.md)</li><li>[Java function using Eclipse](functions-create-maven-eclipse.md)</li><li>[Java function using IntelliJ IDEA](functions-create-maven-intellij.md)</li></ul> | <ul><li>[Developer guide](functions-reference.md)</li><li>[Hosting options](functions-scale.md)</li><li>[Performance&nbsp; considerations](functions-best-practices.md)</li></ul> | <ul><li>[Java samples with different triggers](/samples/azure-samples/azure-functions-samples-java/azure-functions-java/)</li><li>[Event Hubs trigger and Azure Cosmos DB output binding](/samples/azure-samples/java-functions-eventhub-cosmosdb/sample/)</li><li>[Dependency injection samples](https://github.com/Azure/azure-functions-java-worker/tree/dev/samples/dependency-injection-example)</li></ul> |

## Java function basics

A Java function is a `public` method, decorated with the annotation `@FunctionName`. This method defines the entry for a Java function, and must be unique in a particular package. The package can have multiple classes with multiple public methods annotated with `@FunctionName`. A single package is deployed to a function app in Azure. In Azure, the function app provides the deployment, execution, and management context for your individual Java functions.

## Programming model 

The concepts of [triggers and bindings](functions-triggers-bindings.md) are fundamental to Azure Functions. Triggers start the execution of your code. Bindings give you a way to pass data to and return data from a function, without having to write custom data access code.

## Create Java functions

To make it easier to create Java functions, there are Maven-based tooling and archetypes that use predefined Java templates to help you create projects with a specific function trigger.    

### Maven-based tooling

The following developer environments have Azure Functions tooling that lets you create Java function projects: 

+ [Visual Studio Code](https://code.visualstudio.com/docs/java/java-azurefunctions)
+ [Eclipse](functions-create-maven-eclipse.md)
+ [IntelliJ](functions-create-maven-intellij.md)

These articles show you how to create your first functions using your IDE of choice. 

### Project scaffolding

If you prefer command line development from the Terminal, the simplest way to scaffold Java-based function projects is to use `Apache Maven` archetypes. The Java Maven archetype for Azure Functions is published under the following _groupId_:_artifactId_: [com.microsoft.azure:azure-functions-archetype](https://search.maven.org/artifact/com.microsoft.azure/azure-functions-archetype/). 

The following command generates a new Java function project using this archetype:

# [Bash](#tab/bash)

```bash
mvn archetype:generate \
    -DarchetypeGroupId=com.microsoft.azure \
    -DarchetypeArtifactId=azure-functions-archetype
```

# [Cmd](#tab/cmd)

```cmd
mvn archetype:generate ^
    -DarchetypeGroupId=com.microsoft.azure ^
    -DarchetypeArtifactId=azure-functions-archetype
```

---

To get started using this archetype, see the [Java quickstart](./how-to-create-function-azure-cli.md?pivots=programming-language-java).

## Folder structure

Here's the folder structure of an Azure Functions Java project:

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

You can use a shared [host.json](functions-host-json.md) file to configure the function app. Each function has its own code file (.java) and binding configuration file (function.json).

You can have more than one function in a project. However, don't put your functions into separate jars. Using multiple jars in a single function app isn't supported. The `FunctionApp` in the target directory is what gets deployed to your function app in Azure.

## Triggers and annotations

 Functions are invoked by a trigger, such as an HTTP request, a timer, or an update to data. Your function needs to process that trigger, and any other inputs, to produce one or more outputs.

Use the Java annotations included in the [com.microsoft.azure.functions.annotation.*](/java/api/com.microsoft.azure.functions.annotation) package to bind input and outputs to your methods. For more information, see the [Java reference docs](/java/api/com.microsoft.azure.functions.annotation).

> [!IMPORTANT] 
> You must configure an Azure Storage account in your [local.settings.json](./functions-develop-local.md#local-settings-file) to run Azure Blob storage, Azure Queue storage, or Azure Table storage triggers locally.

Example:

```java
public class Function {
    public String echo(@HttpTrigger(name = "req", 
      methods = {HttpMethod.POST},  authLevel = AuthorizationLevel.ANONYMOUS) 
        String req, ExecutionContext context) {
        return String.format(req);
    }
}
```

Here's the generated corresponding `function.json` by the [azure-functions-maven-plugin](https://mvnrepository.com/artifact/com.microsoft.azure/azure-functions-maven-plugin):

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
      "methods": [ "GET","POST" ]
    },
    {
      "type": "http",
      "name": "$return",
      "direction": "out"
    }
  ]
}

```

## Java versions

The version of Java on which your app runs in Azure is specified in the pom.xml file. The Maven archetype currently generates a pom.xml for Java 8, which you can change before publishing. The Java version in pom.xml should match the version of Java on which you develop and test your app locally. 

### Supported versions

The following table shows current supported Java versions for each major version of the Functions runtime, by operating system:

| Functions version | Java versions (Windows) | Java versions (Linux) |
| ----- | ----- | --- |
| 4.x | 21 <br/>17 <br/>11 <br/>8 | 21 <br/>17 <br/>11 <br/>8 |
| 3.x | 11 <br/>8 | 11 <br/>8 |
| 2.x | 8 | n/a |

Unless you specify a Java version for your deployment, the Maven archetype defaults to Java 8 during deployment to Azure.

### Specify the deployment version

You can control the version of Java targeted by the Maven archetype by using the `-DjavaVersion` parameter. This parameter must match [supported Java versions](supported-languages.md?pivots=programming-language-java#languages-by-runtime-version). 

The Maven archetype generates a pom.xml that targets the specified Java version. The following elements in pom.xml indicate the Java version to use:

| Element |  Java 8 value | Java 11 value | Java 17 value | Java 21 value | Description |
| ---- | ---- | ---- | ---- | ---- | --- |
| **`Java.version`** | 1.8 | 11 | 17 | 21 | Version of Java used by the maven-compiler-plugin. |
| **`JavaVersion`** | 8 | 11 | 17 | 21 | Java version hosted by the function app in Azure. |

The following examples show the settings for Java 8 in the relevant sections of the pom.xml file:

#### `Java.version`
:::code language="xml" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/pom.xml" range="12-19" highlight="14":::

#### `JavaVersion`
:::code language="xml" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/pom.xml" range="77-85" highlight="80":::

> [!IMPORTANT]
> You must have the JAVA_HOME environment variable set correctly to the JDK directory that is used during code compiling using Maven. Make sure that the version of the JDK is at least as high as the `Java.version` setting. 

### Specify the deployment OS

Maven also lets you specify the operating system on which your function app runs in Azure. Use the `os` element to choose the operating system. 

| Element |  Windows | Linux | Docker |
| ---- | ---- | ---- | --- |
| **`os`** | `windows` | `linux` | `docker` |

The following example shows the operating system setting in the `runtime` section of the pom.xml file:

:::code language="xml" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/pom.xml" range="77-85" highlight="79":::
 
## JDK runtime availability and support 

Microsoft and [Adoptium](https://adoptium.net/) builds of OpenJDK are provided and supported on Functions for Java 8 (Adoptium), Java 11, 17 and 21 (MSFT). These binaries are provided as a no-cost, multi-platform, production-ready distribution of the OpenJDK for Azure. They contain all the components for building and running Java SE applications. 

For local development or testing, you can download the [Microsoft build of OpenJDK](/java/openjdk/download) or [Adoptium Temurin](https://adoptium.net/?variant=openjdk8&jvmVariant=hotspot) binaries for free. [Azure support](https://azure.microsoft.com/support/) for issues with the JDKs and function apps is available with a [qualified support plan](https://azure.microsoft.com/support/plans/).

If you would like to continue using the Zulu for Azure binaries on your Function app, [configure your app accordingly](https://github.com/Azure/azure-functions-java-worker/wiki/Customize-JVM-to-use-Zulu). You can continue to use the Azul binaries for your site. However, any security patches or improvements are only available in new versions of the OpenJDK. Because of this, you should eventually remove this configuration so that your apps use the latest available version of Java.

## Customize JVM

Functions lets you customize the Java virtual machine (JVM) used to run your Java functions. The [following JVM options](https://github.com/Azure/azure-functions-java-worker/blob/master/worker.config.json#L7) are used by default:

* `-XX:+TieredCompilation`
* `-XX:TieredStopAtLevel=1`
* `-noverify` 
* `-Djava.net.preferIPv4Stack=true`
* `-jar`

You can provide other arguments to the JVM by using one of the following application settings, depending on the plan type: 

| Plan type | Setting name | Comment |
| --- | --- | 
| [Consumption plan](./consumption-plan.md) | `languageWorkers__java__arguments` | This setting does increase the cold start times for Java functions running in a Consumption plan. |
| [Premium plan](./functions-premium-plan.md)<br/>[Dedicated plan](./dedicated-plan.md) | `JAVA_OPTS` | |

The following sections show you how to add these settings. To learn more about working with application settings, see the [Work with application settings](./functions-how-to-use-azure-function-app-settings.md#settings) section.

### Azure portal

In the [Azure portal](https://portal.azure.com), use the [Application Settings tab](functions-how-to-use-azure-function-app-settings.md#settings) to add either the `languageWorkers__java__arguments` or the `JAVA_OPTS` setting.

### Azure CLI

You can use the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings) command to add these settings, as shown in the following example for the `-Djava.awt.headless=true` option:

# [Consumption plan](#tab/consumption/bash)

```azurecli-interactive
az functionapp config appsettings set \
    --settings "languageWorkers__java__arguments=-Djava.awt.headless=true" \
    --name <APP_NAME> --resource-group <RESOURCE_GROUP>
```

# [Consumption plan](#tab/consumption/cmd)

```azurecli-interactive
az functionapp config appsettings set ^
    --settings "languageWorkers__java__arguments=-Djava.awt.headless=true" ^
    --name <APP_NAME> --resource-group <RESOURCE_GROUP>
```

# [Dedicated plan / Premium plan](#tab/dedicated+premium/bash)

```azurecli-interactive
az functionapp config appsettings set \
    --settings "JAVA_OPTS=-Djava.awt.headless=true" \
    --name <APP_NAME> --resource-group <RESOURCE_GROUP>
```

# [Dedicated plan / Premium plan](#tab/dedicated+premium/cmd)

```azurecli-interactive
az functionapp config appsettings set ^
    --settings "JAVA_OPTS=-Djava.awt.headless=true" ^
    --name <APP_NAME> --resource-group <RESOURCE_GROUP>
```

---

This example enables headless mode. Replace `<APP_NAME>` with the name of your function app, and `<RESOURCE_GROUP>` with the resource group. 

## Third-party libraries 

Azure Functions supports the use of third-party libraries. By default, all dependencies specified in your project `pom.xml` file are automatically bundled during the [`mvn package`](https://github.com/Microsoft/azure-maven-plugins/blob/master/azure-functions-maven-plugin/README.md#azure-functionspackage) goal. For libraries not specified as dependencies in the `pom.xml` file, place them in a `lib` directory in the function's root directory. Dependencies placed in the `lib` directory are added to the system class loader at runtime.

The `com.microsoft.azure.functions:azure-functions-java-library` dependency is provided on the classpath by default, and doesn't need to be included in the `lib` directory. Also, [azure-functions-java-worker](https://github.com/Azure/azure-functions-java-worker) adds dependencies listed [here](https://github.com/Azure/azure-functions-java-worker/wiki/Azure-Java-Functions-Worker-Dependencies) to the classpath.

## Data type support

You can use plain-old Java objects (POJOs), types defined in `azure-functions-java-library`, or primitive data types such as `String` and `Integer` to bind to input or output bindings.

[!INCLUDE [functions-java-sdk-types-preview-note](../../includes/functions-java-sdk-types-preview-note.md)]

### POJOs

For converting input data to POJO, [azure-functions-java-worker](https://github.com/Azure/azure-functions-java-worker) uses the [gson](https://github.com/google/gson) library. POJO types used as inputs to functions should be `public`.

### Binary data

Bind binary inputs or outputs to `byte[]`, by setting the `dataType` field in your function.json to `binary`:

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

If you expect null values, use `Optional<T>`.

### <a name="sdk-types"></a>SDK types (preview)

You can currently use these Blob Storage SDK types in your bindings: `BlobClient` and `BlobContainerClient`.
<!--- replace when more than one extension...
+ Blob Storage SDK: `BlobClient` and `BlobContainerClient`
-->
With SDK types support enabled, your functions can use Azure SDK client types to access blobs as streams directly from storage, which provides these benefits over POJOs or binary types:

+ Lower latency
+ Reduced memory requirements 
+ Removes request-based size limits (uses service defaults)
+ Provides access to the full SDK surface: metadata, ACLs, legal holds, and other SDK-specific data.

#### Requirements

* Set the [`JAVA_ENABLE_SDK_TYPES`](./functions-app-settings.md#java_enable_sdk_types) app setting to `true` to enable SDK types.
* `azure-functions-maven-plugin` (or Gradle plug-in) version `1.38.0` or a higher version.

#### Examples

Blob trigger that uses `BlobClient` to access properties of the blob.

```java
@FunctionName("processBlob")
public void run(
        @BlobTrigger(
                name = "content",
                path = "images/{name}",
                connection = "AzureWebJobsStorage") BlobClient blob,
        @BindingName("name") String file,
        ExecutionContext ctx)
{
    ctx.getLogger().info("Size = " + blob.getProperties().getBlobSize());
}
```

Blob trigger that uses `BlobContainerClient` to access info about blobs in the container.

```java
@FunctionName("containerOps")
public void run(
        @BlobTrigger(
                name = "content",
                path = "images/{name}",
                connection = "AzureWebJobsStorage") BlobContainerClient container,
        ExecutionContext ctx)
{
    container.listBlobs()
            .forEach(b -> ctx.getLogger().info(b.getName()));
}
```

Blob input binding that uses `BlobClient` to get information about the blob that triggered the execution. 

```java
@FunctionName("checkAgainstInputBlob")
public void run(
        @BlobInput(
                name = "inputBlob",
                path = "inputContainer/input.txt") BlobClient inputBlob,
        @BlobTrigger(
                name = "content",
                path = "images/{name}",
                connection = "AzureWebJobsStorage",
                dataType = "string") String triggerBlob,
        ExecutionContext ctx)
{
    ctx.getLogger().info("Size = " + inputBlob.getProperties().getBlobSize());
}
```

#### Considerations

+ The `dataType` setting on `@BlobTrigger` is ignored when binding to an SDK type.
+ Currently, only one SDK type can be used at a time in a given function definition. When a function has both a Blog trigger or input binding and a Blob output binding, one binding can use an SDK type (such as `BlobClient`) and the others must use a native type or POJO.
+ You can use managed identities with SDK types.

#### Troubleshooting

These are potential errors that might occur when using SDK types: 

| Exception | Meaning  |
| ----- | ----- |
| `SdkAnalysisException`     | Build plug-in couldn’t create metadata. This might be due to duplicate SDK-types in a single function definition, an unsupported parameter type, or some other misconfiguration. |
| `SdkRegistryException`     | Runtime doesn’t recognize the stored FQCN, which can be caused by mismatched library versions. |
| `SdkHydrationException`    | Middleware failed to build the SDK client, which can occur due to missing environment variables, reflection errors, credential failures, and similar runtime issues. |
| `SdkTypeCreationException` | Factory couldn’t turn metadata into the final SDK type, which is usually caused by a casting issues. |

Check the inner message for more details about the exact cause. Most SDK types issues are caused by misspelled environment variable names or missing dependencies.

## Bindings

Input and output bindings provide a declarative way to connect to data from within your code. A function can have multiple input and output bindings.

### Input binding example

```java
package com.example;

import com.microsoft.azure.functions.annotation.*;

public class Function {
    @FunctionName("echo")
    public static String echo(
        @HttpTrigger(name = "req", methods = { HttpMethod.PUT }, authLevel = AuthorizationLevel.ANONYMOUS, route = "items/{id}") String inputReq,
        @TableInput(name = "item", tableName = "items", partitionKey = "Example", rowKey = "{id}", connection = "AzureWebJobsStorage") TestInputData inputData,
        @TableOutput(name = "myOutputTable", tableName = "Person", connection = "AzureWebJobsStorage") OutputBinding<Person> testOutputData
    ) {
        testOutputData.setValue(new Person(httpbody + "Partition", httpbody + "Row", httpbody + "Name"));
        return "Hello, " + inputReq + " and " + inputData.getKey() + ".";
    }

    public static class TestInputData {
        public String getKey() { return this.rowKey; }
        private String rowKey;
    }
    public static class Person {
        public String partitionKey;
        public String rowKey;
        public String name;

        public Person(String p, String r, String n) {
            this.partitionKey = p;
            this.rowKey = r;
            this.name = n;
        }
    }
}
```

You invoke this function with an HTTP request. 
- HTTP request payload is passed as a `String` for the argument `inputReq`.
- One entry is retrieved from Table storage, and is passed as `TestInputData` to the argument `inputData`.

To receive a batch of inputs, you can bind to `String[]`, `POJO[]`, `List<String>`, or `List<POJO>`.

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

This function gets triggered whenever there's new data in the configured event hub. Because the `cardinality` is set to `MANY`, the function receives a batch of messages from the event hub. `EventData` from event hub gets converted to `TestEventData` for the function execution.

### Output binding example

You can bind an output binding to the return value by using `$return`. 

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

You invoke this function on an `HttpRequest` object. It writes multiple values to Queue storage.

## HttpRequestMessage and HttpResponseMessage

 These helper types, which are designed to work with HTTP Trigger functions, are defined in `azure-functions-java-library`: 

| Specialized type      |       Target        | Typical usage                  |
| --------------------- | :-----------------: | ------------------------------ |
| `HttpRequestMessage<T>`  |    HTTP Trigger     | Gets method, headers, or queries |
| `HttpResponseMessage` | HTTP Output Binding | Returns status other than 200   |

## Metadata

Few triggers send [trigger metadata](./functions-triggers-bindings.md) along with input data. You can use annotation `@BindingName` to bind to trigger metadata.


```Java
package com.example;

import java.util.Optional;
import com.microsoft.azure.functions.annotation.*;


public class Function {
    @FunctionName("metadata")
    public static String metadata(
        @HttpTrigger(name = "req", methods = { HttpMethod.GET, HttpMethod.POST }, authLevel = AuthorizationLevel.ANONYMOUS) Optional<String> body,
        @BindingName("name") String queryValue
    ) {
        return body.orElse(queryValue);
    }
}
```
In the preceding example, the `queryValue` is bound to the query string parameter `name` in the HTTP request URL, `http://{example.host}/api/metadata?name=test`. Here's another example, showing how to bind to `Id` from queue trigger metadata.

```java
 @FunctionName("QueueTriggerMetadata")
    public void QueueTriggerMetadata(
        @QueueTrigger(name = "message", queueName = "test-input-java-metadata", connection = "AzureWebJobsStorage") String message,@BindingName("Id") String metadataId,
        @QueueOutput(name = "output", queueName = "test-output-java-metadata", connection = "AzureWebJobsStorage") OutputBinding<TestData> output,
        final ExecutionContext context
    ) {
        context.getLogger().info("Java Queue trigger function processed a message: " + message + " with metadataId:" + metadataId );
        TestData testData = new TestData();
        testData.id = metadataId;
        output.setValue(testData);
    }
```

> [!NOTE]
> The name provided in the annotation needs to match the metadata property.

## Execution context

`ExecutionContext`, defined in the `azure-functions-java-library`, contains helper methods that are used to communicate with the functions runtime. For more information, see the [ExecutionContext reference article](/java/api/com.microsoft.azure.functions.executioncontext).

### Logger

Use `getLogger`, defined in `ExecutionContext`, to write logs from function code.

Example:

```java

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;

public class Function {
    public String echo(@HttpTrigger(name = "req", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS) String req, ExecutionContext context) {
        if (req.isEmpty()) {
            context.getLogger().warning("Empty request body received by function " + context.getFunctionName() + " with invocation " + context.getInvocationId());
        }
        return String.format(req);
    }
}
```

## View logs and trace

You can use the Azure CLI to stream Java stdout and stderr logging, and other application logging. 

Here's how to configure your function app to write application logging by using the Azure CLI:

# [Bash](#tab/bash)

```azurecli-interactive
az webapp log config --name functionname --resource-group myResourceGroup --application-logging true
```

# [Cmd](#tab/cmd)

```azurecli-interactive
az webapp log config --name functionname --resource-group myResourceGroup --application-logging true
```

---

To stream logging output for your function app by using the Azure CLI, open a new command prompt, Bash, or Terminal session, and enter the following command:

# [Bash](#tab/bash)

```azurecli-interactive
az webapp log tail --name webappname --resource-group myResourceGroup
```

# [Cmd](#tab/cmd)

```azurecli-interactive
az webapp log tail --name webappname --resource-group myResourceGroup
```

---

The [az webapp log tail](/cli/azure/webapp/log) command has options to filter output by using the `--provider` option. 

To download the log files as a single ZIP file by using the Azure CLI, open a new command prompt, Bash, or Terminal session, and enter the following command:

```azurecli-interactive
az webapp log download --resource-group resourcegroupname --name functionappname
```

You must enable file system logging in the Azure portal or the Azure CLI before running this command.

## Environment variables

In Functions, [app settings](functions-app-settings.md), such as service connection strings, are exposed as environment variables during execution. You can access these settings by using, `System.getenv("AzureWebJobsStorage")`.

The following example gets the [application setting](functions-how-to-use-azure-function-app-settings.md#settings), with the key named `myAppSetting`:

```java

public class Function {
    public String echo(@HttpTrigger(name = "req", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.ANONYMOUS) String req, ExecutionContext context) {
        context.getLogger().info("My app setting value: "+ System.getenv("myAppSetting"));
        return String.format(req);
    }
}

```
## Use dependency injection in Java Functions

Azure Functions Java supports the dependency injection (DI) software design pattern, which is a technique to achieve [Inversion of Control (IoC)](/dotnet/architecture/modern-web-apps-azure/architectural-principles#dependency-inversion) between classes and their dependencies. Java Azure Functions provides a hook to integrate with popular Dependency Injection frameworks in your Functions Apps.  [Azure Functions Java SPI](https://github.com/Azure/azure-functions-java-additions/tree/dev/azure-functions-java-spi) contains an interface [FunctionInstanceInjector](https://github.com/Azure/azure-functions-java-additions/blob/dev/azure-functions-java-spi/src/main/java/com/microsoft/azure/functions/spi/inject/FunctionInstanceInjector.java). By implementing this interface, you can return an instance of your function class and your functions are invoked on this instance. This gives frameworks like [Spring](/azure/developer/java/spring-framework/getting-started-with-spring-cloud-function-in-azure?toc=%2Fazure%2Fazure-functions%2Ftoc.json), [Quarkus](/azure/azure-functions/functions-create-first-quarkus), Google Guice, Dagger, etc. the ability to create the function instance and register it into their IOC container. This means you can use those Dependency Injection frameworks to manage your functions naturally. 

> [!NOTE]
> Microsoft Azure Functions Java SPI Types ([azure-function-java-spi](https://mvnrepository.com/artifact/com.microsoft.azure.functions/azure-functions-java-spi/1.0.0)) is a package that contains all SPI interfaces for third parties to interact with Microsoft Azure functions runtime.

### Function instance injector for dependency injection
[azure-function-java-spi](https://mvnrepository.com/artifact/com.microsoft.azure.functions/azure-functions-java-spi/1.0.0) contains an interface FunctionInstanceInjector

```java
package com.microsoft.azure.functions.spi.inject; 

/** 

 * The instance factory used by DI framework to initialize function instance. 

 * 

 * @since 1.0.0 

 */ 

public interface FunctionInstanceInjector { 

    /** 

     * This method is used by DI framework to initialize the function instance. This method takes in the customer class and returns 

     * an instance create by the DI framework, later customer functions will be invoked on this instance. 

     * @param functionClass the class that contains customer functions 

     * @param <T> customer functions class type 

     * @return the instance that will be invoked on by azure functions java worker 

     * @throws Exception any exception that is thrown by the DI framework during instance creation 

     */ 

    <T> T getInstance(Class<T> functionClass) throws Exception; 

} 

```

For more examples that use FunctionInstanceInjector to integrate with Dependency injection frameworks refer to [this](https://github.com/Azure/azure-functions-java-worker/tree/dev/samples/dependency-injection-example) repository. 

## Next steps

For more information about Azure Functions Java development, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* Local development and debug with [Visual Studio Code](https://code.visualstudio.com/docs/java/java-azurefunctions), [IntelliJ](functions-create-maven-intellij.md), and [Eclipse](functions-create-maven-eclipse.md)
* [Remote Debug Java functions using Visual Studio Code](https://code.visualstudio.com/docs/java/java-serverless#_remote-debug-functions-running-in-the-cloud)
* [Maven plugin for Azure Functions](https://github.com/Microsoft/azure-maven-plugins/blob/develop/azure-functions-maven-plugin/README.md) 
* Streamline function creation through the `azure-functions:add` goal, and prepare a staging directory for [ZIP file deployment](deployment-zip-push.md).
