---
title:  Microsoft Azure Maps Weather services coverage
description: Learn about Microsoft Azure Maps Weather services coverage
author: stevemunk
ms.author: v-munksteve
ms.date: 03/28/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
ms.custom: references_regions
---

# Azure Maps Weather services coverage

This article provides coverage information for Azure Maps [Weather services][weather-services].

## Weather information supported

### Infrared Satellite Tiles
<!-- Replace with Minimal Description
Infrared (IR) radiation is electromagnetic radiation that measures an object's infrared emission, returning information about its temperature. Infrared images can indicate cloud heights (Colder cloud-tops mean higher clouds) and types, calculate land and surface water temperatures, and locate ocean surface features. 
 -->

Infrared satellite imagery, showing clouds by their temperature, is returned when `tilesetID` is set to `microsoft.weather.infrared.main` when making calls to [Get Map Tile][get-map-tile] and can then be overlayed on the map image.

### Minute Forecast

The [Get Minute Forecast][get-minute-forecast] service returns minute-by-minute forecasts for the specified location for the next 120 minutes.

### Radar Tiles
<!-- Replace with Minimal Description
Radar imagery is a depiction of the response returned when microwave radiation is sent into the atmosphere. The pulses of radiation reflect back showing its interactions with any precipitation it encounters. The radar technology visually represents those pulses showing where it's clear, raining, snowing or stormy. 
-->

Radar Tiles, showing areas of rain, snow, ice and mixed conditions, are returned when `tilesetID` is set to `microsoft.weather.radar.main` when making calls to [Get Map Tile][get-map-tile] and can then be overlayed on the map image.

### Severe Weather Alerts

Azure Maps [Severe Weather Alerts][severe-weather-alerts] service returns severe weather alerts from both official Government Meteorological Agencies and other leading severe weather alert providers. The service can return details such as alert type, category, level and detailed description. Severe weather includes conditions like hurricanes, tornados, tsunamis, severe thunderstorms, and fires.

### Other

- **Air Quality**. The Air Quality service returns [current][aq-current], [hourly][aq-hourly] or [daily][aq-daily] forecasts that include pollution levels, air quality index values, the dominant pollutant, and a brief statement summarizing risk level and suggested precautions.
- **Current Conditions**. The [Get Current Conditions](/rest/api/maps/weather/get-current-conditions) service returns detailed current weather conditions such as precipitation, temperature and wind for a given coordinate location.
- **Daily Forecast**. The [Get Daily Forecast](/rest/api/maps/weather/get-current-air-quality) service returns detailed weather forecasts such as temperature and wind by day for the next 1, 5, 10, 15, 25, or 45 days for a given coordinate location.
- **Daily Indices**. The [Get Daily Indices](/rest/api/maps/weather/get-daily-indices) service returns index values that provide information that can help in planning activities. For example, a health mobile application can notify users that today is good weather for running or playing golf.
- **Historical Weather**. The Historical Weather service includes [Daily Historical Records][dh-records], [Daily Historical Actuals][dh-actuals] and [Daily Historical Normals][dh-normals] that return climatology data such as past daily record temperatures, precipitation and snowfall at a given coordinate location.
- **Hourly Forecast**. The [Get Hourly Forecast](/rest/api/maps/weather/get-hourly-forecast) service returns detailed weather forecast information by the hour for up to 10 days.
- **Quarter-day Forecast**. The [Get Quarter Day Forecast](/rest/api/maps/weather/get-quarter-day-forecast) Service returns detailed weather forecast by quarter-day for up to 15 days.
- **Tropical Storms**. The Tropical Storm Service provides information about [active storms][tropical-storm-active], tropical storm [forecasts][tropical-storm-forecasts] and [locations][tropical-storm-locations] and the ability to [search][tropical-storm-search] for tropical storms by year, basin ID, or government ID.
- **Weather Along Route**. The [Get Weather Along Route](/rest/api/maps/weather/get-weather-along-route) Service returns hyper local (1 kilometer or less), up-to-the-minute weather nowcasts, weather hazard assessments, and notifications along a route described as a sequence of waypoints.

<!--{No links, just list what is returned.
- **Air Quality**. The [Get Current Air Quality](/rest/api/maps/weather/get-current-air-quality) service returns pollution levels, air quality index values, the dominant pollutant, and a brief statement summarizing risk level and suggested precautions.
- **Current Conditions**. The [Get Current Conditions](/rest/api/maps/weather/get-current-conditions) service returns detailed current weather conditions such as precipitation, temperature and wind for a given coordinate location
- **Daily Forecast**. The [Get Daily Forecast](/rest/api/maps/weather/get-current-air-quality) service returns detailed weather forecasts such as temperature and wind by day for the next 1, 5, 10, 15, 25, or 45 days for a given coordinate location.
- **Daily Indices**. The [Get Daily Indices](/rest/api/maps/weather/get-daily-indices) service returns index values that provide information that can help in planning activities. For example, a health mobile application can notify users that today is good weather for running or playing golf.
- **Historical Weather**. The [Get Daily Historical Records](/rest/api/maps/weather/get-daily-historical-records) service returns climatology data such as past daily record temperatures, precipitation and snowfall.
- **Hourly Forecast**. The [Get Hourly Forecast](/rest/api/maps/weather/get-hourly-forecast) service returns detailed weather forecast information by the hour for up to 10 days.
- **Quarter-day Forecast**. The [Get Quarter Day Forecast](/rest/api/maps/weather/get-quarter-day-forecast) Service returns detailed weather forecast by quarter-day for up to 15 days.
- **Tropical Storms**. The [Get Tropical Storm Forecast](/rest/api/maps/weather/get-tropical-storm-forecast) Service returns individual government-issued tropical storm forecasts.
- **Weather Along Route**. The [Get Weather Along Route](/rest/api/maps/weather/get-weather-along-route) Service returns hyper local (one kilometer or less), up-to-the-minute weather nowcasts, weather hazard assessments, and notifications along a route described as a sequence of waypoints.
-->

## Azure Maps Weather coverage tables

> [!NOTE]
> Azure Maps doesn't have the same level of detail and accuracy for all countries and regions.

## Americas

| Country/Region                           | Infrared Satellite Tiles | Minute Forecast, Radar Tiles | Severe Weather Alerts | Other* |
|------------------------------------------|:------------------------:|:----------------------------:|:---------------------:|:------:|
| Anguilla                                 |            ✓             |                              |                       |   ✓   |
| Antarctica                               |            ✓             |                              |                       |   ✓   |
| Antigua & Barbuda                        |            ✓             |                              |                       |   ✓   |
| Argentina                                |            ✓             |                              |                       |   ✓   |
| Aruba                                    |            ✓             |                              |                       |   ✓   |
| Bahamas                                  |            ✓             |                              |                       |   ✓   |
| Barbados                                 |            ✓             |                              |                       |   ✓   |
| Belize                                   |            ✓             |                              |                       |   ✓   |
| Bermuda                                  |            ✓             |                              |                       |   ✓   |
| Bolivia                                  |            ✓             |                              |                       |   ✓   |
| Bonaire                                  |            ✓             |                              |                       |   ✓   |
| Brazil                                   |            ✓             |                              |            ✓          |   ✓   |
| British Virgin Islands                   |            ✓             |                              |                       |   ✓   |
| Canada                                   |            ✓             |               ✓              |            ✓         |   ✓   |
| Cayman Islands                           |            ✓             |                              |                       |   ✓   |
| Chile                                    |            ✓             |                              |                       |   ✓   |
| Colombia                                 |            ✓             |                              |                       |   ✓   |
| Costa Rica                               |            ✓             |                              |                       |   ✓   |
| Cuba                                     |            ✓             |                              |                       |   ✓   |
| Curaçao                                  |            ✓             |                              |                       |   ✓   |
| Dominica                                 |            ✓             |                              |                       |   ✓   |
| Dominican Republic                       |            ✓             |                              |                       |   ✓   |
| Ecuador                                  |            ✓             |                              |                       |   ✓   |
| El Salvador                              |            ✓             |                              |                       |   ✓   |
| Falkland Islands                         |            ✓             |                              |                       |   ✓   |
| French Guiana                            |            ✓             |                              |                       |   ✓   |
| Greenland                                |            ✓             |                              |                       |   ✓   |
| Grenada                                  |            ✓             |                              |                       |   ✓   |
| Guadeloupe                               |            ✓             |                              |                       |   ✓   |
| Guatemala                                |            ✓             |                              |                       |   ✓   |
| Guyana                                   |            ✓             |                              |                       |   ✓   |
| Haiti                                    |            ✓             |                              |                       |   ✓   |
| Honduras                                 |            ✓             |                              |                       |   ✓   |
| Jamaica                                  |            ✓             |                              |                       |   ✓   |
| Martinique                               |            ✓             |                              |                       |   ✓   |
| Mexico                                   |            ✓             |                              |                       |   ✓   |
| Montserrat                               |            ✓             |                              |                       |   ✓   |
| Nicaragua                                |            ✓             |                              |                       |   ✓   |
| Panama                                   |            ✓             |                              |                       |   ✓   |
| Paraguay                                 |            ✓             |                              |                       |   ✓   |
| Peru                                     |            ✓             |                              |                       |   ✓   |
| Puerto Rico                              |            ✓             |                              |            ✓          |   ✓   |
| Saint Barthélemy                         |            ✓             |                              |                       |   ✓   |
| Saint Kitts & Nevis                      |            ✓             |                              |                       |   ✓   |
| Saint Lucia                              |            ✓             |                              |                       |   ✓   |
| Saint Martin                             |            ✓             |                              |                       |   ✓   |
| Saint Pierre & Miquelon                  |            ✓             |                              |                       |   ✓   |
| Saint Vincent & the Grenadines           |            ✓             |                              |                       |   ✓   |
| Sint Eustatius                           |            ✓             |                              |                       |   ✓   |
| Sint Maarten                             |            ✓             |                              |                       |   ✓   |
| South Georgia & South Sandwich Islands   |            ✓             |                              |                       |   ✓   |
| Suriname                                 |            ✓             |                              |                       |   ✓   |
| Trinidad & Tobago                        |            ✓             |                              |                       |   ✓   |
| Turks & Caicos Islands                   |            ✓             |                              |                       |   ✓   |
| U.S. Outlying Islands                    |            ✓             |                              |                       |   ✓   |
| U.S. Virgin Islands                      |            ✓             |                              |            ✓          |   ✓   |
| United States                            |            ✓             |               ✓              |            ✓         |   ✓   |
| Uruguay                                  |            ✓             |                              |                       |   ✓   |
| Venezuela                                |            ✓             |                              |                       |   ✓   |

## Asia Pacific

| Country/Region                     | Infrared Satellite Tiles | Minute Forecast, Radar Tiles | Severe Weather Alerts | Other* |
|-----------------------------------|:------------------------:|:----------------------------:|:---------------------:|:------:|
| Afghanistan                        |            ✓             |                              |                       |   ✓   |
| American Samoa                     |            ✓             |                              |           ✓           |   ✓   |
| Australia                          |            ✓             |               ✓              |            ✓         |   ✓   |
| Bangladesh                         |            ✓             |                              |                       |   ✓   |
| Bhutan                             |            ✓             |                              |                       |   ✓   |
| British Indian Ocean Territory     |            ✓             |                              |                       |   ✓   |
| Brunei                             |            ✓             |                              |                       |   ✓   |
| Cambodia                           |            ✓             |                              |                       |   ✓   |
| China                              |            ✓             |               ✓              |            ✓         |   ✓   |
| Christmas Island                   |            ✓             |                              |                       |   ✓   |
| Cocos (Keeling) Islands            |            ✓             |                              |                       |   ✓   |
| Cook Islands                       |            ✓             |                              |                       |   ✓   |
| Fiji                               |            ✓             |                              |                       |   ✓   |
| French Polynesia                   |            ✓             |                              |                       |   ✓   |
| Guam                               |            ✓             |                              |           ✓           |   ✓   |
| Heard Island & McDonald Islands    |            ✓             |                              |                       |   ✓   |
| Hong Kong SAR                      |            ✓             |                              |                       |   ✓   |
| India                              |            ✓             |                              |                       |   ✓   |
| Indonesia                          |            ✓             |                              |                       |   ✓   |
| Japan                              |            ✓             |               ✓              |            ✓         |   ✓   |
| Kazakhstan                         |            ✓             |                              |                       |   ✓   |
| Kiribati                           |            ✓             |                              |                       |   ✓   |
| Korea                              |            ✓             |               ✓              |            ✓         |   ✓   |
| Kyrgyzstan                         |            ✓             |                              |                       |   ✓   |
| Laos                               |            ✓             |                              |                       |   ✓   |
| Macao SAR                          |            ✓             |                              |                       |   ✓   |
| Malaysia                           |            ✓             |                              |                       |   ✓   |
| Maldives                           |            ✓             |                              |                       |   ✓   |
| Marshall Islands                   |            ✓             |                              |           ✓           |   ✓   |
| Micronesia                         |            ✓             |                              |           ✓           |   ✓   |
| Mongolia                           |            ✓             |                              |                       |   ✓   |
| Myanmar                            |            ✓             |                              |                       |   ✓   |
| Nauru                              |            ✓             |                              |                       |   ✓   |
| Nepal                              |            ✓             |                              |                       |   ✓   |
| New Caledonia                      |            ✓             |                              |                       |   ✓   |
| New Zealand                        |            ✓             |                              |           ✓           |   ✓   |
| Niue                               |            ✓             |                              |                       |   ✓   |
| Norfolk Island                     |            ✓             |                              |                       |   ✓   |
| North Korea                        |            ✓             |                              |                       |   ✓   |
| Northern Mariana Islands           |            ✓             |                              |           ✓           |   ✓   |
| Pakistan                           |            ✓             |                              |                       |   ✓   |
| Palau                              |            ✓             |                              |           ✓           |   ✓   |
| Papua New Guinea                   |            ✓             |                              |                       |   ✓   |
| Philippines                        |            ✓             |                              |           ✓           |   ✓   |
| Pitcairn Islands                   |            ✓             |                              |                       |   ✓   |
| Samoa                              |            ✓             |                              |                       |   ✓   |
| Singapore                          |            ✓             |                              |                       |   ✓   |
| Solomon Islands                    |            ✓             |                              |                       |   ✓   |
| Sri Lanka                          |            ✓             |                              |                       |   ✓   |
| Taiwan                             |            ✓             |                              |                       |   ✓   |
| Tajikistan                         |            ✓             |                              |                       |   ✓   |
| Thailand                           |            ✓             |                              |                       |   ✓   |
| Timor-Leste                        |            ✓             |                              |                       |   ✓   |
| Tokelau                            |            ✓             |                              |                       |   ✓   |
| Tonga                              |            ✓             |                              |                       |   ✓   |
| Turkmenistan                       |            ✓             |                              |                       |   ✓   |
| Tuvalu                             |            ✓             |                              |                       |   ✓   |
| Uzbekistan                         |            ✓             |                              |                       |   ✓   |
| Vanuatu                            |            ✓             |                              |                       |   ✓   |
| Vietnam                            |            ✓             |                              |                       |   ✓   |
| Wallis & Futuna                    |            ✓             |                              |                       |   ✓   |

## Europe

| Country/Region          | Infrared Satellite Tiles | Minute Forecast, Radar Tiles | Severe Weather Alerts | Other* |
|-------------------------|:------------------------:|:----------------------------:|:---------------------:|:------:|
| Albania                 |            ✓             |                              |                       |   ✓   |
| Andorra                 |            ✓             |                              |           ✓           |   ✓   |
| Armenia                 |            ✓             |                              |                       |   ✓   |
| Austria                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Azerbaijan              |            ✓             |                              |                       |   ✓   |
| Belarus                 |            ✓             |                              |                       |   ✓   |
| Belgium                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Bosnia & Herzegovina    |            ✓             |               ✓              |            ✓         |   ✓   |
| Bulgaria                |            ✓             |                              |           ✓           |   ✓   |
| Croatia                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Cyprus                  |            ✓             |                              |           ✓           |   ✓   |
| Czechia                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Denmark                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Estonia                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Faroe Islands           |            ✓             |                              |                       |   ✓   |
| Finland                 |            ✓             |               ✓              |            ✓         |   ✓   |
| France                  |            ✓             |               ✓              |            ✓         |   ✓   |
| Georgia                 |            ✓             |                              |                       |   ✓   |
| Germany                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Gibraltar               |            ✓             |               ✓               |                     |   ✓   |
| Greece                  |            ✓             |                              |           ✓           |   ✓   |
| Guernsey                |            ✓             |                              |                       |   ✓   |
| Hungary                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Iceland                 |            ✓             |                              |           ✓           |   ✓   |
| Ireland                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Isle of Man             |            ✓             |                              |                       |   ✓   |
| Italy                   |            ✓             |                              |           ✓           |   ✓   |
| Jan Mayen               |            ✓             |                              |                       |   ✓   |
| Jersey                  |            ✓             |                              |                       |   ✓   |
| Kosovo                  |            ✓             |                              |           ✓           |   ✓   |
| Latvia                  |            ✓             |                              |           ✓           |   ✓   |
| Liechtenstein           |            ✓             |               ✓              |            ✓         |   ✓   |
| Lithuania               |            ✓             |                              |           ✓           |   ✓   |
| Luxembourg              |            ✓             |               ✓              |            ✓         |   ✓   |
| North Macedonia         |            ✓             |                              |           ✓           |   ✓   |
| Malta                   |            ✓             |                              |           ✓           |   ✓   |
| Moldova                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Monaco                  |            ✓             |               ✓              |            ✓         |   ✓   |
| Montenegro              |            ✓             |               ✓              |            ✓         |   ✓   |
| Netherlands             |            ✓             |               ✓              |            ✓         |   ✓   |
| Norway                  |            ✓             |               ✓              |            ✓         |   ✓   |
| Poland                  |            ✓             |               ✓              |            ✓         |   ✓   |
| Portugal                |            ✓             |               ✓              |            ✓         |   ✓   |
| Romania                 |            ✓             |               ✓              |            ✓         |   ✓   |
| Russia                  |            ✓             |                              |           ✓           |   ✓   |
| San Marino              |            ✓             |                              |           ✓           |   ✓   |
| Serbia                  |            ✓             |               ✓              |            ✓         |   ✓   |
| Slovakia                |            ✓             |               ✓              |            ✓         |   ✓   |
| Slovenia                |            ✓             |               ✓              |            ✓         |   ✓   |
| Spain                   |            ✓             |               ✓              |            ✓         |   ✓   |
| Svalbard                |            ✓             |                              |                       |   ✓   |
| Sweden                  |            ✓             |               ✓              |            ✓         |   ✓   |
| Switzerland             |            ✓             |               ✓              |            ✓         |   ✓   |
| Turkey                  |            ✓             |                              |                       |   ✓   |
| Ukraine                 |            ✓             |                              |                       |   ✓   |
| United Kingdom          |            ✓             |               ✓              |            ✓         |   ✓   |
| Vatican City            |            ✓             |                              |           ✓           |   ✓   |

## Middle East & Africa

| Country/Region                         | Infrared Satellite Tiles | Minute Forecast, Radar Tiles | Severe Weather Alerts | Other* |
|----------------------------------------|:------------------------:|:----------------------------:|:---------------------:|:------:|
| Algeria                                |            ✓             |                              |                       |   ✓   |
| Angola                                 |            ✓             |                              |                       |   ✓   |
| Bahrain                                |            ✓             |                              |                       |   ✓   |
| Benin                                  |            ✓             |                              |                       |   ✓   |
| Botswana                               |            ✓             |                              |                       |   ✓   |
| Bouvet Island                          |            ✓             |                              |                       |   ✓   |
| Burkina Faso                           |            ✓             |                              |                       |   ✓   |
| Burundi                                |            ✓             |                              |                       |   ✓   |
| Cameroon                               |            ✓             |                              |                       |   ✓   |
| Cape Verde                             |            ✓             |                              |                       |   ✓   |
| Central African Republic               |            ✓             |                              |                       |   ✓   |
| Chad                                   |            ✓             |                              |                       |   ✓   |
| Comoros                                |            ✓             |                              |                       |   ✓   |
| Congo (DRC)                            |            ✓             |                              |                       |   ✓   |
| Côte d'Ivoire                          |            ✓             |                              |                       |   ✓   |
| Djibouti                               |            ✓             |                              |                       |   ✓   |
| Egypt                                  |            ✓             |                              |                       |   ✓   |
| Equatorial Guinea                      |            ✓             |                              |                       |   ✓   |
| Eritrea                                |            ✓             |                              |                       |   ✓   |
| eSwatini                               |            ✓             |                              |                       |   ✓   |
| Ethiopia                               |            ✓             |                              |                       |   ✓   |
| French Southern Territories            |            ✓             |                              |                       |   ✓   |
| Gabon                                  |            ✓             |                              |                       |   ✓   |
| Gambia                                 |            ✓             |                              |                       |   ✓   |
| Ghana                                  |            ✓             |                              |                       |   ✓   |
| Guinea                                 |            ✓             |                              |                       |   ✓   |
| Guinea-Bissau                          |            ✓             |                              |                       |   ✓   |
| Iran                                   |            ✓             |                              |                       |   ✓   |
| Iraq                                   |            ✓             |                              |                       |   ✓   |
| Israel                                 |            ✓             |                              |            ✓          |   ✓   |
| Jordan                                 |            ✓             |                              |                       |   ✓   |
| Kenya                                  |            ✓             |                              |                       |   ✓   |
| Kuwait                                 |            ✓             |                              |                       |   ✓   |
| Lebanon                                |            ✓             |                              |                       |   ✓   |
| Lesotho                                |            ✓             |                              |                       |   ✓   |
| Liberia                                |            ✓             |                              |                       |   ✓   |
| Libya                                  |            ✓             |                              |                       |   ✓   |
| Madagascar                             |            ✓             |                              |                       |   ✓   |
| Malawi                                 |            ✓             |                              |                       |   ✓   |
| Mali                                   |            ✓             |                              |                       |   ✓   |
| Mauritania                             |            ✓             |                              |                       |   ✓   |
| Mauritius                              |            ✓             |                              |                       |   ✓   |
| Mayotte                                |            ✓             |                              |                       |   ✓   |
| Morocco                                |            ✓             |                              |                       |   ✓   |
| Mozambique                             |            ✓             |                              |                       |   ✓   |
| Namibia                                |            ✓             |                              |                       |   ✓   |
| Niger                                  |            ✓             |                              |                       |   ✓   |
| Nigeria                                |            ✓             |                              |                       |   ✓   |
| Oman                                   |            ✓             |                              |                       |   ✓   |
| Palestinian Authority                  |            ✓             |                              |                       |   ✓   |
| Qatar                                  |            ✓             |                              |                       |   ✓   |
| Réunion                                |            ✓             |                              |                       |   ✓   |
| Rwanda                                 |            ✓             |                              |                       |   ✓   |
| Saint Helena, Ascension, Tristan da Cunha |         ✓             |                              |                       |   ✓   |
| São Tomé & Príncipe                    |            ✓             |                              |                       |   ✓   |
| Saudi Arabia                           |            ✓             |                              |                       |   ✓   |
| Senegal                                |            ✓             |                              |                       |   ✓   |
| Seychelles                             |            ✓             |                              |                       |   ✓   |
| Sierra Leone                           |            ✓             |                              |                       |   ✓   |
| Somalia                                |            ✓             |                              |                       |   ✓   |
| South Africa                           |            ✓             |                              |                       |   ✓   |
| South Sudan                            |            ✓             |                              |                       |   ✓   |
| Sudan                                  |            ✓             |                              |                       |   ✓   |
| Syria                                  |            ✓             |                              |                       |   ✓   |
| Tanzania                               |            ✓             |                              |                       |   ✓   |
| Togo                                   |            ✓             |                              |                       |   ✓   |
| Tunisia                                |            ✓             |                              |                       |   ✓   |
| Uganda                                 |            ✓             |                              |                       |   ✓   |
| United Arab Emirates                   |            ✓             |                              |                       |   ✓   |
| Yemen                                  |            ✓             |                              |                       |   ✓   |
| Zambia                                 |            ✓             |                              |                       |   ✓   |
| Zimbabwe                               |            ✓             |                              |                       |   ✓   |

## Next steps

> [!div class="nextstepaction"]
> [Weather services in Azure Maps](weather-services-concepts.md)

> [!div class="nextstepaction"]
> [Azure Maps Weather services frequently asked questions (FAQ)](weather-services-faq.yml)

[weather-services]: /rest/api/maps/weather
[get-map-tile]: /rest/api/maps/render-v2/get-map-tile
[get-minute-forecast]: /rest/api/maps/weather/get-minute-forecast
[severe-weather-alerts]: /rest/api/maps/weather/get-severe-weather-alerts

[aq-current]: /rest/api/maps/weather/get-current-air-quality
[aq-hourly]: /rest/api/maps/weather/get-air-quality-hourly-forecasts
[aq-daily]: /rest/api/maps/weather/get-air-quality-daily-forecasts

[current-conditions]: /rest/api/maps/weather/get-current-conditions

[dh-records]: /rest/api/maps/weather/get-dh-records
[dh-actuals]: /rest/api/maps/weather/get-dh-actuals
[dh-normals]: /rest/api/maps/weather/get-dh-normals

[tropical-storm-active]: /rest/api/maps/weather/get-tropical-storm-active
[tropical-storm-forecasts]: /rest/api/maps/weather/get-tropical-storm-forecast
[tropical-storm-locations]: /rest/api/maps/weather/get-tropical-storm-locations
[tropical-storm-search]: /rest/api/maps/weather/get-tropical-storm-search
