---
author: sukhand
ms.service: cost-management-billing
ms.topic: include
ms.date: 5/25/2020    
ms.author: sukhand
---
**Private DNS**

| Resource | Limit |
| --- | --- |
| Private DNS zones per subscription |1000|
| Record sets per private DNS zone |25000|
| Records per record set for private DNS zones |20|
| Virtual Network Links per private DNS zone |1000|
| Virtual Networks Links per private DNS zones with auto-registration enabled |100|
| Number of private DNS zones a virtual network can get linked to with auto-registration enabled |1|
| Number of private DNS zones a virtual network can get linked |1000|
| Number of DNS queries a virtual machine can send to Azure DNS resolver, per second |500 <sup>2</sup> |
| Maximum number of DNS queries queued (pending response) per virtual machine |200 <sup>2</sup> |

<sup>1</sup>If you need to increase these limits, contact Azure Support.

<sup>2</sup>These limits are applied to every individual virtual machine and not at the virtual network level. DNS queries exceeding these limits are dropped.
