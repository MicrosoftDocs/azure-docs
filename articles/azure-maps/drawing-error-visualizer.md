---
title: Use Azure Maps Drawing Error Visualizer
description: In this article, you'll learn about how to visualize warnings and errors returned by the Creator Conversion API.
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/12/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Using the Azure Maps Drawing Error Visualizer

The Drawing Error Visualizer is a stand-alone web application that displays [Drawing package warnings and errors](drawing-conversion-error-codes.md) detected during the conversion process. The Error Visualizer web application consists of a static page that you can use without connecting to the internet.  You can use the Error Visualizer to fix errors and warnings in accordance with [Drawing package requirements](drawing-requirements.md). The [Azure Maps Conversion API](https://docs.microsoft.com/rest/api/maps/conversion) only returns a response with a link to the Error Visualizer only when an error is detected.

## Prerequisites

Before you can download the Drawing Error Visualizer, you'll need to:

1. [Create an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
3. [Create a Creator resource](how-to-manage-creator.md)

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Download

1. Upload your Drawing package to the Azure Maps Creator service to obtain a `udid` for the uploaded package. For steps on how to upload a package, see [Upload a drawing package](tutorial-creator-indoor-maps.md#upload-a-drawing-package).

2. Now that the Drawing package is uploaded, we'll use `udid` for the uploaded package to convert the package into map data. For steps on how to convert a package, see [Convert a drawing package](tutorial-creator-indoor-maps.md#convert-a-drawing-package).

    >[!NOTE]
    >If your conversion process succeeds, you will not receive a link to the Error Visualizer tool.

3. Under the response **Headers** tab in the Postman application, look for the `diagnosticPackageLocation` property, returned by the Conversion API. The response should appear like the following JSON:

    ```json
    {
        "operationId": "77dc9262-d3b8-4e32-b65d-74d785b53504",
        "created": "2020-04-22T19:39:54.9518496+00:00",
        "status": "Failed",
        "resourceLocation": "https://atlas.microsoft.com/conversion/{conversionId}?api-version=1.0",
        "properties": {
            "diagnosticPackageLocation": "https://atlas.microsoft.com/mapData/ce61c3c1-faa8-75b7-349f-d863f6523748?api-version=1.0"
        }
    }
    ```

4. Download the Drawing Package Error Visualizer by making a `HTTP-GET` request on the `diagnosticPackageLocation` URL.

## Setup

Inside the downloaded zipped package from the `diagnosticPackageLocation` link, you'll find two files.

* _VisualizationTool.zip_: Contains the source code, media, and web page for the Drawing Error Visualizer.
* _ConversionWarningsAndErrors.json_: Contains a formatted list of warnings, errors, and additional details that are used by the Drawing Error Visualizer.

Unzip the _VisualizationTool.zip_ folder. It contains the following items:

* _assets_ folder: contains images and media files
* _static_ folder: source code
* _index.html_ file: the web application.

Open the _index.html_ file using any of the browsers below, with the respective version number. You may use a different version, if the version offers equally compatible behavior as the listed version.

* Microsoft Edge 80
* Safari 13
* Chrome 80
* Firefox 74

## Using the Drawing Error Visualizer tool

After launching the Drawing Error Visualizer tool, you'll be presented with the upload page. The upload page contains a drag and drop box. The drag & drop box also functions as button that launches a File Explorer dialog.

:::image type="content" source="./media/drawing-errors-visualizer/start-page.png" alt-text="Drawing Error Visualizer App - Start Page":::

The  _ConversionWarningsAndErrors.json_ file has been placed at the root of the downloaded directory. To load the _ConversionWarningsAndErrors.json_ you can either drag & drop the file onto the box or click on the box, find the file in the File Explorer dialogue, and then upload the file.

:::image type="content" source="./media/drawing-errors-visualizer/loading-data.gif" alt-text="Drawing Error Visualizer App - Drag and drop to load data":::

Once the _ConversionWarningsAndErrors.json_ file loads, you'll see a list of your Drawing package errors and warnings. Each error or warning is specified by the layer, level, and a detailed message. To view detailed information about an error or warning, click on the **Details** link. An intractable section will then appear below the list. You may now navigate to each error to learn more details on how to resolve the error.

:::image type="content" source="./media/drawing-errors-visualizer/errors.png" alt-text="Drawing Error Visualizer App - Errors and Warnings":::

## Next steps

Once your [Drawing package meets the requirements](drawing-requirements.md), you can use the [Azure Maps Dataset service](https://docs.microsoft.com/rest/api/maps/conversion) to convert the Drawing package to a dataset. Then, you can use the Indoor Maps web module to develop your application. Learn more by reading the following articles:

> [!div class="nextstepaction"]
> [Drawing Conversion error codes](drawing-conversion-error-codes.md)

> [!div class="nextstepaction"]
> [Creator for indoor maps](creator-indoor-maps.md)

> [!div class="nextstepaction"]
> [Use the Indoor Maps module](how-to-use-indoor-module.md)

> [!div class="nextstepaction"]
> [Implement indoor map dynamic styling](indoor-map-dynamic-styling.md)