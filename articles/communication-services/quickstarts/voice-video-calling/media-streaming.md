---
title: Media Streaming Quickstart
titleSuffix: An Azure Communication Services quickstart document
description: Provides a quick start for developers to get audio streams through media streaming APIs from ACS calls.
author: kunaal
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/25/2022
ms.author: kpunjabi
ms.custom: private_preview
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Quickstart: Media Streaming - Audio

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

Get started with using audio streams through Azure Communication Services Media Streaming API. This quickstart assumes you are already familiar with Call Automation APIs to build an automated call routing solution. 

::: zone pivot="programming-language-csharp"
[!INCLUDE [](./includes/call-automation-media/)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [](./includes/call-automation-media/]
::: zone-end

## Stop Audio Streaming
Audio streaming will stop automatically when the call is ended or cancelled.
