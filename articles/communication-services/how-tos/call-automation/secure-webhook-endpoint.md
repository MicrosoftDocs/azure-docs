---
title: Azure Communication Services Call Automation how-to for securing webhook endpoint 
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide on securing deliver the delivery of incoming call and callback event
author: fanche

ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 06/19/2023
ms.author: askaur
manager: visho
services: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---

# How to secure webhook endpoints and websocket connections

Securing the delivery of messages from end to end is crucial for ensuring the confidentiality, integrity, and trustworthiness of sensitive information transmitted between systems. Your ability and willingness to trust information received from a remote system relies on the sender providing their identity. Call Automation has two ways of communicating events that can be secured; the shared IncomingCall event sent by Azure Event Grid, and all other mid-call events sent by the Call Automation platform via webhook.

## Incoming Call Event

Azure Communication Services relies on Azure Event Grid subscriptions to deliver the [IncomingCall event](../../concepts/call-automation/incoming-call-notification.md). You can refer to the Azure Event Grid team for their [documentation about how to secure a webhook subscription](../../../event-grid/secure-webhook-delivery.md).

## Call Automation webhook events

[Call Automation events](../../concepts/call-automation/call-automation.md#call-automation-webhook-events) are sent to the webhook callback URI specified when you answer a call, or place a new outbound call. Your callback URI must be a public endpoint with a valid HTTPS certificate, DNS name, and IP address with the correct firewall ports open to enable Call Automation to reach it. This anonymous public webserver could create a security risk if you don't take the necessary steps to secure it from unauthorized access.

A common way you can improve this security is by implementing an API KEY mechanism. Your webserver can generate the key at runtime and provide it in the callback URI as a query parameter when you answer or create a call. Your webserver can verify the key in the webhook callback from Call Automation before allowing access. Some customers require more security measures. In these cases, a perimeter network device may verify the inbound webhook, separate from the webserver or application itself. The API key mechanism alone may not be sufficient.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Secure webhook endpoint with .NET](./includes/secure-webhook-endpoint-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Secure webhook endpoint with Java](./includes/secure-webhook-endpoint-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Secure webhook endpoint with JavaScript](./includes/secure-webhook-endpoint-javascript.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Secure webhook endpoint with Python](./includes/secure-webhook-endpoint-python.md)]
::: zone-end

## Call Automation websockets events
### Authentication Token in WebSocket Header 
Each WebSocket connection request made by Call Automation now includes a signed JSON Web Token (JWT) in the Authentication header. This token can be validated using standard OpenID Connect (OIDC) JWT validation methods.
  - The JWT has a lifetime of 24 hours.
  - A new token is generated for each connection request to your WebSocket server.
  - More details are available in the official documentation:
Secure webhook endpoint – Azure Communication Services

 ::: zone pivot="programming-language-csharp"
[!INCLUDE [Secure websocket with .NET](./includes/secure-websocket-csharp.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Secure webhook endpoint with JavaScript](./includes/secure-websocket-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Secure webhook endpoint with Python](./includes/secure-websocket-python.md)]
::: zone-end


## IP Range 
Another way you can secure your websocket connections is by allowing only Microsoft Connections from certain IP ranges.

| Category | IP ranges or FQDN | Ports | 
| :-- | :-- | :-- |
| Call Automation Media | 52.112.0.0/14, 52.122.0.0/15, 2603:1063::/38|	UDP: 3478, 3479, 3480, 3481|
| Call Automation callback URLs | *.lync.com, *.teams.cloud.microsoft, *.teams.microsoft.com, teams.cloud.microsoft, teams.microsoft.com 52.112.0.0/14, 52.122.0.0/15, 2603:1027::/48, 2603:1037::/48, 2603:1047::/48, 2603:1057::/48, 2603:1063::/38, 2620:1ec:6::/48, 2620:1ec:40::/42 | TCP: 443, 80 UDP: 443 |

## Next steps

- Learn more about [How to control and steer calls with Call Automation](../call-automation/actions-for-call-control.md).
