---
title: Weather services concepts in Azure Maps | Microsoft Docs
description: Learn about weather services in Azure Maps
author: walsehgal
ms.author: v-musehg
ms.date: 10/30/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Weather services in Azure Maps

This article introduces concepts that apply to the [Azure Maps Weather Services](https://aka.ms/AzureMapsWeatherService). We recommend going through this article before starting out with the weather APIs. 


## Radar and satellite Imagery color scale

The latest radar and infrared satellite images can be requested via the **Get Map Tiles API**. The table below helps interpret colors used for the radar and satellite tiles.

| Hex color code | Color sample | Weather condition | Threshold |
|----------------|--------------|-------------------|-----------|
| #93c701        | ![](./media/weather-services-concepts/color-93c701.png) | Rain-Light | | 
| #ffd701        | ![](./media/weather-services-concepts/color-ffd701.png) | Rain | |
| #f05514        | ![](./media/weather-services-concepts/color-f05514.png) | Rain | |
| #dc250e        | ![](./media/weather-services-concepts/color-dc250e.png) | Rain-Severe | |
| #9ec8f2        | ![](./media/weather-services-concepts/color-9ec8f2.png) | Snow-Light | |
| #2a8fdb        | ![](./media/weather-services-concepts/color-2a8fdb.png) | Snow | |
| #144bed        | ![](./media/weather-services-concepts/color-144bed.png) | Snow | |
| #020096        | ![](./media/weather-services-concepts/color-020096.png) | Snow-Severe | |
| #e6a5c8        | ![](./media/weather-services-concepts/color-e6a5c8.png) | Ice | |
| #d24fa0        | ![](./media/weather-services-concepts/color-d24fa0.png) | Ice | |
| #b71691        | ![](./media/weather-services-concepts/color-b71691.png) | Ice | |
| #7a1570        | ![](./media/weather-services-concepts/color-7a1570.png) | Ice | |
| #c196e6        | ![](./media/weather-services-concepts/color-c196e6.png) | Mix | |
| #ae6ee6        | ![](./media/weather-services-concepts/color-ae6ee6.png) | Mix | |
| #8a32d7        | ![](./media/weather-services-concepts/color-8a32d7.png) | Mix | |
| #6500ba        | ![](./media/weather-services-concepts/color-6500ba.png) | Mix | |

