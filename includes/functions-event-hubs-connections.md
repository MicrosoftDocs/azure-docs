---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/13/2026
ms.author: glenga
---

## Connections

The `connection` property is a reference to environment configuration which specifies how the app should connect to Event Hubs. It may specify:

- The name of an application setting containing a connection string.
- The name of a shared prefix for multiple application settings, together defining a managed identity connection.

If the configured value is both an exact match for a single setting and a prefix match for other settings, the exact match is used.

> [!TIP]
> Managed identity connections are recommended over connection strings for improved security. Connection strings include credentials that could be exposed, while managed identities eliminate the need to manage secrets.

### [Managed identity](#tab/identity-based)

If you are using [version 5.x or higher of the extension](../articles/azure-functions/functions-bindings-event-hubs.md?tabs=extensionv5), instead of using a connection string with a secret, you can have the app use a [Microsoft Entra identity](../articles/active-directory/fundamentals/active-directory-whatis.md). To do this, you would define settings under a common prefix which maps to the `connection` property in the trigger and binding configuration.

In this mode, the extension requires the following application settings:

| Template-based setting | Description | Identity type |
| --- | --- | --- |
| `<CONNECTION_NAME_PREFIX>__fullyQualifiedNamespace` | The fully qualified Event Hubs namespace. | System-assigned or user-assigned |
| `<CONNECTION_NAME_PREFIX>__credential` | Must be set to `managedidentity`. | User-assigned |
| `<CONNECTION_NAME_PREFIX>__clientId` | The client ID of the user-assigned managed identity. | User-assigned |

The value that you replace `<CONNECTION_NAME_PREFIX>` with is treated by the binding extension as the name of the connection setting.

For example, if your binding configuration specifies `connection = "EventHubConnection"` with a user-assigned managed identity, you would configure the following application settings:

```json
{
    "EventHubConnection__fullyQualifiedNamespace": "myeventhubns.servicebus.windows.net",
    "EventHubConnection__credential": "managedidentity",
    "EventHubConnection__clientId": "00000000-0000-0000-0000-000000000000"
}
```

> [!TIP]
> Use user-assigned managed identities for production scenarios where you need fine-grained control over identity permissions across multiple resources.

You can use additional settings in the template to further customize the connection. See [Common properties for identity-based connections](../articles/azure-functions/functions-reference.md#common-properties-for-identity-based-connections).

> [!NOTE]
> When using [Azure App Configuration](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md) or [Key Vault](/azure/key-vault/general/overview) to provide settings for Managed Identity connections, setting names should use a valid key separator such as `:` or `/` in place of the `__` to ensure names are resolved correctly.
>
> For example: `EventHubConnection:fullyQualifiedNamespace`

[!INCLUDE [functions-identity-based-connections-configuration](./functions-identity-based-connections-configuration.md)]

[!INCLUDE [functions-event-hubs-permissions](./functions-event-hubs-permissions.md)]

### [Connection string](#tab/connection-string)

Obtain this connection string by clicking the **Connection Information** button for the [namespace](../articles/event-hubs/event-hubs-create.md#create-an-event-hubs-namespace), not the event hub itself. The connection string must be for an Event Hubs namespace, not the event hub itself.

When used for triggers, the connection string must have at least "read" permissions to activate the function. When used for output bindings, the connection string must have "send" permissions to send messages to the event stream.

This connection string should be stored in an application setting with a name matching the value specified by the `connection` property of the binding configuration.

---
