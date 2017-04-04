---
title: <page title displayed in search results. Include the brand Azure. Up to 60 characters> | Microsoft Docs
description: <article description that is displayed in search results. 115 - 145 characters.>
services: cognitive-services
author: <author's GitHub user alias, with correct capitalization>
manager: <MSFT alias of the author's manager>

ms.service: cognitive-services
ms.technology: <use folder name, all lower-case>
ms.topic: article
ms.date: mm/dd/yyyy
ms.author: <author's microsoft alias, one value only, alias only>
---

#Speech Translation API
This service offers a streaming API to transcribe conversational speech from one language into text of another language. The API also integrates text-to-speech capabilities to speak the translated text back. The Speech Translation API enables scenarios like real-time translation of conversations as seen in [Skype Translator](https://www.skype.com/en/features/skype-translator/).

With **Microsoft Translator Speech Translation API**, client applications stream speech audio to the service and receive back a stream of text-based results, which include the recognized text in the source language, and its translation in the target language. Text results are produced by applying Automatic Speech Recognition (ASR) powered by deep neural networks to the incoming audio stream. Raw ASR output is further improved by a new technique called TrueText in order to more closely reflect user intent. For example, TrueText removes disfluencies (the hmms and coughs) and restore proper punctuation and capitalization. The ability to mask or exclude profanities is also included. The recognition and translation engines are specifically trained to handle conversational speech. The Speech Translation service uses silence detection to determine the end of an utterance. After a pause in voice activity, the service will stream back a final result for the completed utterance. The service can also send back partial results, which give intermediate recognitions and translations for an utterance in progress. For final results, the service provides the ability to synthesize speech (text-to-speech) from the spoken text in the target languages. Text-to-speech audio is created in the format specified by the client. WAV and MP3 formats are available.

The Speech Translation API leverages the WebSocket protocol to provide a full-duplex communication channel between the client and the server. 

Code samples demonstrating use of the Speech Translation API are available from the [Microsoft Translator Github site](https://github.com/MicrosoftTranslator).
