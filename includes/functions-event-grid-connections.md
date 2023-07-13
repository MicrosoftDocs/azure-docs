---
author: joshlove-msft
ms.service: azure-functions
ms.topic: include
ms.date: 06/14/2023
ms.author: jolov
---

## Authenticating the Event Grid output binding

There are two modes of authenticating using the Event Grid output binding:

- Authenticating with an identity
  - The `Connection` property must be set to the name of a shared prefix for multiple application settings, together defining an [identity-based connection](#identity-based-connections).

- Authenticating with the Event Grid topic key
  - The `TopicEndpointUri` and `TopicKeySetting` properties must be set, as described in [Using the topic key](#using-the-topic-key).

### Identity-based connections

If you are using version 3.3.x or higher of the extension, instead of using a topic key, you can have the app use an [Azure Active Directory identity](../articles/active-directory/fundamentals/active-directory-whatis.md). To do this, you would define settings under a common prefix which maps to the `Connection` property in the binding configuration.

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

### Using the Topic Key

To obtain a topic key, follow the steps shown at [Get access keys](../articles/event-grid/get-access-keys.md).

This topic key should be stored in an application setting with a name matching the value specified by the `TopicKeySetting` property of the binding configuration.
 
The topic endpoint should be stored in an application setting with a name matching the value specified by the `TopicEndpointUri` property of the binding configuration.
