---
title: Configure connections to remote services in Azure Functions
description: Learn how to securely and efficiently connect to remote services from your function app in Azure.
ms.topic: concept-article
ms.custom: devx-track-csharp, peer-review-program
ms.date: 07/07/2026
ai-usage: ai-assisted
zone_pivot_groups: functions-auth-method

# Customer intent: As a developer, I want to know what's the best way to securely and performantly connect to other Azure services from my function app in Azure.
---

# Configure connections to remote services in Azure Functions

This article is the primary reference for how Azure Functions connects to remote services. It provides specific guidance based on connection type and authentication method. 

> [!IMPORTANT]  
> Use managed identities with Microsoft Entra ID whenever possible. This authentication method eliminates secrets and provides the highest security.

## Connection categories

Azure Functions connections fall into these basic categories: 

+ **Host required**: Connections the Functions host needs to operate, such as storage and monitoring.
+ **Bindings**: Connections that the host manages for your triggers and bindings.
+ **Client SDK**: Connections you create and manage in your own function code.

> [!TIP]  
> Functions also supports *managed connectors* (in preview), which let you connect to services like Office 365, Teams, and SharePoint with built-in OAuth and webhook handling through a Connector Namespace. For more information, see [Use connectors in Azure Functions](functions-connectors-overview.md).

### [Host required](#tab/host)

The Functions host requires your app to have these specific named connections, which support both function executions and logging:

+ [**`AzureWebJobsStorage`**](./functions-app-settings.md#azurewebjobsstorage): Functions uses this default storage account to enable core behaviors, such as coordinating singleton execution of timer triggers and default storage for function access keys. The host requires this connection to a supported storage account. Your function app can't start without this connection setting. For more information, see [Storage considerations for Azure Functions](./storage-considerations.md).

+ [**`APPLICATIONINSIGHTS_CONNECTION_STRING`**](./functions-app-settings.md#applicationinsights_connection_string): You should also configure the host to write logs to an Application Insights instance.

+ [**`WEBSITE_AZUREFILESCONNECTIONSTRING`**](functions-app-settings.md#website_contentazurefileconnectionstring): Used only by apps that run in a [Consumption plan](./consumption-plan.md) or [Elastic Premium plan](./functions-premium-plan.md). Defines the storage account that contains the Azure Files share that maintains the deployment package for your app. 

### [Bindings](#tab/bindings)

Any binding extension that connects to a remote service must store connection information in app settings. These triggers and bindings have a `connection` property that you set to the name or prefix of the setting that contains the connection information. The exact requirements for both the key name and value of these settings depend on the kind of authentication used in the connection. For a complete list of binding extensions, see [supported services](./functions-triggers-bindings.md#supported-bindings).

The Functions host manages these connections for you and uses them to read data in to and write data out from your functions. You can't use the clients for these connections directly in your code.

In cases where it makes sense, your storage bindings can use the same storage account as the host storage account (`AzureWebJobsStorage`). For more information, see [Shared storage accounts](storage-considerations.md#shared-storage-accounts).

### [Client SDK](#tab/sdk)

Client SDK instances always require a connection to reach a remote service. Maintain this connection information, at a minimum, in application settings and obtain it at runtime in your code by using environment variables. You're responsible for managing and disposing of any client SDK connections you create. When running in the [Consumption plan](./consumption-plan.md), you must also [consider the limitation on client connections](#manage-sdk-client-connections).

---

## Authentication methods

>[!IMPORTANT]  
>When possible, use managed identities for your connections. This approach eliminates secrets entirely. When the target service doesn't support Microsoft Entra ID authentication, use Azure Key Vault to centrally manage secrets. Only use shared secrets directly in app settings as a last resort.

Functions supports these authentication methods when connecting to remote services:

| Authentication method | Security | When to use |
| ----- | --- | --- |
| **Managed identities** | Highest | Target service supports Microsoft Entra ID. No secrets to manage. |
| **Azure Key Vault** | High | Service doesn't support managed identities, or you need centralized secret management with rotation. |
| **Shared secret** | Low | Legacy default. Migrate to managed identities or Key Vault as soon as possible. |

Choose your preferred authentication method at the [top of the article](#top) to see detailed configuration guidance.

## Define connections

At runtime, your function app accesses connection information as environment variables from these locations:

| Environment | Where settings are stored |
| --- | --- |
| **Azure** | [Application settings](./functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings) (encrypted at rest) |
| **Local development** | [local.settings.json](functions-develop-local.md#local-settings-file) (optionally encrypted) |

In both environments, settings are exposed to your code as environment variables. The specific settings you need depend on both the [connection type](#connection-categories) and the [authentication method](#authentication-methods) you choose.
:::zone pivot="functions-auth-identity"

When you use Microsoft Entra authentication to connect to an Azure service, the specific app settings you use depend on the connected service and whether you're using a system-assigned or user-assigned identity to authenticate the connection.

The identities that you use for your connections must have permissions to perform the intended actions. For most Azure services, this requirement means you need to [assign a role in Azure RBAC](../role-based-access-control/role-assignments-steps.md), using either built-in or custom roles that provide those permissions. To learn more, see [Grant permissions to an identity](#grant-permissions-to-an-identity). 

For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md). 

Keep these considerations in mind when using identity-based connections: 

+ In a Functions-hosted app, identity-based connections use a [managed identity](../app-service/overview-managed-identity.md?toc=%2fazure%2fazure-functions%2ftoc.json). The system-assigned identity, which is specific to to your app, is used by default. However, user-assigned identities, which also require the `*__credential` and `*__clientID` properties, are more flexible and recommended.    

+ When your app runs in other contexts, such as local development, your developer identity is used instead. For more information, see the [local development](functions-develop-local.md#local-settings-file) article.

+ Identity-based connections are only supported on version 4.x and later of the Functions runtime. If you're running a legacy C# app on version 1.x of the Functions runtime, you must first [migrate to version 4.x](./migrate-version-1-version-4.md).

### [Host required](#tab/host)

You can configure your function app to use an identity instead of a connection string when connecting to the default storage account (`AzureWebJobsStorage`) and other host-required connections. 

Managed identity support for `AzureWebJobsStorage` varies by hosting plan:

| Hosting plan | MI for host storage | Azure Files requirement | Recommendation |
| --- | --- | --- | --- |
| [Flex Consumption](./flex-consumption-plan.md) | Full support | None (no Azure Files) | Recommended for MI |
| [Dedicated (App Service)](./dedicated-plan.md) | Full support | None (no dynamic scaling) | Full MI, no workaround needed |
| [Consumption](./consumption-plan.md) | Blobs, queues, tables | Key Vault or remove Azure Files | Store `WEBSITE_AZUREFILESCONNECTIONSTRING` in Key Vault |
| [Elastic Premium](./functions-premium-plan.md) | Blobs, queues, tables | Key Vault or remove Azure Files | Store `WEBSITE_AZUREFILESCONNECTIONSTRING` in Key Vault |

Before using managed identities for host-required connections, consider these limitations:

+ For Consumption and Premium plans, implement one of these workarounds for Azure Files:
    + Store only the `WEBSITE_AZUREFILESCONNECTIONSTRING` connection string in Key Vault, which is the next most secure option.
    + Create a Consumption or Premium plan app that runs without Azure Files. There are performance impacts when running without Azure Files. For more information, see [Create an app without Azure Files](./storage-considerations.md#create-an-app-without-azure-files).
+ These triggers rely on `AzureWebJobsStorage` to run correctly: 
    + Azure Blob Storage
    + Azure Event Hubs
    + Durable Functions (by default)
    + Timer
  
    If your app uses any of these extensions, make sure its version also supports managed identities. 
+ `AzureWebJobsStorage` maintains deployment artifacts in server-side (remote) builds in a Linux Consumption plan. In this scenario, you must deploy and run your app from an [external deployment package](run-functions-from-deployment-package.md).
+ Other components of your function app might reuse the `AzureWebJobsStorage` connection, which could include storage binding extensions or storage clients created using the Azure SDK. When using managed identities, create new application settings for these nonhost components, even when they support managed identities.  

These specific app settings define identity-based connections to both [`AzureWebJobsStorage`](./functions-app-settings.md#azurewebjobsstorage) and [`APPLICATIONINSIGHTS_CONNECTION_STRING`](./functions-app-settings.md#applicationinsights_connection_string):

| Setting | Description | 
| ---------- | ------------ | 
| [`AzureWebJobsStorage__blobServiceUri`](./functions-app-settings.md#azurewebjobsstorage__blobserviceuri)| The URI for Blob Storage in the default storage account. Required for sovereign clouds or a custom storage DNS, such as: `https://mystorageaccount.blob.contoso.com`. `HTTPS` is required. |
| [`AzureWebJobsStorage__queueServiceUri`](./functions-app-settings.md#azurewebjobsstorage__queueserviceuri) | The URI for Queue Storage in the default storage account. Required for sovereign clouds or a custom storage DNS, such as: `https://mystorageaccount.queue.contoso.com`. `HTTPS` is required.|
| [`AzureWebJobsStorage__tableServiceUri`](./functions-app-settings.md#azurewebjobsstorage__tableserviceuri) | The URI for Table Storage in the default storage account. Required for sovereign clouds or a custom storage DNS, such as: `https://mystorageaccount.table.contoso.com`. `HTTPS` is required. |
| [`AzureWebJobsStorage__credential`](./functions-app-settings.md#azurewebjobsstorage__credential) |Set to `managedidentity` to use managed identity authentication. A managed identity must be available in the hosting environment.|
| [`AzureWebJobsStorage__clientId`](./functions-app-settings.md#azurewebjobsstorage__clientid) or<br/>[`AzureWebJobsStorage__managedIdentityResourceId`](./functions-app-settings.md#azurewebjobsstorage__managedidentityresourceid) | Returns a specific user-assigned identity used to obtain an access token for managed identity authentication. When neither is set, the system-assigned identity of the application is used. |
| [`APPLICATIONINSIGHTS_AUTHENTICATION_STRING`](./functions-app-settings.md#applicationinsights_authentication_string) | Enables connections to Application Insights using Microsoft Entra authentication. Set to either `Authorization=AAD` (system-assigned) or `ClientId=<YOUR_CLIENT_ID>;Authorization=AAD` (user-assigned). |

Because the double-underscore value (`__`) is interpreted at runtime as a colon (`:`), the series of settings are interpreted as properties of the `AzureWebJobsStorage` object. For example, consider these `AzureWebJobsStorage` connection settings:

+ `AzureWebJobsStorage__blobServiceUri=https://<STORAGE_ACCOUNT_NAME>.blob.core.windows.net`
+ `AzureWebJobsStorage__queueServiceUri=https://<STORAGE_ACCOUNT_NAME>.queue.core.windows.net` 
+ `AzureWebJobsStorage__tableServiceUri=https://<STORAGE_ACCOUNT_NAME>.table.core.windows.net` 
+ `AzureWebJobsStorage__credential=managedidentity`
+ `AzureWebJobsStorage__clientId=<MY_USER_ASSIGNED_IDENTITY_ID>`

At runtime, the host interprets these settings as a complex `AzureWebJobsStorage` setting.

```json
"AzureWebJobsStorage":
{
    "blobServiceUri": "https://<STORAGE_ACCOUNT_NAME>.blob.core.windows.net",
    "queueServiceUri": "https://<STORAGE_ACCOUNT_NAME>.queue.core.windows.net",
    "tableServiceUri": "https://<STORAGE_ACCOUNT_NAME>.table.core.windows.net",
    "credential": "managedidentity",
    "clientId": "<MY_USER_ASSIGNED_IDENTITY_ID>"
}
```

You must also grant permissions for the identity in the default storage account so that the host can connect with sufficient permissions to perform the required tasks. To learn how, see [Grant permissions to an identity](#grant-permissions-to-an-identity). 

### [Bindings](#tab/bindings)

These binding extensions currently support identity-based connections:

| Binding extension  | Minimum extension package version (.NET) | Minimum [extension bundle version](./functions-bindings-register.md#extension-bundles) |
|--------|-----------------|---------|
| [Azure Blob storage](functions-bindings-storage-blob.md) |  5.0.0 | 3.3.0  |
| [Azure Cosmos DB (NoSQL API)][cosmosv4] | 4.0.0 | 4.0.2 |
| [Azure Event Grid](functions-bindings-event-grid.md?tabs=extensionv3) | 3.3.0 | 3.3.0 |
| [Azure Event Hubs](functions-bindings-event-hubs.md) | 5.0.0 | 3.3.0 |
| [Azure OpenAI](./functions-bindings-openai.md) | 0.19.0-alpha | 4.32.0 |
| [Azure Queues storage](functions-bindings-storage-queue.md) | 5.0.0 | 3.3.0 |
| [Azure Tables storage](functions-bindings-storage-table.md)<sup>*</sup>  | 1.0.0 | 3.3.0 |
| [Azure Service Bus](functions-bindings-service-bus.md) | 5.0.0 | 3.3.0 |
| [Azure SignalR](functions-bindings-signalr-service.md) | 1.7.0 | 3.6.1 |
| [Azure SQL Database](functions-identity-access-azure-sql-with-managed-identity.md) | 3.0.0 | 3.3.0 |
| [Durable Functions](./durable/durable-functions-configure-managed-identity.md) | 2.7.0 | 3.3.0 |

<sup>*</sup>Also supports the [Azure Cosmos DB Table API][cosmosv4]. 

For managed identities, the overall connection is made up of multiple individual settings, each prefixed with `<CONNECTION_NAME_PREFIX>`, which is unique to your binding-specific connection setting. `<CONNECTION_NAME_PREFIX>` is then used as the value of the `connection` property required by your specific service connection. 

The way that you compose a managed identity connection property depends on the kind of identity you are using:

| Identity type | Required connection properties |
| ----- | ----- | 
| System-assigned | `<CONNECTION_NAME_PREFIX>__credential=managedidentity`  |
| User-assigned (client ID) | `<CONNECTION_NAME_PREFIX>__credential=managedidentity`<br/>`<CONNECTION_NAME_PREFIX>__clientId=<CLIENT_ID>` |
| User-assigned (resource ID) | `<CONNECTION_NAME_PREFIX>__credential=managedidentity`<br/>`<CONNECTION_NAME_PREFIX>__managedIdentityResourceId=<RESOURCE_ID>` |

You need to include one or more of these settings when defining a managed identity connection for your binding, depending on the kind of identity:  

| Setting name |   Description |
|---|---|
| `<CONNECTION_NAME_PREFIX>__clientId` | Sets the specific user-assigned identity to use when obtaining an access token. Requires that `<CONNECTION_NAME_PREFIX>__credential`is set to `managedidentity`. The property accepts a client ID corresponding to a user-assigned identity assigned to the application. It's invalid to specify both a Resource ID and a client ID. If not specified, the system-assigned identity is used. This property is used differently in [local development scenarios](functions-develop-local.md#local-settings-file), when `credential` shouldn't be set. |
|  `<CONNECTION_NAME_PREFIX>__credential` | Defines how an access token is obtained for the connection. Use `managedidentity` for managed identity authentication. This value is only valid when a managed identity is available in the hosting environment. |
|  `<CONNECTION_NAME_PREFIX>__managedIdentityResourceId` | When `credential` is set to `managedidentity`, this property can be set to specify the resource Identifier to be used when obtaining a token. The property accepts a resource identifier corresponding to the resource ID of the user-defined managed identity. It's invalid to specify both a resource ID and a client ID. If neither are specified, the system-assigned identity is used. This property is used differently in [local development scenarios](functions-develop-local.md#local-settings-file), when `credential` shouldn't be set. |

Because the double-underscore value (`__`) is interpreted at runtime as a colon (`:`), the series of settings are interpreted as properties of the `<CONNECTION_NAME_PREFIX>` object. For example, consider these Azure Event Hubs extension settings:

+ `MyEventHubConnection__fullyQualifiedNamespace=<MY_EVENT_HUB_DNS>.servicebus.windows.net` 
+ `MyEventHubConnection__credential=managedidentity`
+ `MyEventHubConnection__clientId=<MY_USER_ASSIGNED_IDENTITY_ID>`

At runtime, these settings are collectively interpreted by the host as a single `MyEventHubConnection` setting like this:

```json
"MyEventHubConnection":
{
    "fullyQualifiedNamespace": "<MY_EVENT_HUB_DNS>.servicebus.windows.net",
    "credential": "managedidentity",
    "clientId": "<MY_USER_ASSIGNED_IDENTITY_ID>"
}
```

These other settings are required by specific binding extensions:

| Extension | Setting name | Description |
| ----- | ----- | ----- |
| Azure Blob Storage  |  `<CONNECTION_NAME_PREFIX>__blobServiceUri`<sup>*</sup> | The URI of the blob storage service to which you're connecting, such as `https://<STORAGE_ACCOUNT_NAME>.blob.core.windows.net`. For a Blob Storage trigger, you must also set `<CONNECTION_NAME_PREFIX>__queueServiceUri` to the Queue Storage URI of the same account, which is used to track [poison blobs]. | 
| Azure Cosmos DB | `<CONNECTION_NAME_PREFIX>__accountEndpoint` | The Azure Cosmos DB account endpoint URI, such as `https://<database_account_name>.documents.azure.com:443/`.|       
| Azure Event Hubs | `<CONNECTION_NAME_PREFIX>__fullyQualifiedNamespace` | The fully qualified namespace of the event hub, such as `<MY_EVENT_HUB_DNS>.servicebus.windows.net`. | 
| Azure Event Grid (output) | `<CONNECTION_NAME_PREFIX>__topicEndpointUri` | The topic endpoint used by the output binding to write to the topic, such as `https://<TOPIC_NAME>.centralus-1.eventgrid.azure.net/api/events`. |
| Azure OpenAI | `<CONNECTION_NAME_PREFIX>__endpoint` | Sets the URI endpoint of the Azure OpenAI service. This setting is always required. | 
| Azure Queue storage | `<CONNECTION_NAME_PREFIX>__queueServiceUri`<sup>*</sup> | The URI of the queue storage service to which you're connecting, such as `https://<STORAGE_ACCOUNT_NAME>.queue.core.windows.net`. |
| Azure Service Bus | `<CONNECTION_NAME_PREFIX>__fullyQualifiedNamespace` | The fully qualified Service Bus namespace, such as `<service_bus_namespace>.servicebus.windows.net`  |
| Azure SignalR | `<CONNECTION_NAME_PREFIX>__serviceUri`| The URI of the SignalR service, such as `https://<SIGNALR_RESOURCE_NAME>.service.signalr.net`.|
| Azure Table storage | `<CONNECTION_NAME_PREFIX>__tableServiceUri`<sup>*</sup> | The URI of the table storage service to which you're connecting, such as `https://<STORAGE_ACCOUNT_NAME>.table.core.windows.net`. |
| Durable Functions | `<CONNECTION_NAME_PREFIX>__blobServiceUri`<br/>`<CONNECTION_NAME_PREFIX>__queueServiceUri`<br/>`<CONNECTION_NAME_PREFIX>__tableServiceUri` | You must also set the data plane URIs of the Blob storage, Queue storage, and Table storage services. |

<sup>*</sup> You can use `<CONNECTION_NAME_PREFIX>__serviceUri` as an alias. When both forms are provided, the more specific form is used, such as `blobServiceUri`. You can't use the general `serviceUri` form when the overall connection configuration must support more than one blob, queue, and/or table service.

For each binding, you must also grant permissions for the identity in the remote service so that your app can connect with sufficient permissions to perform the required tasks. To learn how, see [Grant permissions to an identity](#grant-permissions-to-an-identity).

### [Client SDK](#tab/sdk)

Use client SDKs to manually create and manage connections to other Azure and third-party services. Many Azure SDKs enable you to use Microsoft Entra ID with managed identities to avoid using shared secrets. Follow the guidance for your specific Azure SDK for information on how to connect by using managed identities.

> [!CAUTION]
> Don't use the Azure SDK's [`EnvironmentCredential`][environment-credential] environment variables because they can unintentionally affect other connections. Azure Functions doesn't fully support these environment variables when deployed.

The Azure SDK's [`EnvironmentCredential`][environment-credential] environment variables can also be set, but Functions doesn't process these variables for scaling in Consumption plans. These environment variables aren't specific to any one connection and apply as a default unless a corresponding property is set for a given connection. For example, if you set `AZURE_CLIENT_ID`, the connection uses it as if `<CONNECTION_NAME_PREFIX>__clientId` had been configured. Explicitly setting `<CONNECTION_NAME_PREFIX>__clientId` overrides this default.

[environment-credential]: /dotnet/api/azure.identity.environmentcredential

---

## Grant permissions to an identity

When you use managed identities with Microsoft Entra ID authentication, you must specifically assign permissions to the identity your app uses when making connections to the remote service. The easiest way to grant least-privilege permissions to your app is by assigning built-in roles. 

Keep these recommendations in mind when granting RBAC permissions to your app's identities: 

+ Whenever possible, adhere to the _principle of least privilege_ by granting the identity only the minimum required privileges. For example, if the app only needs to read from a data source, use a role that only has permission to read and not to write data.
+ Don't use broad built-in roles like [Owner](../role-based-access-control/built-in-roles.md#owner), even just to get the app to work. 
+ After you create or modify a role assignment, it can take up to 10 minutes for the change to propagate. During this time, your function might receive authorization errors (403) even though the role is correctly assigned. If you encounter errors immediately after creating a role assignment, wait a few minutes and retry. 
+ When multiple connections require permissions to the same service, use the role that is the minimum subset of permissions for all connections to that service. 
+ Several bindings require broader permissions in your storage account than what is required by the `AzureWebJobsStorage` connection. 
+ To access keys in Key Vault by using managed identities, assign your app to the [Key Vault Secrets User] role. You can also use a Key Vault access policy to assign the **Get** secrets permission to the managed identity. For more information, see [grant an identity in your app access to your key vault](../app-service/app-service-key-vault-references.md#grant-your-app-access-to-a-key-vault). 
+ This article refers only to [built-in roles](/azure/role-based-access-control/built-in-roles) that provide minimum permissions. Depending on your app requirements, you might instead need to create your own [custom roles](/azure/role-based-access-control/custom-roles). 

### [Host required](#tab/host)

The permissions you need depend on the kind of connection:

+ **`AzureWebJobsStorage`**: The [Storage Blob Data Owner] role provides the minimum storage account permissions for the host-required `AzureWebJobsStorage` connection. This role gives the level of storage access that the Functions host needs while following the principle of _least privilege_.

    For some types of problems, Functions can raise diagnostic events to help you troubleshoot, even when your app can't start. You must also add the [Storage Table Data Contributor] role, which provides access to Table Storage where those diagnostic events are persisted. Without these extra permissions, you might see warnings in your logs about the inability to write these events.

    Several other bindings might require you to use a slightly broader role. The **Host-required storage** column of the table in the **Bindings** tab lists these role requirements.

+ **`APPLICATIONINSIGHTS_AUTHENTICATION_STRING`**: The [Monitoring Metrics Publisher](/azure/role-based-access-control/built-in-roles/monitor#monitoring-metrics-publisher) role grants the minimum permissions the host needs to connect to Application Insights for logging. 

[!INCLUDE [functions-app-insights-disable-local-note](../../includes/functions-app-insights-disable-local-note.md)]  

### [Bindings](#tab/bindings)

The minimum role-based access permissions depend on the specific binding type. This table indicates the recommended role to assign to your identities for a given trigger or binding:

| Extension | Trigger | Input binding | Output binding | Host-required storage<sup>1</sup> |
| ---- | --- | --- | ------| --- |
| [Azure Blob storage](functions-bindings-storage-blob.md) | [Storage Blob Data Owner]<br/>[Storage Queue Data Contributor]<sup>4</sup> |[Storage Blob Data Reader] |[Storage Blob Data Owner]|[Storage Queue Data Contributor]<br/>[Storage Account Contributor]|
| [Azure Cosmos DB](functions-bindings-cosmosdb-v2.md)<sup>2</sup> |[Cosmos DB Built-in Data Contributor]<sup>3</sup>|[Cosmos DB Built-in Data Reader]|[Cosmos DB Built-in Data Contributor]| n/a |
| [Azure Event Grid](functions-bindings-event-grid.md) |n/a|n/a|[EventGrid Contributor]<br/>[EventGrid Data Sender]|n/a |
| [Azure Event Hubs](functions-bindings-event-hubs.md) |[Azure Event Hubs Data Receiver]<br/>[Azure Event Hubs Data Owner] |n/a|[Azure Event Hubs Data Sender]|[Storage Blob Data Owner] |
| [Azure Queue storage](functions-bindings-storage-queue.md)         |[Storage Queue Data Reader]<br/>[Storage Queue Data Message Processor]|n/a|[Storage Queue Data Contributor]<br/>[Storage Queue Data Message Sender] | n/a |
| [Azure Service Bus](functions-bindings-service-bus.md)             |[Azure Service Bus Data Receiver]<sup>5</sup><br/>[Azure Service Bus Data Owner]|n/a|[Azure Service Bus Data Sender]|n/a |
| [Azure SignalR](functions-bindings-signalr-service.md)             |[SignalR Service Owner]|[SignalR Service Owner]|[SignalR Service Owner]|n/a|
| [Azure SQL Database](./functions-bindings-azure-sql.md)<sup>6</sup> | `db_datareader` | `db_datareader` | `db_datawriter` | n/a |
| [Azure Table storage](functions-bindings-storage-table.md)         |n/a|[Storage Table Data Reader]|[Storage Table Data Contributor] |n/a|
| [Timer trigger](functions-bindings-timer.md) | n/a | n/a | n/a| [Storage Blob Data Owner]<sup>7</sup>| 

1. Extension trigger requires extra permissions in the default storage account beyond what the `AzureWebJobsStorage` connection requires. 
2. Azure Cosmos DB for NoSQL doesn't use Azure RBAC for data operations. Instead, it uses a custom RBAC system that is built on similar concepts. To learn how to set these Azure Cosmos DB-specific roles, see [Use data plane role-based access control with Azure Cosmos DB for NoSQL](/azure/cosmos-db/how-to-setup-rbac). 
3. When using managed identities, the container on which you trigger must already exist.
4. The Blob Storage trigger also requires permissions to write [poison blobs] to a queue in the same storage account.
5. For triggering from Service Bus topics, the role assignment needs to have effective scope over the Service Bus subscription resource. If only the topic is included, an error occurs. Some clients, such as the Azure portal, don't expose the Service Bus subscription resource as a scope for role assignment. In this case, the Azure CLI may be used instead. To learn more, see [Built-in roles for Azure Service Bus](../service-bus-messaging/service-bus-managed-service-identity.md#understand-service-bus-rbac-scope-levels).
6. Permissions are granted to your managed identity directly in the database. For more information, see [Grant SQL database access to the managed identity](functions-identity-access-azure-sql-with-managed-identity.md#grant-sql-database-access-to-the-managed-identity).
7. To ensure one execution per event, locks are taken with blobs using the `AzureWebJobsStorage` connection.

When you use the [Durable Functions extension](./durable/durable-functions-overview.md), grant the minimum storage account permissions provided by these roles:

+ [Storage Blob Data Contributor]
+ [Storage Queue Data Contributor]
+ [Storage Table Data Contributor]

Durable Functions uses blobs, queues, and tables to coordinate activity functions and maintain orchestration state. It uses the AzureWebJobsStorage connection for all of these by default, but you can specify a different connection in the [Durable Functions extension configuration](./durable/durable-functions-bindings.md#host-json).  

### [Client SDK](#tab/sdk)

When you use managed identity-based connections with Azure client SDKs, review the documentation for your specific SDK to determine what permissions and roles are required to perform your tasks. 

---
::: zone-end
:::zone pivot="functions-auth-keyvault"

>[!NOTE]
>Use Key Vault only for connections that don't currently support Microsoft Entra ID with Azure managed identities.

Because some services don't yet support Microsoft Entra authentication, your app might still require secrets in certain cases. For these cases, [Azure Key Vault](/azure/key-vault/general/overview) can help streamline the management lifecycle for secrets-based authentication. Your app can use Key Vault to more securely store and access shared secrets, including the default storage account connection string. Although connections still use shared secrets, Key Vault provides a higher level of security for your secrets, including key maintenance and rotation. Your app can connect to Key Vault by using managed identities, even when the service itself doesn't yet support managed identity-based connections. 

When you use Key Vault, create your application setting for the connection by using a [Key Vault reference](../app-service/app-service-key-vault-references.md) instead of the actual secret. For more information, see [Source app settings from key vault](../app-service/app-service-key-vault-references.md#source-app-settings-from-key-vault).

Keep these considerations in mind when maintaining connections in Key Vault:

+ To access keys in the vault, you must [grant an identity in your app access to your key vault](../app-service/app-service-key-vault-references.md#grant-your-app-access-to-a-key-vault). 

+ You can use Key Vault to store settings for your managed identity-based connections. When your app uses Key Vault, references must use a key separator of `:` or `/`, such as `Storage1:blobServiceUri`. When you use the regular application setting delimiter of `__`, reference names don't resolve correctly.

For a complete end-to-end example, see the [Tutorial: Create a function app that connects to Azure services using identities instead of secrets](functions-identity-based-connections-tutorial.md).

### [Host required](#tab/host)

You can configure the [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage) setting to return a [Key Vault reference](../app-service/app-service-key-vault-references.md) that contains the connection string instead of returning the connection string itself. To learn how, see [Use Key Vault references as app settings](../app-service/app-service-key-vault-references.md).

Azure Files doesn't currently support managed identity connections. Because of this limitation, use Key Vault to secure the `WEBSITE_AZUREFILESCONNECTIONSTRING` setting, which is required for dynamic scaling by both Consumption and Premium plans. The [Flex Consumption plan](./flex-consumption-plan.md) is also a dynamic plan that doesn't use Azure Files and fully supports managed identity connections.   

### [Bindings](#tab/bindings)

If the version of your binding extension doesn't yet support managed identity-based authentication, at a minimum, use Key Vault to centrally secure and manage your connection secrets. Then your app can connect to Key Vault by using managed identities, even when you can't use managed identities to directly connect to storage.  

When you use Key Vault, you store the actual connection string for the binding in your vault. Then the value in your connection setting is a [Key Vault reference](../app-service/app-service-key-vault-references.md) that contains the connection string instead of being the connection string itself. To learn how to use Key Vault references in your function app settings, see [Use Key Vault references as app settings in Azure App Service and Azure Functions](../app-service/app-service-key-vault-references.md).

### [Client SDK](#tab/sdk)

You can use client SDKs to manually create and manage connections to other Azure and third-party services. When your SDKs make remote connections, you can improve security by storing your connection strings and other secrets required by your app in Azure Key Vault. Then, your app can instead store a reference to the vault location in application settings. Your app code then requests the connection string by using the setting key as an environmental variable, and the returned reference value is used to securely obtain the actual connection string from the vault. For more information, see [Use Key Vault references as app settings in Azure App Service and Azure Functions](../app-service/app-service-key-vault-references.md).

Using Key Vault centralizes secret management in a secured location with rotation support. 

---
::: zone-end
:::zone pivot="functions-auth-secret"

>[!CAUTION]
>Avoid working directly with shared secrets. Whenever possible, use a more secure method of authentication for your connections.

Mitigate the potential downside risks of lost or compromised secrets by using managed identities with Microsoft Entra ID authentication. When the remote service doesn't support managed identities, at least use Azure Key Vault, which more securely maintains shared secrets. 

If for some reason you can't use a more secure authentication method, the platform encrypts data in your application settings while at rest. Migrate your apps away from using shared secrets to a more secure authentication method as soon as possible.

### [Host required](#tab/host)

Set the connection string for the default storage account in the [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage) setting. This setting is the default connection behavior when you create your function app.

### [Bindings](#tab/bindings)

When the connection name resolves to a single exact value, the host identifies the value as a _connection string_, which typically includes a secret. The details of a connection string depend on the service to which you connect. 

### [Client SDK](#tab/sdk)

When your SDK-based clients make remote connections, at a minimum, store connection strings and other shared secrets in application settings. Reference the keys of those stored connection values as environment variables in your code. To learn more, see [Configure an App Service app](../app-service/configure-common.md). 

---
::: zone-end

## Manage SDK client connections

When you create your own client SDK connections in function code, always reuse client instances across invocations rather than creating new ones. This best practice on all hosting plans reduces latency, avoids socket exhaustion, and improves resource efficiency.


### Reuse client instances

Follow these guidelines when using a service-specific client in an Azure Functions application:

- *Don't* create a new client with every function invocation.
- *Do* create a single, shared client that every function invocation can reuse.
- *Consider* creating a single, shared client in a helper class if different functions use the same service.

The recommended approach depends on your language:

### [C#](#tab/csharp)

Use dependency injection to register singleton or scoped clients.

### [Java](#tab/java)

Use `static final` fields for client instances.

### [JavaScript](#tab/javascript)

Create clients at module scope, outside the function handler.

### [PowerShell](#tab/powershell)

Initialize clients in `profile.ps1` using `$global:` variables.

### [Python](#tab/python)

Create clients at module level, above the `FunctionApp()` instance.

### [TypeScript](#tab/typescript)

Create clients at module scope, outside the function handler.

---

See [Client code examples](#client-code-examples) for complete patterns in each language.

### Connection limits in a Consumption plan

> [!NOTE]
> The hard connection limits described in this section apply only to the legacy [Consumption plan](consumption-plan.md). The [Flex Consumption plan](./flex-consumption-plan.md) doesn't run in the same sandbox environment and doesn't impose these limits. However, reusing clients is still recommended on all plans for optimal performance.

In the legacy Consumption plan, function apps run in a [sandbox environment](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox) that limits the number of outbound connections to 600 active (1,200 total) per instance. When you reach this limit, the Functions host writes the following message to the logs: `Host thresholds exceeded: Connections`. For more information, see the [Functions service limits](functions-scale.md#service-limits).

This limit is per instance. When the [scale controller adds function app instances](event-driven-scaling.md) to handle more requests, each instance has an independent connection limit. That means there's no global connection limit, and you can have more than 600 active connections across all active instances.

When troubleshooting connection issues, make sure that Application Insights is enabled for your function app. Application Insights lets you view metrics for your function apps like executions. For more information, see [View telemetry in Application Insights](analyze-telemetry-data.md#view-telemetry-in-application-insights).  


### Client code examples

This section demonstrates best practices for creating and using clients from your function code.

#### [C#](#tab/csharp)

**HTTP requests**

Register a shared [HttpClient](/dotnet/api/system.net.http.httpclient) by using dependency injection so that all function invocations reuse the same instance. In this case, you don't have to dispose of the client because the runtime manages its lifetime.

```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(MyNamespace.Startup))]

namespace MyNamespace;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddHttpClient();
    }
}
```

Then inject `IHttpClientFactory` or `HttpClient` in your function class:

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace MyNamespace;

public class MyFunction(HttpClient httpClient, ILogger<MyFunction> logger)
{
    [Function("MyFunction")]
    public async Task Run([TimerTrigger("0 */5 * * * *")] TimerInfo timer)
    {
        var response = await httpClient.GetAsync("https://example.com");
        logger.LogInformation("Response status: {Status}", response.StatusCode);
    }
}
```

**Azure Cosmos DB clients**

Register a singleton [CosmosClient](/dotnet/api/microsoft.azure.cosmos.cosmosclient) in your startup so that all functions share one connection. The Azure Cosmos DB documentation recommends that you [use a singleton client for the lifetime of your application](/azure/cosmos-db/performance-tips-dotnet-sdk-v3-sql#sdk-usage).

```csharp
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(MyNamespace.Startup))]

namespace MyNamespace;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddSingleton(_ =>
        {
            var connectionString = Environment.GetEnvironmentVariable("CosmosDBConnection");
            return new CosmosClient(connectionString);
        });
    }
}
```

Then inject `CosmosClient` in your function class:

```csharp
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace MyNamespace;

public class MyCosmosFunction(CosmosClient cosmosClient, ILogger<MyCosmosFunction> logger)
{
    private readonly Container _container = cosmosClient.GetContainer("mydb", "mycontainer");

    [Function("MyCosmosFunction")]
    public async Task Run([TimerTrigger("0 */5 * * * *")] TimerInfo timer)
    {
        var item = new { id = "myId", partitionKey = "myPartitionKey", data = "example" };
        await _container.UpsertItemAsync(item, new PartitionKey("myPartitionKey"));
        logger.LogInformation("Item upserted");
    }
}
```

#### [Java](#tab/java)

**HTTP requests**

Create a shared `HttpClient` as a static field so the same instance is reused across all invocations:

```java
import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class MyFunction {
    // Shared HttpClient instance across all invocations
    private static final HttpClient httpClient = HttpClient.newHttpClient();

    @FunctionName("MyFunction")
    public void run(
        @TimerTrigger(name = "timer", schedule = "0 */5 * * * *") String timerInfo,
        final ExecutionContext context
    ) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://example.com"))
            .build();
        HttpResponse<String> response = httpClient.send(request, 
            HttpResponse.BodyHandlers.ofString());
        context.getLogger().info("Response status: " + response.statusCode());
    }
}
```

**Azure Cosmos DB clients**

Create a static `CosmosClient` that is initialized once and shared across all invocations:

```java
import com.azure.cosmos.*;
import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;

public class MyCosmosFunction {
    private static final CosmosClient cosmosClient = new CosmosClientBuilder()
        .endpoint(System.getenv("COSMOS_API_URL"))
        .key(System.getenv("COSMOS_API_KEY"))
        .buildClient();

    private static final CosmosContainer container = cosmosClient
        .getDatabase("mydb")
        .getContainer("mycontainer");

    @FunctionName("MyCosmosFunction")
    public void run(
        @TimerTrigger(name = "timer", schedule = "0 */5 * * * *") String timerInfo,
        final ExecutionContext context
    ) {
        container.upsertItem(new MyItem("myId", "myPartitionKey", "example"));
        context.getLogger().info("Item upserted");
    }
}
```

#### [JavaScript](#tab/javascript)

**HTTP requests**

Use the native [`http.agent`](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_class_http_agent) class for better connection management. The recommended way to configure connection limits in Functions is to set a maximum number globally:

```javascript
const http = require('http');
http.globalAgent.maxSockets = 200;
```

You can also create a custom HTTP agent for specific requests:

```javascript
const http = require('http');
const httpAgent = new http.Agent({ maxSockets: 200 });
const options = { agent: httpAgent };
http.request(options, onResponseCallback);
```

**Azure Cosmos DB clients**

Create the [CosmosClient](/javascript/api/@azure/cosmos/cosmosclient) outside the function handler so that all invocations share a single connection. The Azure Cosmos DB documentation recommends that you [use a singleton client for the lifetime of your application](/azure/cosmos-db/performance-tips#sdk-usage).

```javascript
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({ 
    endpoint: process.env.COSMOS_API_URL, 
    key: process.env.COSMOS_API_KEY 
});
const container = client.database("MyDatabaseName").container("MyContainerName");

module.exports = async function (context) {
    const { resources: items } = await container.items.readAll().fetchAll();
    context.log(items);
}
```

#### [PowerShell](#tab/powershell)

**HTTP requests**

In PowerShell, you can't easily create static singletons within a function script. Instead, use the `profile.ps1` file to initialize shared state that persists across invocations within a worker instance:

```powershell
# profile.ps1 - runs once when the worker starts
# Nothing special needed for HTTP; PowerShell manages connections internally
```

In your function, use `Invoke-RestMethod` which handles connection pooling automatically:

```powershell
# run.ps1
param($Timer)

$response = Invoke-RestMethod -Uri "https://example.com" -Method Get
Write-Host "Response received with $($response.Length) characters"
```

**Azure Cosmos DB clients**

For Azure Cosmos DB, initialize a shared client in `profile.ps1` by using the Azure SDK:

```powershell
# profile.ps1 - runs once per worker instance
if (-not $global:CosmosContainer) {
    $cosmosClient = New-Object Microsoft.Azure.Cosmos.CosmosClient(
        $env:COSMOS_API_URL, $env:COSMOS_API_KEY)
    $global:CosmosContainer = $cosmosClient.GetDatabase("mydb").GetContainer("mycontainer")
}
```

Then use the shared client in your function:

```powershell
# run.ps1
param($Timer)

$items = $global:CosmosContainer.ReadContainerAsync().GetAwaiter().GetResult()
Write-Host "Container accessed successfully"
```

> [!NOTE]
> PowerShell functions use the .NET Cosmos DB SDK classes. You need to add `Microsoft.Azure.Cosmos` to your `requirements.psd1` managed dependencies.

#### [Python](#tab/python)

**HTTP requests**

Create a shared session at the module level so all function invocations reuse the same connection pool:

```python
import azure.functions as func
import requests

# Shared session reuses TCP connections across invocations
session = requests.Session()
session.mount("https://", requests.adapters.HTTPAdapter(pool_maxsize=200))

app = func.FunctionApp()

@app.timer_trigger(schedule="0 */5 * * * *", arg_name="timer")
def my_function(timer: func.TimerRequest) -> None:
    response = session.get("https://example.com")
    logging.info(f"Response status: {response.status_code}")
```

**Azure Cosmos DB clients**

Create the `CosmosClient` at module level so it persists across invocations:

```python
import azure.functions as func
from azure.cosmos import CosmosClient
import os

# Singleton client shared across all invocations
cosmos_client = CosmosClient(
    os.environ["COSMOS_API_URL"], 
    credential=os.environ["COSMOS_API_KEY"]
)
container = cosmos_client.get_database_client("mydb").get_container_client("mycontainer")

app = func.FunctionApp()

@app.timer_trigger(schedule="0 */5 * * * *", arg_name="timer")
def my_cosmos_function(timer: func.TimerRequest) -> None:
    items = list(container.read_all_items())
    logging.info(f"Read {len(items)} items")
```

#### [TypeScript](#tab/typescript)

**HTTP requests**

Create a shared client at module scope. In the v4 programming model, module-level state persists across invocations:

```typescript
import { app, InvocationContext, Timer } from "@azure/functions";

// Shared across all invocations in this worker instance
const baseUrl = "https://example.com";

async function myFunction(timer: Timer, context: InvocationContext): Promise<void> {
    // Node.js 18+ native fetch reuses connections automatically
    const response = await fetch(baseUrl);
    context.log(`Response status: ${response.status}`);
}

app.timer("myFunction", {
    schedule: "0 */5 * * * *",
    handler: myFunction,
});
```

**Azure Cosmos DB clients**

Create the [CosmosClient](/javascript/api/@azure/cosmos/cosmosclient) outside the handler so all invocations share a single connection:

```typescript
import { app, InvocationContext, Timer } from "@azure/functions";
import { CosmosClient, Container } from "@azure/cosmos";

const client = new CosmosClient({
    endpoint: process.env.COSMOS_API_URL!,
    key: process.env.COSMOS_API_KEY!,
});
const container: Container = client.database("MyDatabaseName").container("MyContainerName");

async function myCosmosFunction(timer: Timer, context: InvocationContext): Promise<void> {
    const { resources: items } = await container.items.readAll().fetchAll();
    context.log(`Read ${items.length} items`);
}

app.timer("myCosmosFunction", {
    schedule: "0 */5 * * * *",
    handler: myCosmosFunction,
});
```

---

### SqlClient connections

Your function code can use the .NET Framework Data Provider for SQL Server ([SqlClient](/dotnet/api/system.data.sqlclient)) to make connections to a SQL relational database. This provider is also the underlying provider for data frameworks that rely on ADO.NET, such as [Entity Framework](/ef/ef6/). Unlike [HttpClient](/dotnet/api/system.net.http.httpclient) and [DocumentClient](/dotnet/api/microsoft.azure.documents.client.documentclient) connections, ADO.NET implements connection pooling by default. But because you can still run out of connections, you should optimize connections to the database. For more information, see [SQL Server Connection Pooling (ADO.NET)](/dotnet/framework/data/adonet/sql-server-connection-pooling).

> [!TIP]
> Some data frameworks, such as Entity Framework, typically get connection strings from the **ConnectionStrings** section of a configuration file. In this case, you must explicitly add SQL database connection strings to the **Connection strings** collection of your function app settings and in the [local.settings.json file](functions-develop-local.md#local-settings-file) in your local project. If you're creating an instance of [SqlConnection](/dotnet/api/system.data.sqlclient.sqlconnection) in your function code, store the connection string value in **Application settings** with your other connections.

## Azure App Configuration

Azure App Configuration is an Azure service that you can use to centrally manage application settings. App Configuration supports hierarchical key-value pairs and versioning, and it integrates with Azure Key Vault for more secure secret management. For more information, see [What is Azure App Configuration?](../azure-app-configuration/overview.md)

For improved security, your function app uses managed identities with Microsoft Entra authentication to access settings in an Application Store. For more information, see [Use App Configuration references for Azure Functions](../app-service/app-service-configuration-references.md?toc=%2fazure%2fazure-functions%2ftoc.json).

> [!NOTE]
> When using [Azure App Configuration](../azure-app-configuration/quickstart-azure-functions-csharp.md) to store settings for managed identity-based connections, references must use a key separator of `:` or `/` in the format `<CONNECTION_NAME_PREFIX>:fullyQualifiedNamespace`. When you use the regular application setting delimiter of `__`, reference names don't resolve correctly.

## Related content

+ [Use connectors in Azure Functions](functions-connectors-overview.md) — Connect to services like Office 365, Teams, and SharePoint by using managed connectors with built-in OAuth and webhook handling.

+ For more information about why use static clients, see [Improper instantiation antipattern](/azure/architecture/antipatterns/improper-instantiation/).

+ For more Azure Functions performance tips, see [Optimize the performance and reliability of Azure Functions](functions-best-practices.md).

[Storage Blob Data Owner]: ../role-based-access-control/built-in-roles.md#storage-blob-data-owner
[Storage Blob Data Reader]: ../role-based-access-control/built-in-roles.md#storage-blob-data-reader
[Storage Queue Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-queue-data-contributor
[poison blobs]: functions-bindings-storage-blob-trigger.md#poison-blobs
[Storage Account Contributor]: ../role-based-access-control/built-in-roles.md#storage-account-contributor
[Storage Queue Data Reader]: ../role-based-access-control/built-in-roles.md#storage-queue-data-reader
[Storage Queue Data Message Processor]: ../role-based-access-control/built-in-roles.md#storage-queue-data-message-processor
[Storage Queue Data Message Sender]: ../role-based-access-control/built-in-roles.md#storage-queue-data-message-sender
[cosmosv4]: ./functions-bindings-cosmosdb-v2.md
[Cosmos DB Built-in Data Reader]: /azure/cosmos-db/how-to-setup-rbac#built-in-role-definitions
[Cosmos DB Built-in Data Contributor]: /azure/cosmos-db/how-to-setup-rbac#built-in-role-definitions
[Storage Table Data Reader]: ../role-based-access-control/built-in-roles.md#storage-table-data-reader
[Storage Table Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-table-data-contributor
[Azure Event Hubs Data Receiver]: ../role-based-access-control/built-in-roles.md#azure-event-hubs-data-receiver
[Azure Event Hubs Data Sender]: ../role-based-access-control/built-in-roles.md#azure-event-hubs-data-sender
[Azure Event Hubs Data Owner]: ../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner
[EventGrid Contributor]: ../role-based-access-control//built-in-roles.md#eventgrid-contributor
[EventGrid Data Sender]: ../role-based-access-control/built-in-roles.md#eventgrid-data-sender 
[Azure Service Bus Data Receiver]: ../role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver
[Azure Service Bus Data Sender]: ../role-based-access-control/built-in-roles.md#azure-service-bus-data-sender
[Azure Service Bus Data Owner]: ../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner
[SignalR Service Owner]: ../role-based-access-control/built-in-roles.md#signalr-service-owner
[Storage Blob Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-blob-data-contributor
[Key Vault Secrets User]: ../role-based-access-control/built-in-roles/security.md#key-vault-secrets-user
