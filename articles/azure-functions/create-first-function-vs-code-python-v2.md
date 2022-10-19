---
title: Create a Python function with the V2 programming model using Visual Studio Code - Azure Functions
description: Learn how to create a Python function using the V2 programming model, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.
ms.topic: quickstart
ms.date: 09/02/2022
ms.devlang: python
ms.custom: devx-track-python, mode-api, devdivchpfy22, vscode-azure-extension-update-complete
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./create-first-function-vs-code-python-uiex
---

# Quickstart: Create a function in Azure with the Python V2 Programming Model using Visual Studio Code

In this article, you use Visual Studio Code to create a Python function with the V2 programming model that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-python.md) of this article.

In this example, you use the V2 programming model which is currently in Preview. To learn more about the V2 programming model, the [Developer Reference Guide](functions-reference-python).

## Configure your environment

Before you begin, make sure that you have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 4.0.4785 or above.

+ Python versions that are [supported by Azure Functions](supported-languages.md#languages-by-runtime-version). For more information, see [How to install Python](https://wiki.python.org/moin/BeginnersGuide/Download).

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code.

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) version 1.8.1 or later for Visual Studio Code.

+ An existing storage account OR a storage emulator such as [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite?tabs=visual-studio)

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in Python using the V2 programming model. Later in this article, you'll publish your function code to Azure.

1. Choose the Azure icon in the Activity bar. Then in the **Workspace (local)** area, select the **+** button, choose **Create Function** in the dropdown. When prompted, choose **Create new project**.

    :::image type="content" source="./media/functions-create-first-function-vs-code/create-new-project.png" alt-text="Screenshot of create a new project window.":::

1. Choose the directory location for your project workspace and choose **Select**. You should either create a new folder or choose an empty folder for the project workspace. Don't choose a project folder that is already part of a workspace.

1. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select a language**| Choose `Python (Programming Model V2)`.|
    |**Select a Python interpreter to create a virtual environment**| Choose your preferred Python interpreter. If an option isn't shown, type in the full path to your Python binary.|
    |**Select how you would like to open your project**| Choose `Add to workspace`.|

1. Visual Studio Code uses the provided information and generates an Azure Functions project. You can view the local project files in the Explorer. For more information about the files that are created, see [Generated project files](functions-develop-vs-code.md?tabs=python#generated-project-files). Note that at this point, you have created a function project, no functions. 

## Create a function

Note that by default, the file `function_app.py` will contain the functions. To get started with an HTTP triggered function, you can uncomment the code in the file, as follows.

```python
@app.function_name(name="HttpTrigger1")
@app.route(route="hello")
def test_function(req: func.HttpRequest) -> func.HttpResponse:
     logging.info('Python HTTP trigger function processed a request.')

     name = req.params.get('name')
     if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

     if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
     else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
```

Next, enable one of the following storage options:

    + Use a storage emulator such as [Azurerite](../storage/common/storage-use-azurite.md). This is a good option if you only have HTTP triggered functions and aren't planning to use storage in your functions.

    + Create or use an existing Azure Storage account. This is a good option when you're planning to use storage-based functions and when you already have an existing storage account. To create a storage account, see [Create a storage account](../storage/common/storage-account-create.md).


### Add an additional function (Optional)

To add another function, open the Command Palette by navigating to View > Command Palette, or by pressing Ctrl-Shift-P (Windows) or Command-Shift-P (macOS).

Once opening the Command Palette, select the function trigger you'd like to use and fill in the requested details. 

![VS Code Template Options](.media/create-first-function-vs-code-python-v2/vscode_template_options)

* Select "Preview Template" to learn more about the trigger and see sample code previewed in VS Code.
* Select "Append to 'function_app.py'" if you are ready to use the template to create the function
* Select "Append to selected file..." if you are interested in using [blueprints](functions-reference-python#blueprints)

For this tutorial, we recommend uncommenting the code in the initial 'function_app.py' file to ensure simplicty.

## Run the function locally

Visual Studio Code integrates with [Azure Functions Core tools](../articles/azure-functions/functions-run-local.md) to let you run this project on your local development computer before you publish to Azure.

1. To start the function locally, press <kbd>F5</kbd> or the play icon. The **Terminal** panel displays the Output from Core Tools. Your app starts in the **Terminal** panel. You can see the URL endpoint of your HTTP-triggered function running locally.

    :::image type="content" source="./media/functions-run-function-test-local-vs-code/functions-vscode-f5.png" alt-text="Screenshot of the Local function VS Code output.":::

    If you have trouble running on Windows, make sure that the default terminal for Visual Studio Code isn't set to **WSL Bash**.

1. With Core Tools still running in **Terminal**, choose the Azure icon in the activity bar. In the **Workspace** area, expand **Local Project** > **Functions**. Right-click (Windows) or <kbd>Ctrl -</kbd> click (macOS) the `HttpExample` function and choose **Execute Function Now...**.

    ![Execute function now from Visual Studio Code](./media/functions-run-function-test-local-vs-code/execute-function-now.png)

2. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press Enter to send this request message to your function.

3. When the function executes locally and returns a response, a notification is raised in Visual Studio Code. Information about the function execution is shown in **Terminal** panel.

4. With the **Terminal** panel focused, press <kbd>Ctrl + C</kbd> to stop Core Tools and disconnect the debugger.


After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

Note that local settings are not imported from VS Code to Azure by default. For the V2 model to work, the flag AzureWebJobsFeatureFlags" should be explicitly set to "EnableWorkerIndexing".

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../includes/functions-publish-project-vscode.md)]

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

You have used [Visual Studio Code](functions-develop-vs-code.md?tabs=python) to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by connecting to Azure Storage. To learn more about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md?tabs=python).

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-python)

[Having issues? Let us know.](https://aka.ms/python-functions-qs-survey)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions