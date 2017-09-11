---
title: Get started with the Bing Speech API in Objective-C on iOS | Microsoft Docs
description: Use the Bing Speech API to develop iOS applications that convert spoken audio to text.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 03/16/2017
ms.author: prrajan
---

# Get started with the Bing Speech API in Objective-C on iOS

With the Bing Speech API, you can develop iOS applications that use Microsoft cloud servers to convert spoken audio to text. The API supports real-time streaming, so your application can simultaneously and asynchronously receive partial recognition results at the same time it sends audio to the service.

This article uses a sample application to demonstrate how to get started with the Bing Speech API to develop an iOS application. For a complete API reference, see the [Speech SDK client library reference](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-iOS/master/com.Microsoft.SpeechSDK-1_0-for-iOS.docset/Contents/Resources/Documents/index.html).

<a name="Prereqs"> </a>
## Prerequisites

### Platform requirements

Make sure the Mac XCode IDE is installed.

### Get the client library and the example

Download the Bing Speech API client library and the example for iOS from the [SDK](https://github.com/microsoft/cognitive-speech-stt-ios). Extract the downloaded zip file to a folder of your choice.

Install the .pkg file on your Mac. The .pkg file installs on your Mac hard drive in the root (or personal) Documents directory under **SpeechSDK**. Inside the folder, there is a fully buildable example and an SDK library. The buildable example can be found in the **samples\SpeechRecognitionServerExample** directory. The library can be found at the **SpeechSDK\SpeechSDK.framework**.

### Subscribe to the Bing Speech API, and get a free trial subscription key

Before you create the example, you must subscribe to the Bing Speech API, which is part of Azure Cognitive Services. For subscription and key management details, see [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up). Both the primary and secondary key can be used in this tutorial.

<a name="Step1"> </a>
## Step 1: Install the example application, and create the application framework

Open the Xcode IDE. You have two options. You can build the example application, or you can build your own application.

To build and run the example application: 

1. The project is embedded on this [website](https://www.projectoxford.ai/SDK/GetFile?path=speech/SpeechToText-SDK-iOS.zip) at **samples\SpeechRecognitionServerExample**. You can open it in XCode.

2. Paste your subscription key into the file **settings.plist**, which you can find in the **samples** folder under **SpeechRecognitionServerExample**. (If you don't want to use **Intent** right now, ignore the LUIS values.)

To build your own application, continue with these instructions:

1. Create a new application project.

2. With the items you downloaded from the SDK, do the following:

    a.	Select the project in the file navigator on the left. In the editor that appears, select the project or target. Select **Build Settings**, and then change from **Basic** to **All**.

    b.	Inside the directory where you unpacked the SDK, you see the directory **SpeechSDK/SpeechSDK.framework/Headers**. Add an **Include Search Path** to include the **Headers** directory.

    c. Inside the directory where you unpacked the SDK, you see the directory **SpeechSDK**. Add a **Framework Search Path** to include the **SpeechSDK** directory.

    d. Select the project in the file navigator on the left. In the editor that appears, select the project or target. Then select **General**.

    e.	Inside the directory where you unpacked the SDK, you see the directory **SpeechSDK/SpeechSDK.framework**. Select **+**, and select **Add Other**. Add **SpeechSDK/SpeechSDK.framework** as a **Linked Frameworks and Libraries**.

    f.	Add **SpeechSDK.framework** as an **Embedded Binary** framework.

    g.	Inside the directory where you unpacked the SDK in the **SpeechSDK\Samples\SpeechRecognitionServerExample** directory is an XCode buildable example. You can use it to see these settings in action.

<a name="Step2"> </a>
## Step 2: Build the application/example code

Open the [ViewController.mm](https://oxfordportal.blob.core.windows.net/example-speech/ViewController.mm) in a new window, or find **ViewController.mm** in the downloaded file under **samples\SpeechRecognitionServiceExample**. You need the **Speech API primary subscription key**. The following code snippet shows where to use the key. (If you don't want to use **Intent** right now, ignore the LUIS values.)

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
 
### Create a client
After you paste **primaryKey** into the example, use **SpeechRecognitionServiceFactory** to create a client of your liking. For example, you can create a client consisting of:

* **DataRecognitionClient**. 
 Speech recognition with PCM data (for example, from a file or audio source). The data is broken up into buffers, and each buffer is sent to the speech recognition service. The buffers aren't modified, so the user can apply their own silence detection if they want. If the data is provided from wave files, you can send data from the file right to the server. If you have raw data, for example, audio coming over Bluetooth, first send a format header to the server followed by the data.

* **MicrophoneRecognitionClient**.
 Speech recognition with audio coming from the microphone. Make sure the microphone is turned on and data from the microphone is sent to the speech recognition service. A built-in silence detector is applied to the microphone data before it's sent to the recognition service.

* **WithIntent Clients**.
 Use **WithIntent** if you want the server to return additional structured information about the speech. The information is used by apps to parse the intent of the speaker and drive further actions by the app. To use Intent, you must train a model and get an AppID and a secret. For more information, see the [LUIS](https://www.luis.ai) project.

### Select a language
When you use **SpeechRecognitionServiceFactory** to create the client, you must select a language.

Supported locales include:

Language-country |Language-country | Language-country |Language-country
---------|----------|--------|------------------
de-DE    |   zh-TW  | zh-HK  |    ru-RU
es-ES    |   ja-JP  | ar-EG* |    da-DK
en-GB    |   en-IN  | fi-FI  |    nl-NL
en-US    |   pt-BR  | pt-PT  |    ca-ES
fr-FR    |   ko-KR  | en-NZ  |    nb-NO
it-IT    |   fr-CA  | pl-PL  |    es-MX
zh-CN    |   en-AU  | en-CA  |    sv-SE
*ar-EG supports Modern Standard Arabic (MSA).

### Select a recognition mode
You also must provide the recognition mode:

* **ShortPhrase mode**. An utterance up to 15 seconds long.
As data is sent to the service, the client receives multiple partial results and one final multiple n-best choice result.

* **LongDictation mode**. An utterance up to 2 minutes long.
As data is sent to the service, the client receives multiple partial results and multiple final results, based on where the server identifies sentence pauses.

### Attach event handlers
You can attach various event handlers to the client you created:

* **Partial results events**. This event gets called every time the speech recognition service predicts what you might be saying. It's called even before you finish speaking (if you use the microphone client) or have finished sending data (if you use the data client).

* **Error events**. Called when the service detects an error.

* **Intent events**. Called on **WithIntent** clients (only in ShortPhrase mode) after the final reco result is parsed into a structured JSON intent.

* **Result events**:
  * **In ShortPhrase mode**. This event is called and returns n-best results after you finish speaking.
  * **In LongDictation mode**. The event handler is called multiple times, based on where the service identifies sentence pauses.
  * **For each of the n-best choices**. A confidence value and a few different forms of the recognized text are returned:

      *	**LexicalForm**. This form is optimal for use by applications that need the raw, unprocessed speech-recognition result.

      *	**DisplayText**. The recognized phrase with inverse text normalization, capitalization, punctuation, and profanity masking applied. Profanity is masked with asterisks after the initial character, for example, "d***". This form is optimal for use by applications that display the speech recognition results to users.

      *	**Inverse text normalization (ITN)**. For example, ITN converts result text from "go to fourth street" to "go to 4th St". This form is optimal for use by applications that display the speech recognition results to users.

      *	**InverseTextNormalizationResult**. ITN converts phrases like "one, two, three, four" to a normalized form, such as "1, 2, 3, 4". For example, result text is converted from "go to fourth street" to "go to 4th St". This form is optimal for use by applications that interpret the speech recognition results as commands or perform queries based on the recognized text.

      *	**MaskedInverseTextNormalizationResult**. The recognized phrase with ITN and profanity masking applied, but no capitalization or punctuation. Profanity is masked with asterisks after the initial character, for example "d***". This form is optimal for use by applications that display the speech recognition results to users. ITN also is applied. For example, ITN converts result text from "go to fourth street" to "go to 4th St". This form is optimal for use by applications that use the unmasked ITN results but also need to display the command or query to users.

<a name="Step3"> </a>
## Step 3: Run the example application

Run the application with the chosen clients, recognition modes, and event handlers.

<a name="Related"> </a>
## Next steps

 * [Get started with the Bing Speech API and/or intent in Java on Android](GetStartedJavaAndroid.md)
 * [Get started with the Bing Speech API in JavaScript](GetStartedJS.md)
 * [Get started with the Bing Speech API in cURL](GetStarted-cURL.md)

