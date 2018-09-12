---
title: How to use the Azure Maps Map Control | Microsoft Docs 
description: Learn how to use the Azure Maps Map Control client-side Javascript library.
author: dsk-2015
ms.author: dkshir
ms.date: 09/05/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# How to use the Azure Maps Map Control
The Map Control client-side Javascript library allows you to render maps and embedded Azure Maps functionality into your web or mobile application. 

## Create a new map in a web page

You can embed a map in a web page by using the Map Control client-side Javascript library.

1. Create a new file and name it MapSearch.html.

2. Add the Azure Maps stylesheet and script source references to the `<head>` element of the file:

    ```html
    <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/css/atlas.min.css?api-version=1" type="text/css" />
    <script src="https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=1"></script>
    ```
    
3. In order to render a new map in your browser, add a **#map** reference in the `<style>` element.

    ```html
    #map {
                width: 100%;
                height: 100%;
            }
    ``` 
    
4. In order to initialize the map control, define a new section in the html body and create a script. Use your own Azure Maps account key in the script. If you need to create an account or find your key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md)

    ```html
    <div id="map">
        <script>
            var MapsAccountKey = "<_your account key_>";
            var map = new atlas.Map("map", {
                "subscription-key": MapsAccountKey,
                center: [-122.33263,47.59093],
                zoom: 12
            });
        </script>
    </div>
    ```
    
5. Open the file in your web browser and view the rendered map.

## Next steps

This article showed you how to create a basic map with your Azure Maps key. For more code examples to add to your maps, see the following articles: 

* [Create a map](map-create.md)
* [Choose a map style](choose-map-style.md)
