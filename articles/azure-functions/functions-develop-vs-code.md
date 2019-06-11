---
title: Develop Azure Functions using Visual Studio Code | Microsoft Docs
description: Learn how to develop and test Azure Functions by using Azure Functions extension for Visual Studio Code.
services: functions
author: ggailey777  
manager: jeconnoc

ms.service: azure-functions
ms.topic: conceptual
ms.date: 04/11/2019
ms.author: glenga
---

# Develop Azure Functions using Visual Studio Code

The [Azure Functions extension for Visual Studio Code] lets you locally develop, test, and deploy functions to Azure. If this experience is your first with Azure Functions, you can learn more at [An introduction to Azure Functions](functions-overview.md).

The Azure Functions extension provides the following benefits: 

* Edit, build, and run functions on your local development computer. 
* Publish your Azure Functions project directly to Azure. 
* Write your functions in a variety of languages while having all of the benefits of Visual Studio Code. 

The extension supports the following languages supported by the Azure Functions version 2.x runtime: 

* [C# compiled](functions-dotnet-class-library.md) 
* [C# script](functions-reference-csharp.md)<sup>*</sup>
* [JavaScript](functions-reference-node.md)
* [Java](functions-reference-java.md)
* [PowerShell](functions-reference-powershell.md)
* [Python](functions-reference-python.md)

In this article, examples are currently only available for JavaScript (Node.js) and C# class library functions.  

This article provides details about how to use the Azure Functions extension to develop functions and publish them to Azure. Before you read this article, you should [Create your first function using Visual Studio Code](functions-create-first-function-vs-code.md).

> [!IMPORTANT]
> Don't mix local development with portal development in the same function app. When you publish from a local project to a function app, the deployment process overwrites any functions that you developed in the portal.

## Prerequisites

Before you install and run the [Azure Functions extension][Azure Functions extension for Visual Studio Code], you must do the following:

* Install [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

* Install version 2.x of the [Azure Functions Core Tools](functions-run-local.md#v2).

* Install the specific requirements for your chosen language:

    | Language | Requirement |
    | -------- | --------- |
    | **C#** | [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)<br/>[.NET Core CLI tools](https://docs.microsoft.com/dotnet/core/tools/?tabs=netcore2x)   |
    | **Java** | [Debugger for Java extension](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug)<br/>[Java 8](https://aka.ms/azure-jdks)<br/>[Maven 3+](https://maven.apache.org/) |
    | **JavaScript** | [Node 8.0+](https://nodejs.org/)  |
    | **Python** | [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)<br/>[Python 3.6+](https://www.python.org/downloads/)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

Other resources that you need, such as an Azure Storage account, are created in your subscription during the publishing process.

[!INCLUDE [functions-install-vs-code-extension](../../includes/functions-install-vs-code-extension.md)]

## Create an Azure Functions project

The Functions extension lets you create a function app project, along with your first function. The following steps show how to create an HTTP triggered function in a new Functions project. [HTTP trigger](functions-bindings-http-webhook.md) is the simplest function trigger template to demonstrate.

1. From **Azure: Functions**, choose the Create Function icon.

    ![Create a function](./media/functions-develop-vs-code/create-function.png)

1. Select the folder with your function app project and select the **HTTP trigger** function template.

    ![Choose the HTTP trigger template](./media/functions-develop-vs-code/create-function-choose-template.png)

1. Type `HTTPTrigger` for the function name and press Enter, then select **Anonymous** authentication.

    ![Choose anonymous authentication](./media/functions-develop-vs-code/create-function-anonymous-auth.png)

    A function is created in your chosen language using the template for an HTTP-triggered function.

    ![HTTP triggered function template in Visual Studio Code](./media/functions-develop-vs-code/new-function-full.png)

You can add input and output bindings to your function by modifying the function.json file. For more information, see  [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

The project template creates a project in your chosen language, installs required dependencies. Regardless of language, the new project has the following files:

* **host.json**: Lets you configure the Functions host. These settings apply both when running locally and in Azure. For more information, see [host.json reference](functions-host-json.md).

* **local.settings.json**: Maintains settings used when running functions locally. These settings are not used when running in Azure. For more information, see [Local settings file](#local-settings-file).

    >[!IMPORTANT]
    >Because the local.settings.json file can contain secrets, you must excluded it from your project source control.

[!INCLUDE [functions-local-settings-file](../../includes/functions-local-settings-file.md)]

By default, these settings are not migrated automatically when the project is published to Azure. After publishing completes, you are given the option of publishing settings from local.settings.json to your function app in Azure. To learn more, see  .

Values in **ConnectionStrings** are never published.

The function app settings values can also be read in your code as environment variables. For more information, see the Environment variables section of these language-specific reference topics:

* [C# precompiled](functions-dotnet-class-library.md#environment-variables)
* [C# script (.csx)](functions-reference-csharp.md#environment-variables)
* [Java](functions-reference-java.md#environment-variables)
* [JavaScript](functions-reference-node.md#environment-variables)

[!INCLUDE [functions-core-tools-install-extension](../../includes/functions-core-tools-install-extension.md)]

## Configure the project for local development

The Functions runtime uses an Azure Storage account internally for all trigger types other than HTTP and webhooks. This means that you must set the **Values.AzureWebJobsStorage** key to a valid Azure Storage account connection string.

This section uses the [Azure Storage extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) with [Microsoft Azure Storage Explorer](https://storageexplorer.com/) to connect to and retrieve the storage connection string.   

To set the storage account connection string:

1. In Visual Studio, open **Cloud Explorer**, expand **Storage Account** > **Your Storage Account**, then select **Properties** and copy the **Primary Connection String** value.

2. In your project, open the local.settings.json file and set the value of the **AzureWebJobsStorage** key to the connection string you copied.

3. Repeat the previous step to add unique keys to the **Values** array for any other connections required by your functions.

## Install binding extensions

With the exception of HTTP and Timer triggers, bindings are implemented in extension packages. You must install the extension packages for the the triggers and bindings that require them. The way that you install binding extensions depends on your project language.

### JavaScript

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

### C\# class library

Run the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the Terminal window to install the extension packages you need in your project. The following example installs the Azure Storage extension, which implements bindings for Blob, Queue, and Table storage.

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.Storage --version 3.0.4
```

## Add a function to your project

You can add a new function to an existing project by using one of the predefined Azure Functions trigger-based templates. To add a new function trigger, press F1 key to open the command palette, then search for and run the command **Azure Functions: Create Function...**. Follow the prompts to choose your trigger type and define the required attributes of the trigger. If your trigger requires an access key or connection string to connect to a service, get it ready before you create the function trigger. 

The results of this operation depend on your project language:

### JavaScript

A new folder is created in the project, which contains a new function.json file and the new JavaScript code file.

### C\# class library

A new C# class library (.cs) file is added to your project.

## Add input and output bindings

You can expand you function by adding input and output bindings. The way that you do this depends on your project language. To learn more about bindings, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md). 

The following examples connect to a storage queue named `outqueue`, where the connection string for the storage account is set in the `MyStorageConnection` app setting in local.settings.json. 

### JavaScript

Update the function.json file to add the desired binding to the `bindings` array. The following is an example of a Queue storage binding named `msg`:

```javascript
{
    "type": "queue",
    "direction": "out",
    "name": "msg",
    "queueName": "outqueue",
    "connection": "MyStorageConnection"
}
```

In your function code, the `msg` binding is accessed from the `context`, as in the following example:

```javascript
context.bindings.msg = "Name passed to the function: " req.query.name;
```

To learn more, see the [Queue storage output binding](functions-bindings-storage-queue.md#output---javascript-example) reference.

### C\# class library

Update the function method to add the following parameter to the `Run` method definition:

```cs
[Queue("outqueue"),StorageAccount("MyStorageConnection")] ICollector<string> msg
```

This code requires you to add the following `using` statement:

```cs
using Microsoft.Azure.WebJobs.Extensions.Storage;
```

The `msg` parameter is an `ICollector<T>` type, which represents a collection of messages that are written to an output binding when the function completes. You simply add one or more messages to the collection, which are sent to the queue when the function completes.

To learn more, see the [Queue storage output binding](functions-bindings-storage-queue.md#output---c-example) reference.

[!INCLUDE [Supported triggers and bindings](../../includes/functions-bindings.md)]

## Running local functions

The Azure Functions extension lets you run an Azure Functions project on your local development computer. Local settings are read from the local.settings.json file.

To debug your functions, press F5. Core Tools is started and output is shown in the Terminal. With the project running, you can trigger your functions as you would when deployed to Azure. When running in debug mode, breakpoints are hit in Visual Studio Code, as expected.

The request URL for HTTP triggers is displayed in the output in the terminal. Function keys for HTTP triggers are not used when running locally. For more information, see [Strategies for testing your code in Azure Functions](functions-test-a-function.md).  

To learn more, see [Work with Azure Functions Core Tools](functions-run-local.md).

## Publish with advanced options

Visual Studio Code lets you publish your functions project directly to Azure. In the process, you create a function app and related resources in your Azure subscription. The function app provides an execution context for your functions. The project is packaged and deployed to the new function app in your Azure subscription.

By default, Visual Studio generates default values for the Azure resources needed by your function app. These values are based on the function app name you choose. For an example of using defaults to publishing your project to a new function app in Azure, see the [Visual Studio Code quickstart article](functions-create-first-function-vs-code.md#publish-the-project-to-azure).  

If you want to provide explicit names for the created resources, you can instead publish using advanced options.

This section assumes that you are creating a new function app in Azure.

> [!IMPORTANT]
> Publishing to an existing function app overwrites the content of that app in Azure.

### Enabled publishing with advanced create options

To give you control over the settings associated with creating Azure Functions apps, update the Azure Functions extension to enable advanced settings.

1. Click **File > Preferences > Settings**

1. Navigate through **User Settings > Extensions > Azure Functions**

1. Check the checkbox for **Azure Function: Advanced Creation**

### Publish to a new function app in Azure

1. In the **Azure: Functions** area, select the Deploy to Function App icon.

    ![Function app settings](./media/functions-develop-vs-code/function-app-publish-project.png)

1. If not signed-in, you are prompted to **Sign in to Azure**. You can also **Create a free Azure account**. After successful sign in from the browser, go back to Visual Studio Code. 

1. If you have multiple subscriptions, **Select a subscription** for the function app, then choose **+ Create New Function App in Azure**.

1. Following the prompts, provide the following information:

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select function app in Azure | + Create New Function App in Azure | In the next prompt, type a globally unique name that identifies your new function app and press Enter. Valid characters for a function app name are `a-z`, `0-9`, and `-`. |
    | Select an OS | Windows | Function app runs on Windows |
    | Select a hosting plan | Consumption plan | Serverless [Consumption plan hosting](functions-scale.md#consumption-plan) is used. |
    | Select a runtime for your new app | Your project language | The runtime must match the project that you are publishing. |
    | Select a resource group for new resources | Create New Resource Group | In the next prompt, type a resource group name, like `myResourceGroup`, and press enter. You can also choose an existing resource group. |
    | Select a storage account | Create new storage account | In the next prompt, type a globally unique name of the new storage account used by your function app and press Enter. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. You can also choose an existing account. |
    | Select a location for new resources | region | Choose a location in a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access. |

    A notification is displayed after your function app is created and the deployment package is applied. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created.

### Get deployed function URL

To be able to call an HTTP triggered function, you need the URL of the function when deployed to your function app. This URL includes any required [function keys](functions-bindings-http-webhook.md#authorization-keys). You can use the extension to get these URLs for your deployed functions.

1. press F1 key to open the command palette, then search for and run the command **Azure Functions: Copy Function URL**.

1. Follow the prompts to choose your function app in Azure and then the specific HTTP trigger you want to invoke. 

The function URL is copied to the clipboard, along with any required keys passed using the `code` query parameter. Use an HTTP tool to submit POST requests, or a browser for GET requests to the remote function.  

## Publish function app settings

Any settings you added in the local.settings.json must be also added to the function app in Azure. These settings are not uploaded automatically when you publish the project.

The easiest way to publish the required settings to your function app in Azure is to use the **Upload settings** link that is displayed after you successfully publish your project.

![Deployment complete upload app settings](./media/functions-develop-vs-code/upload-app-settings.png)

You can also publish settings by using the `Azure Functions: Upload Local Setting` command in the command palette. Individual settings are added to app setting in Azure by using the `Azure Functions: Add New Setting...` command. 

When a field in your local.settings.json already exists as an app setting, you are warned about overwriting the remote setting. This displays the **Application Settings** dialog for the function app, where you can add new application settings or modify existing ones.

View existing app settings in the **Azure: Functions** area by expanding your subscription, your function app, and **Application Settings**.

![View function app setting in Visual Studio Code](./media/functions-develop-vs-code/view-app-settings.png)

## Monitoring functions

The recommended way to monitor the execution of your functions is by integrating your function app with Azure Application Insights. When you create a function app in the Azure portal, this integration is done for you by default. However, when you create your function app during Visual Studio publishing, the integration in your function app in Azure isn't done.

To enable Application Insights for your function app:

[!INCLUDE [functions-connect-new-app-insights.md](../../includes/functions-connect-new-app-insights.md)]

To learn more, see [Monitor Azure Functions](functions-monitoring.md).

## Command palette reference

The Azure Functions extension provides a very useful graphical interface in the Azure area for interacting with your function apps in Azure. The same functionality is also available as commands in the command palette (F1). The following Azure Functions-specific commands are available:


|Azure Functions command  | Description  |
|---------|---------|
|**Add new settings**     |  Create a new application setting in Azure. To learn more, see [Publish function app settings](#publish-function-app-settings).       |
| **Configure deployment source** | Connect your function app in Azure to a Git repository. To learn more, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md). |
| **Connect to GitHub repository** |         |
|      |         |
|Row5     |         |
|Row6     |         |
|Row7     |         |
|Row8     |         |
|Row9     |         |
|Row10     |         |


## Next steps

To learn more about the Azure Functions Core Tools, see [Code and test Azure functions locally](functions-run-local.md).

To learn more about developing functions as .NET class libraries, see [Azure Functions C# developer reference](functions-dotnet-class-library.md). This article also links to examples of how to use attributes to declare the various types of bindings supported by Azure Functions.    

[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions