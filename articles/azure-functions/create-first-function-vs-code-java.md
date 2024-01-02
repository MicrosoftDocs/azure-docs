---
title: Create a Java function using Visual Studio Code - Azure Functions
description: Learn how to create a Java function, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.
ms.topic: quickstart
ms.date: 08/03/2023
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./create-first-function-vs-code-java-uiex
ms.devlang: java
ms.custom: mode-api, vscode-azure-extension-update-complete, devx-track-extended-java
---

# Quickstart: Create a Java function in Azure using Visual Studio Code

[!INCLUDE [functions-language-selector-quickstart-vs-code](../../includes/functions-language-selector-quickstart-vs-code.md)]

In this article, you use Visual Studio Code to create a Java function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

If Visual Studio Code isn't your preferred development tool, check out our similar tutorials for Java developers:
+ [Gradle](./functions-create-first-java-gradle.md)
+ [IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/quickstart-functions)
+ [Maven](create-first-function-cli-java.md)

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Configure your environment

Before you get started, make sure you have the following requirements in place:

[!INCLUDE [functions-requirements-visual-studio-code-java](../../includes/functions-requirements-visual-studio-code-java.md)]

[!INCLUDE [functions-install-core-tools-vs-code](../../includes/functions-install-core-tools-vs-code.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in Java. Later in this article, you'll publish your function code to Azure. 

1. Choose the Azure icon in the Activity bar. Then in the **Workspace (local)** area, select the **+** button, choose **Create Function** in the dropdown. When prompted, choose **Create new project**.

    :::image type="content" source="./media/functions-create-first-function-vs-code/create-new-project.png" alt-text="Screenshot of create a new project window.":::

1. Choose the directory location for your project workspace and choose **Select**. You should either create a new folder or choose an empty folder for the project workspace. Don't choose a project folder that is already part of a workspace.

1. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select a language**| Choose `Java`.|
    |**Select a version of Java**| Choose `Java 11` or `Java 8`, the Java version on which your functions run in Azure. Choose a Java version that you've verified locally. |
    | **Provide a group ID** | Choose `com.function`. |
    | **Provide an artifact ID** | Choose `myFunction`. |
    | **Provide a version** | Choose `1.0-SNAPSHOT`. |
    | **Provide a package name** | Choose `com.function`. |
    | **Provide an app name** | Choose `myFunction-12345`. |
    |**Select a template for your project's first function**| Choose `HTTP trigger`.|
    | **Select the build tool for Java project** | Choose `Maven`. |
    |**Provide a function name**| Enter `HttpExample`.|
    |**Authorization level**| Choose `Anonymous`, which lets anyone call your function endpoint. For more information about the authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).|
    |**Select how you would like to open your project**| Choose `Open in current window`.|

1. Visual Studio Code uses the provided information and generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. For more information about the files that are created, see [Generated project files](functions-develop-vs-code.md?tabs=java#generated-project-files).

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../includes/functions-publish-project-vscode.md)]

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

You have used [Visual Studio Code](functions-develop-vs-code.md?tabs=java) to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by connecting to Azure Storage. To learn more about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md?tabs=java). 

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-java)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
