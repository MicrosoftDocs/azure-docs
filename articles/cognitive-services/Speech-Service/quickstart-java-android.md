---
title: 'Quickstart: Recognize speech in Java on Android using the Cognitive Services Speech SDK | Microsoft Docs'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in Java on Android using the Cognitive Services Speech SDK
services: cognitive-services
author: fmegen
manager: wolfma

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 07/16/2018
ms.author: fmegen
---

# Quickstart: Recognize speech in Java on Android using the Speech SDK

In this article, you'll learn how to create a Java application for Android using the Cognitive Services Speech SDK to transcribe speech to text.
The application is based on the Microsoft Cognitive Services Speech SDK Maven Package, version 0.5.0, and Android Studio 3.1.

> [!NOTE]
> For the Speech Devices SDK and the Roobo device, please visit the [Speech Devices SDK](speech-devices-sdk.md) page.

## Prerequisites

* A subscription key for the Speech service. See [Try the speech service for free](get-started.md).
* A PC (Windows, Linux, Mac) capable to run Android Studio.
* Version 3.1 of [Android Studio](https://developer.android.com/studio/).
* An ARM-based Android device (API 23: Android 6.0 Marshmallow or higher) [enabled for development](https://developer.android.com/studio/debug/dev-options) with a working microphone.

## Create an Android Studio project

Launch Android Studio, and select **Start a new Android Studio project**.

![](media/sdk/qs-java-android-01-start-new-android-studio-project.png)

In the **Create New Project** wizard that comes up, make the following choices:

1. In the **Create Android Project** screen, enter **Quickstart** as **application name**, **samples.speech.cognitiveservices.microsoft.com** as **company domain**, and choose a project location. Leave the checkboxes unchecked, and click **Next**.

   ![](media/sdk/qs-java-android-02-create-android-project.png)

1. In the **Target Android Devices** screen, check **Phone and Tablet** as the only option, choose **API 23: Android 6.0 (Marshmallow)** from the drop-down under it, and click **Next**.

   ![](media/sdk/qs-java-android-03-target-android-devices.png)

1. In the **Add an Activity to Mobile** screen, select **Empty Activity** and click **Next**.

   ![](media/sdk/qs-java-android-04-add-an-activity-to-mobile.png)

1. In the **Configure Activity** screen, use **MainActivity** as the Activity Name and **activity\_main** as the Layout Name. Check both checkboxes, and click **Finish**.

   ![](media/sdk/qs-java-android-05-configure-activity.png)

After running for a while, your newly created Android Studio project should come up.

## Configure your project for the Speech SDK

[!include[License Notice](includes/license-notice.md)]

The current version of the Cognitive Services Speech SDK is `0.5.0`.

The Speech SDK for Android is packaged as an [AAR (Android Library)](https://developer.android.com/studio/projects/android-library), which includes the necessary libraries as well as required Android permissions for using it.
It is hosted in a Maven repository at https://csspeechstorage.blob.core.windows.net/maven/.

We describe below how to set up your project to use the Speech SDK.

Open the project structure window under **File** \> **Project Structure**.
In the window that comes up make the following changes (click **OK** only after you complete all of the steps):

1. Select **Project**, and edit the **Default Library Repository** settings by appending a comma and our Maven repository URL enclosed in single quotes `'https://csspeechstorage.blob.core.windows.net/maven/'`:

  ![](media/sdk/qs-java-android-06-add-maven-repository.png)

1. Still in the same screen, on the left side, select the **App** module, and on the top the **Dependencies** tab. Then, click the green Plus sign in the right upper corner, and select **Library dependency**.

  ![](media/sdk/qs-java-android-07-add-module-dependency.png)

1. In the window that comes up, enter the name and version of our Speech SDK for Android, `com.microsoft.cognitiveservices.speech:client-sdk:0.5.0`, then click **OK**.
   The Speech SDK should be added to the list of dependencies now, as shown below:

  ![](media/sdk/qs-java-android-08-dependency-added.png)

1. In the top, select the **Properties** tab. Select **1.8** both for **Source Compability** and **Target Compatibility**.

  ![](media/sdk/qs-java-android-09-dependency-added.png)

1. Finally, click **OK** to close the **Project Structure** windows and apply all updates.

## Create a minimal UI

Edit the layout for your main activity, `activity_main.xml`.
By default it should come up with a title bar with your application's name, and a TextView that says 'Hello World!'.

* Click on the TextView. Change its ID attribute in the upper-right corner to `hello`.

* From the Palette in the upper left of your `activity_main.xml` window, drag a Button into the empty space above the text.

* In the button's attributes on the right, in the value for the `onClick` attribute, enter `onSpeechButtonClicked`, which will be the name of our button handler.
  Change its ID attribute in the upper-right corner to `button`.

* Use the magic wand icon at the top of the designer if you want to infer layout constraints for you.

  ![](media/sdk/qs-java-android-10-infer-layout-constraints.png)

The text and graphical version of your UI should now look similar to this:

<table>
<tr>
<td valign="top">
![](media/sdk/qs-java-android-11-gui.png)
</td>
<td valign="top">
[!code-xml[](~/samples-cognitive-services-speech-sdk/quickstart/java-android/app/src/main/res/layout/activity_main.xml)]
</td>
</tr>
</table>

## Add the sample code

1. Edit the `MainActivity.java` source file and replace its code with the following (below your package statement):

   [!code-java[](~/samples-cognitive-services-speech-sdk/quickstart/java-android/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/quickstart/MainActivity.java#code)]

   * The `onCreate` method includes code that requests microphone and Internet permissions as well as initializes the native platform binding. Configuring the native platform bindings is only required once, that is, it should be done early during application initialization.
   
   * The method `onSpeechButtonClicked` was previously wired up as the button click handler. A button press triggers the actual speech recognition.

1. Replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

## Build and run the sample

* To build, press Ctrl+F9, or select **Build** \> **Make Project**.

* Connect your Android device to your development PC. Make sure you have [development mode and USB debugging enabled](https://developer.android.com/studio/debug/dev-options).

* To launch the app, press Shift+F10, or select **Run** \> **Run 'app'**.

* In the deployment target windows that comes up, pick your Android device.

  ![Launch the app into debugging](media/sdk/qs-java-android-12-deploy.png)

* The app should launch on your device.
  Once you press the button, the next 15 seconds will be recognized and shown in the UI (you should also be able to see the response in your logcat window in Android Studio):

  ![UI after successful recognition](media/sdk/qs-java-android-13-gui-on-device.png)

This screenshot concludes the Android Quickstart. The full project sample code can be downloaded from the samples repository.

[!include[Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/java-android` folder.

## Next steps

* Visit the [samples page](samples.md) for additional samples.
