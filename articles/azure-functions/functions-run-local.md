---
title: Develop and run Azure functions locally | Microsoft Docs
description: Learn how to code and test Azure functions on your local machine before running them on Azure Functions
services: functions
documentationcenter: na
author: lindydonna
manager: erikre
editor: ''

ms.assetid: 242736be-ec66-4114-924b-31795fd18884
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: multiple
ms.topic: article
ms.date: 05/23/2016
ms.author: donnam

---
# How to code and test Azure functions locally

You can use your favorite editor and local development tools to run the Azure Functions runtime locally. You can trigger on events in Azure and debug both C# and JavaScript functions.

Install the [Azure Functions Core Tools] from npm. This is a local version of the functions runtime that you can run on your local Windows machine. It is not an emulator or simulator, but the same runtime that runs in Azure.

[Azure Functions Core Tools] adds the following command aliases:
- `func`
- `azfun`
- `azurefunctions`

Azure Functions Core Tools is [open-source and hosted on GitHub](https://github.com/azure/azure-functions-cli). To file a bug or feature request, [open a GitHub issue](https://github.com/azure/azure-functions-cli/issues).

## Creating a local functions project

When running locally, a function project is just a directory with the files *host.json* and *local.settings.json*. This is the equivalent of a Function App in Azure. To learn more about the Azure Functions folder structure, see the [Azure Functions developers guide](functions-reference.md#folder-structure).

In a command prompt, run the following command:

```
func init MyFunctionProj
```

The output is similar to the following:

```
Writing .gitignore
Writing host.json
Writing local.settings.json
Created launch.json
Initialized empty Git repository in D:/Code/Playground/MyFunctionProj/.git/
```

## Local settings file

The file *local.settings.json* stores app settings, connection strings, and settings for the Azure Functions Core Tools. It has the following structure:

```json
{
  "IsEncrypted": false,   // If set to true, all values are encrypted using a local machine key. Use with "func settings" commands
  "Values": {
    "AzureWebJobsStorage": "<connection string>",   // This is required for all triggers except HTTP
    "AzureWebJobsDashboard": "<connection string>", // Optional, controls whether to log to Monitor tab in portal
  },
  "Host": {
    "LocalHttpPort": 7071, // If specified, the default port for "host start" and "run". Can be overridden with --port command line option
    "CORS": "*"            // Origins to allow in CORS setting
  },
  "ConnectionStrings": {
    "SQLConnectionString": "Value"
  }
}
```

App settings should be specified in the "Values" collection. These settings can then be read as environment variables. In C#, use `System.Environment.GetEnvironmentVariable` or `ConfigurationManager.AppSettings`; in JavaScript, use `process.env`. If the same setting is specified as a system environment variable, it will take precedence over values in *local.settings.json*.

The app settings *AzureWebJobsStorage* is a special setting that is required by the Azure Functions runtime for all triggers other than HTTP. Internally, the runtime creates queues to manage triggers in this storage account. If a value for *AzureWebJobsStorage* is not specified, you will see the following error if you use triggers other than HTTP:

*Missing value for AzureWebJobsStorage in local.settings.json. This is required for all triggers other than HTTP. You can run 'func azure functionapp fetch-app-settings <functionAppName>' or specify a connection string in local.settings.json.*

> [!NOTE]
> It is possible to use the local storage emulator, via the connection string  "AzureWebJobsStorage": "UseDevelopmentStorage=true". However, there may be differences in behavior as compared to the Azure Storage service.

The following settings customize the local functions host:
- `LocalHttpPort`. The default port to use for `func host start` `func run`. The `--port` command line option takes precedence over this value.
- `CORS`. The CORS allowed origins, as a comma-separated list with no spaces. Use "*" to allow all.

Connection strings can be provided in the `ConnectionStrings` object. They will be added to the environment with provider name "System.Data.SqlClient".

Most triggers and bindings have a "connection" property that is the name of an environment variable or app setting in *local.settings.json*. If the app setting value is missing, you'll see the following warning:

*Warning: Cannot find value named 'MyStorageConnection' in local.settings.json that matches 'connection' property set on 'blobTrigger' in 'BlobTriggerCSharp\function.json'. You can run 'func azure functionapp fetch-app-settings <functionAppName>' or specify a connection string in local.settings.json.*

The file *local.settings.json* is only used by the Azure Functions Core Tools. To set app settings and connection strings in Azure, use the **Application Settings** blade.

### Configuring app settings

To set a value for connection strings, you can do one of the following:
- Manually enter a connection string from [Azure Storage Explorer](http://storageexplorer.com/)
- Use **func azure functionapp fetch-app-settings <FunctionAppName>**. Requires **azure login**.
- Use **func azure functionapp storage fetch-connection-string <StorageAccountName>**. Requires **azure login**.

## Creating a function

To create a new function, run `func new`, which has the following optional arguments:

- `--language [-l]` - Template programming language, such as C#, F#, JavaScript, etc.
- `--template [-t]` - Template name
- `--name [-n]` - Function name

For instance, to create a JavaScript HTTP trigger, run:

```
func new --language JavaScript --template HttpTrigger --name MyHttpTrigger
```

To create a queue triggered function, run:

```
func new --language JavaScript --template QueueTrigger --name QueueTriggerJS
```

## Running functions locally

To run a functions project, run the functions host. This will enable all triggers for all functions in the project:

```
func host start
```

The following options can be provided to `func host start`:

- `--port [-p]` Local port to listen on. Default value: 7071.
- `--debug <type>` Options are VSCode and VS.
- `--cors` Comma-separated list of CORS origins with no spaces.
- `--nodeDebugPort [-n]` Port for node debugger to use. Default: value from launch.json or 5858
- `--debugLevel [-d]` Console trace level (off, verbose, info, warning, or error). Default: Info
- `--timeout [-t]` Timeout for on the functions host to start in seconds. Default: 20 seconds.
- `--useHttps` Bind to https://localhost:{port} rather than http://localhost:{port}. By default, this will create a trusted certificate on your machine.
- `--pause-on-error` Pause for additional input before exiting the process. Useful when launching the Core Tools from an IDE.

When the functions host starts, it outputs the URL of HTTP triggered functions:

```
Found the following functions:
Host.Functions.MyHttpTrigger

Job host started
Http Function MyHttpTrigger: http://localhost:7071/api/MyHttpTrigger
```

### Debugging

To attach a debugger, pass the `--debug` argument. To debug JavaScript functions, use Visual Studio Code. For C# functions, use Visual Studio.

To debug C# functions, use `--debug vs`. Alternatively, use the [Azure Functions Visual Studio 2017 Tools](https://blogs.msdn.microsoft.com/webdev/2017/05/10/azure-function-tools-for-visual-studio-2017/). 

To launch the host and set up JavaScript debugging, run:

```
func host start --debug vscode
```

Then in Visual Studio Code, select **Attach to Azure Functions** in the Debug View. Then, you can attach breakpoints, inspect variables, and step through code.

![JavaScript debugging with Visual Studio Code](./media/functions-run-local/vscode-javascript-debugging.png)

### Calling function with test data

You can also invoke a function directly using `func run <FunctionName>`. This is similar to the **Test** tab in the Azure portal, where you can specify input for the function. This command launches the entire functions host.

The following options can be provided to `func run`:

- `--content [-c]` - Inline content
- `--debug [-d]`- Attach a debugger to the host process before running the function
- `--timeout [-t]` - Time (in seconds) to wait until local Functions host is ready
- `--file [-f]` - File name to use as content

For example, to call an HTTP triggered function and pass content body, run the following:

```
func run MyHttpTrigger -c '{\"name\": \"Azure\"}'
```

## Publishing a function app

To publish a function project to a function app in Azure, use the `publish` command:

```
func azure functionapp publish <FunctionAppName>
```

The publish command uploads the contents of the function project directory, but it does not delete files that have been deleted locally. To delete these files, launch Kudu from the Azure Functions portal at **Platform Features** -> **Advanced Tools (Kudu)**. 


<!-- LINKS -->

[Azure Functions Core Tools]: https://www.npmjs.com/package/azure-functions-core-tools