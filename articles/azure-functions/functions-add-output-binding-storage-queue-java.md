---
title: Connect your Java function to Azure Storage 
description: Learn how to connect an HTTP-triggered Java function to Azure Storage by using a Queue storage output binding.
author: KarlErickson
ms.author: karler
ms.date: 10/14/2019
ms.topic: quickstart
zone_pivot_groups: java-build-tools-set
---

# Connect your Java function to Azure Storage

[!INCLUDE [functions-add-storage-binding-intro](../../includes/functions-add-storage-binding-intro.md)]

This article shows you how to integrate the function you created in the [previous quickstart article](functions-create-first-java-maven.md) with an Azure Storage queue. The output binding that you add to this function writes data from an HTTP request to a message in the queue.

Most bindings require a stored connection string that Functions uses to access the bound service. To make this connection easier, you use the Storage account that you created with your function app. The connection to this account is already stored in an app setting named `AzureWebJobsStorage`.  

## Prerequisites

Before you start this article, complete the steps in [part 1 of the Java quickstart](functions-create-first-java-maven.md).

## Download the function app settings

[!INCLUDE [functions-app-settings-download-cli](../../includes/functions-app-settings-download-local-cli.md)]

## Enable extension bundles

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

You can now add the Storage output binding to your project.

## Add an output binding

[!INCLUDE [functions-add-output-binding-java-cli](../../includes/functions-add-output-binding-java-cli.md)]

## Add code that uses the output binding

[!INCLUDE [functions-add-output-binding-java-code](../../includes/functions-add-output-binding-java-code.md)]

[!INCLUDE [functions-add-output-binding-java-test-cli](../../includes/functions-add-output-binding-java-test-cli.md)]

You're now ready to try out the new output binding locally.

## Run the function locally

As before, use the following command to build the project and start the Functions runtime locally:

# [Maven](#tab/maven)
```bash
mvn clean package 
mvn azure-functions:run
```
# [Gradle](#tab/gradle) 
```bash
gradle jar --info
gradle azureFunctionsRun
```
---

> [!NOTE]  
> Because you enabled extension bundles in the host.json, the [Storage binding extension](functions-bindings-storage-blob.md#add-to-your-functions-app) was downloaded and installed for you during startup, along with the other Microsoft binding extensions.

As before, trigger the function from the command line using cURL in a new terminal window:

```CMD
curl -w "\n" http://localhost:7071/api/HttpTrigger-Java --data AzureFunctions
```

This time, the output binding also creates a queue named `outqueue` in your Storage account and adds a message with this same string.

Next, you use the Azure CLI to view the new queue and verify that a message was added. You can also view your queue by using the [Microsoft Azure Storage Explorer][Azure Storage Explorer] or in the [Azure portal](https://portal.azure.com).

[!INCLUDE [functions-storage-account-set-cli](../../includes/functions-storage-account-set-cli.md)]

[!INCLUDE [functions-query-storage-cli](../../includes/functions-query-storage-cli.md)]

### Redeploy the project 

To update your published app, run the following command again:  

# [Maven](#tab/maven)  
```bash
mvn azure-functions:deploy
```
# [Gradle](#tab/gradle)  
```bash
gradle azureFunctionsDeploy
```
---

Again, you can use cURL to test the deployed function. As before, pass the value `AzureFunctions` in the body of the POST request to the URL, as in this example:

```bash
curl -w "\n" https://fabrikam-functions-20190929094703749.azurewebsites.net/api/HttpTrigger-Java?code=zYRohsTwBlZ68YF.... --data AzureFunctions
```

You can [examine the Storage queue message](#query-the-storage-queue) again to verify that the output binding generates a new message in the queue, as expected.

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

## Next steps

You've updated your HTTP-triggered function to write data to a Storage queue. To learn more about developing Azure Functions with Java, see the [Azure Functions Java developer guide](functions-reference-java.md) and [Azure Functions triggers and bindings](functions-triggers-bindings.md). For examples of complete Function projects in Java, see the [Java Functions samples](/samples/browse/?products=azure-functions&languages=Java). 

Next, you should enable Application Insights monitoring for your function app:

> [!div class="nextstepaction"]
> [Enable Application Insights integration](functions-monitoring.md#manually-connect-an-app-insights-resource)


[Azure Storage Explorer]: https://storageexplorer.com/
