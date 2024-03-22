---
author: greg-lindsay
ms.service: azure-resource-manager
ms.topic: include
ms.date: 10/09/2023  
ms.author: greglin
---
**Azure-provided DNS resolver**

| Resource | Limit |
| --- | --- |
| Number of DNS queries a virtual machine can send to Azure DNS resolver, per second |1000 <sup>1</sup> |
| Maximum number of DNS queries queued (pending response) per virtual machine |200 <sup>1</sup> |

<sup>1</sup>These limits are applied to every individual virtual machine and not at the virtual network level. DNS queries exceeding these limits are dropped.
