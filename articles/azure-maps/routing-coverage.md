---
title: Azure Maps Route service coverage
titleSuffix: Microsoft Azure Maps
description: Learn what level of coverage Azure Maps provides in various regions for routing, routing with traffic, and truck routing. 
author: farazgis
ms.author: fsiddiqui
ms.date: 06/12/2025
ms.topic: conceptual
ms.service: azure-maps
ms.subservice: routing
zone_pivot_groups: azure-maps-coverage
---

# Azure Maps Route service coverage

This article provides coverage information for the Azure Maps Route service. Upon a search query, Azure Maps returns an optimal route from location A to location B. You're provided with accurate travel times, live updates of travel information, and route instructions. You can also add more search parameters such as current traffic, vehicle type, and conditions to avoid. The optimization of the route depends on the region. That's because, Azure Maps has various levels of information and accuracy for different regions. The tables in this article list the regions and what kind of information you can request for them.

::: zone pivot="service-latest"

## Route directions

Route Directions API returns the ideal route between a start location, or origin, and an end location, or destination. You can choose to get a route for walking, automobile (driving) or commercial trucks. You can also request route details such as distance, estimated travel time, and step-by-step instructions to navigate the route.

For more information about the Route Directions API, see [Azure Maps Route Service] in the REST API documentation.

## Real-time Traffic

Delivers real-time information to show current traffic conditions, including congestion, accidents, road closures, and a detailed view of the current speed and travel times across the entire road network. For more information, see [Traffic service] in the REST API documentation.

## Route Matrix

The Matrix Routing service calculates travel time and distance between all possible pairs in a list of origins and destinations. It doesn't provide any detailed information about the routes. You can get one-to-many, many-to-one, or many-to-many route options simply by varying the number of origins and/or destinations. For more information, see [Matrix Routing service] in the REST API documentation.

## Route Range

The Route Range API generates a polygon that illustrates the area accessible from a specified location within a certain time or distance limit. For more information, see [Post Route Range](/rest/api/maps/route/post-route-range) in the REST API documentation.

## Snap to Roads

Snap to Roads processes GPS point data, represented by longitude and latitude coordinates, to generate points that align with existing roadways on a map. This process, known as "snapping to roads," creates a series of objects that trace a path closely following the road network. For more information, see [Post Snap To Roads](/rest/api/maps/route/post-snap-to-roads) in the REST API documentation.

::: zone-end

::: zone pivot="service-previous"
<!-----------------------------  ROUTING v1   ---------------------------------------------------------------------------->

## Calculate Route

The Calculate Route service calculates a route between an origin and a destination, passing through waypoints if they're specified. For more information, see [Get Route Directions] in the REST API documentation.

## Calculate Reachable Range

The Calculate Reachable Range service calculates a set of locations that can be reached from the origin point. For more information, see [Get Route Range] in the REST API documentation.

## Matrix Routing

The Matrix Routing service calculates travel time and distance between all possible pairs in a list of origins and destinations. It doesn't provide any detailed information about the routes. You can get one-to-many, many-to-one, or many-to-many route options simply by varying the number of origins and/or destinations. For more information, see [Matrix Routing service](/rest/api/maps/route/post-route-matrix?view=rest-maps-1.0) in the REST API documentation.

## Traffic

Delivers real-time information to show current traffic conditions, including congestion, accidents, road closures, and a detailed view of the current speed and travel times across the entire road network. For more information, see [Traffic service](/rest/api/maps/traffic?view=rest-maps-1.0) in the REST API documentation.

::: zone-end

## Truck routes

The Azure Maps Truck Routing API provides travel routes that take truck attributes into consideration. Truck attributes include things such as width, height, weight, turning radius and type of cargo. This is important as not all trucks can travel the same routes as other vehicles. Here are some examples:

- Bridges have heights and weight limits.
- Tunnels often have restrictions on flammable or hazardous materials.
- Longer trucks have difficulty making tight turns.
- Highways often have a separate speed limit for trucks.
- Certain trucks may want to avoid roads that have steep gradients.

Azure Maps supports truck routing in the countries/regions indicated in the following tables.

## Azure Maps Route service coverage tables

::: zone pivot="service-previous"

<!------------------------------------------------------------------
### Legend

| Symbol | Meaning                          |
|:------:|----------------------------------|
|   ✓    | Region has full routing data.    |
|   ◑    | Region has partial routing data. |
---------------------------------------------------------------->

The following tables provide coverage information for version 1 of the Azure Maps routing service:
<!-------------------------------ROUTING------------------------------------------------------------------------------->
### Americas

| Country/Region         | Calculate Route, Reachable Range & Matrix Routing | Real-time Traffic | Truck Route |
|----------------------------------------|:---------------------------------:|:-----------------:|:-----------:|
| Anguilla                               |                ✓                  |                   |             |
| Antigua & Barbuda                      |                ✓                  |                   |             |
| Argentina                              |                ✓                  |         ✓         |     ✓      |
| Aruba                                  |                ✓                  |                   |             |
| Bahamas                                |                ✓                  |                   |             |
| Barbados                               |                ✓                  |                   |             |
| Belize                                 |                ✓                  |                   |             |
| Bermuda                                |                ✓                  |                   |             |
| Bolivia                                |                ✓                  |                   |             |
| Bonaire, Sint Eustatius, & Saba        |                ✓                  |                   |             |
| Brazil                                 |                ✓                  |         ✓         |     ✓      |
| British Virgin Islands                 |                ✓                  |                   |             |
| Canada                                 |                ✓                  |         ✓         |     ✓      |
| Cayman Islands                         |                ✓                  |                   |             |
| Chile                                  |                ✓                  |         ✓         |             |
| Colombia                               |                ✓                  |         ✓         |             |
| Costa Rica                             |                ✓                  |                   |             |
| Cuba                                   |                ✓                  |                   |             |
| Curaçao                                |                ✓                  |                   |             |
| Dominica                               |                ✓                  |                   |             |
| Dominican Republic                     |                ✓                  |                   |             |
| Ecuador                                |                ✓                  |                   |             |
| El Salvador                            |                ✓                  |                   |             |
| Falkland Islands                       |                ✓                  |                   |             |
| French Guiana                          |                ✓                  |                   |             |
| Grenada                                |                ✓                  |                   |             |
| Guadeloupe                             |                ✓                  |                   |             |
| Guatemala                              |                ✓                  |                   |             |
| Guyana                                 |                ✓                  |                   |             |
| Haiti                                  |                ✓                  |                   |             |
| Honduras                               |                ✓                  |                   |             |
| Jamaica                                |                ✓                  |                   |             |
| Martinique                             |                ✓                  |                   |             |
| Mexico                                 |                ✓                  |         ✓         |     ✓      |
| Montserrat                             |                ✓                  |                   |             |
| Nicaragua                              |                ✓                  |                   |             |
| Panama                                 |                ✓                  |                   |             |
| Paraguay                               |                ✓                  |                   |             |
| Peru                                   |                ✓                  |         ✓         |             |
| Puerto Rico                            |                ✓                  |                   |             |
| Sint Maarten                           |                ✓                  |                   |             |
| South Georgia & South Sandwich Islands |                ✓                  |                   |             |
| St. Barthélemy                         |                ✓                  |                   |             |
| St. Kitts & Nevis                      |                ✓                  |                   |             |
| St. Lucia                              |                ✓                  |                   |             |
| St. Martin                             |                ✓                  |                   |             |
| St. Pierre & Miquelon                  |                ✓                  |                   |             |
| St. Vincent & Grenadines               |                ✓                  |                   |             |
| Suriname                               |                ✓                  |                   |             |
| Trinidad & Tobago                      |                ✓                  |                   |             |
| Turks & Caicos Islands                 |                ✓                  |                   |             |
| U.S. Virgin Islands                    |                ✓                  |                   |             |
| United States                          |                ✓                  |         ✓         |     ✓      |
| Uruguay                                |                ✓                  |         ✓         |     ✓      |
| Venezuela                              |                ✓                  |                   |             |

### Asia Pacific

| Country/Region         | Calculate Route, Reachable Range & Matrix Routing | Real-time Traffic | Truck Route |
|----------------------------------------|:---------------------------------:|:-----------------:|:-----------:|
| American Samoa                         |                ✓                  |                   |             |
| Australia                              |                ✓                  |         ✓         |     ✓      |
| Bangladesh                             |                ✓                  |                   |             |
| Bhutan                                 |                ✓                  |                   |             |
| Brunei                                 |                ✓                  |         ✓         |             |
| Cambodia                               |                ✓                  |                   |             |
| China                                  |                ✓                  |                   |             |
| Christmas Island                       |                ✓                  |                   |             |
| Cocos (Keeling) Islands                |                ✓                  |                   |             |
| Comoros                                |                ✓                  |                   |             |
| Cook Islands                           |                ✓                  |                   |             |
| Fiji                                   |                ✓                  |                   |             |
| French Polynesia                       |                ✓                  |                   |             |
| Guam                                   |                ✓                  |                   |             |
| Hong Kong SAR                          |                ✓                  |         ✓         |             |
| India                                  |                ✓                  |         ✓         |             |
| Indonesia                              |                ✓                  |         ✓         |     ✓      |
| Kiribati                               |                ✓                  |                   |             |
| Laos                                   |                ✓                  |                   |             |
| Macao SAR                              |                ✓                  |         ✓         |             |
| Malaysia                               |                ✓                  |         ✓         |      ✓     |
| Micronesia                             |                ✓                  |                   |             |
| Mongolia                               |                ✓                  |                   |             |
| Myanmar                                |                ✓                  |                   |             |
| Nauru                                  |                ✓                  |                   |             |
| Nepal                                  |                ✓                  |                   |             |
| New Caledonia                          |                ✓                  |                   |             |
| New Zealand                            |                ✓                  |         ✓         |     ✓      |
| Niue                                   |                ✓                  |                   |             |
| Norfolk Island                         |                ✓                  |                   |             |
| Northern Mariana Islands               |                ✓                  |                   |             |
| Pakistan                               |                ✓                  |                   |             |
| Palau                                  |                ✓                  |                   |             |
| Papua New Guinea                       |                ✓                  |                   |             |
| Philippines                            |                ✓                  |         ✓         |      ✓     |
| Pitcairn Islands                       |                ✓                  |                   |             |
| Samoa                                  |                ✓                  |                   |             |
| Singapore                              |                ✓                  |         ✓         |     ✓      |
| Solomon Islands                        |                ✓                  |                   |             |
| Sri Lanka                              |                ✓                  |                   |             |
| Taiwan                                 |                ✓                  |         ✓         |      ✓     |
| Thailand                               |                ✓                  |         ✓         |      ✓     |
| Timor-Leste                            |                ✓                  |                   |             |
| Tokelau                                |                ✓                  |                   |             |
| Tonga                                  |                ✓                  |                   |             |
| Tuvalu                                 |                ✓                  |                   |             |
| Vanuatu                                |                ✓                  |                   |             |
| Vietnam                                |                ✓                  |         ✓         |      ✓     |
| Wallis & Futuna                        |                ✓                  |                   |             |

### Europe

| Country/Region         | Calculate Route, Reachable Range & Matrix Routing | Real-time Traffic | Truck Route |
|----------------------------------------|:---------------------------------:|:-----------------:|:-----------:|
| Albania                                |                ✓                  |                   |     ✓       |
| Andorra                                |                ✓                  |         ✓         |     ✓      |
| Armenia                                |                ✓                  |                   |             |
| Austria                                |                ✓                  |         ✓         |     ✓      |
| Azerbaijan                             |                ✓                  |                   |             |
| Belarus                                |                ✓                  |         ✓         |             |
| Belgium                                |                ✓                  |         ✓         |     ✓      |
| Bosnia & Herzegovina                   |                ✓                  |         ✓         |     ✓      |
| Bouvet Island                          |                ✓                  |                   |             |
| Bulgaria                               |                ✓                  |         ✓         |     ✓      |
| Croatia                                |                ✓                  |         ✓         |     ✓      |
| Cyprus                                 |                ✓                  |                   |     ✓       |
| Czech Republic                         |                ✓                  |         ✓         |     ✓      |
| Denmark                                |                ✓                  |         ✓         |     ✓      |
| Estonia                                |                ✓                  |         ✓         |     ✓      |
| Faroe Islands                          |                ✓                  |                   |             |
| Finland                                |                ✓                  |         ✓         |     ✓      |
| France                                 |                ✓                  |         ✓         |     ✓      |
| Georgia                                |                ✓                  |                   |             |
| Germany                                |                ✓                  |         ✓         |     ✓      |
| Gibraltar                              |                ✓                  |         ✓         |     ✓      |
| Greece                                 |                ✓                  |         ✓         |     ✓      |
| Greenland                              |                ✓                  |                   |             |
| Guernsey                               |                ✓                  |                   |             |
| Hungary                                |                ✓                  |         ✓         |     ✓      |
| Iceland                                |                ✓                  |         ✓         |             |
| Ireland                                |                ✓                  |         ✓         |     ✓      |
| Isle of Man                            |                ✓                  |                   |             |
| Italy                                  |                ✓                  |         ✓         |     ✓      |
| Jersey                                 |                ✓                  |                   |             |
| Kazakhstan                             |                ✓                  |         ✓         |             |
| Kyrgyzstan                             |                ✓                  |                   |             |
| Latvia                                 |                ✓                  |         ✓         |     ✓      |
| Liechtenstein                          |                ✓                  |         ✓         |     ✓      |
| Lithuania                              |                ✓                  |         ✓         |     ✓      |
| Luxembourg                             |                ✓                  |         ✓         |     ✓      |
| Malta                                  |                ✓                  |         ✓         |     ✓      |
| Moldova                                |                ✓                  |                   |             |
| Monaco                                 |                ✓                  |         ✓         |     ✓      |
| Montenegro                             |                ✓                  |                   |     ✓       |
| Netherlands                            |                ✓                  |         ✓         |     ✓      |
| North Macedonia                        |                ✓                  |                   |             |
| Norway                                 |                ✓                  |         ✓         |     ✓      |
| Poland                                 |                ✓                  |         ✓         |     ✓      |
| Portugal                               |                ✓                  |         ✓         |     ✓      |
| Romania                                |                ✓                  |         ✓         |     ✓      |
| Russia                                 |                ✓                  |         ✓         |     ✓      |
| San Marino                             |                ✓                  |         ✓         |     ✓      |
| Serbia                                 |                ✓                  |         ✓         |     ✓      |
| Slovakia                               |                ✓                  |         ✓         |     ✓      |
| Slovenia                               |                ✓                  |         ✓         |     ✓      |
| Spain                                  |                ✓                  |         ✓         |     ✓      |
| Sweden                                 |                ✓                  |         ✓         |     ✓      |
| Switzerland                            |                ✓                  |         ✓         |     ✓      |
| Tajikistan                             |                ✓                  |                   |             |
| Türkiye                                |                ✓                  |         ✓         |     ✓      |
| Turkmenistan                           |                ✓                  |                   |             |
| Ukraine                                |                ✓                  |         ✓         |             |
| United Kingdom                         |                ✓                  |         ✓         |     ✓      |
| Uzbekistan                             |                ✓                  |                   |             |
| Vatican City                           |                ✓                  |         ✓         |     ✓      |

### Middle East & Africa

| Country/Region         | Calculate Route, Reachable Range & Matrix Routing | Real-time Traffic | Truck Route |
|----------------------------------------|:---------------------------------:|:-----------------:|:-----------:|
| Afghanistan                            |                ✓                  |                   |             |
| Algeria                                |                ✓                  |                   |             |
| Angola                                 |                ✓                  |                   |             |
| Bahrain                                |                ✓                  |         ✓         |             |
| Benin                                  |                ✓                  |                   |             |
| Botswana                               |                ✓                  |                   |             |
| Burkina Faso                           |                ✓                  |                   |             |
| Burundi                                |                ✓                  |                   |             |
| Cameroon                               |                ✓                  |                   |             |
| Cabo Verde                             |                ✓                  |                   |             |
| Central African Republic               |                ✓                  |                   |             |
| Chad                                   |                ✓                  |                   |             |
| Congo                                  |                ✓                  |                   |             |
| Congo (DRC)                            |                ✓                  |                   |             |
| Côte d'Ivoire                          |                ✓                  |                   |             |
| Djibouti                               |                ✓                  |                   |             |
| Egypt                                  |                ✓                  |         ✓         |             |
| Equatorial Guinea                      |                ✓                  |                   |             |
| Eritrea                                |                ✓                  |                   |             |
| Ethiopia                               |                ✓                  |                   |             |
| French Southern Territories            |                ✓                  |                   |             |
| Gabon                                  |                ✓                  |                   |             |
| Gambia                                 |                ✓                  |                   |             |
| Ghana                                  |                ✓                  |                   |             |
| Guinea                                 |                ✓                  |                   |             |
| Guinea-Bissau                          |                ✓                  |                   |             |
| Iran                                   |                ✓                  |                   |             |
| Iraq                                   |                ✓                  |                   |             |
| Israel                                 |                ✓                  |         ✓         |      ✓     |
| Jordan                                 |                ✓                  |                   |             |
| Kenya                                  |                ✓                  |         ✓         |             |
| Kuwait                                 |                ✓                  |         ✓         |             |
| Lebanon                                |                ✓                  |                   |             |
| Lesotho                                |                ✓                  |         ✓         |             |
| Liberia                                |                ✓                  |                   |             |
| Libya                                  |                ✓                  |                   |             |
| Madagascar                             |                ✓                  |                   |             |
| Malawi                                 |                ✓                  |                   |             |
| Maldives                               |                ✓                  |                   |             |
| Mali                                   |                ✓                  |                   |             |
| Marshall Islands                       |                ✓                  |                   |             |
| Mauritania                             |                ✓                  |                   |             |
| Mauritius                              |                ✓                  |                   |             |
| Mayotte                                |                ✓                  |                   |             |
| Morocco                                |                ✓                  |         ✓         |             |
| Mozambique                             |                ✓                  |         ✓         |             |
| Namibia                                |                ✓                  |                   |             |
| Niger                                  |                ✓                  |                   |             |
| Nigeria                                |                ✓                  |         ✓         |             |
| Oman                                   |                ✓                  |         ✓         |             |
| Qatar                                  |                ✓                  |         ✓         |             |
| Réunion                                |                ✓                  |                   |             |
| Rwanda                                 |                ✓                  |                   |             |
| São Tomé & Príncipe                    |                ✓                  |                   |             |
| Saudi Arabia                           |                ✓                  |         ✓         |             |
| Senegal                                |                ✓                  |                   |             |
| Seychelles                             |                ✓                  |                   |             |
| Sierra Leone                           |                ✓                  |                   |             |
| Somalia                                |                ✓                  |                   |             |
| South Africa                           |                ✓                  |         ✓         |      ✓     |
| South Sudan                            |                ✓                  |                   |             |
| St. Helena, Ascension, and Tristan da Cunha |           ✓                  |                   |             |
| Sudan                                  |                ✓                  |                   |             |
| Swaziland                              |                ✓                  |                   |             |
| Syria                                  |                ✓                  |                   |             |
| Tanzania                               |                ✓                  |                   |             |
| Togo                                   |                ✓                  |                   |             |
| Tunisia                                |                ✓                  |                   |             |
| Uganda                                 |                ✓                  |                   |             |
| United Arab Emirates                   |                ✓                  |         ✓         |             |
| Yemen                                  |                ✓                  |                   |             |
| Zambia                                 |                ✓                  |                   |             |
| Zimbabwe                               |                ✓                  |                   |             |

::: zone-end

<!-----------------------------  ROUTING v2025-01-01   --------------------------------------------------------------------->
::: zone pivot="service-latest"

The Azure Maps Routing service contains different levels of geographic coverage for every country/region in the world.

| Country/Region                         |Route Directions<br>& Snap to Roads|Real-time<br>Traffic|Truck Route<br>Directions|Route Matrix<br>& Range|
|----------------------------------------|:--------------------------------:|:------------------:|:----------------------:|:--------------------:|
| Afghanistan<sup>1</sup>                |               ✓                  |                    |                        |          ✓           |
| Albania                                |               ✓                  |                    |           ✓            |          ✓           |
| Algeria                                |               ✓                  |                    |                        |          ✓           |
| American Samoa                         |               ✓                  |                    |                        |          ✓           |
| Andorra                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Angola                                 |               ✓                  |                    |                        |          ✓           |
| Anguilla                               |               ✓                  |                    |                        |          ✓           |
| Antarctica<sup>1</sup>                 |               ✓                  |                    |                        |                      |
| Antigua & Barbuda                      |               ✓                  |                    |                        |          ✓           |
| Argentina                              |               ✓                  |         ✓          |           ✓            |          ✓           |
| Armenia                                |               ✓                  |                    |                        |          ✓           |
| Aruba                                  |               ✓                  |                    |                        |          ✓           |
| Australia                              |               ✓                  |         ✓          |           ✓            |          ✓           |
| Austria                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Azerbaijan                             |               ✓                  |                    |                        |          ✓           |
| Bahamas                                |               ✓                  |                    |                        |          ✓           |
| Bahrain                                |               ✓                  |         ✓          |                        |          ✓           |
| Bangladesh<sup>1</sup>                 |               ✓                  |                    |                        |          ✓           |
| Barbados                               |               ✓                  |                    |                        |          ✓           |
| Belarus                                |               ✓                  |                    |                        |          ✓           |
| Belgium                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Belize                                 |               ✓                  |                    |                        |          ✓           |
| Benin<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Bermuda                                |               ✓                  |                    |                        |          ✓           |
| Bhutan<sup>1</sup>                     |               ✓                  |                    |                        |          ✓           |
| Bolivia                                |               ✓                  |                    |                        |          ✓           |
| Bonaire                                |               ✓                  |                    |                        |                      |
| Bosnia & Herzegovina                   |               ✓                  |         ✓          |           ✓            |          ✓           |
| Botswana                               |               ✓                  |                    |                        |          ✓           |
| Bouvet Island<sup>1</sup>              |               ✓                  |                    |                        |          ✓           |
| Brazil                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| British Indian Ocean Territory<sup>1</sup>|            ✓                  |                    |                        |                      |
| British Virgin Islands                 |               ✓                  |                    |                        |          ✓           |
| Brunei                                 |               ✓                  |         ✓          |                        |          ✓           |
| Bulgaria                               |               ✓                  |         ✓          |           ✓            |          ✓           |
| Burkina Faso<sup>1</sup>               |               ✓                  |                    |                        |          ✓           |
| Burundi                                |               ✓                  |                    |                        |          ✓           |
| Cabo Verde                             |               ✓                  |                    |                        |                      |
| Cambodia                               |               ✓                  |                    |                        |          ✓           |
| Cameroon<sup>1</sup>                   |               ✓                  |                    |                        |          ✓           |
| Canada                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Cape Verde                             |                                  |                    |                        |          ✓           |
| Caribbean Netherlands                  |                                  |                    |                        |          ✓           |
| Cayman Islands                         |               ✓                  |                    |                        |          ✓           |
| Central African Republic<sup>1</sup>   |               ✓                  |                    |                        |          ✓           |
| Chad<sup>1</sup>                       |               ✓                  |                    |                        |          ✓           |
| Chile                                  |               ✓                  |         ✓          |                        |          ✓           |
| Christmas Island                       |               ✓                  |                    |                        |          ✓           |
| Cocos (Keeling) Islands<sup>1</sup>    |               ✓                  |                    |                        |          ✓           |
| Colombia                               |               ✓                  |         ✓          |                        |          ✓           |
| Comoros<sup>1</sup>                    |               ✓                  |                    |                        |          ✓           |
| Congo<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Congo (DRC)<sup>1</sup>                |               ✓                  |                    |                        |          ✓           |
| Cook Islands<sup>1</sup>               |               ✓                  |                    |                        |          ✓           |
| Costa Rica                             |               ✓                  |                    |                        |          ✓           |
| Côte d’Ivoire<sup>1</sup>              |               ✓                  |                    |                        |          ✓           |
| Croatia                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Cuba                                   |               ✓                  |                    |                        |          ✓           |
| Curaçao                                |               ✓                  |                    |                        |          ✓           |
| Cyprus                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Czech Republic                         |               ✓                  |         ✓          |           ✓            |          ✓           |
| Denmark                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Djibouti<sup>1</sup>                   |               ✓                  |                    |                        |          ✓           |
| Dominica                               |               ✓                  |                    |                        |          ✓           |
| Dominican Republic                     |               ✓                  |                    |                        |          ✓           |
| Ecuador                                |               ✓                  |                    |                        |          ✓           |
| Egypt                                  |               ✓                  |         ✓          |                        |          ✓           |
| El Salvador                            |               ✓                  |                    |                        |          ✓           |
| Equatorial Guinea<sup>1</sup>          |               ✓                  |                    |                        |          ✓           |
| Eritrea<sup>1</sup>                    |               ✓                  |                    |                        |          ✓           |
| Estonia                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Eswatini                               |               ✓                  |                    |                        |          ✓           |
| Ethiopia<sup>1</sup>                   |               ✓                  |                    |                        |          ✓           |
| Falkland Islands<sup>1</sup>           |               ✓                  |                    |                        |          ✓           |
| Faroe Islands                          |               ✓                  |                    |                        |          ✓           |
| Fiji                                   |               ✓                  |                    |                        |          ✓           |
| Finland                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| France                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| French Guiana                          |               ✓                  |                    |                        |          ✓           |
| French Polynesia<sup>1</sup>           |               ✓                  |                    |                        |          ✓           |
| French Southern Territories<sup>1</sup>|               ✓                  |                    |                        |          ✓           |
| Gabon<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Gambia<sup>1</sup>                     |               ✓                  |                    |                        |          ✓           |
| Georgia                                |               ✓                  |                    |                        |          ✓           |
| Germany                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Ghana                                  |               ✓                  |                    |                        |          ✓           |
| Gibraltar                              |               ✓                  |         ✓          |           ✓            |          ✓           |
| Greece                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Greenland<sup>1</sup>                  |               ✓                  |                    |                        |          ✓           |
| Grenada                                |               ✓                  |                    |                        |          ✓           |
| Guadeloupe                             |               ✓                  |         ✓          |                        |          ✓           |
| Guam                                   |               ✓                  |         ✓          |                        |          ✓           |
| Guatemala                              |               ✓                  |                    |                        |          ✓           |
| Guernsey                               |               ✓                  |         ✓          |                        |          ✓           |
| Guinea<sup>1</sup>                     |               ✓                  |                    |                        |          ✓           |
| Guinea-Bissau<sup>1</sup>              |               ✓                  |                    |                        |          ✓           |
| Guyana                                 |               ✓                  |                    |                        |          ✓           |
| Haiti                                  |               ✓                  |                    |                        |          ✓           |
| Heard Island & McDonald Islands<sup>1</sup>|           ✓                  |                    |                        |                      |
| Honduras                               |               ✓                  |                    |                        |          ✓           |
| Hong Kong SAR                          |               ✓                  |         ✓          |                        |          ✓           |
| Hungary                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Iceland                                |               ✓                  |         ✓          |                        |          ✓           |
| India                                  |               ✓                  |         ✓          |                        |          ✓           |
| Indonesia                              |               ✓                  |         ✓          |           ✓            |          ✓           |
| Iran<sup>1</sup>                       |               ✓                  |                    |                        |          ✓           |
| Iraq                                   |               ✓                  |                    |                        |          ✓           |
| Ireland                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Isle of Man                            |               ✓                  |         ✓          |                        |          ✓           |
| Israel                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Italy                                  |               ✓                  |         ✓          |           ✓            |          ✓           |
| Jamaica                                |               ✓                  |                    |                        |          ✓           |
| Jan Mayen                              |               ✓                  |                    |                        |                      |
| Jersey                                 |               ✓                  |         ✓          |                        |          ✓           |
| Jordan                                 |               ✓                  |                    |                        |          ✓           |
| Kazakhstan                             |               ✓                  |         ✓          |                        |          ✓           |
| Kenya                                  |               ✓                  |         ✓          |                        |          ✓           |
| Kiribati<sup>1</sup>                   |               ✓                  |                    |                        |          ✓           |
| Kosovo                                 |               ✓                  |                    |                        |                      |
| Kuwait                                 |               ✓                  |         ✓          |                        |          ✓           |
| Kyrgyzstan<sup>1</sup>                 |               ✓                  |                    |                        |          ✓           |
| Laos                                   |               ✓                  |                    |                        |          ✓           |
| Latvia                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Lebanon                                |               ✓                  |                    |                        |          ✓           |
| Lesotho                                |               ✓                  |         ✓          |                        |          ✓           |
| Liberia<sup>1</sup>                    |               ✓                  |                    |                        |          ✓           |
| Libya<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Liechtenstein                          |               ✓                  |         ✓          |           ✓            |          ✓           |
| Lithuania                              |               ✓                  |         ✓          |           ✓            |          ✓           |
| Luxembourg                             |               ✓                  |         ✓          |           ✓            |          ✓           |
| Macao SAR                              |               ✓                  |         ✓          |                        |          ✓           |
| Madagascar<sup>1</sup>                 |               ✓                  |                    |                        |          ✓           |
| Malawi                                 |               ✓                  |                    |                        |          ✓           |
| Malaysia                               |               ✓                  |         ✓          |           ✓            |          ✓           |
| Maldives<sup>1</sup>                   |               ✓                  |                    |                        |          ✓           |
| Mali<sup>1</sup>                       |               ✓                  |                    |                        |          ✓           |
| Malta                                  |               ✓                  |         ✓          |           ✓            |          ✓           |
| Marshall Islands<sup>1</sup>           |               ✓                  |                    |                        |          ✓           |
| Martinique                             |               ✓                  |         ✓          |                        |          ✓           |
| Mauritania<sup>1</sup>                 |               ✓                  |                    |                        |          ✓           |
| Mauritius                              |               ✓                  |                    |                        |          ✓           |
| Mayotte                                |               ✓                  |                    |                        |          ✓           |
| Mexico                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Micronesia<sup>1</sup>                 |               ✓                  |                    |                        |          ✓           |
| Moldova                                |               ✓                  |                    |                        |          ✓           |
| Monaco                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Mongolia<sup>1</sup>                   |               ✓                  |                    |                        |          ✓           |
| Montenegro                             |               ✓                  |                    |           ✓            |          ✓           |
| Montserrat                             |               ✓                  |                    |                        |          ✓           |
| Morocco                                |               ✓                  |         ✓          |                        |          ✓           |
| Mozambique                             |               ✓                  |         ✓          |                        |          ✓           |
| Myanmar                                |               ✓                  |                    |                        |          ✓           |
| Namibia                                |               ✓                  |                    |                        |          ✓           |
| Nauru<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Nepal<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Netherlands                            |               ✓                  |         ✓          |           ✓            |          ✓           |
| New Caledonia<sup>1</sup>              |               ✓                  |                    |                        |          ✓           |
| New Zealand                            |               ✓                  |         ✓          |           ✓            |          ✓           |
| Nicaragua                              |               ✓                  |                    |                        |          ✓           |
| Niger<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Nigeria                                |               ✓                  |         ✓          |                        |          ✓           |
| Niue<sup>1</sup>                       |               ✓                  |                    |                        |          ✓           |
| Norfolk Island<sup>1</sup>             |               ✓                  |                    |                        |          ✓           |
| North Korea<sup>1</sup>                |               ✓                  |                    |                        |                      |
| North Macedonia                        |               ✓                  |                    |                        |          ✓           |
| Northern Mariana Islands               |               ✓                  |                    |                        |          ✓           |
| Norway                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Oman                                   |               ✓                  |         ✓          |                        |          ✓           |
| Pakistan<sup>1</sup>                   |               ✓                  |                    |                        |          ✓           |
| Palau<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Palestinian Authority<sup>1</sup>      |               ✓                  |                    |                        |                      |
| Panama                                 |               ✓                  |                    |                        |          ✓           |
| Papua New Guinea<sup>1</sup>           |               ✓                  |                    |                        |          ✓           |
| Paraguay                               |               ✓                  |                    |                        |          ✓           |
| Peru                                   |               ✓                  |         ✓          |                        |          ✓           |
| Philippines                            |               ✓                  |         ✓          |           ✓            |          ✓           |
| Pitcairn Islands<sup>1</sup>           |               ✓                  |                    |                        |          ✓           |
| Poland                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Portugal                               |               ✓                  |         ✓          |           ✓            |          ✓           |
| Puerto Rico                            |               ✓                  |         ✓          |                        |          ✓           |
| Qatar                                  |               ✓                  |         ✓          |                        |          ✓           |
| Réunion                                |               ✓                  |         ✓          |                        |          ✓           |
| Romania                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Russia                                 |               ✓                  |                    |           ✓            |          ✓           |
| Rwanda                                 |               ✓                  |                    |                        |          ✓           |
| Saba                                   |               ✓                  |                    |                        |                      |
| Samoa<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| San Marino                             |               ✓                  |         ✓          |           ✓            |          ✓           |
| São Tomé & Príncipe<sup>1</sup>        |               ✓                  |                    |                        |          ✓           |
| Saudi Arabia                           |               ✓                  |         ✓          |                        |          ✓           |
| Senegal                                |               ✓                  |                    |                        |          ✓           |
| Serbia                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Seychelles                             |               ✓                  |                    |                        |          ✓           |
| Sierra Leone<sup>1</sup>               |               ✓                  |                    |                        |          ✓           |
| Singapore                              |               ✓                  |         ✓          |           ✓            |          ✓           |
| Sint Eustatius                         |               ✓                  |                    |                        |                      |
| Sint Maarten                           |               ✓                  |                    |                        |          ✓           |
| Slovakia                               |               ✓                  |         ✓          |           ✓            |          ✓           |
| Slovenia                               |               ✓                  |         ✓          |           ✓            |          ✓           |
| Solomon Islands<sup>1</sup>            |               ✓                  |                    |                        |          ✓           |
| Somalia<sup>1</sup>                    |               ✓                  |                    |                        |          ✓           |
| South Africa                           |               ✓                  |         ✓          |           ✓            |          ✓           |
| South Georgia & South Sandwich Islands<sup>1</sup> |   ✓                  |                    |                        |          ✓           |
| South Korea<sup>2</sup>                |               ✓                  |         ✓          |           ✓            |         ✓           |
| South Sudan<sup>1</sup>                |               ✓                  |                    |                        |          ✓           |
| Spain                                  |               ✓                  |         ✓          |           ✓            |          ✓           |
| Sri Lanka<sup>1</sup>                  |               ✓                  |                    |                        |          ✓           |
| St. Barthélemy                         |               ✓                  |                    |                        |          ✓           |
| St Helena, Ascension, Tristan da Cunha<sup>1</sup> |   ✓                  |                    |                        |          ✓           |
| St. Kitts & Nevis                      |               ✓                  |                    |                        |          ✓           |
| St. Lucia                              |               ✓                  |                    |                        |          ✓           |
| St. Martin                             |               ✓                  |                    |                        |          ✓           |
| St. Pierre & Miquelon                  |               ✓                  |                    |                        |          ✓           |
| St. Vincent & Grenadines               |               ✓                  |                    |                        |          ✓           |
| Sudan<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Suriname                               |               ✓                  |                    |                        |          ✓           |
| Svalbard                               |               ✓                  |                    |                        |                      |
| Sweden                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Switzerland                            |               ✓                  |         ✓          |           ✓            |          ✓           |
| Syria<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Taiwan                                 |               ✓                  |         ✓          |           ✓            |          ✓           |
| Tajikistan<sup>1</sup>                 |               ✓                  |                    |                        |          ✓           |
| Tanzania                               |               ✓                  |                    |                        |          ✓           |
| Thailand                               |               ✓                  |         ✓          |           ✓            |          ✓           |
| Timor-Leste<sup>1</sup>                |               ✓                  |                    |                        |          ✓           |
| Togo<sup>1</sup>                       |               ✓                  |                    |                        |          ✓           |
| Tokelau<sup>1</sup>                    |               ✓                  |                    |                        |          ✓           |
| Tonga<sup>1</sup>                      |               ✓                  |                    |                        |          ✓           |
| Trinidad & Tobago                      |               ✓                  |                    |                        |          ✓           |
| Tunisia                                |               ✓                  |                    |                        |          ✓           |
| Türkiye                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Turkmenistan<sup>1</sup>               |               ✓                  |                    |                        |          ✓           |
| Turks & Caicos Islands                 |               ✓                  |                    |                        |          ✓           |
| Tuvalu<sup>1</sup>                     |               ✓                  |                    |                        |          ✓           |
| U.S. Outlying Islands<sup>1</sup>      |               ✓                  |                    |                        |                      |
| U.S. Virgin Islands                    |               ✓                  |         ✓          |                        |          ✓           |
| Uganda                                 |               ✓                  |                    |                        |          ✓           |
| Ukraine                                |               ✓                  |                    |                        |          ✓           |
| United Arab Emirates                   |               ✓                  |         ✓          |                        |          ✓           |
| United Kingdom                         |               ✓                  |         ✓          |           ✓            |          ✓           |
| United States                          |               ✓                  |         ✓          |           ✓            |          ✓           |
| Uruguay                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Uzbekistan<sup>1</sup>                 |               ✓                  |                    |                        |          ✓           |
| Vanuatu<sup>1</sup>                    |               ✓                  |                    |                        |          ✓           |
| Vatican City                           |               ✓                  |         ✓          |           ✓            |          ✓           |
| Venezuela                              |               ✓                  |                    |                        |          ✓           |
| Vietnam                                |               ✓                  |         ✓          |           ✓            |          ✓           |
| Wallis & Futuna<sup>1</sup>            |               ✓                  |                    |                        |          ✓           |
| Yemen                                  |               ✓                  |                    |                        |          ✓           |
| Zambia                                 |               ✓                  |                    |                        |          ✓           |
| Zimbabwe                               |               ✓                  |                    |                        |          ✓           |

<sup>1</sup> Country/region has partial road data with at least coverage for major roads.
<sup>2</sup> Coverage is dependent on enabling data processing in South Korea. For more information, see [Configure global data processing](how-to-manage-consent.md).

::: zone-end

## Next steps

For more information about Azure Maps routing, see the [Routing service] documentation.

For more coverage tables, see:

- Check out coverage for [Geocoding].
- Check out coverage for [Traffic].  
- Check out coverage for [Render].

[Azure Maps Route Service]: /rest/api/maps/route/
[Geocoding]: geocoding-coverage.md
[Get Route Directions]: /rest/api/maps/route/get-route-directions
[Get Route Range]: /rest/api/maps/route/get-route-range
[Matrix Routing service]: /rest/api/maps/route/post-route-matrix
[Render]: render-coverage.md
[Routing service]: /rest/api/maps/route
[Traffic service]: /rest/api/maps/traffic
[Traffic]: traffic-coverage.md
