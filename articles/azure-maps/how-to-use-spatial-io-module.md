---
title: How to use the Azure Maps spatial IO module | Microsoft Azure Maps
description: 
author: farah-alyasari
ms.author: v-faalya
ms.date: 02/28/2020
ms.topic: 
ms.service: azure-maps
services: azure-maps
manager: philmea
---


# How to use the Azure Maps spatial IO module

The Azure Maps Web SDK provides a *spatial IO module* that makes it easy to integrate spatial data with the Azure Maps web SDK using JavaScript or TypeScript. Some of the features of this module include:

- Read and write common spatial files such as KML, KMZ, GPX, GeoRSS, GML, and delimited files with spatial columns (CSV).
- Connect to Open Geospatial Consortium (OGC) services and easily integrate with Azure Maps web SDK. Overlay Web Mapping Services (WMS) and Web Map Tile Services (WMTS) as layers on the map. Query data in a Web Feature Service (WFS).
- Easily overlay complex data sets that contain style information and have them render automatically. 
- Leverage high speed XML and delimited file reader and writer classes.

## Use the spatial IO module in a webpage

1. Create a new HTML file and [implement the map as usual](how-to-use-map-control.md).
2. Load the Azure Maps spatial IO module. You can load it in one of two ways:
    - Use the globally hosted, Azure Content Delivery Network version of the Azure Maps spatial IO module. Add a reference to the JavaScript file in the `<head>` element of the webpage:

        ```html
        <script src="https://atlas.microsoft.com/sdk/javascript/spatial/0/atlas-spatial.js"></script>
        ```

    - Or, you can load the spatial IO module for the Azure Maps Web SDK source code locally by using the [azure-maps-spatial-io](https://www.npmjs.com/package/azure-maps-spatial-io) npm package, and then host it with your app. This package also includes TypeScript definitions. Use this command:
    
        > **npm install azure-maps-spatial-io**
    
        Then, add a reference to the JavaScript file in the `<head>` element of the webpage:

         ```html
        <script src="node_modules/azure-maps-spatial-io/dist/atlas-spatial.min.js"></script>
         ```

3. The following code is a full . This demonstrates one of the many functionalities available in the spatial IO module.

	```html
	<!DOCTYPE html>
	<html>
	<head>
		<title></title>
	
		<meta charset="utf-8">

		<!-- Ensures that IE and Edge uses the latest version and doesn't emulate an older version -->
		<meta http-equiv="x-ua-compatible" content="IE=Edge">

		<!-- Ensures the web page looks good on all screen sizes. -->
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

		<!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
		<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css" />
		<script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.js"></script>

		<!-- Add reference to the Azure Maps Spatial IO module. -->
		<script src="https://atlas.microsoft.com/sdk/javascript/spatial/0/atlas-spatial.js"></script>

		<script type='text/javascript'>
			var map, datasource, layer;

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
				map.events.add('ready', function () {
			
					//Create a data source and add it to the map.
					datasource = new atlas.source.DataSource();
					map.sources.add(datasource);

					//Add a simple data layer for rendering the data.
					layer = new atlas.layer.SimpleDataLayer(datasource);
					map.layers.add(layer);

					//Read an XML file from a URL or pass in a raw XML string.
					atlas.io.read('superCoolKmlFile.xml').then(r => {
						if (r) {
							//Add the feature data to the data source.
							datasource.add(r);

							//If bounding box information is known for data, set the map view to it.
							if (r.bbox) {
								map.setCamera({ bounds: r.bbox, padding: 50 });
							}
						}
					});
				});
			}
		</script>
	</head>
	<body onload="GetMap()">
		<div id="myMap"></div>
	</body>
	</html>
	```

The following code shows how to easily load different types of spatial data files onto the map. 

//TODO: codepen - Spatial data examples (only show result tab like layer options examples)

Continue on to the next steps section to learn how to make use of the other functionalities in this module. 

## Next steps

See the following articles to learn more of the functionalities in the spatial IO module:

> [!div class="nextstepaction"]
> [Add a simple data layer](spatial-io-add-simple-data-layer.md)

> [!div class="nextstepaction"]
> [Read and write spatial data](spatial-io-read-write-spatial-data.md)

> [!div class="nextstepaction"]
> [Add an OGC map layer](spatial-io-add-ogc-map-layer.md)

> [!div class="nextstepaction"]
> [Connect to a WFS service](spatial-io-connect-wfs-service.md)

> [!div class="nextstepaction"]
> [Leverage core operations](spatial-io-core-operations.md)

> [!div class="nextstepaction"]
> [Supported data format details](spatial-io-supported-data-format-details.md)
