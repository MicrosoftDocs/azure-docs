---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2026
ms.author: glenga
---

## Connections

The `connection` property is a reference to a key in application settings that returns a value used by the Functions runtime to connect to the Service Bus instance used by the extension. The value of the connection property setting depends on the type of connection: 

+ **Managed identity connection**: The `connection` property is a `<CONNECTION_NAME_PREFIX>` shared by a group of settings that together define an identity-based connection to the Service Bus. For more information, see [Define identity connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings#define-connections).
+ **[Key Vault reference](/azure/key-vault/general/overview)**: The `connection` property setting returns an Azure Key Vault reference to the location where the connection string is centrally maintained. For more information, see [Define Key Vault connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-keyvault&tabs=bindings#define-connections).
+ **[App Configuration reference](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md)**: The `connection` property setting returns an Azure App Configuration reference that returns a connection string or a Key Vault reference. For more information, see [Azure App Configuration](../articles/azure-functions/manage-connections.md#azure-app-configuration) in the connections article. 
+ **Connection string**: The `connection` property setting returns the actual connection string for the Service Bus instance. Because the connection string contains shared secret keys, you should consider using a managed identity connection, when possible. For more information, see [Define connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-secret&tabs=bindings#define-connections).

To learn more about bindings connections, see [Manage connection in Azure Functions](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings). 

To obtain a connection string, follow the steps shown at [Get the management credentials](../articles/service-bus-messaging/service-bus-dotnet-get-started-with-queues.md#get-the-connection-string). The connection string must be for a Service Bus namespace, not limited to a specific queue or topic.

If the app setting name begins with `AzureWebJobs`, you can specify only the remainder of the name. For example, if you set `connection` to `MyServiceBus`, the Functions runtime looks for an app setting named `AzureWebJobsMyServiceBus`. If you leave `connection` empty, the Functions runtime uses the default Service Bus connection string in the app setting that is named `AzureWebJobsServiceBus`.

### Scaling permissions

The Service Bus extension uses the Service Bus Administration API (`GetQueueRuntimePropertiesAsync` / `GetSubscriptionRuntimePropertiesAsync`) to retrieve accurate message counts for scale decisions. This API requires additional permissions beyond what is needed to send or receive messages:

- **SAS connection strings**: The SAS policy must include the **Manage** access right.
- **Identity-based connections**: The identity must be assigned the **Azure Service Bus Data Owner** role, or a custom role that includes `Microsoft.ServiceBus/namespaces/*/read`.

When the connection lacks these permissions you don't see errors at startup. Instead, the extension silently falls back to using peek-based message estimation, which is less accurate and could result in delayed or incorrect scaling decisions.

> [!TIP]
> For production workloads that rely on auto-scaling, include the **Manage** access right (SAS) or assign the **Azure Service Bus Data Owner** role (identity-based connections) to ensure accurate scale behavior. connection string in the app setting that is named `AzureWebJobsServiceBus`.