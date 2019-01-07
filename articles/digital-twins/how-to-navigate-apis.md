---
title: Navigate Azure Digital Twins APIs | Microsoft Docs
description: Learn how to common patterns of querying the Azure Digital Twins management APIs.
author: dsk-2015
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 12/21/2018
ms.author: dkshir
---

# How to use Azure Digital Twins management APIs

The Azure Digital Twins management APIs provide powerful functionalities for your IoT apps. This article shows you how to navigate through the API structure.  

## API summary

The following list shows the components of the Digital Twins APIs.

* [/spaces](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Spaces): These APIs interact with the physical locations in your setup.

* [/resources](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Resources): These APIs help you set up resources, such as an IoT hub, for your Digital Twins instance.

* [/devices](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Devices): These APIs interact with the devices in your setup.

* [/sensors](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Sensors): These APIs help you communicate with the sensors associated with your devices and your physical locations. The sensors record and send ambient values which can then be used to manipulate your spatial environment as per your scenario.  

* [/types](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Types): These APIs allow you to associate extended types with your Digital Twins objects, which add specific characteristics. These types can be used to filter or group the objects in the UI or in the user defined functions. For example, *DeviceType*, *SensorType*, *SensorDataType*, *SpaceType*, *SpaceSubType*, *SpaceBlobType*, *SpaceResourceType*. 

* [/ontologies](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/Ontologies): These APIs help you to manage ontologies, which are collections of extended types. Ontologies provide names for object types as per the physical space they represent. For example, the *BACnet* ontology provides specific names for *sensor types*, *datatypes*, *datasubtypes*, and *dataunittypes*. Ontologies are managed and created by the service. Users can load and unload ontologies. When an ontology is loaded, all of its associated type names are enabled and ready to be provisioned in your spatial graph. 

* [/propertyKeys](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/PropertyKeys): You can use these APIs to create custom properties for your *spaces*, *devices*, *users*, and *sensors*, as key/value pairs of specific data types called the *PrimitiveDataType*. For example, you can define a property named *BasicTemperatureDeltaProcessingRefreshTime* of type *uint* for your sensors, and then assign a value for this property for each of your sensors. You can also add constraints for these values while creating the property, such as *Min* and *Max* ranges, as well as allowed values as *ValidationData*.

* [/matchers](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/Matchers): These APIs allow you to specify the conditions that you want to evaluate from your incoming device data. See [this article](concepts-user-defined-functions#matchers) for more information. 

* [/userDefinedFunctions](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/UserDefinedFunctions): These APIs allow you to create, delete or update a custom function that will execute when conditions defined by the *matchers* occur. See [this article](concepts-user-defined-functions#user-defined-functions) for more information about these custom functions, also called the *user defined functions*. 

* [/endpoints](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/Endpoints): These APIs allow you to create endpoints so your Digital Twins solution can communicate with other Azure services for data storage and analytics. Read [this article](concepts-events-routing) for more information. 

* [/keyStores](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/KeyStores): These APIs allow you to manage security key stores for your spaces. These stores can hold a collection of security keys, and allow you to easily retrieve the latest valid keys.

* [/users](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Users): These APIs allow you to associate users with your spaces, to locate these individuals when required. 

* [/system](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/System): These APIs allow you to manage system wide settings, such as the default types of spaces and sensors. 

* [/roleAssignments](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/RoleAssignments): These APIs allow you associate roles to entities such as user ID, user defined function ID, etc. Each role assignment includes the ID of the entity to associate, the entity type, the ID of the role to associate, the tenant id, and a path that defines the upper limit of the resource that the entity can access with that association. Read [this article](security-role-based-access-control) for more information.


## API navigation

The Digital Twins APIs support filtering and navigation throughout your spatial graph using the following parameters:

* **spaceId**: The API will filter the results by the given space ID.
    * **useParentSpace**: This boolean flag is applicable to the [/spaces](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Spaces) APIs only, and indicates that the given space ID refers to the parent space instead of the current space. 
* **minLevel** and **maxLevel**: Root spaces are considered to be at level 1. Spaces with parent space at level *n* are at level *n+1*. With these values set, you can filter the results at specific levels. These are inclusive values when set. Devices, sensors, and other objects are considered to be at the same level as their closest space. To get all objects at a givel level, set both **minLevel** and **maxLevel** to the same value.
* **minRelative** and **maxRelative**: When these filters are given, the corresponding level is relative to the level of the given space ID:
    * Relative level 0 is as the same level as the given space ID.
    * Relative level 1 represents spaces at the same level as the children of the given space ID. Relative level n represents spaces lower than the specified space by n levels.
    * Relative level -1 represents spaces at the same level as the parent space of the specified space.
* **traverse**: Allows to traverse in either direction from a given space ID, as given by the following values.
    * **None**: This default value filters to the given space ID.
    * **Down**: This filters by the given space ID and its descendants. 
    * **Up**: This filters by the given space ID and its ancestors. 
    * **Span**: This filters a horizontal portion of the spatial graph, at the same level as the given space ID. This needs either the **minRelative** or the **maxRelative** to be set true. 

The following list shows an example of navigation for the [/devices](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Devices) APIs:

- devices?maxLevel=1: returns all devices attached to root spaces.
- devices?minLevel=2&maxLevel=4: returns all devices attached to spaces of levels 2, 3 or 4.
- devices?spaceId=mySpaceId: returns all devices directly attached to mySpaceId.
- devices?spaceId=mySpaceId&traverse=Down: returns all devices attached to mySpaceId or one of its descendants.
- devices?spaceId=mySpaceId&traverse=Down&minLevel=1&minRelative=true: returns all devices attached to descendants of mySpaceId, excluding mySpaceId.
- devices?spaceId=mySpaceId&traverse=Down&minLevel=1&minRelative=true&maxLevel=1&maxRelative=true: returns all devices attached to direct children of mySpaceId.
- devices?spaceId=mySpaceId&traverse=Up&maxLevel=-1&maxRelative=true: returns all devices attached to one of the ancestors of mySpaceId.
- devices?spaceId=mySpaceId&traverse=Down&maxLevel=5: returns all devices attached to descendants of mySpaceId that are at level smaller than or equal to 5.
- devices?spaceId=mySpaceId&traverse=Span&minLevel=0&minRelative=true&maxLevel=0&maxRelative=true: returns all devices attached to spaces that are at the same level as mySpaceId.


## OData support
Most of the APIs that return collections, such as a GET call on /spaces, support the following subset of the generic [OData](https://www.odata.org/getting-started/basic-tutorial/#queryData) system query options:  

1. $filter
1. $orderby 
1. $top
1. $skip - If you intend to display the entire collection should request it whole (in a single call) and perform paging in your client-side application. 

Note that other query options, such as $count, $expand, $search, are not supported.

The following list shows some examples of queries using OData’s system query options:

- /api/v1.0/devices?$top=3&$orderby=Name desc
- /api/v1.0/keystores?$filter=endswith(Description,’space’)
- /api/v1.0/propertykeys?$filter=Scope ne ‘Spaces’
- /api/v1.0/resources?$filter=Size gt ‘M’
- /api/v1.0/users?$top=4&$filter=endswith(LastName,’k’)&$orderby=LastName
- /api/v1.0/spaces?$orderby=Name desc&$top=3&$filter=substringof('Floor’,Name) 
 

## Next steps

To learn some common API query patterns, read [How to query Azure Digital Twins APIs for common tasks](how-to-query-common-apis.md).


