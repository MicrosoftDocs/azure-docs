---
title: Troubleshooting call end response codes for Calling SDK, Call Automation SDK, PSTN, Chat SDK, and SMS SDK - Azure Communication Services
description: Use call end response codes to diagnose why a call ended for Calling SDK, Call Automation SDK, PSTN, Chat SDK, and SMS SDK.
services: azure-communication-services
ms.date: 11/24/2023
author: slpavkov
ms.service: azure-communication-services
ms.author: slpavkov
manager: aakanmu
audience: ITPro
ms.topic: troubleshooting
localization_priority: Normal
zone_pivot_groups: acs-calling-automation-pstn
---

# Troubleshooting call end response codes for Calling SDK, Call Automation SDK, PSTN, Chat SDK, and SMS SDK

This article describes troubleshooting call end response codes for Calling SDK, Call Automation, and PSTN calling.

## Troubleshooting tips

Consider the following tips when troubleshooting: 
- Your application isn't receiving an `IncomingCall Event Grid` event: Make sure the application endpoint is [validated with Event Grid](../../../../event-grid/webhook-event-delivery.md) when creating an event subscription. The provisioning status for your event subscription is marked as succeeded if the validation was successful. 
- For error `The field CallbackUri is invalid`: Call Automation doesn't support HTTP endpoints. Make sure the callback URL you provide supports HTTPS.
- The `PlayAudio` action doesn't play anything: Currently only Wave file (.wav) format is supported for audio files. The audio content in the wave file must be mono (single-channel), 16-bit samples with a 16,000 (16 KHz) sampling rate.
- Actions on PSTN endpoints aren't working: For `CreateCall`, `Transfer`, `AddParticipant`, and `Redirect` to phone numbers, you need to set the `SourceCallerId` in the action request. Unless you're using direct routing, the source caller ID must be a phone number owned by your Communication Services resource for the action to succeed. 

For more information about issues tracked by the product team, see [Known issues](../../../concepts/known-issues.md).

> [!NOTE]
> Message and Result Categories listed in the following tables are in public preview. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


::: zone pivot="calling"
[!INCLUDE [Calling SDK](./includes/codes/calling-sdk.md)]
::: zone-end

::: zone pivot="callend"
[!INCLUDE [Call end](./includes/codes/call-end.md)]
::: zone-end

::: zone pivot="automation"
[!INCLUDE [Call Automation](./includes/codes/call-automation-sdk.md)]
::: zone-end

::: zone pivot="pstn"
[!INCLUDE [PSTN](./includes/codes/pstn.md)]
::: zone-end

::: zone pivot="chat"
[!INCLUDE [Chat SDK](./includes/codes/chat-sdk.md)]
::: zone-end

::: zone pivot="sms"
[!INCLUDE [SMS SDK](./includes/codes/sms-sdk.md)]
::: zone-end

## Related articles

- [Troubleshooting in Azure Communication Services](../../../concepts/troubleshooting-info.md)
- [Troubleshooting Azure Communication Services PSTN call failures](../../../concepts/telephony/troubleshooting-pstn-call-failures.md)