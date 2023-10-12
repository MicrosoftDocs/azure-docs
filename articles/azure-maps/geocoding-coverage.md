---
title: Geocoding coverage in Microsoft Azure Maps Search service
titleSuffix: Microsoft Azure Maps
description: See which regions Azure Maps Search covers. Geocoding categories include address points, house numbers, street level, city level, and points of interest.
author: eriklindeman
ms.author: eriklind
ms.date: 11/30/2021
ms.topic: reference
ms.service: azure-maps
services: azure-maps
---

# Azure Maps geocoding coverage

The [Search service] supports geocoding, which means that your API request can have search terms, like an address or the name of a place, and returns the result as latitude and longitude coordinates. For example, [Get Search Address] receives queries that contain location information, and returns results as latitude and longitude coordinates.

However, the [Search service] doesn't have the same level of information and accuracy for all countries/regions. Use this article to determine what kind of locations you can reliably search for in each region.

The ability to geocode in a country/region is dependent upon the road data coverage and geocoding precision of the geocoding service. The following categorizations are used to specify the level of geocoding support in each country/region.

* **Address points** - Address data can be resolved to latitude/longitude coordinates within the address parcel (property boundary). Address points are often referred to as being 'Rooftop' accurate, which is the highest level of accuracy available for addresses.
* **House numbers** - Addresses are interpolated to a latitude/longitude coordinate on the street.
* **Street level** - Addresses are resolved to the latitude/longitude coordinate of the street that contains the address. The house number may not be processed.
* **City level** - City place names are supported.

## Americas

| Country/Region                                       | Address points | House numbers | Street level | City level | Points of interest  |
|-----------------------------------------------------|:---------------:|:--------------:|:------------:|:----------:|:------------------:|
| Anguilla                                            |                 |                |              |      ✓     |          ✓        |
| Antigua & Barbuda                                   |                 |                |       ✓      |      ✓     |          ✓        |
| Argentina                                           |       ✓         |        ✓      |       ✓      |      ✓     |          ✓        |
| Aruba                                               |                 |                |              |      ✓     |          ✓        |
| Bahamas                                             |                 |                |       ✓      |      ✓     |          ✓        |
| Barbados                                            |                 |                |       ✓      |      ✓     |          ✓        |
| Belize                                              |                 |                |       ✓      |      ✓     |          ✓        |
| Bermuda                                             |                 |                |       ✓      |      ✓     |          ✓        |
| Bolivia                                             |                 |                |       ✓      |      ✓     |          ✓        |
| Bonaire, Sint Eustatius, & Saba                     |                 |                |              |      ✓     |          ✓         |
| Brazil                                              |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| British Virgin Islands                              |                 |                |              |      ✓     |          ✓         |
| Canada                                              |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| Cayman Islands                                      |                 |                |       ✓      |      ✓     |          ✓         |
| Chile                                               |       ✓         |        ✓      |       ✓      |      ✓     |          ✓         |
| Clipperton Island                                   |                 |                |              |      ✓     |          ✓         |
| Colombia                                            |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| Costa Rica                                          |                 |                |       ✓      |      ✓     |          ✓         |
| Cuba                                                |                 |                |       ✓      |      ✓     |          ✓         |
| Curaçao                                             |                 |                |              |      ✓     |          ✓         |
| Dominica                                            |                 |                |       ✓      |      ✓     |          ✓         |
| Dominican Republic                                  |                 |                |       ✓      |      ✓     |          ✓         |
| Ecuador                                             |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| El Salvador                                         |                 |                |       ✓      |      ✓     |          ✓         |
| Falkland Islands                                    |                 |                |              |      ✓     |          ✓         |
| French Guiana                                       |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| Greenland                                           |                 |                |              |      ✓     |          ✓         |
| Grenada                                             |                 |                |       ✓      |      ✓     |          ✓         |
| Guadeloupe                                          |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| Guatemala                                           |                 |                |       ✓      |      ✓     |          ✓         |
| Guyana                                              |                 |                |       ✓      |      ✓     |          ✓         |
| Haiti                                               |                 |                |       ✓      |      ✓     |          ✓         |
| Honduras                                            |                 |                |       ✓      |      ✓     |          ✓         |
| Jamaica                                             |                 |                |       ✓      |      ✓     |          ✓         |
| Martinique                                          |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| Mexico                                              |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| Montserrat                                          |                 |                |              |      ✓     |          ✓         |
| Nicaragua                                           |                 |                |       ✓      |      ✓     |          ✓         |
| Panama                                              |                 |                |       ✓      |      ✓     |          ✓         |
| Paraguay                                            |                 |                |       ✓      |      ✓     |          ✓         |
| Peru                                                |        ✓        |                |       ✓      |      ✓     |          ✓         |
| Puerto Rico                                         |                 |        ✓       |       ✓      |      ✓     |          ✓         |
| Saint Barthélemy                                    |                 |                |       ✓      |      ✓     |           ✓        |
| Saint Kitts & Nevis                                 |                 |                |       ✓      |      ✓     |           ✓        |
| Saint Lucia                                         |                 |                |              |      ✓     |           ✓        |
| Saint Martin                                        |                 |                |       ✓      |      ✓     |           ✓        |
| Saint Pierre & Miquelon                             |                 |                |       ✓      |      ✓     |           ✓        |
| Saint Vincent & the Grenadines                      |                 |                |              |      ✓     |           ✓        |
| Sint Maarten                                        |                 |                |       ✓      |      ✓     |           ✓        |
| South Georgia & the South Sandwich Islands          |                 |                |              |      ✓     |           ✓        |
| Suriname                                            |                 |                |       ✓      |      ✓     |          ✓         |
| Trinidad & Tobago                                   |                 |                |       ✓      |      ✓     |          ✓         |
| Turks & Caicos Islands                              |                 |                |              |      ✓     |           ✓        |
| U.S. Outlying Islands                               |                 |                |              |      ✓     |           ✓        |
| U.S. Virgin Islands                                 |                 |        ✓       |       ✓     |      ✓     |           ✓        |
| United States                                       |        ✓        |        ✓      |       ✓      |      ✓     |           ✓        |
| Uruguay                                             |        ✓        |        ✓      |       ✓      |      ✓     |           ✓        |
| Venezuela                                           |                 |                |       ✓      |      ✓     |           ✓        |

## Asia Pacific

| Country/Region                                      | Address points |House numbers | Street level | City level | Points of interest |
|-----------------------------------------------------|:---------------:|:--------------:|:------------:|:----------:|:---------------:|
| American Samoa                                      |                 |                |       ✓      |      ✓     |       ✓        |
| Australia                                           |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| Bangladesh                                          |                 |                |              |      ✓     |       ✓        |
| Bhutan                                              |                 |                |              |      ✓     |       ✓        |
| Brunei                                              |        ✓        |                |       ✓      |      ✓    |       ✓        |
| Cambodia                                            |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| China                                               |                 |                |              |      ✓     |       ✓        |
| Christmas Island                                    |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| Cocos (Keeling) Islands                             |                 |                |        ✓     |      ✓     |       ✓        |
| Comoros                                             |                 |                |              |      ✓     |       ✓        |
| Cook Islands                                        |                 |                |              |      ✓     |       ✓        |
| Fiji                                                |                 |                |      ✓       |      ✓     |       ✓        |
| French Polynesia                                    |                 |                |       ✓      |      ✓     |       ✓        |
| Guam                                                |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| Heard Island & McDonald Islands                     |                 |                |              |      ✓     |       ✓        |
| Hong Kong SAR                                       |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| India                                               |        ✓        |                |       ✓     |      ✓     |       ✓        |
| Indonesia                                           |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| Japan                                               |                 |                |              |      ✓     |       ✓        |
| Kiribati                                            |                 |                |              |      ✓     |       ✓        |
| Laos                                                |        ✓        |                |       ✓     |      ✓     |       ✓        |
| Macao SAR                                           |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| Malaysia                                            |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| Maldives                                            |                 |                |              |      ✓     |       ✓        |
| Myanmar                                             |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| Micronesia                                          |                 |                |              |      ✓     |       ✓        |
| Mongolia                                            |                 |                |              |      ✓     |       ✓        |
| Nauru                                               |                 |                |              |      ✓     |       ✓        |
| Nepal                                               |                 |                |              |      ✓     |       ✓        |
| New Caledonia                                       |                 |                |              |      ✓     |       ✓        |
| New Zealand                                         |        ✓        |        ✓      |       ✓      |      ✓     |      ✓         |
| Niue                                                |                 |                |              |      ✓     |       ✓        |
| Norfolk Island                                      |                 |                |      ✓       |      ✓     |       ✓        |
| North Korea                                         |                 |                |              |      ✓     |       ✓        |
| Northern Mariana Islands                            |                 |                |       ✓      |      ✓     |       ✓        |
| Pakistan                                            |                 |                |              |      ✓     |       ✓        |
| Palau                                               |                 |                |              |      ✓     |       ✓        |
| Papua New Guinea                                    |                 |                |              |      ✓     |       ✓        |
| Philippines                                         |        ✓        |                |       ✓     |      ✓     |       ✓        |
| Pitcairn Islands                                    |                 |                |              |      ✓     |       ✓        |
| Samoa                                               |                 |                |              |      ✓     |       ✓        |
| Singapore                                           |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| Solomon Islands                                     |                 |                |              |      ✓     |       ✓        |
| South Korea                                         |                 |                |              |      ✓     |       ✓        |
| Sri Lanka                                           |                 |                |              |      ✓     |       ✓        |
| Taiwan                                              |        ✓        |        ✓      |       ✓      |      ✓     |       ✓        |
| Thailand                                            |        ✓        |                |       ✓     |      ✓     |       ✓        |
| Timor-Leste                                         |                 |                |              |      ✓     |       ✓        |
| Tokelau                                             |                 |                |              |      ✓     |       ✓        |
| Tonga                                               |                 |                |              |      ✓     |       ✓        |
| Turks & Caicos Islands                              |                 |                |              |      ✓     |       ✓        |
| Tuvalu                                              |                 |                |              |      ✓     |       ✓        |
| Vanuatu                                             |                 |                |              |      ✓     |       ✓        |
| Vietnam                                             |        ✓        |                |       ✓     |      ✓     |       ✓        |
| Wallis & Futuna                                     |                 |                |              |      ✓     |       ✓        |

## Europe

| Country/Region                                      | Address points  |House numbers  | Street level  | City level | Points of interest |
|-----------------------------------------------------|:---------------:|:--------------:|:------------:|:----------:|:------------------:|
| Albania                                             |                 |                |       ✓      |      ✓     |          ✓        |
| Andorra                                             |        ✓        |        ✓      |       ✓      |      ✓     |          ✓        |
| Armenia                                             |        ✓        |                |        ✓     |      ✓     |          ✓       |
| Austria                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓       |
| Azerbaijan                                          |        ✓        |                |       ✓      |      ✓     |          ✓        |
| Belarus                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Belgium                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Bosnia & Herzegovina                                |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Bulgaria                                            |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Croatia                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Cyprus                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Czech Republic                                      |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Denmark                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Estonia                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Faroe Islands                                       |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Finland                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| France                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Georgia                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Germany                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Gibraltar                                           |                 |        ✓       |       ✓      |      ✓     |          ✓        |
| Greece                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Guernsey                                            |                 |        ✓       |       ✓      |      ✓     |          ✓         |
| Hungary                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Iceland                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Ireland                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Isle of Man                                         |                 |        ✓       |       ✓      |      ✓     |           ✓        |
| Italy                                               |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Jan Mayen                                           |                 |                |               |      ✓     |          ✓         |
| Jersey                                              |                 |        ✓       |       ✓      |      ✓     |          ✓         |
| Kazakhstan                                          |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Kosovo                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Kyrgyzstan                                          |        ✓        |                |       ✓      |      ✓     |           ✓        |
| Latvia                                              |                 |        ✓       |       ✓      |      ✓     |          ✓         |
| Liechtenstein                                       |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Lithuania                                           |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Luxembourg                                          |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Malta                                               |                 |                 |       ✓      |      ✓     |          ✓         |
| Moldova                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Monaco                                              |                 |        ✓       |       ✓      |      ✓     |           ✓        |
| Montenegro                                          |                 |                 |       ✓      |      ✓     |          ✓         |
| Netherlands                                         |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| North Macedonia                                     |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Norway                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Poland                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Portugal                                            |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Romania                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Russia                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| San Marino                                          |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Serbia                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Slovakia                                            |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Slovenia                                            |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Spain                                               |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Svalbard                                            |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Sweden                                              |                 |        ✓       |       ✓      |      ✓     |          ✓         |
| Switzerland                                         |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Tajikistan                                          |                 |                 |       ✓      |      ✓     |          ✓         |
| Türkiye                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Turkmenistan                                        |                 |                 |              |      ✓     |           ✓        |
| Ukraine                                             |        ✓        |        ✓       |       ✓      |      ✓     |           ✓        |
| United Kingdom                                      |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Uzbekistan                                          |                 |                |               |      ✓     |          ✓         |
| Vatican City                                        |                 |                |       ✓       |      ✓     |          ✓         |

## Middle East & Africa

| Country/Region                                      | Address points |House numbers | Street level | City level | Points of interest |
|-----------------------------------------------------|:--------------:|:------------:|:------------:|:----------:|:------------------:|
| Afghanistan                                         |                |              |              |      ✓     |        ✓          |
| Algeria                                             |        ✓       |       ✓     |       ✓      |      ✓     |        ✓          |
| Angola                                              |                |              |       ✓      |      ✓     |        ✓          |
| Bahrain                                             |        ✓       |       ✓     |       ✓      |      ✓     |        ✓          |
| Benin                                               |                |              |       ✓      |      ✓     |        ✓          |
| Botswana                                            |                |              |       ✓      |      ✓     |        ✓          |
| Bouvet Island                                       |                |              |              |      ✓     |        ✓          |
| Burkina Faso                                        |                |              |       ✓      |      ✓     |        ✓          |
| Burundi                                             |                |              |       ✓      |      ✓     |        ✓          |
| Cameroon                                            |                |              |       ✓      |      ✓     |        ✓          |
| Cabo Verde                                          |                |              |       ✓      |      ✓     |        ✓          |
| Central African Republic                            |                |              |       ✓      |      ✓     |        ✓          |
| Chad                                                |                |              |              |      ✓     |        ✓          |
| Congo                                               |                |              |              |      ✓     |        ✓          |
| Congo (DRC)                                         |                |              |       ✓      |      ✓     |        ✓          |
| Côte d'Ivoire                                       |                |              |       ✓      |      ✓     |        ✓          |
| Djibouti                                            |                |              |       ✓      |      ✓     |        ✓          |
| Egypt                                               |        ✓       |        ✓    |       ✓      |      ✓     |        ✓          |
| Equatorial Guinea                                   |                |              |              |      ✓     |        ✓          |
| Eritrea                                             |                |              |              |      ✓     |        ✓          |
| Ethiopia                                            |                |              |       ✓      |      ✓     |        ✓          |
| French Southern Territories                         |                |              |              |      ✓     |        ✓          |
| Gabon                                               |                |              |       ✓      |      ✓     |        ✓          |
| Gambia                                              |                |              |       ✓      |      ✓     |        ✓          |
| Ghana                                               |                |              |       ✓      |      ✓     |        ✓          |
| Guinea                                              |                |              |       ✓      |      ✓     |        ✓          |
| Guinea-Bissau                                       |                |              |       ✓      |      ✓     |        ✓          |
| Iran                                                |                |              |              |      ✓     |        ✓          |
| Iraq                                                |                |              |       ✓      |      ✓     |        ✓          |
| Israel                                              |        ✓       |       ✓     |      ✓       |      ✓     |        ✓          |
| Jordan                                              |        ✓       |              |       ✓      |      ✓     |        ✓          |
| Kenya                                               |                |              |       ✓      |      ✓     |        ✓          |
| Kuwait                                              |        ✓       |        ✓    |       ✓      |      ✓     |        ✓          |
| Lebanon                                             |        ✓       |        ✓    |       ✓      |      ✓     |        ✓          |
| Lesotho                                             |                |              |       ✓      |      ✓     |        ✓          |
| Liberia                                             |                |              |              |      ✓     |        ✓          |
| Libya                                               |                |              |              |      ✓     |        ✓          |
| Madagascar                                          |                |              |       ✓      |      ✓     |        ✓          |
| Malawi                                              |                |              |       ✓      |      ✓     |        ✓          |
| Mali                                                |                |              |              |      ✓     |        ✓          |
| Mauritania                                          |                |              |              |      ✓     |        ✓          |
| Mauritius                                           |                |              |       ✓      |      ✓     |        ✓          |
| Mayotte                                             |                |              |       ✓      |      ✓     |        ✓          |
| Morocco                                             |        ✓       |        ✓    |       ✓      |      ✓     |        ✓          |
| Mozambique                                          |                |              |       ✓      |      ✓     |        ✓          |
| Namibia                                             |        ✓       |        ✓    |       ✓      |      ✓     |        ✓          |
| Niger                                               |                |              |              |      ✓     |        ✓          |
| Nigeria                                             |                |        ✓     |       ✓     |      ✓     |        ✓          |
| Oman                                                |                |              |       ✓      |      ✓     |        ✓          |
| Qatar                                               |        ✓       |              |       ✓     |      ✓     |        ✓          |
| Réunion                                             |        ✓       |        ✓     |       ✓     |      ✓     |        ✓          |
| Rwanda                                              |                |              |       ✓      |      ✓     |        ✓          |
| Saint Helena, Ascension, and Tristan da Cunha       |                |              |              |      ✓     |        ✓          |
| São Tomé & Príncipe                                 |                |              |       ✓      |      ✓     |        ✓          |
| Saudi Arabia                                        |        ✓       |              |       ✓      |      ✓     |        ✓          |
| Senegal                                             |                |              |       ✓      |      ✓     |        ✓          |
| Seychelles                                          |                |              |       ✓      |      ✓     |        ✓          |
| Sierra Leone                                        |                |              |       ✓      |      ✓     |        ✓          |
| Somalia                                             |                |              |              |      ✓     |        ✓          |
| South Africa                                        |        ✓       |        ✓    |       ✓      |      ✓     |        ✓          |
| South Sudan                                         |                |              |              |      ✓     |        ✓          |
| Sudan                                               |                |              |              |      ✓     |        ✓          |
| Syria                                               |                |              |              |      ✓     |        ✓          |
| Tanzania                                            |                |              |       ✓      |      ✓     |        ✓          |
| Togo                                                |                |              |       ✓      |      ✓     |        ✓          |
| Tunisia                                             |        ✓       |       ✓     |       ✓      |      ✓     |        ✓          |
| Uganda                                              |                |              |       ✓      |      ✓     |        ✓          |
| United Arab Emirates                                |        ✓       |        ✓    |       ✓      |      ✓     |        ✓          |
| Yemen                                               |                |              |              |      ✓     |        ✓          |
| Zambia                                              |                |              |       ✓      |      ✓     |        ✓          |
| Zimbabwe                                            |                |              |       ✓      |      ✓     |        ✓          |

## Next steps

Learn more about Azure Maps geocoding:
> [!div class="nextstepaction"]
> [Azure Maps Search service]

[Search service]: /rest/api/maps/search
[Azure Maps Search service]: /rest/api/maps/search
[Get Search Address]: /rest/api/maps/search/get-search-address
