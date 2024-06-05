---
title: Troubleshoot the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use the Azure Communication Services UI Library to get debug information.
author: pavelprystinka
ms.author: pprystinka
ms.service: azure-communication-services
ms.topic: how-to 
ms.custom: template-how-to
ms.date: 11/23/2022
zone_pivot_groups: acs-plat-web-ios-android

#Customer intent: As a developer, I want to get debug information for troubleshooting voice and video calls. 
---

# Troubleshoot the UI Library

When you're troubleshooting voice or video calls, you might need to provide a call ID. This ID identifies Azure Communication Services calls. Each call can have multiple call IDs.

In this article, you use the Azure Communication Services UI Library to get essential debugging information.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up troubleshooting

::: zone pivot="platform-web"
For detailed documentation and quickstarts about the Web UI Library, see the [Web UI Library Storybook](https://azure.github.io/communication-ui-library).

To learn more, see [Troubleshooting](https://azure.github.io/communication-ui-library/?path=/docs/troubleshooting--page) in the Web UI Library.
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Troubleshooting Android UI Library](./includes/troubleshooting/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Troubleshooting over the iOS UI Library](./includes/troubleshooting/ios.md)]
::: zone-end

Users can also find the call ID via the action bar on the bottom of the call screen. For more information, see the [UI Library use cases](../../concepts/ui-library/ui-library-use-cases.md?&pivots=platform-mobile#troubleshooting-guide).

## Next steps
- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
- [Learn more about the UI Library Design Kit](../../quickstarts/ui-library/get-started-ui-kit.md)
