---
title: Bing Speech Recognition Service Library in Cognitive Services | Microsoft Docs
description: Use the Microsoft Speech Recognition Service Library to convert spoken language to text.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 02/17/2017
ms.author: prrajan
---

# Get Started with Bing Speech Recognition Service Library in C&#35; for .Net Windows
With Microsoft Speech Recognition Service Library, your service can utilize the power of Microsoft Speech transcription cloud to convert spoken language to text. This service-to-service library works in real-time so your client app can send audio to servers in the cloud and start receiving partial recognition results back simultaneously and asynchronously. For library API reference, see the [Microsoft Bing Speech SDK](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary/master/docs/index.html). 

<a name="Sample"></a>
## Speech Recognition Service C# Sample
This section describes how to install, build, and run the C# sample application.
### Prerequisites
* **Platform Requirements**: The below example has been developed for Windows 8+ and .NET 4.5+ Framework using [Visual Studio 2015, Community Edition] (https://www.visualstudio.com/products/visual-studio-community-vs).
* **Get the Service Library and Sample Application**: The library is available through a [Nuget Package](https://www.nuget.org/packages/Microsoft.Bing.Speech/). 
 You may clone the sample through [Github](https://github.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary). 
* **Subscribe to Speech API and Get a Free Trial Subscription Key**: Before creating the example, you must subscribe to Speech API which is part of Microsoft Cognitive Services (previously Project Oxford). For subscription and key management details, see [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up). 
 Both the primary and secondary key can be used in this tutorial.

## <a name="Step1">Step 1: Install the Sample Application.
1. Start Microsoft Visual Studio 2015 and click **File**, select **Open**, then **Project/Solution**.  
2. Double-click to open the Visual Studio 2015 Solution (.sln) file named **SpeechClient.sln**. This will open the solution in Visual Studio.

## <a name="Step2"> Step 2: Build the Sample Application.   
Press Ctrl+Shift+B, or click **Build** on the ribbon menu, then select **Build Solution**.

## <a name="Step3">Step 3: Run the Sample Application.  
1. After the build is complete, press **F5** or click **Start** on the ribbon menu to run the example.  
2. Open the output directory for the sample (**SpeechClientSample\bin\Debug**), press **Shift+Right Click**, press **Open command window here**.  
3. Run **SpeechClientSample.exe** with the following arguments:   
 * Arg[0]: Specify an input audio wav file.    
 * Arg[1]: Specify the audio locale.
 * Arg[2]: Specify the service uri.
 * Arg[3]: Specify the subscription key to access the Speech Recognition Service.  
 
## <a name="Modes">Recognition Modes</a>  
* **ShortPhrase mode:** an utterance up to 15 seconds long. As data is sent to the server, the client will receive multiple partial results and one final best result.  
* **LongDictation mode:** an utterance up to 10 minutes long. As data is sent to the server, the client will receive multiple partial results and multiple final results, based on where the server indicates sentence pauses.

## <a name="ServiceUri"> Service Uri</a>
**Recognition Mode** |  Service Uri |  
------|------  
Short-Form | wss://speech.platform.bing.com/api/service/recognition  
Long-Form  | wss://speech.platform.bing.com/api/service/recognition/continuous

##  <a name="Formats">Supported Audio formats</a>
The Voice API supports audio/wav using the following codecs: 
* PCM single channel
* Siren 
* SirenSR

## <a name="Preferences">Preferences</a>  
To create a SpeechClient, you need to first create a Preferences object. The Preferences object is a set of parameters
that configures the behavior of the speech service. It consists of the following fields:  
* **SpeechLanguage:** The locale of the audio being sent to the speech service.  
* **ServiceUri:** The endpoint use to call the speech service.  
* **AuthorizationProvider:** An IAuthorizationProvider implemetation used to fetch tokens in order to access the speech service. Although the sample provides a Cognitive Services authorization provider, it is highly recommended to create your own implementation to handle 
token caching.  
* **EnableAudioBuffering:** An advanced option, please see [Connection Management](#connection-management)

## <a name="Input">Speech Input</a>
The SpeechInput object consists of 2 fields:    
* **Audio**: A stream implementation of your choice that the SDK will pull audio from. Please note that this could be any [Stream](https://msdn.microsoft.com/en-us/library/system.io.stream(v=vs.110).aspx) that supports reading. **Note**: the SDK detects the end of of the stream when it the stream returns **0** when attempting to read from it. 
* **RequestMetadata**: Metadata about the speech request. For more details refer to the documentation.
 
##  <a name="Request">Speech Request</a>
Once you have instantiated a SpeechClient and SpeechInput objects, use RecognizeAsync to make a request to the speech service.  
**var task = speechClient.RecognizeAsync(speechInput);**  
The task returned by RecognizeAsync completes once the request completes. The last RecognitionResult that the server thinks is the end of the recognition. The task can Fault if the server or the SDK fails unexpectedly.

## <a name="Events">Speech Events</a>
#### Partial Results Event:
This event gets called every time the Speech Recognition Server has an idea of what the speaker might be saying – even before the user has finished speaking (if you are using the Microphone Client) or have finish transferring data (if you are using the Data Client). You can subscribe to the event using  
**SpeechClient.SubscribeToPartialResult();**  
Or use the generic events subscription method    
**SpeechClient.SubscribeTo<RecognitionPartialResult>();**  

**Return Format** |  Description |  
------|------  
**LexicalForm** | This form is optimal for use by applications that need raw, unprocessed speech recognition results.  
**DisplayText** | The recognized phrase with inverse text normalization, capitalization, punctuation and profanity masking applied. Profanity is masked with asterisks after the initial character, e.g. "d***". This form is optimal for use by applications that display the speech recognition results to a user.  
**Confidence** | Indicates the level of confidence the recognized phrase represents the audio associated as defined by the Speech Recognition Server.  
**MediaTime** | The current time relative to the start of the audio stream (In 100-nanosecond units of time).  
**MediaDuration** | The current phrase duration/length relative to the audio segment (In 100-nanosecond units of time).

#### Result Event:
When you have finished speaking (in ShortPhrase mode), this event is called. You will be provided with n-best choices for the result. In LongDictation mode, the event can be called multiple times, based on where the server thinks sentence pauses are. You can subscribe to the event using  
**SpeechClient.SubscribeToRecognitionResult();**  
Or Use the generic events subscription method    
**SpeechClient.SubscribeTo<RecognitionResult>();**   

**Return Format** | Description |  
------|------  
**RecognitionStatus**|The status on how the recognition was produced.  For example, was it produced as a result of successful recognition, or as a result of canceling the connection, etc.  
**Phrases** | The set of n-best recognized phrases with the recognition confidence. Refer to the above table for phrase format.

## <a name="Response">Speech Response</a>
Speech Response example:
```
--- Partial result received by OnPartialResult  
---what  
--- Partial result received by OnPartialResult  
--what's  
--- Partial result received by OnPartialResult  
---what's the web  
--- Partial result received by OnPartialResult   
---what's the weather like  
---***** Phrase Recognition Status = [Success]   
***What's the weather like? (Confidence:High)  
What's the weather like? (Confidence:High) 
```

## <a name="Connection">Connection Management</a>
The APIs utilizes a single web-socket connection per request. For optimal user experience, the SDK will attempt to reconnect to the speech service and start the recognition from the last RecognitionResult that it received. For example, if the audio request is 2 minutes long and the SDK received a RecognitionEvent at the 1 minute mark, then a network failure occurred after 5 seconds, the SDK will start a new connection starting from the 1 minute mark. 

>[!NOTE]
>The SDK does not seek back to the 1 minute mark, as the Stream may not support seeking. Instead the SDK keep internal 
buffer that it uses to buffer the audio and clears the buffer as it received RecognitionResult events.

## <a name="Buffering">Buffering Behavior</a>
By default, the SDK buffers audio so it can recover when a network interrupt occurs. In some scenario where it is preferable to discard the audio lost during the network disconnect and restart the connection where the stream at due to performance 
considerations, it is best to disable audio buffering by setting **EnableAudioBuffering** in the Preferences object to **false**.
 
