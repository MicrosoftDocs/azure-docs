---
title: 'Quickstart: Create a HoloLens app with Unity and MRTK'
description: In this quickstart, you learn how to build a HoloLens Unity app using MRTK and Object Anchors.
author: craigktreasure
manager: virivera
services: azure-object-anchors
ms.author: crtreasu
ms.date: 09/08/2021
ms.topic: quickstart
ms.service: azure-object-anchors
ms.custom: mode-other
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

[!INCLUDE [Unity quickstart prerequisites](../../../includes/object-anchors-quickstart-unity-prerequisites.md)]

## Create an Object Anchors account

[!INCLUDE [Create Account](../../../includes/object-anchors-get-started-create-account.md)]

[!INCLUDE [Unity device setup](../../../includes/object-anchors-quickstart-unity-device-setup.md)]

[!INCLUDE [Unity upload your model](../../../includes/object-anchors-quickstart-unity-upload-model.md)]

## Open the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/object-anchors-clone-sample-repository.md)]

[!INCLUDE [Download Unity Package](../../../includes/object-anchors-quickstart-unity-download-package.md)]

In Unity, open the `quickstarts/apps/unity/mrtk` project.

[!INCLUDE [Import Unity Package](../../../includes/object-anchors-quickstart-unity-import-package.md)]

[!INCLUDE [Configure Account](../../../includes/object-anchors-get-started-configure-account.md)]

[!INCLUDE [Unity build sample scene 1](../../../includes/object-anchors-quickstart-unity-build-sample-scene-1.md)]

When a "TMP Importer" dialog prompts you to import TextMesh Pro resources, select "Import TMP Essentials" to do so.
:::image type="content" source="./media/textmesh-pro-importer-dialog.png" alt-text="Import TextMesh Pro resources":::

[!INCLUDE [Unity build sample scene 2](../../../includes/object-anchors-quickstart-unity-build-sample-scene-2.md)]

[!INCLUDE [Unity build and deploy](../../../includes/object-anchors-quickstart-unity-build-deploy.md)]

 After the Unity splash screen, you should see a white bounding box. You can use your hand to move, scale, or rotate the bounding box. Place the box to cover the object you want to detect.

Open the <a href="/windows/mixed-reality/mrtk-unity/features/ux-building-blocks/hand-menu" target="_blank">hand menu</a> and select **Lock SearchArea** to prevent further movement of the bounding box. Select **Start Search** to start object detection. When the object is detected, a mesh will be rendered on the object. Details of a detected instance will show on the screen, such as updated timestamp and surface coverage ratio. Select **Stop Search** to stop tracking and all detected instances will be removed.

#### The app menus

You can also do other actions using the <a href="/windows/mixed-reality/mrtk-unity/features/ux-building-blocks/hand-menu" target="_blank">hand menu</a>.

##### Primary menu

* **Start Search / Stop Search** – Starts or stops the object detection process.
* **Toggle Spatial Mapping** – Show/hide spatial mapping rendering. This option can be used to debug if the scan is complete or not.
* **Tracker Settings** – Toggles activation of the tracker settings menu.
* **Search Area Settings** – Toggles activation of the search area settings menu.
* **Start Tracing** – Capture diagnostics data and save it to the device. See more detail in section **Debug Detection Issues and Capture Diagnostics**.
* **Upload Tracing** – Upload diagnostics data to the Object Anchors service.

    :::image type="content" source="./media/mrtk-hand-menu-primary.png" alt-text="Unity primary hand menu":::

##### Tracker settings menu

* **High Accuracy** – An experimental feature used to get a more accurate pose. Enabling this option will require more system resources during object detection. The object mesh will be rendered in pink when in this mode. Select this button again to switch back to normal tracking mode.
* **Relaxed Vertical Alignment** – When enabled, allows an object to be detected at a non-vertical angle. Useful for detecting objects on ramps.
* **Allow Scale Change** – Allows the tracker to change the size of the detected object based on environmental information.
* **Coverage Ratio Slider** – Adjusts the proportion of surface points that must match for the tracker to detect an object.  Lower values allow the tracker to better detect objects that are challenging for the HoloLens sensors to detect, such as dark objects or highly reflective objects. Higher values will reduce the frequency of false detections.

    :::image type="content" source="./media/mrtk-hand-menu-tracker.png" alt-text="Unity tracker hand menu":::

##### Search Area settings menu

* **Lock Search Area** – Lock area bounding box to prevent accidental movement by hands.
* **Auto-Adjust Search Area** – Allows the search area to reposition itself during object detection.
* **Cycle Mesh** – Cycles through visualizing the loaded meshes inside the search area.  This option can help users align the search box for hard to detect objects.

    :::image type="content" source="./media/mrtk-hand-menu-search-area.png" alt-text="Unity search area hand menu":::

[!INCLUDE [Unity troubleshooting](../../../includes/object-anchors-quickstart-unity-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: In-depth MRTK walkthrough](in-depth-mrtk-walkthrough.md)

> [!div class="nextstepaction"]
> [Concepts: SDK overview](../concepts/sdk-overview.md)

> [!div class="nextstepaction"]
> [FAQ](../faq.md)

> [!div class="nextstepaction"]
> [Conversion SDK](/dotnet/api/overview/azure/mixedreality.objectanchors.conversion-readme)

> [!div class="nextstepaction"]
> [Troubleshooting object detection](../troubleshoot/object-detection.md)
