---
title: Develop and run Azure Functions locally
description: Learn how to code and test Azure Functions on your local computer before you run them on Azure Functions.
ms.topic: conceptual
zone_pivot_groups: programming-languages-set-functions
ms.date: 10/06/2025

#customer intent: As a developer, I want clear, step-by-step guidance to run, debug, and test Azure Functions locally across languages and runtimes so that I can iterate quickly and validate behavior before I deploy to Azure.
---

# Code and test Azure Functions locally

Whenever possible, you should create and validate your Azure Functions code project in a local development environment. Azure Functions Core Tools provides a local runtime version of Azure Functions that integrates with popular development tools for an integrated development, debugging, and deployments. Your local functions can even connect to live Azure services.

This article provides some shared guidance for local development, such as working with the [local.settings.json file](#local-settings-file). It also links to development environment-specific guidance.

>[!TIP]  
>You can find detailed information about how to develop functions locally in the linked IDE-specific guidance articles.    

## Local development environments

The way in which you develop functions on your local computer depends on your [language](supported-languages.md) and tooling preferences. Make sure to choose your preferred language at the [top of the article](#top).

>[!TIP]  
>All local development relies on Azure Functions Core Tools to provide the Functions runtime for debugging in a local environment.

You can use these development environments to code functions locally in your preferred language:

::: zone pivot="programming-language-csharp"

|Environment |Description|
|------------|-----------|
| [Visual Studio](functions-develop-vs.md) | The Azure Functions tools are included in the **Azure development** workload of [Visual Studio](https://www.visualstudio.com/vs/). Lets you compile and deploy your C# function code to Azure as a .NET class library. Includes the Core Tools for local testing. To learn more, see [Create your first C# function in Azure using Visual Studio](functions-create-your-first-function-visual-studio.md)|
|[Visual Studio Code](functions-develop-vs-code.md)| The [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) adds Functions support to Visual Studio Code. Requires the Core Tools. Supports development on Linux, macOS, and Windows. To learn more, see [Create your first function using Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-csharp). |
| [Command prompt or terminal](functions-run-local.md) | [Azure Functions Core Tools] provides the core runtime and templates for creating functions, which enable local development. Supports development on Linux, macOS, and Windows. To learn more, see [Create a C# function in Azure from the command line](how-to-create-function-azure-cli.md?pivots=programming-language-csharp).|

::: zone-end
::: zone pivot="programming-language-java"

|Environment |Description|
|------------|-----------|
| [Maven](./how-to-create-function-azure-cli.md?pivots=programming-language-java) | Maven archetype uses Core Tools to enable development of Java functions. Supports development on Linux, macOS, and Windows. To learn more, see [Create your first function with Java and Maven](./how-to-create-function-azure-cli.md?pivots=programming-language-java). |
|[Visual Studio Code](functions-develop-vs-code.md)| The [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) adds Functions support to Visual Studio Code. Requires the Core Tools. Supports development on Linux, macOS, and Windows. To learn more, see [Create your first function using Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-java). |
| [IntelliJ IDEA](functions-create-maven-intellij.md) | Maven archetype and Core Tools lets you develop your functions using IntelliJ. For more information, see [Create your first Java function in Azure using IntelliJ](functions-create-maven-intellij.md). |
| [Eclipse](functions-create-maven-eclipse.md) | Maven archetype and Core Tools lets you develop your functions using Eclipse. To learn more, see [Create your first Java function in Azure using Ecplise](functions-create-maven-eclipse.md). |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"

|Environment |Description|
|------------|-----------|
|[Visual Studio Code](functions-develop-vs-code.md)| The [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) adds Functions support to Visual Studio Code. Requires the Core Tools. Supports development on Linux, macOS, and Windows. To learn more, see [Create your first function using Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-javascript). |
| [Command prompt or terminal](functions-run-local.md) | [Azure Functions Core Tools] provides the core runtime and templates for creating functions, which enable local development. Supports development on Linux, macOS, and Windows. To learn more, see [Create a Node.js function in Azure from the command line](./how-to-create-function-azure-cli.md?pivots=programming-language-javascript).|

::: zone-end
::: zone pivot="programming-language-powershell"

|Environment |Description|
|------------|-----------|
|[Visual Studio Code](functions-develop-vs-code.md)| The [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) adds Functions support to Visual Studio Code. Requires the Core Tools. Supports development on Linux, macOS, and Windows. To learn more, see [Create your first function using Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-powershell). |
| [Command prompt or terminal](functions-run-local.md) | [Azure Functions Core Tools] provides the core runtime and templates for creating functions, which enable local development. Supports development on Linux, macOS, and Windows. To learn more, see [Create a PowerShell function in Azure from the command line](./how-to-create-function-azure-cli.md?pivots=programming-language-powershell).|

::: zone-end
::: zone pivot="programming-language-python"

|Environment |Description|
|------------|-----------|
|[Visual Studio Code](functions-develop-vs-code.md)| The [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) adds Functions support to Visual Studio Code. Requires the Core Tools. Supports development on Linux, macOS, and Windows. To learn more, see [Create your first function using Visual Studio Code](./how-to-create-function-vs-code.md?pivot=programming-language-python). |
| [Command prompt or terminal](functions-run-local.md) | [Azure Functions Core Tools] provides the core runtime and templates for creating functions, which enable local development. Supports development on Linux, macOS, and Windows. To learn more, see [Create a Python function in Azure from the command line](./how-to-create-function-azure-cli.md?pivots=programming-language-python).|

::: zone-end

Each of these local development environments lets you create function app projects and use predefined function templates to create new functions. Each uses the Core Tools so that you can test and debug your functions against the real Functions runtime on your own machine just as you would any other app. You can also publish your function app project from any of these environments to Azure.

## Local project files

A Functions project directory contains the following files in the project root folder, regardless of language: 

| File name | Description |
| --- | --- |
| host.json | To learn more, see the [host.json reference](functions-host-json.md). |
| local.settings.json | Settings used by Core Tools when running locally, including app settings. To learn more, see [local settings file](#local-settings-file). |
| .gitignore | Prevents the local.settings.json file from being accidentally published to a Git repository. To learn more, see [local settings file](#local-settings-file).|
| .vscode\extensions.json | Settings file used when opening the project folder in Visual Studio Code.  |

Other files in the project depend on your language and specific functions. For more information, see the developer guide for your language.   

### Local settings file

The `local.settings.json` file stores app settings and settings used by local development tools. Settings in the `local.settings.json` file are used only when you're running your project locally. When you publish your project to Azure, be sure to also add any required settings to the app settings for the function app.

> [!IMPORTANT]  
> Because the `local.settings.json` file might contain secrets, such as connection strings, you should use caution committing to source control. Tools that support Functions provide ways to synchronize settings in the `local.settings.json` file with the [app settings](functions-how-to-use-azure-function-app-settings.md#settings) in the function app to which your project is deployed.

The `local.settings.json` file has this structure:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "<language worker>",
    "AzureWebJobsStorage": "<connection-string>",
    "MyBindingConnection": "<binding-connection-string>",
    "AzureWebJobs.HttpExample.Disabled": "true"
  },
  "Host": {
    "LocalHttpPort": 7071,
    "CORS": "*",
    "CORSCredentials": false
  },
  "ConnectionStrings": {
    "SQLConnectionString": "<sqlclient-connection-string>"
  }
}
```

These settings are supported when you run projects locally:

| Setting      | Description                            |
| ------------ | -------------------------------------- |
| **`IsEncrypted`** | When this setting is set to `true`, all values are encrypted with a local machine key. Used with `func settings` commands. Default value is `false`. You might want to encrypt the local.settings.json file on your local computer when it contains secrets, such as service connection strings. The host automatically decrypts settings when it runs. Use the `func settings decrypt` command before trying to read locally encrypted settings. |
| **`Values`** | Collection of application settings used when a project is running locally. These key-value (string-string) pairs correspond to application settings in your function app in Azure, like [`AzureWebJobsStorage`]. Many triggers and bindings have a property that refers to a connection string app setting, like `Connection` for the [Blob storage trigger](functions-bindings-storage-blob-trigger.md#configuration). For these properties, you need an application setting defined in the `Values` array. See the subsequent table for a list of commonly used settings. <br/>Values must be strings and not JSON objects or arrays. Setting names can't include a double underline (`__`) and shouldn't include a colon (`:`). Double underline characters are reserved by the runtime, and the colon is reserved to support [dependency injection](functions-dotnet-dependency-injection.md#working-with-options-and-settings). |
| **`Host`** | Settings in this section customize the Functions host process when you run projects locally. These settings are separate from the host.json settings, which also apply when you run projects in Azure. |
| **`LocalHttpPort`** | Sets the default port used when running the local Functions host (`func host start` and `func run`). The `--port` command-line option takes precedence over this setting. For example, when running in Visual Studio IDE, you may change the port number by navigating to the "Project Properties -> Debug" window and explicitly specifying the port number in a `host start --port <your-port-number>` command that can be supplied in the "Application Arguments" field. |
| **`CORS`** | Defines the origins allowed for [cross-origin resource sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Origins are supplied as a comma-separated list with no spaces. The wildcard value (\*) is supported, which allows requests from any origin. |
| **`CORSCredentials`** |  When set to `true`, allows `withCredentials` requests. |
| **`ConnectionStrings`** | A collection. Don't use this collection for the connection strings used by your function bindings. This collection is used only by frameworks that typically get connection strings from the `ConnectionStrings` section of a configuration file, like [Entity Framework](/ef/ef6/). Connection strings in this object are added to the environment with the provider type of [System.Data.SqlClient](/dotnet/api/system.data.sqlclient). Items in this collection aren't published to Azure with other app settings. You must explicitly add these values to the `Connection strings` collection of your function app settings. If you're creating a [`SqlConnection`](/dotnet/api/system.data.sqlclient.sqlconnection) in your function code, you should store the connection string value with your other connections in **Application Settings** in the portal. |

The following application settings can be included in the **`Values`** array when running locally:

| Setting | Values | Description |
|-----|-----|-----|
|**`AzureWebJobsStorage`**| Storage account connection string, or<br/>`UseDevelopmentStorage=true`| Contains the connection string for an Azure storage account. Required when using triggers other than HTTP. For more information, see the [`AzureWebJobsStorage`] reference.<br/>When you have the [Azurite Emulator](../storage/common/storage-use-azurite.md) installed locally and you set [`AzureWebJobsStorage`] to `UseDevelopmentStorage=true`, Core Tools uses the emulator. For more information, see [Local storage emulator](#local-storage-emulator).| 
|**`AzureWebJobs.<FUNCTION_NAME>.Disabled`**| `true`\|`false` | To disable a function when running locally, add `"AzureWebJobs.<FUNCTION_NAME>.Disabled": "true"` to the collection, where `<FUNCTION_NAME>` is the name of the function. To learn more, see [How to disable functions in Azure Functions](disable-function.md#disable-functions-locally). |
|**`FUNCTIONS_WORKER_RUNTIME`** | `dotnet`<br/>`dotnet-isolated`<br/>`node`<br/>`java`<br/>`powershell`<br/>`python`| Indicates the targeted language of the Functions runtime. Required for version 2.x and higher of the Functions runtime. This setting is generated for your project by Core Tools. To learn more, see the [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) reference.|
| **`FUNCTIONS_WORKER_RUNTIME_VERSION`** | `~7` |Indicates to use PowerShell 7 when running locally. If not set, then PowerShell Core 6 is used. This setting is only used when running locally. The PowerShell runtime version is determined by the `powerShellVersion` site configuration setting, when it runs in Azure, which can be [set in the portal](functions-reference-powershell.md#changing-the-powershell-version). |

::: zone pivot="programming-language-javascript,programming-language-typescript"
To learn how to use values from the `values` array as environment variables in your function code, see [Environment variables](functions-reference-node.md#environment-variables) in the developer guide.  
::: zone-end  
::: zone pivot="programming-language-java"  
To learn how to use values from the `values` array as environment variables in your function code, see [Environment variables](functions-reference-java.md#environment-variables) in the developer guide.  
::: zone-end  
::: zone pivot="programming-language-powershell"  
To learn how to use values from the `values` array as environment variables in your function code, see [Environment variables](functions-reference-powershell.md#environment-variables) in the developer guide.  
::: zone-end  
::: zone pivot="programming-language-python"  
To learn how to use values from the `values` array as environment variables in your function code, see [Environment variables](functions-reference-python.md#environment-variables) in the developer guide.  
::: zone-end  

## Synchronize settings

When you develop your functions locally, any local settings required by your app must also be present in app settings of the function app to which your code is deployed. You might also need to download current settings from the function app to your local project. While you can [manually configure app settings in the Azure portal](functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings), the following tools also let you synchronize app settings with local settings in your project:

+ [Visual Studio Code](functions-develop-vs-code.md#application-settings-in-azure)
+ [Visual Studio](functions-develop-vs.md#function-app-settings)
+ [Azure Functions Core Tools](functions-run-local.md#local-settings)

## Triggers and bindings

When you develop your functions locally, you need to take trigger and binding behaviors into consideration. For HTTP triggers, you can call the HTTP endpoint on the local computer, using `http://localhost/`. For non-HTTP triggered functions, there are several options to run locally:

+ The easiest way to test bindings during local development is to use connection strings that target live Azure services. You can target live services by adding the appropriate connection string settings in the `Values` array in the local.settings.json file. When you do this, local executions during testing might affect your production services. Instead, consider setting-up separate services to use during development and testing, and then switch to different services during production.
+ For storage-based triggers, you can use a [local storage emulator](#local-storage-emulator).
+ You can manually run non-HTTP trigger functions by using special administrator endpoints. For more information, see [Manually run a non-HTTP-triggered function](functions-manually-run-non-http.md). 

During local testing, you must be running the host provided by Core Tools (func.exe) locally. For more information, see [Azure Functions Core Tools](functions-run-local.md).

## HTTP test tools

During development, it's easy to call any of your function endpoints from a web browser when they support the HTTP GET method. However, for other HTTP methods that support payloads, such as POST or PUT, you need to use an HTTP test tool to create and send these HTTP requests to your function endpoints. 

> [!CAUTION]  
> For scenarios where your requests must include sensitive data, make sure to use a tool that protects your data and reduces the risk of exposing any sensitive data to the public. Sensitive data you should protect might include: credentials, secrets, access tokens, API keys, geolocation data, even personal data. 

You can keep your data secure by choosing an HTTP test tool that works either offline or locally, doesn't sync your data to the cloud, and doesn't require that you sign in to an online account. Some tools can also protect your data from accidental exposure by implementing specific security features. 

Avoid using tools that centrally store your HTTP request history (including sensitive information), don't follow best security practices, or don't respect data privacy concerns. 

Consider using one of these tools for securely sending HTTP requests to your function endpoints:

- [Visual Studio Code](https://code.visualstudio.com/download) with an [extension from Visual Studio Marketplace](https://marketplace.visualstudio.com/vscode), such as [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [PowerShell Invoke-RestMethod](/powershell/module/microsoft.powershell.utility/invoke-restmethod)
- [Microsoft Edge - Network Console tool](/microsoft-edge/devtools-guide-chromium/network-console/network-console-tool)
- [Bruno](https://www.usebruno.com/)
- [curl](https://curl.se/)

## Local storage emulator

During local development, you can use the local [Azurite emulator](../storage/common/storage-use-azurite.md) when testing functions with Azure Storage bindings (Queue Storage, Blob Storage, and Table Storage), without having to connect to remote storage services. Azurite integrates with Visual Studio Code and Visual Studio, and you can also run it from the command prompt using npm. For more information, see [Use the Azurite emulator for local Azure Storage development](../storage/common/storage-use-azurite.md).

The following setting in the `Values` collection of the local.settings.json file tells the local Functions host to use Azurite for the default `AzureWebJobsStorage` connection:

  ```json
  "AzureWebJobsStorage": "UseDevelopmentStorage=true"
  ```

With this setting value, any Azure Storage trigger or binding that uses `AzureWebJobsStorage` as its connection connects to Azurite when running locally. Keep these considerations in mind when using storage emulation during local execution:

+ You must have Azurite installed and running.
+ You should test with an actual storage connection to Azure services before publishing to Azure.
+ When you publish your project, don't publish the `AzureWebJobsStorage` setting as `UseDevelopmentStorage=true`. In Azure, the `AzureWebJobsStorage` setting must always be the connection string of the storage account used by your function app. For more information, see [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage).

## Related articles

::: zone pivot="programming-language-csharp"
+ To learn more about local development of functions using Visual Studio, see [Develop Azure Functions using Visual Studio](functions-develop-vs.md).
::: zone-end  
+ To learn more about local development of functions using Visual Studio Code on a Mac, Linux, or Windows computer, see [Develop Azure Functions by using Visual Studio Code](functions-develop-vs-code.md).
+ To learn more about developing functions from the command prompt or terminal, see [Work with Azure Functions Core Tools](functions-run-local.md).

<!-- LINKS -->

[Azure Functions Core Tools]: https://www.npmjs.com/package/azure-functions-core-tools
[Azure portal]: https://portal.azure.com
[Node.js]: https://docs.npmjs.com/getting-started/installing-node#osx-or-windows
[`AzureWebJobsStorage`]: functions-app-settings.md#azurewebjobsstorage
