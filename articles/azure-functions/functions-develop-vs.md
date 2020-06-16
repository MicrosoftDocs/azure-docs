---
title: Develop Azure Functions using Visual Studio  
description: Learn how to develop and test Azure Functions by using Azure Functions Tools for Visual Studio 2019.
ms.custom: vs-azure
ms.topic: conceptual
ms.date: 06/10/2020
---

# Develop Azure Functions using Visual Studio  

Visual Studio lets you develop, test, and deploy C# class library functions to Azure. If this experience is your first with Azure Functions, see [An introduction to Azure Functions](functions-overview.md).

Visual Studio provides the following benefits when you develop your functions: 

* Edit, build, and run functions on your local development computer. 
* Publish your Azure Functions project directly to Azure, and create Azure resources as needed. 
* Use C# attributes to declare function bindings directly in the C# code.
* Develop and deploy pre-compiled C# functions. Pre-complied functions provide a better cold-start performance than C# script-based functions. 
* Code your functions in C# while having all of the benefits of Visual Studio development. 

This article provides details about how to use Visual Studio to develop C# class library functions and publish them to Azure. Before you read this article, consider completing the [Functions quickstart for Visual Studio](functions-create-your-first-function-visual-studio.md). 

Unless otherwise noted, procedures and examples shown are for Visual Studio 2019. 

## Prerequisites

- Azure Functions Tools. To add Azure Function Tools, include the **Azure development** workload in your Visual Studio installation. Azure Functions Tools is available in the Azure development workload starting with Visual Studio 2017.

- Other resources that you need, such as an Azure Storage account, are created in your subscription during the publishing process.

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

> [!NOTE]
> In Visual Studio 2017, the Azure development workload installs Azure Functions Tools as a separate extension. When you update your Visual Studio 2017 installation, make sure that you're using the [most recent version](#check-your-tools-version) of the Azure Functions tools. The following sections show you how to check and (if needed) update your Azure Functions Tools extension in Visual Studio 2017. 
>
> Skip these sections if you're using Visual Studio 2019.

### <a name="check-your-tools-version"></a>Check your tools version in Visual Studio 2017

1. From the **Tools** menu, choose **Extensions and Updates**. Expand **Installed** > **Tools**, and then choose **Azure Functions and Web Jobs Tools**.

    ![Verify the Functions tools version](./media/functions-develop-vs/functions-vstools-check-functions-tools.png)

1. Note the installed **Version** and compare this version with the latest version listed in the [release notes](https://github.com/Azure/Azure-Functions/blob/master/VS-AzureTools-ReleaseNotes.md). 

1. If your version is older, update your tools in Visual Studio as shown in the following section.

### Update your tools in Visual Studio 2017

1. In the **Extensions and Updates** dialog, expand **Updates** > **Visual Studio Marketplace**, choose **Azure Functions and Web Jobs Tools** and select **Update**.

    ![Update the Functions tools version](./media/functions-develop-vs/functions-vstools-update-functions-tools.png)   

1. After the tools update is downloaded, select **Close**, and then close Visual Studio to trigger the tools update with VSIX Installer.

1. In VSIX Installer, choose **Modify** to update the tools. 

1. After the update is complete, choose **Close**, and then restart Visual Studio.

> [!NOTE]  
> In Visual Studio 2019 and later, the Azure Functions tools extension is updated as part of Visual Studio.  

## Create an Azure Functions project

[!INCLUDE [Create a project using the Azure Functions](../../includes/functions-vstools-create.md)]

After you create an Azure Functions project, the project template creates a C# project, installs the `Microsoft.NET.Sdk.Functions` NuGet package, and sets the target framework. The new project has the following files:

* **host.json**: Lets you configure the Functions host. These settings apply both when running locally and in Azure. For more information, see [host.json reference](functions-host-json.md).

* **local.settings.json**: Maintains settings used when running functions locally. These settings aren't used when running in Azure. For more information, see [Local settings file](#local-settings-file).

    >[!IMPORTANT]
    >Because the local.settings.json file can contain secrets, you must exclude it from your project source control. Ensure the **Copy to Output Directory** setting for this file is set to **Copy if newer**. 

For more information, see [Functions class library project](functions-dotnet-class-library.md#functions-class-library-project).

[!INCLUDE [functions-local-settings-file](../../includes/functions-local-settings-file.md)]

Visual Studio doesn't automatically upload the settings in local.settings.json when you publish the project. To make sure that these settings also exist in your function app in Azure, upload them after you publish your project. For more information, see [Function app settings](#function-app-settings). The values in a `ConnectionStrings` collection are never published.

Your code can also read the function app settings values as environment variables. For more information, see [Environment variables](functions-dotnet-class-library.md#environment-variables).

## Configure the project for local development

The Functions runtime uses an Azure Storage account internally. For all trigger types other than HTTP and webhooks, set the `Values.AzureWebJobsStorage` key to a valid Azure Storage account connection string. Your function app can also use the [Azure storage emulator](../storage/common/storage-use-emulator.md) for the `AzureWebJobsStorage` connection setting that's required by the project. To use the emulator, set the value of `AzureWebJobsStorage` to `UseDevelopmentStorage=true`. Change this setting to an actual storage account connection string before deployment.

To set the storage account connection string:

1. In Visual Studio, select **View** > **Cloud Explorer**.

2. In **Cloud Explorer**, expand **Storage Accounts**, and then select your storage account. In the **Properties** tab, copy the **Primary Connection String** value.

2. In your project, open the local.settings.json file and set the value of the `AzureWebJobsStorage` key to the connection string you copied.

3. Repeat the previous step to add unique keys to the `Values` array for any other connections required by your functions. 

## Add a function to your project

In C# class library functions, the bindings used by the function are defined by applying attributes in the code. When you create your function triggers from the provided templates, the trigger attributes are applied for you. 

1. In **Solution Explorer**, right-click your project node and select **Add** > **New Item**. 

2. Select **Azure Function**, enter a **Name** for the class, and then select **Add**.

3. Choose your trigger, set the binding properties, and then select **OK**. The following example shows the settings for creating a Queue storage trigger function. 

    ![Create a Queue storage trigger function](./media/functions-develop-vs/functions-vstools-create-queuetrigger.png)

    This trigger example uses a connection string with a key named `QueueStorage`. Define this connection string setting in the [local.settings.json file](functions-run-local.md#local-settings-file).

4. Examine the newly added class. You see a static `Run()` method that's attributed with the `FunctionName` attribute. This attribute indicates that the method is the entry point for the function.

    For example, the following C# class represents a basic Queue storage trigger function:

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
            public static void Run([QueueTrigger("myqueue-items", 
                Connection = "QueueStorage")]string myQueueItem, ILogger log)
            {
                log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
            }
        }
    }
    ```

A binding-specific attribute is applied to each binding parameter supplied to the entry point method. The attribute takes the binding information as parameters. In the previous example, the first parameter has a `QueueTrigger` attribute applied, indicating a Queue storage trigger function. The queue name and connection string setting name are passed as parameters to the `QueueTrigger` attribute. For more information, see [Azure Queue storage bindings for Azure Functions](functions-bindings-storage-queue-trigger.md).

Use the above procedure to add more functions to your function app project. Each function in the project can have a different trigger, but a function must have exactly one trigger. For more information, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

## Add bindings

As with triggers, input and output bindings are added to your function as binding attributes. Add bindings to a function as follows:

1. Make sure you've [configured the project for local development](#configure-the-project-for-local-development).

2. Add the appropriate NuGet extension package for the specific binding. 

   For more information, see [C# class library with Visual Studio](./functions-bindings-register.md#local-csharp). Find the binding-specific NuGet package requirements in the reference article for the binding. For example, find package requirements for the Event Hubs trigger in the [Event Hubs binding reference article](functions-bindings-event-hubs.md).

3. If there are app settings that the binding needs, add them to the `Values` collection in the [local setting file](functions-run-local.md#local-settings-file). 

   The function uses these values when it runs locally. When the function runs in the function app in Azure, it uses the [function app settings](#function-app-settings).

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

Azure Functions Core Tools lets you run Azure Functions project on your local development computer. For more information, see [Work with Azure Functions Core Tools](functions-run-local.md). You're prompted to install these tools the first time you start a function from Visual Studio. 

To test your function in Visual Studio:

1. Press F5. If prompted, accept the request from Visual Studio to download and install Azure Functions Core (CLI) tools. You might also need to enable a firewall exception so that the tools can handle HTTP requests.

2. With the project running, test your code as you would test a deployed function. 

   For more information, see [Strategies for testing your code in Azure Functions](functions-test-a-function.md). When you run Visual Studio in debug mode, breakpoints are hit as expected.

<!---
For an example of how to test a queue triggered function, see the [queue triggered function quickstart tutorial](functions-create-storage-queue-triggered-function.md#test-the-function).  
-->


## Publish to Azure

When you publish from Visual Studio, it uses one of two deployment methods:

* [Web Deploy](functions-deployment-technologies.md#web-deploy-msdeploy): Packages and deploys Windows apps to any IIS server.
* [Zip Deploy with run-From-package enabled](functions-deployment-technologies.md#zip-deploy): Recommended for Azure Functions deployments.

Use the following steps to publish your project to a function app in Azure.

[!INCLUDE [Publish the project to Azure](../../includes/functions-vstools-publish.md)]

## Function app settings

Because Visual Studio doesn't upload these settings automatically when you publish the project, any settings you add in the local.settings.json you must also add to the function app in Azure.

The easiest way to upload the required settings to your function app in Azure is to select the **Manage Azure App Service settings** link that appears after you successfully publish your project.

:::image type="content" source="./media/functions-develop-vs/functions-vstools-app-settings.png" alt-text="Settings in Publish window":::

Selecting this link displays the **Application settings** dialog for the function app, where you can add new application settings or modify existing ones.

![Application settings](./media/functions-develop-vs/functions-vstools-app-settings2.png)

**Local** displays a setting value in the local.settings.json file, and **Remote** displays a current setting value in the function app in Azure. Choose **Add setting** to create a new app setting. Use the **Insert value from Local** link to copy a setting value to the **Remote** field. Pending changes are written to the local settings file and the function app when you select **OK**.

> [!NOTE]
> By default, the local.settings.json file is not checked into source control. This means that if you clone a local Functions project from source control, the project doesn't have a local.settings.json file. In this case, you need to manually create the local.settings.json file in the project root so that the **Application settings** dialog works as expected. 

You can also manage application settings in one of these other ways:

* [Use the Azure portal](functions-how-to-use-azure-function-app-settings.md#settings).
* [Use the `--publish-local-settings` publish option in the Azure Functions Core Tools](functions-run-local.md#publish).
* [Use the Azure CLI](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-set).

## Monitoring functions

The recommended way to monitor the execution of your functions is by integrating your function app with Azure Application Insights. When you create a function app in the Azure portal, this integration is done for you by default. However, when you create your function app during Visual Studio publishing, the integration in your function app in Azure isn't done.

[!INCLUDE [functions-connect-new-app-insights.md](../../includes/functions-connect-new-app-insights.md)]

To learn more, see [Monitor Azure Functions](functions-monitoring.md).

## Next steps

For more information about the Azure Functions Core Tools, see [Work with Azure Functions Core Tools](functions-run-local.md).

For more information about developing functions as .NET class libraries, see [Azure Functions C# developer reference](functions-dotnet-class-library.md). This article also links to examples of how to use attributes to declare the various types of bindings supported by Azure Functions.    
