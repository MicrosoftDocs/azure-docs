---
title: 'Quickstart: Synthesize speech, Java (Android) - Speech service'
titleSuffix: Azure Cognitive Services
description: Learn how to synthesize speech in Java on Android by using the Speech SDK
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/04/2020
ms.author: yulili
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=android&pivots=programming-language-java)

## Create user interface

We will create a basic user interface for the application. Edit the layout for your main activity, `activity_main.xml`. Initially, the layout includes a title bar with your application's name, and a TextView containing the text "Hello World!".

1. Click the TextView element. Change its ID attribute in the upper-right corner to `outputMessage`, and drag it to the lower screen. Delete its text.

1. From the Palette in the upper left of the `activity_main.xml` window, drag a button into the empty space above the text.

1. In the button's attributes on the right, in the value for the `onClick` attribute, enter `onSpeechButtonClicked`. We'll write a method with this name to handle the button event.  Change its ID attribute in the upper-right corner to `button`.

1. Drag a Plain Text into the space above the button; change its ID attribute to `speakText`, and change the text attribute to `Hi there!`.

1. Use the magic wand icon at the top of the designer to infer layout constraints.


    ![Screenshot of magic wand icon](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-android-10-infer-layout-constraints.png)

The text and graphical representation of your UI should now look like this:

![](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-android-11-2-tts-gui.png)

[!code-xml[](~/samples-cognitive-services-speech-sdk/quickstart/java/android/text-to-speech/app/src/main/res/layout/activity_main.xml)]

## Add sample code

1. Open the source file `MainActivity.java`. Replace all the code in this file with the following.

   [!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/android/text-to-speech/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/quickstart/MainActivity.java#code)]

   * The method `onSpeechButtonClicked` is, as noted earlier, the button click handler. A button press triggers speech synthesis.

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Also replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

## Build and run the app

1. Connect your Android device to your development PC. Make sure you have enabled [development mode and USB debugging](https://developer.android.com/studio/debug/dev-options) on the device. Alternatively, create an [Android emulator](https://developer.android.com/studio/run/emulator).

1. To build the application, press Ctrl+F9, or choose **Build** > **Make Project** from the menu bar.

1. To launch the application, press Shift+F10, or choose **Run** > **Run 'app'**.

1. In the deployment target window that appears, choose your Android device or emulator.

   ![Screenshot of Select Deployment Target window](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-android-12-deploy.png)

Enter a text and press the button in the application to begin a speech synthesis section. You will hear the synthesized audio from the default speaker and see the `speech synthesis succeeded` info on the screen.

![Screenshot of the Android application](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-android-13-2-gui-on-device-tts.png)

## Next steps

[!INCLUDE [Speech synthesis basics](../../text-to-speech-next-steps.md)]

## See also

- [Create a Custom Voice](~/articles/cognitive-services/Speech-Service/how-to-custom-voice-create-voice.md)
- [Record custom voice samples](~/articles/cognitive-services/Speech-Service/record-custom-voice-samples.md)
