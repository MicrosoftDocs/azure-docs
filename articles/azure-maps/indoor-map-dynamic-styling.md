---
title: Indoor map data management in Azure Maps.| Microsoft Docs 
description: Learn about data management for indoor Maps in Azure Maps
author: walsehgal
ms.author: v-musehg
ms.date: 10/18/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Indoor map data management

Private Atlas makes it possible to develop applications based on your private indoor map data using Azure Maps API and SDK. 

In this concept article, we will walk you through the workflow for managing your own indoor maps in Private Atlas. We will cover the data processing pipeline from ingesting data into Azure Maps, curating and using the data in applications and administering private atlas resources. The following diagram describes the end to end process.

<center>

![data-management](./media/indoor-data-management/data-management.png)</center>


## Data Ingestion

The primary data source for ingesting indoor map data is a DWG package that represents a facility. The DWG package contains a DWG file for each floor of the facility and a JSON document for storing additional metadata like space categorization and facility directory information. See DWG Package requirements document for a detailed description. 

The ingestion process utilizes the **Data Upload API** for uploading the DWG Package to an Azure Maps account, and **Conversion API** for DWG Package validation and conversion to validated blob. 


## Data Curation

The dataset is the primary resource available for compiling one or more facility data, editing and creating data products for specific use cases such as rendering. A dataset is a collection of map data entities. The **Dataset Create API** allows you to create datasets from validated blob, or append validated blob to existing datasets.

> [!Note]
> The Dataset Create API does not prevent from appending duplicate validated blob into a dataset.

### Accessing dataset features
  
Datasets can be queried using a Web Feature Service (WFS) API that follows the Open Geospatial Consortium [proposed standard for WFS version 3.0](http://docs.opengeospatial.org/DRAFTS/17-069.html). 

### Data editing

 When your map data requires soft touches, when an update is due for an existing dataset, you can utilize the Azure Maps plug-in for QGIS to make the required updates.


### Map rendering 

The **Tileset API** provides a means to generate grided vector tiles out of a given dataset which are optimized for map rendering. The **Get Map Tile API** can be used to access the tileset using, for example, the Web SDK Indoor module.

The **Feature State API** lets user store and retrieve dynamic properties/states of features in the dataset. These states get stored outside the dataset to enable users to store different versions if needed. The **Feature State API** supports dynamic styling scenarios in which the tileset features are expected to be rendered according to their state which is defined at runtime. The feature states stored in the stored feature stateset can be used to dynamically render the features in the tileset using the **Get Map State Tile API**. For example, meeting rooms in a facility can store “occupied” state and use it to decide the color of the room on the map control. A detailed description of how to make use of dynamic styling is available in **Implement dynamic styling for Private Atlas Indoor Maps**.


## Indoor web SDK module

The indoor module of the Azure Maps web SDK, allows you to develop web applications using your indoor map data in combination with other Azure Maps API. For more information read **indoor module SDK documentation** and **Implement dynamic styling for Private Atlas Indoor Maps**.


## Resource Administration

API to helping administer different Private Atlas resources are available. For example, you may want to know how many tilesets exist in your subscription, or review their relevance and update/delete them as appropriate. A List and Delete API is available in Data, Conversion, Dataset, Tileset and Feature State services.

> [!Note]
> Whenever you review the list of items and decide to delete them, consider the cascading dependencies impacting other API with runtime dependencies. For example, you may have a tileset being rendered in your application using the **Get Map Tile API** and deleting the tileset will result in failure to render that tileset.


### Example: adding a facility to an existing indoor map

A dataset and tileset can be used by many applications in production. You may face scenarios in which existing applications are expected to be extended to deal with additional facility data. For example, a campus facility map application is expected to be updated so that it also covers a new facility added to the campus. Assuming the new DWG Package is made available for the newly added facility, the following workflow explains how to achieve the goal.

  1. Follow steps in the data ingestion section to upload and convert the new DWG package.
  2. Use the **Dataset Create API** to append the validated blob to the existing campus dataset.
  3. Optionally edit the newly added facility data as necessary, using Azure Maps plug-in for QGIS.
  4. Use the **Tileset Create API** to generate a new tileset out of the updated campus dataset.
  5. Update the tilesetId created in step 4 in your application to enable the visualization of the updated campus dataset.