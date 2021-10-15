---
title: Geocoding coverage in Microsoft Azure Maps Search service
description: See which regions Azure Maps Search covers. Geocoding categories include address points, house numbers, street level, city level, and points of interest.
author: stevemunk
ms.author: v-munksteve
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps

---

# Azure Maps geocoding coverage

The Azure Maps [Search service](/rest/api/maps/search) supports geocoding, which means that your API request can have search terms, like an address or the name of a place, and returns the result as latitude and longitude coordinates. For example, the Azure Maps [Get Search Address API](/rest/api/maps/search/getsearchaddress) receives queries that contain location information, and returns results as latitude and longitude coordinates.

However, the Azure Maps [Search service](/rest/api/maps/search) doesn't have the same level of information and accuracy for all regions and countries. Use this article to determine what kind of locations you can reliably search for in each region.

The ability to geocode in a country/region is dependent upon the road data coverage and geocoding precision of the geocoding service. The following categorizations are used to specify the level of geocoding support in each country/region.

* **Address points** - Address data can be resolved to latitude/longitude coordinates within the address parcel (property boundary). Address points are often referred to as being 'Rooftop' accurate, which is the highest level of accuracy available for addresses.
* **House numbers** - Addresses are interpolated to a latitude/longitude coordinate on the street.
* **Street level** - Addresses are resolved to the latitude/longitude coordinate of the street that contains the address. The house number may not be processed.
* **City level** - City place names are supported.

## Americas

| Country/Region                                       | Address points | House numbers | Street level | City level | Points of interest  |
|-----------------------------------------------------|:---------------:|:--------------:|:------------:|:----------:|:------------------:|
| Anguilla                                            |                 |                |              |      ✓     |          ✓         |
| Antigua and Barbuda                                 |                 |                |       ✓      |      ✓     |                    |
| Argentina                                           |       ✓         |        ✓      |       ✓      |      ✓     |          ✓         |
| Aruba                                               |                 |                |              |      ✓     |          ✓         |
| Bahamas                                             |                 |                |       ✓      |      ✓     |          ✓         |
| Barbados                                            |                 |                |       ✓      |      ✓     |          ✓         |
| Belize                                              |                 |                |       ✓      |      ✓     |          ✓         |
| Bermuda                                             |                 |                |       ✓      |      ✓     |                    |
| Bolivia                                             |                 |                |       ✓      |      ✓     |          ✓         |
| Bonaire, Sint Eustatius, and Saba                   |                 |                |              |      ✓     |                    |
| Bouvet Island                                       |                 |                |              |      ✓     |                    |
| Brazil                                              |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| British Virgin Islands                              |                 |                |              |      ✓     |          ✓         |
| Canada                                              |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| Cayman Islands                                      |                 |                |       ✓      |      ✓     |                    |
| Chile                                               |       ✓         |        ✓      |       ✓      |      ✓     |                    |
| Clipperton Island                                   |                 |                |              |      ✓     |                    |
| Colombia                                            |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| Costa Rica                                          |                 |                |       ✓      |      ✓     |          ✓         |
| Cuba                                                |                 |                |       ✓      |      ✓     |                    |
| Curaçao                                             |                 |                |              |      ✓     |                    |
| Dominica                                            |                 |                |       ✓      |      ✓     |                   |
| Dominican Republic                                  |                 |                |       ✓      |      ✓     |          ✓         |
| Ecuador                                             |        ✓        |        ✓      |       ✓      |      ✓     |          ✓         |
| El Salvador                                         |                 |                |       ✓      |      ✓     |          ✓         |
| Falkland Islands                                    |                 |                |              |      ✓     |                    |
| French Guiana                                       |        ✓        |        ✓      |       ✓      |      ✓     |                    |
| Grenada                                             |                 |                |       ✓      |      ✓     |                    |
| Guadeloupe                                          |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Guam                                                |        ✓        |        ✓      |       ✓      |      ✓     |                    |
| Guatemala                                           |                 |                |       ✓      |      ✓     |          ✓         |
| Guyana                                              |                 |                |       ✓      |      ✓     |                     |
| Haiti                                               |                 |                |       ✓      |      ✓     |          ✓         |
| Honduras                                            |                 |                |       ✓      |      ✓     |          ✓         |
| Jamaica                                             |                 |                |       ✓      |      ✓     |          ✓         |
| Martinique                                          |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Mexico                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Montserrat                                          |                 |                |              |      ✓     |          ✓         |
| Nicaragua                                           |                 |                |       ✓      |      ✓     |          ✓         |
| Panama                                              |                 |                |       ✓      |      ✓     |          ✓         |
| Paraguay                                            |                 |                |       ✓      |      ✓     |          ✓         |
| Peru                                                |        ✓         |               |       ✓      |      ✓     |                   |
| Puerto Rico                                         |                 |        ✓       |       ✓      |      ✓     |                   |
| Saint Barthélemy                                    |                 |                |       ✓      |      ✓     |                   |
| Saint Kitts and Nevis                               |                 |                |       ✓      |      ✓     |                   |
| Saint Lucia                                         |                 |                |              |      ✓     |                   |
| Saint Martin                                        |                 |                |       ✓      |      ✓     |                   |
| Saint Pierre and Miquelon                           |                 |                |       ✓      |      ✓     |                   |
| Saint Vincent and the Grenadines                    |                 |                |              |      ✓     |          ✓         |
| Sint Maarten                                        |                 |                |       ✓      |      ✓     |                    |
| South Georgia and the South Sandwich Islands        |                 |                |              |      ✓     |                    |
| Suriname                                            |                 |                |       ✓      |      ✓     |          ✓         |
| Trinidad and Tobago                                 |                 |                |       ✓      |      ✓     |          ✓         |
| Turks & Caicos Islands                              |                 |                |              |      ✓     |                     |
| U.S. Virgin Islands                                 |                 |        ✓       |       ✓      |      ✓     |          ✓         |
| United States Minor Outlying Islands                |                 |                |              |      ✓     |          ✓         |
| United States of America                            |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Uruguay                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Venezuela                                           |                 |                |       ✓      |      ✓     |          ✓         |

## Asia Pacific

| Country/Region                                      | Address points |House numbers | Street level | City level | Points of interest |
|-----------------------------------------------------|:---------------:|:--------------:|:------------:|:----------:|:------------------:|
| American Samoa                                      |                 |                |       ✓      |      ✓     |                    |
| Australia                                           |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Bangladesh                                          |                 |                |              |      ✓     |                   |
| Bhutan                                              |                 |                |              |      ✓     |                   |
| Brunei                                              |        ✓        |                |       ✓      |      ✓     |                    |
| Cambodia                                            |        ✓        |        ✓       |       ✓      |      ✓     |                    |
| China                                               |                 |                |              |      ✓     |                    |
| Christmas Island                                    |        ✓        |        ✓       |       ✓      |      ✓     |                    |
| Cocos (Keeling) Islands                             |                 |                |        ✓      |      ✓     |                    |
| Comoros                                             |                 |                |              |      ✓     |                    |
| Cook Islands                                        |                 |                |              |      ✓     |                    |
| Fiji                                                |                  |                |      ✓      |      ✓     |          ✓        |
| French Polynesia                                    |                 |                |       ✓      |      ✓     |                    |
| French Southern Territories                         |                 |                |              |      ✓     |                    |
| Heard Island and McDonald Islands                   |                 |                |              |      ✓     |                    |
| Hong Kong SAR                                       |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| India                                               |        ✓        |                |       ✓      |      ✓     |                   |
| Indonesia                                           |        ✓        |        ✓       |       ✓      |      ✓     |                    |
| Jammu & Kashmir                                     |                 |                |        ✓     |      ✓     |                    |
| Japan                                               |                 |                |              |      ✓     |                   |
| Kiribati                                            |                 |                |              |      ✓     |                    |
| Laos                                                |        ✓        |                |       ✓      |      ✓     |                    |
| Macao SAR                                           |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Malaysia                                            |        ✓        |        ✓       |       ✓      |      ✓     |                    |
| Maldives                                            |                 |                |              |      ✓     |                    |
| Myanmar                                             |        ✓        |        ✓       |       ✓      |      ✓     |                    |
| Micronesia                                          |                 |                |              |      ✓     |                    |
| Mongolia                                            |                 |                |              |      ✓     |                    |
| Nauru                                               |                 |                |              |      ✓     |                    |
| Nepal                                               |                 |                |              |      ✓     |                    |
| New Caledonia                                       |                 |                |              |      ✓     |                    |
| New Zealand                                         |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Niue                                                |                 |                |              |      ✓     |                   |
| Norfolk Island                                      |                 |                |      ✓       |      ✓     |                   |
| North Korea                                         |                 |                |              |      ✓     |                   |
| Northern Mariana Islands                            |                 |                |       ✓      |      ✓     |                   |
| Pakistan                                            |                 |                |              |      ✓     |                   |
| Palau                                               |                 |                |              |      ✓     |                   |
| Papua New Guinea                                    |                 |                |              |      ✓     |                   |
| Philippines                                         |        ✓        |                |       ✓      |      ✓     |                 |
| Pitcairn                                            |                 |                |              |      ✓     |                   |
| Samoa                                               |                 |                |              |      ✓     |                   |
| Singapore                                           |        ✓        |        ✓       |       ✓      |      ✓     |                    |
| Solomon Islands                                     |                 |                |              |      ✓     |                    |
| South Korea                                         |                 |                |              |      ✓     |                    |
| Sri Lanka                                           |                 |                |              |      ✓     |                    |
| Taiwan                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Thailand                                            |        ✓        |                |       ✓      |      ✓     |                   |
| Timor-Leste                                         |                 |                |              |      ✓     |                    |
| Tokelau                                             |                 |                |              |      ✓     |                   |
| Tonga                                               |                 |                |              |      ✓     |                   |
| Turks and Caicos Islands                            |                 |                |              |      ✓     |                   |
| Tuvalu                                              |                 |                |              |      ✓     |                   |
| United States Minor Outlying Islands                |                 |                |              |      ✓     |                    |
| Vanuatu                                             |                 |                |              |      ✓     |                   |
| Vietnam                                             |        ✓        |                |       ✓      |      ✓     |                   |
| Wallis and Futuna                                   |                 |                |              |      ✓     |                   |

## Europe

| Country/Region                                      | Address points  |House numbers  | Street level  | City level | Points of interest |
|-----------------------------------------------------|:---------------:|:--------------:|:------------:|:----------:|:------------------:|
| Albania                                             |                 |                |       ✓      |      ✓     |          ✓        |
| Andorra                                             |        ✓        |        ✓      |       ✓      |      ✓     |          ✓        |
| Apkhazeti                                           |                 |                |       ✓      |      ✓     |          ✓        |
| Armenia                                             |        ✓        |                |        ✓     |      ✓     |          ✓       |
| Austria                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓       |
| Azerbaijan                                          |        ✓        |                |       ✓      |      ✓     |          ✓        |
| Belarus                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Belgium                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Bosnia And Herzegovina                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Bulgaria                                            |        ✓        |        ✓       |       ✓      |      ✓     |                  |
| Croatia                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Cyprus                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Czech Republic                                      |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Denmark                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Estonia                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Faroe Islands                                       |        ✓        |        ✓       |       ✓      |      ✓     |                  |
| Finland                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| France                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Geopolitical Waterbelt Greece                       |                 |                |               |      ✓     |                    |
| Georgia                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓        |
| Germany                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Gibraltar                                           |                 |        ✓       |       ✓      |      ✓     |                   |
| Greece                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Greenland                                           |                 |                |              |      ✓     |                   |
| Guernsey                                            |                 |        ✓       |       ✓      |      ✓     |                   |
| Hungary                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Iceland                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Imia Island / Kardak Rocks                          |                 |                 |               |      ✓    |                    |
| Ireland                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Isle Of Man                                         |                 |        ✓       |       ✓      |      ✓     |                   |
| Italy                                               |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Jan Mayen                                           |                 |                |              |      ✓     |                   |
| Jersey                                              |                 |        ✓       |       ✓      |      ✓     |                   |
| Kazakhstan                                          |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Kosovo                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Kyrgyzstan                                          |        ✓        |                |       ✓      |      ✓     |                   |
| Latvia                                              |                 |        ✓       |       ✓      |      ✓     |          ✓         |
| Liechtenstein                                       |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Lithuania                                           |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Luxembourg                                          |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Macedonia                                           |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Malta                                               |                 |                 |              |      ✓     |          ✓         |
| Mediterranean Islands                               |        ✓        |        ✓       |       ✓      |      ✓     |                    |
| Moldova                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Monaco                                              |                 |        ✓       |       ✓      |      ✓     |                   |
| Montenegro                                          |                 |                 |       ✓      |      ✓     |                   |
| Netherlands                                         |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Norway                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Poland                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Portugal                                            |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Romania                                             |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Russian Federation                                  |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Samkhret Oseti                                      |                 |                |               |      ✓     |                    |
| San Marino                                          |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Serbia                                              |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Slovakia                                            |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Slovenia                                            |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Spain                                               |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Svalbard                                            |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Sweden                                              |                 |        ✓       |       ✓      |      ✓     |          ✓         |
| Switzerland                                         |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Tajikistan                                          |                 |                |        ✓     |      ✓     |                   |
| Turkey                                              |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| Turkish Republic of Northern Cyprus                 |                 |                |        ✓     |      ✓     |                    |
| Turkmenistan                                        |                 |                |              |      ✓     |                   |
| Ukraine                                             |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| United Kingdom                                      |        ✓        |        ✓       |       ✓      |      ✓     |          ✓         |
| United Nations Buffer Zone in Cyprus                |                 |                |       ✓      |      ✓     |                    |
| Uzbekistan                                          |                 |                |              |      ✓     |                   |
| Vatican City                                        |                 |                |       ✓      |      ✓     |                   |

## Middle East and Africa

| Country/Region                                      | Address points |House numbers | Street level | City level | Points of interest |
|-----------------------------------------------------|:---------------:|:--------------:|:------------:|:----------:|:------------------:|
| Abyei                                               |                 |                |              |      ✓     |                    |
| Afghanistan                                         |                 |                |              |      ✓     |                   |
| Algeria                                             |        ✓        |       ✓       |       ✓      |      ✓     |                   |
| Angola                                              |                 |                |       ✓      |      ✓     |                   |
| Bahrain                                             |        ✓        |       ✓        |       ✓      |      ✓     |                   |
| Benin                                               |                 |                |       ✓      |      ✓     |                   |
| Botswana                                            |                 |                |       ✓      |      ✓     |                   |
| Bouvet Island                                       |                 |                |              |      ✓     |                   |
| Burkina Faso                                        |                 |                |       ✓      |      ✓     |                  |
| Burundi                                             |                 |                |       ✓      |      ✓     |                   |
| Cameroon                                            |                 |                |       ✓      |      ✓     |                   |
| Cape Verde                                          |                 |                |       ✓      |      ✓     |                    |
| Central African Republic                            |                 |                |       ✓      |      ✓     |                   |
| Chad                                                |                 |                |               |      ✓     |                   |
| Congo                                               |                 |                |               |      ✓     |                   |
| Côte d'Ivoire                                       |                 |                |       ✓      |      ✓     |                   |
| Democratic Republic of the Congo                    |                 |                |       ✓      |      ✓     |                   |
| Djibouti                                            |                 |                |       ✓      |      ✓     |                   |
| Egypt                                               |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Equatorial Guinea, Republic of                      |                 |                |              |      ✓     |                   |
| Eritrea                                             |                 |                |              |      ✓     |                   |
| Ethiopia                                            |                 |                |       ✓      |      ✓     |                   |
| Gabon                                               |                 |                |       ✓      |      ✓     |                   |
| Gambia                                              |                 |                |       ✓      |      ✓     |                   |
| Gaza                                                |                 |                |       ✓      |      ✓     |                    |
| Ghana                                               |                 |                |       ✓      |      ✓     |                   |
| Guinea                                              |                 |                |       ✓      |      ✓     |                   |
| Guinea-Bissau                                       |                 |                |       ✓      |      ✓     |                   |
| Iran                                                |                 |                |              |      ✓     |                   |
| Iraq                                                |                 |                |       ✓      |      ✓     |                  |
| Israel                                              |        ✓        |       ✓        |      ✓       |      ✓     |        ✓           |
| Jordan                                              |        ✓        |                |       ✓      |      ✓     |                   |
| Kenya                                               |                 |                |       ✓      |      ✓     |                   |
| Kuwait                                              |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Lebanon                                             |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Lesotho                                             |                 |                |       ✓      |      ✓     |                   |
| Liberia                                             |                 |                |             |      ✓     |                   |
| Libya                                               |                 |                |             |      ✓     |                   |
| Madagascar                                          |                 |                |       ✓      |      ✓     |                   |
| Malawi                                              |                 |                |       ✓      |      ✓     |                   |
| Maldives                                            |                 |                |              |      ✓     |                   |
| Mali                                                |                 |                |              |      ✓     |                   |
| Mauritania                                          |                 |                |              |      ✓     |                   |
| Mauritius                                           |                 |                |       ✓      |      ✓     |                   |
| Mayotte                                             |                 |                |       ✓      |      ✓     |                   |
| Morocco                                             |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Mozambique                                          |                 |                |       ✓      |      ✓     |                   |
| Namibia                                             |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Niger                                               |                 |                |               |      ✓     |                   |
| Nigeria                                             |                 |        ✓       |       ✓      |      ✓     |                   |
| Oman                                                |                 |                |       ✓      |      ✓     |                   |
| Qatar                                               |        ✓        |                |       ✓      |      ✓     |                   |
| Réunion                                             |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Rwanda                                              |                 |                |       ✓      |      ✓     |                   |
| Saint Helena                                        |                 |                |              |      ✓     |                   |
| São Tomé and Príncipe                               |                 |                |       ✓      |      ✓     |                   |
| Saudi Arabia                                        |        ✓        |               |       ✓      |      ✓     |                   |
| Senegal                                             |                 |                |       ✓      |      ✓     |                   |
| Seychelles                                          |                 |                |       ✓      |      ✓     |                   |
| Sierra Leone                                        |                 |                |       ✓      |      ✓     |                   |
| Somalia                                             |                 |                |              |      ✓     |                   |
| South Africa                                        |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| South Sudan                                         |                 |                |             |      ✓     |                   |
| Sudan                                               |                 |                |             |      ✓     |                   |
| Swaziland                                           |                 |                |       ✓      |      ✓     |                   |
| Syria                                               |                 |                |              |      ✓     |                   |
| Tanzania                                            |                 |                |       ✓      |      ✓     |                   |
| Togo                                                |                 |                |       ✓      |      ✓     |                   |
| Tunisia                                             |        ✓        |       ✓        |       ✓      |      ✓     |                   |
| Uganda                                              |                 |                |       ✓      |      ✓     |                   |
| United Arab Emirates                                |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| West Bank                                           |        ✓        |        ✓       |       ✓      |      ✓     |                   |
| Western Sahara                                      |                 |                 |       ✓      |      ✓     |                    |
| Yemen                                               |                 |                |              |      ✓     |                   |
| Zambia                                              |                 |                |       ✓      |      ✓     |                   |
| Zimbabwe                                            |                 |                |       ✓      |      ✓     |                   |

## Next steps

Learn more about Azure Maps geocoding:
> [!div class="nextstepaction"]
> [Azure Maps Search service](/rest/api/maps/search)
