---
title: "Troubleshooting guide for Azure Web PubSub Service"
description: Learn how to troubleshoot common issues for Web PubSub
author: JialinXin
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 04/28/2023
ms.author: jixin
ms.devlang: csharp
---

# Troubleshooting guide for common issues

This article provides troubleshooting guidance for some of the common issues that customers might encounter. Listed errors are available to check when you turn on [`live trace tool`](./howto-troubleshoot-resource-logs.md#capture-resource-logs-by-using-the-live-trace-tool) or collect from [Azure Monitor](./howto-troubleshoot-resource-logs.md#capture-resource-logs-with-azure-monitor).


## 404 from HttpHandlerUnexpectedResponse

### Possible errors

`Sending message during operation hub:<your-hub>,event:connect,type:sys,category:connections,requestType:Connect got unexpected response with status code 404.`

### Root cause

This error indicates the event is registered in Web PubSub settings but fail to get a response from registered upstream URL.

### Troubleshooting guide

- Check your upstream server function or method whether it's good to work.
- Check whether this event is intended to register. If not, remove it from the hub settings in Web PubSub side. 

## 500 from HttpHandlerUnexpectedResponse

### Possible errors

- `Sending message during operation handshake got unexpected response with status code 500. Detail: Get error from upstream: 'Request is denied as target server is invalid'`
- `Sending message during operation hub:<your-hub>,event:connect,type:sys,category:connections,requestType:Connect got unexpected response with status code 500.`

### Root cause

This error indicates event request get a `500` response from registered upstream.

### Troubleshooting guide

- Check upstream side logs to investigate if there's some errors during handling the reported event.

## AbuseProtectionResponseMissingAllowedOrigin

### Possible errors

- `Abuse protection for 'https://<upstream-host>/<upstream-path>' missing allowed origins: .`

### Root cause

Web PubSub follows the [CloudEvents Abuse Protection](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection) to validate the upstream webhook. Every registered upstream webhook URL will be validated. The `WebHook-Request-Origin` request header is set to the service domain name `<web-pubsub-name>.webpubsub.azure.com`, and it expects the response to have a header `WebHook-Allowed-Origin` to contain this domain name or `*`. 

### Troubleshooting guide

Review the upstream side code to ensure when upstream receives the `OPTIONS` preflight request from Web PubSub service, it's correctly handled following the rule that contains the expected header `WebHook-Allowed-Origin` and value.

Besides, you can update to convenience server SDK, which automatically handles `Abuse Protection` for you.

- [@web-pubsub-express for JavaScript ](https://www.npmjs.com/package/@azure/web-pubsub-express)
- [Microsoft.Azure.WebPubSub.AspNetCore for C#](https://www.nuget.org/packages/Microsoft.Azure.WebPubSub.AspNetCore)

## 401 Unauthorized from AbuseProtectionResponseInvalidStatusCode

### Possible errors

- `Abuse protection for 'https://<upstream-host>/<upstream-path>' failed: 401.`

### Root cause

This error indicates the `Abuse Protection` request get a `401` response from the registered upstream URL. For more information, see [`Abuse Protection`](./howto-develop-eventhandler.md#upstream-and-validation).

### Troubleshooting guide

- Check if there's any authentication enabled in upstream side, for example, the `App Keys` for a `WebPubSubTrigger` Azure Function is set correctly, see [example](./quickstart-serverless.md?#configure-the-web-pubsub-service-event-handler).
- Check upstream side logs to investigate how is the `Abuse Protection` request processed.

## Client connection drops

When the client is connected to Azure Web PubSub, the persistent connection between the client and Azure Web PubSub can sometimes drop for different reasons. This section describes several possibilities causing such connection drop and provides some guidance on how to identify the root cause. 

You can check the metric `Connection Close Count` from Azure portal.

### Possible reasons and root cause

| Reason | Root cause |
|--|--|
| Normal | Close by clients |
| ClosedByAppServer | Close by server triggered Rest API call like [`CloseConnection`](/rest/api/webpubsub/dataplane/web-pub-sub/close-connection?tabs=HTTP) |
| ServiceReload | Close by service due to regular maintenance or backend auto scales |
| PingTimeout | Close by service due to client status unhealthy that service doesn't receive any regular pings |
| SlowClient | Close by service due to clients are not able to receive buffered messages fast enough |

### Troubleshooting guide

`PingTimeout` and `SlowClient` indicates that you have some clients not able to afford current traffic load. It's suggested to control the message sending speed and investigate [client traces](./howto-troubleshoot-network-trace.md) if client side performance can be improved.

## ConnectionCountLimitReached

Web PubSub different tiers have a hard limit on concurrent connection. This error indicates your traffic is beyond the supported connection count. For more information about pricing, see [Web PubSub pricing](https://azure.microsoft.com/pricing/details/web-pubsub/).

### Solution

Scale up to a paid tier(Standard or Premium) to have at least 1000 connections or scale out to more units that support more connections.

