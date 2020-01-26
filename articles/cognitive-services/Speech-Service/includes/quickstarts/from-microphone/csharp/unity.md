---
title: "Quickstart: Recognize speech from a microphone, C# (Unity)- Speech service"
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 12/17/2019
ms.author: erhopf
---


> [!NOTE]
> The Speech SDK for Unity supports Windows Desktop (x86 and x64) or Universal Windows Platform (x86, x64, ARM/ARM64), Android (x86, ARM32/64) and iOS (x64 simulator, ARM32 and ARM64)

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=unity)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=unity)
> * Make sure that you have access to a microphone for audio capture

If you've already done this, great. Let's keep going.

## Create a Unity project

1. Open Unity. If you're using Unity for the first time, the **Unity Hub** *<version number>* window appears. (You can also open Unity Hub directly to get to this window.)

   [![Unity Hub window](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-hub.png)](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-hub.png#lightbox)
1. Select **New**. The **Create a new project with Unity** *<version number>* window appears.

   [![Create a new project in Unity Hub](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-create-a-new-project.png)](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-create-a-new-project.png#lightbox)
1. In **Project Name**, enter **csharp-unity**.
1. In **Templates**, if **3D** isn't already selected, select it.
1. In **Location**, select or create a folder to save the project in.
1. Select **Create**.

After a bit of time, the Unity Editor window appears.



## Add UI

Now let's add a minimal UI to our scene. This UI consists of a button to trigger speech recognition and a text field to display the result. In the [**Hierarchy** window](https://docs.unity3d.com/Manual/Hierarchy.html), a sample scene is shown that Unity created with the new project.

1. At the top of the **Hierarchy** window, select **Create** > **UI** > **Button**.

   This action creates three game objects that you can see in the **Hierarchy** window: a **Button** object, a **Canvas** object containing the button, and an **EventSystem** object.

   [![Unity Editor environment](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-editor-window.png)](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-editor-window.png#lightbox)

1. [Navigate the **Scene** view](https://docs.unity3d.com/Manual/SceneViewNavigation.html) so you have a good view of the canvas and the button in the [**Scene** view](https://docs.unity3d.com/Manual/UsingTheSceneView.html).

1. In the [**Inspector** window](https://docs.unity3d.com/Manual/UsingTheInspector.html) (by default on the right), set the **Pos X** and **Pos Y** properties to **0**, so the button is centered in the middle of the canvas.

1. In the **Hierarchy** window, select **Create** > **UI** > **Text** to create a **Text** object.

1. In the **Inspector** window, set the **Pos X** and **Pos Y** properties to **0** and **120**, and set the **Width** and **Height** properties to **240** and **120**. These values ensure that the text field and the button don't overlap.

When you're done, the **Scene** view should look similar to this screenshot:

[![Scene view in the Unity Editor](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-02-ui-inline.png)](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-02-ui-inline.png#lightbox)

## Add the sample code

To add the sample script code for the Unity project, follow these steps:

1. In the [Project window](https://docs.unity3d.com/Manual/ProjectView.html), select **Create** > **C# script** to add a new C# script.

   [![Project window in the Unity Editor](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-project-window.png)](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-project-window.png#lightbox)
1. Name the script `HelloWorld`.

1. Double-click `HelloWorld` to edit the newly created script.

   > [!NOTE]
   > To configure the code editor to be used by Unity for editing, select **Edit** > **Preferences**, and then go to the **External Tools** preferences. For more information, see the [Unity User Manual](https://docs.unity3d.com/Manual/Preferences.html).

1. Replace the existing script with the following code:

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp/unity/from-microphone/Assets/Scripts/HelloWorld.cs#code)]

1. Find and replace the string `YourSubscriptionKey` with your Speech service subscription key.

1. Find and replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription. For example, if you're using the free trial, the region is `westus`.

1. Save the changes to the script.

Now return to the Unity Editor and add the script as a component to one of your game objects:

1. In the **Hierarchy** window, select the **Canvas** object.

1. In the **Inspector** window, select the **Add Component** button.

   [![Inspector window in the Unity Editor](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-inspector-window.png)](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-inspector-window.png#lightbox)

1. In the drop-down list, search for the `HelloWorld` script we created above and add it. A **Hello World (Script)** section appears in the **Inspector** window, listing two uninitialized properties, **Output Text** and **Start Reco Button**. These Unity component properties match public properties of the `HelloWorld` class.

1. Select the **Start Reco Button** property's object picker (the small circle icon to the right of the property), and choose the **Button** object you created earlier.

1. Select the **Output Text** property's object picker, and choose the **Text** object you created earlier.

   > [!NOTE]
   > The button also has a nested text object. Make sure you do not accidentally pick it for text output
   > (or rename one of the text objects using the **Name** field in the **Inspector** window to avoid confusion).

## Run the application in the Unity Editor

Now you're ready to run the application within the Unity Editor.

1. In the Unity Editor toolbar (below the menu bar), select the **Play** button (a right-pointing triangle).

1. Go to [**Game** view](https://docs.unity3d.com/Manual/GameView.html), and wait for the **Text** object to display **Click button to recognize speech**. (It displays **New Text** when the application hasn't started or isn't ready to respond.)

1. Select the button and speak an English phrase or sentence into your computer's microphone. Your speech is transmitted to the Speech service and transcribed to text, which appears in the **Game** view.

   [![Game view in the Unity Editor](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-03-output-inline.png)](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-unity-03-output-inline.png#lightbox)

1. Check the [**Console** window](https://docs.unity3d.com/Manual/Console.html) for debug messages. If the **Console** window isn't showing, go to the menu bar and select **Window** > **General** > **Console** to display it.

1. When you're done recognizing speech, select the **Play** button in the Unity Editor toolbar to stop the application.

## Additional options to run this application

This application can also be deployed to as an Android app, a Windows stand-alone app, or a UWP application.
For more information, see our [sample repository](https://aka.ms/csspeech/samples). The `quickstart/csharp-unity` folder describes the configuration for these additional targets.

## Next steps

[!INCLUDE [footer](./footer.md)]
