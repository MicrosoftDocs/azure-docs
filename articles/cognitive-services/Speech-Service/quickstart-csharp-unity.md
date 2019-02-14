---
title: 'Quickstart: Recognize speech, Unity - Speech Services'
titleSuffix: Azure Cognitive Services
description: Use this guide to create a speech-to-text application using Unity for Windows or Android and the Speech SDK for Unity (beta). When finished, you can use your computer's microphone to transcribe speech to text in real time.
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
* In the file picker, select the Speech SDK .unitypackage file that you downloaded above.
* Ensure that all files are selected and click **Import**.

## Add UI

We will add a text field as minimal UI that is used to show speech recognition output.

* In the [Hierarchy Window](https://docs.unity3d.com/Manual/Hierarchy.html), a sample scene should be active that Unity create with the new project.
* Right-click into it, and select **UI** > **Text**.
* This should create three game objects: a **Text** object nested within a **Canvas** object, and an **EventSystem** object (which we will not need).

## Add the sample code

1. In the [Project Window](https://docs.unity3d.com/Manual/ProjectView.html), click the **Create** button and then select **C# script**. Name the script `HelloWorld`.

1. Edit the script by double-clicking it.

  > [!NOTE]
  > You can configure which code editor will be launched under **Edit** > **Preferences**, see the [Unity user manual](https://docs.unity3d.com/Manual/Preferences.html)).

1. Replace all code with the following:

   ```csharp
   // TODO
   ```

1. Locate and replace the string `YourSubscriptionKey` with your Speech Service subscription key.

1. Locate and replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription. For example, if you're using the free trial, the region is `westus`.

1. Save the changes to the script and close your code editor.

1. The script needs to be added as a component to one of your game objects.

  * Click on the **Canvas** object in the Hierarchy Window. This opens up its setting in the [Inspector Window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
  * Click the **Add Component** button in the Inspector Window, then search for the HelloWorld script we create above and add it.
  * You will note that the Hello World component has a **Recognized Text** property that says `None (Text)`.
    Click the Object Picker (the small circle icon to the right of the property), and choose the **Text** object you created earlier.

## Run the sample in the Unity Editor

* Press the **Play** button in the Unity Editor toolbar (below the menu bar).
  * When you say something after the app has been launched, you should see the recognized text in the Unity Editor's Game Window.
  * Check also the [Console Window](https://docs.unity3d.com/Manual/Console.html) for debug messages.
* Click the **Play** button again to stop running the app.

## Additional options to run this sample

TODO

### Build and run the sample as a stand-alone desktop application

TODO

### Build and run the sample as Universal Windows Platform application

TODO

### Build and run the sample for Android platform

TODO

## Next steps

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
