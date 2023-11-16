---
title: Routing coverage
titleSuffix: Microsoft Azure Maps
description: Learn what level of coverage Azure Maps provides in various regions for routing, routing with traffic, and truck routing. 
author: eriklindeman
ms.author: eriklind
ms.date: 10/21/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---

# Azure Maps routing coverage

This article provides coverage information for Azure Maps routing. Upon a search query, Azure Maps returns an optimal route from location A to location B. You're provided with accurate travel times, live updates of travel information, and route instructions. You can also add more search parameters such as current traffic, vehicle type, and conditions to avoid. The optimization of the route depends on the region. That's because, Azure Maps has various levels of information and accuracy for different regions. The tables in this article list the regions and what kind of information you can request for them.

## Routing information supported

In the [Azure Maps routing coverage tables], the following information is available.

### Calculate Route

The Calculate Route service calculates a route between an origin and a destination, passing through waypoints if they're specified. For more information, see [Get Route Directions] in the REST API documentation.

### Calculate Reachable Range

The Calculate Reachable Range service calculates a set of locations that can be reached from the origin point. For more information, see [Get Route Range] in the REST API documentation.

### Matrix Routing

The Matrix Routing service calculates travel time and distance between all possible pairs in a list of origins and destinations. It doesn't provide any detailed information about the routes. You can get one-to-many, many-to-one, or many-to-many route options simply by varying the number of origins and/or destinations. For more information, see [Matrix Routing service] in the REST API documentation.

### Real-time Traffic

Delivers real-time information about traffic jams, road closures, and a detailed view of the current speed and travel times across the entire road network. For more information, see [Traffic service] in the REST API documentation.

### Truck routes

The Azure Maps Truck Routing API provides travel routes that take truck attributes into consideration. Truck attributes include things such as width, height, weight, turning radius and type of cargo. This is important as not all trucks can travel the same routes as other vehicles. Here are some examples:

- Bridges have heights and weight limits.
- Tunnels often have restrictions on flammable or hazardous materials.
- Longer trucks have difficulty making tight turns.
- Highways often have a separate speed limit for trucks.
- Certain trucks may want to avoid roads that have steep gradients.

Azure Maps supports truck routing in the countries/regions indicated in the following tables.

<!------------------------------------------------------------------
### Legend

| Symbol | Meaning                          |
|:------:|----------------------------------|
|   ✓    | Region has full routing data.    |
|   ◑    | Region has partial routing data. |
---------------------------------------------------------------->

## Azure Maps routing coverage tables

The following tables provide coverage information for Azure Maps routing.

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

## Next steps

For more information about Azure Maps routing, see the [Routing service] documentation.

For more coverage tables, see:

- Check out coverage for [Geocoding].
- Check out coverage for [Traffic].  
- Check out coverage for [Render].

[Azure Maps routing coverage tables]: #azure-maps-routing-coverage-tables
[Geocoding]: geocoding-coverage.md
[Get Route Directions]: /rest/api/maps/route/get-route-directions
[Get Route Range]: /rest/api/maps/route/get-route-range
[Matrix Routing service]: /rest/api/maps/route/post-route-matrix
[Render]: render-coverage.md
[Routing service]: /rest/api/maps/route
[Traffic service]: /rest/api/maps/traffic
[Traffic]: traffic-coverage.md
