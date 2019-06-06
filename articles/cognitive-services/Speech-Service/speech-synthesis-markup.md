---
title: Speech Synthesis Markup Language (SSML) - Speech Services
titleSuffix: Azure Cognitive Services
description: Using the Speech Synthesis Markup Language to control pronunciation and prosody in text-to-speech.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/13/2018
ms.author: erhopf
ms.custom: seodec18
---

# Speech Synthesis Markup Language (SSML)

The Speech Synthesis Markup Language (SSML) is an XML-based markup language that provides a way to control the pronunciation and *prosody* of text-to-speech. Prosody refers to the rhythm and pitch of speech—its music, if you will. You can specify words phonetically, provide hints for interpreting numbers, insert pauses, control pitch, volume, and rate, and more. For more information, see [Speech Synthesis Markup Language (SSML) Version 1.0](https://www.w3.org/TR/2009/REC-speech-synthesis-20090303/). 

For a complete list of supported languages, locales, and voices (neural and standard), see [language support](language-support.md#text-to-speech).

The following sections provide samples for common speech synthesis tasks.

## Adjust speaking style for neural voices

You can use SSML to adjust the speaking style when using one of the neural voices.

By default, the text-to-speech service synthesizes text in a neutral style. The neural voices extend SSML with an `<mstts:express-as>` element that converts text to synthesized speech in different speaking styles. Currently, the style tags are only supported with these voices:

* `en-US-JessaNeural` 
* `zh-CN-XiaoxiaoNeural`.

Speaking style changes can be applied at the sentence level. The styles vary by voice. If a style type is not supported, the service will return the synthesized speech as the default neutral style.

| Voice | Style | Description | 
|-----------|-----------------|----------|
| `en-US-JessaNeural` | type=`cheerful` | Expresses an emotion that is positive and happy |
| | type=`empathy` | Expresses a sense of caring and understanding |
| `zh-CN-XiaoxiaoNeural` | type=`newscast` | Expresses a formal tone, similar to news broadcasts |
| | type=`sentiment ` | Conveys a touching message or a story |

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name='en-US-JessaNeural'>
<mstts:express-as type="cheerful"> 
    That'd be just amazing! 
</mstts:express-as></voice></speak>
```

## Add a break
```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Jessa24kRUS'>
    Welcome to Microsoft Cognitive Services <break time="100ms" /> Text-to-Speech API.
</voice> </speak>
```

## Change speaking rate

Speaking rate can be applied to standard voices at the word or sentence-level. Whereas speaking rate can only be applied to neural voices at the sentence level.

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Guy24kRUS'>
<prosody rate="+30.00%">
    Welcome to Microsoft Cognitive Services Text-to-Speech API.
</prosody></voice> </speak>
```

## Pronunciation
```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Jessa24kRUS'>
    <phoneme alphabet="ipa" ph="t&#x259;mei&#x325;&#x27E;ou&#x325;"> tomato </phoneme>
</voice> </speak>
```

## Change volume

Volume changes can be applied to standard voices at the word or sentence-level. Whereas volume changes can only be applied to neural voices at the sentence level.

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Jessa24kRUS'>
<prosody volume="+20.00%">
    Welcome to Microsoft Cognitive Services Text-to-Speech API.
</prosody></voice> </speak>
```

## Change pitch

Pitch changes can be applied to standard voices at the word or sentence-level. Whereas pitch changes can only be applied to neural voices at the sentence level.

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
    <voice  name='en-US-Guy24kRUS'>
    Welcome to <prosody pitch="high">Microsoft Cognitive Services Text-to-Speech API.</prosody>
</voice> </speak>
```

## Change pitch contour

> [!IMPORTANT]
> Pitch contour changes aren't supported with neural voices.

```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Jessa24kRUS'>
<prosody contour="(80%,+20%) (90%,+30%)" >
    Good morning.
</prosody></voice> </speak>
```

## Use multiple voices
```xml
<speak version='1.0' xmlns="https://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='en-US-Jessa24kRUS'>
    Good morning!
</voice>
<voice  name='en-US-Guy24kRUS'>
    Good morning to you too Jessa!
</voice> </speak>
```

## Next steps

* [Language support: voices, locales, languages](language-support.md)
