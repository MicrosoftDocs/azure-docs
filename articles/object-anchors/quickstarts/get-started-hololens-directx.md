---
title: 'Quickstart: Create a HoloLens app with DirectX'
description: In this quickstart, you learn how to build a HoloLens app using Object Anchors.
author: craigktreasure
manager: virivera

ms.author: crtreasu
ms.date: 02/02/2021
ms.topic: quickstart
ms.service: azure-object-anchors
---
# Quickstart: Create a HoloLens app with Azure Object Anchors, in C++/WinRT and DirectX

This quickstart covers how to create a HoloLens app using [Azure Object Anchors](../overview.md) in C++/WinRT and
DirectX. Azure Object Anchors is a managed cloud service that converts 3D assets into AI models that enable
object-aware mixed reality experiences for the HoloLens. When you're finished, you'll have a HoloLens app that can detect
an object and its pose in a Holographic DirectX 11 (Universal Windows) application.

You'll learn how to:

> [!div class="checklist"]
> * Create and side-load a HoloLens application
> * Detect an object and visualize its model

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

* A physical object in your environment and its 3D model (either CAD or scanned).
* A Windows machine with the following installed:
  * <a href="https://git-scm.com" target="_blank">Git for Windows</a>
  * <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2019</a> with the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.18362.0 or newer)** component
* A HoloLens 2 device that is up to date and has [developer mode](/windows/mixed-reality/using-visual-studio#enabling-developer-mode) enabled.
  * To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, and then select **Check for updates**.

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/object-anchors-clone-sample-repository.md)]

Open `quickstarts/apps/directx/DirectXAoaSampleApp.sln` in Visual Studio.

Change the **Solution Configuration** to **Release**, change **Solution Platform** to **ARM64**, select **Device** from the deployment target options. Then build the **AoaSampleApp** project by right-clicking the project and selecting **Build**.

:::image type="content" source="./media/vs-deploy-to-device.png" alt-text="Configure Visual Studio project to deploy":::

## Deploy the app to HoloLens

After compiling the sample project successfully, you can deploy the app to HoloLens.

Power on the HoloLens device, sign in, and connect it to the PC using a USB cable. Make sure **Device** is the chosen deployment target (see above).

Right-click **AoaSampleApp** project, then click **Deploy** from the pop-up menu to install the app. If no error shows up in Visual Studio's **Output Window**, the app will be installed on HoloLens.

:::image type="content" source="./media/vs-deploy-app.png" alt-text="Deploy app to HoloLens":::

Before launching the app, you need to upload an object model. Follow the instructions in **Ingest object model and detect its instance** section below.

To launch and debug the app, select **Debug > Start debugging**. To stop the app, select either **Stop Debugging** or press **Shift + F5**.

## Ingest object model and detect its instance

You'll need to create an object model to run the sample app. Assume you've already got either a CAD or scanned 3D mesh model of an object in your space. Refer to [Quickstart: Ingesting a 3D Model](./get-started-model-conversion.md) on how to create a model.

Download that model, **chair.ou** in our case, to your computer. Then, from the HoloLens device portal, select **System > File explorer > LocalAppData > AoaSampleApp > LocalState** and select **Browse...**. Then select your model file, **chair.ou** for example, and select **Upload**. You should then see the model file in the local cache.

:::image type="content" source="../../../includes/media/object-anchors-quickstarts/portal-upload-model.png" alt-text="Portal Upload Model":::

From the HoloLens, launch the **AoaSampleApp** app (if it was already open, close it, and reopen it). Walk close (within 2-meter distance) to the target object (chair) and scan it by looking at it from multiple perspectives. You should see a pink bounding box around the object with some yellow points rendered close to object's surface, which indicates that it was detected.

:::image type="content" source="./media/chair-detection.png" alt-text="Chair Detection":::

Figure: a detected chair rendered with its bounding box (pink), point cloud (yellow), and a search area (large yellow box).

You can define a search space for the object in the app by finger clicking in the air with either your right or left hand. The search space will switch among a sphere of 2-meters radius, a 4 m^3 bounding box and a view frustum. For larger objects such as cars, the best choice will typically be to use the view frustum selection while standing facing a corner of the object at about a 2-meter distance.
Each time the search area changes, the app will remove instances currently being tracked, and then try to find them again in the new search area.

This app can track multiple objects at one time. To do that, upload multiple models to the **LocalState** folder and set a search area that covers all the target objects. It may take longer to detect and track multiple objects.

The app aligns a 3D model to its physical counterpart closely. A user can air tap using their left hand to turn on the high precision tracking mode, which computes a more accurate pose. This is still an experimental feature, which consumes more system resources, and could result in higher jitter in the estimated pose. Air tap again with the left hand to switch back to the normal tracking mode.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Ingesting a 3D Model](./get-started-model-conversion.md)

> [!div class="nextstepaction"]
> [Concepts: SDK overview](../concepts/sdk-overview.md)

> [!div class="nextstepaction"]
> [FAQ](../faq.md)