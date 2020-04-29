---
title: 'Quickstart: Use Custom Commands with Custom Voice (Preview) - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you'll specify the output voice of a Custom Commands application.
services: cognitive-services
author: anhoang
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/10/2019
ms.author: anhoang
---

# Quickstart: Use Custom Commands with Custom Voice

In the [previous article](./quickstart-custom-speech-commands-create-parameters.md), we created a new Custom Commands application to respond to commands with parameters.

In this article, we'll select a custom output voice for the application we created.

## Select a Custom Voice

1. Open the project [we created previously](./quickstart-custom-speech-commands-create-parameters.md).
1. Click **Settings** from the left pane.
1. Click **Custom voice** from the middle pane.
1. Select the desired custom or public voice from the table.
1. Click **Save**.

> [!div class="mx-imgBorder"]
> ![Sample Sentences with parameters](media/custom-speech-commands/select-custom-voice.png)

> [!NOTE]
> Custom voices can be created from the Custom Voice project page. Select the **Speech Studio** link, then **Custom Voice** to get started.

Now the application will respond in the selected voice, instead of the default voice.

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Connect to a Custom Command application with the Speech SDK](./quickstart-custom-speech-commands-speech-sdk.md)

