---
title: Reliability in Azure Databricks
description: Learn about resiliency features in Azure Databricks, including transient fault handling and availability zone support.
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-databricks
ms.date: 12/01/2025
---

# Reliability in Azure Databricks

[Azure Databricks](/azure/databricks/introduction/) is a collaborative Apache Spark-based data and AI platform optimized for Microsoft Azure. It provides a unified environment for big data and AI workloads and combines the best of Databricks and Azure to simplify data engineering, data science, and machine learning.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how Azure Databricks maintains resiliency against various potential outages and problems and how you can configure resiliency to meet your requirements. The guidance covers transient faults, availability zone outages, region outages, and service maintenance. This article also describes how to use backups to recover from other problems and highlights key information about the Azure Databricks service-level agreement (SLA).

## Production deployment recommendations

To learn how to deploy Azure Databricks to support your solution's reliability requirements and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Databricks](/azure/well-architected/service-guides/azure-databricks).

## Reliability architecture overview

You must understand the reliability of each primary component in Azure Databricks:

- **The control plane** is a collection of stateless services that manages workspace metadata, user access, job scheduling, and cluster management. These services are backed by databases that are replicated across availability zones in supported regions.

- **Databricks File System (DBFS) root** is a storage account that Azure Databricks automatically provisions when you create an Azure Databricks workspace in your cloud account. We recommend that you don't store data on DBFS root and disable this storage account if possible.

- **Unity Catalog storage** includes one or more storage accounts that store your Unity Catalog data in your cloud account. For more information, see [Unity Catalog overview](/azure/databricks/data-governance/unity-catalog/).

- **The compute plane** runs data processing workloads by using clusters of virtual machines (VMs). The compute plane handles transient faults and automatically replaces failed nodes without user intervention. You can choose from multiple types of compute resources. For more information, see [Compute](/azure/databricks/compute/).

  Workspace availability depends on the availability of the control plane, but compute clusters can continue to process jobs even during control plane interruptions.

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

You can [control retries for tasks within Lakeflow Jobs](/azure/databricks/jobs/control-flow) to help recover from transient errors.

For applications that run on Azure Databricks, implement retry logic with exponential backoff when you connect to external services or Azure services, like Storage, Azure SQL Database, or Azure Event Hubs. Databricks Runtime includes built-in resilience for many Azure services, but your application code should handle service-specific transient failures.

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Azure Databricks supports *zone redundancy* for each component:

- **Control plane:** In regions that support availability zones, the control plane runs in multiple availability zones. The control plane handles zone failures automatically, with minimal impact and no user intervention required.

    Control plane workspace data is stored in databases. In regions that support availability zones, the databases are replicated across multiple zones in the region. Storage accounts that serve Databricks Runtime images are also redundant inside the region. All regions have secondary storage accounts that are used when the primary storage account is down.

- **DBFS root:** In regions that support availability zones, you can configure the storage account for DBFS root to use zone-redundant storage (ZRS). In paired regions that support availability zones, you can optionally use geo-zone-redundant storage (GZRS).

- **Compute plane:** Databricks supports *automatic zone distribution* for compute resources, which means that your resources are distributed across multiple availability zones. This distribution helps your production workloads achieve resiliency to zone outages.

    When you use serverless compute, you don't explicitly select zones for your compute. Databricks manages zone selection of VMs and replacement of VMs that might be lost because of zone outages.

### Requirements

To use availability zone support in Azure Databricks, you need the following requirements:

- **Region support:** Azure Databricks availability zone support is available in all Azure regions that support Azure Databricks and provide availability zones. For a list of regions that support Azure Databricks, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region). For a complete list of regions that support availability zones, see [Azure regions that support availability zones](/azure/reliability/availability-zones-service-support).

- **Storage replication:** Configure workspace storage accounts to use ZRS or GZRS (where available).

- **Compute capacity:** Ensure that sufficient compute capacity exists across multiple zones in your target region. Azure Databricks automatically distributes cluster nodes across zones, but you should verify that your selected instance types are available in all target zones.

### Considerations

Azure Databricks automatically distributes cluster nodes across availability zones. The distribution depends on available capacity in each zone. During high-demand periods, a cluster's nodes might be concentrated in fewer zones. When you use serverless compute, Azure Databricks manages zone selection of VMs and replacement of VMs that might be lost because of zone outages.

### Cost

Zone distribution doesn't affect compute costs because you pay for the same number of VMs regardless of their availability zone placement. For more information, see [Azure Databricks compute pricing](https://azure.microsoft.com/pricing/details/databricks/).

The default redundancy for the managed storage account, or DBFS root, is geo-redundant storage (GRS). Changing to ZRS or GZRS might affect your storage costs. For more information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

### Configure availability zone support

- **Control plane:** The control plane automatically supports zone redundancy in regions that have availability zones. You don't need to configure anything.

- **DBFS root:** You can configure zone redundancy for DBFS root storage when you create a new workspace or modify an existing workspace:

    - **Create new workspace with zone-redundant DBFS Root storage:** When you create a new Azure Databricks workspace, you can optionally configure the associated storage account to use ZRS or GZRS instead of the default GRS. For more information, see [Change workspace storage redundancy options](/azure/databricks/admin/workspace/workspace-storage-redundancy).
    
    - **Enable zone redundancy on DBFS root storage:** For existing workspaces, you can change the redundancy configuration of the workspace storage account to ZRS or GZRS. For more information about how to enable zone redundancy, see [Change replication settings for a storage account](/azure/storage/common/redundancy-migration).
    
- **Compute plane:** Cluster nodes are automatically distributed across availability zones. No customer configuration is required for zone distribution.

### Behavior when all zones are healthy

This section describes what to expect when a workspace is configured with availability zone support and all availability zones are operational.

- **Data replication between zones:** Data replication for workspace storage occurs synchronously across zones when DBFS root uses a ZRS or GZRS account. This approach ensures strong consistency with minimal performance impact.

- **Traffic routing between zones:** Azure Databricks automatically distributes cluster nodes across zones during cluster creation. The service balances compute load across zones while it maintains data locality for optimal performance.

### Behavior during a zone failure

This section describes what to expect when a workspace is configured with availability zone support and there's an availability zone outage.

- **Detection and response:** Microsoft automatically detects zone failures and initiates response procedures. You don't need to take any action for zone-level failover.

- **Notification:** Microsoft doesn't automatically notify you when a zone is down. But you can use the [Azure Databricks status page](/azure/databricks/resources/status) to see an overview of all core Azure Databricks services. You can also subscribe to status updates on individual service components and receive an alert when the status of the service that you subscribe to changes.

- **Active requests:** Running clusters might lose nodes in the affected zone. The cluster manager automatically requests replacement nodes from remaining zones. If the driver node is lost, the cluster and job restart completely.

- **Expected data loss:**

    - **Control plane:** Expect no data loss during a zone outage.

    - **DBFS root:** Workspace data remains available if it uses ZRS or GZRS storage configurations.
    
    - **Compute plane:** Data cached on VMs is ephemeral. Any data lost from VMs during a zone failure is recovered from storage. If the driver node is lost, the job restarts and recomputes the results.

- **Expected downtime:**

    - **Control plane:** The Databricks control plane performs automatic failover to healthy zones within about 15 minutes.

    - **DBFS root:** Expect no downtime for storage accounts that use ZRS or GZRS.

    - **Compute plane:** If nodes are lost because their VMs reside in the affected availability zone, the Azure cluster manager requests replacement nodes from the Azure compute provider. If the remaining healthy zones have sufficient capacity to fulfill the request, the compute provider pulls nodes from the healthy zones to replace the lost nodes. This process can take several minutes.

        If the driver node is lost because of the zone failure, the entire cluster restarts, which might cause longer recovery times compared to losing worker nodes. Plan for this behavior in your job scheduling and monitoring strategies.

        You can use serverless or instance pools to reduce this time.

- **Traffic rerouting:**

    - **Control plane:** The Databricks control plane performs automatic failover to healthy zones within about 15 minutes.

    - **DBFS root:** Azure Storage automatically redirects requests to storage clusters in healthy zones. 

    - **Compute plane:** The cluster manager automatically switches to nodes in healthy zones.

### Zone recovery

When the failed availability zone recovers, Azure Databricks automatically resumes normal operations across all zones. The cluster manager might rebalance node distribution during subsequent node creations, but existing nodes continue to run in their current zones until they're terminated.

You don't need to take any action for failback operations. Normal zone distribution resumes for new cluster deployments.

### Test for zone failures

Azure Databricks is a managed service where Microsoft handles zone failover automatically and does regular zone-down tests. You don't need to test zone failure scenarios for the service itself.

For your applications that run on Azure Databricks, test job resilience by simulating driver node failures and monitoring cluster restart behavior. Validate that your data processing jobs can handle cluster restarts and resume from appropriate checkpoints.

## Resilience to region-wide failures

Azure Databricks is a single-region service. If the region is unavailable, your workspace is also unavailable. If you require multi-region deployments, see [Azure Databricks disaster recovery](/azure/databricks/admin/disaster-recovery).

### Custom multi-region solutions for resiliency

Azure Databricks doesn't provide built-in multi-region capabilities. For comprehensive multi-region protection of your analytics workloads, you must implement your own approach.

Typical multi-region solutions involve two or more workspaces. You can choose from several strategies, including active-passive and active-active architectures.

To choose an architecture, consider the following factors:

- The criticality of the workload to your business
- The potential duration of a disruption (hours or possibly a full day)
- The effort required to make the workspace fully operational
- The effort required to restore or fail back to the primary region

For workloads that require multi-region protection, see [Azure Databricks disaster recovery](/azure/databricks/admin/disaster-recovery).

## Backup and recovery

Azure Databricks automatically backs up databases as part of the service's managed operations. This process includes notebook content, job definitions, cluster configurations, and access control settings.

> [!NOTE]
> If a zone failure occurs, Azure Databricks expects no data loss.

We recommend you store your data on Unity Catalog storage. You can replicate data through storage replication or delta cloning.

Workspace-level backup and restore capabilities aren't directly available. Plan for workspace recreation procedures that include restoring configurations, users, and access controls from your synchronization processes.

## Resilience to service maintenance

Azure Databricks performs automatic platform maintenance to apply security updates, deploy new features, and improve service reliability. You can configure the maintenance windows for your cluster to reduce the likelihood of maintenance affecting your production workloads. For more information, see [Automatic cluster update](/azure/databricks/admin/clusters/automatic-cluster-update).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

## Related content

- [Azure Databricks disaster recovery](/azure/databricks/admin/disaster-recovery)
- [Reliability best practices for Azure Databricks](/azure/databricks/lakehouse-architecture/reliability/best-practices)
- [Azure reliability overview](/azure/reliability/overview)
