---
title: Frequently asked questions
description: FAQs about the Azure Object Anchors service.
author: craigktreasure
manager: vriveras

ms.author: crtreasu
ms.date: 04/01/2020
ms.topic: overview
ms.service: azure-object-understanding
#Customer intent: Address frequently asked questions regarding Azure Object Anchors.
---

# Frequently asked questions about Azure Object Anchors

Azure Object Anchors enables an application to detect an object in the physical world using a 3D model and estimate its 6-DoF pose.

For more information, see [Azure Object Anchors overview](overview.md).

**Q: What are the typical objects that Object Anchors can handle?**

**A:** Objects should have the following qualities:

* 1-6 meters for each dimension;
* Non-symmetric, with sufficient variations in geometry;
* Low reflectivity (matte surfaces) with bright color;
* Stationary or occasional movement, no or small amounts of articulation;
* Clear backgrounds with no or minimal clutter;
* Object layout close to the layout of its model;

**Q: What are the maximum object dimension and CAD size that can be processed for model ingestion?**

**A:** Each dimension of a CAD model should be less than 10 meters. CAD model file size should be less than 150 MB.

**Q: What are the supported CAD formats?**

**A:** We currently support `fbx`, `ply`, `obj`, `glb`, and `gltf` file types.

**Q: What is the gravity direction and unit required by the model ingestion service? How to figure them out?**

**A:** Gravity direction is the down vector pointing to the earth. For CAD models, gravity direction is typically the opposite of an up direction. For example, in many cases +Z represents up, in which case -Z or `Vector3(0.0, 0.0, -1.0)` would represent the gravity direction. When determining gravity, you should not only consider the model, but also the orientation in which the model will be seen during runtime. If you are trying to detect a chair in the real world on a flat surface, gravity might be `Vector3(0.0, 0.0, -1.0)`. However, if the chair is on a 45-degree slope, gravity might be `Vector3(0.0, -Sqrt(2)/2, -Sqrt(2)/2)`.

The gravity direction can be reasoned with a 3D rendering tool, like [MeshLab](http://www.meshlab.net/).

The unit represents the unit of measurement of the model. Supported units can be found using the **Microsoft.Azure.ObjectUnderstanding.Ingestion.Unit** enumeration.

**Q: How long will it take to ingest a CAD model?**

**A:** For a `ply` model, typically 3-15 minutes. If submitting models in other formats, expect to wait 15-60 minutes depending on file size.

**Q: Which OS build should my HoloLens run?**

**A:** OS Build 18363.720 or newer, released after March 12, 2020.

  More details at [Windows 10 March 12, 2020 update](https://support.microsoft.com/help/4551762).

**Q: How long does it take to detect an object on HoloLens?**

**A:** It depends on the object size and the scanning process. For smaller objects within 2 meters for each dimension, detection can be done within a few seconds. For larger objects like a car, the user should walk a full loop around the object to get a reliable detection, which means detection could take tens of seconds.

**Q: How accurate is an estimated pose?**

**A:** It depends on object size, material, environment, etc. For small objects, the estimated pose can be within 1-cm error. For large objects, like a car, the error can be up to 2-8 cm.

**Q: What is the best practice of using Object Anchors in a HoloLens application?**

**A:**

 1. Perform eye calibration to get accurate rendering;
 2. Ensure the room has rich visual texture and good lighting;
 3. Keep object stationary, away from clutter if possible;
 4. Optionally, clear the [Spatial Mapping](https://docs.microsoft.com/windows/mixed-reality/spatial-mapping) cache on your HoloLens device;
 5. Scan the object by walking around it. Ensure most of the object is observed;
 6. Set a search area sufficiently large to cover the object;
 7. The object should remain stationary during detection;
 8. Start object detection and visualize the rendering based on estimated pose;
 9. Lock detected object or stop tracking once the pose is stable and accurate to preserve battery life.

**Q: Can Object Anchors handle moving objects?**

**A:** No. We don't handle **continuously moving** objects, but can handle **occasionally moving** ones. When an object is **occasionally moving**, it changes location once in a while, but is mostly stationary (for several minutes or longer).

**Q: Can Object Anchors handle deformation or articulations?**

**A:** Partially, depending on how much object shape or geometry changes due to deformation or articulation. If the object's geometry changes a lot, the user can create another model for that configuration and use it for detection.

**Q: How many different objects can Object Anchors detect at the same time?**

**A:** A maximum of 3 objects is recommended. Applications can load multiple object models and track them simultaneously. However, the latency (time until detection) could be high due to limited memory and computation resources on HoloLens.

**Q: Can Object Anchors detect multiple instances of the same object model?**

**A:** Yes, the application can call `ObjectObserver.DetectAsync` multiple times with different queries to detect multiple instances of the same model.

**Q: What to do if the Object Anchors runtime couldn't detect my object?**

**A:**

* Ensure the room has enough textures by adding a few posters;
* Scan the object more completely;
* Adjust the model parameters as described above;
* Provide a tight bounding box as search area that includes all or most of the object;
* Clear spatial mapping cache and rescan the object;
* Capture diagnostics and send the data to us;

**Q: How to choose object query parameters?**

**A:**

* Provide tight search areas to ideally cover the full object to improve detection speed and accuracy;
* Default `ObjectQuery.MinSurfaceCoverage` from object model usually is good, otherwise use a smaller value to get a quicker detection;
* Use a small value for `ObjectQuery.ExpectedMaxVerticalOrientationInDegrees` if object is expected to be up-right.

**Q: How do I get Object Anchors diagnostics data from the HoloLens?**

**A:** The application can specify the location of diagnostics archives. The OU sample app writes diagnostics to the **TempState** folder.

**Q: Why does the source model not align with the physical object when using the pose returned by the Object Anchors Unity SDK?**

**A:** Unity may change the coordinate system when importing an object model. For example, the Object Anchors Unity SDK inverts the Z axis when converting from a right-handed to left-handed coordinate system, but Unity may apply an additional rotation about either the X or Y axis. A developer can determine this additional rotation by visualizing and comparing the coordinate systems.
