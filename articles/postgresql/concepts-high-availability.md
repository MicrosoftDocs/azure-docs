---
title: High availability - Azure Database for PostgreSQL - Single Server
description: This article provides information on high availability in Azure Database for PostgreSQL - Single Server
author: sr-pg20
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 6/5/2020
---
# High availability in Azure Database for PostgreSQL – Single Server
The goal of the high availability (HA) architecture for Azure Database for PostgreSQL -- Single Server is to guarantee that your database is up and running a minimum of 99.99% of time. Azure automatically handles critical servicing tasks, such as OS patching and backups, as well as unplanned events, such as underlying hardware, software, or network failures. Azure Database for PostgreSQL can quickly recover even in the most critical circumstances, ensuring that your data is always available.

Azure Database for PostgreSQL leverages Azure architecture that has built-in high availability, redundancy, and resiliency. The database server is deployed in a region of your choice. Azure’s highly available architecture mitigates database downtime from both planned and unplanned downtime. Since these availability capabilities are enabled by default, there is no need to enable them explicitly. 

## Components in Azure Database for PostgreSQL – Single Server

| **Component** | **Description**|
| ------------ | ----------- |
| <b>PostgreSQL Database Server | Azure Database for PostgreSQL  provides security, isolation, resource safeguards, and fast restart capability. These enable scaling operations and database server recovery operations post an outage to happen in seconds. <br/> <br/>Data modifications in the database server typically occur in the context of a database transaction. All database changes are recorded synchronously in the form of write ahead logs (WAL) on Azure Storage – which is attached to the database server, During the database [checkpoint](https://www.postgresql.org/docs/11/sql-checkpoint.html) process, data pages from the database server memory are also flushed to the storage. |
| <b>Remote Storage | All PostgreSQL physical data files and WAL files are stored on Azure Storage. The storage stack is architected to store three copies of data within a region to ensure redundancy, high availability and reliability. The storage layer is also independent of the database server, which can be detached from a failed database server and re-attached to a new database server within few seconds. In addition, Azure Storage continuously monitors and mitigates various fault conditions such as block corruptions and storage drive failures automatically. |
| <b>Gateway | The Gateway which acts as a proxy, routes all client connections to the database server. |

All these components work in tandem to provide the 99.99% of uptime for your applications.
##  Protection from unplanned downtime

Unplanned downtime can happen as a result of many factors, including underlying hardware error, temporary networking issues, software bugs, and storage-related issues. In the event of an unplanned database server downtime, during the database server restart process, the remote storage is automatically attached to the new database server. As the PostgreSQL engine starts up, it performs the recovery process using WAL files and database files, and brings the database server to a consistent state. As uncommitted transactions are lost, they have to be retried by the application. While an unplanned downtime cannot be totally avoided, Azure Database for PostgreSQL mitigates the downtime by automatically performing recovery operations at both database server and storage layers without requiring human intervention. 


![view of High Availability in Azure PostgreSQL](./media/concepts-high-availability/built-in-ha.png)

### Unplanned Downtime: Failure scenarios and service recovery
Here are some failure scenarios and how Azure Database for PostgreSQL recovers with reduced downtime

| **Scenario** | **Recovery** |
| ---------- | ---------- |
| <B>Database Server failure | If a database server interruption occurs such the database server is down due to some underlying hardware fault, any active connections are dropped, and any inflight transactions are aborted. A new database server is automatically created, and the data storage is attached to the new database server. Database recovery is automatically performed on the new database server. The Gateway redirects client connections to the new database server. <br /> <br /> Applications using the PostgreSQL databases need to be built in a way that detects and retries dropped connections and failed transactions. This will help to protect against any prolonged downtime resulting from issues such as network failures. With the Gateway, when the application retries, its connection is transparently redirected to the newly created database server, which takes over for the failed database server. |
| <B>Storage failure | Applications do not see any impact for any storage related issues such as a disk failure or a physical block corruption due to a hardware failure. As the data is stored in 3 copies, the correct copy of the data is automatically served by the surviving storage. In the event of a storage copy failure, another copy is automatically created. |


High availability in Azure Database for PostgreSQL protects from outages caused by hardware and software faults within a region. Ensuring protection from downtime caused by region-level failures and logical errors requires additional configuration and recovery steps as described below.

| **Scenario** | **Recovery** |
| ---------- | ---------- |
| <b> Region failure | Failure of a region is a very rare event. However, if you need protection for disaster recovery (DR) purposes, it is recommended to configure one or more read replicas in regions outside of your production database instance. See [this article](https://docs.microsoft.com/azure/postgresql/howto-read-replicas-portal) about creating and managing read replicas for details. In the event of a region-level failure, you can manually promote the read replica configured on the other region to be your production instance. You can optionally create additional read replicas from the new promoted production instance. |
| <b> Logical errors | These are typically user errors, such as accidentally dropped tables or incorrectly updated data. To recover PostgreSQL data from such an error is to perform a [point-in-time recovery](https://docs.microsoft.com/azure/postgresql/concepts-backup) (PITR) from the backup to the time just before the error occurred. If you want to restore only a subset of tables rather than the entire instance, you can perform a PITR of the database instance in a new instance, export the table(s) via [pg_dump](https://www.postgresql.org/docs/11/app-pgdump.html), and then use [pg_restore](https://www.postgresql.org/docs/11/app-pgrestore.html) to restore those tables into your database. |

## Handling of planned downtime
In the event of a planned downtime activities such as scale up/down of the database server that requires a restart of the server, client connections are drained and any uncommitted transactions are canceled, and then the database is shutdown to be in a consistent state. A new database server is started, and the storage is re-attached. After the client application retries the connection or makes a new connection, the Gateway directs the connection to the new database server, and they can resume the operation. Typically, no recovery is required after a planned downtime.

![view of Elastic Scaling in Azure PostgreSQL](./media/concepts-high-availability/elastic-scaling.png)


Scaling up of storage size is an online operation that does not incur any downtime.

## Summary

Through fast restart capability of database servers, combined with redundant storage and efficient routing from the gateway, high availability for Azure Database for PostgreSQL protects your databases from most common outages and offers an industry leading, finance-backed [99.99% of uptime SLA](https://azure.microsoft.com/support/legal/sla/postgresql) for your applications. To protect from region-level failures, or to address any regulatory requirements, you can easily configure read replicas in other regions. In addition, you can optionally configure backups to be geo-replicated for additional protection.

## Next steps
- Learn about [Azure region](../availability-zones/az-overview.md)
- Learn about [handling transient connectivity errors](concepts-connectivity.md)
- Learn how to [replicate your data with read replicas](howto-read-replicas-portal.md)