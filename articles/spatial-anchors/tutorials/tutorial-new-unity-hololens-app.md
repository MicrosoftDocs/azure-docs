---
title: 'Tutorial: Create a new HoloLens Unity app'
description: In this tutorial, you learn how to create a new HoloLens Unity app using Azure Spatial Anchors.
author: msftradford
manager: MehranAzimi-msft
services: azure-spatial-anchors

ms.author: parkerra
ms.date: 2/3/2021
ms.topic: tutorial
ms.service: azure-spatial-anchors
---

# Tutorial: Step-by-step instructions to create a new HoloLens Unity app using Azure Spatial Anchors

This tutorial will show you how to create a new HoloLens Unity app with Azure Spatial Anchors.

## Prerequisites

To complete this tutorial, make sure you have:

1. **PC** - A PC running Windows
2. **Visual Studio** - <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2019</a> installed with the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.18362.0 or newer)** component. The [C++/WinRT Visual Studio Extension (VSIX)](https://aka.ms/cppwinrt/vsix) for Visual Studio should be installed from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
3. **HoloLens** - A HoloLens device with [developer mode](/windows/mixed-reality/using-visual-studio) enabled. This article requires a HoloLens device with the [Windows 10 May 2020 Update](/windows/mixed-reality/whats-new/release-notes-may-2020). To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, then select the **Check for updates** button.
4. **Unity** - [Unity 2020.3.21](https://unity3d.com/get-unity/download) with modules **Universal Windwos Platform Build Support** and **Windows Build Support (IL2CPP)**

## Creating and setting up Unity Project

### Create New Project
1. Create a new **Unity** Project in **Unity Hub**
2. Select **3D**
3. Name your project and enter a save **Location**.
4. Select **Create**.
5. Save the empty default scene to a new file using: **File** > **Save As**.
6. Name the new scene **Main** and press the **Save** button.

### Import ASA and OpenXR
1. Launch [Mixed Reality Feature Toolkit](https://docs.microsoft.com/en-us/windows/mixed-reality/develop/unity/welcome-to-mr-feature-tool)
2. Select your project path - This is the folder that contains folders such as *Assets*, *Library*, *Logs*, etc - and click **Discover Features**
3. Under **Azure Mixed Reality Services** select **Azure Spatial Anchors SDK Core** and **Azure Spatial Anchors SDK for Windows**
4. Under **Platform Support** select **Mixed Reality OpenXR Plugin**
5. Press **Get Features** --> **Import** --> **Approve** --> **Exit**
6. When refocussing your Unity window, Unity will start importing the modules
7. If you get a message about using the new input system click **Yes** to restart Unity and enable the backends.

### Set up the project settings
We'll now set some Unity project settings that help us target the Windows Holographic SDK for development.
#### Change Build Platform
1. Select **File** > **Build Settings**
1. Select **Universal Windows Platform** then **Switch Platform**. Wait until Unity has finished processing all files.
#### Change OpenXR Settings 
1. Select **File** > **Build Settings** (it might still be open from the previous step)
1. Select **Player Settings...**
1. Select **XR Plug-in Management**
1. Make sure the **Universal Windows Platform Settings** tab is selected and check the box next to **OpenXR** and next to **Microsoft HoloLens feature group**
1. Click on the yellow warning sign next to **OpenXR** to display all OpenXR issues.
1. Select **Fix all**
1. To fix the issue *At least one interaction profile must be added* click on *Edit* to open the OpenXR Project settings. Then under **Interaction Profiles** select the **+** symbol and select **Microsoft Hand Interaction Profile**

#### Change Quality Settings
1. Select **Edit** > **Project Settings** > **Quality**
2. In the column under the **Universal Windows Platform** logo, click on the arrow at the **Default** row and select **Very Low**. You'll know the setting is applied correctly when the box in the **Universal Windows Platform**  column and **Very Low** row is green.

#### Set capabilities
1. Go to **Edit** > **Project Settings** > **Player** (you may still have it open from the previous step).
2. Make sure the **Universal Windows Platform Settings** tab is selected
3. In the **Publishing Settings** Configuration section, check the following
    1. InternetClient
    1. InternetClientServer
    1. PrivateNetworkClientServer
    1. SpatialPerception

#### Set up the main camera
1. In the **Hierarchy Panel**, select **Main Camera**.
2. In the **Inspector**, set its transform position to **0,0,0**.
3. Find the **Clear Flags** property, and change the dropdown from **Skybox** to **Solid Color**.
4. Click on the **Background** field to open a color picker.
5. Set **R, G, B, and A** to **0**.
6. Click **Add Component** and add the **Tracked Pose Driver** Component to the camera

## Creating the Scene

### Create the cube prefab
1. Go to **GameObject** -> **3D Object** -> **Cube**.
2. In the **Inspector**, set its scale to **0.1, 0.1, 0.1**.
3. Find the **Cube** object in the **Hierarchy** pane. Click on it and drag it into the **Assets** folder in the **Project** pane.
4. Right click and **Delete** the original cube you created in the **Hierarchy** pane.

You should now have a cube prefab in your **Project** pane.

## Trying it out
To test out that everything is working, build your app in **Unity** and deploy it from **Visual Studio**. Follow Chapter 6 from the [**MR Basics 100: Getting started with Unity** course](/windows/mixed-reality/holograms-100#chapter-6---build-and-deploy-to-device-from-visual-studio) to do so. You should see the Unity start screen, and then a clear display.

## Creating Scripts

1. In the **Project** pane, create a new folder, **Scripts**, under the **Assets** folder.
2. Right-click on the folder, then select **Create >**, **C# Script**. Title it **AzureSpatialAnchorsScript**.
3. Go to **GameObject** -> **Create Empty**.
4. Select it, and in the **Inspector** rename it from **GameObject** to **AzureSpatialAnchors**. Select **Add Component** and search for and add the **AzureSpatialAnchorsScript**
5. Still on the **AzureSpatialAnchors** select **Add Component** again and search for and add the **SpatialAnchorManager** script.

## Place an object in the real world
Let's create & place an object using your app. Open the Visual Studio solution that we created when we [deployed our app](#trying-it-out).

First, add the following imports into your `Assembly-CSharp (Universal Windows)\Scripts\AzureSpatialAnchorsScript.cs`:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=19-24)]

Then, add the following members variables into your `AzureSpatialAnchorsScript` class:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=26-47,53-57,65-84)]

Before we continue, we need to set the sphere prefab we created on our spherePrefab member variable. Go back to **Unity**.
1. In **Unity**, select the **MixedRealityCloud** object in the **Hierarchy** pane.
2. Click on the **Sphere** prefab that you saved in the **Project** pane. Drag the **Sphere** you clicked on into the **Sphere Prefab** area under **Azure Spatial Anchors Script (Script)** in the **Inspector** pane.

You should now have the **Sphere** set as the prefab on your script. Build from **Unity** and then open the resulting **Visual Studio** solution again, like you just did in [Trying it out](#trying-it-out).

In **Visual Studio**, open up `AzureSpatialAnchorsScript.cs` again. Add the following code into your `Start()` method. This code will hook up `GestureRecognizer`, which will call `HandleTap` when it detects an air tap.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=86-95,98&highlight=4-10)]

We now have to add the following `HandleTap()` method below `Update()`. It will do a ray cast and get a hit point at which to place a sphere.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=273-283,305-306,310-318)]

We now need to create the sphere. The sphere will initially be white, but this value will be adjusted later on. Add the following `CreateAndSaveSphere()` method:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=320-331,396)]

Run your app from **Visual Studio** to validate it once more. This time, tap the screen to create & place your white sphere over the surface of your choice.

## Set up the dispatcher pattern

When working with Unity, all Unity APIs (for example, APIs you use to do UI updates) need to happen on the main thread. In the code we'll write however, we get callbacks on other threads. We want to update UI in these callbacks, so we need a way to go from a side thread onto the main thread. To execute code on the main thread from a side thread, we'll use the dispatcher pattern.

Let's add a member variable, `dispatchQueue`, which is a Queue of Actions. We will push Actions onto the queue, and then dequeue and run the Actions on the main thread.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=43-56&highlight=6-9)]

Next, let's add a way to add an Action to the Queue. Add `QueueOnUpdate()` right after `Update()` :

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=112-122)]

We can use the Update() loop to check if there is an Action queued. If so, we will dequeue the Action and run it.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=100-110&highlight=4-10)]

## Get the Azure Spatial Anchors SDK

### Download packages
[!INCLUDE [Download Unity Packages](../../../includes/spatial-anchors-unity-download-packages.md)]

### Import packages
[!INCLUDE [Import Unity Packages](../../../includes/spatial-anchors-unity-import-packages.md)]

### Prepare code
In your **Visual Studio** solution, add the following import into your `<ProjectName>\Assets\Scripts\AzureSpatialAnchorsScript.cs`:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=18-21&highlight=1)]

Then, add the following member variables into your `AzureSpatialAnchorsScript` class:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=53-68&highlight=6-11)]

## Attach a local Azure Spatial Anchor to the local anchor

Let's set up Azure Spatial Anchor's CloudSpatialAnchorSession. We'll start by adding the following `InitializeSession()` method inside your `AzureSpatialAnchorsScript` class. Once called, it will ensure an Azure Spatial Anchors session is created and properly initialized during the startup of your app.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=179-208,211-215)]

We now need to write code to handle delegate calls. We'll add more to them as we continue.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=217-232)]

Now, let's hook your `initializeSession()` method into your `Start()` method.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=86-98&highlight=12)]

Finally, add the following code into your `CreateAndSaveSphere()` method. It will attach a local Azure Spatial Anchor to the sphere that we're placing in the real world.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=320-344,396&highlight=14-25)]

Before proceeding any further, you'll need to create an Azure Spatial Anchors account to get the account Identifier, Key, and Domain. If you don't already have those values, follow the next section to obtain them.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Upload your local anchor into the cloud

Once you have your Azure Spatial Anchors account Identifier, Key, and Domain, go and paste the `Account Id` into `SpatialAnchorsAccountId`, the `Account Key` into `SpatialAnchorsAccountKey`, and the `Account Domain` into `SpatialAnchorsAccountDomain`.

Finally, let's hook everything together. In your `CreateAndSaveSphere()` method, add the following code. It will invoke the `CreateAnchorAsync()` method as soon as your sphere is created. Once the method returns, the code below will update your sphere one last time, changing its color to blue.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=320-397&highlight=26-77)]

Run your app from **Visual Studio** once more. Move around your head and then air tap to place your sphere. Once we have
enough frames, the sphere will turn yellow, and the cloud upload will start. Once the upload finishes, your sphere will
turn blue. Optionally, you can also use the [Output window](/visualstudio/ide/reference/output-window)
while debugging inside **Visual Studio** to monitor the log messages your app is sending. Make sure you deploy the `Debug`
configuration of your app from Visual Studio to see the log messages. You can watch the `RecommendedForCreateProgress`,
and once the upload is complete, you'll be able to see the anchor identifier returned from the cloud.

> [!NOTE]
> If you get "DllNotFoundException: Unable to load DLL 'AzureSpatialAnchors': The specified module could not be found.", you should **Clean** and **Build** your solution again.

## Locate your cloud spatial anchor

One your anchor is uploaded to the cloud, we're ready to attempt locating it again. Let's add the following code into your `HandleTap()` method. This code will:

* Call `ResetSession()`, which will stop the `CloudSpatialAnchorSession` and remove our existing blue sphere from the screen.
* Initialize `CloudSpatialAnchorSession` again. We do this so we're sure the anchor we're going to locate comes from the cloud instead of being the local anchor we created.
* Create a **Watcher** that will look for the anchor we uploaded to Azure Spatial Anchors.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=273-311&highlight=13-31,35-36)]

Let's now add our `ResetSession()` and `CleanupObjects()` methods. You can put them below `QueueOnUpdate()`

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=124-177)]

We now need to hook up the code that will be invoked when the anchor we're querying for is located. Inside `InitializeSession()`, add the following callbacks:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=206-212&highlight=4-5)]


Now lets add code that will create & place a green sphere once the CloudSpatialAnchor is located. It will also enable screen tapping again, so you can repeat the whole scenario once more: create another local anchor, upload it, and locate it again.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=234-271)]

That's it! Run your app from **Visual Studio** one last time to try out the whole scenario end to end. Move around your device, and place your white sphere. Then, keep moving your head to capture environment data until the sphere turns yellow. Your local anchor will be uploaded, and your sphere will turn blue. Finally, tap your screen once more to remove your local anchor and begin a query for its cloud counterpart. Continue moving your device around until your cloud spatial anchor is located. A green sphere should appear in the correct location, and you can repeat the whole scenario again.

[!INCLUDE [AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md)]