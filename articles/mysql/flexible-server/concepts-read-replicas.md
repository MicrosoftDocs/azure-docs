---
title: Read replicas - Azure Database for MySQL - Flexible Server
description: "Learn about read replicas in Azure Database for MySQL Flexible Server: creating replicas, connecting to replicas, monitoring replication, and stopping replication."
author: VandhanaMehta
ms.author: vamehta
ms.reviewer: maghan
ms.date: 05/10/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom: event-tier1-build-2022
---

# Read replicas in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

MySQL is one of the popular database engines for running internet-scale web and mobile applications. Many of our customers use it for their online education services, video streaming services, digital payment solutions, e-commerce platforms, gaming services, news portals, government, and healthcare websites. These services are required to serve and scale as the traffic on the web or mobile application increases.

On the applications side, the application is typically developed in Java or PHP and migrated to run on Azure Virtual Machine Scale Sets or Azure App Services or are containerized to run on Azure Kubernetes Service (AKS). With Virtual Machine Scale Set, App Service or AKS as underlying infrastructure, application scaling is simplified by instantaneously provisioning new VMs and replicating the stateless components of applications to cater to the requests but often, database ends up being a bottleneck as centralized stateful component.

The read replica feature allows you to replicate data from an Azure Database for MySQL - Flexible Server to a read-only server. You can replicate from the source server to up to **10** replicas. Replicas are updated asynchronously using the MySQL engine's native binary log (binlog) file position-based replication technology. To learn more about binlog replication, see the [MySQL binlog replication overview](https://dev.mysql.com/doc/refman/5.7/en/binlog-replication-configuration-overview.html).

Replicas are new servers that you manage similar to your source Azure Database for MySQL - Flexible Servers. You'll incur billing charges for each read replica based on the provisioned compute in vCores and storage in GB/ month. For more information, see [pricing](./concepts-compute-storage.md#pricing).

> [!NOTE]  
> The read replica feature is only available for Azure Database for MySQL - Flexible servers in the General Purpose or Business Critical pricing tiers. Ensure the source server is in one of these pricing tiers.

To learn more about MySQL replication features and issues, see the [MySQL replication documentation](https://dev.mysql.com/doc/refman/5.7/en/replication-features.html).

> [!NOTE]  
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

## Common use cases for read replica

The read replica feature helps to improve the performance and scale of read-intensive workloads. Read workloads can be isolated to the replicas, while write workloads can be directed to the source.

Common scenarios are:

- Scaling read-workloads coming from the application by using lightweight connection proxy like [ProxySQL](https://aka.ms/ProxySQLLoadBalanceReplica) or using microservices-based pattern to scale out your read queries coming from the application to read replicas
- BI or analytical reporting workloads can use read replicas as data source for reporting
- For IoT or Manufacturing scenario where telemetry information is ingested into MySQL database engine while multiple read replicas are use for reporting of data

Because replicas are read-only, they don't directly reduce write-capacity burdens on the source. This feature isn't targeted at write-intensive workloads.

The read replica feature uses MySQL asynchronous replication. The feature isn't meant for synchronous replication scenarios. There's a measurable delay between the source and the replica. The data on the replica eventually becomes consistent with the data on the source. Use this feature for workloads that can accommodate this delay.

## Cross-region replication

You can create a read replica in a different region from your source server. Cross-region replication can be helpful for scenarios like disaster recovery planning or bringing data closer to your users. Azure database for MySQL Flexible Server allows you to provision read-replica in any [Azure supported regions](/azure/reliability/cross-region-replication-azure) where Azure Database for MySQL Flexible server is available. Using this feature, a source server can have a replica in its paired region or the universal replica regions. Please refer [here](./overview.md#azure-regions) to find the list of Azure regions where Azure Database for MySQL Flexible server is available today

## Create a replica

If a source server has no existing replica servers, the source first restarts to prepare itself for replication.

When you start the create replica workflow, a blank Azure Database for MySQL server is created. The new server is filled with the data that was on the source server. The creation time depends on the amount of data on the source and the time since the last weekly full backup. The time can range from a few minutes to several hours.

> [!NOTE]  
> Read replicas are created with the same server configuration as the source. The replica server configuration can be changed after it has been created. The replica server is always created in the same resource group and same subscription as the source server. If you want to create a replica server to a different resource group or different subscription, you can [move the replica server](../../azure-resource-manager/management/move-resource-group-and-subscription.md) after creation. It is recommended that the replica server's configuration should be kept at equal or greater values than the source to ensure the replica is able to keep up with the source.

Learn how to [create a read replica in the Azure portal](how-to-read-replicas-portal.md).

## Connect to a replica

At creation, a replica inherits the connectivity method of the source server. You can't change the connectivity method of the replica. For example if source server has **Private access (VNet Integration)** then replica can't be in **Public access (allowed IP addresses)**.

The replica inherits the admin account from the source server. All user accounts on the source server are replicated to the read replicas. You can only connect to a read replica by using the user accounts that are available on the source server.

You can connect to the replica by using its hostname and a valid user account, as you would on a regular Azure Database for MySQL - Flexible Server. For a server named **myreplica** with the admin username **myadmin**, you can connect to the replica by using the mysql CLI:

```bash
mysql -h myreplica.mysql.database.azure.com -u myadmin -p
```

At the prompt, enter the password for the user account.

## Monitor replication

Azure Database for MySQL - Flexible Server provides the **Replication lag in seconds** metric in Azure Monitor. This metric is available for replicas only. This metric is calculated using the `seconds_behind_master` metric available in MySQL's `SHOW SLAVE STATUS` command. Set an alert to inform you when the replication lag reaches a value that isn't acceptable for your workload.

If you see increased replication lag, refer to [troubleshooting replication latency](./../howto-troubleshoot-replication-latency.md) to troubleshoot and understand possible causes.

> [!IMPORTANT]  
> Read Replica uses storage based replication technology, which no longer uses 'SLAVE_IO_RUNNING'/'REPLICA_IO_RUNNING' metric available in MySQL's 'SHOW SLAVE STATUS'/'SHOW REPLICA STATUS' command. The value of it always be displayed as "No" and is not indicative of replication status. To know the correct status of replication, please refer to replication metrics - **Replica IO Status** and **Replica SQL Status** under monitoring blade.

## Stop replication

You can stop replication between a source and a replica. After replication is stopped between a source server and a read replica, the replica becomes a standalone server. The data in the standalone server is the data that was available on the replica at the time the stop replication command was started. The standalone server doesn't catch up with the source server.

When you choose to stop replication to a replica, it loses all links to its previous source and other replicas. There's no automated failover between a source and its replica.

> [!IMPORTANT]  
> The standalone server can't be made into a replica again.
> Before you stop replication on a read replica, ensure the replica has all the data that you require.

Learn how to [stop replication to a replica](how-to-read-replicas-portal.md).

## Failover

There's no automated failover between source and replica servers.

Read replicas is meant for scaling of read intensive workloads and isn't designed to meet high availability needs of a server. Stopping the replication on read replica to bring it online in read write mode is the means by which this manual failover is performed.

Since replication is asynchronous, there's lag between the source and the replica. The amount of lag can be influenced by many factors like how heavy the workload running on the source server is and the latency between data centers. In most cases, replica lag ranges between a few seconds to a couple minutes. You can track your actual replication lag using the metric *Replica Lag*, which is available for each replica. This metric shows the time since the last replayed transaction. We recommend that you identify what your average lag is by observing your replica lag over a period of time. You can set an alert on replica lag, so that if it goes outside your expected range, you can take action.

> [!TIP]  
> If you failover to the replica, the lag at the time you delink the replica from the source indicates how much data is lost.

After you've decided you want to fail over to a replica:

1. Stop replication to the replica<br/>
   This step is necessary to make the replica server able to accept writes. As part of this process, the replica server is delinked from the source. After you initiate stop replication, the backend process typically takes about 2 minutes to complete. See the [stop replication](#stop-replication) section of this article to understand the implications of this action.

1. Point your application to the (former) replica<br/>
   Each server has a unique connection string. Update your application to point to the (former) replica instead of the source.

After your application is successfully processing reads and writes, you've completed the failover. The amount of downtime your application experiences depend on when you detect an issue and complete steps 1 and 2 above.

## Global transaction identifier (GTID)

Global transaction identifier (GTID) is a unique identifier created with each committed transaction on a source server and is OFF by default in Azure Database for MySQL - Flexible Server. GTID is supported on versions 5.7 and 8.0. To learn more about GTID and how it's used in replication, refer to MySQL's [replication with GTID](https://dev.mysql.com/doc/refman/5.7/en/replication-gtids.html) documentation.

The following server parameters are available for configuring GTID:

| **Server parameter** | **Description** | **Default Value** | **Values** |
| --- | --- | --- | --- |
| `gtid_mode` | Indicates if GTIDs are used to identify transactions. Changes between modes can only be done one step at a time in ascending order (ex. `OFF` -> `OFF_PERMISSIVE` -> `ON_PERMISSIVE` -> `ON`) | `OFF*` | `OFF`: Both new and replication transactions must be anonymous<br />`OFF_PERMISSIVE`: New transactions are anonymous. Replicated transactions can either be anonymous or GTID transactions.<br />`ON_PERMISSIVE`: New transactions are GTID transactions. Replicated transactions can either be anonymous or GTID transactions.<br />`ON`: Both new and replicated transactions must be GTID transactions. |
| `enforce_gtid_consistency` | Enforces GTID consistency by allowing execution of only those statements that can be logged in a transactionally safe manner. This value must be set to `ON` before enabling GTID replication. | `OFF*` | `OFF`: All transactions are allowed to violate GTID consistency.<br />`ON`: No transaction is allowed to violate GTID consistency.<br />`WARN`: All transactions are allowed to violate GTID consistency, but a warning is generated. |

**For Azure Database for MySQL-Flexible servers having High Availability feature enabled the default value is set to `ON`*
> [!NOTE]  
>  
> - After GTID is enabled, you cannot turn it back off. If you need to turn GTID OFF, please contact support.
>  
> - To change GTID's from one value to another can only be one step at a time in ascending order of modes. For example, if gtid_mode is currently set to OFF_PERMISSIVE, it is possible to change to ON_PERMISSIVE but not to ON.
>  
> - To keep replication consistent, you cannot update it for a master/replica server.
>  
> - Recommended to SET enforce_gtid_consistency to ON before you can set gtid_mode=ON

To enable GTID and configure the consistency behavior, update the `gtid_mode` and `enforce_gtid_consistency` server parameters using the [Azure portal](how-to-configure-server-parameters-portal.md), [Azure CLI](how-to-configure-server-parameters-cli.md).

If GTID is enabled on a source server (`gtid_mode` = ON), newly created replicas also have GTID enabled and use GTID replication. In order to make sure that the replication is consistent, `gtid_mode` can't be changed once the master, or replica server(s) is created with GTID enabled.

## Considerations and limitations

| Scenario | Limitation/Consideration |
| :- | :- |
| Replica on server in Burstable Pricing Tier | Not supported |
| Pricing | The cost of running the replica server is based on the region where the replica server is running |
| Source server restart | When you create a replica for a source that has no existing replicas, the source will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period |
| New replicas | A read replica is created as a new Azure Database for MySQL - Flexible Server. An existing server can't be made into a replica. You can't create a replica of another read replica |
| Replica configuration | A replica is created by using the same server configuration as the source. After a replica is created, several settings can be changed independently from the source server: compute generation, vCores, storage, and backup retention period. The compute tier can also be changed independently.<br> <br> **IMPORTANT**  <br> - Before a source server configuration is updated to new values, update the replica configuration to equal or greater values. This action ensures the replica can keep up with any changes made to the source. <br/> Connectivity method and parameter settings are inherited from the source server to the replica when the replica is created. Afterwards, the replica's rules are independent. |
| Stopped replicas | If you stop replication between a source server and a read replica, the stopped replica becomes a standalone server that accepts both reads and writes. The standalone server can't be made into a replica again. |
| Deleted source and standalone servers | When a source server is deleted, replication is stopped to all read replicas. These replicas automatically become standalone servers and can accept both reads and writes. The source server itself is deleted. |
| User accounts | Users on the source server are replicated to the read replicas. You can only connect to a read replica using the user accounts available on the source server. |
| Server parameters | To prevent data from becoming out of sync and to avoid potential data loss or corruption, some server parameters are locked from being updated when using read replicas. <br> The following server parameters are locked on both the source and replica servers:<br> - [`innodb_file_per_table`](https://dev.mysql.com/doc/refman/8.0/en/innodb-file-per-table-tablespaces.html) <br> - [`log_bin_trust_function_creators`](https://dev.mysql.com/doc/refman/5.7/en/replication-options-binary-log.html#sysvar_log_bin_trust_function_creators) <br> The [`event_scheduler`](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_event_scheduler) parameter is locked on the replica servers. <br> To update one of the above parameters on the source server, delete replica servers, update the parameter value on the source, and recreate replicas.
| Session level parameters | When configuring session level parameters such as 'foreign_keys_checks' on the read replica, ensure the parameter values being set on the read replica are consistent with that of the source server. |
| Adding AUTO_INCREMENT Primary Key column to the existing table in the source server. | We don't recommend altering table with AUTO_INCREMENT post read replica creation, as it breaks the replication. But in case you would like to add the auto increment column post creating a replica server. We recommend these two approaches:<br />- Create a new table with the same schema of table you want to modify. In the new table, alter the column with AUTO_INCREMENT and then from the original table restore the data. Drop old table and rename it in the source, this doesn't need us to delete the replica server but may need large insert cost to creating backup table.<br />- The other quicker method is to recreate the replica after adding all auto increment columns. |
| Other | - Creating a replica of a replica isn't supported.<br />- In-memory tables may cause replicas to become out of sync. This is a limitation of the MySQL replication technology. Read more in the [MySQL reference documentation](https://dev.mysql.com/doc/refman/5.7/en/replication-features-memory.html) for more information.<br />- Ensure the source server tables have primary keys. Lack of primary keys may result in replication latency between the source and replicas.<br />- Review the full list of MySQL replication limitations in the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/replication-features.html) |

## Next steps

- Learn how to [create and manage read replicas using the Azure portal](how-to-read-replicas-portal.md)
- Learn how to [create and manage read replicas using the Azure CLI](how-to-read-replicas-cli.md)
