---
author: dlepow
ms.service: container-instances
ms.topic: include
ms.date: 07/22/2020
ms.author: danlep
---
| Resource | Limit |
| --- | :--- |
| Standard sku container groups per region per subscription | 100<sup>1</sup> |
| Dedicated sku container groups per region per subscription | 0<sup>1</sup> |
| Number of containers per container group | 60 |
| Number of volumes per container group | 20 |
| Standard sku cores (CPUs) per region per subscription | 10<sup>1,2</sup> | 
| Standard sku cores (CPUs) for K80 GPU per region per subscription | 18<sup>1,2</sup> |
| Standard sku cores (CPUs) for P100 or V100 GPU per region per subscription | 0<sup>1,2</sup> |
| Ports per IP | 5 |
| Container instance log size - running instance | 4 MB |
| Container instance log size - stopped instance | 16 KB or 1,000 lines |
| Container creates per hour |300<sup>1</sup> |
| Container creates per 5 minutes | 100<sup>1</sup> |
| Container deletes per hour | 300<sup>1</sup> |
| Container deletes per 5 minutes | 100<sup>1</sup> |


<sup>1</sup>To request a limit increase, create an [Azure Support request][azure-support]. Free subscriptions including [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/) and [Azure for Students](https://azure.microsoft.com/offers/ms-azr-0170p/) aren't eligible for limit or quota increases. If you have a free subscription, you can [upgrade](../articles/cost-management-billing/manage/upgrade-azure-subscription.md) to a Pay-As-You-Go subscription.<br />
<sup>2</sup>Default limit for [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription. Limit may differ for other category types.<br/>

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
