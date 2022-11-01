---
title: 'Quickstart: In-depth MRTK walkthrough'
description: In this quickstart, you'll get an in-depth coverage of the Azure Object Anchors MRTK Unity sample application
author: RamonArguelles
manager: virivera
ms.author: rgarcia
ms.date: 07/12/2021
ms.topic: quickstart
ms.service: azure-object-anchors
ms.custom: mode-other
---
# Quickstart: In-depth MRTK walkthrough

This guide provides an in-depth coverage of the [Azure Object Anchors MRTK Unity sample application](get-started-unity-hololens-mrtk.md). It's intended to provide insight into the design of the sample. By reading this guide, developers can accelerate their understanding of key Azure Object Anchors concepts in the sample.

## Project layout

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

## Unity scene

**Mixed Reality Play Space** –  Mostly boilerplate MRTK

- <a href="/windows/mixed-reality/develop/unity/mrtk-getting-started" target="_blank">Introducing MRTK for Unity</a>.
- There's a UI attached to the camera that details overall status of Azure Object Anchors (See `OverlayDebugText.cs`).

**Object Mixed Reality Play Space** – Mostly Azure Object Anchors related, but with some MRTK controls. Two scripts, `TrackableObjectSearch` and `ObjectTracker`, attached to the parent, represent the primary interface with Azure Object Anchors.

- **Menu**
  - Primarily MRTK code, but the UI interactions are directed at Azure Object Anchors functionality.
  - The attached `TrackableObjectMenu` script does the primary job of routing MRTK UI events to appropriate Azure Object Anchors calls.
  - <a href="/windows/mixed-reality/design/hand-menu" target="_blank">MRTK hand menu</a>.
- **WorkspaceBoundingBox**
  - Contains MRTK scripts associated with controlling a bounding box.
  - Also contains a `ModelVis` child object, which is used for visualizing the Azure Object Anchors model before a detection has occurred to help alignment during tricky detections.

## Menu walkthrough

Before diving into the scripts, let us first go through the menu items. This way we can reference how these menu items interact with the scripts.

:::image type="content" source="./media/mrtk-menus.png" alt-text="mrtk menus":::

The bottom and right submenus don't appear automatically, but are toggled with `Search Area Settings` and `Tracker Settings`, respectively.

### Main Menu

- **Start Search**
  - Starts searching for objects in the specified search area.
- **Toggle Spatial Mapping**
  - Cycles between showing spatial mapping while searching, always showing spatial mapping, and never showing spatial mapping.
- **Tracker Settings / Search Area Settings**
  - Toggles their respective submenus.
- **Start Tracing/Stop Tracing**
  - Begins or ends diagnostics tracing.
- **Upload Tracing**
  - Uploads diagnostics tracing to Microsoft for debug analysis.

### Tracker Settings

- **High Accuracy**
  - When enabled, the `ObjectInstanceTrackingMode` is set to `HighLatencyAccuratePosition`.
  - When disabled, `ObjectInstanceTrackingMode` is set to `LowLatencyCoarsePosition`.
- **Relaxed Vertical Alignment**
  - When enabled, sets `AllowedVerticalOrientationInDegrees` to 10 degrees. This feature allows for detection of objects that are on ramps.
  - When disabled, sets `AllowedVerticalOrientationInDegrees` to 0 degrees.
- **Allow Scale Change**
  - When enabled, sets `MaxScaleChange` to 0.1. This feature allows Azure Object Anchors to adjust the scale of the object based on HoloLens tracking scale adjustments.
  - When disabled, sets `MaxScaleChange` to 0.
- **Coverage Ratio Slider**
  - Adjusts the ratio of coverage required for object detection to consider a match. Lower values will increase the frequency of detection. This feature can be desirable for difficult objects to detect, but can also lead to increased false positive object detections.

### Search Area Settings

- **Lock Search Area**
  - When enabled, prevents the user from changing the search area.
- **Auto-Adjust Search Area**
  - When enabled, allows scripts to move the search area to refine the detection process.
- **Cycle Mesh**
  - Cycles through the meshes for `.ou` objects that can be detected, and no mesh.

## Scripts

- **AutonomousSearchArea.cs**
  - This script is attached to the `WorkspaceBoundingBox`. The script attempts to scale and place the `WorkspaceBoundingBox` automatically. It's enabled when the `Auto-Adjust Search Area` is enabled.
- **ObjectAnchorsSubscription.cs**
  - This script wraps the information required to upload diagnostics data.
- **ObjectTracker.cs**
  - This script bridges between Unity and the detection aspects of the Azure Object Anchors SDK.
- **ObjectTrackerDiagnostics.cs**
  - This script manages the diagnostics feature of the Azure Object Anchors SDK.
- **OverlayDebugText.cs**
  - This script is attached to the main camera. It's responsible for displaying the overall state of the sample and Azure Object Anchors to the user.
- **PositionDebugInfo.cs**
  - This script simply forces the debug text attached to a detected object to face the user.
- **SearchAreaController.cs**
  - This script manages the state of the `WorkspaceBoundingBox` used to indicate where Azure Object Anchors should be searching for objects.
- **SearchAreaModelVisualization.cs**
  - This script enables the `Cycle Mesh` functionality under `Search Area Settings`.
- **SpatialMappingController.cs**
  - This script manages when spatial mapping should be enabled based on the interaction with `Toggle Spatial Mapping` under the `Main Menu`.
- **TextToSpeech.cs**
  - This script takes text and turns it into speech.
- **TrackableObjectData.cs**
  - This script represents the data for objects that could be tracked.
- **TrackableObjectDataLoader.cs**
  - This script does the work of loading the `.ou` files and turning them into `TrackableObjectData` items.
- **TrackableObjectMenu.cs**
  - Most of the user interactions flow from the UI to this script then to the appropriate script. For instance, `TrackableObjectMenu` has `ToggleSpatialMapping`, which gets routed to `SpatialMappingController`.
- **TrackableObjectSearch.cs**
  - This script does some light management of the search area. In particular, the interaction where the user taps into space, and the search box is placed in front of the user. It also makes the inside of the search box not render while searching or while an object is being detected, to prevent the full rendering from occluding the object.
- **TrackedObject.cs**
  - Primary script on the `TrackableObjectPrefab`. It maintains the visualization state of an object detected by Azure Object Anchors.
- **TrackedObjectData.cs**
  - This script contains information about an object Azure Object Anchors is currently tracking.

## Prefabs

- **TrackableObjectPrefab**
  - Prefab that is created when an object is detected by AzureObjectAnchors. A child of this prefab, `LogicalCenter`, represents the center of the object, and is an appropriate place to start when trying to attach child content to detected objects. The information text displayed by the sample is attached to this logical center.

## Next steps

> [!div class="nextstepaction"]
> [Concepts: SDK overview](../concepts/sdk-overview.md)

> [!div class="nextstepaction"]
> [FAQ](../faq.md)

> [!div class="nextstepaction"]
> [Conversion SDK](/dotnet/api/overview/azure/mixedreality.objectanchors.conversion-readme)
