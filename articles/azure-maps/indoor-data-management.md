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

In this concept article, we will walk through the workflow for managing your own private indoor maps in Private Atlas. We will cover the data processing pipeline from ingesting data into Azure Maps, curating and using the data in applications. Scenarios helping understand the inter-dependencies among the different Private Atlas resources are provided to help in administration tasks. The following table lists APIs that you can utilize at each step in the data processing pipeline.

| Ingestion  | Curation  | Utilization  |
|------------|-----------|--------|
| Data Upload API (Data service) | Create API (dataset service) | Get map tile (Render service)|
| DWG Conversion API | QIS plugin | Web Feature Servioe (WFS)|             
|                    | Tileset Create aPI (Tileset) | Feature State Service | 
|                    | Create stateset (feature state)

## Data Ingestion

The primary source of data for ingesting indoor map data is a DWG package that represents a facility. A detailed description of the packaging requirements is available **here**. The ingestion process covers the upload of the data in an Azure Maps account, data validation, and conversion to map format. The following steps elaborate the data ingestion process. 

  1. Upload the DWG package by calling the **Data Upload API**. Keep the udid for the uploaded data, as it will be used to run the next steps. 
  2. Validate and convert the uploaded DWG package by calling the **DWG Conversion API** and passing the udid retrieved in step 1. If the DWG package passed the validation process, a new udid is made available through the **status URI**. The udid can be used to add and index indoor map data during the data curation process. 

## Data Curation

Data curation is the process through which you can compile, index, and edit ingested indoor map data in a data set. The data curation process includes the following:  

### Data compilation
  
The **Dataset API** allows you to:

  *  Add and index one or more ingested indoor map data so that you can address scenarios with one facility as well as scenarios with multiple (for example, a campus).
  *  Add one or more ingested indoor map data into an existing dataset.
    
  > [!Note]
  > The user is responsible for defining and controlling what goes in the dataset, including avoiding duplicate data.

### Data editing

 In scenarios in which the ingested indoor data requires soft touches, when an update is due for an existing data set, you can utilize the QIS plug-in **link to docs when ready** to make the required updates.

The data curation process helps you get to the desired state in which all data required is included in the data set and is considered ready for use in applications. At this stage, you can finalize data curation process by creating the foundation for rendering and dynamic styling through: 

  * Creating a **tileset** for rendering the map in an application. A tile set can be created by calling the **Tileset create API**. The result of a successfully completed tile set creation call is a new `tilesetId` that will power rendering maps in applications. 
  * Creating a Feature **stateset** to support, for example, dynamic map styling. A state set can be created by calling the **Feature State Create stateset API**. The result of a successfully completed create state set call is a new `statesetId` that will power dynamic map rendering in applications and more. 


## Data Utilization

This section describes, how to utilize your indoor map data. The following services can be used to utilize indoor data:

  * **Render service:** Get Map tiles API v2 will provide you access to the indoor map tile set generated in the previous section. 

  * **Web Feature Service (WFS):** An OGC WFS 3 API Interface **add link** enables access to the indoor map data using the OGC concept of collection like units, query, and feature identifiers to enable access to data set features. **Link to API**. 

  * **Feature state service:** This service lets you update and fetch the status of a given feature included in the data set at the time of creation. A common use case is to leverage the latest known status of features, for example, occupancy status for meeting rooms, to dynamically render the map in web applications. **Link to feature state service**.


## Indoor Web SDK module

The indoor module of the Azure Maps web SDK, allows you to develop web applications using your indoor map data in combination, if desired, with other data sources and reference maps. For more information read **indoor module SDK doc** and **concept on dynamic styling**.


## Scenarios for data curation

A data set and tile set can be used by many applications in production. You may face scenarios where you will need to add a new facility to your existing data set. The **dataset Create API** allows you to append new data to an existing data set. The following work flow explains how to add new data to an existing dataset and generate a new tile set.

  1. Follow steps in the data ingestion section to upload and convert DWG for new data that you want to add to your existing data set.
  2. Use the **Dataset API** to add the converted data to your existing data set.
  3. Optionally curate the newly added facility data as necessary, following the steps in data curation section.
  4. Use the **Tileset create API** to generate a new tile set for the updated data.
  5. Update the tilesetId created in step 4 in your applications to enable the visualization of the updated dataset.


## Data Administration

As your data set and application continues to grow overtime, you may need to manage your data. For example, you may want to know how many tile sets for your data currently exist, or review their relevance and update/delete them as appropriate. Following is a list of API services with the endpoints designed to manage your data resources portfolio.

| Service | Endpoints |
|---------|-----------|
| Data    | List, Delete, Update |
| Tileset | List, Delete |
| Dataset | List, Delete | 
| FeatureState | Delete | 

When ever you review the list of items and decide to delete them, consider the cascading dependencies of those items that may be impacting Render, WFS, Feature State, and conversion tools API. For example, you may have a tile set being rendered in your application using the **Get Map Tile** API and deleting the tile set will result in failure to render that tile set.


