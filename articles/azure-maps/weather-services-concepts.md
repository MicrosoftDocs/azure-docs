---
title: Weather services concepts in Microsoft Azure Maps
description: Learn about the concepts that apply to Microsoft Azure Maps Weather services.
author: eriklindeman
ms.author: eriklind
ms.date: 09/10/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---

# Weather services in Azure Maps

This article introduces concepts that apply to Azure Maps [Weather services]. We recommend going through this article before starting out with the weather APIs.

## Unit types

Some of the Weather service APIs allow user to specify if the data is returned either in metric or in imperial units. The returned responses for these APIs include unitType and a numeric value that can be used for unit translations. See the following table to interpret these values.

|unitType|Description                 |
|--------|----------------------------|
|0       |feet                        |
|1       |inches                      |
|2       |miles                       |
|3       |millimeter                  |
|4       |centimeter                  |
|5       |meter                       |
|6       |kilometer                   |
|7       |kilometersPerHour           |
|8       |knots                       |
|9       |milesPerHour                |
|10      |metersPerSecond             |
|11      |hectoPascals                |
|12      |inchesOfMercury             |
|13      |kiloPascals                 |
|14      |millibars                   |
|15      |millimetersOfMercury        |
|16      |poundsPerSquareInch         |
|17      |celsius                     |
|18      |fahrenheit                  |
|19      |kelvin                      |
|20      |percent                     |
|21      |float                       |
|22      |integer                     |
|31      |MicrogramsPerCubicMeterOfAir|

## Weather icons

Some of the Weather service APIs return the `iconCode` in the response. The `iconCode` is a numeric value used to define the icon. Don't link directly to these images from your applications, the URLs can change.

| Icon Number |Icon| Day | Night | Text |
|-------------|:----:|-----|-------|------|
| 1           | :::image type="icon" source="./media/weather-services-concepts/sunny-i.png"::: | Yes |  No    | Sunny|
| 2           | :::image type="icon" source="./media/weather-services-concepts/mostly-sunny.png"::: | Yes |  No    | Mostly Sunny|
| 3           | :::image type="icon" source="./media/weather-services-concepts/partly-sunny.png"::: | Yes |  No    | Partly Sunny|
| 4           | :::image type="icon" source="./media/weather-services-concepts/intermittent-clouds.png"::: | Yes |  No    | Intermittent Clouds|
| 5           | :::image type="icon" source="./media/weather-services-concepts/hazy-sunshine.png"::: | Yes |  No    | Hazy Sunshine |
| 6           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy.png"::: | Yes |  No    | Mostly Cloudy|
| 7           | :::image type="icon" source="./media/weather-services-concepts/cloudy-i.png"::: | Yes |  Yes   | Cloudy |
| 8           | :::image type="icon" source="./media/weather-services-concepts/dreary-overcast.png"::: | Yes |  Yes   | Dreary (Overcast)|
| 11           | :::image type="icon" source="./media/weather-services-concepts/fog-i.png"::: | Yes |  Yes   | Fog|
| 12           | :::image type="icon" source="./media/weather-services-concepts/showers-i.png"::: | Yes |  Yes   | Showers|
| 13           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy-showers.png"::: | Yes |  No    | Mostly Cloudy with Showers|
| 14           | :::image type="icon" source="./media/weather-services-concepts/partly-sunny-showers.png"::: | Yes |  No    | Partly Sunny with Showers|
| 15           | :::image type="icon" source="./media/weather-services-concepts/tstorms-i.png"::: | Yes |  Yes   | Thunderstorms|
| 16           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy-tstorms.png"::: | Yes |  No    | Mostly Cloudy with Thunderstorms|
| 17           | :::image type="icon" source="./media/weather-services-concepts/partly-sunny-tstorms.png"::: | Yes |  No    | Partly Sunny with Thunderstorms|
| 18           | :::image type="icon" source="./media/weather-services-concepts/rain-i.png"::: | Yes |  Yes   | Rain|
| 19           | :::image type="icon" source="./media/weather-services-concepts/flurries-i.png"::: | Yes |  Yes   | Flurries|
| 20           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy-flurries.png"::: | Yes |  No    | Mostly Cloudy with Flurries|
| 21           | :::image type="icon" source="./media/weather-services-concepts/partly-sunny-flurries.png"::: | Yes |  No    | Partly Sunny with Flurries|
| 22           | :::image type="icon" source="./media/weather-services-concepts/snow-i.png"::: | Yes |  Yes   | Snow|
| 23           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy-snow.png"::: | Yes |  No    | Mostly Cloudy with Snow|     
| 24           | :::image type="icon" source="./media/weather-services-concepts/ice-i.png"::: | Yes |  Yes   | Ice |
| 25           | :::image type="icon" source="./media/weather-services-concepts/sleet-i.png"::: | Yes |  Yes   | Sleet|
| 26           | :::image type="icon" source="./media/weather-services-concepts/freezing-rain.png"::: | Yes |  Yes   | Freezing Rain|
| 29           | :::image type="icon" source="./media/weather-services-concepts/rain-snow.png"::: | Yes |  Yes   | Rain and Snow|
| 30           | :::image type="icon" source="./media/weather-services-concepts/hot-i.png"::: | Yes |  Yes   | Hot|
| 31           | :::image type="icon" source="./media/weather-services-concepts/cold-i.png"::: | Yes |  Yes   | Cold|
| 32           | :::image type="icon" source="./media/weather-services-concepts/windy-i.png"::: | Yes |  Yes   | Windy|
| 33           | :::image type="icon" source="./media/weather-services-concepts/clear-night.png"::: | No  |  Yes   | Clear|
| 34           | :::image type="icon" source="./media/weather-services-concepts/mostly-clear-night.png"::: | No  |  Yes   | Mostly Clear|
| 35           | :::image type="icon" source="./media/weather-services-concepts/partly-cloudy-night.png"::: | No  |  Yes   | Partly Cloudy|
| 36           | :::image type="icon" source="./media/weather-services-concepts/intermittent-clouds-Night.png"::: | No  |  Yes   | Intermittent Clouds|
| 37           | :::image type="icon" source="./media/weather-services-concepts/hazymoon-light.png"::: | No  |  Yes   | Hazy Moonlight|
| 38           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy-night.png"::: | No  |  Yes   | Mostly Cloudy|
| 39           | :::image type="icon" source="./media/weather-services-concepts/partly-cloudy-showers-night.png"::: | No  |  Yes   | Partly Cloudy with Showers|
| 40           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy-showers-night.png"::: | No  |  Yes   | Mostly Cloudy with Showers|
| 41           | :::image type="icon" source="./media/weather-services-concepts/partly-cloudy-tstorms-night.png"::: | No  |  Yes   | Partly Cloudy with Thunderstorms|
| 42           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy-tstorms-night.png"::: | No  |  Yes   | Mostly Cloudy with Thunderstorms|
| 43           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy-flurries-night.png"::: | No  |  Yes   | Mostly Cloudy with Flurries|
| 44           | :::image type="icon" source="./media/weather-services-concepts/mostly-cloudy-snow.png"::: | No  |  Yes   | Mostly Cloudy with Snow|

## Radar and satellite imagery color scale

Via [Get Map Tile v2 API] users can request latest radar and infrared satellite images. See the following guide to help interpret colors used for radar and satellite tiles.

### Radar Images

The following table provides guidance to interpret the radar images and create a map legend for Radar tile data.

| Hex color code | Color sample | Weather condition |
|----------------|--------------|-------------------|
| #93c701        | ![Color for rain-light.](./media/weather-services-concepts/color-93c701.png) | Rain-Light |
| #ffd701        | ![Color for rain-moderate.](./media/weather-services-concepts/color-ffd701.png) | Rain-Moderate |
| #f05514        | ![Color for rain-heavy.](./media/weather-services-concepts/color-f05514.png) | Rain-Heavy |
| #dc250e        | ![Color for rain-severe.](./media/weather-services-concepts/color-dc250e.png) | Rain-Severe |
| #9ec8f2        | ![Color for snow-light.](./media/weather-services-concepts/color-9ec8f2.png) | Snow-Light |
| #2a8fdb        | ![Color for snow-moderate.](./media/weather-services-concepts/color-2a8fdb.png) | Snow-Moderate |
| #144bed        | ![Color for snow-heavy.](./media/weather-services-concepts/color-144bed.png) | Snow-Heavy |
| #020096        | ![Color for snow-severe.](./media/weather-services-concepts/color-020096.png) | Snow-Severe |
| #e6a5c8        | ![Color for ice-light.](./media/weather-services-concepts/color-e6a5c8.png) | Ice-Light |
| #d24fa0        | ![Color for ice-moderate.](./media/weather-services-concepts/color-d24fa0.png) | Ice-Moderate |
| #b71691        | ![Color for ice-severe.](./media/weather-services-concepts/color-b71691.png) | Ice-Severe |
| #7a1570        | ![Color for ice-heavy.](./media/weather-services-concepts/color-7a1570.png) | Ice-Heavy |
| #c196e6        | ![Color for mix-light.](./media/weather-services-concepts/color-c196e6.png) | Mix-Light |
| #ae6ee6        | ![Color for mix-moderate.](./media/weather-services-concepts/color-ae6ee6.png) | Mix-Moderate |
| #8a32d7        | ![Color for mix-heavy.](./media/weather-services-concepts/color-8a32d7.png) | Mix-Heavy |
| #6500ba        | ![Color for mix-severe.](./media/weather-services-concepts/color-6500ba.png) | Mix-Severe |

Detailed color palette for radar tiles with Hex color codes and dBZ values is shown in the following table. dBZ represents precipitation intensity in weather radar.

| **RAIN**             | **ICE**              | **SNOW**              | **MIXED**             |
|----------------------|----------------------|-----------------------|-----------------------|
| **dBZ** **(color)**  | **dBZ** **(color)**  | **dBZ** **(color)**   | **dBZ** **(color)**   |
| 1.25       (#93C701) | 1.25       (#E6A5C8) | 1.25       (#9EC8F2)  | 1.25        (#C196E6) |
| 2.5        (#92C201) | 2.5        (#E6A2C6) | 2.5        (#98C5F0)  | 2.5         (#BF92E6) |
| 3.75       (#92BE01) | 3.75       (#E69FC5) | 3.75       (#93C3EF)  | 3.75        (#BD8EE6) |
| 5          (#92BA02) | 5          (#E69DC4) | 5          (#8DC1EE)  | 5           (#BB8BE6) |
| 6.25       (#92B502) | 6.25       (#E69AC2) | 6.25       (#88BFEC)  | 6.25        (#BA87E6) |
| 6.75       (#92B403) | 7.5       (#E697C1)  | 7.5        (#82BDEB)  | 7.5         (#B883E6) |
| 8          (#80AD02) | 8.75       (#E695C0) | 8.75       (#7DBAEA)  | 8.75        (#B680E6) |
| 9.25       (#6FA602) | 10         (#E692BE) | 10         (#77B8E8)  | 10          (#B47CE6) |
| 10.5       (#5EA002) | 11.25      (#E68FBD) | 11.25      (#72B6E7)  | 11.25       (#B378E6) |
| 11.75      (#4D9902) | 12.5       (#E68DBC) | 12.5       (#6CB4E6)  | 12.5        (#B175E6) |
| 12.25      (#479702) | 13.75      (#E68ABA) | 13.75      (#67B2E5)  | 13.75       (#AF71E6) |
| 13.5       (#3D9202) | 15         (#E687B9) | 15         (#61AEE4)  | 15          (#AE6EE6) |
| 14.75      (#338D02) | 16.25      (#E685B8) | 16.25      (#5BABE3)  | 16.25       (#AB6AE4) |
| 16         (#298802)  | 17.5       (#E682B6) | 17.5       (#56A8E2) | 17.5        (#A967E3) |
| 17.25      (#1F8302) | 18.75      (#E67FB5) | 18.75      (#50A5E1)  | 18.75       (#A764E2) |
| 17.75      (#1B8103) | 20         (#E67DB4) | 20         (#4BA2E0)  | 20          (#A560E1) |
| 19         (#187102) | 21.25      (#E275B0) | 21.25       (#459EDF) | 21.25       (#A35DE0) |
| 20.25      (#166102) | 22.5       (#DF6DAD) | 22.5       (#409BDE)  | 22.5        (#A15ADF) |
| 20.75      (#165B02) | 23.75      (#DC66AA) | 23.75      (#3A98DD)  | 23.75       (#9F56DE) |
| 22         (#135001) | 25         (#D85EA6) | 25         (#3595DC)  | 25          (#9D53DD) |
| 23.25      (#114501) | 26.25      (#D556A3) | 26.25      (#2F92DB)  | 26.25       (#9B50DC) |
| 24.5       (#0F3A01) | 27.5       (#D24FA0) | 27.5       (#2A8FDB)  | 27.5        (#9648DA) |
| 25.75      (#124C01) | 28.75      (#CE479E) | 28.75      (#2581DE)  | 28.75       (#9241D9) |
| 27         (#114401) | 30         (#CB409C) | 30         (#2173E2)  | 30          (#8E39D8) |
| 28.25      (#0F3D01) | 31.25      (#C7399A) | 31.25      (#1C66E5)  | 31.25       (#8A32D7) |
| 28.75      (#0F3A01) | 32.5       (#C43298) | 32.5       (#1858E9)  | 32.5        (#862ED2) |
| 30         (#375401) | 33.75      (#C12B96) | 33.75      (#144BED)  | 33.75       (#832BCE) |
| 31.25      (#5F6E01) | 35         (#BD2494) | 35         (#1348EA)  | 35          (#7F28C9) |
| 32.5       (#878801) | 36.25      (#BA1D92) | 36.25      (#1246E7)  | 36.25       (#7C25C5) |
| 33.75      (#AFA201) | 37.5       (#B71691) | 37.5       (#1144E4)  | 37.5        (#7822C1) |
| 35         (#D7BC01) | 38.75      (#B51690) | 38.75      (#1142E1)  | 38.75       (#751FBC) |
| 36.25      (#FFD701) | 40         (#B3168F) | 40         (#1040DE)  | 40          (#711CB8) |
| 37.5       (#FEB805) | 41.25      (#B1168E) | 41.25      (#0F3EDB)  | 41.25       (#6E19B4) |
| 38.75      (#FCAB06) | 42.5       (#AF168D) | 42.5       (#0F3CD8)  | 42.5        (#6D18B4) |
| 40         (#FA9E07) | 43.75      (#AD168C) | 43.75      (#0E3AD5)  | 43.75       (#6D17B4) |
| 41.25      (#F89209) | 45         (#AB168B) | 45         (#0D38D2)  | 45          (#6D16B4) |
| 42.5       (#F05514) | 46.25      (#A9168A) | 46.25      (#0C36CF)  | 46.25       (#6C15B4) |
| 43.75      (#E74111) | 47.5       (#A81689) | 47.5       (#0C34CC)  | 47.5        (#6C14B5) |
| 45         (#DF2D0F) | 48.75      (#A61688) | 48.75      (#0B32C9)  | 48.75       (#6C13B5) |
| 45.5       (#DC250E) | 50         (#A41687) | 50         (#0A30C6)  | 50          (#6B12B5) |
| 46.75      (#D21C0C) | 51.25      (#A21686) | 51.25      (#0A2EC4)  | 51.25       (#6B11B5) |
| 48         (#C9140A) | 52.5       (#A01685) | 52.5       (#092BC1)  | 52.5        (#6B10B6) |
| 49.25      (#BF0C09) | 53.75      (#9E1684) | 53.75      (#0929BF)  | 53.75       (#6A0FB6) |
| 50         (#BA0808) | 55         (#9C1683) | 55         (#0826BC)  | 55          (#6A0EB6) |
| 56.25      (#6f031b) | 56.25      (#9B1682) | 56.25      (#0824BA)  | 56.25       (#6A0DB6) |
| 57.5       (#9f0143) | 57.5       (#981580) | 57.5       (#0721B7)  | 57.5        (#690CB6) |
| 58.75      (#c10060) | 58.75      (#96157F) | 58.75      (#071FB5)  | 58.75       (#690CB7) |
| 60         (#e70086) | 60         (#94157E) | 60         (#071DB3)  | 60          (#690BB7) |
| 61.25      (#e205a0) | 61.25      (#92157D) | 61.25      (#061AB0)  | 61.25       (#680AB7) |
| 62.5       (#cc09ac) | 62.5       (#90157C) | 62.5       (#0618AE)  | 62.5        (#6809B7) |
| 63.75      (#b50eb7) | 63.75      (#8D157A) | 63.75      (#0515AB)  | 63.75       (#6808B8) |
| 65         (#9315c8) | 65         (#8B1579) | 65         (#0513A9)  | 65          (#6707B8) |
| 66.25      (#8f21cc) | 66.25      (#891578) | 66.25      (#0410A6)  | 66.25       (#6706B8) |
| 67.5       (#983acb) | 67.5       (#871577) | 67.5       (#040EA4)  | 67.5        (#6705B8) |
| 68.75      (#9d49cb) | 68.75      (#851576) | 68.75      (#040CA2)  | 68.75       (#6604B8) |
| 70         (#a661ca) | 70         (#821574) | 70         (#03099F)  | 70          (#6603B9) |
| 71.25      (#ad72c9) | 71.25      (#801573) | 71.25      (#03079D)  | 71.25       (#6602B9) |
| 72.5       (#b78bc6) | 72.5       (#7E1572) | 72.5       (#02049A)  | 72.5        (#6501B9) |
| 73.75      (#bf9bc4) | 73.75      (#7C1571) | 73.75      (#020298)  | 73.75       (#6500B9) |
| 75         (#c9b5c2) | 75         (#7A1570) | 75         (#020096)  | 75          (#6500BA) |

### Satellite Images

The following table  provides guidance to interpret the infrared satellite images showing clouds by their temperature and how to create a map legend for these tiles.

| Hex color code | Color sample | Cloud Temperature |
|----------------|--------------|-------------------|
| #b5b5b5        | ![Color tile for #b5b5b5.](./media/weather-services-concepts/color-b5b5b5.png) | Temperature-Low |
| #d24fa0        | ![Color tile for #d24fa0.](./media/weather-services-concepts/color-d24fa0.png) |  |
| #8a32d7        | ![Color tile for #8a32d7.](./media/weather-services-concepts/color-8a32d7.png) |  |
| #144bed        | ![Color tile for #144bed.](./media/weather-services-concepts/color-144bed.png) |  |
| #479702        | ![Color tile for #479702.](./media/weather-services-concepts/color-479702.png) |  |
| #72b403        | ![Color tile for #72b403.](./media/weather-services-concepts/color-72b403.png) |  |
| #93c701        | ![Color tile for #93c701.](./media/weather-services-concepts/color-93c701.png) |  |
| #ffd701        | ![Color tile for #ffd701.](./media/weather-services-concepts/color-ffd701.png) |  |
| #f05514        | ![Color tile for #f05514.](./media/weather-services-concepts/color-f05514.png) |  |
| #dc250e        | ![Color tile for #dc250e.](./media/weather-services-concepts/color-dc250e.png) |  |
| #ba0808        | ![Color tile for #ba0808.](./media/weather-services-concepts/color-ba0808.png) |  |
| #1f1f1f        | ![Color tile for #1f1f1f.](./media/weather-services-concepts/color-1f1f1f.png) | Temperature-High |

Detailed color palette for infrared satellite tiles is shown in the following table.

|**Temp (K)**|**Hex color code**|
|--------|--------------|
|198     |#fe050505     |
|198.43  |#fe120505     |
|198.87  |#fc1f0505     |
|199.3   |#fc2c0606     |
|199.74  |#fa390606     |
|200.17  |#fa460606     |
|200.61  |#f8530606     |
|201.04  |#f8600707     |
|201.48  |#f66c0707     |
|201.91  |#f6790707     |
|202.35  |#f4860707     |
|202.78  |#f4930707     |
|203.22  |#f2a00808     |
|203.65  |#f2ad0808     |
|204.09  |#f0ba0808     |
|204.52  |#f0bd0a09     |
|204.96  |#eec00d09     |
|205.39  |#eec30f0a     |
|205.83  |#ecc5120a     |
|206.26  |#ecc8140b     |
|206.7   |#eacb170b     |
|207.13  |#eace190c     |
|207.57  |#e8d11b0c     |
|208     |#e8d41e0d     |
|208.43  |#e6d6200d     |
|208.87  |#e6d9230e     |
|209.3   |#e4dc250e     |
|209.74  |#e4df2c0f     |
|210.17  |#e2e23310     |
|210.61  |#e2e53a11     |
|211.04  |#e0e73a11     |
|211.48  |#e0ea4712     |
|211.91  |#deed4e13     |
|212.35  |#def05514     |
|212.78  |#dcf15e13     |
|213.22  |#dcf26811     |
|213.65  |#daf37110     |
|214.09  |#daf47a0f     |
|214.52  |#d8f5830d     |
|214.96  |#d8f68d0c     |
|215.39  |#d6f8960b     |
|215.83  |#d6f99f09     |
|216.26  |#d4faa908     |
|216.7   |#d4fbb206     |
|217.13  |#d2fcbb05     |
|217.57  |#d2fdc404     |
|218     |#d0fece02     |
|218.43  |#d0ffd701     |
|218.87  |#cef8d601     |
|219.3   |#cef2d501     |
|219.74  |#ccebd401     |
|220.17  |#cce4d301     |
|220.61  |#caddd201     |
|221.04  |#cad7d101     |
|221.48  |#c8d0d001     |
|221.91  |#c8c9cf01     |
|222.35  |#c6c2ce01     |
|222.78  |#c6bccd01     |
|223.22  |#c4b5cc01     |
|223.65  |#c4aecb01     |
|224.09  |#c2a7ca01     |
|224.52  |#c2a1c901     |
|224.96  |#c09ac801     |
|225.39  |#c093c701     |
|225.83  |#be90c501     |
|226.26  |#be8ec401     |
|226.7   |#bc8bc202     |
|227.13  |#bc88c102     |
|227.57  |#ba85bf02     |
|228     |#ba83be02     |
|228.43  |#b880bc02     |
|228.87  |#b87dba02     |
|229.3   |#b678b703     |
|229.74  |#b675b603     |
|230.17  |#b472b403     |
|230.61  |#b46eb203     |
|231.04  |#b26bb203     |
|231.48  |#b267ad03     |
|231.97  |#b064aa03     |
|232.35  |#b060a803     |
|232.78  |#ae5da603     |
|233.22  |#ae59a302     |
|233.65  |#ac55a102     |
|234.09  |#ac529e02     |
|234.52  |#aa4e9c02     |
|234.96  |#aa4b9902     |
|235.39  |#a8479702     |
|235.83  |#a845940b     |
|236.26  |#a6439115     |
|236.7   |#a6418e1e     |
|237.13  |#a43f8b28     |
|237.57  |#a43d8831     |
|238     |#a23b853a     |
|238.43  |#a2398244     |
|238.87  |#a0377f4d     |
|239.3   |#a0357c57     |
|239.74  |#9e337960     |
|240.17  |#9e317669     |
|240.61  |#9c2f7373     |
|241.04  |#9c2c6f7c     |
|241.48  |#9a2a6c86     |
|241.91  |#9a28698f     |
|242.35  |#98266698     |
|242.78  |#982463a2     |
|243.22  |#962260ab     |
|243.65  |#96205db5     |
|244.09  |#941e5abe     |
|244.52  |#941c57c7     |
|244.85  |#921a54d1     |
|245.39  |#921851da     |
|245.83  |#90164ee4     |
|246.26  |#90144bed     |
|246.7   |#8e2148eb     |
|247.13  |#8e2e45e8     |
|247.57  |#8c3b43e6     |
|248     |#8c4840e3     |
|248.43  |#8a563de1     |
|248.87  |#8a633ade     |
|249.3   |#887038dc     |
|249.74  |#887d35d9     |
|250.17  |#868a32d7     |
|250.61  |#869034d2     |
|251.04  |#849637ce     |
|251.48  |#849c39c9     |
|251.91  |#82a23cc5     |
|252.35  |#82a83ec0     |
|252.78  |#80ae41bc     |
|253.22  |#80b443b7     |
|253.65  |#7eba45b2     |
|253.09  |#7ec048ae     |
|254.52  |#7cc64aa9     |
|254.96  |#7ccc4da5     |
|255.39  |#7ad24fa0     |
|255.83  |#7ad85fac     |
|256.26  |#78dd6eb8     |
|256.7   |#78e37ec4     |
|257.13  |#76e98ed0     |
|257.57  |#76ee9ddb     |
|258     |#74f4ade7     |
|258.43  |#74f9bcf3     |
|258.87  |#72ffccff     |
|259.3   |#71ffffff     |
|259.74  |#71fcfcfc     |
|260.17  |#6ff6f6f6     |
|260.61  |#6ff6f6f6     |
|261.04  |#6df3f3f3     |
|261.48  |#6df3f3f3     |
|261.91  |#6bededed     |
|262.35  |#6bededed     |
|262.78  |#69e7e7e7     |
|263.22  |#69e7e7e7     |
|263.65  |#67e1e1e1     |
|264.09  |#67e1e1e1     |
|264.52  |#65dedede     |
|264.96  |#65dedede     |
|265.39  |#63d8d8d8     |
|265.83  |#63d8d8d8     |
|265.84  |#61d1d1d1     |
|266.26  |#61d1d1d1     |
|267.13  |#5fcecece     |
|267.57  |#5fcecece     |
|268     |#5dc8c8c8     |
|268.43  |#5dc8c8c8     |
|268.87  |#5bc2c2c2     |
|269.3   |#5bc2c2c2     |
|269.74  |#59bcbcbc     |
|270.17  |#59bcbcbc     |
|270.61  |#57b9b9b9     |
|271.04  |#57b9b9b9     |
|271.48  |#55b3b3b3     |
|271.91  |#55b3b3b3     |
|272.35  |#53adadad     |
|272.78  |#53adadad     |
|273.22  |#51aaaaaa     |
|273.65  |#51aaaaaa     |
|274.09  |#4fa4a4a4     |
|274.52  |#4fa4a4a4     |
|274.96  |#4d9e9e9e     |
|275.39  |#4d9e9e9e     |
|275.83  |#4b989898     |
|276.26  |#4b989898     |
|276.7   |#49959595     |
|277.13  |#49959595     |
|277.57  |#478f8f8f     |
|278     |#478f8f8f     |
|278.43  |#45898989     |
|278.87  |#45898989     |
|279.2   |#43868686     |
|279.74  |#43868686     |
|280.17  |#417f7f7f     |
|280.61  |#417f7f7f     |
|281.04  |#3f797979     |
|281.48  |#3f797979     |
|281.91  |#3d737373     |
|282.35  |#3d737373     |
|282.78  |#3b707070     |
|283.22  |#3b707070     |
|283.65  |#396a6a6a     |
|284.09  |#396a6a6a     |
|284.52  |#37646464     |
|284.96  |#37646464     |
|285.39  |#35616161     |
|285.83  |#35616161     |
|286.26  |#335b5b5b     |
|286.7   |#335b5b5b     |
|287.13  |#31555555     |
|287.57  |#31555555     |
|288     |#2f4f4f4f     |
|288.43  |#2f4f4f4f     |
|288.87  |#2d4c4c4c     |
|289.3   |#2d4c4c4c     |
|289.74  |#2b464646     |
|290.17  |#2b464646     |
|290.61  |#29404040     |
|291.04  |#29404040     |
|291.48  |#273d3d3d     |
|291.91  |#273d3d3d     |
|292.35  |#25373737     |
|292.78  |#25373737     |
|293.22  |#23313131     |
|293.65  |#23313131     |
|294.09  |#212a2a2a     |
|294.52  |#212a2a2a     |
|294.96  |#1f272727     |
|295.39  |#1f272727     |
|295.83  |#1d212121     |
|296.26  |#1d212121     |
|296.7   |#1b1b1b1b     |
|297.13  |#1b1b1b1b     |
|297.57  |#19181818     |
|298     |#19181818     |
|298.43  |#17121212     |
|298.87  |#17121212     |
|299.3   |#150c0c0c     |
|299.74  |#150c0c0c     |
|300.17  |#13060606     |
|300.61  |#13060606     |
|301.04  |#11000000     |
|301.48  |#11000000     |
|301.91  |#0f797979     |
|302.35  |#0f797979     |
|302.78  |#0d737373     |
|303.22  |#0d737373     |
|303.65  |#0b6d6d6d     |
|304.09  |#0b6d6d6d     |
|304.52  |#09676767     |
|304.92  |#09676767     |
|305.39  |#07616161     |
|305.83  |#07616161     |
|306.26  |#055b5b5b     |
|306.7   |#055b5b5b     |
|307.13  |#02555555     |
|307.57  |#02555555     |
|308     |#00525252     |
|308     |#00525252     |

## Index IDs and Index Groups IDs

[Get Daily Indices API] allows users to restrict returned results to specific index types or index groups.

The following table lists the available index IDs, their names, and a link to their range sets. Below this table is a table listing the various index groups.

  Index Name |  ID  | Value Range
  -------------------------- |---|-----
  Arthritis Pain             |21 | [Beneficial-At Extreme Risk](#beneficial-at-extreme-risk)
  Asthma                     |23|  [Beneficial-At Extreme Risk](#beneficial-at-extreme-risk)
  Beach & Pool               |10| [Poor-Excellent 1](#poor-excellent-1)
  Bicycling                  |4| [Poor-Excellent 1](#poor-excellent-1)
  Common Cold                |25|  [Beneficial-At Extreme Risk](#beneficial-at-extreme-risk)
  Composting                 |38| [Poor-Excellent 1](#poor-excellent-1)
  Construction               |14| [Poor-Excellent 1](#poor-excellent-1)
  COPD                       |44|  [Beneficial-At Extreme Risk](#beneficial-at-extreme-risk)
  Dog Walking Comfort        |43| [Poor-Excellent 1](#poor-excellent-1)
  Driving                    |40|  [Poor-Excellent 2](#poor-excellent-2)
  Dust & Dander              |18| [Low-Extreme 1](#low-extreme-1)
  Field Readiness            |32| [Poor-Excellent 1](#poor-excellent-1)
  Fishing                    |13| [Poor-Excellent 1](#poor-excellent-1)
  Flight Delays              |-3|  [Very Unlikely-Very Likely 2](#very-unlikely-very-likely-2)
  Flu                        |26|  [Beneficial-At Extreme Risk](#beneficial-at-extreme-risk)
  Flying Travel Index        |31| [Excellent-Poor](#excellent-poor)
  Fuel Economy               |37| [Poor-Excellent 1](#poor-excellent-1)
  Golf Weather               |5| [Poor-Excellent 1](#poor-excellent-1)
  Grass Growing              |33| [Poor-Excellent 1](#poor-excellent-1)
  Hair Frizz                 |42| [Unlikely-Emergency](#unlikely-emergency)
  Healthy Heart Fitness      |16| [Poor-Excellent 1](#poor-excellent-1)
  Hiking                     |3| [Poor-Excellent 1](#poor-excellent-1)
  Home Energy Efficiency     |36| [Poor-Excellent 1](#poor-excellent-1)
  Hunting                    | 20| [Poor-Excellent 1](#poor-excellent-1)
  Indoor Activity            | -2| [Poor-Excellent 1](#poor-excellent-1)
  Jogging                    |2| [Poor-Excellent 1](#poor-excellent-1)
  Kite Flying                |9| [Poor-Excellent 1](#poor-excellent-1)
  Lawn Mowing                |28| [Poor-Excellent 1](#poor-excellent-1)
  Migraine Headache          |27|  [Beneficial-At Extreme Risk](#beneficial-at-extreme-risk)
  Morning School Bus         |35| [Poor-Excellent 1](#poor-excellent-1)
  Mosquito Activity          |17|[Low-Extreme 1](#low-extreme-1)
  Outdoor Activity           |29| [Poor-Excellent 1](#poor-excellent-1)
  Outdoor Barbecue           |24| [Poor-Excellent 1](#poor-excellent-1)
  Outdoor Concert            |8| [Poor-Excellent 1](#poor-excellent-1)
  Running                    |1|  [Poor-Excellent 1](#poor-excellent-1)
  Tennis                     |6| [Poor-Excellent 1](#poor-excellent-1)
  Thirst                     |41| [Low-Extreme 2](#low-extreme-2)
  Sailing                    |11| [Poor-Excellent 1](#poor-excellent-1)
  Shopping                   |39| [Poor-Excellent 1](#poor-excellent-1)
  Sinus Headache             |30|  [Beneficial-At Extreme Risk](#beneficial-at-extreme-risk)
  Skateboarding              | 7| [Poor-Excellent 1](#poor-excellent-1)
  Ski Weather                | 15| [Poor-Excellent 1](#poor-excellent-1)
  Snow Days                  | 19| [Very Unlikely-Very Likely](#very-unlikely-very-likely)
  Soil Moisture              | 34| [Poor-Excellent 1](#poor-excellent-1)
  Stargazing                 | 12| [Poor-Excellent 1](#poor-excellent-1)

The following table lists the available Index groups (indexGroupId):

  ID   | Group Name | Indices in this group |
  -------- | ------------------|------
  1       |All | All
  2       |Aches and Pains | Arthritis Pain (21) </br> Migraine Headache (27) </br> Sinus Headache (30)
  3       |Respiratory | Asthma (23) </br> Common Cold (25) </br> Flu Forecast (26)
  4       |Gardening | Field Readiness (32) </br> Lawn Mowing (28) </br> Soil Moisture (34)</br>
  5       |Environmental | Compositing (38) </br> Home Energy Efficiency (36) </br> Fuel Economy (37)
  6       |Outdoor Living | Outdoor Barbecue (24) </br> Mosquito Activity (17)
  7       |Beach and Marine | Beach & Pool (10) </br> Fishing (13) </br> Sailing (11)
  8       |Sportsman | Fishing (13) </br> Hunting (20) </br> Outdoor Activity (29)</br>
  9       |Farming |  Field Readiness (32) </br>  Soil Moisture (34)
  10      |Health | Arthritis Pain (21) </br> Asthma (23) </br> Common Cold (25) </br> Dust & Dander (18) </br> Flu (26) </br> Healthy Heart Fitness (16) </br> Migraine Headache (27)
  11      |Outdoor | Outdoor Barbecue (24) </br> Beach & Pool (10) </br> Bicycling (4) </br> Outdoor Concert (8) </br>  Field Readiness (32) </br> Fishing (13) </br> Golf Weather (5) </br> Hiking (3) </br> Hunting (20) </br> Jogging (2) </br> Kite Flying (9) </br> Mosquito Activity (17)</br> Lawn Mowing (28) </br> Outdoor Activity (29) </br> Running (1) </br> Sailing (11) </br> Skateboarding (7) </br> Ski Weather (15) </br>  Soil Moisture (34)</br> Stargazing (12) </br> Tennis (6)
  12      |Sporting | Bicycling (4) </br> Golf Weather (5) </br> Hiking (3) </br>  Jogging (2) </br> Running (1) </br> Skateboarding (7) </br> Ski Weather (15) </br>Tennis (6)
  13      |Home | Home Energy Efficiency (36) </br> Fuel Economy (37) </br> Indoor Activity (-2)

## Daily index range sets

[Get Daily Indices API] returns the ranged value and its associated category name for each index ID. Range sets aren't the same for all indices. The following tables show the various range sets used by the supported indices listed in [Index IDs and index groups IDs]. To find out which indices use which range sets, go to the [Index IDs and Index Groups IDs] section of this document.

### Poor-Excellent 1

  | Category Name | Begin Range | End Range |
  ----------------|-------------|------------
  Poor            |  0          |  2.99
  Fair            |  3          |  4.99
  Good            |  5          |  6.99
  Very Good       |  7          |  8.99
  Excellent       |  9          |  10

### Poor-Excellent 2

 | Category Name | Begin Range | End Range |
  ---------------|-------------|-----------
  Poor           | 0           |  3
  Fair           | 3.01        |  6
  Good           | 6.01        |  7.5
  Very Good      | 7.51        |  8.99
  Excellent      | 9           |  10

### Excellent-Poor

 | Category Name | Begin Range | End Range |
  ---------------|-------------|------------
  Excellent      |   0.00      |   1.00
  Very Good      |   1.01      |   3.00
  Good           |   3.01      |   5.00
  Fair           |   5.01      |   7.00
  Poor           |   7.01      |   10.00

### Low-Extreme 1

  | Category Name | Begin Range | End Range |
  ----------------|-------------|------------
  Low             |  0          |  1.99
  Moderate        |  2          |  3.99
  High            |  4          |  5.99
  Very High       |  6          |  7.99
  Extreme         |  8          |  10

### Low-Extreme 2

  | Category Name | Begin Range | End Range |
   ---------------|-------------|-----------
  Low             |  0          |  2.99
  Moderate        |  3          |  4.99
  High            |  5          |  6.99
  Very High       |  7          |  8.99
  Extreme         |  9          |  10

### Very Unlikely-Very Likely

 | Category Name | Begin Range | End Range |
  ---------------|-------------|-----------
  Very Unlikely  | 0           |   1.99
  Unlikely       | 2           |   3.99
  Possibly       | 4           |   5.99
  Likely         | 6           |   7.99
  Very Likely    | 8           |   10

### Very Unlikely-Very Likely 2

 | Category Name | Begin Range | End Range |
  ---------------|-------------|------------
  Very Unlikely  |  0.00       |    1.00
  Unlikely       |  1.01       |    3.00
  Possibly       |  3.01       |    5.00
  Likely         |  5.01       |    7.00
  Very Likely    |  7.01       |    10.00

### Unlikely-Emergency

| Category Name | Begin Range | End Range |
  --------------|-------------|-----------
  Unlikely      |  0          |     2.99
  Watch         |  3          |     4.99
  Advisory      |  5          |     6.99
  Warning       |  7          |     8.99
  Emergency     |  9          |     10

### Beneficial-At Extreme Risk

| Category Name   | Begin Range | End Range |
  ----------------|-------------|------------
  Beneficial      |    0        |   1.99
  Neutral         |    2        |   3.99
  At Risk         |    4        |   5.99
  At High Risk    |    6        |   7.99
  At Extreme Risk |    8        |   10

## Next steps

> [!div class="nextstepaction"]
> [Azure Maps Weather services frequently asked questions (FAQ)]

> [!div class="nextstepaction"]
> [Azure Maps Weather services coverage]

> [!div class="nextstepaction"]
> [Weather services API]

[Azure Maps Weather services coverage]: weather-coverage.md
[Azure Maps Weather services frequently asked questions (FAQ)]: weather-services-faq.yml
[Get Daily Indices API]: /rest/api/maps/weather
[Get Map Tile v2 API]: /rest/api/maps/render-v2/get-map-tile
[Index IDs and index groups IDs]: #index-ids-and-index-groups-ids
[Weather services API]: /rest/api/maps/weather
[Weather services]: /rest/api/maps/weather
