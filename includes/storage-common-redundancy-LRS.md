Locally redundant storage (LRS) replicates your data three times within a storage scale unit, which is hosted in a datacenter in the region in which you created your storage account. A write request returns successfully only once it has been written to all three replicas. These three replicas each reside in separate fault domains and upgrade domains within one storage scale unit.

A storage scale unit is a collection of racks of storage nodes. A fault domain (FD) is a group of nodes that represent a physical unit of failure and can be considered as nodes belonging to the same physical rack. An upgrade domain (UD) is a group of nodes that are upgraded together during the process of a service upgrade (rollout). The three replicas are spread across UDs and FDs within one storage scale unit to ensure that data is available even if hardware failure impacts a single rack or when nodes are upgraded during a rollout.

LRS is the lowest cost option and offers least durability compared to other options. In the event of a datacenter level disaster (fire, flooding etc.) all three replicas might be lost or unrecoverable. To mitigate this risk, Geo Redundant Storage (GRS) is recommended for most applications.

Locally redundant storage may still be desirable in certain scenarios:

* Provides highest maximum bandwidth of Azure Storage replication options.
* If your application stores data that can be easily reconstructed, you may opt for LRS.
* Some applications are restricted to replicating data only within a country due to data governance requirements. A paired region could be in another country. For more information on region pairs, see [Azure regions](https://azure.microsoft.com/regions/).