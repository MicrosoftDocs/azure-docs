---
title: 'Quickstart: Recognize speech, Unity - Speech Services'
titleSuffix: Azure Cognitive Services
description: Use this guide to create a speech-to-text application with Unity and the Speech SDK for Unity (Beta). When finished, you can use your computer's microphone to transcribe speech to text in real time.
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: wolfma
---

# Quickstart: Recognize speech with the Speech SDK for Unity (Beta)

Quickstarts are also available for [text-to-speech](quickstart-text-to-speech-csharp-unity.md).

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

Use this guide to create a speech-to-text application using [Unity](https://unity3d.com/) and the Speech SDK for Unity (Beta).
When finished, you can use your computer's microphone to transcribe speech to text in real time.
If you are not familiar with Unity, it is recommended to study the [Unity User Manual](https://docs.unity3d.com/Manual/UnityManual.html) before starting your application development.

> [!NOTE]
> The Speech SDK for Unity is currently in beta.
> It supports Windows Desktop (x86 and x64) or Universal Windows Platform (x86, x64, ARM/ARM64), and Android (x86, ARM32/64).

## Prerequisites

To complete this project, you'll need:

* [Unity 2018.3 or later](https://store.unity.com/) with [Unity 2019.1 adding support for UWP ARM64](https://blogs.unity3d.com/2019/04/16/introducing-unity-2019-1/#universal)
* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/)
     * For ARM64 support, install the [optional build tools for ARM64, and the Windows 10 SDK for ARM64](https://blogs.windows.com/buildingapps/2018/11/15/official-support-for-windows-10-on-arm-development/)
* A subscription key for the Speech Service. [Get one for free](get-started.md).
* Access to your computer's microphone.

## Create a Unity project

* Start Unity and under the **Projects** tab select **New**.
* Specify **Project name** as **csharp-unity**, **Template** as **3D** and pick a location.
  Then select **Create project**.
* After a bit of time, the Unity Editor window should pop up.

## Install the Speech SDK

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

* The Speech SDK for Unity (Beta) is packaged as a Unity asset package (.unitypackage).
  Download it from [here](https://aka.ms/csspeech/unitypackage).
* Import the Speech SDK by selecting **Assets** > **Import Package** > **Custom Package**.
  Check out the [Unity documentation](https://docs.unity3d.com/Manual/AssetPackages.html) for details.
* In the file picker, select the Speech SDK .unitypackage file that you downloaded above.
* Ensure that all files are selected and click **Import**:

  ![Screenshot of the Unity Editor when importing the Speech SDK Unity asset package](media/sdk/qs-csharp-unity-01-import.png)

## Add UI

We add a minimal UI to our scene, consisting of a button to trigger speech recognition and a text field to display the result.

* In the [Hierarchy Window](https://docs.unity3d.com/Manual/Hierarchy.html) (by default on the left), a sample scene is shown that Unity created with the new project.
* Click the **Create** button at the top of the Hierarchy Window, and select **UI** > **Button**.
* This creates three game objects that you can see in the Hierarchy Window: a **Button** object nested within a **Canvas** object, and an **EventSystem** object.
* [Navigate the Scene View](https://docs.unity3d.com/Manual/SceneViewNavigation.html) so you have a good view of the canvas and the button in the [Scene View](https://docs.unity3d.com/Manual/UsingTheSceneView.html).
* Click the **Button** object in the Hierarchy Window to display its settings in the [Inspector Window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
* Set the **Pos X** and **Pos Y** properties to **0**, so the button is centered in the middle of the canvas.
* Click the **Create** button at the top of the Hierarchy Window again, and select **UI** > **Text** to create a text field.
* Click the **Text** object in the Hierarchy Window to display its settings in the [Inspector Window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
* Set the **Pos X** and **Pos Y** properties to **0** and **120**, and set the **Width** and **Height** properties to **240** and **120** to ensure that the text field and the button do not overlap.

When you're done, the UI should look similar to this screenshot:

[![Screenshot of the quickstart user interface in the Unity Editor](media/sdk/qs-csharp-unity-02-ui-inline.png)](media/sdk/qs-csharp-unity-02-ui-expanded.png#lightbox)

## Add the sample code

1. In the [Project Window](https://docs.unity3d.com/Manual/ProjectView.html) (by default on the left bottom), click the **Create** button and then select **C# script**. Name the script `HelloWorld`.

1. Edit the script by double-clicking it.

   > [!NOTE]
   > You can configure which code editor will be launched under **Edit** > **Preferences**, see the [Unity User Manual](https://docs.unity3d.com/Manual/Preferences.html).

1. Replace all code with the following:

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp-unity/Assets/Scripts/HelloWorld.cs#code)]

1. Locate and replace the string `YourSubscriptionKey` with your Speech Services subscription key.

1. Locate and replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription. For example, if you're using the free trial, the region is `westus`.

1. Save the changes to the script.

1. Back in the Unity Editor, the script needs to be added as a component to one of your game objects.

   * Click on the **Canvas** object in the Hierarchy Window. This opens up the setting in the [Inspector Window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right).
   * Click the **Add Component** button in the Inspector Window, then search for the HelloWorld script we create above and add it.
   * Note that the Hello World component has two uninitialized properties, **Output Text** and **Start Reco Button**, that match public properties of the `HelloWorld` class.
     To wire them up, click the Object Picker (the small circle icon to the right of the property), and choose the text and button objects you created earlier.

     > [!NOTE]
     > The button also has a nested text object. Make sure you do not accidentally pick it for text output (or
     > rename one of the text objects using the Name field in the Inspector
     > Window to avoid that confusion).

## Run the application in the Unity Editor

* Press the **Play** button in the Unity Editor toolbar (below the menu bar).

* After the app launches, click the button and speak an English phrase or sentence into your computer's microphone. Your speech is transmitted to the Speech Services and transcribed to text, which appears in the window.

  [![Screenshot of the running quickstart in the Unity Game Window](media/sdk/qs-csharp-unity-03-output-inline.png)](media/sdk/qs-csharp-unity-03-output-expanded.png#lightbox)

* Check the [Console Window](https://docs.unity3d.com/Manual/Console.html) for debug messages.

* When you're done recognizing speech, click the **Play** button in the Unity Editor toolbar to stop the app.

## Additional options to run this application

This application can also be deployed to Android, as a Windows stand-alone app, or UWP application.
Refer to our [sample repository](https://aka.ms/csspeech/samples) in the quickstart/csharp-unity folder that describes the configuration for these additional targets.

## Next steps

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
