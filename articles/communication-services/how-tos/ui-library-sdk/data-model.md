---
title: Custom Data Model Injection over the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services UI library for Mobile native to set up Custom Data Model Injection
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 05/24/2022
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to set up the Custom Data Model Injection in my application
---

# Custom Data Model Injection

Azure Communication Services uses an identity agnostic model where developers can [bring their own identities](../../concepts/identity-model.md). Contoso can get their data model and link it to Azure Communication Services identities. A developer's data model for a user most likely includes information such as their display name, profile picture or avatar, and other details. Information is used by developers to power their applications and platforms.

The UI Library makes it simple for developers to inject that user data model into the UI Components. When rendered, they show users provided information rather than generic information that Azure Communication Services has.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../quickstarts/identity/access-tokens.md)
- Optional: Complete the quickstart for [getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md)

::: zone pivot="platform-web"
[!INCLUDE [Data model over the Web UI library](./includes/data-model/web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Data model over the Android UI library](./includes/data-model/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Data model over the iOS UI library](./includes/data-model/ios.md)]
::: zone-end

## Next steps

- [Learn more about UI Library](../../concepts/ui-library/ui-library-overview.md)
