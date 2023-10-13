---
author: greg-lindsay
ms.service: azure-resource-manager
ms.topic: include
ms.date: 10/09/2023  
ms.author: greglin
---
**DNS private resolver**<sup>1</sup>

| Resource | Limit |
| --- | --- |
| DNS private resolvers per subscription |15|
| Inbound endpoints per DNS private resolver |5|
| Outbound endpoints per DNS private resolver |5|
| Forwarding rules per DNS forwarding ruleset |1000|
| Virtual network links per DNS forwarding ruleset |500|
| Outbound endpoints per DNS forwarding ruleset |2|
| DNS forwarding rulesets per outbound endpoint |2|
| Target DNS servers per forwarding rule |6|
| QPS per endpoint |10,000|

<sup>1</sup>Different limits might be enforced by the Azure portal until the portal is updated. Use PowerShell to provision elements up to the most current limits.