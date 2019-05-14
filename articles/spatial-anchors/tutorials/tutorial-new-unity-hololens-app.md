---
title: Tutorial - Step-by-step instructions to create a new HoloLens Unity app using Azure Spatial Anchors | Microsoft Docs
description: In this tutorial, you learn how to create a new HoloLens Unity app using Azure Spatial Anchors.
author: julianparismorgan
manager: vriveras
services: azure-spatial-anchors

ms.author: pmorgan
ms.date: 05/07/2019
ms.topic: tutorial
ms.service: azure-spatial-anchors
---

# Tutorial: Step-by-step instructions to create a new Android app using Azure Spatial Anchors

This tutorial will show you how to create a new HoloLens Unity app using with Azure Spatial Anchors.

## Prerequisites

To complete this tutorial, make sure you have:

- A Windows machine with <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2017+</a> installed with the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.17763.0 or newer)** component, and <a href="https://git-scm.com/download/win" target="_blank">Git for Windows</a>.
- The [C++/WinRT Visual Studio Extension (VSIX)](https://aka.ms/cppwinrt/vsix) for Visual Studio should be installed from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).
- A HoloLens device with [developer mode](https://docs.microsoft.com/windows/mixed-reality/using-visual-studio) enabled. This article requires a HoloLens device with the [Windows 10 October 2018 Update](https://docs.microsoft.com/windows/mixed-reality/release-notes-october-2018 ) (also known as RS5). To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, then select the **Check for updates** button.

## Getting started

We'll first set up our project and Unity scene:
- Start Unity.
- Select **New**.
- Ensure **3D** is selected.
- Name your project (we're using "ASAHoloLensUnityProject") and enter a save **Location**.
- Select Origami and click Select Folder.
- Save the empty default scene to a new file using: **File** > **Save As**.
- Name the new scene **Main** and press the Save button.

**Set up the main virtual camera**
- In the **Hierarchy Panel**, select **Main Camera**.
- In the **Inspector**, set its transform position to **0,0,0**.
- Find the **Clear Flags** property, and change the dropdown from **Skybox** to **Solid color**.
- Click on the **Background** field to open a color picker.
- Set **R, G, B, and A** to **0**.
- Select **Add Component** and search for **Spatial Mapping Collider**. 

**Set up the Project Settings**

We'll now set some Unity project settings that help us target the Windows Holographic SDK for development. 

First, lets set quality settings for our application. 
- Select **Edit** > **Project Settings** > **Quality**
- Select the dropdown under the **Windows Store** logo and select **Very Low**. You'll know the setting is applied correctly when the box in the Windows Store column and Fastest row is green.

We need to let Unity know that the app we are trying to export should create an immersive view instead of a 2D view. We create an immersive view by enabling Virtual Reality support on Unity targeting the Windows 10 SDK.

- Go to **Edit** > **Project Settings** > **Player**.
- In the **Inspector Panel** for **Player Settings**, select the **Windows Store** icon.
- Expand the **XR Settings** group.
- In the **Rendering** section, check the **Virtual Reality Supported** checkbox to add a new **Virtual Reality SDK's** list.
- Verify that **Windows Mixed Reality** appears in the list. If not, select the **+** button at the bottom of the list and choose **Windows Mixed Reality**.
 
> [!NOTE]
> If you do not see the Windows Store icon, double check to make sure you selected the Windows Store .NET Scripting Backend prior to installation. If not, you may need to reinstall Unity with the correct Windows installation.

**Verify .NET configuration**
- Go to **Edit** > **Project Settings** > **Player** (you may still have **Player** open from the previous step).
- In the **Inspector Panel** for **Player Settings**, select the **Windows Store** icon.
- In the **Other Settings** Configuration section, make sure that **Scripting Backend** is set to **.NET**.

**Set Capabilities**
- Go to **Edit** > **Project Settings** > **Player** (you may still have **Player** open from the previous step).
- In the **Inspector Panel** for **Player Settings**, select the **Windows Store** icon.
- In the **Publishing Settings** Configuration section, check **InternetClientServer** and **SpatialPerception**.

**Create our script**
- Under **Project**, create a new folder, **Scripts**. 
- Right click on the folder, then select **Create >**, **C# Script**. Title it **AzureSpatialAnchorsScript**. 
- Go to **GameObject** -> **Create Empty**. 
- Select it, and in the **Inspector** rename it from GameObject to **MixedRealityCloud**. Select **Add Component** and search for and add the **AzureSpatialAnchorsScript**.

## Trying it out
To test out that everything is working, build your app in **Unity** and deploy it from **Visual Studio**. Follow Chapter 6 from the [**MR Basics 100: Getting started with Unity** course to do so.](https://docs.microsoft.com/en-us/windows/mixed-reality/holograms-100#chapter-6---build-and-deploy-to-device-from-visual-studio)

## Place an object in the real world
Let's create & place an object using your app. Open the Visual Studio solution that we created when we [deployed our app](#trying-it-out). 

First, add the following imports into your `<ProjectName>\Assets\Scripts\AzureSpatialAnchorsScript.cs`:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=18-24)]

Then, add the following members variables into your `AzureSpatialAnchorsScript` class: 

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=26-41,43-46,55-69)]

Next, add the following code into your `Start()` method. This code will hook up `GestureRecognizer`, which will detect when there is an air tap and call `HandleTap`.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=77-85&highlight=3-9))]

Finally, add the following `HandleTap()` method. It will do a ray cast and get a hit point at which to place a sphere. 

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=264-274,295-297,304-309)]

We now need to create the sphere. The sphere will initially be white, but this value will be adjusted later on.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=311-327)]

[Redeploy](#trying-it-out) your app to validate it once more. This time, you tap the screen to create & place your white sphere over the surface of your choice.

## Get the Azure Spatial Anchors SDK

We'll now download the Azure Spatial Anchors SDK. Go to [Azure Spatial Anchors GitHub releases page](https://github.com/Azure/azure-spatial-anchors-samples/releases). Under Assets, download the **AzureSpatialAnchors.unitypackage** file. 

In Unity, go to **Assets**, click **Import Package** -> **Custom Package...**. Navigate to the package and select **Open**.

In the new **Import Unity Package** window that pops up, select **None** at the bottom left. Then go back in and select **Common**, **Editor**, and **HoloLens** under **AzureSpatialAnchorsPlugin** > **Plugins**. Click **Import** in the bottom-right corner.

We now need to restore Nuget packages in order to get Azure Spatial Anchors SDK. [Redeploy](#trying-it-out) your app to do so. To make sure you have the SDK, go to **References** and ensure that **Microsoft.Azure.SpatialAnchors.WinCPP** is there.

Next add the following import into your `<ProjectName>\Assets\Scripts\AzureSpatialAnchorsScript.cs`:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=18-21&highlight=1)]

Then, add the following member variables into your `MainActivity` class:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=43-58&highlight=6-11)]

## Set up the dispatcher pattern

When working with Unity, all Unity APIs, for example APIs you use to do UI updates, need to happen on the main thread. In the code we'll write however, we get callbacks on other threads. We want to update UI in these callbacks, so we need a way to go from a side thread onto the main thread. To execute code on the main thread from a side thread, we'll use the dispatcher pattern. 

Let's add a member variable, dispatchQueue, which is a Queue of Actions. We will push Actions onto the queue, and then dequeue and run the Actions on the main thread. 

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=33-46&highlight=6-9)]

Next, let's add a way to add an Action to the Queue:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=102-112)]

Let's now use the Update() loop to check if there is an Action queued. If so, we will dequeue the action and run it.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=90-112&highlight=4-10)]


## Attach a local Azure Spatial Anchor to the local anchor

Let's set up Azure Spatial Anchor's CloudSpatialAnchorSession. We'll start by adding the following `initializeSession()` method inside your `AzureSpatialAnchorsScript` class. Once called, it will ensure an Azure Spatial Anchors session is created and properly initialized during the startup of your app.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=169-204)]

Now, let's hook your `initializeSession()` method into your `Start()` method.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=76-88&highlight=12)]

We now need to write code to handle delegate calls. We'll add more to them as we continue.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=206-221)]

Finally, add the following code into your `CreateAndSaveSphere()` method. It will attach a local Azure Spatial Anchor to the sphere that we're placing in the real world.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=311-343&highlight=16-33)]

Before proceeding any further, you'll need to create an Azure Spatial Anchors account Identifier and Key, if you don't already have them. Follow the following section to obtain them.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Upload your local anchor into the cloud

Once you have your Azure Spatial Anchors account Identifier and Key, go and paste the `Account Id` into `SpatialAnchorsAccountId` and the `Account Key` into `SpatialAnchorsAccountKey`.

Finally, let's hook everything together. In your `SpawnNewAnchoredObject()` method, add the following code. It will invoke the `CreateAnchorAsync()` method as soon as your sphere is created. Once the method returns, the code below will perform one final update to your sphere, changing its color to blue.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=311-343&highlight=16-70)]

[Redeploy](#trying-it-out) your app once more. Move around your device, tap the screen, and place your sphere. Once we have enough frames, the sphere will turn into yellow, and the cloud upload will start. Once the upload finishes, your sphere will turn blue. Optionally, you could also use the Output window inside Visual Studio to monitor the log messages your app is sending. You'll be able to watch the recommended for create progress, as well as the anchor identifier that the cloud returns once the upload is completed.

## Locate your cloud spatial anchor

One your anchor is uploaded to the cloud, we're ready to attempt locating it again. Let's add the following code into your `HandleTap()` method. This code will:

* Call `ResetSession()`, which will stop the `CloudSpatialAnchorSession` and remove our existing blue sphere from the screen.
* Initialize our Azure Spatial Anchors session again. This action will ensure that the anchor we're going to locate comes from the cloud instead of the local anchor we created.
* Issue a query for the anchor we uploaded to the cloud.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=264-302&highlight=13-31,34-36)]

Let's now add our `ResetSession()` and `CleanupObjects()` methods:

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=114-167)]

We can now transition from creating an anchor into looking for it. Let's next hook up the code that will be invoked when the anchor we're querying for is located. Inside your `DetectCollisions(TappedEventArgs tapEvent)` method, add the following code. This snippet will create & place a green sphere once the cloud spatial anchor is located. It will also enable screen tapping again, so you can repeat the whole scenario once more: create another local anchor, upload it, and locate it again. One thing to note - when you go through the steps again, we won't restart the session in between locating an anchor and creating the next anchor.

[!code-csharp[AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md?range=223-257)]

That's it! [Redeploy](#trying-it-out) your app one last time to try out the whole scenario end to end. Move around your device, and place your white sphere. Then, keep moving your head to capture environment data until the sphere turns yellow. Your local anchor will be uploaded, and your sphere will turn blue. Finally, tap your screen once more, so that your local anchor is removed, and then we'll query for its cloud counterpart. Continue moving your device around until your cloud spatial anchor is located. A green sphere should appear in the correct location, and you can rinse & repeat the whole scenario again.

## Putting everything together

Here is how the complete `AzureSpatialAnchorsScript.cs` class file should look like, after all the different elements have been put together. You can use it as a reference to compare against your own file, and spot if you may have any differences left.

[!INCLUDE [AzureSpatialAnchorsScript](../../../includes/spatial-anchors-new-unity-hololens-app-finished.md)]