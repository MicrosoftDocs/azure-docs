---
title: Azure Object Anchors overview
description: Learn how Azure Object Anchors helps you detect objects in the physical world.
author: craigktreasure
manager: vriveras

ms.author: crtreasu
ms.date: 04/01/2020
ms.topic: overview
ms.service: azure-object-anchors
# ms.reviewer: MSFT-alias-of-reviewer
---
# Azure Object Anchors overview

Welcome to Azure Object Anchors. Azure Object Anchors enables an application to detect an object in the physical world using a 3D model and estimate its 6DoF pose. The 6DoF (6 degrees of freedom) pose is defined as a rotation and translation between a 3D model and its physical counterpart, the real object. Azure Object Anchors consists of a model ingestion service and a runtime SDK. The service inputs a user provided 3D object model and outputs an Azure Object Anchors binary model. The Azure Object Anchors model is used along with the runtime SDK to enable a HoloLens application to load an object model, detect, and track instance(s) of that model in the physical world.

Azure Object Anchors is composed of a managed service and a client SDK for HoloLens.

## Examples

Some example use cases enabled by Azure Object Anchors include:

- **Training**. Create mixed reality training experiences for your workers, without the need to place markers or spend time manually adjusting hologram alignment. If you want to augment your mixed reality training experiences with automated detection and tracking, ingest your model into the Object Anchors service and you'll be one step closer to a markerless experience.

- **Task Guidance**. Walking employees through a set of tasks can be greatly simplified when using Mixed Reality. Overlaying digital instructions and best practices, on top of the physical object – be it a piece of machinery on a factory floor, or a coffee maker in the team kitchen – can greatly reduce difficulty of completing the set of tasks. Triggering these experiences typically requires some form of marker or manual alignment, but with Object Anchors, you can create an experience that automatically detects the object related to the task at hand. Then, seamlessly flow through Mixed Reality guidance without markers or manual alignment.

- **Asset Finding**. If you already have a 3D model of some object in your physical space, Object Anchors can enable you to locate and track instances of that object in your physical environment.

The following sections provide information about getting started with using and building apps with Azure Object Anchors.

- **Best Practices**. We recommend trying some of these steps to get the best results in the shortest time.
-  Check the dimensions of your physical objects. Azure object Anchors works best for objects whose smallest dimension is in the range of the recommended 1m-10m.
-  Inspect your 3D model in software like [***Meshlab***](https://www.meshlab.net/) for the following details.
     - Ensure that the 3D model has a triangle mesh and that the triangles on the exterior surface face outward. That is, the vertices should be oriented to make the 
        normals follow the right hand rule in their orientation outwards.
     -  Make sure that the 3D Model is specified with the correct scale units with respect to the physical objects. The units should be one of: 
        ***Centimeters, Decimeters, Feet, Inches, Kilometers, Meters, Millimeters, Yards***
     - Confirm the nominal gravity direction that corresponds to the real world vertical orientation of the object. If the object's downward vertical/gravity is 
        -Y, use ***(0, -1, 0)*** or ***(0, 0, -1)*** for -Z, and likewise for any other direction.
     - Make sure that the 3D model is encoded in one of the formats - ***.glb, .gltf, .ply, .fbx, .obj***.
-  Our ingestion service could take long to process a large, high LOD (level-of-detail) model. For efficacy you can preprocess your 3D model to remove the interior faces.
-  The provided runtime SDK requires a user-provided search region to search for and detect the physical object(s). The search region could be a bounding box, a sphere, 
    a view frustum, or any combination of them. To avoid a false detection, it is preferable to set a search region large enough to cover the object. When using the provided sample apps, you can stand on one side of the object about 2 meters away from the closest surface and start the app.
-  Before starting the Object Anchors app on a HoloLens 2 device, remove the holograms in the vicinity of your workplace via ***Settings->System->Holograms*** on your devices main settings.
    This step ensures that if a new object such as a car is present in the same space as occupied by another previously, or the object has moved from the target space, any old, and irrelevant holograms will not persist and create confusing visualization for the object currently in view.
-  After removing the holograms and before starting an AOA App, scan the object such as a car by looking at the object while wearing the device from about 1-2 
    meters and slowly going all around the object one or two times.
     This step ensures that any residual surface estimates created in your space by earlier objects and scans are refreshed with the surfaces of the current target object that you are going to work with. Otherwise the AOA app may see double ghost surfaces leading to inaccurate alignment of your 3D model and the associated holograms.
     Pre-scanning the object will also greatly reduce the AOA detection latency, say, from 30 seconds to 5 seconds.
-  For dark and highly reflective objects you may have to scan the object at closer range and also by moving your head up and down and left and right to let the 
    device see surfaces from multiple angles and multiple distances.
-  When you see a wrong object detection such as the orientation being flipped or the pose being incorrect such as a tilted model, you should visualize the spatial mapping. Often the incorrect 
    results are due to poor or incomplete surface reconstruction. You can remove the holograms, scan the object, and run object detection on the app again.
-  The provided runtime SDK provides a few parameters to allow users to fine-tune the detection, as demonstrated in our sample apps. The default parameters work well 
    for most objects. You may need to adjust them for some special objects. Below are the tips:

    - Use a lower surface coverage threshold if the physical object is large, dark, or shiny.
    - Allow a small scale change (for example, 0.1) for large object like a car.
    - Allow some deviation in degrees between object's local vertical direction and gravity when object is on a slope.

## Next steps

Get started with Object Anchors.

> [!div class="nextstepaction"]
> [Model Ingestion](quickstarts/get-started-model-ingestion.md)

> [!div class="nextstepaction"]
> [Unity HoloLens](quickstarts/get-started-unity-hololens.md)

> [!div class="nextstepaction"]
> [Unity HoloLens with MRTK](quickstarts/get-started-unity-hololens-mrtk.md)

> [!div class="nextstepaction"]
> [HoloLens DirectX](quickstarts/get-started-hololens-directx.md)
