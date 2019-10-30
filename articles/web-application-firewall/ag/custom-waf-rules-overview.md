---
title: Azure Web Application Firewall (WAF) v2 custom rules on Application Gateway  
description: This article provides an overview of Web Application Firewall (WAF) v2 custom rules on Azure Application Gateway.
services: web-application-firewall
ms.topic: article
author: vhorne
ms.service: web-application-firewall
ms.date: 10/04/2019
ms.author: victorh
---

# Custom rules for Web Application Firewall v2 on Azure Application Gateway

The Azure Application Gateway Web Application Firewall (WAF) v2 comes with a pre-configured, platform-managed ruleset that offers protection from many different types of attacks. These attacks include cross site scripting, SQL injection, and others. If you're a WAF admin, you may want to write you own rules to augment the core rule set (CRS) rules. Your rules can either block or allow requested traffic based on matching criteria.

Custom rules allow you to create your own rules that are evaluated for each request that passes through the WAF. These rules hold a higher priority than the rest of the rules in the managed rule sets. The custom rules contain a rule name, rule priority, and an array of matching conditions. If these conditions are met, an action is taken (to allow or block).

For example, you can block all requests from an IP address in the range 192.168.5.4/24. In this rule, the operator is *IPMatch*, the matchValues is the IP address range (192.168.5.4/24), and the action is to block the traffic. You also set the rule’s name and priority.

Custom rules support using compounding logic to make more advanced rules that address your security needs. For example, (Condition 1 **and** Condition 2) **or** Condition 3).  This example means that if Condition 1 **and** Condition 2 are met, **or** if Condition 3 is met, the WAF should take the action specified in the custom rule.

Different matching conditions within the same rule are always compounded using **and**. For example, block traffic from a specific IP address, and only if they’re using a certain browser.

If you want to **or** two different conditions, the two conditions must be in different rules. For example, block traffic from a specific IP address or block traffic if they’re using a specific browser.

> [!NOTE]
> The maximum number of WAF custom rules is 100. For more information about Application Gateway limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-subscription-service-limits.md#application-gateway-limits).

Regular expressions are also supported in custom rules, just like in the CRS rulesets. For examples of these, see Examples 3 and 5 in [Create and use custom web application firewall rules](create-custom-waf-rules.md).

## Allowing vs. blocking

Allowing and blocking traffic is simple with custom rules. For example, you can block all traffic coming from a range of IP addresses. You can make another rule to allow traffic if the request comes from a specific browser.

To allow something, ensure that the `-Action` parameter is set to **Allow**. To block something, ensure that the `-Action` parameter is set to **Block**.

```azurepowershell
$AllowRule = New-AzApplicationGatewayFirewallCustomRule `
   -Name example1 `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Allow

$BlockRule = New-AzApplicationGatewayFirewallCustomRule `
   -Name example2 `
   -Priority 2 `
   -RuleType MatchRule `
   -MatchCondition $condition `
   -Action Block
```

The previous `$BlockRule` maps to the following custom rule in Azure Resource Manager:

```json
"customRules": [
      {
        "name": "blockEvilBot",
        "priority": 2,
        "ruleType": "MatchRule",
        "action": "Block",
        "matchConditions": [
          {
            "matchVariables": [
              {
                "variableName": "RequestHeaders",
                "selector": "User-Agent"
              }
            ],
            "operator": "Contains",
            "negationConditon": false,
            "matchValues": [
              "evilbot"
            ],
            "transforms": [
              "Lowercase"
            ]
          }
        ]
      }
    ], 
```

This custom rule contains a name, priority, an action, and the array of matching conditions that must be met for the action to take place. For further explanation of these fields, see the following field descriptions. For example custom rules, see [Create and use custom web application firewall rules](create-custom-waf-rules.md).

## Fields for custom rules

### Name [optional]

This is the name of the rule. This name appears in the logs.

### Priority [required]

- Determines the rule valuation order. The lower the value, the earlier the evaluation of the rule. The allowable range is from 1-100. 
- Must be unique across all custom rules. A rule with priority 40 is evaluated before a rule with priority 80.

### Rule type [required]

Currently, must be **MatchRule**.

### Match variable [required]

Must be one of the variables:

- RemoteAddr – IP Address/hostname of the remote computer connection
- RequestMethod – HTTP Request method (GET, POST, PUT, DELETE, and so on.)
- QueryString – Variable in the URI
- PostArgs – Arguments sent in the POST body. Custom Rules using this match variable are only applied if the 'Content-Type' header is set to 'application/x-www-form-urlencoded' and 'multipart/form-data'.
- RequestUri – URI of the request
- RequestHeaders – Headers of the request
- RequestBody – This contains the entire request body as a whole. Custom rules using this match variable are only applied if the 'Content-Type' header is set to 'application/x-www-form-urlencoded'. 
- RequestCookies – Cookies of the request

### Selector [optional]

Describes the field of the matchVariable collection. For example, if the matchVariable is RequestHeaders, the selector could be on the *User-Agent* header.

### Operator [required]

Must be one of the following operators:

- IPMatch - only used when Match Variable is *RemoteAddr*
- Equals – input is the same as the MatchValue
- Contains
- LessThan
- GreaterThan
- LessThanOrEqual
- GreaterThanOrEqual
- BeginsWith
- EndsWith
- Regex
- Geomatch (preview)

### Negate condition [optional]

Negates the current condition.

### Transform [optional]

A list of strings with names of transformations to do before the match is attempted. These can be the following transformations:

- Lowercase
- Trim
- UrlDecode
- UrlEncode 
- RemoveNulls
- HtmlEntityDecode

### Match values [required]

List of values to match against, which can be thought of as being *OR*'ed. For example, it could be IP addresses or other strings. The value format depends on the previous operator.

### Action [required]

- Allow – Authorizes the transaction, skipping all subsequent rules. This means that the specified request is added to the allow list and once matched, the request stops further evaluation and is sent to the backend pool. Rules that are on the allow list aren't evaluated for any further custom rules or managed rules.
- Block – Blocks the transaction based on *SecDefaultAction* (detection/prevention mode). Just like the Allow action, once the request is evaluated and added to the block list, evaluation is stopped and the request is blocked. Any request after that meets the same conditions will not be evaluated and will just be blocked. 
- Log – Lets the rule write to the log, but lets the rest of the rules run for evaluation. Subsequent custom rules are evaluated in order of priority, followed by the managed rules.

## Geomatch custom rules (preview)

If you are using the Geomatch operator, the selectors can be any of the following two-digit country codes. 

|Country code | Country name |
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
