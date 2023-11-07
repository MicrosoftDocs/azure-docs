---
title: Develop Azure Functions by using Visual Studio Code 
description: Learn how to develop and test Azure Functions by using the Azure Functions extension for Visual Studio Code.
ms.topic: conceptual
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devdivchpfy22, vscode-azure-extension-update-complete, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 09/01/2023
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As an Azure Functions developer, I want to understand how Visual Studio Code supports Azure Functions so that I can more efficiently create, publish, and maintain my Functions projects.
---

# Develop Azure Functions by using Visual Studio Code

The [Azure Functions extension for Visual Studio Code] lets you locally develop functions and deploy them to Azure. If this experience is your first with Azure Functions, you can learn more at [An introduction to Azure Functions](functions-overview.md).

The Azure Functions extension provides these benefits:

* Edit, build, and run functions on your local development computer.
* Publish your Azure Functions project directly to Azure.
* Write your functions in various languages while taking advantage of the benefits of Visual Studio Code.

::: zone pivot="programming-language-csharp"
>You're viewing the C# version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Visual Studio Code quickstart article](create-first-function-vs-code-csharp.md).
::: zone-end
::: zone pivot="programming-language-java"
>You're viewing the Java version of this article. Make sure to select your preferred Functions programming language at the top of the article.

If you want to get started right away, complete the [Visual Studio Code quickstart article](create-first-function-vs-code-java.md).
::: zone-end
::: zone pivot="programming-language-javascript"
>You're viewing the JavaScript version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Visual Studio Code quickstart article](create-first-function-vs-code-node.md).
::: zone-end
::: zone pivot="programming-language-powershell"
>You're viewing the PowerShell version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Visual Studio Code quickstart article](create-first-function-vs-code-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
>You're viewing the Python version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Visual Studio Code quickstart article](create-first-function-vs-code-python.md).
::: zone-end
::: zone pivot="programming-language-typescript"
>You're viewing the TypeScript version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Visual Studio Code quickstart article](./create-first-function-vs-code-typescript.md).
::: zone-end

> [!IMPORTANT]
> Don't mix local development and portal development for a single function app. When you publish from a local project to a function app, the deployment process overwrites any functions that you developed in the portal.

## Prerequisites

* [Visual Studio Code](https://code.visualstudio.com/) installed on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

* [Azure Functions extension][Azure Functions extension for Visual Studio Code]. You can also install the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), which is recommended for working with Azure resources. 

* An active [Azure subscription](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing). If you don't yet have an account, you can create one from the extension in Visual Studio Code. 

### Run local requirements

These prerequisites are only required to [run and debug your functions locally](#run-functions-locally). They aren't required to create or publish projects to Azure Functions.

+ The [Azure Functions Core Tools](functions-run-local.md), which enables an integrated local debugging experience. When using the Azure Functions extension, the easiest way to install Core Tools is by running the `Azure Functions: Install or Update Azure Functions Core Tools` command from the command pallet.    
::: zone pivot="programming-language-csharp"    
+ The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.

+ [.NET (CLI)](/dotnet/core/tools/), which is included in the .NET SDK.
::: zone-end  
::: zone pivot="programming-language-java"  
+ [Debugger for Java extension](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug).

+ [Java](/azure/developer/java/fundamentals/java-support-on-azure), one of the [supported versions](functions-reference-java.md#java-versions).

+ [Maven 3 or later](https://maven.apache.org/).
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
+ [Node.js](https://nodejs.org/), one of the [supported versions](functions-reference-node.md#node-version). Use the `node --version` command to check your version.
::: zone-end  
::: zone pivot="programming-language-powershell"  
+ [PowerShell 7.2](/powershell/scripting/install/installing-powershell-core-on-windows) recommended. For version information, see [PowerShell versions](functions-reference-powershell.md#powershell-versions).

+ [.NET 6.0 runtime](https://dotnet.microsoft.com/download).

+ The [PowerShell extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell). 
::: zone-end  
::: zone pivot="programming-language-python"  
+ [Python](https://www.python.org/downloads/), one of the [supported versions](functions-reference-python.md#python-version).

+ [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code.

[!INCLUDE [functions-x86-emulation-on-arm64-note](../../includes/functions-x86-emulation-on-arm64-note.md)]
::: zone-end  

## Create an Azure Functions project

The Functions extension lets you create a function app project, along with your first function. The following steps show how to create an HTTP-triggered function in a new Functions project. [HTTP trigger](functions-bindings-http-webhook.md) is the simplest function trigger template to demonstrate.

1. 1. Choose the Azure icon in the Activity bar, then in the **Workspace (local)** area, select the **+** button, choose **Create Function** in the dropdown. When prompted, choose **Create new project**.

    :::image type="content" source="./media/functions-create-first-function-vs-code/create-new-project.png" alt-text="Screenshot of create a new project window.":::

1. Choose the directory location for your project workspace and choose **Select**. You should either create a new folder or choose an empty folder for the project workspace. Don't choose a project folder that is already part of a workspace.

1. When prompted, **Select a language** for your project, and if necessary choose a specific language version. 

1. Select the **HTTP trigger** function template, or you can select **Skip for now** to create a project without a function. You can always [add a function to your project](#add-a-function-to-your-project) later.

    :::image type="content" source="./media/functions-develop-vs-code/select-http-trigger.png" alt-text="Screenshot for selecting H T T P trigger.":::

1. Type **HttpExample** for the function name and select Enter, and then select **Function** authorization. This authorization level requires you to provide a [function key](functions-bindings-http-webhook-trigger.md#authorization-keys) when you call the function endpoint.

    :::image type="content" source="./media/functions-develop-vs-code/create-function-auth.png" alt-text="Screenshot for creating function authorization.":::

1. From the dropdown list, select **Add to workspace**.

    :::image type="content" source="./media/functions-develop-vs-code/add-to-workplace.png" alt-text=" Screenshot for selectIng Add to workplace.":::

1. In **Do you trust the authors of the files in this folder?** window, select **Yes**.

    :::image type="content" source="./media/functions-develop-vs-code/select-author-file.png" alt-text="Screenshot to confirm trust in authors of the files.":::

1. A function is created in your chosen language and in the template for an HTTP-triggered function.

### Generated project files

The project template creates a project in your chosen language and installs required dependencies. For any language, the new project has these files:

* **host.json**: Lets you configure the Functions host. These settings apply when you're running functions locally and when you're running them in Azure. For more information, see [host.json reference](functions-host-json.md).

* **local.settings.json**: Maintains settings used when you're running functions locally. These settings are used only when you're running functions locally. For more information, see [Local settings file](#local-settings).

    >[!IMPORTANT]
    >Because the local.settings.json file can contain secrets, you need to exclude it from your project source control.

Depending on your language, these other files are created:

::: zone pivot="programming-language-csharp"  
An HttpExample.cs class library file, the contents of which vary depending on whether your project runs in an [isolated worker process](dotnet-isolated-process-guide.md#net-isolated-worker-process-project) or [in-process](functions-dotnet-class-library.md#functions-class-library-project) with the Functions host.
::: zone-end  
::: zone pivot="programming-language-java"  
+ A pom.xml file in the root folder that defines the project and deployment parameters, including project dependencies and the [Java version](functions-reference-java.md#java-versions). The pom.xml also contains information about the Azure resources that are created during a deployment.

+ A [Functions.java file](functions-reference-java.md#triggers-and-annotations) in your src path that implements the function.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript" 
Files generated depend on the chosen Node.js programming model for Functions:
### [v3](#tab/node-v3)
+ A package.json file in the root folder.

+  An HttpExample folder that contains: 

    + The [function.json definition file](functions-reference-node.md#folder-structure)
    + An [index.js file](functions-reference-node.md#exporting-a-function), which contains the function code.

### [v4](#tab/node-v4)

+ A package.json file in the root folder.

+ A named .js file in the _src\functions_ folder, which contains both the function definition and your function code.

---

::: zone-end  
::: zone pivot="programming-language-powershell"  
An HttpExample folder that contains:

+ The [function.json definition file](functions-reference-powershell.md#folder-structure)
+ A run.ps1 file, which contains the function code.

::: zone-end  
::: zone pivot="programming-language-python"  
Files generated depend on the chosen Python programming model for Functions:
 
### [v2](#tab/python-v2)

+ A project-level requirements.txt file that lists packages required by Functions.

+ A function_app.py file that contains both the function definition and code.

### [v1](#tab/python-v1)

+ A project-level requirements.txt file that lists packages required by Functions.

+ An HttpExample folder that contains:
    + The [function.json definition file](functions-reference-python.md#folder-structure)
    + An \_\_init\_\_.py file, which contains the function code.

---

::: zone-end  

At this point, you can do one of these tasks:

+ [Add input or output bindings to an existing function](#add-input-and-output-bindings).
+ [Add a new function to your project](#add-a-function-to-your-project).
+ [Run your functions locally](#run-functions-locally).
+ [Publish your project to Azure](#publish-to-azure).

## Add a function to your project

You can add a new function to an existing project by using one of the predefined Functions trigger templates. To add a new function trigger, select F1 to open the command palette, and then search for and run the command **Azure Functions: Create Function**. Follow the prompts to choose your trigger type and define the required attributes of the trigger. If your trigger requires an access key or connection string to connect to a service, get it ready before you create the function trigger.

::: zone pivot="programming-language-csharp"  
The results of this action are that a new C# class library (.cs) file is added to your project.
::: zone-end
::: zone pivot="programming-language-java"
The results of this action are that a new Java (.java) file is added to your project.
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
The results of this action depend on the Node.js model version.

### [v3](#tab/node-v3)

A new folder is created in the project. The folder contains a new function.json file and the new JavaScript code file.

### [v4](#tab/node-v4)

+ A package.json file in the root folder.

+ A named .js file in the _src\functions_ folder, which contains both the function definition and your function code.

---
::: zone-end
::: zone pivot="programming-language-powershell"
The results of this action are that a new folder is created in the project. The folder contains a new function.json file and the new PowerShell code file.
::: zone-end
::: zone pivot="programming-language-python"
The results of this action depend on the Python model version.

### [v2](#tab/python-v2)

New function code is added either to the function_app.py file (the default behavior) or to another Python file you selected. 

### [v1](#tab/python-v1)

A new folder is created in the project. The folder contains a new function.json file and the new Python code file.

---
::: zone-end

## <a name="add-input-and-output-bindings"></a>Connect to services

You can connect your function to other Azure services by adding input and output bindings. Bindings connect your function to other services without you having to write the connection code. 

::: zone pivot="programming-language-csharp"  
For example, the way you define an output binding that writes data to a storage queue depends on your process model:

### [Isolated process](#tab/isolated-process)

Update the function method to add a binding parameter defined by using the `QueueOutput` attribute. You can use a `MultiResponse` object to return multiple messages or multiple output streams. 

### [In-process](#tab/in-process)

Update the function method to add a binding parameter defined by using the `Queue` attribute. You can use an `ICollector<T>` type to represent a collection of messages.

---

::: zone-end
::: zone pivot="programming-language-java"
For example, to add an output binding that writes data to a storage queue you update the function method to add a binding parameter defined by using the [`QueueOutput`](/java/api/com.microsoft.azure.functions.annotation.queueoutput) annotation. The [`OutputBinding<T>`](/java/api/com.microsoft.azure.functions.outputbinding) object represents the messages that are written to an output binding when the function completes.
::: zone-end
::: zone pivot="programming-language-javascript"
For example, the way you define the output binding that writes data to a storage queue depends on your Node.js model version:

### [v3](#tab/node-v3)

[!INCLUDE [functions-add-output-binding-vs-code](../../includes/functions-add-output-binding-vs-code.md)]

### [v4](#tab/node-v4)

Using the Node.js v4 model, you must manually add a `return:` option in the function definition using the `storageQueue` function on the `output` object, which defines the storage queue to write the `return` output. Output is written when the function completes. 

--- 

::: zone-end
::: zone pivot="programming-language-powershell"
[!INCLUDE [functions-add-output-binding-vs-code](../../includes/functions-add-output-binding-vs-code.md)]
::: zone-end
::: zone pivot="programming-language-python"
For example, the way you define the output binding that writes data to a storage queue depends on your Python model version:

### [v2](#tab/python-v2)

The `@queue_output` decorator on the function is used to define a named binding parameter for the output to the storage queue, where `func.Out` defines what output is written. 

### [v1](#tab/python-v1)

[!INCLUDE [functions-add-output-binding-vs-code](../../includes/functions-add-output-binding-vs-code.md)]

--- 

::: zone-end
[!INCLUDE [functions-add-output-binding-example-all-langs](../../includes/functions-add-output-binding-example-all-languages.md)]

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

## <a name="publish-to-azure"></a>Create Azure resources

Before you can publish your Functions project to Azure, you must have a function app and related resources in your Azure subscription to run your code. The function app provides an execution context for your functions. When you publish to a function app in Azure from Visual Studio Code, the project is packaged and deployed to the selected function app in your Azure subscription.

When you create a function app in Azure, you can choose either a quick function app create path using defaults or an advanced path. This way you have more control over the remote resources created.

### Quick function app create

[!INCLUDE [functions-create-azure-resources-vs-code](../../includes/functions-create-azure-resources-vs-code.md)]

### <a name="enable-publishing-with-advanced-create-options"></a>Publish a project to a new function app in Azure by using advanced options

The following steps publish your project to a new function app created with advanced create options:

1. In the command pallet, enter **Azure Functions: Create function app in Azure...(Advanced)**.

1. If you're not signed in, you're prompted to **Sign in to Azure**. You can also **Create a free Azure account**. After signing in from the browser, go back to Visual Studio Code.

1. Following the prompts, provide this information:

    | Prompt |  Selection |
    | ------ |  ----------- |
    | Enter a globally unique name for the new function app. | Type a globally unique name that identifies your new function app and then select Enter. Valid characters for a function app name are `a-z`, `0-9`, and `-`. |
    | Select a runtime stack. | Choose the language version on which you've been running locally. |
    | Select an OS. | Choose either Linux or Windows. Python apps must run on Linux. |
    | Select a resource group for new resources. | Choose **Create new resource group** and type a resource group name, like `myResourceGroup`, and then select enter. You can also select an existing resource group. |
    | Select a location for new resources. | Select a location in a [region](https://azure.microsoft.com/regions/) near you or near other services that your functions access. |
    | Select a hosting plan. | Choose **Consumption** for serverless [Consumption plan hosting](consumption-plan.md), where you're only charged when your functions run. |
    | Select a storage account. | Choose **Create new storage account** and at the prompt, type a globally unique name for the new storage account used by your function app and then select Enter. Storage account names must be between 3 and 24 characters long and can contain only numbers and lowercase letters. You can also select an existing account. |
    | Select an Application Insights resource for your app. | Choose **Create new Application Insights resource** and at the prompt, type a name for the instance used to store runtime data from your functions.| 

    A notification appears after your function app is created and the deployment package is applied. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created.

### <a name="get-the-url-of-the-deployed-function"></a>Get the URL of an HTTP triggered function in Azure

To call an HTTP-triggered function from a client, you need the URL of the function when it's deployed to your function app. This URL includes any required function keys. You can use the extension to get these URLs for your deployed functions. If you just want to run the remote function in Azure, [use the Execute function now](#run-functions-in-azure) functionality of the extension.

1. Select F1 to open the command palette, and then search for and run the command **Azure Functions: Copy Function URL**.

1. Follow the prompts to select your function app in Azure and then the specific HTTP trigger that you want to invoke.

The function URL is copied to the clipboard, along with any required keys passed by the `code` query parameter. Use an HTTP tool to submit POST requests, or a browser for GET requests to the remote function.  

When the extension gets the URL of functions in Azure, it uses your Azure account to automatically retrieve the keys it needs to start the function. [Learn more about function access keys](security-concepts.md#function-access-keys). Starting non-HTTP triggered functions requires using the admin key.

## <a name="republish-project-files"></a>Deploy project files

We recommend setting-up [continuous deployment](functions-continuous-deployment.md) so that your function app in Azure is updated when you update source files in the connected source location. You can also deploy your project files from Visual Studio Code.

When you publish from Visual Studio Code, you take advantage of the [Zip deploy](functions-deployment-technologies.md#zip-deploy) technology.

[!INCLUDE [functions-deploy-project-vs-code](../../includes/functions-deploy-project-vs-code.md)]

## Run functions

The Azure Functions extension lets you run individual functions. You can run functions either in your project on your local development computer or in your Azure subscription.

For HTTP trigger functions, the extension calls the HTTP endpoint. For other kinds of triggers, it calls administrator APIs to start the function. The message body of the request sent to the function depends on the type of trigger. When a trigger requires test data, you're prompted to enter data in a specific JSON format.

### Run functions in Azure.

To execute a function in Azure from Visual Studio Code.

1. In the command pallet, enter **Azure Functions: Execute function now** and choose your Azure subscription.

1. Choose your function app in Azure from the list. If you don't see your function app, make sure you're signed in to the correct subscription.

1. Choose the function you want to run from the list and type the message body of the request in **Enter request body**. Press Enter to send this request message to your function. The default text in **Enter request body** should indicate the format of the body. If your function app has no functions, a notification error is shown with this error.

1. When the function executes in Azure and returns a response, a notification is raised in Visual Studio Code.

You can also run your function from the **Azure: Functions** area by right-clicking (Ctrl-clicking on Mac) the function you want to run from your function app in your Azure subscription and choosing **Execute Function Now...**.

When you run your functions in Azure from Visual Studio Code, the extension uses your Azure account to automatically retrieve the keys it needs to start the function. [Learn more about function access keys](security-concepts.md#function-access-keys). Starting non-HTTP triggered functions requires using the admin key.

### Run functions locally

The local runtime is the same runtime that hosts your function app in Azure. Local settings are read from the [local.settings.json file](#local-settings). To run your Functions project locally, you must meet [more requirements](#run-local-requirements).

#### Configure the project to run locally

The Functions runtime uses an Azure Storage account internally for all trigger types other than HTTP and webhooks. So you need to set the **Values.AzureWebJobsStorage** key to a valid Azure Storage account connection string.

This section uses the [Azure Storage extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) with [Azure Storage Explorer](https://storageexplorer.com/) to connect to and retrieve the storage connection string.

To set the storage account connection string:

1. In Visual Studio, open **Cloud Explorer**, expand **Storage Account** > **Your Storage Account**, and then select **Properties** and copy the **Primary Connection String** value.

2. In your project, open the local.settings.json file and set the value of the **AzureWebJobsStorage** key to the connection string you copied.

3. Repeat the previous step to add unique keys to the **Values** array for any other connections required by your functions.

For more information, see [Local settings file](#local-settings).

#### <a name="debugging-functions-locally"></a>Debug functions locally  

To debug your functions, select F5. If you haven't already downloaded [Core Tools][Azure Functions Core Tools], you're prompted to do so. When Core Tools is installed and running, output is shown in the Terminal. This step is the same as running the `func start` Core Tools command from the Terminal, but with extra build tasks and an attached debugger.  

When the project is running, you can use the **Execute Function Now...** feature of the extension to trigger your functions as you would when the project is deployed to Azure. With the project running in debug mode, breakpoints are hit in Visual Studio Code as you would expect.

1. In the command pallet, enter **Azure Functions: Execute function now** and choose **Local project**.

1. Choose the function you want to run in your project and type the message body of the request in **Enter request body**. Press Enter to send this request message to your function. The default text in **Enter request body** should indicate the format of the body. If your function app has no functions, a notification error is shown with this error.

1. When the function runs locally and after the response is received, a notification is raised in Visual Studio Code. Information about the function execution is shown in **Terminal** panel.

Keys aren't required when running locally, which applies to both function keys and admin-level keys.

[!INCLUDE [functions-local-settings-file](../../includes/functions-local-settings-file.md)]

By default, these settings aren't migrated automatically when the project is published to Azure. After publishing finishes, you're given the option of publishing settings from local.settings.json to your function app in Azure. To learn more, see  [Publish application settings](#publish-application-settings).

Values in **ConnectionStrings** are never published.

::: zone pivot="programming-language-csharp"  
### [Isolated process](#tab/isolated-process)
The function application settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-dotnet-class-library.md#environment-variables).

### [In-process](#tab/in-process)
The function application settings values can also be read in your code as environment variables as with any ASP.NET Core app. 

---

::: zone-end
::: zone pivot="programming-language-java"
+ The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-java.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
+ The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-node.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-powershell"
+ The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-powershell.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-python"
+ The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-python.md#environment-variables).
::: zone-end

## Application settings in Azure

The settings in the local.settings.json file in your project should be the same as the application settings in the function app in Azure. Any settings you add to local.settings.json you must also add to the function app in Azure. These settings aren't uploaded automatically when you publish the project. Likewise, any settings that you create in your function app [in the portal](functions-how-to-use-azure-function-app-settings.md#settings) must be downloaded to your local project.

### Publish application settings

The easiest way to publish the required settings to your function app in Azure is to use the **Upload settings** link that appears after you publish your project:

:::image type="content" source="./media/functions-develop-vs-code/upload-app-settings.png" alt-text="Screenshot to upload application settings.":::

You can also publish settings by using the **Azure Functions: Upload Local Setting** command in the command palette. You can add individual settings to application settings in Azure by using the **Azure Functions: Add New Setting** command.

> [!TIP]
> Be sure to save your local.settings.json file before you publish it.

If the local file is encrypted, it's decrypted, published, and encrypted again. If there are settings that have conflicting values in the two locations, you're prompted to choose how to proceed.

View existing app settings in the **Azure: Functions** area by expanding your subscription, your function app, and **Application Settings**.

:::image type="content" source="./media/functions-develop-vs-code/view-app-settings.png" alt-text=" Screenshot for viewing function app settings in Visual Studio Code.":::

### Download settings from Azure

If you've created application settings in Azure, you can download them into your local.settings.json file by using the **Azure Functions: Download Remote Settings** command.

As with uploading, if the local file is encrypted, it's decrypted, updated, and encrypted again. If there are settings that have conflicting values in the two locations, you're prompted to choose how to proceed.

## Install binding extensions

Except for HTTP and timer triggers, bindings are implemented in extension packages. 

::: zone pivot="programming-language-csharp"  
You must explicitly install the extension packages for the triggers and bindings that need them. The specific package you install depends on your project's process model.

### [Isolated process](#tab/isolated-process)

Run the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the Terminal window to install the extension packages that you need in your project. This template demonstrates how you add a binding for an [isolated-process class library](dotnet-isolated-process-guide.md):

```terminal
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.<BINDING_TYPE_NAME> --version <TARGET_VERSION>
```

### [In-process](#tab/in-process)

Run the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the Terminal window to install the extension packages that you need in your project. This template demonstrates how you add a binding for an [in-process class library](functions-dotnet-class-library.md):

```terminal
dotnet add package Microsoft.Azure.WebJobs.Extensions.<BINDING_TYPE_NAME> --version <TARGET_VERSION>
```

---

Replace `<BINDING_TYPE_NAME>` with the name of the package that contains the binding you need. You can find the desired binding reference article in the [list of supported bindings](./functions-triggers-bindings.md#supported-bindings).

Replace `<TARGET_VERSION>` in the example with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org). The major versions that correspond to the current  Functions runtime are specified in the reference article for the binding.

C# script uses [extension bundles](functions-bindings-register.md#extension-bundles).

::: zone-end  
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript"
[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

If for some reason you can't use an extension bundle to install binding extensions for your project, see [Explicitly install extensions](functions-bindings-register.md#explicitly-install-extensions).
::: zone-end  


## Monitoring functions

When you [run functions locally](#run-functions-locally), log data is streamed to the Terminal console. You can also get log data when your Functions project is running in a function app in Azure. You can connect to streaming logs in Azure to see near-real-time log data. You should enable Application Insights for a more complete understanding of how your function app is behaving.

### Streaming logs

When you're developing an application, it's often useful to see logging information in near-real time. You can view a stream of log files being generated by your functions. This output is an example of streaming logs for a request to an HTTP-triggered function:

:::image type="content" source="media/functions-develop-vs-code/streaming-logs-vscode-console.png" alt-text="Screenshot for streaming logs output for H T T P trigger.":::

To learn more, see [Streaming logs](functions-monitoring.md?tabs=vs-code#streaming-logs).

### Application Insights

You should monitor the execution of your functions by integrating your function app with Application Insights. When you create a function app in the Azure portal, this integration occurs by default. When you create your function app during Visual Studio publishing, you need to integrate Application Insights yourself. To learn how, see [Enable Application Insights integration](configure-monitoring.md#enable-application-insights-integration).

To learn more about monitoring using Application Insights, see [Monitor Azure Functions](functions-monitoring.md).

[!INCLUDE [functions-x86-emulation-on-arm64](../../includes/functions-x86-emulation-on-arm64.md)]

### Enable emulation in Visual Studio Code

Now that you've configured the Terminal with Rosetta to run x86 emulation for Python development, you can use the following steps to integrate this terminal emulation with Visual Studio Code:

1.  Open the Command Palette by pressing Cmd+Shift+P, select **Preferences: Open Settings (JSON)**, and add the following JSON to your configuration:

    ```json
    "terminal.integrated.profiles.osx": {
           "rosetta": {
             "path": "arch",
             "args": ["-x86_64", "zsh", "-l"],
             "overrideName": true
           }
         }
    ```
1. Open a new Terminal and choose **rosetta**.

    ![Screenshot of starting a new Rosetta terminal in Visual Studio Code.](./media/functions-develop-vs-code/vs-code-rosetta.png)


::: zone pivot="programming-language-csharp" 
## C\# script projects

By default, all C# projects are created as [C# compiled class library projects](functions-dotnet-class-library.md). If you prefer to work with C# script projects instead, you must select C# script as the default language in the Azure Functions extension settings:

1. Select **File** > **Preferences** > **Settings**.

1. Go to **User Settings** > **Extensions** > **Azure Functions**.

1. Select **C#Script** from **Azure Function: Project Language**.

After you complete these steps, calls made to the underlying Core Tools include the `--csx` option, which generates and publishes C# script (.csx) project files. When you have this default language specified, all projects that you create default to C# script projects. You're not prompted to choose a project language when a default is set. To create projects in other languages, you must change this setting or remove it from the user settings.json file. After you remove this setting, you're again prompted to choose your language when you create a project.
::: zone-end

## Command palette reference

The Azure Functions extension provides a useful graphical interface in the area for interacting with your function apps in Azure. The same functionality is also available as commands in the command palette (F1). These Azure Functions commands are available:

|Azure Functions command  | Description  |
|---------|---------|
|**Add New Settings**  |  Creates a new application setting in Azure. To learn more, see [Publish application settings](#publish-application-settings). You might also need to [download this setting to your local settings](#download-settings-from-azure). |
| **Configure Deployment Source** | Connects your function app in Azure to a local Git repository. To learn more, see [Continuous deployment for Azure Functions](functions-continuous-deployment.md). |
| **Connect to GitHub Repository** | Connects your function app to a GitHub repository. |
| **Copy Function URL** | Gets the remote URL of an HTTP-triggered function that's running in Azure. To learn more, see [Get the URL of the deployed function](#get-the-url-of-the-deployed-function). |
| **Create function app in Azure** | Creates a new function app in your subscription in Azure. To learn more, see the section on how to [publish to a new function app in Azure](#publish-to-azure).        |
| **Decrypt Settings** | Decrypts [local settings](#local-settings) that have been encrypted by **Azure Functions: Encrypt Settings**.  |
| **Delete Function App** | Removes a function app from your subscription in Azure. When there are no other apps in the App Service plan, you're given the option to delete that too. Other resources, like storage accounts and resource groups, aren't deleted. To remove all resources, you should instead [delete the resource group](functions-add-output-binding-storage-queue-vs-code.md#clean-up-resources). Your local project isn't affected. |
|**Delete Function**  | Removes an existing function from a function app in Azure. Because this deletion doesn't affect your local project, instead consider removing the function locally and then [republishing your project](#republish-project-files). |
| **Delete Proxy** | Removes an Azure Functions proxy from your function app in Azure. To learn more about proxies, see [Work with Azure Functions Proxies](functions-proxies.md). |
| **Delete Setting** | Deletes a function app setting in Azure. This deletion doesn't affect settings in your local.settings.json file. |
| **Disconnect from Repo**  | Removes the [continuous deployment](functions-continuous-deployment.md) connection between a function app in Azure and a source control repository. |
| **Download Remote Settings** | Downloads settings from the chosen function app in Azure into your local.settings.json file. If the local file is encrypted, it's decrypted, updated, and encrypted again. If there are settings that have conflicting values in the two locations, you're prompted to choose how to proceed. Be sure to save changes to your local.settings.json file before you run this command. |
| **Edit settings** | Changes the value of an existing function app setting in Azure. This command doesn't affect settings in your local.settings.json file.  |
| **Encrypt settings** | Encrypts individual items in the `Values` array in the [local settings](#local-settings). In this file, `IsEncrypted` is also set to `true`, which specifies that the local runtime decrypt settings before using them. Encrypt local settings to reduce the risk of leaking valuable information. In Azure, application settings are always stored encrypted. |
| **Execute Function Now** | Manually starts a function using admin APIs. This command is used for testing, both locally during debugging and against functions running in Azure. When a function in Azure starts, the extension first automatically obtains an admin key, which it uses to call the remote admin APIs that start functions in Azure. The body of the message sent to the API depends on the type of trigger. Timer triggers don't require you to pass any data. |
| **Initialize Project for Use with VS Code** | Adds the required Visual Studio Code project files to an existing Functions project. Use this command to work with a project that you created by using Core Tools. |
| **Install or Update Azure Functions Core Tools** | Installs or updates [Azure Functions Core Tools], which is used to run functions locally. |
| **Redeploy**  | Lets you redeploy project files from a connected Git repository to a specific deployment in Azure. To republish local updates from Visual Studio Code, [republish your project](#republish-project-files). |
| **Rename Settings** | Changes the key name of an existing function app setting in Azure. This command doesn't affect settings in your local.settings.json file. After you rename settings in Azure, you should [download those changes to the local project](#download-settings-from-azure). |
| **Restart** | Restarts the function app in Azure. Deploying updates also restarts the function app. |
| **Set AzureWebJobsStorage**| Sets the value of the `AzureWebJobsStorage` application setting. This setting is required by Azure Functions. It's set when a function app is created in Azure. |
| **Start** | Starts a stopped function app in Azure. |
| **Start Streaming Logs** | Starts the streaming logs for the function app in Azure. Use streaming logs during remote troubleshooting in Azure if you need to see logging information in near-real time. To learn more, see [Streaming logs](#streaming-logs). |
| **Stop** | Stops a function app that's running in Azure. |
| **Stop Streaming Logs** | Stops the streaming logs for the function app in Azure. |
| **Toggle as Slot Setting** | When enabled, ensures that an application setting persists for a given deployment slot. |
| **Uninstall Azure Functions Core Tools** | Removes Azure Functions Core Tools, which is required by the extension. |
| **Upload Local Settings** | Uploads settings from your local.settings.json file to the chosen function app in Azure. If the local file is encrypted, it's decrypted, uploaded, and encrypted again. If there are settings that have conflicting values in the two locations, you're prompted to choose how to proceed. Be sure to save changes to your local.settings.json file before you run this command. |
| **View Commit in GitHub** | Shows you the latest commit in a specific deployment when your function app is connected to a repository. |
| **View Deployment Logs** | Shows you the logs for a specific deployment to the function app in Azure. |

## Next steps

To learn more about Azure Functions Core Tools, see [Work with Azure Functions Core Tools](functions-run-local.md).

To learn more about developing functions as .NET class libraries, see [Azure Functions C# developer reference](functions-dotnet-class-library.md). This article also provides links to examples of how to use attributes to declare the various types of bindings supported by Azure Functions.

[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
[Azure Functions Core Tools]: functions-run-local.md
