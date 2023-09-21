---
author: joshlove-msft
ms.service: azure-functions
ms.topic: include
ms.date: 08/10/2023
ms.author: jolov
---

## Connections

There are two ways of authenticating to an Event Grid topic when using the Event Grid output binding:

| Authentication method | Description |
| ----- | ----- |
| Using a topic key | Set the `TopicEndpointUri` and `TopicKeySetting` properties, as described in [Use a topic key](#use-a-topic-key). | 
| Using an identity | Set the `Connection` property to the name of a shared prefix for multiple application settings, together defining an [identity-based connection](#identity-based-connections). This method is supported when using version 3.3.x or higher of the extension. | 

### Use a topic key

Use the following steps to configure a topic key:

1. Follow the steps in [Get access keys](../articles/event-grid/get-access-keys.md) to obtain the topic key for your Event Grid topic.

1. In your application settings, create a setting that defines the key value. Use the name of this setting for the `TopicKeySetting` property of the binding.
 
1. In your application settings, create a setting that defines the topic endpoint. Use the name of this setting for the `TopicEndpointUri` property of the binding.

### Identity-based connection

When using version 3.3.x or higher of the extension, you can connect to Event Grid using [Azure Active Directory identity](../articles/active-directory/fundamentals/active-directory-whatis.md) instead of just a topic key. To do this, you would define settings under a common prefix which maps to the `Connection` property in the binding configuration.

In this mode, the extension requires the following properties:

| Property           | Environment variable template                | Description         | Example value |
|--------------------|----------------------------------------------|---------------------|---------------|
| Topic Endpoint URI | `<CONNECTION_NAME_PREFIX>__topicEndpointUri` | The topic endpoint. | https://\<topic-name\>.centralus-1.eventgrid.azure.net/api/events  |

Additional properties may be set to customize the connection. See [Common properties for identity-based connections](../articles/azure-functions/functions-reference.md#common-properties-for-identity-based-connections).
> [!NOTE]
> When using [Azure App Configuration](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md) or [Key Vault](../articles/key-vault/general/overview.md) to provide settings for Managed Identity connections, setting names should use a valid key separator such as `:` or `/` in place of the `__` to ensure names are resolved correctly.
> 
> For example, `<CONNECTION_NAME_PREFIX>:topicEndpointUri`.

[!INCLUDE [functions-identity-based-connections-configuration](./functions-identity-based-connections-configuration.md)]

[!INCLUDE [functions-event-grid-permissions](./functions-event-grid-permissions.md)]
