---
title: Read replicas - Azure Database for MySQL - Flexible Server
description: 'Learn about read replicas in Azure Database for MySQL Flexible Server: creating replicas, connecting to replicas, monitoring replication, and stopping replication.'
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: conceptual
ms.date: 10/26/2020
---

# Read replicas in Azure Database for MySQL - Flexible Server

> [!IMPORTANT]
> Read replicas in Azure Database for MySQL - Flexible Server is in preview.

MySQL is one of the popular database engines for running internet-scale web and mobile applications. Many of our customers use it for their online education services, video streaming services, digital payment solutions, e-commerce platforms, gaming services, news portals, government, and healthcare websites. These services are required to serve and scale as the traffic on the web or mobile application increases.

On the applications side, the application is typically developed in Java or php and migrated to run on Azure virtual machine scale sets or Azure App Services or are containerized to run on Azure Kubernetes Service (AKS). With virtual machine scale set, App Service or AKS as underlying infrastructure, application scaling is simplified by instantaneously provisioning new VMs and replicating the stateless components of applications to cater to the requests but often, database ends up being a bottleneck as centralized stateful component.

The read replica feature allows you to replicate data from an Azure Database for MySQL flexible server to a read-only server. You can replicate from the source server to up to **10** replicas. Replicas are updated asynchronously using the MySQL engine's native binary log (binlog) file position-based replication technology. To learn more about binlog replication, see the [MySQL binlog replication overview](https://dev.mysql.com/doc/refman/5.7/en/binlog-replication-configuration-overview.html).

Replicas are new servers that you manage similar to your source Azure Database for MySQL flexible servers. You will incur billing charges for each read replica based on the provisioned compute in vCores and storage in GB/ month. For more information, refer to [pricing](./concepts-compute-storage.md#pricing).

To learn more about MySQL replication features and issues, see the [MySQL replication documentation](https://dev.mysql.com/doc/refman/5.7/en/replication-features.html).

> [!NOTE]
> Bias-free communication
>
> Microsoft supports a diverse and inclusionary environment. This article contains references to the word _slave_. The Microsoft [style guide for bias-free communication](https://github.com/MicrosoftDocs/microsoft-style-guide/blob/master/styleguide/bias-free-communication.md) recognizes this as an exclusionary word. The word is used in this article for consistency because it's currently the word that appears in the software. When the software is updated to remove the word, this article will be updated to be in alignment.
>

## Common use cases for read replica

The read replica feature helps to improve the performance and scale of read-intensive workloads. Read workloads can be isolated to the replicas, while write workloads can be directed to the source.

Common scenarios are:

* Scaling read-workloads coming from the application by using lightweight connection proxy like [ProxySQL](https://aka.ms/ProxySQLLoadBalanceReplica) or using microservices based pattern to scale out your read queries coming from the application to read replicas
* BI or analytical reporting workloads can use read replicas as data source for reporting
* For IoT or Manufacturing scenario where telemetry information is ingested into MySQL database engine while multiple read replicas are use for reporting of data

Because replicas are read-only, they don't directly reduce write-capacity burdens on the source. This feature isn't targeted at write-intensive workloads.

The read replica feature uses MySQL asynchronous replication. The feature isn't meant for synchronous replication scenarios. There will be a measurable delay between the source and the replica. The data on the replica eventually becomes consistent with the data on the source. Use this feature for workloads that can accommodate this delay.

## Create a replica

If a source server has no existing replica servers, the source will first restart to prepare itself for replication.

When you start the create replica workflow, a blank Azure Database for MySQL server is created. The new server is filled with the data that was on the source server. The creation time depends on the amount of data on the source and the time since the last weekly full backup. The time can range from a few minutes to several hours.

> [!NOTE]
> Read replicas are created with the same server configuration as the source. The replica server configuration can be changed after it has been created. The replica server is always created in the same resource group, same location and same subscription as the source server. If you want to create a replica server to a different resource group or different subscription, you can [move the replica server](https://docs.microsoft.com/azure/azure-resource-manager/management/move-resource-group-and-subscription) after creation. It is recommended that the replica server's configuration should be kept at equal or greater values than the source to ensure the replica is able to keep up with the source.

Learn how to [create a read replica in the Azure portal](how-to-read-replicas-portal.md).

## Connect to a replica

At creation, a replica inherits the connectivity method of the source server. You cannot change the connectivity method of the replica. For example if source server has **Private access (VNet Integration)** then replica cannot be in **Public access (allowed IP addresses)**.

The replica inherits the admin account from the source server. All user accounts on the source server are replicated to the read replicas. You can only connect to a read replica by using the user accounts that are available on the source server.

You can connect to the replica by using its hostname and a valid user account, as you would on a regular Azure Database for MySQL flexible server. For a server named **myreplica** with the admin username **myadmin**, you can connect to the replica by using the mysql CLI:

```bash
mysql -h myreplica.mysql.database.azure.com -u myadmin -p
```

At the prompt, enter the password for the user account.

## Monitor replication

Azure Database for MySQL Flexible Server provides the **Replication lag in seconds** metric in Azure Monitor. This metric is available for replicas only. This metric is calculated using the `seconds_behind_master` metric available in MySQL's `SHOW SLAVE STATUS` command. Set an alert to inform you when the replication lag reaches a value that isn’t acceptable for your workload.

If you see increased replication lag, refer to [troubleshooting replication latency](./../howto-troubleshoot-replication-latency.md) to troubleshoot and understand possible causes.

## Stop replication

You can stop replication between a source and a replica. After replication is stopped between a source server and a read replica, the replica becomes a standalone server. The data in the standalone server is the data that was available on the replica at the time the stop replication command was started. The standalone server doesn't catch up with the source server.

When you choose to stop replication to a replica, it loses all links to its previous source and other replicas. There is no automated failover between a source and its replica.

> [!IMPORTANT]
> The standalone server can't be made into a replica again.
> Before you stop replication on a read replica, ensure the replica has all the data that you require.

Learn how to [stop replication to a replica](how-to-read-replicas-portal.md).

## Failover

There is no automated failover between source and replica servers. 

Read replicas is meant for scaling of read intensive workloads and is not designed to meet high availability needs of a server. There is no automated failover between source and replica servers. Stopping the replication on read replica to bring it online in read write mode is the means by which this manual failover is performed.

Since replication is asynchronous, there is lag between the source and the replica. The amount of lag can be influenced by a number of factors like how heavy the workload running on the source server is and the latency between data centers. In most cases, replica lag ranges between a few seconds to a couple minutes. You can track your actual replication lag using the metric *Replica Lag*, which is available for each replica. This metric shows the time since the last replayed transaction. We recommend that you identify what your average lag is by observing your replica lag over a period of time. You can set an alert on replica lag, so that if it goes outside your expected range, you can take action.

> [!Tip]
> If you failover to the replica, the lag at the time you delink the replica from the source will indicate how much data is lost.

Once you have decided you want to failover to a replica, 

1. Stop replication to the replica<br/>
   This step is necessary to make the replica server able to accept writes. As part of this process, the replica server will be delinked from the source. Once you initiate stop replication, the backend process typically takes about 2 minutes to complete. See the [stop replication](#stop-replication) section of this article to understand the implications of this action.
	
2. Point your application to the (former) replica<br/>
   Each server has a unique connection string. Update your application to point to the (former) replica instead of the source.
	
Once your application is successfully processing reads and writes, you have completed the failover. The amount of downtime your application experiences will depend on when you detect an issue and complete steps 1 and 2 above.

## Considerations and limitations

| Scenario | Limitation/Consideration |
|:-|:-|
| Replica on server with zone-redundant HA enabled | Not supported |
| Pricing | The cost of running the replica server is based on the region where the replica server is running |
| Source server restart | When you create a replica for a source that has no existing replicas, the source will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period |
| New replicas | A read replica is created as a new Azure Database for MySQL flexible server. An existing server can't be made into a replica. You can't create a replica of another read replica |
| Replica configuration | A replica is created by using the same server configuration as the source. After a replica is created, several settings can be changed independently from the source server: compute generation, vCores, storage, and backup retention period. The compute tier can also be changed independently.<br> <br> **IMPORTANT**  <br> - Before a source server configuration is updated to new values, update the replica configuration to equal or greater values. This action ensures the replica can keep up with any changes made to the source. <br/> Connectivity method and parameter settings are inherited from the source server to the replica when the replica is created. Afterwards, the replica's rules are independent. |
| Stopped replicas | If you stop replication between a source server and a read replica, the stopped replica becomes a standalone server that accepts both reads and writes. The standalone server can't be made into a replica again. |
| Deleted source and standalone servers | When a source server is deleted, replication is stopped to all read replicas. These replicas automatically become standalone servers and can accept both reads and writes. The source server itself is deleted. |
| User accounts | Users on the source server are replicated to the read replicas. You can only connect to a read replica using the user accounts available on the source server. |
| Server parameters | To prevent data from becoming out of sync and to avoid potential data loss or corruption, some server parameters are locked from being updated when using read replicas. <br> The following server parameters are locked on both the source and replica servers:<br> - [`innodb_file_per_table`](https://dev.mysql.com/doc/refman/5.7/en/innodb-multiple-tablespaces.html) <br> - [`log_bin_trust_function_creators`](https://dev.mysql.com/doc/refman/5.7/en/replication-options-binary-log.html#sysvar_log_bin_trust_function_creators) <br> The [`event_scheduler`](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_event_scheduler) parameter is locked on the replica servers. <br> To update one of the above parameters on the source server, please delete replica servers, update the parameter value on the source, and recreate replicas. |
| Other | - Creating a replica of a replica is not supported. <br> - In-memory tables may cause replicas to become out of sync. This is a limitation of the MySQL replication technology. Read more in the [MySQL reference documentation](https://dev.mysql.com/doc/refman/5.7/en/replication-features-memory.html) for more information. <br>- Ensure the source server tables have primary keys. Lack of primary keys may result in replication latency between the source and replicas.<br>- Review the full list of MySQL replication limitations in the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/replication-features.html) |

## Next steps

- Learn how to [create and manage read replicas using the Azure portal](how-to-read-replicas-portal.md)
- Learn how to [create and manage read replicas using the Azure CLI](how-to-read-replicas-cli.md)
