---
title: 'Quickstart: In-depth MRTK walkthrough'
description: In this quickstart, you'll get an in-depth coverage of the Azure Object Anchors MRTK Unity sample application
author: RamonArguelles
manager: virivera

ms.author: rgarcia
ms.date: 07/12/2021
ms.topic: quickstart
ms.service: azure-object-anchors
---
# Quickstart: In-depth MRTK walkthrough

This guide provides an in-depth coverage of the [Azure Object Anchors MRTK Unity sample application](get-started-unity-hololens-mrtk.md). It is intended to provide insight into the design of the sample. By reading this guide, developers can accelerate their understanding of key Azure Object Anchors concepts in the sample.

## Project Layout

Assets created for the Azure Object Anchors MRTK Unity sample are stored in `Assets\MixedReality.AzureObjectAnchors`. Subfolders are as follows:

- **Icons**
  - Contains some custom icons used in the user facing menu.
- **Materials**
  - Contains shaders and materials for surface reconstruction visualization and a *depth only* shader, which writes to the depth buffer to help with hologram stabilization around text.
- **Prefabs**
  - Contains reusable Unity `GameObjects`. In particular, `TrackableObjectPrefab` represents the object created when Azure Object Anchors detects an object.
- **Profiles**
  - Contains customized MRTK profiles that describe the minimal required functionality from MRTK to enable the application.
- **Scenes**
  - Contains the `AOASampleTestScene`, which is the primary scene in the sample.
- **Scripts**
  - Contains the scripts written for the sample.

## Unity Scene

**Mixed Reality Play Space** –  Mostly boilerplate MRTK

- <a href="/windows/mixed-reality/develop/unity/mrtk-getting-started" target="_blank">Introducing MRTK for Unity</a>.
- There is a UI attached to the camera that details overall status of Azure Object Anchors (See `OverlayDebugText.cs`).

**Object Mixed Reality Play Space** – Mostly Azure Object Anchors related, but with some MRTK controls. Two scripts, `TrackableObjectSearch` and `ObjectTracker`, attached to the parent, represent the primary interface with Azure Object Anchors.

- **Menu**
  - Primarily MRTK code, but the UI interactions are directed at Azure Object Anchors functionality.
  - The attached `TrackableObjectMenu` script does the primary job of routing MRTK UI events to appropriate Azure Object Anchors calls.
  - <a href="/windows/mixed-reality/design/hand-menu" target="_blank">MRTK hand menu</a>.
- **WorkspaceBoundingBox**
  - Contains MRTK scripts associated with controlling a bounding box.
  - Also contains a `ModelVis` child object, which is used for visualizing the Azure Object Anchors model before a detection has occurred to help alignment during tricky detections.

## Next steps

> [!div class="nextstepaction"]
> [Concepts: SDK overview](../concepts/sdk-overview.md)

> [!div class="nextstepaction"]
> [FAQ](../faq.md)

> [!div class="nextstepaction"]
> [Conversion SDK](/dotnet/api/overview/azure/mixedreality.objectanchors.conversion-readme-pre)
