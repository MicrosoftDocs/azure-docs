---
author: greg-lindsay
ms.service: azure-resource-manager
ms.topic: include
ms.date: 10/24/2022    
ms.author: greglin
---
**Public DNS zones**

| Resource | Limit |
| --- | --- |
| Public DNS zones per subscription |250 <sup>1</sup> |
| Record sets per public DNS zone |10,000 <sup>1</sup> |
| Records per record set in public DNS zone |20 |
| Number of Alias records for a single Azure resource |20|

<sup>1</sup>If you need to increase these limits, contact Azure Support.

**Private DNS zones**

| Resource | Limit |
| --- | --- |
| Private DNS zones per subscription |1000|
| Record sets per private DNS zone |25000|
| Records per record set for private DNS zones |20|
| Virtual Network Links per private DNS zone |1000|
| Virtual Networks Links per private DNS zones with auto-registration enabled |100|
| Number of private DNS zones a virtual network can get linked to with auto-registration enabled |1|
| Number of private DNS zones a virtual network can get linked |1000|
| Number of DNS queries a virtual machine can send to Azure DNS resolver, per second |1000 <sup>1</sup> |
| Maximum number of DNS queries queued (pending response) per virtual machine |200 <sup>1</sup> |

<sup>1</sup>These limits are applied to every individual virtual machine and not at the virtual network level. DNS queries exceeding these limits are dropped.

**DNS private resolver**

| Resource | Limit |
| --- | --- |
| DNS private resolvers per subscription |15|
| Inbound endpoints per DNS private resolver |2|
| Outbound endpoints per DNS private resolver |2|
| Forwarding rules per DNS forwarding ruleset |25|
| Virtual network links per DNS forwarding ruleset |10|
| Outbound endpoints per DNS forwarding ruleset |2|
| DNS forwarding rulesets per outbound endpoint |2|
| Target DNS servers per forwarding rule |6|

