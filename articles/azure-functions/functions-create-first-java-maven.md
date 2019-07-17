---
title: Create your first function in Azure with Java and Maven| Microsoft Docs
description: Create and publish a simple HTTP triggered function to Azure with Java and Maven.
services: functions
documentationcenter: na
author: rloutlaw
manager: justhe
keywords: azure functions, functions, event processing, compute, serverless architecture
ms.service: azure-functions
ms.devlang: multiple
ms.topic: quickstart
ms.devlang: java
ms.date: 08/10/2018
ms.author: routlaw
ms.reviewer: glenga
ms.custom: mvc, devcenter
---

# Create your first function with Java and Maven

This article guides you through using the Maven command-line tool to build and publish a Java function to Azure Functions. When you're done, your function code runs on the [Consumption Plan](functions-scale.md#consumption-plan) in Azure and can be triggered using an HTTP request.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To develop functions using Java, you must have the following installed:

- [Java Developer Kit](https://aka.ms/azure-jdks), version 8
- [Apache Maven](https://maven.apache.org), version 3.0 or above
- [Azure CLI](https://docs.microsoft.com/cli/azure)
- [Azure Functions Core Tools](./functions-run-local.md#v2) version 2.6.666 or above

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

Maven will ask you for values needed to finish generating the project. For _groupId_, _artifactId_, and _version_ values, see the [Maven naming conventions](https://maven.apache.org/guides/mini/guide-naming-conventions.html) reference. The _appName_ value must be unique across Azure, so Maven generates an app name based on the previously entered _artifactId_  as a default. The _packageName_ value determines the Java package for the generated function code.

The `com.fabrikam.functions` and `fabrikam-functions` identifiers below are used as an example and to make later steps in this quickstart easier to read. You are encouraged to supply your own values to Maven in this step.

```Output
Define value for property 'groupId' (should match expression '[A-Za-z0-9_\-\.]+'): com.fabrikam.functions
Define value for property 'artifactId' (should match expression '[A-Za-z0-9_\-\.]+'): fabrikam-functions
Define value for property 'version' 1.0-SNAPSHOT : 
Define value for property 'package': com.fabrikam.functions
Define value for property 'appName' fabrikam-functions-20170927220323382:
Define value for property 'appRegion' westus: :
Define value for property 'resourceGroup' java-functions-group: :
Confirm properties configuration: Y
```

Maven creates the project files in a new folder with a name of _artifactId_, in this example `fabrikam-functions`. The ready to run generated code in the project is an [HTTP triggered](/azure/azure-functions/functions-bindings-http-webhook) function that echoes the body of the request. Replace *src/main/java/com/fabrikam/functions/Function.java* with the following code: 

```java
package com.fabrikam.functions;

import java.util.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;

public class Function {
    /**
     * This function listens at endpoint "/api/hello". Two ways to invoke it using "curl" command in bash:
     * 1. curl -d "HTTP Body" {your host}/api/hello
     * 2. curl {your host}/api/hello?name=HTTP%20Query
     */
    @FunctionName("hello")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req", methods = { HttpMethod.GET, HttpMethod.POST }, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) {
        context.getLogger().info("Java HTTP trigger processed a request.");

        // Parse query parameter
        String query = request.getQueryParameters().get("name");
        String name = request.getBody().orElse(query);

        if (name == null) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("Please pass a name on the query string or in the request body").build();
        } else {
            return request.createResponseBuilder(HttpStatus.OK).body("Hello, " + name).build();
        }
    }
}

```

## Enable extension bundles

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

## Run the function locally

Change directory to the newly created project folder and build and run the function with Maven:

```
cd fabrikam-function
mvn clean package 
mvn azure-functions:run
```

> [!NOTE]
> If you're experiencing this exception: `javax.xml.bind.JAXBException` with Java 9, see the workaround on [GitHub](https://github.com/jOOQ/jOOQ/issues/6477).

You see this output when the function is running locally on your system and ready to respond to HTTP requests:

```Output
Listening on http://localhost:7071
Hit CTRL-C to exit...

Http Functions:

   hello: http://localhost:7071/api/hello
```

Trigger the function from the command line using curl in a new terminal window:

```
curl -w "\n" http://localhost:7071/api/hello -d LocalFunction
```

```Output
Hello LocalFunction!
```

Use `Ctrl-C` in the terminal to stop the function code.

## Deploy the function to Azure

The deploy process to Azure Functions uses account credentials from the Azure CLI. [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli?view=azure-cli-latest) before continuing.

```azurecli
az login
```

Deploy your code into a new Function app using the `azure-functions:deploy` Maven target. This performs a [Zip Deploy with Run From Package](functions-deployment-technologies.md#zip-deploy) mode enabled.

> [!NOTE]
> When you use Visual Studio Code to deploy your Function app, remember to choose a non-free subscription, or you will get an error. You can watch your subscription on the left side of the IDE.

```
mvn azure-functions:deploy
```

When the deploy is complete, you see the URL you can use to access your Azure function app:

```output
[INFO] Successfully deployed Function App with package.
[INFO] Deleting deployment package from Azure Storage...
[INFO] Successfully deleted deployment package fabrikam-function-20170920120101928.20170920143621915.zip
[INFO] Successfully deployed Function App at https://fabrikam-function-20170920120101928.azurewebsites.net
[INFO] ------------------------------------------------------------------------
```

Test the function app running on Azure using `cURL`. You'll need to change the URL from the sample below to match the deployed URL for your own function app from the previous step.

> [!NOTE]
> Make sure you set the **Access rights** to `Anonymous`. When you choose the default level of `Function`, you are required to present the [function key](../azure-functions/functions-bindings-http-webhook.md#authorization-keys) in requests to access your function endpoint.

```
curl -w "\n" https://fabrikam-function-20170920120101928.azurewebsites.net/api/hello -d AzureFunctions
```

```Output
Hello AzureFunctions!
```

## Make changes and redeploy

Edit the `src/main.../Function.java` source file in the generated project to alter the text returned by your Function app. Change this line:

```java
return request.createResponse(200, "Hello, " + name);
```

To the following:

```java
return request.createResponse(200, "Hi, " + name);
```

Save the changes. Run mvn clean package and redeploy by running `azure-functions:deploy` from the terminal as before. The function app will be updated and this request:

```bash
curl -w '\n' -d AzureFunctionsTest https://fabrikam-functions-20170920120101928.azurewebsites.net/api/hello
```

Will have updated output:

```Output
Hi, AzureFunctionsTest
```

## Next steps

You have created a Java function app with a simple HTTP trigger and deployed it to Azure Functions.

- Review the  [Java Functions developer guide](functions-reference-java.md) for more information on developing Java functions.
- Add additional functions with different triggers to your project using the `azure-functions:add` Maven target.
- Write and debug functions locally with [Visual Studio Code](https://code.visualstudio.com/docs/java/java-azurefunctions), [IntelliJ](functions-create-maven-intellij.md), and [Eclipse](functions-create-maven-eclipse.md). 
- Debug functions deployed in Azure with Visual Studio Code. See the Visual Studio Code [serverless Java applications](https://code.visualstudio.com/docs/java/java-serverless#_remote-debug-functions-running-in-the-cloud) documentation for instructions.
