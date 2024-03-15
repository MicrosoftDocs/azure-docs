---
title: Inject a custom data model in the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Set up custom data model injection in the Azure Communication Services UI Library.
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 05/24/2022
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to set up custom data model injection in the UI Library for my application.
---

# Inject a custom data model in the UI library for an application

Azure Communication Services uses an identity-agnostic model in which developers can [bring their own identities](../../concepts/identity-model.md). Developers can get their data model and link it to Azure Communication Services identities. The data model for a user most likely includes information such as display name, profile picture or avatar, and other details. Developers use this information to build their applications and platforms.

The UI Library makes it simple for you to inject a user data model into the UI components. When you render the UI components, they show users the provided information rather than generic information from Azure Communication Services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up injection

::: zone pivot="platform-web"
[!INCLUDE [Data model over the Web UI Library](./includes/data-model/web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Data model over the Android UI Library](./includes/data-model/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Data model over the iOS UI Library](./includes/data-model/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
