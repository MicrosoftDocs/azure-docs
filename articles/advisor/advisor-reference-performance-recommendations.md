---
title: Performance recommendations
description: Full list of available performance recommendations in Advisor.
ms.topic: article
ms.custom: ignite-2022
ms.date: 02/03/2022
---

# Performance recommendations

The performance recommendations in Azure Advisor can help improve the speed and responsiveness of your business-critical applications. You can get performance recommendations from Advisor on the **Performance** tab of the Advisor dashboard.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Performance** tab.


## Attestation

### Update Attestation API Version

We have identified API calls from outdated Attestation API for resources under this subscription. We recommend switching to the latest Attestation API versions. You need to update your existing code to use the latest API version. This ensures you receive the latest features and performance improvements.

Learn more about [Attestation provider - UpgradeAttestationAPI (Update Attestation API Version)](/rest/api/attestation).

## Azure VMware Solution

### vSAN capacity utilization has crossed critical threshold

Your vSAN capacity utilization has reached 75%. The cluster utilization is required to remain below the 75% critical threshold for SLA compliance. Add new nodes to VSphere cluster to increase capacity or delete VMs to reduce consumption or adjust VM workloads

Learn more about [AVS Private cloud - vSANCapacity (vSAN capacity utilization has crossed critical threshold)](../azure-vmware/concepts-private-clouds-clusters.md).

## Azure Cache for Redis

### Improve your Cache and application performance when running with high network bandwidth

Cache instances perform best when not running under high network bandwidth which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce network bandwidth or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheNetworkBandwidth (Improve your Cache and application performance when running with high network bandwidth)](https://aka.ms/redis/recommendations/bandwidth).

### Improve your Cache and application performance when running with many connected clients

Cache instances perform best when not running under high server load which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce the server load or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheConnectedClients (Improve your Cache and application performance when running with many connected clients)](https://aka.ms/redis/recommendations/connections).

### Improve your Cache and application performance when running with high server load

Cache instances perform best when not running under high server load which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce the server load or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheServerLoad (Improve your Cache and application performance when running with high server load)](https://aka.ms/redis/recommendations/cpu).

### Improve your Cache and application performance when running with high memory pressure

Cache instances perform best when not running under high memory pressure which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce used memory or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheUsedMemory (Improve your Cache and application performance when running with high memory pressure)](https://aka.ms/redis/recommendations/memory).

### Improve your Cache and application performance when memory rss usage is high.

Cache instances perform best when not running under high memory pressure which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce used memory or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheUsedMemoryRSS (Improve your Cache and application performance when memory rss usage is high.)](https://aka.ms/redis/recommendations/memory).

### Improve your Cache and application performance when memory rss usage is high.

Cache instances perform best when not running under high memory pressure which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce used memory or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheUsedMemoryRSSHigh (Improve your Cache and application performance when memory rss usage is high.)](https://aka.ms/redis/recommendations/memory).

### Improve your Cache and application performance when running with high network bandwidth

Cache instances perform best when not running under high network bandwidth which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce network bandwidth or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheNetworkBandwidthHigh (Improve your Cache and application performance when running with high network bandwidth)](https://aka.ms/redis/recommendations/bandwidth).

### Improve your Cache and application performance when running with high memory pressure

Cache instances perform best when not running under high memory pressure which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce used memory or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheUsedMemoryHigh (Improve your Cache and application performance when running with high memory pressure)](https://aka.ms/redis/recommendations/memory).

### Improve your Cache and application performance when running with many connected clients

Cache instances perform best when not running under high server load which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce the server load or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheConnectedClientsHigh (Improve your Cache and application performance when running with many connected clients)](https://aka.ms/redis/recommendations/connections).

### Improve your Cache and application performance when running with high server load

Cache instances perform best when not running under high server load which may cause them to become unresponsive, experience data loss, or become unavailable. Apply best practices to reduce the server load or scale to a different size or sku with more capacity.

Learn more about [Redis Cache Server - RedisCacheServerLoadHigh (Improve your Cache and application performance when running with high server load)](https://aka.ms/redis/recommendations/cpu).

### Cache instances perform best when the host machines where client application runs is able to keep up with responses from the cache.

Cache instances perform best when the host machines where client application runs is able to keep up with responses from the cache. If client host machine is running hot on memory, CPU or network bandwidth, the cache responses will not reach your application fast enough and could result in higher latency.

Learn more about [Redis Cache Server - UnresponsiveClient (Cache instances perform best when the host machines where client application runs is able to keep up with responses from the cache.)](/azure/azure-cache-for-redis/cache-troubleshoot-client).

## CDN

### Upgrade SDK version recommendation

The latest version of Azure Front Door Standard and Premium Client Library or SDK contains fixes to issues reported by customers and proactively identified through our QA process. The latest version also carries reliability and performance optimization in addition to new features that can improve your overall experience using Azure Front Door Standard and Premium.

Learn more about [Front Door Profile - UpgradeCDNToLatestSDKLanguage (Upgrade SDK version recommendation)](https://aka.ms/afd/tiercomparison).

## Azure AI services

### 429 Throttling Detected on this resource

We observed that there have been 1,000 or more 429 throttling errors on this resource in a one day timeframe.  Consider enabling autoscale to better handle higher call volumes and reduce the number of 429 errors.

Learn more about [Azure AI services autoscale](/azure/ai-services/autoscale?tabs=portal).

### Upgrade to the latest Azure AI Language SDK version

Upgrade to the latest SDK version to get the best results in terms of model quality, performance and service availability. Also there are new features available as new endpoints starting from V3.0 such as personally identifiable information recognition, Entity recognition and entity linking available as separate endpoints. In terms of changes in preview endpoints we have Opinion Mining in SA endpoint, redacted text property in personally identifiable information endpoint.

Learn more about [Azure AI Language](/azure/ai-services/language-service/language-detection/overview).

## Communication services

### Use recommended version of Chat SDK

Azure Communication Services Chat SDK can be used to add rich, real-time chat to your applications. Update to the recommended version of Chat SDK to ensure the latest fixes and features.

Learn more about [Communication service - UpgradeChatSdk (Use recommended version of Chat SDK)](../communication-services/concepts/chat/sdk-features.md).

### Use recommended version of Resource Manager SDK

Resource Manager SDK can be used to provision and manage Azure Communication Services resources. Update to the recommended version of Resource Manager SDK to ensure the latest fixes and features.

Learn more about [Communication service - UpgradeResourceManagerSdk (Use recommended version of Resource Manager SDK)](../communication-services/quickstarts/create-communication-resource.md?pivots=platform-net&tabs=windows).

### Use recommended version of Identity SDK

Azure Communication Services Identity SDK can be used to manage identities, users, and access tokens. Update to the recommended version of Identity SDK to ensure the latest fixes and features.

Learn more about [Communication service - UpgradeIdentitySdk (Use recommended version of Identity SDK)](../communication-services/concepts/sdk-options.md).

### Use recommended version of SMS SDK

Azure Communication Services SMS SDK can be used to send and receive SMS messages. Update to the recommended version of SMS SDK to ensure the latest fixes and features.

Learn more about [Communication service - UpgradeSmsSdk (Use recommended version of SMS SDK)](/azure/communication-services/concepts/telephony-sms/sdk-features).

### Use recommended version of Phone Numbers SDK

Azure Communication Services Phone Numbers SDK can be used to acquire and manage phone numbers. Update to the recommended version of Phone Numbers SDK to ensure the latest fixes and features.

Learn more about [Communication service - UpgradePhoneNumbersSdk (Use recommended version of Phone Numbers SDK)](../communication-services/concepts/sdk-options.md).

### Use recommended version of Calling SDK

Azure Communication Services Calling SDK can be used to enable voice, video, screen-sharing, and other real-time communication. Update to the recommended version of Calling SDK to ensure the latest fixes and features.

Learn more about [Communication service - UpgradeCallingSdk (Use recommended version of Calling SDK)](../communication-services/concepts/voice-video-calling/calling-sdk-features.md).

### Use recommended version of Call Automation SDK

Azure Communication Services Call Automation SDK can be used to make and manage calls, play audio, and configure recording. Update to the recommended version of Call Automation SDK to ensure the latest fixes and features.

Learn more about [Communication service - UpgradeServerCallingSdk (Use recommended version of Call Automation SDK)](../communication-services/concepts/voice-video-calling/call-automation-apis.md).

### Use recommended version of Network Traversal SDK

Azure Communication Services Network Traversal SDK can be used to access TURN servers for low-level data transport. Update to the recommended version of Network Traversal SDK to ensure the latest fixes and features.

Learn more about [Communication service - UpgradeTurnSdk (Use recommended version of Network Traversal SDK)](../communication-services/concepts/sdk-options.md).

## Compute

### Update Automanage to the latest API Version

We have identified sdk calls from outdated API for resources under this subscription. We recommend switching to the latest sdk versions. This ensures you receive the latest features and performance improvements.

Learn more about [Virtual machine - UpdateToLatestApi (Update Automanage to the latest API Version)](/azure/automanage/reference-sdk).

### Improve user experience and connectivity by deploying VMs closer to user’s location.

We have determined that your VMs are located in a region different or far from where your users are connecting from, using Azure Virtual Desktop. This may lead to prolonged connection response times and will impact overall user experience on Azure Virtual Desktop.

Learn more about [Virtual machine - RegionProximitySessionHosts (Improve user experience and connectivity by deploying VMs closer to user’s location.)](../virtual-desktop/connection-latency.md).

### Use Managed disks to prevent disk I/O throttling

Your virtual machine disks belong to a storage account that has reached its scalability target, and is susceptible to I/O throttling. To protect your virtual machine from performance degradation and to simplify storage management, use Managed Disks.

Learn more about [Virtual machine - ManagedDisksStorageAccount (Use Managed disks to prevent disk I/O throttling)](https://aka.ms/aa_avset_manageddisk_learnmore).

### Convert Managed Disks from Standard HDD to Premium SSD for performance

We have noticed your Standard HDD disk is approaching performance targets. Azure premium SSDs deliver high-performance and low-latency disk support for virtual machines with IO-intensive workloads. Give your disk performance a boost by upgrading your Standard HDD disk to Premium SSD disk. Upgrading requires a VM reboot, which will take three to five minutes.

Learn more about [Disk - MDHDDtoPremiumForPerformance (Convert Managed Disks from Standard HDD to Premium SSD for performance)](/azure/virtual-machines/windows/disks-types#premium-ssd).

### Enable Accelerated Networking to improve network performance and latency

We have detected that Accelerated Networking is not enabled on VM resources in your existing deployment that may be capable of supporting this feature. If your VM OS image supports Accelerated Networking as detailed in the documentation, make sure to enable this free feature on these VMs to maximize the performance and latency of your networking workloads in cloud

Learn more about [Virtual machine - AccelNetConfiguration (Enable Accelerated Networking to improve network performance and latency)](../virtual-network/create-vm-accelerated-networking-cli.md#enable-accelerated-networking-on-existing-vms).

### Use SSD Disks for your production workloads

We noticed that you are using SSD disks while also using Standard HDD disks on the same VM. Standard HDD managed disks are generally recommended for dev-test and backup; we recommend you use Premium SSDs or Standard SSDs for production. Premium SSDs deliver high-performance and low-latency disk support for virtual machines with IO-intensive workloads. Standard SSDs provide consistent and lower latency. Upgrade your disk configuration today for improved latency, reliability, and availability. Upgrading requires a VM reboot, which will take three to five minutes.

Learn more about [Virtual machine - MixedDiskTypeToSSDPublic (Use SSD Disks for your production workloads)](/azure/virtual-machines/windows/disks-types#disk-comparison).

### Match production Virtual Machines with Production Disk for consistent performance and better latency

Production virtual machines need production disks if you want to get the best performance. We see that you are running a production level virtual machine, however, you are using a low performing disk with standard HDD. Upgrading your disks that are attached to your production disks, either Standard SSD or Premium SSD, will benefit you with a more consistent experience and improvements in latency.

Learn more about [Virtual machine - MatchProdVMProdDisks (Match production Virtual Machines with Production Disk for consistent performance and better latency)](/azure/virtual-machines/windows/disks-types#disk-comparison).

### Accelerated Networking may require stopping and starting the VM

We have detected that Accelerated Networking is not engaged on VM resources in your existing deployment even though the feature has been requested. In rare cases like this, it may be necessary to stop and start your VM, at your convenience, to re-engage AccelNet.

Learn more about [Virtual machine - AccelNetDisengaged (Accelerated Networking may require stopping and starting the VM)](../virtual-network/create-vm-accelerated-networking-cli.md#enable-accelerated-networking-on-existing-vms).

### Take advantage of Ultra Disk low latency for your log disks and improve your database workload performance.

Ultra disk is available in the same region as your database workload. Ultra disk offers high throughput, high IOPS, and consistent low latency disk storage for your database workloads: For Oracle DBs, you can now use either 4k or 512E sector sizes with Ultra disk depending on your Oracle DB version. For SQL server, leveraging Ultra disk for your log disk might offer more performance for your database. See instructions here for migrating your log disk to Ultra disk.

Learn more about [Virtual machine - AzureStorageVmUltraDisk (Take advantage of Ultra Disk low latency for your log disks and improve your database workload performance.)](../virtual-machines/disks-enable-ultra-ssd.md?tabs=azure-portal).

### Upgrade the size of your virtual machines close to resource exhaustion

We analyzed data for the past 7 days and identified virtual machines (VMs) with high utilization across different metrics (i.e., CPU, Memory, and VM IO). Those VMs may experience performance issues since they are nearing/at their SKU's limits. Consider upgrading their SKU to improve performance.

Learn more about [Virtual machine - Improve the performance of highly used VMs using Azure Advisor](https://aka.ms/aa_resizehighusagevmrec_learnmore)

## Kubernetes

### Unsupported Kubernetes version is detected

Unsupported Kubernetes version is detected. Ensure Kubernetes cluster runs with a supported version.

Learn more about [Kubernetes service - UnsupportedKubernetesVersionIsDetected (Unsupported Kubernetes version is detected)](https://aka.ms/aks-supported-versions).

## DataFactory

### Review your throttled Data Factory Triggers

A high volume of throttling has been detected in an event-based trigger that runs in your Data Factory resource. This is causing your pipeline runs to drop from the run queue. Review the trigger definition to resolve issues and increase performance.

Learn more about [Data factory trigger - ADFThrottledTriggers (Review your throttled Data Factory Triggers)](https://aka.ms/adf-create-event-trigger).

## MariaDB

### Scale the storage limit for MariaDB server

Our internal telemetry shows that the server may be constrained because it is approaching limits for the currently provisioned storage values. This may result in degraded performance or in the server being moved to read-only mode. To ensure continued performance, we recommend increasing the provisioned storage amount or turning ON the "Auto-Growth" feature for automatic storage increases

Learn more about [MariaDB server - OrcasMariaDbStorageLimit (Scale the storage limit for MariaDB server)](https://aka.ms/mariadbstoragelimits).

### Increase the MariaDB server vCores

Our internal telemetry shows that the CPU has been running under high utilization for an extended period of time over the last 7 days. High CPU utilization may lead to slow query performance. To improve performance, we recommend moving to a larger compute size.

Learn more about [MariaDB server - OrcasMariaDbCpuOverload (Increase the MariaDB server vCores)](https://aka.ms/mariadbpricing).

### Scale the MariaDB server to higher SKU

Our internal telemetry shows that the server may be unable to support the connection requests because of the maximum supported connections for the given SKU. This may result in a large number of failed connections requests which adversely affect the performance. To improve performance, we recommend moving to higher memory SKU by increasing vCore or switching to Memory-Optimized SKUs.

Learn more about [MariaDB server - OrcasMariaDbConcurrentConnection (Scale the MariaDB server to higher SKU)](https://aka.ms/mariadbconnectionlimits).

### Move your MariaDB server to Memory Optimized SKU

Our internal telemetry shows that there is high churn in the buffer pool for this server which can result in slower query performance and increased IOPS. To improve performance,  review your workload queries to identify opportunities to minimize memory consumed.  If no such opportunity found, then we recommend moving to higher SKU with more memory or increase storage size to get more IOPS.

Learn more about [MariaDB server - OrcasMariaDbMemoryCache (Move your MariaDB server to Memory Optimized SKU)](https://aka.ms/mariadbpricing).

### Increase the reliability of audit logs

Our internal telemetry shows that the server's audit logs may have been lost over the past day. This can occur when your server is experiencing a CPU heavy workload or a server generates a large number of audit logs over a short period of time. We recommend only logging the necessary events required for your audit purposes using the following server parameters: audit_log_events, audit_log_exclude_users, audit_log_include_users. If the CPU usage on your server is high due to your workload, we recommend increasing the server's vCores to improve performance.

Learn more about [MariaDB server - OrcasMariaDBAuditLog (Increase the reliability of audit logs)](https://aka.ms/mariadb-audit-logs).

## MySQL

### Scale the storage limit for MySQL server

Our internal telemetry shows that the server may be constrained because it is approaching limits for the currently provisioned storage values. This may result in degraded performance or in the server being moved to read-only mode. To ensure continued performance, we recommend increasing the provisioned storage amount or turning ON the "Auto-Growth" feature for automatic storage increases

Learn more about [MySQL server - OrcasMySQLStorageLimit (Scale the storage limit for MySQL server)](https://aka.ms/mysqlstoragelimits).

### Scale the MySQL server to higher SKU

Our internal telemetry shows that the server may be unable to support the connection requests because of the maximum supported connections for the given SKU. This may result in a large number of failed connections requests which adversely affect the performance. To improve performance, we recommend moving to a higher memory SKU by increasing vCore or switching to Memory-Optimized SKUs.

Learn more about [MySQL server - OrcasMySQLConcurrentConnection (Scale the MySQL server to higher SKU)](https://aka.ms/mysqlconnectionlimits).

### Increase the MySQL server vCores

Our internal telemetry shows that the CPU has been running under high utilization for an extended period of time over the last 7 days. High CPU utilization may lead to slow query performance. To improve performance, we recommend moving to a larger compute size.

Learn more about [MySQL server - OrcasMySQLCpuOverload (Increase the MySQL server vCores)](https://aka.ms/mysqlpricing).

### Move your MySQL server to Memory Optimized SKU

Our internal telemetry shows that there is high churn in the buffer pool for this server which can result in slower query performance and increased IOPS. To improve performance, review your workload queries to identify opportunities to minimize memory consumed.  If no such opportunity found, then we recommend moving to higher SKU with more memory or increase storage size to get more IOPS.

Learn more about [MySQL server - OrcasMySQLMemoryCache (Move your MySQL server to Memory Optimized SKU)](https://aka.ms/mysqlpricing).

### Add a MySQL Read Replica server

Our internal telemetry shows that you may have a read intensive workload running, which results in resource contention for this server. This may lead to slow query performance for the server. To improve performance, we recommend you add a read replica, and offload some of your read workloads to the replica.

Learn more about [MySQL server - OrcasMySQLReadReplica (Add a MySQL Read Replica server)](https://aka.ms/mysqlreadreplica).

### Improve MySQL connection management

Our internal telemetry indicates that your application connecting to MySQL server may not be managing connections efficiently. This may result in unnecessary resource consumption and overall higher application latency. To improve connection management, we recommend that you reduce the number of short-lived connections and eliminate unnecessary idle connections. This can be done by configuring a server side connection-pooler, such as ProxySQL.

Learn more about [MySQL server - OrcasMySQLConnectionPooling (Improve MySQL connection management)](https://aka.ms/azure_mysql_connection_pooling).

### Increase the reliability of audit logs

Our internal telemetry shows that the server's audit logs may have been lost over the past day. This can occur when your server is experiencing a CPU heavy workload or a server generates a large number of audit logs over a short period of time. We recommend only logging the necessary events required for your audit purposes using the following server parameters: audit_log_events, audit_log_exclude_users, audit_log_include_users. If the CPU usage on your server is high due to your workload, we recommend increasing the server's vCores to improve performance.

Learn more about [MySQL server - OrcasMySQLAuditLog (Increase the reliability of audit logs)](https://aka.ms/mysql-audit-logs).

### Improve performance by optimizing MySQL temporary-table sizing

Our internal telemetry indicates that your MySQL server may be incurring unnecessary I/O overhead due to low temporary-table parameter settings. This may result in unnecessary disk-based transactions and reduced performance. We recommend that you increase the 'tmp_table_size' and 'max_heap_table_size' parameter values to reduce the number of disk-based transactions.

Learn more about [MySQL server - OrcasMySqlTmpTables (Improve performance by optimizing MySQL temporary-table sizing)](https://aka.ms/azure_mysql_tmp_table).

### Improve MySQL connection latency

Our internal telemetry indicates that your application connecting to MySQL server may not be managing connections efficiently. This may result in higher application latency. To improve connection latency, we recommend that you enable connection redirection. This can be done by enabling the connection redirection feature of the PHP driver.

Learn more about [MySQL server - OrcasMySQLConnectionRedirection (Improve MySQL connection latency)](https://aka.ms/azure_mysql_connection_redirection).

### Increase the storage limit for MySQL Flexible Server

Our internal telemetry shows that the server may be constrained because it is approaching limits for the currently provisioned storage values. This may result in degraded performance or in the server being moved to read-only mode. To ensure continued performance, we recommend increasing the provisioned storage amount.

Learn more about [Azure Database for MySQL flexible server - OrcasMeruMySqlStorageUpsell (Increase the storage limit for MySQL Flexible Server)](https://aka.ms/azure_mysql_flexible_server_storage).

### Scale the MySQL Flexible Server to a higher SKU

Our telemetry indicates that your Flexible Server is exceeding the connection limits associated with your current SKU. A large number of failed connection requests may adversely affect server performance. To improve performance, we recommend increasing the number of vCores or switching to a higher SKU.

Learn more about [Azure Database for MySQL flexible server - OrcasMeruMysqlConnectionUpsell (Scale the MySQL Flexible Server to a higher SKU)](https://aka.ms/azure_mysql_flexible_server_storage).

### Increase the MySQL Flexible Server vCores.

Our internal telemetry shows that the CPU has been running under high utilization for an extended period of time over the last 7 days. High CPU utilization may lead to slow query performance. To improve performance, we recommend moving to a larger compute size.

Learn more about [Azure Database for MySQL flexible server - OrcasMeruMysqlCpuUpcell (Increase the MySQL Flexible Server vCores.)](https://aka.ms/azure_mysql_flexible_server_pricing).

### Improve performance by optimizing MySQL temporary-table sizing.

Our internal telemetry indicates that your MySQL server may be incurring unnecessary I/O overhead due to low temporary-table parameter settings. This may result in unnecessary disk-based transactions and reduced performance. We recommend that you increase the 'tmp_table_size' and 'max_heap_table_size' parameter values to reduce the number of disk-based transactions.

Learn more about [Azure Database for MySQL flexible server - OrcasMeruMysqlTmpTable (Improve performance by optimizing MySQL temporary-table sizing.)](https://dev.mysql.com/doc/refman/8.0/en/internal-temporary-tables.html#internal-temporary-tables-engines).

### Move your MySQL server to Memory Optimized SKU

Our internal telemetry shows that there is high memory usage for this server which can result in slower query performance and increased IOPS. To improve performance, please review your workload queries to identify opportunities to minimize memory consumed.  If no such opportunity found, then we recommend moving to higher SKU with more memory or increase storage size to get more IOPS.

Learn more about [Azure Database for MySQL flexible server - OrcasMeruMysqlMemoryUpsell (Move your MySQL server to Memory Optimized SKU)](https://aka.ms/azure_mysql_flexible_server_storage).

### Add a MySQL Read Replica server

Our internal telemetry shows that you may have a read intensive workload running, which results in resource contention for this server. This may lead to slow query performance for the server. To improve performance, we recommend you add a read replica, and offload some of your read workloads to the replica.

Learn more about [Azure Database for MySQL flexible server - OrcasMeruMysqlReadReplicaUpsell (Add a MySQL Read Replica server)](https://aka.ms/flexible-server-mysql-read-replicas).

## PostgreSQL

### Increase the work_mem to avoid excessive disk spilling from sort and hash

Our internal telemetry shows that the configuration work_mem is too small for your PostgreSQL server which is resulting in disk spilling and degraded query performance. To improve this, we recommend increasing the work_mem limit for the server which will help to reduce the scenarios when the sort or hash happens on disk, thereby improving the overall query performance.

Learn more about [PostgreSQL server - OrcasPostgreSqlWorkMem (Increase the work_mem to avoid excessive disk spilling from sort and hash)](https://aka.ms/runtimeconfiguration).

### Scale the storage limit for PostgreSQL server

Our internal telemetry shows that the server may be constrained because it is approaching limits for the currently provisioned storage values. This may result in degraded performance or in the server being moved to read-only mode. To ensure continued performance, we recommend increasing the provisioned storage amount or turning ON the "Auto-Growth" feature for automatic storage increases

Learn more about [PostgreSQL server - OrcasPostgreSqlStorageLimit (Scale the storage limit for PostgreSQL server)](https://aka.ms/postgresqlstoragelimits).

### Distribute data in server group to distribute workload among nodes

It looks like the data has not been distributed in this server group but stays on the coordinator. For full Hyperscale (Citus) benefits distribute data on worker nodes in this server group.

Learn more about [Hyperscale (Citus) server group - OrcasPostgreSqlCitusDistributeData (Distribute data in server group to distribute workload among nodes)](https://go.microsoft.com/fwlink/?linkid=2135201).

### Rebalance data in Hyperscale (Citus) server group to distribute workload among worker nodes more evenly

It looks like the data is not well balanced between worker nodes in this Hyperscale (Citus) server group. In order to use each worker node of the Hyperscale (Citus) server group effectively rebalance data in this server group.

Learn more about [Hyperscale (Citus) server group - OrcasPostgreSqlCitusRebalanceData (Rebalance data in Hyperscale (Citus) server group to distribute workload among worker nodes more evenly)](https://go.microsoft.com/fwlink/?linkid=2148869).

### Scale the PostgreSQL server to higher SKU

Our internal telemetry shows that the server may be unable to support the connection requests because of the maximum supported connections for the given SKU. This may result in a large number of failed connections requests which adversely affect the performance. To improve performance, we recommend moving to higher memory SKU by increasing vCore or switching to Memory-Optimized SKUs.

Learn more about [PostgreSQL server - OrcasPostgreSqlConcurrentConnection (Scale the PostgreSQL server to higher SKU)](https://aka.ms/postgresqlconnectionlimits).

### Move your PostgreSQL server to Memory Optimized SKU

Our internal telemetry shows that there is high churn in the buffer pool for this server which can result in slower query performance and increased IOPS. To improve performance, review your workload queries to identify opportunities to minimize memory consumed.  If no such opportunity found, then we recommend moving to higher SKU with more memory or increase storage size to get more IOPS.

Learn more about [PostgreSQL server - OrcasPostgreSqlMemoryCache (Move your PostgreSQL server to Memory Optimized SKU)](https://aka.ms/postgresqlpricing).

### Add a PostgreSQL Read Replica server

Our internal telemetry shows that you may have a read intensive workload running, which results in resource contention for this server. This may lead to slow query performance for the server. To improve performance, we recommend you add a read replica, and offload some of your read workloads to the replica.

Learn more about [PostgreSQL server - OrcasPostgreSqlReadReplica (Add a PostgreSQL Read Replica server)](https://aka.ms/postgresqlreadreplica).

### Increase the PostgreSQL server vCores

Our internal telemetry shows that the CPU has been running under high utilization for an extended period of time over the last 7 days. High CPU utilization may lead to slow query performance. To improve performance, we recommend moving to a larger compute size.

Learn more about [PostgreSQL server - OrcasPostgreSqlCpuOverload (Increase the PostgreSQL server vCores)](https://aka.ms/postgresqlpricing).

### Improve PostgreSQL connection management

Our internal telemetry indicates that your PostgreSQL server may not be managing connections efficiently. This may result in unnecessary resource consumption and overall higher application latency. To improve connection management, we recommend that you reduce the number of short-lived connections and eliminate unnecessary idle connections. This can be done by configuring a server side connection-pooler, such as PgBouncer.

Learn more about [PostgreSQL server - OrcasPostgreSqlConnectionPooling (Improve PostgreSQL connection management)](https://aka.ms/azure_postgresql_connection_pooling).

### Improve PostgreSQL log performance

Our internal telemetry indicates that your PostgreSQL server has been configured to output VERBOSE error logs. This can be useful for troubleshooting your database, but it can also result in reduced database performance. To improve performance, we recommend that you change the log_error_verbosity parameter to the DEFAULT setting.

Learn more about [PostgreSQL server - OrcasPostgreSqlLogErrorVerbosity (Improve PostgreSQL log performance)](https://aka.ms/azure_postgresql_log_settings).

### Optimize query statistics collection on an Azure Database for PostgreSQL

Our internal telemetry indicates that your PostgreSQL server has been configured to track query statistics using the pg_stat_statements module. While useful for troubleshooting, it can also result in reduced server performance. To improve performance, we recommend that you change the pg_stat_statements.track parameter to NONE.

Learn more about [PostgreSQL server - OrcasPostgreSqlStatStatementsTrack (Optimize query statistics collection on an Azure Database for PostgreSQL)](https://aka.ms/azure_postgresql_optimize_query_stats).

### Optimize query store on an Azure Database for PostgreSQL when not troubleshooting

Our internal telemetry indicates that your PostgreSQL database has been configured to track query performance using the pg_qs.query_capture_mode parameter. While troubleshooting, we suggest setting the pg_qs.query_capture_mode parameter to TOP or ALL. When not troubleshooting, we recommend that you set the pg_qs.query_capture_mode parameter to NONE.

Learn more about [PostgreSQL server - OrcasPostgreSqlQueryCaptureMode (Optimize query store on an Azure Database for PostgreSQL when not troubleshooting)](https://aka.ms/azure_postgresql_query_store).

### Increase the storage limit for PostgreSQL Flexible Server

Our internal telemetry shows that the server may be constrained because it is approaching limits for the currently provisioned storage values. This may result in degraded performance or in the server being moved to read-only mode. To ensure continued performance, we recommend increasing the provisioned storage amount.

Learn more about [PostgreSQL server - OrcasPostgreSqlFlexibleServerStorageLimit (Increase the storage limit for PostgreSQL Flexible Server)](https://aka.ms/azure_postgresql_flexible_server_limits).

### Optimize logging settings by setting LoggingCollector to -1

Optimize logging settings by setting LoggingCollector to -1

### Optimize logging settings by setting LogDuration to OFF

Optimize logging settings by setting LogDuration to OFF

### Optimize logging settings by setting LogStatement to NONE

Optimize logging settings by setting LogStatement to NONE

### Optimize logging settings by setting ReplaceParameter to OFF

Optimize logging settings by setting ReplaceParameter to OFF

### Optimize logging settings by setting LoggingCollector to OFF

Optimize logging settings by setting LoggingCollector to OFF

### Increase the storage limit for Hyperscale (Citus) server group

Our internal telemetry shows that one or more nodes in the server group may be constrained because they are approaching limits for the currently provisioned storage values. This may result in degraded performance or in the server being moved to read-only mode. To ensure continued performance, we recommend increasing the provisioned disk space.

Learn more about [PostgreSQL server - OrcasPostgreSqlCitusStorageLimitHyperscaleCitus (Increase the storage limit for Hyperscale (Citus) server group)](/azure/postgresql/howto-hyperscale-scale-grow#increase-storage-on-nodes).

### Optimize log_statement settings for PostgreSQL on Azure Database

Our internal telemetry indicates that you have log_statement enabled, for better performance, set it to NONE

Learn more about [Azure Database for PostgreSQL flexible server - OrcasMeruMeruLogStatement (Optimize log_statement settings for PostgreSQL on Azure Database)](../postgresql/flexible-server/concepts-logging.md).

### Increase the work_mem to avoid excessive disk spilling from sort and hash

Our internal telemetry shows that the configuration work_mem is too small for your PostgreSQL server which is resulting in disk spilling and degraded query performance. To improve this, we recommend increasing the work_mem limit for the server which will help to reduce the scenarios when the sort or hash happens on disk, thereby improving the overall query performance.

Learn more about [Azure Database for PostgreSQL flexible server - OrcasMeruMeruWorkMem (Increase the work_mem to avoid excessive disk spilling from sort and hash)](https://aka.ms/runtimeconfiguration).

### Improve PostgreSQL - Flexible Server performance by enabling Intelligent tuning

Our internal telemetry suggests that you can improve storage performance by enabling Intelligent tuning

Learn more about [Azure Database for PostgreSQL flexible server - OrcasMeruIntelligentTuning (Improve PostgreSQL - Flexible Server performance by enabling Intelligent tuning)](../postgresql/flexible-server/concepts-intelligent-tuning.md).

### Optimize log_duration settings for PostgreSQL on Azure Database

Our internal telemetry indicates that you have log_duration enabled, for better performance, set it to OFF

Learn more about [Azure Database for PostgreSQL flexible server - OrcasMeruMeruLogDuration (Optimize log_duration settings for PostgreSQL on Azure Database)](../postgresql/flexible-server/concepts-logging.md).

### Optimize log_min_duration settings for PostgreSQL on Azure Database

Our internal telemetry indicates that you have log_min_duration enabled, for better performance, set it to -1

Learn more about [Azure Database for PostgreSQL flexible server - OrcasMeruMeruLogMinDuration (Optimize log_min_duration settings for PostgreSQL on Azure Database)](../postgresql/flexible-server/concepts-logging.md).

### Optimize pg_qs.query_capture_mode settings for PostgreSQL on Azure Database

Our internal telemetry indicates that you have pg_qs.query_capture_mode enabled, for better performance, set it to NONE

Learn more about [Azure Database for PostgreSQL flexible server - OrcasMeruMeruQueryCaptureMode (Optimize pg_qs.query_capture_mode settings for PostgreSQL on Azure Database)](../postgresql/flexible-server/concepts-query-store-best-practices.md).

### Optimize PostgreSQL performance by enabling PGBouncer

Our Internal telemetry indicates that you can improve PostgreSQL performance by enabling PGBouncer

Learn more about [Azure Database for PostgreSQL flexible server - OrcasMeruOrcasPostgreSQLConnectionPooling (Optimize PostgreSQL performance by enabling PGBouncer)](../postgresql/flexible-server/concepts-pgbouncer.md).

### Optimize log_error_verbosity settings for PostgreSQL on Azure Database

Our internal telemetry indicates that you have log_error_verbosity enabled, for better performance, set it to DEFAULT

Learn more about [Azure Database for PostgreSQL flexible server - OrcasMeruMeruLogErrorVerbosity (Optimize log_error_verbosity settings for PostgreSQL on Azure Database)](../postgresql/flexible-server/concepts-logging.md).

### Increase the storage limit for Hyperscale (Citus) server group

Our internal telemetry shows that one or more nodes in the server group may be constrained because they are approaching limits for the currently provisioned storage values. This may result in degraded performance or in the server being moved to read-only mode. To ensure continued performance, we recommend increasing the provisioned disk space.

Learn more about [Hyperscale (Citus) server group - MarlinStorageLimitRecommendation (Increase the storage limit for Hyperscale (Citus) server group)](/azure/postgresql/howto-hyperscale-scale-grow#increase-storage-on-nodes).

### Migrate your database from SSPG to FSPG

Consider our new offering Azure Database for PostgreSQL Flexible Server that provides richer capabilities such as zone resilient HA, predictable performance, maximum control, custom maintenance window, cost optimization controls and simplified developer experience. Learn more.

Learn more about [Azure Database for PostgreSQL flexible server - OrcasPostgreSqlMeruMigration (Migrate your database from SSPG to FSPG)](../postgresql/how-to-upgrade-using-dump-and-restore.md).

### Move your PostgreSQL Flexible Server to Memory Optimized SKU

Our internal telemetry shows that there is high churn in the buffer pool for this server which can result in slower query performance and increased IOPS. To improve performance, please review your workload queries to identify opportunities to minimize memory consumed. If no such opportunity found, then we recommend moving to higher SKU with more memory or increase storage size to get more IOPS.

Learn more about [PostgreSQL server - OrcasMeruMemoryUpsell (Move your PostgreSQL Flexible Server to Memory Optimized SKU)](https://aka.ms/azure_postgresql_flexible_server_pricing).

## DesktopVirtualization

### Improve user experience and connectivity by deploying VMs closer to user’s location.

We have determined that your VMs are located in a region different or far from where your users are connecting from, using Azure Virtual Desktop. This may lead to prolonged connection response times and will impact overall user experience on Azure Virtual Desktop. When creating VMs for your host pools, you should attempt to use a region closer to the user. Having close proximity ensures continuing satisfaction with the Azure Virtual Desktop service and a better overall quality of experience.

Learn more about [Host Pool - RegionProximityHostPools (Improve user experience and connectivity by deploying VMs closer to user’s location.)](../virtual-desktop/connection-latency.md).

### Change the max session limit for your depth first load balanced host pool to improve VM performance

Depth first load balancing uses the max session limit to determine the maximum number of users that can have concurrent sessions on a single session host. If the max session limit is too high, all user sessions will be directed to the same session host and this may cause performance and reliability issues. Therefore, when setting a host pool to have depth first load balancing, you should also set an appropriate max session limit according to the configuration of your deployment and capacity of your VMs. To fix this, open your host pool's properties and change the value next to the "Max session limit" setting.

Learn more about [Host Pool - ChangeMaxSessionLimitForDepthFirstHostPool (Change the max session limit for your depth first load balanced host pool to improve VM performance )](../virtual-desktop/configure-host-pool-load-balancing.md).

## Azure Cosmos DB

### Configure your Azure Cosmos DB query page size (MaxItemCount) to -1

You are using the query page size of 100 for queries for your Azure Cosmos DB container. We recommend using a page size of -1 for faster scans.

Learn more about [Azure Cosmos DB account - CosmosDBQueryPageSize (Configure your Azure Cosmos DB query page size (MaxItemCount) to -1)](/azure/cosmos-db/sql-api-query-metrics#max-item-count).

### Add composite indexes to your Azure Cosmos DB container

Your Azure Cosmos DB containers are running ORDER BY queries incurring high Request Unit (RU) charges. It is recommended to add composite indexes to your containers' indexing policy to improve the RU consumption and decrease the latency of these queries.

Learn more about [Azure Cosmos DB account - CosmosDBOrderByHighRUCharge (Add composite indexes to your Azure Cosmos DB container)](../cosmos-db/index-policy.md#composite-indexes).

### Optimize your Azure Cosmos DB indexing policy to only index what's needed

Your Azure Cosmos DB containers are using the default indexing policy, which indexes every property in your documents. Because you're storing large documents, a high number of properties get indexed, resulting in high Request Unit consumption and poor write latency. To optimize write performance, we recommend overriding the default indexing policy to only index the properties used in your queries.

Learn more about [Azure Cosmos DB account - CosmosDBDefaultIndexingWithManyPaths (Optimize your Azure Cosmos DB indexing policy to only index what's needed)](../cosmos-db/index-policy.md).

### Use hierarchical partition keys for optimal data distribution

This account has a custom setting that allows the logical partition size in a container to exceed the limit of 20 GB. This setting was applied by the Azure Cosmos DB team as a temporary measure to give you time to re-architect your application with a different partition key. It is not recommended as a long-term solution, as SLA guarantees are not honored when the limit is increased. You can now use hierarchical partition keys (preview) to re-architect your application. The feature allows you to exceed the 20 GB limit by setting up to three partition keys, ideal for multi-tenant scenarios or workloads that use synthetic keys.

Learn more about [Azure Cosmos DB account - CosmosDBHierarchicalPartitionKey (Use hierarchical partition keys for optimal data distribution)](https://devblogs.microsoft.com/cosmosdb/hierarchical-partition-keys-private-preview/).

### Configure your Azure Cosmos DB applications to use Direct connectivity in the SDK

We noticed that your Azure Cosmos DB applications are using Gateway mode via the Azure Cosmos DB .NET or Java SDKs. We recommend switching to Direct connectivity for lower latency and higher scalability.

Learn more about [Azure Cosmos DB account - CosmosDBGatewayMode (Configure your Azure Cosmos DB applications to use Direct connectivity in the SDK)](/azure/cosmos-db/performance-tips#networking).

### Enhance Performance by Scaling Up for Optimal Resource Utilization

Maximizing the efficiency of your system's resources is crucial for maintaining top-notch performance. Our system closely monitors CPU usage, and when it crosses the 90% threshold over a 12-hour period, a proactive alert is triggered. This alert not only informs Azure Cosmos DB for MongoDB vCore users of the elevated CPU consumption but also provides valuable guidance on scaling up to a higher tier. By upgrading to a more robust tier, you can unlock improved performance and ensure your system operates at its peak potential.

Learn more about [Scaling and configuring Your Azure Cosmos DB for MongoDB vCore cluster](../cosmos-db/mongodb/vcore/how-to-scale-cluster.md)

## HDInsight

### Unsupported Kubernetes version is detected

Unsupported Kubernetes version is detected. Ensure Kubernetes cluster runs with a supported version.

Learn more about [HDInsight Cluster Pool - UnsupportedHiloAKSVersionIsDetected (Unsupported Kubernetes version is detected)](https://aka.ms/aks-supported-versions).

### Reads happen on most recent data

More than 75% of your read requests are landing on the memstore. That indicates that the reads are primarily on recent data. This suggests that even if a flush happens on the memstore, the recent file needs to be accessed and that file needs to be in the cache.

Learn more about [HDInsight cluster - HBaseMemstoreReadPercentage (Reads happen on most recent data)](../hdinsight/hbase/apache-hbase-advisor.md).

### Consider using Accelerated Writes feature in your HBase cluster to improve cluster performance.

You are seeing this advisor recommendation because HDInsight team's system log shows that in the past 7 days, your cluster has encountered the following scenarios:
	1. High WAL sync time latency
	2. High write request count (at least 3 one hour windows of over 1000 avg_write_requests/second/node)

These conditions are indicators that your cluster is suffering from high write latencies. This could be due to heavy workload performed on your cluster.
To improve the performance of your cluster, you may want to consider utilizing the Accelerated Writes feature provided by Azure HDInsight HBase.  The Accelerated Writes feature for HDInsight Apache HBase clusters attaches premium SSD-managed disks to every RegionServer (worker node) instead of using cloud storage. As a result, provides low write-latency and better resiliency for your applications.
To read more on this feature, please visit link:

Learn more about [HDInsight cluster - AccWriteCandidate (Consider using Accelerated Writes feature in your HBase cluster to improve cluster performance.)](../hdinsight/hbase/apache-hbase-accelerated-writes.md).

### More than 75% of your queries are full scan queries.

More than 75% of the scan queries on your cluster are doing a full region/table scan. Modify your scan queries to avoid full region or table scans.

Learn more about [HDInsight cluster - ScanQueryTuningcandidate (More than 75% of your queries are full scan queries.)](../hdinsight/hbase/apache-hbase-advisor.md).

### Check your region counts as you have blocking updates.

Region counts needs to be adjusted to avoid updates getting blocked. It might require a scale up of the cluster by adding new nodes.

Learn more about [HDInsight cluster - RegionCountCandidate (Check your region counts as you have blocking updates.)](../hdinsight/hbase/apache-hbase-advisor.md).

### Consider increasing the flusher threads

The flush queue size in your region servers is more than 100 or there are updates getting blocked frequently. Tuning of the flush handler is recommended.

Learn more about [HDInsight cluster - FlushQueueCandidate (Consider increasing the flusher threads)](../hdinsight/hbase/apache-hbase-advisor.md).

### Consider increasing your compaction threads for compactions to complete faster

The compaction queue in your region servers is more than 2000 suggesting that more data requires compaction. Slower compactions can impact read performance as the number of files to read are more. More files without compaction can also impact the heap usage related to how files interact with Azure file system.

Learn more about [HDInsight cluster - CompactionQueueCandidate (Consider increasing your compaction threads for compactions to complete faster)](/azure/hdinsight/hbase/apache-hbase-advisor).

## Automanage

### Update Automanage to the latest API Version

We have identified sdk calls from outdated API for resources under this subscription. We recommend switching to the latest sdk versions. This ensures you receive the latest features and performance improvements.

Learn more about [Machine - Azure Arc - UpdateToLatestApiHci (Update Automanage to the latest API Version)](/azure/automanage/reference-sdk).

## KeyVault

### Update Key Vault SDK Version

New Key Vault Client Libraries are split to keys, secrets, and certificates SDKs, which are integrated with recommended Azure Identity library to provide seamless authentication to Key Vault across all languages and environments. It also contains several performance fixes to issues reported by customers and proactively identified through our QA process.<br><br>**PLEASE DISMISS:**<br>If Key Vault is integrated with Azure Storage, Disk or other Azure services which can use old Key Vault SDK and when all your current custom applications are using .NET SDK 4.0 or above.

Learn more about [Key vault - UpgradeKeyVaultSDK (Update Key Vault SDK Version)](../key-vault/general/client-libraries.md).

### Update Key Vault SDK Version

New Key Vault Client Libraries are split to keys, secrets, and certificates SDKs, which are integrated with recommended Azure Identity library to provide seamless authentication to Key Vault across all languages and environments. It also contains several performance fixes to issues reported by customers and proactively identified through our QA process.

> [!IMPORTANT]
> Please be aware that you can only remediate recommendation for custom applications you have access to. Recommendations can be shown due to integration with other Azure services like Storage, Disk encryption, which are in process to update to new version of our SDK. If you use .NET 4.0 in all your applications please dismiss.

Learn more about [Managed HSM Service - UpgradeKeyVaultMHSMSDK (Update Key Vault SDK Version)](../key-vault/general/client-libraries.md).

## Data Exporer

### Right-size Data Explorer resources for optimal performance.

This recommendation surfaces all Data Explorer resources which exceed the recommended data capacity (80%). The recommended action to improve the performance is to scale to the recommended configuration shown.

Learn more about [Data explorer resource - Right-size ADX resource (Right-size Data Explorer resources for optimal performance.)](https://aka.ms/adxskuperformance).

### Review table cache policies for Data Explorer tables

This recommendation surfaces Data Explorer tables with a high number of queries that look back beyond the configured cache period (policy). (You'll see the top 10 tables by query percentage that access out-of-cache data). The recommended action to improve the performance: Limit queries on this table to the minimal necessary time range (within the defined policy). Alternatively, if data from the entire time range is required, increase the cache period to the recommended value.

Learn more about [Data explorer resource - UpdateCachePoliciesForAdxTables (Review table cache policies for Data Explorer tables)](https://aka.ms/adxcachepolicy).

### Reduce Data Explorer table cache policy for better performance

Reducing the table cache policy will free up unused data from the resource's cache and improve performance.

Learn more about [Data explorer resource - ReduceCacheForAzureDataExplorerTablesToImprovePerformance (Reduce Data Explorer table cache policy for better performance)](https://aka.ms/adxcachepolicy).

## Networking

### Configure DNS Time to Live to 60 seconds

Time to Live (TTL) affects how recent of a response a client will get when it makes a request to Azure Traffic Manager. Reducing the TTL value means that the client will be routed to a functioning endpoint faster in the case of a failover. Configure your TTL to 60 seconds to route traffic to a health endpoint as quickly as possible.

Learn more about [Traffic Manager profile - ProfileTTL (Configure DNS Time to Live to 60 seconds)](https://aka.ms/Um3xr5).

### Configure DNS Time to Live to 20 seconds

Time to Live (TTL) affects how recent of a response a client will get when it makes a request to Azure Traffic Manager. Reducing the TTL value means that the client will be routed to a functioning endpoint faster in the case of a failover. Configure your TTL to 20 seconds to route traffic to a health endpoint as quickly as possible.

Learn more about [Traffic Manager profile - FastFailOverTTL (Configure DNS Time to Live to 20 seconds)](https://aka.ms/Ngfw4r).

### Configure DNS Time to Live to 60 seconds

Time to Live (TTL) affects how recent of a response a client will get when it makes a request to Azure Traffic Manager. Reducing the TTL value means that the client will be routed to a functioning endpoint faster in the case of a failover. Configure your TTL to 60 seconds to route traffic to a health endpoint as quickly as possible.

Learn more about [Traffic Manager profile - ProfileTTL (Configure DNS Time to Live to 60 seconds)](https://aka.ms/Um3xr5).

### Upgrade your ExpressRoute circuit bandwidth to accommodate your bandwidth needs

You have been using over 90% of your procured circuit bandwidth recently. If you exceed your allocated bandwidth, you will experience an increase in dropped packets sent over ExpressRoute. Upgrade your circuit bandwidth to maintain performance if your bandwidth needs remain this high.

Learn more about [ExpressRoute circuit - UpgradeERCircuitBandwidth (Upgrade your ExpressRoute circuit bandwidth to accommodate your bandwidth needs)](../expressroute/about-upgrade-circuit-bandwidth.md).

### Consider increasing the size of your VNet Gateway SKU to address consistently high CPU use

Under high traffic load, the VPN gateway may drop packets due to high CPU.

Learn more about [Virtual network gateway - HighCPUVNetGateway (Consider increasing the size of your VNet Gateway SKU to address consistently high CPU use)](https://aka.ms/HighCPUP2SVNetGateway).

### Consider increasing the size of your VNet Gateway SKU to address high P2S use

Each gateway SKU can only support a specified count of concurrent P2S connections. Your connection count is close to your gateway limit, so additional connection attempts may fail.

Learn more about [Virtual network gateway - HighP2SConnectionsVNetGateway (Consider increasing the size of your VNet Gateway SKU to address high P2S use)](https://aka.ms/HighP2SConnectionsVNetGateway).

### Make sure you have enough instances in your Application Gateway to support your traffic

Your Application Gateway has been running on high utilization recently and under heavy load, you may experience traffic loss or increase in latency. It is important that you scale your Application Gateway according to your traffic and with a bit of a buffer so that you are prepared for any traffic surges or spikes and minimizing the impact that it may have in your QoS. Application Gateway v1 SKU (Standard/WAF) supports manual scaling and v2 SKU (Standard_v2/WAF_v2) support manual and autoscaling. In case of manual scaling, increase your instance count and if autoscaling is enabled, make sure your maximum instance count is set to a higher value so Application Gateway can scale out as the traffic increases

Learn more about [Application gateway - HotAppGateway (Make sure you have enough instances in your Application Gateway to support your traffic)](https://aka.ms/hotappgw).

## SQL

### Create statistics on table columns

We have detected that you are missing table statistics which may be impacting query performance. The query optimizer uses statistics to estimate the cardinality or number of rows in the query result which enables the query optimizer to create a high quality query plan.

Learn more about [SQL data warehouse - CreateTableStatisticsSqlDW (Create statistics on table columns)](https://aka.ms/learnmorestatistics).

### Remove data skew to increase query performance

We have detected distribution data skew greater than 15%. This can cause costly performance bottlenecks.

Learn more about [SQL data warehouse - DataSkewSqlDW (Remove data skew to increase query performance)](https://aka.ms/learnmoredataskew).

### Update statistics on table columns

We have detected that you do not have up-to-date table statistics which may be impacting query performance. The query optimizer uses up-to-date statistics to estimate the cardinality or number of rows in the query result which enables the query optimizer to create a high quality query plan.

Learn more about [SQL data warehouse - UpdateTableStatisticsSqlDW (Update statistics on table columns)](https://aka.ms/learnmorestatistics).

### Scale up to optimize cache utilization with SQL Data Warehouse

We have detected that you had high cache used percentage with a low hit percentage. This indicates high cache eviction which can impact the performance of your workload.

Learn more about [SQL data warehouse - SqlDwIncreaseCacheCapacity (Scale up to optimize cache utilization with SQL Data Warehouse)](https://aka.ms/learnmoreadaptivecache).

### Scale up or update resource class to reduce tempdb contention with SQL Data Warehouse

We have detected that you had high tempdb utilization which can impact the performance of your workload.

Learn more about [SQL data warehouse - SqlDwReduceTempdbContention (Scale up or update resource class to reduce tempdb contention with SQL Data Warehouse)](https://aka.ms/learnmoretempdb).

### Convert tables to replicated tables with SQL Data Warehouse

We have detected that you may benefit from using replicated tables. When using replicated tables, this will avoid costly data movement operations and significantly increase the performance of your workload.

Learn more about [SQL data warehouse - SqlDwReplicateTable (Convert tables to replicated tables with SQL Data Warehouse)](https://aka.ms/learnmorereplicatedtables).

### Split staged files in the storage account to increase load performance

We have detected that you can increase load throughput by splitting your compressed files that are staged in your storage account. A good rule of thumb is to split compressed files into 60 or more to maximize the parallelism of your load.

Learn more about [SQL data warehouse - FileSplittingGuidance (Split staged files in the storage account to increase load performance)](https://aka.ms/learnmorefilesplit).

### Increase batch size when loading to maximize load throughput, data compression, and query performance

We have detected that you can increase load performance and throughput by increasing the batch size when loading into your database. You should consider using the COPY statement. If you are unable to use the COPY statement, consider increasing the batch size when using loading utilities such as the SQLBulkCopy API or BCP - a good rule of thumb is a batch size between 100K to 1M rows.

Learn more about [SQL data warehouse - LoadBatchSizeGuidance (Increase batch size when loading to maximize load throughput, data compression, and query performance)](https://aka.ms/learnmoreincreasebatchsize).

### Co-locate the storage account within the same region to minimize latency when loading

We have detected that you are loading from a region that is different from your SQL pool. You should consider loading from a storage account that is within the same region as your SQL pool to minimize latency when loading data.

Learn more about [SQL data warehouse - ColocateStorageAccount (Co-locate the storage account within the same region to minimize latency when loading)](https://aka.ms/learnmorestoragecolocation).

## Storage

### Use "Put Blob" for blobs smaller than 256 MB

When writing a block blob that is 256 MB or less (64 MB for requests using REST versions before 2016-05-31), you can upload it in its entirety with a single write operation using "Put Blob". Based on your aggregated metrics, we believe your storage account's write operations can be optimized.

Learn more about [Storage Account - StorageCallPutBlob (Use \""Put Blob\"" for blobs smaller than 256 MB)](https://aka.ms/understandblockblobs).

### Upgrade your Storage Client Library to the latest version for better reliability and performance

The latest version of Storage Client Library/ SDK contains fixes to issues reported by customers and proactively identified through our QA process. The latest version also carries reliability and performance optimization in addition to new features that can improve your overall experience using Azure Storage.

Learn more about [Storage Account - UpdateStorageDataMovementSDK (Upgrade your Storage Client Library to the latest version for better reliability and performance)](https://aka.ms/AA5wtca).

### Upgrade to Standard SSD Disks for consistent and improved performance

Because you are running IaaS virtual machine workloads on Standard HDD managed disks, we wanted to let you know that a Standard SSD disk option is now available for all Azure VM types. Standard SSD disks are a cost-effective storage option optimized for enterprise workloads that need consistent performance. Upgrade your disk configuration today for improved latency, reliability, and availability. Upgrading requires a VM reboot, which will take three to five minutes.

Learn more about [Storage Account - StandardSSDForNonPremVM (Upgrade to Standard SSD Disks for consistent and improved performance)](/azure/virtual-machines/windows/disks-types#standard-ssd).

### Use premium performance block blob storage

One or more of your storage accounts has a high transaction rate per GB of block blob data stored. Use premium performance block blob storage instead of standard performance storage for your workloads that require fast storage response times and/or high transaction rates and potentially save on storage costs.

Learn more about [Storage Account - PremiumBlobStorageAccount (Use premium performance block blob storage)](https://aka.ms/usePremiumBlob).

### Convert Unmanaged Disks from Standard HDD to Premium SSD for performance

We have noticed your Unmanaged HDD Disk is approaching performance targets. Azure premium SSDs deliver high-performance and low-latency disk support for virtual machines with IO-intensive workloads. Give your disk performance a boost by upgrading your Standard HDD disk to Premium SSD disk. Upgrading requires a VM reboot, which will take three to five minutes.

Learn more about [Storage Account - UMDHDDtoPremiumForPerformance (Convert Unmanaged Disks from Standard HDD to Premium SSD for performance)](/azure/virtual-machines/windows/disks-types#premium-ssd).


## Subscription

### Experience more predictable, consistent latency with a private connection to Azure

Improve the performance, privacy, and reliability of your business-critical apps by extending your on-premises networks to Azure with Azure ExpressRoute. Establish private ExpressRoute connections directly from your WAN, through a cloud exchange facility, or through POP and IPVPN connections.

Learn more about [Subscription - AzureExpressRoute (Experience more predictable, consistent latency with a private connection to Azure)](/azure/expressroute/expressroute-howto-circuit-portal-resource-manager).

## Synapse

### Tables with Clustered Columnstore Indexes (CCI) with less than 60 million rows

Clustered columnstore tables are organized in data into segments. Having high segment quality is critical to achieving optimal query performance on a columnstore table. Segment quality can be measured by the number of rows in a compressed row group.

Learn more about [Synapse workspace - SynapseCCIGuidance (Tables with Clustered Columnstore Indexes (CCI) with less than 60 million rows)](https://aka.ms/AzureSynapseCCIGuidance).

### Update SynapseManagementClient SDK Version

New SynapseManagementClient is using .NET SDK 4.0 or above.

Learn more about [Synapse workspace - UpgradeSynapseManagementClientSDK (Update SynapseManagementClient SDK Version)](https://aka.ms/UpgradeSynapseManagementClientSDK).

## Web

### Move your App Service Plan to PremiumV2 for better performance

Your app served more than 1000 requests per day for the past 3 days. Your app may benefit from the higher performance infrastructure available with the Premium V2 App Service tier. The Premium V2 tier features Dv2-series VMs with faster processors, SSD storage, and doubled memory-to-core ratio when compared to the previous instances. Learn more about upgrading to Premium V2 from our documentation.

Learn more about [App service - AppServiceMoveToPremiumV2 (Move your App Service Plan to PremiumV2 for better performance)](https://aka.ms/ant-premiumv2).

### Check outbound connections from your App Service resource

Your app has opened too many TCP/IP socket connections. Exceeding ephemeral TCP/IP port connection limits can cause unexpected connectivity issues for your apps.

Learn more about [App service - AppServiceOutboundConnections (Check outbound connections from your App Service resource)](https://aka.ms/antbc-socket).

## SAP on Azure Workloads

### For improved file system performance in HANA DB with ANF, optimize tcp_wmem OS parameter

The parameter net.ipv4.tcp_wmem specifies minimum, default, and maximum send buffer sizes that are used for a TCP socket. Set the parameter as per SAP note: 302436 to certify HANA DB to run with ANF and improve file system performance. The maximum value should not exceed net.core.wmem_max parameter

Learn more about [Database Instance - WriteBuffersAllocated (For improved file system performance in HANA DB with ANF, optimize tcp_wmem OS parameter)](https://launchpad.support.sap.com/#/notes/3024346).

### For improved file system performance in HANA DB with ANF, optimize wmem_max OS parameter

In HANA DB with ANF storage type, the maximum write socket buffer, defined by the parameter, net.core.wmem_max must be set large enough to handle outgoing network packets. This configuration certifies HANA DB to run with ANF and improves file system performance. See SAP note: 3024346

Learn more about [Database Instance - MaxWriteBuffer (For improved file system performance in HANA DB with ANF, optimize wmem_max OS parameter)](https://launchpad.support.sap.com/#/notes/3024346).

### For improved file system performance in HANA DB with ANF, optimize tcp_rmem OS parameter

The parameter net.ipv4.tcp_rmem specifies minimum, default, and maximum receive buffer sizes used for a TCP socket. Set the parameter as per SAP note 3024346 to certify HANA DB to run with ANF and improve file system performance. The maximum value should not exceed net.core.rmem_max parameter

Learn more about [Database Instance - OptimizeReadTcp (For improved file system performance in HANA DB with ANF, optimize tcp_rmem OS parameter)](https://launchpad.support.sap.com/#/notes/3024346).

### For improved file system performance in HANA DB with ANF, optimize rmem_max OS parameter

In HANA DB with ANF storage type, the maximum read socket buffer, defined by the parameter, net.core.rmem_max must be set large enough to handle incoming network packets. This configuration certifies HANA DB to run with ANF and improves file system performance. See SAP note: 3024346.

Learn more about [Database Instance - MaxReadBuffer (For improved file system performance in HANA DB with ANF, optimize rmem_max OS parameter)](https://launchpad.support.sap.com/#/notes/3024346).

### For improved file system performance in HANA DB with ANF, set receiver backlog queue size to 300000

The parameter net.core.netdev_max_backlog specifies the size of the receiver backlog queue, used if a Network interface receives packets faster than the kernel can process. Set the parameter as per SAP note: 3024346. This configuration certifies HANA DB to run with ANF and improves file system performance.

Learn more about [Database Instance - BacklogQueueSize (For improved file system performance in HANA DB with ANF, set receiver backlog queue size to 300000)](https://launchpad.support.sap.com/#/notes/3024346).

### To improve file system performance in HANA DB with ANF, enable the TCP window scaling OS parameter

Enable the TCP window scaling parameter as per SAP note: 302436. This configuration certifies HANA DB to run with ANF and improves file system performance in HANA DB with ANF in SAP workloads

Learn more about [Database Instance - EnableTCPWindowScaling (To improve file system performance in HANA DB with ANF, enable the TCP window scaling OS parameter )](https://launchpad.support.sap.com/#/notes/3024346).

### For improved file system performance in HANA DB with ANF, disable IPv6 protocol in OS

Disable IPv6 as per recommendation for SAP on Azure for HANA DB with ANF to improve file system performance

Learn more about [Database Instance - DisableIPv6Protocol (For improved file system performance in HANA DB with ANF, disable IPv6 protocol in OS)](/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse#:~:text=Create%20configuration%20file%20/etc/sysctl.d/ms%2Daz.conf%20with%20Microsoft%20for%20Azure%20configuration%20settings).

### To improve file system performance in HANA DB with ANF, disable parameter for slow start after idle

The parameter net.ipv4.tcp_slow_start_after_idle disables the need to scale-up incrementally the TCP window size for TCP connections which were idle for some time. By setting this parameter to zero as per SAP note: 302436, the maximum speed is used from beginning for previously idle TCP connections

Learn more about [Database Instance - ParameterSlowStart (To improve file system performance in HANA DB with ANF, disable parameter for slow start after idle)](https://launchpad.support.sap.com/#/notes/3024346).

### For improved file system performance in HANA DB with ANF optimize tcp_max_syn_backlog OS parameter

To prevent the kernel from using SYN cookies in a situation where lots of connection requests are sent in a short timeframe and to prevent a warning about a potential SYN flooding attack in the system log, the size of the SYN backlog should be set to a reasonably high value. See SAP note 2382421

Learn more about [Database Instance - TCPMaxSynBacklog (For improved file system performance in HANA DB with ANF optimize tcp_max_syn_backlog OS parameter)](/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse#:~:text=Create%20configuration%20file%20/etc/sysctl.d/ms%2Daz.conf%20with%20Microsoft%20for%20Azure%20configuration%20settings).

### For improved file system performance in HANA DB with ANF, enable the tcp_sack OS parameter

Enable the tcp_sack parameter as per SAP note: 302436. This configuration certifies HANA DB to run with ANF and improves file system performance in HANA DB with ANF in SAP workloads

Learn more about [Database Instance - TCPSackParameter (For improved file system performance in HANA DB with ANF, enable the tcp_sack OS parameter)](https://launchpad.support.sap.com/#/notes/3024346).

### In high-availability scenario for HANA DB with ANF, disable the tcp_timestamps OS parameter

Disable the tcp_timestamps parameter as per SAP note: 302436. This configuration certifies HANA DB to run with ANF and improves file system performance in high-availability scenarios for HANA DB with ANF in SAP workloads

Learn more about [Database Instance - DisableTCPTimestamps (In high-availability scenario for HANA DB with ANF, disable the tcp_timestamps OS parameter)](https://launchpad.support.sap.com/#/notes/3024346).

### For improved file system performance in HANA DB with ANF, enable the tcp_timestamps OS parameter

Enable the tcp_timestamps parameter as per SAP note: 302436. This configuration certifies HANA DB to run with ANF and improves file system performance in HANA DB with ANF in SAP workloads

Learn more about [Database Instance - EnableTCPTimestamps (For improved file system performance in HANA DB with ANF, enable the tcp_timestamps OS parameter)](https://launchpad.support.sap.com/#/notes/3024346).

### To improve file system performance in HANA DB with ANF, enable auto-tuning TCP receive buffer size

The parameter net.ipv4.tcp_moderate_rcvbuf enables  TCP to perform receive buffer auto-tuning, to automatically size the buffer (no greater than tcp_rmem to match the size required by the path for full throughput. Enable this parameter as per SAP note: 302436 for improved file system performance

Learn more about [Database Instance - EnableAutoTuning (To improve file system performance in HANA DB with ANF, enable auto-tuning TCP receive buffer size)](https://launchpad.support.sap.com/#/notes/3024346).

### For improved file system performance  in HANA DB with ANF, optimize net.ipv4.ip_local_port_range

As HANA uses a considerable number of connections for the internal communication, it makes sense to have as many client ports available as possible for this purpose. Set the OS parameter, net.ipv4.ip_local_port_range parameter as per SAP note 2382421 to ensure optimal internal HANA communication.

Learn more about [Database Instance - IPV4LocalPortRange (For improved file system performance  in HANA DB with ANF, optimize net.ipv4.ip_local_port_range)](https://launchpad.support.sap.com/#/notes/2382421).

### To improve file system performance in HANA DB with ANF, optimize sunrpc.tcp_slot_table_entries

Set the parameter sunrpc.tcp_slot_table_entries to 128 as per recommendation  for improved file system performance in HANA DB with ANF in SAP workloads

Learn more about [Database Instance - TCPSlotTableEntries (To improve file system performance in HANA DB with ANF, optimize sunrpc.tcp_slot_table_entries)](/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse#:~:text=Create%20configuration%20file%20/etc/sysctl.d/ms%2Daz.conf%20with%20Microsoft%20for%20Azure%20configuration%20settings).

### All disks in LVM for /hana/data volume should be of the same type to ensure high performance in HANA DB

If multiple disk types are selected in the /hana/data volume, performance of HANA DB in SAP workloads might get restricted. Ensure all HANA Data volume disks are of the same type and are configured as per recommendation for SAP on Azure

Learn more about [Database Instance - HanaDataDiskTypeSame (All disks in LVM for /hana/data volume should be of the same type to ensure high performance in HANA DB)](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#:~:text=Configuration%20for%20SAP%20/hana/data%20volume).

### Stripe size for /hana/data should be 256 kb for improved performance of HANA DB in SAP workloads

If you are using LVM or mdadm to build stripe sets across several Azure premium disks, you need to define stripe sizes. Based on experience with recentLinux versions, Azure recommends using stripe size of 256 kb for /hana/data filesystem for better performance of HANA DB

Learn more about [Database Instance - HanaDataStripeSize (Stripe size for /hana/data should be 256 kb for improved performance of HANA DB in SAP workloads)](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#:~:text=As%20stripe%20sizes%20the%20recommendation%20is%20to%20use).

### To improve file system performance in HANA DB with ANF, optimize the parameter vm.swappiness

Set the OS parameter vm.swappiness to 10 as per recommendation for improved file system performance in HANA DB with ANF in SAP workloads

Learn more about [Database Instance - VmSwappiness (To improve file system performance in HANA DB with ANF, optimize the parameter vm.swappiness)](/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse#:~:text=Create%20configuration%20file%20/etc/sysctl.d/ms%2Daz.conf%20with%20Microsoft%20for%20Azure%20configuration%20settings).

### To improve file system performance in HANA DB with ANF, disable net.ipv4.conf.all.rp_filter

Disable the reverse path filter linux OS parameter, net.ipv4.conf.all.rp_filter as per recommendation for improved file system performance in HANA DB with ANF in SAP workloads

Learn more about [Database Instance - DisableIPV4Conf (To improve file system performance in HANA DB with ANF, disable net.ipv4.conf.all.rp_filter)](/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse#:~:text=Create%20configuration%20file%20/etc/sysctl.d/ms%2Daz.conf%20with%20Microsoft%20for%20Azure%20configuration%20settings).

### If using Ultradisk, the IOPS for /hana/data volume should be >=7000 for better HANA DB performance

IOPS of at least 7000 in /hana/data volume is recommended for SAP workloads when using Ultradisk. Select the disk type for /hana/data volume as per this requirement to ensure high performance of the DB

Learn more about [Database Instance - HanaDataIOPS (If using Ultradisk, the IOPS for /hana/data volume should be >=7000 for better HANA DB performance)](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#azure-ultra-disk-storage-configuration-for-sap-hana:~:text=1%20x%20P6-,Azure%20Ultra%20disk%20storage%20configuration%20for%20SAP%20HANA,-Another%20Azure%20storage).

### To improve file system performance in HANA DB with ANF, change parameter tcp_max_slot_table_entries

Set the OS parameter tcp_max_slot_table_entries to 128 as per SAP note: 302436 for improved file transfer performance in HANA DB with ANF in SAP workloads

Learn more about [Database Instance - OptimizeTCPMaxSlotTableEntries (To improve file system performance in HANA DB with ANF, change parameter tcp_max_slot_table_entries)](/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse#:~:text=Create%20configuration%20file%20/etc/sysctl.d/ms%2Daz.conf%20with%20Microsoft%20for%20Azure%20configuration%20settings).

### Ensure the read performance of /hana/data volume is >=400 MB/sec for better performance in HANA DB

Read activity of at least 400 MB/sec for /hana/data for 16 MB and 64 MB I/O sizes is recommended for SAP workloads on Azure. Select the disk type for /hana/data as per this requirement to ensure high performance of the DB and to meet minimum storage requirements for SAP HANA

Learn more about [Database Instance - HanaDataVolumePerformance (Ensure the read performance of /hana/data volume is >=400 MB/sec for better performance in HANA DB)](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#:~:text=Read%20activity%20of%20at%20least%20400%20MB/sec%20for%20/hana/data).

### Read/write performance of /hana/log volume should be >=250 MB/sec for better performance in HANA DB

Read/Write activity of at least 250 MB/sec for /hana/log for 1 MB I/O size is recommended for SAP workloads on Azure. Select the disk type for /hana/log volume as per this requirement to ensure high performance of the DB and to meet minimum storage requirements for SAP HANA

Learn more about [Database Instance - HanaLogReadWriteVolume (Read/write performance of /hana/log volume should be >=250 MB/sec for better performance in HANA DB)](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#:~:text=Read/write%20on%20/hana/log%20of%20250%20MB/sec%20with%201%20MB%20I/O%20sizes).

### If using Ultradisk, the IOPS for /hana/log volume should be >=2000 for better performance in HANA DB

IOPS of at least 2000 in /hana/log volume is recommended for SAP workloads when using Ultradisk. Select the disk type for /hana/log volume as per this requirement to ensure high performance of the DB

Learn more about [Database Instance - HanaLogIOPS (If using Ultradisk, the IOPS for /hana/log volume should be >=2000 for better performance in HANA DB)](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#azure-ultra-disk-storage-configuration-for-sap-hana:~:text=1%20x%20P6-,Azure%20Ultra%20disk%20storage%20configuration%20for%20SAP%20HANA,-Another%20Azure%20storage).

### All disks in LVM for /hana/log volume should be of the same type to ensure high performance in HANA DB

If multiple disk types are selected in the /hana/log volume, performance of HANA DB in SAP workloads might get restricted. Ensure all HANA Data volume disks are of the same type and are configured as per recommendation for SAP on Azure

Learn more about [Database Instance - HanaDiskLogVolumeSameType (All disks in LVM for /hana/log volume should be of the same type to ensure high performance in HANA DB)](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#:~:text=For%20the%20/hana/log%20volume.%20the%20configuration%20would%20look%20like).

### Enable Write Accelerator on /hana/log volume with Premium disk for improved write latency in HANA DB

Azure Write Accelerator is a functionality for Azure M-Series VMs. It improves I/O latency of writes against the Azure premium storage. For SAP HANA, Write Accelerator is to be used against the /hana/log volume only.

Learn more about [Database Instance - WriteAcceleratorEnabled (Enable Write Accelerator on /hana/log volume with Premium disk for improved write latency in HANA DB)](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#:~:text=different%20SAP%20applications.-,Solutions%20with%20premium%20storage%20and%20Azure%20Write%20Accelerator%20for%20Azure%20M%2DSeries%20virtual%20machines,-Azure%20Write%20Accelerator).

### Stripe size for /hana/log should be 64 kb for improved performance of HANA DB in SAP workloads

If you are using LVM or mdadm to build stripe sets across several Azure premium disks, you need to define stripe sizes. To get enough throughput with larger I/O sizes, Azure recommends using stripe size of 64 kb for /hana/log filesystem for better performance of HANA DB

Learn more about [Database Instance - HanaLogStripeSize (Stripe size for /hana/log should be 64 kb for improved performance of HANA DB in SAP workloads)](/azure/virtual-machines/workloads/sap/hana-vm-operations-storage#:~:text=As%20stripe%20sizes%20the%20recommendation%20is%20to%20use).

## Next steps

Learn more about [Performance Efficiency - Microsoft Azure Well Architected Framework](/azure/architecture/framework/scalability/overview)
