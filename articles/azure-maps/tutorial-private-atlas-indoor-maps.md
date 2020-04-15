---
title: Use Private Atlas to create indoor maps data | Microsoft Docs 
description: Learn how to render an indoor map into your web application using the Azure Maps Private Atlas.
author: anastasia-ms
ms.author: v-stharr
ms.date: 04/15/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Use Private Atlas to create indoor maps

This tutorial shows you how to use the Azure Maps Private Atlas API. Private Atlas lets you show indoor maps within your web application and  provides you with the necessary functionalities to control your indoor maps data. In this tutorial, you will learn how to use the API to:

> [!div class="checklist"]
> * Upload your indoor map Drawing package
> * Convert your Drawing package into map data
> * Create a dataset from your map data
> * Create a tileset from the data in your dataset
> * Query the Azure Maps WFS service to learn about your map features
> * Create a feature stateset by using your map features and the data in your dataset
> * Update your feature stateset

## Prerequisites

To create indoor maps with Private Atlas:

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps)
2. [Enable Private Atlas](how-to-manage-private-atlas.md)
3. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

A Sample Drawing Package is available [here]([Sample Drawing package](https://github.com/Azure-Samples/Azure-Maps-DWG-Package-Samples).

## Upload a Drawing package

Use the [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview) to upload the Drawing package to Azure Maps resources. The Data Upload API returns a `status URL` pointing to the uploaded package. You can use the `status URL` to check the upload status, download the uploaded package, or obtain the `udid` for the uploaded package. In this case, we will use the `udid` to access the uploaded package. Follow the steps below to obtain the `udid`.

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **POST** HTTP method in the builder tab and enter the following URL to upload the Drawing package to the Azure Maps service. For this request, and other requests mentioned in this article, replace `<Azure-Maps-Primary-Subscription-key>` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/mapData/upload?api-version=1.0&dataFormat=zip&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

4. In the **Headers** tab, specify a value for the `Content-Type` key. The Drawing package is a zipped folder, so use the `application/octet-stream` value. In the **Body** tab, select **binary**. Click on **Select File** and choose a Drawing package.

     ![data-management](./media/tutorial-private-atlas-indoor-maps/specify-content-type.png)

5. Click the blue **Send** button and wait for the request to process. Once the request completes, go to the **Headers** tab of the response. Copy the value of the **Location** key. This is the `status URL`.

6. To obtain the `udid` for the package, create a **GET** HTTP request on the `status URL`. You'll need to append your primary subscription key to the URL for authentication.

    ```http
    https://atlas.microsoft.com/mapData/operations/{uploadOperationStatusId}?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

7. When the **GET** HTTP request completes successfully, the response header will contain the `udid` for the uploaded Drawing package. Copy the `udid`. You can also copy the entire `resourceLocation` if you wish to retrieve metadata from this resource in the next step.

    ```json
    {
        "operationId": "{operationId}",
        "status": "Succeeded",
        "resourceLocation": "https://atlas.microsoft.com/mapData/metadata/<upload-udid>?api-version=1.0"
    }
    ```

8. Optionally, if you wish to retrieve content metadata, you can make another **GET** HTTP request on the `resourceLocation` URL you copied in step 7. The response body contains a unique `udid` for the uploaded content, the location to access/download the content in the future, and some other metadata about the content like created/updated date, size, etc. This looks something like:

     ```json
    {
        "udid": "{udid}",
        "location": "https://atlas.microsoft.com/mapData/{udid}?api-version=1.0",
        "created": "2020-02-03T02:32:25.0509366+00:00",
        "updated": "2020-02-11T06:12:13.0309351+00:00",
        "sizeInBytes": 766,
        "uploadStatus": "Completed"
    }
    ```

## Convert a Drawing package

 Now that the Drawing package is uploaded, we will use `udid` for the uploaded package to convert the package into map data.

1. Select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**.

2. Select the **POST** HTTP method in the builder tab and enter the following URL to convert your uploaded Drawing package into map data. Use the `udid` for the uploaded package.

    ```http
    https://atlas.microsoft.com/conversion/convert?subscription-key=<Azure-Maps-Primary-Subscription-key>&api-version=1.0&udid=<upload-udid>&inputType=DWG
    ```

3. Click the **Send** button and wait for the request to process. Once the request completes, go to the **Headers** tab of the response, and look for the **Location** key. Copy the value of the **Location** key. This is the `status URL` for the conversion request.

4. Start a new **GET** HTTP method in the builder tab. Append your Azure Maps primary subscription key to the `status URL`. Make a **GET** request at the `status URL` from the previous step.

5. Once the request completes successfully, you will see a success status message in the response body. Copy the `conversionId` for the converted package. The `conversionId` is used by other API to access the converted map data.

    ```json
    {
        "statusId": "25084fb7-307a-4720-8f91-7952a0b91012",
        "description" : "User provided description.",
        "conversionStatus": "Complete",
        "conversionResult": "Success",
        "packagingWarnings": [],
        "conversionWarnings": [],
        "packagingErrors": [],
        "conversionErrors": [],
        "conversionId": "9707f605-13a9-45e7-9f3d-1dbee79a5231"
    }
    ```

> [!NOTE]
> The Postman application does not natively support HTTP Long Running Requests. As a result, you may notice a long delay while making a **GET** request at the status URL.  Wait about thirty seconds and try clicking the **Send** button again. The request will be resent and the response will return a status message. For more information on how to make HTTP Long Running Requests, see [Private Atlas Long-Running Operation APIs](private-atlas-long-running-operation.md) and [Asynchronous Reply Patterns](https://docs.microsoft.com/azure/architecture/patterns/async-request-reply).

If you meet errors while you're converting your Drawing package, see the [Drawing conversion errors and warnings](drawing-conversion-error-codes.md). It provides recommendations on how to resolve conversion issues, with some examples. You may also use the [Drawing error visualizer](azure-maps-drawing-errors-visualizer.md) to conveniently see the errors and warnings on your indoor map.

## Create a dataset

The dataset is a collection of map data entities, such as buildings. To create a dataset, use the [Dataset Create API](https://docs.microsoft.com/rest/api/maps/dataset/createpreview). The Dataset Create API takes the `conversionId` for the converted Drawing package and returns a `datasetId` of the created dataset. The steps below show you how to create a dataset.

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Make a **POST** request to the [Dataset Create API](https://docs.microsoft.com/rest/api/maps/dataset/createpreview) to create a new dataset. Before submitting the request, append both your subscription key and the `conversionId` with the `conversionId` obtained during the Conversion process in step 5.  The request URL should look like the following:

    ```http
    https://atlas.microsoft.com/dataset/create?api-version=1.0&conversionID=<conversion-udid>&type=facility&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

3. Obtain the `statusURL` in the **Location** key of the response **Headers**.

4. Make a **GET** request at the `statusURL` to obtain the `datasetID`. Append your Azure Maps primary subscription key for authentication. The request URL should look like the following:

    ```http
    https://atlas.microsoft.com/dataset/operations/<operationsId>?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

5. When the **GET** HTTP request completes successfully, the response header will contain the `datasetId` for the created dataset. Copy the `datasetId`.

    ```json
    {
        "createdDateTime": "3/11/2020 8:45:13 PM +00:00",
        "status": "Succeeded",
        "resourceLocation": "https://atlas.microsoft.com/dataset/{datasetId}"
    }
    ```

## Create a tileset

A tileset is a set of vector tiles that render on the map. Tilesets are created from existing datasets, yet still remain independent from the dataset from which they were sourced. If the dataset is deleted, the tileset will continue to exist. To create a tileset, follow the steps below:

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Make a **POST** request in the builder tab. The request URL should look like the following:

    ```http
    https://atlas.microsoft.com/tileset/create/vector?api-version=1.0&datasetID=<dataset-udid>&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

3. Make a **GET** request at the `statusURL` for the tileset. Append your Azure Maps primary subscription key for authentication. The request URL should look like the following:

   ```http
    https://atlas.microsoft.com/tileset/operations/<operationsId>?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

4. When the **GET** HTTP request completes successfully, the response header will contain the `tilesetId` for the created dataset. Copy the `tilesetId`.

    ```json
    {
        "createdDateTime": "3/11/2020 8:45:13 PM +00:00",
        "status": "Succeeded",
        "resourceLocation": "https://atlas.microsoft.com/tileset/{tilesetId}"
    }
    ```

## Query datasets with WFS API
<!-- start here -->
 Datasets can be queried using  [WFS API](https://docs.microsoft.com/rest/api/maps/wfs). The steps below show you how retrieve all collections in a dataset, a specific collection, and a specific feature and feature **ID**  in a collection. Once you obtain the feature **ID**, you will use it to create a feature stateset in the next section of this tutorial.

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Make a **GET** request to view a list of the collections in your dataset. Replace `<dataset-udid>` with your `datasetID`. Use your Azure Maps primary key instead of the placeholder. The request URL should look like the following:

    ```http
    https://atlas.microsoft.com/wfs/datasets/<dataset-udid>/collections?subscription-key=<Azure-Maps-Primary-Subscription-key>&api-version=1.0
    ```

3. The response body will be delivered in GeoJSON format and will contain all collections in the dataset. For simplicity, the example here only shows the `unit` collection. To see an example that contains all collections, see [WFS Describe Collections API](https://docs.microsoft.com/rest/api/maps/wfs/describecollectionspreview). To learn more about any collection, you can click on any of the URLs inside the `link` element.

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

4. Make a **GET** request for the `unit` features.  Replace `<dataset-udid>` with your `datasetID`. Use your Azure Maps primary key instead of the placeholder. The response body will contain all the features of the `unit` collection. The request URL should look like the following:

    ```http
    https://atlas.microsoft.com/wfs/dataset/<dataset-udid>/collections/unit/items?subscription-key=<Azure-Maps-Primary-Subscription-key>&api-version=1.0
    ```

5. Copy the feature **ID** for a unit feature that has style properties that can be dynamically modified.  Because the unit occupancy status and temperature can be dynamically updated, we will use this feature **ID** in the next section in order to make a feature stateset.
  

    ![data-management](./media/tutorial-private-atlas-indoor-maps/feature-id.png)

## Create a feature stateset

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Make a **POST** request to the [Create Stateset API](https://docs.microsoft.com/rest/api/maps/featurestate/createstatepreview). Use the `datasetId` of the dataset that contains the state you want to modify. The request URL should look like the following:

    ```http
    https://atlas.microsoft.com/featureState/stateset?api-version=1.0&datasetID=<dataset-udid>&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

3. In the **Headers** of the **POST** request, set `Content-Type` to `application/json`. In the **Body**, provide the styles that you want to dynamically update. For example, you may use the following configuration to collect and style measurements on occupancy and temperature on features. When you're done, click **Send**.

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

4. Copy the `statesetID` from the response body

5. Create a **POST** request to update the state: Pass the stateset ID, datasetID, and featureID with your Azure Maps subscription key. The request URL should look like the following: 

    ```http
    https://atlas.microsoft.com/featureState/state?api-version=1.0&statesetID=<stateset-udid>&datasetID=<dataset-udid>&featureID=<feature-ID>&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

6. In the **Headers** of the **POST** request, set `Content-Type` to `application/json`. In the **body** of the **POST** request copy and paste the JSON in the sample below.

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

    >[!NOTE]
    > The update will only be saved if the time posted stamp is after the time stamp of the previous request. We can pass any keyname that we've previously configured during creation. 

7. Upon a successful update, you will receive a `200 OK` HTTP status code. If you have  [dynamic styling implemented](indoor-map-dynamic-styling.md) for an indoor map, the update will display in your rendered map at the specified time stamp.

The [Feature Get States API](https://docs.microsoft.com/rest/api/maps/featurestate/getstatespreview) allows you to retrieve the state of a feature using its feature ID. You can also delete the stateset and its resources by using the [Feature State Delete API](https://docs.microsoft.com/rest/api/maps/featurestate/deletestatesetpreview).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]

> * Upload your indoor map Drawing package
> * Convert your Drawing package into map data
> * Create a dataset from your map data
> * Create a tileset from the data in your dataset
> * Query the Azure Maps WFS service to learn about your map features
> * Create a feature stateset by using your map features and the data in your dataset
> * Update your feature stateset

You're now equipped with the skills you need to move on to the next guides: 

> [!div class="nextstepaction"]
> [Use the Indoor Maps module](how-to-use-indoor-module.md)

> [!div class="nextstepaction"]
> [Implement dynamic styling for indoor maps](indoor-map-dynamic-styling.md)

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

