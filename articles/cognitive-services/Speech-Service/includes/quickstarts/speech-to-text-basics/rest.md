---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

> [!div class="nextstepaction"]
> [I have the prerequisites](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-rest)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-rest)

## Recognize speech from a microphone

At a command prompt, run the following command. Insert the following values into the command:
- Your subscription key for the Speech service.
- Your Speech service region.
- The path for input audio files. You can generate audio files by using [text-to-speech](../../../get-started-text-to-speech.md).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speech-to-text.sh" id="request":::

You should receive a response like the following one:

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speech-to-text.sh" id="response":::

For more information, see the [speech-to-text REST API reference](../../../rest-speech-to-text.md).

> [!div class="nextstepaction"]
> [My speech was recognized](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-rest)
> [I ran into an issue](~/articles/cognitive-services/speech-service/get-started-speech-to-text.md?pivots=programming-language-rest)


## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]




## Convert speech to text

At a command prompt, run the following command. Insert the following values into the command:
- Your subscription key for the Speech service.
- Your Speech service region.
- The path for input audio files. You can generate audio files by using [text-to-speech](../../../get-started-text-to-speech.md).

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speech-to-text.sh" id="request":::

You should receive a response like the following one:

:::code language="curl" source="~/cognitive-services-quickstart-code/curl/speech/speech-to-text.sh" id="response":::

For more information, see the [speech-to-text REST API reference](../../../rest-speech-to-text.md).
