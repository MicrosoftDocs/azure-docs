---
title: 'Quickstart: Upgrade Quickstart HoloLens app to Unity 2020'
description: In this quickstart, you learn how to upgrade a Unity HoloLens app that uses Azure Object Anchors from Unity 2019 to Unity 2020.
author: RamonArguelles
manager: virivera
ms.author: rgarcia
ms.date: 05/27/2022
ms.topic: quickstart
ms.service: azure-object-anchors
ms.custom:
- mode-other
- kr2b-contr-experiment
---

# Quickstart: Upgrade Quickstart app to Unity 2020

In this quickstart, you upgrade a Unity HoloLens app that uses [Azure Object Anchors](../overview.md) from Unity 2019 to Unity 2020. Azure Object Anchors is a managed cloud service that converts 3D assets into AI models that enable object-aware mixed reality experiences for the HoloLens. When you finish, you'll have a HoloLens app built with Unity that can detect objects in the physical world.

You'll learn how to:

> [!div class="checklist"]
> * Upgrade the app from Unity 2019 to Unity 2020.
> * Upgrade package dependencies.
> * Update Unity build settings.

## Prerequisites

To complete this quickstart, make sure you have:

* All prerequisites from either the [Unity HoloLens](get-started-unity-hololens.md) or the [Unity HoloLens with MRTK](get-started-unity-hololens-mrtk.md) quickstarts
* <a href="https://unity3d.com/get-unity/download" target="_blank">Unity Hub with Unity 2020.3.8f1 or newer</a>

## Open and upgrade the sample project

Follow the steps from either the [Unity HoloLens](get-started-unity-hololens.md) or the [Unity HoloLens with MRTK](get-started-unity-hololens-mrtk.md) quickstarts to clone the [samples repository](https://github.com/Azure/azure-object-anchors), and download the Azure Object Anchors package for Unity.

1. Open Unity Hub. Select **Add** and pick either the `quickstarts/apps/unity/basic` or the `quickstarts/apps/unity/mrtk` project.
1. Under the **Unity Version** column, select the version of Unity 2020 in the dropdown that you've installed on your computer.
1. Under the **Target Platform** column, select **Universal Windows Platform**.
1. Select the **Project Name** column and open the sample in Unity.

   :::image type="content" source="./media/upgrade-unity-2020.png" alt-text="Screenshot shows a Unity page with Unity Version, Target Platform and ADD highlighted.":::

   You'll see a dialog asking for confirmation to upgrade your project. Select the **Confirm** button.

   :::image type="content" source="./media/confirm-unity-upgrade.png" alt-text="Screenshot shows a dialog confirming the upgrade with Confirm selected.":::

## Upgrade package dependencies

Once the upgrade process completes, **Unity Editor** opens.

1. Follow the <a href="/windows/mixed-reality/develop/unity/welcome-to-mr-feature-tool" target="_blank">Mixed Reality Feature Tool</a> documentation to set up the tool and learn how to use it.

1. Under **Platform Support**, install the **Mixed Reality OpenXR Plugin** feature package, version 1.0.0 or newer, into the Unity project folder.

1. If you're working with the `quickstarts/apps/unity/mrtk` project, also open the **Mixed Reality Toolkit** section, locate the **Mixed Reality Toolkit Foundation** and **Mixed Reality Toolkit Tools** feature packages, and upgrade them to version 2.7.0 or newer.

1. Go back to your **Unity Editor**. It might take a few minutes, while the **Mixed Reality Feature Tool** feature packages are installed.

   You'll see a dialog asking for confirmation to enable the new input system. Select **Yes**.

   :::image type="content" source="./media/new-input-system.png" alt-text="Screenshot shows a dialog that contains a warning with the Yes button highlighted.":::

   If you get a dialog asking you to overwrite MRTK shaders, select **Yes**.

   :::image type="content" source="./media/mrtk-shaders.png" alt-text="Screenshot shows the Mixed Reality Toolkit Standard Assets dialog.":::

Once the install process completes, Unity restarts automatically.

## Update configuration settings

Back in **Unity Editor**, follow the <a href="/windows/mixed-reality/develop/unity/new-openxr-project-with-mrtk#configure-openxr-settings" target="_blank">Configuring XR Plugin Management for OpenXR</a> documentation to set up the **XR Plugin Management** in your **Project Settings**. Then, follow the <a href="/windows/mixed-reality/develop/unity/new-openxr-project-with-mrtk#optimization" target="_blank">Optimization</a> documentation to apply the recommended project settings for HoloLens 2.

## Update MRTK settings

If you're working with the `quickstarts/apps/unity/mrtk` project, follow the steps below to adjust MRTK. Otherwise, skip to [Build, deploy, and run the app](#build-deploy-and-run-the-app).

1. In **Unity Editor**, navigate to `Assets/MixedReality.AzureObjectAnchors/Scenes`, and open **AOASampleScene**. Under the **Hierarchy** pane, select **MixedRealityToolkit**.

   :::image type="content" source="./media/open-sample-scene.png" alt-text="Screenshot shows the Unity Editor with the MixedRealityToolkit highlighted.":::

1. Under the **Inspector** pane, select **Camera**, and change the profile from  **ObsoleteXRSDKCameraProfile** to **DefaultMixedRealityCameraProfile**.

   :::image type="content" source="./media/update-camera-profile.png" alt-text="Screenshot shows the Unity Editor with Camera and DefaultMixedRealityCameraProfile highlighted.":::

1. Still in the **Inspector** pane, select **Input**, and expand the **Input Data Providers** dropdown list. Follow the <a href="/windows/mixed-reality/mrtk-unity/configuration/getting-started-with-mrtk-and-xrsdk#configuring-mrtk-for-the-xr-sdk-pipeline" target="_blank">Configuring MRTK for the XR SDK pipeline</a> documentation to set up the proper input data providers: **OpenXRDeviceManager** and **WindowsMixedRealityDeviceManager**.

   :::image type="content" source="./media/update-input-profile.png" alt-text="Screenshot shows the Unity Editor with Input and Input Data Providers highlighted.":::

## Build, deploy, and run the app

Your project is now fully upgraded to Unity 2020. Follow the instructions from either the [Unity HoloLens](get-started-unity-hololens.md) or the [Unity HoloLens with MRTK](get-started-unity-hololens-mrtk.md) quickstarts to build, deploy, and run the app.

## Next steps

> [!div class="nextstepaction"]
> [Concepts: SDK overview](../concepts/sdk-overview.md)

> [!div class="nextstepaction"]
> [FAQ](../faq.md)

> [!div class="nextstepaction"]
> [Conversion SDK](/dotnet/api/overview/azure/mixedreality.objectanchors.conversion-readme)
