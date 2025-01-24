---
title: How to Use the Azure Maps Spatial IO Module
titleSuffix: Microsoft Azure Maps
description: Learn how to easily integrate spatial data with the Azure Maps Web SDK by using the Spatial IO Module. 
author: sinnypan
ms.author: sipa
ms.date: 02/28/2020
ms.topic: how-to
ms.service: azure-maps
ms.subservice: web-sdk
---

# How to use the Azure Maps Spatial IO module

The Azure Maps Web SDK provides the [Spatial IO module], which integrates spatial data with the Azure Maps Web SDK using JavaScript or TypeScript. You can use the robust features in this module to:

- [Read and write spatial data]. You can use file formats including KML, KMZ, GPX, GeoRSS, GML, GeoJSON, and CSV files containing columns with spatial information. Well-Known Text (WKT) is also supported.
- Connect to Open Geospatial Consortium (OGC) services and integrate with Azure Maps Web SDK. You can also overlay Web Map Services (WMS) and Web Map Tile Services (WMTS) as layers on the map. For more information, see [Add a map layer from the Open Geospatial Consortium (OGC)].
- Query data in a Web Feature Service (WFS). For more information, see [Connect to a WFS service].
- Overlay complex data sets that contain style information, which can render automatically. For more information, see [Add a simple data layer].
- Leverage high-speed XML and delimited file reader and writer classes. For more information, see [Core IO operations].

This guide demonstrates how to integrate and use the Spatial IO module in a web application.

The following video provides an overview of the Spatial IO module in the Azure Maps Web SDK.

</br>

> [!VIDEO https://learn.microsoft.com/Shows/Internet-of-Things-Show/Easily-integrate-spatial-data-into-the-Azure-Maps/player?format=ny]
> [!WARNING]
> Only use data and services that are from a source you trust, especially if the data is referenced from another domain. The spatial IO module takes steps to minimize risk, but you should not allow any dangerous data into your application regardless.

## Prerequisites

- An [Azure Maps account]
- A [subscription key]

## Installing the Spatial IO module

You can load the Azure Maps Spatial IO module using one of the following two options:

- You can use the globally hosted Azure Content Delivery Network (CDN) for the Azure Maps Spatial IO module. For this option, you add a reference to the JavaScript in the `<head>` element of the HTML file.

    ```html
    <script src="https://atlas.microsoft.com/sdk/javascript/spatial/0/atlas-spatial.js"></script>
    ```

- With the second option, you can load the source code for [azure-maps-spatial-io] locally, and then host it with your app. This package also includes TypeScript definitions. Use the following command to install the package:

    ```sh
    npm install azure-maps-spatial-io
    ```

    Then, use an import declaration to add the module into a source file:

    ```js
    import * as spatial from "azure-maps-spatial-io";
    ```

    To learn more, see [How to use the Azure Maps map control npm package].

## Using the Spatial IO module

1. Create a new HTML file.

1. Load the Azure Maps Web SDK and initialize the map control. See the [Azure Maps map control] guide for details. Your HTML file should look like this:

    ```html
    <!DOCTYPE html>
    <html>

    <head>
        <title></title>

        <meta charset="utf-8">

        <!-- Ensures that Internet Explorer and Edge use the latest version and don't emulate an older version -->
        <meta http-equiv="x-ua-compatible" content="IE=Edge">

        <!-- Ensures the web page looks good on all screen sizes. -->
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css" type="text/css" />
        <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.js"></script>

        <script type='text/javascript'>

            var map;

            function GetMap() {
                //Initialize a map instance.
                map = new atlas.Map('myMap', {
                    view: 'Auto',

                    //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
                    authOptions: {
                        authType: 'subscriptionKey',
                        subscriptionKey: '<Your Azure Maps Key>'
                    }
                });

                //Wait until the map resources are ready.
                map.events.add('ready', function() {

                    // Write your code here to make sure it runs once the map resources are ready.

                });
            }
        </script>
    </head>

    <body onload="GetMap()">
        <div id="myMap" style="position:relative;width:100%;min-width:290px;height:600px;"></div>
    </body>

    </html>
    ```

1. Load the Azure Maps Spatial IO module and use the CDN for the Azure Maps Spatial IO module. Add the following reference to the `<head>` element of your HTML file:

    ```html
    <script src="https://atlas.microsoft.com/sdk/javascript/spatial/0/atlas-spatial.js"></script>
    ```

1. Initialize a `datasource`, and add the data source to the map. Initialize a `layer`, and add the data source to the map layer. Then, render both the data source and the layer.
1. Before you scroll down to see the full code in the next step, think about the best places to put the data source and layer code snippets. Wait until the map resources are ready before you programmatically manipulate the map.

    ```javascript
    var datasource, layer;
    ```

    and

    ```javascript
    //Create a data source and add it to the map.
    datasource = new atlas.source.DataSource();
    map.sources.add(datasource);
    
    //Add a simple data layer for rendering the data.
    layer = new atlas.layer.SimpleDataLayer(datasource);
    map.layers.add(layer);
    ```

1. Your HTML code should look like the following. The sample code shows you how to display an XML file's feature data on a map.

    > [!NOTE]
    > This example uses [Route66Attractions.xml].

    ```html
    <!DOCTYPE html>
    <html>
    <head>
        <title>Spatial IO Module Example</title>

        <meta charset="utf-8">

        <!-- Ensures that Internet Explorer and Edge use the latest version and don't emulate an older version -->
        <meta http-equiv="x-ua-compatible" content="IE=Edge">

        <!-- Ensures the web page looks good on all screen sizes. -->
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Add references to the Azure Maps map control JavaScript and CSS files. -->
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css" type="text/css" />
        <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.js"></script>

        <!-- Add reference to the Azure Maps Spatial IO module. -->
        <script src="https://atlas.microsoft.com/sdk/javascript/spatial/0/atlas-spatial.js"></script>

        <script type='text/javascript'>
            var map, datasource, layer;

            function GetMap() {
                //Initialize a map instance.
                map = new atlas.Map('myMap', {
                    view: 'Auto',

                    //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps.
                    authOptions: {
                        authType: 'subscriptionKey',
                        subscriptionKey: '<Your Azure Maps Key>'
                    }
                });

                //Wait until the map resources are ready.
                map.events.add('ready', function() {

                    //Create a data source and add it to the map.
                    datasource = new atlas.source.DataSource();
                    map.sources.add(datasource);

                    //Add a simple data layer for rendering the data.
                    layer = new atlas.layer.SimpleDataLayer(datasource);
                    map.layers.add(layer);

                    //Read an XML file from a URL or pass in a raw XML string.
                    atlas.io.read('Route66Attractions.xml').then(r => {
                        if (r) {
                            //Add the feature data to the data source.
                            datasource.add(r);

                            //If bounding box information is known for data, set the map view to it.
                            if (r.bbox) {
                                map.setCamera({
                                    bounds: r.bbox,
                                    padding: 50
                                });
                            }
                        }
                    });
                });
            }
        </script>
    </head>
    <body onload='GetMap()'>
        <div id="myMap" style="position:relative;width:100%;min-width:290px;height:600px;"></div>
    </body>
    </html>
    ```

1. Remember to replace `<Your Azure Maps Key>` with your subscription key. Your HTML file should include an image that looks like this.

    :::image type="content" source="./media/how-to-use-spatial-io-module/spatial-data-example.png" lightbox="./media/how-to-use-spatial-io-module/spatial-data-example.png" alt-text="Screenshot showing the Spatial Data sample in a map.":::

## Related content

There are many features available in the Spatial IO module. To learn about other functionalities, read the following guides:

- [Add a simple data layer]
- [Read and write spatial data]
- [Add an OGC map layer]
- [Connect to a WFS service]
- [Leverage core operations]
- [Supported data format details]
- [Documentation: Azure Maps Spatial IO package]

[Add a simple data layer]: spatial-io-add-simple-data-layer.md
[Read and write spatial data]: spatial-io-read-write-spatial-data.md
[Add an OGC map layer]: spatial-io-add-ogc-map-layer.md
[Connect to a WFS service]: spatial-io-connect-wfs-service.md
[Leverage core operations]: spatial-io-core-operations.md
[Supported data format details]: spatial-io-supported-data-format-details.md
[Documentation: Azure Maps Spatial IO package]: /javascript/api/azure-maps-spatial-io
[Add a map layer from the Open Geospatial Consortium (OGC)]: spatial-io-add-ogc-map-layer.md
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps map control]: how-to-use-map-control.md
[azure-maps-spatial-io]: https://www.npmjs.com/package/azure-maps-spatial-io
[Core IO operations]: spatial-io-core-operations.md
[How to use the Azure Maps map control npm package]: how-to-use-npm-package.md
[Route66Attractions.xml]: https://samples.azuremaps.com/data/Gpx/Route66Attractions.xml
[Spatial IO module]: https://www.npmjs.com/package/azure-maps-spatial-io
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
