---
title: Create a Python function using Visual Studio Code - Azure Functions
description: Learn how to create a Python function, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.
ms.topic: quickstart
ms.date: 03/01/2024
ms.devlang: python
ms.custom: devx-track-python, mode-api, devdivchpfy22, vscode-azure-extension-update-complete, ai-video-demo
ai-usage: ai-assisted
---

# Quickstart: Create a function in Azure with Python using Visual Studio Code

In this article, you use Visual Studio Code to create a Python function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

This article uses the Python v2 programming model for Azure Functions, which provides a decorator-based approach for creating functions. To learn more about the Python v2 programming model, see the [Developer Reference Guide](functions-reference-python.md?pivots=python-mode-decorators)

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-python.md) of this article.

This video shows you how to create a Python function in Azure using Visual Studio Code.
> [!VIDEO a1e10f96-2940-489c-bc53-da2b915c8fc2]

The steps in the video are also described in the following sections.

## Configure your environment

Before you begin, make sure that you have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ A Python version that is [supported by Azure Functions](supported-languages.md#languages-by-runtime-version). For more information, see [How to install Python](https://wiki.python.org/moin/BeginnersGuide/Download).

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code.

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code, version 1.8.1 or later.

+ The [Azurite V3 extension](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite) local storage emulator. While you can also use an actual Azure storage account, this article assumes you're using the Azurite emulator.

[!INCLUDE [functions-install-core-tools-vs-code](../../includes/functions-install-core-tools-vs-code.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in Python. Later in this article, you publish your function code to Azure.

1. Choose the Azure icon in the Activity bar. Then in the **Workspace (local)** area, select the **+** button, choose **Create Function** in the dropdown. When prompted, choose **Create new project**.

    :::image type="content" source="./media/functions-create-first-function-vs-code/create-new-project.png" alt-text="Screenshot of create a new project window.":::

2. Choose the directory location for your project workspace and choose **Select**. You should either create a new folder or choose an empty folder for the project workspace. Don't choose a project folder that is already part of a workspace.
 
3. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select a language**| Choose `Python (Programming Model V2)`.|
    |**Select a Python interpreter to create a virtual environment**| Choose your preferred Python interpreter. If an option isn't shown, type in the full path to your Python binary.|
    |**Select a template for your project's first function** | Choose `HTTP trigger`. |
    |**Name of the function you want to create**| Enter `HttpExample`.|
    |**Authorization level**| Choose `ANONYMOUS`, which lets anyone call your function endpoint. For more information about the authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).|
    |**Select how you would like to open your project** | Choose `Open in current window`.|

4. Visual Studio Code uses the provided information and generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. The generated `function_app.py` project file contains your functions.   
<!--- Remove these last steps after the next Core Tools version is released (4.28.0)---> 
5. Open the local.settings.json project file and verify that the `AzureWebJobsFeatureFlags` setting has a value of `EnableWorkerIndexing`. This is required for Functions to interpret your project correctly as the Python v2 model when running locally.  

6. In the local.settings.json file, update the `AzureWebJobsStorage` setting as in the following example:

    ```json
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    ```

    This tells the local Functions host to use the storage emulator for the storage connection currently required by the Python v2 model. When you publish your project to Azure, you need to instead use the default storage account. If you're instead using an Azure Storage account, set your storage account connection string here.

## Start the emulator

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette. In the command palette, search for and select `Azurite: Start`.

1. Check the bottom bar and verify that Azurite emulation services are running. If so, you can now run your function locally.
::: zone-end

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After you verify that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../includes/functions-publish-project-vscode.md)]

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

You created and deployed a function app with a simple HTTP-triggered function. In the next articles, you expand that function by connecting to a storage service in Azure. To learn more about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md?tabs=python).

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB](functions-add-output-binding-cosmos-db-vs-code.md?pivots=programming-language-python)
> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-python)

[Having issues? Let us know.](https://aka.ms/python-functions-qs-survey)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
