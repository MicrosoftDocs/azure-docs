---
title: Drawing Conversion Error and Warning in Azure Maps | Microsoft Docs
description: Learn about the Conversion errors and warnings you may meet while you're using the Azure Maps Conversion service. Read the recommendations on how to resolve the errors and the warnings, with some examples.
author: anastasia-ms
ms.author: v-stharr
ms.date: 05/04/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philMea
---

# Drawing conversion errors and warnings

The [Azure Maps Conversion service](https://docs.microsoft.com/rest/api/maps/data/conversion) lets you convert uploaded Drawing packages into map data. Drawing packages must adhere to the [Drawing package requirements](drawing-requirements.md). If one or more requirements are not met, then the Conversion service will return errors and/or warnings. This article lists the conversion error and warning codes, with recommendations on how to resolve them. It also provides some examples of drawings that can cause the Conversion service to return these codes.

The Conversion service will succeed if there are any conversion warnings, but it’s recommended that you review and/or resolve all warnings. A warning means part of the conversion was ignored or automatically fixed. Failing to resolve the warnings could result in errors in latter processes.

## General Warnings

### **geometryWarning**

#### *Description for geometryWarning*

A **geometryWarning** warning occurs when the Conversion service discovers an invalid entity. An invalid entity is an entity that does not conform to geometric constraints. The Conversion service is unable to create a map feature from an invalid entity and instead ignores it.

The following are examples of invalid entities:

* PolyLine features not meeting perfectly at a point.
* A self-intersecting polygon.
* An unclosed polygon.
* Gaps between polygon borders.
* Overlapping polygon borders.

#### *Example for geometryWarning*

 ![Example of a geometric error](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix geometryWarning*

Inspect the **geometryWarning** warning for each entity to verify that it follows geometric constraints.

### **unexpectedGeometryInLayer**

#### *Description for unexpectedGeometryInLayer*

The **unexpectedGeometryInLayer** warning occurs when the Conversion service finds a geometry that is incompatible with its current layer. When the Conversion service throws an **unexpectedGeometryInLayer** warning, it will ignore that geometry.

#### *Examples for unexpectedGeometryInLayer*

* The Conversion service finds a non-closed PolyLine in the level outline layer, unit layer, zone layer, or wall layer.

    ![Example of a non-closed Polyline](./media/drawing-conversion-error-codes/placeholder.png)

* The Conversion service finds a non-text entity in the zoneLabel layer or the unitLabel layer.

    ![Example of a non-text entity](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix unexpectedGeometryInLayer*

Inspect each **unexpectedGeometryInLayer** warning and move the incompatible geometry to a compatible layer. If it is not compatible with any of the other layers, it should be removed.

### **unsupportedFeatureRepresentation**

#### *Description for unsupportedFeatureRepresentation*

The **unsupportedFeatureRepresentation** warning occurs when the Conversion service finds an unsupported entity type.

#### *Examples for unsupportedFeatureRepresentation*

* The Conversion service finds a multi-line text object on a label layer.
  
    ![Example of a multi-line text object on label layer](./media/drawing-conversion-error-codes/placeholder.png)

* The Conversion service finds a 3D Face in the unit layer.

    ![Example of a 3D Face on unit layer](./media/drawing-conversion-error-codes/placeholder.png)

* The Conversion service finds an old-style Polyline2D entity that hasn't been converted to a regular Polyline.

    ![Example of a Polyline2D entity](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix unsupportedFeatureRepresentation*

Ensure that your DWG files contain only the supported entity types listed under the [Drawing files requirements section in the Drawing package requirements article](drawing-requirements.md#drawing-package-requirements).

### **automaticRepairPerformed**

#### *Description for automaticRepairPerformed*

The **automaticRepairPerformed** warning occurs when the Conversion service finds invalid geometry and automatically repairs it.

#### *Examples for automaticRepairPerformed*

* The Conversion service found and repaired a self-intersecting polygon.

    ![Example of a self-intersecting polygon repaired](./media/drawing-conversion-error-codes/placeholder.png)

* The Conversion service found and repaired a non-closed Polyline with first and last vertices closer than 1 mm were snapped to make a closed Polyline.

    ![Example of a snapped Polyline](./media/drawing-conversion-error-codes/placeholder.png)

* In a layer that only supports closed Polylines, the Conversion service found, and repaired multiple non-closed Polylines to to combine them into a single closed Polyline. This fix was done to avoid discarding the Polylines.

    ![Example of non-closed Polylines converted to closed Polyline](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix automaticRepairPerformed*

To fix an **automaticRepairPerformed** warning, do the following:

1. Inspect each warning's geometry and the specific warning text.
2. Determine if the automated repair is correct.
3. If the repair is correct, continue. Otherwise, go to the design file and resolve the warning manually.

>[!TIP]
>To suppress a warning in the future, make changes to the original drawing such that the original drawing matches the repaired drawing.

## Manifest warnings

### **redundantAttribution**

#### *Description for redundantAttribution*

The **redundantAttribution** warning occurs when the Conversion service finds redundant or conflicting object properties.

#### *Examples for redundantAttribution*

* The Conversion service finds two or more `unitProperties` objects with the same `name`.

    ![Example of `unitProperty` objects with same name](./media/drawing-conversion-error-codes/placeholder.png)

* The Conversion service finds two or more `zoneProperties` objects with the same `name`.
    ![Example of ``zoneProperty` objects with same name](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix redundantAttribution*

To fix a **redundantAttribution* warning, remove redundant or conflicting object properties.

## Level warnings

### **wallOutsideLevel**

#### *Description for wallOutsideLevel*

The **wallOutsideLevel** warning occurs when the Conversion service finds a Wall geometry outside the bounds of a level outline.

#### *Example for wallOutsideLevel*

* The Conversion service finds an interior wall, shown in red, outside the yellow level boundary.

    ![Interior wall goes outside the level boundary](./media/drawing-conversion-error-codes/interior-wall-outside-level-boundary.png)

* The Conversion service finds an exterior wall, shown in red, outside the yellow level boundary.

    ![Exterior wall goes outside the level boundary](./media/drawing-conversion-error-codes/exterior-wall-outside-level-boundary.png)

#### *How to fix wallOutsideLevel*

To fix an **wallOutsideLevel** warning, expand the level geometry to include all walls. Or, modify wall boundaries to fit inside the level boundary.

## Unit warnings

### **unitOutsideLevel**

#### *Description for unitOutsideLevel*

An **unitOutsideLevel** warning occurs when the Conversion service finds a unit geometry outside the bounds of the level outline.

#### *Example for unitOutsideLevel*

 In the following image, a unit geometry, shown in red, exceeds the bounds of the yellow level boundary.

 ![Unit goes outside the level boundary](./media/drawing-conversion-error-codes/unit-outside-level-boundary.png)

#### *How to fix unitOutsideLevel*

To fix an **unitOutsideLevel** warning, expand the level boundary to include all units. Or, modify unit geometry to fit inside the level boundary.

### **partiallyOverlappingUnit**

#### *Description for partiallyOverlappingUnit*

A **partiallyOverlappingUnit** occurs when the Conversion service finds a unit geometry partially overlapping on another unit geometry. The Conversion service ignores overlapping units.

#### *Example scenarios partiallyOverlappingUnit*

In the following image, the overlapping units are highlighted in red. `UNIT136` overlaps `CIRC103`, `UNIT126`, and `UNIT135`.

![Unit overlap](./media/drawing-conversion-error-codes/unit-overlap.png)

#### *How to fix partiallyOverlappingUnit*

To fix a **partiallyOverlappingUnit** warning, redraw each partially overlapping unit so that it doesn't overlap any other units.

## Door warnings

### **doorOutsideLevel**

#### *Description for doorOutsideLevel*

The **doorOutsideLevel** warning occurs when the Conversion service finds a door geometry outside the bounds of the level geometry.

#### *Example for doorOutsideLevel*

In the following image, the door geometry, highlighted in red, overlaps the yellow level boundary.

![Example of a door outside level boundary](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix doorOutsideLevel*

To fix a **doorOutsideLevel** warning, redraw your door geometry so that it is inside the level boundaries.

## Zone warnings

### **zoneWarning**

#### *Description for zoneWarning*

The **zoneWarning** warning occurs when the Conversion service encounters an error while attempting to create a zone feature.

#### *Example for zoneWarning*

The Conversion service finds a zone that contains multiple zone labels or no zone labels.

![Example of a zone that contains multiple zone labels or no zone labels](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix zoneWarning*

To fix a **zoneWarning**, verify that each zone has only one label.

## Drawing Package errors

### **invalidArchiveFormat**

#### *Description for invalidArchiveFormat*

The **invalidArchiveFormat** error occurs when the Conversion service detects an invalid archive format such as GZIP or 7-Zip. Only the ZIP archive format is supported.
The **invalidArchiveFormat** error will also occur if the ZIP archive is empty.

#### *Example scenario for invalidArchiveFormat*

![Example of invalidarchiveformat](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix invalidArchiveFormat*

To fix an **invalidArchiveFormat** error, do the following:

* Verify that your archive file name ends in _.zip_.
* Verify that your ZIP archive contains data.
* Verify that you can open your ZIP archive.

### **invalidUserData**

#### *Description for invalidUserData*

An **invalidUserData** error occurs when the Conversion service is unable to read a user data object from storage.

#### *Example scenario for invalidUserData*

You attempted to upload a Drawing package with an incorrect `udid` parameter.

#### *How to fix invalidUserData*

To fix a **invalidUserData** error, verify all of the following:

* That you have provided a correct `udid` for the uploaded package.
* That Azure Maps Creator has been enabled for the Azure Maps account you used for uploading the Drawing package.
* That the API request to the Conversion service contains the subscription key to the Azure Maps account you used for uploading the Drawing package.

### **dwgError**

#### *Description for dwgError*

The **dwgError** occurs when the Conversion service finds an issue with one or more DWG files in the uploaded ZIP archive.

The **dwgError** error occurs because of one or more of the following reasons: because of the following:

* A DWG file isn't a valid AutoCAD DWG file format drawing.
* A DWG file is corrupt.
* A DWG file is listed in the _manifest.json_ file, but it's missing from the ZIP archive.

#### *Example scenario for dwgError*

![Example of dwgError](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix dwgError*

To fix a **dwgError** error, inspect your _manifest.json_ file and do one or more of the following:

* Confirm that all DWG files in your ZIP archive are valid AutoCAD DWG file format drawings. Remove or fix all invalid drawings.
* If the _manifest.json_ is corrupted, repair your corrupt DWG file. Or, discard it and create a new one.
* Confirm that the list of  DWG files in the _manifest.json_  matches the DWG files in the ZIP archive.

## Manifest errors

### **invalidJsonFormat**

#### Description for invalidJsonFormat

The **invalidJsonFormat** error occurs when the _manifest.json_ file cannot be read.

The _manifest.json_file cannot be read because of one or more of the following reasons:

* The _manifest.json_ doesn't contain any JSON text.
* The _manifest.json_ contains non-JSON text.
* The _manifest.json_ has JSON syntax errors.

#### *Example scenario for invalidJsonFormat*

![Example of invalidJsonFormat](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix invalidJsonFormat*

To fix an **invalidJsonFormat** error, use a JSON linter to detect and resolve any JSON errors.

### **missingRequiredField**

#### *Description for missingRequiredField*

A **missingRequiredField** error occurs when the _manifest.json_ file is missing required data.

A **missingRequiredField** error occurs because of the following reasons:

* The _manifest.json_ is missing a "version" object.
* The _manifest.json_ is missing a "dwgLayers" object.

#### *Example scenario for missingRequiredField*

![Example of missingRequiredField](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix missingRequiredField*

To fix a **missingRequiredField** error, verify that the manifest contains all required properties. For a full list of required manifest object, see the [manifest section in the Drawing package requirements](drawing-requirements.md#manifest-file-requirements)  

### **missingManifest**

#### *Description for missingManifest*

The **missingManifest** error occurs when the _manifest.json_ file is missing from the ZIP archive.

The **missingManifest** error occurs because of one or more of the following reasons:

* The _manifest.json_ file is misspelled.
* The _manifest.json_ is missing.
* The _manifest.json_ is not inside the root directory of the ZIP archive.

#### *Example scenario for missingManifest*

![Example of missingManifest](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix missingManifest*

To fix a **missingManifest** error, confirm that the archive has a file named _manifest.json_ at the root level of the ZIP archive.

### **conflict**

#### *Description for conflict*

The **conflict** error occurs when the _manifest.json_ file contains conflicting information.

#### *Example scenario for conflict*

The Conversion service will return a **conflict** error  when more than one level is defined with the same level ordinal.

![Example of conflict](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix conflict*

To fix a **conflict** error, inspect your _manifest.json_ and remove any conflicting information.

### **invalidGeoreference**

#### *Description for invalidGeoreference*

The **invalidGeoreference** error occurs when a _manifest.json_ file contains an invalid georeference.

The **invalidGeoreference** error occurs because of one or more of the following reasons:

* The user is georeferencing a latitude or longitude value that is out of range.
* The user is georeferencing a rotation value that is out of range.

#### *Example scenario for invalidGeoreference*

![Example of invalidGeoreference](./media/drawing-conversion-error-codes/placeholder.png)
#### *How to fix invalidGeoreference*

To fix an **invalidGeoreference** error, verify that the georeferenced values are within range.

>[!IMPORTANT]
>In GeoJSON, the coordinates order is longitude and latitude. If you don't use the correct order, you may accidentally refer a latitude or longitude value that is out of range.

## Wall errors

### **wallError**

#### *Description for wallError*

The **wallError** error occurs when the Conversion service finds an error while attempting to create a wall feature.

#### *Example scenario for wallError*

The following image displays a wall feature that doesn't overlap any units.

![Example of Wall feature that doesn't overlap any units](./media/drawing-conversion-error-codes/placeholder.png)

#### *How to fix wallError*

To fix a **wallError** error, redraw the wall so that it overlaps at least one unit. Or, create a new unit that overlaps the wall.

## Vertical Penetration errors

### **verticalPenetrationError**

#### *Description for verticalPenetrationError*

The **verticalPenetrationError** error occurs when the Conversion service finds an error while creating a vertical penetration feature.

The **verticalPenetrationError** error occurs because of one or more of the following reasons:

* The Conversion service finds a vertical penetration area with no overlapping vertical penetration areas on any levels above or below it.
* The Conversion service finds a level that exists with two or more vertical penetration features on it that overlap this one.

#### *Example scenario for verticalPenetrationError*

![Example of verticalPenetrationError](./media/drawing-conversion-error-codes/placeholder.png)

#### How to fix verticalPenetrationError

To fix a **verticalPenetrationError** error, read about how to use a vertical penetration feature in the [Drawing package requirements](drawing-requirements.md) article.

## Next steps

> [!div class="nextstepaction"]
> [How to use Azure Maps Drawing error visualizer](azure-maps-drawing-errors-visualizer.md)

> [!div class="nextstepaction"]
> [Creator for indoor mapping](creator-for-indoor-maps.md)