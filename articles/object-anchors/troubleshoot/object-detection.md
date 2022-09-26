---
title: Troubleshooting object detection
description: Troubleshooting issues with detecting an object using Azure Object Anchors.
author: craigktreasure
manager: rgarcia

ms.author: crtreasu
ms.date: 09/10/2021
ms.topic: troubleshooting
ms.service: azure-object-anchors
#Customer intent: As a developer, I want to fix issues related to detecting an object using Azure Object Anchors.
---

# Troubleshooting object detection

This article assumes you already converted a 3D model into an Azure Object Anchors detection model and successfully
loaded the model into an application.

## Troubleshooting steps

* Ensure that the model you're detecting is within the supported (1-10 meters) size for the best experience.
* Ensure the room has enough textures by adding a few posters.
* Remove current holograms to reset the map as described [below](#remove-holograms-to-reset-the-map).
* Scan the object more completely.
* Provide a tight bounding box as search area that includes all or most of the object.
* Clear the spatial mapping cache and rescan the object.
* Ensure the correct gravity direction and asset dimension were used during model conversion as described [below](#ensure-the-gravity-direction-and-asset-dimension-unit-are-correct).
* Visually inspect the detection model as described [below](#visually-inspect-the-detection-models-mesh).
* Adjust the model query values as described [below](#adjust-object-query-values).
* Capture diagnostics as described [below](#capture-diagnostics).

### Remove holograms to reset the map

If you're seeing objects being detected with any of the follow issue, removing and resetting the map can fix the issue:
* Inverted orientation
* Incorrect pose
* Tilted model

To remove holograms and reset the map, open the **Settings** app and go to **System** -> **Holograms**. Then, select
**Remove all holograms** to start with a fresh map.

Clearing the holograms ensures objects can be properly detected in their current positions in case they were recently
moved.

Rescan your environment by walking around in the environment wearing the HoloLens. Walk around any objects you intend
to detect a few times from 1-2 meters.

### Ensure the gravity direction and asset dimension unit are correct

When you submit a 3D model for conversion using the Object Anchors Conversion SDK (see [here](../quickstarts/get-started-model-conversion.md)),
you'll need to enter correct gravity direction (`Gravity`) and unit of measurement (`AssetDimensionUnit`) for your 3D
model. If those values aren't correct, Object Anchors is unlikely to detect your object correctly.

The gravity direction is the down vector pointing to the earth. For CAD models, gravity direction is typically the
opposite of an up direction. For example, in many cases +Z represents up, in which case -Z or `Vector3(0.0, 0.0, -1.0)`
would represent the gravity direction. When determining gravity, you should also consider the orientation in which the
model will be seen during runtime. If you're trying to detect a chair in the real world on a flat surface, gravity
might be `Vector3(0.0, 0.0, -1.0)`. However, if the chair is on a 45-degree slope, gravity might be
`Vector3(0.0, -Sqrt(2)/2, -Sqrt(2)/2)`.

The gravity direction can be determined with a 3D rendering tool, like [MeshLab](http://www.meshlab.net/).

The unit of measurement represents the scale of the model. Supported units can be found using the
**Microsoft.Azure.ObjectAnchors.Conversion.AssetLengthUnit** enumeration.

You can also follow the instructions [here](../visualize-converted-model.md) to visualize a detection model in Unity to
visually inspect that gravity direction and scale look correct.

### Visually inspect the detection model's mesh

Sometimes it can be helpful to visually inspect the detection model's mesh so that you can see any orientation, scale,
or feature issues. Follow the instructions [here](../visualize-converted-model.md) to visualize a converted model in
Unity.

### Adjust object query values

* Provide tight search areas to ideally cover the full object to improve detection speed and accuracy.
* The default `ObjectQuery.MinSurfaceCoverage` value is often sufficient, but you can use a smaller value to get a
  quicker detection.
* Use a small value for `ObjectQuery.ExpectedMaxVerticalOrientationInDegrees` if the object is expected to be up-right.
* An app should always use a `1:1` object model for detection. The estimated scale should be close to 1 ideally within
  1% error. An app could set `ObjectQuery.MaxScaleChange` to `0` or `0.1` to disable or enable scale estimation, and
  qualitatively evaluate the instance pose.
* For more information, see [How to detect a difficult object](../detect-difficult-object.md).

### Capture diagnostics

The application can capture and save diagnostics archives using the
[ObjectDiagnosticsSession](../concepts/sdk-overview.md#objectdiagnosticssession) object.

The [Unity sample app with MRTK](../quickstarts/get-started-unity-hololens-mrtk.md) writes diagnostics to the
**TempState** folder. You can start a diagnostics session by opening the
<a href="/windows/mixed-reality/mrtk-unity/features/ux-building-blocks/hand-menu" target="_blank">hand menu</a>,
selecting **Start Tracing**, reproducing a detection attempt, and then select **Stop Tracing** to save the diagnostics
archive. You can then use [Windows Device Portal](/windows/mixed-reality/develop/platform-capabilities-and-apis/using-the-windows-device-portal)
to retrieve the diagnostics archive from the app's **TempState** folder.

The diagnostics archive can then be shared with us so that we can help debug the issue.

## Next steps

In this troubleshooting guide, you learned how to troubleshoot detection of a physical object using Azure Object Anchors.
Here are some related articles:

> [!div class="nextstepaction"]
> [How to detect a difficult object](../detect-difficult-object.md)

> [!div class="nextstepaction"]
> [How to visualize an Object Anchors model](../visualize-converted-model.md)
