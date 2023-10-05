---
title: Azure Web Application Firewall (WAF) Geomatch custom rules
description: This article is an overview of Web Application Firewall (WAF) geomatch custom rules on Azure Application Gateway.
services: web-application-firewall
ms.topic: article
author: vhorne
ms.service: web-application-firewall
ms.date: 09/05/2023
ms.author: victorh
---

# Geomatch custom rules

Custom rules allow you to create tailored rules to suit the exact needs of your applications and security policies. Now, you can restrict access to your web applications by country/region. As with all custom rules, this logic can be compounded with other rules to suit the needs of your application.

To create a geo-filtering custom rule in the Azure portal, select *Geo location* as the Match Type, and then select the country/region or countries/regions you want to allow/block from your application. When creating geomatch rules with Azure PowerShell or Azure Resource Manager, use the match variable `RemoteAddr` and the operator `Geomatch`. For more information, see [how to create custom rules in PowerShell](configure-waf-custom-rules.md) and more [custom rule examples](create-custom-waf-rules.md).

> [!NOTE]
> Geo-filtering works based on mapping each request's IP address to a country or region. There might be some IP addresses in the data set that are not yet mapped to a country or region. To avoid accidentally blocking legitimate users, Application Gateway's WAF allows requests from unknown IP addresses.

> [!IMPORTANT]
> Include the country code **ZZ** whenever you use geo-filtering. The **ZZ** country code (or *Unknown* country) captures IP addresses that are not yet mapped to a country in our dataset. This avoids false positives.

## Country/Region codes

If you're using the Geomatch operator, the selectors can be any of the following two-digit country/region codes. 

|Country/Region code | Country/Region name |
| ----- | ----- |
| AD | Andorra |
| AE | United Arab Emirates|
| AF | Afghanistan|
| AG | Antigua and Barbuda|
| AI | Anguilla|
| AL | Albania|
| AM | Armenia|
| AO | Angola|
| AQ | Antarctica|
| AR | Argentina|
| AS | American Samoa|
| AT | Austria|
| AU | Australia|
| AW | Aruba|
| AX | Åland Islands|
| AZ | Azerbaijan|
| BA | Bosnia and Herzegovina|
| BB | Barbados|
| BD | Bangladesh|
| BE | Belgium|
| BF | Burkina Faso|
| BG | Bulgaria|
| BH | Bahrain|
| BI | Burundi|
| BJ | Benin|
| BL | Saint Barthélemy|
| BM | Bermuda|
| BN | Brunei|
| BO | Bolivia|
| BQ | Bonaire, Sint Eustatius and Saba|
| BR | Brazil|
| BS | Bahamas|
| BT | Bhutan|
| BV | Bouvet Island|
| BW | Botswana|
| BY | Belarus|
| BZ | Belize|
| CA | Canada|
| CC | Cocos (Keeling) Islands|
| CD | Congo (DRC)|
| CF | Central African Republic|
| CG | Congo|
| CH | Switzerland|
| CI | Cote d'Ivoire|
| CK | Cook Islands|
| CL | Chile|
| CM | Cameroon|
| CN | China|
| CO | Colombia|
| CR | Costa Rica|
| CU | Cuba|
| CV | Cabo Verde|
| CW | Curaçao|
| CX | Christmas Island|
| CY | Cyprus|
| CZ | Czechia|
| DE | Germany|
| DJ | Djibouti|
| DK | Denmark|
| DM | Dominica|
| DO | Dominican Republic|
| DZ | Algeria|
| EC | Ecuador|
| EE | Estonia|
| EG | Egypt|
| ER | Eritrea|
| ES | Spain|
| ET | Ethiopia|
| FI | Finland|
| FJ | Fiji|
| FK | Falkland Islands|
| FM | Micronesia|
| FO | Faroe Islands|
| FR | France|
| GA | Gabon|
| GB | United Kingdom|
| GD | Grenada|
| GE | Georgia|
| GF | French Guiana|
| GG | Guernsey|
| GH | Ghana|
| GI | Gibraltar|
| GL | Greenland|
| GM | Gambia|
| GN | Guinea|
| GP | Guadeloupe|
| GQ | Equatorial Guinea|
| GR | Greece|
| GS | South Georgia and South Sandwich Islands|
| GT | Guatemala|
| GU | Guam|
| GW | Guinea-Bissau|
| GY | Guyana|
| HK | Hong Kong SAR|
| HM | Heard Island and McDonald Islands|
| HN | Honduras|
| HR | Croatia|
| HT | Haiti|
| HU | Hungary|
| ID | Indonesia|
| IE | Ireland|
| IL | Israel|
| IM | Isle of Man|
| IN | India|
| IO | British Indian Ocean Territory|
| IQ | Iraq|
| IR | Iran|
| IS | Iceland|
| IT | Italy|
| JE | Jersey|
| JM | Jamaica|
| JO | Jordan|
| JP | Japan|
| KE | Kenya|
| KG | Kyrgyzstan|
| KH | Cambodia|
| KI | Kiribati|
| KM | Comoros|
| KN | Saint Kitts and Nevis|
| KP | North Korea|
| KR | Korea|
| KW | Kuwait|
| KY | Cayman Islands|
| KZ | Kazakhstan|
| LA | Laos|
| LB | Lebanon|
| LC | Saint Lucia|
| LI | Liechtenstein|
| LK | Sri Lanka|
| LR | Liberia|
| LS | Lesotho|
| LT | Lithuania|
| LU | Luxembourg|
| LV | Latvia|
| LY | Libya |
| MA | Morocco|
| MC | Monaco|
| MD | Moldova|
| ME | Montenegro|
| MF | Saint Martin|
| MG | Madagascar|
| MH | Marshall Islands|
| MK | North Macedonia|
| ML | Mali|
| MM | Myanmar|
| MN | Mongolia|
| MO | Macao SAR|
| MP | Northern Mariana Islands|
| MQ | Martinique|
| MR | Mauritania|
| MS | Montserrat|
| MT | Malta|
| MU | Mauritius|
| MV | Maldives|
| MW | Malawi|
| MX | Mexico|
| MY | Malaysia|
| MZ | Mozambique|
| NA | Namibia|
| NC | New Caledonia|
| NE | Niger|
| NF | Norfolk Island|
| NG | Nigeria|
| NI | Nicaragua|
| NL | Netherlands|
| NO | Norway|
| NP | Nepal|
| NR | Nauru|
| NU | Niue|
| NZ | New Zealand|
| OM | Oman|
| PA | Panama|
| PE | Peru|
| PF | French Polynesia|
| PG | Papua New Guinea|
| PH | Philippines|
| PK | Pakistan|
| PL | Poland|
| PM | Saint Pierre and Miquelon|
| PN | Pitcairn Islands|
| PR | Puerto Rico|
| PS | Palestinian Authority|
| PT | Portugal|
| PW | Palau|
| PY | Paraguay|
| QA | Qatar|
| RE | Reunion|
| RO | Romania|
| RS | Serbia|
| RU | Russia|
| RW | Rwanda|
| SA | Saudi Arabia|
| SB | Solomon Islands|
| SC | Seychelles|
| SD | Sudan|
| SE | Sweden|
| SG | Singapore|
| SH | St Helena, Ascension, Tristan da Cunha|
| SI | Slovenia|
| SJ | Svalbard and Jan Mayen|
| SK | Slovakia|
| SL | Sierra Leone|
| SM | San Marino|
| SN | Senegal|
| SO | Somalia|
| SR | Suriname|
| SS | South Sedan|
| ST | São Tomé and Príncipe|
| SV | El Salvador|
| SX | Sint Maarten|
| SY | Syria|
| SZ | Eswatini|
| TC | Turks and Caicos Islands|
| TD | Chad|
| TF | French Southern Territories|
| TG | Togo|
| TH | Thailand|
| TJ | Tajikistan|
| TK | Tokelau|
| TL | Timor-Leste|
| TM | Turkmenistan|
| TN | Tunisia|
| TO | Tonga|
| TR | Türkiye |
| TT | Trinidad and Tobago|
| TV | Tuvalu|
| TW | Taiwan|
| TZ | Tanzania|
| UA | Ukraine|
| UG | Uganda|
| UM | U.S. Outlying Islands|
| US | United States|
| UY | Uruguay|
| UZ | Uzbekistan|
| VA | Vatican City|
| VC | Saint Vincent and the Grenadines|
| VE | Venezuela|
| VG | British Virgin Islands|
| VI | Virgin Islands, U.S.|
| VN | Vietnam|
| VU | Vanuatu|
| WF | Wallis and Futuna|
| WS | Samoa|
| YE | Yemen|
| YT | Mayotte|
| ZA | South Africa|
| ZM | Zambia|
| ZW | Zimbabwe|

## Next steps

After you learn about custom rules, [create your own custom rules](create-custom-waf-rules.md).
