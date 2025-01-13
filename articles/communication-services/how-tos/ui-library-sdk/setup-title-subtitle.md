---
title: Customize the title and subtitle of the call bar in the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Customize the title and subtitle of the call in the Azure Communication Services UI Library.
author: garchiro7

ms.author: jorgegarc
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 09/01/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want to customize the title and subtitle of the call in the UI Library
---

# Customize the title and subtitle 

Developers now have the capability to customize the title and subtitle of a call, both during setup and while the call is in progress. This feature allows for greater flexibility in aligning the call experience with specific use cases.

For instance, in a customer support scenario, the title could display the issue being addressed, while the subtitle could show the customer's name or ticket number.

:::image type="content" source="./media/title-subtitle.png" alt-text="Screenshot that shows the experience of title and subtitle in the UI Library.":::

Additionally, if tracking time spent in various segments of the call is crucial, the subtitle could dynamically update to display the elapsed call duration, helping to manage the meeting or session effectively.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up the feature

::: zone pivot="platform-android"
[!INCLUDE [Customize the title and subtitle in the Android UI Library](./includes/setup-title-subtitle/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Customize the title and subtitle in the iOS UI Library](./includes/setup-title-subtitle/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
