---
title:  Microsoft Azure Maps Weather services coverage
description: Learn about Microsoft Azure Maps Weather services coverage
author: eriklindeman
ms.author: eriklind
ms.date: 11/08/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
ms.custom: references_regions
---

# Azure Maps weather services coverage

This article provides coverage information for Azure Maps [Weather services].

## Weather information supported

### Infrared satellite tiles
<!-- Replace with Minimal Description
Infrared (IR) radiation is electromagnetic radiation that measures an object's infrared emission, returning information about its temperature. Infrared images can indicate cloud heights (Colder cloud-tops mean higher clouds) and types, calculate land and surface water temperatures, and locate ocean surface features. 
 -->

Infrared satellite imagery, showing clouds by their temperature, is returned when `tilesetID` is set to `microsoft.weather.infrared.main` when making calls to [Get Map Tile] and can then be overlaid on the map image.

### Minute forecast

The [Get Minute forecast] service returns minute-by-minute forecasts for the specified location for the next 120 minutes.

### Radar tiles
<!-- Replace with Minimal Description
Radar imagery is a depiction of the response returned when microwave radiation is sent into the atmosphere. The pulses of radiation reflect back showing its interactions with any precipitation it encounters. The radar technology visually represents those pulses showing where it's clear, raining, snowing or stormy. 
-->

Radar tiles, showing areas of rain, snow, ice and mixed conditions, are returned when `tilesetID` is set to `microsoft.weather.radar.main` when making calls to [Get Map Tile] and can then be overlaid on the map image.

### Severe weather alerts

[Severe weather alerts] service returns severe weather alerts from both official Government Meteorological Agencies and other leading severe weather alert providers. The service can return details such as alert type, category, level and detailed description. Severe weather includes conditions like hurricanes, tornados, tsunamis, severe thunderstorms, and fires.

### Other

- **Air quality**. The Air Quality service returns [current], [hourly] or [daily] forecasts that include pollution levels, air quality index values, the dominant pollutant, and a brief statement summarizing risk level and suggested precautions.
- **Current conditions**. The [Get Current Conditions] service returns detailed current weather conditions such as precipitation, temperature and wind for a given coordinate location.
- **Daily forecast**. The [Get Daily Forecast] service returns detailed weather forecasts such as temperature and wind by day for the next 1, 5, 10, 15, 25, or 45 days for a given coordinate location.
- **Daily indices**. The [Get Daily Indices] service returns index values that provide information that can help in planning activities. For example, a health mobile application can notify users that today is good weather for running or playing golf.
- **Historical weather**. The Historical Weather service includes Daily Historical [Records], [Actuals] and [Normals] that return climatology data such as past daily record temperatures, precipitation and snowfall at a given coordinate location.
- **Hourly forecast**. The [Get Hourly Forecast] service returns detailed weather forecast information by the hour for up to 10 days.
- **Quarter-day forecast**. The [Get Quarter Day Forecast] service returns detailed weather forecast by quarter-day for up to 15 days.
- **Tropical storms**. The Tropical Storm service provides information about [active storms], tropical storm [forecasts] and [locations] and the ability to [search] for tropical storms by year, basin ID, or government ID.
- **Weather along route**. The [Get Weather Along Route] service returns hyper local (1 kilometer or less), up-to-the-minute weather nowcasts, weather hazard assessments, and notifications along a route described as a sequence of waypoints.

## Azure Maps Weather coverage tables

> [!NOTE]
> Azure Maps doesn't have the same level of detail and accuracy for all countries and regions.

## Americas

| Country/Region                           | Infrared satellite & Radar tiles | Minute forecast | Severe weather alerts | Other* |
|------------------------------------------|:------------------------:|:-----------------------:|:---------------------:|:------:|
| Anguilla                                 |            ✓             |             ✓           |                       |   ✓   |
| Antarctica                               |            ✓             |                         |                       |   ✓   |
| Antigua & Barbuda                        |            ✓             |             ✓           |                       |   ✓   |
| Argentina                                |            ✓             |             ✓           |                       |   ✓   |
| Aruba                                    |            ✓             |             ✓           |                       |   ✓   |
| Bahamas                                  |            ✓             |             ✓           |                       |   ✓   |
| Barbados                                 |            ✓             |             ✓           |                       |   ✓   |
| Belize                                   |            ✓             |             ✓           |                       |   ✓   |
| Bermuda                                  |            ✓             |                         |                       |   ✓   |
| Bolivia                                  |            ✓             |             ✓           |                       |   ✓   |
| Bonaire                                  |            ✓             |             ✓           |                       |   ✓   |
| Brazil                                   |            ✓             |             ✓           |            ✓          |   ✓   |
| British Virgin Islands                   |            ✓             |             ✓           |                       |   ✓   |
| Canada                                   |            ✓             |             ✓           |            ✓         |   ✓   |
| Cayman Islands                           |            ✓             |             ✓           |                       |   ✓   |
| Chile                                    |            ✓             |             ✓           |                       |   ✓   |
| Colombia                                 |            ✓             |             ✓           |                       |   ✓   |
| Costa Rica                               |            ✓             |             ✓           |                       |   ✓   |
| Cuba                                     |            ✓             |             ✓           |                       |   ✓   |
| Curaçao                                  |            ✓             |             ✓           |                       |   ✓   |
| Dominica                                 |            ✓             |             ✓           |                       |   ✓   |
| Dominican Republic                       |            ✓             |             ✓           |                       |   ✓   |
| Ecuador                                  |            ✓             |             ✓           |                       |   ✓   |
| El Salvador                              |            ✓             |             ✓           |                       |   ✓   |
| Falkland Islands                         |            ✓             |             ✓           |                       |   ✓   |
| French Guiana                            |            ✓             |             ✓           |                       |   ✓   |
| Greenland                                |            ✓             |                         |                       |   ✓   |
| Grenada                                  |            ✓             |             ✓           |                       |   ✓   |
| Guadeloupe                               |            ✓             |             ✓           |                       |   ✓   |
| Guatemala                                |            ✓             |             ✓           |                       |   ✓   |
| Guyana                                   |            ✓             |             ✓           |                       |   ✓   |
| Haiti                                    |            ✓             |             ✓           |                       |   ✓   |
| Honduras                                 |            ✓             |             ✓           |                       |   ✓   |
| Jamaica                                  |            ✓             |             ✓           |                       |   ✓   |
| Martinique                               |            ✓             |             ✓           |                       |   ✓   |
| Mexico                                   |            ✓             |             ✓           |                       |   ✓   |
| Montserrat                               |            ✓             |             ✓           |                       |   ✓   |
| Nicaragua                                |            ✓             |             ✓           |                       |   ✓   |
| Panama                                   |            ✓             |             ✓           |                       |   ✓   |
| Paraguay                                 |            ✓             |             ✓           |                       |   ✓   |
| Peru                                     |            ✓             |             ✓           |                       |   ✓   |
| Puerto Rico                              |            ✓             |             ✓           |            ✓          |   ✓   |
| Saint Barthélemy                         |            ✓             |             ✓           |                       |   ✓   |
| Saint Kitts & Nevis                      |            ✓             |             ✓           |                       |   ✓   |
| Saint Lucia                              |            ✓             |             ✓           |                       |   ✓   |
| Saint Martin                             |            ✓             |             ✓           |                       |   ✓   |
| Saint Pierre & Miquelon                  |            ✓             |                         |                       |   ✓   |
| Saint Vincent & the Grenadines           |            ✓             |             ✓           |                       |   ✓   |
| Sint Eustatius                           |            ✓             |                         |                       |   ✓   |
| Sint Maarten                             |            ✓             |             ✓           |                       |   ✓   |
| South Georgia & South Sandwich Islands   |            ✓             |                         |                       |   ✓   |
| Suriname                                 |            ✓             |             ✓           |                       |   ✓   |
| Trinidad & Tobago                        |            ✓             |             ✓           |                       |   ✓   |
| Turks & Caicos Islands                   |            ✓             |             ✓           |                       |   ✓   |
| U.S. Outlying Islands                    |            ✓             |                         |                       |   ✓   |
| U.S. Virgin Islands                      |            ✓             |             ✓           |            ✓          |   ✓   |
| United States                            |            ✓             |            ✓            |            ✓         |   ✓   |
| Uruguay                                  |            ✓             |             ✓           |                       |   ✓   |
| Venezuela                                |            ✓             |             ✓           |                       |   ✓   |

## Asia Pacific

| Country/Region                    | Infrared satellite & Radar tiles | Minute forecast | Severe weather alerts | Other* |
|-----------------------------------|:------------------------:|:-----------------------:|:---------------------:|:------:|
| Afghanistan                        |            ✓            |            ✓           |                       |   ✓   |
| American Samoa                     |            ✓            |                        |           ✓           |   ✓   |
| Australia                          |            ✓            |            ✓           |            ✓          |   ✓   |
| Bangladesh                         |            ✓            |            ✓           |                       |   ✓   |
| Bhutan                             |            ✓            |            ✓           |                       |   ✓   |
| British Indian Ocean Territory     |            ✓            |                         |                       |   ✓   |
| Brunei                             |            ✓            |            ✓           |                       |   ✓   |
| Cambodia                           |            ✓            |            ✓           |                       |   ✓   |
| China                              |            ✓            |            ✓           |            ✓          |   ✓   |
| Christmas Island                   |            ✓            |                         |                       |   ✓   |
| Cocos (Keeling) Islands            |            ✓            |                         |                       |   ✓   |
| Cook Islands                       |            ✓            |                         |                       |   ✓   |
| Fiji                               |            ✓            |                         |                       |   ✓   |
| French Polynesia                   |            ✓            |                         |                       |   ✓   |
| Guam                               |            ✓            |             ✓           |           ✓           |   ✓   |
| Heard Island & McDonald Islands    |            ✓            |                         |                       |   ✓   |
| Hong Kong SAR                      |            ✓            |             ✓           |                       |   ✓   |
| India                              |            ✓            |             ✓           |                       |   ✓   |
| Indonesia                          |            ✓            |             ✓           |                       |   ✓   |
| Japan                              |            ✓            |             ✓           |            ✓         |   ✓   |
| Kazakhstan                         |            ✓            |             ✓           |                       |   ✓   |
| Kiribati                           |            ✓            |                         |                       |   ✓   |
| Korea                              |            ✓            |             ✓           |            ✓         |   ✓   |
| Kyrgyzstan                         |            ✓            |             ✓           |                       |   ✓   |
| Laos                               |            ✓            |             ✓           |                       |   ✓   |
| Macao SAR                          |            ✓            |             ✓           |                       |   ✓   |
| Malaysia                           |            ✓            |             ✓           |                       |   ✓   |
| Maldives                           |            ✓            |                         |                       |   ✓   |
| Marshall Islands                   |            ✓            |                         |           ✓           |   ✓   |
| Micronesia                         |            ✓            |                         |           ✓           |   ✓   |
| Mongolia                           |            ✓            |                         |                       |   ✓   |
| Myanmar                            |            ✓            |                         |                       |   ✓   |
| Nauru                              |            ✓            |                         |                       |   ✓   |
| Nepal                              |            ✓            |             ✓           |                       |   ✓   |
| New Caledonia                      |            ✓            |                         |                       |   ✓   |
| New Zealand                        |            ✓            |             ✓           |           ✓           |   ✓   |
| Niue                               |            ✓            |                         |                       |   ✓   |
| Norfolk Island                     |            ✓            |                         |                       |   ✓   |
| North Korea                        |            ✓            |             ✓           |                       |   ✓   |
| Northern Mariana Islands           |            ✓            |             ✓           |           ✓           |   ✓   |
| Pakistan                           |            ✓            |             ✓           |                       |   ✓   |
| Palau                              |            ✓            |             ✓           |           ✓           |   ✓   |
| Papua New Guinea                   |            ✓            |             ✓           |                       |   ✓   |
| Philippines                        |            ✓            |             ✓           |           ✓           |   ✓   |
| Pitcairn Islands                   |            ✓            |                         |                       |   ✓   |
| Samoa                              |            ✓            |                         |                       |   ✓   |
| Singapore                          |            ✓            |             ✓           |                       |   ✓   |
| Solomon Islands                    |            ✓            |                         |                       |   ✓   |
| Sri Lanka                          |            ✓            |             ✓           |                       |   ✓   |
| Taiwan                             |            ✓            |             ✓           |                       |   ✓   |
| Tajikistan                         |            ✓            |             ✓           |                       |   ✓   |
| Thailand                           |            ✓            |             ✓           |                       |   ✓   |
| Timor-Leste                        |            ✓            |             ✓           |                       |   ✓   |
| Tokelau                            |            ✓            |                         |                       |   ✓   |
| Tonga                              |            ✓            |                         |                       |   ✓   |
| Turkmenistan                       |            ✓            |             ✓           |                       |   ✓   |
| Tuvalu                             |            ✓            |                         |                       |   ✓   |
| Uzbekistan                         |            ✓            |             ✓           |                       |   ✓   |
| Vanuatu                            |            ✓            |                         |                       |   ✓   |
| Vietnam                            |            ✓            |             ✓           |                       |   ✓   |
| Wallis & Futuna                    |            ✓            |                         |                       |   ✓   |

## Europe

| Country/Region          | Infrared satellite & Radar tiles | Minute forecast | Severe weather alerts | Other* |
|-------------------------|:------------------------:|:-----------------------:|:---------------------:|:------:|
| Albania                 |            ✓            |            ✓            |                       |   ✓   |
| Andorra                 |            ✓            |            ✓            |           ✓           |   ✓   |
| Armenia                 |            ✓            |            ✓            |                       |   ✓   |
| Austria                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Azerbaijan              |            ✓            |            ✓            |                       |   ✓   |
| Belarus                 |            ✓            |            ✓            |                       |   ✓   |
| Belgium                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Bosnia & Herzegovina    |            ✓            |            ✓            |            ✓          |   ✓   |
| Bulgaria                |            ✓            |            ✓            |           ✓           |   ✓   |
| Croatia                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Cyprus                  |            ✓            |            ✓            |           ✓           |   ✓   |
| Czechia                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Denmark                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Estonia                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Faroe Islands           |            ✓            |                         |                       |   ✓   |
| Finland                 |            ✓            |            ✓            |            ✓          |   ✓   |
| France                  |            ✓            |            ✓            |            ✓          |   ✓   |
| Georgia                 |            ✓            |            ✓            |                       |   ✓   |
| Germany                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Gibraltar               |            ✓            |            ✓            |                       |   ✓   |
| Greece                  |            ✓            |            ✓            |           ✓           |   ✓   |
| Guernsey                |            ✓            |                         |                       |   ✓   |
| Hungary                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Iceland                 |            ✓            |                         |           ✓           |   ✓   |
| Ireland                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Isle of Man             |            ✓            |                         |                       |   ✓   |
| Italy                   |            ✓            |            ✓            |           ✓           |   ✓   |
| Jan Mayen               |            ✓            |                          |                       |   ✓   |
| Jersey                  |            ✓            |                          |                       |   ✓   |
| Kosovo                  |            ✓            |            ✓            |           ✓           |   ✓   |
| Latvia                  |            ✓            |                          |           ✓           |   ✓   |
| Liechtenstein           |            ✓            |            ✓            |            ✓          |   ✓   |
| Lithuania               |            ✓            |                          |           ✓           |   ✓   |
| Luxembourg              |            ✓            |            ✓            |            ✓          |   ✓   |
| North Macedonia         |            ✓            |                          |           ✓           |   ✓   |
| Malta                   |            ✓            |                          |           ✓           |   ✓   |
| Moldova                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Monaco                  |            ✓            |            ✓            |            ✓          |   ✓   |
| Montenegro              |            ✓            |            ✓            |            ✓          |   ✓   |
| Netherlands             |            ✓            |            ✓            |            ✓          |   ✓   |
| Norway                  |            ✓            |            ✓            |            ✓          |   ✓   |
| Poland                  |            ✓            |            ✓            |            ✓          |   ✓   |
| Portugal                |            ✓            |            ✓            |            ✓          |   ✓   |
| Romania                 |            ✓            |            ✓            |            ✓          |   ✓   |
| Russia                  |            ✓            |            1             |           ✓           |   ✓   |
| San Marino              |            ✓            |                          |           ✓           |   ✓   |
| Serbia                  |            ✓            |            ✓            |            ✓          |   ✓   |
| Slovakia                |            ✓            |            ✓            |            ✓          |   ✓   |
| Slovenia                |            ✓            |            ✓            |            ✓          |   ✓   |
| Spain                   |            ✓            |            ✓            |            ✓          |   ✓   |
| Svalbard                |            ✓            |                          |                       |   ✓   |
| Sweden                  |            ✓            |            ✓            |            ✓          |   ✓   |
| Switzerland             |            ✓            |            ✓            |            ✓          |   ✓   |
| Türkiye                 |            ✓            |             ✓           |                       |   ✓   |
| Ukraine                 |            ✓            |             ✓           |                       |   ✓   |
| United Kingdom          |            ✓            |            ✓            |            ✓          |   ✓   |
| Vatican City            |            ✓            |                         |            ✓          |   ✓   |

1 Partial coverage includes Moscow and Saint Petersburg

## Middle East & Africa

| Country/Region                         | Infrared satellite & Radar tiles | Minute forecast | Severe weather alerts | Other* |
|----------------------------------------|:------------------------:|:-----------------------:|:---------------------:|:------:|
| Algeria                                |            ✓             |           ✓             |                       |   ✓   |
| Angola                                 |            ✓             |           ✓             |                       |   ✓   |
| Bahrain                                |            ✓             |           ✓             |                       |   ✓   |
| Benin                                  |            ✓             |           ✓             |                       |   ✓   |
| Botswana                               |            ✓             |           ✓             |                       |   ✓   |
| Bouvet Island                          |            ✓             |                         |                       |   ✓   |
| Burkina Faso                           |            ✓             |           ✓             |                       |   ✓   |
| Burundi                                |            ✓             |           ✓             |                       |   ✓   |
| Cameroon                               |            ✓             |           ✓             |                       |   ✓   |
| Cabo Verde                             |            ✓             |           ✓             |                       |   ✓   |
| Central African Republic               |            ✓             |           ✓             |                       |   ✓   |
| Chad                                   |            ✓             |           ✓             |                       |   ✓   |
| Comoros                                |            ✓             |           ✓             |                       |   ✓   |
| Congo (DRC)                            |            ✓             |           ✓             |                       |   ✓   |
| Côte d'Ivoire                          |            ✓             |           ✓             |                       |   ✓   |
| Djibouti                               |            ✓             |           ✓             |                       |   ✓   |
| Egypt                                  |            ✓             |           ✓             |                       |   ✓   |
| Equatorial Guinea                      |            ✓             |           ✓             |                       |   ✓   |
| Eritrea                                |            ✓             |           ✓             |                       |   ✓   |
| Eswatini                               |            ✓             |           ✓             |                       |   ✓   |
| Ethiopia                               |            ✓             |           ✓             |                       |   ✓   |
| French Southern Territories            |            ✓             |                         |                       |   ✓   |
| Gabon                                  |            ✓             |           ✓             |                       |   ✓   |
| Gambia                                 |            ✓             |           ✓             |                       |   ✓   |
| Ghana                                  |            ✓             |           ✓             |                       |   ✓   |
| Guinea                                 |            ✓             |           ✓             |                       |   ✓   |
| Guinea-Bissau                          |            ✓             |           ✓             |                       |   ✓   |
| Iran                                   |            ✓             |           ✓             |                       |   ✓   |
| Iraq                                   |            ✓             |           ✓             |                       |   ✓   |
| Israel                                 |            ✓             |           ✓             |            ✓          |   ✓   |
| Jordan                                 |            ✓             |           ✓             |                       |   ✓   |
| Kenya                                  |            ✓             |           ✓             |                       |   ✓   |
| Kuwait                                 |            ✓             |           ✓             |                       |   ✓   |
| Lebanon                                |            ✓             |           ✓             |                       |   ✓   |
| Lesotho                                |            ✓             |           ✓             |                       |   ✓   |
| Liberia                                |            ✓             |           ✓             |                       |   ✓   |
| Libya                                  |            ✓             |           ✓             |                       |   ✓   |
| Madagascar                             |            ✓             |           ✓             |                       |   ✓   |
| Malawi                                 |            ✓             |           ✓             |                       |   ✓   |
| Mali                                   |            ✓             |           ✓             |                       |   ✓   |
| Mauritania                             |            ✓             |           ✓             |                       |   ✓   |
| Mauritius                              |            ✓             |           ✓             |                       |   ✓   |
| Mayotte                                |            ✓             |           ✓             |                       |   ✓   |
| Morocco                                |            ✓             |                         |                       |   ✓   |
| Mozambique                             |            ✓             |           ✓             |                       |   ✓   |
| Namibia                                |            ✓             |           ✓             |                       |   ✓   |
| Niger                                  |            ✓             |           ✓             |                       |   ✓   |
| Nigeria                                |            ✓             |           ✓             |                       |   ✓   |
| Oman                                   |            ✓             |           ✓             |                       |   ✓   |
| Palestinian Authority                  |            ✓             |           ✓             |                       |   ✓   |
| Qatar                                  |            ✓             |           ✓             |                       |   ✓   |
| Réunion                                |            ✓             |           ✓             |                       |   ✓   |
| Rwanda                                 |            ✓             |           ✓             |                       |   ✓   |
| Saint Helena, Ascension, Tristan da Cunha |         ✓             |           ✓             |                       |   ✓   |
| São Tomé & Príncipe                    |            ✓             |           ✓             |                       |   ✓   |
| Saudi Arabia                           |            ✓             |           ✓             |                       |   ✓   |
| Senegal                                |            ✓             |           ✓             |                       |   ✓   |
| Seychelles                             |            ✓             |           ✓             |                       |   ✓   |
| Sierra Leone                           |            ✓             |           ✓             |                       |   ✓   |
| Somalia                                |            ✓             |           ✓             |                       |   ✓   |
| South Africa                           |            ✓             |           ✓             |                       |   ✓   |
| South Sudan                            |            ✓             |           ✓             |                       |   ✓   |
| Sudan                                  |            ✓             |           ✓             |                       |   ✓   |
| Syria                                  |            ✓             |           ✓             |                       |   ✓   |
| Tanzania                               |            ✓             |           ✓             |                       |   ✓   |
| Togo                                   |            ✓             |           ✓             |                       |   ✓   |
| Tunisia                                |            ✓             |           ✓             |                       |   ✓   |
| Uganda                                 |            ✓             |           ✓             |                       |   ✓   |
| United Arab Emirates                   |            ✓             |           ✓             |                       |   ✓   |
| Yemen                                  |            ✓             |           ✓             |                       |   ✓   |
| Zambia                                 |            ✓             |           ✓             |                       |   ✓   |
| Zimbabwe                               |            ✓             |           ✓             |                       |   ✓   |

## Next steps

> [!div class="nextstepaction"]
> [Weather services in Azure Maps]

> [!div class="nextstepaction"]
> [Azure Maps weather services frequently asked questions (FAQ)]

[active storms]: /rest/api/maps/weather/get-tropical-storm-active
[Actuals]: /rest/api/maps/weather/get-daily-historical-actuals
[Azure Maps weather services frequently asked questions (FAQ)]: weather-services-faq.yml
[current]: /rest/api/maps/weather/get-current-air-quality
[daily]: /rest/api/maps/weather/get-air-quality-daily-forecasts
[forecasts]: /rest/api/maps/weather/get-tropical-storm-forecast
[Get Current Conditions]: /rest/api/maps/weather/get-current-conditions
[Get Daily Forecast]: /rest/api/maps/weather/get-current-air-quality
[Get Daily Indices]: /rest/api/maps/weather/get-daily-indices
[Get Hourly Forecast]: /rest/api/maps/weather/get-hourly-forecast
[Get Map Tile]: /rest/api/maps/render-v2/get-map-tile
[Get Minute forecast]: /rest/api/maps/weather/get-minute-forecast
[Get Quarter Day Forecast]: /rest/api/maps/weather/get-quarter-day-forecast
[Get Weather Along Route]: /rest/api/maps/weather/get-weather-along-route
[hourly]: /rest/api/maps/weather/get-air-quality-hourly-forecasts
[locations]: /rest/api/maps/weather/get-tropical-storm-locations
[Normals]: /rest/api/maps/weather/get-daily-historical-normals
[Records]: /rest/api/maps/weather/get-daily-historical-records
[search]: /rest/api/maps/weather/get-tropical-storm-search
[Severe weather alerts]: /rest/api/maps/weather/get-severe-weather-alerts
[Weather services in Azure Maps]: weather-services-concepts.md
[Weather services]: /rest/api/maps/weather
