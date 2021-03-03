---
title:  Create a Python function using Visual Studio Code - Azure Functions
description: Learn how to create a Python function, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.  
ms.topic: quickstart
ms.date: 11/04/2020
ms.custom: devx-track-python
ROBOTS: NOINDEX,NOFOLLOW
---

# Quickstart: Create a function in Azure with Python using Visual Studio Code

> [!div class="op_single_selector" title1="Select your function language: "]
> - [Python](create-first-function-vs-code-python.md)
> - [C#](create-first-function-vs-code-csharp.md)
> - [Java](create-first-function-vs-code-java.md)
> - [JavaScript](create-first-function-vs-code-node.md)
> - [PowerShell](create-first-function-vs-code-powershell.md)
> - [TypeScript](create-first-function-vs-code-typescript.md)
> - [Other (Go/Rust)](create-first-function-vs-code-other.md)

In this article, you use Visual Studio Code to create a Python function that responds to HTTP requests. After testing the code locally, you deploy it to the <abbr title="A runtime computing environment in which all the details of the server are transparent to application developers, which simplifies the process of deploying and managing code.">serverless</abbr> environment of <abbr title="An Azure service that provides a low-cost serverless computing environment for applications.">Azure Functions</abbr>.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-python.md) of this article.

## 1. Prepare your environment

Before you get started, make sure you have the following requirements in place:

+ An Azure <abbr title="The profile that maintains billing information for Azure usage.">account</abbr> with an active <abbr title="The basic organizational structure in which you manage resources in Azure, typically associated with an individual or department within an organization.">subscription</abbr>. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 3.x.

+ [Python 3.8](https://www.python.org/downloads/release/python-381/), [Python 3.7](https://www.python.org/downloads/release/python-375/), [Python 3.6](https://www.python.org/downloads/release/python-368/) are supported by Azure Functions (x64).

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code.  

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

<hr/>
<br/>

## 2. <a name="create-an-azure-functions-project"></a>Create your local project

1. Choose the Azure icon in the <abbr title="The vertical group of icons on the left side of the Visual Studio Code window.">Activity bar</abbr>, then in the **Azure: Functions** area, select the **Create new project...** icon.

    ![Choose Create a new project](./media/functions-create-first-function-vs-code/create-new-project.png)

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Provide the following information at the prompts:

    + **Select a language for your function project**: Choose `Python`.

    + **Select a Python alias to create a virtual environment**: Choose the location of your Python interpreter. If the location isn't shown, type in the full path to your Python binary.  

    + **Select a template for your project's first function**: Choose `HTTP trigger`.

    + **Provide a function name**: Type `HttpExample`.

    + **Authorization level**: Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization levels, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).

    + **Select how you would like to open your project**: Choose `Add to workspace`.

<br/>
<details>
<summary><strong>Can't create a function project?</strong></summary>

The most common issues to resolve when creating a local Functions project are:
* You do not have the Azure Functions extension installed. 
</details>

<hr/>
<br/>

## Run the function locally

1. Press <kbd>F5</kbd> to start the function app project.

1. In the **Terminal** panel, see the URL endpoint of your function running locally.

    ![Local function VS Code output](../../includes/media/functions-run-function-test-local-vs-code/functions-vscode-f5.png)


1. With Core Tools running, go to the **Azure: Functions** area. Under **Functions**, expand **Local Project** > **Functions**. Right-click (Windows) or <kbd>Ctrl -</kbd> click (macOS) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="../../includes/media/functions-run-function-test-local-vs-code/execute-function-now.png" alt-text="Execute function now from Visual Studio Code":::

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press Enter to send this request message to your function.  

1. When the function executes locally and returns a response, a notification is raised in Visual Studio Code. Information about the function execution is shown in **Terminal** panel.

1. Press <kbd>Ctrl + C</kbd> to stop Core Tools and disconnect the debugger.

<br/>
<details>
<summary><strong>Can't run the function locally?</strong></summary>

The most common issues to resolve when running a local Functions project are:
* You do not have the Core Tools installed. 
*  If you have trouble running on Windows, make sure that the default terminal shell for Visual Studio Code isn't set to **WSL Bash**. 
</details>

<hr/>
<br/>

## 4. Sign in to Azure

To publish your app, sign in to Azure. If you're already signed in, go to the next section.

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose **Sign in to Azure...**.

    ![Sign in to Azure within VS Code](../../includes/media/functions-sign-in-vs-code/functions-sign-into-azure.png)

1. When prompted in the browser, **choose your Azure account** and **sign in** using your Azure account credentials.

1. After you've successfully signed in, close the new browser window and go back to Visual Studio Code. 

<hr/>
<br/>

## 5. Publish the project to Azure

Your first deployment of your code includes creating a Function resource in your Azure subscription.

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app...** button.

    ![Publish your project to Azure](../../includes/media/functions-publish-project-vscode/function-app-publish-project.png)

1. Provide the following information at the prompts:

    + **Select folder**: Choose the folder that contains your function app.

    + **Select subscription**: Choose the subscription to use. You won't see this if you only have one subscription.

    + **Select Function App in Azure**: Choose `+ Create new Function App`.

    + **Enter a globally unique name for the function app**: Type a name that is valid in a URL path. The name you type is validated to make sure that it's <abbr title="The name must be unique across all Azure customers globally. For example, you can use a combination of your personal or organization name, application name, and a numeric identifier, as in contoso-bizapp-func-20.">unique across Azure</abbr>. 

    + **Select a runtime**: Choose the version of Python you've been running on locally. You can use the `python --version` command to check your version.

    + **Select a location for new resources**: For better performance, choose a [region](https://azure.microsoft.com/regions/) near you.

    The extension shows the status of individual resources as they are being created in Azure in the notification area.

    :::image type="content" source="../../includes/media/functions-publish-project-vscode/resource-notification.png" alt-text="Notification of Azure resource creation":::

1. A notification is displayed after your function app is created and the deployment package is applied. Select **View Output** to view the creation and deployment results. 

    ![Create complete notification](./media/functions-create-first-function-vs-code/function-create-notifications.png)

<br/>
<details>
<summary><strong>Can't publish the function?</strong></summary>

This section created the Azure resources and deployed your local code to the Function app. If that didn't succeed:

* Review the Output for error information. The bell icon in the lower right corner is another way to view the output. 
* Did you publish to an existing function app? That action overwrites the content of that app in Azure.
</details>


<br/>
<details>
<summary><strong>What resources were created?</strong></summary>

When completed, the following Azure resources are created in your subscription, using names based on your function app name: 
* **Resource group**: A resource group is a logical container for related resources in the same region.
* **Azure Storage account**: A Storage resource maintains state and other information about your project.
* **Consumption plan**: A consumption plan defines the underlying host for your serverless function app.
* **Function app**: A function app provides the environment for executing your function code and group functions as a logical unit.
* **Application Insights**: Application Insights tracks usage of your serverless function.

</details>

<hr/>
<br/>

## 6. Run the function in Azure

1. Back in the **Azure: Functions** side bar, expand the new function app.
1. Expand **Functions**, then right-click (Windows) or <kbd>Ctrl -</kbd> click (macOS) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="../../includes/media/functions-vs-code-run-remote/execute-function-now.png" alt-text="Execute function now in Azure from Visual Studio Code":::

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`.

    Press Enter to send this request message to your function.  

1. When the function executes in Azure and returns a response, a notification is raised in Visual Studio Code.

## 7. Clean up resources

When you continue to the [next step](#next-steps) and add an <abbr title="A means to associate a function with a storage queue, so that it can create messages on the queue.">Azure Storage queue output binding</abbr> to your function, you'll need to keep all your resources in place to build on what you've already done.

Otherwise, you can use the following steps to delete the function app and its related resources to avoid incurring any further costs.

[!INCLUDE [functions-cleanup-resources-vs-code-inner.md](../../includes/functions-cleanup-resources-vs-code-inner.md)]

To learn more about Functions costs, see [Estimating Consumption plan costs](functions-consumption-costs.md).

## Next steps

Expand that function by adding an output <abbr title="A declarative connection between a function and other resources. An input binding provides data to the function; an output binding provides data from the function to other resources.">binding</abbr>. This binding writes the string from the HTTP request to a message in an Azure Queue Storage queue. 

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-python)

[Having issues? Let us know.](https://aka.ms/python-functions-qs-survey)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
