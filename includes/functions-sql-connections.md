---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/07/2026
ms.author: glenga
---

## Connections

The `connectionStringSetting` property is set to a key in application settings that returns a value used by the Functions runtime to connect to the Azure SQL or SQL Server database used by the extension. The value of the connection property setting depends on the type of connection: 

+ **Managed identity connection**: The `connectionStringSetting` property returns a connection string that uses `Authentication=Active Directory Managed Identity` to authenticate without secrets. You can use either a system-assigned or user-assigned managed identity. For more information, see [Connect a function app to Azure SQL with managed identity](../articles/azure-functions/functions-identity-access-azure-sql-with-managed-identity.md) and [Define identity connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings#define-connections).
+ **[Key Vault reference](/azure/key-vault/general/overview)**: The `connectionStringSetting` property setting returns an Azure Key Vault reference to the location where the connection string is centrally maintained. For more information, see [Define Key Vault connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-keyvault&tabs=bindings#define-connections).
+ **[App Configuration reference](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md)**: The `connectionStringSetting` property setting returns an Azure App Configuration reference that returns a connection string or a Key Vault reference. For more information, see [Azure App Configuration](../articles/azure-functions/manage-connections.md#azure-app-configuration) in the connections article. 
+ **Connection string**: The `connectionStringSetting` property setting returns the actual SQL connection string. Because the connection string may contain credentials, you should use a managed identity connection or at least store the connection string in Key Vault. For more information, see [Define connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-secret&tabs=bindings#define-connections).

To learn more about bindings connections, see [Manage connections in Azure Functions](../articles/azure-functions/manage-connections.md?pivots=functions-auth-identity&tabs=bindings).

The connection string is passed to [Microsoft.Data.SqlClient](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring) and supports all keywords defined in the [SqlClient ConnectionString documentation](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-5.0&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString). Notable keywords include:

- `Authentication`: Connect to Azure SQL with Microsoft Entra ID. Set to `Active Directory Managed Identity` for managed identities. For more information, see [Connect a function app to Azure SQL with managed identity](../articles/azure-functions/functions-identity-access-azure-sql-with-managed-identity.md).
- `Command Timeout`: Wait for a specified amount of time in seconds before terminating a query (default 30 seconds).
- `ConnectRetryCount`: Automatically make additional reconnection attempts, especially applicable to Azure SQL Database serverless tier (default 1).
- `Pooling`: Reuse connections to the database to improve performance (default `true`). Additional settings for connection pooling include `Connection Lifetime`, `Max Pool Size`, and `Min Pool Size`. Learn more in the [ADO.NET documentation](/sql/connect/ado-net/sql-server-connection-pooling).
