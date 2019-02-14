---
author: dlepow
ms.service: container-instances
ms.topic: include
ms.date: 02/13/2019
ms.author: danlep
---
| Resource | Default Limit |
| --- | :--- |
| Container groups per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) | 100<sup>1</sup> |
| Number of containers per container group | 60 |
| Number of volumes per container group | 20 |
| Ports per IP | 5 |
| Container instance log size | 4 MB (running instance)<br/>16 KB or 1000 lines (stopped instance) |
| Container creates per hour |300<sup>1</sup> |
| Container creates per 5 minutes | 100<sup>1</sup> |
| Container deletes per hour | 300<sup>1</sup> |
| Container deletes per 5 minutes | 100<sup>1</sup> |


<sup>1</sup> Create an [Azure support request][azure-support] to request a limit increase.<br />

<!-- LINKS - External -->
[azure-support]: https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
