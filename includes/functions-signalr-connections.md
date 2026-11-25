---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/11/2026
ms.author: glenga
---

### Connections

The `connectionStringSetting` property is set to a key in application settings that returns a value used by the Functions runtime to connect to the Azure SignalR Service instance used by the extension. The value of this connection property setting depends on the type of connection: 

+ **Managed identity connection**: The `connectionStringSetting` property is a `<CONNECTION_NAME_PREFIX>` shared by a group of settings that together define an identity-based connection to the service endpoint. For more information, see [Define identity connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings#define-connections).
+ **[Key Vault reference](/azure/key-vault/general/overview)**: The `connectionStringSetting` property setting returns an Azure Key Vault reference to the location where the connection string is centrally maintained. For more information, see [Define Key Vault connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-keyvault&tabs=bindings#define-connections).
+ **[App Configuration reference](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md)**: The `connectionStringSetting` property setting returns an Azure App Configuration reference that returns a connection string or a Key Vault reference. For more information, see [Azure App Configuration](../articles/azure-functions/manage-connections.md#azure-app-configuration) in the connections article. 
+ **Connection string**: The `connectionStringSetting` property setting returns the actual SignalR service connection string. Because the connection string contains shared secret keys, you should consider using a managed identity connection, when possible. For more information, see [Define connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-secret&tabs=bindings#define-connections).

To learn more about bindings connections, see [Manage connection in Azure Functions](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings). To obtain a connection string, follow the steps shown at [How to get connection strings](../articles/azure-signalr/concept-connection-string.md#how-to-get-connection-strings).

The Functions host looks for a key or key prefix named `AzureSignalRConnectionString` when connecting to your SignalR service. Otherwise, it uses the key value set in  `connectionStringSetting` to obtain the required connection information.
 