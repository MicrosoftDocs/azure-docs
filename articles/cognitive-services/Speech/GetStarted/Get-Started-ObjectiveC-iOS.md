---
title: Get started with Bing Speech Recognition API in Objective C on iOS | Microsoft Docs
description: Use Bing Speech Recognition API to develop iOS applications applications that convert spoken audio to text.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 03/16/2017
ms.author: prrajan
---

# Get Started with Bing Speech Recognition API in Objective C on iOS

With Bing Speech Recognition API you can develop iOS applications that leverage Microsoft cloud servers to convert spoken audio to text. The API supports real-time streaming, so your application can simultaneously and asynchronously receive partial recognition results at the same time it is sending audio to the service 

This article uses a sample application to demonstrate the basics of getting started with the Bing Speech Recognition API to develop an iOS application. For a complete API reference, see [Speech SDK Client Library Reference](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-iOS/master/com.Microsoft.SpeechSDK-1_0-for-iOS.docset/Contents/Resources/Documents/index.html).

<a name="Prereqs"> </a>
## Prerequisites

#### Platform requirements

Make sure Mac XCode IDE is installed.

#### Get the client library and example

You may download the Speech API client library and example for iOS through https [SDK](https://github.com/microsoft/cognitive-speech-stt-ios). The downloaded zip file needs to be extracted to a folder of your choice.
Install the .pkg file on your Mac. The .pkg file will install onto your Mac hard drive in the root (or personal) Documents directory under **SpeechSDK**. Inside the folder there is both a fully buildable example and an SDK library. The buildable example can be found in the **samples\SpeechRecognitionServerExample** directory and the library can be found at the **SpeechSDK\SpeechSDK.framework**.

#### Subscribe to Speech API and get a free trial subscription key

Before creating the example, you must subscribe to Speech API which is part of Cognitive Services. For subscription and key management details, see [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up). Both the primary and secondary key can be used in this tutorial.

<a name="Step1"> </a>
## Step 1: Install the Example Application and Create the Application Framework

Open Xcode IDE. You have two options, building the example application or building your own application.

If you want build and run the **example application**, the project is embedded [here](https://www.projectoxford.ai/SDK/GetFile?path=speech/SpeechToText-SDK-iOS.zip) at **samples\SpeechRecognitionServerExample** and can be opened in XCode.
  * You will need to paste your subscription key into the file “**settings.plist**” which can be found in the **samples** folder under **SpeechRecognitionServerExample**. (You may ignore the LUIS values if you don’t want to use “Intent” right now.)

If you want to **build your own application**, continue on with these instructions.

1.	Create a new application project.
2.	With the items you downloaded from the SDK, do the following:

 **a)**	Click on the project in the file navigator on the left. Then click on the project or target in the editor that appears. Click on "**Build Settings**", then change from "**Basic**" to "**All**".

 **b)**	Inside the directory to which you unpacked the SDK, you will see the directory, **SpeechSDK/SpeechSDK.framework/Headers**. Add an “**Include Search Path**” to include the **Headers** directory.

 **c)**	Inside the directory to which you unpacked the SDK, you will see the directory, **SpeechSDK**. Add a “**Framework Search Path**” to include the **SpeechSDK** directory.

 **d)**	Click on the project in the file navigator on the left. Then click on the project or target in the editor that appears. Click on “**General**”.

 **e)**	Inside the directory to which you unpacked the SDK, you will see the directory, **SpeechSDK/SpeechSDK.framework**. Add **SpeechSDK/SpeechSDK.framework** as a “**Linked Frameworks and Libraries**” via the “**Add Other…**” button found after you click on “**+**”.

 **f)**	Also add **SpeechSDK.framework** as an “**Embedded Binary**” framework.

 **g)**	Note that inside the directory to which you unpacked the SDK in directory **SpeechSDK\Samples\SpeechRecognitionServerExample** there is a XCode buildable example so you can see these settings in action.

<a name="Step2"> </a>
## Step 2: Build the Application / Example Code

Open [ViewController.mm](https://oxfordportal.blob.core.windows.net/example-speech/ViewController.mm) in a new window or find **ViewController.mm** in the downloaded file under **samples\SpeechRecognitionServiceExample**. You will need the **Speech API primary subscription key**. The below code snippet shows where to use the key. (You may ignore the LUIS values if you don’t want to use “Intent” right now.)

```
{
    NSString* language = @"en-us";

    NSString* path = [[NSBundle mainBundle] pathForResource:@"settings" ofType:@"plist"];
    NSDictionary* settings = [[NSDictionary alloc] initWithContentsOfFile:path];

    NSString* primaryOrSecondaryKey = [settings objectForKey:(@"primaryKey")];
    NSString* luisAppID = [settings objectForKey:(@"luisAppID")];
    NSString* luisSubscriptionID = [settings objectForKey:(@"luisSubscriptionID")];

    if (isMicrophoneReco) {
        if (!isIntent) {
            micClient = [SpeechRecognitionServiceFactory createMicrophoneClient:(recoMode)
                                                                   withLanguage:(language)
                                                                        withKey:(primaryOrSecondaryKey)
                                                                   withProtocol:(self)];
        }
        else {
            MicrophoneRecognitionClientWithIntent* micIntentClient;
            micIntentClient = [SpeechRecognitionServiceFactory createMicrophoneClientWithIntent:(language)
                                                                                        withKey:(primaryOrSecondaryKey)
                                                                                  withLUISAppID:(luisAppID)
                                                                                 withLUISSecret:(luisSubscriptionID)
                                                                                   withProtocol:(self)];
            micClient = micIntentClient;
        }
    }
    else {
        if (!isIntent) {
            dataClient = [SpeechRecognitionServiceFactory createDataClient:(recoMode)
                                                              withLanguage:(language)
                                                                   withKey:(primaryOrSecondaryKey)
                                                              withProtocol:(self)];
        }
        else {
            DataRecognitionClientWithIntent* dataIntentClient;
            dataIntentClient = [SpeechRecognitionServiceFactory createDataClientWithIntent:(language)
                                                                                   withKey:(primaryOrSecondaryKey)
                                                                             withLUISAppID:(luisAppID)
                                                                            withLUISSecret:(luisSubscriptionID)
                                                                              withProtocol:(self)];
            dataClient = dataIntentClient;
        }
    }
}

```
 
#### Create a Client
Once your **primaryKey** has been pasted into the example, you can use the **SpeechRecognitionServiceFactory** to create a client of your liking. For example, you can create a client consisting of:

* **DataRecognitionClient:** 
 Speech recognition with PCM data (for example from a file or audio source). The data is broken up into buffers and each buffer is sent to the Speech Recognition Service. No modification is done to the buffers, so the user can apply their own Silence Detection if desired. If the data is provided from wave files, you can send data from the file right to the server. If you have raw data, for example audio coming over Bluetooth, then you first send a format header to the server followed by the data.

* **MicrophoneRecognitionClient:** 
 Speech recognition with audio coming from the microphone. Make sure the microphone is turned on and data from the microphone is sent to the Speech Recognition Service. A built-in “Silence Detector” is applied to the microphone data before it is sent to the recognition service.

* **“WithIntent” Clients:**
 Use “WithIntent” if you want the server to return additional structured information about the speech to be used by apps to parse the intent of the speaker and drive further actions by the app. To use Intent, you will need to train a model and get an AppID and a Secret. See project [LUIS](https://www.luis.ai) for details.

#### Select a Language
When you use the SpeechRecognitionServiceFactory to create the Client, you must select a language.

Supported locales include:

language-Country |language-Country | language-Country |language-Country
---------|----------|--------|------------------
de-DE    |   zh-TW  | zh-HK  |    ru-RU
es-ES    |   ja-JP  | ar-EG* |    da-DK
en-GB    |   en-IN  | fi-FI  |    nl-NL
en-US    |   pt-BR  | pt-PT  |    ca-ES
fr-FR    |   ko-KR  | en-NZ  |    nb-NO
it-IT    |   fr-CA  | pl-PL  |    es-MX
zh-CN    |   en-AU  | en-CA  |    sv-SE
*ar-EG supports Modern Standard Arabic (MSA)

#### Select a Recognition Mode
You also need to provide the recognition mode.

* **ShortPhrase mode:** An utterance up to 15 seconds long.
As data is sent to the service, the client will receive multiple partial results and one final multiple n-best choice result.

* **LongDictation mode:** An utterance up to 2 minutes long.
As data is sent to the service, the client will receive multiple partial results and multiple final results, based on where the server identifies sentence pauses.

#### Attach Event Handlers
You can attach various event handlers to the client you created.

* **Partial Results Events:** This event gets called every time the Speech Recognition Service predicts what you might be saying – even before you finish speaking (if you are using the Microphone Client) or have finished sending data (if you are using the Data Client).

* **Error Events:** Called when the service detects an Error.

* **Intent Events:** Called on “WithIntent” clients (only in ShortPhrase mode) after the final reco result has been parsed into a structured JSON intent.

* **Result Events:**
  * **In ShortPhrase mode**, this event is called and returns n-best results after you finish speaking.
  * **In LongDictation mode**, the event handler is called multiple times, based on where the service identifies sentence pauses.
  * **For each of the n-best choices**, a confidence value and a few different forms of the recognized text are returned:

      *	**LexicalForm:** This form is optimal for use by applications that need the raw, unprocessed speech recognition result.

      *	**DisplayText:** The recognized phrase with inverse text normalization, capitalization, punctuation and profanity masking applied. Profanity is masked with asterisks after the initial character, for example "d***". This form is optimal for use by applications that display the speech recognition results to users.

      *	**Inverse Text Normalization (ITN):** An example of ITN is converting result text from "go to fourth street" to "go to 4th St". This form is optimal for use by applications that display the speech recognition results to users.

      *	**InverseTextNormalizationResult:** Inverse text normalization (ITN) converts phrases like "one two three four" to a normalized form such as "1234". Another example is converting result text from "go to fourth street" to "go to 4th St". This form is optimal for use by applications that interpret the speech recognition results as commands or perform queries based on the recognized text.

      *	**MaskedInverseTextNormalizationResult:** The recognized phrase with inverse text normalization and profanity masking applied, but no capitalization or punctuation. Profanity is masked with asterisks after the initial character, e.g. "d***". This form is optimal for use by applications that display the speech recognition results to users. Inverse Text Normalization (ITN) has also been applied. An example of ITN is converting result text from "go to fourth street" to "go to 4th st". This form is optimal for use by applications that use the unmasked ITN results, but also need to display the command or query to users.

<a name="Step3"> </a>
## Step 3: Run the Example Application

Run the application with the chosen clients, recognition modes and event handlers.

<a name="Related"> </a>
## Related Topics

 * [Get started with Bing Speech Recognition and/or intent in Java on Android](GetStartedJavaAndroid.md)
 * [Get started with Bing Speech API in JavaScript](GetStartedJS.md)
 * [Get started with Bing Speech API in cURL](GetStarted-cURL.md)

