---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/13/2026
ms.author: glenga
---

## Connections

The `connection` property references environment configuration that specifies how the app connects to Service Bus. It can specify:

- The name of an application setting containing a connection string.
- The name of a shared prefix for multiple application settings that together define a managed identity connection.

If the configured value is both an exact match for a single setting and a prefix match for other settings, the exact match is used.

> [!TIP]
> Use managed identity connections instead of connection strings for better security. Connection strings include credentials that could be exposed, while managed identities eliminate the need to manage secrets.

### [Managed identity](#tab/identity-based)

If you're using [version 5.x or higher of the extension](../articles/azure-functions/functions-bindings-service-bus.md?extensionv5), instead of using a connection string with a secret, you can have the app use a [Microsoft Entra identity](../articles/active-directory/fundamentals/active-directory-whatis.md). To use managed identities, define settings under a common prefix that maps to the `connection` property in the trigger and binding configuration.

In this mode, the extension requires the following application settings:

| Template-based setting | Description | Identity type |
| --- | --- | --- |
| `<CONNECTION_NAME_PREFIX>__fullyQualifiedNamespace` | The fully qualified Service Bus namespace. | System-assigned or user-assigned |
| `<CONNECTION_NAME_PREFIX>__credential` | Must be set to `managedidentity`. | User-assigned |
| `<CONNECTION_NAME_PREFIX>__clientId` | The client ID of the user-assigned managed identity. | User-assigned |

The value that you replace `<CONNECTION_NAME_PREFIX>` with is treated by the binding extension as the name of the connection setting.

For example, if your binding configuration specifies `connection = "ServiceBusConnection"` with a user-assigned managed identity, you configure the following application settings:

```json
{
    "ServiceBusConnection__fullyQualifiedNamespace": "myservicebus.servicebus.windows.net",
    "ServiceBusConnection__credential": "managedidentity",
    "ServiceBusConnection__clientId": "00000000-0000-0000-0000-000000000000"
}
```

> [!TIP]
> Use user-assigned managed identities for production scenarios where you need fine-grained control over identity permissions across multiple resources.

You can use other settings in the template to further customize the connection. See [Common properties for identity-based connections](../articles/azure-functions/functions-reference.md#common-properties-for-identity-based-connections).

> [!NOTE]
> When using [Azure App Configuration](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md) or [Key Vault](/azure/key-vault/general/overview) to provide settings for Managed Identity connections, setting names should use a valid key separator such as `:` or `/` in place of the `__` to ensure names are resolved correctly.
>
> For example: `ServiceBusConnection:fullyQualifiedNamespace`

[!INCLUDE [functions-identity-based-connections-configuration](./functions-identity-based-connections-configuration.md)]

[!INCLUDE [functions-service-bus-permissions](./functions-service-bus-permissions.md)]

### [Connection string](#tab/connection-string)

Get this connection string by following the steps in [Get the management credentials](../articles/service-bus-messaging/service-bus-dotnet-get-started-with-queues.md#get-the-connection-string). You need a connection string for a Service Bus namespace, not one that's limited to a specific queue or topic.

Store this connection string in an app setting with a name that matches the value you specify in the `connection` property of the binding configuration.

If the app setting name starts with `AzureWebJobs`, you only need to specify the rest of the name. For example, if you set `connection` to `MyServiceBus`, the Functions runtime looks for an app setting named `AzureWebJobsMyServiceBus`. If you leave `connection` empty, the Functions runtime uses the default Service Bus connection string in the app setting named `AzureWebJobsServiceBus`.

---
