---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: How to use the Azure Location Based Services Map Control | Microsoft Docs 
description: Learn how to use the Azure Location Based Services Map Control client-side Javascript library.
services: location-based-services 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: philmea
ms.author: philmea
ms.date: 11/19/2017
ms.topic: how-tp
ms.service: location-based-services
manager: timlt
---

# How to use the Azure Location Based Services Map Control
The Map Control client-side Javascript library allows you to render maps and embedded Azure Location Based Services functionality into your web or mobile application. 

## Prerequisites
An Azure Location Based Services account and subscription key. For information on creating an account and retrieving a subscription key, see [How to manage your Azure Location Based Services account and keys](how-to-manage-account-keys.md). 

## Create a new map in a web page using the Map Control API
You can embed a map in a web page by using the Map Control client-side Javascript library.

1. Create a new file and name it MapSearch.html.

2. Add the Azure Location Based Services stylesheet and script source references to the `<head>` element of the file:

```html
<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/css/atlas.min.css?api-version=1.0" type="text/css" />
<script src="https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=1.0"></script>
```

3. In order to render a new map in your browser, add a **#map** reference in the `<style>` element.

```html
#map {
            width: 100%;
            height: 100%;
        }
``` 

4. In order to initialize the map control, define a new section in the html body and create a script. Use your own subscription key from your Azure Location Based Services account. 

```html
<div id="map">
    <script>
        var subscriptionKey = "<_subscriptionKey_>";
        var map = new atlas.Map("map", {
            "subscription-key": subscriptionKey,
            center: [47.59093,-122.33263],
            zoom: 12
        });
    <script>
<div>
```

5. Open the file in your web browser and view the rendered map.