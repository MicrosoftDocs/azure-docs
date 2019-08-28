---
title: Navigate Azure Digital Twins APIs | Microsoft Docs
description: Learn how to common patterns of querying the Azure Digital Twins management APIs.
author: kingdomofends
manager: philmea
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 07/09/2019
ms.author: v-adgera
---

# How to use Azure Digital Twins management APIs

The Azure Digital Twins management APIs provide powerful functionalities for your IoT apps. This article shows you how to navigate through the API structure.  

## API summary

The following list shows the components of the Digital Twins APIs.

* [/spaces](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Spaces): These APIs interact with the physical locations in your setup. These help you create, delete, and manage the digital mappings of your physical locations in the form of a [spatial graph](concepts-objectmodel-spatialgraph.md#spatial-intelligence-graph).

* [/devices](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Devices): These APIs interact with the devices in your setup. These devices can manage one or more sensors. For example, a device could be your phone, or a Raspberry Pi sensor pod, or a Lora gateway, and so on.

* [/sensors](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Sensors): These APIs help you communicate with the sensors associated with your devices and your physical locations. The sensors record and send ambient values which can then be used to manipulate your spatial environment.  

* [/resources](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Resources): These APIs help you set up resources, such as an IoT hub, for your Digital Twins instance.

* [/types](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Types): These APIs allow you to associate extended types with your Digital Twins objects, to add specific characteristics to those objects. These types allow for easy filtering and grouping of objects in the UI and the custom functions that process your telemetry data. Examples of extended types are *DeviceType*, *SensorType*, *SensorDataType*, *SpaceType*, *SpaceSubType*, *SpaceBlobType*, *SpaceResourceType*, and so on.

* [/ontologies](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/Ontologies): These APIs help you to manage ontologies, which are collections of extended types. Ontologies provide names for object types as per the physical space they represent. For example, the *BACnet* ontology provides specific names for *sensor types*, *datatypes*, *datasubtypes*, and *dataunittypes*. Ontologies are managed and created by the service. Users can load and unload ontologies. When an ontology is loaded, all of its associated type names are enabled and ready to be provisioned in your spatial graph. 

* [/propertyKeys](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/PropertyKeys): You can use these APIs to create custom properties for your *spaces*, *devices*, *users*, and *sensors*. These properties are created as key/value pairs. You can define the data type for these properties by setting their *PrimitiveDataType*. For example, you can define a property named *BasicTemperatureDeltaProcessingRefreshTime* of type *uint* for your sensors, and then assign a value for this property for each of your sensors. You can also add constraints for these values while creating the property, such as *Min* and *Max* ranges, as well as allowed values as *ValidationData*.

* [/matchers](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/Matchers): These APIs allow you to specify the conditions that you want to evaluate from your incoming device data. See [this article](concepts-user-defined-functions.md#matchers) for more information. 

* [/userDefinedFunctions](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/UserDefinedFunctions): These APIs allow you to create, delete or update a custom function that will execute when conditions defined by the *matchers* occur, to process data coming from your setup. See [this article](concepts-user-defined-functions.md#user-defined-functions) for more information about these custom functions, also called the *user-defined functions*. 

* [/endpoints](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/Endpoints): These APIs allow you to create endpoints so your Digital Twins solution can communicate with other Azure services for data storage and analytics. Read [this article](concepts-events-routing.md) for more information. 

* [/keyStores](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#/KeyStores): These APIs allow you to manage security key stores for your spaces. These stores can hold a collection of security keys, and allow you to easily retrieve the latest valid keys.

* [/users](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Users): These APIs allow you to associate users with your spaces, to locate these individuals when required. 

* [/system](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/System): These APIs allow you to manage system-wide settings, such as the default types of spaces and sensors. 

* [/roleAssignments](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/RoleAssignments): These APIs allow you to associate roles to entities such as user ID, user-defined function ID, etc. Each role assignment includes the ID of the entity to associate, the entity type, the ID of the role to associate, the tenant ID, and a path that defines the upper limit of the resource that the entity can access with that association. Read [this article](security-role-based-access-control.md) for more information.


## API navigation

The Digital Twins APIs support filtering and navigation throughout your spatial graph using the following parameters:

- **spaceId**: 
The API will filter the results by the given space ID. Additionally, the boolean flag **useParentSpace** is applicable to the [/spaces](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Spaces) APIs, which indicates that the given space ID refers to the parent space instead of the current space. 

- **minLevel** and **maxLevel**: 
Root spaces are considered to be at level 1. Spaces with parent space at level *n* are at level *n+1*. With these values set, you can filter the results at specific levels. These are inclusive values when set. Devices, sensors, and other objects are considered to be at the same level as their closest space. To get all objects at a given level, set both **minLevel** and **maxLevel** to the same value.

- **minRelative** and **maxRelative**: 
When these filters are given, the corresponding level is relative to the level of the given space ID:
   - Relative level *0* is as the same level as the given space ID.
   - Relative level *1* represents spaces at the same level as the children of the given space ID. Relative level *n* represents spaces lower than the specified space by *n* levels.
   - Relative level *-1* represents spaces at the same level as the parent space of the specified space.

- **traverse**: 
Allows you to traverse in either direction from a given space ID, as specified by the following values.
   - **None**: This default value filters to the given space ID.
   - **Down**: This filters by the given space ID and its descendants. 
   - **Up**: This filters by the given space ID and its ancestors. 
   - **Span**: This filters a horizontal portion of the spatial graph, at the same level as the given space ID. This needs either the **minRelative** or the **maxRelative** to be set true. 


### Examples

The following list shows some examples of navigation through the [/devices](https://docs.westcentralus.azuresmartspaces.net/management/swagger/ui/index#!/Devices) APIs. Note that the placeholder `YOUR_MANAGEMENT_API_URL` refers to the URI of the Digital Twins APIs in the format `https://YOUR_INSTANCE_NAME.YOUR_LOCATION.azuresmartspaces.net/management/api/v1.0/`, where `YOUR_INSTANCE_NAME` is the name of your Azure Digital Twins instance, and `YOUR_LOCATION` is the region where your instance is hosted.

- `YOUR_MANAGEMENT_API_URL/devices?maxLevel=1` returns all devices attached to root spaces.
- `YOUR_MANAGEMENT_API_URL/devices?minLevel=2&maxLevel=4` returns all devices attached to spaces of levels 2, 3 or 4.
- `YOUR_MANAGEMENT_API_URL/devices?spaceId=mySpaceId` returns all devices directly attached to mySpaceId.
- `YOUR_MANAGEMENT_API_URL/devices?spaceId=mySpaceId&traverse=Down` returns all devices attached to mySpaceId or one of its descendants.
- `YOUR_MANAGEMENT_API_URL/devices?spaceId=mySpaceId&traverse=Down&minLevel=1&minRelative=true` returns all devices attached to descendants of mySpaceId, excluding mySpaceId.
- `YOUR_MANAGEMENT_API_URL/devices?spaceId=mySpaceId&traverse=Down&minLevel=1&minRelative=true&maxLevel=1&maxRelative=true` returns all devices attached to immediate children of mySpaceId.
- `YOUR_MANAGEMENT_API_URL/devices?spaceId=mySpaceId&traverse=Up&maxLevel=-1&maxRelative=true` returns all devices attached to one of the ancestors of mySpaceId.
- `YOUR_MANAGEMENT_API_URL/devices?spaceId=mySpaceId&traverse=Down&maxLevel=5` returns all devices attached to descendants of mySpaceId that are at level smaller than or equal to 5.
- `YOUR_MANAGEMENT_API_URL/devices?spaceId=mySpaceId&traverse=Span&minLevel=0&minRelative=true&maxLevel=0&maxRelative=true` returns all devices attached to spaces that are at the same level as mySpaceId.


## OData support
Most of the APIs that return collections, such as a GET call on /spaces, support the following subset of the generic [OData](https://www.odata.org/getting-started/basic-tutorial/#queryData) system query options:  

* **$filter**
* **$orderby** 
* **$top**
* **$skip** - If you intend to display the entire collection, you should request it as a whole set in a single call, and then perform paging in your application. 

Note that other query options, such as $count, $expand, $search, are not supported.

### Examples

The following list shows some examples of queries using OData’s system query options:

- `YOUR_MANAGEMENT_API_URL/devices?$top=3&$orderby=Name desc`
- `YOUR_MANAGEMENT_API_URL/keystores?$filter=endswith(Description,’space’)`
- `YOUR_MANAGEMENT_API_URL/propertykeys?$filter=Scope ne ‘Spaces’`
- `YOUR_MANAGEMENT_API_URL/resources?$filter=Size gt ‘M’`
- `YOUR_MANAGEMENT_API_URL/users?$top=4&$filter=endswith(LastName,’k’)&$orderby=LastName`
- `YOUR_MANAGEMENT_API_URL/spaces?$orderby=Name desc&$top=3&$filter=substringof('Floor’,Name)`
 

## Next steps

To learn some common API query patterns, read [How to query Azure Digital Twins APIs for common tasks](how-to-query-common-apis.md).

To learn more about your API endpoints, read [How to use Digital Twins Swagger](./how-to-use-swagger.md).
