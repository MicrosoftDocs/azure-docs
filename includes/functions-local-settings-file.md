---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/14/2019
ms.author: glenga
---
## Local settings file

The file local.settings.json stores app settings, connection strings, and settings used by local development tools. Settings in the local.settings.json file are only used when running locally. The local settings file has the following structure:

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

The following settings are supported when running locally:

| Setting      | Description                            |
| ------------ | -------------------------------------- |
| **`IsEncrypted`** | When set to `true`, all values are encrypted using a local machine key. Used with `func settings` commands. Default value is `false`. |
| **`Values`** | Array of application settings and connection strings used when running locally. These key-value (string-string) pairs correspond to application settings in your function app in Azure, such as [`AzureWebJobsStorage`]. Many triggers and bindings have a property that refers to a connection string app setting, such as `Connection` for the [Blob storage trigger](../articles/azure-functions/functions-bindings-storage-blob.md#trigger---configuration). For such properties, you need an application setting defined in the `Values` array. <br/>[`AzureWebJobsStorage`] is a required app setting for triggers other than HTTP. <br/>Version 2.x of the Functions runtime requires the [`FUNCTIONS_WORKER_RUNTIME`] setting, which is generated for your project by Core Tools. <br/> When you have the [Azure storage emulator](../articles/storage/common/storage-use-emulator.md) installed locally, you can set [`AzureWebJobsStorage`] to `UseDevelopmentStorage=true` and Core Tools uses the emulator. This is useful during development, but you should test with an actual storage connection before deployment.<br/> Values must be strings and not JSON objects or arrays. Setting names cannot include a colon (`:`) or a double underline (`__`); these are reserved by the runtime.  |
| **`Host`** | Settings in this section customize the Functions host process when running locally. These are separate from the host.json settings, which also apply when running in Azure. |
| **`LocalHttpPort`** | Sets the default port used when running the local Functions host (`func host start` and `func run`). The `--port` command-line option takes precedence over this value. |
| **`CORS`** | Defines the origins allowed for [cross-origin resource sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Origins are supplied as a comma-separated list with no spaces. The wildcard value (\*) is supported, which allows requests from any origin. |
| **`CORSCredentials`** |  Set it to true to allow `withCredentials` requests. |
| **`ConnectionStrings`** | Do not use this collection for the connection strings used by your function bindings. This collection is only used by frameworks that typically get connection strings from the `ConnectionStrings` section of a configuration file, such as [Entity Framework](https://msdn.microsoft.com/library/aa937723(v=vs.113).aspx). Connection strings in this object are added to the environment with the provider type of [System.Data.SqlClient](https://msdn.microsoft.com/library/system.data.sqlclient(v=vs.110).aspx). Items in this collection are not published to Azure with other app settings. You must explicitly add these values to the `Connection strings` collection of your function app settings. If you are creating a [`SqlConnection`](https://msdn.microsoft.com/library/system.data.sqlclient.sqlconnection(v=vs.110).aspx) in your function code, you should store the connection string value in **Application Settings** in the portal with your other connections. |

[`AzureWebJobsStorage`]: ../articles/azure-functions/functions-app-settings.md#azurewebjobsstorage
