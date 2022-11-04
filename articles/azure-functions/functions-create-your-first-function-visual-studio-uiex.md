---
title: "Quickstart: Create your first function in Azure using Visual Studio"
description: In this quickstart, you learn how to create and publish an HTTP trigger Azure Function by using Visual Studio.
ms.assetid: 82db1177-2295-4e39-bd42-763f6082e796
ms.topic: quickstart
ms.date: 11/8/2022
ms.devlang: csharp
ms.custom: devx-track-csharp, mvc, devcenter, vs-azure, 23113853-34f2-4f, mode-ui
ROBOTS: NOINDEX,NOFOLLOW
---
# Quickstart: Create your first function in Azure using Visual Studio

In this article, you use Visual Studio to create a C# class library-based function that responds to HTTP requests. After testing the code locally, you deploy it to the <abbr title="A runtime computing environment in which all the details of the server are transparent to application developers, which simplifies the process of deploying and managing code.">serverless</abbr> environment of <abbr title="An Azure service that provides a low-cost serverless computing environment for applications.">Azure Functions</abbr>.

Completing this quickstart incurs a small cost of a few USD cents or less in your <abbr title="The profile that maintains billing information for Azure usage.">Azure account</abbr>.

## 1. Prepare your environment

+ Create an Azure <abbr title="The profile that maintains billing information for Azure usage.">account</abbr> with an active <abbr title="The basic organizational structure in which you manage resources in Azure, typically associated with an individual or department within an organization.">subscription</abbr>. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ Install [Visual Studio 2019](https://azure.microsoft.com/downloads/) and select the **Azure development** workload during installation. 

<br/>
<details>
<summary><strong>Use an Azure Functions project instead</strong></summary>
If you want to create an <abbr title="A logical container for one or more individual functions that can be deployed and managed together.">Azure Functions project</abbr> by using Visual Studio 2017 instead, you must first install the [latest Azure Functions tools](functions-develop-vs.md#check-your-tools-version).
</details>

## 2. Create a function app project

1. From the Visual Studio menu, select **File** > **New** > **Project**.

1. In **Create a new project**, enter *functions* in the search box, choose the **Azure Functions** template, and then select **Next**.

1. In **Configure your new project**, enter a **<abbr title="The function app name must be valid as a C# namespace, so don't use underscores, hyphens, or any other nonalphanumeric characters.">Project name</abbr>** for your project, and then select **Create**. 

1. Provide the following information for the **Create a new Azure Functions application** settings:

    + Select **<abbr title=" This value creates a function project that uses the version 3.x runtime of Azure Functions, which supports .NET Core 3.x. Azure Functions 1.x supports the .NET Framework.">Azure Functions v3 (.NET Core)</abbr>** from the Functions runtime dropdown. (For more information, see [Azure Functions runtime versions overview](functions-versions.md).)
    
    + Select **<abbr title="This value creates a function triggered by an HTTP request.">HTTP trigger</abbr>** as the function template.
    
    + Select **<abbr title="Because an Azure Function requires a storage account, one is assigned or created when you publish your project to Azure. An HTTP trigger doesn't use an Azure Storage account connection string; all other trigger types require a valid Azure Storage account connection string.">Storage emulator</abbr>** from the Storage account dropdown.
        
    + Select **Anonymous** from the <abbr title="The created function can be triggered by any client without providing a key. This authorization setting makes it easy to test your new function.">Authorization level</abbr> dropdown. (For more information about keys and authorization, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys) and [HTTP and webhook bindings](functions-bindings-http-webhook.md).)

    + Select **Create**
        
## 3. Rename the function

The `FunctionName` method attribute sets the name of the function, which by default is generated as `Function1`. Because the tooling doesn't let you override the default function name when you create your project, take a minute to create a better name for the function class, file, and metadata.

1. In **File Explorer**, right-click the Function1.cs file and rename it to *HttpExample.cs*.

1. In the code, rename the Function1 class to `HttpExample'.

1. In the `HttpTrigger` method named `Run`, rename the `FunctionName` method attribute to `HttpExample`.


## 4. Run the function locally

1. To run your function, press <kbd>F5</kbd> in Visual Studio.

1. Copy the URL of your function from the Azure Functions runtime output.

    ![Azure local runtime](../../includes/media/functions-run-function-test-local-vs/functions-debug-local-vs.png)

1. Paste the URL for the HTTP request into your browser's address bar. Append the query string **?name=<YOUR_NAME>** to this URL and run the request. 

    ![Function localhost response in the browser](../../includes/media/functions-run-function-test-local-vs/functions-run-browser-local-vs.png)

1. To stop debugging, press <kbd>Shift</kbd>+<kbd>F5</kbd> in Visual Studio.

<br/>
<details>
<summary><strong>Troubleshooting</strong></summary>
 You might need to enable a firewall exception so that the tools can handle HTTP requests. Authorization levels are never enforced when you run a function locally.
</details>

## 5. Publish the project to Azure

1. In **Solution Explorer**, right-click the project and select **Publish**.

1. In **Target**, select **Azure**

    :::image type="content" source="../../includes/media/functions-vstools-publish/functions-visual-studio-publish-profile-step-1.png" alt-text="Select Azure target":::

1. In **Specific target**, select **Azure Function App (Windows)**

    :::image type="content" source="../../includes/media/functions-vstools-publish/functions-visual-studio-publish-profile-step-2.png" alt-text="Select Azure Function App":::

1. In **Function Instance**, select **Create a new Azure Function...** and then use the values specified in the following:

    + For **Name** provide a <abbr title="Use a name that uniquely identifies your new function app. Accept this name or enter a new name. Valid characters are: `a-z`, `0-9`, and `-`..">Globally unique name</abbr>
    
    + **Select** a subscription from the drop-down list.
    
    + **Select** an existing <abbr title="A logical container for related Azure resources that you can manage as a unit.">resource group</abbr> from the drop-down list or choose **New** to create a new resource group.
    
    + **Select** <abbr title="When you publish your project to a function app that runs in a Consumption plan, you pay only for executions of your functions app. Other hosting plans incur higher costs.">Consumption</abbr> in the Play Type drop-down. (For more information, see [Consumption plan](consumption-plan.md).)
    
    + **Select** an  <abbr title="A geographical reference to a specific Azure datacenter in which resources are allocated.See [regions](https://azure.microsoft.com/regions/) for a list of available regions.">location</abbr> from the drop-down.
    
    + **Select** an <abbr="An Azure Storage account is required by the Functions runtime. Select New to configure a general-purpose storage account. You can also choose an existing account that meets the storage account requirements.">Azure Storage</abbr> account from the drop-down

    ![Create App Service dialog](../../includes/media/functions-vstools-publish/functions-visual-studio-publish.png)

1. Select **Create** 

1. In the **Functions instance**, make sure that **Run from package file** is checked. 

    :::image type="content" source="../../includes/media/functions-vstools-publish/functions-visual-studio-publish-profile-step-4.png" alt-text="Finish profile creation":::

    <br/>
    <details>
    <summary><strong>What does this setting do?</strong></summary>
    When using **Run from package file**, your function app is deployed using [Zip Deploy](functions-deployment-technologies.md#zip-deploy) with [Run-From-Package](run-functions-from-deployment-package.md) mode enabled. This is the recommended deployment method for your functions project, since it results in better performance.    
    </details>   

1. Select **Finish**.

1. On the Publish page, select **Publish**.

1. On the Publish page, review the root URL of the function app.

1. In the Publish tab, choose **Manage in <abbr title="Cloud Explorer lets you use Visual Studio to view the contents of the site, start and stop the function app, and browse directly to function app resources on Azure and in the Azure portal.">Cloud Explorer</abbr>**.
    
    :::image type="content" source="../../includes/media/functions-vstools-publish/functions-visual-studio-publish-complete.png" alt-text="Publish success message":::
    

## 6. Test your function in Azure

1. In Cloud Explorer, your new function app should be selected. If not, expand your subscription, expand **App Services**, and select your new function app.

1. Right-click the function app and choose **Open in Browser**. This opens the root of your function app in your default web browser and displays the page that indicates your function app is running. 

    :::image type="content" source="media/functions-create-your-first-function-visual-studio/function-app-running-azure.png" alt-text="Function app running":::

1. In the address bar in the browser, append the string **/api/HttpExample?name=Functions** to the base URL and run the request.

    The URL that calls your HTTP trigger function is in the following format:

    `http://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`

2. Go to this URL and you see a response in the browser to the remote GET request returned by the function, which looks like the following example:

    :::image type="content" source="media/functions-create-your-first-function-visual-studio/functions-create-your-first-function-visual-studio-browser-azure.png" alt-text="Function response in the browser":::

## 7. Clean up resources

[!INCLUDE [functions-vstools-cleanup](../../includes/functions-vstools-cleanup.md)]

## Next steps

Advance to the next article to learn how to add an <abbr title="A means to associate a function with a storage queue, so that it can create messages on the queue. Bindings are declarative connections between a function and other resources. An input binding provides data to the function; an output binding provides data from the function to other resources.">Azure Storage queue output binding</abbr> to your function:

> [!div class="nextstepaction"]
> [Add an Azure Storage queue binding to your function](functions-add-output-binding-storage-queue-vs.md)
