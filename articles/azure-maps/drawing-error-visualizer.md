---
title: Use Azure Maps Drawing Error Visualizer
titleSuffix:  Microsoft Azure Maps Creator
description: This article demonstrates how to visualize warnings and errors returned by the Creator Conversion API.
author: brendansco 
ms.author: brendanc 
ms.date: 02/17/2023
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps

---

# Using the Azure Maps Drawing Error Visualizer with Creator

The *Drawing Error Visualizer* is a stand-alone web application that displays [Drawing package warnings and errors] detected during the conversion process. The Error Visualizer web application consists of a static page that you can use without connecting to the internet.  You can use the Error Visualizer to fix errors and warnings in accordance with [Drawing package requirements]. The [Azure Maps Conversion API] returns a response with a link to the Error Visualizer only when an error is detected.

## Prerequisites

* An [Azure Maps account]
* A [subscription key]
* A [Creator resource]

This tutorial uses the [Postman] application, but you can choose a different API development environment.

## Download

1. Follow the steps outlined in the [How to create data registry] article to upload the drawing package into your Azure storage account then register it in your Azure Maps account.

    > [!IMPORTANT]
    > Make sure to make a note of the unique identifier (`udid`) value, you will need it. The `udid` is is how you reference the drawing package you uploaded into your Azure storage account from your source code and HTTP requests.

2. Now that the drawing package is uploaded, use `udid` for the uploaded package to convert the package into map data. For steps on how to convert a package, see [Convert a drawing package].

    >[!NOTE]
    >If your conversion process succeeds, you will not receive a link to the Error Visualizer tool.

3. Under the response **Headers** tab in the Postman application, look for the `diagnosticPackageLocation` property, returned by the Conversion API. The response should appear like the following JSON:

    ```json
    {
        "operationId": "77dc9262-d3b8-4e32-b65d-74d785b53504",
        "created": "2020-04-22T19:39:54.9518496+00:00",
        "status": "Failed",
        "properties": {
            "diagnosticPackageLocation": "https://us.atlas.microsoft.com/mapData/ce61c3c1-faa8-75b7-349f-d863f6523748?api-version=2.0"
        }
    }
    ```

4. Download the Drawing Package Error Visualizer by making a `HTTP-GET` request on the `diagnosticPackageLocation` URL.

## Setup

The downloaded zipped package from the `diagnosticPackageLocation` link contains the following two files.

* _VisualizationTool.zip_: Contains the source code, media, and web page for the Drawing Error Visualizer.
* _ConversionWarningsAndErrors.json_: Contains a formatted list of warnings, errors, and other details that are used by the Drawing Error Visualizer.

Unzip the _VisualizationTool.zip_ folder. It contains the following items:

* _assets_ folder: contains images and media files
* _static_ folder: source code
* _index.html_ file: the web application.

Open the _index.html_ file using any of the following browsers, with the respective version number. You can use a different version, if the version offers equally compatible behavior as the listed version.

* Microsoft Edge 80
* Safari 13
* Chrome 80
* Firefox 74

## Using the Drawing Error Visualizer tool

After launching the Drawing Error Visualizer tool, you'll be presented with the upload page. The upload page contains a drag and drop box. The drag & drop box also functions as button that launches a File Explorer dialog.

:::image type="content" source="./media/drawing-errors-visualizer/start-page.png" alt-text="Drawing Error Visualizer App - Start Page":::

The  _ConversionWarningsAndErrors.json_ file has been placed at the root of the downloaded directory. To load the _ConversionWarningsAndErrors.json_, drag & drop the file onto the box. Or, select on the box, find the file in the `File Explorer dialogue`, and upload the file.

:::image type="content" source="./media/drawing-errors-visualizer/loading-data.gif" alt-text="Drawing Error Visualizer App - Drag and drop to load data":::

The _ConversionWarningsAndErrors.json_ contains a list of your drawing package errors and warnings. To view detailed information about an error or warning, select the **Details** link. An intractable section appears below the list. You can now navigate to each error to learn more details on how to resolve the error.

:::image type="content" source="./media/drawing-errors-visualizer/errors.png" alt-text="Drawing Error Visualizer App - Errors and Warnings":::

## Next steps

Learn more by reading:

> [!div class="nextstepaction"]
> [Creator for indoor maps]

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps Conversion API]: /rest/api/maps/v2/conversion
[Convert a drawing package]: tutorial-creator-indoor-maps.md#convert-a-drawing-package
[Creator for indoor maps]: creator-indoor-maps.md
[Creator resource]: how-to-manage-creator.md
[Drawing package requirements]: drawing-requirements.md
[Drawing package warnings and errors]: drawing-conversion-error-codes.md
[How to create data registry]: how-to-create-data-registries.md
[Postman]: https://www.postman.com/
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
