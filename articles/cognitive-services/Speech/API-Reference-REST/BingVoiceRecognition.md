---
title: Speech Recognition API in Microsoft Cognitive Services | Microsoft Docs
description: Use the Bing Speech Recognition REST API in contexts that need cloud-based speech recognition capabilities.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 02/28/2017
ms.author: prrajan
---

# API reference for speech to text conversion
The API reference for converting speech to text using http based REST protocol or web socket based protocol. 

## REST
Microsoft's Cognitive Services REST Speech Recognition API is an HTTP 1.1 protocol definition for building simple speech applications that perform speech recognition. The REST Speech Recognition API is most suitable for applications where real-time user feedback is not required or for platforms that do not support the IETF web socket standard.

* Continuous recognition is not supported. 
* Utterances are limited to a maximum of 15 seconds
* Partial results are not returned. Only the final phrase result is returned.
* Service endpointing is not supported; clients must determine the end of speech. 
* The single recognition phrase result is returned to the client only after the client stops writing to the request stream.

If these features are important to your app's functionality, use the web socket API instead.

## WebSocket
Microsoft's Cognitive Services WebSocket Speech Recognition API is a WebSocket-based service protocol definition that enables subscribers to build full-featured speech applications that provide a rich user experience. This protocol extends the Microsoft Speech SDK protocol, which powers a wide variety of speech applications throughout the industry.

[Javascript SDK](../GetStarted/GettingStartedJSWebsockets.md) is available based on this version of websocket protocol. SDKs for additional languages and platforms are in development. If your language or platform does not yet have an SDK, you can create your own implementation based on the [documented protocol](websocketprotocol.md).

## Endpoints
The API endpoints based on user scenario are highlighted here:

| Mode | Path | Example URL |
|-----|-----|-----|
|Interactive|/speech/recognize/interactive/cognitiveservices/v1 |[https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR](https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR) | 
| Conversation	|/speech/recognize/conversation/cognitiveservices/v1 |[https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US](https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US) |
|Dictation|	/speech/recognize/dictation/cognitiveservices/v1	|[https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR](https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR)  |

## Recognition Modes
There are three modes of recognition: interactive, conversational, and dictation mode. 
The recognition mode adjusts speech recognition based on how the users are likely to speak. Choose the appropriate recognition mode for your application. 

> [!NOTE]
> Recognition modes may have different behaviors in the REST protocol than they do 
> in the web socket protocol. For example, the REST API does not support continuous 
> recognition, even in conversational or dictation mode.

The Microsoft Speech Service returns only one recognition phrase result for all recognition modes. There is a maximum limit of 15 seconds for any single utterance.

### Interactive Mode
In **interactive** mode, a user makes short requests and expects the application to perform an action in response. 

The following characteristics are typical of interactive mode applications:
* Users know they are speaking to a machine instead of another human.
* The application user knows ahead of time what they want to say based on what they want the application to do.
* Utterances typically last about 2-3 seconds.

### Conversational Mode
In **conversational** mode, users are engaged in a human-to-human conversation.

The following characteristics are typical of conversational mode applications:

* Users know that they are talking to another person.
* Speech recognition enhances the human conversations by allowing one or both of the participants to see the spoken text.
* Users do not always plan ahead of time what they want to say.
* Users frequently use slang and other informal speech.

### Dictation Mode
In **dictation**  mode, the user recites longer utterances to the application for further processing.

The following characteristics are typical of dictation mode applications:
* Users know that they are talking to a machine.
* Speech recognition text results are shown to the user. 
* Users often plan ahead of time what they want to say and use more formal language.
* Users employ full sentences lasting 5-8 seconds.

> [!NOTE]
> In Dictation & Conversation modes partial results are not returned. More stable, phrase results are.
> Phrase results are emitted during silence boundaries in the audio stream. In the future, we plan on exposing more 
> real-time partial results which can be used to improve user-experience generally in realtime dictation scenarios.

## Recognition Languages
The following locales are supported by the Speech Recognition API.

### Interactive and dictation mode
These `locale` codes are supported in **interactive** and **dictation** mode.

|Code |  | Code |  |
|-----|-----|-----|-----|
| ar-EG | Arabic (Egypt), modern standard | hi-IN | Hindi (India) |
| ca-ES | Catalan (Spain) | it-IT | Italian (Italy)  |
| da-DK | Danish (Denmark) | ja-JP | Japanese (Japan) |
| de-DE | German (Germany) |ko-KR | Korean (Korea) |
| en-AU | English (Australia) |nb-NO | Norwegian (Bokmål) (Norway)  |
| en-CA | English (Canada) | nl-NL | Dutch (Netherlands)   |
| en-GB | English (United Kingdom) |pl-PL | Polish (Poland) |
| en-IN | English (India) | pt-BR | Portuguese (Brazil)  |
| en-NZ | English (New Zealand) |pt-PT | Portuguese (Portugal)  |
| en-US | English (United States) | ru-RU | Russian (Russia) |
| es-ES | Spanish (Spain) | sv-SE | Swedish (Sweden) |
| es-MX | Spanish (Mexico) |zh-CN | Chinese (Mandarin, simplified)  |
| fi-FI | Finnish (Finland) |zh-HK | Chinese (Hong Kong) |
| fr-CA | Spanish (Mexico) | zh-TW | Chinese (Mandarin, Taiwanese)|
| fr-FR | French (France) | ||

### Conversational mode
These `locale` codes are supported in **conversational** mode.

|Code||Code||
|-----|-----|-----|-----|
| ar-EG | Arabic (Egypt), modern standard | It-IT | Italian (Italy) |
| de-DE | German (Germany) | ja-JP | Japanese (Japan) |
| en-US | English (United States) | pt-BR | Portuguese (Brazil) |
| es-ES | Spanish (Spain) | ru-RU | Russian (Russia) |
| fr-FR | French (France) | zh-CN | Chinese (Mandarin, simplified) |
 
## Output Format
The Microsoft Speech Service can return different payload formats of recognition phrase results. All payloads are JSON structures. 

Control the phrase result format by specifying the `format` URL query parameter. By default, the Microsoft Speech Service will return `simple` results. 

| Format | Description |
|-----|-----|
| simple | A simplified phrase result containing the recognition status and the recognized text in display form. |
| detailed | A recognition status and N-Best list of phrase results where each phrase result contains all four recognition forms and a confidence score. |

The **detailed** format contains the following four recognition forms:

### Lexical Form
The lexical form is the recognized text exactly how they occurred in the utterance without any punctuation or capitalization. For example, the lexical form of the address `1020 Enterprise Way` would be `ten twenty enterprise way`, assuming it was spoken that way. The lexical form of the sentence `Remind me to buy 5 pencils.` is `remind me to buy five pencils`.

The lexical form is most appropriate for applications that need to perform non-standard text normalization or that otherwise need unprocessed recognition words. Profanity is never masked in the lexical form.

### Inverse Text Normalization (ITN) form
Text normalization is the process of converting text from one form into another "canonical" form. For example, the phone number `555-1212` might be converted to the canonical form `five five five one two one two`. *Inverse* text normalization (ITN) reverses this process, converting the words `five five five one two one two` to the inverted canonical form `555-1212`. Note that the ITN form of a recognition result does not include any capitalization or punctuation. 

ITN form is most appropriate for applications that take action on the recognized text. For example, an application that allows a user to speak search terms and then uses these search terms in a web search query would use the ITN form of the recognition result. Profanity is never masked in the ITN form; to mask profanity, use the **Masked ITN form**.

### Masked Inverse Text Normalization (ITN) Form
Since profanity is naturally a part of spoken language, the Microsoft Speech Service recognizes these words and phrases when they are spoken. Profanity may not, however, be appropriate for all applications, especially those with a restricted, non-adult user audience.

The masked ITN form applies profanity masking to the Inverse text normalization form. To mask profanity, set the value of the profanity parameter value to `masked`. When profanity is masked, words recognized as part of the language's profanity lexicon are replaced with asterisks. For example: `remind me to buy 5 **** pencils`. Note that the Masked ITN form of a recognition result does not include any capitalization or punctuation. 

> [!NOTE] 
> If the profanity query parameter value is set to `raw`, the Masked ITN form will be exactly
> the same as the ITN form. Profanity will **not** be masked. 

### Display Form
Punctuation and capitalization signal where to put emphasis, where to pause, and so on, which makes text easier to understand. The display form adds punctuation and capitalization to recognition results, making it the most appropriate form for applications that display the spoken text.

The display form of the spoken sentence `Remind me to buy 5 pencils.` is exactly the same: `Remind me to buy 5 pencils.` 

Since Display form extends the Masked ITN form, you can set the profanity parameter value to `masked` or `raw`. If the value is set to `raw`, the recognition results will include any profanity spoken by the user. If `masked`, words recognized as part of the language's profanity lexicon are replaced with asterisks.

## Sample Responses
All payloads are JSON structures.

The payload format of the `simple` phrase result: 
```json
{
  "RecognitionStatus": "Success",
  "DisplayText": "Remind me to buy 5 pencils.",
  "Offset": "1236645672289",
  "Duration": "1236645672289"
}
```

The payload format of the `detailed` phrase result:
```json
{
  "RecognitionStatus": "Success",
  "Offset": "1236645672289",
  "Duration": "1236645672289",
  "N-Best": [
      {
        "Confidence" : "0.87",
        "Lexical" : "remind me to buy five pencils",
        "ITN" : "remind me to buy 5 pencils",
        "MaskedITN" : "remind me to buy 5 pencils",
        "Display" : "Remind me to buy 5 pencils.",
      },
      {
        "Confidence" : "0.54",
        "Lexical" : "rewind me to buy five pencils",
        "ITN" : "rewind me to buy 5 pencils",
        "MaskedITN" : "rewind me to buy 5 pencils",
        "Display" : "Rewind me to buy 5 pencils.",
      }
  ]
}
```
## N-Best Values
A listener, whether human or machine, can never be absolutely certain that they heard *exactly* what was spoken. A listener can only assign a *probability* to a particular interpretation of an utterance. 

In normal conditions, when speaking to others with whom they frequently interact, most people have an extremely high probability of recognizing the meaning of things that they hear and a very high probability of recognizing the actual words that were spoken. Machine-based speech listeners strive to achieve similar accuracy levels and, under the right conditions, they can do as well as humans.

The algorithms used in speech recognition explore alternative interpretations of an utterance as part of normal processing. Usually, these alternatives are discarded as the evidence in favor of a single interpretation becomes overwhelming. In less than optimal conditions, however, the speech recognizer finishes with a list of alternate possible interpretations. It's just not sure.

The top **N** alternatives in this list are called the **N-Best List**. Each alternative is assigned a [confidence score](#confidence) ranging from 0 to 1, where 1 represents the highest level of confidence that this result matches what was actually spoken.

Note that the number of entries in the N-Best List will vary across multiple utterances and even across multiple recognitions of the same utterance: one, two, or even three entries. This variation is a natural and expected outcome of the probabilistic nature of the speech recognition algorithm.
 
## Confidence scores <a id="confidence"></a>
Confidence scores are integral to speech recognition systems. The Microsoft Speech Service obtains these scores from a confidence classifier that is trained over a set of features designed to maximally discriminate between correct and incorrect recognitions. Confidence scores are evaluated for individual words as well as for an entire utterance.

The confidence scores lie in a continuous range between 0 and 1, where 1 indicates the highest confidence.
Lower scores indicate the presence of incorrect recognitions, whether within or outside of the grammar(s) used for recognition. Either the word wasn't included in the grammar(s) specified for this language, or the word was included but not recognized.

If you choose to make use of the confidence scores returned by the Microsoft Speech Service, you should be aware of the following behaviors.
* Confidence scores can only be compared within the same recognition mode and language. Do not compare scores between different languages or different recognition modes. For example, the confidence scores of an utterance sent in interactive recognition mode has **no** correlation to the confidence score of the same utterance sent in dictation mode.
* Confidence scores are best used on a restricted set of utterances. There is naturally a huge degree of variability in the scores for a large set of utterances.

If you choose to make use of the confidence scores as a *threshold* on which your application will take action, you should first execute speech recognition on a representative sample of utterances for your application and then base your threshold values on some percentile of confidence for that sample.
No single threshold value is appropriate for all applications. An acceptable confidence score for one application may be unacceptable for another application; you must establish and maintain threshold values that make sense for your particular application.
 
## Profanity Handling in Speech Recognition
The Microsoft Speech Service recognizes all forms of human speech, including words and phrases that many people would classify as "profanity." You can control how the
Speech Service handles profanity by using the *profanity* query parameter. By default, the Microsoft Speech Service masks profanity in *speech.phrase* results and does
not return *speech.hypothesis* messages that contain profanity.

| *Profanity* Value | Description |
| - | - |
| *masked* | This is the default behavior. The Microsoft Speech Service masks profanity with asterisks. | 
| *removed* | The Microsoft Speech Service removes profanity from all results. |
| *raw* | The Microsoft Speech Service recognizes and returns profanity in all results. |

### Masked Profanity Parameter Value
When the *profanity* query parameter has the value *masked*, or if the *profanity* query parameter is not specified for the request, the Microsoft Speech Service 
replaces profanity in the recognition results with asterisks and does not return *speech.hypothesis* messages that contain profanity.

### Removed Profanity Parameter Value
When the *profanity* query parameter has the value *removed*, the Microsoft Speech Service 
removes profanity from both *speech.phrase* and *speech.hypothesis* messages. The results are the same *as if the profanity words had never been spoken*.

If removing profanity from the *speech.phrase*
result means that all recognition alternatives are eliminated and the recognition mode is *dictation* or *conversation*, the Microsoft Speech Service does not return a 
*speech.result*. If all recognition alternatives are elminated and the recognition mode is *interactive*, the service returns a *speech.result* with the status code *NoMatch*. 

### Raw Profanity Parameter Value
When the *profanity* query parameter has the value *raw*, the Microsoft Speech Service 
does not filter or mask profanity in either the *speech.phrase* or *speech.hypothesis* messages.
