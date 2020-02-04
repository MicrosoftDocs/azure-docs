---
 title: include file
 description: include file
 services: billing
 author: rothja
 ms.service: cost-management-billing
 ms.topic: include
 ms.date: 05/18/2018
 ms.author: jroth
 ms.custom: include file
---

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| vCPUs per [subscription](../articles/billing-buy-sign-up-azure-subscription.md)<sup>1</sup> |20 |10,000 |
| [Coadministrators](../articles/cost-management-billing/manage/add-change-subscription-administrator.md) per subscription |200 |200 |
| [Storage accounts](../articles/storage/common/storage-create-storage-account.md) per subscription<sup>2</sup> |100 |100 |
| [Cloud services](../articles/cloud-services/cloud-services-choose-me.md) per subscription |20 |200 |
| [Local networks](/previous-versions/azure/reference/jj157100(v=azure.100)) per subscription |10 |500 |
| DNS servers per subscription |9 |100 |
| Reserved IPs per subscription |20 |100 |
| [Affinity groups](../articles/virtual-network/virtual-networks-migrate-to-regional-vnet.md) per subscription |256 |256 |
| Subscription name length (characters) | 64 | 64 |

<sup>1</sup>Extra small instances count as one vCPU toward the vCPU limit despite using a partial CPU core.

<sup>2</sup>The storage account limit includes both Standard and Premium storage accounts. 

