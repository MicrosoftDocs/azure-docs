---
title: Work with Azure Functions Core Tools 
description: Learn how to code and test Azure Functions from the command prompt or terminal on your local computer before you run them on Azure Functions.
ms.assetid: 242736be-ec66-4114-924b-31795fd18884
ms.topic: conceptual
ms.date: 10/05/2021
ms.custom: "devx-track-csharp, 80e4ff38-5174-43"
---

# Work with Azure Functions Core Tools

Azure Functions Core Tools lets you develop and test your functions on your local computer from the command prompt or terminal. Your local functions can connect to live Azure services, and you can debug your functions on your local computer using the full Functions runtime. You can even deploy a function app to your Azure subscription.

[!INCLUDE [Don't mix development environments](../../includes/functions-mixed-dev-environments.md)]

Developing functions on your local computer and publishing them to Azure using Core Tools follows these basic steps:

> [!div class="checklist"]
> * [Install the Core Tools and dependencies.](#v2)
> * [Create a function app project from a language-specific template.](#create-a-local-functions-project)
> * [Register trigger and binding extensions.](#register-extensions)
> * [Define Storage and other connections.](#local-settings)
> * [Create a function from a trigger and language-specific template.](#create-func)
> * [Run the function locally.](#start)
> * [Publish the project to Azure.](#publish)

## Prerequisites

The specific prerequisites for Core Tools depend on the features you plan to use:

**[Publish](#publish)**: Core Tools currently depends on either the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-az-ps) for authenticating with your Azure account. This means that you must install one of these tools to be able to [publish to Azure](#publish) from Azure Functions Core Tools. 

**[Install extensions](#install-extensions)**: To manually install extensions by using Core Tools, you must have the [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download) installed. The .NET Core SDK is used by Core Tools to install extensions from NuGet. You don't need to know .NET to use Azure Functions extensions.

## <a name="v2"></a>Core Tools versions

There are four versions of Azure Functions Core Tools. The version you use depends on your local development environment, [choice of language](supported-languages.md), and level of support required.

Choose a version tab below to learn about each specific version and for detailed installation instructions:

# [Version 4.x](#tab/v4)

Supports [version 4.x](functions-versions.md) of the Functions runtime. This version supports Windows, macOS, and Linux, and uses platform-specific package managers or npm for installation. This is the recommended version of the Functions runtime and Core Tools.

# [Version 3.x](#tab/v3)

Supports [version 3.x](functions-versions.md) of the Azure Functions runtime. This version supports Windows, macOS, and Linux, and uses platform-specific package managers or npm for installation. 

# [Version 2.x](#tab/v2)

Supports [version 2.x](functions-versions.md) of the Azure Functions runtime. This version supports Windows, macOS, and Linux, and uses platform-specific package managers or npm for installation. 

# [Version 1.x](#tab/v1) 

Supports version 1.x of the Azure Functions runtime. This version of the tools is only supported on Windows computers and is installed from an [npm package](https://www.npmjs.com/package/azure-functions-core-tools).

---

You can only install one version of Core Tools on a given computer.  Unless otherwise noted, the examples in this article are for version 3.x.

## Install the Azure Functions Core Tools

[Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools) includes a version of the same runtime that powers Azure Functions runtime that you can run on your local development computer. It also provides commands to create functions, connect to Azure, and deploy function projects.

Starting with version 2.x, Core Tools runs on [Windows](?tabs=windows#v2), [macOS](?tabs=macos#v2), and [Linux](?tabs=linux#v2).

# [Windows](#tab/windows/v4)

The following steps use a Windows installer (MSI) to install Core Tools v4.x. For more information about other package-based installers, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md#windows).

Download and run the Core Tools installer, based on your version of Windows:

- [v4.x - Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2174087) (Recommended. [Visual Studio Code debugging](functions-develop-vs-code.md#debugging-functions-locally) requires 64-bit.)
- [v4.x - Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2174159)

# [Windows](#tab/windows/v3)

The following steps use a Windows installer (MSI) to install Core Tools v3.x. For more information about other package-based installers, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/master/README.md#windows).

Download and run the Core Tools installer, based on your version of Windows:

- [v3.x - Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2135274) (Recommended. [Visual Studio Code debugging](functions-develop-vs-code.md#debugging-functions-locally) requires 64-bit.)
- [v3.x - Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2135275)

# [Windows](#tab/windows/v2)

Installing version 2.x of the Core Tools requires npm. You can also [use Chocolatey to install the package](https://github.com/Azure/azure-functions-core-tools/blob/master/README.md#azure-functions-core-tools).

1. If you haven't already done so, [install Node.js with npm](https://nodejs.org/en/download/). 

1. Run the following npm command to install the Core Tools package:

    ```
    npm install -g azure-functions-core-tools@2 --unsafe-perm true
    ```

# [Windows](#tab/windows/v1)

If you need to install version 1.x of the Core Tools, see the [GitHub repository](https://github.com/Azure/azure-functions-core-tools/blob/v1.x/README.md#installing) for more information.

# [macOS](#tab/macos/v4)

The following steps use Homebrew to install the Core Tools on macOS.

1. Install [Homebrew](https://brew.sh/), if it's not already installed.

1. Install the Core Tools package:

    ```bash
    brew tap azure/functions
    brew install azure-functions-core-tools@4
    # if upgrading on a machine that has 2.x or 3.x installed:
    brew link --overwrite azure-functions-core-tools@4
    ```

# [macOS](#tab/macos/v3)

The following steps use Homebrew to install the Core Tools on macOS.

1. Install [Homebrew](https://brew.sh/), if it's not already installed.

1. Install the Core Tools package:

    ```bash
    brew tap azure/functions
    brew install azure-functions-core-tools@3
    # if upgrading on a machine that has 2.x installed:
    brew link --overwrite azure-functions-core-tools@3
    ```

# [macOS](#tab/macos/v2)

The following steps use Homebrew to install the Core Tools on macOS.

1. Install [Homebrew](https://brew.sh/), if it's not already installed.

1. Install the Core Tools package:

    ```bash
    brew tap azure/functions
    brew install azure-functions-core-tools@2
    ```

# [macOS](#tab/macos/v1)

Version 1.x of the Core Tools isn't supported on macOS. Use version 2.x or a later version on macOS.

# [Linux](#tab/linux/v4)

[!INCLUDE [functions-core-tools-linux-install](../../includes/functions-core-tools-linux-install.md)]

5. Install the Core Tools package:

    ```bash
    sudo apt-get install azure-functions-core-tools-4
    ```

# [Linux](#tab/linux/v3)

[!INCLUDE [functions-core-tools-linux-install](../../includes/functions-core-tools-linux-install.md)]

5. Install the Core Tools package:

    ```bash
    sudo apt-get install azure-functions-core-tools-3
    ```

# [Linux](#tab/linux/v2)

[!INCLUDE [functions-core-tools-linux-install](../../includes/functions-core-tools-linux-install.md)]

5. Install the Core Tools package:

    ```bash
    sudo apt-get install azure-functions-core-tools-2
    ```

# [Linux](#tab/linux/v1)

Version 1.x of the Core Tools isn't supported on Linux. Use version 2.x or a later version on Linux.

---

## Changing Core Tools versions

When changing to a different version of Core Tools, you should use the same package manager as the original installation to move to a different package version. For example, if you installed Core Tools version 2.x using npm, you should use the following command to upgrade to version 3.x:

```bash
npm install -g azure-functions-core-tools@3 --unsafe-perm true
```

If you used Windows installer (MSI) to install Core Tools on Windows, you should uninstall the old version from Add Remove Programs before installing a different version.

## Create a local Functions project

A Functions project directory contains the following files and folders, regardless of language: 

| File name | Description |
| --- | --- |
| host.json | To learn more, see the [host.json reference](functions-host-json.md). |
| local.settings.json | Settings used by Core Tools when running locally, including app settings. To learn more, see [local settings](#local-settings). |
| .gitignore | Prevents the local.settings.json file from being accidentally published to a Git repository. To learn more, see [local settings](#local-settings)|
| .vscode\extensions.json | Settings file used when opening the project folder in Visual Studio Code.  |

To learn more about the Functions project folder, see the [Azure Functions developers guide](functions-reference.md#folder-structure).

In the terminal window or from a command prompt, run the following command to create the project and local Git repository:

```
func init MyFunctionProj
```

This example creates a Functions project in a new `MyFunctionProj` folder. You are prompted to choose a default language for your project. 

The following considerations apply to project initialization:

+ If you don't provide the `--worker-runtime` option in the command, you're prompted to choose your language. For more information, see the [func init reference](functions-core-tools-reference.md#func-init).

+ When you don't provide a project name, the current folder is initialized. 

+ If you plan to publish your project to a custom Linux container, use the `--docker` option to make sure that a Dockerfile is generated for your project. To learn more, see [Create a function on Linux using a custom image](functions-create-function-linux-custom-image.md). 

Certain languages may have additional considerations:

# [C\#](#tab/csharp)

+ By default, version 2.x and later versions of the Core Tools create function app projects for the .NET runtime as [C# class projects](functions-dotnet-class-library.md) (.csproj). Version 3.x also supports creating functions that [run on .NET 5.0 in an isolated process](dotnet-isolated-process-guide.md). These C# projects, which can be used with Visual Studio or Visual Studio Code, are compiled during debugging and when publishing to Azure. 

+ Use the `--csx` parameter if you want to work locally with C# script (.csx) files. These are the same files you get when you create functions in the Azure portal and when using version 1.x of Core Tools. To learn more, see the [func init reference](functions-core-tools-reference.md#func-init).

# [Java](#tab/java)

+ Java uses a Maven archetype to create the local Functions project, along with your first HTTP triggered function. Instead of using `func init` and `func new`, you should follow the steps in the [Command line quickstart](./create-first-function-cli-java.md).  

# [JavaScript](#tab/node)

+ To use a `--worker-runtime` value of `node`, specify the `--language` as `javascript`. 

# [PowerShell](#tab/powershell)

There are no additional considerations for PowerShell.

# [Python](#tab/python)

+ You should run all commands, including `func init`, from inside a virtual environment. To learn more, see [Create and activate a virtual environment](create-first-function-cli-python.md#create-venv).

# [TypeScript](#tab/ts)

+ To use a `--worker-runtime` value of `node`, specify the `--language` as `javascript`.

+ See the [TypeScript section in the JavaScript developer reference](functions-reference-node.md#typescript) for `func init` behaviors specific to TypeScript. 

--- 

## Register extensions

Starting with runtime version 2.x, [Functions triggers and bindings](functions-triggers-bindings.md) are implemented as .NET extension (NuGet) packages. For compiled C# projects, you simply reference the NuGet extension packages for the specific triggers and bindings you are using. HTTP bindings and timer triggers don't require extensions. 

To improve the development experience for non-C# projects, Functions lets you reference a versioned extension bundle in your host.json project file. [Extension bundles](functions-bindings-register.md#extension-bundles) makes all extensions available to your app and removes the chance of having package compatibility issues between extensions. Extension bundles also removes the requirement of installing the .NET Core 3.1 SDK and having to deal with the extensions.csproj file. 

Extension bundles is the recommended approach for functions projects other than C# complied projects, as well as C# script. For these projects, the extension bundle setting is generated in the _host.json_ file during initialization. If bundles aren't enabled, you need to update the project's host.json file.

[!INCLUDE [Register extensions](../../includes/functions-extension-bundles.md)]

To learn more, see [Register Azure Functions binding extensions](functions-bindings-register.md#extension-bundles). 

There may be cases in a non-.NET project when you can't use extension bundles, such as when you need to target a specific version of an extension not in the bundle. In these rare cases, you can use Core Tools to locally install the specific extension packages required by your project. To learn more, see [Install extensions](#install-extensions).

[!INCLUDE [functions-local-settings-file](../../includes/functions-local-settings-file.md)]

By default, these settings are not migrated automatically when the project is published to Azure. Use the [`--publish-local-settings` option][func azure functionapp publish] when you publish to make sure these settings are added to the function app in Azure. Values in the `ConnectionStrings` section are never published.

The function app settings values can also be read in your code as environment variables. For more information, see the Environment variables section of these language-specific reference topics:

* [C# precompiled](functions-dotnet-class-library.md#environment-variables)
* [C# script (.csx)](functions-reference-csharp.md#environment-variables)
* [Java](functions-reference-java.md#environment-variables)
* [JavaScript](functions-reference-node.md#environment-variables)
* [PowerShell](functions-reference-powershell.md#environment-variables)
* [Python](functions-reference-python.md#environment-variables)

When no valid storage connection string is set for [`AzureWebJobsStorage`] and a local storage emulator isn't being used, the following error message is shown:

> Missing value for AzureWebJobsStorage in local.settings.json. This is required for all triggers other than HTTP. You can run 'func azure functionapp fetch-app-settings \<functionAppName\>' or specify a connection string in local.settings.json.

### Get your storage connection strings

Even when using the [Azurite storage emulator](functions-develop-local.md#local-storage-emulator) for development, you may want to run locally with an actual storage connection. Assuming you have already [created a storage account](../storage/common/storage-account-create.md), you can get a valid storage connection string in one of several ways:

# [Portal](#tab/portal)

1. From the [Azure portal], search for and select **Storage accounts**. 

    ![Select Storage accounts from Azure portal](./media/functions-run-local/select-storage-accounts.png)
  
1.  Select your storage account, select **Access keys** in **Settings**, then copy one of the **Connection string** values.

    ![Copy connection string from Azure portal](./media/functions-run-local/copy-storage-connection-portal.png)

# [Core Tools](#tab/azurecli)

From the project root, use one of the following commands to download the connection string from Azure:

  + Download all settings from an existing function app:

    ```
    func azure functionapp fetch-app-settings <FunctionAppName>
    ```

  + Get the Connection string for a specific storage account:

    ```
    func azure storage fetch-connection-string <StorageAccountName>
    ```

    When you aren't already signed in to Azure, you're prompted to do so. These commands overwrite any existing settings in the local.settings.json file. To learn more, see the [`func azure functionapp fetch-app-settings`](functions-core-tools-reference.md#func-azure-functionapp-fetch-app-settings) and [`func azure storage fetch-connection-string`](functions-core-tools-reference.md#func-azure-storage-fetch-connection-string) commands.

# [Storage Explorer](#tab/storageexplorer)

1. Run [Azure Storage Explorer](https://storageexplorer.com/). 

1. In the **Explorer**, expand your subscription, then expand **Storage Accounts**.

1. Select your storage account and copy the primary or secondary connection string.

    ![Copy connection string from Storage Explorer](./media/functions-run-local/storage-explorer.png)

---

## <a name="create-func"></a>Create a function

To create a function in an existing project, run the following command:

```
func new
```

In version 3.x/2.x, when you run `func new` you are prompted to choose a template in the default language of your function app. Next, you're prompted to choose a name for your function. In version 1.x, you are also required to choose the language. 

You can also specify the function name and template in the `func new` command. The following example uses the `--template` option to create an HTTP trigger named `MyHttpTrigger`:

```
func new --template "Http Trigger" --name MyHttpTrigger
```

This example creates a Queue Storage trigger named `MyQueueTrigger`:

```
func new --template "Azure Queue Storage Trigger" --name MyQueueTrigger
```

To learn more, see the [`func new` command](functions-core-tools-reference.md#func-new).

## <a name="start"></a>Run functions locally

To run a Functions project, you run the Functions host from the root directory of your project. The host enables triggers for all functions in the project. The [`start` command](functions-core-tools-reference.md#func-start) varies depending on your project language.

# [C\#](#tab/csharp)

```
func start
```

# [Java](#tab/java)

```
mvn clean package 
mvn azure-functions:run
```

# [JavaScript](#tab/node)

```
func start
```


# [PowerShell](#tab/powershell)

```
func start
```

# [Python](#tab/python)

```
func start
```
This command must be [run in a virtual environment](./create-first-function-cli-python.md).

# [TypeScript](#tab/ts)

```
npm install
npm start     
```

---

>[!NOTE]  
> Version 1.x of the Functions runtime instead requires `func host start`. To learn more, see [Azure Functions Core Tools reference](functions-core-tools-reference.md?tabs=v1#func-start). 

When the Functions host starts, it outputs the URL of HTTP-triggered functions, like in the following example:

<pre>
Found the following functions:
Host.Functions.MyHttpTrigger

Job host started
Http Function MyHttpTrigger: http://localhost:7071/api/MyHttpTrigger
</pre>

>[!IMPORTANT]
>When running locally, authorization isn't enforced for HTTP endpoints. This means that all local HTTP requests are handled as `authLevel = "anonymous"`. For more information, see the [HTTP binding article](functions-bindings-http-webhook-trigger.md#authorization-keys).

### Passing test data to a function

To test your functions locally, you [start the Functions host](#start) and call endpoints on the local server using HTTP requests. The endpoint you call depends on the type of function.

>[!NOTE]
> Examples in this topic use the cURL tool to send HTTP requests from the terminal or a command prompt. You can use a tool of your choice to send HTTP requests to the local server. The cURL tool is available by default on Linux-based systems and Windows 10 build 17063 and later. On older Windows, you must first download and install the [cURL tool](https://curl.haxx.se/).

For more general information on testing functions, see [Strategies for testing your code in Azure Functions](functions-test-a-function.md).

#### HTTP and webhook triggered functions

You call the following endpoint to locally run HTTP and webhook triggered functions:

```
http://localhost:{port}/api/{function_name}
```

Make sure to use the same server name and port that the Functions host is listening on. You see this in the output generated when starting the Function host. You can call this URL using any HTTP method supported by the trigger.

The following cURL command triggers the `MyHttpTrigger` quickstart function from a GET request with the _name_ parameter passed in the query string.

```
curl --get http://localhost:7071/api/MyHttpTrigger?name=Azure%20Rocks
```

The following example is the same function called from a POST request passing _name_ in the request body:

# [Bash](#tab/bash)
```bash
curl --request POST http://localhost:7071/api/MyHttpTrigger --data '{"name":"Azure Rocks"}'
```
# [Cmd](#tab/cmd)
```cmd
curl --request POST http://localhost:7071/api/MyHttpTrigger --data "{'name':'Azure Rocks'}"
```
---

You can make GET requests from a browser passing data in the query string. For all other HTTP methods, you must use cURL, Fiddler, Postman, or a similar HTTP testing tool that supports POST requests.

#### Non-HTTP triggered functions

For all functions other than HTTP and Event Grid triggers, you can test your functions locally using REST by calling a special endpoint called an _administration endpoint_. Calling this endpoint with an HTTP POST request on the local server triggers the function. 

To test Event Grid triggered functions locally, see [Local testing with viewer web app](event-grid-how-tos.md#local-testing-with-viewer-web-app).

You can optionally pass test data to the execution in the body of the POST request. This functionality is similar to the **Test** tab in the Azure portal.

You call the following administrator endpoint to trigger non-HTTP functions:

```
http://localhost:{port}/admin/functions/{function_name}
```

To pass test data to the administrator endpoint of a function, you must supply the data in the body of a POST request message. The message body is required to have the following JSON format:

```JSON
{
    "input": "<trigger_input>"
}
```

The `<trigger_input>` value contains data in a format expected by the function. The following cURL example is a POST to a `QueueTriggerJS` function. In this case, the input is a string that is equivalent to the message expected to be found in the queue.

# [Bash](#tab/bash)
```bash
curl --request POST -H "Content-Type:application/json" --data '{"input":"sample queue data"}' http://localhost:7071/admin/functions/QueueTrigger
```
# [Cmd](#tab/cmd)
```bash
curl --request POST -H "Content-Type:application/json" --data "{'input':'sample queue data'}" http://localhost:7071/admin/functions/QueueTrigger
```
---

When you call an administrator endpoint on your function app in Azure, you must provide an access key. To learn more, see [Function access keys](functions-bindings-http-webhook-trigger.md#authorization-keys).

## <a name="publish"></a>Publish to Azure

The Azure Functions Core Tools supports two types of deployment:

| Deployment type | Command | Description |
| ----- | ----- | ----- |
| Project files | [`func azure functionapp publish`](functions-core-tools-reference.md#func-azure-functionapp-publish) | Deploys function project files directly to your function app using [zip deployment](functions-deployment-technologies.md#zip-deploy). |
| Kubernetes cluster | `func kubernetes deploy` | Deploys your Linux function app as a custom Docker container to a Kubernetes cluster. | 

### Before you publish 

>[!IMPORTANT]
>You must have the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-az-ps) installed locally to be able to publish to Azure from Core Tools.  

A project folder may contain language-specific files and directories that shouldn't be published. Excluded items are listed in a .funcignore file in the root project folder.  

You must have already [created a function app in your Azure subscription](functions-cli-samples.md#create), to which you'll deploy your code. Projects that require compilation should be built so that the binaries can be deployed.

To learn how to create a function app from the command prompt or terminal window using the Azure CLI or Azure PowerShell, see [Create a Function App for serverless execution](./scripts/functions-cli-create-serverless.md). 

>[!IMPORTANT]
> When you create a function app in the Azure portal, it uses version 3.x of the Function runtime by default. To make the function app use version 1.x of the runtime, follow the instructions in [Run on version 1.x](functions-versions.md#creating-1x-apps).
> You can't change the runtime version for a function app that has existing functions.


### <a name="project-file-deployment"></a>Deploy project files

To publish your local code to a function app in Azure, use the `publish` command:

```
func azure functionapp publish <FunctionAppName>
```

The following considerations apply to this kind of deployment:

+ Publishing overwrites existing files in the function app.

+ Use the [`--publish-local-settings` option][func azure functionapp publish] to automatically create app settings in your function app based on values in the local.settings.json file.  

+ A [remote build](functions-deployment-technologies.md#remote-build) is performed on compiled projects. This can be controlled by using the [`--no-build` option][func azure functionapp publish].  

+ Your project is deployed such that it [runs from the deployment package](run-functions-from-deployment-package.md). To disable this recommended deployment mode, use the [`--nozip` option][func azure functionapp publish].

+ Java uses Maven to publish your local project to Azure. Instead, use the following command to publish to Azure: `mvn azure-functions:deploy`. Azure resources are created during initial deployment.

+ You'll get an error if you try to publish to a `<FunctionAppName>` that doesn't exist in your subscription. 

### Kubernetes cluster

Functions also lets you define your Functions project to run in a Docker container. Use the [`--docker` option][func init] of `func init` to generate a Dockerfile for your specific language. This file is then used when creating a container to deploy. To learn how to publish a custom container to Azure without Kubernetes, see [Create a function on Linux using a custom container](functions-create-function-linux-custom-image.md).

Core Tools can be used to deploy your project as a custom container image to a Kubernetes cluster. 

The following command uses the Dockerfile to generate a container and deploy it to a Kubernetes cluster. 

```command
func kubernetes deploy --name <DEPLOYMENT_NAME> --registry <REGISTRY_USERNAME> 
```

To learn more, see [Deploying a function app to Kubernetes](functions-kubernetes-keda.md#deploying-a-function-app-to-kubernetes). 

## Install extensions

If you aren't able to use [extension bundles](functions-bindings-register.md#extension-bundles), you can use Azure Functions Core Tools locally to install the specific extension packages required by your project.

> [!IMPORTANT]
> You can't explicitly install extensions in a function app with extension bundles enabled. First, remove the `extensionBundle` section in *host.json* before explicitly installing extensions.

The following items describe some reasons you might need to install extensions manually:

* You need to access a specific version of an extension not available in a bundle.
* You need to access a custom extension not available in a bundle.
* You need to access a specific combination of extensions not available in a single bundle.

When you explicitly install extensions, a .NET project file named extensions.csproj is added to the root of your project. This file defines the set of NuGet packages required by your functions. While you can work with the [NuGet package references](/nuget/consume-packages/package-references-in-project-files) in this file, Core Tools lets you install extensions without having to manually edit this C# project file.

There are several ways to use Core Tools to install the required extensions in your local project. 

### Install all extensions 

Use the following command to automatically add all extension packages used by the bindings in your local project:

```command
func extensions install
```

The command reads the *function.json* file to see which packages you need, installs them, and rebuilds the extensions project (extensions.csproj). It adds any new bindings at the current version but doesn't update existing bindings. Use the `--force` option to update existing bindings to the latest version when installing new ones. To learn more, see the [`func extensions install` command](functions-core-tools-reference.md#func-extensions-install).

If your function app uses bindings or NuGet packages that Core Tools does not recognize, you must manually install the specific extension.

### Install a specific extension

Use the following command to install a specific extension package at a specific version, in this case the Storage extension:

```command
func extensions install --package Microsoft.Azure.WebJobs.Extensions.Storage --version 5.0.0
```

You can use this command to install any compatible NuGet package. To learn more, see the [`func extensions install` command](functions-core-tools-reference.md#func-extensions-install).

## Monitoring functions

The recommended way to monitor the execution of your functions is by integrating with Azure Application Insights. You can also stream execution logs to your local computer. To learn more, see [Monitor Azure Functions](functions-monitoring.md).

### Application Insights integration

Application Insights integration should be enabled when you create your function app in Azure. If for some reason your function app isn't connected to an Application Insights instance, it's easy to do this integration in the Azure portal. To learn more, see [Enable Application Insights integration](configure-monitoring.md#enable-application-insights-integration).

### Enable streaming logs

You can view a stream of log files being generated by your functions in a command-line session on your local computer. 

[!INCLUDE [functions-streaming-logs-core-tools](../../includes/functions-streaming-logs-core-tools.md)]

This type of streaming logs requires that Application Insights integration be enabled for your function app.   


## Next steps

Learn how to [develop, test, and publish Azure functions by using Azure Functions core tools](/training/modules/develop-test-deploy-azure-functions-with-core-tools/). Azure Functions Core Tools is [open source and hosted on GitHub](https://github.com/azure/azure-functions-cli). To file a bug or feature request, [open a GitHub issue](https://github.com/azure/azure-functions-cli/issues).

<!-- LINKS -->

[Azure Functions Core Tools]: https://www.npmjs.com/package/azure-functions-core-tools
[Azure portal]: https://portal.azure.com 
[Node.js]: https://docs.npmjs.com/getting-started/installing-node#osx-or-windows
[`FUNCTIONS_WORKER_RUNTIME`]: functions-app-settings.md#functions_worker_runtime
[`AzureWebJobsStorage`]: functions-app-settings.md#azurewebjobsstorage
[extension bundles]: functions-bindings-register.md#extension-bundles
[func azure functionapp publish]: functions-core-tools-reference.md?tabs=v2#func-azure-functionapp-publish
[func init]: functions-core-tools-reference.md?tabs=v2#func-init
