---
title: Overview of zone redundant high availability with Azure Database for MySQL Flexible Server
description: Learn about the concepts of zone redundant high availability with Azure Database for MySQL Flexible Server
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.topic: conceptual
ms.date: 08/26/2021
---

# High availability concepts in Azure Database for MySQL Flexible Server (Preview)

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

> [!IMPORTANT] 
> Azure Database for MySQL - Flexible Server is currently in public preview.

Azure Database for MySQL Flexible Server (Preview) allows configuring high availability with automatic failover. The high availability solution is designed to ensure that committed data is never lost because of failures and that the database will not be a single point of failure in your software architecture. When high availability is configured, flexible server automatically provisions and manages a standby replica. There are two high availability architectural models:

* **Zone Redundant High Availability (HA):** This option is preferred for complete isolation and redundancy of infrastructure across multiple availability zones. It provides highest level of availability, but it requires you to configure application redundancy across zones. Zone redundant HA is preferred when you want to achieve highest level of availability against any infrastructure failure in the availability zone and where latency across the availability zone is acceptable. Zone redundant HA can be enabled only at the server creation time. Zone redundant HA is available in [subset of Azure regions](./overview.md#azure-regions) where the region supports multiple [Availability Zones](../../availability-zones/az-overview.md) and [Zone redundant Premium file shares](../..//storage/common/storage-redundancy.md#zone-redundant-storage) are available.

* **Same-Zone High Availability (HA):** This option is preferred for infrastructure redundancy with lower network latency as both primary and standby server will be in the same availability zone. It provides high availability without configuring application redundancy across zones. Same-Zone HA is preferred when you want to achieve highest level of availability within a single Availability zone with the lowest network latency. Same-Zone HA is available in all [Azure regions](./overview.md#azure-regions) where we can create  Azure Database for MySQL Flexible server.  

## Zone Redundancy High Availability Architecture
 
When you deploy a server with Zone redundant HA option, you will have a primary server created in one availability zone and a standby replica server with the same configuration of the primary server (compute tier, compute size, storage size, and network configuration) in another availability zone of the same Azure region. You can specify the Availability Zone of your choice for primary and standby replica. colocating the standby database servers and standby applications in the same zone reduces latencies and allows users to better prepare for disaster recovery situations and “zone down” scenarios.

:::image type="content" source="./media/concepts-high-availability/1-flexible-server-overview-zone-redundant-ha.png" alt-text="zone redundant ha":::

The data and log files are hosted in a [Zone-redundant storage (ZRS)](../../storage/common/storage-redundancy.md#redundancy-in-the-primary-region). Using storage level replication available with ZRS, the data and log files are replicated to the standby server. if there is a failover, standby replica is activated and the binary log files of the primary server are continued to apply to the standby server to bring it online to the last committed transaction on primary. With logs in the ZRS, the logs are accessible even in cases when the primary server is unavailable that helps to make sure that we have zero data loss. Once the standby replica is activated and binary logs are applied, current standby replica server takes the roles of the primary server. DNS is updated so that the client connections are directed to the new primary when client reconnects. The failover is fully transparent from the client application and doesn't require any user actions. The High Availability solution then brings back the old primary server when possible and place it as a standby.
 
Applications are connected to the primary server using the database server name. The standby replica information is not exposed for direct access. Commits and writes are acknowledged after flushing the log files at the Primary Server's Zone-redundant storage (ZRS) storage. Due to the sync replication technology used in ZRS storage, applications can expect 5-10% increased latency for writes and commits.
 
Automatic backups, both snapshots and log backups, are performed on a zone redundant storage from the primary database server.

## Same-Zone High Availability Architecture
 
When you deploy a server with same-zone HA option, you will have a primary server and a standby replica server created in the same zone with the same configuration of the primary server (compute tier, compute size, storage size, and network configuration). The standby server offers infrastructure redundancy with a separate virtual machine (compute) which reduces the failover time and network latency between the user application and the database server due to colocation.

:::image type="content" source="./media/concepts-high-availability/flexible-server-overview-same-zone-ha.png" alt-text="same redundant high availability":::

The data and log files are hosted in a [Locally redundant storage (LRS)](../../storage/common/storage-redundancy.md#locally-redundant-storage). Using storage level replication available with LRS, the data and log files are replicated to the standby server.

If there is a failover, standby replica is activated and the binary log files of the primary server are continued to apply to the standby server to bring it online to the last committed transaction on primary. With logs in the LRS, the logs are accessible even in cases when the primary server is unavailable, which helps to make sure that we have zero data loss. Once the standby replica is activated and binary logs are applied current standby replica takes the roles of the primary server. DNS is updated to redirect the connections to the new primary when client reconnects. The failover is fully transparent from the client application and doesn't require any user actions. The High Availability solution then brings back the old primary server when possible and place it as a standby.
 
Applications are connected to the primary server using the database server name. The standby replica information is not exposed for direct access. Commits and writes are acknowledged after flushing the log files at the Primary Server's Local-redundant storage (LRS) storage. As we have primary and standby replica on same zone the replication lag is less and it provides lower latencies between the application server and database server if placed within the same Azure availability zone. The same-zone setup does not provide high availability for the scenario where dependent infrastructures are down for the specific Availability zone.   You will have a downtime until all the dependent services are back online for that Availability zone.
 
Automatic backups, both snapshots and log backups, are performed on a Local redundant storage from the primary database server.

>[!Note]
>For both Zone redundant and Same-zone HA,
>* In the event of failure, the time for the standby replica to take over the role of primary is dependent on the binary log application on the standby. It is therefore advised to use -primary keys on all the tables to reduce failover time. The failover times typically ranges from 60-120 seconds. 
>* The standby server is not available for any read or write operations but is a passive standby to enable fast failover.
>* Always use fully qualified domain name (FQDN) to connect to your primary server and avoid using IP address to connect. In case of failover, once primary and standby server role are switched, DNS A-record might change too which would prevent the application from connecting to the new primary server if IP address is used in the connection string.

## Failover process 
 
### Planned - Forced Failover
 
Azure Database for MySQL Flexible server forced failover enables you to manually force a failover, allowing you to test the functionality with your application scenarios, and helps you to be ready if there was any outages. Forced failover switches the standby server to become the primary server by triggering a failover that activates the standby replica to become the primary server with the same database server name by updating the DNS record. The original primary server will be restarted and switched to standby replica. Client connections are disconnected and have to be reconnected to resume their operations. Depending on the current workload and the last checkpoint the overall failover time will be measured. In general, it is expected to be between 60-120 sec.
 
### Unplanned -Automatic Failover 
 
Unplanned service downtimes include software bugs or infrastructure faults such as compute, network, storage failures, or power outages impacts the availability of the database. In the event of the database unavailability, the replication to the standby replica is severed and the standby replica is activated to be the primary database. DNS is updated, and clients then reconnect to the database server and resume their operations. The overall failover time is expected to take 60-120 s. However, depending on the activity in the primary database server at the time of the failover such as large transactions and recovery time, the failover may take longer.

## High Availability Monitoring
The health of the HA is continuously monitored and reported on the overview page. The various replication statuses are listed below:

| **Status** | **Description** |
| :----- | :------ |
| <b>NotEnabled | Zone redundant HA is not enabled |
| <b>ReplicatingData | After the standby is created, it is catching up with the primary server. |
| <b>FailingOver | The database server is in the process of failing over from the primary to the standby. |
| <b>Healthy | Zone redundant HA is in steady state and healthy. |
| <b>RemovingStandby | Based on user action, the standby replica is in the process of deletion.| 

##  Limitations 
 
Here are few considerations to keep in mind when you use high availability:
* Zone Redundant High availability can only be set during Flexible server create time.
* High availability is not supported in burstable compute tier.
* Restarting the primary database server to pick up static parameter changes also restarts standby replica.
* Configuring read replicas for zone redundant high availability servers is not supported.
* Data-in replication is not supported for HA servers 
* GTID mode will be set to ON as the HA solution uses GTID. Confirm if your workload has [Restrictions or Limitations on Replication with GTIDs](https://dev.mysql.com/doc/refman/5.7/en/replication-gtids-restrictions.html).  
 
## Frequently Asked Questions (FAQs)
 
**Can I use the standby replica for read or write operations?** </br>
The standby server is not available for any read or write operations but is a passive standby to enable fast failover.</br>
**Will I have any data loss when failover happens?**</br>
With logs in the ZRS, the logs are accessible even in cases when the primary server is unavailable and this helps to make sure that we have zero data loss. Once the standby replica is activated and binary logs are applied, it takes the roles of the primary server. </br>
**Do users need to do any action post failover?**</br>
The failover is fully transparent from the client application and doesn't require any user actions. Application should just implement the retry logic for their connections. </br>
**What happens when I don’t select a specific zone for my standby replica? Can I change it later?**</br>
If no zone is selected, it will randomly select a zone other than the one used for the primary server. To change the zone later, you can set High Availability Mode to Disabled, and then set it back to Zone Redundant with zone of your choice from the High Availability Blade.</br>
**Is the replication between primary and standby replica synchronous.?**</br>
 The replication solution between primary and the standby can be considered similar to  [semi synchronous mode](https://dev.mysql.com/doc/refman/5.7/en/replication-semisync.html) in MySQL. When one transaction committed, it isn’t required to commit to the standby.  But when the primary is unavailable, we could make sure the standby could replicate all data changes what primary had and make sure we have zero data loss.</br> 
**Do we failover to the standby replica in case of all unplanned failures?**</br>
If there is a database crash or node failure, the flexible server VM is restarted on the same node. At the same time, an automatic failover is triggered. If flexible server VM restart is successful before the failover finishes, the failover operation will be canceled. Whichever takes less time that option will be considered to decide which would act as primary vs standby replica.</br>
**Do I have any performance impact when I use HA solution?**</br>
With Zone redundant HA might cause 5-10% drop in latency if the application connecting to the database server across availability zones where network latency is</br> relatively higher in the order of 2-4 ms. For same-zone HA, as we have primary and standby replica on same zone the replication lag is less and it provides lower latencies between the application server and database server if placed within the same Azure availability zone.</br>
**How does Maintenance of my HA server happens?**</br>
Planned events such as scale compute and minor version upgrades happen in both primary and standby at the same time. You can have the [Scheduled maintenance window](./concepts-maintenance.md) set for HA server as you do for Flexible servers. It would have the same amount of downtime as you would have for the Azure Database for MySQL Flexible server with HA disabled. Using the failover mechanism to reduce the downtime for HA servers is in our roadmap and we will have the feature soon available. </br>
**Can I do a Point-in-time restore (PITR) of my HA server?**</br>
You can do a [PITR](./concepts-backup-restore.md#point-in-time-restore) for HA enabled Azure database for MySQL Flexible server to a new Azure database for MySQL Flexible server that has HA disabled. If the source server was created with Zone Redundant HA, you could enable Zone Redundant HA or Same Zone HA on the restored server later. If the source server was created with Same Zone HA, you can only enable Same Zone on the restored server..</br>
**Can I enable HA for a server after creation?**</br>
You can enable same-zone HA after server creation but for Zone redundant server HA option can be selected only at the time of creation.</br> 
**Can I disable HA for server post creation?** </br>
Post creation of the server you can disable HA and billing stops immediately  </br>
**How can I mitigate the downtime?**</br>
When you are not using HA feature, you need to still be able to mitigate downtime for your application. Planning service downtimes such as scheduled patches, minor version upgrades or the user initiated operations such as scale compute can be performed as part of scheduled maintenance windows as it incurs downtime. To mitigate application impact for Azure initiated maintenance tasks, you can choose to schedule them during the day of the week and time which least impacts the application.</br>
**Can we have read replica for a HA enabled server?**</br>
Currently HA enabled server does not support read replica. But read replica for HA servers is in our roadmap, and we are working to make this feature available soon.</br>
**Can I use Data-in replication for HA servers?**</br>
Currently Data in replication is not supported for HA servers. But  Data in replication for HA servers is in our roadmap, and we are working to make this feature available soon. For now if you would like to use the Data-in replication feature for migration you can follow these steps
* Create the server with Zone redundant HA enabled
* Disable HA
* Follow the article to [setup data-in replication](./concepts-data-in-replication.md)  (Make sure that GTID_Mode has the same setting on the source and target servers.)
* Post cutovers remove the Data-in replication configuration
* Enable HA

**Can I failover to standby server during server restarts or while scaling up\down to reduce downtime?** </br>
Currently when a scale up or down operation is performed, the standby and primary are scaled at the same time so failing over doesn't help but allowing scaling up standby first, followed by failover and scaling up of primary is in roadmap but not supported yet.</br>


## Next steps

- Learn about [business continuity](./concepts-business-continuity.md)
- Learn about [zone redundant high availability](./concepts-high-availability.md)
- Learn about [backup and recovery](./concepts-backup-restore.md)