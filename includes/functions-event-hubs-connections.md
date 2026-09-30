---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/11/2026
ms.author: glenga
---


## Connections

The `connection` property is set to a key in application settings that returns a value used by the Functions runtime to connect to the Event Hubs namespace that contains the event hub used by the extension. The value of the connection property setting depends on the type of connection: 

+ **Managed identity connection**: The `connection` property is a `<CONNECTION_NAME_PREFIX>` shared by a group of settings that together define an identity-based connection to the namespace. For more information, see [Define identity connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings#define-connections).
+ **[Key Vault reference](/azure/key-vault/general/overview)**: The `connection` property setting returns an Azure Key Vault reference to the location where the connection string is centrally maintained. For more information, see [Define Key Vault connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-keyvault&tabs=bindings#define-connections).
+ **[App Configuration reference](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md)**: The `connection` property setting returns an Azure App Configuration reference that returns a connection string or a Key Vault reference. For more information, see [Azure App Configuration](../articles/azure-functions/manage-connections.md#azure-app-configuration) in the connections article. 
+ **Connection string**: The `connection` property setting returns the actual connection string of the namespace. The connection string must be for an Event Hubs namespace, not the event hub itself. Because the connection string contains shared secret keys, you should consider using a managed identity connection, when possible. For more information, see [Define connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-secret&tabs=bindings#define-connections).

To learn more about bindings connections, see [Manage connection in Azure Functions](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings). 

To learn how to obtain the connection string for your Event Hubs namespace, see [Get an Event Hubs connection string](/azure/event-hubs/event-hubs-get-connection-string).