---
author: v-jaswel
ms.service: cognitive-services
ms.topic: include
ms.date: 10/09/2020
ms.author: v-jawe
---

In this quickstart, you learn how to convert speech to text by using the Speech service and cURL.

For a high-level look at speech-to-text concepts, see the [overview](../../../speech-to-text.md) article.

## Prerequisites

This article assumes that you have an Azure account and a Speech service subscription. If you don't have an account and a subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Convert speech to text

At a command prompt, run the following command. Insert the following values into the command:
- Your subscription key for the Speech service.
- Your Speech service region.
- The path for input audio files. You can generate audio files by using [text-to-speech](../../../get-started-text-to-speech.md).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speech-to-text.sh" id="request":::

You should receive a response like the following one:

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speech-to-text.sh" id="response":::

For more information, see the [speech-to-text REST API reference](../../../rest-speech-to-text.md).
