---
title: Render coverage | Microsoft Azure Maps
description: Learn whether Azure Maps renders various regions with detailed or simplified data. See the level it uses for raster-tile and vector-tile maps in those regions.
author: stevemunk
ms.author: v-munksteve
ms.date: 01/14/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---


# Azure Maps render coverage

Azure Maps uses both raster tiles and vector tiles to create maps. At the lowest resolution, the entire world fits in a single tile. At the highest resolution, a single tile represents 38 square meters. You'll see more details about continents, regions, cities, and individual streets as you zoom in the map. For more information about tiles, see [Zoom levels and tile grid](zoom-levels-and-tile-grid.md).

However, Maps doesn't have the same level of information and accuracy for all regions. The following tables detail the level of information you can render for each region.

### Legend

| Symbol             | Meaning                                   |
|--------------------|-------------------------------------------|
|        ✓           | Country is provided with detailed data.   |
|        ◑           | Country is provided with simplified data. |
| Country is missing | Country data is not provided.             |

## Americas

| Country/Region                   | Coverage |
|----------------------------------|:--------:|
| Anguilla                         |     ✓    |
| Antigua & Barbuda                |     ✓    |
| Argentina                        |     ✓    |
| Aruba                            |     ✓    |
| Bahamas                          |     ✓    |
| Barbados                         |     ✓    |
| Bermuda                          |     ✓    |
| Bonaire, St Eustatius & Saba     |     ✓    |
| Brazil                           |     ✓    |
| British Virgin Islands           |     ✓    |
| Canada                           |     ✓    |
| Cayman Islands                   |     ✓    |
| Chile                            |     ✓    |
| Clipperton Island                |     ✓    |
| Colombia                         |     ✓    |
| Curaçao                          |     ✓    |
| Dominica                         |     ✓    |
| Falkland Islands                 |     ✓    |
| Grenada                          |     ✓    |
| Guadeloupe                       |     ✓    |
| Haiti                            |     ✓    |
| Jamaica                          |     ✓    |
| Martinique                       |     ✓    |
| Mexico                           |     ✓    |
| Montserrat                       |     ✓    |
| Peru                             |     ✓    |
| Puerto Rico                      |     ✓    |
| Saint Barthélemy                 |     ✓    |
| Saint Kitts & Nevis              |     ✓    |
| Saint Lucia                      |     ✓    |
| Saint Martin                     |     ✓    |
| Saint Pierre & Miquelon          |     ✓    |
| Saint Vincent & Grenadines       |     ✓    |
| Sint Maarten                     |     ✓    |
| South Georgia & Sandwich Islands |     ✓    |
| Trinidad & Tobago                |     ✓    |
| Turks & Caicos Islands           |     ✓    |
| U.S. Virgin Islands              |     ✓    |
| United States                    |     ✓    |
| Uruguay                          |     ✓    |
| Venezuela                        |     ✓    |

## Asia Pacific

| Country/Region | Coverage |
|----------------|:--------:|
| Australia      |    ✓     |
| Brunei         |    ✓     |
| Cambodia       |    ✓     |
| Guam           |    ✓     |
| Hong Kong      |    ✓     |
| India          |    ✓     |
| Indonesia      |    ✓     |
| Laos           |    ✓     |
| Macao          |    ✓     |
| Malaysia       |    ✓     |
| Myanmar        |    ✓     |
| New Zealand    |    ✓     |
| Philippines    |    ✓     |
| Singapore      |    ✓     |
| South Korea    |    ◑     |
| Taiwan         |    ✓     |
| Thailand       |    ✓     |
| Vietnam        |    ✓     |

## Europe

| Country/Region     | Coverage |
|--------------------|:--------:|
| Albania            |    ✓     |
| Andorra            |    ✓     |
| Austria            |    ✓     |
| Belarus            |    ✓     |
| Belgium            |    ✓     |
| Bosnia-Herzegovina |    ✓     |
| Bulgaria           |    ✓     |
| Croatia            |    ✓     |
| Cyprus             |    ✓     |
| Czech Republic     |    ✓     |
| Denmark            |    ✓     |
| Estonia            |    ✓     |
| Finland            |    ✓     |
| France             |    ✓     |
| Germany            |    ✓     |
| Gibraltar          |    ✓     |
| Greece             |    ✓     |
| Hungary            |    ✓     |
| Iceland            |    ✓     |
| Ireland            |    ✓     |
| Italy              |    ✓     |
| Latvia             |    ✓     |
| Liechtenstein      |    ✓     |
| Lithuania          |    ✓     |
| Luxembourg         |    ✓     |
| Macedonia          |    ✓     |
| Malta              |    ✓     |
| Moldova            |    ✓     |
| Monaco             |    ✓     |
| Montenegro         |    ✓     |
| Netherlands        |    ✓     |
| Norway             |    ✓     |
| Poland             |    ✓     |
| Portugal           |    ✓     |
| Romania            |    ✓     |
| Russian Federation |    ✓     |
| San Marino         |    ✓     |
| Serbia             |    ✓     |
| Slovakia           |    ✓     |
| Slovenia           |    ✓     |
| Spain              |    ✓     |
| Sweden             |    ✓     |
| Switzerland        |    ✓     |
| Turkey             |    ✓     |
| Ukraine            |    ✓     |
| United Kingdom     |    ✓     |
| Vatican City       |    ✓     |

## Middle East & Africa

| Country/Region               | Coverage |
|------------------------------|:--------:|
| Algeria                      |    ✓     |
| Angola                       |    ✓     |
| Bahrain                      |    ✓     |
| Benin                        |    ✓     |
| Botswana                     |    ✓     |
| Burkina Faso                 |    ✓     |
| Burundi                      |    ✓     |
| Cameroon                     |    ✓     |
| Congo                        |    ✓     |
| Democratic Republic of Congo |    ✓     |
| Egypt                        |    ✓     |
| Gabon                        |    ✓     |
| Ghana                        |    ✓     |
| Iraq                         |    ✓     |
| Jordan                       |    ✓     |
| Kenya                        |    ✓     |
| Kuwait                       |    ✓     |
| Lebanon                      |    ✓     |
| Lesotho                      |    ✓     |
| Malawi                       |    ✓     |
| Mali                         |    ✓     |
| Mauritania                   |    ✓     |
| Mauritius                    |    ✓     |
| Mayotte                      |    ✓     |
| Morocco                      |    ✓     |
| Mozambique                   |    ✓     |
| Namibia                      |    ✓     |
| Niger                        |    ✓     |
| Nigeria                      |    ✓     |
| Oman                         |    ✓     |
| Qatar                        |    ✓     |
| Reunion                      |    ✓     |
| Rwanda                       |    ✓     |
| Saudi Arabia                 |    ✓     |
| Senegal                      |    ✓     |
| South Africa                 |    ✓     |
| Swaziland                    |    ✓     |
| Tanzania                     |    ✓     |
| Togo                         |    ✓     |
| Tunisia                      |    ✓     |
| Uganda                       |    ✓     |
| United Arab Emirates         |    ✓     |
| Yemen                        |    ✓     |
| Zambia                       |    ✓     |
| Zimbabwe                     |    ✓     |

## Additional information

- See [Zoom levels and tile grid](zoom-levels-and-tile-grid.md) for more information about Azure Maps rendering.

- [Azure Maps routing service](routing-coverage.md).
