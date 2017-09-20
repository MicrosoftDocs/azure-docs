---
title: Create your first function in Azure with Java and Maven| Microsoft Docs
description: Create and publish a simple HTTP triggered function to Azure with Java and Maven.
services: functions
documentationcenter: na
author: rloutlaw
manager: justhe
editor: ''
tags: ''
keywords: azure functions, functions, event processing, compute, serverless architecture
ms.service: functions
ms.devlang: multiple
ms.topic: quickstart
ms.tgt_pltfrm: multiple
ms.devlang: java
ms.workload: na
ms.date: 09/12/2017
ms.author: routlaw
ms.custom: mvc, devcenter
---

# Create your first function with Java and Maven

This quickstart will walk you through creating a serverless function in Java, testing it locally, and deploying it to Azure Functions. When you're done, you'll have a HTTP-triggered function running in Azure.

## Prerequisites

-  [.NET Core 2.0](https://www.microsoft.com/net/core)  
-  [Azure CLI](https://docs.microsoft.com/cli/azure)
-  [Apache Maven](https://maven.apache.org)
-  [Azure Functions Core Tools](/azure/azure-functions/functions-run-local#install-the-azure-functions-core-tools)

## Configure Maven

To create a new Functions project with Maven, you first need to configure Maven to generate the project from a [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html). Update your Maven [settings](https://maven.apache.org/settings.html) (stored by default in `~\.m2\settings.xml`) to add the following entry:

```XML
<profile>
    <id>azure-functions-private-preview</id>
    <activation>
		<activeByDefault>true</activeByDefault>
    </activation>
    <repositories>
		<repository>
		    <id>archetype</id>
		    <url>https://www.myget.org/F/azure-function/maven/</url>
		    <releases>
		        <enabled>true</enabled>
		    </releases>
		    <snapshots>
		        <enabled>true</enabled>
		    </snapshots>
		</repository>
    </repositories>
</profile>
```

## Generate the Functions project

In an empty folder, run the following command to generate the project:

```bash
mvn archetype:generate \
    -DarchetypeGroupId=com.microsoft.azure \
	-DarchetypeArtifactId=azure-functions-archetype \
    -DarchetypeVersion=1.0-SNAPSHOT
```

![Screencap of console showing the inputs](media/functions-create-first-java-maven/archetype.png)

Maven will then prompt you for values needed to finish generating the project. For _groupId_, _artifactId_, and _version_ values, see the [Maven naming conventions](https://maven.apache.org/guides/mini/guide-naming-conventions.html) reference. The _appName_ value must be unique across Azure, so a name based on the _artifactId_ is provided as a default. The _packageName_ value will determine what Java package the generated code in the project uses.

Maven will generate the project files in a new folder under the current one named after the _appName_ value used when configuring the project. 

The generated function is a simple HTTP triggered function that echoes back the request body:

```java
public class Function {
    @FunctionName("hello")
    public String hello(@HttpTrigger(name = "req", methods = {"get", "post"}, authLevel = AuthorizationLevel.ANONYMOUS) String req,
                        ExecutionContext context) {
        return String.format("Hello, %s!", req);
    }
}
```

## Run the function on your computer

Use Maven to build and run the function your computer. Change directory to the Function project folder 

```bash
mvn clean package
mvn azure-functions:run
```

You'll see this output when the function is running:

```bash
Listening on http://localhost:7071/
Hit CTRL-C to exit...

Http Functions:

	hello: http://localhost:7071/api/hello

```

Trigger the function from the command line using curl to verify that it echoes the request body:

```bash
curl -d LocalFunctions http://localhost:7071/api/hello
```

```Output
Hello LocalFunctions!
```

## Deploy the function Azure

Deploy to Azure Functions using the Azure Functions deploy target configured in your project. You'll need to log in to the Azure CLI first.

```bash
az login
mvn azure-fuctions:deploy
```

The deploy step will create a new Functions app on Azure. When the deploy is complete, you'll see the a URL you can use to access your function running on Azure:

```output
[INFO] Successfully deployed Function App with package.
[INFO] Deleting deployment package from Azure Storage...
[INFO] Successfully deleted deployment package fabrikam-function-20170920120101928.20170920143621915.zip
[INFO] Successfully deployed Function App at https://fabrikam-function-20170920120101928.azurewebsites.net
[INFO] ------------------------------------------------------------------------
```

Test the function running on Azure using curl:

```bash
curl https://fabrikam-function-20170920120101928.azurewebsites.net/api/hello -d AzureFunctions
```

```Output
Hello AzureFunctions!
```

## Next steps

- [Debug your functions with Visual Studio Code](/azure/azure-functions/functions-run-local#create-a-function)
- [Java Functions developer guide](functions-reference-java.md)


