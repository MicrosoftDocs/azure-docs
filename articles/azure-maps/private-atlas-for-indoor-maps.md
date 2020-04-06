---
title: Private Atlas for indoor maps| Microsoft Azure Maps 
description: This article introduces concepts that apply to Private Atlas such as DWG package uploading and conversion, creating, updating and deleting indoor map data structures such as Datasets, Tilesets, and Feature Statesets.
author: anastasia-ms
ms.author: v-stharr
ms.date: 04/6/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---


# Private Atlas for indoor maps

Private Atlas makes it possible to develop applications based on indoor map data using Azure Maps API and SDK. This article introduces concepts that apply to Private Atlas such as DWG package uploading and conversion, as well as understanding and creating resources such as Datasets, Tilesets, and Feature Statesets. In addition, this article provides an overview of how modules or applications can use indoor map data for the purposes of querying, rendering, updating or deleting indoor map data, as well as providing suggestions for possible integration with Azure Map data and IoT services.

## Create Private Atlas
In order to use Private Atlas services, Private Atlas must be created in an Azure Maps account. For information on how to create Private Atlas in Azure Maps, see [Manage Private Atlas](tutorial-private-atlas-indoor-maps.md).

## DWG package requirements

Private Atlas collects indoor map data by converting a DWG package that represents a facility. The DWG package must contain the DWG files that were typically produced by means of CAD tools during the facility construction or remodeling phase of the facility.

In addition, the DWG package must contain a _manifest.json_ file that defines the DWG file names, layer names, and additional metadata to be included in the indoor map data. This metadata file is meant to provide you with an option for adding metadata not included in the CAD drawings.

The minimum set of data required in the DWG package is defined by the mandatory elements of the DWG package. However, depending on data availability and solution requirements, those mandatory elements can be expanded further to include, for example, space names, categories and zones. For information on DWG Package requirements, see [DWG Package requirements](dwg-requirements.md).

## Uploading a DWG package

DWG packages must be uploaded using the [Azure Maps Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview) into the Azure Maps account for which Private Atlas has been created . Any tool or developer framework capable of performing REST API calls can be used to call this, and any other, API.

Once the DWG package is successfully uploaded, the `udid` (user data identifier) returned by Data Upload API will be needed in order to call the [Azure Maps Conversion API](https://docs.microsoft.com/rest/api/maps/data/conversion). for converting the DWG Package into indoor map data.

## Converting a DWG package

Private Atlas offers the [Azure Maps Conversion API](https://docs.microsoft.com/rest/api/maps/data/conversion) to convert and validate an uploaded DWG package into indoor map data.  Validation issues are mainly classified into two types: errors and warnings. If any errors are detected, the conversion process fails. If either warnings are detected or neither warnings nor errors, the indoor map data is created and stored in Private Atlas.  To get more information on DWG Package errors and warnings, see [DWG package warnings and errors](dwg-conversion-error-codes.md).

If the DWG package fails to convert due to validation errors, you will have to fix the error or errors and re-upload the DWG package. 

To help inspect errors and warnings detected in DWG Packages, the Conversion API provides a means to download the [Azure Maps DWG Error Visualizer](azure-maps-dwg-errors-visualizer.md), a standalone web application for visualizing and inspecting DWG package conversion errors and warnings.

## Creating indoor maps

Private Atlas provides the [Dataset API](https://docs.microsoft.com/rest/api/maps/dataset/createpreview) which is used to create a Dataset from converted DWG package data. A single Dataset can contain any number of facilities and can be updated or removed at any time. In order for applications to render Datasets in a visual way, Private Atlas provides the [Tileset API](https://docs.microsoft.com/rest/api/maps/tileset/createpreview) which provides a vector based representation of a Dataset and so allows applications to present visual tile-based views of the indoor map data. Through the [Feature State API](https://docs.microsoft.com/rest/api/maps/featurestate), Datasets can further be augmented to support dynamic map styling which allows map applications using Tilesets to reflect real time events on spaces provided by IoT systems.

### Datasets

A Dataset is a collection of indoor map features that represents facilities as defined in the converted DWG package. After creating a Dataset with the [Dataset Create API](https://docs.microsoft.com/rest/api/maps/dataset/createpreview) developers can create any number of [Tilesets](#tilesets) or [Feature Statesets](#feature-statesets). Tilesets are used to create a set of vector tiles that applications can use to render a Dataset. Feature Statesets allow Tileset rendering applications to reflect events that affect changes in the facilities represented in the Dataset.

The Dataset Create API allows developers, at any time, to add new facilities to an existing Dataset by uploading and converting new DWG packages. For more information on how to update an existing Dataset, see the append options in [Dataset Create API](https://docs.microsoft.com/rest/api/maps/dataset/createpreview). See also [Updating a Dataset](#updating-a-dataset).

Developers are also able to query a Dataset using the [Azure Maps WFS Service](#web-feature-services-api),  

In some cases, the developer would like to add additional data on top of floor plans such as furniture, equipment or other features.  The [Dataset Import API]() provides a means to add those indoor data features by implementing a widely used GeoJSON format for feature collection data. See [Dataset Import API]() for more details.

### Tilesets

A Tileset is a collection of vector data that represents a set of uniform grid tiles optimized for map rendering at preset zoom levels.  Developers can use the [Tileset Create API](https://docs.microsoft.com/rest/api/maps/tileset/createpreview) to create Tilesets from any Dataset that is deemed ready for map visualization scenarios.

A Tileset is independent of the Dataset from which it was created. This means that Tilesets are not affected by any of the changes applied to the source Dataset. It also means that if you delete a Tileset, it will not delete the Dataset. Furthermore, developers can create multiple Tilesets from the same Dataset in order to reflect different content stages. For example a developer can create a Tileset with and without furniture and equipment, or with and without the most recent data updates.

Once a Tileset has been created, it can be retrieved by the [Render V2 - Get Map Tile API](https://docs.microsoft.com/rest/api/maps/renderv2/getmaptilepreview) using Azure Maps SDK or any third party applications that have been created to consume and render the Tileset.

If a Tileset becomes outdated and is therefore no longer useful, you can delete the Tileset. See the [Data Maintenance](#data-maintenance) section for more details on how to list and delete Tilesets.

Developers can write third-party applications that use existing Tilesets. The Tileset API allows for the efficient governance and distribution of Tilesets and respective metadata. For example, in order to ensure that all applications use the most recent Tileset, the Tileset API can be configured to always return that most recent Tileset. In addition, during Tileset creation, additional metadata is generated which is useful for rendering Tilesets in applications. For example, the metadata stores a bounding box defining the geographic extent the Tileset covers. The bounding box coordinates allow an application to programmatically set the correct center point for rendering. Also, the metadata contains a min and max zoom level for the Tileset. For more details about Tileset metadata, see [Tileset List API](https://docs.microsoft.com/rest/api/maps/tileset/listpreview).

### Feature Statesets

The [Feature State API](https://docs.microsoft.com/rest/api/maps/featurestate/featurestate) is designed for defining, retrieving, and updating dynamic properties (*states*) of features, such as rooms or equipment, defined in a Dataset.  

The [Feature State Create API](https://docs.microsoft.com/rest/api/maps/featurestate/createstatesetpreview) allows developers to create a Feature Stateset on a Dataset. The Stateset contains any number of the *states* or key name/value pairs and their respective map styles. Each feature, such as a room, can have any number of *states* attached to it, such as temperature, occupancy, or availability. Based on the Feature Stateset, an application is able to dynamically render features in a facility according to their current *state*. 

The value of each *state* in a Stateset can be updated or retrieved by IoT devices or applications.  For example, using the [Feature State Update API](https://docs.microsoft.com/rest/api/maps/featurestate/updatestatespreview), a temperature measuring device can post a temperature change in a room that is in a facility represented in a Dataset. An application interested in that particular *state* change would get the *state* change and would update the user interface by changing the color of the room affected by the temperature.

It is important to note that when a Feature State update is posted to Azure Maps, the *state* value for the given feature gets updated only if the provided state's timestamp is later than the respective stored timestamp.

Like Tilesets, changing a Dataset does not affect the existing Feature Stateset and deleting a Feature Stateset will have no effect on the Dataset to which it is attached.

For more information on how Feature Statesets are used to dynamically broadcast state changes, see the [Render V2 API](#render-v2-api) section below.

## Using indoor maps

### Render V2 API

The [Render V2 - Get Map Tile API](https://docs.microsoft.com/rest/api/maps/renderv2/getmaptilepreview) has been extended to not only support Azure Maps provided maps,but also Private Atlas Tilesets. Developers can now use the same API and skill set to develop applications in order to make use of all maps in Azure Maps. 

For scenarios in which you make use of Feature Stateset for tracking IoT and third-party systems sharing live data related to indoor spaces, Render V2 API provide a means to broadcast and dynamically update maps. The Get Map State Tile API is responsible for broadcasting updates to all running applications configured to support dynamic map styling.  For a step-by-step walk-through on how to implement Feature Stateset dynamic styling in an application, see [Indoor Map Dynamic Styling](indoor-map-dynamic-styling.md).

### Web Feature Services API

Datasets can be queried using the [Web Feature Service (WFS) API](https://docs.microsoft.com/rest/api/maps/wfs). WFS follows the Open Geospatial Consortium API Features standard. The WFS API is helpful when there is a need to query features within the Dataset itself. For example, you would use WFS to find all mid-size meeting rooms of a given facility and floor level.  

### Indoor Web SDK Module

The [Azure Maps Web SDK](https://docs.microsoft.com/azure/azure-maps/) includes the Indoor Maps Module. This module offers extended functionalities to the Azure Maps *Map Control* library. It conveniently renders indoor maps created in Private Atlas, and it integrates indoor specific widgets such as floor picker which helps users to visualize the different floors.

In addition, the Indoor Maps Module allows developers to create web applications using indoor map data together with other Azure Map data services. The most common application setups could include enabling indoor map visualization and adding knowledge from other maps such as road, imagery, weather and transit to help put indoor in context and provide a more informed map to users.

For more information, see the [Indoor Maps Module]()documentation. Too see how to implement the Indoor Maps Module with Feature Stateset dynamic styling, see [How to Use the Indoor Map Module](how-to-use-indoor-module.md).  

### Azure Maps integration

As you begin to develop solutions for indoor maps, more can be done by leveraging existing Azure Maps capabilities. For example, asset tracking or safety scenarios can be implemented by combining Azure Maps geofencing and other spatial calculations with a indoor positioning technology. The [Azure Maps Geofence API](tutorial-geofence.md) is designed to work with user provided data, hence ready to support automated processing and logic based on whether an asset or a worker, enters or leaves specific indoor areas. An example of how to connect Azure Maps with IoT telemetry is available here.

### Data Maintenance

 Private Atlas allows you to list and delete your Datasets, Tilesets, and Feature Statesets by means of the List and Delete APIs. For example, you may want to know how many Tilesets exist in your subscription in order to review their relevance and update/delete them as appropriate.

>[!NOTE]
>Whenever you review a list of items and decide to delete them, you must consider the impact of that deletion on all dependent API or applications. For example, if you should delete a Tileset that is currently being used by an application by means of the [Render V2 - Get Map Tile API](https://docs.microsoft.com/rest/api/maps/renderv2/getmaptilepreview), deleting that Tileset would result in an application failure to render that Tileset.

### Example: Updating a Dataset

If you wish to add a new facility to a Dataset and Tileset that is currently in production and consumed by an application or applications, you can update the Dataset by uploading and converting a new DWG package that contains the new facility data. Once the package has been successfully uploaded and converted, you can then simply update the current Dataset by calling the Dataset Create API. You then would generate a new Tileset from the updated Dataset and update the application with the new tilesetid. The entire process is outlined in the following steps.

1. Follow steps in the [Uploading a DWG Package](#uploading-a-dwg-package)] and [Converting a DWG Package](#converting-a-dwg-package) sections to upload and convert the new DWG package.

2. Use the Dataset Create API to append the converted data to the existing campus Dataset.

3. Use the Tileset Create API to generate a new Tileset out of the updated campus Dataset. Save the new tilesetId for step 4.

4. Update the tilesetId in your application to enable the visualization of the updated campus Dataset. If you have no control over the application, you can use the Alias API to configure the newly created Tilest as a replacement of the old Tileset. Optionally, you can now delete the old Tileset if it is no longer in use.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Creating a Private Atlas indoor map](tutorial-private-atlas-indoor-maps.md)
