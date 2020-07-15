---
title: Geo-filtering on a domain for Azure Front Door | Microsoft Docs
description: In this article, you learn about geo-filtering policy for Azure Front Door
services: frontdoor
documentationcenter: ''
author: KumudD
editor: ''
ms.service: frontdoor
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/21/2019
ms.author: kumud
ms.reviewer: tyao

---
# What is geo-filtering on a domain for Azure Front Door?

By default, Azure Front Door responds to user requests regardless of the location of the user making the request. However, in some cases, you may want to restrict access to your web applications by country/region. Web application firewall (WAF) service at Front Door enables you to define a policy using custom access rules for specific path on your endpoint to allow or block access from specified countries/regions. 

A WAF policy usually includes a set of custom rules. A rule consists of match conditions, an action, and a priority. In match condition, you define a match variable, operator, and match value.  For geo filtering rule, match variable is REMOTE_ADDR, operator is GeoMatch, value is the two letter country/region code of interest. You may combine a GeoMatch condition and a REQUEST_URI string match condition to create a path-based geo-filtering rule.

You can configure a geo-filtering policy for your Front Door by either using [Azure PowerShell](front-door-tutorial-geo-filtering.md) or by using our [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-front-door-geo-filtering).

## Country/Region code reference

|Country/Region code | Country/Region name |
| ----- | ----- |
| AD | Andorra |
| AE | United Arab Emirates|
| AF | Afghanistan|
| AG | Antigua and Barbuda|
| AL | Albania|
| AM | Armenia|
| AO | Angola|
| AR | Argentina|
| AS | American Samoa|
| AT | Austria|
| AU | Australia|
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
| BN | Brunei Darussalam|
| BO | Bolivia|
| BR | Brazil|
| BS | Bahamas|
| BT | Bhutan|
| BW | Botswana|
| BY | Belarus|
| BZ | Belize|
| CA | Canada|
| CD | Democratic Republic of the Congo|
| CF | Central African Republic|
| CH | Switzerland|
| CI | Cote d'Ivoire|
| CL | Chile|
| CM | Cameroon|
| CN | China|
| CO | Colombia|
| CR | Costa Rica|
| CU | Cuba|
| CV | Cabo Verde|
| CY | Cyprus|
| CZ | Czech Republic|
| DE | Germany|
| DK | Denmark|
| DO | Dominican Republic|
| DZ | Algeria|
| EC | Ecuador|
| EE | Estonia|
| EG | Egypt|
| ES | Spain|
| ET | Ethiopia|
| FI | Finland|
| FJ | Fiji|
| FM | Micronesia, Federated States of|
| FR | France|
| GB | United Kingdom|
| GE | Georgia|
| GF | French Guiana|
| GH | Ghana|
| GN | Guinea|
| GP | Guadeloupe|
| GR | Greece|
| GT | Guatemala|
| GY | Guyana|
| HK | Hong Kong SAR|
| HN | Honduras|
| HR | Croatia|
| HT | Haiti|
| HU | Hungary|
| ID | Indonesia|
| IE | Ireland|
| IL | Israel|
| IN | India|
| IQ | Iraq|
| IR | Iran, Islamic Republic of|
| IS | Iceland|
| IT | Italy|
| JM | Jamaica|
| JO | Jordan|
| JP | Japan|
| KE | Kenya|
| KG | Kyrgyzstan|
| KH | Cambodia|
| KI | Kiribati|
| KN | Saint Kitts and Nevis|
| KP | Korea, Democratic People's Republic of|
| KR | Korea, Republic of|
| KW | Kuwait|
| KY | Cayman Islands|
| KZ | Kazakhstan|
| LA | Lao People's Democratic Republic|
| LB | Lebanon|
| LI | Liechtenstein|
| LK | Sri Lanka|
| LR | Liberia|
| LS | Lesotho|
| LT | Lithuania|
| LU | Luxembourg|
| LV | Latvia|
| LY | Libya |
| MA | Morocco|
| MD | Moldova, Republic of|
| MG | Madagascar|
| MK | North Macedonia|
| ML | Mali|
| MM | Myanmar|
| MN | Mongolia|
| MO | Macao SAR|
| MQ | Martinique|
| MR | Mauritania|
| MT | Malta|
| MV | Maldives|
| MW | Malawi|
| MX | Mexico|
| MY | Malaysia|
| MZ | Mozambique|
| NA | Namibia|
| NE | Niger|
| NG | Nigeria|
| NI | Nicaragua|
| NL | Netherlands|
| NO | Norway|
| NP | Nepal|
| NR | Nauru|
| NZ | New Zealand|
| OM | Oman|
| PA | Panama|
| PE | Peru|
| PH | Philippines|
| PK | Pakistan|
| PL | Poland|
| PR | Puerto Rico|
| PT | Portugal|
| PW | Palau|
| PY | Paraguay|
| QA | Qatar|
| RE | Reunion|
| RO | Romania|
| RS | Serbia|
| RU | Russian Federation|
| RW | Rwanda|
| SA | Saudi Arabia|
| SD | Sudan|
| SE | Sweden|
| SG | Singapore|
| SI | Slovenia|
| SK | Slovakia|
| SN | Senegal|
| SO | Somalia|
| SR | Suriname|
| SS | South Sedan|
| SV | El Salvador|
| SY | Syrian Arab Republic|
| SZ | Swaziland|
| TC | Turks and Caicos Islands|
| TG | Togo|
| TH | Thailand|
| TN | Tunisia|
| TR | Turkey|
| TT | Trinidad and Tobago|
| TW | Taiwan|
| TZ | Tanzania, United Republic of|
| UA | Ukraine|
| UG | Uganda|
| US | United States|
| UY | Uruguay|
| UZ | Uzbekistan|
| VC | Saint Vincent and the Grenadines|
| VE | Venezuela|
| VG | Virgin Islands, British|
| VI | Virgin Islands, U.S.|
| VN | Vietnam|
| ZA | South Africa|
| ZM | Zambia|
| ZW | Zimbabwe|

## Next steps

- Learn about [application layer security with Front Door](front-door-application-security.md).
- Learn how to [create a Front Door](quickstart-create-front-door.md).
