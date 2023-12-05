---
title: Performance best practices and configuration guidelines - Azure SQL Edge
description: Learn about performance best practices and configuration guidelines in Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
keywords:
  - SQL Edge
  - data retention
---
# Performance best practices and configuration guidelines

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Azure SQL Edge offers several features and capabilities that can be used to improve the performance of your SQL Edge deployment. This article provides some best practices and recommendations to maximize performance.

## Best practices

### Configure multiple `tempdb` data files

Azure SQL Edge by default creates only one `tempdb` data file as part of the container initialization. We recommend that you consider creating multiple `tempdb` data files post deployment. For more information, see the guidance in the article, [Recommendations to reduce allocation contention in SQL Server tempdb database](https://support.microsoft.com/help/2154845/recommendations-to-reduce-allocation-contention-in-sql-server-tempdb-d).

### Use Clustered columnstore indexes where possible

IoT and Edge devices tend to generate high volume of data that is typically aggregated over some time window for analysis. Individual data rows are rarely used for any analysis. Columnstore indexes are ideal for storing and querying such large datasets. This index uses column-based data storage and query processing to achieve gains up to 10 times the query performance over traditional row-oriented storage. You can also achieve gains up to 10 times the data compression over the uncompressed data size. For more information, see [Columnstore Indexes](/sql/relational-databases/indexes/columnstore-indexes-overview)

Additionally, other Azure SQL Edge features like data streaming and Data retention benefit from the columnstore optimizations around data insertion and data removal.

### Simple recovery model

Since storage can be constrained on edge devices, all user databases in Azure SQL Edge use the Simple Recovery model by default. Simple recovery model automatically reclaims log space to keep space requirements small, essentially eliminating the need to manage the transaction log space. On edge devices with limited storage available, this can be helpful. For more information on the simple recovery model and other recovery models available, see [Recovery Models](/sql/relational-databases/backup-restore/recovery-models-sql-server)

The simple recovery model doesn't support operations that require transaction log backups, such as log shipping and point-in-time-restores.

## Advanced configuration

### Set memory limits

Azure SQL Edge supports up to 64 GB of memory for the buffer pool, while additional memory may be required by satellite processes running within the SQL Edge container. On smaller edge devices with limited memory, it's advisable to limit the memory available to SQL Edge containers, such that the Docker host and other edge processes or modules can function properly. The total memory available for SQL Edge can be controlled using the following mechanisms.

- Limiting memory available to the SQL Edge Containers: The total memory available to the SQL Edge container can be limited by using the container runtime configuration option `--memory`. For more information on limiting memory available to the SQL Edge container, see [Runtime options with Memory, CPUs, and GPUs](https://docs.docker.com/config/containers/resource_constraints/).

- Limiting memory available to SQL process within the container: By default, the SQL process within the container uses only 80% of the physical RAM available. For most deployments, the default configuration is fine. However, there can be scenarios where additional memory might be required for the data streaming and the ONNX processes running inside the SQL Edge containers. In such scenarios, the memory available to the SQL process can be controlled using the `memory.memorylimitmb` setting in the `mssql.conf` file. For more information, see [Configure using mssql.conf file](configure.md#configure-by-using-an-mssqlconf-file).

When setting the memory limits, be careful to not set this value too low. If you don't set enough memory for the SQL process, it can severely affect performance.

### Delayed durability

Transactions in Azure SQL Edge can be either fully durable, the SQL Server default, or delayed durable (also known as lazy commit).

Fully durable transaction commits are synchronous, and report a commit as successful and return control to the client only after the log records for the transaction are written to disk. Delayed durable transaction commits are asynchronous and report a commit as successful before the log records for the transaction are written to disk. Writing the transaction log entries to disk is required for a transaction to be durable. Delayed durable transactions become durable when the transaction log entries are flushed to disk.

In deployments where **some data loss** can be tolerated or on edge devices with slow storage, delayed durability can be used to optimize data ingestion and data retention-based cleanup. For more information, see [Control Transaction Durability](/sql/relational-databases/logs/control-transaction-durability).

### Linux OS configurations

Consider using the following [Linux Operating System configuration](/sql/linux/sql-server-linux-performance-best-practices#linux-os-configuration) settings to experience the best performance for a SQL Installation.
