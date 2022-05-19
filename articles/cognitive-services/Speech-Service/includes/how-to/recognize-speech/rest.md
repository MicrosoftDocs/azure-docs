---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/14/2022
author: eur
---

[!INCLUDE [Header](../../common/rest.md)]

[!INCLUDE [Introduction](intro.md)]

## Convert speech to text

At a command prompt, run the following command. Insert the following values into the command:
- Your subscription key for the Speech service.
- Your Speech service region.
- The path for input audio files. You can generate audio files by using [text-to-speech](../../../get-started-text-to-speech.md).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speech-to-text.sh" id="request":::

You should receive a response like the following one:

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speech-to-text.sh" id="response":::

For more information, see the [speech-to-text REST API reference](../../../rest-speech-to-text.md).
