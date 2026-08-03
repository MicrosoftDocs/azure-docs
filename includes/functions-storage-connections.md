---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/11/2026
ms.author: glenga
---

## Connections

The `connection` property is set to a key in application settings that returns a value used by the Functions runtime to connect to the storage account used by the extension. The value of the connection property setting depends on the type of connection: 

+ **Managed identity connection**: The `connection` property is a `<CONNECTION_NAME_PREFIX>` shared by a group of settings that together define an identity-based connection to the storage account. For more information, see [Define identity connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings#define-connections).
+ **[Key Vault reference](/azure/key-vault/general/overview)**: The `connection` property setting returns an Azure Key Vault reference to the location where the connection string is centrally maintained. For more information, see [Define Key Vault connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-keyvault&tabs=bindings#define-connections).
+ **[App Configuration reference](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md)**: The `connection` property setting returns an Azure App Configuration reference that returns a connection string or a Key Vault reference. For more information, see [Azure App Configuration](../articles/azure-functions/manage-connections.md#azure-app-configuration) in the connections article. 
+ **Connection string**: The `connection` property setting returns the actual storage account connection string. Because the connection string contains shared secret keys, you should consider using a managed identity connection, when possible. For more information, see [Define connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-secret&tabs=bindings#define-connections).

To learn more about bindings connections, see [Manage connection in Azure Functions](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings). To obtain a connection string, follow the steps shown at [Manage storage account access keys](../articles/storage/common/storage-account-keys-manage.md).

When you set `connection` to a key or key prefix named `AzureWebJobsStorage` or to an empty string, the binding extension uses the default host storage account. For more information, see [Optimize storage performance](../articles/azure-functions/storage-considerations.md#optimize-storage-performance). 