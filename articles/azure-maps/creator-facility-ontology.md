---
title: Facility Ontology in Microsoft Azure Maps Creator
description: Facility Ontology that describes the feature class definitions for Azure Maps Creator
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/14/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps

zone_pivot_groups: facility-ontology-schema
---

# Facility Ontology

Facility ontology defines how Azure Maps Creator internally stores facility data in a Creator dataset.  In addition to defining internal facility data structure, facility ontology is also exposed externally through the WFS API. When WFS API is used to query facility data in a dataset, the response format is defined by the ontology supplied to that dataset.

At a high level, facility ontology divides the dataset into feature classes. All feature classes share a common set of properties, such as `ID` and `Geometry`.  In addition to the common property set, each feature class defines a set of properties. Each property is defined by its data type and constraints. Some feature classes have properties that are dependent on other feature classes. Dependant properties evaluate to the `ID` of another feature class.  

## Changes and Revisions

:::zone pivot="facility-ontology-v1"

The Facility 1.0 contains revisions for the Facility feature class definitions for [Azure Maps Services](https://aka.ms/AzureMaps).

:::zone-end

:::zone pivot="facility-ontology-v2"

The Facility 2.0 contains revisions for the Facility feature class definitions for [Azure Maps Services](https://aka.ms/AzureMaps).

:::zone-end

### Major Changes

:::zone pivot="facility-ontology-v1"

Fixed the following constraint validation checks:

* Constraint validation check for exclusivity of `isObstruction = true` *or* the presence of `obstructionArea` for `lineElement` and `areaElement` feature classes.

* Constraint validation check for exclusivity of `isRoutable = true` *or* the presence of `routeThroughBehavior` for the `category` feature class.
:::zone-end

:::zone pivot="facility-ontology-v2"

* Added a structure feature class to hold walls, columns, and so on.
* Cleaned up the attributes designed to enrich routing scenarios. The current routing engine doesn't support them.

:::zone-end

## unit

The `unit` feature class defines a physical and non-overlapping area that can be occupied and traversed by a navigating agent. A `unit` can be a hallway, a room, a courtyard, and so on.

**Geometry Type**: Polygon

:::zone pivot="facility-ontology-v1"

| Property           | Type                        | Required | Description                                                  |
|--------------------|-----------------------------|----------|--------------------------------------------------------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        | [category.Id](#category)     |true      | The ID of a [`category`](#category) feature.|
|`isOpenArea`        | boolean (Default value is `null`.)                    |false     | Represents whether the unit is an open area. If set to `true`, [structures](#structure) don't surround the unit boundary, and a navigating agent can enter the `unit` without the need of an [`opening`](#opening). By default, units are surrounded by physical barriers and are open only where an opening feature is placed on the boundary of the unit. If walls are needed in an open area unit, they can be represented as a [`lineElement`](#lineelement) or [`areaElement`](#areaelement) with an `isObstruction` property equal to `true`.|
|`navigableBy`        | enum ["pedestrian", "wheelchair", "machine", "bicycle", "automobile", "hiredAuto", "bus", "railcar", "emergency", "ferry", "boat"]  | false      |Indicates the types of navigating agents that can traverse the unit. If unspecified, the unit is assumed to be traversable by any navigating agent. |
|`isRoutable`        | boolean (Default value is `null`.)                      | false    |  Determines if the unit is part of the routing graph. If set to `true`, the unit can be used as source/destination or intermediate node in the routing experience. |
|`routeThroughBehavior`        | enum ["disallowed", "allowed", "preferred"] |  false     | Determines if navigating through the unit is allowed. If unspecified, it inherits its value from the category feature referred to in the `categoryId` property. If specified, it overrides the value given in its category feature." |
|`nonPublic`        |  boolean| false       | If `true`, the unit is navigable only by privileged users.  Default value is `false`. |
| `levelId`          | [level.Id](#level)        | true     | The ID of a level feature. |
|`occupants`         |  array of [directoryInfo.Id](#directoryinfo) |    false |    The IDs of [directoryInfo](#directoryinfo) features. Used to represent one or many occupants in the feature. |
|`addressId`         | [directoryInfo.Id](#directoryinfo) | true     | The ID of a [directoryInfo](#directoryinfo) feature. Used to represent the address of the feature.|
|`addressRoomNumber`         |  [directoryInfo.Id](#directoryinfo) | true     | Room/Unit/Apartment/Suite number of the unit.|
|`name` |    string |    false |    Name of the feature in local language. Maximum length allowed is 1000. |
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1000.|
|`nameAlt` |    string |    false |   Alternate name used for the feature. Maximum length allowed is 1000. |
|`anchorPoint` |   [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson) that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property           | Type                        | Required | Description                                                  |
|--------------------|-----------------------------|----------|--------------------------------------------------------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        | [category.Id](#category)     |true      | The ID of a [`category`](#category) feature.|
|`isOpenArea`        | boolean (Default value is `null`.)                    |false     | Represents whether the unit is an open area. If set to `true`, [structures](#structure) don't surround the unit boundary, and a navigating agent can enter the `unit` without the need of an [`opening`](#opening). By default, units are surrounded by physical barriers and are open only where an opening feature is placed on the boundary of the unit. If walls are needed in an open area unit, they can be represented as a [`lineElement`](#lineelement) or [`areaElement`](#areaelement) with an `isObstruction` property equal to `true`.|
|`isRoutable`        | boolean (Default value is `null`.)                     | false    |  Determines if the unit is part of the routing graph. If set to `true`, the unit can be used as source/destination or intermediate node in the routing experience. |
| `levelId`          | [level.Id](#level)        | true     | The ID of a level feature. |
|`occupants`         |  array of [directoryInfo.Id](#directoryinfo) |    false |    The IDs of [directoryInfo](#directoryinfo) features. Used to represent one or many occupants in the feature. |
|`addressId`         | [directoryInfo.Id](#directoryinfo) | true     | The ID of a [directoryInfo](#directoryinfo) feature. Used to represent the address of the feature.|
|`addressRoomNumber`         |  [directoryInfo.Id](#directoryinfo) | true     | Room/Unit/Apartment/Suite number of the unit.|
|`name` |    string |    false |    Name of the feature in local language.  Maximum length allowed is 1000.|
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1000.|
|`nameAlt` |    string |    false |   Alternate name used for the feature.  Maximum length allowed is 1000.|
|`anchorPoint` |   [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson) that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

## structure

The `structure` feature class defines a physical and non-overlapping area that cannot be navigated through. Can be a wall, column, and so on.

**Geometry Type**: Polygon

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        | [category.Id](#category)      |true      | The ID of a [`category`](#category) feature.|
| `levelId`          |  [level.Id](#level)            | true     | The ID of a [`level`](#level) feature. |
|`name` |    string |    false |    Name of the feature in local language. Maximum length allowed is 1000. |
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1000. |
|`nameAlt` |    string |    false |   Alternate name used for the feature.  Maximum length allowed is 1000.|
|`anchorPoint` |   [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson) that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

## zone

The `zone` feature class defines a virtual area, like a WiFi zone or emergency assembly area. Zones can be used as destinations but are not meant for through traffic.

**Geometry Type**: Polygon

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        | [category.Id](#category)      |true      | The ID of a [`category`](#category) feature.|
| `setId`          | string         | true     |Required for zone features that represent multi-level zones. The `setId` is the unique ID for a zone that spans multiple levels. The `setId` enables a zone with varying coverage on different floors to be  represented with different geometry on different levels. The `setId` can be any string and is case-sensitive. It is recommended that the `setId` is a GUID.  Maximum length allowed is 1000.|
| `levelId`          |  [level.Id](#level)             | true     | The ID of a  [`level`](#level) feature. |
|`name` |    string |    false |    Name of the feature in local language.  Maximum length allowed is 1000.|
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1000.|
|`nameAlt` |    string |    false |   Alternate name used for the feature. Maximum length allowed is 1000. |
|`anchorPoint` |  [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson) that represents the feature as a point. Can be used to position the label of the feature.|

## level

The `level` class feature defines an area of a building at a set elevation. For example, the floor of a building, which contains a set of features, such as [`units`](#unit).  

**Geometry Type**: MultiPolygon

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        | [category.Id](#category)    |true      | The ID of a [`category`](#category) feature.|
| `ordinal`          | integer        | true     | The level number. Used by the [`verticalPenetration`](#verticalpenetration) feature to determine the relative order of the floors to help with travel direction. The general practice is to start with 0 for the ground floor. Add +1 for every floor upwards, and -1 for every floor going down. It can be modeled with any numbers, as long as the higher physical floors are represented by higher ordinal values. |
| `abbreviatedName`          | string        | false     | A four-character abbreviated level name, like what would be found on an elevator button.  Maximum length allowed is 1000.|
| `heightAboveFacilityAnchor`          | double         | false     | Vertical distance of the level's floor above [`facility.anchorHeightAboveSeaLevel`](#facility), in meters. |
| `verticalExtent`          | double         | false     | Vertical extent of the level, in meters. If not provided, defaults to [`facility.defaultLevelVerticalExtent`](#facility).|
|`name` |    string |    false |    Name of the feature in local language.  Maximum length allowed is 1000.|
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1000.|
|`nameAlt` |    string |    false |   Alternate name used for the feature.  Maximum length allowed is 1000.|
|`anchorPoint` |   [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson)  that represents the feature as a point. Can be used to position the label of the feature.|

## facility

The `facility` feature class defines the area of the site, building footprint, and so on.

**Geometry Type**: MultiPolygon

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        | [category.Id](#category)      |true      | The ID of a [`category`](#category) feature.|
|`occupants`         | array of [directoryInfo.Id](#directoryinfo) |    false |    The IDs of [directoryInfo](#directoryinfo) features. Used to represent one or many occupants in the feature. |
|`addressId`         | [directoryInfo.Id](#directoryinfo)  | true     | The ID of a [directoryInfo](#directoryinfo) feature. Used to represent the address of the feature.|
|`name` |    string |    false |    Name of the feature in local language. Maximum length allowed is 1000. |
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1000. |
|`nameAlt` |    string |    false |   Alternate name used for the feature.  Maximum length allowed is 1000.|
|`anchorPoint` |  [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson) that represents the feature as a point. Can be used to position the label of the feature.|
|`anchorHeightAboveSeaLevel` |  double | false | Height of anchor point above sea level, in meters. Sea level is defined by EGM 2008.|
|`defaultLevelVerticalExtent` |  double| false | Default value for vertical extent of levels, in meters.|

## verticalPenetration

The `verticalPenetration` class feature defines an area that, when used in a set, represents a method of navigating vertically between levels. It can be used to model stairs, elevators, and so on. Geometry can overlap units and other vertical penetration features.

**Geometry Type**: Polygon

:::zone pivot="facility-ontology-v1"

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        | [category.Id](#category)      |true      | The ID of a [`category`](#category) feature.|
| `setId`          | string       | true     | Vertical penetration features must be used in sets to connect multiple levels. Vertical penetration features in the same set are considered to be the same. The `setId` can be any string, and is case-sensitive. Using a GUID as a `setId` is recommended.  Maximum length allowed is 1000.|
| `levelId`          | [level.Id](#level)         | true     | The ID of a level feature. |
|`direction`         |  string enum [ "both", "lowToHigh", "highToLow", "closed" ]| false     | Travel direction allowed on this feature. The ordinal attribute on the [`level`](#level) feature is used to determine the low and high order.|
|`navigableBy`        | enum ["pedestrian", "wheelchair", "machine", "bicycle", "automobile", "hiredAuto", "bus", "railcar", "emergency", "ferry", "boat"]  | false      |Indicates the types of navigating agents that can traverse the unit. If unspecified, the unit is traversable by any navigating agent. |
|`nonPublic`        |  boolean| false       | If `true`, the unit is navigable only by privileged users.  Default value is `false`. |
|`name` |    string |    false |    Name of the feature in local language.  Maximum length allowed is 1000.|
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1000.|
|`nameAlt` |    string |    false |   Alternate name used for the feature. Maximum length allowed is 1000. |
|`anchorPoint` |  [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson)  that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        | [category.Id](#category)      |true      | The ID of a [`category`](#category) feature.|
| `setId`          | string       | true     | Vertical penetration features must be used in sets to connect multiple levels. Vertical penetration features in the same set are connected. The `setId` can be any string, and is case-sensitive. Using a GUID as a `setId` is recommended. Maximum length allowed is 1000. |
| `levelId`          | [level.Id](#level)         | true     | The ID of a level feature. |
|`direction`         |  string enum [ "both", "lowToHigh", "highToLow", "closed" ]| false     | Travel direction allowed on this feature. The ordinal attribute on the [`level`](#level) feature is used to determine the low and high order.|
|`name` |    string |    false |    Name of the feature in local language.  Maximum length allowed is 1000.|
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1000.|
|`nameAlt` |    string |    false |   Alternate name used for the feature. Maximum length allowed is 1000. |
|`anchorPoint` |  [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson)  that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

## opening

The `opening` class feature defines a traversable boundary between two units, or a `unit` and `verticalPenetration`.

**Geometry Type**: LineString

:::zone pivot="facility-ontology-v1"

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        |[category.Id](#category)     |true      | The ID of a category feature.|
| `levelId`          | [level.Id](#level)        | true     | The ID of a level feature. |
| `isConnectedToVerticalPenetration` | boolean | false | Whether or not this feature is connected to a `verticalPenetration` feature on one of its sides. Default value is `false`. |
|`navigableBy`        | enum ["pedestrian", "wheelchair", "machine", "bicycle", "automobile", "hiredAuto", "bus", "railcar", "emergency", "ferry", "boat"]  | false      |Indicates the types of navigating agents that can traverse the unit. If unspecified, the unit is traversable by any navigating agent. |
| `accessRightToLeft`| enum [ "prohibited", "digitalKey", "physicalKey", "keyPad", "guard", "ticket", "fingerprint", "retina", "voice", "face", "palm", "iris", "signature", "handGeometry", "time", "ticketChecker", "other"] | false | Method of access when passing through the opening from right to left. Left and right are determined by the vertices in the feature geometry, standing at the first vertex and facing the second vertex. Omitting this property means there are no access restrictions.|
| `accessLeftToRight`| enum [ "prohibited", "digitalKey", "physicalKey", "keyPad", "guard", "ticket", "fingerprint", "retina", "voice", "face", "palm", "iris", "signature", "handGeometry", "time", "ticketChecker", "other"] | false | Method of access when passing through the opening from left to right. Left and right are determined by the vertices in the feature geometry, standing at the first vertex and facing the second vertex. Omitting this property means there are no access restrictions.|
| `isEmergency` | boolean | false | If `true`, the opening is navigable only during emergencies. Default value is `false` |
|`anchorPoint` | [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson) y that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        |[category.Id](#category)     |true      | The ID of a category feature.|
| `levelId`          | [level.Id](#level)        | true     | The ID of a level feature. |
|`anchorPoint` | [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson) y that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

## directoryInfo

The `directoryInfo` object class feature defines the name, address, phone number, website, and hours of operation for a unit, facility, or an occupant of a unit or facility.

**Geometry Type**: None

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`streetAddress`        |string    |false    |Street address part of the address.  Maximum length allowed is 1000. |
|`unit`        |string    |false    |Unit number part of the address.  Maximum length allowed is 1000. |
|`locality`|    string|    false    |The locality of the address. For example: city, municipality, village. Maximum length allowed is 1000.|
|`adminDivisions`|    string|    false    |Administrative division part of the address, from smallest to largest (County, State, Country). For example: ["King", "Washington", "USA" ] or ["West Godavari", "Andhra Pradesh", "IND" ]. Maximum length allowed is 1000.|
|`postalCode`|    string |    false    |Postal code part of the address. Maximum length allowed is 1000.|
|`name` |    string |    false |    Name of the feature in local language.  Maximum length allowed is 1000.|
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1000. |
|`nameAlt` |    string |    false |   Alternate name used for the feature. Maximum length allowed is 1000. |
|`phoneNumber` |    string |    false |    Phone number. Maximum length allowed is 1000. |
|`website` |    string |    false |  Website URL. Maximum length allowed is 1000. |
|`hoursOfOperation` |    string |    false |   Hours of operation as text, following the [Open Street Map specification](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification). Maximum length allowed is 1000. |

## pointElement

The `pointElement` is a class feature that defines a point feature in a unit, such as a first aid kit or a sprinkler head.

**Geometry Type**: MultiPoint

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        |[category.Id](#category)      |true      | The ID of a [`category`](#category) feature.|
| `unitId`          | string     | true     | The ID of a [`unit`](#unit) feature containing this feature.  Maximum length allowed is 1000.|
| `isObstruction`          | boolean (Default value is `null`.) | false     | If `true`, this feature represents an obstruction to be avoided while routing through the containing unit feature. |
|`name` |    string |    false |    Name of the feature in local language.  Maximum length allowed is 1000.|
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1000. |
|`nameAlt` |    string |    false |   Alternate name used for the feature.  Maximum length allowed is 1000.|

## lineElement

The `lineElement` is a class feature that defines a line feature in a unit, such as a dividing wall or window.

**Geometry Type**: LinearMultiString

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        |[category.Id](#category)      |true      | The ID of a [`category`](#category) feature.|
| `unitId`          | string     | true     | The ID of a [`unit`](#unit) feature containing this feature. Maximum length allowed is 1000. |
| `isObstruction`          | boolean (Default value is `null`.)| false     | If `true`, this feature represents an obstruction to be avoided while routing through the containing unit feature. |
|`name` |    string |    false |    Name of the feature in local language. Maximum length allowed is 1000. |
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1000. |
|`nameAlt` |    string |    false |   Alternate name used for the feature. Maximum length allowed is 1000. |
|`anchorPoint` |  [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson) that represents the feature as a point. Can be used to position the label of the feature.|
|`obstructionArea` |   [Polygon](/rest/api/maps/wfs/get-feature-preview#featuregeojson)| false | A simplified geometry (when the line geometry is complicated) of the feature that is to be avoided during routing. Requires `isObstruction` set to true.|

## areaElement

The `areaElement` is a class feature that defines a polygon feature in a unit, such as an area open to below, an obstruction like an island in a unit.

**Geometry Type**: MultiPolygon

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`categoryId`        |[category.Id](#category)      |true      | The ID of a [`category`](#category) feature.|
| `unitId`          | string     | true     | The ID of a [`unit`](#unit) feature containing this feature. Maximum length allowed is 1000. |
| `isObstruction`          | boolean | false     | If `true`, this feature represents an obstruction to be avoided while routing through the containing unit feature. |
|`obstructionArea` |  geometry: ["Polygon","MultiPolygon" ]| false | A simplified geometry (when the line geometry is complicated) of the feature that is to be avoided during routing. Requires `isObstruction` set to true.|
|`name` |    string |    false |    Name of the feature in local language. Maximum length allowed is 1000. |
|`nameSubtitle` |    string |    false |   Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1000.|
|`nameAlt` |    string |    false |   Alternate name used for the feature.  Maximum length allowed is 1000.|
|`anchorPoint` |  [Point](/rest/api/maps/wfs/get-feature-preview#featuregeojson) | false | [GeoJSON Point geometry](/rest/api/maps/wfs/get-feature-preview#featuregeojson)  that represents the feature as a point. Can be used to position the label of the feature.|

## category

The `category` class feature defines category names. For example: "room.conference".

**Geometry Type**: None

:::zone pivot="facility-ontology-v1"

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The category's original ID derived from client data. Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the category with another category in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`name` |    string |    true |   Name of the category. Suggested to use "." to represent hierarchy of categories. For example: "room.conference", "room.privateoffice". Maximum length allowed is 1000. |
| `routeThroughBehavior` | boolean | false | Determines whether a feature can be used for through traffic.|
|`isRoutable`        | boolean (Default value is `null`.)                  | false    |  Determines if a feature should be part of the routing graph. If set to `true`, the unit can be used as source/destination or intermediate node in the routing experience. |

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|`originalId`        | string     |true      | The category's original ID derived from client data.  Maximum length allowed is 1000.|
|`externalId`        | string     |true      | An ID used by the client to associate the category with another category in a different dataset, such as in an internal database. Maximum length allowed is 1000.|
|`name` |    string |    true |   Name of the category. Suggested to use "." to represent hierarchy of categories. For example: "room.conference", "room.privateoffice". Maximum length allowed is 1000. |

:::zone-end
