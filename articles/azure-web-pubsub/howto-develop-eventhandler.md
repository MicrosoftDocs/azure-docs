---
title: How to configure event handler
description: Guidance about event handler concepts and integration introduction when develop with Azure Web PubSub service.
author: JialinXin
ms.author: jixin
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 10/31/2021
---

# Event handler in Azure Web PubSub service

The event handler handles the incoming client events. Event handlers are registered and configured in the service through portal or Azure CLI beforehand so that when a client event is triggered, the service can identify if the event is expected to be handled or not. We now support the event handler as the server side, which exposes public accessible endpoint for the service to invoke when the event is triggered. In other words, it acts as a **webhook**. 

Service delivers client events to the upstream webhook using the [CloudEvents HTTP protocol](https://github.com/cloudevents/spec/blob/v1.0.1/http-protocol-binding.md).

For every event, it formulates an HTTP POST request to the registered upstream and expects an HTTP response. 

The data sending from the service to the server is always in CloudEvents `binary` format.

:::image type="content" source="media/howto-develop-eventhandler/event-trigger.png" alt-text="Screenshot of Web PubSub service event trigger.":::

## Upstream and Validation

When configuring the webhook endpoint, the URL can use `{event}` parameter to define a URL template. The service calculates the value of the webhook URL dynamically when the client request comes in. For example, when a request `/client/hubs/chat` comes in, with a configured event handler URL pattern `http://host.com/api/{event}` for hub `chat`, when the client connects, it will first POST to this URL: `http://host.com/api/connect`. The parameter can be useful when a PubSub WebSocket client sends custom events, that the event handler helps dispatch different events to different upstream. Note that the `{event}` parameter is not allowed in the URL domain name.

When setting up the event handler upstream through Azure portal or CLI, the service follows the [CloudEvents Abuse Protection](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection) to validate the upstream webhook. Every registered upstream webhook URL will be validated by this mechanism. The `WebHook-Request-Origin` request header is set to the service domain name `xxx.webpubsub.azure.com`, and it expects the response to have a header `WebHook-Allowed-Origin` to contain this domain name or `*`.

When doing the validation, the `{event}` parameter is resolved to `validate`. For example, when trying to set the URL to `http://host.com/api/{event}`, the service will try to **OPTIONS** a request to `http://host.com/api/validate`. And only when the response is valid, the configuration can be set successfully.

For now, we do not support [WebHook-Request-Rate](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#414-webhook-request-rate) and [WebHook-Request-Callback](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#413-webhook-request-callback).

## Authentication between service and webhook

- Anonymous mode
- Simple Auth with `?code=<code>` is provided through the configured Webhook URL as query parameter.
- Use Azure Active Directory(Azure AD) authentication, check [here](howto-use-managed-identity.md) for details.
   - Step1: Enable Identity for the Web PubSub service
   - Step2: Select from existing AAD application that stands for your webhook web app

## Configure event handler

### Configure through Azure portal

Find your Azure Web PubSub service from **Azure portal**. Navigate to **Settings**. Then select **Add** to configure your server-side webhook URL. For an existing hub configuration, select **...** on right side will navigate to the same editing page.

:::image type="content" source="media/quickstart-serverless/set-event-handler.png" alt-text="Screenshot of setting the event handler.":::

Then in the below editing page, you'd need to configure hub name, server webhook URL, and select `user` and `system` events you'd like to subscribe. Finally select **Save** when everything is done. 

:::image type="content" source="media/quickstart-serverless/edit-event-handler.png" alt-text="Screenshot of editing the event handler.":::

### Configure through Azure CLI

Use the Azure CLI [**az webpubsub hub**](/cli/azure/webpubsub/hub) group commands to configure the event handler settings.

Commands | Description
--|--
create | Create hub settings for WebPubSub Service.
delete | Delete hub settings for WebPubSub Service.
list   | List all hub settings for WebPubSub Service.
show   | Show hub settings for WebPubSub Service.
update | Update hub settings for WebPubSub Service.

Below is an example of creating 2 webhook URLs for hub `MyHub` of `MyWebPubSub` resource.

```azurecli-interactive
az webpubsub hub create -n "MyWebPubSub" -g "MyResourceGroup" --hub-name "MyHub" --event-handler url-template="http://host.com" user-event-pattern="*" --event-handler url-template="http://host2.com" system-event="connected" system-event="disconnected" auth-type="ManagedIdentity" auth-resource="uri://myUri"
```

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]