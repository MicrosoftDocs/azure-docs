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

The [Azure Functions extension for Visual Studio Code] lets you develop, test, and deploy C# functions to Azure. If this experience is your first with Azure Functions, you can learn more at [An introduction to Azure Functions](functions-overview.md).

The Azure Functions extension provides the following benefits: 

* Edit, build, and run functions on your local development computer. 
* Publish your Azure Functions project directly to Azure. 
* Write your functions in a variety of languages while having all of the benefits of Visual Studio Code. 

This article provides details about how to use the Azure Functions extension to develop functions and publish them to Azure. Before you read this article, you should [Create your first function using Visual Studio Code](functions-create-first-function-vs-code.md).

> [!IMPORTANT]
> Don't mix local development with portal development in the same function app. When you publish from a local project to a function app, the deployment process overwrites any functions that you developed in the portal.

## Prerequisites

Before you install and run the [Azure Functions extension][Azure Functions extension for Visual Studio Code], you must do the following:

* Install [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

* Install version 2.x of the [Azure Functions Core Tools](../articles/azure-functions/functions-run-local.md#v2).

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

By default, these settings are not migrated automatically when the project is published to Azure. After publishing completes, you are given the option of publishing settings from local.settings.json to your function app in Azure.

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

## Add a function to your project

## Create an HTTP triggered function

1. From **Azure: Functions**, choose the Create Function icon.

    ![Create a function](./media/functions-create-first-function-vs-code/create-function.png)

1. Select the folder with your function app project and select the **HTTP trigger** function template.

    ![Choose the HTTP trigger template](./media/functions-create-first-function-vs-code/create-function-choose-template.png)

1. Type `HTTPTrigger` for the function name and press Enter, then select **Anonymous** authentication.

    ![Choose anonymous authentication](./media/functions-create-first-function-vs-code/create-function-anonymous-auth.png)

    A function is created in your chosen language using the template for an HTTP-triggered function.

    ![HTTP triggered function template in Visual Studio Code](./media/functions-create-first-function-vs-code/new-function-full.png)

You can add input and output bindings to your function by modifying the function.json file. For more information, see  [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

Now that you've created your function project and an HTTP-triggered function, you can test it on your local computer.

<!-- old VS content 
In pre-compiled functions, the bindings used by the function are defined by applying attributes in the code. When you use the Azure Functions Tools to create your functions from the provided templates, these attributes are applied for you. 

1. In **Solution Explorer**, right-click on your project node and select **Add** > **New Item**. Select **Azure Function**, type a **Name** for the class, and click **Add**.

2. Choose your trigger, set the binding properties, and click **Create**. The following example shows the settings when creating a Queue storage triggered function. 

    ![Create a queue triggered function](./media/functions-develop-vs/functions-vstools-create-queuetrigger.png)

    This trigger example uses a connection string with a key named **QueueStorage**. This connection string setting must be defined in the [local.settings.json file](functions-run-local.md#local-settings-file).

3. Examine the newly added class. You see a static **Run** method, that is attributed with the **FunctionName** attribute. This attribute indicates that the method is the entry point for the function.

    For example, the following C# class represents a basic Queue storage triggered function:

    ```csharp
    using System;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Host;
    using Microsoft.Extensions.Logging;

    namespace FunctionApp1
    {
        public static class Function1
        {
            [FunctionName("QueueTriggerCSharp")]
            public static void Run([QueueTrigger("myqueue-items", Connection = "QueueStorage")]string myQueueItem, ILogger log)
            {
                log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
            }
        }
    }
    ```
    A binding-specific attribute is applied to each binding parameter supplied to the entry point method. The attribute takes the binding information as parameters. In the previous example, the first parameter has a **QueueTrigger** attribute applied, indicating queue triggered function. The queue name and connection string setting name are passed as parameters to the **QueueTrigger** attribute. For more information, see [Azure Queue storage bindings for Azure Functions](functions-bindings-storage-queue.md#trigger---c-example).
    
You can use the above procedure to add more functions to your function app project. Each function in the project can have a different trigger, but a function must have exactly one trigger. For more information, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

-->

## Add bindings

As with triggers, input and output bindings are added to your function as binding attributes. Add bindings to a function as follows:

1. Make sure you have [configured the project for local development](#configure-the-project-for-local-development).

2. Add the appropriate NuGet extension package for the specific binding. For more information, see [Local C# development using Visual Studio](./functions-bindings-register.md#local-csharp) in the Triggers and Bindings article. The binding-specific NuGet package requirements are found in the reference article for the binding. For example, find package requirements for the Event Hubs trigger in the [Event Hubs binding reference article](functions-bindings-event-hubs.md).

3. If there are app settings that the binding needs, add them to the **Values** collection in the [local setting file](functions-run-local.md#local-settings-file). These values are used when the function runs locally. When the function runs in the function app in Azure, the [function app settings](#function-app-settings) are used.

4. Add the appropriate binding attribute to the method signature. In the following example, a queue message triggers the function, and the output binding creates a new queue message with the same text in a different queue.

    ```csharp
    public static class SimpleExampleWithOutput
    {
        [FunctionName("CopyQueueMessage")]
        public static void Run(
            [QueueTrigger("myqueue-items-source", Connection = "AzureWebJobsStorage")] string myQueueItem, 
            [Queue("myqueue-items-destination", Connection = "AzureWebJobsStorage")] out string myQueueItemCopy,
            ILogger log)
        {
            log.LogInformation($"CopyQueueMessage function processed: {myQueueItem}");
            myQueueItemCopy = myQueueItem;
        }
    }
    ```
   The connection to Queue storage is obtained from the `AzureWebJobsStorage` setting. For more information, see the reference article for the specific binding. 

[!INCLUDE [Supported triggers and bindings](../../includes/functions-bindings.md)]

## Testing functions

Azure Functions Core Tools lets you run Azure Functions project on your local development computer. You are prompted to install these tools the first time you start a function from Visual Studio.

To test your function, press F5. If prompted, accept the request from Visual Studio to download and install Azure Functions Core (CLI) tools. You may also need to enable a firewall exception so that the tools can handle HTTP requests.

With the project running, you can test your code as you would test deployed function. For more information, see [Strategies for testing your code in Azure Functions](functions-test-a-function.md). When running in debug mode, breakpoints are hit in Visual Studio as expected. 

<!---
For an example of how to test a queue triggered function, see the [queue triggered function quickstart tutorial](functions-create-storage-queue-triggered-function.md#test-the-function).  
-->

To learn more about using the Azure Functions Core Tools, see [Code and test Azure functions locally](functions-run-local.md).

## Publish with advanced options

Visual Studio Code lets you publish your functions project directly to Azure. In the process, you create a function app and related resources in your Azure subscription. The function app provides an execution context for your functions. The project is packaged and deployed to the new function app in your Azure subscription.

By default, Visual Studio generates default values for the Azure resources needed by your function app. These values are based on the function app name you choose. If you want to instead have prescribe all names for the created resources, you can instead publish using advanced options.

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

### Get function URLs

<!--<<more here>>-->

1. Back in the **Azure: Functions** area, expand the new function app under your subscription. Expand **Functions**, right-click **HttpTrigger**, and then choose **Copy function URL**.

    ![Copy the function URL for the new HTTP trigger](./media/functions-publish-project-vscode/function-copy-endpoint-url.png)

## Publish function app settings

Any settings you added in the local.settings.json must be also added to the function app in Azure. These settings are not uploaded automatically when you publish the project.

The easiest way to upload the required settings to your function app in Azure is to use the **Manage Application Settings...** link that is displayed after you successfully publish your project.

![](./media/functions-develop-vs/functions-vstools-app-settings.png)

This displays the **Application Settings** dialog for the function app, where you can add new application settings or modify existing ones.

![](./media/functions-develop-vs/functions-vstools-app-settings2.png)

**Local** represents a setting value in the local.settings.json file, and **Remote** is the current setting in the function app in Azure.  Choose **Add setting** to create a new app setting. Use the **Insert value from Local** link to copy a setting value to the **Remote** field. Pending changes are written to the local settings file and the function app when you select **OK**.

You can also manage application settings in one of these other ways:

* [Using the Azure portal](functions-how-to-use-azure-function-app-settings.md#settings).
* [Using the `--publish-local-settings` publish option in the Azure Functions Core Tools](functions-run-local.md#publish).
* [Using the Azure CLI](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set).

## Monitoring functions

The recommended way to monitor the execution of your functions is by integrating your function app with Azure Application Insights. When you create a function app in the Azure portal, this integration is done for you by default. However, when you create your function app during Visual Studio publishing, the integration in your function app in Azure isn't done.

To enable Application Insights for your function app:

[!INCLUDE [functions-connect-new-app-insights.md](../../includes/functions-connect-new-app-insights.md)]

To learn more, see [Monitor Azure Functions](functions-monitoring.md).

## Next steps

To learn more about the Azure Functions Core Tools, see [Code and test Azure functions locally](functions-run-local.md).

To learn more about developing functions as .NET class libraries, see [Azure Functions C# developer reference](functions-dotnet-class-library.md). This article also links to examples of how to use attributes to declare the various types of bindings supported by Azure Functions.    

[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions