---
title: Develop and run Azure functions locally | Microsoft Docs
description: Learn how to code and test Azure functions on your local computer before you run them on Azure Functions.
services: functions
documentationcenter: na
author: lindydonna
manager: cfowler
editor: ''

ms.assetid: 242736be-ec66-4114-924b-31795fd18884
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: multiple
ms.topic: article
ms.date: 09/25/2017
ms.author: glenga

---
# Code and test Azure Functions locally

While the [Azure portal] provides a full set of tools for developing and testing Azure Functions, many developers prefer a local development experience. Azure Functions makes it easy to use your favorite code editor and local development tools to develop and test your functions on your local computer. Your functions can trigger on events in Azure, and you can debug your C# and JavaScript functions on your local computer. 

If you are a Visual Studio C# developer, Azure Functions also [integrates with Visual Studio 2017](functions-develop-vs.md).

## Install the Azure Functions Core Tools

[Azure Functions Core Tools] is a local version of the Azure Functions runtime that you can run on your local development computer. It's not an emulator or simulator. It's the same runtime that powers Functions in Azure. There are two versions of Azure Functions Core Tools, one for version 1.x of the runtime and one for version 2.x. Both versions are provided as an [npm package](https://docs.npmjs.com/getting-started/what-is-npm).

>[!NOTE]  
> Before you install either version, you must [install NodeJS](https://docs.npmjs.com/getting-started/installing-node), which includes npm. For version 2.x of the tools, only Node.js 8.5 and later versions are supported. 

### Version 1.x runtime

The original version of the tools uses the Functions 1.x runtime. This version uses the .NET Framework and is only supported on Windows computers. Use the following command to install the version 1.x tools:

```bash
npm install -g azure-functions-core-tools
```

### Version 2.x runtime

Version 2.x of the tools uses the Azure Functions runtime 2.x that is built on .NET Core. This version is supported on all platforms .NET Core 2.x supports. Use this version for cross-platform development and when the Functions runtime 2.x is required. 

>[!IMPORTANT]   
> Before installing Azure Functions Core Tools, [install .NET Core 2.0](https://www.microsoft.com/net/core).  
>
> Azure Functions runtime 2.0 is in preview and currently not all features of Azure Functions are supported. For more information, see [Azure Functions runtime 2.0 known issues](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Azure-Functions-runtime-2.0-known-issues) 

 Use the following command to install the version 2.0 tools:

```bash
npm install -g azure-functions-core-tools@core
```

When installing on Ubuntu use `sudo`, as follows:

```bash
sudo npm install -g azure-functions-core-tools@core
```

When installing on macOS and Linux, you may need to include the `unsafe-perm` flag, as follows:

```bash
sudo npm install -g azure-functions-core-tools@core --unsafe-perm true
```

## Run Azure Functions Core Tools
 
Azure Functions Core Tools adds the following command aliases:
* **func**
* **azfun**
* **azurefunctions**

Any of these aliases can be used where `func` is shown in the examples.

```
func init MyFunctionProj
```

## Create a local Functions project

When running locally, a Functions project is a directory that has the files [host.json](functions-host-json.md) and [local.settings.json](#local-settings). This directory is the equivalent of a function app in Azure. To learn more about the Azure Functions folder structure, see the [Azure Functions developers guide](functions-reference.md#folder-structure).

In the terminal window or from a command prompt, run the following command to create the project and local Git repository:

```
func init MyFunctionProj
```

The output looks like the following example:

```
Writing .gitignore
Writing host.json
Writing local.settings.json
Created launch.json
Initialized empty Git repository in D:/Code/Playground/MyFunctionProj/.git/
```

To create the project without a local Git repository, use the `--no-source-control [-n]` option.

<a name="local-settings"></a>

## Local settings file

The file local.settings.json stores app settings, connection strings, and settings for Azure Functions Core Tools. It has the following structure:

```json
{
  "IsEncrypted": false,   
  "Values": {
    "AzureWebJobsStorage": "<connection string>", 
    "AzureWebJobsDashboard": "<connection string>" 
  },
  "Host": {
    "LocalHttpPort": 7071, 
    "CORS": "*" 
  },
  "ConnectionStrings": {
    "SQLConnectionString": "Value"
  }
}
```
| Setting      | Description                            |
| ------------ | -------------------------------------- |
| **IsEncrypted** | When set to **true**, all values are encrypted using a local machine key. Used with `func settings` commands. Default value is **false**. |
| **Values** | Collection of application settings used when running locally. **AzureWebJobsStorage** and **AzureWebJobsDashboard** are examples; for a complete list, see [app settings reference](functions-app-settings.md).  |
| **Host** | Settings in this section customize the Functions host process when running locally. | 
| **LocalHttpPort** | Sets the default port used when running the local Functions host (`func host start` and `func run`). The `--port` command-line option takes precedence over this value. |
| **CORS** | Defines the origins allowed for [cross-origin resource sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Origins are supplied as a comma-separated list with no spaces. The wildcard value (**\***) is supported, which allows requests from any origin. |
| **ConnectionStrings** | Contains the database connection strings for your functions. Connection strings in this object are added to the environment with the provider type of **System.Data.SqlClient**.  | 

Most triggers and bindings have a **Connection** property that maps to the name of an environment variable or app setting. For each connection property, there must be app setting defined in local.settings.json file. 

These settings can also be read in your code as environment variables. In C#, use [System.Environment.GetEnvironmentVariable](https://msdn.microsoft.com/library/system.environment.getenvironmentvariable(v=vs.110).aspx) or [ConfigurationManager.AppSettings](https://msdn.microsoft.com/library/system.configuration.configurationmanager.appsettings%28v=vs.110%29.aspx). In JavaScript, use `process.env`. Settings specified as a system environment variable take precedence over values in the local.settings.json file. 

Settings in the local.settings.json file are only used by Functions tools when running locally. By default, these settings are not migrated automatically when the project is published to Azure. Use the `--publish-local-settings` switch [when you publish](#publish) to make sure these settings are added to the function app in Azure.

When no valid storage connection string is set for **AzureWebJobsStorage**, the following error message is shown:  

>Missing value for AzureWebJobsStorage in local.settings.json. This is required for all triggers other than HTTP. You can run 'func azure functionary fetch-app-settings <functionAppName>' or specify a connection string in local.settings.json.
  
[!INCLUDE [Note to not use local storage](../../includes/functions-local-settings-note.md)]

### Configure app settings

To set a value for connection strings, you can do one of the following options:
* Enter the connection string from [Azure Storage Explorer](http://storageexplorer.com/).
* Use one of the following commands:

    ```
    func azure functionapp fetch-app-settings <FunctionAppName>
    ```
    ```
    func azure functionapp storage fetch-connection-string <StorageAccountName>
    ```
    Both commands require you to first sign-in to Azure.

## Create a function

To create a function, run the following command:

```
func new
``` 
`func new` supports the following optional arguments:

| Argument     | Description                            |
| ------------ | -------------------------------------- |
| **`--language -l`** | The template programming language, such as C#, F#, or JavaScript. |
| **`--template -t`** | The template name. |
| **`--name -n`** | The function name. |

For example, to create a JavaScript HTTP trigger, run:

```
func new --language JavaScript --template HttpTrigger --name MyHttpTrigger
```

To create a queue-triggered function, run:

```
func new --language JavaScript --template QueueTrigger --name QueueTriggerJS
```

## Run functions locally

To run a Functions project, run the Functions host. The host enables triggers for all functions in the project:

```
func host start
```

`func host start` supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
|**`--port -p`** | The local port to listen on. Default value: 7071. |
| **`--debug <type>`** | The options are `VSCode` and `VS`. |
| **`--cors`** | A comma-separated list of CORS origins, with no spaces. |
| **`--nodeDebugPort -n`** | The port for the node debugger to use. Default: A value from launch.json or 5858. |
| **`--debugLevel -d`** | The console trace level (off, verbose, info, warning, or error). Default: Info.|
| **`--timeout -t`** | The timeout for the Functions host to start, in seconds. Default: 20 seconds.|
| **`--useHttps`** | Bind to https://localhost:{port} rather than to http://localhost:{port}. By default, this option creates a trusted certificate on your computer.|
| **`--pause-on-error`** | Pause for additional input before exiting the process. Useful when launching Azure Functions Core Tools from an integrated development environment (IDE).|

When the Functions host starts, it outputs the URL of HTTP-triggered functions:

```
Found the following functions:
Host.Functions.MyHttpTrigger

ob host started
Http Function MyHttpTrigger: http://localhost:7071/api/MyHttpTrigger
```

### Debug in VS Code or Visual Studio

To attach a debugger, pass the `--debug` argument. To debug JavaScript functions, use Visual Studio Code. For C# functions, use Visual Studio.

To debug C# functions, use `--debug vs`. You can also use [Azure Functions Visual Studio 2017 Tools](https://blogs.msdn.microsoft.com/webdev/2017/05/10/azure-function-tools-for-visual-studio-2017/). 

To launch the host and set up JavaScript debugging, run:

```
func host start --debug vscode
```

Then, in Visual Studio Code, in the **Debug** view, select **Attach to Azure Functions**. You can attach breakpoints, inspect variables, and step through code.

![JavaScript debugging with Visual Studio Code](./media/functions-run-local/vscode-javascript-debugging.png)

### Passing test data to a function

You can also invoke a function directly by using `func run <FunctionName>` and provide input data for the function. This command is similar to running a function using the **Test** tab in the Azure portal. This command launches the entire Functions host.

`func run` supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--content -c`** | Inline content. |
| **`--debug -d`** | Attach a debugger to the host process before running the function.|
| **`--timeout -t`** | Time to wait (in seconds) until the local Functions host is ready.|
| **`--file -f`** | The file name to use as content.|
| **`--no-interactive`** | Does not prompt for input. Useful for automation scenarios.|

For example, to call an HTTP-triggered function and pass content body, run the following command:

```
func run MyHttpTrigger -c '{\"name\": \"Azure\"}'
```

## <a name="publish"></a>Publish to Azure

To publish a Functions project to a function app in Azure, use the `publish` command:

```
func azure functionapp publish <FunctionAppName>
```

You can use the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--publish-local-settings -i`** |  Publish settings in local.settings.json to Azure, prompting to overwrite if the setting already exists.|
| **`--overwrite-settings -y`** | Must be used with `-i`. Overwrites AppSettings in Azure with local value if different. Default is prompt.|

This command publishes to an existing function app in Azure. An error occurs when the `<FunctionAppName>` doesn't exist in your subscription. To learn how to create a function app from the command prompt or Terminal window using the Azure CLI, see [Create a Function App for serverless execution](./scripts/functions-cli-create-serverless.md).

The `publish` command uploads the contents of the Functions project directory. If you delete files locally, the `publish` command does not delete them from Azure. You can delete files in Azure by using the [Kudu tool](functions-how-to-use-azure-function-app-settings.md#kudu) in the [Azure portal].  

>[!IMPORTANT]  
> When you create a function app in Azure, it uses version 1.x of the Function runtime by default. To make the function app use version 2.x of the runtime, add the application setting `FUNCTIONS_EXTENSION_VERSION=beta`.  
Use the following Azure CLI code to add this setting to your function app: 
```azurecli-interactive
az functionapp config appsettings set --name <function_app> \
--resource-group myResourceGroup \
--settings FUNCTIONS_EXTENSION_VERSION=beta   
```

## Next steps

Azure Functions Core Tools is [open source and hosted on GitHub](https://github.com/azure/azure-functions-cli).  
To file a bug or feature request, [open a GitHub issue](https://github.com/azure/azure-functions-cli/issues). 

<!-- LINKS -->

[Azure Functions Core Tools]: https://www.npmjs.com/package/azure-functions-core-tools
[Azure portal]: https://portal.azure.com 
