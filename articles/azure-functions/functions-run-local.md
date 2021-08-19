---
title: Work with Azure Functions Core Tools 
description: Learn how to code and test Azure Functions from the command prompt or terminal on your local computer before you run them on Azure Functions.
ms.assetid: 242736be-ec66-4114-924b-31795fd18884
ms.topic: conceptual
ms.date: 07/27/2021
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

## Core Tools versions

There are three versions of Azure Functions Core Tools.<sup>*</sup> The version you use depends on your local development environment, [choice of language](supported-languages.md), and level of support required:

+ [**Version 3.x/2.x**](#v2): Supports either [version 3.x or 2.x of the Azure Functions runtime](functions-versions.md). These versions support [Windows](?tabs=windows#v2), [macOS](?tabs=macos#v2), and [Linux](?tabs=linux#v2) and use platform-specific package managers or npm for installation.

+ **Version 1.x**: Supports version 1.x of the Azure Functions runtime. This version of the tools is only supported on Windows computers and is installed from an [npm package](https://www.npmjs.com/package/azure-functions-core-tools).

You can only install one version of Core Tools on a given computer. Unless otherwise noted, the examples in this article are for version 3.x.

<sup>*</sup> An experimental version of Azure Functions is available that lets you run C# functions on the .NET 6.0 preview. To learn more, see the [Azure Functions v4 early preview](https://aka.ms/functions-dotnet6earlypreview-wiki) page.

## Prerequisites

Azure Functions Core Tools currently depends on either the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-az-ps) for authenticating with your Azure account. 
This means that you must install one of these tools to be able to [publish to Azure](#publish) from Azure Functions Core Tools. 

## Install the Azure Functions Core Tools

[Azure Functions Core Tools] includes a version of the same runtime that powers Azure Functions runtime that you can run on your local development computer. It also provides commands to create functions, connect to Azure, and deploy function projects.

### <a name="v2"></a>Version 3.x and 2.x

Version 3.x/2.x of the tools uses the Azure Functions runtime that is built on .NET Core. This version is supported on all platforms .NET Core supports, including [Windows](?tabs=windows#v2), [macOS](?tabs=macos#v2), and [Linux](?tabs=linux#v2). 

> [!IMPORTANT]
> You can bypass the requirement for installing the .NET Core SDK by using [extension bundles].

# [Windows](#tab/windows)

The following steps use a Windows installer (MSI) to install Core Tools v3.x. For more information about other package-based installers, which are required to install Core Tools v2.x, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/master/README.md#windows).

1. Download and run the Core Tools installer, based on your version of Windows:

    - [v3.x - Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2135274) (Recommended. [Visual Studio Code debugging](functions-develop-vs-code.md#debugging-functions-locally) requires 64-bit.)
    - [v3.x - Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2135275)

1. If you don't plan to use [extension bundles](functions-bindings-register.md#extension-bundles), install the [.NET Core 3.x SDK for Windows](https://dotnet.microsoft.com/download).

# [macOS](#tab/macos)

The following steps use Homebrew to install the Core Tools on macOS.

1. Install [Homebrew](https://brew.sh/), if it's not already installed.

1. Install the Core Tools package:

    ##### v3.x (recommended)

    ```bash
    brew tap azure/functions
    brew install azure-functions-core-tools@3
    # if upgrading on a machine that has 2.x installed
    brew link --overwrite azure-functions-core-tools@3
    ```
    
    ##### v2.x

    ```bash
    brew tap azure/functions
    brew install azure-functions-core-tools@2
    ```
    
1. If you don't plan to use [extension bundles](functions-bindings-register.md#extension-bundles), install the [.NET Core 3.x SDK for macOS](https://dotnet.microsoft.com/download).

# [Linux](#tab/linux)

The following steps use [APT](https://wiki.debian.org/Apt) to install Core Tools on your Ubuntu/Debian Linux distribution. For other Linux distributions, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/master/README.md#linux).

1. Install the Microsoft package repository GPG key, to validate package integrity:

    ```bash
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
    sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
    ```

1. Set up the APT source list before doing an APT update.

    ##### Ubuntu

    ```bash
    sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-$(lsb_release -cs)-prod $(lsb_release -cs) main" > /etc/apt/sources.list.d/dotnetdev.list'
    ```

    ##### Debian

    ```bash
    sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/debian/$(lsb_release -rs | cut -d'.' -f 1)/prod $(lsb_release -cs) main" > /etc/apt/sources.list.d/dotnetdev.list'
    ```

1. Check the `/etc/apt/sources.list.d/dotnetdev.list` file for one of the appropriate Linux version strings listed below:

    | Linux distribution | Version |
    | --------------- | ----------- |
    | Debian 10 | `buster`  |
    | Debian 9  | `stretch` |
    | Ubuntu 20.04    | `focal`     |
    | Ubuntu 19.04    | `disco`     |
    | Ubuntu 18.10    | `cosmic`    |
    | Ubuntu 18.04    | `bionic`    |
    | Ubuntu 17.04    | `zesty`     |
    | Ubuntu 16.04/Linux Mint 18    | `xenial`  |

1. Start the APT source update:

    ```bash
    sudo apt-get update
    ```

1. Install the Core Tools package:

    ##### v3.x (recommended)
    ```bash
    sudo apt-get update
    sudo apt-get install azure-functions-core-tools-3
    ```
    
    ##### v2.x
    ```bash
    sudo apt-get update
    sudo apt-get install azure-functions-core-tools-2
    ```

1. If you don't plan to use [extension bundles](functions-bindings-register.md#extension-bundles), install [.NET Core 3.x SDK for Linux](https://dotnet.microsoft.com/download).

---

### Version 1.x

If you need to install version 1.x of the Core Tools, which runs only on Windows, see the [GitHub repository](https://github.com/Azure/azure-functions-core-tools/blob/v1.x/README.md#installing) for more information.

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

+ If you plan to publish your project to a custom Linux container, use the `--dockerfile` option to make sure that a Dockerfile is generated for your project. To learn more, see [Create a function on Linux using a custom image](functions-create-function-linux-custom-image.md). 

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

Starting with runtime version 2.x, Functions bindings are implemented as .NET extension (NuGet) packages. For compiled C# projects, you simply reference the NuGet extension packages for the specific triggers and bindings you are using. HTTP bindings and timer triggers don't require extensions. 

To improve the development experience for non-C# projects, Functions lets you reference a versioned extension bundle in your host.json project file. [Extension bundles](functions-bindings-register.md#extension-bundles) makes all extensions available to your app and removes the chance of having package compatibility issues between extensions. Extension bundles also removes the requirement of installing the .NET Core 2.x SDK and having to deal with the extensions.csproj file.

Extension bundles is the recommended approach for functions projects other than C# complied projects. For these projects, the extension bundle setting is generated in the _host.json_ file during initialization. If this works for you, you can skip this entire section.  

### Use extension bundles

[!INCLUDE [Register extensions](../../includes/functions-extension-bundles.md)]

 When supported by your language, extension bundles should already be enabled after you call `func init`. You should add extension bundles to the host.json before you add bindings to the function.json file. To learn more, see [Register Azure Functions binding extensions](functions-bindings-register.md#extension-bundles). 

### Explicitly install extensions

There may be cases in a non-.NET project when you can't use extension bundles, such as when you need to target a specific version of an extension not in the bundle. In these rare cases, you can use Core Tools to install locally the specific extension packages required by your project. To learn more, see [Explicitly install extensions](functions-bindings-register.md#explicitly-install-extensions).

[!INCLUDE [functions-local-settings-file](../../includes/functions-local-settings-file.md)]

By default, these settings are not migrated automatically when the project is published to Azure. Use the [`--publish-local-settings` option][func azure functionapp publish] when you publish to make sure these settings are added to the function app in Azure. Values in the `ConnectionStrings` section are never published.

The function app settings values can also be read in your code as environment variables. For more information, see the Environment variables section of these language-specific reference topics:

* [C# precompiled](functions-dotnet-class-library.md#environment-variables)
* [C# script (.csx)](functions-reference-csharp.md#environment-variables)
* [Java](functions-reference-java.md#environment-variables)
* [JavaScript](functions-reference-node.md#environment-variables)
* [PowerShell](functions-reference-powershell.md#environment-variables)
* [Python](functions-reference-python.md#environment-variables)

When no valid storage connection string is set for [`AzureWebJobsStorage`] and the emulator isn't being used, the following error message is shown:

> Missing value for AzureWebJobsStorage in local.settings.json. This is required for all triggers other than HTTP. You can run 'func azure functionapp fetch-app-settings \<functionAppName\>' or specify a connection string in local.settings.json.

### Get your storage connection strings

Even when using the Microsoft Azure Storage Emulator for development, you may want to run locally with an actual storage connection. Assuming you have already [created a storage account](../storage/common/storage-account-create.md), you can get a valid storage connection string in one of several ways:

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
func new --template "Queue Trigger" --name MyQueueTrigger
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

To test Event Grid triggered functions locally, see [Local testing with viewer web app](functions-bindings-event-grid-trigger.md#local-testing-with-viewer-web-app).

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

The Azure Functions Core Tools supports three types of deployment:

| Deployment type | Command | Description |
| ----- | ----- | ----- |
| Project files | [`func azure functionapp publish`](functions-core-tools-reference.md#func-azure-functionapp-publish) | Deploys function project files directly to your function app using [zip deployment](functions-deployment-technologies.md#zip-deploy). |
| Custom container | `func deploy` | Deploys your project to a Linux function app as a custom Docker container.  |
| Kubernetes cluster | `func kubernetes deploy` | Deploys your Linux function app as a customer Docker container to a Kubernetes cluster. | 

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

Functions also lets you define your Functions project to run in a Docker container. Use the [`--docker` option][func init] of `func init` to generate a Dockerfile for your specific language. This file is then used when creating a container to deploy. 

Core Tools can be used to deploy your project as a custom container image to a Kubernetes cluster. The command you use depends on the type of scaler used in the cluster.  

The following command uses the Dockerfile to generate a container and deploy it to a Kubernetes cluster. 

# [KEDA](#tab/keda)

```command
func kubernetes deploy --name <DEPLOYMENT_NAME> --registry <REGISTRY_USERNAME> 
```

To learn more, see [Deploying a function app to Kubernetes](functions-kubernetes-keda.md#deploying-a-function-app-to-kubernetes). 

# [Default/KNative](#tab/default)

```command
func deploy --name <FUNCTION_APP> --platform kubernetes --registry <REGISTRY_USERNAME> 
```

In the example above, replace `<FUNCTION_APP>` with the name of the function app in Azure and `<REGISTRY_USERNAME>` with your registry account name, such as you Docker username. The container is built locally and pushed to your Docker registry account with an image name based on `<FUNCTION_APP>`. You must have the Docker command line tools installed.

To learn more, see the [`func deploy` command](functions-core-tools-reference.md#func-deploy).

---

To learn how to publish a custom container to Azure without Kubernetes, see [Create a function on Linux using a custom container](functions-create-function-linux-custom-image.md).

## Monitoring functions

The recommended way to monitor the execution of your functions is by integrating with Azure Application Insights. You can also stream execution logs to your local computer. To learn more, see [Monitor Azure Functions](functions-monitoring.md).

### Application Insights integration

Application Insights integration should be enabled when you create your function app in Azure. If for some reason your function app isn't connected to an Application Insights instance, it's easy to do this integration in the Azure portal. To learn more, see [Enable Application Insights integration](configure-monitoring.md#enable-application-insights-integration).

### Enable streaming logs

You can view a stream of log files being generated by your functions in a command-line session on your local computer. 

[!INCLUDE [functions-streaming-logs-core-tools](../../includes/functions-streaming-logs-core-tools.md)]

This type of streaming logs requires that Application Insights integration be enabled for your function app.   


## Next steps

Learn how to develop, test, and publish Azure Functions by using Azure Functions Core Tools [Microsoft learn module](/learn/modules/develop-test-deploy-azure-functions-with-core-tools/)
Azure Functions Core Tools is [open source and hosted on GitHub](https://github.com/azure/azure-functions-cli).  
To file a bug or feature request, [open a GitHub issue](https://github.com/azure/azure-functions-cli/issues).

<!-- LINKS -->

[Azure Functions Core Tools]: https://www.npmjs.com/package/azure-functions-core-tools
[Azure portal]: https://portal.azure.com 
[Node.js]: https://docs.npmjs.com/getting-started/installing-node#osx-or-windows
[`FUNCTIONS_WORKER_RUNTIME`]: functions-app-settings.md#functions_worker_runtime
[`AzureWebJobsStorage`]: functions-app-settings.md#azurewebjobsstorage
[extension bundles]: functions-bindings-register.md#extension-bundles
[func azure functionapp publish]: functions-core-tools-reference.md?tabs=v2#func-azure-functionapp-publish
[func init]: functions-core-tools-reference.md?tabs=v2#func-init
