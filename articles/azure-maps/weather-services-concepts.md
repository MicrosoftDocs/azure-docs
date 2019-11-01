---
title: Weather services concepts in Azure Maps | Microsoft Docs
description: Learn about weather service service in Azure Maps
author: walsehgal
ms.author: v-musehg
ms.date: 10/30/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

This article introduces concepts that apply to the [Azure Maps Weather Services](https://aka.ms/AzureMapsWeatherService). We recommend going through this article before starting out with the weather APIs. 


# Radar and satellite Imagery color scale

The latest radar and infrared satellite images can be requested via the **Get Map Tiles API**. The table below helps interpret colors used for the radar and satellite tiles.

| Hex color code | Color sample | Weather condition | Threshold |
|----------------|--------------|-------------------|-----------|
| #93c701        | ![](./media/weather-services-concepts/color-93c701.png) | Rain-Light | | 
| #ffd701        | ![](./media/weather-services-concepts/color-ffd701.png) | Rain | |

