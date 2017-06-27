---
title: Speech Recognition API in Microsoft Cognitive Services | Microsoft Docs
description: Use the Bing Speech Recognition REST API in contexts that need cloud-based speech recognition capabilities.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 06/05/2017
ms.author: jstock
---

# Convert speech to text with Microsoft APIs
You can choose to convert speech to text by using either an [HTTP-based REST protocol](#REST_protocol) or a [WebSocket-based protocol](#WebSocket_protocol). The protocol that you select depends on the needs of your application.

## REST Speech Recognition API <a id="REST_protocol"></a>
The Microsoft [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) Speech Recognition API is an HTTP 1.1 protocol definition for building simple speech applications that perform speech recognition. This API is most suitable for applications where continuous user feedback is not required or for platforms that do not support the [IETF WebSocket standard](https://tools.ietf.org/html/rfc6455). The REST API has the following characteristics:

* Utterances are limited to a maximum of 15 seconds.
* Partial results are not returned. Only the final phrase result is returned.
* Service end-of-speech detection is not supported. Clients must determine the end of speech. 
* A single recognition phrase result is returned to the client only after the client stops writing to the request stream.
* Continuous recognition is not supported. 

If these features are important to your application's functionality, use the [WebSocket API](#WebSocket_protocol).

## WebSocket Speech Recognition API <a id="WebSocket_protocol"></a>
The Microsoft WebSocket Speech Recognition API is a service protocol definition that uses a [WebSocket](https://tools.ietf.org/html/rfc6455) for bidirectional communication. With this API, you can build full-featured speech applications that provide a rich user experience.

A [JavaScript SDK](../GetStarted/GettingStartedJSWebsockets.md) is available based on this version of protocol. SDKs for additional languages and platforms are in development. If your language or platform does not yet have an SDK, you can create your own implementation based on the [protocol documentation](websocketprotocol.md).

## Endpoints
The API endpoints that are based on user scenarios are highlighted here:

| Mode | Path | Example URL |
|-----|-----|-----|
|Interactive|/speech/recognition/interactive/cognitiveservices/v1 |[https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR](https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR) | 
| Conversation	|/speech/recognition/conversation/cognitiveservices/v1 |[https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US](https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US) |
|Dictation|	/speech/recognition/dictation/cognitiveservices/v1	|[https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR](https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR)  |

## Recognition modes
There are three modes of recognition: interactive, conversation, and dictation. The recognition mode adjusts speech recognition based on how the users are likely to speak. Choose the appropriate recognition mode for your application. 

> [!NOTE]
> Recognition modes might have different behaviors in the REST protocol than they do in the WebSocket protocol. For example, the REST API does not support continuous recognition, even in conversation or dictation mode.

The Microsoft Speech Service returns only one recognition phrase result for all recognition modes. There is a limit of 15 seconds for any single utterance.

### Interactive mode
In *interactive* mode, a user makes short requests and expects the application to perform an action in response. 

The following characteristics are typical of interactive mode applications:
* Users know they are speaking to a machine and not to another human.
* Application users know ahead of time what they want to say, based on what they want the application to do.
* Utterances typically last about 2-3 seconds.

### Conversation mode
In *conversation* mode, users are engaged in a human-to-human conversation.

The following characteristics are typical of conversation mode applications:

* Users know that they are talking to another person.
* Speech recognition enhances the human conversations by allowing one or both participants to see the spoken text.
* Users do not always plan what they want to say.
* Users frequently use slang and other informal speech.

### Dictation mode
In *dictation*  mode, users recite longer utterances to the application for further processing.

The following characteristics are typical of dictation mode applications:
* Users know that they are talking to a machine.
* Users are shown the speech recognition text results. 
* Users often plan what they want to say and use more formal language.
* Users employ full sentences that last 5-8 seconds.

> [!NOTE]
> In dictation and conversation modes, the Microsoft Speech Service does not return partial results. Instead, the service returns stable phrase results after silence boundaries in the audio stream. Microsoft might enhance the speech protocol to improve the user experience in these continuous recognition modes.

## Recognition language 
The *recognition language* specifies the language that your application user speaks. Specify the *recognition language* with the *language* URL query parameter on the connection. The value of the *language* query parameter *must* be one of the languages that are supported by the service, as specified in [BCP 47](https://en.wikipedia.org/wiki/IETF_language_tag) format. 

The Microsoft Speech Service rejects invalid connection requests by displaying an ```HTTP 400 Bad Request``` response. An invalid request is one that:
* Does not include a *language* query parameter value.
* Includes a *language* query parameter that is incorrectly formatted.
* Includes a *language* query parameter that is not one of the support languages.

You may choose to build an application that supports one or all of the languages that are supported by the service.

### Example
In the following example, an application uses *conversation* speech recognition mode for a US English speaker.

```
https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US
```

### Interactive and dictation mode
The Microsoft Speech Recognition API supports the following languages in *interactive* and *dictation* modes. 

|Code | Language | Code | Language |
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
| fi-FI | Finnish (Finland) |zh-HK | Chinese (Hong Kong SAR) |
| fr-CA | French (Canada) | zh-TW | Chinese (Mandarin, Taiwanese)|
| fr-FR | French (France) | ||

### Conversation mode
The Microsoft Speech Recognition API supports the following languages in *conversation* modes. 

| Code | Language | Code | Language |
|-----|-----|-----|-----|
| ar-EG | Arabic (Egypt), modern standard | It-IT | Italian (Italy) |
| de-DE | German (Germany) | ja-JP | Japanese (Japan) |
| en-US | English (United States) | pt-BR | Portuguese (Brazil) |
| es-ES | Spanish (Spain) | ru-RU | Russian (Russia) |
| fr-FR | French (France) | zh-CN | Chinese (Mandarin, simplified) |
 
## Output format
The Microsoft Speech Service can return a variety of payload formats of recognition phrase results. All payloads are JSON structures. 

You can control the phrase result format by specifying the `format` URL query parameter. By default, the service returns `simple` results. 

| Format | Description |
|-----|-----|
| simple | A simplified phrase result containing the recognition status and the recognized text in display form. |
| detailed | A recognition status and N-best list of phrase results where each phrase result contains all four recognition forms and a confidence score. |

The *detailed* format contains the following four recognition forms.

### Lexical form
The lexical form is the recognized text, exactly how it occurred in the utterance and without punctuation or capitalization. For example, the lexical form of the address "1020 Enterprise Way" would be *ten twenty enterprise way*, assuming that it was spoken that way. The lexical form of the sentence "Remind me to buy 5 pencils" is *remind me to buy five pencils*.

The lexical form is most appropriate for applications that need to perform non-standard text normalization. The lexical form is also appropriate for applications that need unprocessed recognition words.

Profanity is never masked in the lexical form.

### ITN form
Text normalization is the process of converting text from one form to another "canonical" form. For example, the phone number "555-1212" might be converted to the canonical form *five five five one two one two*. *Inverse* text normalization (ITN) reverses this process, converting the words "five five five one two one two" to the inverted canonical form *555-1212*. The ITN form of a recognition result does not include capitalization or punctuation. 

The ITN form is most appropriate for applications that act on the recognized text. For example, an application that allows a user to speak search terms and then uses these terms in a web query would use the ITN form. Profanity is never masked in the ITN form. To mask profanity, use the *Masked ITN form*.

### Masked ITN form
Because profanity is naturally a part of spoken language, the Microsoft Speech Service recognizes such words and phrases when they are spoken. Profanity might not, however, be appropriate for all applications, especially those applications with a restricted, non-adult user audience.

The masked ITN form applies profanity masking to the inverse text normalization form. To mask profanity, set the value of the profanity parameter value to `masked`. When profanity is masked, words that are recognized as part of the language's profanity lexicon are replaced with asterisks. For example: *remind me to buy 5 **** pencils*. The masked ITN form of a recognition result does not include capitalization or punctuation. 

> [!NOTE] 
> If the profanity query parameter value is set to `raw`, the masked ITN form is the same as the ITN form. Profanity is *not* masked. 

### Display form
Punctuation and capitalization signal where to put emphasis, where to pause, and so on, which makes text easier to understand. The display form adds punctuation and capitalization to recognition results, making it the most appropriate form for applications that display the spoken text.

Because the display form extends the masked ITN form, you can set the profanity parameter value to `masked` or `raw`. If the value is set to `raw`, the recognition results include any profanity spoken by the user. If the value is set to `masked`, words recognized as part of the language's profanity lexicon are replaced with asterisks.

## Sample responses
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
## N-best values
Listeners, whether human or machine, can never be certain that they heard *exactly* what was spoken. A listener can assign a *probability* only to a particular interpretation of an utterance. 

In normal conditions, when speaking to others with whom they frequently interact, people have a high probability of recognizing the words that were spoken. Machine-based speech listeners strive to achieve similar accuracy levels and, under the right conditions, [they achieve parity with humans](https://blogs.microsoft.com/next/2016/10/18/historic-achievement-microsoft-researchers-reach-human-parity-conversational-speech-recognition/#sm.001ykosqs14zte8qyxj2k9o28oz5v).

The algorithms that are used in speech recognition explore alternative interpretations of an utterance as part of normal processing. Usually, these alternatives are discarded as the evidence in favor of a single interpretation becomes overwhelming. In less than optimal conditions, however, the speech recognizer finishes with a list of alternate possible interpretations. The top *N* alternatives in this list are called the *N-best list*. Each alternative is assigned a [confidence score](#confidence). Confidence scores range from 0 to 1. A score of 1 represents the highest level of confidence. A score of 0 represents the lowest level of confidence.

> [!NOTE]
> The number of entries in the N-best list vary across multiple utterances. The number of entries can vary across multiple recognitions of the *same* utterance. This variation is a natural and expected outcome of the probabilistic nature of the speech recognition algorithm.
 
## Confidence scores <a id="confidence"></a>
Confidence scores are integral to speech recognition systems. The Microsoft Speech Service obtains confidence scores from a *confidence classifier*. Microsoft trains the confidence classifier over a set of features that are designed to maximally discriminate between correct and incorrect recognition. Confidence scores are evaluated for individual words and entire utterances.

If you choose to use the confidence scores that are returned by the service, be aware of the following behavior:
* Confidence scores can be compared only within the same recognition mode and language. Do not compare scores between different languages or different recognition modes. For example, a confidence score in interactive recognition mode has *no* correlation to a confidence score in dictation mode.
* Confidence scores are best used on a restricted set of utterances. There is naturally a great degree of variability in the scores for a large set of utterances.

If you choose to use a confidence score value as a *threshold* on which your application acts, use speech recognition to establish the threshold values.
* Execute speech recognition on a representative sample of utterances for your application.
* Collect the confidence scores for each recognition in the sample set.
* Base your threshold value on some percentile of confidence for that sample.

No single threshold value is appropriate for all applications. An acceptable confidence score for one application might be unacceptable for another application.
 
## Profanity-handling in speech recognition
The Microsoft Speech Service recognizes all forms of human speech, including words and phrases that many people would classify as "profanity." You can control how the service handles profanity by using the *profanity* query parameter. By default, the service masks profanity in *speech.phrase* results and does not return *speech.hypothesis* messages that contain profanity.

| *Profanity* value | Description |
| - | - |
| *masked* | Masks profanity with asterisks. This behavior is the default. | 
| *removed* | Removes profanity from all results. |
| *raw* | Recognizes and returns profanity in all results. |

### Masked profanity parameter value
To mask profanity, set the *profanity* query parameter to the value *masked*. When the *profanity* query parameter has this value or is not specified for a request, the service *masks* profanity. The service performs masking by replacing profanity in the recognition results with asterisks. When you specify profanity-masking handling, the service does not return *speech.hypothesis* messages that contain profanity.

### Removed profanity parameter value
When the *profanity* query parameter has the value *removed*, the service removes profanity from both *speech.phrase* and *speech.hypothesis* messages. The results are the same *as if the profanity words were not spoken*.

#### Profanity-only utterances
A user might speak *only* profanity when an application has configured the service to remove profanity. For this scenario, if the recognition mode is *dictation* or *conversation*, the service does not return a *speech.result*. If the recognition mode is *interactive*, the service returns a *speech.result* with the status code *NoMatch*. 

### Raw profanity parameter value
When the *profanity* query parameter has the value *raw*, the service does not remove or mask profanity in either the *speech.phrase* or *speech.hypothesis* messages.
