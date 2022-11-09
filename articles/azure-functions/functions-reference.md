---
title: Guidance for developing Azure Functions 
description: Learn the Azure Functions concepts and techniques that you need to develop functions in Azure, across all programming languages and bindings.
ms.assetid: d8efe41a-bef8-4167-ba97-f3e016fcd39e
ms.topic: conceptual
ms.date: 9/02/2021
ms.devlang: csharp
ms.custom: ignite-2022
---
# Azure Functions developer guide
In Azure Functions, specific functions share a few core technical concepts and components, regardless of the language or binding you use. Before you jump into learning details specific to a given language or binding, be sure to read through this overview that applies to all of them.

This article assumes that you've already read the [Azure Functions overview](functions-overview.md).

## Function code
A *function* is the primary concept in Azure Functions. A function contains two important pieces - your code, which can be written in a variety of languages, and some config, the function.json file. For compiled languages, this config file is generated automatically from annotations in your code. For scripting languages, you must provide the config file yourself.

The function.json file defines the function's trigger, bindings, and other configuration settings. Every function has one and only one trigger. The runtime uses this config file to determine the events to monitor and how to pass data into and return data from a function execution. The following is an example function.json file.

```json
{
    "disabled":false,
    "bindings":[
        // ... bindings here
        {
            "type": "bindingType",
            "direction": "in",
            "name": "myParamName",
            // ... more depending on binding
        }
    ]
}
```

For more information, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

The `bindings` property is where you configure both triggers and bindings. Each binding shares a few common settings and some settings which are specific to a particular type of binding. Every binding requires the following settings:

| Property    | Values | Type | Comments|
|---|---|---|---|
| type  | Name of binding.<br><br>For example, `queueTrigger`. | string | |
| direction | `in`, `out`  | string | Indicates whether the binding is for receiving data into the function or sending data from the function. |
| name | Function identifier.<br><br>For example, `myQueue`. | string | The name that is used for the bound data in the function. For C#, this is an argument name; for JavaScript, it's the key in a key/value list. |

## Function app
A function app provides an execution context in Azure in which your functions run. As such, it is the unit of deployment and management for your functions. A function app is comprised of one or more individual functions that are managed, deployed, and scaled together. All of the functions in a function app share the same pricing plan, deployment method, and runtime version. Think of a function app as a way to organize and collectively manage your functions. To learn more, see [How to manage a function app](functions-how-to-use-azure-function-app-settings.md). 

> [!NOTE]
> All functions in a function app must be authored in the same language. In [previous versions](functions-versions.md) of the Azure Functions runtime, this wasn't required.

## Folder structure
[!INCLUDE [functions-folder-structure](../../includes/functions-folder-structure.md)]

The above is the default (and recommended) folder structure for a Function app. If you wish to change the file location of a function's code, modify the `scriptFile` section of the _function.json_ file. We also recommend using [package deployment](deployment-zip-push.md) to deploy your project to your function app in Azure. You can also use existing tools like [continuous integration and deployment](functions-continuous-deployment.md) and Azure DevOps.

> [!NOTE]
> If deploying a package manually, make sure to deploy your _host.json_ file and function folders directly to the `wwwroot` folder. Do not include the `wwwroot` folder in your deployments. Otherwise, you end up with `wwwroot\wwwroot` folders.

#### Use local tools and publishing
Function apps can be authored and published using a variety of tools, including [Visual Studio](./functions-develop-vs.md), [Visual Studio Code](./create-first-function-vs-code-csharp.md), [IntelliJ](./functions-create-maven-intellij.md), [Eclipse](./functions-create-maven-eclipse.md), and the [Azure Functions Core Tools](./functions-develop-local.md). For more information, see [Code and test Azure Functions locally](./functions-develop-local.md).

<!--NOTE: I've removed documentation on FTP, because it does not sync triggers on the consumption plan --glenga -->

## <a id="fileupdate"></a> How to edit functions in the Azure portal
The Functions editor built into the Azure portal lets you update your code and your *function.json* file directly inline. This is recommended only for small changes or proofs of concept - best practice is to use a local development tool like VS Code.

## Parallel execution
When multiple triggering events occur faster than a single-threaded function runtime can process them, the runtime may invoke the function multiple times in parallel.  If a function app is using the [Consumption hosting plan](event-driven-scaling.md), the function app could scale out automatically.  Each instance of the function app, whether the app runs on the Consumption hosting plan or a regular [App Service hosting plan](../app-service/overview-hosting-plans.md), might process concurrent function invocations in parallel using multiple threads.  The maximum number of concurrent function invocations in each function app instance varies based on the type of trigger being used as well as the resources used by other functions within the function app.

## Functions runtime versioning

You can configure the version of the Functions runtime using the `FUNCTIONS_EXTENSION_VERSION` app setting. For example, the value "~3" indicates that your function app will use 3.x as its major version. Function apps are upgraded to each new minor version as they are released. For more information, including how to view the exact version of your function app, see [How to target Azure Functions runtime versions](set-runtime-version.md).

## Repositories
The code for Azure Functions is open source and stored in GitHub repositories:

* [Azure Functions](https://github.com/Azure/Azure-Functions)
* [Azure Functions host](https://github.com/Azure/azure-functions-host/)
* [Azure Functions portal](https://github.com/azure/azure-functions-ux)
* [Azure Functions templates](https://github.com/azure/azure-functions-templates)
* [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/)
* [Azure WebJobs SDK Extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/)

## Bindings
Here is a table of all supported bindings.

[!INCLUDE [dynamic compute](../../includes/functions-bindings.md)]

Having issues with errors coming from the bindings? Review the [Azure Functions Binding Error Codes](functions-bindings-error-pages.md) documentation.


## Connections

Your function project references connection information by name from its configuration provider. It does not directly accept the connection details, allowing them to be changed across environments. For example, a trigger definition might include a `connection` property. This might refer to a connection string, but you cannot set the connection string directly in a `function.json`. Instead, you would set `connection` to the name of an environment variable that contains the connection string.

The default configuration provider uses environment variables. These might be set by [Application Settings](./functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings) when running in the Azure Functions service, or from the [local settings file](functions-develop-local.md#local-settings-file) when developing locally.

### Connection values

When the connection name resolves to a single exact value, the runtime identifies the value as a _connection string_, which typically includes a secret. The details of a connection string are defined by the service to which you wish to connect.

However, a connection name can also refer to a collection of multiple configuration items, useful for configuring [identity-based connections](#configure-an-identity-based-connection). Environment variables can be treated as a collection by using a shared prefix that ends in double underscores `__`. The group can then be referenced by setting the connection name to this prefix.

For example, the `connection` property for an Azure Blob trigger definition might be "Storage1". As long as there is no single string value configured by an environment variable named "Storage1",  an environment variable named `Storage1__blobServiceUri` could be used to inform the `blobServiceUri` property of the connection. The connection properties are different for each service. Refer to the documentation for the component that uses the connection.

> [!NOTE]
> When using [Azure App Configuration](../azure-app-configuration/quickstart-azure-functions-csharp.md) or [Key Vault](../key-vault/general/overview.md) to provide settings for Managed Identity connections, setting names should use a valid key separator such as `:` or `/` in place of the `__` to ensure names are resolved correctly.
> 
> For example, `Storage1:blobServiceUri`.

### Configure an identity-based connection

Some connections in Azure Functions can be configured to use an identity instead of a secret. Support depends on the extension using the connection. In some cases, a connection string may still be required in Functions even though the service to which you are connecting supports identity-based connections. For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md).

Identity-based connections are supported by the following components:

| Connection source                                       | Plans supported | Learn more                                                                                                         |
|---------------------------------------------------------|-----------------|--------------------------------------------------------------------------------------------------------------------|
| Azure Blob triggers and bindings               | All             | [Extension version 5.0.0 or later](./functions-bindings-storage-blob.md#install-extension)     |
| Azure Queue triggers and bindings            | All             | [Extension version 5.0.0 or later](./functions-bindings-storage-queue.md#storage-extension-5x-and-higher)    |
| Azure Event Hubs triggers and bindings     | All             | [Extension version 5.0.0 or later](./functions-bindings-event-hubs.md?tabs=extensionv5)    |
| Azure Service Bus triggers and bindings       | All             | [Extension version 5.0.0 or later](./functions-bindings-service-bus.md)  |
| Azure Cosmos DB triggers and bindings - Preview         | Elastic Premium | [Extension version 4.0.0-preview1 or later](.//functions-bindings-cosmosdb-v2.md?tabs=extensionv4) |
| Azure Tables (when using Azure Storage) - Preview | All | [Azure Cosmos DB for Table extension](./functions-bindings-storage-table.md#table-api-extension) |
| Durable Functions storage provider (Azure Storage) - Preview | All | [Extension version 2.7.0 or later](https://github.com/Azure/azure-functions-durable-extension/releases/tag/v2.7.0) | 
| Host-required storage ("AzureWebJobsStorage") - Preview | All             | [Connecting to host storage with an identity](#connecting-to-host-storage-with-an-identity-preview)                        |

[!INCLUDE [functions-identity-based-connections-configuration](../../includes/functions-identity-based-connections-configuration.md)]

Choose a tab below to learn about permissions for each component:

# [Azure Blobs extension](#tab/blob)

[!INCLUDE [functions-blob-permissions](../../includes/functions-blob-permissions.md)]

# [Azure Queues extension](#tab/queue)

[!INCLUDE [functions-queue-permissions](../../includes/functions-queue-permissions.md)]

# [Event Hubs extension](#tab/eventhubs)

[!INCLUDE [functions-event-hubs-permissions](../../includes/functions-event-hubs-permissions.md)]

# [Service Bus extension](#tab/servicebus)

[!INCLUDE [functions-service-bus-permissions](../../includes/functions-service-bus-permissions.md)]

# [Azure Cosmos DB extension (preview)](#tab/cosmos)

[!INCLUDE [functions-cosmos-permissions](../../includes/functions-cosmos-permissions.md)]

# [Azure Tables API extension (preview)](#tab/table)

[!INCLUDE [functions-table-permissions](../../includes/functions-table-permissions.md)]

# [Durable Functions storage provider (preview)](#tab/durable)

[!INCLUDE [functions-durable-permissions](../../includes/functions-durable-permissions.md)]

# [Functions host storage (preview)](#tab/azurewebjobsstorage)

[!INCLUDE [functions-azurewebjobsstorage-permissions](../../includes/functions-azurewebjobsstorage-permissions.md)]

---

#### Common properties for identity-based connections

An identity-based connection for an Azure service accepts the following common properties, where `<CONNECTION_NAME_PREFIX>` is the value of your `connection` property in the trigger or binding definition:

| Property    |  Environment variable template | Description |
|---|---|---|---|
| Token Credential |  `<CONNECTION_NAME_PREFIX>__credential` | Defines how a token should be obtained for the connection. Recommended only when specifying a user-assigned identity, when it should be set to "managedidentity". This is only valid when hosted in the Azure Functions service. |
| Client ID | `<CONNECTION_NAME_PREFIX>__clientId` | When `credential` is set to "managedidentity", this property specifies the user-assigned identity to be used when obtaining a token. The property accepts a client ID corresponding to a user-assigned identity assigned to the application. If not specified, the system-assigned identity will be used. This property is used differently in [local development scenarios](#local-development-with-identity-based-connections), when `credential` should not be set. |

Additional options may be supported for a given connection type. Please refer to the documentation for the component making the connection.

##### Local development with identity-based connections

> [!NOTE]
> Local development with identity-based connections requires updated versions of the [Azure Functions Core Tools](./functions-run-local.md). You can check your currently installed version by running `func -v`. For Functions v3, use version `3.0.3904` or later. For Functions v4, use version `4.0.3904` or later. 

When running locally, the above configuration tells the runtime to use your local developer identity. The connection will attempt to get a token from the following locations, in order:

- A local cache shared between Microsoft applications
- The current user context in Visual Studio
- The current user context in Visual Studio Code
- The current user context in the Azure CLI

If none of these options are successful, an error will occur.

Your identity may already have some role assignments against Azure resources used for development, but those roles may not provide the necessary data access. Management roles like [Owner](../role-based-access-control/built-in-roles.md#owner) are not sufficient. Double-check what permissions are required for connections for each component, and make sure that you have them assigned to yourself.

In some cases, you may wish to specify use of a different identity. You can add configuration properties for the connection that point to the alternate identity based on a client ID and client Secret for an Azure Active Directory service principal. **This configuration option is not supported when hosted in the Azure Functions service.** To use an ID and secret on your local machine, define the connection with the following additional properties:

| Property    | Environment variable template | Description |
|---|---|---|
| Tenant ID | `<CONNECTION_NAME_PREFIX>__tenantId` | The Azure Active Directory tenant (directory) ID. |
| Client ID | `<CONNECTION_NAME_PREFIX>__clientId` |  The client (application) ID of an app registration in the tenant. |
| Client secret | `<CONNECTION_NAME_PREFIX>__clientSecret` | A client secret that was generated for the app registration. |

Here is an example of `local.settings.json` properties required for identity-based connection to Azure Blobs: 

```json
{
  "IsEncrypted": false,
  "Values": {
    "<CONNECTION_NAME_PREFIX>__blobServiceUri": "<blobServiceUri>",
    "<CONNECTION_NAME_PREFIX>__queueServiceUri": "<queueServiceUri>",
    "<CONNECTION_NAME_PREFIX>__tenantId": "<tenantId>",
    "<CONNECTION_NAME_PREFIX>__clientId": "<clientId>",
    "<CONNECTION_NAME_PREFIX>__clientSecret": "<clientSecret>"
  }
}
```

#### Connecting to host storage with an identity (Preview)

The Azure Functions host uses the "AzureWebJobsStorage" connection for core behaviors such as coordinating singleton execution of timer triggers and default app key storage. This can be configured to leverage an identity as well.

> [!CAUTION]
> Other components in Functions rely on "AzureWebJobsStorage" for default behaviors. You should not move it to an identity-based connection if you are using older versions of extensions that do not support this type of connection, including triggers and bindings for Azure Blobs, Event Hubs, and Durable Functions. Similarly, `AzureWebJobsStorage` is used for deployment artifacts when using server-side build in Linux Consumption, and if you enable this, you will need to deploy via [an external deployment package](run-functions-from-deployment-package.md).
>
> In addition, some apps reuse "AzureWebJobsStorage" for other storage connections in their triggers, bindings, and/or function code. Make sure that all uses of "AzureWebJobsStorage" are able to use the identity-based connection format before changing this connection from a connection string.

To use an identity-based connection for "AzureWebJobsStorage", configure the following app settings:

| Setting                       | Description                                | Example value                                        |
|-----------------------------------------------------|--------------------------------------------|------------------------------------------------|
| `AzureWebJobsStorage__blobServiceUri`| The data plane URI of the blob service of the storage account, using the HTTPS scheme. | https://<storage_account_name>.blob.core.windows.net |
| `AzureWebJobsStorage__queueServiceUri` | The data plane URI of the queue service of the storage account, using the HTTPS scheme. | https://<storage_account_name>.queue.core.windows.net |
| `AzureWebJobsStorage__tableServiceUri` | The data plane URI of a table service of the storage account, using the HTTPS scheme. | https://<storage_account_name>.table.core.windows.net |

[Common properties for identity-based connections](#common-properties-for-identity-based-connections) may also be set as well.

If you are configuring "AzureWebJobsStorage" using a storage account that uses the default DNS suffix and service name for global Azure, following the `https://<accountName>.blob/queue/file/table.core.windows.net` format, you can instead set `AzureWebJobsStorage__accountName` to the name of your storage account. The endpoints for each storage service will be inferred for this account. This will not work if the storage account is in a sovereign cloud or has a custom DNS.

| Setting                       | Description                                | Example value                                        |
|-----------------------------------------------------|--------------------------------------------|------------------------------------------------|
| `AzureWebJobsStorage__accountName` | The account name of a storage account, valid only if the account is not in a sovereign cloud and does not have a custom DNS. This syntax is unique to "AzureWebJobsStorage" and cannot be used for other identity-based connections. | <storage_account_name> |

[!INCLUDE [functions-azurewebjobsstorage-permissions](../../includes/functions-azurewebjobsstorage-permissions.md)]

## Reporting Issues
[!INCLUDE [Reporting Issues](../../includes/functions-reporting-issues.md)]

## Next steps
For more information, see the following resources:

* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* [Code and test Azure Functions locally](./functions-develop-local.md)
* [Best Practices for Azure Functions](functions-best-practices.md)
* [Azure Functions C# developer reference](functions-dotnet-class-library.md)
* [Azure Functions Node.js developer reference](functions-reference-node.md)
