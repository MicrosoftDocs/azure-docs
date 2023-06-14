---
title: Best Practices
description: Recommended best practices to get improved results
author: ariye

ms.author: crtreasu
ms.date: 09/10/2021
ms.topic: best-practice
ms.service: azure-object-anchors
---

# Best practices

We recommend trying some of these steps to get the best results.

## Conversion

- Check the dimensions of your physical objects. Azure Object anchors works best for objects whose smallest dimension is in
  the range of the recommended 1m-10m.
- Inspect your 3D model in software like [**MeshLab**](https://www.meshlab.net/) for the following details.
  - Ensure that the 3D model has a triangle mesh and that the triangles on the exterior surface face outward. That is,
    the vertices should be oriented to make the normals follow the right-hand rule in their orientation outwards.
  - Ensure that the 3D Model is specified with the correct scale units with respect to the physical objects. The
    units should be one of: ***Centimeters, Decimeters, Feet, Inches, Kilometers, Meters, Millimeters, Yards***.
  - Confirm the nominal gravity direction that corresponds to the real world vertical orientation of the object. If the
    object's downward vertical/gravity is -Y, use ***(0, -1, 0)*** or ***(0, 0, -1)*** for -Z, and likewise for any
    other direction.
  - Make sure that the 3D model is encoded in one of the supported formats: `.glb`, `.ply`, `.fbx`, `.obj`.
- Our model conversion service could take a long time to process a large, high LOD (level-of-detail) model. For efficacy,
  you can preprocess your 3D model to remove the interior faces.

## Detection

> [!VIDEO https://learn.microsoft.com/Shows/Docs-Mixed-Reality/Azure-Object-Anchors-Detection-and-Alignment-Best-Practices/player]

- The provided runtime SDK requires a user-provided search region to search for and detect the physical object(s). The
  search region could be a bounding box, a sphere, a view frustum, or any combination of them. To avoid a false detection,
  set a search region large enough to cover the object. When using the provided sample apps, start the app standing
  about 2 meters away from the closest surface.
- Before starting the Azure Object Anchors app on a HoloLens 2 device, remove all Holograms using the **Settings** app.
  Go to **System** -> **Holograms** -> then select **Remove all holograms** to start with a fresh map.

  Clearing the holograms ensures objects can be properly detected in their current positions in case they were recently
  moved.
- After removing the holograms and before starting the app, scan the object by walking around it from 1-2 meters away
  a few times wearing the HoloLens.

  Pre-scanning an object and environment can help cleanup any residual surfaces created from earlier objects and scans.
  Otherwise, the app may see ghost surfaces leading to inaccurate alignment of your 3D model and the associated
  holograms. Pre-scanning the object can also greatly reduce the Azure Object Anchors detection latency, say, from 30
  seconds to 5 seconds.
- For dark and highly reflective objects, you may have to scan the object at a closer range from multiple angles and
  multiple distances.
- The provided runtime SDK provides a few parameters to allow users to fine-tune the detection, as demonstrated in our
  sample apps. The default parameters work well for most objects. If you find that you need to adjust them for specific
  objects, here are some recommendations:
  - Use a lower surface coverage threshold if the physical object is large, dark, or shiny.
  - Allow a small scale change (for example, 0.1) for large object like a car.
  - Allow some deviation in degrees between object's local vertical direction and gravity when object is on a slope.

## Next steps

In this guide, you learned some best practices to get the best results when using Azure Object Anchors to detect an
object. Here are some related articles:

> [!div class="nextstepaction"]
> [Troubleshooting object detection](./troubleshoot/object-detection.md)
