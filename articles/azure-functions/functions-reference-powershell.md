---
title: PowerShell developer reference for Azure Functions | Microsoft Docs
description: Understand how to develop functions by using PowerShell.
services: functions
documentationcenter: na
author: tylerleonhardt
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

This article assumes that you have already read the [Azure Functions developer reference](functions-reference.md) and completed the Functions quickstart to create your first function, using [the Azure Functions Core Tools](functions-create-first-azure-function-azure-cli.md) or [the Azure portal](functions-create-first-azure-function.md).

## Folder structure

The required folder structure for a PowerShell project looks like the following. This default can be changed. For more information, see the [scriptFile](#configure-function-scriptfile) section below.

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
 | - profile.ps1
 | - extensions.csproj
 | - bin
```

At the root of the project, there's a shared [host.json](functions-host-json.md) file that can be used to configure the function app. Each function has a folder with its own code file (.ps1) and binding configuration file (function.json). The name of `function.json`'s parent directory is always the name of your function.

Certain bindings require the presence of an `extensions.csproj`. Binding extensions, required in [version 2.x](functions-versions.md) of the Functions runtime, are defined in the `extensions.csproj` file, with the actual library files in the `bin` folder. When developing locally, you must [register binding extensions](functions-triggers-bindings.md#local-development-azure-functions-core-tools). When developing functions in the Azure portal, this registration is done for you.

In PowerShell Function Apps, you may optionally have a `profile.ps1` which will run on a Function App's ["cold start"](#cold-start). More information on the `profile.ps1` can be found [here](#powershell-profile).

## Defining a PowerShell script to be a function

By default, the Functions runtime looks for your function in `run.ps1`, where `run.ps1` shares the same parent directory as its corresponding `function.json`.

Your script is passed a number of arguments on execution. The powershell script takes in parameters that match the names of all the input bindings. In addition to those inputs, a parameter is available to you called `TriggerMetadata` that contains additional information on the trigger that started the function. To handle these parameters, add a `param` block to the top of your script like so:

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

You can also pass in a value for a specific binding through pipeline.

```powershell
param($MyFirstInputBinding, $MySecondInputBinding)

Produce-MyOutputValue | Push-OutputBinding -Name myQueue
```

Here is the full help for the `Push-OutputBinding` cmdlet:

```output
NAME
    Push-OutputBinding

SYNOPSIS
    Sets the value for the specified output binding.


SYNTAX
    Push-OutputBinding [-Name] <String> [-Value] <Object> [-Clobber] [<CommonParameters>]


DESCRIPTION
    When running in the Functions runtime, this cmdlet is aware of the output bindings
    defined for the function that is invoking this cmdlet. Hence, it's able to decide
    whether an output binding accepts singleton value only or a collection of values.

    For example, the HTTP output binding only accepts one response object, while the
    queue output binding can accept one or multiple queue messages.

    With this knowledge, the 'Push-OutputBinding' cmdlet acts differently based on the
    value specified for '-Name'.
    - If the specified name cannot be resolved to a valid output binding, then an error
      will be thrown;

    - If the output binding corresponding to that name accepts a collection of values,
      then it's allowed to call 'Push-OutputBinding' with the same name repeatedly in
      the function script to push multiple values;

    - If the output binding corresponding to that name only accepts a singleton value,
      then the second time calling 'Push-OutputBinding' with that name will result in
      an error, with detailed message about why it failed.


PARAMETERS
    -Name <String>
        The name of the output binding you want to set.

        Required?                    true
        Position?                    1
        Default value
        Accept pipeline input?       false
        Accept wildcard characters?  false

    -Value <Object>
        The value of the output binding you want to set.

        Required?                    true
        Position?                    2
        Default value
        Accept pipeline input?       true (ByValue)
        Accept wildcard characters?  false

    -Clobber [<SwitchParameter>]
        (Optional) If specified, will force the value to be set for a specified output binding.

        Required?                    false
        Position?                    named
        Default value                False
        Accept pipeline input?       false
        Accept wildcard characters?  false

    <CommonParameters>
        This cmdlet supports the common parameters: Verbose, Debug,
        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
        OutBuffer, PipelineVariable, and OutVariable. For more information, see
        about_CommonParameters (https://go.microsoft.com/fwlink/?LinkID=113216).


    -------------------------- EXAMPLE 1 --------------------------

    PS >Push-OutputBinding -Name response -Value "output #1"

    The output binding of "response" will have the value of "output #1"


    -------------------------- EXAMPLE 2 --------------------------

    PS >Push-OutputBinding -Name response -Value "output #2"

    The output binding is 'http', which accepts a singleton value only.
    So an error will be thrown from this second run.


    -------------------------- EXAMPLE 3 --------------------------

    PS >Push-OutputBinding -Name response -Value "output #3" -Clobber

    The output binding is 'http', which accepts a singleton value only.
    But you can use '-Clobber' to override the old value.
    The output binding of "response" will now have the value of "output #3"


    -------------------------- EXAMPLE 4 --------------------------

    PS >Push-OutputBinding -Name outQueue -Value "output #1"

    The output binding of "outQueue" will have the value of "output #1"


    -------------------------- EXAMPLE 5 --------------------------

    PS >Push-OutputBinding -Name outQueue -Value "output #2"

    The output binding is 'queue', which accepts multiple output values.
    The output binding of "outQueue" will now have a list with 2 items: "output #1", "output #2"


    -------------------------- EXAMPLE 6 --------------------------

    PS >Push-OutputBinding -Name outQueue -Value @("output #3", "output #4")

    When the value is a collection, the collection will be unrolled and elements of the collection
    will be added to the list. The output binding of "outQueue" will now have a list with 4 items:
    "output #1", "output #2", "output #3", "output #4".
```

If you want to retrieve what your output bindings are currently set to, you can use the cmdlet `Get-OutputBinding`, which will retrieve a hashtable containing the names of the output bindings to their respective values.

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
| `Write-Output`      | Information        | Writes to _Information_ level logging. |
| `Write-Debug`       | Debug              | Writes to _Debug_ level logging.       |
| `Write-Verbose`     | Trace              | Writes to _Trace_ level logging.       |
| `Write-Progress`    | Trace              | Writes to _Trace_ level logging.       |

> [!NOTE]
> Verbose maps to the Functions log level `Trace`.

In addition to these cmdlets, anything written to the pipeline will be redirected to the `Information` log level and displayed with the default PowerShell formatting.

> [!IMPORTANT]
> Using `Write-Verbose` or `Write-Debug` is not enough to see Verbose and Debug logging. You need to also configure the "log level threshold" which declares what level of logs you actually care about. See [Configuring the log level for a Function App](#configuring-the-log-level-for-a-function-app) on how to do that.

### Configuring the log level for a Function App

Azure Functions lets you define the threshold level for writing to the logs, which makes it easy to control the way logs are written to the console from your function. To set the threshold for all traces written to the console, use the `logging.logLevel.default` property in the `host.json` file. This setting applies to all functions in your function app.

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

### Viewing the logs

If your Function App is running in Azure, you can use Application Insights to monitor it. Read [monitoring Azure Functions](functions-monitoring.md) to learn more about viewing and querying function logs.

If you're running your Function App locally for development, logs default to the file system. To see the logs in the console, set the `AZURE_FUNCTIONS_ENVIRONMENT` environment variable to `Development` before starting the Function App.

## Triggers and bindings types

There are a number of triggers and bindings available to you to use with your Function App. The full list of triggers and bindings [can be found here](functions-triggers-bindings#supported-bindings).

With that said, all triggers and bindings are represented in code as a few real data types:

* Hashtable
* string
* byte[]
* int
* double
* HttpRequestContext
* HttpResponseContext

The first 5 in the list are standard .NET types. The last two are only used for the [HttpTrigger trigger](#Http-trigger-and-bindings).

Each binding parameter in your functions will be one of these types.

### HTTP triggers and bindings

HTTP and webhook triggers and HTTP output bindings use request and response objects to represent the HTTP messaging.

#### Request object

The Request object that's passed into the script comes from a type called `HttpRequestContext`, which has the following properties:

| Property  | Description                                                    | Type                      |
|-----------|----------------------------------------------------------------|---------------------------|
| _Body_    | An object that contains the body of the request.               | object                    |
| _Headers_ | A dictionary that contains the request headers.                | Dictionary<string,string> |
| _Method_  | The HTTP method of the request.                                | string                    |
| _Params_  | An object that contains the routing parameters of the request. | Dictionary<string,string> |
| _Query_   | An object that contains the query parameters.                  | Dictionary<string,string> |
| _Url_     | The URL of the request.                                        | string                    |

> [!NOTE]
> The `Body` is serialized into a type that makes sense for the data. If it's json, it's passed in as a hashtable. If it's a string, it's passed in as a string.

> [!NOTE]
> All `Dictionary<string,string>` keys are case-insensitive.

#### Response object

The Response object that you should send back comes from a type called `HttpResponseContext`, which has the following properties:

| Property      | Description                                                 | Type                      |
|---------------|-------------------------------------------------------------|---------------------------|
| _Body_        | An object that contains the body of the response.           | object                    |
| _ContentType_ | A short hand for setting the content type for the response. | string                    |
| _Headers_     | An object that contains the response headers.               | Dictionary or Hashtable   |
| _StatusCode_  | The HTTP status code of the response.                       | string or int             |

#### Accessing the request and response

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

### Type-casting for triggers and bindings

For certain bindings like the blob binding, you are able to specify the type that you want the parameter to be.

For example, if I would like my blob to come in as a string, I can add the following type cast to my `param` block:

```powershell
param([string] $myBlob)
```

## PowerShell profile

In PowerShell Function Apps, we have the concept of a PowerShell profile. If you're not familiar with PowerShell profiles, check out the PowerShell documentation about profiles [here](/powershell/module/microsoft.powershell.core/about/about_profiles).

In Azure Functions, the concept is similar in that it's a script that executes when the Function App starts up. The Function App starts up when it's first deployed and for every ["cold start"](#cold-start).

When you create a new Function App using the Azure Functions Core (by calling `func init`), it will create a default `profile.ps1` for you. The default profile can be found
[on the Core Tools GitHub repository](https://github.com/Azure/azure-functions-core-tools/blob/dev/src/Azure.Functions.Cli/StaticResources/profile.ps1)
and contains:

* Automatic MSI authentication to Azure
* The ability to turn on the Azure PowerShell `AzureRM` PowerShell aliases if you would like

## PowerShell version

The following table shows the PowerShell version used by each major version of the Functions runtime:

| Functions version | PowerShell version                             |
|-------------------|------------------------------------------------|
| 1.x               | Windows PowerShell 5.1 (locked by the runtime) |
| 2.x               | PowerShell Core 6                              |

You can see the current version by printing `$PSVersionTable` from any function.

## Dependency management

Leveraging your own custom modules or modules from the [PowerShell Gallery](https://powershellgallery.com) is a little different than how you would do it normally.

When you install the module on your local machine, it goes in one of the globally available folders in your `$env:PSModulePath`. Since your function will be running in Azure, you won't have access to the modules installed on your machine so the `$env:PSModulePath` for a PowerShell Function App is different than regular PowerShell's `$env:PSModulePath`.

A PowerShell Function App's `PSModulePath` contains two paths:

1. A `Modules` folder that exists at the root of your Function App
1. A path to a `Modules` folder that lives inside the PowerShell language worker

### Function App level `Modules` folder

In order to leverage custom modules or PowerShell modules from the PowerShell Gallery (via `Save-Module`), you can place modules that your function depends on in the well-known `Modules` folder and they will be automatically available for you inside the Functions runtime.

To take advantage of this feature, from the root of your _Function App_, create a `Modules` folder if it doesn't already exist and save the module you want to it.

```powershell
mkdir ./Modules
Save-Module MyGalleryModule -Path ./Modules
```

> [!NOTE]
> Remember, your Function App is the container of _all_ of you're functions for a particular project.

Use `Save-Module` to save all of the modules you depend on or copy your own custom modules to the `Modules` folder. Your folder structure should look like the following structure:

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

We ship a few commonly used modules in the last position of the `PSModulePath`. The current list of modules is:

* [Microsoft.PowerShell.Archive](https://www.powershellgallery.com/packages/Microsoft.PowerShell.Archive) - The module for working with archives like `.zip`'s, `.nupkg`'s, etc.
* [Az](https://www.powershellgallery.com/packages/Az) - The Azure PowerShell module

We ship the latest of these modules. If you would like to use a specific version of these modules, you can put them in the Function App level `Modules` folder.

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

## Concurrency

By default, the Azure Functions PowerShell runtime can only process one invocation of an Azure function at a time. However, this amount might not be good enough if:

* You're trying to handle a large number of invocations at the same time
* Have functions invoke other functions inside of a Function App

You can change this behavior by setting the following environment variable to an integer value:

```
PSWorkerInProcConcurrencyUpperBound
```

You set this environment variable in the [app settings](functions-app-settings.md) of your Function App.

### Considerations for using concurrency

PowerShell is a _single threaded_ scripting language by default but concurrency can be added by using multiple PowerShell runspaces in the same process. This feature is how the Azure Functions PowerShell runtime works.

There are some drawbacks with this approach.

#### Concurrency is only as good as the machine it's running on

If your Function App is running on an app service plan that only supports a single core, then concurrency won't help much. That's because there are no additional cores to help balance the load. In fact, that single core will have to context switch between runspaces so performance will vary.

The Azure Functions Consumption plan runs using only one core, so it has this drawback. If you want to take full advantage of concurrency, switch to the dedicated/app service plan over consumption.

#### Azure PowerShell state

Azure PowerShell uses some _process-level_ contexts and state to help save you from excess typing. However, if you opt in to concurrency in your Function App, and invoke actions that change state, you could end up with race conditions that are difficult to debug because one invocation relies on a certain state and the other invocation changed the state.

There's immense value in concurrency with Azure PowerShell since some operations can take a considerable amount of time, but proceed with caution. If you suspect that you're experiencing a race condition, set the concurrency back to `1` and try the request again.

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

Currently, PowerShell doesn't support the use of `entryPoint`.

## Considerations for PowerShell functions

When you work with PowerShell functions, be aware of the considerations in the following sections.

### Cold Start

When developing Azure Functions in the serverless hosting model, cold starts are a reality. *Cold start* refers to the fact that when your function app starts for the first time after a period of inactivity, it takes longer to start up.

### Bundle modules instead of using `Install-Module`

Your script will get run on every invocation. Refrain from using `Install-Module` in your script and instead use `Save-Module` before publishing so that your function doesn't have to waste time downloading the module.

## Next steps

For more information, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
