---
title: Weather services concepts in Azure Maps | Microsoft Docs
description: Learn about weather services in Azure Maps
author: walsehgal
ms.author: v-musehg
ms.date: 11/04/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Weather services in Azure Maps

This article introduces concepts that apply to the [Azure Maps Weather Services](https://aka.ms/AzureMapsWeatherService). We recommend going through this article before starting out with the weather APIs. 


## Radar and satellite Imagery color scale

The latest radar and infrared satellite images can be requested via the **Get Map Tiles API**. The table below helps interpret colors used for the radar and satellite tiles.

### Radar Images

The table below provides guidance to interpret the radar images and create a map legend for Radar tile data.

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

Detailed color palette for radar tiles with Hex color codes and Dbz values is showed below. Dbz represents precipitation intensity in weather radar. 

| **RAIN**                               | **ICE**                                | **SNOW**                               | **MIXED**                               |
|----------------------------------------|----------------------------------------|----------------------------------------|-----------------------------------------|
| **dbz** &nbsp; &nbsp; &nbsp; **color** | **dbz** &nbsp; &nbsp; &nbsp; **color** | **dbz** &nbsp; &nbsp; &nbsp; **color** | **dbz** &nbsp; &nbsp; &nbsp;  **color** |
| 1.25  &nbsp; &nbsp; &nbsp;   #93C701   | 1.25&nbsp; 	&nbsp; &nbsp;   #E6A5C8   | 1.25&nbsp; &nbsp; &nbsp;     #9EC8F2  | 1.25    	&nbsp; 	&nbsp;     #C196E6   |
| 2.5  &emsp;  #92C201   | 2.5  &nbsp; &nbsp; &nbsp;    #E6A2C6   | 2.5   &nbsp; &nbsp; &nbsp;   #98C5F0   | 2.5  &nbsp; &nbsp; &nbsp;     #BF92E6   |
| 3.75&nbsp; &nbsp; &nbsp;     #92BE01   | 3.75&nbsp; &nbsp; &nbsp;     #E69FC5   | 3.75&nbsp; &nbsp; &nbsp;     #93C3EF   | 3.75 &nbsp; &nbsp; &nbsp;     #BD8EE6   |
| 5&emsp;&nbsp;&nbsp;  #92BA02   | 5&nbsp; &nbsp; &nbsp;        #E69DC4   | 5 &nbsp; &nbsp; &nbsp;       #8DC1EE   | 5 &nbsp; &nbsp; &nbsp;        #BB8BE6   |
| 6.25 &nbsp; &nbsp; &nbsp;    #92B502   | 6.25  &nbsp; &nbsp; &nbsp;   #E69AC2   | 6.25 &nbsp; &nbsp; &nbsp;    #88BFEC   | 6.25 &nbsp; &nbsp; &nbsp;     #BA87E6   |
| 6.75  &nbsp; &nbsp; &nbsp;   #92B403   | 7.5  &nbsp; &nbsp; &nbsp;    #E697C1   | 7.5 &nbsp; &nbsp; &nbsp;     #82BDEB   | 7.5 &nbsp; &nbsp; &nbsp;      #B883E6   |
| 8  &emsp;&nbsp;&nbsp; #80AD02  | 8.75 &nbsp; &nbsp; &nbsp;    #E695C0   | 8.75  &nbsp; &nbsp; &nbsp;   #7DBAEA   | 8.75 &nbsp; &nbsp; &nbsp;     #B680E6   |
| 9.25 &nbsp; &nbsp; &nbsp;    #6FA602   | 10 &nbsp; &nbsp; &nbsp;      #E692BE   | 10  &nbsp; &nbsp; &nbsp;     #77B8E8   | 10   &nbsp; &nbsp; &nbsp;     #B47CE6   |
| 10.5 &nbsp; &nbsp; &nbsp;    #5EA002   | 11.25 &nbsp; &nbsp; &nbsp;   #E68FBD   | 11.25  &nbsp; &nbsp; &nbsp;  #72B6E7   | 11.25  &nbsp; &nbsp; &nbsp;   #B378E6   |
| 11.75 &nbsp; &nbsp;   #4D9902   | 12.5  &nbsp; &nbsp; &nbsp;   #E68DBC   | 12.5  &nbsp; &nbsp; &nbsp;   #6CB4E6   | 12.5 &nbsp; &nbsp; &nbsp;     #B175E6   |
| 12.25 &nbsp; &nbsp;   #479702   | 13.75 &nbsp; &nbsp; &nbsp;   #E68ABA   | 13.75 &nbsp; &nbsp; &nbsp;   #67B2E5   | 13.75 &nbsp; &nbsp; &nbsp;    #AF71E6   |
| 13.5 &nbsp; &nbsp; &nbsp;    #3D9202   | 15 &nbsp; &nbsp; &nbsp;      #E687B9   | 15 &nbsp; &nbsp; &nbsp;      #61AEE4   | 15 &nbsp; &nbsp; &nbsp;       #AE6EE6   |
| 14.75 &nbsp; &nbsp;   #338D02   | 16.25 &nbsp; &nbsp; &nbsp;   #E685B8   | 16.25 &nbsp; &nbsp; &nbsp;   #5BABE3   | 16.25  &nbsp; &nbsp; &nbsp;   #AB6AE4   |
| 16 &emsp;&nbsp;     #298802   | 17.5 &nbsp; &nbsp; &nbsp;    #E682B6   | 17.5  &nbsp; &nbsp; &nbsp;   #56A8E2   | 17.5  &nbsp; &nbsp; &nbsp;    #A967E3   |
| 17.25 &nbsp; &nbsp;   #1F8302   | 18.75 &nbsp; &nbsp; &nbsp;   #E67FB5   | 18.75 &nbsp; &nbsp; &nbsp;   #50A5E1   | 18.75 &nbsp; &nbsp; &nbsp;    #A764E2   |
| 17.75 &nbsp; &nbsp;   #1B8103   | 20 &nbsp; &nbsp; &nbsp;      #E67DB4   | 20  &nbsp; &nbsp; &nbsp;     #4BA2E0   | 20  &nbsp; &nbsp; &nbsp;      #A560E1   |
| 19  &emsp;&nbsp;     #187102   | 21.25 &nbsp; &nbsp; &nbsp;   #E275B0   | 21.25 &nbsp; &nbsp; &nbsp;    #459EDF  | 21.25 &nbsp; &nbsp; &nbsp;    #A35DE0   |
| 20.25 &nbsp; &nbsp;    #166102   | 22.5 &nbsp; &nbsp; &nbsp;    #DF6DAD   | 22.5 &nbsp; &nbsp; &nbsp;    #409BDE   | 22.5 &nbsp; &nbsp; &nbsp;     #A15ADF   |
| 20.75 &nbsp; &nbsp;   #165B02   | 23.75 &nbsp; &nbsp; &nbsp;   #DC66AA   | 23.75 &nbsp; &nbsp; &nbsp;   #3A98DD   | 23.75 &nbsp; &nbsp; &nbsp;    #9F56DE   |
| 22  &emsp;&nbsp;     #135001   | 25 &nbsp; &nbsp; &nbsp;      #D85EA6   | 25 &nbsp; &nbsp; &nbsp;      #3595DC   | 25 &nbsp; &nbsp; &nbsp;       #9D53DD   |
| 23.25&nbsp; &nbsp;    #114501   | 26.25 &nbsp; &nbsp; &nbsp;   #D556A3   | 26.25&nbsp; &nbsp; &nbsp;    #2F92DB   | 26.25&nbsp; &nbsp; &nbsp;     #9B50DC   |
| 24.5 &nbsp; &nbsp; &nbsp;    #0F3A01   | 27.5 &nbsp; &nbsp; &nbsp;    #D24FA0   | 27.5 &nbsp; &nbsp; &nbsp;    #2A8FDB   | 27.5 &nbsp; &nbsp; &nbsp;     #9648DA   |
| 25.75 &nbsp; &nbsp; &nbsp;   #124C01   | 28.75  &nbsp; &nbsp; &nbsp;  #CE479E   | 28.75 &nbsp; &nbsp; &nbsp;   #2581DE   | 28.75  &nbsp; &nbsp; &nbsp;   #9241D9   |
| 27  &emsp;&nbsp;     #114401   | 30 &nbsp; &nbsp; &nbsp;      #CB409C   | 30  &nbsp; &nbsp; &nbsp;     #2173E2   | 30 &nbsp; &nbsp; &nbsp;       #8E39D8   |
| 28.25  &nbsp; &nbsp;  #0F3D01   | 31.25 &nbsp; &nbsp; &nbsp;   #C7399A   | 31.25 &nbsp; &nbsp; &nbsp;   #1C66E5   | 31.25 &nbsp; &nbsp; &nbsp;    #8A32D7   |
| 28.75 &nbsp; &nbsp;   #0F3A01   | 32.5 &nbsp; &nbsp; &nbsp;    #C43298   | 32.5 &nbsp; &nbsp; &nbsp;    #1858E9   | 32.5 &nbsp; &nbsp; &nbsp;     #862ED2   |
| 30  &emsp;&nbsp;     #375401   | 33.75 &nbsp; &nbsp; &nbsp;   #C12B96   | 33.75 &nbsp; &nbsp; &nbsp;   #144BED   | 33.75  &nbsp; &nbsp; &nbsp;   #832BCE   |
| 31.25 &nbsp; &nbsp;   #5F6E01   | 35  &nbsp; &nbsp; &nbsp;     #BD2494   | 35  &nbsp; &nbsp; &nbsp;     #1348EA   | 35 &nbsp; &nbsp; &nbsp;       #7F28C9   |
| 32.5 &nbsp; &nbsp; &nbsp;    #878801   | 36.25 &nbsp; &nbsp; &nbsp;   #BA1D92   | 36.25 &nbsp; &nbsp; &nbsp;   #1246E7   | 36.25 &nbsp; &nbsp; &nbsp;    #7C25C5   |
| 33.75 &nbsp; &nbsp;  #AFA201   | 37.5 &nbsp; &nbsp; &nbsp;    #B71691   | 37.5 &nbsp; &nbsp; &nbsp;    #1144E4   | 37.5 &nbsp; &nbsp; &nbsp;     #7822C1   |
| 35 &emsp;&nbsp;     #D7BC01   | 38.75  &nbsp; &nbsp; &nbsp;  #B51690   | 38.75  &nbsp; &nbsp; &nbsp;  #1142E1   | 38.75  &nbsp; &nbsp; &nbsp;   #751FBC   |
| 36.25 &nbsp; &nbsp;   #FFD701   | 40  &nbsp; &nbsp; &nbsp;     #B3168F   | 40  &nbsp; &nbsp; &nbsp;     #1040DE   | 40  &nbsp; &nbsp; &nbsp;      #711CB8   |
| 37.5 &nbsp; &nbsp; &nbsp;    #FEB805   | 41.25 &nbsp; &nbsp; &nbsp;   #B1168E   | 41.25 &nbsp; &nbsp; &nbsp;   #0F3EDB   | 41.25  &nbsp; &nbsp; &nbsp;   #6E19B4   |
| 38.75 &nbsp; &nbsp;   #FCAB06   | 42.5 &nbsp; &nbsp; &nbsp;    #AF168D   | 42.5 &nbsp; &nbsp; &nbsp;    #0F3CD8   | 42.5  &nbsp; &nbsp; &nbsp;    #6D18B4   |
| 40 &emsp;&nbsp;    #FA9E07   | 43.75 &nbsp; &nbsp; &nbsp;   #AD168C   | 43.75 &nbsp; &nbsp; &nbsp;   #0E3AD5   | 43.75   &nbsp; &nbsp; &nbsp;  #6D17B4   |
| 41.25  &nbsp; &nbsp;  #F89209   | 45   &nbsp; &nbsp; &nbsp;    #AB168B   | 45   &nbsp; &nbsp; &nbsp;    #0D38D2   | 45  &nbsp; &nbsp; &nbsp;      #6D16B4   |
| 42.5  &nbsp; &nbsp; &nbsp;   #F05514   | 46.25  &nbsp; &nbsp; &nbsp;  #A9168A   | 46.25  &nbsp; &nbsp; &nbsp;  #0C36CF   | 46.25  &nbsp; &nbsp; &nbsp;   #6C15B4   |
| 43.75  &nbsp; &nbsp;  #E74111   | 47.5  &nbsp; &nbsp; &nbsp;   #A81689   | 47.5  &nbsp; &nbsp; &nbsp;   #0C34CC   | 47.5   &nbsp; &nbsp; &nbsp;   #6C14B5   |
| 45    &emsp;&nbsp;   #DF2D0F   | 48.75   &nbsp; &nbsp; &nbsp; #A61688   | 48.75   &nbsp; &nbsp; &nbsp; #0B32C9   | 48.75  &nbsp; &nbsp; &nbsp;    #6C13B5  |
| 45.5  &nbsp; &nbsp; &nbsp;   #DC250E   | 50  &nbsp; &nbsp; &nbsp;     #A41687   | 50    &nbsp; &nbsp; &nbsp;   #0A30C6   | 50   &nbsp; &nbsp; &nbsp;     #6B12B5   |
| 46.75  &nbsp; &nbsp;  #D21C0C   | 51.25  &nbsp; &nbsp; &nbsp;  #A21686   | 51.25  &nbsp; &nbsp; &nbsp;  #0A2EC4   | 51.25   &nbsp; &nbsp; &nbsp;  #6B11B5   |
| 48   &emsp;&nbsp;    #C9140A   | 52.5  &nbsp; &nbsp; &nbsp;   #A01685   | 52.5   &nbsp; &nbsp; &nbsp;  #092BC1   | 52.5   &nbsp; &nbsp; &nbsp;   #6B10B6   |
| 49.25  &nbsp; &nbsp;  #BF0C09   | 53.75  &nbsp; &nbsp; &nbsp;  #9E1684   | 53.75  &nbsp; &nbsp; &nbsp;  #0929BF   | 53.75  &nbsp; &nbsp; &nbsp;   #6A0FB6   |
| 50  &emsp;&nbsp;    #BA0808   | 55   &nbsp; &nbsp; &nbsp;    #9C1683   | 55   &nbsp; &nbsp; &nbsp;    #0826BC   | 55   &nbsp; &nbsp; &nbsp;     #6A0EB6   |
| 56.25  &nbsp; &nbsp;   #6f031b   | 56.25   &nbsp; &nbsp; &nbsp; #9B1682   | 56.25   &nbsp; &nbsp; &nbsp; #0824BA   | 56.25  &nbsp; &nbsp; &nbsp;   #6A0DB6   |
| 57.5  &nbsp; &nbsp; &nbsp;   #9f0143   | 57.5   &nbsp; &nbsp; &nbsp;  #981580   | 57.5  &nbsp; &nbsp; &nbsp;   #0721B7   | 57.5   &nbsp; &nbsp; &nbsp;   #690CB6   |
| 58.75  &nbsp; &nbsp; #c10060   | 58.75   &nbsp; &nbsp; &nbsp; #96157F   | 58.75  &nbsp; &nbsp; &nbsp;  #071FB5   | 58.75   &nbsp; &nbsp; &nbsp;  #690CB7   |
| 60  &emsp;&nbsp;    #e70086   | 60  &nbsp; &nbsp; &nbsp;     #94157E   | 60   &nbsp; &nbsp; &nbsp;    #071DB3   | 60   &nbsp; &nbsp; &nbsp;     #690BB7   |
| 61.25  &nbsp; &nbsp;   #e205a0   | 61.25  &nbsp; &nbsp; &nbsp;  #92157D   | 61.25  &nbsp; &nbsp; &nbsp;  #061AB0   | 61.25  &nbsp; &nbsp; &nbsp;   #680AB7   |
| 62.5   &nbsp; &nbsp; &nbsp;  #cc09ac   | 62.5   &nbsp; &nbsp; &nbsp;  #90157C   | 62.5   &nbsp; &nbsp; &nbsp;  #0618AE   | 62.5   &nbsp; &nbsp; &nbsp;   #6809B7   |
| 63.75  &nbsp; &nbsp;  #b50eb7   | 63.75  &nbsp; &nbsp; &nbsp;  #8D157A   | 63.75  &nbsp; &nbsp; &nbsp;  #0515AB   | 63.75   &nbsp; &nbsp; &nbsp;  #6808B8   |
| 65  &emsp;&nbsp;     #9315c8   | 65  &nbsp; &nbsp; &nbsp;     #8B1579   | 65   &nbsp; &nbsp; &nbsp;    #0513A9   | 65  &nbsp; &nbsp; &nbsp;      #6707B8   |
| 66.25  &nbsp; &nbsp;  #8f21cc   | 66.25  &nbsp; &nbsp; &nbsp;  #891578   | 66.25  &nbsp; &nbsp; &nbsp;  #0410A6   | 66.25  &nbsp; &nbsp; &nbsp;   #6706B8   |
| 67.5   &nbsp; &nbsp; &nbsp;  #983acb   | 67.5   &nbsp; &nbsp; &nbsp;  #871577   | 67.5  &nbsp; &nbsp; &nbsp;   #040EA4   | 67.5   &nbsp; &nbsp; &nbsp;   #6705B8   |
| 68.75   &nbsp; &nbsp; #9d49cb   | 68.75  &nbsp; &nbsp; &nbsp;  #851576   | 68.75  &nbsp; &nbsp; &nbsp;  #040CA2   | 68.75   &nbsp; &nbsp; &nbsp;  #6604B8   |
| 70   &emsp;&nbsp;   #a661ca   | 70   &nbsp; &nbsp; &nbsp;    #821574   | 70    &nbsp; &nbsp; &nbsp;   #03099F   | 70   &nbsp; &nbsp; &nbsp;     #6603B9   |
| 71.25  &nbsp; &nbsp;  #ad72c9   | 71.25   &nbsp; &nbsp; &nbsp; #801573   | 71.25  &nbsp; &nbsp; &nbsp;  #03079D   | 71.25  &nbsp; &nbsp; &nbsp;   #6602B9   |
| 72.5   &nbsp; &nbsp; &nbsp;  #b78bc6   | 72.5  &nbsp; &nbsp; &nbsp;   #7E1572   | 72.5  &nbsp; &nbsp; &nbsp;   #02049A   | 72.5  &nbsp; &nbsp; &nbsp;    #6501B9   |
| 73.75 &nbsp; &nbsp;   #bf9bc4   | 73.75  &nbsp; &nbsp; &nbsp;  #7C1571   | 73.75  &nbsp; &nbsp; &nbsp;  #020298   | 73.75  &nbsp; &nbsp; &nbsp;   #6500B9   |
| 75   &emsp;&nbsp;    #c9b5c2   | 75    &nbsp; &nbsp; &nbsp;   #7A1570   | 75  &nbsp; &nbsp; &nbsp;     #020096   | 75   &nbsp; &nbsp; &nbsp;     #6500BA   |


### Satellite Images

The table below provides guidance to interpret the infrared satellite images and create a map legend for Satellite tiles.

| Hex color code | Color sample | Weather condition | Threshold |
|----------------|--------------|-------------------|-----------|
| #b5b5b5        | ![](./media/weather-services-concepts/color-b5b5b5.png) | Clouds-Low | | 
| #d24fa0        | ![](./media/weather-services-concepts/color-d24fa0.png) | Clouds | |
| #8a32d7        | ![](./media/weather-services-concepts/color-8a32d7.png) | Clouds | |
| #144bed        | ![](./media/weather-services-concepts/color-144bed.png) | Clouds | |
| #479702        | ![](./media/weather-services-concepts/color-479702.png) | Clouds | |
| #72b403        | ![](./media/weather-services-concepts/color-72b403.png) | Clouds | |
| #93c701        | ![](./media/weather-services-concepts/color-93c701.png) | Clouds | |
| #ffd701        | ![](./media/weather-services-concepts/color-ffd701.png) | Clouds | |
| #f05514        | ![](./media/weather-services-concepts/color-f05514.png) | Clouds | |
| #dc250e        | ![](./media/weather-services-concepts/color-dc250e.png) | Clouds | |
| #ba0808        | ![](./media/weather-services-concepts/color-ba0808.png) | Clouds | |
| #1f1f1f        | ![](./media/weather-services-concepts/color-1f1f1f.png) | Clouds-High | |

## Unit types

Some of the Weather service APIs allow user to specify if the data is returned either in metric or in imperial units. The returned response for these APIs will also includes unitType, a numeric value that can be used for unit translations. Please see table below to interpret these values.

| Type               | Numeric Id | 
|--------------------|------------|
|feet                |0  |
|inches              |1  |
|miles               |2  |
|millimeter          |3  |
|centimeter          |4  |
|meter               |5  |
|kilometer           |6  |
|kilometersPerHour   |7  |
|knots               |8  |
|milesPerHour        |9  |
|metersPerSecond     |10 |
|hectoPascals        |11 |
|inchesOfMercury     |12 |
|kiloPascals         |13 |
|millibars           |14 |
|millimetersOfMercury|15 |
|poundsPerSquareInch |16 |
|celsius             |17 |
|fahrenheit          |18 |
|kelvin              |19 |
|percent             |20 |
|float               |21 |
|integer             |22 |
