---
title: Anchor locate strategy
description: Learn about the different strategies when calling the locate API
author: pamistel
manager: MehranAzimi-msft
services: azure-spatial-anchors

ms.author: pamistel
ms.date: 02/11/2021
ms.topic: conceptual
ms.service: azure-spatial-anchors
---

# Understanding the AnchorLocateCriteria class
In this article you will learn the different options you can use when querying an anchor. We will go over the AnchorLocateCriteria class, its options and valid option combinations.

## Anchor locate criteria
The [AnchorLocateCriteria class](/dotnet/api/microsoft.azure.spatialanchors.anchorlocatecriteria) helps you query the service for previously created anchors. One AnchorLocateCriteria object may be used per watcher at any time. Each AnchorLocateCriteria object must include **exactly one** of the following properties: [Identifiers](#identifiers), [NearAnchor](#nearanchor), or [NearDevice](#neardevice). Additional properties such as [Strategy](#strategy), [BypassCache](#bypasscache), and [RequestedCategories](#requestedcategories) can be set if desired. 

### Properties
Define **exactly one** of the following properties in your watcher:
#### Identifiers
*Default Value: empty string array*

Using Identifiers, you can define a list of anchor IDs for anchors you would like to locate. Anchor IDs are initially returned to you after successful anchor creation. With Identifiers specified, AnchorLocateCriteria restricts the set of requested anchors to anchors with matching anchor IDs. 
This property is specified using a string array. 

#### NearAnchor
*Default Value: not set*

Using NearAnchor, you can specify that AnchorLocateCriteria restricts the set of requested anchors to  anchors within a desired distance away from a chosen anchor. You must provide this chosen anchor as the source anchor. You may also set the desired distance away from the source anchor, and the maximum number of anchors returned, to further limit the search.
This property is specified using a NearAnchorCriteria object.

#### NearDevice
*Default Value: not set*

Using NearDevice, you can specify that AnchorLocateCriteria restricts the set of requested anchors to those close to the device’s physical location. Any enabled sensors will be used to help discover anchors around your device. To have the best chance of finding anchors, you should configure SensorCapabilities to give the session access to all appropriate sensors. For more information on setting up and using this property, see [Coarse Relocalization - Azure Spatial Anchors | Microsoft Docs](./coarse-reloc.md) and *How to create and locate anchors using coarse relocalization* in [C#](../how-tos/set-up-coarse-reloc-unity.md), [Objective-C](../how-tos/set-up-coarse-reloc-unity.md), [Swift](../how-tos/set-up-coarse-reloc-swift.md), [Java](../how-tos/set-up-coarse-reloc-java.md), [C++/NDK](../how-tos/set-up-coarse-reloc-cpp-ndk.md), [C++/WinRT](../how-tos/set-up-coarse-reloc-cpp-winrt.md).
This property is specified using a NearDeviceCriteria object.

### Additional properties
#### BypassCache
*Default Value: false*

When an anchor has been created or found in a session, it is also stored in the cache.  With this property set to false, any subsequent query in the same session will return the cached value. No request to the ASA service is made.

#### RequestedCategories
*Default Value: Properties | Spatial*

This property is used to determine what data is returned from a query using AnchorLocateCriteria. The default value returns both properties and spatial data, this should not be changed if properties and spatial data are both desired. This property can be specified using the AnchorDataCategory enum.

AnchorDataCategory Enum Value | Returned Data
-----|------------
None | No data is returned
Properties| Anchor properties including AppProperties are returned.
Spatial| Spatial information about an anchor is returned.

#### Strategy
*Default Value: AnyStrategy*

Strategy further defines how anchors should be located. The Strategy property may be specified using a LocateStrategy enum.

LocateStrategy Enum Value | Description
---------------|------------
AnyStrategy | This strategy permits the system to use combinations of VisualInformation and Relationship strategies to find anchors. 
VisualInformation|This strategy attempts to find anchors by matching visual information from the current surroundings to those of the anchor’s visual footprint. An anchor’s visual footprint refers to the visual information currently associated with the anchor. This visual information is typically but not exclusively gathered during anchor creation. Currently, this strategy is only permitted in conjunction with the NearDevice or Identifiers properties.
Relationship|This strategy attempts to find anchors by making use of existing [connected anchors](./anchor-relationships-way-finding.md#connect-anchors). Currently, this strategy is only permitted in conjunction with the NearAnchor or Identifiers properties. When used with the Identifiers property, it is required that, in the same session, the user should have previously located an anchor(s) with already established connective relationships to the anchors whose IDs are specified in the Identifiers array. 


### Valid combinations of LocateStrategy and AnchorLocateCriteria properties 

Not all combinations of Strategy and AnchorLocateCriteria properties are currently permitted by the system. 
The following table shows the allowed combinations:



Property | AnyStrategy | Relationship | VisualInformation
-------- | ------------|--------------|-------------------
Identifiers	| &check;    | &check;     | &check;
NearAnchor	| &check;   (will default to Relationship) | &check;    | 
NearDevice	| &check;    |   | &check;




## Next steps

See [How to create and locate anchors using Azure Spatial Anchors](../create-locate-anchors-overview.md) for some more examples using the AnchorLocateCriteria class.