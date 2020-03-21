---
title: Use Azure Maps DWG Error Visualizer | Microsoft Azure Maps
description: In this article, you'll learn about how to visualize warnings and errors returned by the Azure Maps Conversion API.
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/20/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Use Azure Maps DWG Error Visualizer

Azure Maps Conversion API lets you download a stand-alone web application to visualize [DWG package warnings and errors](dwg-conversion-error-codes.md). The web application has a static page that you can use without connecting to an internet network. It's a convenient visual tool to inspect warnings and errors in your DWG package that are detected by the Conversion API. The goal is to fix them to meet the [DWG package requirements](dwg-requirements.md), in order to successfully convert your package into map data.

## Prerequisites

Before you can download the DWG package visualizer, you need:

1. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account) by [making an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps)

2. [Enable the Private Atlas resource](tutorial-private-atlas-indoor-maps.md) in your Azure Maps account

3. Upload your DWG package to the Azure Maps service, and obtain a `udid` for the uploaded package. This procedure is detailed in the [Data Upload section of the Private Atlas tutorial](tutorial-private-atlas-indoor-maps.md#upload-dwg-package) article.

## Download

Now that you have the `udid` for the uploaded package, make a request to the Conversion API. The procedure is detailed in the [Data Conversion section of the Private Atlas tutorial](tutorial-private-atlas-indoor-maps.md#convert-dwg-package) article.

Under the response **Headers** tab, look for the `diagnosticPackageLocation` property, returned by Azure Maps Conversion API. Right-click and select the download option, and save the zipped package locally.

## Setup

Inside the downloaded zipped package from the `diagnosticPackageLocation` link, you'll find two files. The _ConversionWarningsAndErrors.json_ containing a formatted list of warnings, errors, and additional details that's used by the _VisualizationTool.zip_. The _VisualizationTool.zip_ is the standalone web application for DWG error visualization.

<center>

![Content of zipped package returned by the Conversion API](./media/azure-maps-dwg-errors-visualizer/content-of-the-zipped-package.png)

</center>

Unzip the _VisualizationTool.zip_ folder. It contains an _assets_ folder with images and media files, a _static_ folder with source code, and an index.html file of the web page.

![Content of zipped package for VisualizationTool.zip](./media/azure-maps-dwg-errors-visualizer/content-of-the-visualization-tool.png)

Open the _index.html_ file using any of the browsers below, with the respective version number. You may use a different version, if the version offers equally compatible behavior as the listed version.

- Microsoft Edge 80
- Safari 13
- Chrome 80
- Firefox 74

## Use the Visualization tool

Upon launching the Visualization tool, you'll see a box to load your data, as shown in the image below. To view the warnings and errors, load the _ConversionWarningsAndErrors.json_ file, placed at the root of the downloaded directory. 

![Visualization App - Start Page](./media/azure-maps-dwg-errors-visualizer/start-page.png)

You may load it by dragging and dropping it into the specified box. Or by clicking on the box, navigating your file system, and selecting it. Once the file loads, you'll see a list of your DWG package errors and warnings. Specified by the layer, level, and described with a detailed message.

![Visualization App - Drag and drop to load data](./media/azure-maps-dwg-errors-visualizer/loading-data.gif)

## Next steps

Once your [DWG package meets the requirements](dwg-requirements.md), you may use the Conversion API to convert the DWG file to a map data set. Then, you can use Private Atlas APIs and the Indoor Maps web module to develop your application. Learn more  by reading the following articles: 

> [!div class="nextstepaction"]
> [Indoor Maps data management]()

> [!div class="nextstepaction"]
> [Use the Indoor Maps module]()

> [!div class="nextstepaction"]
> [Use the Indoor Maps module]()

> [!div class="nextstepaction"]
> [Implement indoor map dynamic styling]()