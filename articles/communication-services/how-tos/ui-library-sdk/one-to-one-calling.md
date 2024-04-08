---
title: Set up one-to-one calling in the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use the Azure Communication Services UI Library to set up one-to-one calling and push notifications.
author: iaulakh
ms.author: iaulakh
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 12/19/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to enable push notifications with the Azure Communication Services UI Library so that I can create a calling application that provides push notifications to its users.
---

# Set up one-to-one calling and push notifications in the UI Library

The UI Library provides out-of-the-box support for making one-to-one calls by using Azure Communication Services participant identifiers. To support one-to-one calling, the UI Library provides incoming call notifications. You can also use Azure Communication Services as an Azure Event Grid event source for calls.

In this article, you learn how to make one-to-one calls correctly by using the UI Library in your application.

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up the features

::: zone pivot="platform-android"
[!INCLUDE [One-to-one calling and push notifications over the Android UI Library](./includes/push-and-one-to-one/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [One-to-one calling and push notifications over the iOS UI Library](./includes/push-and-one-to-one/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
