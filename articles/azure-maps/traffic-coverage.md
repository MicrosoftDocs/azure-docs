---
title: Azure Maps Traffic service coverage
titleSuffix: Microsoft Azure Maps
description: Learn about traffic coverage in Azure Maps. See whether information on traffic flow and incidents is available in various regions throughout the world.
author: farazgis
ms.author: fsiddiqui
ms.date: 10/02/2026
ms.topic: concept-article
ms.service: azure-maps
ms.subservice: traffic
---


# Azure Maps Traffic service coverage

The Azure Maps [Traffic service][latest] is a suite of web services designed for developers to create web and mobile applications around real-time traffic. This data can be visualized on maps or used to generate smarter routes that factor in current driving conditions.

The following tables provide information about what kind of traffic information you can request from each country or region. If a market is missing in the following tables, it isn't currently supported.

## Americas

| Country/Region | Incidents | Flow |
|----------------|:---------:|:----:|
| Argentina      |     ✓     |  ✓  |
| Brazil         |     ✓     |  ✓  |
| Canada         |     ✓     |  ✓  |
| Chile          |     ✓     |  ✓  |
| Colombia       |     ✓     |  ✓  |
| Guadeloupe<sup>1</sup> |   |     |
| Martinique<sup>1</sup> |   |     |
| Mexico         |     ✓     |  ✓  |
| Peru           |     ✓     |  ✓  |
| United States  |     ✓     |  ✓  |
| Uruguay<sup>2</sup> |   ✓  |  ✓  |

## Asia Pacific

| Country/Region | Incidents | Flow |
|----------------|:---------:|:----:|
| Australia      |     ✓     |  ✓  |
| Brunei<sup>1</sup> |           |     |
| Hong Kong SAR  |     ✓     |  ✓  |
| India          |     ✓     |  ✓  |
| Indonesia<sup>2</sup> |     ✓     |  ✓  |
| Japan<sup>2</sup> |     ✓     |  ✓  |
| Kazakhstan     |     ✓     |  ✓  |
| Macao SAR<sup>1</sup> |           |     |
| Malaysia<sup>2</sup> |     ✓     |  ✓  |
| New Zealand    |     ✓     |  ✓  |
| Philippines<sup>2</sup> |     ✓     |  ✓  |
| Singapore      |     ✓     |  ✓  |
| Taiwan<sup>2</sup> |     ✓     |  ✓  |
| Thailand<sup>2</sup> |     ✓     |  ✓  |
| Vietnam<sup>2</sup> |     ✓     |  ✓  |

## Europe

| Country/Region         | Incidents | Flow |
|------------------------|:---------:|:----:|
| Belarus<sup>1</sup>    |           |     |
| Belgium                |     ✓     |  ✓  |
| Bosnia and Herzegovina |     ✓     |  ✓  |
| Bulgaria               |     ✓     |  ✓  |
| Croatia                |     ✓     |  ✓  |
| Cyprus                 |     ✓     |  ✓  |
| Czech Republic         |     ✓     |  ✓  |
| Denmark                |     ✓     |  ✓  |
| Estonia                |     ✓     |  ✓  |
| Finland                |     ✓     |  ✓  |
| France                 |     ✓     |  ✓  |
| Germany                |     ✓     |  ✓  |
| Gibraltar              |     ✓     |  ✓  |
| Greece                 |     ✓     |  ✓  |
| Hungary                |     ✓     |  ✓  |
| Iceland                |     ✓     |  ✓  |
| Ireland                |     ✓     |  ✓  |
| Italy                  |     ✓     |  ✓  |
| Latvia                 |     ✓     |  ✓  |
| Liechtenstein          |     ✓     |  ✓  |
| Lithuania              |     ✓     |  ✓  |
| Luxembourg             |     ✓     |  ✓  |
| Malta                  |     ✓     |  ✓  |
| Monaco                 |     ✓     |  ✓  |
| Netherlands            |     ✓     |  ✓  |
| Norway                 |     ✓     |  ✓  |
| Poland                 |     ✓     |  ✓  |
| Portugal               |     ✓     |  ✓  |
| Romania                |     ✓     |  ✓  |
| Russia<sup>1</sup>     |           |     |
| San Marino             |     ✓     |  ✓  |
| Serbia                 |     ✓     |  ✓  |
| Slovakia               |     ✓     |  ✓  |
| Slovenia               |     ✓     |  ✓  |
| Spain                  |     ✓     |  ✓  |
| Sweden                 |     ✓     |  ✓  |
| Switzerland            |     ✓     |  ✓  |
| Türkiye                |     ✓     |  ✓  |
| Ukraine<sup>1</sup>    |           |     |
| United Kingdom         |     ✓     |  ✓  |

## Middle East & Africa

| Country/Region       | Incidents | Flow |
|----------------------|:---------:|:----:|
| Bahrain<sup>2</sup>  |     ✓     |  ✓  |
| Egypt                |     ✓     |  ✓  |
| Israel<sup>1</sup>   |           |     |
| Kenya                |     ✓     |  ✓  |
| Kuwait               |     ✓     |  ✓  |
| Lesotho              |     ✓     |  ✓  |
| Morocco<sup>2</sup>  |     ✓     |  ✓  |
| Mozambique           |     ✓     |  ✓  |
| Nigeria<sup>1</sup>  |           |     |
| Oman<sup>2</sup>     |     ✓     |  ✓  |
| Qatar                |     ✓     |  ✓  |
| Reunion<sup>1</sup>  |           |     |
| Saudi Arabia         |     ✓     |  ✓  |
| South Africa         |     ✓     |  ✓  |
| United Arab Emirates |     ✓     |  ✓  |

<sup>1</sup> Traffic service is temporarily unavailable because current traffic data doesn't meet quality requirements.

<sup>2</sup> Traffic service is available with reduced traffic-data volume.

## Next steps

See the following articles in the REST API documentation for detailed information.

> [!div class="nextstepaction"]
> [Get Traffic Incident](/rest/api/maps/traffic/get-traffic-incident)

<!---------------------------------------------------------------------------------------------
## Next steps

See the following articles in the REST API documentation for detailed information.

> [!div class="nextstepaction"]
> [Get Traffic Flow Segment](/rest/api/maps/traffic/get-traffic-flow-segment)

> [!div class="nextstepaction"]
> [Get Traffic Flow Tile](/rest/api/maps/traffic/get-traffic-flow-tile)

> [!div class="nextstepaction"]
> [Get Traffic Incident Detail](/rest/api/maps/traffic/get-traffic-incident-detail)

> [!div class="nextstepaction"]
> [Get Traffic Incident Tile](/rest/api/maps/traffic/get-traffic-incident-tile)

--------------------------------------------------------------------------------------------------->
