---
title: How to add a popup to Azure Location Based Services' map | Microsoft Docs
description: Add a popup
services: location-based-services
keywords: 
author: dsk-2015
ms.author: shubhaj
ms.date: 03/01/2018
ms.topic: tutorial
ms.service: location-based-services

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Add a popup on the map

## Overview
This tutorial shows you how to add a popup on a map.  

## Understand the code

<a id="addAPopup"></a>

<iframe height='401' scrolling='no' title='Add a popup to a map - ' src='//codepen.io/azuremaps/embed/zRyKxj/?height=401&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zRyKxj/'>Add a popup to a map - </a> by Azure LBS (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](./map-create.md) for instructions.

The second block of code creates a pin and add it to the map. You can see [add a pin on the map](./map-add-pin.md) for instructions.

The third block of code creates content to be displayed within a popup. Popup content is HTML element. 

The fourth block of code creates a [popup object](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest) via new atlas.Popup(). Popup properties such as content and position are part of [PopupOptions](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popupoptions?view=azure-iot-typescript-latest). PopupOptions can be defined in popup constructor or via [setPopupOptions()](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest#location_based_services_javascript_Popup_setPopupOptions) function of the popup class.

The last block of code uses [addEventListener()](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#addeventlistener) function of the map class to listen for mouseover event on the pins, and uses [open()](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest#location_based_services_javascript_Popup_open) function of the popup class to open the popup if the event occurs.


## Related reference

To add a pin to the map, you need to use the following classes:
* [Map](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest)
    * [addPins](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addPins)
    * [addEventListener](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addEventListener)
* [Popup](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest)
    * [setPopupOptions](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest#location_based_services_javascript_Popup_setPopupOptions)
    * [open](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest#location_based_services_javascript_Popup_open)
    * [close](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest#location_based_services_javascript_Popup_close)
