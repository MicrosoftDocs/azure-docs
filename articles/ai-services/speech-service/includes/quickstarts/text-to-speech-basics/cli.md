---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/25/2023
ms.author: eur
---

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

[!INCLUDE [SPX Setup](../../spx-setup-quick.md)]

## Synthesize to speaker output

Run the following command for speech synthesis to the default speaker output. You can modify the voice and the text to be synthesized.

```console
spx synthesize --text "I'm excited to try text to speech" --voice "en-US-JennyNeural"
```

If you don't set a voice name, the default voice for `en-US` speaks.

All neural voices are multilingual and fluent in their own language and English. For example, if the input text in English is "I'm excited to try text to speech" and you set `--voice "es-ES-ElviraNeural"`, the text is spoken in English with a Spanish accent. If the voice doesn't speak the language of the input text, the Speech service doesn't output synthesized audio.

## Remarks

You can have finer control over voice styles, prosody, and other settings by using [Speech Synthesis Markup Language (SSML)](~/articles/ai-services/speech-service/speech-synthesis-markup.md).

- In the following example, the voice and style, `excited`, are provided in the SSML block.

  ```console
  spx synthesize --ssml "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='en-US'><voice name='en-US-JennyNeural'><mstts:express-as style='excited'>I'm excited to try text to speech</mstts:express-as></voice></speak>"
  ```

- Run this command for information about more speech synthesis options such as file input and output:

  ```console
  spx help synthesize
  ```

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
