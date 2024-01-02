---
title: Guidance for developing Azure Functions
description: Learn the Azure Functions concepts and techniques that you need to develop functions in Azure, across all programming languages and bindings.
ms.assetid: d8efe41a-bef8-4167-ba97-f3e016fcd39e
ms.topic: conceptual
ms.date: 09/06/2023
ms.custom: ignite-2022, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions developer guide

In Azure Functions, all functions share some core technical concepts and components, regardless of your preferred language or development environment. This article is language-specific. Choose your preferred language at the top of the article.

This article assumes that you've already read the [Azure Functions overview](functions-overview.md).

::: zone pivot="programming-language-csharp"
If you prefer to jump right in, you can complete a quickstart tutorial using [Visual Studio](./functions-create-your-first-function-visual-studio.md), [Visual Studio Code](./create-first-function-vs-code-csharp.md), or from the [command prompt](./create-first-function-cli-csharp.md).
::: zone-end
::: zone pivot="programming-language-java"
If you prefer to jump right in, you can complete a quickstart tutorial using [Maven](create-first-function-cli-java.md) (command line), [Eclipse](functions-create-maven-eclipse.md), [IntelliJ IDEA](functions-create-maven-intellij.md), [Gradle](functions-create-first-java-gradle.md), [Quarkus](functions-create-first-quarkus.md), [Spring Cloud](/azure/developer/java/spring-framework/getting-started-with-spring-cloud-function-in-azure?toc=/azure/azure-functions/toc.json), or [Visual Studio Code](./create-first-function-vs-code-java.md).
::: zone-end
::: zone pivot="programming-language-javascript"
If you prefer to jump right in, you can complete a quickstart tutorial using [Visual Studio Code](./create-first-function-vs-code-node.md) or from the [command prompt](./create-first-function-cli-node.md).
::: zone-end
::: zone pivot="programming-language-typescript"
If you prefer to jump right in, you can complete a quickstart tutorial using [Visual Studio Code](./create-first-function-vs-code-typescript.md) or from the [command prompt](./create-first-function-cli-typescript.md).
::: zone-end
::: zone pivot="programming-language-powershell"
If you prefer to jump right in, you can complete a quickstart tutorial using [Visual Studio Code](./create-first-function-vs-code-powershell.md) or from the [command prompt](./create-first-function-cli-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
If you prefer to jump right in, you can complete a quickstart tutorial using [Visual Studio Code](./create-first-function-vs-code-python.md) or from the [command prompt](./create-first-function-cli-python.md).
::: zone-end

## Code project

At the core of Azure Functions is a language-specific code project that implements one or more units of code execution called _functions_. Functions are simply methods that run in the Azure cloud based on events, in response to HTTP requests, or on a schedule. Think of your Azure Functions code project as a mechanism for organizing, deploying, and collectively managing your individual functions in the project when they're running in Azure. For more information, see [Organize your functions](functions-best-practices.md#organize-your-functions). 

::: zone pivot="programming-language-csharp"
The way that you lay out your code project and how you indicate which methods in your project are functions depends on the development language of your project. For detailed language-specific guidance, see the [C# developers guide](dotnet-isolated-process-guide.md).
::: zone-end
::: zone pivot="programming-language-java"
The way that you lay out your code project and how you indicate which methods in your project are functions depends on the development language of your project. For language-specific guidance, see the [Java developers guide](functions-reference-java.md).
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
The way that you lay out your code project and how you indicate which methods in your project are functions depends on the development language of your project. For language-specific guidance, see the [Node.js developers guide](functions-reference-node.md).
::: zone-end
::: zone pivot="programming-language-powershell"
The way that you lay out your code project and how you indicate which methods in your project are functions depends on the development language of your project. For language-specific guidance, see the [PowerShell developers guide](functions-reference-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
The way that you lay out your code project and how you indicate which methods in your project are functions depends on the development language of your project. For language-specific guidance, see the [Python developers guide](functions-reference-python.md).
::: zone-end
All functions must have a trigger, which defines how the function starts and can provide input to the function. Your functions can optionally define input and output bindings. These bindings simplify connections to other services without you having to work with client SDKs. For more information, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

Azure Functions provides a set of language-specific project and function templates that make it easy to create new code projects and add functions to your project. You can use any of the tools that support Azure Functions development to generate new apps and functions using these templates.  

## Development tools

The following tools provide an integrated development and publishing experience for Azure Functions in your preferred language:

::: zone pivot="programming-language-csharp" 
+ [Visual Studio](./functions-develop-vs.md)
::: zone-end
+ [Visual Studio Code](./functions-develop-vs-code.md)

+ [Azure Functions Core Tools](./functions-develop-local.md) (command prompt) 
::: zone pivot="programming-language-java"
+ [Eclipse](functions-create-maven-eclipse.md )

+ [Gradle](functions-create-first-java-gradle.md)

+ [IntelliJ IDEA](functions-create-maven-intellij.md) 

+ [Quarkus](functions-create-first-quarkus.md)

+ [Spring Cloud](/azure/developer/java/spring-framework/getting-started-with-spring-cloud-function-in-azure?toc=/azure/azure-functions/toc.json)
::: zone-end

These tools integrate with [Azure Functions Core Tools](./functions-develop-local.md) so that you can run and debug on your local computer using the Functions runtime. For more information, see [Code and test Azure Functions locally](./functions-develop-local.md).

::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript"
<a id="fileupdate"></a> There's also an editor in the Azure portal that lets you update your code and your *function.json* definition file directly in the portal. You should only use this editor for small changes or creating proof-of-concept functions. You should always develop your functions locally, when possible. For more information, see [Create your first function in the Azure portal](functions-create-function-app-portal.md).
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
Portal editing is only supported for [Node.js version 3](functions-reference-node.md?pivots=nodejs-model-v3), which uses the function.json file.  
::: zone-end  
::: zone pivot="programming-language-python"  
Portal editing is only supported for [Python version 1](functions-reference-python.md?pivots=python-mode-configuration), which uses the function.json file.  
::: zone-end  

## Deployment

When you publish your code project to Azure, you're essentially deploying your project to an existing function app resource. A function app provides an execution context in Azure in which your functions run. As such, it's the unit of deployment and management for your functions. From an Azure Resource perspective, a function app is equivalent to a site resource (`Microsoft.Web/sites`) in Azure App Service, which is equivalent to a web app. 

A function app is composed of one or more individual functions that are managed, deployed, and scaled together. All of the functions in a function app share the same [pricing plan](functions-scale.md), [deployment method](functions-deployment-technologies.md), and [runtime version](functions-versions.md). For more information, see [How to manage a function app](functions-how-to-use-azure-function-app-settings.md). 

When the function app and any other required resources don't already exist in Azure, you first need to create these resources before you can deploy your project files. You can create these resources in one of these ways:
::: zone pivot="programming-language-csharp"
+ During [Visual Studio](./functions-develop-vs.md#publish-to-azure) publishing   
::: zone-end 
+ Using [Visual Studio Code](./functions-develop-vs-code.md#publish-to-azure)

+ Programmatically using [Azure CLI](./scripts/functions-cli-create-serverless.md), [Azure PowerShell](./create-resources-azure-powershell.md#create-a-serverless-function-app-for-c), [ARM templates](functions-create-first-function-resource-manager.md), or [Bicep templates](functions-create-first-function-bicep.md)

+ In the [Azure portal](functions-create-function-app-portal.md)

In addition to tool-based publishing, Functions supports other technologies for deploying source code to an existing function app. For more information, see [Deployment technologies in Azure Functions](functions-deployment-technologies.md).

## Connect to services

A major requirement of any cloud-based compute service is reading data from and writing data to other cloud services. Functions provides an extensive set of bindings that makes it easier for you to connect to services without having to work with client SDKs.

Whether you use the binding extensions provided by Functions or you work with client SDKs directly, you securely store connection data and do not include it in your code. For more information, see [Connections](#connections).   

### Bindings

Functions provides bindings for many Azure services and a few third-party services, which are implemented as extensions. For more information, see the [complete list of supported bindings](functions-triggers-bindings.md#supported-bindings). 

Binding extensions can support both inputs and outputs, and many triggers also act as input bindings. Bindings let you configure the connection to services so that the Functions host can handle the data access for you. For more information, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

If you're having issues with errors coming from bindings, see the [Azure Functions Binding Error Codes](functions-bindings-error-pages.md) documentation.

### Client SDKs

While Functions provides bindings to simplify data access in your function code, you're still able to use a client SDK in your project to directly access a given service, if you prefer. You might need to use client SDKs directly should your functions require a functionality of the underlying SDK that's not supported by the binding extension. 

When using client SDKs, you should use the same process for [storing and accessing connection strings](#connections) used by binding extensions.  
::: zone pivot="programming-language-csharp"
When you create a client SDK instance in your functions, you should get the connection info required by the client from [Environment variables](functions-dotnet-class-library.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-java"
When you create a client SDK instance in your functions, you should get the connection info required by the client from [Environment variables](functions-reference-java.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
When you create a client SDK instance in your functions, you should get the connection info required by the client from [Environment variables](functions-reference-node.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-powershell"
When you create a client SDK instance in your functions, you should get the connection info required by the client from [Environment variables](functions-reference-powershell.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-python"
When you create a client SDK instance in your functions, you should get the connection info required by the client from [Environment variables](functions-reference-python.md#environment-variables).
::: zone-end

## Connections

As a security best practice, Azure Functions takes advantage of the application settings functionality of Azure App Service to help you more securely store strings, keys, and other tokens required to connect to other services. Application settings in Azure are stored encrypted and can be accessed at runtime by your app as environment variable `name` `value` pairs. For triggers and bindings that require a connection property, you set the application setting name instead of the actual connection string. You can't configure a binding directly with a connection string or key. 

For example, consider a trigger definition that has a `connection` property. Instead of the connection string, you set `connection` to the name of an environment variable that contains the connection string. Using this secrets access strategy both makes your apps more secure and makes it easier for you to change connections across environments. For even more security, you can use identity-based connections.

The default configuration provider uses environment variables. These variables are defined in [application settings](./functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings) when running in the Azure and in the [local settings file](functions-develop-local.md#local-settings-file) when developing locally.

### Connection values

When the connection name resolves to a single exact value, the runtime identifies the value as a _connection string_, which typically includes a secret. The details of a connection string depend on the service to which you connect.

However, a connection name can also refer to a collection of multiple configuration items, useful for configuring [identity-based connections](#configure-an-identity-based-connection). Environment variables can be treated as a collection by using a shared prefix that ends in double underscores `__`. The group can then be referenced by setting the connection name to this prefix.

For example, the `connection` property for an Azure Blob trigger definition might be `Storage1`. As long as there's no single string value configured by an environment variable named `Storage1`,  an environment variable named `Storage1__blobServiceUri` could be used to inform the `blobServiceUri` property of the connection. The connection properties are different for each service. Refer to the documentation for the component that uses the connection.

> [!NOTE]
> When using [Azure App Configuration](../azure-app-configuration/quickstart-azure-functions-csharp.md) or [Key Vault](../key-vault/general/overview.md) to provide settings for Managed Identity connections, setting names should use a valid key separator such as `:` or `/` in place of the `__` to ensure names are resolved correctly.
>
> For example, `Storage1:blobServiceUri`.

### Configure an identity-based connection

Some connections in Azure Functions can be configured to use an identity instead of a secret. Support depends on the extension using the connection. In some cases, a connection string may still be required in Functions even though the service to which you're connecting supports identity-based connections. For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md).


> [!NOTE]
> When running in a Consumption or Elastic Premium plan, your app uses the [`WEBSITE_AZUREFILESCONNECTIONSTRING`](functions-app-settings.md#website_contentazurefileconnectionstring) and [`WEBSITE_CONTENTSHARE`](functions-app-settings.md#website_contentshare) settings when connecting to Azure Files on the storage account used by your function app. Azure Files doesn't support using managed identity when accessing the file share. For more information, see [Azure Files supported authentication scenarios](../storage/files/storage-files-active-directory-overview.md#supported-authentication-scenarios)


The following components support identity-based connections:

| Connection source                                       | Plans supported | Learn more                                                                                                         |
|---------------------------------------------------------|-----------------|--------------------------------------------------------------------------------------------------------------------|
| Azure Blobs triggers and bindings               | All             | [Azure Blobs extension version 5.0.0 or later][blobv5],<br/>[Extension bundle 3.3.0 or later][blobv5]  |
| Azure Queues triggers and bindings            | All             | [Azure Queues extension version 5.0.0 or later][queuev5],<br/>[Extension bundle 3.3.0 or later][queuev5] |
| Azure Tables (when using Azure Storage)  | All | [Azure Tables extension version 1.0.0 or later](./functions-bindings-storage-table.md#table-api-extension),<br/>[Extension bundle 3.3.0 or later][tablesv1] |
| Azure SQL Database | All | [Connect a function app to Azure SQL with managed identity and SQL bindings][azuresql-identity]
| Azure Event Hubs triggers and bindings     | All             | [Azure Event Hubs extension version 5.0.0 or later][eventhubv5],<br/>[Extension bundle 3.3.0 or later][eventhubv5]   |
| Azure Service Bus triggers and bindings       | All             | [Azure Service Bus extension version 5.0.0 or later][servicebusv5],<br/>[Extension bundle 3.3.0 or later][servicebusv5] |
| Azure Event Grid output binding       | All             | [Azure Event Grid extension version 3.3.0 or later][eventgrid],<br/>[Extension bundle 3.3.0 or later][eventgrid] |
| Azure Cosmos DB triggers and bindings         | All | [Azure Cosmos DB extension version 4.0.0 or later][cosmosv4],<br/> [Extension bundle 4.0.2 or later][cosmosv4]|
| Azure SignalR triggers and bindings           | All | [Azure SignalR extension version 1.7.0 or later][signalr] <br/>[Extension bundle 3.6.1 or later][signalr] |
| Durable Functions storage provider (Azure Storage) | All | [Durable Functions extension version 2.7.0 or later][durable-identity],<br/>[Extension bundle 3.3.0 or later][durable-identity] |
| Host-required storage ("AzureWebJobsStorage") | All             | [Connecting to host storage with an identity](#connecting-to-host-storage-with-an-identity)                        |

[blobv5]: ./functions-bindings-storage-blob.md#install-extension
[queuev5]: ./functions-bindings-storage-queue.md#storage-extension-5x-and-higher
[eventhubv5]: ./functions-bindings-event-hubs.md?tabs=extensionv5
[servicebusv5]: ./functions-bindings-service-bus.md
[eventgrid]: ./functions-bindings-event-grid.md?tabs=extensionv3
[cosmosv4]: ./functions-bindings-cosmosdb-v2.md?tabs=extensionv4
[tablesv1]: ./functions-bindings-storage-table.md#table-api-extension
[signalr]: ./functions-bindings-signalr-service.md#install-extension
[durable-identity]: ./durable/durable-functions-configure-durable-functions-with-credentials.md
[azuresql-identity]: ./functions-identity-access-azure-sql-with-managed-identity.md

[!INCLUDE [functions-identity-based-connections-configuration](../../includes/functions-identity-based-connections-configuration.md)]

Choose one of these tabs to learn about permissions for each component:

# [Azure Blobs extension](#tab/blob)

[!INCLUDE [functions-blob-permissions](../../includes/functions-blob-permissions.md)]

# [Azure Queues extension](#tab/queue)

[!INCLUDE [functions-queue-permissions](../../includes/functions-queue-permissions.md)]

# [Azure Tables extension](#tab/table)

[!INCLUDE [functions-table-permissions](../../includes/functions-table-permissions.md)]

# [Event Hubs extension](#tab/eventhubs)

[!INCLUDE [functions-event-hubs-permissions](../../includes/functions-event-hubs-permissions.md)]

# [Service Bus extension](#tab/servicebus)

[!INCLUDE [functions-service-bus-permissions](../../includes/functions-service-bus-permissions.md)]

# [Event Grid extension](#tab/eventgrid)

[!INCLUDE [functions-event-grid-permissions](../../includes/functions-event-grid-permissions.md)]

# [Azure Cosmos DB extension](#tab/cosmos)

[!INCLUDE [functions-cosmos-permissions](../../includes/functions-cosmos-permissions.md)]

# [Azure SignalR extension](#tab/signalr)

You need to create a role assignment that provides access to Azure SignalR Service data plane REST APIs. We recommend you to use the built-in role [SignalR Service Owner](../role-based-access-control/built-in-roles.md#signalr-service-owner). Management roles like [Owner](../role-based-access-control/built-in-roles.md#owner) aren't sufficient.

# [Durable Functions storage provider](#tab/durable)

[!INCLUDE [functions-durable-permissions](../../includes/functions-durable-permissions.md)]

# [Functions host storage](#tab/azurewebjobsstorage)

[!INCLUDE [functions-azurewebjobsstorage-permissions](../../includes/functions-azurewebjobsstorage-permissions.md)]

---

#### Common properties for identity-based connections

An identity-based connection for an Azure service accepts the following common properties, where `<CONNECTION_NAME_PREFIX>` is the value of your `connection` property in the trigger or binding definition:

| Property    |  Environment variable template | Description |
|---|---|---|
| Token Credential |  `<CONNECTION_NAME_PREFIX>__credential` | Defines how a token should be obtained for the connection. This setting should be set to `managedidentity` if your deployed Azure Function intends to use managed identity authentication. This value is only valid when a managed identity is available in the hosting environment. |
| Client ID | `<CONNECTION_NAME_PREFIX>__clientId` | When `credential` is set to `managedidentity`, this property can be set to specify the user-assigned identity to be used when obtaining a token. The property accepts a client ID corresponding to a user-assigned identity assigned to the application. It's invalid to specify both a Resource ID and a client ID. If not specified, the system-assigned identity is used. This property is used differently in [local development scenarios](#local-development-with-identity-based-connections), when `credential` shouldn't be set. |
| Resource ID | `<CONNECTION_NAME_PREFIX>__managedIdentityResourceId` | When `credential` is set to `managedidentity`, this property can be set to specify the resource Identifier to be used when obtaining a token. The property accepts a resource identifier corresponding to the resource ID of the user-defined managed identity. It's invalid to specify both a resource ID and a client ID. If neither are specified, the system-assigned identity is used. This property is used differently in [local development scenarios](#local-development-with-identity-based-connections), when `credential` shouldn't be set.

Other options may be supported for a given connection type. Refer to the documentation for the component making the connection.

##### Local development with identity-based connections

> [!NOTE]
> Local development with identity-based connections requires version `4.0.3904` of [Azure Functions Core Tools](functions-run-local.md), or a later version.

When you're running your function project locally, the above configuration tells the runtime to use your local developer identity. The connection attempts to get a token from the following locations, in order:

- A local cache shared between Microsoft applications
- The current user context in Visual Studio
- The current user context in Visual Studio Code
- The current user context in the Azure CLI

If none of these options are successful, an error occurs.

Your identity may already have some role assignments against Azure resources used for development, but those roles may not provide the necessary data access. Management roles like [Owner](../role-based-access-control/built-in-roles.md#owner) aren't sufficient. Double-check what permissions are required for connections for each component, and make sure that you have them assigned to yourself.

In some cases, you may wish to specify use of a different identity. You can add configuration properties for the connection that point to the alternate identity based on a client ID and client Secret for a Microsoft Entra service principal. **This configuration option is not supported when hosted in the Azure Functions service.** To use an ID and secret on your local machine, define the connection with the following extra properties:

| Property    | Environment variable template | Description |
|---|---|---|
| Tenant ID | `<CONNECTION_NAME_PREFIX>__tenantId` | The Microsoft Entra tenant (directory) ID. |
| Client ID | `<CONNECTION_NAME_PREFIX>__clientId` |  The client (application) ID of an app registration in the tenant. |
| Client secret | `<CONNECTION_NAME_PREFIX>__clientSecret` | A client secret that was generated for the app registration. |

Here's an example of `local.settings.json` properties required for identity-based connection to Azure Blobs:

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

#### Connecting to host storage with an identity

The Azure Functions host uses the `AzureWebJobsStorage` connection for core behaviors such as coordinating singleton execution of timer triggers and default app key storage. This connection can also be configured to use an identity.

> [!CAUTION]
> Other components in Functions rely on `AzureWebJobsStorage` for default behaviors. You should not move it to an identity-based connection if you are using older versions of extensions that do not support this type of connection, including triggers and bindings for Azure Blobs, Event Hubs, and Durable Functions. Similarly, `AzureWebJobsStorage` is used for deployment artifacts when using server-side build in Linux Consumption, and if you enable this, you will need to deploy via [an external deployment package](run-functions-from-deployment-package.md).
>
> In addition, some apps reuse `AzureWebJobsStorage` for other storage connections in their triggers, bindings, and/or function code. Make sure that all uses of `AzureWebJobsStorage` are able to use the identity-based connection format before changing this connection from a connection string.

To use an identity-based connection for `AzureWebJobsStorage`, configure the following app settings:

| Setting                       | Description                                | Example value                                        |
|-----------------------------------------------------|--------------------------------------------|------------------------------------------------|
| `AzureWebJobsStorage__blobServiceUri`| The data plane URI of the blob service of the storage account, using the HTTPS scheme. | https://<storage_account_name>.blob.core.windows.net |
| `AzureWebJobsStorage__queueServiceUri` | The data plane URI of the queue service of the storage account, using the HTTPS scheme. | https://<storage_account_name>.queue.core.windows.net |
| `AzureWebJobsStorage__tableServiceUri` | The data plane URI of a table service of the storage account, using the HTTPS scheme. | https://<storage_account_name>.table.core.windows.net |

[Common properties for identity-based connections](#common-properties-for-identity-based-connections) may also be set as well.

If you're configuring `AzureWebJobsStorage` using a storage account that uses the default DNS suffix and service name for global Azure, following the `https://<accountName>.blob/queue/file/table.core.windows.net` format, you can instead set `AzureWebJobsStorage__accountName` to the name of your storage account. The endpoints for each storage service are inferred for this account. This doesn't work when the storage account is in a sovereign cloud or has a custom DNS.

| Setting                       | Description                                | Example value                                        |
|-----------------------------------------------------|--------------------------------------------|------------------------------------------------|
| `AzureWebJobsStorage__accountName` | The account name of a storage account, valid only if the account isn't in a sovereign cloud and doesn't have a custom DNS. This syntax is unique to `AzureWebJobsStorage` and can't be used for other identity-based connections. | <storage_account_name> |

[!INCLUDE [functions-azurewebjobsstorage-permissions](../../includes/functions-azurewebjobsstorage-permissions.md)]

## Reporting Issues
[!INCLUDE [Reporting Issues](../../includes/functions-reporting-issues.md)]

## Open source repositories

The code for Azure Functions is open source, and you can find key components in these GitHub repositories:

* [Azure Functions](https://github.com/Azure/Azure-Functions)

* [Azure Functions host](https://github.com/Azure/azure-functions-host/)

* [Azure Functions portal](https://github.com/azure/azure-functions-ux)

* [Azure Functions templates](https://github.com/azure/azure-functions-templates)

* [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/)

* [Azure WebJobs SDK Extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/)
::: zone pivot="programming-language-csharp"
* [Azure Functons .NET worker (isolated process)](https://github.com/Azure/azure-functions-dotnet-worker)
::: zone-end
::: zone pivot="programming-language-java"
* [Azure Functions Java worker](https://github.com/Azure/azure-functions-java-worker)
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
* [Azure Functions Node.js Programming Model](https://github.com/Azure/azure-functions-nodejs-library)
::: zone-end
::: zone pivot="programming-language-powershell"
* [Azure Functions PowerShell worker](https://github.com/Azure/azure-functions-powershell-worker)
::: zone-end
::: zone pivot="programming-language-python"
* [Azure Functions Python worker](https://github.com/Azure/azure-functions-python-worker)
::: zone-end


## Next steps

For more information, see the following resources:

+ [Azure Functions scenarios](functions-scenarios.md)
+ [Code and test Azure Functions locally](./functions-develop-local.md)
+ [Best Practices for Azure Functions](functions-best-practices.md)
