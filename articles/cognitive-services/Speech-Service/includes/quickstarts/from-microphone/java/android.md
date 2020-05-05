---
title: 'Quickstart: Recognize speech from a microphone, Java (Android) - Speech service'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in Java on Android by using the Speech SDK
services: cognitive-services
author: fmegen
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 11/05/2019
ms.author: wolfma
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=android&pivots=programming-language-java)
> * Make sure that you have access to a microphone for audio capture

## Create a user interface

Now we'll create a basic user interface for the application. Edit the layout for your main activity, `activity_main.xml`. Initially, the layout includes a title bar with your application's name, and a TextView that contains the text "Hello World!".

* Select the TextView element. Change its ID attribute in the upper-right corner to `hello`.

* From the palette in the upper left of the `activity_main.xml` window, drag a button into the empty space above the text.

* In the button's attributes on the right, in the value for the `onClick` attribute, enter `onSpeechButtonClicked`. We'll write a method with this name to handle the button event. Change its ID attribute in the upper-right corner to `button`.

* Use the magic wand icon at the top of the designer to infer layout constraints.

  ![Screenshot of magic wand icon](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-android-10-infer-layout-constraints.png)

The text and graphical representation of your UI should now look like this:

![User interface](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-android-11-gui.png)

[!code-xml[](~/samples-cognitive-services-speech-sdk/quickstart/java/android/from-microphone/app/src/main/res/layout/activity_main.xml)]

## Add sample code

1. Open the source file `MainActivity.java`. Replace all the code in this file with the following:

   [!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java/android/from-microphone/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/quickstart/MainActivity.java#code)]

   * The `onCreate` method includes code that requests microphone and internet permissions, and initializes the native platform binding. Configuring the native platform bindings is only required once. It should be done early during application initialization.

   * The method `onSpeechButtonClicked` is, as noted earlier, the button click handler. A button press triggers speech-to-text transcription.

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Also replace the string `YourServiceRegion` with the **Region identifier** from [region](https://aka.ms/speech/sdkregion) associated with your subscription. For example, use `westus` for the free trial subscription.

## Build and run the app

1. Connect your Android device to your development PC. Make sure that you enabled [development mode and USB debugging](https://developer.android.com/studio/debug/dev-options) on the device.

1. To build the application, select Ctrl+F9, or select **Build** > **Make Project** from the menu bar.

1. To launch the application, select Shift+F10, or select **Run** > **Run 'app'**.

1. In the deployment target window that appears, select your Android device.

   ![Screenshot of Select Deployment Target window](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-android-12-deploy.png)

Select the button in the application to begin a speech recognition section. The next 15 seconds of English speech will be sent to the Speech service and transcribed. The result appears in the Android application, and in the logcat window in Android Studio.

![Screenshot of the Android application](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-android-13-gui-on-device.png)

## Next steps

[!INCLUDE [Speech recognition basics](../../speech-to-text-next-steps.md)]
