---
title: Use the Azure Maps Indoor Maps module with Microsoft Creator services with custom styles (Public Preview)
description: Learn how to use the Microsoft Azure Maps Indoor Maps module to render maps by embedding the module's JavaScript libraries.
author: stevemunk
ms.author: v-munksteve
ms.date: 19/09/2022
ms.topic: how-to
ms.service: azure-maps
services: azure-maps

ms.custom: devx-track-js
---

# Use the Azure Maps Indoor Maps module with custom styles (Public Preview)

The Azure Maps Web SDK includes the *Azure Maps Indoor* module. The  *Azure Maps Indoor* module allows you to render indoor maps created in Azure Maps Creator services. When you create an indoor map using Azure Maps Creator, default styles are applied. Azure Maps Creator now also supports customizing your indoor styles via [Azure Maps Custom Styling REST APIs](https://review.learn.microsoft.com/en-us/rest/api/documentation-preview/style/create?view=azure-rest-preview&branch=result_openapiHub_production_a0998924c560&tabs=HTTP) //TODO: Change the previous link to the custom styling rest API tutorial. Creator also 
offers a visual editor to create custom styles: [Creator Style Editor](https://azure.github.io/Azure-Maps-Style-Editor/). 

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
1. [Create a Creator resource](how-to-manage-creator.md)
1. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
1. An Azure Maps Creator [map configuration][mapConfiguration] ID or alias. If you have never used Azure Maps Creator to create an indoor map, you might find the [Use Creator to create indoor maps][tutorial] tutorial helpful.

You'll need to use these identifiers to render indoor maps with custom styles via the Azure Maps Indoor Maps module

## Embed the Indoor Maps module

You can install and embed the *Azure Maps Indoor* module in one of two ways.

To use the globally hosted Azure Content Delivery Network version of the *Azure Maps Indoor* module, reference the following JavaScript and Style Sheet references in the `<head>` element of the HTML file:

```html
<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.css" type="text/css"/>
<script src="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.js"></script>
```

 Or, you can download the *Azure Maps Indoor* module. The *Azure Maps Indoor* module contains a client library for accessing Azure Maps services. Follow the steps below to install and load the *Indoor* module into your web application.  
  
  1. Install the latest [azure-maps-indoor package](https://www.npmjs.com/package/azure-maps-indoor).
  
      ```powershell
      >npm install azure-maps-indoor
      ```

  2. Reference the *Azure Maps Indoor* module JavaScript and Style Sheet in the `<head>` element of the HTML file:

      ```html
      <link rel="stylesheet" href="node_modules/azure-maps-indoor/dist/atlas-indoor.min.css" type="text/css" />
      <script src="node_modules/azure-maps-indoor/dist/atlas-indoor.min.js"></script>
      ```

## Set the domain and instantiate the Map object

Set the map domain with a prefix matching a location of your Creator resource: `atlas.setDomain('us.atlas.microsoft.com');` if your Creator resource has been created in US region, or `atlas.setDomain('eu.atlas.microsoft.com');` if your Creator resource has been created in EU region. Then, instantiate a *Map object* with a `mapConfiguration` option se to `mapConfigurationId` you have acquired earlier and `styleAPIVersion` set to `2022-09-01-preview`. 

The *Map object* will be used in the next step to instantiate the *Indoor Manager* object. The code below shows you how to instantiate the *Map object* with `mapConfiguration`, `styleAPIVersion` and map domain set:

```javascript
const subscriptionKey = "<Your Azure Maps Primary Subscription Key>";
const region = "<Your Creator resource region: us or eu>"    
atlas.setDomain(`${region}.atlas.microsoft.com`);

const map = new atlas.Map("map-id", {
  //use your facility's location
  center: [-122.13315, 47.63637],
  //or, you can use bounds: [# west, # south, # east, # north] and replace # with your Map bounds
  authOptions: { 
      authType: 'subscriptionKey',
      subscriptionKey: subscriptionKey
  },
  zoom: 19,

  mapConfiguration: mapConfigurationId,
  styleAPIVersion: '2022-09-01-preview'
});
```

## Instantiate the Indoor Manager

To load the indoor map style of the tiles, you must instantiate the *Indoor Manager*. Instantiate the *Indoor Manager* by providing the *Map object*. If you wish to support [dynamic map styling](indoor-map-dynamic-styling.md), you must pass the `statesetId`. The `statesetId` variable name is case-sensitive. Your code should like the JavaScript below.

```javascript
const statesetId = "<statesetId>";

const indoorManager = new atlas.indoor.IndoorManager(map, {
  statesetId: statesetId // Optional
});
```

To enable polling of state data you provide, you must provide the `statesetId` and call `indoorManager.setDynamicStyling(true)`. Polling state data lets you dynamically update the state of dynamic properties or *states*. For example, a feature such as room can have a dynamic property (*state*) called `occupancy`. Your application may wish to poll for any *state* changes to reflect the change inside the visual map. The code below shows you how to enable state polling:

```javascript
const statesetId = "<statesetId>";

const indoorManager = new atlas.indoor.IndoorManager(map, {
  statesetId: statesetId // Optional
});

if (statesetId.length > 0) {
    indoorManager.setDynamicStyling(true);
}
```

## Indoor Level Picker Control

 The *Indoor Level Picker* control allows you to change the level of the rendered map. You can optionally initialize the *Indoor Level Picker* control via the *Indoor Manager*. Here's the code to initialize the level control picker:

```javascript
const levelControl = new atlas.control.LevelControl({ position: "top-right" });
indoorManager.setOptions({ levelControl });
```

## Indoor Events

 The *Azure Maps Indoor* module supports *Map object* events. The *Map object* event listeners are invoked when a level or facility has changed. If you want to run code when a level or a facility have changed, place your code inside the event listener. The code below shows how event listeners can be added to the *Map object*.

```javascript
map.events.add("levelchanged", indoorManager, (eventData) => {

  //code that you want to run after a level has been changed
  console.log("The level has changed: ", eventData);
});

map.events.add("facilitychanged", indoorManager, (eventData) => {

  //code that you want to run after a facility has been changed
  console.log("The facility has changed: ", eventData);
});
```

The `eventData` variable holds information about the level or facility that invoked the `levelchanged` or `facilitychanged` event, respectively. When a level changes, the `eventData` object will contain the `facilityId`, the new `levelNumber`, and other metadata. When a facility changes, the `eventData` object will contain the new `facilityId`, the new `levelNumber`, and other metadata.

## Example: Custom Styling: Consume map configuration in WebSDK (Public Preview)

When you create an indoor map using Azure Maps Creator, default styles are applied. Azure Maps Creator now also supports customizing your indoor styles via [Azure Maps Custom Styling REST APIs](https://review.learn.microsoft.com/en-us/rest/api/documentation-preview/style/create?view=azure-rest-preview&branch=result_openapiHub_production_a0998924c560&tabs=HTTP) //TODO: Change the previous link to the custom styling rest API tutorial. Creator also 
offers a visual editor to create custom styles: [Creator Style Editor](https://azure.github.io/Azure-Maps-Style-Editor/). 

1. Please follow the guild at [Create custom styles for indoor maps](//TODO:LINK_HERE) (//TODO: Change the previous link to the styling rest API tutorial) to create your map configuration, then record your mapConfiguration id.

2. Use the Azure Content Delivery Network [option](#embed-the-indoor-maps-module) to install the *Azure Maps Indoor* module.

3. Create a new HTML file

4. In the HTML header, reference the *Azure Maps Indoor* module JavaScript and style sheet styles.

5. Set the map domain with a prefix matching a location of your Creator resource: `atlas.setDomain('us.atlas.microsoft.com');` if your Creator resource has been created in US region, or `atlas.setDomain('eu.atlas.microsoft.com');` if your Creator resource has been created in EU region.

6. Initialize a *Map object*. The *Map object* supports the following options:
    - `Subscription key` is your Azure Maps primary subscription key.
    - `center` defines a latitude and longitude for your indoor map center location. Provide a value for `center` if you don't want to provide a value for `bounds`. Format should appear as `center`: [-122.13315, 47.63637].
    - `bounds` is the smallest rectangular shape that encloses the tileset map data. Set a value for `bounds` if you don't want to set a value for `center`. You can find your map bounds by calling the [Tileset List API](/rest/api/maps/v2/tileset/list). The Tileset List API returns the `bbox`, which you can parse and assign to `bounds`. Format should appear as `bounds`: [# west, # south, # east, # north].
    - `mapConfiguration` is the id of map configuration that defines the custom styles you want to display on the map, use the map configuration id from the step 1. 
    - `style` allows you to set the initial style from your map configuration that will be displayed, if unset, the style matching map configuration's default configuration will be used.
    - `zoom` allows you to specify the min and max zoom levels for your map.
    - `styleAPIVersion`: pass **'2022-09-01-preview'** (which is required while Custom Styling is in public preview)

7. Next, create the *Indoor Manager* module with *Indoor Level Picker* control instantiated as part of *Indoor Manager* options, optionally set the `statesetId` option.

8. Add *Map object* event listeners.  

Your file should now look similar to the HTML below.

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      <title>Indoor Maps App</title>
      
      <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css" />
      <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/indoor/0.1/atlas-indoor.min.css" type="text/css"/>

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
        const subscriptionKey = "<Your Azure Maps Primary Subscription Key>";
        const mapConfigurationId = "<Your mapConfigurationId>";
        const statesetId = "<Your statesetId>";
        const region = "<Your Creator resource region: us or eu>"    
        atlas.setDomain(`${region}.atlas.microsoft.com`);

        const map = new atlas.Map("map-id", {
          //use your facility's location
          center: [-122.13315, 47.63637],
          //or, you can use bounds: [# west, # south, # east, # north] and replace # with your Map bounds
          authOptions: { 
              authType: 'subscriptionKey',
              subscriptionKey: subscriptionKey
          },
          zoom: 19,

          mapConfiguration: mapConfigurationId,
          styleAPIVersion: '2022-09-01-preview'
        });

        const levelControl = new atlas.control.LevelControl({
          position: "top-right",
        });

        const indoorManager = new atlas.indoor.IndoorManager(map, {
          levelControl: levelControl, //level picker
          statesetId: statesetId // Optional
        });

        if (statesetId.length > 0) {
          indoorManager.setDynamicStyling(true);
        }

        map.events.add("levelchanged", indoorManager, (eventData) => {
          //put code that runs after a level has been changed
          console.log("The level has changed:", eventData);
        });

        map.events.add("facilitychanged", indoorManager, (eventData) => {
          //put code that runs after a facility has been changed
          console.log("The facility has changed:", eventData);
        });
      </script>
    </body>
  </html>
  ```

To see your indoor map, load it into a web browser. It should appear like the image below. If you click on the stairwell feature, the *level picker* will appear in the upper right-hand corner.

  ![indoor map image](media/how-to-use-indoor-module/indoor-map-graphic.png)

[See live demo](https://samples.azuremaps.com/?sample=creator-indoor-maps)

## Next steps

Read about the APIs that are related to the *Azure Maps Indoor* module:

> [!div class="nextstepaction"]
> [Drawing package requirements](drawing-requirements.md)

>[!div class="nextstepaction"]
> [Creator for indoor maps](creator-indoor-maps.md)

Learn more about how to add more data to your map:

> [!div class="nextstepaction"]
> [Indoor Maps dynamic styling](indoor-map-dynamic-styling.md)

> [!div class="nextstepaction"]
> [Code samples](/samples/browse/?products=azure-maps)

[mapConfiguration]: /rest/api/maps/v20220901preview/mapconfiguration/