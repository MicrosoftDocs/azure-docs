---
title: Work with Azure Functions Core Tools 
description: Learn how to code and test Azure Functions from the command prompt or terminal on your local computer before you run them on Azure Functions.
ms.assetid: 242736be-ec66-4114-924b-31795fd18884
ms.topic: conceptual
ms.date: 07/30/2023
ms.custom: devx-track-csharp, 80e4ff38-5174-43, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions
---

# Work with Azure Functions Core Tools

Azure Functions Core Tools lets you develop and test your functions on your local computer. Core Tools includes a version of the same runtime that powers Azure Functions. This runtime means your local functions run as they would in Azure and can connect to live Azure services during local development and debugging. You can even deploy your code project to Azure using Core Tools.

[!INCLUDE [Don't mix development environments](../../includes/functions-mixed-dev-environments.md)]

Core Tools can be used with all [supported languages](supported-languages.md). Select your language at the top of the article.

::: zone pivot="programming-language-csharp"
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-csharp.md).
::: zone-end
::: zone pivot="programming-language-java"
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-java.md).
::: zone-end
::: zone pivot="programming-language-javascript"
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-node.md).
::: zone-end
::: zone pivot="programming-language-powershell"
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-python.md).
::: zone-end
::: zone pivot="programming-language-typescript"
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-typescript.md).
::: zone-end

Core Tools enables the integrated local development and debugging experience for your functions provided by both Visual Studio and Visual Studio Code. 

## Prerequisites

To be able to publish to Azure from Core Tools, you must have one of the following Azure tools installed locally: 

+ [Azure CLI](/cli/azure/install-azure-cli) 
+ [Azure PowerShell](/powershell/azure/install-azure-powershell)

These tools are required to authenticate with your Azure account from your local computer.

## <a name="v2"></a>Core Tools versions

Major versions of Azure Functions Core Tools are linked to specific major versions of the Azure Functions runtime. For example, version 4.x of Core Tools supports version 4.x of the Functions runtime. This is the recommended major version of both the Functions runtime and Core Tools. You can find the latest Core Tools release version on [this release page](https://github.com/Azure/azure-functions-core-tools/releases/latest). 

Run the following command to determine the version of your current Core Tools installation:

```command
func --version
``` 

Unless otherwise noted, the examples in this article are for version 4.x. 

The following considerations apply to Core Tools versions:

+ You can only install one version of Core Tools on a given computer. 

+ Version 2.x and 3.x of Core Tools were used with versions 2.x and 3.x of the Functions runtime, which have reached their end of life (EOL). For more information, see [Azure Functions runtime versions overview](functions-versions.md).  
::: zone pivot="programming-language-csharp,programming-language-javascript"  
+ Version 1.x of Core Tools is required when using version 1.x of the Functions Runtime, which is still supported. This version of Core Tools can only be run locally on Windows computers. If you're currently running on version 1.x, you should consider [migrating your app to version 4.x](migrate-version-1-version-4.md) today. 
::: zone-end

## Install the Azure Functions Core Tools

The recommended way to install Core Tools depends on the operating system of your local development computer.

### [Windows](#tab/windows)

The following steps use a Windows installer (MSI) to install Core Tools v4.x. For more information about other package-based installers, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md#windows).

Download and run the Core Tools installer, based on your version of Windows:

- [v4.x - Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2174087) (Recommended. [Visual Studio Code debugging](functions-develop-vs-code.md#debugging-functions-locally) requires 64-bit.)
- [v4.x - Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2174159)

If you previously used Windows installer (MSI) to install Core Tools on Windows, you should uninstall the old version from Add Remove Programs before installing the latest version.

If you need to install version 1.x of the Core Tools, see the [GitHub repository](https://github.com/Azure/azure-functions-core-tools/blob/v1.x/README.md#installing) for more information.

### [macOS](#tab/macos)

[!INCLUDE [functions-x86-emulation-on-arm64-note](../../includes/functions-x86-emulation-on-arm64-note.md)]

The following steps use Homebrew to install the Core Tools on macOS.

1. Install [Homebrew](https://brew.sh/), if it's not already installed.

1. Install the Core Tools package:

    ```bash
    brew tap azure/functions
    brew install azure-functions-core-tools@4
    # if upgrading on a machine that has 2.x or 3.x installed:
    brew link --overwrite azure-functions-core-tools@4
    ```
### [Linux](#tab/linux)

The following steps use [APT](https://wiki.debian.org/Apt) to install Core Tools on your Ubuntu/Debian Linux distribution. For other Linux distributions, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md#linux).

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

1. Check the `/etc/apt/sources.list.d/dotnetdev.list` file for one of the appropriate Linux version strings in the following table:

    | Linux distribution         | Version    |
    | -------------------------- | ---------- |
    | Debian 11                  | `bullseye` |
    | Debian 10                  | `buster`   |
    | Debian 9                   | `stretch`  |
    | Ubuntu 22.04               | `jammy`    |
    | Ubuntu 20.04               | `focal`    |
    | Ubuntu 19.04               | `disco`    |
    | Ubuntu 18.10               | `cosmic`   |
    | Ubuntu 18.04               | `bionic`   |
    | Ubuntu 17.04               | `zesty`    |
    | Ubuntu 16.04/Linux Mint 18 | `xenial`   |

1. Start the APT source update:

    ```bash
    sudo apt-get update
    ```

1. Install the Core Tools package:

    ```bash
    sudo apt-get install azure-functions-core-tools-4
    ```

---

When upgrading to the latest version of Core Tools, you should use the same package manager as the original installation to perform the upgrade. Visual Studio and Visual Studio Code may also install Azure Functions Core Tools, depending on your specific tools installation. 

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

This example creates a Functions project in a new `MyFunctionProj` folder. You're prompted to choose a default language for your project. 

The following considerations apply to project initialization:

+ If you don't provide the `--worker-runtime` option in the command, you're prompted to choose your language. For more information, see the [func init reference](functions-core-tools-reference.md#func-init).

+ When you don't provide a project name, the current folder is initialized. 

+ If you plan to deploy your project as a function app running in a Linux container, use the `--docker` option to make sure that a Dockerfile is generated for your project. To learn more, see [Create a function app in a local container](functions-create-container-registry.md#create-and-test-the-local-functions-project). If you forget to do this, you can always generate the Dockerfile for the project later by using the `func init --docker-only` command.

::: zone pivot="programming-language-csharp"
+ Core Tools lets you create function app projects for the .NET runtime as either [in-process](functions-dotnet-class-library.md) or [isolated worker process](dotnet-isolated-process-guide.md) C# class library projects (.csproj). These projects, which can be used with Visual Studio or Visual Studio Code, are compiled during debugging and when publishing to Azure. 

+ Use the `--csx` parameter if you want to work locally with C# script (.csx) files. These files are the same ones you get when you create functions in the Azure portal and when using version 1.x of Core Tools. To learn more, see the [func init reference](functions-core-tools-reference.md#func-init).
::: zone-end
::: zone pivot="programming-language-java"
+ Java uses a Maven archetype to create the local Functions project, along with your first HTTP triggered function. Instead of using `func init` and `func new`, you should follow the steps in the [Command line quickstart](./create-first-function-cli-java.md).  
::: zone-end
::: zone pivot="programming-language-javascript"
+ To use a `--worker-runtime` value of `node`, specify the `--language` as `javascript`. 
::: zone-end
::: zone pivot="programming-language-python"
+ You should run all commands, including `func init`, from inside a virtual environment. To learn more, see [Create and activate a virtual environment](create-first-function-cli-python.md#create-venv).
::: zone-end
::: zone pivot="programming-language-typescript"
+ To use a `--worker-runtime` value of `node`, specify the `--language` as `typescript`.
::: zone-end

## Binding extensions

[Functions triggers and bindings](functions-triggers-bindings.md) are implemented as .NET extension (NuGet) packages. To be able to use a specific binding extension, that extension must be installed in the project.

::: zone pivot="programming-language-javascript,programming-language-csharp"
This section doesn't apply to version 1.x of the Functions runtime. In version 1.x, supported binding were included in the core product extension.
::: zone-end

::: zone pivot="programming-language-csharp"
For compiled C# project, add references to the specific NuGet packages for the binding extensions required by your functions. C# script (.csx) project should use [extension bundles](functions-bindings-register.md#extension-bundles).
::: zone-end
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript"
Functions provides _extension bundles_ to make is easy to work with binding extensions in your project. Extension bundles, which are versioned and defined in the host.json file, install a complete set of compatible binding extension packages for your app. Your host.json should already have extension bundles enabled. If for some reason you need to add or update the extension bundle in the host.json file, see [Extension bundles](functions-bindings-register.md#extension-bundles).

If you must use a binding extension or an extension version not in a supported bundle, you need to manually install extensions. For such rare scenarios, see [Install extensions](#install-extensions).
::: zone-end

[!INCLUDE [functions-local-settings-file](../../includes/functions-local-settings-file.md)]

By default, these settings aren't migrated automatically when the project is published to Azure. Use the [`--publish-local-settings` option][func azure functionapp publish] when you publish to make sure these settings are added to the function app in Azure. Values in the `ConnectionStrings` section are never published.

::: zone pivot="programming-language-csharp"
The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-dotnet-class-library.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-java"
The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-java.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-node.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-powershell"
The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-powershell.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-python"
The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-python.md#environment-variables).
::: zone-end

When no valid storage connection string is set for [`AzureWebJobsStorage`] and a local storage emulator isn't being used, the following error message is shown:

> Missing value for AzureWebJobsStorage in local.settings.json. This is required for all triggers other than HTTP. You can run 'func azure functionapp fetch-app-settings \<functionAppName\>' or specify a connection string in local.settings.json.

### Get your storage connection strings

Even when using the [Azurite storage emulator](functions-develop-local.md#local-storage-emulator) for development, you may want to run locally with an actual storage connection. Assuming you have already [created a storage account](../storage/common/storage-account-create.md), you can get a valid storage connection string in one of several ways:

#### [Portal](#tab/portal)

1. From the [Azure portal], search for and select **Storage accounts**. 

    ![Select Storage accounts from Azure portal](./media/functions-run-local/select-storage-accounts.png)
  
1.  Select your storage account, select **Access keys** in **Settings**, then copy one of the **Connection string** values.

    ![Copy connection string from Azure portal](./media/functions-run-local/copy-storage-connection-portal.png)

#### [Core Tools](#tab/azurecli)

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

#### [Storage Explorer](#tab/storageexplorer)

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

When you run `func new`, you're prompted to choose a template in the default language of your function app. Next, you're prompted to choose a name for your function. In version 1.x, you're also required to choose the language. 

You can also specify the function name and template in the `func new` command. The following example uses the `--template` option to create an HTTP trigger named `MyHttpTrigger`:

```
func new --template "Http Trigger" --name MyHttpTrigger
```

This example creates a Queue Storage trigger named `MyQueueTrigger`:

```
func new --template "Azure Queue Storage Trigger" --name MyQueueTrigger
```

To learn more, see the [`func new`](functions-core-tools-reference.md#func-new) command.

## <a name="start"></a>Run functions locally

To run a Functions project, you run the Functions host from the root directory of your project. The host enables triggers for all functions in the project. Use the following command to run your functions locally:

::: zone pivot="programming-language-java"  
```
mvn clean package 
mvn azure-functions:run
```
::: zone-end  
::: zone pivot="programming-language-powershell,programming-language-python"  
```
func start
```
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-javascript" 
The way you start the host depends on your runtime version:
### [v4.x](#tab/v2)
```
func start
```
### [v1.x](#tab/v1)
```
func host start
```
---
::: zone-end 
::: zone pivot="programming-language-typescript"  
```
npm install
npm start     
```
::: zone-end
::: zone pivot="programming-language-python" 
This command must be [run in a virtual environment](./create-first-function-cli-python.md).
::: zone-end  

When the Functions host starts, it outputs the URL of HTTP-triggered functions, like in the following example:

<pre>
Found the following functions:
Host.Functions.MyHttpTrigger

Job host started
Http Function MyHttpTrigger: http://localhost:7071/api/MyHttpTrigger
</pre>

### Considerations when running locally

Keep in mind the following considerations when running your functions locally:

+ By default, authorization isn't enforced locally for HTTP endpoints. This means that all local HTTP requests are handled as `authLevel = "anonymous"`. For more information, see the [HTTP binding article](functions-bindings-http-webhook-trigger.md#authorization-keys). You can use the `--enableAuth` option to require authorization when running locally. For more information, see [`func start`](./functions-core-tools-reference.md?tabs=v2#func-start)

+ While there's local storage emulation available, it's often best to validate your triggers and bindings against live services in Azure. You can maintain the connections to these services in the local.settings.json project file. For more information, see [Local settings file](functions-develop-local.md#local-settings-file). Make sure to keep test and production data separate when testing against live Azure services. 

+ You can trigger non-HTTP functions locally without connecting to a live service. For more information, see [Non-HTTP triggered functions](#non-http-triggered-functions).

+ When you include your Application Insights connection information in the local.settings.json file, local log data is written to the specific Application Insights instance. To keep local telemetry data separate from production data, consider using a separate Application Insights instance for development and testing.

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

Make sure to use the same server name and port that the Functions host is listening on. You see an endpoint like this in the output generated when starting the Function host. You can call this URL using any HTTP method supported by the trigger.

The following cURL command triggers the `MyHttpTrigger` quickstart function from a GET request with the _name_ parameter passed in the query string.

```
curl --get http://localhost:7071/api/MyHttpTrigger?name=Azure%20Rocks
```

The following example is the same function called from a POST request passing _name_ in the request body:

##### [Bash](#tab/bash)
```bash
curl --request POST http://localhost:7071/api/MyHttpTrigger --data '{"name":"Azure Rocks"}'
```
##### [Cmd](#tab/cmd)
```cmd
curl --request POST http://localhost:7071/api/MyHttpTrigger --data "{'name':'Azure Rocks'}"
```
---

You can make GET requests from a browser passing data in the query string. For all other HTTP methods, you must use cURL, Fiddler, Postman, or a similar HTTP testing tool that supports POST requests.

#### Non-HTTP triggered functions

For all functions other than HTTP and Event Grid triggers, you can test your functions locally using REST by calling a special endpoint called an _administration endpoint_. Calling this endpoint with an HTTP POST request on the local server triggers the function. You can call the `functions` administrator endpoint (`http://localhost:{port}/admin/functions/`) to get URLs for all available functions, both HTTP triggered and non-HTTP triggered.

When running your functions in Core Tools, authentication and authorization is bypassed. However, when you try to call the same administrator endpoints on your function app in Azure, you must provide an access key. To learn more, see [Function access keys](functions-bindings-http-webhook-trigger.md#authorization-keys). 

>[!IMPORTANT]
>Access keys are valuable shared secrets. When used locally, they must be securely stored outside of source control. Because authentication and authorization isn't required by Functions when running locally, you should avoid using and storing access keys unless your scenarios require it.

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

##### [Bash](#tab/bash)
```bash
curl --request POST -H "Content-Type:application/json" --data '{"input":"sample queue data"}' http://localhost:7071/admin/functions/QueueTrigger
```
##### [Cmd](#tab/cmd)
```bash
curl --request POST -H "Content-Type:application/json" --data "{'input':'sample queue data'}" http://localhost:7071/admin/functions/QueueTrigger
```
---

## <a name="publish"></a>Publish to Azure

The Azure Functions Core Tools supports two types of deployment:

| Deployment type | Command | Description |
| ----- | ----- | ----- |
| Project files | [`func azure functionapp publish`](functions-core-tools-reference.md#func-azure-functionapp-publish) | Deploys function project files directly to your function app using [zip deployment](functions-deployment-technologies.md#zip-deploy). |
| Azure Container Apps | `func azurecontainerapps deploy` | Deploys a containerized function app to an existing Container Apps environment. |
| Kubernetes cluster | `func kubernetes deploy` | Deploys your Linux function app as a custom Docker container to a Kubernetes cluster. | 

### Authenticating with Azure

You must have either the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-azure-powershell) installed locally to be able to publish to Azure from Core Tools. By default, Core Tools uses these tools to authenticate with your Azure account. 

If you don't have these tools installed, you need to instead [get a valid access token](/cli/azure/account#az-account-get-access-token) to use during deployment. You can present an access token using the `--access-token` option in the deployment commands.  

### <a name="project-file-deployment"></a>Deploy project files

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript"
To publish your local code to a function app in Azure, use the [`func azure functionapp publish publish`](./functions-core-tools-reference.md#func-azure-functionapp-publish) command, as in the following example:

```
func azure functionapp publish <FunctionAppName>
```

This command publishes project files from the current directory to the `<FunctionAppName>` as a .zip deployment package. If the project requires compilation, it's done remotely during deployment. 
::: zone-end
::: zone pivot="programming-language-java"
Java uses Maven to publish your local project to Azure instead of Core Tools. Use the following Maven command to publish your project to Azure: 

```
mvn azure-functions:deploy
```

When you run this command, Azure resources are created during the initial deployment based on the settings in your _pom.xml_ file. For more information, see [Deploy the function project to Azure](create-first-function-cli-java.md#deploy-the-function-project-to-azure).
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript"  
The following considerations apply to this kind of deployment:

+ Publishing overwrites existing files in the remote function app deployment.

+ You must have already [created a function app in your Azure subscription](functions-cli-samples.md#create). Core Tools deploys your project code to this function app resource. To learn how to create a function app from the command prompt or terminal window using the Azure CLI or Azure PowerShell, see [Create a Function App for serverless execution](./scripts/functions-cli-create-serverless.md). You can also [create these resources in the Azure portal](./functions-create-function-app-portal.md#create-a-function-app). You get an error when you try to publish to a `<FunctionAppName>` that doesn't exist in your subscription. 

+ A project folder may contain language-specific files and directories that shouldn't be published. Excluded items are listed in a .funcignore file in the root project folder. 

+ By default, your project is deployed so that it [runs from the deployment package](run-functions-from-deployment-package.md). To disable this recommended deployment mode, use the [`--nozip` option][func azure functionapp publish]. 

+ A [remote build](functions-deployment-technologies.md#remote-build) is performed on compiled projects. This can be controlled by using the [`--no-build` option][func azure functionapp publish].  

+ Use the [`--publish-local-settings` option][func azure functionapp publish] to automatically create app settings in your function app based on values in the local.settings.json file.  

+ To publish to a specific named slot in your function app, use the [`--slot` option](functions-core-tools-reference.md#func-azure-functionapp-publish). 
::: zone-end

### Azure Container Apps deployment 

Functions lets you deploy a [containerized function app](functions-create-container-registry.md) to an Azure Container Apps environment. For more information, see [Azure Container Apps hosting of Azure Functions](functions-container-apps-hosting.md). Use the following [`func azurecontainerapps deploy`](./functions-core-tools-reference.md#func-azurecontainerapps-deploy) command to deploy an existing container image to a Container Apps environment:

```command
func azurecontainerapps deploy --name <APP_NAME> --environment <ENVIRONMENT_NAME> --storage-account <STORAGE_CONNECTION> --resource-group <RESOURCE_GROUP> --image-name <IMAGE_NAME> [--registry-password] [--registry-server] [--registry-username]

```

When deploying to an Azure Container Apps environment, the environment and storage account must already exist. You don't need to create a separate function app resource.  The storage account connection string you provide is used by the deployed function app. 

> [!IMPORTANT]
> Storage connection strings and other service credentials are important secrets. Make sure to securely store any script files using `func azurecontainerapps deploy` and don't store them in any publicly accessible source control systems.

### Kubernetes cluster

Core Tools can also be used to deploy a [containerized function app](functions-create-container-registry.md) to a Kubernetes cluster that you manage. The following [`func kubernetes deploy`](./functions-core-tools-reference.md#func-kubernetes-deploy) command uses the Dockerfile to generate a container in the specified registry and deploy it to the default Kubernetes cluster. 

```command
func kubernetes deploy --name <DEPLOYMENT_NAME> --registry <REGISTRY_USERNAME> 
```

Azure Functions on Kubernetes using KEDA is an open-source effort that you can use free of cost. Best-effort support is provided by contributors and from the community. To learn more, see [Deploying a function app to Kubernetes](functions-kubernetes-keda.md#deploying-a-function-app-to-kubernetes). 

## Install extensions

::: zone pivot="programming-language-csharp"
> [!NOTE]
> This section only applies to C# script (.csx) projects, which also rely on extension bundles. Compiled C# projects use NuGet extension packages in the regular way. 
::: zone-end

In the rare event you aren't able to use [extension bundles](functions-bindings-register.md#extension-bundles), you can use Core Tools to install the specific extension packages required by your project. The following are some reasons why you might need to install extensions manually:

* You need to access a specific version of an extension not available in a bundle.
* You need to access a custom extension not available in a bundle.
* You need to access a specific combination of extensions not available in a single bundle.

The following considerations apply when manually installing extensions:

+ To manually install extensions by using Core Tools, you must have the [.NET 6.0 SDK](https://dotnet.microsoft.com/download) installed. 

+ You can't explicitly install extensions in a function app with extension bundles enabled. First, remove the `extensionBundle` section in *host.json* before explicitly installing extensions.

+ The first time you explicitly install an extension, a .NET project file named extensions.csproj is added to the root of your app project. This file defines the set of NuGet packages required by your functions. While you can work with the [NuGet package references](/nuget/consume-packages/package-references-in-project-files) in this file, Core Tools lets you install extensions without having to manually edit this C# project file.

Use the following command to install a specific extension package at a specific version, in this case the Storage extension:

```command
func extensions install --package Microsoft.Azure.WebJobs.Extensions.Storage --version 5.0.0
```

You can use this command to install any compatible NuGet package. To learn more, see the [`func extensions install`](functions-core-tools-reference.md#func-extensions-install) command.

## Monitoring functions

The recommended way to monitor the execution of your functions is by integrating with Azure Application Insights. You can also stream execution logs to your local computer. To learn more, see [Monitor Azure Functions](functions-monitoring.md).

### Application Insights integration

Application Insights integration should be enabled when you create your function app in Azure. If for some reason your function app isn't connected to an Application Insights instance, it's easy to do this integration in the Azure portal. To learn more, see [Enable Application Insights integration](configure-monitoring.md#enable-application-insights-integration).

### Enable streaming logs

You can view a stream of log files being generated by your functions in a command-line session on your local computer. 

[!INCLUDE [functions-streaming-logs-core-tools](../../includes/functions-streaming-logs-core-tools.md)]

This type of streaming logs requires that Application Insights integration be enabled for your function app.  

[!INCLUDE [functions-x86-emulation-on-arm64](../../includes/functions-x86-emulation-on-arm64.md)]

If you're using Visual Studio Code, you can integrate Rosetta with the built-in Terminal. For more information, see [Enable emulation in Visual Studio Code](./functions-develop-vs-code.md#enable-emulation-in-visual-studio-code). 

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
