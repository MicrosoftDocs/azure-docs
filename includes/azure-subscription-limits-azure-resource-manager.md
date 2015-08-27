Resource|Default Limit|Maximum Limit
---|---|---
Cores per [subscription](http://msdn.microsoft.com/library/azure/hh531793.aspx)|20<sup>1</sup> per Region|10,000 per Region
[Co-administrators](http://msdn.microsoft.com/library/azure/gg456328.aspx) per subscription|Unlimited|Unlimited
[Storage accounts](storage-create-storage-account.md) per subscription|100|100<sup>2</sup>
[Resource Groups](resource-group-overview.md) per subscription|800|800
Resource Manager API Reads|32000 per hour|32000 per hour
Resource Manager API Writes|1200 per hour|1200 per hour
Resource Manager API request size|4194304 bytes|4194304 bytes
[Cloud services](cloud-services-what-is.md) per subscription|Deprecated<sup>3</sup>|Deprecated<sup>3</sup>
[Affinity groups](../virtual-network/virtual-networks-migrate-to-regional-vnet.md) per subscription|Deprecated<sup>3</sup>|Deprecated<sup>3</sup>

<sup>1</sup>Default limits vary by offer Category Type, such as Free Trial, Pay-As-You-Go,  etc.

<sup>2</sup>Limit can be increased by contacting support.

<sup>3</sup>These features are no longer required with Azure Resource Groups and the Azure Resource Manager.
