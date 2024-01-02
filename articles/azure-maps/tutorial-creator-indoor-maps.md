---
title: 'Tutorial: Use Microsoft Azure Maps Creator to create indoor maps'
titleSuffix: Microsoft Azure Maps
description: Learn how to use Microsoft Azure Maps Creator to create indoor maps.
author: brendansco
ms.author: Brendanc
ms.date: 01/28/2022
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
---

# Tutorial: Use Azure Maps Creator to create indoor maps

This tutorial describes how to create indoor maps for use in Microsoft Azure Maps. This tutorial demonstrates how to:

> [!div class="checklist"]
>
> * Upload your drawing package for indoor maps.
> * Convert your drawing package into map data.
> * Create a dataset from your map data.
> * Create a tileset from the data in your dataset.
> * Get the default map configuration ID from your tileset.

You can also create a dataset from a GeoJSON package. For more information, see [Create a dataset using a GeoJSON package (preview)].

## Prerequisites

* An [Azure Maps account]
* A [subscription key]
* A [Creator resource]
* An [Azure storage account]
* The [sample drawing package] downloaded

This tutorial uses the [Postman] application, but you can use a different API development environment.

>[!IMPORTANT]
>
> * This article uses the `us.atlas.microsoft.com` geographical URL. If your Creator service wasn't created in the United States, you must use a different geographical URL. For more information, see [Access to Creator services].
> * In the URL examples, replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key.

## Upload a drawing package

Follow the steps outlined in the [How to create data registry] article to upload the GeoJSON package into your Azure storage account then register it in your Azure Maps account.

> [!IMPORTANT]
> Make sure to make a note of the unique identifier (`udid`) value, you will need it. The `udid` is how you reference the GeoJSON package you uploaded into your Azure storage account from your source code and HTTP requests.

## Convert a drawing package

Now that the drawing package is uploaded, you use the `udid` value for the uploaded package to convert the package into map data. The [Conversion API] uses a long-running transaction that implements the pattern defined in the [Creator Long-Running Operation] article.

To convert a drawing package:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. For **Request name**, enter a name for the request, such as **POST Convert Drawing Package**.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Conversion service]. Replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key. Replace `udid` with the `udid` value of the uploaded package.

    ```http
    https://us.atlas.microsoft.com/conversions?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2023-03-01-preview&udid={udid}&inputType=DWG&dwgPackageVersion=2.0
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Operation-Location** key. It contains the status URL that you use to check the status of the conversion.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-convert-location-url.png" border="true" alt-text="Screenshot of Postman that shows the URL value of the operation location key in the response header.":::

### Check the status of the drawing package conversion

After the conversion operation finishes, it returns a `conversionId` value. You can access the `conversionId` value by checking the status of the drawing package's conversion process. You can then use the `conversionId` value to access the converted data.

To check the status of the conversion process and retrieve the `conversionId` value:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. For **Request name**, enter a name for the request, such as **GET Conversion Status**.

4. Select the **GET** HTTP method.

5. Enter the status URL that you copied in the [Convert a drawing package](#convert-a-drawing-package) section. The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/conversions/operations/{operationId}?api-version=2.0&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Resource-Location** key, which is the resource location URL. The resource location URL contains the unique identifier `conversionId`, which other APIs use to access the converted map data.

      :::image type="content" source="./media/tutorial-creator-indoor-maps/data-conversion-id.png" alt-text="Screenshot of Postman that highlights the conversion ID value that appears in the Resource-Location key in the response header.":::

The sample drawing package should be converted without errors or warnings. But if you receive errors or warnings from your own drawing package, the JSON response includes a link to the [Drawing Error Visualizer]. You can use the Drawing Error Visualizer to inspect the details of errors and warnings. To get recommendations for resolving conversion errors and warnings, see [Drawing conversion errors and warnings].

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

A dataset is a collection of map features, such as buildings, levels, and rooms. To create a dataset, use the [Dataset Create API]. The Dataset Create API takes the `conversionId` value for the converted drawing package and returns a `datasetId` value for the created dataset.

To create a dataset:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. For **Request name**, enter a name for the request, such as **POST Dataset Create**.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Dataset service]. Replace `{conversionId}` with the `conversionId` value that you obtained in [Check the status of the drawing package conversion](#check-the-status-of-the-drawing-package-conversion).

    ```http
    https://us.atlas.microsoft.com/datasets?api-version=2023-03-01-preview&conversionId={conversionId}&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Operation-Location** key. It contains the status URL that you use to check the status of the dataset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-dataset-location-url.png" border="true" alt-text="Screenshot of Postman that shows the value of the Operation-Location key for a dataset in the response header.":::

### Check the dataset creation status

To check the status of the dataset creation process and retrieve the `datasetId` value:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. For **Request name**, enter a name for the request, such as **GET Dataset Status**.

4. Select the **GET** HTTP method.

5. Enter the status URL that you copied in the [Create a dataset](#create-a-dataset) section. The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/datasets/operations/{operationId}?api-version=2023-03-01-preview&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab. The value of the **Resource-Location** key is the resource location URL. The resource location URL contains the unique identifier (`datasetId`) of the dataset.

8. Save the `datasetId` value, because you'll use it in the next tutorial.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/dataset-id.png" alt-text="Screenshot of Postman that shows the dataset ID value of the Resource-Location key in the response header.":::

## Create a tileset

A tileset is a set of vector tiles that render on the map. Tilesets are created from existing datasets. However, a tileset is independent from the dataset that it comes from. If the dataset is deleted, the tileset continues to exist.

To create a tileset:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. For **Request name**, enter a name for the request, such as **POST Tileset Create**.

4. Select the **POST** HTTP method.

5. Enter the following URL to the [Tileset service]. Replace `{datasetId}` with the `datasetId` value that you obtained in the [Check the dataset creation status](#check-the-dataset-creation-status) section.

    ```http
    https://us.atlas.microsoft.com/tilesets?api-version=2023-03-01-preview&datasetID={datasetId}&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab.

8. Copy the value of the **Operation-Location** key. It contains the status URL, which you use to check the status of the tileset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/data-tileset-location-url.png" border="true" alt-text="Screenshot of Postman that shows the status URL, which is the value of the Operation-Location key in the response header.":::

### Check the status of tileset creation

To check the status of the tileset creation process and retrieve the `tilesetId` value:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. For **Request name**, enter a name for the request, such as **GET Tileset Status**.

4. Select the **GET** HTTP method.

5. Enter the status URL that you copied in the [Create a tileset](#create-a-tileset) section. The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/tilesets/operations/{operationId}?api-version=2023-03-01-preview&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. In the response window, select the **Headers** tab. The value of the **Resource-Location** key is the resource location URL. The resource location URL contains the unique identifier (`tilesetId`) of the dataset.

    :::image type="content" source="./media/tutorial-creator-indoor-maps/tileset-id.png" alt-text="Screenshot of Postman that shows the tileset ID, which is part of the value of the resource location URL in the response header.":::

## Get the map configuration (preview)

After you create a tileset, you can get the `mapConfigurationId` value by using the [tileset get] HTTP request:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. For **Request name**, enter a name for the request, such as **GET mapConfigurationId from Tileset**.

4. Select the **GET** HTTP method.

5. Enter the following URL to the [Tileset service]. Pass in the tileset ID that you obtained in the previous step.

    ```http
    https://us.atlas.microsoft.com/tilesets/{tilesetId}?api-version=2023-03-01-preview&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

6. Select **Send**.

7. The tileset JSON appears in the body of the response. Scroll down to see the `mapConfigurationId` value:

    ```json
    "defaultMapConfigurationId": "5906cd57-2dba-389b-3313-ce6b549d4396"
    ```

For more information, see [Map configuration] in the article about indoor map concepts.

## Next steps

> [!div class="nextstepaction"]
> [What is Azure Maps Creator?]

> [!div class="nextstepaction"]
> [Creator for indoor maps]

> [!div class="nextstepaction"]
> [Use the Azure Maps Indoor Maps module with custom styles](how-to-use-indoor-module.md)

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure storage account]: /azure/storage/common/storage-account-create?tabs=azure-portal
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Creator resource]: how-to-manage-creator.md
[Sample drawing package]: https://github.com/Azure-Samples/am-creator-indoor-data-examples/blob/master/Sample%20-%20Contoso%20Drawing%20Package.zip
[Postman]: https://www.postman.com
[Access to Creator services]: how-to-manage-creator.md#access-to-creator-services
[Create a dataset using a GeoJSON package (Preview)]: how-to-dataset-geojson.md
[How to create data registry]: how-to-create-data-registries.md
[Conversion API]: /rest/api/maps/v2/conversion
[Conversion service]: /rest/api/maps/v2/conversion/convert
[Creator Long-Running Operation]: creator-long-running-operation-v2.md
[Drawing error visualizer]: drawing-error-visualizer.md
[Drawing conversion errors and warnings]: drawing-conversion-error-codes.md
[Dataset Create API]: /rest/api/maps/v2/dataset/create
[Dataset service]: /rest/api/maps/v2/dataset
[Tileset service]: /rest/api/maps/2023-03-01-preview/tileset
[tileset get]: /rest/api/maps/2023-03-01-preview/tileset/get
[Map configuration]: creator-indoor-maps.md#map-configuration
[What is Azure Maps Creator?]: about-creator.md
[Creator for indoor maps]: creator-indoor-maps.md
