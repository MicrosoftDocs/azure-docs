---
title: Create a C# function using Visual Studio Code - Azure Functions
description: Learn how to create a C# function, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code. 
ms.topic: quickstart
ms.date: 11/03/2020
ms.custom: devx-track-csharp
ROBOTS: NOINDEX,NOFOLLOW
---

# Quickstart: Create a C# function in Azure using Visual Studio Code

> [!div class="op_single_selector" title1="Select your function language: "]
> - [C#](create-first-function-vs-code-csharp.md)
> - [Java](create-first-function-vs-code-java.md)
> - [JavaScript](create-first-function-vs-code-node.md)
> - [PowerShell](create-first-function-vs-code-powershell.md)
> - [Python](create-first-function-vs-code-python.md)
> - [TypeScript](create-first-function-vs-code-typescript.md)
> - [Other (Go/Rust)](create-first-function-vs-code-other.md)

In this article, you use Visual Studio Code to create a C# class library-based function that responds to HTTP requests. After testing the code locally, you deploy it to the <abbr title="A runtime computing environment in which all the details of the server are transparent to application developers, simplifying the process of deploying and managing code.">serverless</abbr> environment of <abbr title="Azure's service that provides a low-cost serverless computing environment for applications.">Azure Functions</abbr>.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-csharp.md) of this article.
    
## 1. Configure your environment

Before you get started, make sure you have the following requirements in place:

+ An Azure <abbr title="The profile that maintains billing information for Azure usage.">account</abbr> with an active <abbr title="The basic organizational structure in which you manage resources in Azure, typically associated with an individual or department within an organization.">subscription</abbr>. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 3.x.

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.  

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

## <a name="create-an-azure-functions-project"></a>2. Create your local project

In this section, you use Visual Studio Code to create a local <abbr title="A logical container for one or more individual functions that can be deployed and managed together.">Azure Functions project</abbr> in C#. Later in this article, you'll publish your function code to Azure.

1. Choose the Azure icon in the <abbr title="The vertical group of icons on the left side of the Visual Studio Code window.">Activity bar</abbr>, then in the **Azure: Functions** area, select the **Create new project...** icon.

    ![Choose Create a new project](./media/functions-create-first-function-vs-code/create-new-project.png)

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Provide the following information at the prompts:

    + **Select a language for your function project**: Choose `C#`.

    + **Select a template for your project's first function**: Choose `HTTP trigger`.

    + **Provide a function name**: Type `HttpExample`.

    + **Provide a namespace**: Type `My.Functions`.

    + **Authorization level**: Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization levels, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).

    + **Select how you would like to open your project**: Choose `Add to workspace`.

1. Using this information, Visual Studio Code generates an Azure Functions project with an HTTP <abbr title="The type of event that invokes the function’s code, such as an HTTP request, a queue message, or a specific time.">trigger</abbr>. You can view the local project files in the Explorer. To learn more about files that are created, see [Generated project files](functions-develop-vs-code.md#generated-project-files).

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

## 5. Publish the project to Azure

In this section, you create a function app and related resources in your Azure subscription and then deploy your code. 

> [!IMPORTANT]
> Publishing to an existing function app overwrites the content of that app in Azure. 

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app...** button.

    

1. Provide the following information at the prompts:

    + **Select folder**: Choose a folder from your workspace or browse to one that contains your function app. You won't see this if you already have a valid function app opened.

    + **Select subscription**: Choose the subscription to use. You won't see this if you only have one subscription.

    + **Select Function App in Azure**: Choose `+ Create new Function App`. (Don't choose the `Advanced` option, which isn't covered in this article.)

    + **Enter a globally unique name for the function app**: Type a name that is valid in a URL path. The name you type is validated to make sure that it's <abbr title="The name must be unique across all Functions projects used by all Azure customers globally. Typically, you use a combination of your personal or company name, application name, and a numeric identifier, as in contoso-bizapp-func-20">unique in Azure Functions</abbr>. 

    + **Select a location for new resources**:  For better performance, choose a [region](https://azure.microsoft.com/regions/) near you.

    The extension shows the status of individual resources as they are being created in Azure in the notification area.

    :::image type="content" source="../../includes/media/functions-publish-project-vscode/resource-notification.png" alt-text="Notification of Azure resource creation":::

1. When completed, the following Azure resources are created in your subscription, using names based on your function app name:

    + A **resource group**, which is a logical container for related resources.
    + A standard **Azure Storage account**, which maintains state and other information about your projects.
    + A **consumption plan**, which defines the underlying host for your serverless function app. 
    + A **function app**, which provides the environment for executing your function code. A function app lets you group functions as a logical unit for easier management, deployment, and sharing of resources within the same hosting plan.
    + An **Application Insights instance** connected to the function app, which tracks usage of your serverless function.

    A notification is displayed after your function app is created and the deployment package is applied. 

    > [!TIP]
    > By default, the Azure resources required by your function app are created based on the function app name you provide. By default, they are also created in the same new resource group with the function app. If you want to either customize the names of these resources or reuse existing resources, you need to instead [publish the project with advanced create options](functions-develop-vs-code.md#enable-publishing-with-advanced-create-options).


1. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created. If you miss the notification, select the bell icon in the lower right corner to see it again.

    ![Create complete notification](./media/functions-create-first-function-vs-code/function-create-notifications.png)

## 6. Run the function in Azure

1. Back in the **Azure: Functions** area in the side bar, expand your subscription, your new function app, and **Functions**. Right-click (Windows) or <kbd>Ctrl -</kbd> click (macOS) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="../../includes/media/functions-vs-code-run-remote/execute-function-now.png" alt-text="Execute function now in Azure from Visual Studio Code":::

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`.

    Press Enter to send this request message to your function.  

1. When the function executes in Azure and returns a response, a notification is raised in Visual Studio Code.

## 5. Clean up resources

When you continue to the [next step](#next-steps) and add an <abbr title="A means to associate a function with a storage queue, so that it can create messages on the queue.">Azure Storage queue output binding</abbr> to your function, you'll need to keep all your resources in place to build on what you've already done.

Otherwise, you can use the following steps to delete the function app and its related resources to avoid incurring any further costs.

[!INCLUDE [functions-cleanup-resources-vs-code-inner.md](../../includes/functions-cleanup-resources-vs-code-inner.md)]

To learn more about Functions costs, see [Estimating Consumption plan costs](functions-consumption-costs.md).

## Next steps

You have used Visual Studio Code to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by adding an output <abbr title="A declarative connection between a function and other resources. An input binding provides data to the function; an output binding provides data from the function to other resources.">binding</abbr>. This binding writes the string from the HTTP request to a message in an Azure Queue Storage queue. 

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-csharp)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
