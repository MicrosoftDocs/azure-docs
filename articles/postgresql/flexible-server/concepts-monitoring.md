---
title: Monitoring and metrics - Azure Database for PostgreSQL - Flexible Server
description: This article describes monitoring and metrics features in Azure Database for PostgreSQL - Flexible Server.
author: sunilagarwal
ms.author: sunila
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/23/2020
---

# Monitor metrics on Azure Database for PostgreSQL - Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

Monitoring data about your servers helps you troubleshoot and optimize for your workload. Azure Database for PostgreSQL provides various monitoring options to provide insight into the behavior of your server.

## Metrics
Azure Database for PostgreSQL provides various metrics that give insight into the behavior of the resources supporting the PostgreSQL server. Each metric is emitted at a one-minute frequency, and has up to [93 days of history](../../azure-monitor/essentials/data-platform-metrics.md#retention-of-metrics). You can configure alerts on the metrics. Other options include setting up automated actions, performing advanced analytics, and archiving history. For more information, see the [Azure Metrics Overview](../../azure-monitor/essentials/data-platform-metrics.md).

### List of metrics
The following metrics are available for PostgreSQL flexible server:


|Metric|Metric Display Name|Unit|Description|
|---|---|---|---|
| active_connections | Active Connections | Count | The number of connections to your server. | 
| backup_storage_used | Backup Storage Used | Bytes | Amount of backup storage used. This metric represents the sum of storage consumed by all the full database backups, differential backups, and log backups retained based on the backup retention period set for the server. The frequency of the backups is service managed. For geo-redundant storage, backup storage usage is twice that of the locally redundant storage. |
| connections_failed | Failed Connections | Count | Failed connections. |
| connections_succeeded | Succeeded Connections | Count | Succeeded connections. |
| cpu_credits_consumed | CPU Credits Consumed | Count | Number of credits used by the flexible server. Applicable to Burstable tier. |
| cpu_credits_remaining | CPU Credits Remaining | Count | Number of credits available to burst. Applicable to Burstable tier. |
| cpu_percent | CPU percent | Percent | Percentage of CPU in use. | 
| disk_queue_depth | Disk Queue Depth | Count | Number of outstanding I/O operations to the data disk. |
| iops | IOPS | Count | Number of I/O operations to disk per second. |
| maximum_used_transactionIDs | Maximum Used Transaction IDs | Count | Maximum transaction ID in use. |
| memory_percent | Memory percent | Percent | Percentage of memory in use. |
| network_bytes_egress | Network Out | Bytes | Amount of outgoing network traffic. |
| network_bytes_ingress | Network In | Bytes | Amount of incoming network traffic. |
| read_iops | Read IOPS | Count | Number of data disk I/O read operations per second. |
| read_throughput | Read Throughput | Bytes | Bytes read per second from disk. |
| storage_free | Storage Free | Bytes | The amount of storage space available. |
| storage_percent | Storage percent | Percentage | Percent of storage space used. The storage used by the service may include the database files, transaction logs, and the server logs.|
| storage_used | Storage Used | Bytes | Percent of storage space used. The storage used by the service may include the database files, transaction logs, and the server logs. |
| txlogs_storage_used | Transaction Log Storage Used | Bytes | Amount of storage space used by the transaction logs. | 
| write_throughput | Write Throughput | Bytes | Bytes written per second to disk. |
| write_iops | Write IOPS | Count | Number of data disk I/O write operations per second. |

## Server logs
Azure Database for PostgreSQL allows you to configure and access Postgres' standard logs. To learn more about logs, visit the [logging concepts doc](concepts-logging.md).
