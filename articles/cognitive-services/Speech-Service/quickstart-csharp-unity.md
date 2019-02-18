---
title: 'Quickstart: Recognize speech, Unity - Speech Services'
titleSuffix: Azure Cognitive Services
description: Use this guide to create a speech-to-text application with Unity and the Speech SDK for Unity (beta). When finished, you can use your computer's microphone to transcribe speech to text in real time.
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 2/19/2019
ms.author: wolfma
---

# Quickstart: Recognize speech with the Speech SDK for Unity (beta)

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

Use this guide to create a speech-to-text application using [Unity](https://unity3d.com/) and the Speech SDK for Unity (beta).
When finished, you can use your computer's microphone to transcribe speech to text in real time.
If you are not familiar with Unity, it is recommended to study the [Unity user manual](https://docs.unity3d.com/Manual/) before starting your app development.

> [!NOTE]
> The Speech SDK for Unity is currently in beta.
> It supports Windows x86 and x64 (stand-alone desktop application or Universal Windows Platform), and Android (ARM32/64, x86).

## Prerequisites

To complete this project, you'll need:

* [Unity 2018.3 or later](https://store.unity.com/).
* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/)
* A subscription key for the Speech Service. [Get one for free](get-started.md).
* Access to your computer's microphone

## Create a Unity project

* Start Unity and under the **Projects** tab select **New**.
* Specify **Project name** as **csharp-unity**, **Template** as **3D** and pick a location.
  Then select **Create project**.
* After a bit of time, the Unity Editor window should pop up.

## Install the Speech SDK

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

* The Speech SDK for Unity (beta) is packaged as a Unity asset package (.unitypackage).
  Download it from [here](https://aka.ms/csspeech/unitypackage).
* Import the Speech SDK by selecting **Assets** > **Import Package** > **Custom Package**.
  Check out the [Unity documentation](https://docs.unity3d.com/Manual/AssetPackages.html) for details.
* In the file picker, select the Speech SDK .unitypackage file that you downloaded above.
* Ensure that all files are selected and click **Import**.

## Add UI

We add a minimal UI to our scene, consisting of a button to trigger speech recognition and a text field to display the result.

* In the [Hierarchy Window](https://docs.unity3d.com/Manual/Hierarchy.html) (by default on the left), a sample scene is shown that Unity created with the new project.
* Right-click into it, and select **UI** > **Text**.
* This creates three game objects: a **Text** object nested within a **Canvas** object, and an **EventSystem** object (which we will not need).
* Click the **Text** object in the Hierarchy Window to make it settings show up in the [Inspector Window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
* Set the **Pos Y** and **Height** properties to **120** and the **Width** property to **240**.
* Right-click again into the Hierarchy Window, and select **UI** > **Button** to create a button.
* Ensure that the text field and the button do not overlap with each other.

## Add the sample code

1. In the [Project Window](https://docs.unity3d.com/Manual/ProjectView.html) (by default in the left bottom), click the **Create** button and then select **C# script**. Name the script `HelloWorld`.

1. Edit the script by double-clicking it.

  > [!NOTE]
  > You can configure which code editor will be launched under **Edit** > **Preferences**, see the [Unity user manual](https://docs.unity3d.com/Manual/Preferences.html)).

1. Replace all code with the following:

   ```csharp
   using UnityEngine;
   using UnityEngine.UI;
   using Microsoft.CognitiveServices.Speech;
   #if PLATFORM_ANDROID
   using UnityEngine.Android;
   #endif

   public class HelloWorld : MonoBehaviour
   {
       // Hook up the two properties below with a Text and Button object in your UI.
       public Text outputText;
       public Button startRecoButton;

       private object threadLocker = new object();
       private bool waitingForReco;
       private string message;

       private bool micPermissionGranted = false;

   #if PLATFORM_ANDROID
       private Microphone mic; // Required to manifest microphone permission
   #endif

       public async void ButtonClick()
       {
           // Creates an instance of a speech config with specified subscription key and service region.
           // Replace with your own subscription key and service region (e.g., "westus").
           var config = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");

           using (var recognizer = new SpeechRecognizer(config))
           {
               lock (threadLocker)
               {
                   waitingForReco = true;
               }

               // Starts speech recognition, and returns after a single utterance is recognized. The end of a
               // single utterance is determined by listening for silence at the end or until a maximum of 15
               // seconds of audio is processed.  The task returns the recognition text as result. 
               // Note: Since RecognizeOnceAsync() returns only a single utterance, it is suitable only for single
               // shot recognition like command or query. 
               // For long-running multi-utterance recognition, use StartContinuousRecognitionAsync() instead.
               var result = await recognizer.RecognizeOnceAsync().ConfigureAwait(false);

               // Checks result.
               string newMessage = string.Empty;
               if (result.Reason == ResultReason.RecognizedSpeech)
               {
                   newMessage = result.Text;
               }
               else if (result.Reason == ResultReason.NoMatch)
               {
                   newMessage = "NOMATCH: Speech could not be recognized.";
               }
               else if (result.Reason == ResultReason.Canceled)
               {
                   var cancellation = CancellationDetails.FromResult(result);
                   newMessage = $"CANCELED: Reason={cancellation.Reason} ErrorDetails={cancellation.ErrorDetails}";
               }

               lock (threadLocker)
               {
                   message = newMessage;
                   waitingForReco = false;
               }
           }
       }

       void Start()
       {
           if (outputText == null)
           {
               UnityEngine.Debug.LogError("outputText property is null! Assign a UI Text element to it.");
           }
           else if (startRecoButton == null)
           {
               message = "startRecoButton property is null! Assign a UI Button to it.";
               UnityEngine.Debug.LogError(message);
           }
           else
           {
   #if PLATFORM_ANDROID
               message = "Waiting for mic permission";
               if (!Permission.HasUserAuthorizedPermission(Permission.Microphone))
               {
                   Permission.RequestUserPermission(Permission.Microphone);
               }
   #else
               micPermissionGranted = true;
               message = "Click button to recognize speech";
   #endif
               startRecoButton.onClick.AddListener(ButtonClick);
           }
       }

       void Update()
       {
   #if PLATFORM_ANDROID
           if (!micPermissionGranted && Permission.HasUserAuthorizedPermission(Permission.Microphone))
           {
               micPermissionGranted = true;
               message = "Click button to recognize speech";
           }
   #endif

           lock (threadLocker)
           {
               if (startRecoButton != null)
               {
                   startRecoButton.interactable = !waitingForReco && micPermissionGranted;
               }
               if (outputText != null)
               {
                   outputText.text = message;
               }
           }
       }
   }
   ```

1. Locate and replace the string `YourSubscriptionKey` with your Speech Service subscription key.

1. Locate and replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription. For example, if you're using the free trial, the region is `westus`.

1. Save the changes to the script and close your code editor.

1. The script needs to be added as a component to one of your game objects.

  * Click on the **Canvas** object in the Hierarchy Window. This opens up its setting in the [Inspector Window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
  * Click the **Add Component** button in the Inspector Window, then search for the HelloWorld script we create above and add it.
  * You will note that the Hello World component has two uninitialized properties in it, **Output Text** and **Start Reco Button**, matching public properties of the HelloWorld class.
    To wire them up, click the Object Picker (the small circle icon to the right of the property) next to them, and choose text and button object you created earlier, respectively.

    > [!NOTE]
    > The button also has a nested text object. Make sure you do not accidentally pick it for text output.

## Run the application in the Unity Editor

* Press the **Play** button in the Unity Editor toolbar (below the menu bar).
  * When you say something after the app has been launched, you'll see the recognized text in the Unity Editor's Game Window.
  * Click the button and speak an English phrase or sentence into your device's microphone. Your speech is transmitted to the Speech service and transcribed to text, which appears in the window.
  * Check also the [Console Window](https://docs.unity3d.com/Manual/Console.html) for debug messages.
* Click the **Play** button again to stop running the app.

## Additional options to run this application

This application can also be deployed to Android, or as a Windows stand-alone or UWP application.
Refer to our [sample repository](https://aka.ms/csspeech/samples) that describes the configuration for these additional targets.

## Next steps

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
