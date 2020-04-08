---
title: Use Private Atlas to create indoor maps data | Microsoft Docs 
description: Learn how to render an indoor map into your web application using the Azure Maps Private Atlas.
author: anastasia-ms
ms.author: v-stharr
ms.date: 04/08/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Use Private Atlas to create indoor maps data

This tutorial shows you how to use the Azure Maps Private Atlas APIs. The Private Atlas lets you show indoor maps within your web application, and it provides you with the necessary functionalities to control your indoor maps data. In this tutorial, you learn how to use the Private Atlas APIs to:

> [!div class="checklist"]

> * Upload your indoor map DWG package
> * Convert your DWG package into map data
> * Create a data set from your map data
> * Create a tile set from the data in your data set
> * Query the Azure Maps WFS service to learn about your map features
> * Create a feature state set by using your map features and the data in your data set
> * Update your feature state set

## Prerequisites

To use the Azure Maps Private Atlas APIs:

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps)
2. [Enable Private Atlas](how-to-manage-private-atlas.md)
3. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
4. Check that your DWG package meets the [DWG package requirements](dwg-requirements.md) or use the [Sample DWG package](https://github.com/Azure-Samples/Azure-Maps-DWG-Package-Samples).

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Upload a DWG package

Begin by using the [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview) to upload your DWG package to Azure Maps resources. The API returns a status URL pointing to the uploaded package. You can use the status URL to check the upload status. Download the uploaded data. Or obtain the `udid` for the uploaded data. In this case, we want the `udid` to access the uploaded package. Follow the steps below to obtain the `udid`.

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **save**.

3. Select the **POST** HTTP method in the builder tab and enter the following URL to upload your DWG package to the Azure Maps service. For this request, and other requests mentioned in this article, replace `<Azure-Maps-Primary-Subscription-key>` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/mapData/upload?api-version=1.0&dataFormat=zip&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

4. In the **Headers** tab, specify a value for the `Content-Type` key. Our DWG package is a zipped folder, so use the `application/octet-stream` value. In the **Body** tab, select **binary**. Click on **Select File** and choose your DWG package.

     ![data-management](./media/tutorial-private-atlas-indoor-maps/specify-content-type.png)

5. Click the blue **Send** button and wait for the request to process. Once the request completes, go to the **Headers** tab of the response. Copy the status URL, it's the value for the **Location** key.

6. Obtain the `udid` for the package by making a **GET** HTTP request at the status URL. You'll need to append your primary subscription key to the URL for authentication.

7. When the **GET** HTTP request completes successfully, the response header will contain the `udid` for the uploaded DWG package. Copy the `udid`.

    ```json
    {
        "status": "Succeeded",
        "resourceLocation": "https://atlas.microsoft.com/mapData/metadata/<upload-udid>?api-version=1.0"
    }
    ```

## Convert a DWG package

keep the Postman application open. Now that your DWG package is uploaded, we'll use `udid` for the uploaded package to convert the package into map data.

1. Select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**.

2. Select the **POST** HTTP method in the builder tab and enter the following URL to convert your uploaded DWG package into map data. Use the `udid` for the uploaded package.

    ```http
    https://atlas.microsoft.com/conversion/convert?subscription-key=<Azure-Maps-Primary-Subscription-key>&api-version=1.0&udid=<upload-udid>&inputType=DWG
    ```

3. Click the **Send** button and wait for the request to process. Once the request completes, go to the **Headers** tab of the response, and look for the **Location** key. Copy the status URL for the conversion request.

4. Start a new **GET** HTTP method in the builder tab. Make a **GET** request at the status URL from the previous step and append your Azure Maps primary subscription key.

5. Once the request completes successfully, you'll see a success status message in the response body. Copy the `udid` for the converted package. It's also known as the conversion ID, and it's used by other APIs to access the converted map data.

    ![data-management](./media/tutorial-private-atlas-indoor-maps/conversion-data-udid-response.png)


> [!NOTE]
> The user interface of the Postman application is not perfectly synchronized with the API response. If you notice a long delay while making a **GET** request at the status URL, click the **send** button again. The request will be resent and you'll see the status at the time of clicking the button.

If you meet errors while you're converting your DWG package, see the [DWG conversion errors and warnings](dwg-conversion-error-codes.md). It provides recommendations on how to resolve conversion issues, with some examples. You may also use the [DWG error visualizer](azure-maps-dwg-errors-visualizer.md) to conveniently see the errors and warnings on your indoor map.

## Create a data set

The data set is a collection of map data entities, such as buildings. To make a data set, use the [Dataset Create API](https://docs.microsoft.com/rest/api/maps/dataset/createpreview). It takes a conversion ID for a DWG package, and it produces a set containing the map data. The steps below show you how to make a data set.

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Make a **POST** request to the [Dataset Create API](https://docs.microsoft.com/rest/api/maps/dataset/createpreview) to create a new data set. The URL of the request should have a format like the one below:

    ```http
    https://atlas.microsoft.com/dataset/create?api-version=1.0&conversionID=<conversion-udid>&type=facility&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

3. Obtain the status URL in the **Location** key of the response **Headers**.

4. Make a **GET** request at the status URL to obtain the data set ID. Append your Azure Maps primary subscription key for authentication.

5. Copy the `datasetId` in the response body.

    ![data-management](./media/tutorial-private-atlas-indoor-maps/dataset-ID.png)


Use the [Dataset List API](https://docs.microsoft.com/rest/api/maps/dataset/listpreview) to view details of the data sets in your Private Atlas. When you're done using a data set, you can remove it using the [Dataset Delete API](https://docs.microsoft.com/rest/api/maps/dataset/deletepreview).

Don't delete your data set yet. The next section shows you how to produce a tile set from the data in your data set.

> [!CAUTION]
> The Dataset Create API doesn't prevent you from appending duplicate data blobs into a data set.

## Create a tile set

A tile set is a set of vector tiles that render on the map. It's produced from the data in a data set, but it's an independent entity. In other words, if the data set is deleted, the tile set will continue to exist. To create a tile set, follow the steps below:

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Make a **POST** request in the builder tab. The request URL should look like to the one below:

    ```http
    https://atlas.microsoft.com/tileset/create/vector?api-version=1.0&datasetID=<dataset-udid>&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

3. Make a **GET** request at the status URL for the tile set. Append your Azure Maps primary subscription key for authentication.

4. Upon a successful request, you'll receive the tile set `udid` in the response body. It may also be referred to as the tile set ID.

    ![data-management](./media/tutorial-private-atlas-indoor-maps/tileset-udid.png)


To delete your tile set, use the [Tileset Delete API](https://docs.microsoft.com/rest/api/maps/tileset/deletepreview). If you delete an in-use tile set, then those tiles won't render on the map at the application runtime. Use the [Tileset List API](https://docs.microsoft.com/rest/api/maps/tileset/listpreview) to see all the tile sets in your Azure Maps Private Atlas.

## Query Azure Maps WFS APIs

Learn about your map features by calling the [WFS API](https://docs.microsoft.com/rest/api/maps/wfs). The steps below show you how to obtain a feature ID, we'll use this feature ID later to create a feature state set.

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Make a **GET** request to the [WFS API](https://docs.microsoft.com/rest/api/maps/wfs) to view a list of the collections in your data set. Replace `<dataset-udid>` with your data set ID, similarly use your Azure Maps primary key instead of the placeholder.

    ```http
    https://atlas.microsoft.com/wfs/datasets/<dataset-udid>/collections?subscription-key=<Azure-Maps-Primary-Subscription-key>&api-version=1.0
    ```

3. The response body will contain GeoJSON like the code shown below, which isn't fully shown for simplicity. You may click the links inside the `collections` element and subelements to learn more about the described feature.

    ```json
    {
    "collections": [
        {
            "name": "unit",
            "description": "A physical and non-overlapping area which might be occupied and traversed by a navigating agent. Can be a hallway, a room, a courtyard, etc. It is surrounded by physical obstruction (wall), unless the is_open_area attribute is equal to true, and one must add openings where the obstruction shouldn't be there. If is_open_area attribute is equal to true, all the sides are assumed open to the surroundings and walls are to be added where needed. Walls for open areas are represented as a line_element or area_element with is_obstruction equal to true.",
            "links": [
                {
                    "href": "https://atlas.microsoft.com/wfs/datasets/<dataset-udid>/collections/unit/definition?api-version=1.0",
                    "rel": "describedBy",
                    "title": "Metadata catalogue for unit"
                },
                {
                    "href": "https://atlas.microsoft.com/wfs/datasets/ab8a71e7-ea96-fff9-6cc4-c857b997d9df/collections/unit/items?api-version=1.0",
                    "rel": "data",
                    "title": "unit"
                }
            ]
        },
    ```

4. Make a **GET** request at a specific collection to learn about the features inside it. For example, to learn about features inside the `unit` collection, use the following URL:

    ```http
    https://atlas.microsoft.com/wfs/datasets/<dataset-udid>/collections/unit/items?subscription-key=<Azure-Maps-Primary-Subscription-key>&api-version=1.0
    ```

5. Familiarize yourself with your map features. Choose a feature that has style properties that can be dynamically modified. Copy its **ID**. For example, we'll copy the feature **ID** for a unit because the unit occupancy status and temperature can by dynamically updated.
  

    ![data-management](./media/tutorial-private-atlas-indoor-maps/feature-id.png)


We'll refer to the style properties of this feature as states, and we'll use the feature to make a state set.

## Create a feature state set

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Make a **POST** request to the [Create Stateset API](https://docs.microsoft.com/rest/api/maps/featurestate/createstatepreview). Use the data set ID of the data set that contains the state you want to modify. Here's how the URL should look like:

    ```http
    https://atlas.microsoft.com/featureState/stateset?api-version=1.0&datasetID=<dataset-udid>&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

3. In the **Headers** of the **POST** request, set `Content-Type` to `application/json`. In the **Body**, provide the styles that you want to dynamically update. For example, you may use the following configuration. When you're done, click **Send**.

    ```json
    {
       "styles":[
          {
             "keyname":"occupied",
             "type":"boolean",
             "rules":[
                {
                   "true":"#FF0000",
                   "false":"#00FF00"
                }
             ]
          },
          {
             "keyname":"temperature",
             "type":"number",
             "rules":[
                {
                   "range":{
                      "exclusiveMaximum":66
                   },
                   "color":"#00204e"
                },
                {
                   "range":{
                      "minimum":66,
                      "exclusiveMaximum":70
                   },
                   "color":"#0278da"
                },
                {
                   "range":{
                      "minimum":70,
                      "exclusiveMaximum":74
                   },
                   "color":"#187d1d"
                },
                {
                   "range":{
                      "minimum":74,
                      "exclusiveMaximum":78
                   },
                   "color":"#fef200"
                },
                {
                   "range":{
                      "minimum":78,
                      "exclusiveMaximum":82
                   },
                   "color":"#fe8c01"
                },
                {
                   "range":{
                      "minimum":82
                   },
                   "color":"#e71123"
                }
             ]
          }
       ]
    }
    ```

4. Copy the state set ID from the response body

5. Use the [Feature Update States API](https://docs.microsoft.com/rest/api/maps/featurestate/updatestatespreview) to update the state. Pass the state set ID, data set ID, and feature ID, with your Azure Maps subscription key. Here's the URL of a **POST** request to update the state:

    ```http
    https://atlas.microsoft.com/featureState/state?api-version=1.0&statesetID=<stateset-udid>&datasetID=<dataset-udid>&featureID=<feature-ID>&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

6. In the **Headers** of the **POST** request, set `Content-Type` to `application/json`. In the **body** of the **POST** request, write the JSON with the feature updates. The update will only be saved, if the time posted stamp is after the time stamp of the previous request. We can pass any keyname that we've previously configured during creation. Here's a sample JSON to update the occupancy status:

    ```json
    {
        "states": [
            {
                "keyName": "occupied",
                "value": true,
                "eventTimestamp": "2019-11-14T17:10:20"
            }
        ]
    }
    ```

7. Upon a successful update, you'll receive a `200 OK` HTTP status code. If you had [dynamic styling implemented](indoor-map-dynamic-styling.md) for an indoor map, then the update would reflect in your rendered map at the specified time stamp.

The [Feature Get States API](https://docs.microsoft.com/rest/api/maps/featurestate/getstatespreview) lets you learn about the state of a feature using its feature ID. You can also delete the state set and its resource using the [Feature State Delete API](https://docs.microsoft.com/rest/api/maps/featurestate/deletestatesetpreview).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]

> * Upload your indoor map DWG package
> * Convert your DWG package into map data
> * Create a data set from your map data
> * Create a tile set from the data in your data set
> * Query the Azure Maps WFS service to learn about your map features
> * Create a feature state set by using your map features and the data in your data set
> * Update your feature state set

You're now equipped with the skills you need to move on to the next guides: 

> [!div class="nextstepaction"]
> [Use the Indoor Maps module](how-to-use-indoor-module.md)

> [!div class="nextstepaction"]
> [Implement dynamic styling for indoor maps](indoor-map-dynamic-styling.md))

> [!div class="nextstepaction"]
> [Bulk import data to an existing data set](how-to-ingest-bulk-data-in-dataset.md)

> [!div class="nextstepaction"]
> [Use the Azure Maps QGIS Plug-in](azure-maps-qgis-plugin.md)

Learn more about the different Azure Maps services discussed in this article:

> [!div class="nextstepaction"]
> [Data Upload](private-atlas-for-indoor-maps.md#uploading-a-dwg-package)

> [!div class="nextstepaction"]
> [Data Conversion](private-atlas-for-indoor-maps.md#converting-a-dwg-package)

> [!div class="nextstepaction"]
> [Dataset](private-atlas-for-indoor-maps.md#datasets)

> [!div class="nextstepaction"]
> [Tileset](private-atlas-for-indoor-maps.md#tilesets)

> [!div class="nextstepaction"]
> [Feature State set](private-atlas-for-indoor-maps.md#feature-statesets)

> [!div class="nextstepaction"]
> [WFS service](private-atlas-for-indoor-maps.md#web-feature-services-api)

