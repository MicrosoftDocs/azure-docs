---
title: Azure Communication Services Call Automation how-to for redirecting inbound PSTN calls
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to for redirecting inbound telephony calls with Call Automation.
author: ashwinder

ms.service: azure-communication-services
ms.topic: include
ms.date: 09/06/2022
ms.author: askaur
ms.custom: public_preview
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Redirect inbound telephony calls with Call Automation

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Get started with Azure Communication Services by using the Call Automation SDKs to build automated calling workflows that listen for and manage inbound calls placed to a phone number or received via Direct Routing.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Redirect inbound call with .NET](./includes/redirect-inbound-telephony-calls-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Redirect inbound call with Java](./includes/redirect-inbound-telephony-calls-java.md)]
::: zone-end

## Testing the application

1. Place a call to the number you acquired in the Azure portal (see prerequisites above).
2. Your Event Grid subscription to the IncomingCall should execute and call your application.
3. The call will be redirected to the endpoint(s) you specified in your application.

Since this call flow involves a redirected call instead of answering it, pre-call web hook callbacks to notify your application the other endpoint accepted the call aren't published.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md) and its features. 
- Learn about [Play action](../../concepts/call-automation/play-Action.md) to play audio in a call.
- Learn how to build a [call workflow](../../quickstarts/call-automation/callflows-for-customer-interactions.md) for a customer support scenario. 