---
title: Create your first function in Azure with Java and IntelliJ| Microsoft Docs
description: Create and publish a simple HTTP triggered function to Azure with Java and IntelliJ.
services: functions
documentationcenter: na
author: jeffhollan
manager: cfowler
keywords: azure functions, functions, event processing, compute, serverless architecture, java
ms.service: functions
ms.devlang: multiple
ms.topic: quickstart
ms.tgt_pltfrm: multiple
ms.devlang: java
ms.workload: na
ms.date: 07/01/2018
ms.author: jehollan
ms.custom: mvc, devcenter
---

# Create your first function with Java and IntelliJ (Preview)

> [!NOTE] 
> Java for Azure Functions is currently in preview.

This quickstart guides through creating a [serverless](https://azure.microsoft.com/overview/serverless-computing/) function project with IntelliJ IDEA (via Maven), testing it locally, and deploying it to Azure Functions. When you're done, you have a HTTP-triggered function app running in Azure.

<!-- TODO ![Access a Hello World function from the command line with cURL](media/functions-create-java-maven/hello-azure.png) -->

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites
To develop functions app with Java, you must have the following installed:

-  [Java Developer Kit](https://www.azul.com/downloads/zulu/), version 8.
-  [Apache Maven](https://maven.apache.org), version 3.0 or above.
-  [IntelliJ IDEA](https://www.jetbrains.com/idea/download), Community or Ultimate with Maven tooling.
-  [Azure CLI](https://docs.microsoft.com/cli/azure)

> [!IMPORTANT] 
> The JAVA_HOME environment variable must be set to the install location of the JDK to complete this quickstart.

## Install the Azure Functions Core Tools

The Azure Functions Core Tools provide a local development environment for writing, running, and debugging Azure Functions from the terminal or command prompt. 

Install [version 2 of the Core Tools](functions-run-local.md#v2) on your local computer before continuing.

## Create a new Functions project

1. In IntelliJ IDEA, click to **Create New Project**.  
1. Select to create from **Maven**
1. Select the checkbox to **Create from archetype** and **Add Archetype** for the [azure-functions-archetype](https://mvnrepository.com/artifact/com.microsoft.azure/azure-functions-archetype).
    - GroupId: com.microsoft.azure
    - ArtifactId: azure-functions-archetype
    - Version: Use latest version from [the central repository](https://mvnrepository.com/artifact/com.microsoft.azure/azure-functions-archetype)
    ![IntelliJ Maven create](media/functions-create-first-java-intellij/functions-create-intellij.png)  
1. Click **Next** and enter details for current project, and eventually **Finish**.

Maven creates the project files in a new folder with a name of _artifactId_. The ready to run generated code in the project is a simple [HTTP triggered](/azure/azure-functions/functions-bindings-http-webhook) function that echoes the body of the request:

```java
public class Function {
    /**
     * This function listens at endpoint "/api/hello". Two ways to invoke it using "curl" command in bash:
     * 1. curl -d "HTTP Body" {your host}/api/hello
     * 2. curl {your host}/api/hello?name=HTTP%20Query
     */
    @FunctionName("hello")
    public HttpResponseMessage<String> hello(
            @HttpTrigger(name = "req", methods = {"get", "post"}, authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) {
        context.getLogger().info("Java HTTP trigger processed a request.");

        // Parse query parameter
        String query = request.getQueryParameters().get("name");
        String name = request.getBody().orElse(query);

        if (name == null) {
            return request.createResponse(400, "Please pass a name on the query string or in the request body");
        } else {
            return request.createResponse(200, "Hello, " + name);
        }
    }
}

```

## Run the function locally

1. Select to import changes or make sure that [auto import](https://www.jetbrains.com/help/idea/creating-and-optimizing-imports.html) is enables.
1. Open the **Maven Projects** toolbar
1. Under Lifecycle, double-click **package** to package and build the solution and create a target directory.
1. Under Plugins -> azure-functions double-click **azure-functions:run** to start the azure functions local runtime
    ![Maven toolbar for Azure Functions](media/functions-create-first-java-intellij/functions-intellij-java-maven-toolbar.png)  
1. Click the link in the run output to navigate to `http://localhost:7071/api/hello`.  You should see the logs emit for a function run.  You can pass in a name as a query parameter to have it return a "Hello, {name}" message.

> [!NOTE]
> If you're experiencing this exception: `javax.xml.bind.JAXBException` with Java 9, see the workaround on [GitHub](https://github.com/jOOQ/jOOQ/issues/6477).

Close the run dialog when complete. Only one function host can be active and running locally at a time.

## Debug the function in IntelliJ

You can debug functions in IntelliJ by attaching to the function host after startup.  Run the Azure Function locally using the steps above, and then in the **Run** menu select **Attach to local process**.  You should see a process on port 5005 available.  After attaching you can have breakpoints hit and debug inside your function app.

When finished stop the debugger and the running process. Only one function host can be active and running locally at at time.

## Deploy the function to Azure

The deploy process to Azure Functions uses account credentials from the Azure CLI. [Log in with the Azure CLI](/cli/azure/authenticate-azure-cli?view=azure-cli-latest) before continuing using the Terminal.

```azurecli
az login
```

Deploy your code into a new Function app using the `azure-functions:deploy` Maven target, or select the azure-functions:deploy option in the Maven Projects window.

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

## Next steps

You've created a Java function app with a simple HTTP trigger and deployed it to Azure Functions.

- Review the  [Java Functions developer guide](functions-reference-java.md) for more information on developing Java functions.
- Add additional functions with different triggers to your project using the `azure-functions:add` Maven target.
