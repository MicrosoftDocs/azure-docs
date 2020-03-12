---
title: Getting started with Indoor Maps module | Microsoft Azure Maps
description: Learn how to use the Microsoft Azure Maps Indoor Maps module to render maps by embeddeding the module's JavaScript libraries.
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/12/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Use the Azure Maps map control

# Use the Azure Maps services module

The Azure Maps Web SDK provides an *Indoor Maps* module. This module offers extended functionalities to the Azure Maps *Maps Control* library. The Indoor Maps module makes it easy to render indoor maps and integrate the data in a web application. 

## Prerequisites 

You'll need to obtain a DWG file for an indoor map, upload your DWG package, and then convert the DWG package to map data. These steps are part of the [indoor data management process](). When you complete these steps, note your data set ID and tile set ID to use in the exercise of this article.

As in using any Azure Maps APIs, you'll need to have an [Azure Maps account]() and a[primary subscription key](). This key may also be referred to as the primary key or the subscription key.

## Embed the Indoor Maps module

You can load the Azure Maps Indoor Maps module in one of two ways.

- Use the globally hosted, Azure Content Delivery Network version of the Azure Maps Indoor Maps module. Reference the Indoor Module JavaScript and Style Sheet in the `<head>` element of the HTML file:

    ```html
    <script src="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.js"></script>
    <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.css"
    ```

- Alternatively, load the Indoor Maps module for the Azure Maps Web SDK locally by using the [azure-maps-rest](https://www.npmjs.com/package/azure-maps-rest) npm package, and then host it with your app. This package also includes TypeScript definitions. Use this command:

    > **npm install azure-maps-rest**

    Then, add a script reference to the `<head>` in the HTML file:

     ```html
    <script src="node_modules/azure-maps-rest/dist/atlas-indoor.min.js"></script>
     ```

## Indoor Manager

To load indoor tiles and the style of the tiles, you must instantiate the Indoor Manager by providing the map object and its corresponding tileset ID. You may optionally include the `stateSetId`, if you're using dynamic map styling. The code below shows you how to instantiate the indoor manager:

```javascript
const indoorManager = new atlas.indoor.IndoorManager(map, {
    tilesetId: "YOUR TILE SET ID HERE",
    stateSetId: "YOUR STATE SET ID HERE" // Optional
});
```

If you provide a `stateSetId`, you must call `indoorManager.setDynamicStyling(true);` to enable polling of state data. Polling the state data lets you dynamically update the state of the features. Recall, that we refer to feature properties as states, if the properties can be dynamically modified. For example, the color of a tile can be a state. The code below shows you how to enable state polling:

```javascript
const indoorManager = new atlas.indoor.IndoorManager(map, {
    tilesetId: "YOUR TILE SET ID HERE",
    stateSetId: "YOUR STATE SET ID HERE" // Optional
});

if (tilesetId.length > 0) {
    indoorManager.setDynamicStyling(true);
}

```

## Indoor Level Picker Control

You can optionally initialize the level control picker via the Indoor Manager. This option allows you to change the level of the rendered map. Here's the code to initialize the level control picker:

```javascript
const levelControl = new atlas.control.LevelControl({ position: "top-right" });
indoorManager.setOptions({ levelControl });
```

## Indoor Events

Because the Indoor Maps module is an extension of the Map Control, the Map Control events are still supported while using the Indoor Map. Additionally, the Indoor Map currently supports facility and level change events invoked by the IndoorManager. The event listeners can be added as shown below:

```javascript
map.events.add("levelchanged", indoorManager, (eventData) => {
    console.log("The level has changed: ", eventData);
});
map.events.add("facilitychanged", indoorManager, (eventData) => {
    console.log("The facility has changed: ", eventData);
});
```

## Use the Indoor Map Module

This exercise demonstrates how to integrate the Indoor Maps module with the Azure Maps Web SDK. Although the exercise is limited in scope, it covers the foundational knowledge to using the Indoor Maps module.

1. Create a new HTML file

2. Load the Indoor Maps module and use the CDN option.

    ```html
    <script src="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.js"></script>
    <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.css"
    ```

3. Initialize a map object, add style rules, and authenticate to your Azure Maps account. The HTML file similar to the HTML below. Use your primary key in the `<your Azure Maps Primary Subscription Key>` place holder. Alter the `center` option to use a latitude and longitude near your indoor map location. You may also change the map `style` option, the `blank` value shows the indoor map on a white background.

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <title>Indoor Maps App</title>

        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css" />
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.css" type="text/css" />

        <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>
        <script src="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.js"></script>
        <style>
          html,
          body {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
          }

          #map-id {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>

      <body>
        <div id="map-id"></div>
        <script>
          const subscriptionKey = "<your Azure Maps Primary Subscription Key>";

          const map = new atlas.Map("map-id", {
            center: [-122.13315, 47.63637],
            style: "blank",
            subscriptionKey,
            zoom: 19,
          });

        </script>
      </body>
    </html>
    ```

4. Add the Indoor Maps `tilesetId`, and optionally the `statesetId`. Enable polling, if you provide a state set id. Instantiate the Indoor Manager, Indoor Level Picker Control, and add the Indoor Map event listeners. This is how the HTML file would look like after completing the described steps:

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <title>Indoor Maps App</title>

        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css" />
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.css" type="text/css" />

        <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>
        <script src="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.js"></script>
        <style>
          html,
          body {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
          }

          #map-id {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>

      <body>
        <div id="map-id"></div>
        <script>
          const subscriptionKey = "<your Azure Maps Primary Subscription Key>";
          const tilesetId = "<your tile set id>";
          const stateSetId = "<your state set id>";

          const map = new atlas.Map("map-id", {
            center: [-122.13315, 47.63637],
            style: "blank",
            subscriptionKey,
            zoom: 19,
          });

          const levelControl = new atlas.control.LevelControl({
            position: "top-right",
          });

          const indoorManager = new atlas.indoor.IndoorManager(map, {
            levelControl,
            tilesetId,
            stateSetId,
          });

          if (tilesetId.length > 0) {
            indoorManager.setDynamicStyling(true);
          }

          map.events.add("levelchanged", indoorManager, (eventData) => {
            console.log("The level has changed:", eventData);
          });

          map.events.add("levelchanged", indoorManager, (eventData) => {
            console.log("The facility has changed:", eventData);
          });
        </script>
      </body>
    </html>
    ```

5. Remember to provide your primary key, tile set id, and optionally the state set id. Then, open your HTML file. You should be able to see the Indoor Map rendered in the web browser. The image below shows the indoor map for a single floor facility rendered on a white background:

    <center>

    ![indoor map image](media/how-to-use-indoor-module/indoor-map-image.png)

    </center>

## Next steps

Read about the APIs that are related to the Indoor Maps module:

> [!div class="nextstepaction"]
> [DWG package requirements](map-create.md)

> [!div class="nextstepaction"]
> [Indoor Maps data management](map-create.md)

Learn more about how to add more data to your map:

> [!div class="nextstepaction"]
> [Indoor Maps dynamic styling]()

> [!div class="nextstepaction"]
> [Code samples](https://docs.microsoft.com/samples/browse/?products=azure-maps)