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

# How to secure webhook endpoint

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
[!INCLUDE [Secure webhook endpoint with JavaSript](./includes/secure-webhook-endpoint-javascript.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Secure webhook endpoint with Python](./includes/secure-webhook-endpoint-python.md)]
::: zone-end

## Next steps

- Learn more about [How to control and steer calls with Call Automation](../call-automation/actions-for-call-control.md).
