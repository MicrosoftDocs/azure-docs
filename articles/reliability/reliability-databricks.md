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

[Azure Databricks](/azure/databricks/introduction/) is a fast, easy, and collaborative Apache Spark-based data and AI platform optimized for Microsoft Azure. It provides a unified environment for big data and AI workloads, combining the best of Databricks and Azure to simplify data engineering, data science, and machine learning.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how Azure Databricks is resilient to a variety of potential outages and problems, and how you can configure resiliency to meet your requirements. It includes information about transient faults, availability zone outages, region outages, and service maintenance.  It also describes how you can use backups to recover from other types of problems, and highlights some key information about the Azure Databricks service level agreement (SLA).

## Production deployment recommendations

To learn about how to deploy Azure Databricks to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Databricks](/azure/well-architected/service-guides/azure-databricks).

## Reliability architecture overview

It's important that you understand the reliability of each primary component in Azure Databricks:

- **Control plane**: A collection of stateless services that manages workspace metadata, user access, job scheduling, and cluster management, backed by databases that are replicated across availability zones in supported regions.

- **DBFS Root:** A storage account that's automatically provisioned when you create an Azure Databricks workspace in your cloud account. We recommend you don't store data on DBFS, and disable it if possible.

- **Unity Catalog storage:** One or more storage accounts that store your Unity Catalog data in your cloud account. For more information, see [What is Unity Catalog?](/azure/databricks/data-governance/unity-catalog/).

- **Compute plane**: Runs data processing workloads using clusters of virtual machines (VMs). The compute plane is designed to handle transient faults and automatically replace failed nodes without user intervention. There are multiple types of compute resources available. For more information, see [Compute](/azure/databricks/compute/).

    Workspace availability depends on the availability of the control plane, but compute clusters can continue processing jobs even if the control plane experiences brief interruptions.

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

You can [control retries for tasks within Lakeflow Jobs](/azure/databricks/jobs/control-flow), which helps to recover from transient errors.

For applications running on Azure Databricks, implement retry logic with exponential backoff when connecting to external services, or Azure services like Azure Storage, Azure SQL Database, or Azure Event Hubs. The Databricks runtime includes built-in resilience for many Azure services, but your application code should handle service-specific transient failures.

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Azure Databricks supports *zone redundancy* for each component:

- *Control plane:* In regions that support availability zones, the control plane runs in multiple availability zones. The control plane is designed to handle zone failures automatically, with minimal impact and no user intervention required.

    Control plane workspace data are stored in databases. In regions that support availability zones, the databases are replicated across multiple zones in the region. Storage accounts used to serve Databricks Runtime images are also redundant inside the region, and all regions have secondary storage accounts that are used when the primary is down.

- *DBFS Root:* In regions that support availability zones, you can configure the storage account for DBFS Root to use zone-redundant storage (ZRS). In regions that support availability zones and are paired, you can optionally use geo-zone-redundant storage (GZRS).

- *Compute plane:* Databricks supports *automatic zone distribution* for compute resources, which means that your resources are distributed across multiple availability zones. Distribution across multiple zones helps your production workloads achieve resiliency to zone outages.

    When using serverless compute, you don't explicitly select zones for your compute. Databricks manages zone selection of VMs, as well as replacement of VMs that may be lost due to zone outages.

### Requirements

To use availability zone support in Azure Databricks:

- **Region support:** Azure Databricks availability zone support is available in all Azure regions that support Azure Databricks and that also provide availability zones. For a list of regions that support Azure Databricks, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region). For a complete list of regions with availability zone support, see [Azure regions with availability zones](/azure/reliability/availability-zones-service-support).

- **Storage replication:** Configure workspace storage accounts with zone-redundant storage (ZRS) or geo-zone-redundant storage (GZRS).

- **Compute capacity:** Ensure sufficient compute capacity exists across multiple zones in your target region. Azure Databricks automatically distributes cluster nodes across zones, but you should verify that your selected instance types are available in all target zones.

### Considerations

Azure Databricks automatically distributes cluster nodes across availability zones. The distribution depends on available capacity in each zone. During high-demand periods, a cluster's nodes might be concentrated in fewer zones. When using serverless compute, Azure Databricks manages zone selection of VMs, as well as replacement of VMs that may be lost due to zone outages.

### Cost

Zone distribution doesn't affect compute costs, as you pay for the same number of virtual machines regardless of their availability zone placement. For detailed cost information, see [Azure Databricks compute pricing](https://azure.microsoft.com/pricing/details/databricks/).

The default redundancy for the managed storage account (DBFS Root) is geo-redundant storage (GRS). Changing to ZRS or GZRS might affect your storage costs. For more information, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

### Configure availability zone support

- **Control plane:** The control plane automatically supports zone redundancy in regions with availability zones. No customer configuration is required.

- **DBFS Root:**

    - **Create new workspace with zone-redundant DBFS Root storage**: When you create a new Azure Databricks workspace, you can optionally configure the associated storage account to use ZRS or GZRS instead of the default GRS. To learn how to change workspace storage redundancy options, see [Change workspace storage redundancy options](/azure/databricks/admin/workspace/workspace-storage-redundancy).
    
    - **Enable zone redundancy on DBFS Root storage**: For existing workspaces, you can change the redundancy configuration of the workspace storage account to ZRS or GZRS. To learn how to enable zone redundancy, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration).
    
- **Compute plane:** Cluster nodes are automatically distributed across availability zones. No customer configuration is required for zone distribution.

### Behavior when all zones are healthy

This section describes what to expect when a workspace is configured for with availability zone support and all availability zones are operational.

- **Data replication between zones:** Data replication for workspace storage occurs synchronously across zones when DBFS Root uses a ZRS or GZRS storage account. This approach ensures strong consistency with minimal performance impact.

- **Traffic routing between zones:** Azure Databricks distributes cluster nodes across zones automatically during cluster creation. The service balances compute load across zones while maintaining data locality for optimal performance.

### Behavior during a zone failure

This section describes what to expect when a workspace is configured with availability zone support and there's an availability zone outage.

- **Detection**: Microsoft automatically detects zone failures. No customer action is required for zone-level failover.

- **Notification:** Microsoft doesn't automatically notify you when a zone is down. However, you can use the [Azure Databricks status page](/azure/databricks/resources/status) to see an overview of all core Azure Databricks services. You can also subscribe to status updates on individual service components and receive an alert whenever the status of the service you are subscribed to changes.

- **Active requests:** Running clusters may lose nodes in the affected zone. The cluster manager automatically requests replacement nodes from remaining zones. If the driver node is lost, the cluster and job restart completely.

- **Expected data loss:**

    - **Control plane:** No data loss is expected during a zone outage.

    - **DBFS Root:** Workspace data remains available if it uses ZRS or GZRS storage configurations.
    
    - **Compute plane:** Data cached on VMs is ephemeral. Any data lost from VMs during a zone failure is recovered from storage, or if the driver node is lost, the job restarts and recompute the results.

- **Expected downtime**:

    - **Control plane:** The Databricks control plane performs automatic failover to healthy zones within approximately 15 minutes.

    - **DBFS Root:** No downtime is expected for storage accounts that are configured to use ZRS or GZRS storage.

    - **Compute plane:** If nodes are lost because their VMs are in the affected availability zone, the Azure cluster manager requests replacement nodes from the Azure compute provider. If there is sufficient capacity in the remaining healthy zones to fulfill the request, the compute provider pulls nodes from the healthy zones to replace the nodes that were lost. This process can take several minutes.

        If the driver node is lost due to the zone failure, the entire cluster restarts, which may cause longer recovery times compared to losing worker nodes. Plan for this behavior in your job scheduling and monitoring strategies.

        You can use serverless or instance pools to reduce this time.

- **Traffic rerouting:**

    - **Control plane:** The Databricks control plane performs automatic failover to healthy zones within approximately 15 minutes.

    - **DBFS Root:** Azure Storage automatically redirects requests to storage clusters in healthy zones. 

    - **Compute plane:** The cluster manager automatically switches to using nodes in healthy zones.

### Zone recovery

When the failed availability zone recovers, Azure Databricks automatically resumes normal operations across all zones. The cluster manager may rebalance node distribution during subsequent node creations, but existing nodes continue running in their current zones until terminated.

No customer action is required for failback operations. Normal zone distribution resumes for new cluster deployments.

### Test for zone failures

Azure Databricks is a fully managed service where zone failover is handled automatically by Microsoft, and we perform regular zone-down tests. You don't need to test zone failure scenarios for the service itself.

For your applications running on Azure Databricks, test job resilience by simulating driver node failures and monitoring cluster restart behavior. Validate that your data processing jobs can handle cluster restarts and resume from appropriate checkpoints.

## Resilience to region-wide failures

Azure Databricks is a single-region service. If the region is unavailable, your workspace is also unavailable. If you require multi-region deployments, see [Azure Databricks - Disaster recovery](/azure/databricks/admin/disaster-recovery).

### Custom multi-region solutions for resiliency

Azure Databricks does not currently provide built-in multi-region capabilities. For comprehensive multi-region protection of your analytics workloads, you must implement your own approach.

Typical multi-region solutions involve two (or possibly more) workspaces. You can choose from several strategies, including active-passive and active-active architectures. Consider the business criticality of the work done by the Databricks workload(s), the potential length of the disruption (hours or maybe even a day), the effort to ensure that the workspace is fully operational, and the effort to restore (fail back) to the primary region.

For workloads requiring multi-region protection, see [Azure Databricks - Disaster recovery](/azure/databricks/admin/disaster-recovery).

## Backup and restore

Azure Databricks databases are automatically backed up as part of the service's managed operations. This includes notebook content, job definitions, cluster configurations, and access control settings.

> [!NOTE]
> In the event of a zone failure, Azure Databricks expects no data loss.

Your data should be stored on Unity Catalog storage. You can replicate data through storage replication or delta cloning.

Workspace-level backup and restore capabilities are not directly available. Plan for workspace recreation procedures that include restoring configurations, users, and access controls from your synchronization processes.

## Resilience to service maintenance

Azure Databricks performs automatic platform maintenance to apply security updates, deploy new features, and improve service reliability. You can configure the maintenance windows for your cluster to reduce the likelihood of maintenance affecting your production workloads. For more information, see [Automatic cluster update](/azure/databricks/admin/clusters/automatic-cluster-update).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

## Related content

- [Azure Databricks disaster recovery](/azure/databricks/admin/disaster-recovery)
- [Reliability best practices for Azure Databricks](/azure/databricks/lakehouse-architecture/reliability/best-practices)
- [Azure reliability overview](/azure/reliability/overview)
