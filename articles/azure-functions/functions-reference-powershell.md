---
title: PowerShell developer reference for Azure Functions | Microsoft Docs
description: Understand how to develop functions by using PowerShell.
services: functions
documentationcenter: na
author: tyleonha
manager: slee
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: 45dedd78-3ff9-411f-bb4b-16d29a11384c
ms.service: azure-functions
ms.devlang: powershell
ms.topic: reference
ms.date: 11/5/2018
ms.author: tylerleonhardt

---
# Azure Functions PowerShell developer guide

This guide contains information about the intricacies of writing Azure Functions with PowerShell.

A PowerShell function is represented as a PowerShell script that executes when triggered ([triggers are configured in function.json](functions-triggers-bindings.md)). The powershell script takes in parameters that match the names of all the input bindings. In addition to those inputs, a parameter is available to you called `TriggerMetadata` that contains additional information on the trigger that started the function.

This article assumes that you have already read the [Azure Functions developer reference](functions-reference.md). You should also complete the Functions quickstart to create your first function, using [Visual Studio Code](functions-create-first-function-vs-code.md) or [via the Azure Functions Core Tools](functions-create-first-azure-function.md).

## Folder structure

The required folder structure for a PowerShell project looks like the following. This default can be changed. For more information, see the [scriptFile](#using-scriptfile) section below.

```
PSFunctionApp
 | - MyFirstFunction
 | | - run.ps1
 | | - function.json
 | - MySecondFunction
 | | - run.ps1
 | | - function.json
 | - Modules
 | | - myFirstHelperModule
 | | | - myFirstHelperModule.psd1
 | | | - myFirstHelperModule.psm1
 | | - mySecondHelperModule
 | | | - mySecondHelperModule.psd1
 | | | - mySecondHelperModule.psm1
 | - local.settings.json
 | - host.json
 | - extensions.csproj
 | - bin
```

At the root of the project, there's a shared [host.json](functions-host-json.md) file that can be used to configure the function app. Each function has a folder with its own code file (.ps1) and binding configuration file (function.json). The name of `function.json`'s parent directory is always the name of your function.

Depending on the bindings you are using, an `extensions.csproj` might be needed. Binding extensions required in [version 2.x](functions-versions.md) of the Functions runtime are defined in the `extensions.csproj` file, with the actual library files in the `bin` folder. When developing locally, you must [register binding extensions](functions-triggers-bindings.md#local-development-azure-functions-core-tools). When developing functions in the Azure portal, this registration is done for you.

## Defining a PowerShell script to be a function

By default, the Functions runtime looks for your function in `run.ps1`, where `run.ps1` shares the same parent directory as its corresponding `function.json`.

Your script is passed a number of arguments on execution. The powershell script takes in parameters that match the names of all the input bindings. In addition to those inputs, a parameter is available to you called `TriggerMetadata` that contains additional information on the trigger that started the function. You can define this at the top of your script by adding a `param` block:

```powershell
# $TriggerMetadata is optional here. If you don't need it, you can safely remove it from the param block
param($MyFirstInputBinding, $MySecondInputBinding, $TriggerMetadata)
```

### TriggerMetadata parameter

The `TriggerMetadata` parameter is used to supply additional information about the trigger. The additional metadata varies from binding to binding but they all contain a `sys` property that contains the following data:

```powershell
$TriggerMetadata.sys
```

| Property   | Description                                     | Type     |
|------------|-------------------------------------------------|----------|
| UtcNow     | When, in UTC, the function was triggered        | DateTime |
| MethodName | The name of the Function that was triggered     | string   |
| RandGuid   | a unique guid to this execution of the function | string   |

Every trigger type has a different set of metadata. For example, the `$TriggerMetadata` for `QueueTrigger` contains the `InsertionTime`, `Id`, `DequeueCount`, among other things. For more information on the queue trigger's metadata, go to the [official documentation for queue triggers](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue#trigger---message-metadata). Check the documentation on the [triggers](functions-triggers-bindings.md) you're working with to see what comes inside the trigger metadata.

## Bindings

In PowerShell, [bindings](functions-triggers-bindings.md) are configured and defined in a function's function.json. Functions interact with bindings a number of ways.

### Reading trigger and input data

Trigger and input bindings (bindings that have `direction` set to `in`) can be read as parameters passed to your function. The `name` property defined in `function.json` will be the name of the parameter, in the `param` block. Since PowerShell uses a parameter binder, the order of the parameters doesn't matter. However, it's a best practice to follow the order of the bindings defined in the `function.json`.

```powershell
param($MyFirstInputBinding, $MySecondInputBinding)
```

### Writing data

Outputs (bindings that have `direction` set to `out`) can be written to by a function using a cmdlet called `Push-OutputBinding` that is available within the Functions runtime. In all cases, the `name` property of the binding as defined in `function.json` corresponds to the `Name` parameter of the `Push-OutputBinding` cmdlet.

```powershell
param($MyFirstInputBinding, $MySecondInputBinding)

Push-OutputBinding -Name myQueue -Value $myValue

# or

Push-OutputBinding myQueue $myValue
```

You can also pass in a hashtable that contains the names of output bindings to their values.

```powershell
param($MyFirstInputBinding, $MySecondInputBinding)

$myValue = "myData"

$hashtable = @{
    myQueue = $myValue
    myOtherQueue = $myValue
}

Push-OutputBinding -InputObject $hashtable
```

Here is the full help for the `Push-OutputBinding` cmdlet:

```output
NAME
    Push-OutputBinding

SYNTAX
    Push-OutputBinding [-Name] <string> [-Value] <Object> [-Force] [<CommonParameters>]

    Push-OutputBinding [-InputObject] <hashtable> [-Force] [<CommonParameters>]


PARAMETERS
    -Force

        Required?                    false
        Position?                    Named
        Accept pipeline input?       false
        Parameter set name           (All)
        Aliases                      None
        Dynamic?                     false

    -InputObject <hashtable>

        Required?                    true
        Position?                    0
        Accept pipeline input?       true (ByValue)
        Parameter set name           InputObject
        Aliases                      None
        Dynamic?                     false

    -Name <string>

        Required?                    true
        Position?                    0
        Accept pipeline input?       true (ByPropertyName)
        Parameter set name           NameValue
        Aliases                      None
        Dynamic?                     false

    -Value <Object>

        Required?                    true
        Position?                    1
        Accept pipeline input?       true (ByPropertyName)
        Parameter set name           NameValue
        Aliases                      None
        Dynamic?                     false

    <CommonParameters>
        This cmdlet supports the common parameters: Verbose, Debug,
        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
        OutBuffer, PipelineVariable, and OutVariable. For more information, see
        about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216). 
```

If you want to retrieve what you're output bindings are currently set to, you can use the cmdlet `Get-OutputBinding` which will retrieve a hashtable containing the names of the output bindings to their respective values.

```powershell
Get-OutputBinding
```

```Output

Name                           Value
----                           -----
MyQueue                        myData
MyOtherQueue                   myData

```

`Get-OutputBinding` also contains a parameter called `-Name` that lets you filter with wildcard support.

```powershell
Get-OutputBinding -Name MyQ*
```

```Output

Name                           Value
----                           -----
MyQueue                        myData

```

## Logging

Logging in PowerShell functions works similarly to regular PowerShell logging. You can use the logging cmdlets to write to each output stream. Each cmdlet maps to a log level that Functions uses.

| Method              | Functions LogLevel | Description                            |
|---------------------|--------------------|----------------------------------------|
| `Write-Error`       | Error              | Writes to _Error_ level logging.       |
| `Write-Warning`     | Warning            | Writes to _Warning_ level logging.     |
| `Write-Information` | Information        | Writes to _Information_ level logging. |
| `Write-Host`        | Information        | Writes to _Information_ level logging. |
| `Write-Verbose`     | Trace              | Writes to _Trace_ level logging.       |
| `Write-Debug`       | Debug              | Writes to _Debug_ level logging.       |

[!Note]
Verbose maps to the Functions log level `Trace`.

In addition to these cmdlets, anything written to the pipeline will be written to the `Information` log level.

You can [configure the trace-level threshold for logging](#configure-the-trace-level-for-console-logging) in the host.json file. For more information on writing logs, see [writing trace outputs](#writing-trace-output-to-the-console) below.

Read [monitoring Azure Functions](functions-monitoring.md) to learn more about viewing and querying function logs.

### Configuring the log level for a Function App

Functions lets you define the threshold level for writing to the logs, which makes it easy to control the way logs are written to the console from your function. To set the threshold for all traces written to the console, use the `logging.logLevel.default` property in the `host.json` file. This setting applies to all functions in your function app.

The following example sets the threshold to enable verbose logging for all functions, but sets the threshold to enable debug logging for a single function:

```json
{
    "logging": {
        "logLevel": {
            "Function.MyFunction": "Debug",
            "default": "Trace"
        }
    }
}  
```

For more information, see [host.json reference](functions-host-json.md).

## HTTP triggers and bindings

HTTP and webhook triggers and HTTP output bindings use request and response objects to represent the HTTP messaging.  

### Request object

The Request object that's passed into the script comes from a type called `HttpRequestContext` which has the following properties:

| Property  | Description                                                    | Type                      |
|-----------|----------------------------------------------------------------|---------------------------|
| _Body_    | An object that contains the body of the request.               | object                    |
| _Headers_ | A dictionary that contains the request headers.                | Dictionary<string,string> |
| _Method_  | The HTTP method of the request.                                | string                    |
| _Params_  | An object that contains the routing parameters of the request. | Dictionary<string,string> |
| _Query_   | An object that contains the query parameters.                  | Dictionary<string,string> |
| _Url_     | The URL of the request.                                        | string                    |

> [!Note]
> The `Body` is serialized into a type that makes sense for the data. If it's json, it's passed in as a hashtable. If it's a string, it's passed in as a string.

> [!Note]
> All `Dictionary<string,string>` keys are case-insensitive.

### Response object

The Response object that you should send back comes from a type called `HttpResponseContext` which has the following properties:

| Property      | Description                                                 | Type                      |
|---------------|-------------------------------------------------------------|---------------------------|
| _Body_        | An object that contains the body of the response.           | object                    |
| _ContentType_ | A short hand for setting the content type for the response. | string                    |
| _Headers_     | An object that contains the response headers.               | Dictionary or Hashtable   |
| _StatusCode_  | The HTTP status code of the response.                       | string or int             |

### Accessing the request and response

When you work with HTTP triggers, you can access the HTTP request the same way you would with any other input binding. It's in the `param` block. 

In order to send back a response, you need to send back an `HttpResponseContext` object. Here's an example:

`function.json`
```json
{
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "authLevel": "anonymous"
    },
    {
      "type": "http",
      "direction": "out"
    }
  ]
}
```

`run.ps1`
```powershell
param($req, $TriggerMetadata)

$name = $req.Query.Name

Push-OutputBinding -Name res -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = "Hello $name!"
})
```

The result of invoking this function would be:

```
PS > irm http://localhost:5001?Name=Functions
Hello Functions!
```

## PowerShell version

The following table shows the PowerShell version used by each major version of the Functions runtime:

| Functions version | PowerShell version                             |
|-------------------|------------------------------------------------|
| 1.x               | Windows PowerShell 5.1 (locked by the runtime) |
| 2.x               | PowerShell Core 6                              |

You can see the current version by printing `$PSVersionTable` from any function.

## Dependency management

Leveraging your own custom modules or modules from the [PowerShell Gallery](https://powershellgallery.com) is a little different than how you would do it normally.

When you install the module on your local machine, it goes in one of the globally available folders in your `$env:PSModulePath`. Since your function will be running in Azure, you won't have access to the modules installed on your machine so the `$env:PSModulePath` for a PowerShell Function App is different than that of regular PowerShell.

A PowerShell Function App's `PSModulePath` contains two paths:

1. A `Modules` folder that exists at the root of your Function App
1. A path to a `Modules` folder that lives inside the PowerShell language worker

### Function App level `Modules` folder

In order to leverage custom modules or PowerShell modules from the PowerShell Gallery (via `Save-Module`), you can place modules that your function depends on in the well-known `Modules` folder and they will be automatically available for you inside the Functions runtime.

To take advantage of this, from the root of your _Function App_, create a `Modules` folder if it doesn't already exist and save the module you want to it.

```powershell
mkdir ./Modules
Save-Module MyGalleryModule -Path ./Modules
```

>[!Note]
> Remember, your Function App is the container of _all_ of you're functions for a particular project.

Use `Save-Module` to save all of the modules you depend on or copy your own custom modules to the `Modules` folder. Your folder structure should look like this:

```
PSFunctionApp
 | - MyFunction
 | | - run.ps1
 | | - function.json
 | - Modules
 | | - MyGalleryModule
 | | - MyOtherGalleryModule
 | | - MyCustomModule.psm1
 | - local.settings.json
 | - host.json
```

When you start your Function App, the PowerShell language worker will add this `Modules` folder to the `$env:PSModulePath` so that you can rely on module auto-loading just as you would in a regular PowerShell script.

### Language worker level `Modules` folder

We ship a few commonly used modules in the last position of the `PSModulePath`. The current list of modules are:

- [Microsoft.PowerShell.Archive](https://www.powershellgallery.com/packages/Microsoft.PowerShell.Archive)
- [Az](https://www.powershellgallery.com/packages/Az)

We ship the latest of these modules. If you would like to use a specific version of these, you can put them in the Function App level `Modules` folder.

## Environment variables

In Functions, [app settings](functions-app-settings.md), such as service connection strings, are exposed as environment variables during execution. You can access these settings using `$env:NAME_OF_ENV_VAR`, as shown here in this function:

```powershell
param($myTimer)

Write-Host "PowerShell timer trigger function ran! $(Get-Date)"
Write-Host $env:AzureWebJobsStorage
Write-Host $env:WEBSITE_SITE_NAME
```

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

When running locally, app settings are read from the [local.settings.json](functions-run-local.md#local-settings-file) project file.

## Configure function `scriptFile`

By default, a PowerShell function is executed from `run.ps1`, a file that shares the same parent directory as its corresponding `function.json`.

`scriptFile` can be used to get a folder structure that looks like the following example:

```
FunctionApp
 | - host.json
 | - myFunction
 | | - function.json
 | - lib
 | | - PSFunction.ps1
```

The `function.json` for `myFunction` should include a `scriptFile` property pointing to the file with the exported function to run.

```json
{
  "scriptFile": "../lib/PSFunction.ps1",
  "bindings": [
    // ...
  ]
}
```

### Using `entryPoint`

Currently, PowerShell does not support the use of `entryPoint`.

## Considerations for PowerShell functions

When you work with PowerShell functions, be aware of the considerations in the following sections.

### Cold Start

When developing Azure Functions in the serverless hosting model, cold starts are a reality. *Cold start* refers to the fact that when your function app starts for the first time after a period of inactivity, it takes longer to start up.

### Bundle modules instead of using `Install-Module`

Your script will get run on every invocation. You should refrain from using `Install-Module` in your script and instead use `Save-Module` before publishing so that your function doesn't have to waste time downloading the module.

## Next steps

For more information, see the following resources:

+ [Best practices for Azure Functions](functions-best-practices.md)
+ [Azure Functions developer reference](functions-reference.md)
+ [Azure Functions triggers and bindings](functions-triggers-bindings.md)
