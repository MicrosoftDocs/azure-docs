---
title: Create and deploy function code to Azure using Visual Studio Code
description: Learn how to create a function, then publish the local code project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.
ms.topic: quickstart
ms.date: 09/25/2025
ms.custom: 
  - mode-api
  - vscode-azure-extension-update-complete
  - devx-track-js
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
---

# Quickstart: Create and deploy function code to Azure using Visual Studio Code

Use Visual Studio Code to create a function that responds to HTTP requests from a template. Use GitHub Copilot to improve the generated function code, verify code updates locally, and then deploy it to the serverless Flex Consumption hosting plan in Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

Make sure to select your preferred development language at the top of the article.

## Prerequisites

[!INCLUDE [functions-requirements-visual-studio-code](../../includes/functions-requirements-visual-studio-code.md)]

[!INCLUDE [functions-install-core-tools-vs-code](../../includes/functions-install-core-tools-vs-code.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in your preferred language. Later in the article, you update, run, and then publish your function code to Azure.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette and search for and run the command `Azure Functions: Create New Project...`.

2. Choose the directory location for your project workspace and choose **Select**. You should either create a new folder or choose an empty folder for the project workspace. Don't choose a project folder that is already part of a workspace.

3. Provide the following information at the prompts:
    ::: zone pivot="programming-language-csharp"

    |Prompt|Selection|
    |--|--|
    |**Select a language**|Choose `C#`.|
    |**Select a .NET runtime**|Choose `.NET 8.0 LTS`.|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Provide a namespace** | Type `My.Functions`. |
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. For more information, see [Authorization level](functions-bindings-http-webhook-trigger.md#http-auth).|
    |**Select how you would like to open your project**|Choose `Open in current window`.|

    ::: zone-end
    ::: zone pivot="programming-language-java" 

    |Prompt|Selection|
    |--|--|
    |**Select a language**| Choose `Java`.|
    |**Select a version of Java**| Choose `Java 8`,  `Java 11`, `Java 17` or `Java 21`, the Java version on which your functions run in Azure. Choose a Java version that you've verified locally. |
    | **Provide a group ID** | Choose `com.function`. |
    | **Provide an artifact ID** | Choose `myFunction`. |
    | **Provide a version** | Choose `1.0-SNAPSHOT`. |
    | **Provide a package name** | Choose `com.function`. |
    | **Provide an app name** | Choose `myFunction-12345`. |
    |**Select a template for your project's first function**| Choose `HTTP trigger`.|
    | **Select the build tool for Java project** | Choose `Maven`. |
    |**Select how you would like to open your project**| Choose `Open in current window`.|

    ::: zone-end
    ::: zone pivot="programming-language-javascript" 

    |Prompt|Selection|
    |--|--|
    |**Select a language**|Choose `JavaScript`.|
    |**Select a JavaScript programming model**|Choose `Model V4`.|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. For more information, see [Authorization level](functions-bindings-http-webhook-trigger.md#http-auth).|
    |**Select how you would like to open your project**|Choose `Open in current window`.|

    ::: zone-end
    ::: zone pivot="programming-language-typescript" 

    |Prompt|Selection|
    |--|--|
    |**Select a language**|Choose `TypeScript`.|
    |**Select a JavaScript programming model**|Choose `Model V4`.|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. For more information, see [Authorization level](functions-bindings-http-webhook-trigger.md#http-auth).|
    |**Select how you would like to open your project**|Choose `Open in current window`.|

    ::: zone-end
    ::: zone pivot="programming-language-python" 

    |Prompt|Selection|
    |--|--|
    |**Select a language**| Choose `Python`.|
    |**Select a Python interpreter to create a virtual environment**| Choose your preferred Python interpreter. If an option isn't shown, type in the full path to your Python binary.|
    |**Select a template for your project's first function** | Choose `HTTP trigger`. |
    |**Name of the function you want to create**| Enter `HttpExample`.|
    |**Authorization level**| Choose `ANONYMOUS`, which lets anyone call your function endpoint. For more information, see [Authorization level](functions-bindings-http-webhook-trigger.md#http-auth).|
    |**Select how you would like to open your project** | Choose `Open in current window`.|

    ::: zone-end
    ::: zone pivot="programming-language-powershell" 

    |Prompt|Selection|
    |--|--|
    |**Select a language for your function project**|Choose `PowerShell`.|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. For more information, see [Authorization level](functions-bindings-http-webhook-trigger.md#http-auth).|
    |**Select how you would like to open your project**|Choose `Open in current window`.|

    ::: zone-end

    Using this information, Visual Studio Code generates a code project for Azure Functions with an HTTP trigger function endpoint. You can view the local project files in the Explorer. To learn more about files that are created, see [Generated project files](functions-develop-vs-code.md?tabs=javascript#generated-project-files).
 
::: zone pivot="programming-language-python"
4. In the local.settings.json file, update the `AzureWebJobsStorage` setting as in the following example:

    ```json
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    ```
    
    This tells the local Functions host to use the storage emulator for the storage connection required by the Python v2 model. When you publish your project to Azure, this setting uses the default storage account instead. If you're using an Azure Storage account during local development, set your storage account connection string here.   

## Start the emulator

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette. In the command palette, search for and select `Azurite: Start`.

1. Check the bottom bar and verify that Azurite emulation services are running. If so, you can now run your function locally.
::: zone-end  
[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After you verify that the function runs correctly on your local computer, you can optionally use AI tools, such as GitHub Copilot in Visual Studio Code, to update template-generated function code. 

## Use AI to normalize and validate input

This is an example prompt for Copilot Chat that updates the existing function code to retrieve parameters from either the query string or JSON body, apply formatting or type conversions, and return them as JSON in the response: 
::: zone pivot="programming-language-csharp"  
```copilot-prompt
Modify the function to accept name, email, and age from the JSON body of the
request. If any of these parameters are missing from the query string, read
them from the JSON body. Return all three parameters in the JSON response, 
applying these rules:
Title-case the name
Lowercase the email
Convert age to an integer if possible, otherwise return "not provided"
Use sensible defaults if any parameter is missing
Make sure that any added packages are compatible with the version of the packages already in the project
```
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
```copilot-prompt
Modify the function to accept name, email, and age from the JSON body of the
request. If any of these parameters are missing from the query string, read
them from the JSON body. Return all three parameters in the JSON response, 
applying these rules:
Title-case the name
Lowercase the email
Convert age to an integer if possible, otherwise return "not provided"
Use sensible defaults if any parameter is missing
```
::: zone-end  
::: zone pivot="programming-language-java"  
```copilot-prompt
Modify the function to accept name, email, and age from the JSON body of the
request. If any of these parameters are missing from the query string, read
them from the JSON body. Return all three parameters in the JSON response, 
applying these rules:
Title-case the name
Lowercase the email
Convert age to an integer if possible, otherwise return "not provided"
Use sensible defaults if any parameter is missing
Update the FunctionTest.java file to test the new logic. 
```
::: zone-end 

You can customize your prompt to add specifics as needed, then run the app again locally and verify that it works as expected after the code changes. This time, use a message body like:

```json
{ "name": "devon torres", "email": "torres.devon@contoso.com", "age": "34" }
```

> [!TIP]  
> GitHub Copilot is powered by AI, so surprises and mistakes are possible. Should you encounter any errors during execution, paste the error message in the chat window, select **Agent** mode, and ask Copilot to help resolve the error. For more information, see [Copilot FAQs](https://aka.ms/copilot-general-use-faqs).
>
> When running in **Agent** mode, the results of this customization depend on the specific tools available to your agent.
 
When you are satistfied with your app, you can use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

## Create the function app in Azure

[!INCLUDE [functions-create-azure-resources-vs-code](../../includes/functions-create-azure-resources-vs-code.md)]

## Deploy the project to Azure

[!INCLUDE [functions-deploy-project-vs-code](../../includes/functions-deploy-project-vs-code.md)]

## Run the function in Azure

1. Press <kbd>F1</kbd> to display the command palette, then search for and run the command `Azure Functions:Execute Function Now...`. If prompted, select your subscription.

2.  Select your new function app resource and `HttpExample` as your function.

3. In **Enter request body** type `{ "name": "Contoso", "email": "me@contoso.com", "age": "34" }`, then press Enter to send this request message to your function.

4. When the function executes in Azure, the response is displayed in the notification area. Expand the notification to review the full response.

## Troubleshooting

Use the following table to resolve the most common issues encountered when using this article.

|Problem|Solution|
|--|--|
|Can't create a local function project?|Make sure you have the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) installed.|
|Can't run the function locally?|Make sure you have the latest version of [Azure Functions Core Tools installed](functions-run-local.md?tabs=node) installed. <br/>When running on Windows, make sure that the default terminal shell for Visual Studio Code isn't set to WSL Bash.|
|Can't deploy function to Azure?|Review the Output for error information. The bell icon in the lower right corner is another way to view the output. Did you publish to an existing function app? That action overwrites the content of that app in Azure.|
|Couldn't run the cloud-based Function app?|Remember to use the query string to send in parameters.|

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code-extension.md)]

## Next steps
 
You have used [Visual Studio Code](functions-develop-vs-code.md) to create a function app with a simple HTTP-triggered function. In the next articles, you expand that function by connecting to either Azure Cosmos DB or Azure Storage. To learn more about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md). If you want to learn more about security, see [Securing Azure Functions](security-concepts.md).

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB](functions-add-output-binding-cosmos-db-vs-code.md)
> [!div class="nextstepaction"]
> [Connect to Azure Queue Storage](functions-add-output-binding-storage-queue-vs-code.md)

