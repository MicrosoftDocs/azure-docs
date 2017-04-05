---
title: Bing Speech Recognition API in Java on Android | Microsoft Docs
description: Use Bing Speech API to develop Android applications that convert spoken audio to text.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 12/09/2016
ms.author: prrajan
---

# Get Started with Bing Speech Recognition in Java on Android
With Bing Speech Recognition API you can develop Android applications that leverage Microsoft cloud servers to convert spoken audio to text. The API supports real-time streaming, so your application can simultaneously and asynchronously receive partial recognition results at the same time it is sending audio to the service

This article uses a sample application to demonstrate how to use the Bing Speech Recognition API Client Library for Android to develop speech to text applications in Java for Android devices.  

## Prerequisites

#### Platform Requirements
The below example has been developed for [Android Studio](http://developer.android.com/sdk/index.html) for Windows in Java.

#### Get the Client Library and Example Application
Download Speech Recognition API Client Library for Android from [this link](https://github.com/microsoft/cognitive-speech-stt-android). The downloaded files need to be saved to a folder of your choice. Inside there is both a fully buildable example and the SDK library. The buildable example can be found under **samples** in the **SpeechRecoExample** directory. The two libraries you need to use in your own apps can be found in the **SpeechSDK** folder under **libs** in the **armeabi** and the **x86** folder. The size of **libandroid_platform.so** file is 22 MB but gets reduced to 4MB at deploy time. 

#### Subscribe to Speech API and Get a Free Trial Subscription Key 
Before creating the example, you must subscribe to Speech API which is part of Cognitive Services. Click the yellow **"Try for free"** button on one of the offered services, in this case Speech API, and follow the directions. For subscription and key management details, see [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up). Both the primary and secondary key can be used in this tutorial. 

## Step 1: Install the Example Application and Create the Application Framework

Create an Android application project to implement use of the Speech Recognition API

1.	Open Android Studio.
2.	Paste your subscription key into the **primaryKey** string in the **..\samples\SpeechRecoExample\res\values** folder. 
    
    >[!NOTE]
    >You don’t have to worry about the LUIS values if you don’t want to use Intent at this point.)

3.	Create a new application project.
4.	Using files downloaded from the **speech_SpeechToText-SDK-Android** zip package, do the following: 
    1. Copy the **speechsdk.jar** file, found in the **SpeechSDK** folder inside the **Bin** folder, to the “**your-application\app\libs**” folder.
    2. Right click "**app**" in the project tree, select "**Open module settings**", select the "**Dependencies**" tab, and click "**+**" to add a "**File dependency**". 
    3. Select the **libs\speechsdk.jar** in the "**Select Path**" dialog box.
    4. Copy the **libandroid_platform.so** file to the “**your-application\app\src\main\jniLibs\armeabi**” folder.

**You can now run the example application or continue with thes following instructions to build your own application.**

## Step 2: Build the Example Application
Open [MainActivity.java](https://oxfordportal.blob.core.windows.net/example-speech/MainActivity.java) or locate the **MainActivity.java** file within the **samples**, **SpeechRecoExample**, **src**, **com**, **microsoft**, **AzureIntelligentServicesExample** folder from the downloaded **speech_SpeechToText-SDK-Android** zip package. You will need the subscription key you generated above. Once you have added your subscription key to the application, notice that you use the **SpeechRecognitionServiceFactory** to create a client of your liking. 

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
#### Create a Client:
Create one of the following clients

* **DataRecognitionClient:** Speech recognition with PCM data, for example from a file or audio source. 
    The data is broken up into buffers and each buffer is sent to the Speech Recognition Service. No modification is done to the buffers, so the user can apply their own Silence Detection if desired. If the data is provided from wave files, you can send data from the file directly to the server. If you have raw data, for example audio coming over Bluetooth, then you first send a format header to the server followed by the data.

* **MicrophoneRecognitionClient:** Speech recognition with audio coming from the microphone. 
    Make sure the microphone is turned on and data from the microphone is sent to the Speech Recognition Service. A built-in Silence Detector is applied to the microphone data before it is sent to the recognition service.

* **“WithIntent” clients:**
    Use “WithIntent” if you want the server to return additional structured information about the speech to be used by apps to parse the intent of the speaker and drive further actions by the app. To use Intent, you will need to train a model and get an AppID and a Secret. See project [LUIS](https://www.luis.ai/) for details.

#### Select a Locale
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

#### Attach an Event Handler
From the created client, you can attach various event handlers.

* **Partial Results Events:** This event gets called every time the Speech Recognition Server has an idea of what you might be saying – even before you finish speaking (if you are using the Microphone Client) or have finished sending up data (if you are using the Data Client).
* **Error Events:** Called when the Server Detects Error
* **Intent Events:** Called on WithIntent clients (only in ShortPhrase mode) after the final reco result has been parsed into a structured JSON intent.
* **Result Events:** When you have finished speaking (in ShortPhrase mode), this event is called. You will be provided with n-best choices for the result. In LongDictation mode, he handler's associated with this event will be called multiple times, based on where the server thinks sentence pauses are.

#### Select Confidence Value and Text Form
For each if the n-best choices, you get a confidence value and few different forms of the recognized text:

* **LexicalForm:** This form is optimal for use by applications that need the raw, unprocessed speech recognition result.
* **DisplayText:** The recognized phrase with inverse text normalization, capitalization, punctuation and profanity masking applied. Profanity is masked with asterisks after the initial character, e.g. "d***". This form is optimal for use by applications that display the speech recognition results to a user.
* **Inverse Text Normalization (ITN):** has also been applied. An example of ITN is converting result text from "go to fourth street" to "go to 4th st". This form is optimal for use by applications that display the speech recognition results to a user.
* **InverseTextNormalizationResult:** Inverse text normalization (ITN) converts phrases like "one two three four" to a normalized form such as "1234". Another example is converting result text from "go to fourth street" to "go to 4th st". This form is optimal for use by applications that interpret the speech recognition results as commands or which perform queries based on the recognized text.
* **MaskedInverseTextNormalizationResult:** The recognized phrase with inverse text normalization and profanity masking applied, but not capitalization or punctuation. Profanity is masked with asterisks after the initial character, e.g. "d***". This form is optimal for use by applications that display the speech recognition results to a user. Inverse Text Normalization (ITN) has also been applied. An example of ITN is converting result text from "go to fourth street" to "go to 4th st". This form is optimal for use by applications that use the unmasked ITN results but also need to display the command or query to the user.

## Step 3: Run the Example Application
Run the application with the chosen clients, recognition modes and event handlers.

## Related Topics
* [Get Started with Bing Speech Recognition in C Sharp for Windows in .NET](GetStartedCSharpDesktop.md)
* [Get Started with Bing Speech Recognition and/or intent in Objective C on iOS](Get-Started-ObjectiveC-iOS.md)
* [Get Started with Bing Speech API in JavaScript](GetStartedJS.md)
