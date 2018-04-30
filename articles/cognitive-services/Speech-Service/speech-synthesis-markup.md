---
title: The Speech Synthesis Markup Language | Microsoft Docs
description: Using the Speech Synthesis Markup language to control pronuciation and prosody in text-to-speech.
services: cognitive-services
author: v-jerkin
manager: chriswendt1

ms.service: cognitive-services
ms.component: speech
ms.topic: article
ms.date: 4/28/2018
ms.author: v-jerkin
---

# The Speech Synthesis Markup Language

The Speech Synthesis Markup Language (SSML) is an XML-based markup language that provides a way to control the pronunciation and *prosody* of text-to-speech. (Prosody refers to the rhythm and pitch of speech—its music, if you will.) You can specify words phonetically, provide hints for interpreting numbers, insert pauses, control pitch, volume, and rate, and more.

For more information, see [Speech Synthesis Markup Language (SSML) Version 1.0](http://www.w3.org/TR/2009/REC-speech-synthesis-20090303/) at the W3C.

## Examples

The following examples show how to use SSML for common speech synthesis needs.

### Adding a break
```xml
<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)'> Welcome to Microsoft Cognitive Services <break time="100ms" /> Text-to-Speech API.</voice> </speak>
```

### Change rate
```xml
<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)'><prosody rate="+30.00%">Welcome to Microsoft Cognitive Services Text-to-Speech API.</prosody></voice> </speak>
```

### Pronunciation
```xml
<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)'> <phoneme alphabet="ipa" ph="t&#x259;mei&#x325;&#x27E;ou&#x325;"> tomato </phoneme></voice> </speak>
```

### Change volume
```xml
<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'><prosody volume="+20.00%">Welcome to Microsoft Cognitive Services Text-to-Speech API.</prosody></voice> </speak>
```

### Change pitch
```xml
<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, Guy24kRUS)'>Welcome to <prosody pitch="high">Microsoft Cognitive Services Text-to-Speech API.</prosody></voice> </speak>
```

### Change prosody contour
```xml
<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'><prosody contour="(80%,+20%) (90%,+30%)" >Good morning.</prosody></voice> </speak>
```