---
title: Tutorial - Step-by-step instructions to create a new HoloLens Unity app using Azure Spatial Anchors | Microsoft Docs
description: In this tutorial, you learn how to create a new HoloLens Unity app using Azure Spatial Anchors.
author: julianparismorgan
manager: vriveras
services: azure-spatial-anchors

ms.author: pmorgan
ms.date: 07/05/2019
ms.topic: tutorial
ms.service: azure-spatial-anchors
---

# Tutorial: Step-by-step instructions to create a new HoloLens Unity app using Azure Spatial Anchors

This tutorial will show you how to create a new HoloLens Unity app with Azure Spatial Anchors.

## Prerequisites

To complete this tutorial, make sure you have:

1. A Windows machine with <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2017+</a> installed with the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.17763.0 or newer)** component, and <a href="https://git-scm.com/download/win" target="_blank">Git for Windows</a>.
2. The [C++/WinRT Visual Studio Extension (VSIX)](https://aka.ms/cppwinrt/vsix) for Visual Studio should be installed from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
3. A HoloLens device with [developer mode](https://docs.microsoft.com/windows/mixed-reality/using-visual-studio) enabled. This article requires a HoloLens device with the [Windows 10 October 2018 Update](https://docs.microsoft.com/windows/mixed-reality/release-notes-october-2018 ) (also known as RS5). To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, then select the **Check for updates** button.

## Getting started

We'll first set up our project and Unity scene:
1. Start Unity.
2. Select **New**.
4. Ensure **3D** is selected.
5. Name your project and enter a save **Location**.
6. Click **Create project**.
7. Save the empty default scene to a new file using: **File** > **Save As**.
8. Name the new scene **Main** and press the **Save** button.

**Set up the project settings**

We'll now set some Unity project settings that help us target the Windows Holographic SDK for development. 

First, lets set quality settings for our application. 
1. Select **Edit** > **Project Settings** > **Quality**
2. In the column under the **Windows Store** logo, click on the arrow at the **Default** row and select **Very Low**. You'll know the setting is applied correctly when the box in the **Windows Store** column and **Very Low** row is green.

We need to let Unity know that the app we are trying to export should create an immersive view instead of a 2D view. We create an immersive view by enabling Virtual Reality support on Unity targeting the Windows 10 SDK.

1. Go to **Edit** > **Project Settings** > **Player**.
2. In the **Inspector Panel** for **Player Settings**, select the **Windows Store** icon.
3. Expand the **XR Settings** group.
4. In the **Rendering** section, check the **Virtual Reality Supported** checkbox to add a new **Virtual Reality SDK's** list.
5. Verify that **Windows Mixed Reality** appears in the list. If not, select the **+** button at the bottom of the list and choose **Windows Mixed Reality**.
 
> [!NOTE]
> If you do not see the Windows Store icon, double check to make sure you selected the Windows Store .NET Scripting Backend prior to installation. If not, you may need to reinstall Unity with the correct Windows installation.

**Verify .NET configuration**
1. Go to **Edit** > **Project Settings** > **Player** (you may still have **Player** open from the previous step).
2. In the **Inspector Panel** for **Player Settings**, select the **Windows Store** icon.
3. In the **Other Settings** Configuration section, make sure that **Scripting Backend** is set to **.NET**.

**Set capabilities**
1. Go to **Edit** > **Project Settings** > **Player** (you may still have **Player** open from the previous step).
2. In the **Inspector Panel** for **Player Settings**, select the **Windows Store** icon.
3. In the **Publishing Settings** Configuration section, check **InternetClientServer** and **SpatialPerception**.

**Set up the main virtual camera**
1. In the **Hierarchy Panel**, select **Main Camera**.
2. In the **Inspector**, set its transform position to **0,0,0**.
3. Find the **Clear Flags** property, and change the dropdown from **Skybox** to **Solid Color**.
4. Click on the **Background** field to open a color picker.
5. Set **R, G, B, and A** to **0**.
6. Select **Add Component** and search for and add the **Spatial Mapping Collider**.

**Create our script**
1. In the **Project** pane, create a new folder, **Scripts**, under the **Assets** folder. 
2. Right click on the folder, then select **Create >**, **C# Script**. Title it **AzureSpatialAnchorsScript**. 
3. Go to **GameObject** -> **Create Empty**. 
4. Select it, and in the **Inspector** rename it from **GameObject** to **MixedRealityCloud**. Select **Add Component** and search for and add the **AzureSpatialAnchorsScript**.

**Create the sphere prefab**
1. Go to **GameObject** -> **3D Object** -> **Sphere**.
2. In the **Inspector**, set its scale to **0.25, 0.25, 0.25**.
3. Find the **Sphere** object in the **Hierarchy** pane. Click on it and drag it into the **Assets** folder in the **Project** pane.
4. Right click and **Delete** the original sphere you created in the **Hierarchy** pane.

You should now have a sphere prefab in your **Project** pane.

## Trying it out
To test out that everything is working, build your app in **Unity** and deploy it from **Visual Studio**. Follow Chapter 6 from the [**MR Basics 100: Getting started with Unity** course](https://docs.microsoft.com/windows/mixed-reality/holograms-100#chapter-6---build-and-deploy-to-device-from-visual-studio) to do so. You should see the Unity start screen, and then a clear display.

## Place an object in the real world
Let's create & place an object using your app. Open the Visual Studio solution that we created when we [deployed our app](#trying-it-out). 

First, add the following imports into your `Assembly-CSharp (Universal Windows)\Scripts\AzureSpatialAnchorsScript.cs`:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=19-24)]

Then, add the following members variables into your `AzureSpatialAnchorsScript` class: 

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=26-42,48-52,60-79)]

Before we continue, we need to set the sphere prefab we created on our spherePrefab member variable. Go back to **Unity**.
1. In **Unity**, select the **MixedRealityCloud** object in the **Hierarchy** pane.
2. Click on the **Sphere** prefab that you saved in the **Project** pane. Drag the **Sphere** you clicked on into the **Sphere Prefab** area under **Azure Spatial Anchors Script (Script)** in the **Inspector** pane.

You should now have the **Sphere** set as the prefab on your script. Build from **Unity** and then open the resulting **Visual Studio** solution again, like you just did in [Trying it out](#trying-it-out). 

In **Visual Studio**, open up `AzureSpatialAnchorsScript.cs` again. Add the following code into your `Start()` method. This code will hook up `GestureRecognizer`, which will detect when there is an air tap and call `HandleTap`.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=81-90,93&highlight=4-10)]

We now have to add the following `HandleTap()` method below `Update()`. It will do a ray cast and get a hit point at which to place a sphere. 

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=267-277,299-300,304-312)]

We now need to create the sphere. The sphere will initially be white, but this value will be adjusted later on. Add the following `CreateAndSaveSphere()` method:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=314-325,390)]

Run your app from **Visual Studio** to validate it once more. This time, tap the screen to create & place your white sphere over the surface of your choice.

## Set up the dispatcher pattern

When working with Unity, all Unity APIs, for example APIs you use to do UI updates, need to happen on the main thread. In the code we'll write however, we get callbacks on other threads. We want to update UI in these callbacks, so we need a way to go from a side thread onto the main thread. To execute code on the main thread from a side thread, we'll use the dispatcher pattern. 

Let's add a member variable, dispatchQueue, which is a Queue of Actions. We will push Actions onto the queue, and then dequeue and run the Actions on the main thread. 

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=38-51&highlight=6-9)]

Next, let's add a way to add an Action to the Queue. Add `QueueOnUpdate()` right after `Update()` :

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=107-117)]

Let's now use the Update() loop to check if there is an Action queued. If so, we will dequeue the action and run it.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=95-105&highlight=4-10)]

## Get the Azure Spatial Anchors SDK

We'll now download the Azure Spatial Anchors SDK. Go to [Azure Spatial Anchors GitHub releases page](https://github.com/Azure/azure-spatial-anchors-samples/releases). Under Assets, download the **AzureSpatialAnchors.unitypackage** file. 

In Unity, go to **Assets**, click **Import Package** > **Custom Package...**. Navigate to the package and select **Open**.

In the new **Import Unity Package** window that pops up, select **None** at the bottom left. Then under **AzureSpatialAnchorsPlugin** > **Plugins**, select **Common**, **Editor**, and **HoloLens**. Click **Import** in the bottom-right corner.

We now need to restore Nuget packages in order to get Azure Spatial Anchors SDK. Build from **Unity** and then open and build the resulting **Visual Studio** solution again, as detailed in [Trying it out](#trying-it-out). 

In your **Visual Studio** solution, add the following import into your `<ProjectName>\Assets\Scripts\AzureSpatialAnchorsScript.cs`:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=23-26&highlight=1)]

Then, add the following member variables into your `AzureSpatialAnchorsScript` class:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=48-63&highlight=6-11)]

## Attach a local Azure Spatial Anchor to the local anchor

Let's set up Azure Spatial Anchor's CloudSpatialAnchorSession. We'll start by adding the following `InitializeSession()` method inside your `AzureSpatialAnchorsScript` class. Once called, it will ensure an Azure Spatial Anchors session is created and properly initialized during the startup of your app.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=174-202,205-209)]

We now need to write code to handle delegate calls. We'll add more to them as we continue.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=211-226)]

Now, let's hook your `initializeSession()` method into your `Start()` method.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=81-93&highlight=12)]

Finally, add the following code into your `CreateAndSaveSphere()` method. It will attach a local Azure Spatial Anchor to the sphere that we're placing in the real world.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=314-338,390&highlight=14-25)]

Before proceeding any further, you'll need to create an Azure Spatial Anchors account Identifier and Key, if you don't already have them. Follow the following section to obtain them.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Upload your local anchor into the cloud

Once you have your Azure Spatial Anchors account Identifier and Key, go and paste the `Account Id` into `SpatialAnchorsAccountId` and the `Account Key` into `SpatialAnchorsAccountKey`.

Finally, let's hook everything together. In your `SpawnNewAnchoredObject()` method, add the following code. It will invoke the `CreateAnchorAsync()` method as soon as your sphere is created. Once the method returns, the code below will perform one final update to your sphere, changing its color to blue.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=314-391&highlight=26-77)]

Run your app from **Visual Studio** once more. Move around your head and then air tap to place your sphere. Once we have enough frames, the sphere will turn into yellow, and the cloud upload will start. Once the upload finishes, your sphere will turn blue. Optionally, you could also use the Output window inside **Visual Studio** to monitor the log messages your app is sending. You'll be able to watch the recommended for create progress, as well as the anchor identifier that the cloud returns once the upload is completed.

> [!NOTE]
> If you get "DllNotFoundException: Unable to load DLL 'AzureSpatialAnchors': The specified module could not be found.", you should **Clean** and **Build** your solution again.

## Locate your cloud spatial anchor

One your anchor is uploaded to the cloud, we're ready to attempt locating it again. Let's add the following code into your `HandleTap()` method. This code will:

* Call `ResetSession()`, which will stop the `CloudSpatialAnchorSession` and remove our existing blue sphere from the screen.
* Initialize `CloudSpatialAnchorSession` again. We do this so we're sure the anchor we're going to locate comes from the cloud instead of being the local anchor we created.
* Create a **Watcher** that will look for the anchor we uploaded to Azure Spatial Anchors.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=267-305&highlight=13-31,35-36)]

Let's now add our `ResetSession()` and `CleanupObjects()` methods. You can put them below `QueueOnUpdate()`

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=119-172)]

We now need to hook up the code that will be invoked when the anchor we're querying for is located. Inside of `InitializeSession()`, add the following callbacks:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=200-206&highlight=4-5)]

 
Now lets add code that will create & place a green sphere once the CloudSpatialAnchor is located. It will also enable screen tapping again, so you can repeat the whole scenario once more: create another local anchor, upload it, and locate it again.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=228-265)]

That's it! Run your app from **Visual Studio** one last time to try out the whole scenario end to end. Move around your device, and place your white sphere. Then, keep moving your head to capture environment data until the sphere turns yellow. Your local anchor will be uploaded, and your sphere will turn blue. Finally, tap your screen once more, so that your local anchor is removed, and then we'll query for its cloud counterpart. Continue moving your device around until your cloud spatial anchor is located. A green sphere should appear in the correct location, and you can rinse & repeat the whole scenario again.

[!INCLUDE [AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md)]