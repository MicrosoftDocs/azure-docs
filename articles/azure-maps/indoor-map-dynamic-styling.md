---
title: Implement dynamic styling for Private Atlas Indoor Maps | Microsoft Azure Maps
description: Learn how to Implement dynamic styling for Private Atlas Indoor Maps
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/19/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Implement dynamic styling for Private Atlas Indoor Maps

Private Atlas makes it possible to develop applications based on your private indoor map data using Azure Maps API and SDK. Depending upon your business needs, you may want to render certain parts of the map data dynamically. For example, you may have indoor map data for a building with sensors collecting data and you wish to render meeting rooms with styles based on their occupancy state. The [Feature State API]() supports such scenarios in which the tileset features render according to their state that's defined at runtime. In this article we will discuss how to dynamically render indoor map features based on feature states associated with them using the Feature State API and Indoor Module module.

The Feature State Service lets you create and update the "state" of features included in a data set using Azure Maps Feature State REST API. When a web application built using the Azure Maps SDK and Indoor module makes use of Get Map Tile API to render indoor maps, you can further leverage the feature state service for dynamic styling. In particular, the Get State Tile API allows for control over the tileset style at the level of individual feature without the map rendering engine having to re-parse the underlying geometry and data. This offers a significant boost in performance, especially in scenarios when visualizing live data associated to indoor map features.

For the purpose of demonstration, we will exemplify an indoor map which includes meeting rooms rendered dynamically based on their occupancy status. The meeting rooms with the "occupied" state set to "true" will be rendered as red and those with a "false" state will be rendered green.

## Prerequisites

To calls Azure Maps APIs, [make an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account). This key may also be referred to as the primary key or the subscription key.

Obtain an Azure Maps account with Private Atlas enabled and an indoor map created using Private Atlas. The necessary steps are described in [make a Private Atlas account](how-to-manage-private-atlas.md) and [create an indoor map using Private Atlas](tutorial-private-atlas-indoor-maps.md). When you complete these steps, note your tile set identifier and feature state set identifier. You'll need to use these identifiers to render indoor maps with the Azure Maps Indoor Maps module.

Build a simple application using the Indoor Maps module, as demonstrated [here](how-to-use-indoor-module.md#use-the-indoor-maps-module). 

## h2

Once you complete following the prerequisites, you should have a simple web application. 

1. Make sure that you have dynamic styling enabled by calling:

```javascript
styleManager.setDynamicStyling(true);
```
