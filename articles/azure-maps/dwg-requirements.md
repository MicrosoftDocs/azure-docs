---
title: DWG package requirements in Azure Maps | Microsoft Docs
description: Learn about DWG to GeoJSON data format conversion in Azure Maps 
author: walsehgal
ms.author: v-musehg
ms.date: 10/18/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philMea
---

# DWG package requirements

The Azure Maps DWG Conversion API allows you to convert a DWG design file for a single facility into map data. This article helps you understand the DWG package requirements for the DWG Conversion API.

Following is a table of terms that you need to be familiar with before we explain the requirements for the DWG package.

| Term  | Definition |
|-------|------------|
| Layer | An AutoCAD DWG layer|
| Level | An area of a building at a set elevation. Levels are not necessarily contiguous; for example, in buildings with multiple towers|
| Xref  | An DWG attached to the primary drawing as an external reference. |


## Package requirements

Files defining a single building to be converted must be packaged in a single zip archive, containing:

  1. The DWG files to be imported.
  2. A manifest describing the building.

DWG files may be organized in any way inside the archive. File paths in the buildingLevels object of the manifest file are relative to the root of the zip file. Only the files identified by the manifest will be ingested. Additional files, if present, will be ignored. The manifest file must be named "manifest.json". The manifest file must exist at the root directory of the zip archive.

### DWG File

DWG files may be organized in any way inside the archive. File paths in the **building_levels** object of the manifest file are relative to the root of the zip file. Only the files identified in these paths will be ingested, so each filename should exactly match the name of each level. Additional files, if present, will be ignored. The manifest file must be named **"manifest.json"**. The manifest file must exist at the root directory of the zip archive.

DWG files MUST adhere to the following format:

* Each building level MUST be stored in one, and only one, DWG file.
* Each building level MUST define the following layers: Exterior, Unit.
* Each building level MAY additionally define the following layers: Wall, Door, UnitLable, Zone, ZoneLabel.


### General Requirements for Level DWGs

Following are the general requirements for DWG files for all levels.

* If a drawing for a level contains external references, they can be merged into the drawing using the bind command.
* Text objects in DWG layers will not be rendered on the indoor map. Text objects located in an optional UnitLabel and ZoneLabel will be attached respectively to unit and zone geometry as an attribute and exposed via a query layer. A text object in the UnitLabel or ZoneLabel layer must fall inside the bounds of the unit or zone it applies to.
* The origins of drawings for multiple levels MUST be aligned to the same latitude/longitude.
* Each level MUST be in the same orientation.
* Geometry outside the building level outline will be ignored
* All lat/lon coordinates are in WGS84.


Following are the requirements for DWG files for different layers.


### Building Outline layer

The DWG file for each level should contain a layer that defines that level's perimeter. Following are the requirements to build outline layer:

* The exterior layer should always contain a single closed polyline that defines the exterior perimeter of the building at that level.
* The exterior layer should not contain any self-intersecting geometry.

> [!Note]
> If the exterior layer contains multiple overlapping geometries, a union operation will be performed on all geometry in the layer.

###  Units layer

The DWG file for each level should define a layer containing units. A unit is a room or space. It should adhere to the following:

* Units should be drawn as closed polylines. 
* Units must not overlap. 
* Units should not contain any self-intersecting geometry. 
* Units should fall inside the bounds of the building outline for a given layer.

> [!Note]
> A unit can be named by creating a text object in the `unitLabel` layer and placing it inside the bounds of the unit.

### Walls layer

The DWG file for each level may contain a layer that defines the physical extents of walls and other building structure. Walls and structure may be spread across multiple layers, but layers containing walls and structure should not contain any other geometry. DWG files containing wall layers should adhere to the following conditions:

* Walls should be drawn as closed polylines. 

> [!Note]
> In AutoCAD the polyline 'closed' property does not need to be set to 'Yes' but the first and last vertices of the polyline must be coincident.

* The wall layer(s) should not contain any geometry that should not be interpreted as building structure. 
* The wall layer(s) MUST NOT contain self-intersecting geometry.

### Doors layer

A DWG layer containing doors may be included in the package. To create a DWG layer for door, you must adhere to the following conditions:

* Each door must overlap the edge of a unit from the unit layer. 
* Doors MAY be drawn using any 2D primitives, line, polyline, arc, etc.

> [!Note]
> Doors will not be rendered on the resulting map, but will be used to inform the indoor way finding algorithm.

### Zones layer

The DWG file for each level may contain a zone layer that defines the physical extents of zones. 

* Zones must be drawn as closed polylines. 
* Zones may overlap. 
* Zones may fall inside or outside the level boundary.

> [!Note]
> A zone can be named by creating a text object in the `zoneLabel` layer and placing it inside the bounds of the zone.

### Manifest file

The manifest file is a JSON text file which defines DWG filenames, georeferencing information, building details, and DWG layer names. Properties marked as required must be defined in the manifest file. Properties marked not required may be defined in the manifest file to add detail or clarity to the map.


### Object definitions

This section defines the objects in the manifest file and their properties.

* **`directoryInfo`**

| Property  | type | Required | Description |
|-----------|------|----------|-------------|
| name      | string | true   |  Name of building. |
| streetAddress|	string |	false	| Address of building. |
|unit	 | string	|  false	|  Unit in building.|
| locality |	string |	false |	Name of area, neighborhood, or region. Locality is not part of the mailing address. For example, "Overlake" or "Central District". |
| adminDivisions |	JSON Array of string |	false	 | An array containing address designations (Country, State, City) or (Country, Prefecture, City, Town). Use ISO 3166 country codes and ISO 3166-2 state/territory codes. |
| postalCode |	string	| false	| Mail sorting code.|
| hoursOfOperation |	string | 	false |	Format specifications: [OSM Opening Hours](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification). |
| phone	| string |	false |	Phone number associated with the building. Must include country code. |
| website	| string |	false	| Website associated with the building. Must begin with http or https.|
| nonPublic |	bool	| false |	Flag specifying whether or not the building is open to the public. |
| pushpinLocation |	{Lat,Lon} |	false |	Location to use when representing the building as a point on the map.|


* **`buildingLevels` (JSON Array of level)**

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|level_name	|string	|true |	Descriptive level name. For example: Floor 1, Lobby, Blue Parking, SubSubBasement, etc.|
|ordinal | integer |	true |	A signed integer. 0 is nominally ground level, but this is not strictly enforced. Ordinal is used to determine the vertical order of levels. |
|heightAboveGround |	null or numeric |	false |	Level height above ground in meters.|
|filename |	string |	true |	File system path of the CAD drawing for a level relative to the root of the building's zip archive. |


* **`georeference`**

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|lat	| numeric |	true |	Decimal representation of degrees latitude at the building origin to six or more digits of precision.|
|lon	|numeric|	true|	Decimal representation of degrees longitude at the building origin to six or more digits of precision.|
|angle|	numeric|	true|	The angle, measured clockwise in degrees, from the desired orientation of the building on a map to the orientation of the building in the DWG file.|


* **`dwgLayers`**

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|exterior	|Array of string|	true|	Names of layer(s) that define the exterior building profile.|
|unit|	Array of string|	true|	Names of layer(s) that define units.|
|wall|	Array of string	|false|	Names of layer(s) that define walls.|
|door	|Array of string|	false	Names of layer(s) that define doors.|
|unitLabel	|Array of string|	false	|Names of layer(s) that define names of units.|
|zone | Array of string	| false	| Names of layer(s) that define zones.|
|zoneLabel | Array of string | 	false |	Names of layer(s) that define names of zones.|

* **`unitProperties` (JSON Array of unitProperty)**

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|unitName	|string	|true	|Name of unit to associate with `unitProperty` record. This functionality is only supported when a `unitLabel` layer is used to assign names to units.|
|categoryName|	string|	false	|Category Name. For a complete list of categories, refer to [space categories](https://aka.ms/pa-indoor-spacecategories). |
|navigableBy|	string|	false	|Indicates the types of navigating agents that can traverse the unit. For e.g. "pedestrian". This will inform the wayfinding capabilities. Currently this property is not utilized by Private Atlas.|
|routeThroughBehavior|	string|	false	|The route through behavior for the unit. For allowed values please see **routeThroughBehavior** table below.|
|occupants	|directoryInfo[]|false	|List of occupants for the unit.|
|nameAlt|	string|	false|	Alternate Name.|
|nameSubtitle|	string	|false|	Subtitle.|
|addressRoomNumber|	string|	false|	Room/Unit/Apartment/Suite number of the unit.|
|verticalPenetrationCategory|	string|	false|	Vertical Penetration Category Name. For a complete list of categories, refer to [space categories](https://aka.ms/pa-indoor-spacecategories).|
|verticalPenetrationDirection|	string|	false	|If `verticalPenetrationCategory` is defined, optionally define the valid direction of travel. For allowed values please see **verticalPenetrationDirection** table below.|


 **`zoneProperties` (JSON Array of zoneProperty)**

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|zoneName		|string	|true	|Name of zone to associate with `zoneProperty` record. This functionality is only supported when a `zoneLabel` layer is used to assign names to units.|
|categoryName|	string|	false	|Category Name. For a complete list of categories, refer to [space categories](https://aka.ms/pa-indoor-spacecategories).|
|zoneNameAlt|	string|	false	|Alternate Name. |
|zoneNameSubtitle|	string |	false	|Subtitle.|

  * **Subtype** **`routeThroughBehavior`**
  
  | navigable_by | 
  |--------------|
  | disallowed |
  | allowed |
  | preferred |

* **Subtype** **`verticalPenetrationDirection`**
  
  | navigable_by | 
  |--------------|
  | low_to_high |
  | high_to_low |
  | both |
  | closed |

Following is a sample manifest file.

```JSON
{
	"version": "1.0",
	"directoryInfo": {
		"name": "Contoso Building A",
		"streetAddress": "12345 NE 67th St",
		"unit": "",
		"locality": "",
		"postalCode": "98052",
		"adminDivisions": ["Contoso city", "WA", "United States"],
		"hoursOfOperation": "Mo-Fr 08:00-17:00 open",
		"phone": "1 (234) 567-8910",
		"website": "www.contoso.com",
		"nonPublic": true
	},
	"buildingLevels": {
		"levels": [{
				"levelName": "US_STDB_X1",
				"ordinal": -1,
				"heightAboveGround": -4.0,
				"filename": "./US_STDB_X1.dwg"
			},
			{
				"levelName": "US_STDB_01",
				"ordinal": 0,
				"heightAboveGround": 0.0,
				"filename": "./US_STDB_01.dwg"
			},
			{
				"levelName": "US_STDB_02",
				"ordinal": 1,
				"heightAboveGround": 3.0,
				"filename": "./US_STDB_02.dwg"
			},
			{
				"levelName": "US_STDB_03",
				"ordinal": 2,
				"heightAboveGround": 6.0,
				"filename": "./US_STDB_03.dwg"
			},
			{
				"levelName": "US_STDB_04",
				"ordinal": 3,
				"heightAboveGround": 9.0,
				"filename": "./US_STDB_04.dwg"
			}
		]
	},
	"georeference": {
		"lat": 47.636152,
		"lon": -122.132600,
		"angle": 89.5
	},
	"dwgLayers": {
		"exterior": ["GROS$"],
		"unit": ["RM$"],
		"wall": ["A-WALL-EXST", "A-WALL-CORE-EXST", "A-COL-EXST"],
		"door": ["A-DOOR-EXST", "A-DOOR-CORE-EXST"],
		"unitLabel": ["RM$TXT"]
	},
	"unitProperties": [{
		"unitName": "3C00",
		"categoryName": "office",
		"navigableBy": "pedestrian",
		"routeThroughBehavior": "preferred",
		"unitInfo": {
			"unit": "3C",
			"name": "Contoso Team A",
			"website": "https://contoso.com",
			"phone": "1 (235) 567-9871"
		}
	}]
}
```