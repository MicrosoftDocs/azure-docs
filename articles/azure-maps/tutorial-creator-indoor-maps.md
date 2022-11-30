---
title: 'Tutorial: Use Microsoft Azure Maps Creator to create indoor maps'
titleSuffix: Microsoft Azure Maps
description: Tutorial on how to use Microsoft Azure Maps Creator to create indoor maps
author: stevemunk
ms.author: v-munksteve
ms.date: 01/28/2022
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
---

# Tutorial: Use Creator to create indoor maps

This tutorial describes how to create indoor maps for use in Microsoft Azure Maps. In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * Upload your indoor map Drawing package.
> * Convert your Drawing package into map data.
> * Create a dataset from your map data.
> * Create a tileset from the data in your dataset.
> * Get the default map configuration ID from your tileset.

In the next tutorials in the Creator series you'll learn to:

> * Query the Azure Maps Web Feature Service (WFS) API to learn about your map features.
> * Create a feature stateset that can be used to set the states of features in your dataset.
> * Update the state of a given map feature.

> [!TIP]
> You can also create a dataset from a GeoJSON package. For more information, see [Create a dataset using a GeoJson package (Preview)](how-to-dataset-geojson.md).

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account).
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
3. [Create a Creator resource](how-to-manage-creator.md).
4. Download the [Sample Drawing package](https://github.com/Azure-Samples/am-creator-indoor-data-examples/blob/master/Sample%20-%20Contoso%20Drawing%20Package.zip).

This tutorial uses the [Postman](https://www.postman.com/) application, but you can use a different API development environment.

>[!IMPORTANT]
>
> * This article uses the `us.atlas.microsoft.com` geographical URL. If your Creator service wasn't created in the United States, you must use a different geographical URL.  For more information, see [Access to Creator Services](how-to-manage-creator.md#access-to-creator-services).
> * In the URL examples in this article you will need to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

## Upload a Drawing package

Use the [Data Upload API](/rest/api/maps/data-v2/upload) to upload the Drawing package to Azure Maps resources.

The Data Upload API is a long running transaction that implements the pattern defined in [Creator Long-Running Operation API V2](creator-long-running-operation-v2.md).

To upload the Drawing package:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Data Upload*.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Data Upload API](/rest/api/maps/data-v2/upload) The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/mapData?api-version=2.0&dataFormat=dwgzippackage&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select the **Headers** tab.

7. In the **KEY** field, select `Content-Type`.

8. In the **VALUE** field, select `application/octet-stream`.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/data-upload-header.png"alt-text="A screenshot of Postman showing the header tab information for data upload that highlights the Content Type key with the value of application forward slash octet dash stream.":::

9. Select the **Body** tab.

10. Select the **binary** radio button.

11. Select **Select File**, and then select a Drawing package.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-upload-body.png" alt-text="A screenshot of Postman showing the body tab in the POST window, with Select File highlighted, this is used to select the Drawing package to import into Creator.":::

12. Select **Send**.

13. In the response window, select the **Headers** tab.

14. Copy the value of the **Operation-Location** key. The Operation-Location key is also known as the `status URL` and is required to check the status of the Drawing package upload, which is explained in the next section.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/data-upload-response-header.png" alt-text="A screenshot of Postman showing the header tab in the response window, with the Operation Location key highlighted.":::

### Check the Drawing package upload status

To check the status of the drawing package and retrieve its unique ID (`udid`):

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Data Upload Status*.

4. Select the **GET** HTTP method.

5. Enter the `status URL` you copied as the last step in the previous section of this article. The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/mapData/operations/{operationId}?api-version=2.0&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Resource-Location** key, which is the `resource location URL`. The `resource location URL` contains the unique identifier (`udid`) of the drawing package resource.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/resource-location-url.png" alt-text="A screenshot of Postman showing the resource location URL in the responses header.":::

### (Optional) Retrieve Drawing package metadata

You can retrieve metadata from the Drawing package resource. The metadata contains information like the resource location URL, creation date, updated date, size, and upload status.

To retrieve content metadata:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Data Upload Metadata*.

4. . Select the **GET** HTTP method.

5. Enter the `resource Location URL` you copied as the last step in the previous section of this article:

    ```http
    https://us.atlas.microsoft.com/mapData/metadata/{udid}?api-version=2.0&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Body** tab. The metadata should like the following JSON fragment:

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

Now that the Drawing package is uploaded, you'll use the `udid` for the uploaded package to convert the package into map data. The [Conversion API](/rest/api/maps/v2/conversion) uses a long-running transaction that implements the pattern defined in the [Creator Long-Running Operation](creator-long-running-operation-v2.md) article.

To convert a drawing package:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Convert Drawing Package*.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Conversion Service](/rest/api/maps/v2/conversion/convert) (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key and `udid` with the `udid` of the uploaded package):

    ```http
    https://us.atlas.microsoft.com/conversions?subscription-key={Your-Azure-Maps-Primary-Subscription-key}&api-version=2.0&udid={udid}&inputType=DWG&outputOntology=facility-2.0
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Operation-Location** key. This is the `status URL` that you'll use to check the status of the conversion.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-convert-location-url.png" border="true" alt-text="A screenshot of Postman showing the URL value of the operation location key in the responses header.":::

### Check the Drawing package conversion status

After the conversion operation completes, it returns a `conversionId`. We can access the `conversionId` by checking the status of the Drawing package conversion process. The `conversionId` can then be used to access the converted data.

To check the status of the conversion process and retrieve the `conversionId`:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Conversion Status*.

4. Select the **GET** HTTP method:

5. Enter the `status URL` you copied in [Convert a Drawing package](#convert-a-drawing-package). The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/conversions/operations/{operationId}?api-version=2.0&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Resource-Location** key, which is the `resource location URL`. The `resource location URL` contains the unique identifier (`conversionId`), which can be used by other APIs to access the converted map data.

      :::image type="content" source="./media/tutorial-creator-indoor-maps/data-conversion-id.png" alt-text="A screenshot of Postman highlighting the conversion ID value that appears in the resource location key in the responses header.":::

The sample Drawing package should be converted without errors or warnings. However, if you receive errors or warnings from your own Drawing package, the JSON response includes a link to the [Drawing error visualizer](drawing-error-visualizer.md). You can use the Drawing Error visualizer to inspect the details of errors and warnings. To receive recommendations to resolve conversion errors and warnings, see [Drawing conversion errors and warnings](drawing-conversion-error-codes.md).

The following JSON fragment displays a sample conversion warning:

```json
{
    "operationId": "{operationId}",
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

A dataset is a collection of map features, such as buildings, levels, and rooms. To create a dataset, use the [Dataset Create API](/rest/api/maps/v2/dataset/create). The Dataset Create API takes the `conversionId` for the converted Drawing package and returns a `datasetId` of the created dataset.

To create a dataset:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Dataset Create*.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Dataset API](/rest/api/maps/v2/dataset). The request should look like the following URL (replace `{conversionId`} with the `conversionId` obtained in [Check Drawing package conversion status](#check-the-drawing-package-conversion-status)):

    ```http
    https://us.atlas.microsoft.com/datasets?api-version=2.0&conversionId={conversionId}&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Operation-Location** key. This is the `status URL` that you'll use to check the status of the dataset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-dataset-location-url.png" border="true" alt-text="A screenshot of Postman showing the value of the operation location key for dataset in the responses header.":::

### Check the dataset creation status

To check the status of the dataset creation process and retrieve the `datasetId`:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Dataset Status*.

4. Select the **GET** HTTP method.

5. Enter the `status URL` you copied in [Create a dataset](#create-a-dataset). The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/datasets/operations/{operationId}?api-version=2.0&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab. The value of the **Resource-Location** key is the `resource location URL`. The `resource location URL` contains the unique identifier (`datasetId`) of the dataset.

8. Save the `datasetId` value, because you'll use it in the next tutorial.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/dataset-id.png" alt-text="A screenshot of Postman highlighting the dataset ID value of the resource location key in the responses header.":::

## Create a tileset

A tileset is a set of vector tiles that render on the map. Tilesets are created from existing datasets. However, a tileset is independent from the dataset from which it was sourced. If the dataset is deleted, the tileset continues to exist.

To create a tileset:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Tileset Create*.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Tileset API](/rest/api/maps/v2/tileset). The request should look like the following URL (replace `{datasetId`} with the `datasetId` obtained in the [Check the dataset creation status](#check-the-dataset-creation-status) section above:

    ```http
    https://us.atlas.microsoft.com/tilesets?api-version=v20220901preview&datasetID={datasetId}&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Operation-Location** key, this is the `status URL`, which you'll use to check the status of the tileset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-tileset-location-url.png" border="true" alt-text="A screenshot of Postman highlighting the status URL that is the value of the operation location key in the responses header.":::

### Check the tileset creation status

To check the status of the tileset creation process and retrieve the `tilesetId`:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Tileset Status*.

4. Select the **GET** HTTP method.

5. Enter the `status URL` you copied in [Create a tileset](#create-a-tileset). The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/tilesets/operations/{operationId}?api-version=2.0&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab. The value of the **Resource-Location** key is the `resource location URL`.  The `resource location URL` contains the unique identifier (`tilesetId`) of the dataset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/tileset-id.png" alt-text="A screenshot of Postman highlighting the tileset ID that is part of the value of the resource location URL in the responses header.":::

## The map configuration (preview)

Once your tileset creation completes, you can get the `mapConfigurationId` using the [tileset get](/rest/api/maps/v20220901preview/tileset/get) HTTP request:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET mapConfigurationId from Tileset*.

4. Select the **GET** HTTP method.

5. Enter the following URL to the [Tileset API](/rest/api/maps/v20220901preview/tileset), passing in the tileset ID you obtained in the previous step.

    ```http
    https://us.atlas.microsoft.com/tilesets/{tilesetId}?api-version=2022-09-01-preview&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. The tileset JSON will appear in the body of the response, scroll down to see the `mapConfigurationId`:

    ```json
    "defaultMapConfigurationId": "5906cd57-2dba-389b-3313-ce6b549d4396"
    ```

For more information, see [Map configuration](creator-indoor-maps.md#map-configuration) in the indoor maps concepts article.

<!--For additional information, see [Create custom styles for indoor maps](how-to-create-custom-styles.md).-->

## Additional information

* For additional information see the how to [Use the Azure Maps Indoor Maps module](how-to-use-indoor-module.md) article.
* See [Azure IoT Maps Creator Functional API](/rest/api/maps-creator/) for additional information on the Creator REST API.

## Next steps

To learn how to query Azure Maps Creator [datasets](/rest/api/maps/v2/dataset) using [WFS API](/rest/api/maps/v2/wfs) in the next Creator tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Query datasets with WFS API](tutorial-creator-wfs.md)

> [!div class="nextstepaction"]
> [Create custom styles for indoor maps](how-to-create-custom-styles.md)
