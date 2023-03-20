---
title: Mute participants during a call
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for muting participants during a call.
author: kunaal
ms.service: azure-communication-services
ms.subservice: call-automation
ms.topic: include
ms.date: 03/19/20223
ms.author: kpunjabi
ms.custom: private_preview
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Mute participants during a call 

>[!IMPORTANT]
>Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
>Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/acs-tap-invite).

With Azure Communication Services Call Automation SDK, developers can now mute participants through server API requests. This feature can be useful when a participant in a call has forgotten to mute themselves or in scenarios where you may only want one participant to speak. 

If you’re interested in abilities to allow participants to mute/unmute themselves on the call when they’ve joined with ACS Client Libraries, you can use our [mute/unmute function](../../calling-sdk/includes/manage-calls/manage-calls-web.md#mute-and-unmute-incoming-audio) provided through our Calling Library.

## Common use cases

### Contact centre supervisor call monitoring
In a typical contact centre scenario, there may be times when a supervisor needs to join an on-going call to monitor the call to provide guidance to agents after the call on how they could improve their assistance. The supervisor would join muted as to not disturb the on-going call with any extra side noise.

*This guide will help you learn how to mute participants by using the mute action provided through Azure Communication Services Call Automation SDK.*


::: zone pivot="programming-language-csharp"
[!INCLUDE [Play audio with .NET](./includes/play-audio-with-ai-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Play audio with Java](./includes/play-audio-with-ai-java.md)]
::: zone-end

## Event codes
|Status|Code|Subcode|Message|
|----|--|-----|-----|
|PlayCompleted|200|0|Action completed successfully.|
|PlayFailed|400|8535|Action failed, file format is invalid.|
|PlayFailed|400|8536|Action failed, file could not be downloaded.|
|PlayCanceled|400|8508|Action failed, the operation was canceled.|

## Clean up resources
If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Known issues

## Next Steps
