---
title: Azure Firewall Geolocation filtering
description: Learn about country or region-based source and destination matching in Azure Firewall Policy network rules, with configuration guidance.
author: sujamiya
ms.author: sujamiya
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 11/02/2026
ms.custom: ai-usage, references_regions
---

# Azure Firewall geolocation filtering


Azure Firewall geolocation filtering filters traffic based on the country or region.

Potential uses include:

- Reduce the attack surface by restricting traffic from selected countries or regions.
- Limit outbound connections to countries or regions that your organization's security policy restricts.
- Support geographic network access policies without maintaining separate IP address lists for each country or region.

IP geolocation is an estimate of the location associated with an IP address. Some IP addresses in the data set might not yet be mapped to a country or region. Geolocation filtering alone doesn't guarantee data residency or regulatory compliance, and a country or region isn't itself an indicator of malicious activity.

For an introduction to Firewall Policy, see [Azure Firewall Policy rule sets](policy-rule-sets.md).

## Supported SKUs and deployment types

Azure Firewall supports geolocation filtering across all three Azure Firewall SKUs: Basic, Standard, and Premium. It supports both virtual network (VNet) and secured virtual hub (VHUB) deployments.

## Supported rule types and matching fields

Geolocation filtering supports country or region selection for both source and destination matching in network rules. Network rules match the source or destination country or region against the corresponding IP address's geo-IP mapping when Azure Firewall evaluates the connection.

| Field | Intended scenario | Example |
| --- | --- | --- |
| Source | Restrict traffic based on the country or region associated with the source IP address. | Restrict source addresses to countries or regions approved by your organization for traffic evaluated by network rules. |
| Destination | Restrict outbound traffic based on the country or region associated with the destination IP address. | Deny outbound connections from a workload subnet to countries or regions restricted by your organization's network access policy. |

Country or region-level matching doesn't identify a specific organization's datacenter. Use known source IP ranges and other access controls when access must be limited to a particular organization or site.

### Rule-type support

| Rule type | Source country or region | Destination country or region |
| --- | --- | --- |
| Network | Supported | Supported |
| Application | Not supported | Not supported |
| DNAT | Not supported | Not supported |

## Configure a geographic destination rule in network rules

1. In the Azure portal, open your **Firewall Policy**.
2. Under **Settings**, open **Rule collections** or **Network rules**, and select **Add** > **Rule collection**.
3. Set **Rule collection type** to **Network**. Enter a rule collection name, such as `DenyRestrictedRegions`, select the intended rule collection group, and set the action to **Deny**.
4. Choose a collection priority that evaluates the deny rule before overlapping allow network rules. Review parent policy rules and rule collection group priorities as well.
5. Add a rule with the following example values:

   | Setting | Value |
   | --- | --- |
   | Name | `DenyRestrictedRegionEgress` |
   | Source type | **IP address** |
   | Source | The test workload subnet's address range |
   | Protocol | **Any** |
   | Destination ports | `*` |
   | Destination type | **Geo location** |
   | Destination | Select one or more countries or regions restricted by your organization's policy. |

6. Select **Add** to save and deploy the policy update, and wait for the update to finish.

Use a specific workload subnet rather than a wildcard source to limit the scope of the test. Review required service dependencies before applying geographic deny rules to production workloads.

## Validate the configuration

1. From the test workload, initiate a new connection to a controlled public endpoint that the feature's geo-IP mapping associates with a selected country or region. Confirm that the connection is denied.
2. Test a controlled endpoint outside the selected countries or regions that an explicit rule allows. Confirm that the connection succeeds. This check helps you distinguish geographic matching from Azure Firewall's default deny behavior.
3. Review network rule logs for the source, destination, action, and matching rule or rule collection. Check the `SourceGeoLocation` and `DestinationGeoLocation` country or region codes in the `AZFWNetworkRule` and `AZFWNetworkRuleAggregation` tables. For column details, see [Logging](#logging).
4. Test overlapping allow rules and inherited policy rules to verify the effective processing order.
5. Record the endpoint addresses, expected mappings, policy configuration, and observed results. Don't rely on a website's domain name or advertised business location as evidence of its IP geolocation.

For diagnostic configuration and available logs, see [Monitor Azure Firewall](monitor-firewall.md).

## Logging

Geolocation information is included in existing network rule log records in the `AZFWNetworkRule` and `AZFWNetworkRuleAggregation` tables. Both tables include the following columns:

| Column | Description |
| --- | --- |
| `SourceGeoLocation` | The country or region code associated with the source IP address. |
| `DestinationGeoLocation` | The country or region code associated with the destination IP address. |

For code values, see [Country/region codes](#countryregion-codes).

## Country/region codes

The following table lists two-letter country/region codes for reference when selecting geographic sources or destinations in network rules.

| Country/region code | Country/region name |
| --- | --- |
| AD | Andorra |
| AE | United Arab Emirates |
| AF | Afghanistan |
| AG | Antigua and Barbuda |
| AI | Anguilla |
| AL | Albania |
| AM | Armenia |
| AO | Angola |
| AQ | Antarctica |
| AR | Argentina |
| AS | American Samoa |
| AT | Austria |
| AU | Australia |
| AW | Aruba |
| AX | &Aring;land Islands |
| AZ | Azerbaijan |
| BA | Bosnia and Herzegovina |
| BB | Barbados |
| BD | Bangladesh |
| BE | Belgium |
| BF | Burkina Faso |
| BG | Bulgaria |
| BH | Bahrain |
| BI | Burundi |
| BJ | Benin |
| BL | Saint Barth&eacute;lemy |
| BM | Bermuda |
| BN | Brunei |
| BO | Bolivia |
| BQ | Bonaire, Sint Eustatius, and Saba |
| BR | Brazil |
| BS | Bahamas |
| BT | Bhutan |
| BV | Bouvet Island |
| BW | Botswana |
| BY | Belarus |
| BZ | Belize |
| CA | Canada |
| CC | Cocos (Keeling) Islands |
| CD | Congo (DRC) |
| CF | Central African Republic |
| CG | Congo |
| CH | Switzerland |
| CI | Cote d'Ivoire |
| CK | Cook Islands |
| CL | Chile |
| CM | Cameroon |
| CN | China |
| CO | Colombia |
| CR | Costa Rica |
| CU | Cuba |
| CV | Cabo Verde |
| CW | Cura&ccedil;ao |
| CX | Christmas Island |
| CY | Cyprus |
| CZ | Czechia |
| DE | Germany |
| DJ | Djibouti |
| DK | Denmark |
| DM | Dominica |
| DO | Dominican Republic |
| DZ | Algeria |
| EC | Ecuador |
| EE | Estonia |
| EG | Egypt |
| ER | Eritrea |
| ES | Spain |
| ET | Ethiopia |
| FI | Finland |
| FJ | Fiji |
| FK | Falkland Islands |
| FM | Micronesia |
| FO | Faroe Islands |
| FR | France |
| GA | Gabon |
| GB | United Kingdom |
| GD | Grenada |
| GE | Georgia |
| GF | French Guiana |
| GG | Guernsey |
| GH | Ghana |
| GI | Gibraltar |
| GL | Greenland |
| GM | Gambia |
| GN | Guinea |
| GP | Guadeloupe |
| GQ | Equatorial Guinea |
| GR | Greece |
| GS | South Georgia and South Sandwich Islands |
| GT | Guatemala |
| GU | Guam |
| GW | Guinea-Bissau |
| GY | Guyana |
| HK | Hong Kong SAR |
| HM | Heard Island and McDonald Islands |
| HN | Honduras |
| HR | Croatia |
| HT | Haiti |
| HU | Hungary |
| ID | Indonesia |
| IE | Ireland |
| IL | Israel |
| IM | Isle of Man |
| IN | India |
| IO | British Indian Ocean Territory |
| IQ | Iraq |
| IR | Iran |
| IS | Iceland |
| IT | Italy |
| JE | Jersey |
| JM | Jamaica |
| JO | Jordan |
| JP | Japan |
| KE | Kenya |
| KG | Kyrgyzstan |
| KH | Cambodia |
| KI | Kiribati |
| KM | Comoros |
| KN | Saint Kitts and Nevis |
| KP | North Korea |
| KR | Korea |
| KW | Kuwait |
| KY | Cayman Islands |
| KZ | Kazakhstan |
| LA | Laos |
| LB | Lebanon |
| LC | Saint Lucia |
| LI | Liechtenstein |
| LK | Sri Lanka |
| LR | Liberia |
| LS | Lesotho |
| LT | Lithuania |
| LU | Luxembourg |
| LV | Latvia |
| LY | Libya |
| MA | Morocco |
| MC | Monaco |
| MD | Moldova |
| ME | Montenegro |
| MF | Saint Martin |
| MG | Madagascar |
| MH | Marshall Islands |
| MK | North Macedonia |
| ML | Mali |
| MM | Myanmar |
| MN | Mongolia |
| MO | Macao SAR |
| MP | Northern Mariana Islands |
| MQ | Martinique |
| MR | Mauritania |
| MS | Montserrat |
| MT | Malta |
| MU | Mauritius |
| MV | Maldives |
| MW | Malawi |
| MX | Mexico |
| MY | Malaysia |
| MZ | Mozambique |
| NA | Namibia |
| NC | New Caledonia |
| NE | Niger |
| NF | Norfolk Island |
| NG | Nigeria |
| NI | Nicaragua |
| NL | Netherlands |
| NO | Norway |
| NP | Nepal |
| NR | Nauru |
| NU | Niue |
| NZ | New Zealand |
| OM | Oman |
| PA | Panama |
| PE | Peru |
| PF | French Polynesia |
| PG | Papua New Guinea |
| PH | Philippines |
| PK | Pakistan |
| PL | Poland |
| PM | Saint Pierre and Miquelon |
| PN | Pitcairn Islands |
| PR | Puerto Rico |
| PS | Palestinian Authority |
| PT | Portugal |
| PW | Palau |
| PY | Paraguay |
| QA | Qatar |
| RE | Reunion |
| RO | Romania |
| RS | Serbia |
| RU | Russia |
| RW | Rwanda |
| SA | Saudi Arabia |
| SB | Solomon Islands |
| SC | Seychelles |
| SD | Sudan |
| SE | Sweden |
| SG | Singapore |
| SH | Saint Helena, Ascension and Tristan da Cunha |
| SI | Slovenia |
| SJ | Svalbard and Jan Mayen |
| SK | Slovakia |
| SL | Sierra Leone |
| SM | San Marino |
| SN | Senegal |
| SO | Somalia |
| SR | Suriname |
| SS | South Sudan |
| ST | S&atilde;o Tom&eacute; and Pr&iacute;ncipe |
| SV | El Salvador |
| SX | Sint Maarten |
| SY | Syria |
| SZ | Eswatini |
| TC | Turks and Caicos Islands |
| TD | Chad |
| TF | French Southern Territories |
| TG | Togo |
| TH | Thailand |
| TJ | Tajikistan |
| TK | Tokelau |
| TL | Timor-Leste |
| TM | Turkmenistan |
| TN | Tunisia |
| TO | Tonga |
| TR | T&uuml;rkiye |
| TT | Trinidad and Tobago |
| TV | Tuvalu |
| TW | Taiwan |
| TZ | Tanzania |
| UA | Ukraine |
| UG | Uganda |
| UM | U.S. Outlying Islands |
| US | United States |
| UY | Uruguay |
| UZ | Uzbekistan |
| VA | Vatican City |
| VC | Saint Vincent and the Grenadines |
| VE | Venezuela |
| VG | British Virgin Islands |
| VI | Virgin Islands, U.S. |
| VN | Vietnam |
| VU | Vanuatu |
| WF | Wallis and Futuna |
| WS | Samoa |
| YE | Yemen |
| YT | Mayotte |
| ZA | South Africa |
| ZM | Zambia |
| ZW | Zimbabwe |

## Related articles

- [Azure Firewall Policy rule sets](policy-rule-sets.md)
- [Azure Firewall rule processing logic](rule-processing.md)
- [Tutorial: Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal-policy.md)
- [Azure Firewall web categories](web-categories.md)
- [Azure Web Application Firewall geomatch custom rules](../web-application-firewall/ag/geomatch-custom-rules.md)
