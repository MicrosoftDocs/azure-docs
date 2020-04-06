---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/14/2019
ms.author: glenga
---
## Local settings file

The local.settings.json file stores app settings, connection strings, and settings used by local development tools. Settings in the local.settings.json file are used only when you're running projects locally. The local settings file has this structure:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "<language worker>",
    "AzureWebJobsStorage": "<connection-string>",
    "AzureWebJobsDashboard": "<connection-string>",
    "MyBindingConnection": "<binding-connection-string>"
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
| **`IsEncrypted`** | When this setting is set to `true`, all values are encrypted with a local machine key. Used with `func settings` commands. Default value is `false`. |
| **`Values`** | Array of application settings and connection strings used when a project is running locally. These key-value (string-string) pairs correspond to application settings in your function app in Azure, like [`AzureWebJobsStorage`]. Many triggers and bindings have a property that refers to a connection string app setting, like `Connection` for the [Blob storage trigger](../articles/azure-functions/functions-bindings-storage-blob-trigger.md#configuration). For these properties, you need an application setting defined in the `Values` array. <br/>[`AzureWebJobsStorage`] is a required app setting for triggers other than HTTP. <br/>Version 2.x and higher of the Functions runtime requires the [`FUNCTIONS_WORKER_RUNTIME`] setting, which is generated for your project by Core Tools. <br/> When you have the [Azure storage emulator](../articles/storage/common/storage-use-emulator.md) installed locally and you set [`AzureWebJobsStorage`] to `UseDevelopmentStorage=true`, Core Tools uses the emulator. The emulator is useful during development, but you should test with an actual storage connection before deployment.<br/> Values must be strings and not JSON objects or arrays. Setting names can't include a colon (`:`) or a double underline (`__`). These characters are reserved by the runtime.  |
| **`Host`** | Settings in this section customize the Functions host process when you run projects locally. These settings are separate from the host.json settings, which also apply when you run projects in Azure. |
| **`LocalHttpPort`** | Sets the default port used when running the local Functions host (`func host start` and `func run`). The `--port` command-line option takes precedence over this setting. |
| **`CORS`** | Defines the origins allowed for [cross-origin resource sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Origins are supplied as a comma-separated list with no spaces. The wildcard value (\*) is supported, which allows requests from any origin. |
| **`CORSCredentials`** |  When set to `true`, allows `withCredentials` requests. |
| **`ConnectionStrings`** | A collection. Don't use this collection for the connection strings used by your function bindings. This collection is used only by frameworks that typically get connection strings from the `ConnectionStrings` section of a configuration file, like [Entity Framework](https://msdn.microsoft.com/library/aa937723(v=vs.113).aspx). Connection strings in this object are added to the environment with the provider type of [System.Data.SqlClient](https://msdn.microsoft.com/library/system.data.sqlclient(v=vs.110).aspx). Items in this collection aren't published to Azure with other app settings. You must explicitly add these values to the `Connection strings` collection of your function app settings. If you're creating a [`SqlConnection`](https://msdn.microsoft.com/library/system.data.sqlclient.sqlconnection(v=vs.110).aspx) in your function code, you should store the connection string value with your other connections in **Application Settings** in the portal. |

[`AzureWebJobsStorage`]: ../articles/azure-functions/functions-app-settings.md#azurewebjobsstorage
