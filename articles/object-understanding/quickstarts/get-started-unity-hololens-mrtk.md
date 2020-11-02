---
title: 'Quickstart: Create a HoloLens app with Unity and MRTK'
description: In this quickstart, you learn how to build a HoloLens Unity app using Object Anchors.
author: craigktreasure
manager: virivera
services: azure-object-understanding

ms.author: crtreasu
ms.date: 04/02/2020
ms.topic: quickstart
ms.service: azure-object-understanding
---
# Quickstart: Create a HoloLens app with Azure Object Anchors, in Unity with MRTK

In this quickstart, you'll create a Unity HoloLens app that uses [Azure Object Anchors](../overview.md). Azure
Object Anchors is a managed cloud service that converts 3D assets into AI models that enable object-aware mixed
reality experiences for the HoloLens. When you're finished, you'll have a HoloLens app built with Unity that can detect
objects in the physical world.

You'll learn how to:

> [!div class="checklist"]
> * Prepare Unity build settings.
> * Export the HoloLens Visual Studio project.
> * Deploy the app and run it on a HoloLens 2 device.

[!INCLUDE [Unity quickstart prerequisites](../../../includes/object-understanding-quickstart-unity-prerequisites.md)]

[!INCLUDE [Unity device setup](../../../includes/object-understanding-quickstart-unity-device-setup.md)]

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/object-understanding-clone-sample-repository.md)]

In Unity, open the `quickstarts/apps/unity/ou-mrtk` project.

[!INCLUDE [Unity build and run](../../../includes/object-understanding-quickstart-unity-build-run.md)]

[!INCLUDE [Unity build sample scene](../../../includes/object-understanding-quickstart-unity-build-sample-scene.md)]

[!INCLUDE [Unity build and deploy](../../../includes/object-understanding-quickstart-unity-build-deploy.md)]

### Run the sample app

Turn on the device, click **All Apps**, and open the app. After the Unity splash screen, you should see a red bounding box. You can use your hand to move, scale, or rotate the bounding box. Place the box to cover the object you want to detect. Do a **facepalm** gesture to open the menu. Click **Lock SearchArea** to prevent further movement of the bounding box. Select **Start Search** to start object detection. When the object is detected, a mesh will be rendered on the object. Details of a detected instance will show on the screen, such as updated timestamp and surface coverage ratio. Click **Stop Search** to stop tracking and all detected instances will be removed.

You can also do other actions using the hand menu:

**Toggle SpatialMapping**: Show/hide spatial mapping rendering. This option can be used to debug if the scan is complete or not.

**High Precision Mode**: An experimental feature used to get a more accurate pose. This will require more system resources. The object mesh will be rendered in pink when in this mode. Click this button again to switch back to normal tracking mode.

**Lock/Unlock search area**: Lock area bounding box to prevent accidental movement by hands.

**Start/Stop Tracing**: Capture diagnostics data and save it to the device. See more detail in section **Debug Detection Issues and Capture Diagnostics**

**Upload Tracing**: Upload diagnostics data to the Object Anchors service. A user must provide their subscription account in `subscription.json` and upload it to the `LocalState` folder. A sample `subscription.json` file can be found below.

```json
{
  "AccountId": "<your account id>",
  "AccountKey": "<your account key>",
  "AccountRegion": "<your account region>"
}
```

:::image type="content" source="./media/unity-readme-handmenu.png" alt-text="Unity hand menu":::

[!INCLUDE [Unity setup Windows Device Portal](../../../includes/object-understanding-quickstart-unity-setup-device-portal.md)]

[!INCLUDE [Unity upload your model](../../../includes/object-understanding-quickstart-unity-upload-model.md)]

[!INCLUDE [Unity troubleshooting](../../../includes/object-understanding-quickstart-unity-troubleshooting.md)]

### Capturing diagnostics

If you're still not able to find the issue, you can capture diagnostics and send it to us.

Do a **facepalm** gesture and click **Start Tracing** (see section **Run the Sample App**).

Try to detect your object again.

Do a **facepalm** gesture and click **Stop Tracing**.

In Windows Device Portal, navigate to your application's `TempState` folder and download the `.zip` file. Send the `.zip` file to us.

:::image type="content" source="./media/portal-debug-diagnostics.png" alt-text="capture diagnostics":::

## Advanced: Semi-automated search area setup

The sample above requires a user to provide a tight bounding box to cover the target object. It could be hard to scale, rotate, and move the cubic box in 3D. To address this problem, we provide an advanced sample to demonstrate semi-automatic setup of a search area.

In Unity, navigate to `Assets/MixedReality.ObjectUnderstanding/Scenes`, open **OUAutoSearchArea**, add it to the scene build list. Optionally, adjust the two thresholds (explained below), then follow the above instructions for **OUSampleScene** to set up and build the app. When running the app, you can move the cubic box to partially cover the object in arbitrary orientation, then start the search. The cubic box will adjust automatically to fit to the object's position and orientation if detection succeeds.

:::image type="content" source="./media/unity-auto-search-area.png" alt-text="Unity Auto Search Area":::

There are two parameters to fine-tune the auto-adjustment. **Surface Coverage Scale** down-weights the default coverage threshold to allow a detection on partially observed data. **Bounding Box Scale** specifies the scale of adjusted bounding box.

The **OUAutoSearchArea** scene works with a single object model.  The **OUSampleScene** supports multiple object models.

## Next steps

> [!div class="nextstepaction"]
> [Concepts: SDK overview](../concepts/sdk-overview.md)

> [!div class="nextstepaction"]
> [FAQ](../faq.md)
