---
title: 'Quickstart: Synthesize speech, C# (Unity) - Speech service'
titleSuffix: Azure Cognitive Services
description: Use this guide to create a text-to-speech application with Unity and the Speech SDK for Unity. When finished, you can synthesize speech from text in real time to your device's speaker.
services: cognitive-services
author: yinhew
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/04/2020
ms.author: yinhew
---

> [!NOTE]
> Unity supports Windows Desktop (x86 and x64) or the Universal Windows Platform (x86, x64, ARM/ARM64), Android (x86, ARM32/64), and iOS (x64 simulator, ARM32 and ARM64).

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=unity&pivots=programming-language-csharp)

## Add a UI

We add a minimal UI to our scene that consists of an input field to enter the text for synthesis, a button to trigger speech synthesis, and a text field to display the result.

* In the [Hierarchy window](https://docs.unity3d.com/Manual/Hierarchy.html) (by default on the left), a sample scene is shown that Unity created with the new project.
* Select the **Create** button at the top of the **Hierarchy** window, and select **UI** > **Input Field**.
* This option creates three game objects that you can see in the **Hierarchy** window: an **Input Field** object nested within a **Canvas** object, and an **EventSystem** object.
* [Navigate the Scene view](https://docs.unity3d.com/Manual/SceneViewNavigation.html) so that you have a good view of the canvas and the input field in the [Scene view](https://docs.unity3d.com/Manual/UsingTheSceneView.html).
* Select the **Input Field** object in the **Hierarchy** window to display its settings in the [Inspector window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
* Set the **Pos X** and **Pos Y** properties to **0** so that the input field is centered in the middle of the canvas.
* Select the **Create** button at the top of the **Hierarchy** window again. Select **UI** > **Button** to create a button.
* Select the **Button** object in the **Hierarchy** window to display its settings in the [Inspector window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
* Set the **Pos X** and **Pos Y** properties to **0** and **-48**. Set the **Width** and **Height** properties to **160** and **30** to ensure that the button and the input field don't overlap.
* Select the **Create** button at the top of the **Hierarchy** window again. Select **UI** > **Text** to create a text field.
* Select the **Text** object in the **Hierarchy** window to display its settings in the [Inspector window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
* Set the **Pos X** and **Pos Y** properties to **0** and **80**. Set the **Width** and **Height** properties to **320** and **80** to ensure that the text field and the input field don't overlap.
* Select the **Create** button at the top of the **Hierarchy** window again. Select **Audio** > **Audio Source** to create an audio source.

When you're finished, the UI should look similar to this screenshot:

[![Screenshot of the quickstart user interface in the Unity Editor](~/articles/cognitive-services/Speech-Service/media/sdk/qs-tts-csharp-unity-ui-inline.png)](~/articles/cognitive-services/Speech-Service/media/sdk/qs-tts-csharp-unity-ui-expanded.png#lightbox)

## Add the sample code

1. In the [Project window](https://docs.unity3d.com/Manual/ProjectView.html) (by default on the left bottom), select the **Create** button and then select **C# script**. Name the script `HelloWorld`.

1. Edit the script by double-clicking it.

   > [!NOTE]
   > You can configure which code editor is launched by selecting **Edit** > **Preferences**. For more information, see the [Unity User Manual](https://docs.unity3d.com/Manual/Preferences.html).

1. Replace all code with the following:

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp/unity/text-to-speech/Assets/Scripts/HelloWorld.cs#code)]

1. Locate and replace the string `YourSubscriptionKey` with your Speech service subscription key.

1. Locate and replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription. For example, the region is `westus` if you use the free trial.

1. Save the changes to the script.

1. Back in the Unity Editor, add the script as a component to one of your game objects.

   * Select the **Canvas** object in the **Hierarchy** window to open the setting in the [Inspector window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
   * Select the **Add Component** button in the **Inspector** window. Then search for the `HelloWorld` script we previously created and add it.
   * The HelloWorld component has four uninitialized properties, **Output Text**, **Input Field**, **Speak Button** and **Audio Source**, that match public properties of the `HelloWorld` class.
     To wire them up, select the Object Picker (the small circle icon to the right of the property). Select the text and button objects you created earlier.

     > [!NOTE]
     > The input field and button also have a nested text object. Make sure you don't accidentally pick it for text output. Or, you can rename the text objects that use the **Name** field in the **Inspector** window to avoid that confusion.

## Run the application in the Unity Editor

* Select the **Play** button in the Unity Editor toolbar that's underneath the menu bar.
* After the app launches, enter some text in the input field and select the button. Your text is transmitted to the Speech service and synthesized to speech, which plays on your speaker.

  [![Screenshot of the running quickstart in the Unity Game window](~/articles/cognitive-services/speech-service/media/sdk/qs-tts-csharp-unity-output-inline.png)](~/articles/cognitive-services/speech-service/media/sdk/qs-tts-csharp-unity-output-expanded.png#lightbox)

* Check the [Console window](https://docs.unity3d.com/Manual/Console.html) for debug messages.

## Additional options to run this application

This application can also be deployed to Android as a Windows stand-alone app or a UWP application.
See the [sample repository](https://aka.ms/csspeech/samples) in the quickstart/csharp-unity folder that describes the configuration for these additional targets.

## Next steps

[!INCLUDE [Speech synthesis basics](../../text-to-speech-next-steps.md)]

## See also

- [Create a Custom Voice](~/articles/cognitive-services/Speech-Service/how-to-custom-voice-create-voice.md)
- [Record custom voice samples](~/articles/cognitive-services/Speech-Service/record-custom-voice-samples.md)
