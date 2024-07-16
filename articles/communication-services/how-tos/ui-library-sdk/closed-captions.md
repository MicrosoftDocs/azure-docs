---
title: Enable scenarios using close captions and the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Enable scenarios using closed captions and Azure Communication Services UI Library.
author: garchiro7
ms.author: jorgegarc
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 07/01/2024
ms.custom: template-how-to
zone_pivot_groups: acs-plat-ios-android

#Customer intent: As a developer, I want setup closed captions into a call using the UI Library.
---

# Closed captions

Closed captions play a critical role in video voice calling apps, providing numerous benefits that enhance the accessibility, usability, and overall user experience of these platforms.

In this article, you learn how to enable closed captions scenarios using the UI Library.

## Azure Communication Service Based Captions

Supported by default for calls involving Azure Communication Service users only. Currently, Azure Communication Service captions **do not** support language translation.

## Teams Interop Closed Captions

Also supported by default and included during calls with **one or more** Teams users.
Translation Support: Unlike Azure Communication Service captions, Teams Interop Closed Captions support translation. Users can opt to have captions translated into a different language through the captions settings.

## Activate Closed Captions

### User Interaction

The Azure Communication Services UI Library offers the capabilities to enable closed captions in the calling composite and set up the default language, but the end users are always capable to select the language via UI interaction.

:::image type="content" source="./includes/closed-captions/mobile-ui-closed-captions.png" alt-text="Closed captions looks like into the UI Library":::

#### Spoken language

If a different language is being used in the meeting, users can change the spoken language via the UI. This change applies to all users in the call.

#### Caption Language

- There's no default caption language set.
- Change the caption language by clicking on the Captions Language button after captions have started, if translation to a different language is desired.

#### Supported languages

Azure Communication Services supports a variety of spoken languages for captions. Below is the list of supported language codes that can be used with the `setSpokenLanguage` method to set the desired language for captions:

- Arabic (UAE): `ar-ae`
- Arabic (Saudi Arabia): `ar-sa`
- Danish (Denmark): `da-dk`
- German (Germany): `de-de`
- English (Australia): `en-au`
- English (Canada): `en-ca`
- English (United Kingdom): `en-gb`
- English (India): `en-IN`
- English (New Zealand): `en-nz`
- English (United States): `en-us`
- Spanish (Spain): `es-es`
- Spanish (Mexico): `es-mx`
- Finnish (Finland): `fi-fi`
- French (Canada): `fr-CA`
- French (France): `fr-fr`
- Hindi (India): `hi-in`
- Italian (Italy): `it-it`
- Japanese (Japan): `ja-jp`
- Korean (Korea): `ko-kr`
- Norwegian Bokmål (Norway): `nb-no`
- Dutch (Belgium): `nl-be`
- Dutch (Netherlands): `nl-nl`
- Polish (Poland): `pl-pl`
- Portuguese (Brazil): `pt-br`
- Russian (Russia): `ru-ru`
- Swedish (Sweden): `sv-se`
- Chinese (China): `zh-cn`
- Chinese (Hong Kong): `zh-hk`

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/access-tokens.md).
- Optional: Completion of the [quickstart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up the feature

::: zone pivot="platform-android"
[!INCLUDE [Enable closed captions in the Android UI Library](./includes/closed-captions/android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Enable closed captions in the iOS UI Library](./includes/closed-captions/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
