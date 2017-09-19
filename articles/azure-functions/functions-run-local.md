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
ms.date: 09/19/2017
ms.author: glenga

---
# Code and test Azure functions locally

While the [Azure portal] provides a full set of tools for developing and testing Azure Functions, many developers prefer a local development experience. Azure Functions makes it easy to use your favorite code editor and local development tools to develop and test your functions on your local computer. Your functions can trigger on events in Azure, and you can debug your C# and JavaScript functions on your local computer. 

If you are a Visual Studio C# developer, Azure Functions also [integrates with Visual Studio 2017](functions-develop-vs.md).

## Install the Azure Functions Core Tools

Azure Functions Core Tools is a local version of the Azure Functions runtime that you can run on your local Windows computer. It's not an emulator or simulator. It's the same runtime that powers Functions in Azure.

The [Azure Functions Core Tools] is provided as an npm package. You must first [install NodeJS](https://docs.npmjs.com/getting-started/installing-node), which includes npm.  

>[!NOTE]
>The Azure Functions Core Tools package is currently in preview when running on MacOS X. 

[Azure Functions Core Tools] adds the following command aliases:
* **func**
* **azfun**
* **azurefunctions**

All of these alias can be used instead of `func` shown in the examples in this topic.

## Create a local Functions project

When running locally, a Functions project is a directory that has the files host.json and local.settings.json. This directory is the equivalent of a function app in Azure. To learn more about the Azure Functions folder structure, see the [Azure Functions developers guide](functions-reference.md#folder-structure).

At a command prompt, run the following command:

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

To opt out of creating a Git repository, use the option `--no-source-control [-n]`.

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
| **Values** | Collection of application settings used when running locally. Add your application settings to this object.  |
| **AzureWebJobsStorage** | Sets the connection string to the Azure Storage account that is used internally by the Azure Functions runtime. The storage account supports your function's triggers. This storage account connection setting is required for all functions except for HTTP triggered functions.  |
| **AzureWebJobsDashboard** | Sets the connection string to the Azure Storage account that is used to store the function logs. This optional value makes the logs accessible in the portal.|
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

To set a value for connection strings, you can do one of the following:
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
| **`--timeout -t`** | The time out for the Functions host t     o start, in seconds. Default: 20 seconds.|
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

The `publish` command uploads the contents of the Functions project directory. If you delete files locally, the `publish` command does not delete them from Azure. You can delete files in Azure by using the [Kudu tool](functions-how-to-use-azure-function-app-settings.md#kudu) in the [Azure portal].

## Next steps

Azure Functions Core Tools is [open source and hosted on GitHub](https://github.com/azure/azure-functions-cli).  
To file a bug or feature request, [open a GitHub issue](https://github.com/azure/azure-functions-cli/issues). 

<!-- LINKS -->

[Azure Functions Core Tools]: https://www.npmjs.com/package/azure-functions-core-tools
[Azure portal]: https://portal.azure.com 
