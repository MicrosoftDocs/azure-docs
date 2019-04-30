---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 11/09/2018	
ms.author: cynthn
---
| Resource | Default limit |
| --- | --- |
| Virtual machines per availability set | 200 |
| Certificates per subscription |Unlimited<sup>1</sup> |

<sup>1</sup>With Azure Resource Manager, certificates are stored in the Azure Key Vault. The number of certificates is unlimited for a subscription. There's a 1-MB limit of certificates per deployment, which consists of either a single VM or an availability set.

