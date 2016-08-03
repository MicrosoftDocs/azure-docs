Resource|Default Limit|Maximum Limit
---|---|---
Cores per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) <sup>1</sup>|20|10,000
[Co-administrators](../articles/billing-add-change-azure-subscription-administrator.md) per subscription|200|200
[Storage accounts](../articles/storage/storage-create-storage-account.md) per subscription<sup>2</sup>|200|200
[Cloud services](../articles/cloud-services/cloud-services-choose-me.md) per subscription|20|200
[Local networks](http://msdn.microsoft.com/library/jj157100.aspx) per subscription|10|500
SQL Database servers per subscription|6|150
DNS servers per subscription|9|100
Reserved IPs per subscription|20|100
Hosted service certificates per subscription|400|400
[Affinity groups](../articles/virtual-network/virtual-networks-migrate-to-regional-vnet.md) per subscription|256|256
[Batch](https://azure.microsoft.com/services/batch/) accounts per region per subscription|1|50
Alert rules per subscription|250|250

<sup>1</sup>Extra Small instances count as one core towards the core limit despite using a partial core.

<sup>2</sup>This includes both Standard and Premium storage accounts. If you require more than 200 storage accounts, make a request through [Azure Support](https://azure.microsoft.com/support/faq/). The Azure Storage team will review your business case and may approve up to 250 storage accounts. 
