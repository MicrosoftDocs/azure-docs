---
title: How to create an overlay with Media Encoder Standard
description: Learn how to create an overlay with Media Encoder Standard.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: how-to
ms.date: 08/31/2020
---

# How to create an overlay with Media Encoder Standard

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

The Media Encoder Standard allows you to overlay an image onto an existing video. Currently, the following formats are supported: png, jpg, gif, and bmp.

## Prerequisites

* Collect the account information that you need to configure the *appsettings.json* file in the sample. If you're not sure how to do that, see [Quickstart: Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md). The following values are expected in the *appsettings.json* file.

    ```json
    {
    "AadClientId": "",
    "AadEndpoint": "https://login.microsoftonline.com",
    "AadSecret": "",
    "AadTenantId": "",
    "AccountName": "",
    "ArmAadAudience": "https://management.core.windows.net/",
    "ArmEndpoint": "https://management.azure.com/",
    "Region": "",
    "ResourceGroup": "",
    "SubscriptionId": ""
    }
    ```

If you aren't already familiar with Transforms, it is recommended that you complete the following activities:

* Read [Encoding video and audio with Media Services](encoding-concept.md)
* Read [How to encode with a custom transform - .NET](customize-encoder-presets-how-to.md). Follow the steps in that article to set up the .NET needed to work with transforms, then return here to try out an overlays preset sample.
* See the [Transforms reference document](/rest/api/media/transforms).

Once you are familiar with Transforms, download the overlays sample.

## Overlays preset sample

Download the [media-services-overlay sample](https://github.com/Azure-Samples/media-services-overlays) to get started with overlays.

## Next steps

* [Subclip a video when encoding with Media Services - .NET](subclip-video-dotnet-howto.md)