---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/13/2026
ms.author: glenga
ms.custom: sfi-ropc-nochange
---

## Connections

The `connectionStringSetting`/`connection` and `leaseConnectionStringSetting`/`leaseConnection` properties reference environment configuration that specifies how the app connects to Azure Cosmos DB. They can specify:

- The name of an application setting containing a connection string.
- The name of a shared prefix for multiple application settings, which together define a managed identity connection. This option is only available for the `connection` and `leaseConnection` versions from [version 4.x or higher of the extension].

If the configured value is both an exact match for a single setting and a prefix match for other settings, the exact match is used.

> [!TIP]
> Managed identity connections are recommended over connection strings for improved security. Connection strings include credentials that could be exposed, while managed identities eliminate the need to manage secrets.

### [Managed identity](#tab/identity-based)

If you're using [version 4.x or higher of the extension], instead of using a connection string with a secret, you can have the app use a [Microsoft Entra identity](../articles/active-directory/fundamentals/active-directory-whatis.md). To do this, define settings under a common prefix that maps to the connection property in the trigger and binding configuration.

In this mode, the extension requires the following application settings:

| Template-based setting | Description | Identity type |
| --- | --- | --- |
| `<CONNECTION_NAME_PREFIX>__accountEndpoint` | The Azure Cosmos DB account endpoint URI. | System-assigned or user-assigned |
| `<CONNECTION_NAME_PREFIX>__credential` | Must be set to `managedidentity`. | User-assigned |
| `<CONNECTION_NAME_PREFIX>__clientId` | The client ID of the user-assigned managed identity. | User-assigned |

The value that you replace `<CONNECTION_NAME_PREFIX>` with is treated by the binding extension as the name of the connection setting.

For example, if your binding configuration specifies `connection = "CosmosDBConnection"` with a user-assigned managed identity, configure the following application settings:

```json
{
    "CosmosDBConnection__accountEndpoint": "https://mycosmosdb.documents.azure.com:443/",
    "CosmosDBConnection__credential": "managedidentity",
    "CosmosDBConnection__clientId": "00000000-0000-0000-0000-000000000000"
}
```

> [!TIP]
> Use user-assigned managed identities for production scenarios where you need fine-grained control over identity permissions across multiple resources.

You can use additional settings in the template to further customize the connection. See [Common properties for identity-based connections](../articles/azure-functions/functions-reference.md#common-properties-for-identity-based-connections).

[!INCLUDE [functions-identity-based-connections-configuration](./functions-identity-based-connections-configuration.md)]

[!INCLUDE [functions-cosmos-permissions](./functions-cosmos-permissions.md)]

### [Connection string](#tab/connection-string)

Store the connection string for your database account in an application setting with a name that matches the value you specify in the connection property of the binding configuration.

---

[version 4.x or higher of the extension]: ../articles/azure-functions/functions-bindings-cosmosdb-v2.md?tabs=extensionv4
