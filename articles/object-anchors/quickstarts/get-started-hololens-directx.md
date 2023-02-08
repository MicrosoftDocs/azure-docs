---
title: 'Quickstart: HoloLens app with DirectX'
description: In this quickstart, you learn how to build a HoloLens app using the Azure Object Anchors service and DirectX.
author: craigktreasure
manager: virivera
ms.author: crtreasu
ms.date: 05/20/2022
ms.topic: quickstart
ms.service: azure-object-anchors
ms.custom:
- mode-api
- kr2b-contr-experiment
---

# Quickstart: Create a HoloLens app with Azure Object Anchors, in C++/WinRT and DirectX

This quickstart covers how to create a HoloLens app using [Azure Object Anchors](../overview.md) in C++/WinRT and DirectX.
Object Anchors is a managed cloud service that converts 3D assets into AI models that enable object-aware mixed reality experiences for the HoloLens.
When you're finished, you'll have a HoloLens app that can detect an object and its pose in a Holographic DirectX 11 (Universal Windows) application.

You'll learn how to:

> [!div class="checklist"]
> * Create and side-load a HoloLens application
> * Detect an object and visualize its model

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart, make sure you have:

* A physical object in your environment and its 3D model, either CAD or scanned.
* A Windows computer with the following installed:
  * <a href="https://git-scm.com" target="_blank">Git for Windows</a>
  * <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2019</a> with the **Universal Windows Platform development** workload and the **Windows 10 SDK (10.0.18362.0 or newer)** component
* A HoloLens 2 device that is up to date and has [developer mode](/windows/mixed-reality/using-visual-studio#enabling-developer-mode) enabled.
  * To update to the latest release on HoloLens, open the **Settings** app, go to **Update & Security**, and then select **Check for updates**.

## Create an Object Anchors account

[!INCLUDE [Create Account](../../../includes/object-anchors-get-started-create-account.md)]

[!INCLUDE [Upload your model](../../../includes/object-anchors-quickstart-unity-upload-model.md)]

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/object-anchors-clone-sample-repository.md)]

Open *quickstarts/apps/directx/DirectXAoaSampleApp.sln* in Visual Studio.

Change the **Solution Configuration** to **Release**, change **Solution Platform** to **ARM64**, select **Device** from the deployment target options.

## Configure the account information

The next step is to configure the app to use your account information. You took note of the **Account Key**, **Account ID**, and **Account Domain** values, in the ["Create an Object Anchors account"](#create-an-object-anchors-account) section.

Open *Assets\ObjectAnchorsConfig.json*.

Locate the `AccountId` field and replace `Set me` with your Account ID.

Locate the `AccountKey` field and replace `Set me` with your Account Key.

Locate the `AccountDomain` field and replace `Set me` with your Account Domain.

Now, build the **AoaSampleApp** project by right-clicking the project and selecting **Build**.

:::image type="content" source="./media/vs-deploy-to-device.png" alt-text="Screenshot shows configuring Visual Studio project to deploy.":::

## Deploy the app to HoloLens

After compiling the sample project successfully, you can deploy the app to HoloLens.

Ensure the HoloLens device is powered on and connected to the PC through a USB cable. Make sure **Device** is the chosen deployment target, as above.

Right-click **AoaSampleApp** project, then select **Deploy** from the context menu to install the app. If no error shows up in Visual Studio's **Output Window**, the app will be installed on HoloLens.

:::image type="content" source="./media/vs-deploy-app.png" alt-text="Screenshot shows the context menu for the project with Deploy selected.":::

Before launching the app, you ought to have uploaded an object model, *chair.ou* for example, to the *3D Objects* folder on your HoloLens. If you haven't, follow the instructions in the [Upload your model](#upload-your-model) section.

To launch and debug the app, select **Debug** > **Start debugging**.

## Ingest object model and detect its instance

The **AoaSampleApp** app is now running on your HoloLens device. Walk close, within 2-meter distance, to the target object (chair) and scan it by looking at it from multiple perspectives. You should see a pink bounding box around the object with some yellow points rendered close to object's surface, which indicates that it was detected. You should also see a yellow box that indicates the search area.

:::image type="content" source="./media/chair-detection.png" alt-text="Photograph shows a chair with the bounding box, point cloud, and search area.":::

You can define a search space for the object in the app by finger clicking in the air with either your right or left hand. The search space will switch among a sphere of 2-meters radius, a 4 m^3 bounding box and a view frustum. For larger objects such as cars, the best choice is usually to use the view frustum selection while standing facing a corner of the object at about a 2-meter distance. Each time the search area changes, the app removes instances currently being tracked. It then tries to find them again in the new search area.

This app can track multiple objects at one time. To do that, upload multiple models to the *3D Objects* folder of your device and set a search area that covers all the target objects. It may take longer to detect and track multiple objects.

The app aligns a 3D model to its physical counterpart closely. A user can air tap using their left hand to turn on the high precision tracking mode, which computes a more accurate pose. This feature is still experimental. It consumes more system resources and could result in higher jitter in the estimated pose. Air tap again with the left hand to switch back to the normal tracking mode.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Ingesting a 3D Model](./get-started-model-conversion.md)

> [!div class="nextstepaction"]
> [Concepts: SDK overview](../concepts/sdk-overview.md)

> [!div class="nextstepaction"]
> [FAQ](../faq.md)

> [!div class="nextstepaction"]
> [Conversion SDK](/dotnet/api/overview/azure/mixedreality.objectanchors.conversion-readme)

> [!div class="nextstepaction"]
> [Troubleshooting object detection](../troubleshoot/object-detection.md)
