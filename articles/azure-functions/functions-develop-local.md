---
title: Develop and run Azure Functions locally
description: Learn how to code and test Azure Functions on your local computer before you run them on Azure Functions.

ms.topic: conceptual
ms.date: 09/22/2022

---
# Code and test Azure Functions locally

While you're able to develop and test Azure Functions in the [Azure portal], many developers prefer a local development experience. When you use Functions, using your favorite code editor and development tools to create and test functions on your local computer becomes easier. Your local functions can connect to live Azure services, and you can debug them on your local computer using the full Functions runtime.

This article provides links to specific development environments for your preferred language. It also provides some shared guidance for local development, such as working with the [local.settings.json file](#local-settings-file). 

## Local development environments

The way in which you develop functions on your local computer depends on your [language](supported-languages.md) and tooling preferences. The environments in the following table support local development:

|Environment                              |Languages         |Description|
|-----------------------------------------|------------|---|
|[Visual Studio Code](functions-develop-vs-code.md)| [C# (in-process)](functions-dotnet-class-library.md)<br/>[C# (isolated worker process)](dotnet-isolated-process-guide.md)<br/>[JavaScript](functions-reference-node.md)<br/>[PowerShell](./create-first-function-vs-code-powershell.md)<br/>[Python](functions-reference-python.md) | The [Azure Functions extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) adds Functions support to VS Code. Requires the Core Tools. Supports development on Linux, macOS, and Windows, when using version 2.x of the Core Tools. To learn more, see [Create your first function using Visual Studio Code](./create-first-function-vs-code-csharp.md). |
| [Command prompt or terminal](functions-run-local.md) | [C# (in-process)](functions-dotnet-class-library.md)<br/>[C# (isolated worker process)](dotnet-isolated-process-guide.md)<br/>[JavaScript](functions-reference-node.md)<br/>[PowerShell](functions-reference-powershell.md)<br/>[Python](functions-reference-python.md) | [Azure Functions Core Tools] provides the core runtime and templates for creating functions, which enable local development. Version 2.x supports development on Linux, macOS, and Windows. All environments rely on Core Tools for the local Functions runtime. |
| [Visual Studio](functions-develop-vs.md) | [C# (in-process)](functions-dotnet-class-library.md)<br/>[C# (isolated worker process)](dotnet-isolated-process-guide.md) | The Azure Functions tools are included in the **Azure development** workload of [Visual Studio](https://www.visualstudio.com/vs/), starting with Visual Studio 2019. Lets you compile functions in a class library and publish the .dll to Azure. Includes the Core Tools for local testing. To learn more, see [Develop Azure Functions using Visual Studio](functions-develop-vs.md). |
| [Maven](./create-first-function-cli-java.md) (various) | [Java](functions-reference-java.md) | Maven archetype supports Core Tools to enable development of Java functions. Version 2.x supports development on Linux, macOS, and Windows. To learn more, see [Create your first function with Java and Maven](./create-first-function-cli-java.md). Also supports development using [Eclipse](functions-create-maven-eclipse.md) and [IntelliJ IDEA](functions-create-maven-intellij.md). |

[!INCLUDE [Don't mix development environments](../../includes/functions-mixed-dev-environments.md)]

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

The local.settings.json file stores app settings and settings used by local development tools. Settings in the local.settings.json file are used only when you're running your project locally. When you publish your project to Azure, be sure to also add any required settings to the app settings for the function app.

> [!IMPORTANT]  
> Because the local.settings.json may contain secrets, such as connection strings, you should never store it in a remote repository. Tools that support Functions provide ways to synchronize settings in the local.settings.json file with the [app settings](functions-how-to-use-azure-function-app-settings.md#settings) in the function app to which your project is deployed.

The local settings file has this structure:

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
|**`AzureWebJobs.<FUNCTION_NAME>.Disabled`**| `true`\|`false` | To disable a function when running locally, add `"AzureWebJobs.<FUNCTION_NAME>.Disabled": "true"` to the collection, where `<FUNCTION_NAME>` is the name of the function. To learn more, see [How to disable functions in Azure Functions](disable-function.md#localsettingsjson). |
|**`FUNCTIONS_WORKER_RUNTIME`** | `dotnet`<br/>`dotnet-isolated`<br/>`node`<br/>`java`<br/>`powershell`<br/>`python`| Indicates the targeted language of the Functions runtime. Required for version 2.x and higher of the Functions runtime. This setting is generated for your project by Core Tools. To learn more, see the [`FUNCTIONS_WORKER_RUNTIME`](functions-app-settings.md#functions_worker_runtime) reference.|
| **`FUNCTIONS_WORKER_RUNTIME_VERSION`** | `~7` |Indicates to use PowerShell 7 when running locally. If not set, then PowerShell Core 6 is used. This setting is only used when running locally. The PowerShell runtime version is determined by the `powerShellVersion` site configuration setting, when it runs in Azure, which can be [set in the portal](functions-reference-powershell.md#changing-the-powershell-version). |

## Synchronize settings

When you develop your functions locally, any local settings required by your app must also be present in app settings of the function app to which your code is deployed. You may also need to download current settings from the function app to your local project. While you can [manually configure app settings in the Azure portal](functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings), the following tools also let you synchronize app settings with local settings in your project:

+ [Visual Studio Code](functions-develop-vs-code.md#application-settings-in-azure)
+ [Visual Studio](functions-develop-vs.md#function-app-settings)
+ [Azure Functions Core Tools](functions-run-local.md#local-settings)

## Triggers and bindings

When you develop your functions locally, you need to take trigger and binding behaviors into consideration. The easiest way to test bindings during local development is to use connection strings that target live Azure services. You can target live services by adding the appropriate connection string settings in the `Values` array in the local.settings.json file. When you do this, local executions during testing impact live service data. Because of this, consider setting-up separate services to use during development and testing, and then switch to different services during production. You can also use a local storage emulator.

## Local storage emulator

During local development, you can use the local [Azurite emulator](../storage/common/storage-use-azurite.md) when testing functions with Azure Storage bindings (Queue Storage, Blob Storage, and Table Storage), without having to connect to remote storage services. Azurite integrates with Visual Studio Code and Visual Studio, and you can also run it from the command prompt using npm. For more information, see [Use the Azurite emulator for local Azure Storage development](../storage/common/storage-use-azurite.md).

The following setting in the `Values` collection of the local.settings.json file tells the local Functions host to use Azurite for the default `AzureWebJobsStorage` connection:

  ```json
  "AzureWebJobsStorage": "UseDevelopmentStorage=true"
  ```

With this setting in place, any Azure Storage trigger or binding that uses `AzureWebJobsStorage` as its connection connects to Azurite when running locally. During local execution, you must have Azurite installed and running. The emulator is useful during development, but you should test with an actual storage connection before deployment. When you publish your project, don't publish this setting. You need to instead use an Azure Storage connection string in the same settings in your function app in Azure.

## Next steps

+ To learn more about local development of compiled C# functions (both in-process and isolated worker process) using Visual Studio, see [Develop Azure Functions using Visual Studio](functions-develop-vs.md).
+ To learn more about local development of functions using VS Code on a Mac, Linux, or Windows computer, see the Visual Studio Code getting started article for your preferred language:
    + [C# (in-process)](create-first-function-vs-code-csharp.md)
    + [C# (isolated worker process)](create-first-function-vs-code-csharp.md?tabs=isolated-process)
    + [Java](create-first-function-vs-code-java.md)
    + [JavaScript](create-first-function-vs-code-node.md)
    + [PowerShell](create-first-function-vs-code-powershell.md)
    + [Python](create-first-function-vs-code-python.md)
    + [TypeScript](create-first-function-vs-code-typescript.md)
+ To learn more about developing functions from the command prompt or terminal, see [Work with Azure Functions Core Tools](functions-run-local.md).

<!-- LINKS -->

[Azure Functions Core Tools]: https://www.npmjs.com/package/azure-functions-core-tools
[Azure portal]: https://portal.azure.com
[Node.js]: https://docs.npmjs.com/getting-started/installing-node#osx-or-windows
[`AzureWebJobsStorage`]: functions-app-settings.md#azurewebjobsstorage
