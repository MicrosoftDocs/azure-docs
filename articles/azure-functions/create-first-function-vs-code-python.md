---
title: Create a Python function using Visual Studio Code - Azure Functions
description: Learn how to create a Python function, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.
ms.topic: quickstart
ms.date: 05/19/2022
ms.devlang: python
ms.custom: devx-track-python, mode-api, devdivchpfy22
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./create-first-function-vs-code-python-uiex
---

# Quickstart: Create a function in Azure with Python using Visual Studio Code

[!INCLUDE [functions-language-selector-quickstart-vs-code](../../includes/functions-language-selector-quickstart-vs-code.md)]

In this article, you'll use Visual Studio Code to create a Python function that responds to HTTP requests. After testing the code locally, you'll deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-python.md) of this article.

## Configure your environment

Before you begin, ensure that you have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 3.x.

+ [Python versions [supported by Azure Functions](supported-languages.md#languages-by-runtime-version). For more information, see [How to install Python](https://wiki.python.org/moin/BeginnersGuide/Download).

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code.  

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you'll use Visual Studio Code to create a local Azure Functions project in Python. Later in this article, you'll publish your function code to Azure.

1. Select the Azure icon in the Activity bar, then in the **Azure: Functions** area, select the **Create new project...** icon.

    :::image type="content" source="./media/functions-create-first-function-vs-code/create-new-project.png" alt-text="Screenshot of create a new project window.":::

1. Select the directory location for your project workspace and select **Select**. We recommend that you create a new folder or choose an empty folder as the project workspace.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, don't select a project folder that is part of a workspace.

1. Provide the following information at the prompts:

    + **Select a language for your function project**: Select `Python`.

    + **Select a Python alias to create a virtual environment**: Select the location of your Python interpreter.  
    If the location isn't shown, enter the full path to your Python binary.  

    + **Select a template for your project's first function**: Select `HTTP trigger`.

    + **Provide a function name**: Enter `HttpExample`.

    + **Authorization level**: Select `Anonymous`, which lets anyone call your function endpoint. For more information about the authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).

    + **Select how you would like to open your project**: Select `Add to workspace`.

1. Visual Studio Code uses the provided information and generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. For more information about the files that are created, see [Generated project files](functions-develop-vs-code.md#generated-project-files).

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After checking that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

## Publish the project to Azure

In this section, you'll create a function app and related resources in your Azure subscription and then deploy your code.

> [!IMPORTANT]
> Publishing to an existing function app overwrites the content of that app in Azure.

1. Select the Azure icon in the Activity bar, then in the **Azure: Functions** area, select the **Deploy to function app...** button.

    :::image type="content" source="../../includes/media/functions-publish-project-vscode/function-app-publish-project.png" alt-text="Screenshot of publish your project to Azure window.":::

1. Provide the following information at the prompts:

    + **Select folder**: Select a folder from your workspace or browse to the one that has your function app.
    You won't see this option if you already have a valid function app opened.

    + **Select subscription**: Select the subscription to use.  
    You won't see the subscription list if you only have one subscription.

    + **Select Function App in Azure**: Select `Create new Function App`.  
    (Don't select the `Advanced` option, which isn't covered in this article.)

    + **Enter a globally unique name for the function app**: Enter a name that is valid in a URL path. The name you enter is validated to ensure that it's unique in Azure Functions.

    + **Select a runtime**: Select the version of Python you've been running locally. You can use the `python --version` command to check your version.

    + **Select a location for new resources**: For better performance, select a [region](https://azure.microsoft.com/regions/) near you.

    The extension shows the status of individual resources under creation in Azure in the notification area.

    :::image type="content" source="../../includes/media/functions-publish-project-vscode/resource-notification.png" alt-text="Screenshot of Azure resource creation notification.":::

1. When completed, the following Azure resources are created in your subscription. The resources are named based on your function app name:

    [!INCLUDE [functions-vs-code-created-resources](../../includes/functions-vs-code-created-resources.md)]

    A notification is displayed after your function app is created and the deployment package is applied.

    [!INCLUDE [functions-vs-code-create-tip](../../includes/functions-vs-code-create-tip.md)]

1. Select **View Output** in the notification to view the creation and deployment results, including the Azure resources you created. If you miss the notification, select the bell icon in the lower-right corner to see it again.

    :::image type="content" source="./media/functions-create-first-function-vs-code/function-create-notifications.png" alt-text="Screenshot of the View Output window.":::

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

You have used [Visual Studio Code](functions-develop-vs-code.md?tabs=python) to create a function app with a simple HTTP-triggered function. In the next article, you'll expand that function by connecting to Azure Storage. For more information about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md?tabs=python).

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-python)

[Having issues? Let us know.](https://aka.ms/python-functions-qs-survey)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
