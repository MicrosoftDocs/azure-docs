<properties 
	pageTitle="CDN - Country codes" 
	description="The Country Filtering feature uses country codes to define the countries from which a request will be allowed or blocked for a secured directory." 
	services="cdn" 
	documentationCenter=".NET" 
	authors="camsoper" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cdn" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/30/2015" 
	ms.author="casoper"/>

#Country codes

The **Country Filtering** feature uses country codes to define the countries from which a request will be allowed or blocked for a secured directory. The table that follows contains all the country codes. If you specify “EU” (Europe) or "AP" (Asia/Pacific), a subset of IP addresses that originate from any country in that regions will be blocked or allowed. For details on how to use the country filtering feature, see [How to restrict access to your content by country](cdn-restrict-access-by-country.md).

| Code         | Country                                      | Additional Information                                                                                                                                                                                                                               
|--------------|----------------------------------------------|------------------------------------------------------|
| A1           | Anonymous Proxy                              | This country code identifies a set of IP addresses used by anonymizers or VPN services. These types of services may be used to circumvent IP geolocation restrictions. |                                                                        
| A2           | Satellite Provider                           | This country code identifies a set of IP addresses used by Satellite ISPs to provide Internet service to multiple countries (e.g., Nigeria and Ghana). | 
| AF           | Afghanistan                                  |     |
| AL           | Albania                                      |     |
| DZ           | Algeria                                      |     | 
| AS           | American Samoa                               |     | 
| AD           | Andorra                                      |     |
| AO           | Angola                                       |     |
| AI           | Anguilla                                     |     |
| AQ           | Antarctica                                   |     |
| AG           | Antigua and Barbuda                          |     |
| AR           | Argentina                                    |     |
| AM           | Armenia                                      |     |
| AW           | Aruba                                        |     |
| AP           | Asia/Pacific Region                          | This country code identifies a set of IP addresses that are spread out through the Asia/Pacific region. The country of origin for this set of IP addresses is unknown. More importantly, this country code does not cover all IP addresses in the Asia/Pacific region. [Learn more](https://my.edgecast.com/uploads/ubers/1/docs/webhelp/w/CDNHelpCenter/Content/Knowledge_Base/Geolocation_EU_AP.htm).|     
| AU           | Australia                                    |     |
| AT           | Austria                                      |     |
| AZ           | Azerbaijan                                   |     | 
| BS           | Bahamas                                      |     |
| BH           | Bahrain                                      |     | 
| BD           | Bangladesh                                   |     | 
| BB           | Barbados                                     |     |
| BY           | Belarus                                      |     |
| BE           | Belgium                                      |     |
| BZ           | Belize                                       |     |
| BJ           | Benin                                        |     |
| BM           | Bermuda                                      |     |
| BT           | Bhutan                                       |     |
| BO           | Bolivia                                      |     |
| BA           | Bosnia and Herzegovina                       |     |
| BW           | Botswana                                     |     |
| BV           | Bouvet Island                                |     |
| BR           | Brazil                                       |     |
| IO           | British Indian Ocean Territory               |     |
| BN           | Brunei Darussalam                            |     |
| BG           | Bulgaria                                     |     |
| BF           | Burkina Faso                                 |     |
| BI           | Burundi                                      |     |
| KH           | Cambodia                                     |     |
| CM           | Cameroon                                     |     |
| CA           | Canada                                       |     |
| CV           | Cape Verde                                   |     |
| KY           | Cayman Islands                               |     |
| CF           | Central African Republic                     |     |
| TD           | Chad                                         |     |
| CL           | Chile                                        |     |
| CN           | China                                        |     |
| CX           | Christmas Island                             |     |
| CC           | Cocos (Keeling) Islands                      |     |
| CO           | Colombia                                     |     |
| KM           | Comoros                                      |     |
| CG           | Congo                                        |     |
| CD           | Congo, The Democratic Republic of the        |     |
| CK           | Cook Islands                                 |     |
| CR           | Costa Rica                                   |     |
| CI           | Cote d'Ivoire                                |     |
| HR           | Croatia                                      |     |
| CU           | Cuba                                         |     |
| CY           | Cyprus                                       |     |
| CZ           | Czech Republic                               |     |
| DK           | Denmark                                      |     |
| DJ           | Djibouti                                     |     |
| DM           | Dominica                                     |     |
| DO           | Dominican Republic                           |     |
| EC           | Ecuador                                      |     |
| EG           | Egypt                                        |     |
| SV           | El Salvador                                  |     |
| GQ           | Equatorial Guinea                            |     |
| ER           | Eritrea                                      |     |
| EE           | Estonia                                      |     |
| ET           | Ethiopia                                     |     |
| EU           | Europe                                       | This country code identifies a set of IP addresses that are spread out through Europe. The country of origin for this set of IP addresses is unknown. More importantly, this country code does not cover all IP addresses in Europe. [Learn more](https://my.edgecast.com/uploads/ubers/1/docs/webhelp/w/CDNHelpCenter/Content/Knowledge_Base/Geolocation_EU_AP.htm).  |        
| FK           | Falkland Islands (Malvinas)                  |     |
| FO           | Faroe Islands                                |     |
| FJ           | Fiji                                         |     |
| FI           | Finland                                      |     |
| FR           | France                                       |     |
| GF           | French Guiana                                |     |
| PF           | French Polynesia                             |     |
| TF           | French Southern Territories                  |     |
| GA           | Gabon                                        |     |
| GM           | Gambia                                       |     |
| GE           | Georgia                                      |     |
| DE           | Germany                                      |     |
| GG           | Guernsey                                     |     |
| GH           | Ghana                                        |     |
| GI           | Gibraltar                                    |     |
| GR           | Greece                                       |     |
| GL           | Greenland                                    |     |
| GD           | Grenada                                      |     |
| GP           | Guadeloupe                                   |     |
| GU           | Guam                                         |     |
| GT           | Guatemala                                    |     |
| GN           | Guinea                                       |     |
| GW           | Guinea-Bissau                                |     |
| GY           | Guyana                                       |     |
| HT           | Haiti                                        |     |
| HM           | Heard Island and McDonald Islands            |     |
| VA           | Holy See (Vatican City State)                |     |
| HN           | Honduras                                     |     |
| HK           | Hong Kong                                    |     |
| HU           | Hungary                                      |     |
| IS           | Iceland                                      |     |
| IM           | Isle of Man                                  |     |
| IN           | India                                        |     |
| ID           | Indonesia                                    |     |
| IR           | Iran, Islamic Republic of                    |     |
| IQ           | Iraq                                         |     |
| IE           | Ireland                                      |     |
| IL           | Israel                                       |     |
| IT           | Italy                                        |     |
| JE           | Jersey                                       |     |
| JM           | Jamaica                                      |     |
| JP           | Japan                                        |     |
| JO           | Jordan                                       |     |
| KZ           | Kazakhstan                                   |     |
| KE           | Kenya                                        |     |
| KI           | Kiribati                                     |     |
| KP           | Korea, Democratic People's Republic of       |     |
| KR           | Korea, Republic of                           |     |
| KW           | Kuwait                                       |     |
| KG           | Kyrgyzstan                                   |     |
| LA           | Lao People's Democratic Republic             |     |
| LV           | Latvia                                       |     |
| LB           | Lebanon                                      |     |
| LS           | Lesotho                                      |     |
| LR           | Liberia                                      |     |
| LY           | Libyan Arab Jamahiriya                       |     |
| LI           | Liechtenstein                                |     |
| LT           | Lithuania                                    |     |
| LU           | Luxembourg                                   |     |
| MO           | Macao                                        |     |
| MK           | Macedonia                                    |     |
| MG           | Madagascar                                   |     |
| MW           | Malawi                                       |     |
| MY           | Malaysia                                     |     |
| MV           | Maldives                                     |     |
| ML           | Mali                                         |     |
| MT           | Malta                                        |     |
| MH           | Marshall Islands                             |     |
| MQ           | Martinique                                   |     |
| MR           | Mauritania                                   |     |
| MU           | Mauritius                                    |     |
| YT           | Mayotte                                      |     |
| MX           | Mexico                                       |     |
| FM           | Micronesia, Federated States of              |     |
| MD           | Moldova, Republic of                         |     |
| MC           | Monaco                                       |     |
| MN           | Mongolia                                     |     |
| ME           | Montenegro                                   |     |
| MS           | Montserrat                                   |     |
| MA           | Morocco                                      |     |
| MZ           | Mozambique                                   |     |
| MM           | Myanmar                                      |     |
| NA           | Namibia                                      |     |
| NR           | Nauru                                        |     |
| NP           | Nepal                                        |     |
| NL           | Netherlands                                  |     |
| AN           | Netherlands Antilles                         |     |
| NC           | New Caledonia                                |     |
| NZ           | New Zealand                                  |     |
| NI           | Nicaragua                                    |     |
| NE           | Niger                                        |     |
| NG           | Nigeria                                      |     |
| NU           | Niue                                         |     |
| NF           | Norfolk Island                               |     |
| MP           | Northern Mariana Islands                     |     |
| NO           | Norway                                       |     |
| OM           | Oman                                         |     |
| PK           | Pakistan                                     |     |
| PW           | Palau                                        |     |
| PS           | Palestinian Territory                        |     |
| PA           | Panama                                       |     |
| PG           | Papua New Guinea                             |     |
| PY           | Paraguay                                     |     |
| PE           | Peru                                         |     |
| PH           | Philippines                                  |     |
| PL           | Poland                                       |     |
| PT           | Portugal                                     |     |
| PR           | Puerto Rico                                  |     |
| QA           | Qatar                                        |     |
| RE           | Reunion                                      |     |
| RO           | Romania                                      |     |
| RU           | Russian Federation                           |     |
| RW           | Rwanda                                       |     |
| SH           | Saint Helena                                 |     |
| KN           | Saint Kitts and Nevis                        |     |
| LC           | Saint Lucia                                  |     |
| PM           | Saint Pierre and Miquelon                    |     |
| VC           | Saint Vincent and the Grenadines             |     |
| WS           | Samoa                                        |     |
| SM           | San Marino                                   |     |
| ST           | Sao Tome and Principe                        |     |
| SA           | Saudi Arabia                                 |     |
| SN           | Senegal                                      |     |
| RS           | Serbia                                       |     |
| SC           | Seychelles                                   |     |
| SL           | Sierra Leone                                 |     |
| SG           | Singapore                                    |     |
| SK           | Slovakia                                     |     |
| SI           | Slovenia                                     |     |
| SB           | Solomon Islands                              |     |
| SO           | Somalia                                      |     |
| ZA           | South Africa                                 |     |
| GS           | South Georgia and the South Sandwich Islands |     |
| ES           | Spain                                        |     |
| LK           | Sri Lanka                                    |     |
| SD           | Sudan                                        |     |
| SR           | Suriname                                     |     |
| SJ           | Svalbard and Jan Mayen                       |     |
| SZ           | Swaziland                                    |     |
| SE           | Sweden                                       |     |
| CH           | Switzerland                                  |     |
| SY           | Syrian Arab Republic                         |     |
| TW           | Taiwan                                       |     |
| TJ           | Tajikistan                                   |     |
| TZ           | Tanzania, United Republic of                 |     |
| TH           | Thailand                                     |     |
| TG           | Togo                                         |     |
| TK           | Tokelau                                      |     |
| TO           | Tonga                                        |     |
| TT           | Trinidad and Tobago                          |     |
| TN           | Tunisia                                      |     |
| TR           | Turkey                                       |     |
| TM           | Turkmenistan                                 |     |
| TC           | Turks and Caicos Islands                     |     |
| TV           | Tuvalu                                       |     |
| UG           | Uganda                                       |     |
| UA           | Ukraine                                      |     |
| AE           | United Arab Emirates                         |     |
| GB           | United Kingdom                               |     |
| US           | United States                                |     |
| UM           | United States Minor Outlying Islands         |     |
| UY           | Uruguay                                      |     |
| UZ           | Uzbekistan                                   |     |
| VU           | Vanuatu                                      |     |
| VE           | Venezuela                                    |     |
| VN           | Vietnam				                      |     |
| VG           | Virgin Islands, British                      |     |
| VI           | Virgin Islands, U.S.                         |     |
| WF           | Wallis and Futuna                            |     |
| EH           | Western Sahara                               |     |
| YE           | Yemen                                        |     |
| ZM           | Zambia                                       |     |
| ZW           | Zimbabwe                                     |     |