---
title: How to get information from an Azure Location Based Services' map coordinate | Microsoft Docs
description: Get information from a coordinate
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

# Get information from a coordinate

## Overview
This tutorial shows you how to perform a reverse address search, and upon a mouse click render the address of the clicked location in a popup. 

## Understand the code

<iframe height='532' scrolling='no' title='Get information from a coordinate' src='//codepen.io/azuremaps/embed/ddXzoB/?height=532&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ddXzoB/'>Get information from a coordinate</a> by Azure LBS (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](./map-create.md) for instructions.

The second block of code updates the style of mouse cursor to a pointer.

The third block of code creates a popup. You can see [add a popup on the map](./map-add-popup.md) for instructions.

The last code block adds an event listener for mouse clicks. Upon a mouse click, it sends an [XMLHttpRequest](https://xhr.spec.whatwg.org/) to [Azure Maps Reverse Address Search API](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchaddressreverse). For a successful response, it collects the address for the clicked location, and defines the popup content and position via [setPopupOptions](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest#location_based_services_javascript_Popup_setPopupOptions) function of the popup class

## Related reference
* [Azure Maps Reverse Address Search API](https://docs.microsoft.com/en-us/rest/api/location-based-services/search/getsearchaddressreverse)
* [Map](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest)
    * [addEventListener](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_addEventListener)
* [Popup](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest)
    * [setPopupOptions](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest#location_based_services_javascript_Popup_setPopupOptions)
    * [open](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest#location_based_services_javascript_Popup_open)
    * [close](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/popup?view=azure-iot-typescript-latest#location_based_services_javascript_Popup_close)
