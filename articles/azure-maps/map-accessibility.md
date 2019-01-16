---
title: Making an accessible application with Azure Maps | Microsoft Docs
description: How to build an accessible application using Azure Maps
services: azure-maps
keywords: 
author: chgennar
ms.author: chgennar
ms.date: 09/17/2018
ms.topic: article
ms.service: azure-maps

documentationcenter: ''
manager: timlt
ms.devlang: na
---

# Building an accessible application

This article shows you how to build a map application that can be used by a screen reader.

## Understand the code

<iframe height='500' scrolling='no' title='Make an accessible application' src='//codepen.io/azuremaps/embed/ZoVyZQ/?height=504&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZoVyZQ/'>Make an accessible application</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The map comes prebuilt with accessibility features. Users can navigate the map using the keyboard. If a screen reader is running, the map will notify the user of changes to its state.
For example, users are notified of map changes when the map is panned or zoomed. Any additional information that is placed on the base map should have corresponding textual information for screen reader users.

Using [Popup](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest) is one way to achieve this. In the above search example, a popup with textual information is added to the map for every pin that is placed on the map. Using the [Popup's](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest) [attach](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest#attach) method allows the popup to be seen by a screen reader without visually displaying the popup on the map.

## Next steps

Learn more about the Popup class and its methods used in this article:

> [!div class="nextstepaction"]
> [Popup](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest)

Check out more code samples:

> [!div class="nextstepaction"]
> [Code sample page](https://aka.ms/AzureMapsSamples)
