---
title: 'Tutorial: Use Microsoft Azure Maps Creator to create indoor maps'
titleSuffix: Microsoft Azure Maps
description: Tutorial on how to use Microsoft Azure Maps Creator to create indoor maps
author: brendansco
ms.author: Brendanc
ms.date: 01/28/2022
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
---

# Tutorial: Use Creator to create indoor maps

This tutorial describes how to create indoor maps for use in Microsoft Azure Maps. This tutorial demonstrates how to:

> [!div class="checklist"]
>
> * Upload your indoor map drawing package.
> * Convert your drawing package into map data.
> * Create a dataset from your map data.
> * Create a tileset from the data in your dataset.
> * Get the default map configuration ID from your tileset.

> [!TIP]
> You can also create a dataset from a GeoJSON package. For more information, see [Create a dataset using a GeoJson package (Preview)].

## Prerequisites

* An [Azure Maps account]
* A [subscription key]
* A [Creator resource]
* Download the [Sample drawing package]

This tutorial uses the [Postman] application, but you can use a different API development environment.

>[!IMPORTANT]
>
> * This article uses the `us.atlas.microsoft.com` geographical URL. If your Creator service wasn't created in the United States, you must use a different geographical URL.  For more information, see [Access to Creator services].
> * Replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key in the URL examples.

## Upload a drawing package

Use the [Data Upload API] to upload the drawing package to Azure Maps resources.

The Data Upload API is a long running transaction that implements the pattern defined in [Creator Long-Running Operation API V2].

To upload the drawing package:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Data Upload*.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Data Upload API] The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/mapData?api-version=2.0&dataFormat=dwgzippackage&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select the **Headers** tab.

7. In the **KEY** field, select `Content-Type`.

8. In the **VALUE** field, select `application/octet-stream`.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/data-upload-header.png"alt-text="A screenshot of Postman showing the header tab information for data upload that highlights the Content Type key with the value of application forward slash octet dash stream.":::

9. Select the **Body** tab.

10. Select the **binary** radio button.

11. Select **Select File**, and then select a drawing package.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-upload-body.png" alt-text="A screenshot of Postman showing the body tab in the POST window, with Select File highlighted, it's used to select the drawing package to import into Creator.":::

12. Select **Send**.

13. In the response window, select the **Headers** tab.

14. Copy the value of the **Operation-Location** key. The Operation-Location key is also known as the `status URL` and is required to check the status of the drawing package upload, which is explained in the next section.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/data-upload-response-header.png" alt-text="A screenshot of Postman showing the header tab in the response window, with the Operation Location key highlighted.":::

### Check the drawing package upload status

To check the status of the drawing package and retrieve its unique ID (`udid`):

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Data Upload Status*.

4. Select the **GET** HTTP method.

5. Enter the `status URL` you copied as the last step in the previous section. The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/mapData/operations/{operationId}?api-version=2.0&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Resource-Location** key, which is the `resource location URL`. The `resource location URL` contains the unique identifier (`udid`) of the drawing package resource.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/resource-location-url.png" alt-text="A screenshot of Postman showing the resource location URL in the responses header.":::

### (Optional) Retrieve drawing package metadata

You can retrieve metadata from the drawing package resource. The metadata contains information like the resource location URL, creation date, updated date, size, and upload status.

To retrieve content metadata:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Data Upload Metadata*.

4. . Select the **GET** HTTP method.

5. Enter the `resource Location URL` you copied as the last step in the previous section:

    ```http
    https://us.atlas.microsoft.com/mapData/metadata/{udid}?api-version=2.0&subscription-key={Your-Azure-Maps-Subscription-key}
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

## Convert a drawing package

Now that the drawing package is uploaded, you use the `udid` for the uploaded package to convert the package into map data. The [Conversion API] uses a long-running transaction that implements the pattern defined in the [Creator Long-Running Operation] article.

To convert a drawing package:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Convert Drawing Package*.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Conversion service] (replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key and `udid` with the `udid` of the uploaded package):

    ```http
    https://us.atlas.microsoft.com/conversions?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2023-03-01-preview&udid={udid}&inputType=DWG&dwgPackageVersion=2.0
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Operation-Location** key, it contains the `status URL` that you use to check the status of the conversion.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-convert-location-url.png" border="true" alt-text="A screenshot of Postman showing the URL value of the operation location key in the responses header.":::

### Check the drawing package conversion status

After the conversion operation completes, it returns a `conversionId`. We can access the `conversionId` by checking the status of the drawing package conversion process. The `conversionId` can then be used to access the converted data.

To check the status of the conversion process and retrieve the `conversionId`:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Conversion Status*.

4. Select the **GET** HTTP method:

5. Enter the `status URL` you copied in [Convert a drawing package](#convert-a-drawing-package). The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/conversions/operations/{operationId}?api-version=2.0&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Resource-Location** key, which is the `resource location URL`. The `resource location URL` contains the unique identifier (`conversionId`), which is used by other APIs to access the converted map data.

      :::image type="content" source="./media/tutorial-creator-indoor-maps/data-conversion-id.png" alt-text="A screenshot of Postman highlighting the conversion ID value that appears in the resource location key in the responses header.":::

The sample drawing package should be converted without errors or warnings. However, if you receive errors or warnings from your own drawing package, the JSON response includes a link to the [Drawing error visualizer]. You can use the Drawing Error visualizer to inspect the details of errors and warnings. To receive recommendations to resolve conversion errors and warnings, see [Drawing conversion errors and warnings].

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

A dataset is a collection of map features, such as buildings, levels, and rooms. To create a dataset, use the [Dataset Create API]. The Dataset Create API takes the `conversionId` for the converted drawing package and returns a `datasetId` of the created dataset.

To create a dataset:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Dataset Create*.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Dataset service]. The request should look like the following URL (replace `{conversionId`} with the `conversionId` obtained in [Check drawing package conversion status](#check-the-drawing-package-conversion-status)):

    ```http
    https://us.atlas.microsoft.com/datasets?api-version=2023-03-01-preview&conversionId={conversionId}&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Operation-Location** key, it contains the `status URL` that you use to check the status of the dataset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-dataset-location-url.png" border="true" alt-text="A screenshot of Postman showing the value of the operation location key for dataset in the responses header.":::

### Check the dataset creation status

To check the status of the dataset creation process and retrieve the `datasetId`:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Dataset Status*.

4. Select the **GET** HTTP method.

5. Enter the `status URL` you copied in [Create a dataset](#create-a-dataset). The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/datasets/operations/{operationId}?api-version=2023-03-01-preview&subscription-key={Your-Azure-Maps-Subscription-key}
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

5. Enter the following URL to the [Tileset service]. The request should look like the following URL (replace `{datasetId`} with the `datasetId` obtained in the [Check the dataset creation status](#check-the-dataset-creation-status) section:

    ```http
    https://us.atlas.microsoft.com/tilesets?api-version=2023-03-01-preview&datasetID={datasetId}&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Operation-Location** key, it contains the `status URL`, which you use to check the status of the tileset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-tileset-location-url.png" border="true" alt-text="A screenshot of Postman highlighting the status URL that is the value of the operation location key in the responses header.":::

### Check the tileset creation status

To check the status of the tileset creation process and retrieve the `tilesetId`:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET Tileset Status*.

4. Select the **GET** HTTP method.

5. Enter the `status URL` you copied in [Create a tileset](#create-a-tileset). The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/tilesets/operations/{operationId}?api-version=2023-03-01-preview&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab. The value of the **Resource-Location** key is the `resource location URL`.  The `resource location URL` contains the unique identifier (`tilesetId`) of the dataset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/tileset-id.png" alt-text="A screenshot of Postman highlighting the tileset ID that is part of the value of the resource location URL in the responses header.":::

## The map configuration (preview)

Once your tileset creation completes, you can get the `mapConfigurationId` using the [tileset get] HTTP request:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *GET mapConfigurationId from Tileset*.

4. Select the **GET** HTTP method.

5. Enter the following URL to the [Tileset service], passing in the tileset ID you obtained in the previous step.

    ```http
    https://us.atlas.microsoft.com/tilesets/{tilesetId}?api-version=2022-09-01-preview&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. The tileset JSON appears in the body of the response, scroll down to see the `mapConfigurationId`:

    ```json
    "defaultMapConfigurationId": "5906cd57-2dba-389b-3313-ce6b549d4396"
    ```

For more information, see [Map configuration] in the indoor maps concepts article.

## Next steps

> [!div class="nextstepaction"]
> [Use the Azure Maps Indoor Maps module with custom styles](how-to-use-indoor-module.md)

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Creator resource]: how-to-manage-creator.md
[Sample drawing package]: https://github.com/Azure-Samples/am-creator-indoor-data-examples/blob/master/Sample%20-%20Contoso%20Drawing%20Package.zip
[Postman]: https://www.postman.com
[Access to Creator services]: how-to-manage-creator.md#access-to-creator-services
[Create a dataset using a GeoJson package (Preview)]: how-to-dataset-geojson.md
[Data Upload API]: /rest/api/maps/data-v2/upload
[Creator Long-Running Operation API V2]: creator-long-running-operation-v2.md
[Conversion API]: /rest/api/maps/v2/conversion
[Conversion service]: /rest/api/maps/v2/conversion/convert
[Creator Long-Running Operation]: creator-long-running-operation-v2.md
[Drawing error visualizer]: drawing-error-visualizer.md
[Drawing conversion errors and warnings]: drawing-conversion-error-codes.md
[Dataset Create API]: /rest/api/maps/v2/dataset/create
[Dataset service]: /rest/api/maps/v2/dataset
[Tileset service]: /rest/api/maps/v20220901preview/tileset
[tileset get]: /rest/api/maps/v20220901preview/tileset/get
[Map configuration]: creator-indoor-maps.md#map-configuration
