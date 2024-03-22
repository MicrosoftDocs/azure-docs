---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 11/12/2021
ms.author: mahender
---

## Connections

The `connectionStringSetting`/`connection` and `leaseConnectionStringSetting`/`leaseConnection` properties are references to environment configuration which specifies how the app should connect to Azure Cosmos DB. They may specify:

- The name of an application setting containing a [connection string](#connection-string)
- The name of a shared prefix for multiple application settings, together defining an [identity-based connection](#identity-based-connections). This option is only available for the `connection` and `leaseConnection` versions from [version 4.x or higher of the extension].

If the configured value is both an exact match for a single setting and a prefix match for other settings, the exact match is used.

### Connection string

The connection string for your database account should be stored in an application setting with a name matching the value specified by the connection property of the binding configuration.

### Identity-based connections

If you are using [version 4.x or higher of the extension], instead of using a connection string with a secret, you can have the app use an [Microsoft Entra identity](../articles/active-directory/fundamentals/active-directory-whatis.md). To do this, you would define settings under a common prefix which maps to the connection property in the trigger and binding configuration.

In this mode, the extension requires the following properties:

| Property                  | Environment variable template                       | Description                                | Example value                                        |
|---------------------------|-----------------------------------------------------|--------------------------------------------|------------------------------------------------|
| Account Endpoint | `<CONNECTION_NAME_PREFIX>__accountEndpoint` | The Azure Cosmos DB account endpoint URI. | https://<database_account_name>.documents.azure.com:443/ |

Additional properties may be set to customize the connection. See [Common properties for identity-based connections](../articles/azure-functions/functions-reference.md#common-properties-for-identity-based-connections).

[!INCLUDE [functions-identity-based-connections-configuration](./functions-identity-based-connections-configuration.md)]

[!INCLUDE [functions-cosmos-permissions](./functions-cosmos-permissions.md)]

[version 4.x or higher of the extension]: ../articles/azure-functions/functions-bindings-cosmosdb-v2.md?tabs=extensionv4
