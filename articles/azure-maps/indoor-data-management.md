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

The QGIS application provides the Private Atlas tool, and Azure Maps provides the Indoor Maps SDK, which has a plug-in for the QGIS application. The plug-in and the Private Atlas can be used together to develop indoor maps for your application. In addition to the plug-in, Azure Maps Indoor Maps SDK provides REST APIs to processes your data set. The goal of this article is to provide an overview of the data management pipeline, starting with data ingestion into Azure Maps, and ending with resource administration in Private Atlas.

## Prerequisites

You need to [obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account) by [making an Azure account](quick-demo-map-app.md#create-an-account-with-azure-maps). The primary subscription key is a required parameter for the Azure Maps APIs. In this article, we'll use the Postman application to make calls to the Azure Maps APIs. You may [install Postman](https://www.postman.com/), or use any API development environment of your choice.

## Data Ingestion

The first step in the data ingestion stage is to upload your DWG package using the [Data Upload API](). Before you upload your package, make sure that it adhere to the [DWG package requirements](dwg-requirements.md). The [Data Upload API]() consumes a DWG package, and it returns a resource location pointing to the uploaded package. Once the package is uploaded, you can use the returned resource to obtain the id of the uploaded package. Use the package id as inputs to the [Conversion API](). The Conversion API find the uploaded DWG package and validates the package against the [DWG package requirements](dwg-requirements.md). If the package meets the requirements, it's converted from design data to map data. Then, an id is returned for the resource of the converted data. Obtaining the id of the converted data conclude the ingestion processes, and the map data is ready to be used by other APIs. If the package doesn't meet the requirements, the [Conversion API]() will return error codes. If you happen to have errors, then see [Conversion API error codes]() for details.

### Data upload process

Follow the processes below to upload your DWG design package:

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **save**.

3. Select the **POST** HTTP method in the builder tab and enter the following URL to upload your DWG package to the Azure Maps service. For this request, and other requests mentioned in this article, replace `<Azure-Maps-Primary-Subscription-key>` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/mapData/upload?api-version=1.0&dataFormat=zip&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

4. In the **Headers** tab, specify a value for the `Content-Type` key, as in the image below. In this case, our DWG package type is `application/octet-stream`. In the **Body** tab, select **binary**. Click on **Upload a File** and select your DWG package.

    <center>

    ![data-management](./media/indoor-data-management/specify-content-type.png)

    </center>

5. Click the blue **Send** button, and wait for the request to process. Once the request completes, go to the **Headers** tab for the response, and copy the **Location** URL value. This value points to the Azure Maps resource that contains the DWG package, and it looks like this:

    ```http
    https://atlas.microsoft.com/mapData/<unique-alphanumeric-value>/status?api-version=1.0
    ```

6. Obtain the package id, or the package `udid`, by making a **GET** HTTP request at the **Location** URL. You'll need to append your primary subscription key to the URL, as seen below:

    ```http
    https://atlas.microsoft.com/mapData/<unique-alphanumeric-value>/status?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

7. When the **GET** HTTP request completes successfully, the response header will contain the `udid` of the uploaded DWG package. Copy the `udid`, it's highlighted in this image. 

    <center>

    ![data-management](./media/indoor-data-management/upload-data-udid.png)

    </center>

### Data conversion process

keep the Postman application open. Now that your DWG package is uploaded, we'll use the package id, or the package `udid`, from the previous section to convert the DWG package into map data.

1. Select **New** again. In the **Create New** window, select **Request**. Enter a **Request name**, and select a collection. Click **Save**.

2. Select the **POST** HTTP method in the builder tab and enter the following URL to convert your uploaded DWG package into map data. Use the `udid` of the uploaded DWG package.

    ```http
    https://atlas.microsoft.com/conversion/convert?subscription-key=<Azure-Maps-Primary-Subscription-key>&api-version=1.0&udid=<alphanumeric-value-upload-udid>&inputType=DWG
    ```

3. When the request completes, you'll receive a response header containing a **Location** key. The **Location** key returned by the conversion API holds the URL of the converted map data. Copy the location URL, it would have a similar format as the URL below:

    ```http
    https://atlas.microsoft.com/conversion/<unique-alphanumeric-value>/status?api-version=1.0
    ```

4. Start a new **GET** HTTP method in the builder tab. Make a **GET** request at the location URL from the previous step, and append your Azure Maps primary subscription key.

    ```http
    https://atlas.microsoft.com/conversion/<unique-alphanumeric-value>/status?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

5. Once the request completes successfully, you'll see a success status message in the response body. Go to the **Headers** response tab, and copy the `udid` for the converted map data. We'll use this conversion id in the data curation stage.

    <center>

    ![data-management](./media/indoor-data-management/conversion-data-udid.png)

    </center>

## Data Curation

In the data curation stage, the map data is maintained and managed per your application goals. There are three set of APIs that will regularly be used, at this stage, along with the [Azure Maps plug-in for the QGIS application](azure-maps-qgis-plugin.md). These three set of APIs are the data set APIs, tile set APIs, and state set APIs. A data set is the primary resource for compiling one or more facility data. A tile set is a set of grided vector tiles. And, a state set contains state information for the dynamic map styles. The til set and the state set use data from the data set. Thus, you would first generate a data set, and then use the data set to generate tile and state sets. The tile and the state sets are used for various uses cases, such as, indoor map rendering.

Before you delete a set of either data, tiles, or states, consider the cascading dependencies impact at runtime. For instance, if you delete a tile set that's used for indoor map rendering, then the vector tiles won't render in the application.

The next sections detail the processes to generate each of the three described sets. Although the sections overview only a few APIs, for each set of APIs, the general concept apply to all APIs. You can also use the Azure Maps QGIS plug-in to manipulate the sets, but you would still need to obtain the set ids by making API calls.

------------------------temp start
A common use case involve generating tile sets from data sets. The [Tileset Create API]() takes the data set id and generates a tile set. It would also assign an id for the generated tile set. The tile set contains grided vector tiles for the indoor map of the DWG design. The [Get Map Tile API]() fetches tile sets, and those tile sets can be used in many scenarios, such as indoor map rendering. The [Tileset Delete API]() accesses an existing tile set and removes it. 

Similar to the tile set, the state set can apply to various use cases. The [Create Stateset API]() produces a state set, which stores the styling state for the dynamic map features. It would also generate a state set id for a newly created state set. You can delete, get, and update the state set using the [Delete Stateset API](), [Get Stateset API](), [Update States API](), respectively.

Essentially, you would maintain your data using the data set APIs. You would use the tile set APIs and the feature set APIs to develop the use cases of your application. You can use the indoor maps QGIS plug-in to make modification to your data set, tile set, and feature set. However, you need the id of the set to make the necessary modification. The next sections outline how to general process to access and manipulate each of these sets.

------------------------temp end

### Data set

The [Dataset Create API]() takes a conversion id of a DWG package, and produces one or more data sets. Then, it assigns a unique data set Id for the newly generated set. Recall, that the data set is a collection of map data entities. Map data entities can be buildings, and developers may want to merge one or more buildings' data in one application. As a result, the [Dataset Create API]() lets developers append duplicates of validated blobs into a data set.

Let's make a new data set using the [Dataset Create API]() and the conversion id of our DWG package.

1. Open the Postman application, and make a **POST** request to the [Dataset Create API]() to create a new data set. The URL of the request should have a format like the one below:

    ```http
    https://atlas.microsoft.com/dataset/create?api-version=1.0&conversionId=<your-dwg-package-conversion-id>=facility&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

2. Obtain the URL in the **Location** key of the response **Headers** tab. 

    <center>

    ![data-management](./media/indoor-data-management/dataset-udid.png)

    </center>

3. Make a **GET** request at the URL to Obtain the id of the data set at that URL. As usually, append your Azure Maps primary subscription key.

    ```http
    https://atlas.microsoft.com/dataset/<a-unique-alphanumeric-value>/status?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

4. The request call returns the `datasetId` in the response body. Copy the data set id.

    <center>

    ![data-management](./media/indoor-data-management/dataset-id.png)

    </center>

Now that you've obtained the data set id, you may edit the data set [using the Azure Maps QGIS plug-in](azure-maps-qgis-plugin.md). You may also use the data set to generate a tile set and state set. At any time in the development phase, you may use the [Dataset List API]() to the details of the data sets you generated. When you're done using a set, you can remove its resources using the [Dataset Delete API]().

### Tile set

### State set

### Accessing dataset features
  
Datasets can be queried using a Web Feature Service (WFS) API that follows the Open Geospatial Consortium [proposed standard for WFS version 3.0](http://docs.opengeospatial.org/DRAFTS/17-069.html). 

### Data editing

 When your map data requires soft touches, when an update is due for an existing dataset, you can utilize the Azure Maps plug-in for QGIS to make the required updates.

### Map rendering 

The **Tileset API** provides a means to generate grided vector tiles out of a given dataset which are optimized for map rendering. The **Get Map Tile API** can be used to access the tileset using, for example, the Web SDK Indoor module.

The **Feature State API** lets user store and retrieve dynamic properties/states of features in the dataset. These states get stored outside the dataset to enable users to store different versions if needed. The **Feature State API** supports dynamic styling scenarios in which the tileset features are expected to be rendered according to their state which is defined at runtime. The feature states stored in the stored feature stateset can be used to dynamically render the features in the tileset using the **Get Map State Tile API**. For example, meeting rooms in a facility can store �occupied� state and use it to decide the color of the room on the map control. A detailed description of how to make use of dynamic styling is available in **Implement dynamic styling for Private Atlas Indoor Maps**.


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


    <center>

![data-management](./media/indoor-data-management/data-management.png)

    </center>


> [!Note]
> The Dataset Create API does not prevent from appending duplicate validated blob into a dataset.