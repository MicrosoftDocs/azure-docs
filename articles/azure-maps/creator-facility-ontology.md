---
title: Facility Ontology in Microsoft Azure Maps Creator
description: Facility Ontology that describes the feature class definitions for Azure Maps Creator
author: brendansco
ms.author: Brendanc
ms.date: 02/17/2023
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps

zone_pivot_groups: facility-ontology-schema
---

# Facility Ontology

Facility ontology defines how Azure Maps Creator internally stores facility data in a Creator dataset.  In addition to defining internal facility data structure, facility ontology is also exposed externally through the WFS API. When WFS API is used to query facility data in a dataset, the response format is defined by the ontology supplied to that dataset.

## Changes and Revisions

:::zone pivot="facility-ontology-v1"

The Facility 1.0 contains revisions for the Facility feature class definitions for [Azure Maps services].

:::zone-end

:::zone pivot="facility-ontology-v2"

The Facility 2.0 contains revisions for the Facility feature class definitions for [Azure Maps services].

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

## Feature collection

:::zone pivot="facility-ontology-v1"

At a high level, the facility ontology consists of feature collections, each contains an array of feature objects. All feature objects have two fields in common, `ID` and `Geometry`. When importing a drawing package into Azure Maps Creator, these fields are automatically generated.

:::zone-end

:::zone pivot="facility-ontology-v2"

At a high level, the facility ontology consists of feature collections, each contains an array of feature objects. All feature objects have two fields in common, `ID` and `Geometry`.

# [Drawing package](#tab/dwg)

When importing a drawing package into Azure Maps Creator, these fields are automatically generated.

# [GeoJSON package (preview)](#tab/geojson)

Support for creating a [dataset] from a GeoJSON package is now available as a new feature in preview in Azure Maps Creator.

When importing a GeoJSON package, the `ID` and `Geometry` fields must be supplied with each [feature object] in each GeoJSON file in the package.

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`Geometry` | object | true | Each Geometry object consists of a `type` and `coordinates` array. While a required field, the value can be set to `null`. For more information, see [Geometry Object] in the GeoJSON (RFC 7946) format specification. |
|`ID` | string | true | The value of this field can be alphanumeric characters (0-9, a-z, A-Z), dots (.), hyphens (-) and underscores (_). Maximum length allowed is 1,000 characters.|

:::image type="content" source="./media/creator-indoor-maps/geojson.png" alt-text="A screenshot showing the geometry and ID fields in a GeoJSON file.":::

For more information, see [Create a dataset using a GeoJson package].

---

:::zone-end

In addition to these common fields, each feature class defines a set of properties. Each property is defined by its data type and constraints. Some feature classes have properties that are dependent on other feature classes. Dependant properties evaluate to the `ID` of another feature class.

The remaining sections in this article define the different feature classes and their properties that make up the facility ontology in Microsoft Azure Maps Creator.

## unit

The `unit` feature class defines a physical and non-overlapping area that can be occupied and traversed by a navigating agent. A `unit` can be a hallway, a room, a courtyard, and so on.

**Geometry Type**: Polygon

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` | [category.Id] |true | The ID of a [`category`] feature.|
|`isOpenArea` | boolean (Default value is `null`.) |false | Represents whether the unit is an open area. If set to `true`, [structures] don't surround the unit boundary, and a navigating agent can enter the `unit` without the need of an [`opening`]. By default, units are surrounded by physical barriers and are open only where an opening feature is placed on the boundary of the unit. If walls are needed in an open area unit, they can be represented as a [`lineElement`] or [`areaElement`] with an `isObstruction` property equal to `true`.|
|`navigableBy` | enum ["pedestrian", "wheelchair", "machine", "bicycle", "automobile", "hiredAuto", "bus", "railcar", "emergency", "ferry", "boat"] | false |Indicates the types of navigating agents that can traverse the unit. If unspecified, the unit is assumed to be traversable by any navigating agent. |
|`isRoutable` | boolean (Default value is `null`.) | false | Determines if the unit is part of the routing graph. If set to `true`, the unit can be used as source/destination or intermediate node in the routing experience. |
|`routeThroughBehavior` | enum ["disallowed", "allowed", "preferred"] | false | Determines if navigating through the unit is allowed. If unspecified, it inherits its value from the category feature referred to in the `categoryId` property. If specified, it overrides the value given in its category feature." |
|`nonPublic` | boolean| false | If `true`, the unit is navigable only by privileged users.  Default value is `false`. |
| `levelId` | [level.Id] | true | The ID of a level feature. |
|`occupants` | array of [directoryInfo.Id] | false | The IDs of [directoryInfo] features. Used to represent one or many occupants in the feature. |
|`addressId` | [directoryInfo.Id] | false | The ID of a [directoryInfo] feature. Used to represent the address of the feature.|
|`addressRoomNumber` | [directoryInfo.Id] | true | Room/Unit/Apartment/Suite number of the unit.|
|`name` | string | false | Name of the feature in local language. Maximum length allowed is 1,000 characters. |
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature. Maximum length allowed is 1,000 characters. |
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` | [category.Id] |true | The ID of a [`category`] feature.|
|`isOpenArea` | boolean (Default value is `null`.) |false | Represents whether the unit is an open area. If set to `true`, [structures] don't surround the unit boundary, and a navigating agent can enter the `unit` without the need of an [`opening`]. By default, units are surrounded by physical barriers and are open only where an opening feature is placed on the boundary of the unit. If walls are needed in an open area unit, they can be represented as a [`lineElement`] or [`areaElement`] with an `isObstruction` property equal to `true`.|
|`isRoutable` | boolean (Default value is `null`.) | false | Determines if the unit is part of the routing graph. If set to `true`, the unit can be used as source/destination or intermediate node in the routing experience. |
| `levelId` | [level.Id] | true | The ID of a level feature. |
|`occupants` | array of [directoryInfo.Id] | false | The IDs of [directoryInfo] features. Used to represent one or many occupants in the feature. |
|`addressId` | [directoryInfo.Id] | false | The ID of a [directoryInfo] feature. Used to represent the address of the feature.|
|`addressRoomNumber` | string | false | Room/Unit/Apartment/Suite number of the unit. Maximum length allowed is 1,000 characters.|
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

## structure

The `structure` feature class defines a physical and non-overlapping area that can't be navigated through. Can be a wall, column, and so on.

**Geometry Type**: Polygon

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` | [category.Id] |true | The ID of a [`category`] feature.|
| `levelId` | [level.Id] | true | The ID of a [`level`] feature. |
|`name` | string | false | Name of the feature in local language. Maximum length allowed is 1,000 characters. |
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters. |
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

## zone

The `zone` feature class defines a virtual area, like a WiFi zone or emergency assembly area. Zones can be used as destinations but aren't meant for through traffic.

**Geometry Type**: Polygon

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` | [category.Id] |true | The ID of a [`category`] feature.|
| `setId` | string | true |Required for zone features that represent multi-level zones. The `setId` is the unique ID for a zone that spans multiple levels. The `setId` enables a zone with varying coverage on different floors to be  represented with different geometry on different levels. The `setId` can be any string and is case-sensitive. It's recommended that the `setId` is a GUID.  Maximum length allowed is 1,000 characters.|
| `levelId` | [level.Id] | true | The ID of a  [`level`] feature. |
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature. Maximum length allowed is 1,000 characters. |
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` | [category.Id] |true | The ID of a [`category`] feature.|
| `setId` | string | true |Required for zone features that represent multi-level zones. The `setId` is the unique ID for a zone that spans multiple levels. The `setId` enables a zone with varying coverage on different floors to be  represented with different geometry on different levels. The `setId` can be any string and is case-sensitive. It's recommended that the `setId` is a GUID.  Maximum length allowed is 1,000 characters.|
| `levelId` | [level.Id] | true | The ID of a  [`level`] feature. |
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature. Maximum length allowed is 1,000 characters. |
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

## level

The `level` class feature defines an area of a building at a set elevation. For example, the floor of a building, which contains a set of features, such as [`units`].  

**Geometry Type**: MultiPolygon

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`facilityId` | [facility.Id] |true | The ID of a [`facility`] feature.|
| `ordinal` | integer | true | The level number. Used by the [`verticalPenetration`] feature to determine the relative order of the floors to help with travel direction. The general practice is to start with 0 for the ground floor. Add +1 for every floor upwards, and -1 for every floor going down. It can be modeled with any numbers, as long as the higher physical floors are represented by higher ordinal values. |
| `abbreviatedName` | string | false | A four-character abbreviated level name, like what would be found on an elevator button. |
| `heightAboveFacilityAnchor` | double | false | Vertical distance of the level's floor above [`facility.anchorHeightAboveSeaLevel`], in meters. |
| `verticalExtent` | double | false | Vertical extent of the level, in meters. If not provided, defaults to [`facility.defaultLevelVerticalExtent`].|
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry]  that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`facilityId` | [facility.Id] |true | The ID of a [`facility`] feature.|
| `ordinal` | integer | true | The level number. Used by the [`verticalPenetration`] feature to determine the relative order of the floors to help with travel direction. The general practice is to start with 0 for the ground floor. Add +1 for every floor upwards, and -1 for every floor going down. It can be modeled with any numbers, as long as the higher physical floors are represented by higher ordinal values. |
| `abbreviatedName` | string | false | A four-character abbreviated level name, like what would be found on an elevator button.|
| `heightAboveFacilityAnchor` | double | false | Vertical distance of the level's floor above [`facility.anchorHeightAboveSeaLevel`], in meters. |
| `verticalExtent` | double | false | Vertical extent of the level, in meters. If not provided, defaults to [`facility.defaultLevelVerticalExtent`].|
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry]  that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

## facility

The `facility` feature class defines the area of the site, building footprint, and so on.

**Geometry Type**: MultiPolygon

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` | [category.Id] |true | The ID of a [`category`] feature.|
|`occupants` | array of [directoryInfo.Id] | false | The IDs of [directoryInfo] features. Used to represent one or many occupants in the feature. |
|`addressId` | [directoryInfo.Id] | true | The ID of a [directoryInfo] feature. Used to represent the address of the feature.|
|`name` | string | false | Name of the feature in local language. Maximum length allowed is 1,000 characters. |
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters. |
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|
|`anchorHeightAboveSeaLevel` | double | false | Height of anchor point above sea level, in meters. Sea level is defined by EGM 2008.|
|`defaultLevelVerticalExtent` | double| false | Default value for vertical extent of levels, in meters.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` | [category.Id] |true | The ID of a [`category`] feature.|
|`occupants` | array of [directoryInfo.Id] | false | The IDs of [directoryInfo] features. Used to represent one or many occupants in the feature. |
|`addressId` | [directoryInfo.Id] | true | The ID of a [directoryInfo] feature. Used to represent the address of the feature.|
|`name` | string | false | Name of the feature in local language. Maximum length allowed is 1,000 characters. |
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters. |
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|
|`anchorHeightAboveSeaLevel` | double | false | Height of anchor point above sea level, in meters. Sea level is defined by EGM 2008.|
|`defaultLevelVerticalExtent` | double| false | Default value for vertical extent of levels, in meters.|

:::zone-end

## verticalPenetration

The `verticalPenetration` class feature defines an area that, when used in a set, represents a method of navigating vertically between levels. It can be used to model stairs, elevators, and so on. Geometry can overlap units and other vertical penetration features.

**Geometry Type**: Polygon

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` | [category.Id] |true | The ID of a [`category`] feature.|
| `setId` | string | true | Vertical penetration features must be used in sets to connect multiple levels. Vertical penetration features in the same set are considered to be the same. The `setId` can be any string, and is case-sensitive. Using a GUID as a `setId` is recommended.  Maximum length allowed is 1,000 characters.|
| `levelId` | [level.Id] | true | The ID of a level feature. |
|`direction` | string enum [ "both", "lowToHigh", "highToLow", "closed" ]| false | Travel direction allowed on this feature. The ordinal attribute on the [`level`] feature is used to determine the low and high order.|
|`navigableBy` | enum ["pedestrian", "wheelchair", "machine", "bicycle", "automobile", "hiredAuto", "bus", "railcar", "emergency", "ferry", "boat"] | false |Indicates the types of navigating agents that can traverse the unit. If unspecified, the unit is traversable by any navigating agent. |
|`nonPublic` | boolean| false | If `true`, the unit is navigable only by privileged users.  Default value is `false`. |
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature. Maximum length allowed is 1,000 characters. |
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry]  that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` | [category.Id] |true | The ID of a [`category`] feature.|
| `setId` | string | true | Vertical penetration features must be used in sets to connect multiple levels. Vertical penetration features in the same set are connected. The `setId` can be any string, and is case-sensitive. Using a GUID as a `setId` is recommended. Maximum length allowed is 1,000 characters. |
| `levelId` | [level.Id] | true | The ID of a level feature. |
|`direction` | string enum [ "both", "lowToHigh", "highToLow", "closed" ]| false | Travel direction allowed on this feature. The ordinal attribute on the [`level`] feature is used to determine the low and high order.|
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature. Maximum length allowed is 1,000 characters. |
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry]  that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

## opening

The `opening` class feature defines a traversable boundary between two units, or a `unit` and `verticalPenetration`.

**Geometry Type**: LineString

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` |[category.Id] |true | The ID of a category feature.|
| `levelId` | [level.Id] | true | The ID of a level feature. |
| `isConnectedToVerticalPenetration` | boolean | false | Whether or not this feature is connected to a `verticalPenetration` feature on one of its sides. Default value is `false`. |
|`navigableBy` | enum ["pedestrian", "wheelchair", "machine", "bicycle", "automobile", "hiredAuto", "bus", "railcar", "emergency", "ferry", "boat"] | false |Indicates the types of navigating agents that can traverse the unit. If unspecified, the unit is traversable by any navigating agent. |
| `accessRightToLeft`| enum [ "prohibited", "digitalKey", "physicalKey", "keyPad", "guard", "ticket", "fingerprint", "retina", "voice", "face", "palm", "iris", "signature", "handGeometry", "time", "ticketChecker", "other"] | false | Method of access when passing through the opening from right to left. Left and right are determined by the vertices in the feature geometry, standing at the first vertex and facing the second vertex. Omitting this property means there are no access restrictions.|
| `accessLeftToRight`| enum [ "prohibited", "digitalKey", "physicalKey", "keyPad", "guard", "ticket", "fingerprint", "retina", "voice", "face", "palm", "iris", "signature", "handGeometry", "time", "ticketChecker", "other"] | false | Method of access when passing through the opening from left to right. Left and right are determined by the vertices in the feature geometry, standing at the first vertex and facing the second vertex. Omitting this property means there are no access restrictions.|
| `isEmergency` | boolean | false | If `true`, the opening is navigable only during emergencies. Default value is `false` |
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] y that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` |[category.Id] |true | The ID of a category feature.|
| `levelId` | [level.Id] | true | The ID of a level feature. |
|`anchorPoint` |[Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

## directoryInfo

The `directoryInfo` object class feature defines the name, address, phone number, website, and hours of operation for a unit, facility, or an occupant of a unit or facility.

**Geometry Type**: None

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`streetAddress` |string |false |Street address part of the address.  Maximum length allowed is 1,000 characters. |
|`unit` |string |false |Unit number part of the address.  Maximum length allowed is 1,000 characters. |
|`locality`| string| false |The locality of the address. For example: city, municipality, village. Maximum length allowed is 1,000 characters.|
|`adminDivisions`| array of strings | false |Administrative division part of the address, from smallest to largest (County, State, Country). For example: ["King", "Washington", "USA" ] or ["West Godavari", "Andhra Pradesh", "IND" ]. Maximum length allowed is 1,000 characters.|
|`postalCode`| string | false |Postal code part of the address. Maximum length allowed is 1,000 characters.|
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters. |
|`nameAlt` | string | false | Alternate name used for the feature. Maximum length allowed is 1,000 characters. |
|`phoneNumber` | string | false | Phone number. Maximum length allowed is 1,000 characters. |
|`website` | string | false | Website URL. Maximum length allowed is 1,000 characters. |
|`hoursOfOperation` | string | false | Hours of operation as text, following the [Open Street Map specification]. Maximum length allowed is 1,000 characters. |

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`streetAddress` |string |false |Street address part of the address.  Maximum length allowed is 1,000 characters. |
|`unit` |string |false |Unit number part of the address.  Maximum length allowed is 1,000 characters. |
|`locality`| string| false |The locality of the address. For example: city, municipality, village. Maximum length allowed is 1,000 characters.|
|`adminDivisions`| array of strings| false |Administrative division part of the address, from smallest to largest (County, State, Country). For example: ["King", "Washington", "USA" ] or ["West Godavari", "Andhra Pradesh", "IND" ]. Maximum length allowed is 1,000 characters.|
|`postalCode`| string | false |Postal code part of the address. Maximum length allowed is 1,000 characters.|
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters. |
|`nameAlt` | string | false | Alternate name used for the feature. Maximum length allowed is 1,000 characters. |
|`phoneNumber` | string | false | Phone number. Maximum length allowed is 1,000 characters. |
|`website` | string | false | Website URL. Maximum length allowed is 1,000 characters. |
|`hoursOfOperation` | string | false | Hours of operation as text, following the [Open Street Map specification]. Maximum length allowed is 1,000 characters. |

:::zone-end

## pointElement

The `pointElement` is a class feature that defines a point feature in a unit, such as a first aid kit or a sprinkler head.

**Geometry Type**: MultiPoint

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` |[category.Id] |true | The ID of a [`category`] feature.|
| `unitId` | string | true | The ID of a [`unit`] feature containing this feature.  Maximum length allowed is 1,000 characters.|
| `isObstruction` | boolean (Default value is `null`.) | false | If `true`, this feature represents an obstruction to be avoided while routing through the containing unit feature. |
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters. |
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` |[category.Id] |true | The ID of a [`category`] feature.|
| `unitId` | string | true | The ID of a [`unit`] feature containing this feature.  Maximum length allowed is 1,000 characters.|
| `isObstruction` | boolean (Default value is `null`.) | false | If `true`, this feature represents an obstruction to be avoided while routing through the containing unit feature. |
|`name` | string | false | Name of the feature in local language.  Maximum length allowed is 1,000 characters.|
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters. |
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|

:::zone-end

## lineElement

The `lineElement` is a class feature that defines a line feature in a unit, such as a dividing wall or window.

**Geometry Type**: LinearMultiString

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` |[category.Id] |true | The ID of a [`category`] feature.|
| `unitId` | [`unitId`] | true | The ID of a [`unit`] feature containing this feature. |
| `isObstruction` | boolean (Default value is `null`.)| false | If `true`, this feature represents an obstruction to be avoided while routing through the containing unit feature. |
|`name` | string | false | Name of the feature in local language. Maximum length allowed is 1,000 characters. |
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters. |
|`nameAlt` | string | false | Alternate name used for the feature. Maximum length allowed is 1,000 characters. |
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|
|`obstructionArea` | [Polygon] or [MultiPolygon] | false | A simplified geometry (when the line geometry is complicated) of the feature that is to be avoided during routing. Requires `isObstruction` set to true.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` |[category.Id] |true | The ID of a [`category`] feature.|
| `unitId` | [`unitId`] | true | The ID of a [`unit`] feature containing this feature. |
| `isObstruction` | boolean (Default value is `null`.)| false | If `true`, this feature represents an obstruction to be avoided while routing through the containing unit feature. |
|`name` | string | false | Name of the feature in local language. Maximum length allowed is 1,000 characters. |
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters. |
|`nameAlt` | string | false | Alternate name used for the feature. Maximum length allowed is 1,000 characters. |
|`anchorPoint` |[Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|
|`obstructionArea` | [Polygon] or [MultiPolygon] | false | A simplified geometry (when the line geometry is complicated) of the feature that is to be avoided during routing. Requires `isObstruction` set to true.|

:::zone-end

## areaElement

The `areaElement` is a class feature that defines a polygon feature in a unit, such as an area open to below, an obstruction like an island in a unit.

**Geometry Type**: MultiPolygon

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is automatically set to the Azure Maps internal ID. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` |[category.Id] |true | The ID of a [`category`] feature.|
| `unitId` | [`unitId`] | true | The ID of a [`unit`] feature containing this feature. |
| `isObstruction` | boolean | false | If `true`, this feature represents an obstruction to be avoided while routing through the containing unit feature. |
|`obstructionArea` | [Polygon] or [MultiPolygon] | false | A simplified geometry (when the line geometry is complicated) of the feature that is to be avoided during routing. Requires `isObstruction` set to true.|
|`name` | string | false | Name of the feature in local language. Maximum length allowed is 1,000 characters. |
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on. Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry] that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the feature with another feature in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`categoryId` |[category.Id] |true | The ID of a [`category`] feature.|
| `unitId` |  [`unitId`] | true | The ID of a [`unit`] feature containing this feature. |
| `isObstruction` | boolean | false | If `true`, this feature represents an obstruction to be avoided while routing through the containing unit feature. |
|`obstructionArea` | [Polygon] or [MultiPolygon] | false | A simplified geometry (when the line geometry is complicated) of the feature that is to be avoided during routing. Requires `isObstruction` set to true.|
|`name` | string | false | Name of the feature in local language. Maximum length allowed is 1,000 characters. |
|`nameSubtitle` | string | false | Subtitle that shows up under the `name` of the feature. Can be used to display the name in a different language, and so on.  Maximum length allowed is 1,000 characters.|
|`nameAlt` | string | false | Alternate name used for the feature.  Maximum length allowed is 1,000 characters.|
|`anchorPoint` | [Point] | false | [GeoJSON Point geometry]  that represents the feature as a point. Can be used to position the label of the feature.|

:::zone-end

## category

The `category` class feature defines category names. For example: "room.conference".

**Geometry Type**: None

:::zone pivot="facility-ontology-v1"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | The category's original ID derived from client data. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the category with another category in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`name` | string | true | Name of the category. Suggested to use "." to represent hierarchy of categories. For example: "room.conference", "room.privateoffice". Maximum length allowed is 1,000 characters. |
| `routeThroughBehavior` | boolean | false | Determines whether a feature can be used for through traffic.|
|`isRoutable` | boolean (Default value is `null`.) | false | Determines if a feature should be part of the routing graph. If set to `true`, the unit can be used as source/destination or intermediate node in the routing experience. |

:::zone-end

:::zone pivot="facility-ontology-v2"

| Property    | Type   | Required | Description |
|-------------|--------|----------|-------------|
|`originalId` | string |false | When the dataset is created through the [conversion service], the original ID is set to the Azure Maps internal ID. When the [dataset] is created from a GeoJSON package, the original ID can be user defined. Maximum length allowed is 1,000 characters.|
|`externalId` | string |false | An ID used by the client to associate the category with another category in a different dataset, such as in an internal database. Maximum length allowed is 1,000 characters.|
|`name` | string | true | Name of the category. Suggested to use "." to represent hierarchy of categories. For example: "room.conference", "room.privateoffice". Maximum length allowed is 1,000 characters. |

:::zone-end

## Next steps

Learn more about Creator for indoor maps by reading:

> [!div class="nextstepaction"]
> [Creator for indoor maps]

<!---------   Internal Links     --------------->
[`areaElement`]: #areaelement
[`category`]: #category
[`facility.anchorHeightAboveSeaLevel`]: #facility
[`facility.defaultLevelVerticalExtent`]: #facility
[`facility`]: #facility
[`level`]: #level
[`lineElement`]: #lineelement
[`opening`]: #opening
[`unit`]: #unit
[`unitId`]: #unit
[`units`]: #unit
[`verticalPenetration`]: #verticalpenetration
[category.Id]: #category
[directoryInfo.Id]: #directoryinfo
[directoryInfo]: #directoryinfo
[facility.Id]: #facility
[level.Id]: #level
[structures]: #structure
<!---------   REST API Links     --------------->
[conversion service]: /rest/api/maps/v2/conversion
[dataset]: /rest/api/maps/2023-03-01-preview/dataset
[GeoJSON Point geometry]: /rest/api/maps/v2/wfs/get-features#geojsonpoint
[MultiPolygon]: /rest/api/maps/v2/wfs/get-features?tabs=HTTP#geojsonmultipolygon
[Point]: /rest/api/maps/v2/wfs/get-features#geojsonpoint
[Polygon]: /rest/api/maps/v2/wfs/get-features?tabs=HTTP#geojsonpolygon
<!---------   learn.microsoft.com links     --------------->
[Create a dataset using a GeoJson package]: how-to-dataset-geojson.md
[Creator for indoor maps]: creator-indoor-maps.md
<!---------   External Links     --------------->
[Azure Maps services]: https://aka.ms/AzureMaps
[feature object]: https://www.rfc-editor.org/rfc/rfc7946#section-3.2
[Geometry Object]: https://www.rfc-editor.org/rfc/rfc7946#section-3.1
[Open Street Map specification]: https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification
