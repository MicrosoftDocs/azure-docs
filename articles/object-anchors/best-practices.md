---
title: Best Practices
description: Recommended best practices to get improved results
author: ariye

ms.author: crtreasu
ms.date: 03/12/2021
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
  - Make sure that the 3D Model is specified with the correct scale units with respect to the physical objects. The
    units should be one of: ***Centimeters, Decimeters, Feet, Inches, Kilometers, Meters, Millimeters, Yards***.
  - Confirm the nominal gravity direction that corresponds to the real world vertical orientation of the object. If the
    object's downward vertical/gravity is -Y, use ***(0, -1, 0)*** or ***(0, 0, -1)*** for -Z, and likewise for any
    other direction.
  - Make sure that the 3D model is encoded in one of the supported formats: `.glb`, `.gltf`, `.ply`, `.fbx`, `.obj`.
- Our model conversion service could take a long time to process a large, high LOD (level-of-detail) model. For efficacy
  you can preprocess your 3D model to remove the interior faces.

## Detection

> [!VIDEO https://channel9.msdn.com/Shows/Docs-Mixed-Reality/Azure-Object-Anchors-Detection-and-Alignment-Best-Practices/player]

- The provided runtime SDK requires a user-provided search region to search for and detect the physical object(s). The
  search region could be a bounding box, a sphere, a view frustum, or any combination of them. To avoid a false detection,
  it is preferable to set a search region large enough to cover the object. When using the provided sample apps, you can
  stand on one side of the object about 2 meters away from the closest surface and start the app.
- Before starting the Azure Object Anchors app on a HoloLens 2 device, remove the holograms in the vicinity of your workplace
  via on your devices main settings through ***Settings->System->Holograms***

  This step ensures that if a new object such as a car is present in the same space as occupied by another previously,
  or the object has moved from the target space, any old, and irrelevant holograms will not persist and create confusing
  visualization for the object currently in view.
- After removing the holograms and before starting the app, scan the object such as a car by looking at the object while
  wearing the device from about 1-2 meters and slowly going all around the object one or two times.

  This step ensures that any residual surface estimates created in your space by earlier objects and scans are refreshed
  with the surfaces of the current target object that you are going to work with. Otherwise the app may see double ghost
  surfaces leading to inaccurate alignment of your 3D model and the associated holograms. Pre-scanning the object will
  also greatly reduce the Azure Object Anchors detection latency, say, from 30 seconds to 5 seconds.
- For dark and highly reflective objects, you may have to scan the object at closer range and also by moving your head up
  and down and left and right to let the device see surfaces from multiple angles and multiple distances.
- When you see a wrong object detection such as the orientation being flipped or the pose being incorrect such as a
  tilted model, you should visualize the spatial mapping. Often the incorrect results are due to poor or incomplete
  surface reconstruction. You can remove the holograms, scan the object, and run object detection on the app again.
- The provided runtime SDK provides a few parameters to allow users to fine-tune the detection, as demonstrated in our
  sample apps. The default parameters work well for most objects. If you find that you need to adjust them for specific
  objects, here are some recommendations:
  - Use a lower surface coverage threshold if the physical object is large, dark, or shiny.
  - Allow a small scale change (for example, 0.1) for large object like a car.
  - Allow some deviation in degrees between object's local vertical direction and gravity when object is on a slope.
