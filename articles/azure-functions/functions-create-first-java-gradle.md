---
title: Use Java and Gradle to publish a function to Azure
description: Create and publish an HTTP-triggered function to Azure with Java and Gradle.
author: KarlErickson
ms.custom: devx-track-java
ms.author: karler
ms.topic: how-to
ms.date: 04/08/2020
---

# Use Java and Gradle to create and publish a function to Azure

This article shows you how to build and publish a Java function project to Azure Functions with the Gradle command-line tool. When you're done, your function code runs in Azure in a [serverless hosting plan](consumption-plan.md) and is triggered by an HTTP request. 

> [!NOTE]
> If Gradle is not your prefered development tool, check out our similar tutorials for Java developers using [Maven](./create-first-function-cli-java.md), [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/quickstart-functions) and [VS Code](./create-first-function-vs-code-java.md).

## Prerequisites

To develop functions using Java, you must have the following installed:

- [Java Developer Kit](/azure/developer/java/fundamentals/java-jdk-long-term-support), version 8
- [Azure CLI]
- [Azure Functions Core Tools](./functions-run-local.md#v2) version 2.6.666 or above
- [Gradle](https://gradle.org/), version 4.10 and above

You also need an active Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

> [!IMPORTANT]
> The JAVA_HOME environment variable must be set to the install location of the JDK to complete this quickstart.

## Prepare a Functions project

Use the following command to clone the sample project:

```bash
git clone https://github.com/Azure-Samples/azure-functions-samples-java.git
cd azure-functions-samples-java/
```

Open `build.gradle` and change the `appName` in the following section to a unique name to avoid domain name conflict when deploying to Azure. 

```gradle
azurefunctions {
    resourceGroup = 'java-functions-group'
    appName = 'azure-functions-sample-demo'
    pricingTier = 'Consumption'
    region = 'westus'
    runtime {
      os = 'windows'
    }
    localDebug = "transport=dt_socket,server=y,suspend=n,address=5005"
}
```

Open the new Function.java file from the *src/main/java* path in a text editor and review the generated code. This code is an [HTTP triggered](functions-bindings-http-webhook.md) function that echoes the body of the request. 

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=functions-create-first-java-gradle&step=generate-project)

## Run the function locally

Run the following command to build then run the function project:

```bash
gradle jar --info
gradle azureFunctionsRun
```
You see output like the following from Azure Functions Core Tools when you run the project locally:

<pre>
...

Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.

Http Functions:

    HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
...
</pre>

Trigger the function from the command line using the following cURL command in a new terminal window:

```bash
curl -w "\n" http://localhost:7071/api/HttpExample --data AzureFunctions
```

The expected output is the following:

<pre>
Hello, AzureFunctions
</pre>

> [!NOTE]
> If you set authLevel to `FUNCTION` or `ADMIN`, the [function key](functions-bindings-http-webhook-trigger.md#authorization-keys) isn't required when running locally.  

Use `Ctrl+C` in the terminal to stop the function code.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=functions-create-first-java-gradle&step=local-run)

## Deploy the function to Azure

A function app and related resources are created in Azure when you first deploy your function app. Before you can deploy, use the [az login](/cli/azure/authenticate-azure-cli) Azure CLI command to sign in to your Azure subscription. 

```azurecli
az login
```

> [!TIP]
> If your account can access multiple subscriptions, use [az account set](/cli/azure/account#az_account_set) to set the default subscription for this session. 

Use the following command to deploy your project to a new function app. 

```bash
gradle azureFunctionsDeploy
```

This creates the following resources in Azure, based on the values in the build.gradle file:

+ Resource group. Named with the _resourceGroup_ you supplied.
+ Storage account. Required by Functions. The name is generated randomly based on Storage account name requirements.
+ App Service plan. Serverless Consumption plan hosting for your function app in the specified _appRegion_. The name is generated randomly.
+ Function app. A function app is the deployment and execution unit for your functions. The name is your _appName_, appended with a randomly generated number. 

The deployment also packages the project files and deploys them to the new function app using [zip deployment](functions-deployment-technologies.md#zip-deploy), with run-from-package mode enabled.

The authLevel for HTTP Trigger in sample project is `ANONYMOUS`, which will skip the authentication. However, if you use other authLevel like `FUNCTION` or `ADMIN`, you need to get the function key to call the function endpoint over HTTP. The easiest way to get the function key is from the [Azure portal].

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=functions-create-first-java-gradle&step=deploy)

## Get the HTTP trigger URL

You can get the URL required to trigger your function, with the function key, from the Azure portal. 

1. Browse to the [Azure portal], sign in, type the _appName_ of your function app into **Search** at the top of the page, and press enter.
 
1. In your function app, select **Functions**, choose your function, then click **</> Get Function Url** at the top right. 

    :::image type="content" source="./media/functions-create-first-java-gradle/get-function-url-portal.png" alt-text="Copy the function URL from the Azure portal":::

1. Choose **default (Function key)** and select **Copy**. 

You can now use the copied URL to access your function.

## Verify the function in Azure

To verify the function app running on Azure using `cURL`, replace the URL from the sample below with the URL that you copied from the portal.

```console
curl -w "\n" http://azure-functions-sample-demo.azurewebsites.net/api/HttpExample --data AzureFunctions
```

This sends a POST request to the function endpoint with `AzureFunctions` in the body of the request. You see the following response.

<pre>
Hello, AzureFunctions
</pre>

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=functions-create-first-java-gradle&step=verify-deployment)

## Next steps

You've created a Java functions project with an HTTP triggered function, run it on your local machine, and deployed it to Azure. Now, extend your function by...

> [!div class="nextstepaction"]
> [Adding an Azure Storage queue output binding](functions-add-output-binding-storage-queue-java.md)


[Azure CLI]: /cli/azure
[Azure portal]: https://portal.azure.com