---
title: Frequently asked questions
description: Answers to frequently asked questions about the Azure Object Anchors service, which enables an application to detect an object in the world using a 3D model.
author: craigktreasure
manager: vriveras
ms.custom: kr2b-contr-experiment
ms.author: crtreasu
ms.date: 05/20/2022
ms.topic: troubleshooting
ms.service: azure-object-anchors
#Customer intent: Address frequently asked questions regarding Azure Object Anchors.
---

# Frequently asked questions about Azure Object Anchors

Azure Object Anchors enables an application to detect an object in the physical world using a 3D model and estimate its 6-DoF pose.

For more information, see [Azure Object Anchors overview](overview.md).

## Product FAQ

**Q: What recommendations do you have for the objects that should be used?**

**A:** We recommend the following properties for objects:

* 1-10 meters for each dimension
* Non-symmetric, with sufficient variations in geometry
* Low reflectivity (matte surfaces) with bright color
* Stationary objects
* No or small amounts of articulation
* Clear backgrounds with no or minimal clutter
* Scanned object should have 1:1 match with the model you trained with

**Q: What are the maximum object dimensions that can be processed for model conversion?**

**A:** Each dimension of a CAD model should be less than 10 meters. For more information, see [Asset Requirements](overview.md).

**Q: What is the maximum CAD model size that can be processed for conversion?**

**A:** The model file size should be less than 150 MB. For more information, see [Asset Requirements](overview.md).

**Q: What are the supported CAD formats?**

**A:** We currently support `fbx`, `ply`, `obj`, and `glb` file types. For more information, see [Asset Requirements](overview.md).

**Q: What is the gravity direction and unit required by the model conversion service?**

**A:** The gravity direction is the down vector pointing to the earth and the unit of measurement represents the scale of the model. When converting a model, it's important to [ensure the gravity direction and asset dimension unit are correct](./troubleshoot/object-detection.md#ensure-the-gravity-direction-and-asset-dimension-unit-are-correct).

**Q: How long does it take to convert a CAD model?**

**A:** For a `ply` model, typically 3-15 minutes. If submitting models in other formats, expect to wait 15-60 minutes depending on file size.

**Q: How do I recover from a model conversion failure?**

**A:** For details on the different error codes that can result from a failed model conversion job and how to handle each, refer to the [conversion error codes page](.\model-conversion-error-codes.md).

**Q: What devices does Object Anchors support?**

**A:** HoloLens 2.

**Q: Which version of Windows Holographic should my HoloLens 2 have installed?**

**A:** We recommend the most recent release from Windows Update. See the Windows Holographic [release notes](/hololens/hololens-release-notes) and [update instructions](/hololens/hololens-update-hololens).

**Q: How long does it take to detect an object on HoloLens?**

**A:** It depends on the object size and the scanning process. To get quicker detection, try following the best practices for a thorough scan.
For smaller objects within 2 meters in each dimension, detection can occur within a few seconds. For larger objects, like a car, the user should walk a full loop around the object to get a reliable detection, which means detection could take tens of seconds.

**Q: What are the best practices while using Object Anchors in a HoloLens application?**

**A:**

 1. Perform eye calibration to get accurate rendering.
 2. Ensure the room has rich visual texture and good lighting.
 3. Keep object stationary, away from clutter if possible.
 4. Optionally, clear the [Spatial Mapping](/windows/mixed-reality/spatial-mapping) cache on your HoloLens device.
 5. Scan the object by walking around it. Ensure most of the object is observed.
 6. Set a search area sufficiently large to cover the object.
 7. The object should remain stationary during detection.
 8. Start object detection and visualize the rendering based on estimated pose.
 9. Lock detected object or stop tracking once the pose is stable and accurate to preserve battery life.

**Q: Which version of the Mixed Reality Toolkit (MRTK) should my HoloLens Unity application use to be able to work with the Object Anchors Unity SDK?**

**A:** The Azure Object Anchors Unity SDK doesn't depend on the Mixed Reality Toolkit in any way, which means you're free to use any version you like. For more information, see [Introducing MRTK for Unity](/windows/mixed-reality/develop/unity/mrtk-getting-started).

**Q: How accurate is an estimated pose?**

**A:** It depends on object size, material, environment, and other factors. For small objects, the estimated pose can be within 2-cm error. For large objects, like a car, the error can be up to 2 cm to 8 cm.

**Q: Can Object Anchors handle moving objects?**

**A:** We don't support *continuously moving* or *dynamic* objects. We do support objects in an entirely new position in the space once they've been physically moved there, but can't track it while it's being moved.

**Q: Can Object Anchors handle deformation or articulations?**

**A:** Partially, depending on how much object shape or geometry changes due to deformation or articulation. If the object's geometry changes a lot, the user can create another model for that configuration and use it for detection.

**Q: How many different models can Object Anchors detect at the same time?**

**A:** We currently support detecting three models at a time to ensure the best user experience, but we don't enforce a limit.

**Q: Can Object Anchors detect multiple instances of the same object model?**

**A:** Yes, we support detecting up to three instances of the same model type to ensure the best user experience, but we don't enforce a limit. You can detect one object instance per search area. By calling `ObjectQuery.SearchAreas.Add`, you can add more search areas to a query to detect more instances. You can call `ObjectObserver.DetectAsync` with multiple queries to detect multiple models.

**Q: What should I do if the Object Anchors runtime cannot detect my object?**

**A:** There are many factors that may prevent an object from being detected properly: environment, model conversion
       configuration, query settings, and so on. Learn more about how to [troubleshoot object detection](./troubleshoot/object-detection.md).

**Q: How to choose object query parameters?**

**A:** Here's some [general guidance](./troubleshoot/object-detection.md#adjust-object-query-values) and a more detailed guide for [difficult to detect objects](./detect-difficult-object.md).

**Q: How do I get Object Anchors diagnostics data from the HoloLens?**

**A:** The application can specify the location of diagnostics archives. The Object Anchors sample app writes diagnostics to the **TempState** folder.

**Q: Why does the source model not align with the physical object when using the pose returned by the Object Anchors Unity SDK?**

**A:** Unity may change the coordinate system when importing an object model. For example, the Object Anchors Unity SDK inverts the Z axis when it converts from a right-handed to left-handed coordinate system. Unity may apply another rotation about either the X or Y axis. A developer can determine this other rotation by visualizing and comparing the coordinate systems.

**Q: Do you support 2D?**

**A:** Since we're geometry based, we only support 3D.

**Q: Can you differentiate between the same model in different colors?**

**A:** Since our algorithms are geometry based, different colors of the same model won't behave differently during detection.

**Q: Can I use Object Anchors without internet connectivity?**

**A:**

* For model conversion and training, connectivity is required because these actions occur in the cloud.
* Runtime sessions are fully on-device and don't require connectivity because all computations occur on the HoloLens 2.

## Privacy FAQ

**Q: How does Azure Object Anchors store data?**

**A:** We only store System Metadata, which is encrypted at rest with a Microsoft managed data encryption key.

## Next steps

In this article, you learned some answers to common question to get the best results when using Azure Object Anchors.
Here are some related articles:

> [!div class="nextstepaction"]
> [Best practices](./best-practices.md)

> [!div class="nextstepaction"]
> [Troubleshooting object detection](./troubleshoot/object-detection.md)
