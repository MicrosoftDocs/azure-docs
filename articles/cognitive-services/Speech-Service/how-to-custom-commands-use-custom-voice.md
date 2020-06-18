---
title: 'How To: Use Custom Commands with Custom Voice - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you'll specify the output voice of a Custom Commands application.
services: cognitive-services
author: singhsaumya
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/16/2020
ms.author: sausin
---

# Use Custom Commands with Custom Voice

In this article, you'll learn how to select a custom output voice for a custom commands application.

## Select a Custom Voice

1. In your custom commands application, select **Settings** from the left pane.
1. Select **Custom Voice** from the middle pane.
1. Select the desired custom or public voice from the table.
1. Select **Save**.

> [!div class="mx-imgBorder"]
> ![Sample Sentences with parameters](media/custom-commands/select-custom-voice.png)

> [!NOTE]
> - For **Public voices**, **Neural types** are only available for specific regions. To check availability, see [standard and neural voices by region/endpoint](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#standard-and-neural-voices).
> - For **Custom voices**, they can be created from the Custom Voice project page. See [Get Started with Custom Voice](./how-to-custom-voice.md).

Now the application will respond in the selected voice, instead of the default voice.
