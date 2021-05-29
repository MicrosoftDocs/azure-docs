---
title: How to detect a difficult object
description: Describe mechanisms that can be configured to detect difficult objects.
author: rgarcia
manager: vrivera

ms.author: rgarcia
ms.date: 05/28/2021
ms.topic: overview
ms.service: azure-object-anchors
#Customer intent: Describe mechanisms that can be configured to detect difficult objects.
---

# How to detect a difficult object

Sometimes, an object may turn out to be more difficult to detect. For example:

- When a large surface area isn't accessible because the object is against a wall
- When an object is too large and it takes too long to walk around it
- When the object has darker spots

One mechanism offered by the Azure Object Anchors SDK that can help in these situations is the `MinSurfaceCoverage` property in the `ObjectQuery` class. It represents the minimum required surface coverage ratio to consider an object instance to be a true positive. It allows a range from 0% to 100%. The default setting, at 40%, works for most situations. But, when faced with difficult objects, the recommendation is to lower the value for this property, so that less surface coverage is required to detect the object.

For more information, see the `ObjectQuery.MinSurfaceCoverage` property for [Unity](/dotnet/api/microsoft.azure.objectanchors.objectquery.minsurfacecoverage#Microsoft_Azure_ObjectAnchors_ObjectQuery_MinSurfaceCoverage) or [HoloLens C++/WinRT](/cpp/api/object-anchors/winrt/objectquery)
