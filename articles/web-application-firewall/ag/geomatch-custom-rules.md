---
title: Azure Web Application Firewall (WAF) Geomatch custom rules
description: This article is an overview of Web Application Firewall (WAF) geomatch custom rules on Azure Application Gateway.
services: web-application-firewall
ms.topic: article
author: vhorne
ms.service: web-application-firewall
ms.date: 01/31/2020
ms.author: victorh
---

# Geomatch custom rules (preview)

Custom rules allow you to create tailored rules to suit the exact needs of your applications and security policies. Now, you can restrict access to your web applications by country/region. As with all custom rules, this logic can be compounded with other rules to suit the needs of your application.

To create a geo-filtering custom rule, simply select *Geo-location* as the Match Type, and then select the country/region or countries/regions you want to allow/block from your application. See [how to create custom rules in Powershell](configure-waf-custom-rules.md) and more custom rule examples(create-custom-waf-rules.md) for more information.

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

## Country/Region codes

If you are using the Geomatch operator, the selectors can be any of the following two-digit country/region codes. 

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

After you learn about custom rules, [create your own custom rules](create-custom-waf-rules.md).
