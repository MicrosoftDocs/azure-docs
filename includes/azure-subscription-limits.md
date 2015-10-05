Resource|Default Limit|Maximum Limit
---|---|---
Cores per [subscription](http://msdn.microsoft.com/library/azure/hh531793.aspx) <sup>1</sup>|20|10,000
[Co-administrators](http://msdn.microsoft.com/library/azure/gg456328.aspx) per subscription|200|200
[Storage accounts](storage-create-storage-account.md) per subscription|100|100
[Cloud services](cloud-services-what-is.md) per subscription|20|200
[Local networks](http://msdn.microsoft.com/library/jj157100.aspx) per subscription|10|500
SQL Database servers per subscription|6|150
DNS servers per subscription|9|100
Reserved IPs per subscription|20|100
ExpressRoute dedicated circuits per subscription|10|25
Hosted service certificates per subscription|400|400
[Affinity groups](../virtual-network/virtual-networks-migrate-to-regional-vnet.md) per subscription|256|256
[Batch](http://azure.microsoft.com/services/batch/) accounts per region per subscription|1|50
Alert rules per subscription|250|250

<sup>1</sup>Extra Small instances count as one core towards the core limit despite using a partial core. 
