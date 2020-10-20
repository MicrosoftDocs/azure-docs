---
title: Create a function in Azure with Java using VS Code
description: Create and publish to Azure a simple HTTP triggered function by using Azure Functions extension in Visual Studio Code using Java. 
ms.topic: quickstart
ms.date: 10/14/2020
---

# Quickstart: Create a function in Azure with Java using Visual Studio Code

[!INCLUDE [functions-language-selector-quickstart-vs-code](../../includes/functions-language-selector-quickstart-vs-code.md)]

In this article, you use Visual Studio Code to create a Java function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> If Visual Studio Code isn't your preferred development tool, check out our similar tutorials for Java developers using [Maven](create-first-function-cli-java.md), [Gradle](./functions-create-first-java-gradle.md) and [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/quickstart-functions).

## Configure your environment

Before you get started, make sure you have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Java Developer Kit](/azure/developer/java/fundamentals/java-jdk-long-term-support), version 8.

+ [Apache Maven](https://maven.apache.org), version 3.0 or above.

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Java extension pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)  

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. 

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in your chosen language. Later in this article, you'll publish your function code to Azure. 

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, select the **Create new project...** icon.

    ![Choose Create a new project](./media/functions-create-first-function-vs-code/create-new-project.png)

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Provide the following information at the prompts:

    + **Select a language for your function project**: Choose `Java`.

    + **Provide a group ID**: Choose `com.function`.

    + **Provide an artifact ID**: Choose `myFunction`.

    + **Provide a version**: Choose `1.0-SNAPSHOT`.

    + **Provide a package name**: Choose `com.function`.

    + **Provide an app name**: Choose `myFunction-12345`.

    + **Authorization level**: Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).

    + **Select how you would like to open your project**: Choose `Add to workspace`.

1. Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. To learn more about files that are created, see [Generated project files](functions-develop-vs-code.md#generated-project-files). 

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../includes/functions-publish-project-vscode.md)]

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

[!INCLUDE [functions-next-steps-vs-code](../../includes/functions-next-steps-vs-code.md)]

[connect-storage-queue]: functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-java
[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
