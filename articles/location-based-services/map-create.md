---
title: How to create Azure Location Based Services' map | Microsoft Docs
description: Create a map
services: location-based-services
keywords: 
author: dsk-2015
ms.author: shubhaj
ms.date: 02/22/2018
ms.topic: tutorial
ms.service: location-based-services

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Create a map

## Overview
This tutorial shows you how to create a map.  

## Understand the code

There are two ways you can construct a map. You can set the camera of the map by specifying the center point and zoom level. Or you can set the camera bounds of the map by specifying the southwest bounding point and northeast bounding point.

<a id="setCameraOptions"></a>

### Setting the camera

<iframe height='227' scrolling='no' title='Create a map via CameraOptions' src='//codepen.io/azuremaps/embed/qxKBMN/?height=227&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qxKBMN/'>Create a map via CameraOptions</a> by Azure LBS (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, a [map object](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest) is created via new atlas.Map(). Map properties such as center and zoom level are part of [CameraOptions](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/cameraoptions?view=azure-iot-typescript-latest). CameraOptions can be defined in map constructor or via setCamera() function of the map class .

<a id="setCameraBoundsOptions"></a>

### Setting the camera bounds

<iframe height='265' scrolling='no' title='Create a map via CameraBoundsOptions' src='//codepen.io/azuremaps/embed/ZrRbPg/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZrRbPg/'>Create a map via CameraBoundsOptions</a> by Azure LBS (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, a [map object](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest) is constructed via new atlas.Map(). Map properties such as bounding box are part of [CameraBoundsOptions](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/cameraboundsoptions?view=azure-iot-typescript-latest). CameraBoundsOptions can be defined via setCameraBounds() function of the map class.

## Try out the code 

Take a look at the preceding sample code. You can edit the JavaScript code on the JS tab on the left and see the map view changes on the Result tab on the right. Alternatively, you can click on the “Edit on CodePen” button and edit the code in CodePen. 

<a id="relatedReference"></a>

## Related reference

To create a map, you need to use the following classes and methods:
* [Map](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest)
    * [setCamera](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_setCamera)
    * [setCameraBounds](https://docs.microsoft.com/en-us/javascript/api/location-based-services-javascript/map?view=azure-iot-typescript-latest#location_based_services_javascript_Map_setCameraBounds)


## Next steps 

To use Azure Maps, you must create an [Azure Maps account](https://azure.microsoft.com/free). Learn more about how to [create an account and get your API key](https://docs.microsoft.com/en-us/azure/location-based-services/how-to-manage-account-keys).
