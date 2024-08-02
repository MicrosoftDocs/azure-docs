---
title: How to configure event handler
description: Guidance about event handler concepts and integration introduction when develop with Azure Web PubSub service.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 08/01/2024
---

# Configure event handler in Azure Web PubSub service

The event handler handles the incoming client events. Event handlers are registered and configured in the service through the Azure portal or Azure CLI. When a client event is triggered, the service can send the event to the appropriate event handler. The Web PubSub service now supports the event handler as the server-side, which exposes the publicly accessible endpoint for the service to invoke when the event is triggered. In other words, it acts as a **webhook**.

The Web PubSub service delivers client events to the configured upstream webhook using the [CloudEvents HTTP protocol](https://github.com/cloudevents/spec/blob/v1.0.1/http-protocol-binding.md), with [CloudEvents extension for Azure Web PubSub event handler](reference-cloud-events.md).

:::image type="content" source="media/howto-develop-eventhandler/event-trigger.png" alt-text="Screenshot of Web PubSub service event trigger.":::

## Event handler settings

A client always connects to a hub, and you could configure multiple event handler settings for the hub. The order of the event handler settings matters and the former one has the higher priority. When a client connects and an event is triggered, Web PubSub goes through the configured event handlers in the priority order and the first matching one wins. When configuring the event handler, the below properties should be set.

|Property name | Description |
|--|--|
| Url template | Defines the template Web PubSub uses to evaluate your upstream webhook URL. |
| User events | Defines the user events that current event handler setting cares about. |
| System events | Defines the system events that current event handler setting cares about. |
| Authentication | Defines the authentication method between the Web PubSub service and your upstream server. |

### Events

The events include user events and system events. System events are predefined events that are triggered during the lifetime of a client, and user events are the events triggered when the client sends data, the user event name can be customized using client protocols, [here contains the detailed explanation](concept-service-internals.md#client-protocol).

Event type | Supported values |
|--|--|
System events | `connect`, `connected` and `disconnected` |
User events | `message`, or custom event name following client protocols |

### URL template

URL template supports several parameters that can be evaluated during runtime. With this feature, it is easy to route different hubs or events into different upstream servers with a single setting. KeyVault reference syntax is also support so that data could be stored in Azure Key Vault securely.

Note URL domain name should not contain parameter syntax, for example, `http://{hub}.com` is not a valid URL template.

| Supported parameters | Syntax | Description | Samples |
|--|--|--|--|
| Hub parameter | `{hub}` | The value is the hub that the client connects to. | When a client connects to `client/hubs/chat`, a URL template `http://host.com/api/{hub}` evaluates to `http://host.com/api/chat` because for this client, hub is `chat`. |
| Event parameter | `{event}` | The value of the triggered event. `event` values are listed [here](#events).The event value for abuse protection requests is `validate` as explained [here](#upstream-and-validation). | If there is a URL template `http://host.com/api/{hub}/{event}` configured for event `connect`, When a client connects to `client/hubs/chat`, Web PubSub initiates a POST request to the evaluated URL `http://host.com/api/chat/connect` when the client is connecting, since for this client event, hub is `chat` and the event triggering this event handler setting is `connect`.  |
| KeyVault reference parameter | `{@Microsoft.KeyVault(SecretUri=<secretUri>)}` | The **SecretUri** should be the full data-plane URI of a secret in the vault, optionally including a version, e.g., `https://myvault.vault.azure.net/secrets/mysecret/` or `https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931`. When using KeyVault reference, you also need to configure the authentication between your Web PubSub service and your KeyVault service, check [here](howto-use-managed-identity.md#use-a-managed-identity-for-key-vault-reference) for detailed steps. | `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)` |

### Authentication between service and webhook

You can use any of these methods to authenticate between the service and webhook.

- Anonymous mode
- Simple authentication with `?code=<code>` is provided through the configured Webhook URL as query parameter.
- Microsoft Entra authorization. For more information, see [Use a managed identity in client events](howto-use-managed-identity.md#use-a-managed-identity-in-client-events-scenarios).

## Upstream and Validation

When setting up the event handler webhook through Azure portal or CLI, the service follows the [CloudEvents Abuse Protection](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection) to validate the upstream webhook. Every registered upstream webhook URL is validated by this mechanism. The `WebHook-Request-Origin` request header is set to the service domain name `xxx.webpubsub.azure.com`, and it expects the response to have a header `WebHook-Allowed-Origin` to contain this domain name or `*`.

When doing the validation, the `{event}` parameter is resolved to `validate`. For example, when trying to set the URL to `http://host.com/api/{event}`, the service tries to **OPTIONS** a request to `http://host.com/api/validate`. And only when the response is valid, the configuration can be set successfully.

For now, we don't support [WebHook-Request-Rate](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#414-webhook-request-rate) and [WebHook-Request-Callback](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#413-webhook-request-callback).


## Configure event handler

### Configure through Azure portal

You can add an event handler to a new hub or edit an existing hub.

To configure an event handler in a new hub:

1. Go to your Azure Web PubSub service page in the **Azure portal**.
1. Select **Settings** from the menu.
1. Select **Add** to create a hub and configure your server-side webhook URL. Note: To add an event handler to an existing hub, select the hub and select **Edit**.

   :::image type="content" source="media/quickstart-serverless/set-event-handler.png" alt-text="Screenshot of setting the event handler.":::

1. Enter your hub name.
1. Select **Add** under **Configure Even Handlers**.
1. In the event handler page, configure the following fields: 1. Enter the server webhook URL in the **URL Template** field. 1. Select the **System events** that you want to subscribe to. 1. Select the **User events** that you want to subscribe to. 1. Select **Authentication** method to authenticate upstream requests. 1. Select **Confirm**.
   :::image type="content" source="media/howto-develop-eventhandler/configure-event-handler.png" alt-text="Screenshot of Azure Web PubSub Configure Event Handler.":::

1. Select **Save** at the top of the **Configure Hub Settings** page.

   :::image type="content" source="media/quickstart-serverless/edit-event-handler.png" alt-text="Screenshot of Azure Web PubSub Configure Hub Settings.":::

### Configure through Azure CLI

Use the Azure CLI [**az webpubsub hub**](/cli/azure/webpubsub/hub) group commands to configure the event handler settings.

| Commands | Description                                  |
| -------- | -------------------------------------------- |
| `create` | Create hub settings for WebPubSub Service.   |
| `delete` | Delete hub settings for WebPubSub Service.   |
| `list`   | List all hub settings for WebPubSub Service. |
| `show`   | Show hub settings for WebPubSub Service.     |
| `update` | Update hub settings for WebPubSub Service.   |

Here's an example of creating two webhook URLs for hub `MyHub` of `MyWebPubSub` resource:

```azurecli-interactive
az webpubsub hub create -n "MyWebPubSub" -g "MyResourceGroup" --hub-name "MyHub" --event-handler url-template="http://host.com" user-event-pattern="*" --event-handler url-template="http://host2.com" system-event="connected" system-event="disconnected" auth-type="ManagedIdentity" auth-resource="uri://myUri"
```

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
