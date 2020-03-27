---
title: DWG package requirements in Azure Maps | Microsoft Docs
description: Learn about the DWG package requirements to convert your facility design files to map data using the Azure Maps Conversion service
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/05/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philMea
---

# DWG package requirements

The Azure Maps Conversion API allows you to convert a DWG design package, for a single facility, into map data set. This article describes the DWG package requirements for the Conversion API.

## Prerequisites

You may choose any CAD software to produce your DWG package.

The Azure Maps Conversion API, which consumes the DWG package, has been developed and tested using AutoCAD 2019. With AC1032 as the internal format version for the DWG files. Regardless of the CAD software you choose, you're encouraged to select AC1032 for the internal DWG file version.  

Acquaint yourself with the following terms before we explain the DWG package requirements.

| Term  | Definition |
|:-------|:------------|
| Layer | An AutoCAD DWG layer|
| Level | An area of a building at a set elevation. For example, the floor of a building |
| Xref  | A DWG file attached to the primary drawing as an external reference |
| Feature | An object that combines a geometry with additional metadata information |
| Feature Classes | A common blueprint for features. For example, a Unit is a feature class, and an office is a feature |

## Package structure

A DWG package consists of DWG files and a manifest file for a single facility. The DWG files can be organized in any way inside the folder, but the manifest file must live at the root directory of the folder. The folder must be zipped in a single archive file, with a .zip extension. The next sections detail the requirements for the DWG files, manifest file, and the content of these files.  

## DWG files requirements

A single DWG file is required for each level of the facility. And the level's data must be contained in a single DWG file. Any external references (xrefs) must be bound to the parent drawing. Additionally, each DWG file:

* Must define the _Exterior_ and _Unit_ layers. It may optionally define the following optional layers: _Wall_, _Door_, _UnitLabel_, _Zone_, and _ZoneLabel_.
* Must not contain features from multiple levels
* Must not contain features from multiple facilities

The Azure Maps Conversion Service can extract the following feature classes from a DWG file:

* Levels
* Units
* Zones
* Openings
* Walls
* Vertical Penetrations 

A DWG layer must contain features of a single class, and classes must not share a layer. For example, units and walls can't share a layer.

Moreover:

* The origins of drawings for all DWG files must align to the same latitude and longitude.
* Each level must be in the same orientation as the other levels
* Self-intersecting polygons will be automatically repaired, and the Conversion API will raise a warning. It is recommended to manually inspect the repaired results as they may not match the expected results. 
* All CAD entities must be one of the following types: Line, PolyLine, Polygon, Circular Arc, Circle, Text (single line). Any other entity types will be ignored.

The table below outlines the supported entity types for each layer. If a layer contains unsupported entity types, then the Conversion API will ignore these entities.  

| Layer | Supported entity types |
| :----- | :-------------------|
| Exterior | Polygon, PolyLine (closed), Circle |
| Units |  Polygon, PolyLine (closed), Circle |
| Walls  | Polygon, PolyLine (closed), Circle |
| Doors | Polygon, PolyLine, Line, CircularArc, Circle |
| Zones | Polygon, PolyLine (closed), Circle |
| UnitLabel | Text (single line) |
| ZoneLabel | Text (single line) |

The next sections detail the requirements for each layer.

### Exterior layer

The DWG file for each level must contain a layer to define that level's perimeter. This layer is referred  to as the exterior layer. For example, if a facility contains two levels, then it needs to have two DWG files, with an exterior layer for each file.

Regardless of how many entity drawings are in the exterior layer, the [resulting facility data set](tutorial-private-atlas-indoor-maps.md#data-sets) will contain only one level feature for each DWG file. Additionally:

* Exteriors must be drawn as Polygon, PolyLine (closed), Circle

* Exteriors may overlap, but will be dissolved into one geometry

If the layer contains multiple overlapping PolyLines, then the PolyLines will be dissolved into a single Level feature. Alternatively, if the layer contains multiple non_overlapping PolyLines, the resulting Level feature will have a multi-polygonal representation.

### Units layer

The DWG file for each level should define a layer containing units.  Units are navigable spaces in the building, such as offices, hallways, stairs, and elevators. The Units layer should adhere to the following requirements:

* Units must be drawn as Polygon, PolyLine (closed), Circle
* Units must fall inside the bounds of the facility exterior perimeter
* Units must not partially overlap
* Units must not contain any self-intersecting geometry

 Name a unit by creating a text object in the _unitLabel_ layer, then place the object inside the bounds of the unit. For more information, see the [UnitLabel layer](#unitlabel-layer).

### Walls layer

The DWG file for each level may contain a layer that defines the physical extents of walls, columns, and other building structure.

* Walls must be drawn as Polygon, PolyLine (closed), Circle
* The wall layer(s) should only contain geometry that's interpreted as building structure

### Doors layer

You may include a DWG layer containing doors. Each door must overlap the edge of a unit from the unit layer. Each facility level can have a separate doors layer since each level is in a separate DWG file.

Doors from the layer won't be rendered on the resulting map as they appear in the CAD software. They'll be drawn according to the Azure Maps styling rules for the opening features. 

### Zones layer

The DWG file for each level may contain a zone layer that defines the physical extents of zones. A zone can be an indoor empty space or a back yard. 

* Zones must be drawn as Polygon, PolyLine (closed), Circle
* Zones may overlap
* Zones may fall inside or outside the facility's exterior perimeter

Name a zone by creating a text object in the _zoneLabel_ layer, and placing the text object inside the bounds of the zone. For more information, see [ZoneLabel layer](#zonelabel-layer).

### UnitLabel layer

The DWG file for each level may contain a unit label layer. The unit label layer adds a name property to units extracted from the Unit layer. Units with a name property can have additional details specified in the manifest file.

* Unit labels must be single-line text entities.
* Unit labels must fall inside the bounds of their unit.
* Units must not contain multiple text entities in the unit labels layer.

### ZoneLabel layer

The DWG file for each level may contain a zone label layer. This layer adds a name property to zones extracted from the Zone layer. Zones with a name property can have additional details specified in the manifest file.

* Zones labels must be single-line text entities.
* Zones labels must fall inside the bounds of their zone.
* Zones must not contain multiple text entities in the zone labels layer.

## Manifest file requirements

The zip folder must contain a manifest file at the root level of the directory, and the file must be named **manifest.json**. It describes the DWG files to allow the Conversion API to parse their content. Only the files identified by the manifest will be ingested. Files that are in the zip folder, but aren't properly listed in the manifest, will be ignored. 

The file paths, in the **building_levels** object of the manifest file, must be relative to the root of the zip folder. The DWG file name must exactly match the name of the facility level. For example, a DWG file for the "Basement" level would be "Basement.dwg." A DWG file for level 2 would be named as "level_2.dwg." Use an underscore, if your level name has a space. 

Although there are requirements when using the manifest objects, not all objects are required. The table below shows the required and the optional objects for version 1.1 of the Conversion API. 

| Object | Required | Description |
| :----- | :------- | :------- | 
| directoryInfo | true | Outlines the facility geographic and contact information. It can also be used to outline an occupant geographic and contact information. |
| buildingLevels | true | Specifies the levels of the buildings and the files containing the design of the levels | 
| georeference | true | Contains numerical geographic information for the facility drawing |
| dwgLayers | true | Lists the names of the layers, and each layer lists the names of its own features |
| unitProperties | false | Can be used to insert additional metadata for the unit features |
| zoneProperties | false | Can be used to insert additional metadata for the zone features |

The next sections detail the requirements for each object.

### directoryInfo

| Property  | type | Required | Description |
|-----------|------|----------|-------------|
| name      | string | true   |  Name of building |
| streetAddress|    string |    false    | Address of building |
|unit     | string    |  false    |  Unit in building |
| locality |    string |    false |    Name of an area, neighborhood, or region. For example, "Overlake" or "Central District." Locality isn't part of the mailing address. |
| adminDivisions |    JSON Array of strings |    false     | An array containing address designations (Country, State, City) or (Country, Prefecture, City, Town). Use ISO 3166 country codes and ISO 3166-2 state/territory codes. |
| postalCode |    string    | false    | The mail sorting code |
| hoursOfOperation |    string |     false | Adheres to the [OSM Opening Hours](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification) format |
| phone    | string |    false |    Phone number associated with the building, and it must include the country code |
| website    | string |    false    | Website associated with the building, and it must begin with http or https |
| nonPublic |    bool    | false | Flag specifying if the building is open to the public. |
| anchorLatitude | numeric |    false | Latitude of a facility anchor (pushpin) |
| anchorLongitude | numeric |    false | Longitude of a facility anchor (pushpin) |
| anchorHeightAboveSeaLevel  | numeric | false | Height of the facility's ground floor above sea level, in meters |
| defaultLevelVerticalExtent | numeric | false | Default height (thickness) of a level of this facility to use when a level's `verticalExtent` is undefined |

### buildingLevels

The `buildingLevels` object contains a JSON array of buildings levels.

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|level_name    |string    |true |    Descriptive level name. For example: Floor 1, Lobby, Blue Parking, Basement, and so on.|
|ordinal | integer |    true | Ordinal is used to determine the vertical order of levels. Every facility must have a level with ordinal 0 |
|heightAboveFacilityAnchor | numeric |    false |    Level height above the ground floor in meters |
| verticalExtent | numeric | false | Floor to ceiling height (thickness) of the level in meters |
|filename |    string |    true |    File system path of the CAD drawing for a building level. It must be relative to the root of the building's zip file. |

### georeference

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|lat    | numeric |    true |    Decimal representation of degrees latitude at the facility drawing's origin |
|lon    |numeric|    true|    Decimal representation of degrees longitude at the facility drawing's origin |
|angle|    numeric|    true|    The angle from the desired orientation of the building on a map to the orientation of the building in the DWG file. The angle is measured clockwise and in degrees. |

### dwgLayers

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|exterior    |Array of strings|    true|    Names of layer(s) that define the exterior building profile|
|unit|    Array of strings|    true|    Names of layer(s) that define units|
|wall|    Array of strings    |false|    Names of layer(s) that define walls|
|door    |Array of strings|    false   | Names of layer(s) that define doors|
|unitLabel    |Array of strings|    false    |Names of layer(s) that define names of units|
|zone | Array of strings    | false    | Names of layer(s) that define zones|
|zoneLabel | Array of strings |     false |    Names of layer(s) that define names of zones|

### unitProperties

The `unitProperties` object contains a JSON array of unit properties.

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|unitName    |string    |true    |Name of unit to associate with this `unitProperty` record. This record is only valid when a label matching `unitName` is found in the `unitLabel` layer(s) |
|categoryName|    string|    false    |Category Name. For a complete list of categories, refer to [categories](https://aka.ms/pa-indoor-spacecategories). |
|navigableBy| Array of strings |    false    |Indicates the types of navigating agents that can traverse the unit. For example, "pedestrian". This property will inform the wayfinding capabilities.  The permitted values are `pedestrian`, `wheelchair`, `machine`, `bicycle`, `automobile`, `hired_auto`, `bus`, `railcar`, `emergency`, `ferry`, `boat`, and `disallowed`.|
|routeThroughBehavior|    string|    false    |The route through behavior for the unit. The permitted values are `disallowed`, `allowed`, and `preferred`.|
|occupants    |Array of directoryInfo objects |false    |List of occupants for the unit |
|nameAlt|    string|    false|    Alternate Name |
|nameSubtitle|    string    |false|    Subtitle |
|addressRoomNumber|    string|    false|    Room/Unit/Apartment/Suite number of the unit|
|verticalPenetrationCategory|    string|    false| Vertical Penetration is a [Category](https://aka.ms/pa-indoor-spacecategories) Name. When this property is defined, the resulting feature will have a Vertical Penetration (VRT) style.it can be used to navigate to other VRT features in the levels above or below it.  |
|verticalPenetrationDirection|    string|    false    |If `verticalPenetrationCategory` is defined, optionally define the valid direction of travel. The permitted values are `low_to_high`, `high_to_low`, `both`, and `closed`.|
| nonWheelchairAccessible  | bool | false | indicates if the unit is accessible by wheelchair |
| nonPublic | bool | false | Indicates if the unit is open to the public |
| isRoutable | bool | false | When set to false, unit can't be navigated to, or through |
| isOpenArea | bool | false | Allows navigating agent to enter the unit without the need for an opening attached to the unit. By default, this value is set to true unless the unit has an opening. |

### The zoneProperties object

The `zoneProperties` object contains a JSON array of zone properties.

| Property  | Type | Required | Description |
|-----------|------|----------|-------------|
|zoneName        |string    |true    |Name of zone to associate with `zoneProperty` record. This record is only valid when a label matching `zoneName` is found in the `zoneLabel` layer  |
|categoryName|    string|    false    |Category Name. For a complete list of categories, refer to [categories](https://aka.ms/pa-indoor-spacecategories). |
|zoneNameAlt|    string|    false    |Alternate Name  |
|zoneNameSubtitle|    string |    false    |Subtitle |
| zoneSetId | string | false | When defined, the user can link zones with the same `zoneSetId` into addressable groups |

### A sample manifest file

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

## Next steps

Once your DWG package meets the requirements, you may use the Conversion API to convert the DWG file into a map data set. Then, you can use the data set to generate an indoor map using the Indoor Maps module. Learn more about using the Azure Maps Indoor Maps SDK by reading the following articles:

> [!div class="nextstepaction"]
> [Private Atlas tutorial](tutorial-private-atlas-indoor-maps.md)

> [!div class="nextstepaction"]
> [Indoor Maps dynamic styling](indoor-map-dynamic-styling.md)

> [!div class="nextstepaction"]
> [Indoor Maps module](how-to-use-indoor-module.md)