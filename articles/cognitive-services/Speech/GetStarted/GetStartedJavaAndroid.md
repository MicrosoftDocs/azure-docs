---
title: Bing Speech API in Java on Android | Microsoft Docs
description: Use the Bing Speech API to develop Android applications that convert spoken audio to text.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 12/09/2016
ms.author: prrajan
---

# Get started with Bing speech recognition in Java on Android
With the Bing Speech API, you can develop Android applications that use Microsoft cloud servers to convert spoken audio to text. The API supports real-time streaming, so your application can simultaneously and asynchronously receive partial recognition results at the same time it's sending audio to the service.

This article uses a sample application to demonstrate how to use the Bing Speech API client library for Android to develop speech-to-text applications in Java for Android devices.  

## Prerequisites

### Platform requirements
The following example was developed for [Android Studio](http://developer.android.com/sdk/index.html) for Windows in Java.

### Get the client library and example application
Download the Bing Speech API client library for Android from [this link](https://github.com/microsoft/cognitive-speech-stt-android). Save the downloaded files to a folder of your choice. Inside, there is both a fully buildable example and the SDK library. The buildable example can be found under **samples** in the **SpeechRecoExample** directory. The two libraries you need to use in your own apps can be found in the **SpeechSDK** folder under **libs** in the **armeabi** and the **x86** folder. The size of the **libandroid_platform.so** file is 22 MB, but it gets reduced to 4 MB at deployment time. 

### Subscribe to the Bing Speech API, and get a free-trial subscription key 
Before you create the example, you must subscribe to the Bing Speech API, which is part of Azure Cognitive Services. Select the yellow **Try for free** button on one of the offered services, in this case Speech API, and follow the directions. 

For subscription and key management details, see [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up). Both the primary and secondary key can be used in this tutorial. 

## Step 1: Install the example application, and create the application framework

Create an Android application project to implement use of the Bing Speech API.

1. Open the **Android Studio.Import build.gradle** package under **samples/SpeechRecoExample**.

2. Paste your subscription key into the **primaryKey** string in the **..\samples\SpeechRecoExample\res\values** folder. 
    
    >[!NOTE]
    >If you don’t want to use intent at this point, you don't have to worry about the LUIS values.)

3. Create a new application project.

4. Use files downloaded from the **speech_SpeechToText-SDK-Android** zip package to do the following:

    a. Copy the **speechsdk.jar** file, found in the **SpeechSDK** folder inside the **Bin** folder, to the **your-application\app\libs** folder.

    b. Right-click "**app**" in the project tree, and select **Open module settings**. Select the **Dependencies** tab, and select **+** to add a **File dependency**.

    c. In the **Select Path** dialog box, select **libs\speechsdk.jar**.

    d. Copy the **libandroid_platform.so** file to the **your-application\app\src\main\jniLibs\armeabi** folder.

You can now run the example application or continue with the following instructions to build your own application.

## Step 2: Build the example application
Open [MainActivity.java](https://oxfordportal.blob.core.windows.net/example-speech/MainActivity.java) or locate the **MainActivity.java** file within the **samples**, **SpeechRecoExample**, **src**, **com**, **microsoft**, **AzureIntelligentServicesExample** folder from the downloaded **speech_SpeechToText-SDK-Android** zip package. You need the subscription key you generated previously. After you add your subscription key to the application, notice that you use **SpeechRecognitionServiceFactory** to create a client of your liking. 

```
void initializeRecoClient()
    {
        String language = "en-us";
        
        String subscriptionKey = this.getString(R.string.subscription_key);
        String luisAppID = this.getString(R.string.luisAppID);
        String luisSubscriptionID = this.getString(R.string.luisSubscriptionID);

        if (m_isMicrophoneReco && null == m_micClient) {
            if (!m_isIntent) {
                m_micClient = SpeechRecognitionServiceFactory.createMicrophoneClient(this,
                                                                                     m_recoMode, 
                                                                                     language,
                                                                                     this,
                                                                                     subscriptionKey);
            }
            else {
                MicrophoneRecognitionClientWithIntent intentMicClient;
                intentMicClient = SpeechRecognitionServiceFactory.createMicrophoneClientWithIntent(this,
                                                                                                   language,
                                                                                                   this,
                                                                                                   subscriptionKey,
                                                                                                   luisAppID,
                                                                                                   luisSubscriptionID);
                m_micClient = intentMicClient;

            }
        }
        else if (!m_isMicrophoneReco && null == m_dataClient) {
            if (!m_isIntent) {
                m_dataClient = SpeechRecognitionServiceFactory.createDataClient(this,
                                                                                m_recoMode, 
                                                                                language,
                                                                                this,
                                                                                subscriptionKey);
            }
            else {
                DataRecognitionClientWithIntent intentDataClient;
                intentDataClient = SpeechRecognitionServiceFactory.createDataClientWithIntent(this, 
                                                                                              language,
                                                                                              this,
                                                                                              subscriptionKey,
                                                                                              luisAppID,
                                                                                              luisSubscriptionID);
                m_dataClient = intentDataClient;
            }
        }
    }

```
### Create a client
Create one of the following clients:

* **DataRecognitionClient**. Speech recognition with PCM data, for example, from a file or audio source. The data is broken up into buffers, and each buffer is sent to the speech recognition service. No modification is done to the buffers, so the user can apply their own silence detection if desired. If the data is provided from wave files, you can send data from the file directly to the server. If you have raw data, for example, audio coming over Bluetooth, you first send a format header to the server followed by the data.

* **MicrophoneRecognitionClient**. Speech recognition with audio coming from the microphone. Make sure the microphone is turned on. Data from the microphone is sent to the speech recognition service. A built-in silence detector is applied to the microphone data before it's sent to the recognition service.

* **WithIntent clients**. Use **WithIntent** If you want the server to return additional structured information about the speech to be used by apps to parse the intent of the speaker and drive further actions by the app. To use intent, you need to train a model and get an AppID and a secret. For more information, see the [LUIS](https://www.luis.ai/) project.

### Select a locale
When you use SpeechRecognitionServiceFactory to create the client, you must select a language.

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
You also need to provide the recognition mode. 

* **ShortPhrase mode**. An utterance up to 15 seconds long. As data is sent to the service, the client receives multiple partial results and one final multiple n-best choice result.
* **LongDictation mode:** An utterance up to 2 minutes long. As data is sent to the service, the client receives multiple partial results and multiple final results, based on where the server identifies sentence pauses.

### Attach an event handler
From the created client, you can attach various event handlers.

* **Partial results events**. This event gets called every time the speech recognition server has an idea of what you might be saying. It's called even before you finish speaking (if you use the microphone client) or finish sending data (if you use the data client).
* **Error events**. Called when the server detects an error.
* **Intent events**. Called on WithIntent clients (only in ShortPhrase mode) after the final reco result is parsed into a structured JSON intent.
* **Result events**. When you finish speaking (in ShortPhrase mode), this event is called. You're provided with n-best choices for the result. In LongDictation mode, the handlers associated with this event are called multiple times, based on where the server identifies sentence pauses.

### Select a confidence value and text form
For each of the n-best choices, you get a confidence value and a few different forms of the recognized text:

* **LexicalForm**. This form is optimal for use by applications that need the raw, unprocessed speech-recognition result.
* **DisplayText**. The recognized phrase with inverse text normalization, capitalization, punctuation, and profanity masking applied. Profanity is masked with asterisks after the initial character, for example, "d***". This form is optimal for use by applications that display the speech recognition results to users.
* **Inverse Text Normalization (ITN)**. ITN is also applied. For example, ITN converts the result text "go to fourth street" to "go to 4th St". This form is optimal for use by applications that display the speech recognition results to users.
* **InverseTextNormalizationResult**. ITN converts phrases like "one two three four" to a normalized form, such as "1234". Another example converts the result text "go to fourth street" to "go to 4th St". This form is optimal for use by applications that interpret the speech recognition results as commands or that perform queries based on the recognized text.
* **MaskedInverseTextNormalizationResult**. The recognized phrase with ITN and profanity masking applied, but not capitalization or punctuation. Profanity is masked with asterisks after the initial character, for example, "d***". This form is optimal for use by applications that display the speech recognition results to users. ITN is also applied. For example, ITN converts the result text "go to fourth street" to "go to 4th St". This form is optimal for applications that use the unmasked ITN results but also need to display the command or query to users.

## Step 3: Run the example application
Run the application with the chosen clients, recognition modes, and event handlers.

## Related topics
* [Get started with Bing speech recognition in C Sharp for Windows in .NET](GetStartedCSharpDesktop.md)
* [Get started with Bing speech recognition and/or intent in Objective-C on iOS](Get-Started-ObjectiveC-iOS.md)
* [Get started with the Bing Speech API in JavaScript](GetStartedJS.md)
