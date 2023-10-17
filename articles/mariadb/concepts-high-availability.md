---
title: High availability - Azure Database for MariaDB
description: This article provides information on high availability in Azure Database for MariaDB
ms.service: mariadb
author: mksuni
ms.author: sumuth
ms.topic: conceptual
ms.date: 06/24/2022
---

# High availability in Azure Database for MariaDB

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

The Azure Database for MariaDB service provides a guaranteed high level of availability with the financially backed service level agreement (SLA) of [99.99%](https://azure.microsoft.com/support/legal/sla/MariaDB) uptime. Azure Database for MariaDB provides high availability during planned events such as user-initated scale compute operation, and also when unplanned events such as underlying hardware, software, or network failures occur. Azure Database for MariaDB can quickly recover from most critical circumstances, ensuring virtually no application down time when using this service.

Azure Database for MariaDB is suitable for running mission critical databases that require high uptime. Built on Azure architecture, the service has inherent high availability, redundancy, and resiliency capabilities to mitigate database downtime from planned and unplanned outages, without requiring you to configure any additional components.

## Components in Azure Database for MariaDB

| **Component** | **Description**|
| ------------ | ----------- |
| <b>MariaDB Database Server | Azure Database for MariaDB provides security, isolation, resource safeguards, and fast restart capability for database servers. These capabilities facilitate operations such as scaling and database server recovery operation after an outage to happen in seconds. <br/> Data modifications in the database server typically occur in the context of a database transaction. All database changes are recorded synchronously in the form of write ahead logs (ib_log) on Azure Storage – which is attached to the database server. During the database [checkpoint](https://mariadb.com/kb/innodb-redo-log/#checkpoints) process, data pages from the database server memory are also flushed to the storage. |
| <b>Remote Storage | All MariaDB physical data files and log files are stored on Azure Storage, which is architected to store three copies of data within a region to ensure data redundancy, availability, and reliability. The storage layer is also independent of the database server. It can be detached from a failed database server and reattached to a new database server within few seconds. Also, Azure Storage continuously monitors for any storage faults. If a block corruption is detected, it is automatically fixed by instantiating a new storage copy. |
| <b>Gateway | The Gateway acts as a database proxy, routes all client connections to the database server. |

## Planned downtime mitigation

Azure Database for MariaDB is architected to provide high availability during planned downtime operations.

![view of Elastic Scaling in Azure MariaDB](./media/concepts-high-availability/elastic-scaling-mariadb-server.png)

Here are some planned maintenance scenarios:

| **Scenario** | **Description**|
| ------------ | ----------- |
| <b>Compute scale up/down | When the user performs compute scale up/down operation, a new database server is provisioned using the scaled compute configuration. In the old database server, active checkpoints are allowed to complete, client connections are drained, any uncommitted transactions are canceled, and then it is shut down. The storage is then detached from the old database server and attached to the new database server. When the client application retries the connection, or tries to make a new connection, the Gateway directs the connection request to the new database server.|
| <b>Scaling Up Storage | Scaling up the storage is an online operation and does not interrupt the database server.|
| <b>New Software Deployment (Azure) | New features rollout or bug fixes automatically happen as part of service’s planned maintenance. For more information, refer to the [documentation](concepts-monitoring.md#planned-maintenance-notification), and also check your [portal](https://aka.ms/servicehealthpm).|
| <b>Minor version upgrades | Azure Database for MariaDB automatically patches database servers to the minor version determined by Azure. It happens as part of service's planned maintenance. This would incur a short downtime in terms of seconds, and the database server is automatically restarted with the new minor version. For more information, refer to the [documentation](concepts-monitoring.md#planned-maintenance-notification), and also check your [portal](https://aka.ms/servicehealthpm).|

##  Unplanned downtime mitigation

Unplanned downtime can occur as a result of unforeseen failures, including underlying hardware fault, networking issues, and software bugs. If the database server goes down unexpectedly, a new database server is automatically provisioned in seconds. The remote storage is automatically attached to the new database server. MariaDB engine performs the recovery operation using WAL and database files, and opens up the database server to allow clients to connect. Uncommitted transactions are lost, and they have to be retried by the application. While an unplanned downtime cannot be avoided, Azure Database for MariaDB mitigates the downtime by automatically performing recovery operations at both database server and storage layers without requiring human intervention.

![view of High Availability in Azure MariaDB](./media/concepts-high-availability/availability-mariadb-server.png)

### Unplanned downtime: failure scenarios and service recovery

Here are some failure scenarios and how Azure Database for MariaDB automatically recovers:

| **Scenario** | **Automatic recovery** |
| ---------- | ---------- |
| <B>Database server failure | If the database server is down because of some underlying hardware fault, active connections are dropped, and any inflight transactions are aborted. A new database server is automatically deployed, and the remote data storage is attached to the new database server. After the database recovery is complete, clients can connect to the new database server through the Gateway. <br /> <br /> Applications using the MariaDB databases need to be built in a way that they detect and retry dropped connections and failed transactions.  When the application retries, the Gateway transparently redirects the connection to the newly created database server. |
| <B>Storage failure | Applications do not see any impact for any storage-related issues such as a disk failure or a physical block corruption. As the data is stored in 3 copies, the copy of the data is  served by the surviving storage. Block corruptions are automatically corrected. If a copy of data is lost, a new copy of the data is automatically created. |

Here are some failure scenarios that require user action to recover:

| **Scenario** | **Recovery plan** |
| ---------- | ---------- |
| <b> Region failure | Failure of a region is a rare event. However, if you need protection from a region failure, you can configure one or more read replicas in other regions for disaster recovery (DR). (See [this article](howto-read-replicas-portal.md) about creating and managing read replicas for details). In the event of a region-level failure, you can manually promote the read replica configured on the other region to be your production database server. |
| <b> Logical/user errors | Recovery from user errors, such as accidentally dropped tables or incorrectly updated data, involves performing a [point-in-time recovery](concepts-backup.md) (PITR), by restoring and recovering the data until the time just before the error had occurred.<br> <br>  If you want to restore only a subset of databases or specific tables rather than all databases in the database server, you can restore the database server in a new instance, export the table(s) via [mysqldump](howto-migrate-dump-restore.md), and then use [restore](howto-migrate-dump-restore.md#restore-your-mariadb-database) to restore those tables into your database. |


## Summary

Azure Database for MariaDB provides fast restart capability of database servers,  redundant storage, and efficient routing from the Gateway. For additional data protection, you can configure backups to be geo-replicated, and also deploy one or more read replicas in other regions. With inherent high availability capabilities, Azure Database for MariaDB protects your databases from most common outages, and offers an industry leading, finance-backed [99.99% of uptime SLA](https://azure.microsoft.com/support/legal/sla/MariaDB). All these availability and reliability capabilities enable Azure to be the ideal platform to run your mission-critical applications.

## Next steps

- Learn about [Azure regions](../availability-zones/az-overview.md)
- Learn about [handling transient connectivity errors](concepts-connectivity.md)
- Learn how to [replicate your data with read replicas](howto-read-replicas-portal.md)
