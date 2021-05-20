---
title: 'Tutorial: Use Microsoft Azure Maps Creator to create indoor maps'
description: Tutorial on how to use Microsoft Azure Maps Creator to create indoor maps
author: anastasia-ms
ms.author: v-stharr
ms.date: 5/19/2021
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Tutorial: Use Creator to create indoor maps

This tutorial describes how to create indoor maps. In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Upload your indoor map Drawing package
> * Convert your Drawing package into map data
> * Create a dataset from your map data
> * Create a tileset from the data in your dataset
> * Query the Azure Maps Web Feature Service (WFS) API to learn about your map features
> * Create a feature stateset by using your map features and the data in your dataset
> * Update your feature stateset

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
3. [Create a Creator resource](how-to-manage-creator.md)
4. Download the [Sample Drawing package](https://github.com/Azure-Samples/am-creator-indoor-data-examples/blob/master/Sample%20-%20Contoso%20Drawing%20Package.zip).

This tutorial uses the [Postman](https://www.postman.com/) application, but you may use a different API development environment.

>[!IMPORTANT]
> This tutorial uses the `us.atlas.microsoft.com` geographical URL. If your Creator service was created in a location outside the United States,  you must use a different geographical URL.  For more information, see [Access to Creator Services](how-to-manage-creator.md#access-to-creator-services). To view mappings of region to geographical location, [see Creator service geographic scope](creator-geographic-scope.md).

## Upload a Drawing package

Use the [Data Upload API](/rest/api/maps/data/uploadpreview) to upload the Drawing package to Azure Maps resources.

The Data Upload API is a long running transaction that implements the pattern defined in [Creator Long-Running Operation API V2](creator-long-running-operation-v2.md).

To upload the Drawing package:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **Collection**.

3. Select **New** again.

4. In the **Create New** window, select **Request**.

5. Enter a **Request name** for the request, such as *POST Data Upload*.

6. Select the collection you previously created, and then select **Save**.

7. Select the **POST** HTTP method.

8. Enter the following URL to the [Data Upload API](/en-us/rest/api/maps/data/uploadpreview):

    ```http
    https://us.atlas.microsoft.com/mapData?api-version=2.0&dataFormat=zip&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

    >[!Important]
    >For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

9. Select the **Headers** tab.

10. In the **KEY** field, select `Content-Type`. In the **VALUE** field select `application/octet-stream`.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/data-upload-header.png"alt-text="Header tab information for Data Upload.":::

11. Select the **Body** tab.

12. In the dropdown list, select **binary**.

13. Select **Select File** and choose a Drawing package.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-upload-body.png" alt-text="Select a drawing package.":::

14. Select **Send**. Allow the request to process. Once the request completes, proceed to the next step.

15. Select the **Headers** tab in the response window. Copy the value of the **Operation-Location** key, which is the `status URL`. We'll use the `status URL` to check the status of the Drawing package upload.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/data-upload-response-header.png" alt-text="Copy the status URl in the Location key.":::

### Check Drawing package upload status

To check the status of the drawing package and retrieve its unique ID (`udid`):

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *GET Data Upload Status*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **GET** HTTP method.

6. Enter the `status URL` you copied in [Upload a Drawing package](#upload-a-drawing-package). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key):

    ```http
    https://us.atlas.microsoft.com/mapData/operations/<operationId>?api-version=2.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

7. Select **Send**.

8. When the request completes successfully, select the **Headers** tab in the response window. Copy the value of the **Resource-Location** key, which is the `resource location URL`.  The `resource location URL` contains the unique identifier (`udid`) of the drawing package resource. 

    :::image type="content" source="./media/tutorial-creator-indoor-maps/resource-location-url.png" alt-text="Copy the resource location URL.":::

### (Optional) Retrieve Drawing package metadata

You can retrieve metadata from the Drawing package resource. The metadata contains information such as the resource location URL, creation date, updated date, size, and upload status.

To retrieve content metadata:

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *GET Data Upload Status*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **GET** HTTP method.

6. Enter the `resource Location URL` you copied in [Check Drawing package upload status](#check-drawing-package-upload-status). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key):

    ```http
   https://us.atlas.microsoft.com/mapData/metadata/{udid}?api-version=2.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

7. Select **Send**

8. When the request completes successfully, select the **Headers** tab in the response window. The metadata should like the following JSON fragment:

    ```json
    {
        "udid": "{udid}",
        "location": "https://us.atlas.microsoft.com/mapData/6ebf1ae1-2a66-760b-e28c-b9381fcff335?api-version=2.0",
        "created": "5/18/2021 8:10:32 PM +00:00",
        "updated": "5/18/2021 8:10:37 PM +00:00",
        "sizeInBytes": 946901,
        "uploadStatus": "Completed"
    }
    ```

## Convert a Drawing package

 Now that the Drawing package is uploaded, we'll use the `udid` for the uploaded package to convert the package into map data. The Conversion API uses a long running transaction that implements the pattern defined [here](creator-long-running-operation-v2.md).

To convert a drawing package:

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *POST Convert Drawing Package*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **POST** HTTP method.

6. Enter the following URL to the [Conversion Service](/en-us/rest/api/maps/v2/conversion/convertpreview) (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key and `udid` with the `udid` of the uploaded package):

    ```http
    https://us.atlas.microsoft.com/conversions?subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=2.0&udid={udid}&inputType=DWG&outputOntology=facility-2.0
    ```

7. Select **Send**. Allow the request to process. Once the request completes, proceed to the next step.

8. Select the **Headers** tab in the response window. Copy the value of the **Operation-Location** key, which is the `status URL`. We'll use the `status URL` to check the status of the conversion.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-convert-location-url.png" border="true" alt-text="Copy the value of the location key for drawing package":::

### Check Drawing package conversion status

When the conversion operation completes, it returns a `conversionId`. We can access the `conversionId` by checking the status of the Drawing package conversion process. The `conversionId` can then be used to access the converted data.

To check the status of the conversion process and retrieve the `conversionId`:

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *GET Conversion Status*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **GET** HTTP method:

6. Enter the `status URL` you copied in [Convert a Drawing package](#convert-a-drawing-package). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key):

    ```http
    https://us.atlas.microsoft.com/conversions/operations/<operationId>?api-version=2.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

7. Select **Send**.

8. When the request completes successfully, select the **Headers** tab in the response window. Copy the value of the **Resource-Location** key, which is the `resource location URL`.   The `resource location URL` contains the unique identifier (`conversionId`), which can be used by other APIs to access the converted map data.

      :::image type="content" source="./media/tutorial-creator-indoor-maps/data-conversion-id.png" alt-text="Copy the conversion id.":::

The sample Drawing package should be converted without errors or warnings. However, if you receive errors or warnings from your own Drawing package, the JSON response gives you a link to the [Drawing error visualizer](drawing-error-visualizer.md). The Drawing Error visualizer allows you to inspect the details of errors and warnings. To receive recommendations on how to resolve conversion errors and warnings, see [Drawing conversion errors and warnings](drawing-conversion-error-codes.md).

The following JSON displays a sample conversion warning:

```json
{
    "operationId": "<operationId>",
    "created": "2021-05-19T18:24:28.7922905+00:00",
    "status": "Succeeded",
     "warning": {
        "code": "dwgConversionProblem",
        "details": [
            {
                "code": "warning",
                "details": [
                    {
                        "code": "manifestWarning",
                        "message": "Ignoring unexpected JSON property: unitProperties[0].nonWheelchairAccessible with value False"
                    }
                ]
            }
        ]
    },
    "properties": {
        "diagnosticPackageLocation": "https://atlas.microsoft.com/mapData/ce61c3c1-faa8-75b7-349f-d863f6523748?api-version=1.0"
    }
}
```

## Create a dataset

A dataset is a collection of map features, such as buildings, levels, and rooms. To create a dataset, use the [Dataset Create API](/rest/api/maps/v2/dataset/createpreview). The dataset Create API takes the `conversionId` for the converted Drawing package and returns a `datasetId` of the created dataset.

To create a dataset:

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *POST Dataset Create*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **POST** HTTP method.

6. Enter the following URL to the [Dataset API](/rest/api/maps/v2/dataset/createpreview). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key), and `{conversionId`} with the `conversionId` obtained in [Check Drawing package conversion status](#check-drawing-package-conversion-status):

    ```http
    https://us.atlas.microsoft.com/datasets?api-version=2.0&conversionId={conversionId}&type=facility&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

7. Select **Send**.

8. Select the **Headers** tab in the response window. Copy the value of the **Operation-Location** key, which is the `status URL`. We'll use the `status URL` to check the status of the dataset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-dataset-location-url.png" border="true" alt-text="Copy the value of the location key for dataset":::

### Check dataset creation status

To check the status of the dataset creation process and retrieve the `datasetId`:

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *GET Dataset Status*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **GET** HTTP method.

6. Enter the `status URL` you copied in [Create a dataset](#create-a-dataset). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key):

    ```http
    https://us.atlas.microsoft.com/datasets/operations/<operationId>?api-version=2.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

7. Select **Send**.

8. When the request completes successfully, select the **Headers** tab in the response window. The the value of the **Resource-Location** key is the `resource location URL`.  The `resource location URL` contains the unique identifier (`datasetId`) of the dataset. Copy the `datasetId`, as you'll need it in the next sections of this tutorial.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/dataset-id.png" alt-text="Copy the dataset id":::

## Create a tileset

A tileset is a set of vector tiles that render on the map. Tilesets are created from existing datasets. However, a tileset is independent from the dataset from which it was sourced. If the dataset is deleted, the tileset will continue to exist.

To create a tileset:

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *POST Tileset Create*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **POST** HTTP method.

6. Enter the following URL to the [Tileset API](/rest/api/maps/v2/tileset/createpreview). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key), and `{datasetId`} with the `datasetId` obtained in [Check dataset creation status](#check-dataset-creation-status):

    ```http
    https://us.atlas.microsoft.com/tilesets?api-version=2.0&datasetID={datasetId}&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

7. Select **Send**.

8. Select the **Headers** tab in the response window. Copy the value of the **Operation-Location** key, which is the `status URL`. We'll use the `status URL` to check the status of the tileset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-tileset-location-url.png" border="true" alt-text="Copy the value of the tileset status url":::

### Check tileset creation status

To check the status of the dataset creation process and retrieve the `tilesetId`:

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *GET Tileset Status*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **GET** HTTP method.

6. Enter the `status URL` you copied in [Create a tileset](#create-a-tileset). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key):

    ```http
    https://us.atlas.microsoft.com/tilesets/operations/<operationId>?api-version=2.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

7. Select **Send**.

8. When the request completes successfully, select the **Headers** tab in the response window. The the value of the **Resource-Location** key is the `resource location URL`.  The `resource location URL` contains the unique identifier (`tilesetId`) of the dataset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/tileset-id.png" alt-text="Copy the tileset id":::

## Query datasets with WFS API

 Datasets can be queried using [WFS API](/rest/api/maps/v2/wfs). With the WFS API you can query for all feature collections or a specific collection. In this section of the tutorial, we'll do both. First we'll query all collections, and then we will query for the `unit` collection.

### Query for feature collections

To query the all collections in your dataset:

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *GET Dataset Collections*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **GET** HTTP method.

6. Enter the following URL to [WFS API](/rest/api/maps/v2/wfs). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key), and `{datasetId`} with the `datasetId` obtained in [Check dataset creation status](#check-dataset-creation-status):

    ```http
    https://us.atlas.microsoft.com/wfs/datasets/{datasetId}/collections?subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=2.0
    ```

7. Select **Send**.

8. The response body is returned in GeoJSON format and contains all collections in the dataset. For simplicity, the example here only shows the `unit` collection. To see an example that contains all collections, see [WFS Describe Collections API](/rest/api/maps/v2/wfs/collectiondescriptionpreview). To learn more about any collection, you can click on any of the URLs inside the `link` element.

    ```json
    {
    "collections": [
        {
            "name": "unit",
            "description": "A physical and non-overlapping area which might be occupied and traversed by a navigating agent. Can be a hallway, a room, a courtyard, etc. It is surrounded by physical obstruction (wall), unless the is_open_area attribute is equal to true, and one must add openings where the obstruction shouldn't be there. If is_open_area attribute is equal to true, all the sides are assumed open to the surroundings and walls are to be added where needed. Walls for open areas are represented as a line_element or area_element with is_obstruction equal to true.",
            "links": [
                {
                    "href": "https://atlas.microsoft.com/wfs/datasets/{datasetId}/collections/unit/definition?api-version=1.0",
                    "rel": "describedBy",
                    "title": "Metadata catalogue for unit"
                },
                {
                    "href": "https://atlas.microsoft.com/wfs/datasets/{datasetId}/collections/unit/items?api-version=1.0",
                    "rel": "data",
                    "title": "unit"
                }
                {
                    "href": "https://atlas.microsoft.com/wfs/datasets/{datasetId}/collections/unit?api-version=1.0",
                    "rel": "self",
                    "title": "Metadata catalogue for unit"
                }
            ]
        },
    ```

### Query for unit feature collection

In this section, we'll query [WFS API](/rest/api/maps/v2/wfs) for the `unit` feature collection.

To query the unit collection in your dataset:

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *GET Unit Collection*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **GET** HTTP method.

6. Enter the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key), and `{datasetId`} with the `datasetId` obtained in [Check dataset creation status](#check-dataset-creation-status):

    ```http
    https://us.atlas.microsoft.com/wfs/datasets/{datasetId}/collections/unit/items?subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=2.0
    ```

7. Select **Send**.

8. When the response returns, copy the feature `id` for one of the `unit` features. In the following example, the feature `id` is "UNIT26". In this tutorial, we'll use "UNIT26" as our feature `id` in the next section.

     ```json
    {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": ["..."]
                },
                "properties": {
                    "original_id": "b7410920-8cb0-490b-ab23-b489fd35aed0",
                    "category_id": "CTG8",
                    "is_open_area": true,
                    "navigable_by": [
                        "pedestrian"
                    ],
                    "route_through_behavior": "allowed",
                    "level_id": "LVL14",
                    "occupants": [],
                    "address_id": "DIR1",
                    "name": "157"
                },
                "id": "UNIT26",
                "featureType": ""
            }, {"..."}
        ]
    }
    ```

## Create a feature stateset

Feature statesets define dynamic properties and values on specific features that support them. In this section, we'll create a stateset that defines boolean values and corresponding styles for the *occupancy* property.

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *POST Create Stateset*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **POST** HTTP method.

6. Enter the following URL to the [Stateset API](/rest/api/maps/v2/featurestate/createstatesetpreview). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key), and `{datasetId`} with the `datasetId` obtained in [Check dataset creation status](#check-dataset-creation-status):

    ```http
    https://us.atlas.microsoft.com/featurestatesets?api-version=2.0&datasetId={datasetId}&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

7. Select the **Headers** tab.

8. In the **KEY** field, select `Content-Type`. In the **VALUE** field select `application/json`.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/stateset-header.png"alt-text="Header tab information for stateset creation.":::

9. Select the **Body** tab.

10. Select **raw** and **JSON** in the dropdown lists.

11. Copy-paste the following JSON styles into the **Body** window:

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
          }
       ]
    }
    ```

12. Select **Send**.

13. When the response returns successfully, copy the `statesetId` from the response body.  In the next section we'll use the `statesetId` to change the `occupancy` property state of the unit with feature vv "UNIT26"

    :::image type="content" source="./media/tutorial-creator-indoor-maps/response-stateset-id.png"alt-text="Stateset ID response.":::

### Update a feature state

In this section, we'll update the `occupied` state of the unit with feature `id` "UNIT26".

1. Select **New**.

2. In the **Create New** window, select **Request**.

3. Enter a **Request name** for the request, such as *POST Set Stateset*.

4. Select the collection you previously created, and then select **Save**.

5. Select the **PUT** HTTP method.

6. Enter the following URL to the [Feature Statesets API](/rest/api/maps/v2/featurestate/createstatesetpreview). The request should look like the following URL (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key), and `{statesetId`} with the `statesetId` obtained in [Create a feature stateset](#create-a-feature-stateset):

    ```http
    https://us.atlas.microsoft.com/featurestatesets/{statesetId}/featureStates/UNIT26?api-version=2.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

7. Select the **Headers** tab.

8. In the **KEY** field, select `Content-Type`. In the **VALUE** field select `application/json`.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/stateset-header.png"alt-text="Header tab information for stateset creation.":::

9. Select the **Body** tab.

10. Select **raw** and **JSON** in the dropdown lists.

11. Copy-paste the following JSON style into the **Body** window:

    ```json
    {
        "states": [
            {
                "keyName": "occupied",
                "value": true,
                "eventTimestamp": "2020-11-14T17:10:20"
            }
        ]
    }
    ```

    >[!NOTE]
    > The update will only be saved if the time posted stamp is after the time stamp of the previous request.

12. Select **Send**.

13. Upon a successful update, you'll receive a `200 OK` HTTP status code. If you have  [dynamic styling implemented](indoor-map-dynamic-styling.md) for an indoor map, the update will display in your rendered map at the specified time stamp.

The [Feature Get Stateset API](/rest/api/maps/v2/featurestate/getstatespreview) allows you to retrieve the state of a feature using its feature `id`. You can also delete the stateset and its resources by using the [Feature State Delete State API](/rest/api/maps/v2/featurestate/deletestatesetpreview).

To learn more about the different Azure Maps Creator services discussed in this article see, [Creator Indoor Maps](creator-indoor-maps.md).

## Clean up resources

There are no resources that require cleanup.

## Next steps

To learn how to use the indoor maps module, see

> [!div class="nextstepaction"]
> [Use the Indoor Maps module](how-to-use-indoor-module.md)