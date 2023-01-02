---
title: How to detect a difficult object
description: Describe mechanisms that can be configured to detect difficult objects.
author: rgarcia
manager: vrivera

ms.author: rgarcia
ms.date: 09/08/2021
ms.topic: troubleshooting
ms.service: azure-object-anchors
#Customer intent: Describe mechanisms that can be configured to detect difficult objects.
---

# How to detect a difficult object

Sometimes, an object may turn out to be more difficult to detect. For example:

- When a large surface area isn't accessible because the object is against a wall
- When an object is too large and it takes too long to walk around it
- When the object's surface isn't detected by the device sensors

## Adjusting object query values

Some mechanisms offered by the Azure Object Anchors SDK that can help in these situations are:

- The `ObjectQuery.MinSurfaceCoverage` property. It represents the minimum required surface coverage ratio to consider an object instance to be a true positive. It allows a range from 0 to 1.0 (representing 0% to 100%). The default setting varies between objects (the larger the surface area, the smaller the minimum required coverage will be). It will work for most situations as-is. But, when faced with difficult objects, the recommendation is to lower the value for this property, so that less surface coverage is required to detect the object.

- The `ObjectQuery.MaxScaleChange` property. If the original model doesn't have a `1:1` scale towards the object being detected, this setting can be adjusted. It allows a range from 0 to 1.0 (representing 0% to 100%). The default setting, at 0, disables scale estimation, which requires a `1:1` scale mapping. Setting this property to 10%, for example, would enable scale estimation and allow some flexibility in cases where the model scale doesn't have a `1:1` matching against the object.

- The `ObjectQuery.ExpectedMaxVerticalOrientationInDegrees` property. It represents the maximum angle, in degrees, between the up direction of the object and gravity. It ranges from 0 to 180. In other words, it represents the inclination of the object relative to the original model. The default setting, at 3 degrees, can be increased to allow more flexibility in cases where the object inclination doesn't match the original model.

- The `ObjectQuery.IsExpectedToBeStandingOnGroundPlane` property. It's a boolean that represents whether the object is expected to be standing at ground level or not. It defaults to false. It can be switched to true to speed up detection for cases where the object is at ground level.

- The `ObjectQuery.SearchAreas` property. It represents a collection of regions to look for objects. Providing tight search areas, while still covering all or most of the object, improves detection speed and accuracy. You can either pick:

  - An oriented bounding box, by using `ObjectSearchArea.FromOriented`.
  - A field of view, by using `ObjectSearchArea.FromFieldOfView`.
  - A location, by using `ObjectSearchArea.FromLocation`.
  - A sphere, by using `ObjectSearchArea.FromSphere`.

For more information, see the `ObjectQuery` class for [Unity](/dotnet/api/microsoft.azure.objectanchors.objectquery) or [HoloLens C++/WinRT](/cpp/api/object-anchors/winrt/objectquery).

## Next steps

In this troubleshooting guide, you learned how to troubleshoot detection of difficult to detect objects.
Here are some related articles:

> [!div class="nextstepaction"]
> [Troubleshooting object detection](./troubleshoot/object-detection.md)
