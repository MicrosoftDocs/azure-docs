---
title: Get started with the Azure Speech REST API using cURL | Microsoft Docs
description: Apply the Azure Speech Recognition API in Microsoft Cognitive Services by using cURL to convert spoken audio to text.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 03/16/2017
ms.author: prrajan
---

# Get Started with Speech REST API in cURL

Exercise Bing Speech Recognition API using cURL to convert spoken audio to text by sending audio to Microsoft’s servers in the cloud. The example below is **bash** commands that demonstrates the use of Microsoft Cognitive Services (formerly Project Oxford) Speech To Text API using **cURL**.

The Speech Recognition web example demonstrates the following features using a wav file or external microphone input:
 * Access token generation
 * Short-form recognition
This example assumes that **cURL** is available in your bash environment.

## <a name="Prerequisites"></a>Prerequisites
* #### Platform requirements
The below example has been developed in **bash**. (Also works in git bash/zsh/etc)

* #### Subscribe to Speech API and get a free trial subscription key
Before creating the example, you must subscribe to Speech API which is part of Microsoft Cognitive Services. For subscription and key management details, see [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up). Both the primary and secondary key can be used in this tutorial.

## <a name="Step1"></a>Step 1: Generate an Access Token
1.	Replace **your_subscription_key** with your own subscription key and run the command in **bash**.

    `curl -v -X POST "https://api.cognitive.microsoft.com/sts/v1.0/issueToken" -H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: 0" -H "Ocp-Apim-Subscription-Key: your_subscription_key"`

2.	The response is a string with the JSON Web Token (JWT) access token.
    `JWT access token`

## <a name="Step2"></a>Step 2: Upload the Audio Binary
1. Replace **your_locale**, **your_format**, **your_guid** in accordance to your own application
2. Replace **your_access_token** with the JWT access token retrieved from [Step 1](#Step1)
3. Replace **your_wave_file** with the actual wave file
4. Run the command in **bash**

    `curl -v -X POST "https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR&locale=your_locale&format=your_format&requestid=your_guid" -H 'Authorization: Bearer your_access_token' -H 'Content-type: audio/wav; codec="audio/pcm"; samplerate=16000' --data-binary @your_wave_file`

5. Parse the Succcessful recognition response or Error response

## Recognition Mode  
You specify the *recognition mode* as part of the URL path for the Microsoft Speech Service. The following recognition modes are supported.  

| Mode | Path | URL Example |
|---- | ---- | ---- |
| Interactive/Command | /speech/recognition/interactive/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR |
| Conversation | /speech/recognition/conversation/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US |
| Dictation | /speech/recognition/dictation/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR | 

For questions, feedback, or suggestions about Microsoft Cognitive Services, feel free to reach out to us directly.

 * Cognitive Services [UserVoice Forum](https://cognitive.uservoice.com/)

### License

All Microsoft Cognitive Services SDKs and samples are licensed with the MIT License. For more details, see [LICENSE](https://github.com/Microsoft/Cognitive-Speech-STT-JavaScript/blob/master/LICENSE.md).
