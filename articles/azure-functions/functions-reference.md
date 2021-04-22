---
title: Guidance for developing Azure Functions 
description: Learn the Azure Functions concepts and techniques that you need to develop functions in Azure, across all programming languages and bindings.
ms.assetid: d8efe41a-bef8-4167-ba97-f3e016fcd39e
ms.topic: conceptual
ms.date: 10/12/2017

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

The default configuration provider uses environment variables. These might be set by [Application Settings](./functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings) when running in the Azure Functions service, or from the [local settings file](functions-run-local.md#local-settings-file) when developing locally.

### Connection values

When the connection name resolves to a single exact value, the runtime identifies the value as a _connection string_, which typically includes a secret. The details of a connection string are defined by the service to which you wish to connect.

However, a connection name can also refer to a collection of multiple configuration items. Environment variables can be treated as a collection by using a shared prefix that ends in double underscores `__`. The group can then be referenced by setting the connection name to this prefix.

For example, the `connection` property for a Azure Blob trigger definition might be `Storage1`. As long as there is no single string value configured with `Storage1` as its name, `Storage1__serviceUri` would be used for the `serviceUri` property of the connection. The connection properties are different for each service. Refer to the documentation for the extension that uses the connection.

### Configure an identity-based connection

Some connections in Azure Functions are configured to use an identity instead of a secret. Support depends on the extension using the connection. In some cases, a connection string may still be required in Functions even though the service to which you are connecting supports identity-based connections.

> [!IMPORTANT]
> Even if a binding extension supports identity-based connections, that configuration may not be supported yet in the Consumption plan. See the support table below.

Identity-based connections are supported by the following trigger and binding extensions:

| Extension name | Extension version                                                                                     | Supported in the Consumption plan |
|----------------|-------------------------------------------------------------------------------------------------------|---------------------------------------|
| Azure Blob     | [Version 5.0.0-beta1 or later](./functions-bindings-storage-blob.md#storage-extension-5x-and-higher)  | No                                    |
| Azure Queue    | [Version 5.0.0-beta1 or later](./functions-bindings-storage-queue.md#storage-extension-5x-and-higher) | No                                    |
| Azure Event Hubs    | [Version 5.0.0-beta1 or later](./functions-bindings-event-hubs.md#event-hubs-extension-5x-and-higher) | No                                    |

> [!NOTE]
> Support for identity-based connections is not yet available for storage connections used by the Functions runtime for core behaviors. This means that the `AzureWebJobsStorage` setting must be a connection string.

#### Connection properties

An identity-based connection for an Azure service accepts the following properties:

| Property    | Required for Extensions | Environment variable | Description |
|---|---|---|---|
| Service URI | Azure Blob, Azure Queue | `<CONNECTION_NAME_PREFIX>__serviceUri` |  The data plane URI of the service to which you are connecting. |
| Fully Qualified Namespace | Event Hubs | `<CONNECTION_NAME_PREFIX>__fullyQualifiedNamespace` | The fully qualified Event Hub namespace. |

Additional options may be supported for a given connection type. Please refer to the documentation for the component making the connection.

When hosted in the Azure Functions service, identity-based connections use a [managed identity](../app-service/overview-managed-identity.md?toc=%2fazure%2fazure-functions%2ftoc.json). The system-assigned identity is used by default. When run in other contexts, such as local development, your developer identity is used instead, although this can be customized using alternative connection parameters.

##### Local development

When running locally, the above configuration tells the runtime to use your local developer identity. The connection will attempt to get a token from the following locations, in order:

- A local cache shared between Microsoft applications
- The current user context in Visual Studio
- The current user context in Visual Studio Code
- The current user context in the Azure CLI

If none of these options are successful, an error will occur.

In some cases, you may wish to specify use of a different identity. You can add configuration properties for the connection that point to the alternate identity.

> [!NOTE]
> The following configuration options are not supported when hosted in the Azure Functions service.

To connect using an Azure Active Directory service principal with a client ID and secret, define the connection with the following required properties in addition to the [Connection properties](#connection-properties) above:

| Property    | Environment variable | Description |
|---|---|---|
| Tenant ID | `<CONNECTION_NAME_PREFIX>__tenantId` | The Azure Active Directory tenant (directory) ID. |
| Client ID | `<CONNECTION_NAME_PREFIX>__clientId` |  The client (application) ID of an app registration in the tenant. |
| Client secret | `<CONNECTION_NAME_PREFIX>__clientSecret` | A client secret that was generated for the app registration. |

Example of `local.settings.json` properties required for identity-based connection with Azure Blob: 
```json
{
  "IsEncrypted": false,
  "Values": {
    "<CONNECTION_NAME_PREFIX>__serviceUri": "<serviceUri>",
    "<CONNECTION_NAME_PREFIX>__tenantId": "<tenantId>",
    "<CONNECTION_NAME_PREFIX>__clientId": "<clientId>",
    "<CONNECTION_NAME_PREFIX>__clientSecret": "<clientSecret>"
  }
}
```

#### Grant permission to the identity

Whatever identity is being used must have permissions to perform the intended actions. This is typically done by assigning a role in Azure RBAC or specifying the identity in an access policy, depending on the service to which you are connecting. Refer to the documentation for each service on what permissions are needed and how they can be set.

> [!IMPORTANT]
> Some permissions might be exposed by the service that are not necessary for all contexts. Where possible, adhere to the **principle of least privilege**, granting the identity only required privileges. For example, if the app just needs to read from a blob, use the [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) role as the [Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner) includes excessive permissions for a read operation.


## Reporting Issues
[!INCLUDE [Reporting Issues](../../includes/functions-reporting-issues.md)]

## Next steps
For more information, see the following resources:

* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* [Code and test Azure Functions locally](./functions-develop-local.md)
* [Best Practices for Azure Functions](functions-best-practices.md)
* [Azure Functions C# developer reference](functions-dotnet-class-library.md)
* [Azure Functions Node.js developer reference](functions-reference-node.md)
