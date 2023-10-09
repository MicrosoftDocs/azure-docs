---
title: How to configure event handler
description: Guidance about event handler concepts and integration introduction when develop with Azure Web PubSub service.
author: JialinXin
ms.author: jixin
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 01/27/2023
---

# Event handler in Azure Web PubSub service

The event handler handles the incoming client events. Event handlers are registered and configured in the service through the Azure portal or Azure CLI. When a client event is triggered, the service can send the event to the appropriate event handler. The Web PubSub service now supports the event handler as the server-side, which exposes the publicly accessible endpoint for the service to invoke when the event is triggered. In other words, it acts as a **webhook**.

The Web PubSub service delivers client events to the upstream webhook using the [CloudEvents HTTP protocol](https://github.com/cloudevents/spec/blob/v1.0.1/http-protocol-binding.md).

For every event, the service formulates an HTTP POST request to the registered upstream endpoint and expects an HTTP response.

The data sending from the service to the server is always in CloudEvents `binary` format.

:::image type="content" source="media/howto-develop-eventhandler/event-trigger.png" alt-text="Screenshot of Web PubSub service event trigger.":::

## Upstream and Validation

When you configure the webhook endpoint, the URL can include the `{event}` parameter to define a URL template. The service calculates the value of the webhook URL dynamically when the client request comes in. For example, when a request `/client/hubs/chat` comes in, with a configured event handler URL pattern `http://host.com/api/{event}` for hub `chat`, when the client connects, it will first POST to this URL: `http://host.com/api/connect`. The `{event}` parameter can be useful when a PubSub WebSocket client sends custom events, that the event handler helps dispatch different events to different upstream endpoints. The `{event}` parameter isn't allowed in the URL domain name.

When setting up the event handler webhook through Azure portal or CLI, the service follows the [CloudEvents Abuse Protection](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection) to validate the upstream webhook. Every registered upstream webhook URL will be validated by this mechanism. The `WebHook-Request-Origin` request header is set to the service domain name `xxx.webpubsub.azure.com`, and it expects the response to have a header `WebHook-Allowed-Origin` to contain this domain name or `*`.

When doing the validation, the `{event}` parameter is resolved to `validate`. For example, when trying to set the URL to `http://host.com/api/{event}`, the service will try to **OPTIONS** a request to `http://host.com/api/validate`. And only when the response is valid, the configuration can be set successfully.

For now, we don't support [WebHook-Request-Rate](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#414-webhook-request-rate) and [WebHook-Request-Callback](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#413-webhook-request-callback).

## Authentication between service and webhook

You can use any of these methods to authenticate between the service and webhook.

- Anonymous mode
- Simple authentication with `?code=<code>` is provided through the configured Webhook URL as query parameter.
- Microsoft Entra authorization. For more information, see [Use a managed identity in client events](howto-use-managed-identity.md#use-a-managed-identity-in-client-events-scenarios).

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
