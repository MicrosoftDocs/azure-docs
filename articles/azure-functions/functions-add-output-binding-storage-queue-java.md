---
title: Add an Azure Storage queue binding to your Java function 
description: Learn how to add an Azure Storage queue output binding to your Java function.
services: functions 
author: ggailey777
ms.author: glenga
ms.date: 10/02/2019
ms.topic: quickstart
ms.service: azure-functions
manager: gwallace
---

# Add an Azure Storage queue binding to your Java function

[!INCLUDE [functions-add-storage-binding-intro](../../includes/functions-add-storage-binding-intro.md)]

This article shows you how to integrate the function you created in the [previous quickstart article](functions-create-first-function-python.md) with an Azure Storage queue. The output binding that you add to this function writes data from an HTTP request to a message in the queue.

Most bindings require a stored connection string that Functions uses to access the bound service. To make this connection easier, you use the Storage account that you created with your function app. The connection to this account is already stored in an app setting named `AzureWebJobsStorage`.  

## Prerequisites

Before you start this article, complete the steps in [part 1 of the Java quickstart](functions-create-first-java-maven.md).

## Download the function app settings

[!INCLUDE [functions-app-settings-download-cli](../../includes/functions-app-settings-download-cli.md)]

## Enable extension bundles

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

You can now add the Storage output binding to your project.

## Add an output binding

In a Java project, the bindings are defined as binding annotations on the function method. The *function.json* file is then auto-generated based on these annotations.

Browse to the location of your function code under _src/main/java_, open the *Function.java* project file, and add the following parameter to the `run` method definition:

```java
@QueueOutput(name = "msg", queueName = "outqueue", connection = "AzureWebJobsStorage") OutputBinding<String> msg
```

The `msg` parameter is an [`OutputBinding<T>`](/java/api/com.microsoft.azure.functions.outputbinding) type, which represents a collection of strings that are written as messages to an output binding when the function completes. In this case, the output is a storage queue named `outqueue`. The connection string for the Storage account is set by the `connection` method. Rather than the connection string itself, you pass the application setting that contains the Storage account connection string.

The `run` method definition should now look like the following:  

```java
@FunctionName("HttpTrigger-Java")
public HttpResponseMessage run(
        @HttpTrigger(name = "req", methods = {HttpMethod.GET, HttpMethod.POST}, authLevel = AuthorizationLevel.FUNCTION) HttpRequestMessage<Optional<String>> request, 
        @QueueOutput(name = "msg", queueName = "outqueue", connection = "AzureWebJobsStorage") 
        OutputBinding<String> msg, final ExecutionContext context) {
    context.getLogger().info("Java HTTP trigger processed a request.");
```

## Add code that uses the output binding

Now, you can use the new `msg` parameter to write to the output binding from your function code. Add the following line of code before the success response to add the value of `name` to the `msg` output binding.

```java
msg.setValue(name);
```

When you use an output binding, you don't have to use the Azure Storage SDK code for authentication, getting a queue reference, or writing data. The Functions runtime and queue output binding do those tasks for you.

Your run method should now look like the following example:

```java
@FunctionName("HttpTrigger-Java")
public HttpResponseMessage run(
        @HttpTrigger(name = "req", methods = {HttpMethod.GET, HttpMethod.POST}, authLevel = AuthorizationLevel.FUNCTION) HttpRequestMessage<Optional<String>> request, 
        @QueueOutput(name = "msg", queueName = "outqueue", connection = "AzureWebJobsStorage") 
        OutputBinding<String> msg, final ExecutionContext context) {
    context.getLogger().info("Java HTTP trigger processed a request.");

    // Parse query parameter
    String query = request.getQueryParameters().get("name");
    String name = request.getBody().orElse(query);

    if (name == null) {
        return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("Please pass a name on the query string or in the request body").build();
    } else {
        // Write the name to the message queue. 
        msg.setValue(name);

        return request.createResponseBuilder(HttpStatus.OK).body("Hello, " + name).build();
    }
}
```

## Update the tests

Because the archetype also creates a set of tests, you need to update these tests to handle the new `msg` parameter in the `run` method signature.  

Browse to the location of your test code under _src/test/java_, open the *Function.java* project file and replace the line of code under `//Invoke` with the following code.

```java
@SuppressWarnings("unchecked")
final OutputBinding<String> msg = (OutputBinding<String>)mock(OutputBinding.class);

// Invoke
final HttpResponseMessage ret = new Function().run(req, msg, context);
``` 

You are now ready to try out the new output binding locally.

## Run the function locally

As before, use the following command to build the project and start the Functions runtime locally:

```bash
mvn clean package 
mvn azure-functions:run
```

[!INCLUDE [functions-storage-binding-run-local](../../includes/functions-storage-binding-run-local.md)]

[!INCLUDE [functions-storage-binding-set-connection](../../includes/functions-storage-binding-set-connection.md)]

[!INCLUDE [functions-storage-binding-query-cli](../../includes/functions-storage-binding-query-cli.md)]

### Redeploy the project 

To update your published app, run the following command again:  

```azurecli
mvn azure-functions:deploy
```

Again, you can use cURL to test the deployed function. As before, append the query string `&name=<yourname>` to the URL, as in this example:

```bash
curl https://myfunctionapp.azurewebsites.net/api/httptrigger?code=cCr8sAxfBiow548FBDLS1....&name=<yourname>
```

You can [examine the Storage queue message](#query-the-storage-queue) again to verify that the output binding generates a new message in the queue, as expected.

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

## Next steps

You've updated your HTTP-triggered function to write data to a Storage queue. To learn more about developing Azure Functions with Java, see the [Azure Functions Java developer guide](functions-reference-java.md) and [Azure Functions triggers and bindings](functions-triggers-bindings.md). For examples of complete Function projects in Java, see the [Java Functions samples](/samples/browse/?products=azure-functions&languages=Java). 

Next, you should enable Application Insights monitoring for your function app:

> [!div class="nextstepaction"]
> [Enable Application Insights integration](functions-monitoring.md#manually-connect-an-app-insights-resource)


[Azure Storage Explorer]: https://storageexplorer.com/