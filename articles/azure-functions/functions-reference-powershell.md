---
title: PowerShell developer reference for Azure Functions
description: Understand how to develop functions by using PowerShell.
author: eamonoreilly
ms.topic: conceptual
ms.devlang: powershell
ms.custom: devx-track-dotnet
ms.date: 04/22/2019
# Customer intent: As a PowerShell developer, I want to understand Azure Functions so that I can leverage the full power of the platform.
---

# Azure Functions PowerShell developer guide

This article provides details about how you write Azure Functions using PowerShell.

A PowerShell Azure function (function) is represented as a PowerShell script that executes when triggered. Each function script has a related `function.json` file that defines how the function behaves, such as how it's triggered and its input and output parameters. To learn more, see the [Triggers and binding article](functions-triggers-bindings.md). 

Like other kinds of functions, PowerShell script functions take in parameters that match the names of all the input bindings defined in the `function.json` file. A `TriggerMetadata` parameter is also passed that contains additional information on the trigger that started the function.

This article assumes that you have already read the [Azure Functions developer reference](functions-reference.md). You should have also completed the [Functions quickstart for PowerShell](./create-first-function-vs-code-powershell.md) to create your first PowerShell function.

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
 | - requirements.psd1
 | - profile.ps1
 | - extensions.csproj
 | - bin
```

At the root of the project, there's a shared [`host.json`](functions-host-json.md) file that can be used to configure the function app. Each function has a folder with its own code file (.ps1) and binding configuration file (`function.json`). The name of the function.json file's parent directory is always the name of your function.

Certain bindings require the presence of an `extensions.csproj` file. Binding extensions, required in [version 2.x and later versions](functions-versions.md) of the Functions runtime, are defined in the `extensions.csproj` file, with the actual library files in the `bin` folder. When developing locally, you must [register binding extensions](functions-bindings-register.md#extension-bundles). When developing functions in the Azure portal, this registration is done for you.

In PowerShell Function Apps, you may optionally have a `profile.ps1` which runs when a function app starts to run (otherwise know as a *[cold start](#cold-start)*). For more information, see [PowerShell profile](#powershell-profile).

## Defining a PowerShell script as a function

By default, the Functions runtime looks for your function in `run.ps1`, where `run.ps1` shares the same parent directory as its corresponding `function.json`.

Your script is passed a number of arguments on execution. To handle these parameters, add a `param` block to the top of your script as in the following example:

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

Every trigger type has a different set of metadata. For example, the `$TriggerMetadata` for `QueueTrigger` contains the `InsertionTime`, `Id`, `DequeueCount`, among other things. For more information on the queue trigger's metadata, go to the [official documentation for queue triggers](functions-bindings-storage-queue-trigger.md#message-metadata). Check the documentation on the [triggers](functions-triggers-bindings.md) you're working with to see what comes inside the trigger metadata.

## Bindings

In PowerShell, [bindings](functions-triggers-bindings.md) are configured and defined in a function's function.json. Functions interact with bindings a number of ways.

### Reading trigger and input data

Trigger and input bindings are read as parameters passed to your function. Input bindings have a `direction` set to `in` in function.json. The `name` property defined in `function.json` is the name of the parameter, in the `param` block. Since PowerShell uses named parameters for binding, the order of the parameters doesn't matter. However, it's a best practice to follow the order of the bindings defined in the `function.json`.

```powershell
param($MyFirstInputBinding, $MySecondInputBinding)
```

### Writing output data

In Functions, an output binding has a `direction` set to `out` in the function.json. You can write to an output binding by using the `Push-OutputBinding` cmdlet, which is available to the Functions runtime. In all cases, the `name` property of the binding as defined in `function.json` corresponds to the `Name` parameter of the `Push-OutputBinding` cmdlet.

The following shows how to call `Push-OutputBinding` in your function script:

```powershell
param($MyFirstInputBinding, $MySecondInputBinding)

Push-OutputBinding -Name myQueue -Value $myValue
```

You can also pass in a value for a specific binding through the pipeline.

```powershell
param($MyFirstInputBinding, $MySecondInputBinding)

Produce-MyOutputValue | Push-OutputBinding -Name myQueue
```

`Push-OutputBinding` behaves differently based on the value specified for `-Name`:

* When the specified name cannot be resolved to a valid output binding, then an error
      is thrown.

* When the output binding accepts a collection of values, you can call `Push-OutputBinding` repeatedly to push multiple values.

* When the output binding only accepts a singleton value, calling `Push-OutputBinding` a second time raises an error.

#### Push-OutputBinding syntax

The following are valid parameters for calling `Push-OutputBinding`:

| Name | Type | Position | Description |
| ---- | ---- |  -------- | ----------- |
| **`-Name`** | String | 1 | The name of the output binding you want to set. |
| **`-Value`** | Object | 2 | The value of the output binding you want to set, which is accepted from the pipeline ByValue. |
| **`-Clobber`** | SwitchParameter | Named | (Optional) When specified, forces the value to be set for a specified output binding. | 

The following common parameters are also supported: 
* `Verbose`
* `Debug`
* `ErrorAction`
* `ErrorVariable`
* `WarningAction`
* `WarningVariable`
* `OutBuffer`
* `PipelineVariable`
* `OutVariable` 

For more information, see [About CommonParameters](/powershell/module/microsoft.powershell.core/about/about_commonparameters).

#### Push-OutputBinding example: HTTP responses

An HTTP trigger returns a response using an output binding named `response`. In the following example, the output binding of `response` has the value of "output #1":

```powershell
PS >Push-OutputBinding -Name response -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = "output #1"
})
```

Because the output is to HTTP, which accepts a singleton value only, an error is thrown when `Push-OutputBinding` is called a second time.

```powershell
PS >Push-OutputBinding -Name response -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = "output #2"
})
```

For outputs that only accept singleton values, you can use the `-Clobber` parameter to override the old value instead of trying to add to a collection. The following example assumes that you have already added a value. By using `-Clobber`, the response from the following example overrides the existing value to return a value of "output #3":

```powershell
PS >Push-OutputBinding -Name response -Value ([HttpResponseContext]@{
    StatusCode = [System.Net.HttpStatusCode]::OK
    Body = "output #3"
}) -Clobber
```

#### Push-OutputBinding example: Queue output binding

`Push-OutputBinding` is used to send data to output bindings, such as an [Azure Queue storage output binding](functions-bindings-storage-queue-output.md). In the following example, the message written to the queue has a value of "output #1":

```powershell
PS >Push-OutputBinding -Name outQueue -Value "output #1"
```

The output binding for a Storage queue accepts multiple output values. In this case, calling the following example after the first writes to the queue a list with two items: "output #1" and "output #2".

```powershell
PS >Push-OutputBinding -Name outQueue -Value "output #2"
```

The following example, when called after the previous two, adds two more values to the output collection:

```powershell
PS >Push-OutputBinding -Name outQueue -Value @("output #3", "output #4")
```

When written to the queue, the message contains these four values: "output #1", "output #2", "output #3", and "output #4".

#### Get-OutputBinding cmdlet

You can use the `Get-OutputBinding` cmdlet to retrieve the values currently set for your output bindings. This cmdlet retrieves a hashtable that contains the names of the output bindings with their respective values. 

The following is an example of using `Get-OutputBinding` to return current binding values:

```powershell
Get-OutputBinding
```

```Output
Name                           Value
----                           -----
MyQueue                        myData
MyOtherQueue                   myData
```

`Get-OutputBinding` also contains a parameter called `-Name`, which can be used to filter the returned binding, as in the following example:

```powershell
Get-OutputBinding -Name MyQ*
```

```Output
Name                           Value
----                           -----
MyQueue                        myData
```

Wildcards (*) are supported in `Get-OutputBinding`.

## Logging

Logging in PowerShell functions works like regular PowerShell logging. You can use the logging cmdlets to write to each output stream. Each cmdlet maps to a log level used by Functions.

| Functions logging level | Logging cmdlet |
| ------------- | -------------- |
| Error | **`Write-Error`** |
| Warning | **`Write-Warning`**  | 
| Information | **`Write-Information`** <br/> **`Write-Host`** <br /> **`Write-Output`** <br/> Writes to the `Information` log level. |
| Debug | **`Write-Debug`** |
| Trace | **`Write-Progress`** <br /> **`Write-Verbose`** |

In addition to these cmdlets, anything written to the pipeline is redirected to the `Information` log level and displayed with the default PowerShell formatting.

> [!IMPORTANT]
> Using the `Write-Verbose` or `Write-Debug` cmdlets is not enough to see verbose and debug level logging. You must also configure the log level threshold, which declares what level of logs you actually care about. To learn more, see [Configure the function app log level](#configure-the-function-app-log-level).

### Configure the function app log level

Azure Functions lets you define the threshold level to make it easy to control the way Functions writes to the logs. To set the threshold for all traces written to the console, use the `logging.logLevel.default` property in the [`host.json` file][host.json reference]. This setting applies to all functions in your function app.

The following example sets the threshold to enable verbose logging for all functions, but sets the threshold to enable debug logging for a function named `MyFunction`:

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

For more information, see [host.json reference].

### Viewing the logs

If your Function App is running in Azure, you can use Application Insights to monitor it. Read [monitoring Azure Functions](functions-monitoring.md) to learn more about viewing and querying function logs.

If you're running your Function App locally for development, logs default to the file system. To see the logs in the console, set the `AZURE_FUNCTIONS_ENVIRONMENT` environment variable to `Development` before starting the Function App.

## Triggers and bindings types

There are a number of triggers and bindings available to you to use with your function app. The full list of triggers and bindings [can be found here](functions-triggers-bindings.md#supported-bindings).

All triggers and bindings are represented in code as a few real data types:

* Hashtable
* string
* byte[]
* int
* double
* HttpRequestContext
* HttpResponseContext

The first five types in this list are standard .NET types. The last two are used only by the [HttpTrigger trigger](#http-triggers-and-bindings).

Each binding parameter in your functions must be one of these types.

### HTTP triggers and bindings

HTTP and webhook triggers and HTTP output bindings use request and response objects to represent the HTTP messaging.

#### Request object

The request object that's passed into the script is of the type `HttpRequestContext`, which has the following properties:

| Property  | Description                                                    | Type                      |
|-----------|----------------------------------------------------------------|---------------------------|
| **`Body`**    | An object that contains the body of the request. `Body` is serialized into the best type based on the data. For example, if the data is JSON, it's passed in as a hashtable. If the data is a string, it's passed in as a string. | object |
| **`Headers`** | A dictionary that contains the request headers.                | Dictionary<string,string><sup>*</sup> |
| **`Method`** | The HTTP method of the request.                                | string                    |
| **`Params`**  | An object that contains the routing parameters of the request. | Dictionary<string,string><sup>*</sup> |
| **`Query`** | An object that contains the query parameters.                  | Dictionary<string,string><sup>*</sup> |
| **`Url`** | The URL of the request.                                        | string                    |

<sup>*</sup> All `Dictionary<string,string>` keys are case-insensitive.

#### Response object

The response object that you should send back is of the type `HttpResponseContext`, which has the following properties:

| Property      | Description                                                 | Type                      |
|---------------|-------------------------------------------------------------|---------------------------|
| **`Body`**  | An object that contains the body of the response.           | object                    |
| **`ContentType`** | A short hand for setting the content type for the response. | string                    |
| **`Headers`** | An object that contains the response headers.               | Dictionary or Hashtable   |
| **`StatusCode`**  | The HTTP status code of the response.                       | string or int             |

#### Accessing the request and response

When you work with HTTP triggers, you can access the HTTP request the same way you would with any other input binding. It's in the `param` block.

Use an `HttpResponseContext` object to return a response, as shown in the following:

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
      "direction": "out",
      "name": "Response"
    }
  ]
}
```

`run.ps1`

```powershell
param($req, $TriggerMetadata)

$name = $req.Query.Name

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
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

For certain bindings like the blob binding, you're able to specify the type of the parameter.

For example, to have data from Blob storage supplied as a string, add the following type cast to my `param` block:

```powershell
param([string] $myBlob)
```

## PowerShell profile

In PowerShell, there's the concept of a PowerShell profile. If you're not familiar with PowerShell profiles, see [About profiles](/powershell/module/microsoft.powershell.core/about/about_profiles).

In PowerShell Functions, the profile script is executed once per PowerShell worker instance in the app when first deployed and after being idled ([cold start](#cold-start). When concurrency is enabled by setting the [PSWorkerInProcConcurrencyUpperBound](#concurrency) value, the profile script is run for each runspace created.

When you create a function app using tools, such as Visual Studio Code and Azure Functions Core Tools, a default `profile.ps1` is created for you. The default profile is maintained
[on the Core Tools GitHub repository](https://github.com/Azure/azure-functions-core-tools/blob/dev/src/Azure.Functions.Cli/StaticResources/profile.ps1)
and contains:

* Automatic MSI authentication to Azure.
* The ability to turn on the Azure PowerShell `AzureRM` PowerShell aliases if you would like.

## PowerShell versions

The following table shows the PowerShell versions available to each major version of the Functions runtime, and the .NET version required:

| Functions version | PowerShell version                               | .NET version  | 
|-------------------|--------------------------------------------------|---------------|
| 4.x | PowerShell 7.2 | .NET 6 |

You can see the current version by printing `$PSVersionTable` from any function.

To learn more about Azure Functions runtime support policy, please refer to this [article](./language-support-policy.md)

### Running local on a specific version

Support for PowerShell 7.0 in Azure Functions has ended on 3 December 2022. To use PowerShell 7.2 when running locally, you need to add the setting `"FUNCTIONS_WORKER_RUNTIME_VERSION" : "7.2"` to the `Values` array in the local.setting.json file in the project root. When running locally on PowerShell 7.2, your local.settings.json file looks like the following example: 

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "powershell",
    "FUNCTIONS_WORKER_RUNTIME_VERSION" : "7.2"
  }
}
```

> [!NOTE]
> In PowerShell Functions, the value "~7" for FUNCTIONS_WORKER_RUNTIME_VERSION refers to "7.0.x". We do not automatically upgrade PowerShell Function apps that have "~7" to "7.2". Going forward, for PowerShell Function Apps, we will require that apps specify both the major and minor version they want to target. Hence, it is necessary to mention "7.2" if you want to target "7.2.x"

### Changing the PowerShell version

Support for PowerShell 7.0 in Azure Functions has ended on 3 December 2022. To upgrade your Function App to PowerShell 7.2, ensure the value of FUNCTIONS_EXTENSION_VERSION is set to ~4. To learn how to do this, see [View and update the current runtime version](set-runtime-version.md#view-and-update-the-current-runtime-version).


Use the following steps to change the PowerShell version used by your function app. You can do this either in the Azure portal or by using PowerShell.

# [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), browse to your function app.

1. Under **Settings**, choose **Configuration**. In the **General settings** tab, locate the **PowerShell version**. 
 
 	![image](https://user-images.githubusercontent.com/108835427/199586564-25600629-44c7-439c-91f9-a500ad2989c4.png)
 
1. Choose your desired **PowerShell Core version** and select **Save**. When warned about the pending restart choose **Continue**. The function app restarts on the chosen PowerShell version. 

# [PowerShell](#tab/powershell)

Run the following script to change the PowerShell version: 

```powershell
Set-AzResource -ResourceId "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.Web/sites/<FUNCTION_APP>/config/web" -Properties @{  powerShellVersion  = '<VERSION>' } -Force -UsePatchSemantics

```

Replace `<SUBSCRIPTION_ID>`, `<RESOURCE_GROUP>`, and `<FUNCTION_APP>` with the ID of your Azure subscription, the name of your resource group and function app, respectively.  Also, replace `<VERSION>` with `7.2`. You can verify the updated value of the `powerShellVersion` setting in `Properties` of the returned hash table. 

---

The function app restarts after the change is made to the configuration.

## Dependency management

Functions lets you leverage [PowerShell gallery](https://www.powershellgallery.com) for managing dependencies. With dependency management enabled, the requirements.psd1 file is used to automatically download required modules. You enable this behavior by setting the `managedDependency` property to `true` in the root of the [host.json file](functions-host-json.md), as in the following example:

```json
{
  "managedDependency": {
          "enabled": true
       }
}
```

When you create a new PowerShell functions project, dependency management is enabled by default, with the Azure [`Az` module](/powershell/azure/new-azureps-module-az) included. The maximum number of modules currently supported is 10. The supported syntax is *`MajorNumber.*`* or exact module version, as shown in the following requirements.psd1 example:

```powershell
@{
	Az = '1.*'
	SqlServer = '21.1.18147'
}
```

When you update the requirements.psd1 file, updated modules are installed after a restart.

### Target specific versions

You may want to target a specific version of a module in your requirements.psd1 file. For example, if you wanted to use an older version of Az.Accounts than the one in the included Az module, you would need to target a specific version as shown in the following example: 

```powershell
@{
	'Az.Accounts' = '1.9.5'
}
```

In this case, you also need to add an import statement to the top of your profile.ps1 file, which looks like the following example:

```powershell
Import-Module Az.Accounts -RequiredVersion '1.9.5'
```

In this way, the older version of the Az.Account module is loaded first when the function is started.

### Dependency management considerations

The following considerations apply when using dependency management:

+ Managed dependencies requires access to `https://www.powershellgallery.com` to download modules. When running locally, make sure that the runtime can access this URL by adding any required firewall rules.

+ Managed dependencies currently don't support modules that require the user to accept a license, either by accepting the license interactively, or by providing `-AcceptLicense` switch when invoking `Install-Module`.

### Dependency management app settings

The following application settings can be used to change how the managed dependencies are downloaded and installed. 

| Function App setting              | Default value             | Description                                         |
|   -----------------------------   |   -------------------     |  -----------------------------------------------    |
| **MDMaxBackgroundUpgradePeriod**      | `7.00:00:00` (seven days)     | Controls the background update period for PowerShell function apps. To learn more, see [MDMaxBackgroundUpgradePeriod](functions-app-settings.md#mdmaxbackgroundupgradeperiod). | 
| **MDNewSnapshotCheckPeriod**         | `01:00:00` (one hour)       | Specifies how often each PowerShell worker checks whether managed dependency upgrades have been installed. To learn more, see [MDNewSnapshotCheckPeriod](functions-app-settings.md#mdnewsnapshotcheckperiod).|
| **MDMinBackgroundUpgradePeriod**      | `1.00:00:00` (one day)     | The period of time after a previous upgrade check before another upgrade check is started. To learn more, see [MDMinBackgroundUpgradePeriod](functions-app-settings.md#mdminbackgroundupgradeperiod).|

Essentially, your app upgrade starts within `MDMaxBackgroundUpgradePeriod`, and the upgrade process completes within approximately the `MDNewSnapshotCheckPeriod`.

## Custom modules

Leveraging your own custom modules in Azure Functions differs from how you would do it normally for PowerShell.

On your local computer, the module gets installed in one of the globally available folders in your `$env:PSModulePath`. When running in Azure, you don't have access to the modules installed on your machine. This means that the `$env:PSModulePath` for a PowerShell function app differs from `$env:PSModulePath` in a regular PowerShell script.

In Functions, `PSModulePath` contains two paths:

* A `Modules` folder that exists at the root of your function app.
* A path to a `Modules` folder that is controlled by the PowerShell language worker.

### Function app-level modules folder

To use custom modules, you can place modules on which your functions depend in a `Modules` folder. From this folder, modules are automatically available to the functions runtime. Any function in the function app can use these modules. 

> [!NOTE]
> Modules specified in the [requirements.psd1 file](#dependency-management) are automatically downloaded and included in the path so you don't need to include them in the modules folder. These are stored locally in the `$env:LOCALAPPDATA/AzureFunctions` folder and in the `/data/ManagedDependencies` folder when run in the cloud.

To take advantage of the custom module feature, create a `Modules` folder in the root of your function app. Copy the modules you want to use in your functions to this location.

```powershell
mkdir ./Modules
Copy-Item -Path /mymodules/mycustommodule -Destination ./Modules -Recurse
```

With a `Modules` folder, your function app should have the following folder structure:

```
PSFunctionApp
 | - MyFunction
 | | - run.ps1
 | | - function.json
 | - Modules
 | | - MyCustomModule
 | | - MyOtherCustomModule
 | | - MySpecialModule.psm1
 | - local.settings.json
 | - host.json
 | - requirements.psd1
```

When you start your function app, the PowerShell language worker adds this `Modules` folder to the `$env:PSModulePath` so that you can rely on module autoloading just as you would in a regular PowerShell script.

### Language worker level modules folder

Several modules are commonly used by the PowerShell language worker. These modules are defined in the last position of `PSModulePath`. 

The current list of modules is as follows:

* [Microsoft.PowerShell.Archive](https://www.powershellgallery.com/packages/Microsoft.PowerShell.Archive): module used for working with archives, like `.zip`, `.nupkg`, and others.
* **ThreadJob**: A thread-based implementation of the PowerShell job APIs.

By default, Functions uses the most recent version of these modules. To use a specific module version, put that specific version in the `Modules` folder of your function app.

## Environment variables

In Functions, [app settings](functions-app-settings.md), such as service connection strings, are exposed as environment variables during execution. You can access these settings using `$env:NAME_OF_ENV_VAR`, as shown in the following example:

```powershell
param($myTimer)

Write-Host "PowerShell timer trigger function ran! $(Get-Date)"
Write-Host $env:AzureWebJobsStorage
Write-Host $env:WEBSITE_SITE_NAME
```

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

When running locally, app settings are read from the [local.settings.json](functions-develop-local.md#local-settings-file) project file.

## Concurrency

By default, the Functions PowerShell runtime can only process one invocation of a function at a time. However, this concurrency level might not be sufficient in the following situations:

* When you're trying to handle a large number of invocations at the same time.
* When you have functions that invoke other functions inside the same function app.

There are a few concurrency models that you could explore depending on the type of workload:

* Increase ```FUNCTIONS_WORKER_PROCESS_COUNT```. This allows handling function invocations in multiple processes within the same instance, which introduces certain CPU and memory overhead. In general, I/O-bound functions will not suffer from this overhead. For CPU-bound functions, the impact may be significant.

* Increase the ```PSWorkerInProcConcurrencyUpperBound``` app setting value. This allows creating multiple runspaces within the same process, which significantly reduces CPU and memory overhead.

You set these environment variables in the [app settings](functions-app-settings.md) of your function app.

Depending on your use case, Durable Functions may significantly improve scalability. To learn more, see [Durable Functions application patterns](./durable/durable-functions-overview.md?tabs=powershell#application-patterns).

>[!NOTE]
> You might get "requests are being queued due to no available runspaces" warnings, please note that this is not an error. The message is telling you that requests are being queued and they will be handled when the previous requests are completed.

### Considerations for using concurrency

PowerShell is a *single_threaded* scripting language by default. However, concurrency can be added by using multiple PowerShell runspaces in the same process. The number of runspaces created, and therefore the number of concurrent threads per worker, is limited by the `PSWorkerInProcConcurrencyUpperBound` application setting. By default, the number of runspaces is set to 1,000 in version 4.x of the Functions runtime. In versions 3.x and below, the maximum number of runspaces is set to 1. The throughput will be impacted by the amount of CPU and memory available in the selected plan.

Azure PowerShell uses some *process-level* contexts and state to help save you from excess typing. However, if you turn on concurrency in your function app and invoke actions that change state, you could end up with race conditions. These race conditions are difficult to debug because one invocation relies on a certain state and the other invocation changed the state.

There's immense value in concurrency with Azure PowerShell, since some operations can take a considerable amount of time. However, you must proceed with caution. If you suspect that you're experiencing a race condition, set the PSWorkerInProcConcurrencyUpperBound app setting to `1` and instead use [language worker process level isolation](functions-app-settings.md#functions_worker_process_count) for concurrency.

## Configure function scriptFile

By default, a PowerShell function is executed from `run.ps1`, a file that shares the same parent directory as its corresponding `function.json`.

The `scriptFile` property in the `function.json` can be used to get a folder structure that looks like the following example:

```
FunctionApp
 | - host.json
 | - myFunction
 | | - function.json
 | - lib
 | | - PSFunction.ps1
```

In this case, the `function.json` for `myFunction` includes a `scriptFile` property referencing the file with the exported function to run.

```json
{
  "scriptFile": "../lib/PSFunction.ps1",
  "bindings": [
    // ...
  ]
}
```

## Use PowerShell modules by configuring an entryPoint

This article has shown PowerShell functions in the default `run.ps1` script file generated by the templates.
However, you can also include your functions in PowerShell modules. You can reference your specific function code in the module by using the `scriptFile` and `entryPoint` fields in the function.json` configuration file.

In this case, `entryPoint` is the name of a function or cmdlet in the PowerShell module referenced in `scriptFile`.

Consider the following folder structure:

```
FunctionApp
 | - host.json
 | - myFunction
 | | - function.json
 | - lib
 | | - PSFunction.psm1
```

Where `PSFunction.psm1` contains:

```powershell
function Invoke-PSTestFunc {
    param($InputBinding, $TriggerMetadata)

    Push-OutputBinding -Name OutputBinding -Value "output"
}

Export-ModuleMember -Function "Invoke-PSTestFunc"
```

In this example, the configuration for `myFunction` includes a `scriptFile` property that references `PSFunction.psm1`, which is a PowerShell module in another folder.  The `entryPoint` property references the `Invoke-PSTestFunc` function, which is the entry point in the module.

```json
{
  "scriptFile": "../lib/PSFunction.psm1",
  "entryPoint": "Invoke-PSTestFunc",
  "bindings": [
    // ...
  ]
}
```

With this configuration, the `Invoke-PSTestFunc` gets executed exactly as a `run.ps1` would.

## Considerations for PowerShell functions

When you work with PowerShell functions, be aware of the considerations in the following sections.

### Cold Start

When developing Azure Functions in the [serverless hosting model](consumption-plan.md), cold starts are a reality. *Cold start* refers to period of time it takes for your function app to start running to process a request. Cold start happens more frequently in the Consumption plan because your function app gets shut down during periods of inactivity.

### Bundle modules instead of using Install-Module

Your script is run on every invocation. Avoid using `Install-Module` in your script. Instead use `Save-Module` before publishing so that your function doesn't have to waste time downloading the module. If cold starts are impacting your functions, consider deploying your function app to an [App Service plan](dedicated-plan.md) set to *always on* or to a [Premium plan](functions-premium-plan.md).

## Next steps

For more information, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)

[host.json reference]: functions-host-json.md
