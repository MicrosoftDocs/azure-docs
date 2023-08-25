---
title: Geo-filtering on a domain for Azure Front Door
description: In this article, you learn about the geo-filtering policy for Azure Front Door.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: conceptual
ms.date: 08/31/2021
ms.author: victorh
---

# What is geo-filtering on a domain for Azure Front Door?

By default, Azure Front Door responds to all user requests regardless of the location where the request comes from. In some scenarios, you might want to restrict access to your web application by countries or regions. You can use Azure Web Application Firewall in Azure Front Door to define a policy by using custom access rules for a specific path on your endpoint to allow or block access from specified countries or regions.

A web application firewall (WAF) policy contains a set of custom rules. The rule consists of match conditions, an action, and a priority. In a match condition, you define a match variable, operator, and match value.

For a geo-filtering rule, the match variable is either `RemoteAddr` or `SocketAddr`. The `RemoteAddr` variable is the original client IP that's usually sent via the `X-Forwarded-For` request header. `SocketAddr` is the source IP address WAF sees. If your user is behind a proxy, the `SocketAddr` variable is usually the IP address of the proxy server.

The operator for this geo-filtering rule is `GeoMatch`. The value is a two-letter country or region code of interest. The `ZZ` country code or `Unknown` country captures IP addresses that aren't yet mapped to a country in our dataset. You can add `ZZ` to your match condition to avoid false positives. You can combine a `GeoMatch` condition and a `REQUEST_URI` string match condition to create a path-based geo-filtering rule.

You can configure a geo-filtering policy for your Azure Front Door instance by using [Azure PowerShell](../../frontdoor/front-door-tutorial-geo-filtering.md) or a [Bicep file or Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.cdn/front-door-standard-premium-geo-filtering/).

> [!IMPORTANT]
> Include the country code `ZZ` whenever you use geo-filtering. The `ZZ` country code (or `Unknown` country) captures IP addresses that aren't yet mapped to a country in our dataset. Use this code to avoid false positives.

## Country/Region code reference

|Country/Region code | Country/Region name |
| ----- | ----- |
| AD | Andorra|
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
| BQ | Bonaire|
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
| CI | Côte d'Ivoire|
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
| LY | Libya|
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
| RE | Réunion|
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
| SJ | Svalbard|
| SK | Slovakia|
| SL | Sierra Leone|
| SM | San Marino|
| SN | Senegal|
| SO | Somalia|
| SR | Suriname|
| SS | South Sudan|
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
| TR | Turkey|
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
| VI | U.S. Virgin Islands|
| VN | Vietnam|
| VU | Vanuatu|
| WF | Wallis and Futuna|
| WS | Samoa|
| XE | Sint Eustatius|
| XJ | Jan Mayen|
| XK | Kosovo|
| XS | Saba|
| YE | Yemen|
| YT | Mayotte|
| ZA | South Africa|
| ZM | Zambia|
| ZW | Zimbabwe|

## Next steps

- Learn about [application layer security with Azure Front Door](../../frontdoor/front-door-application-security.md).
- Learn how to [create an instance of Azure Front Door](../../frontdoor/quickstart-create-front-door.md).
