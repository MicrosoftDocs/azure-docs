---
title: How to use the Azure Maps Map Control | Microsoft Docs 
description: Learn how to use the Azure Maps Map Control client-side Javascript library.
author: dsk-2015
ms.author: dkshir
ms.date: 10/08/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Use the Azure Maps Map Control

The Map Control client-side Javascript library allows you to render maps and embedded Azure Maps functionality into your web or mobile application.

## Create a new map in a web page

You can embed a map in a web page by using the Map Control client-side Javascript library.

1. Create a new file and name it **MapSearch.html**.

2. Add the Azure Maps stylesheet and script source references to the `<head>` element of the file:

    ```html
    <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/css/atlas.min.css?api-version=1" type="text/css" />
    <script src="https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=1"></script>
    ```

3. To render a new map in your browser, add a **#map** reference in the `<style>` element:

    ```html
    <style>
        #map {
            width: 100%;
            height: 100%;
        }
    </style>
    ```

4. To initialize the map control, define a new section in the html body and create a script. Use your own Azure Maps account key in the script. If you need to create an account or find your key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md). The **setLanguage** method specifies the language to be used for map labels and controls. For more information on supported languages, see [supported languages](https://docs.microsoft.com/azure/azure-maps/supported-languages).

    ```html
    <div id="map">
        <script>
            atlas.setSubscriptionKey("<_your account key_>");
            atlas.setLanguage("en");
            var map = new atlas.Map("map", {
                center: [-122.33263,47.59093],
                zoom: 12
            });
        </script>
    </div>
    ```

5. Open the file in your web browser and view the rendered map.

## Next steps

Learn how to create a map using a full example:

> [!div class="nextstepaction"]
> [Create a map](map-create.md)

Learn how to style a map:

> [!div class="nextstepaction"]
> [Choose a map style](choose-map-style.md)
