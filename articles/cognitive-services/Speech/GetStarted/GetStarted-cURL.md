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

# Get started with the Speech REST API in cURL

You can use the Bing Speech Recognition API with cURL to convert spoken audio to text by sending audio to Microsoft servers in the cloud. The examples in this article contain bash commands that demonstrate the use of Microsoft Cognitive Services (formerly Project Oxford) Speech To Text API using cURL.

The Speech Recognition web example demonstrates the following features when you use a .wav file or an external microphone input:
 * Access-token generation
 * Short-form recognition
 
This example assumes that cURL is available in your bash environment.

## <a name="Prerequisites"></a>Prerequisites
* Platform requirements: The examples shown in the following sections were developed in bash. They also work in Git Bash, zsh, and other shells.

* Subscribe to Speech API and get a free trial subscription key. Speech API is part of Microsoft Cognitive Services. For subscription and key management details, see [Subscriptions](https://azure.microsoft.com/en-us/try/cognitive-services/). You can use both the primary and secondary keys in this tutorial.

## <a name="Step1"></a>Step 1: Generate an access token
1.	Replace **your_subscription_key** with your own subscription key, and then run the command in bash.

    `curl -v -X POST "https://api.cognitive.microsoft.com/sts/v1.0/issueToken" -H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: 0" -H "Ocp-Apim-Subscription-Key: your_subscription_key"`

2.	The response is a string with the JSON Web Token (JWT) access token:

    `JWT access token`

## <a name="Step2"></a>Step 2: Upload the audio binary

1. Replace **your_locale**, **your_format**, and **your_guid** in accordance with your own application.
2. Replace **your_access_token** with the JWT access token that you retrieved in the [Step 1: Generate an access token](#Step1) section.
3. Replace **your_wave_file** with the actual wave file.
4. In bash, run the following command:

    `curl -v -X POST "https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR&locale=your_locale&format=your_format&requestid=your_guid" -H 'Authorization: Bearer your_access_token' -H 'Content-type: audio/wav; codec="audio/pcm"; samplerate=16000' --data-binary @your_wave_file`

5. Parse the successful recognition response or error response.

## Recognition mode  
Specify the *recognition mode* as part of the URL path for Microsoft Speech Service. The following recognition modes are supported.  

| Mode | Path | URL example |
|---- | ---- | ---- |
| Interactive/Command | /speech/recognition/interactive/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=pt-BR |
| Conversation | /speech/recognition/conversation/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US |
| Dictation | /speech/recognition/dictation/cognitiveservices/v1 | https://speech.platform.bing.com/speech/recognition/dictation/cognitiveservices/v1?language=fr-FR | 

For questions, feedback, or suggestions about Microsoft Cognitive Services, feel free to reach out to us directly at [Cognitive Services UserVoice Forum](https://cognitive.uservoice.com/).

### License

All Microsoft Cognitive Services SDKs and samples are licensed with the MIT License. For more details, see [LICENSE](https://github.com/Microsoft/Cognitive-Speech-STT-JavaScript/blob/master/LICENSE.md).
