---
title: Quickstart: Use Java and Maven to publish a function to Azure
description: Create and publish an HTTP-triggered function to Azure with Java and Maven.
author: rloutlaw
manager: gwallace
ms.service: azure-functions
ms.topic: quickstart
ms.date: 08/10/2018
ms.author: glenga
ms.custom: mvc, devcenter, seo-java-july2019, seo-java-august2019, seo-java-september2019
---

# Quickstart: Use Java and Maven to create and publish a function to Azure

This article shows you how to build and publish a Java function to Azure Functions with the Maven command-line tool. When you're done, your function code runs in Azure in a [serverless hosting plan](functions-scale.md#consumption-plan) and is triggered by an HTTP request.

<!--
> [!NOTE] 
> You can also create a Kotlin-based Azure Functions project by using the azure-functions-kotlin-archetype instead. Visit the [GitHub repository](https://github.com/microsoft/azure-maven-archetypes/tree/develop/azure-functions-kotlin-archetype) for more information.
-->

## Prerequisites

To develop functions using Java, you must have the following installed:

- [Java Developer Kit](https://aka.ms/azure-jdks), version 8
- [Apache Maven](https://maven.apache.org), version 3.0 or above
- [Azure CLI]
- [Azure Functions Core Tools](./functions-run-local.md#v2) version 2.6.666 or above
- An Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]


> [!IMPORTANT]
> The JAVA_HOME environment variable must be set to the install location of the JDK to complete this quickstart.

## Generate a new Functions project

In an empty folder, run the following command to generate the Functions project from a [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html).

### Linux/macOS

```bash
mvn archetype:generate \
    -DarchetypeGroupId=com.microsoft.azure \
	-DarchetypeArtifactId=azure-functions-archetype 
```

> [!NOTE]
> If you're experiencing issues with running the command, take a look at what `maven-archetype-plugin` version is used. Because you are running the command in an empty directory with no `.pom` file, it might be attempting to use a plugin of the older version from `~/.m2/repository/org/apache/maven/plugins/maven-archetype-plugin` if you upgraded your Maven from an older version. If so, try deleting the `maven-archetype-plugin` directory and re-running the command.

### Windows

```powershell
mvn archetype:generate `
    "-DarchetypeGroupId=com.microsoft.azure" `
    "-DarchetypeArtifactId=azure-functions-archetype"
```

```cmd
mvn archetype:generate ^
	"-DarchetypeGroupId=com.microsoft.azure" ^
	"-DarchetypeArtifactId=azure-functions-archetype"
```

Maven asks you for values needed to finish generating the project on deployment. Provide the following values when prompted:

| Value | Description |
| ----- | ----------- |
| **groupId** | A value that uniquely identifies your project across all projects, following the [package naming rules](https://docs.oracle.com/javase/specs/jls/se6/html/packages.html#7.7) for Java. The examples in this quickstart use `com.fabrikam.functions`. |
| **artifactId** | A value that is the name of the jar, without a version number. The examples in this quickstart use `fabrikam-functions`. |
| **version** | Choose the default value of `1.0-SNAPSHOT`. |
| **package** | A value that is the Java package for the generated function code. Use the default. The examples in this quickstart use `com.fabrikam.functions`. |
| **appName** | Globally unique name that identifies your new function app in Azure. Use the default, which is the _artifactId_ appended with a random number. Make a note of this value, you'll need it later. |
| **appRegion** | Choose a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access. The default is `westus`. Run this [Azure CLI] command to get a list of all regions:<br/>`az account list-locations --query '[].{Name:name}' -o tsv` |
| **resourceGroup** | Name for the new [resource group](../articles/azure-resource-manager/resource-group-overview.md) in which to create your function app. Use `myResourceGroup`, which is used by examples in this quickstart. A resource group must be unique to your Azure subscription.|

Type `Y` or press Enter to confirm.

Maven creates the project files in a new folder with a name of _artifactId_, which in this example is `fabrikam-functions`. 

Open the new Function.java file from the *src/main/java* path in a text editor and review the generated code. This code is an [HTTP triggered](functions-bindings-http-webhook.md) function that echoes the body of the request. 

## Run the function locally

Run the following command, which changes the directory to the newly created project folder, then builds and runs the function project:

```console
cd fabrikam-function
mvn clean package 
mvn azure-functions:run
```

You see output like the following from Azure Functions Core Tools when you run the project locally:

```Output
...

Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.

Http Functions:

    HttpTrigger-Java: [GET,POST] http://localhost:7071/api/HttpTrigger-Java
...
```

Trigger the function from the command line using cURL in a new terminal window:

```CMD
curl -w "\n" http://localhost:7071/api/HttpTrigger-Java -d Azure
```

```Output
Hello Azure!
```
The [function key](functions-bindings-http-webhook.md#authorization-keys) isn't required when running locally. Use `Ctrl+C` in the terminal to stop the function code.

## Deploy the function to Azure

A function app and related resources are created in Azure when you first deploy your function app. Before you can deploy, use the [az login](/cli/azure/authenticate-azure-cli?view=azure-cli-latest) Azure CLI command to sign in to your Azure subscription. 

```azurecli
az login
```

> [!TIP]
> If your account can access multiple subscriptions, use [az account set](/cli/azure/account#az-account-set) to set the default subscription for this session. 

Use the following Maven command to deploy your project to a new function app. 

```azurecli
mvn azure-functions:deploy
```

This `azure-functions:deploy` Maven target creates the following resources in Azure:

+ Resource group. Named with the _resourceGroup_ you supplied.
+ Storage account. Required by Functions. The name is generated randomly based on Storage account name requirements.
+ App service plan. Serverless hosting for your function app in the specified _appRegion_. The name is generated randomly.
+ Function app. A function app is the deployment and execution unit for your functions. The name is your _appName_, appended with a randomly generated number. 

The deployment also packages the project files and deploys them to the new function app using [zip deployment](functions-deployment-technologies.md#zip-deploy), with run-from-package mode enabled.

After the deployment completes, you see the URL you can use to access your function app endpoints. Because the HTTP trigger we published uses `authLevel = AuthorizationLevel.FUNCTION`, you need to get the function key to call the function endpoint over HTTP. The easiest way to get the function key is from the [Azure portal].

## Get the HTTP trigger endpoint

Test the function app running on Azure using `cURL`. You'll need to change the URL from the sample below to match the deployed URL for your own function app from the previous step.

> [!NOTE]
> Make sure you set the **Access rights** to `Anonymous`. When you choose the default level of `Function`, you are required to present the [function key](../azure-functions/functions-bindings-http-webhook.md#authorization-keys) in requests to access your function endpoint.

```azurecli
curl -w "\n" https://fabrikam-function-20170920120101928.azurewebsites.net/api/HttpTrigger-Java -d AzureFunctions
```

```Output
Hello AzureFunctions!
```

## Next steps

You've created a Java functions project with an HTTP triggered function, run it on your local machine, and deployed it to Azure. Now, extend your function by...

> [!div class="nextstepaction"]
> [Adding an Azure Storage queue output binding](functions-add-output-binding-storage-queue-java.md)


[Azure CLI]: cli/azure
[Azure portal]: https://portal.azure.com