---
title: Recognize intents from speech by using the Speech SDK for Java
titleSuffix: "Microsoft Cognitive Services"
description: |
  Learn how to recognize intents from speech from a file or a microphone by using the Speech SDK for Java.
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 07/16/2018
ms.author: wolfma
---

# Recognize intents from speech by using the Speech SDK for Java

[!include[Article selector](../../../includes/cognitive-services-speech-service-how-to-recognize-intents-from-speech-selector.md)]

[!include[Introduction](../../../includes/cognitive-services-speech-service-how-to-recognize-intents-from-speech-intro.md)]

[!include[Introduction for top-level declarations](../../../includes/cognitive-services-speech-service-how-to-toplevel-declarations.md)]

[!code-java[Top-level declarations](~/samples-cognitive-services-speech-sdk/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/IntentRecognitionSamples.java#toplevel)]

[!include[Introduction to using a microphone](../../../includes/cognitive-services-speech-service-how-to-recognize-intents-from-speech-microphone.md)]

[!code-java[Intent recognition by using a microphone](~/samples-cognitive-services-speech-sdk/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/IntentRecognitionSamples.java#IntentRecognitionWithMicrophone)]

[!include[Introduction to using a microphone and language](../../../includes/cognitive-services-speech-service-how-to-recognize-intents-from-speech-microphone-language.md)]

[!code-java[Intent recognition by using a microphone in a specified language](~/samples-cognitive-services-speech-sdk/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/IntentRecognitionSamples.java#IntentRecognitionWithLanguage)]

[!include[Introduction to using a continuous file](../../../includes/cognitive-services-speech-service-how-to-recognize-intents-from-speech-continuous.md)]

[!code-java[Intent recognition by using events from a file](~/samples-cognitive-services-speech-sdk/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/IntentRecognitionSamples.java#IntentContinuousRecognitionWithFile)]

[!include[Get the samples](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for the code that's used in this article in the samples/java/jre/console folder.

## Next steps

- [How to recognize speech](how-to-recognize-speech-java.md)
- [How to translate speech](how-to-translate-speech-java.md)
