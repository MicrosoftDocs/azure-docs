---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 11/09/2018    
ms.author: cynthn
---
| Resource | Limit |
| --- | --- |
| Virtual machines per cloud service <sup>1</sup> |50 |
| Input endpoints per cloud service <sup>2</sup> |150 |

<sup>1</sup> Virtual machines created by using the classic deployment model instead of Azure Resource Manager are automatically stored in a cloud service. You can add more virtual machines to that cloud service for load balancing and availability. 

<sup>2</sup> Input endpoints allow communications to a virtual machine from outside the virtual machine's cloud service. Virtual machines in the same cloud service or virtual network can automatically communicate with each other.  
