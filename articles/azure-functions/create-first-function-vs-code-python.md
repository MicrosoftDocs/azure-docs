---
title: Create a Python function using Visual Studio Code - Azure Functions
description: Learn how to create a Python function, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.
ms.topic: quickstart
ms.date: 11/04/2020
ms.devlang: python
ms.custom: devx-track-python, mode-api
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./create-first-function-vs-code-python-uiex
---

# Quickstart: Create a function in Azure with Python using Visual Studio Code

[!INCLUDE [functions-language-selector-quickstart-vs-code](../../includes/functions-language-selector-quickstart-vs-code.md)]

In this article, you use Visual Studio Code to create a Python function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-python.md) of this article.

## Configure your environment

Before you get started, make sure you have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 3.x.

+ [Python versions that are supported by Azure Functions](supported-languages.md#languages-by-runtime-version). For more information, see [How to install Python](https://wiki.python.org/moin/BeginnersGuide/Download).

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code.

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in Python. Later in this article, you'll publish your function code to Azure.

1. Choose the Azure icon in the Activity bar, then in the **Workspace** area, select the **+** button, choose **Create Function** in the dropdown. Then select **Create new project** from the dialog.

    ![Choose Create a new project](./media/functions-create-first-function-vs-code/create-new-project.png)

1. Choose a directory location for your project workspace and choose **Select**. It is recommended that you create a new folder or choose an empty folder as the project workspace.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Provide the following information at the prompts:

    + **Select a language**: Choose `Python`.

    + **Select a Python interpreter to create a virtual environment**: Choose your preferred Python interpreter.
    If an option isn't shown, type in the full path to your Python binary.

    + **Select a template for your project's first function**: Choose `HTTP trigger`.

    + **Provide a function name**: Type `HttpExample`.

    + **Authorization level**: Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).

    + **Select how you would like to open your project**: Choose `Add to workspace`.

1. Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. To learn more about files that are created, see [Generated project files](functions-develop-vs-code.md#generated-project-files).

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

## Create the project in Azure

In this section, you create a function app and related resources in your Azure subscription.

1. Choose the Azure icon in the Activity bar, then in the **Resources** area, select the **+** icon and choose the **Create Function App in Azure** option.

    ![Create a resource in Azure subscription](../../includes/media/functions-publish-project-vscode/function-app-create-resource.png)

2. Provide the following information at the prompts:

    + **Select folder**: Choose a folder from your workspace or browse to one that contains your function app.
    You won't see this if you already have a valid function app opened.

    + **Select subscription**: Choose the subscription to use.
    You won't see this if you only have one subscription.

    + **Enter a globally unique name for the function app**: Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions.

    + **Select a runtime stack**: Choose the version of Python you've been running on locally. You can use the `python3 --version` command to check your version.

    + **Select a location for new resources**:  For better performance, choose a [region](https://azure.microsoft.com/regions/) near you.

    The extension shows the status of individual resources as they are being created in Azure in the **Azure: Activity Log** panel.

    ![Log of Azure resource creation](../../includes/media/functions-publish-project-vscode/resource-activity-log.png)

3. When completed, the following Azure resources are created in your subscription, using names based on your function app name:

    [!INCLUDE [functions-vs-code-created-resources](../../includes/functions-vs-code-created-resources.md)]

    A notification is displayed after your function app is created and the deployment package is applied.

    [!INCLUDE [functions-vs-code-create-tip](../../includes/functions-vs-code-create-tip.md)]

## Deploying the function to Azure

> [!IMPORTANT]
> Deploying to an existing function app overwrites the content of that app in Azure.

1. Choose the Azure icon in the Activity bar, then in the **Resources** area, find the function app you just created.

2. Right click the function app and select "Deploy to Function App...". Watch the notification for deployment progress.

3. Once the notification says deployment is completed, select **View Output** to view the creation and deployment results, including the Azure resources that you created. If you miss the notification, select the bell icon in the lower right corner to see it again.

    ![Create complete notification](./media/functions-create-first-function-vs-code/function-create-notifications.png)

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

You have used [Visual Studio Code](functions-develop-vs-code.md?tabs=python) to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by connecting to Azure Storage. To learn more about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md?tabs=python).

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-python)

[Having issues? Let us know.](https://aka.ms/python-functions-qs-survey)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
