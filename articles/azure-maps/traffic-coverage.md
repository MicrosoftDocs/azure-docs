---
title: Traffic coverage
titleSuffix: Microsoft Azure Maps
description: Learn about traffic coverage in Azure Maps. See whether information on traffic flow and incidents is available in various regions throughout the world.
author: eriklindeman
ms.author: eriklind
ms.date: 03/24/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---


# Azure Maps traffic coverage

The Azure Maps [Traffic service] is a suite of web services designed for developers to create web and mobile applications around real-time traffic. This data can be visualized on maps or used to generate smarter routes that factor in current driving conditions.

The following tables provide information about what kind of traffic information you can request from each country or region. If a market is missing in the following tables, it isn't currently supported.

- **Incidents**: Provides an accurate view about traffic jams and incidents around a road network.
- **Flow**: Provides real time observed speeds and travel times for all key roads in a network.

## Americas

| Country/Region | Incidents | Flow |
|----------------|:---------:|:----:|
| Argentina      |     ✓     |  ✓  |
| Brazil         |     ✓     |  ✓  |
| Canada         |     ✓     |  ✓  |
| Chile          |     ✓     |  ✓  |
| Colombia       |     ✓     |  ✓  |
| Guadeloupe     |     ✓     |  ✓  |
| Martinique     |     ✓     |  ✓  |
| Mexico         |     ✓     |  ✓  |
| Peru           |     ✓     |  ✓  |
| United States  |     ✓     |  ✓  |
| Uruguay        |     ✓     |  ✓  |

## Asia Pacific

| Country/Region | Incidents | Flow |
|----------------|:---------:|:----:|
| Australia      |     ✓     |  ✓  |
| Brunei         |     ✓     |  ✓  |
| Hong Kong      |     ✓     |  ✓  |
| India          |     ✓     |  ✓  |
| Indonesia      |     ✓     |  ✓  |
| Kazakhstan     |     ✓     |  ✓  |
| Macao          |     ✓     |  ✓  |
| Malaysia       |     ✓     |  ✓  |
| New Zealand    |     ✓     |  ✓  |
| Philippines    |     ✓     |  ✓  |
| Singapore      |     ✓     |  ✓  |
| Taiwan         |     ✓     |  ✓  |
| Thailand       |     ✓     |  ✓  |
| Vietnam        |     ✓     |  ✓  |

## Europe

| Country/Region         | Incidents | Flow |
|------------------------|:---------:|:----:|
| Belarus                |     ✓     |  ✓  |
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
| Russian Federation     |     ✓     |  ✓  |
| San Marino             |     ✓     |  ✓  |
| Serbia                 |     ✓     |  ✓  |
| Slovakia               |     ✓     |  ✓  |
| Slovenia               |     ✓     |  ✓  |
| Spain                  |     ✓     |  ✓  |
| Sweden                 |     ✓     |  ✓  |
| Switzerland            |     ✓     |  ✓  |
| Türkiye                |     ✓     |  ✓  |
| Ukraine                |     ✓     |  ✓  |
| United Kingdom         |     ✓     |  ✓  |

## Middle East & Africa

| Country/Region       | Incidents | Flow |
|----------------------|:---------:|:----:|
| Bahrain              |     ✓     |  ✓  |
| Egypt                |     ✓     |  ✓  |
| Israel               |     ✓     |  ✓  |
| Kenya                |     ✓     |  ✓  |
| Kuwait               |     ✓     |  ✓  |
| Lesotho              |     ✓     |  ✓  |
| Morocco              |     ✓     |  ✓  |
| Mozambique           |     ✓     |  ✓  |
| Nigeria              |     ✓     |  ✓  |
| Oman                 |     ✓     |  ✓  |
| Qatar                |     ✓     |  ✓  |
| Reunion              |     ✓     |  ✓  |
| Saudi Arabia         |     ✓     |  ✓  |
| South Africa         |     ✓     |  ✓  |
| United Arab Emirates |     ✓     |  ✓  |

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

[Traffic service]: /rest/api/maps/traffic
