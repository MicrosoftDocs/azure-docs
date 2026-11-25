---
title: Connector Trigger for Azure Functions
description: Learn how to use the Connector Trigger to run a function when an event occurs in a service that uses a managed connector.
ms.topic: reference
ms.date: 10/30/2026
ms.devlang: csharp
zone_pivot_groups: programming-languages-set-functions
ms.custom:
  - devx-track-csharp
  - devx-track-js
  - devx-track-python
  - devx-track-ts
  - ignite-2026
---

# Connector Trigger for Azure Functions

Azure Functions provides trigger and binding extensions that integrate with various services, primarily Azure services. The [Connector Extension](./functions-bindings-connector.md) expands these integrations to a much wider selection of services, including business systems and data platforms.

For example, use the Connector Trigger to run a function when a new email arrives in Office 365 Outlook, a file is created in SharePoint, or a record changes in Salesforce. The trigger receives events from a managed connector in [Azure Connector Namespace](../connector-namespace/connector-namespace-overview.md). To explore the available managed connectors, see the [connectors reference](/connectors/connector-reference/).

For more information about managed connectors, when to use them, and feature availability, see [Use managed connectors in Azure Functions](functions-connectors-overview.md).

::: zone pivot="programming-language-go,programming-language-java,programming-language-powershell"

> [!NOTE]
> The Connector Trigger isn't currently supported for this language.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

## Delivery modes

Managed connectors support two delivery modes:

- **Polling:** The Functions host connects outbound to the Connector Namespace to receive events. Set `deliveryMode: 'Poll'`, and supply `connection` and `triggerConfigName` in the registration options.
- **Webhook:** The Connector Namespace sends events to the extension's callback endpoint. Webhook is the default when you omit `deliveryMode`.

Both modes support named helpers such as `connectors.office365.onNewEmail` and the generic `connectorTrigger` helper. For help choosing a mode, see [Choose a delivery mode](functions-bindings-connector.md#choose-a-delivery-mode).

## Get started

Follow the setup path for your delivery mode:

### [Polling](#tab/polling)

1. [Install the Node.js packages and configure the extension bundle](functions-bindings-connector.md#install-extension).
1. [Create or reuse a namespace and connection, and create a polling trigger configuration](#create-a-polling-trigger-configuration).
1. [Get the polling endpoint](#polling-endpoint).
1. [Configure caller credentials, connection access, and local or deployed settings](#polling-authentication).
1. Use a [polling example below](?tabs=polling#examples), matching its `connection` and `triggerConfigName` values to your settings.

### [Webhook](#tab/webhook)

1. [Install the extension](functions-bindings-connector.md#install-extension).
1. [Create or reuse a Connector Namespace](../connector-namespace/create-connector-namespace.md) and an authorized managed connector connection.
1. Use an [example below](#examples) to define the destination function, and run it locally or deploy it.
1. Follow the [Webhook callback URL](#webhook-callback-url) instructions to prepare the callback URL and authentication needed to create the webhook trigger configuration.
1. [Create a webhook trigger configuration](#configure-the-trigger) with the callback URL and authentication, and generate an event in the connected service to test delivery.

---

Polling doesn't require a public callback endpoint or system key. For webhook delivery, the destination function and callback endpoint must be ready before you create the trigger configuration.

::: zone-end

::: zone pivot="programming-language-python"

## Delivery modes

Managed connectors support two delivery modes:

- **Polling:** The Functions host connects outbound to the Connector Namespace to receive events. Set `delivery_mode=func.DeliveryMode.POLL`, and supply `connection` and `trigger_config_name` on `@app.connector_trigger`.
- **Webhook:** The Connector Namespace sends events to the extension's callback endpoint. Webhook is the default when you omit `delivery_mode` on `@app.connector_trigger`.

For help choosing a mode, see [Choose a delivery mode](functions-bindings-connector.md?pivots=programming-language-python#choose-a-delivery-mode).

## Get started

Follow the setup path for your delivery mode:

### [Polling](#tab/polling)

1. [Install the Python packages and configure the extension bundle](functions-bindings-connector.md?pivots=programming-language-python#install-extension).
1. [Create or reuse a namespace and connection, and create a polling trigger configuration](#create-a-polling-trigger-configuration).
1. [Get the polling endpoint](#polling-endpoint).
1. [Configure caller credentials, connection access, and local or deployed settings](#polling-authentication).
1. Use a [polling example below](?tabs=polling&pivots=programming-language-python#examples), matching its `connection` and `trigger_config_name` values to your settings.

### [Webhook](#tab/webhook)

1. [Install the Python packages and configure the extension bundle](functions-bindings-connector.md?pivots=programming-language-python#install-extension).
1. [Create or reuse a Connector Namespace](../connector-namespace/create-connector-namespace.md) and an authorized managed connector connection.
1. Use a [webhook example below](?tabs=webhook&pivots=programming-language-python#examples) to define the destination function, and run it locally or deploy it.
1. Follow the [Webhook callback URL](#webhook-callback-url) instructions to prepare the callback URL and authentication needed to create the webhook trigger configuration.
1. [Create a webhook trigger configuration](#configure-the-trigger) with the callback URL and authentication, and generate an event in the connected service to test delivery.

---

Polling doesn't require a public callback endpoint or system key. For webhook delivery, the destination function and callback endpoint must be ready before you create the trigger configuration.

::: zone-end

::: zone pivot="programming-language-csharp"

## Delivery modes

Managed connectors support two delivery modes:

- **Polling:** The Functions host connects outbound to the Connector Namespace to receive events. Set `DeliveryMode = ConnectorTriggerDeliveryMode.Poll`, and add the connection settings and trigger configuration on `[ConnectorTrigger]`.
- **Webhook:** The Connector Namespace sends events to the extension's callback endpoint. Webhook is the default when you omit `DeliveryMode` on the `[ConnectorTrigger]` attribute.

For help choosing a mode, see [Choose a delivery mode](functions-bindings-connector.md?pivots=programming-language-csharp#choose-a-delivery-mode).

## Get started

Follow the setup path for your delivery mode:

### [Polling](#tab/polling)

1. [Install the extension](functions-bindings-connector.md?pivots=programming-language-csharp#install-packages).
1. [Create or reuse a namespace and connection, and create a polling trigger configuration](#create-a-polling-trigger-configuration).
1. [Get the polling endpoint](#polling-endpoint).
1. [Configure caller credentials, connection access, and local or deployed settings](#polling-authentication).
1. Use an [example below](#examples), matching its `Connection` and `TriggerConfigName` values to your settings.

### [Webhook](#tab/webhook)

1. [Install the extension](functions-bindings-connector.md?pivots=programming-language-csharp#install-packages).
1. [Create or reuse a Connector Namespace](../connector-namespace/create-connector-namespace.md) and an authorized managed connector connection.
1. Use a [webhook example below](?tabs=webhook&pivots=programming-language-csharp#examples) to define the destination function, and run it locally or deploy it.
1. Follow the [Webhook callback URL](#webhook-callback-url) instructions to prepare the callback URL and authentication needed to create the webhook trigger configuration.
1. [Create a webhook trigger configuration](#configure-the-trigger) with the callback URL and authentication, and generate an event in the connected service to test delivery.

---

Polling doesn't require a public callback endpoint or system key. For webhook delivery, the destination function and callback endpoint must be ready before you create the trigger configuration.

## Examples

The Office 365 Outlook and SharePoint Online examples use strongly typed payloads from the Azure Connectors SDK. For connector operations that don't yet have strongly typed payloads, bind to `string` to receive the raw JSON payload or `JsonElement` to inspect its JSON properties without defining a model. These examples intentionally log only basic payload information to stay focused on how to define connector-triggered functions. Replace the logging with your application's processing logic.

To find which connector operations support strongly typed payloads for .NET, see [Connector trigger payloads for Azure Functions](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md).

The _polling_ delivery mode also supports optional properties on the `[ConnectorTrigger]` attribute. For descriptions, supported values, and defaults, see [polling attribute properties](#polling-attribute-properties).

### Office 365 Outlook

The following example runs when a new email arrives in the configured Office 365 Outlook mailbox:

#### [Polling](#tab/polling)

This example receives batches of up to four connector events, each containing one email, and uses `ConnectorEvent<T>` to access each event's payload and `MessageId`.

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;
using Azure.Connectors.Sdk.Office365.Models;

namespace Office365App;

public sealed class O365Functions(ILogger<O365Functions> logger)
{
    [Function("OnNewEmail")]
    public void OnNewEmail(
        [ConnectorTrigger(
            DeliveryMode = ConnectorTriggerDeliveryMode.Poll,
            Connection = "ConnectorNamespace",
            TriggerConfigName = "%OnNewEmailTriggerConfigName%",
            IsBatched = true,
            MaxBatchSize = 4,
            TargetPendingEventThreshold = 16)]
        ConnectorEvent<Office365OnNewEmailTriggerPayload>[] emails)
    {
        foreach (var email in emails)
        {
            var messageCount = email.Data.Body?.Value?.Count ?? 0;
            logger.LogInformation(
                "Poll event {MessageId}: received {MessageCount} new email message(s).",
                email.MessageId,
                messageCount);
        }
    }
}
```

For local development, include the connection settings and trigger configuration name in the `Values` section of *local.settings.json*:

```json
{
  "ConnectorNamespace__pollingEndpoint": "https://<connector-namespace-host>",
  "OnNewEmailTriggerConfigName": "<polling-trigger-config-name>"
}
```

The attribute properties refer to these settings:

- `Connection = "ConnectorNamespace"` identifies the settings prefix. The extension reads the polling endpoint from `ConnectorNamespace__pollingEndpoint`. For how to get the endpoint and information about the required credentials and access policies, see [Polling endpoint](#polling-endpoint).
- `TriggerConfigName = "%OnNewEmailTriggerConfigName%"` resolves the value of the `OnNewEmailTriggerConfigName` setting. Set its value to the name of the polling trigger configuration in your Connector Namespace.

The prefix and setting names are illustrative; if you change them, update both the attribute properties and the settings to match. For a deployed function app, add the same settings to the function app's app settings instead of *local.settings.json*.

#### [Webhook](#tab/webhook)

This example runs once per webhook callback, binds the payload to `Office365OnNewEmailTriggerPayload`, and logs the number of email messages it contains. `[ConnectorTrigger]` uses webhook delivery by default, so no additional attribute properties are required.

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;
using Azure.Connectors.Sdk.Office365.Models;

namespace Office365App;

public class O365Functions
{
    private readonly ILogger<O365Functions> _logger;

    public O365Functions(ILogger<O365Functions> logger)
    {
        _logger = logger;
    }

    [Function("OnNewEmail")]
    public void OnNewEmail(
        [ConnectorTrigger] Office365OnNewEmailTriggerPayload payload)
    {
        var messageCount = payload.Body?.Value?.Count ?? 0;
        _logger.LogInformation(
            "Received {MessageCount} new email message(s).",
            messageCount);
    }
}
```

---

The `Office365OnNewEmailTriggerPayload` type is defined in the `Azure.Connectors.Sdk.Office365.Models` namespace.

For the complete code sample, including infrastructure and trigger registration, see [Office 365 Outlook triggers for .NET](https://github.com/Azure-Samples/functions-connectors-net/tree/main/office365App).

### SharePoint Online

The following example runs when a file is created in the configured SharePoint Online document library:

#### [Polling](#tab/polling)

This example receives one connector event containing one file per invocation (the default) and uses `ConnectorEvent<T>` to access its payload and `MessageId`.

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;
using Azure.Connectors.Sdk.SharePointOnline.Models;

namespace SharePointApp;

public sealed class SharePointFunctions(ILogger<SharePointFunctions> logger)
{
    [Function("OnNewFile")]
    public void OnNewFile(
        [ConnectorTrigger(
            DeliveryMode = ConnectorTriggerDeliveryMode.Poll,
            Connection = "ConnectorNamespace",
            TriggerConfigName = "%OnNewFileTriggerConfigName%")]
        ConnectorEvent<SharePointOnlineOnNewFileItemsTriggerPayload> file)
    {
        var fileCount = file.Data.Body?.Value?.Count ?? 0;
        logger.LogInformation(
            "Poll event {MessageId}: received {FileCount} new SharePoint file(s).",
            file.MessageId,
            fileCount);
    }
}
```

For local development, include these values in the `Values` object in *local.settings.json*:

```json
{
  "ConnectorNamespace__pollingEndpoint": "https://<connector-namespace-host>",
  "OnNewFileTriggerConfigName": "<polling-trigger-config-name>"
}
```

The attribute properties refer to these settings:

- `Connection = "ConnectorNamespace"` identifies the settings prefix. The extension reads the polling endpoint from `ConnectorNamespace__pollingEndpoint`. For how to get the endpoint and information about the required credentials and access policies, see [Polling endpoint](#polling-endpoint).
- `TriggerConfigName = "%OnNewFileTriggerConfigName%"` resolves the value of the `OnNewFileTriggerConfigName` setting. Set its value to the name of the SharePoint polling trigger configuration in your Connector Namespace.

The prefix and setting names are illustrative; if you change them, update both the attribute properties and the settings to match. For a deployed function app, add the same settings to the function app's app settings instead of *local.settings.json*.

#### [Webhook](#tab/webhook)

This example runs once per webhook callback, binds the payload to `SharePointOnlineOnNewFileItemsTriggerPayload`, and logs the number of files it contains. `[ConnectorTrigger]` uses webhook delivery by default, so no additional attribute properties are required.

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;
using Azure.Connectors.Sdk.SharePointOnline.Models;

namespace SharePointApp;

public class SharePointFunctions
{
    private readonly ILogger<SharePointFunctions> _logger;

    public SharePointFunctions(ILogger<SharePointFunctions> logger)
    {
        _logger = logger;
    }

    [Function("OnNewFile")]
    public void OnNewFile(
        [ConnectorTrigger] SharePointOnlineOnNewFileItemsTriggerPayload payload)
    {
        var fileCount = payload.Body?.Value?.Count ?? 0;
        _logger.LogInformation(
            "Received {FileCount} new SharePoint file(s).",
            fileCount);
    }
}
```

---

The `SharePointOnlineOnNewFileItemsTriggerPayload` type is defined in the `Azure.Connectors.Sdk.SharePointOnline.Models` namespace.

For the complete code sample, including infrastructure and trigger registration, see [SharePoint Online triggers for .NET](https://github.com/Azure-Samples/functions-connectors-net/tree/main/sharepointApp).

### Connector without a strongly typed payload

Some connector events don't yet have a strongly typed .NET payload. The following example runs when a new message is added to a Microsoft Teams chat or channel. Polling uses `ConnectorEvent<string>` to receive the raw JSON payload with delivery metadata; webhook delivery binds directly to `string`:

Alternatively, use `JsonElement` from `System.Text.Json` to inspect the payload's JSON properties without defining a model. Both delivery modes support binding directly to `JsonElement` or using `ConnectorEvent<JsonElement>` to access the payload through `Data` alongside delivery metadata.

#### [Polling](#tab/polling)

This example receives one connector event per invocation (default) and uses `ConnectorEvent<string>` to access its JSON payload and `MessageId`.

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;

namespace TeamsApp;

public sealed class TeamsFunctions(ILogger<TeamsFunctions> logger)
{
    [Function("OnNewTeamsMessage")]
    public void OnNewTeamsMessage(
        [ConnectorTrigger(
            DeliveryMode = ConnectorTriggerDeliveryMode.Poll,
            Connection = "ConnectorNamespace",
            TriggerConfigName = "%OnNewTeamsMessageTriggerConfigName%")]
        ConnectorEvent<string> message)
    {
        logger.LogInformation(
            "Poll event {MessageId}: received a Teams payload of {PayloadLength} characters.",
            message.MessageId,
            message.Data.Length);
    }
}
```

For local development, include these values in the `Values` object in *local.settings.json*:

```json
{
  "ConnectorNamespace__pollingEndpoint": "https://<connector-namespace-host>",
  "OnNewTeamsMessageTriggerConfigName": "<polling-trigger-config-name>"
}
```

The attribute properties refer to these settings:

- `Connection = "ConnectorNamespace"` identifies the settings prefix. The extension reads the polling endpoint from `ConnectorNamespace__pollingEndpoint`. For how to get the endpoint and information about the required credentials and access policies, see [Polling endpoint](#polling-endpoint).
- `TriggerConfigName = "%OnNewTeamsMessageTriggerConfigName%"` resolves the value of the `OnNewTeamsMessageTriggerConfigName` setting. Set its value to the name of the Teams polling trigger configuration in your Connector Namespace.

The prefix and setting names are illustrative; if you change them, update both the attribute properties and the settings to match. For a deployed function app, add the same settings to the function app's app settings instead of *local.settings.json*.

#### [Webhook](#tab/webhook)

This example runs once per webhook callback and binds the payload to `string` to log the raw Teams JSON payload. `[ConnectorTrigger]` uses webhook delivery by default, so no additional attribute properties are required.

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;

namespace TeamsApp;

public class TeamsFunctions
{
    private readonly ILogger<TeamsFunctions> _logger;

    public TeamsFunctions(ILogger<TeamsFunctions> logger)
    {
        _logger = logger;
    }

    [Function("OnNewTeamsMessage")]
    public void OnNewTeamsMessage([ConnectorTrigger] string payload)
    {
        _logger.LogInformation("Received a new Teams message: {Payload}", payload);
    }
}
```

---

For the complete code sample, including infrastructure and trigger registration, see [Generic connector triggers for .NET](https://github.com/Azure-Samples/functions-connectors-net/tree/main/genericApp).

### Connector event mappings

The operation name is defined by the managed connector. You choose the function name in your code. The polling and webhook examples use the same event, operation, and function names:

| Connector event | Operation name | Function name |
| --- | --- | --- |
| New Office 365 Outlook email | `OnNewEmailV3` | `OnNewEmail` |
| New SharePoint Online file | `GetOnNewFileItems` | `OnNewFile` |
| New Microsoft Teams chat or channel message | `WebhookNewMessageTrigger` | `OnNewTeamsMessage` |

Webhook payloads can contain multiple items, depending on the trigger configuration.

Polling delivery always enables `splitOn`, so each queued event contains one split item. However, the polling mode can group events into one function invocation by setting `IsBatched = true`. For batching configuration, see [Attributes](#polling-attribute-properties).

## Binding types

For .NET isolated worker functions, both delivery modes support these parameter types:

| Type | Description |
| --- | --- |
| `string` | Receives the event body as raw JSON. Use this type when a strongly typed SDK model isn't available or when you want to deserialize the payload yourself. |
| `JsonElement` | Receives the event body as a JSON value that you can inspect without defining a model. This type is in the `System.Text.Json` namespace. |
| Connector SDK model | Deserializes the JSON event body into an operation-specific model from `Azure.Connectors.Sdk`, such as `Office365OnNewEmailTriggerPayload` or `SharePointOnlineOnNewFileItemsTriggerPayload`. |
| JSON-deserializable POCO | Deserializes the JSON event body into a .NET type whose shape matches the connector payload by using the configured worker serializer. |
| `ConnectorEvent<T>` | Wraps a supported payload type in `Data`. `MessageId` contains the delivery identifier for polling and is `null` for webhook delivery. |

### Array parameters

Array parameters have different meanings in each delivery mode.

For **polling**, `IsBatched` determines the function parameter shape, where `T` is a supported event payload type:

| `IsBatched` | Function parameter type |
| --- | --- |
| `false` (default) | `T` or `ConnectorEvent<T>` |
| `true` | `T[]` or `ConnectorEvent<T>[]`, even when `MaxBatchSize = 1` |

Set `MaxBatchSize` to a value from **1 through 32**; without batching, the effective batch size must be 1. Batch size counts connector events, not items within an event's payload. Batching doesn't change the payload type inside each event. An SDK payload's `Body.Value` collection is separate from the outer array of events supplied to a batched invocation.

For **webhook**, use `T[]` to deserialize a single callback's JSON array body into an array of payload items. This isn't a batch of separately delivered events. Webhook delivery processes one callback per invocation; `IsBatched` applies only to polling.

::: zone-end

::: zone pivot="programming-language-typescript"

## Examples

The Node.js connector extension provides typed contexts for the Office 365 Outlook, SharePoint Online, and Microsoft Teams operations shown in this section. These examples intentionally log only basic payload information to stay focused on how to define Connector-triggered functions. Replace the logging with your application's processing logic.

To find which connector operations support strongly typed payloads for JavaScript and TypeScript, see the [Node.js connector extension reference](https://github.com/Azure/azure-functions-nodejs-extensions/tree/main/azure-functions-nodejs-extensions-connectors).

### Office 365 Outlook

The following example runs when a new email arrives in the configured Office 365 Outlook mailbox:

#### [Polling](#tab/polling)

This example receives up to four connector events per invocation. The helper supplies the emails from those events as one list.

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectors,
    EmailTriggerContext,
} from '@azure/functions-extensions-connectors';

connectors.office365.onNewEmail('OnNewEmail', {
    deliveryMode: 'Poll',
    connection: 'ConnectorNamespace',
    triggerConfigName: '%OnNewEmailTriggerConfigName%',
    cardinality: 'many',
    maxBatchSize: 4,
    targetPendingEventThreshold: 16,
    handler: async (
        context: EmailTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(
            `Received ${context.emails.length} new email message(s).`,
        );
    },
});
```

#### [Webhook](#tab/webhook)

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectors,
    EmailTriggerContext,
} from '@azure/functions-extensions-connectors';

connectors.office365.onNewEmail('OnNewEmail', {
    handler: async (
        context: EmailTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(
            `Received ${context.emails.length} new email message(s).`,
        );
    },
});
```

---

The `EmailTriggerContext` type exposes the messages as a typed `emails` array.

For additional examples, see [Office 365 Outlook triggers for TypeScript](https://github.com/Azure-Samples/functions-connectors-typescript/tree/main/office365App).

### SharePoint Online

The following example runs when a file is created in the configured SharePoint Online document library:

#### [Polling](#tab/polling)

This example receives one connector event per invocation, the default. The helper supplies its file-property records as a list.

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectors,
    SharepointItemTriggerContext,
} from '@azure/functions-extensions-connectors';

connectors.sharepoint.onNewFileItems('OnSharepointNewFile', {
    deliveryMode: 'Poll',
    connection: 'ConnectorNamespace',
    triggerConfigName: '%OnSharepointNewFileTriggerConfigName%',
    handler: async (
        context: SharepointItemTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(
            `Received ${context.records.length} new SharePoint file(s).`,
        );
    },
});
```

#### [Webhook](#tab/webhook)

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectors,
    SharepointItemTriggerContext,
} from '@azure/functions-extensions-connectors';

connectors.sharepoint.onNewFileItems('OnSharepointNewFile', {
    handler: async (
        context: SharepointItemTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(
            `Received ${context.records.length} new SharePoint file(s).`,
        );
    },
});
```

---

The `SharepointItemTriggerContext` type exposes file-property records through `records` for the `GetOnNewFileItems` operation. The helper preserves the fields supplied by the connector without converting them into a fixed file schema. For additional examples, see [SharePoint Online triggers for TypeScript](https://github.com/Azure-Samples/functions-connectors-typescript/tree/main/sharepointApp).

### Microsoft Teams

The following example runs when a new message is added to a Microsoft Teams channel:

#### [Polling](#tab/polling)

This example receives one connector event per invocation, the default. The helper supplies its message payload as a list.

```typescript
import { InvocationContext } from '@azure/functions';
import {
    ChannelMessageTriggerContext,
    connectors,
} from '@azure/functions-extensions-connectors';

connectors.teams.onNewChannelMessage('OnNewChannelMessage', {
    deliveryMode: 'Poll',
    connection: 'ConnectorNamespace',
    triggerConfigName: '%OnNewTeamsMessageTriggerConfigName%',
    handler: async (
        context: ChannelMessageTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(
            `Received ${context.messages.length} new Teams message(s).`,
        );
    },
});
```

#### [Webhook](#tab/webhook)

```typescript
import { InvocationContext } from '@azure/functions';
import {
    ChannelMessageTriggerContext,
    connectors,
} from '@azure/functions-extensions-connectors';

connectors.teams.onNewChannelMessage('OnNewChannelMessage', {
    handler: async (
        context: ChannelMessageTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(
            `Received ${context.messages.length} new Teams message(s).`,
        );
    },
});
```

---

The `ChannelMessageTriggerContext` type exposes the messages as a typed `messages` array.

For additional examples, see [Microsoft Teams triggers for TypeScript](https://github.com/Azure-Samples/functions-connectors-typescript/tree/main/teamsApp).

### Generic connector payload

Use the generic helper when an operation doesn't have a named registration. Access `context.rawPayload` when your code needs to process the original payload itself.

#### [Polling](#tab/polling)

This example receives one connector event per invocation, the default. The helper supplies its payload items as a list.

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectorTrigger,
    ConnectorTriggerContext,
} from '@azure/functions-extensions-connectors';

connectorTrigger('OnConnectorEvent', {
    deliveryMode: 'Poll',
    connection: 'ConnectorNamespace',
    triggerConfigName: '%GenericTriggerConfigName%',
    handler: async (
        context: ConnectorTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(`Received ${context.items.length} payload item(s).`);
    },
});
```

#### [Webhook](#tab/webhook)

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectorTrigger,
    ConnectorTriggerContext,
} from '@azure/functions-extensions-connectors';

connectorTrigger('OnConnectorEvent', {
    handler: async (
        context: ConnectorTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(`Received ${context.items.length} payload item(s).`);
    },
});
```

---

The generic context defaults its item type to `unknown`. Validate items before accessing operation-specific properties. `context.rawPayload` preserves the parsed input before normalization, including the outer event array for batched polling.

::: zone-end

::: zone pivot="programming-language-javascript"

## Examples

The Node.js connector extension provides connector-specific contexts for the Office 365 Outlook, SharePoint Online, and Microsoft Teams operations shown in this section. These examples intentionally log only basic payload information to stay focused on how to define Connector-triggered functions. Replace the logging with your application's processing logic.

To find which connector operations support strongly typed payloads for JavaScript and TypeScript, see the [Node.js connector extension reference](https://github.com/Azure/azure-functions-nodejs-extensions/tree/main/azure-functions-nodejs-extensions-connectors).

### Office 365 Outlook

The following example runs when a new email arrives in the configured Office 365 Outlook mailbox:

#### [Polling](#tab/polling)

This example receives up to four connector events per invocation. The helper supplies the emails from those events as one list.

```javascript
const {
    connectors,
} = require('@azure/functions-extensions-connectors');

connectors.office365.onNewEmail('OnNewEmail', {
    deliveryMode: 'Poll',
    connection: 'ConnectorNamespace',
    triggerConfigName: '%OnNewEmailTriggerConfigName%',
    cardinality: 'many',
    maxBatchSize: 4,
    targetPendingEventThreshold: 16,
    handler: async (context, invocationContext) => {
        invocationContext.log(
            `Received ${context.emails.length} new email message(s).`,
        );
    },
});
```

#### [Webhook](#tab/webhook)

```javascript
const {
    connectors,
} = require('@azure/functions-extensions-connectors');

connectors.office365.onNewEmail('OnNewEmail', {
    handler: async (context, invocationContext) => {
        invocationContext.log(
            `Received ${context.emails.length} new email message(s).`,
        );
    },
});
```

---

The handler context exposes the messages through the `emails` array.

### SharePoint Online

The following example runs when a file is created in the configured SharePoint Online document library:

#### [Polling](#tab/polling)

This example receives one connector event per invocation, the default. The helper supplies its file-property records as a list.

```javascript
const {
    connectors,
} = require('@azure/functions-extensions-connectors');

connectors.sharepoint.onNewFileItems('OnSharepointNewFile', {
    deliveryMode: 'Poll',
    connection: 'ConnectorNamespace',
    triggerConfigName: '%OnSharepointNewFileTriggerConfigName%',
    handler: async (context, invocationContext) => {
        invocationContext.log(
            `Received ${context.records.length} new SharePoint file(s).`,
        );
    },
});
```

#### [Webhook](#tab/webhook)

```javascript
const {
    connectors,
} = require('@azure/functions-extensions-connectors');

connectors.sharepoint.onNewFileItems('OnSharepointNewFile', {
    handler: async (context, invocationContext) => {
        invocationContext.log(
            `Received ${context.records.length} new SharePoint file(s).`,
        );
    },
});
```

---

The handler context exposes file-property records through `records` for the `GetOnNewFileItems` operation. The helper preserves the fields supplied by the connector without converting them into a fixed file schema.

### Microsoft Teams

The following example runs when a new message is added to a Microsoft Teams channel:

#### [Polling](#tab/polling)

This example receives one connector event per invocation, the default. The helper supplies its message payload as a list.

```javascript
const {
    connectors,
} = require('@azure/functions-extensions-connectors');

connectors.teams.onNewChannelMessage('OnNewChannelMessage', {
    deliveryMode: 'Poll',
    connection: 'ConnectorNamespace',
    triggerConfigName: '%OnNewTeamsMessageTriggerConfigName%',
    handler: async (context, invocationContext) => {
        invocationContext.log(
            `Received ${context.messages.length} new Teams message(s).`,
        );
    },
});
```

#### [Webhook](#tab/webhook)

```javascript
const {
    connectors,
} = require('@azure/functions-extensions-connectors');

connectors.teams.onNewChannelMessage('OnNewChannelMessage', {
    handler: async (context, invocationContext) => {
        invocationContext.log(
            `Received ${context.messages.length} new Teams message(s).`,
        );
    },
});
```

---

The handler context exposes the messages through the `messages` array.

### Generic connector payload

Use the generic helper when an operation doesn't have a named registration. Access `context.rawPayload` when your code needs to process the original payload itself.

#### [Polling](#tab/polling)

This example receives one connector event per invocation, the default. The helper supplies its payload items as a list.

```javascript
const {
    connectorTrigger,
} = require('@azure/functions-extensions-connectors');

connectorTrigger('OnConnectorEvent', {
    deliveryMode: 'Poll',
    connection: 'ConnectorNamespace',
    triggerConfigName: '%GenericTriggerConfigName%',
    handler: async (context, invocationContext) => {
        invocationContext.log(`Received ${context.items.length} payload item(s).`);
    },
});
```

#### [Webhook](#tab/webhook)

```javascript
const {
    connectorTrigger,
} = require('@azure/functions-extensions-connectors');

connectorTrigger('OnConnectorEvent', {
    handler: async (context, invocationContext) => {
        invocationContext.log(`Received ${context.items.length} payload item(s).`);
    },
});
```

---

Validate items before accessing operation-specific properties. `context.rawPayload` preserves the parsed input before normalization, including the outer event array for batched polling.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

### Local polling settings

Add the polling endpoint and trigger configuration names to *local.settings.json*:

```json
{
  "IsEncrypted": false,
  "Values": {
    "ConnectorNamespace__pollingEndpoint": "https://<connector-namespace-host>",
    "OnNewEmailTriggerConfigName": "<outlook-polling-trigger-config-name>",
    "OnSharepointNewFileTriggerConfigName": "<sharepoint-polling-trigger-config-name>",
    "OnNewTeamsMessageTriggerConfigName": "<teams-polling-trigger-config-name>",
    "GenericTriggerConfigName": "<generic-polling-trigger-config-name>"
  }
}
```

The examples' `connection: 'ConnectorNamespace'` value identifies the settings prefix. Each `triggerConfigName` expression resolves to its corresponding app setting. For deployed settings and connection permissions, see [Polling authentication](#polling-authentication).

For another example of polling registration, see the [Node.js polling sample](https://github.com/Azure/azure-functions-connector-extension/tree/main/test/poll/nodejs).

::: zone-end

::: zone pivot="programming-language-python"

## Examples

The Office 365 Outlook and SharePoint Online examples use converters provided by `azurefunctions-extensions-connectors`. The generic example receives raw JSON without an SDK annotation. These examples log only basic payload information; replace the logging with your application's processing logic.

To find which connector operations support strongly typed payloads for Python, see [Key concepts in the Python connector extension](https://github.com/Azure/azure-functions-python-extensions/tree/dev/azurefunctions-extensions-connectors#key-concepts).

### Office 365 Outlook

The following example runs when a new email arrives in the configured Office 365 Outlook mailbox:

#### [Polling](#tab/polling)

This example receives up to four connector events per invocation. The converter supplies the emails from those events as one list.

```python
import logging

import azure.functions as func
import azurefunctions.extensions.connectors.office365 as office365

app = func.FunctionApp()


@app.function_name(name="OnNewEmail")
@app.connector_trigger(
    arg_name="emails",
    delivery_mode=func.DeliveryMode.POLL,
    connection="ConnectorNamespace",
    trigger_config_name="%OnNewEmailTriggerConfigName%",
    cardinality=func.Cardinality.MANY,
    max_batch_size=4,
    target_pending_event_threshold=16,
)
def on_new_email(
    emails: list[office365.GraphClientReceiveMessage],
) -> None:
    logging.info(
        "Received %s new email message(s).",
        len(emails),
    )
```

#### [Webhook](#tab/webhook)

This example receives one callback per invocation. The converter supplies its email payload as a list.

```python
import logging

import azure.functions as func
import azurefunctions.extensions.connectors.office365 as office365

app = func.FunctionApp()


@app.function_name(name="OnNewEmail")
@app.connector_trigger(arg_name="emails")
def on_new_email(
    emails: list[office365.GraphClientReceiveMessage],
) -> None:
    logging.info(
        "Received %s new email message(s).",
        len(emails),
    )
```

---

The `GraphClientReceiveMessage` binding supports the `OnNewEmailV3` operation. For complete code, infrastructure, and trigger registration for both modes, see [Office 365 Outlook triggers for Python](https://github.com/Azure-Samples/functions-connectors-python/tree/main/office365App).

### SharePoint Online

The following example runs when a file is created in the configured SharePoint Online document library:

#### [Polling](#tab/polling)

This example receives one connector event per invocation, the default. The converter supplies its file-property records as a list.

```python
import logging

import azure.functions as func
import azurefunctions.extensions.connectors.sharepointonline as sharepoint

app = func.FunctionApp()


@app.function_name(name="OnSharepointNewFile")
@app.connector_trigger(
    arg_name="files",
    delivery_mode=func.DeliveryMode.POLL,
    connection="ConnectorNamespace",
    trigger_config_name="%OnSharepointNewFileTriggerConfigName%",
)
def on_sharepoint_new_file(files: list[sharepoint.Item]) -> None:
    logging.info(
        "Received %s new SharePoint file(s).",
        len(files),
    )
```

#### [Webhook](#tab/webhook)

```python
import logging

import azure.functions as func
import azurefunctions.extensions.connectors.sharepointonline as sharepoint

app = func.FunctionApp()


@app.function_name(name="OnSharepointNewFile")
@app.connector_trigger(arg_name="files")
def on_sharepoint_new_file(files: list[sharepoint.Item]) -> None:
    logging.info(
        "Received %s new SharePoint file(s).",
        len(files),
    )
```

---

The `Item` binding supports the `GetOnNewFileItems` operation and preserves file properties in `dynamic_properties`. For complete code, infrastructure, and trigger registration for both modes, see [SharePoint Online triggers for Python](https://github.com/Azure-Samples/functions-connectors-python/tree/main/sharepointApp).

<a name="connector-without-a-strongly-typed-payload"></a>

### Generic connector payload

Use the `azure-functions` library to receive events as raw JSON strings when an operation doesn't have a supported typed converter, or when you want to parse the JSON yourself.

#### [Polling](#tab/polling)

This example receives one connector event per invocation, the default, as a raw JSON string.

```python
import logging

import azure.functions as func

app = func.FunctionApp()


@app.function_name(name="OnConnectorEvent")
@app.connector_trigger(
    arg_name="payload",
    delivery_mode=func.DeliveryMode.POLL,
    connection="ConnectorNamespace",
    trigger_config_name="%GenericTriggerConfigName%",
)
def on_connector_event(payload: str) -> None:
    logging.info("Received a connector event.")
```

#### [Webhook](#tab/webhook)

```python
import logging

import azure.functions as func

app = func.FunctionApp()


@app.function_name(name="OnConnectorEvent")
@app.connector_trigger(arg_name="payload")
def on_connector_event(payload: str) -> None:
    logging.info("Received a connector callback.")
```

---

For complete examples, see [Generic connector triggers for Python](https://github.com/Azure-Samples/functions-connectors-python/tree/main/genericApp).

For local polling, define the endpoint and trigger configuration names under `Values` in *local.settings.json*:

```json
{
  "IsEncrypted": false,
  "Values": {
    "ConnectorNamespace__pollingEndpoint": "https://<connector-namespace-host>",
    "OnNewEmailTriggerConfigName": "<outlook-polling-trigger-config-name>",
    "OnSharepointNewFileTriggerConfigName": "<sharepoint-polling-trigger-config-name>",
    "GenericTriggerConfigName": "<generic-polling-trigger-config-name>"
  }
}
```

The examples' `connection="ConnectorNamespace"` value identifies the settings prefix. Each `trigger_config_name` expression resolves to its corresponding app setting. For deployed settings and connection permissions, see [Polling authentication](#polling-authentication).

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

## Binding types

Both delivery modes support the following registration and payload shapes:

| Registration | Handler input |
| --- | --- |
| `app.connectorTrigger` from `@azure/functions` | Receives the original trigger input without helper normalization. The TypeScript input type defaults to `unknown`; for batched polling, use an array type such as `unknown[]`. |
| `connectorTrigger` from `@azure/functions-extensions-connectors` | Receives a `ConnectorTriggerContext<T>` with normalized `payload` and `items`, parsed `rawPayload`, and `toJSON()` serialization. The TypeScript item type defaults to `unknown`. |
| Named helpers such as `connectors.office365.onNewEmail` | Receive the normalized context with a named array, such as `emails`, `records`, or `messages`, that aliases `items`. TypeScript infers the supported SDK item type. |

Helpers accept object inputs or JSON strings. They normalize `{ body: item }` and `{ body: { value: [...] } }` envelopes. For batched polling, they flatten the outer array of envelopes and their payload items into one `items` array, preserving order. `rawPayload` retains the parsed input before normalization, including the outer event array.

Set `cardinality: 'many'` to enable invocation batching. An array in the context or a TypeScript array type alone doesn't enable batching. `maxBatchSize` counts connector events, not items in the normalized array. Each webhook invocation handles one callback, which can contain multiple payload items.

TypeScript types describe the expected payload but don't validate or transform operation-specific fields at runtime. Validate the payload before accessing properties when its shape isn't known. For supported typed registrations and SDK payload types, see the [Node.js connector extension reference](https://github.com/Azure/azure-functions-nodejs-extensions/tree/main/azure-functions-nodejs-extensions-connectors).

::: zone-end

::: zone pivot="programming-language-python"

## Binding types

The Connector trigger supports these Python parameter types:

| Type | Description |
| --- | --- |
| `str` | Receives the event body as a JSON string. |
| `dict` | Accepted as an annotation, but the raw converter doesn't parse JSON strings into dictionaries. To parse raw JSON, bind to `str` and use `json.loads`. |
| `bytes` | Receives the event body as raw bytes. |
| `typing.List[str]` or `typing.List[bytes]` | Receives separately delivered connector events as a list when polling uses `cardinality=func.Cardinality.MANY`. Import `List` from `typing` for these annotations. |
| Supported Connector SDK annotation | Uses a converter registered by `azurefunctions-extensions-connectors` to deserialize the payload into a list of operation-specific SDK models. |

For SDK bindings, annotate the parameter with the supported binding type or a list of that type, such as `list[office365.GraphClientReceiveMessage]`. The supported SDK bindings return lists for both single-event and batched invocations. For batched polling, the converter flattens the transport events and their payload items into one list.

Set `cardinality=func.Cardinality.MANY` on the decorator to enable invocation batching. A list annotation alone doesn't enable batching. The batch-size setting counts connector events, not items within an event's payload or the number of models in the returned list.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

<a name="connections"></a>

Connection access and callback authorization are separate. The Connector Namespace handles its own access to the managed connector connection automatically. Configure the function app's access according to its delivery mode.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

<a name="polling-trigger"></a>

## Polling mode

::: zone-end

::: zone pivot="programming-language-csharp"

<a name="polling-attribute-properties"></a>

### Attributes

The `ConnectorTrigger` attribute supports the following properties when `DeliveryMode` is set to `ConnectorTriggerDeliveryMode.Poll`:

| Property | Required | Default | Description |
| --- | --- | --- | --- |
| `DeliveryMode` | Yes, for polling | `ConnectorTriggerDeliveryMode.Webhook` | Set to `ConnectorTriggerDeliveryMode.Poll` to use polling. |
| `Connection` | Yes | `null` | Identifies the configuration prefix for the Connector Namespace polling endpoint and identity settings. For example, `"ConnectorNamespace"` selects `ConnectorNamespace__pollingEndpoint`. |
| `TriggerConfigName` | Yes | `null` | The name of the polling trigger configuration in the Connector Namespace. Supply the name directly or use an app setting expression such as `"%OnNewEmailTriggerConfigName%"`. |
| `IsBatched` | No | `false` | Whether each invocation receives a batch of connector events. When `false`, each invocation receives one event. Set to `true` and use an array parameter to receive batches. Batches are processed one at a time per listener. |
| `MaxBatchSize` | No | `1` | Maximum connector events per invocation, from 1 through 32. When omitted or set to `0`, uses the host's `defaultMaxBatchSize` setting, which defaults to `1` unless configured otherwise in *host.json*. The effective batch size must be `1` when `IsBatched` is `false`. |
| `MaxConcurrentCalls` | No | `16` | Maximum concurrent single-event processing tasks per listener on one instance, including preparation, invocation, and acknowledgement. Must be non-negative. When omitted or set to `0`, uses the host's `defaultMaxConcurrentCalls` setting, which defaults to `16` unless configured otherwise in *host.json*. Applies only when `IsBatched` is `false`. Batched invocations process one batch at a time per listener. |
| `TargetPendingEventThreshold` | No | `16` | Desired number of pending connector events per instance for target-based scaling. Must be non-negative. When omitted or set to `0`, uses the host's `defaultTargetPendingEventThreshold` setting, which defaults to `16` unless configured otherwise in *host.json*. The runtime can override this scaling target. This property doesn't change batch size or invocation concurrency. |

For app-wide defaults, see [Polling host.json settings](functions-bindings-connector.md?pivots=programming-language-csharp#polling-hostjson-settings). Batch size counts connector events, not items within an event's payload.

::: zone-end

::: zone pivot="programming-language-python"

### Polling decorators

Set `delivery_mode=func.DeliveryMode.POLL` on `@app.connector_trigger` and configure the polling connection and trigger configuration:

| Parameter | Required | Default | Description |
| --- | --- | --- | --- |
| `arg_name` | Yes | None | Identifies the function parameter that receives the payload. |
| `delivery_mode` | Yes, for polling | `func.DeliveryMode.WEBHOOK` | Set to `func.DeliveryMode.POLL` to use polling. The strings `"Poll"` and `"Webhook"` are also supported. |
| `connection` | Yes | None | Identifies the settings prefix for the polling endpoint and identity settings. For example, `"ConnectorNamespace"` selects `ConnectorNamespace__pollingEndpoint`. |
| `trigger_config_name` | Yes | None | Identifies the polling trigger configuration. Supply the name directly or use an app setting expression such as `"%OnNewEmailTriggerConfigName%"`. |
| `cardinality` | No | `func.Cardinality.ONE` | Set to `func.Cardinality.MANY` or `"many"` to enable invocation batching. Batched invocations are processed one at a time per listener. |
| `max_batch_size` | No | Host default: `1` | Maximum connector events per invocation, from 1 through 32. When omitted or set to `0`, uses `defaultMaxBatchSize` from *host.json*. Without batching, the effective batch size must be `1`. |
| `max_concurrent_calls` | No | Host default: `16` | Maximum concurrent single-event processing tasks per listener on one instance. When omitted or set to `0`, uses `defaultMaxConcurrentCalls` from *host.json*. Must be non-negative. Doesn't apply to batched invocations. |
| `target_pending_event_threshold` | No | Host default: `16` | Target pending events per instance for target-based scaling. When omitted or set to `0`, uses `defaultTargetPendingEventThreshold` from *host.json*. Must be non-negative. Doesn't change batch size or invocation concurrency; the runtime can override the scaling target. |

For app-wide defaults, see [Polling host.json settings](functions-bindings-connector.md?pivots=programming-language-python#polling-hostjson-settings). For parameter shapes and SDK annotations, see [Binding types](#binding-types).

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

### Polling registration options

Set `deliveryMode: 'Poll'` on a named helper, the generic `connectorTrigger` helper, or `app.connectorTrigger`, and configure the polling connection and trigger configuration:

| Option | Required | Default | Description |
| --- | --- | --- | --- |
| `deliveryMode` | Yes, for polling | `'Webhook'` | Set to `'Poll'` to use polling. |
| `connection` | Yes | None | Identifies the settings prefix for the polling endpoint and identity settings. For example, `'ConnectorNamespace'` selects `ConnectorNamespace__pollingEndpoint`. |
| `triggerConfigName` | Yes | None | Identifies the polling trigger configuration. Supply the name directly or use an app setting expression such as `'%OnNewEmailTriggerConfigName%'`. |
| `cardinality` | No | `'one'` | Set to `'many'` to enable invocation batching. Batched invocations are processed one at a time per listener. |
| `maxBatchSize` | No | Host default: `1` | Maximum connector events per invocation, from 1 through 32. When omitted or set to `0`, uses `defaultMaxBatchSize` from *host.json*. Without batching, the effective batch size must be `1`. |
| `maxConcurrentCalls` | No | Host default: `16` | Maximum concurrent single-event processing tasks per listener on one instance. When omitted or set to `0`, uses `defaultMaxConcurrentCalls` from *host.json*. Must be non-negative. Doesn't apply to batched invocations. |
| `targetPendingEventThreshold` | No | Host default: `16` | Target pending events per instance for target-based scaling. When omitted or set to `0`, uses `defaultTargetPendingEventThreshold` from *host.json*. Must be non-negative. Doesn't change batch size or invocation concurrency; the runtime can override the scaling target. |

For app-wide defaults, see [Polling host.json settings](functions-bindings-connector.md#polling-hostjson-settings). For handler input shapes, see [Binding types](#binding-types).

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

### Polling endpoint

The function's connection setting selects the prefix for the polling endpoint. For example, the prefix `"ConnectorNamespace"` uses `ConnectorNamespace__pollingEndpoint`. Define this setting under `Values` in *local.settings.json* for local development or in app settings for a deployed function app, as shown in the [polling examples](#examples).

Retrieve the polling endpoint from the [Connector Namespace portal](https://connectors.azure.com/), or derive it from the trigger configuration's service-generated `pollingEndpoints.receiveUri` as follows. Replace the placeholders with your resource values.

#### [Bash](#tab/receive-uri-bash)

Requires Azure CLI, `jq`, and `sed`.

```bash
triggerConfigId="/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Web/connectorGateways/<namespace-name>/triggerConfigs/<trigger-config-name>"
triggerConfig=$(az rest --method get \
    --url "${triggerConfigId}?api-version=2026-05-01-preview" \
    --query '{receiveUri:properties.pollingEndpoints.receiveUri,name:name}' \
    --output json)
receiveUri=$(printf '%s' "$triggerConfig" | jq -r '.receiveUri')
pollingEndpoint=$(printf '%s' "$receiveUri" |
    sed -E 's#/(api/)?trigger[Cc]onfigs/[^/]+/receive$##')
triggerConfigName=$(printf '%s' "$triggerConfig" | jq -r '.name')
printf '%s\n' "ConnectorNamespace__pollingEndpoint=$pollingEndpoint" \
    "OnNewEmailTriggerConfigName=$triggerConfigName"
```

#### [PowerShell](#tab/receive-uri-powershell)

Requires Azure CLI.

```powershell
$triggerConfigId = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Web/connectorGateways/<namespace-name>/triggerConfigs/<trigger-config-name>"
$triggerConfig = az rest --method get `
    --url "${triggerConfigId}?api-version=2026-05-01-preview" `
    --query '{receiveUri:properties.pollingEndpoints.receiveUri,name:name}' `
    --output json | ConvertFrom-Json
$pollingEndpoint = $triggerConfig.receiveUri -replace `
    '(?i)/(?:api/)?triggerconfigs/[^/]+/receive$', ''
$triggerConfigName = $triggerConfig.name
"ConnectorNamespace__pollingEndpoint=$pollingEndpoint"
"OnNewEmailTriggerConfigName=$triggerConfigName"
```

---

Derive the setting from the service-generated Receive URI as follows:

| Service `pollingEndpoints.receiveUri` | `<Connection>__pollingEndpoint` |
| --- | --- |
| `https://<connector-namespace-host>/api/triggerconfigs/<name>/receive` | `https://<connector-namespace-host>` |
| `https://<host>/api/connectorGateways/<id>/triggerconfigs/<name>/receive` | `https://<host>/api/connectorGateways/<id>` |

Preserve the service-provided host and gateway identifier; don't guess a hostname or configure the full Receive URL, an operation path, a standalone `/api` base, or a query string.

The extension uses this endpoint with the trigger configuration name to construct polling operation URLs. For the credentials and access policies needed to call these URLs, see [Polling authentication](#polling-authentication).

### Polling trigger configuration

The function's trigger configuration name identifies the configuration to receive events from.

#### Polling trigger configuration values

| Configuration value | Description |
| --- | --- |
| Connection | The authorized managed connector connection, such as Office 365 Outlook or SharePoint Online. This is separate from the function's connection setting, which identifies an app-settings prefix. |
| Operation name | The connector trigger operation, such as `OnNewEmailV3` or `GetOnNewFileItems`. |
| Parameters | Values required by the operation, such as an Outlook folder or a SharePoint site and document library. |
| Trigger configuration name | The name of this polling trigger configuration, referenced by the function directly or through an app setting. |
| Delivery mode | How events are delivered from services, through polling or webhook mode. |

#### Create a polling trigger configuration

1. If you don't already have a connector namespace, [create a connector namespace](../connector-namespace/create-connector-namespace.md).

1. Go to the [Connector Namespace portal](https://connectors.azure.com/), and then select your namespace.

1. In the namespace menu, select **Triggers**, and then select **Create**.

1. Find the managed connector you want to use, and then select the event that should trigger the function.

1. On the trigger configuration page, create a connection or select an existing connection. Creating a connection requires a one-time authentication with the external service.

1. Provide the inputs required by the event. For example, the Office 365 Outlook new-email event requires the folder to monitor for new messages.

1. For **Destination type**, choose **Azure Functions**.

1. For delivery mode, choose **Polling**.

1. Review the configuration, and then select **Create**.

<a name="polling-resources-and-authentication"></a>

### Polling authentication

For polling, grant a connection-level access policy to the function app's managed identity (deployed) or your developer identity (local). The Functions host uses this identity's Microsoft Entra credentials to receive and acknowledge events through the polling endpoint. The Connector Namespace's own connection access is handled automatically.

The caller's policy grants access to the managed connector connection, **not** to the namespace itself. Signing in or enabling a managed identity doesn't grant the caller this access automatically.

Unlike webhook delivery, polling doesn't require a public callback URL or a function app system key because the function app retrieves events from the namespace rather than receiving callbacks.

The authentication settings in the following subsections use the prefix `ConnectorNamespace`, matching the [trigger examples](#examples). If your function uses a different connection-setting prefix, use that prefix instead.

#### Grant access policies

Use either method to grant the polling caller access to the connection. You need permission to manage access policies on the connection. Use the caller's principal (object) ID, not its application (client) ID.

##### [Portal](#tab/access-policy-portal)

1. Go to the [Connector Namespace portal](https://connectors.azure.com/), and then select your namespace.
1. Open **Connections**, and select the managed connector connection used by your polling trigger configuration.
1. Open the connection's **Access Policies** tab.
1. Add an access policy for the caller identity. For local development, use your developer account's object ID. For a deployed function app, use the principal (object) ID of the managed identity your app uses.
1. Verify that the caller has an access policy on the connection.

##### [Azure CLI](#tab/access-policy-cli)

Install the [`connector-namespace` Azure CLI extension](https://github.com/Azure/Connectors/tree/main/public-preview/connector-namespace-cli), and sign in with `az login`. Select the subscription that contains your namespace.

The following Bash example creates an access policy for the polling caller:

```azurecli
resourceGroup="<resource-group>"
namespaceName="<connector-namespace>"
connectionName="<managed-connector-connection>"
callerPrincipalId="<caller-principal-object-id>"

tenantId=$(az account show --query tenantId --output tsv)

az connector-namespace connection access-policy create \
    --resource-group "$resourceGroup" \
    --namespace "$namespaceName" \
    --connection-name "$connectionName" \
    --name "caller-access" \
    --principal type=ActiveDirectory \
        identity.object-id="$callerPrincipalId" \
        identity.tenant-id="$tenantId"

az connector-namespace connection access-policy list \
    --resource-group "$resourceGroup" \
    --namespace "$namespaceName" \
    --connection-name "$connectionName" \
    --output table
```

Set `callerPrincipalId` to the appropriate identity's object ID:

| Caller | Retrieve the object ID |
| --- | --- |
| Local developer | `az ad signed-in-user show --query id --output tsv` |
| Function app's system-assigned identity | `az functionapp identity show --resource-group <function-app-resource-group> --name <function-app-name> --query principalId --output tsv` |
| User-assigned managed identity | `az identity show --resource-group <identity-resource-group> --name <identity-name> --query principalId --output tsv` |

If you use both local development and a deployed app, create a policy for each caller identity, using a distinct policy name for each.

---

#### Local development

1. Sign in with your developer identity, such as by running `az login`. This is the Microsoft Entra account the extension uses to authenticate polling requests locally.
1. [Grant an access policy](#grant-access-policies) on the managed connector connection for that identity. Signing in alone doesn't grant access to the connection.
1. Define the connection settings under `Values` in *local.settings.json*. Omit `ConnectorNamespace__credential` to use developer credentials.

#### Deployed function app

1. Enable a system-assigned managed identity on the function app, or assign a user-assigned managed identity to it.
1. [Grant an access policy](#grant-access-policies) on the managed connector connection for that identity.
1. Configure the following authentication settings in the function app's app settings:

| App setting | Value |
| --- | --- |
| `ConnectorNamespace__credential` | `managedidentity` |
| `ConnectorNamespace__clientId` | The client ID of the user-assigned managed identity to use for polling. Set only when using a user-assigned identity. |

Alternatively, set `ConnectorNamespace__managedIdentityResourceId` to the user-assigned identity's resource ID instead of setting `ConnectorNamespace__clientId`. For a system-assigned identity, omit both selectors.

### Polling usage

The Functions host connects outbound to the Connector Namespace to poll for events and acknowledge successful invocations. The extension passes the events to your function; you don't write a polling loop.

Delivery is at least once. Failed invocations aren't acknowledged, and events can be redelivered after the service-managed lock expires. Make processing idempotent.

::: zone-end

::: zone pivot="programming-language-csharp"

If you use `ConnectorEvent<T>.MessageId` for deduplication, scope it to the namespace and trigger configuration; don't assume that message IDs are unique across triggers.

Set `DeliveryMode = ConnectorTriggerDeliveryMode.Poll` on `[ConnectorTrigger]`, and supply the `Connection` and `TriggerConfigName` properties. See [the polling examples](?tabs=polling&pivots=programming-language-csharp#examples).

For attribute properties, supported values, and defaults, see [Polling attribute properties](#polling-attribute-properties).

::: zone-end

::: zone pivot="programming-language-python"

Set `delivery_mode=func.DeliveryMode.POLL` on `@app.connector_trigger`, and supply `connection` and `trigger_config_name`. See [the polling examples](?tabs=polling&pivots=programming-language-python#examples).

The host receives one event per invocation unless `cardinality=func.Cardinality.MANY` enables batching. For raw batches, use `typing.List[str]` or `typing.List[bytes]`; supported SDK annotations supply a list of models. For options, supported values, and defaults, see [Polling decorators](#polling-decorators).

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

Set `deliveryMode: 'Poll'`, and supply `connection` and `triggerConfigName` in the registration options. See the [polling examples](?tabs=polling#examples).

The host receives one event per invocation unless `cardinality: 'many'` enables batching. Named and generic helpers combine the payload items from all events into one context. Direct `app.connectorTrigger` handlers instead receive the outer event array. For options, supported values, and defaults, see [Polling registration options](#polling-registration-options).

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

## Scaling and concurrency

### Webhook delivery

In webhook mode, the Connector Namespace sends HTTP requests to the extension's callback endpoint. Connector triggers scale like HTTP triggers, according to the hosting plan's HTTP scaling behavior and limits. For details, see [Event-driven scaling in Azure Functions](event-driven-scaling.md#understanding-scaling-behaviors).

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

### Polling delivery

In polling mode, the Connector Trigger uses target-based scaling based on the estimated event backlog for the trigger configuration in the Connector Namespace. The scaling target is independent of per-instance processing concurrency and batch size. For the scaling equation, configuration settings, and tuning guidance, see [Managed connectors target-based scaling](functions-target-based-scaling.md#managed-connectors).

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

<a name="webhook-trigger"></a>

## Webhook mode

::: zone-end

::: zone pivot="programming-language-typescript"

### Registration

Use the generic `connectorTrigger` function for an operation that doesn't have a connector-specific registration:

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectorTrigger,
    ConnectorTriggerContext,
} from '@azure/functions-extensions-connectors';

connectorTrigger('OnConnectorEvent', {
    handler: async (
        context: ConnectorTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        invocationContext.log(JSON.stringify(context.rawPayload));
    },
});
```

The generic registration defaults the item type to `unknown`. Validate the payload before accessing operation-specific properties. Configure the connector, operation, operation parameters, destination function, and callback authentication in the trigger configuration in Azure Connector Namespace.

::: zone-end

::: zone pivot="programming-language-javascript"

### Registration

Use the generic `connectorTrigger` function for an operation that doesn't have a connector-specific registration:

```javascript
const {
    connectorTrigger,
} = require('@azure/functions-extensions-connectors');

connectorTrigger('OnConnectorEvent', {
    handler: async (context, invocationContext) => {
        invocationContext.log(JSON.stringify(context.rawPayload));
    },
});
```

The generic registration normalizes the callback envelope but doesn't validate the operation-specific payload shape. Validate the payload before accessing operation-specific properties. Configure the connector, operation, operation parameters, destination function, and callback authentication in the trigger configuration in Azure Connector Namespace.

::: zone-end

::: zone pivot="programming-language-python"

### Decorators

Apply `connector_trigger` to the function that receives the event payload:

```python
import azure.functions as func

app = func.FunctionApp()


@app.function_name(name="OnConnectorEvent")
@app.connector_trigger(arg_name="payload")
def on_connector_event(payload: str) -> None:
    # Process the raw JSON payload.
    pass
```

The `arg_name` value identifies the function parameter that receives the payload. Configure the connector, operation, operation parameters, destination function, and callback authentication in the trigger configuration in Azure Connector Namespace.

::: zone-end

::: zone pivot="programming-language-csharp"

### Attributes

Unlike polling, webhook delivery doesn't require additional properties on the `[ConnectorTrigger]` attribute because webhook is the default delivery mode. You can also set `DeliveryMode = ConnectorTriggerDeliveryMode.Webhook` explicitly. Polling-specific properties don't apply to webhook delivery.

<a name="configure-the-trigger"></a>

### Webhook trigger configuration

The trigger configuration's callback URL identifies the destination function.

#### Webhook trigger configuration values

| Configuration value | Description |
| --- | --- |
| Connection | The authorized managed connector connection, such as Office 365 Outlook or SharePoint Online. |
| Operation name | The connector trigger operation, such as `OnNewEmailV3` or `GetOnNewFileItems`. |
| Parameters | Values required by the operation, such as an Outlook folder or a SharePoint site and document library. |
| Callback URL | The Connector extension webhook endpoint for the destination function. See [Webhook authentication](#webhook-authentication). |
| Function name | The registered function name in your app code. |
| Authentication | The authentication configuration used to call the function app. |

The `functionName` query-string value in the callback URL must match the registered function name. Valid webhook function names contain 1 to 128 letters, numbers, underscores, or hyphens.

#### Create a webhook trigger configuration

Create a trigger configuration by using Azure CLI or the Connector Namespace portal.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python"

### Configure the trigger

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python"

A trigger configuration in Azure Connector Namespace associates an external service event with the destination function callback.

#### Trigger configuration values

| Configuration value | Description |
| --- | --- |
| Connection | The authorized managed connector connection, such as Office 365 Outlook or SharePoint Online. |
| Operation name | The connector trigger operation, such as `OnNewEmailV3` or `GetOnNewFileItems`. |
| Parameters | Values required by the operation, such as an Outlook folder or a SharePoint site and document library. |
| Callback URL | The Connector extension webhook endpoint for the destination function. See [Webhook authentication](#webhook-authentication). |
| Function name | The registered function name in your app code. |
| Authentication | The authentication configuration used to call the function app. |

The `functionName` query-string value in the trigger configuration's callback URL must match the registered function name. Valid function names contain 1 to 128 letters, numbers, underscores, or hyphens.

The operation name is defined by the managed connector. You choose the function name in your code, and the trigger configuration maps the operation to that function. The examples in this article use these mappings:

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

| Connector event | Operation name | Function name |
| --- | --- | --- |
| New Office 365 Outlook email | `OnNewEmailV3` | `OnNewEmail` |
| New SharePoint Online file | `GetOnNewFileItems` | `OnSharepointNewFile` |
| New Microsoft Teams channel message | `OnNewChannelMessage` | `OnNewChannelMessage` |
| Selected connector event | The operation selected in the trigger configuration | `OnConnectorEvent` |

::: zone-end

::: zone pivot="programming-language-python"

| Connector event | Operation name | Function name |
| --- | --- | --- |
| New Office 365 Outlook email | `OnNewEmailV3` | `OnNewEmail` |
| New SharePoint Online file | `GetOnNewFileItems` | `OnSharepointNewFile` |
| Selected connector event | The operation selected in the trigger configuration | `OnConnectorEvent` |

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python"

#### Create a trigger configuration

Create a trigger configuration by using Azure CLI or the Connector Namespace portal.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

Before the extension can receive an event, create these resources and configurations:

1. A Connector Namespace.
1. A managed connector connection authorized to access the external service.
1. A trigger configuration that selects the connector event, operation parameters, and delivery mode.

For webhook delivery, the trigger configuration also includes the [callback URL](#webhook-callback-url) and [callback authentication](#webhook-authentication).

Trigger configurations are Connector Namespace resources that you can also deploy through ARM or Bicep.

The Azure CLI examples below use a deployed function app. Deploy the app with the extension and the destination function before you run them.

##### [Azure CLI (Bash)](#tab/azure-cli-bash)

The following Bash example uses Azure CLI and `jq` to create an Office 365 Outlook new-email trigger. Replace the placeholder values for your resources and connection:

```bash
resourceGroup="<RESOURCE_GROUP>"
namespaceName="<CONNECTOR_NAMESPACE>"
functionAppName="<FUNCTION_APP>"
functionName="OnNewEmail"
triggerName="<TRIGGER_NAME>"
connectionName="<CONNECTION_NAME>"
connectorName="office365"
operationName="OnNewEmailV3"
subscriptionId=$(az account show --query id --output tsv)

connectorKey=$(az functionapp keys list \
    --resource-group "$resourceGroup" \
    --name "$functionAppName" \
    --query "systemKeys.connector_extension" \
    --output tsv)

callbackUrl="https://${functionAppName}.azurewebsites.net/runtime/webhooks/connector?functionName=${functionName}"

notificationFile=$(mktemp)
trap 'rm -f "$notificationFile"' EXIT

jq -n \
    --arg callbackUrl "$callbackUrl" \
    --arg connectorKey "$connectorKey" \
    '{
        callbackUrl: $callbackUrl,
        authentication: {
            type: "QueryString",
            name: "code",
            value: $connectorKey
        }
    }' > "$notificationFile"

az connector-namespace trigger create \
    --resource-group "$resourceGroup" \
    --namespace "$namespaceName" \
    --name "$triggerName" \
    --connection-details "{connectionName:${connectionName},connectorName:${connectorName}}" \
    --operation-name "$operationName" \
    --parameters "[{name:folderPath,value:'Inbox'}]" \
    --notification-details "@$notificationFile" \
    --description "${connectorName} ${operationName} -> ${functionName}" \
    --metadata "{destinationType:functionApp,functionAppName:${functionAppName},functionAppResourceGroup:${resourceGroup},functionAppSubscriptionId:${subscriptionId},functionName:${functionName},recurrenceFrequency:Minute,recurrenceInterval:'5'}"

rm -f "$notificationFile"
trap - EXIT
```

The `--parameters` value is specific to the connector operation. In this example, `folderPath` selects the Outlook folder to monitor. The callback URL doesn't contain the system key. The `notificationDetails.authentication` object adds the key as a query-string secret when Connector Namespace invokes the function.

##### [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

The following PowerShell example uses Azure CLI to create an Office 365 Outlook new-email trigger. Replace the placeholder values for your resources and connection:

```powershell
$resourceGroup = "<RESOURCE_GROUP>"
$namespaceName = "<CONNECTOR_NAMESPACE>"
$functionAppName = "<FUNCTION_APP>"
$functionName = "OnNewEmail"
$triggerName = "<TRIGGER_NAME>"
$connectionName = "<CONNECTION_NAME>"
$connectorName = "office365"
$operationName = "OnNewEmailV3"
$subscriptionId = az account show --query id --output tsv

$connectorKey = az functionapp keys list `
    --resource-group $resourceGroup `
    --name $functionAppName `
    --query "systemKeys.connector_extension" `
    --output tsv

$callbackUrl = "https://$functionAppName.azurewebsites.net/runtime/webhooks/connector?functionName=$functionName"

$notificationDetails = @{
    callbackUrl = $callbackUrl
    authentication = @{
        type  = "QueryString"
        name  = "code"
        value = $connectorKey
    }
} | ConvertTo-Json -Depth 3 -Compress

$notificationFile = Join-Path $env:TEMP "notification-details.json"
$notificationDetails | Set-Content -Path $notificationFile -NoNewline

az connector-namespace trigger create `
    --resource-group $resourceGroup `
    --namespace $namespaceName `
    --name $triggerName `
    --connection-details "{connectionName:$connectionName,connectorName:$connectorName}" `
    --operation-name $operationName `
    --parameters "[{name:folderPath,value:'Inbox'}]" `
    --notification-details "@$notificationFile" `
    --description "$connectorName $operationName -> $functionName" `
    --metadata "{destinationType:functionApp,functionAppName:$functionAppName,functionAppResourceGroup:$resourceGroup,functionAppSubscriptionId:$subscriptionId,functionName:$functionName,recurrenceFrequency:Minute,recurrenceInterval:'5'}"

Remove-Item $notificationFile -ErrorAction SilentlyContinue
```

The `--parameters` value is specific to the connector operation. In this example, `folderPath` selects the Outlook folder to monitor. The callback URL doesn't contain the system key. The `notificationDetails.authentication` object adds the key as a query-string secret when Connector Namespace invokes the function.

##### [Portal](#tab/portal)

1. If you don't already have a connector namespace, [create a connector namespace](../connector-namespace/create-connector-namespace.md).

1. Go to the [Connector Namespace portal](https://connectors.azure.com/), and then select your namespace.

1. In the namespace menu, select **Triggers**, and then select **Create**.

1. Find the managed connector you want to use, and then select the event that should trigger the function.

1. On the trigger configuration page, create a connection or select an existing connection. Creating a connection requires a one-time authentication with the external service.

1. Provide the inputs required by the event. For example, the Office 365 Outlook new-email event requires the folder to monitor for new messages.

1. For delivery mode, select **Webhook**.

1. For **Destination type**, select **Azure Functions**. Select the function app that contains your Connector trigger code, and then select the specific destination function.

1. Review the configuration, and then select **Create**.

---

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

<a name="webhook-resources-and-authentication"></a>

### Webhook authentication

The Connector Namespace sends events to the function app, rather than the function app polling the namespace. By default, the Functions host authenticates these callbacks by validating the Connector extension's system key, named `connector_extension`.

The Connector Namespace handles access to its managed connector connection automatically. Unlike polling, the function app's identity doesn't need a connection access policy solely to receive webhook callbacks; the system key authorizes those requests to the function app.

#### Webhook callback URL

##### Deployed app

Use the extension's callback endpoint, without a key in the URL:

```text
https://<FUNCTION_APP_HOSTNAME>/runtime/webhooks/connector?functionName=<FUNCTION_NAME>
```

The `functionName` value must match the registered function name: the `[Function]` attribute in C#, the `@app.function_name` decorator in Python, or the trigger registration in Node.js.

<a name="system-key-authentication"></a>

For a deployed app using default authentication, use the Connector extension's `connector_extension` system key, not an individual function key. After deploying the function app with the extension, retrieve the system key:

```azurecli
az functionapp keys list \
    --resource-group <RESOURCE_GROUP> \
    --name <FUNCTION_APP_NAME> \
    --query "systemKeys.connector_extension" \
    --output tsv
```

In the trigger configuration, store the key in `notificationDetails.authentication`, separately from the callback URL:

```json
{
  "notificationDetails": {
    "callbackUrl": "https://<FUNCTION_APP_HOSTNAME>/runtime/webhooks/connector?functionName=<FUNCTION_NAME>",
    "authentication": {
      "type": "QueryString",
      "name": "code",
      "value": "<CONNECTOR_EXTENSION_KEY>"
    }
  }
}
```

When delivering an event, the Connector Namespace adds the key as the `code` query-string parameter. Keeping the key separate from the saved callback URL lets the portal mask it as a secret. Don't include the key in the saved callback URL or commit it to source control.

Existing trigger configurations that include the key in the callback URL continue to work. When you edit and save an existing trigger configuration, the key moves to `notificationDetails.authentication`.

System keys can't be scoped per trigger and require coordinated rotation between the function app and Connector Namespace. For identity-based callbacks without a shared key, see [Built-in authentication](#built-in-authentication).

<a name="local-webhook-development"></a>

##### Local webhook development

Webhook callbacks must reach your running Functions host from the Connector Namespace. When you run locally:

1. Start the function app with [Azure Functions Core Tools](functions-run-local.md), enabling authorization:

   ```bash
   func start --enableAuth
   ```

   > [!IMPORTANT]
   > Always use `--enableAuth` when exposing your app via a dev tunnel. Without it, your function endpoint is completely unauthenticated on the public internet.

1. Use a [Microsoft dev tunnel](/azure/developer/dev-tunnels/overview) to forward a public HTTPS endpoint to the local Functions host port. Set the tunnel port visibility to **Public** so the Connector Namespace can reach it.
1. Build the callback URL with the tunnel hostname and the registered function name, and use it in the webhook trigger configuration. For example, a tunnel forwarding port 7071 to the `OnNewFile` function uses a URL like:

   ```text
   https://<tunnel-id>-7071.<region>.devtunnels.ms/runtime/webhooks/connector?functionName=OnNewFile
   ```

   Replace `<tunnel-id>` and `<region>` with the values from your tunnel's public URL.

   For a local host that stores secrets in Azurite, retrieve its `connector_extension` system key by using these PowerShell commands. Set `$connStr` to the [well-known Azurite connection string](../storage/common/storage-use-emulator.md#authorize-with-shared-key-credentials):

   ```powershell
   $connStr = "<azurite-connection-string>"

   # Find the most recent host.json blob
   $blobs = az storage blob list --container-name azure-webjobs-secrets --connection-string $connStr -o json | ConvertFrom-Json
   $blobName = ($blobs | Where-Object { $_.name -match '(^|/)host\.json$' } | Sort-Object { $_.properties.lastModified } | Select-Object -Last 1).name

   # Download and parse
   az storage blob download --container-name azure-webjobs-secrets --name $blobName --connection-string $connStr --file host-keys.json --no-progress
   $keys = Get-Content host-keys.json | ConvertFrom-Json
   $connectorKey = ($keys.systemKeys | Where-Object { $_.name -eq "connector_extension" }).value
   Remove-Item -LiteralPath host-keys.json
   ```

   Store the local host's `connector_extension` system key separately in `notificationDetails.authentication`, using the `QueryString` authentication format shown above.

1. Keep the host and tunnel running while testing. Update the trigger configuration if the tunnel hostname changes.

<a name="built-in-authentication"></a>

### Built-in authentication

For webhook callbacks without shared keys, use [App Service built-in authentication](../app-service/overview-authentication-authorization.md) (also called Easy Auth) with a managed identity. This configuration is independent of the function's programming language.

The Connector Namespace uses its system-assigned or [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) to request a Microsoft Entra ID token for each callback. Built-in authentication validates the token and the caller's identity before the request reaches the Functions host. For an end-to-end implementation without client secrets, see the [built-in authentication sample](https://github.com/Azure-Samples/functions-connectors-net-builtinauth).

This section covers authentication from the namespace to the function app. The Connector Namespace handles access to its managed connector connection automatically. For authentication to upstream services, see [Azure connectors overview](/connectors/overview).

#### Function app configuration

> [!IMPORTANT]
> This configuration requires authentication across the entire function app, not just `/runtime/webhooks/connector`, and restricts access to the namespace's callback identity. Existing HTTP functions that require function keys continue to require those keys in addition to app-level authentication. Before applying this configuration to an existing app, ensure that API clients and health probes can satisfy the app-level authentication and authorization policy and any function-level key requirements. Otherwise, requests can fail with HTTP 401 or 403. If the app must accept other callers, adapt the authorization policy instead of copying this allowlist unchanged. For policy options, see [Configure Microsoft Entra authorization](../app-service/configure-authentication-provider-aad.md#authorize-requests).

Configure built-in authentication through the function app's [`authsettingsV2` ARM resource](/azure/templates/microsoft.web/sites/config-authsettingsv2) or its equivalent in Bicep. The sample uses the following key settings:

| Setting | Purpose |
| --- | --- |
| `platform.enabled: true` | Enables built-in authentication. |
| `globalValidation.requireAuthentication: true` | Requires authentication before requests reach the Functions host. |
| `globalValidation.unauthenticatedClientAction: Return401` | Returns HTTP 401 for unauthenticated callbacks instead of redirecting to a sign-in page. |
| `identityProviders.azureActiveDirectory.enabled: true` | Enables [Microsoft Entra token validation](../app-service/configure-authentication-provider-aad.md). |
| `registration.clientId` | The application (client) ID of the Microsoft Entra app registration that represents the function app. |
| `registration.openIdIssuer` | The issuer URL for your tenant: `https://login.microsoftonline.com/{tenantId}/v2.0`. |
| `validation.allowedAudiences` | The Entra app's client ID and identifier URI. Tokens must carry an allowed audience in the `aud` claim. |
| `validation.defaultAuthorizationPolicy.allowedPrincipals.identities` | The object (principal) IDs allowed to call the function app. The sample allows only the namespace's callback managed identity. Adapt this policy if your app has other callers. A valid token with an `oid` claim not in the allowlist is denied with HTTP 403. |

The `registration` and `validation` settings in this table are under `identityProviders.azureActiveDirectory`.

The sample also assigns a user-assigned managed identity to the function app and [federates it to the Entra app registration](/entra/workload-id/workload-identity-federation). Built-in authentication uses this [federated identity credential](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity) to obtain client assertions without storing a client secret. The sample sets the app setting `OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID` to the function app identity's client ID and sets `registration.clientSecretSettingName` to that setting's name.

The function app identity used for federation is separate from the namespace's callback identity. The namespace's identity is the caller allowed by `allowedPrincipals.identities`.

After built-in authentication is configured to validate callbacks, disable the redundant system-key check in *host.json*:

```json
{
  "version": "2.0",
  "extensions": {
    "connector": {
      "system": {
        "webhookAuthorizationLevel": "Anonymous"
      }
    }
  }
}
```

Only use `Anonymous` when another authentication layer validates requests before they reach the Functions host. This setting doesn't enable token validation by itself.

#### Connector Namespace configuration

Enable a system-assigned managed identity on the Connector Namespace, or attach a user-assigned identity to it. In the trigger configuration's `notificationDetails.authentication`, set:

| Property | Value |
| --- | --- |
| `type` | `ManagedServiceIdentity` |
| `audience` | The Entra app registration's client ID, matching an audience accepted by the function app. |
| `identity` | The resource ID of the attached user-assigned managed identity. Omit this property for a system-assigned identity. |

The namespace uses that identity to obtain a token and sends it in the callback's `Authorization: Bearer <token>` header. The token's `iss` identifies the tenant, `aud` identifies the target app, and `oid` identifies the namespace's managed identity.

The namespace handles its own access to the managed connector connection automatically. This access is separate from callback authorization, which you configure through built-in authentication on the function app.

#### Authentication flow and validation

1. The Connector Namespace obtains a token for the configured audience by using its callback managed identity.
1. The namespace sends the token with the event to the extension's webhook endpoint.
1. Built-in authentication validates the token's signature, expiration, issuer, and audience, and checks that its `oid` matches an allowed identity. Missing or invalid tokens receive HTTP 401; valid tokens from an identity not in the allowlist receive HTTP 403.
1. Only authorized requests reach the Functions host. With the redundant system-key check disabled, the extension invokes the destination function and binds the event body to its parameter.

Your function doesn't need application code to perform these access checks.

#### Related authentication documentation

- [Authentication and authorization in Azure App Service and Azure Functions](../app-service/overview-authentication-authorization.md)
- [Configure your App Service or Azure Functions app to use Microsoft Entra sign-in](../app-service/configure-authentication-provider-aad.md)
- [File-based configuration in App Service authentication](../app-service/configure-authentication-file-based.md)
- [Workload identity federation in Microsoft Entra ID](/entra/workload-id/workload-identity-federation)
- [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)

::: zone-end

::: zone pivot="programming-language-csharp"

### Webhook usage

The Connector Namespace sends events to the extension's webhook endpoint, where the `functionName` query-string value selects the function. The extension binds the event body to your function parameter; you don't implement an HTTP handler.

The function name must match the name in your `[Function]` attribute. Callbacks can include `x-ms-*` headers that identify the trigger configuration, connection, event type, and correlation ID, but these headers aren't available to your function through the Connector Trigger.

Use `[ConnectorTrigger]` without polling properties. Webhook is the default when you omit `DeliveryMode`. See the [webhook examples](?tabs=webhook&pivots=programming-language-csharp#examples).

Your function can receive the event payload using any of the supported [.NET binding types](#binding-types).

The extension accepts HTTP `POST` and `PUT` requests with the `application/json` content type. A nonempty request body must contain valid JSON. Requests are subject to the Functions host request-body limit and upstream service limits; the extension doesn't impose a separate payload-size cap.

To configure the host request-body limit, set the app-wide [`FUNCTIONS_REQUEST_BODY_SIZE_LIMIT`](functions-app-settings.md#functions_request_body_size_limit) app setting in bytes and restart the host. This isn't a `host.json` setting and doesn't change Poll linked-output downloads, which use `extensions.connector.maxLinkedOutputSizeInBytes`. Larger limits don't guarantee supported payload sizes; account for buffering, worker memory, and upstream limits.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

### Webhook usage

The generic helper receives a `ConnectorTriggerContext<T>`. Its `payload` property contains the normalized callback envelope, `items` contains the event items, and `rawPayload` preserves the parsed input before normalization. Connector-specific registrations provide named arrays, such as `emails`, `records`, or `messages`.

Each invocation handles one callback, which can contain multiple payload items. For an operation without a connector-specific registration, the TypeScript item type defaults to `unknown`. Validate the payload before you access operation-specific properties. For supported typed registrations, see the [Node.js connector extension reference](https://github.com/Azure/azure-functions-nodejs-extensions/tree/main/azure-functions-nodejs-extensions-connectors).

::: zone-end

::: zone pivot="programming-language-python"

### Webhook usage

The trigger can bind the request body to `str`, `dict`, or `bytes`. When `azurefunctions-extensions-connectors` registers a converter for the function's SDK annotation, the worker instead deserializes the request body into the supported operation-specific type.

Each invocation handles one callback. Supported SDK bindings supply its payload items as a list; use an annotation such as `list[office365.GraphClientReceiveMessage]`. For the supported operation-specific annotations, see the [operation signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md).

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python"

The extension accepts HTTP `POST` and `PUT` requests with the `application/json` content type. A nonempty request body must contain valid JSON. Requests are subject to the Functions host request-body limit and upstream service limits.

### Metadata

The Connector trigger currently doesn't expose callback headers or other request metadata as binding data. The extension defines an [empty binding data contract](https://github.com/Azure/azure-functions-connector-extension/blob/main/src/Microsoft.Azure.Functions.Extensions.Connector/ConnectorTriggerBinding.cs), so the function receives only the JSON request body in a binding type supported by the selected language.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

## Next steps

- [Connector extension overview](functions-bindings-connector.md)
- [Use managed connectors in Azure Functions](functions-connectors-overview.md)
- [Azure Functions Connectors Samples](https://github.com/Azure-Samples/functions-connectors)
- [What is Azure Connector Namespace?](../connector-namespace/connector-namespace-overview.md)
- [Connectors reference](/connectors/connector-reference/)

::: zone-end
