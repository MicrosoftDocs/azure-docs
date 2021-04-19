---
title: Frequently asked questions
description: FAQs about the Azure Object Anchors service.
author: craigktreasure
manager: vriveras

ms.author: crtreasu
ms.date: 04/01/2020
ms.topic: overview
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

**Q: What are the maximum object dimensions that can be processed for asset conversion?**

**A:** Each dimension of a CAD model should be less than 10 meters.

**Q: What is the maximum CAD asset size that can be processed for conversion?**

**A:** The model file size should be less than 150 MB.

**Q: What are the supported CAD formats?**

**A:** We currently support `fbx`, `ply`, `obj`, `glb`, and `gltf` file types.

**Q: What is the gravity direction and unit required by the asset conversion service? How can we figure them out?**

**A:** Gravity direction is the down vector pointing to the earth. For CAD models, gravity direction is typically the opposite of an up direction. 
For example, in many cases +Z represents up, in which case -Z or `Vector3(0.0, 0.0, -1.0)` would represent the gravity direction. When determining gravity, you should not only consider the model, but also the orientation in which the model will be seen during runtime. If you are trying to detect a chair in the real world on a flat surface, gravity might be `Vector3(0.0, 0.0, -1.0)`. However, if the chair is on a 45-degree slope, gravity might be `Vector3(0.0, -Sqrt(2)/2, -Sqrt(2)/2)`.

The gravity direction can be reasoned with a 3D rendering tool, like [MeshLab](http://www.meshlab.net/).

The unit represents the unit of measurement of the model. Supported units can be found using the **Microsoft.Azure.ObjectAnchors.Conversion.AssetLengthUnit** enumeration.

**Q: How long does it take to convert a CAD model?**

**A:** For a `ply` model, typically 3-15 minutes. If submitting models in other formats, expect to wait 15-60 minutes depending on file size.

**Q: How do I recover from an asset conversion failure?**

**A:** For common modes of asset conversion failure, the `Azure.MixedReality.ObjectAnchors.Conversion.AssetConversionProperties` object obtained from the `Value` field in the `Azure.MixedReality.ObjectAnchors.Conversion.AssetConversionOperation` contains an ErrorCode field of the `ConversionErrorCode` type. This type enumerates these common modes of failure for error message localization, failure recovery, and tips to the user on how the error can be corrected.

| Error Code                    | Description                       |  Mitigation                       |
| ---                      | ---                               | ---                               |
| INVALID_ASSET_URI | The asset at the URI provided when starting the conversion job could not be found. | When triggering an asset conversion job, provide an upload URI obtained from the service where the asset to be converted has been uploaded. |
| INVALID_JOB_ID | The provided ID for the asset conversion job to be created was set to the default all-zero GUID. | If a GUID is specified when creating an asset conversion job, ensure it is not the default all-zero GUID. |
| INVALID_GRAVITY | The gravity vector provided when creating the asset conversion job was a fully zeroed vector. | When starting an asset conversion, provide the gravity vector that corresponds to the uploaded asset. |
| INVALID_SCALE | The provided scale factor was not a positive non-zero value. | When starting an asset conversion, provide the scalar value which corresponds to the measurement unit scale (with regard to meters) of the uploaded asset. |
| ASSET_SIZE_TOO_LARGE | The intermediate .PLY file generated from the asset or its serialized equivalent was too large. | Refer to the asset size guidelines before submitting an asset for conversion to ensure conformity: aka.ms/aoa/faq |
| ASSET_DIMENSIONS_OUT_OF_BOUNDS | The dimensions of the asset exceeded the physical dimension limit. This can be a sign of an improperly set scale for the asset when creating a job. | Refer to the asset size guidelines before submitting an asset for conversion to ensure conformity, and ensure the provided scale corresponds to the uploaded asset: aka.ms/aoa/faq |
| ZERO_FACES | The intermediate .PLY file generated from the asset was determined to have no faces, making it invalid for conversion. | Ensure the asset is a valid mesh. |
| INVALID_FACE_VERTICES | The intermediate .PLY file generated from the asset contained faces that referenced nonexistent vertices. | Ensure the asset file is validly constructed. |
| ZERO_TRAJECTORIES_GENERATED | The camera trajectories generated from the uploaded asset were empty. | Refer to the asset guidelines before submitting an asset for conversion to ensure conformity: aka.ms/aoa/faq |
| TOO_MANY_RIG_POSES | The number of rig poses in the intermediate .PLY file exceeded service limits. | Refer to the asset size guidelines before submitting an asset for conversion to ensure conformity: aka.ms/aoa/faq |
| SERVICE_ERROR | An unknown service error occurred. | Contact a member of the Object Anchors service team if the issue persists: https://github.com/Azure/azure-object-anchors/issues |
| ASSET_CANNOT_BE_CONVERTED | The provided asset was corrupted, malformed, or otherwise unable to be converted in its provided format. | Ensure the asset is a validly constructed file of the specified type, and refer to the asset size guidelines before submitting an asset for conversion to ensure conformity: aka.ms/aoa/faq |

Any errors that occur outside the actual asset conversion jobs will be thrown as exceptions. Most notably, the `Azure.RequestFailedException` can be thrown for service calls that receive an unsuccessful (4xx or 5xx) or unexpected HTTP response code. For further details on these exceptions, examine the `Status`, `ErrorCode`, or `Message` fields on the exception.

**Q: What devices does Object Anchors support?**

**A:** HoloLens 2 

**Q: Which OS build should my HoloLens run?**

**A:** OS Build 18363.720 or newer, released after March 12, 2020.

  More details at [Windows 10 March 12, 2020 update](https://support.microsoft.com/help/4551762).

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

**Q: How accurate is an estimated pose?**

**A:** It depends on object size, material, environment, etc. For small objects, the estimated pose can be within 2 cm error. For large objects, like a car, the error can be up to 2-8 cm.

**Q: Can Object Anchors handle moving objects?**

**A:** We don't support **continuously moving** or **dynamic** objects.

**Q: Can Object Anchors handle deformation or articulations?**

**A:** Partially, depending on how much object shape or geometry changes due to deformation or articulation. If the object's geometry changes a lot, the user can create another model for that configuration and use it for detection.

**Q: How many different objects can Object Anchors detect at the same time?**

**A:** We currently support detecting a single object model at a time. 

**Q: Can Object Anchors detect multiple instances of the same object model?**

**A:** Yes, you can detect up to 3 objects of the same model type. The application can call `ObjectObserver.DetectAsync` multiple times with different queries to detect multiple instances of the same model.

**Q: What should I do if the Object Anchors runtime cannot detect my object?**

**A:**

* Ensure the room has enough textures by adding a few posters.
* Scan the object more completely.
* Adjust the model parameters as described above.
* Provide a tight bounding box as search area that includes all or most of the object.
* Clear spatial mapping cache and rescan the object.
* Capture diagnostics and send the data to us.

**Q: How to choose object query parameters?**

**A:**

* Provide tight search areas to ideally cover the full object to improve detection speed and accuracy.
* Default `ObjectQuery.MinSurfaceCoverage` from object model usually is good, otherwise use a smaller value to get a quicker detection.
* Use a small value for `ObjectQuery.ExpectedMaxVerticalOrientationInDegrees` if object is expected to be up-right.
* An app should always use a `1:1` object model for detection. The estimated scale should be close to 1 ideally within 1% error. An app could set `ObjectQuery.MaxScaleChange` to `0` or `0.1` to disable or enable scale estimation, and qualitatively evaluate the instance pose.

**Q: How do I get Object Anchors diagnostics data from the HoloLens?**

**A:** The application can specify the location of diagnostics archives. The Object Anchors sample app writes diagnostics to the **TempState** folder.

**Q: Why does the source model not align with the physical object when using the pose returned by the Object Anchors Unity SDK?**

**A:** Unity may change the coordinate system when importing an object model. For example, the Object Anchors Unity SDK inverts the Z axis when converting from a right-handed to left-handed coordinate system, but Unity may apply an additional rotation about either the X or Y axis. A developer can determine this additional rotation by visualizing and comparing the coordinate systems.

**Q: Do you support 2D?**

**A:** Since we are geometry based, we only support 3D.

**Q: Can you differentiate between the same model in different colors?**

**A:** Since our algorithms are geometry based, different colors of the same model won't behave differently during detection.

**Q: Can I use Object Anchors without internet connectivity?**

**A:** 
* For asset conversion and training, connectivity is required as this occurs in the cloud.
* Runtime sessions are fully on-device and do not require connectivity as all computations occur on the HoloLens 2.

## Privacy FAQ
**Q: How does Azure Object Anchors store data?**

**A:** We only store System Metadata, which is encrypted at rest with a Microsoft managed data encryption key.