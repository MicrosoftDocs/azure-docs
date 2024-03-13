---
title: Mute participants during a call
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for muting participants during a call.
author: kunaal
ms.service: azure-communication-services
ms.subservice: call-automation
ms.topic: include
ms.date: 03/19/2023
ms.author: kpunjabi
ms.custom: private_preview, devx-track-extended-java
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Mute participants during a call 

>[!IMPORTANT]
>Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
>Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/acs-tap-invite).

With Azure Communication Services Call Automation SDK, developers can now mute participants through server based API requests. This feature can be useful when you want your application to mute participants after they've joined the meeting to avoid any interruptions or distractions to ongoing meetings.   

If you’re interested in abilities to allow participants to mute/unmute themselves on the call when they’ve joined with Azure Communication Services Client Libraries, you can use our [mute/unmute function](../../../communication-services/how-tos/calling-sdk/manage-calls.md) provided through our Calling Library.

## Common use cases

### Contact center supervisor call monitoring

In a typical contact center, there may be times when a supervisor needs to join an on-going call to monitor the call to provide guidance to agents after the call on how they could improve their assistance. The supervisor would join muted as to not disturb the on-going call with any extra side noise.

*This guide helps you learn how to mute participants by using the mute action provided through Azure Communication Services Call Automation SDK.*


::: zone pivot="programming-language-csharp"
[!INCLUDE [Mute participants with .NET](./includes/mute-participants-how-to-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Mute participants with Java](./includes/mute-participants-how-to-java.md)]
::: zone-end


## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

Learn more about [Call Automation](../../concepts/call-automation/call-automation.md). 
