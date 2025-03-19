---
title: Reliability in Azure Data Factory
description: Learn about reliability in Azure Data Factory, including availability zones and multi-region deployments.
author: jonburchel
ms.author: jburchel
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-data-factory
ms.date: 03/19/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Data Factory works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.
---

# Reliability in Azure Data Factory

This article describes reliability support in [Azure Data Factory](../data-factory/introduction.md), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Reliability is a shared responsibility between you and Microsoft, and so this article also covers ways for you to create a reliable solution that meets your needs.

With Azure Data Factory, you can create flexible and powerful data pipelines for serverless data integration and data transformation. As a result, when defining your [business continuity plan](concept-business-continuity-high-availability-disaster-recovery.md) for reliability, you need to consider the reliability requirements and guidance for:

- *Azure Data Factory pipelines*.
- *Integration runtimes*, which connect to data stores and perform activities defined in your pipeline.
- *Data stores that are connected to the data factory.* To ensure they meet your business continuity requirements, consult their product reliability documentation and guidance.

## Reliability architecture overview

Azure Data Factory consists of multiple infrastructure components. Each component supports infrastructure reliability in a different way. 

The components of Azure Data Factory are:

- **Core Azure Data Factory service**, which manages pipeline triggers and coordinates pipeline execution. The core service also manages metadata about each component in the data factory. The core service is managed by Microsoft.

- **[Integration runtimes](../data-factory/concepts-integration-runtime.md#integration-runtime-types)**, which execute certain activities within a pipeline. There are different types of integration runtimes:

    - *Microsoft-managed integration runtimes*, including the Azure integration runtime and the Azure-SSIS integration runtime. Microsoft manages the components that make up these runtimes. In some situations, you configure settings that affect the resiliency of your integration runtimes.
    
    - *Self-hosted integration runtimes*. Microsoft provides software that you can run on your own compute infrastructure to execute some parts of your Azure Data Factory pipelines. You're responsible for deploying and managing compute resources, and for the resiliency of those compute resources.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

When you use Azure Data Factory, it's important to prepare for transient faults, especially when you design pipelines and activities.

### Idempotence

Your pipeline activities should be written to be *idempotent*, which means that they should be able to be rerun without adverse side effects. If there's a transient fault like a network failure, or even an availability zone outage, Azure Data Factory might rerun pipeline activities, and so has the possibility of creating duplicate records.

To avoid duplicate records being inserted after a transient fault, you can employ these best practices:

-  *Use unique identifiers* to each record before writing to the database. This approach can help to spot and eliminate duplicates.
-  *Upsert strategy* is an option for connectors that support upsert. Use this approach to check whether a record already exists before inserting. If it does exist, update it. If it doesn't exist, insert it. For example, SQL commands like `MERGE` or `ON DUPLICATE KEY UPDATE` use this upsert approach.
- *Use copy action strategies* that are discussed in the [data consistency verification in copy activities article.](../data-factory/copy-activity-data-consistency.md)

### Retry policies

With retry policies, you can configure parts of your pipeline to retry if there's a problem, such as when a resource you connect to has a transient fault. In Azure Data Factory, you can configure retry policies on the following pipeline object types:

- [Tumbling window triggers](../data-factory/concepts-pipeline-execution-triggers.md#tumbling-window-trigger).
- [Execution activities](../data-factory/concepts-pipelines-activities.md#execution-activities).

To learn how to change or disable retry policies for your data factory triggers and activities, see [Pipeline execution and triggers](../data-factory/concepts-pipeline-execution-triggers.md).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Data Factory supports *zone redundancy*, which provides resiliency to failures in [availability zones](availability-zones-overview.md). This section considers how each part of the Azure Data Factory service supports zone redundancy.

### Regions supported

Zone-redundant Azure Data Factory resources can be deployed in [any region that supports availability zones](./availability-zones-region-support.md).

### Considerations

**Core service:** Microsoft manages the components in the core Azure Data Factory service and spreads them across availability zones.

**Integration runtimes:** Zone redundancy support depends on the type of integration runtime you use:

- *Azure integration runtime* supports zone redundancy, and this capability is managed by Microsoft.
- *Azure-SSIS integration runtime* requires that you deploy at least two nodes, which are allocated into different availability zones automatically.
- *Self-hosted integration runtime* gives you the responsibility for deploying the compute infrastructure to host the runtime. You can deploy multiple nodes, such as individual VMs, and configure them for high availability. You can then distribute those nodes across multiple availability zones. To learn more, see [High availability and scalability](../data-factory/create-self-hosted-integration-runtime.md#high-availability-and-scalability).

### Cost

**Core service:** No additional cost applies for zone redundancy.

**Integration runtimes:** Cost for zone redundancy differs depending on the type of integration runtime you use:

- *Azure integration runtime* includes zone redundancy at no additional cost.
- *Azure-SSIS integration runtime* requires that you deploy at least two nodes to achieve zone redundancy. For more information about how each node is billed, see [Pricing example: Run SSIS packages on Azure-SSIS integration runtime](../data-factory/pricing-examples-ssis-on-azure-ssis-integration-runtime.md#pricing-model-for-azure-ssis-integration-runtime).
- *Self-hosted integration runtime* requires that you deploy and manage the compute infrastructure. To achieve zone resiliency you need to spread your compute resources across multiple zones. Depending on how many nodes you deploy and how you configure them, you might incur additional costs from the underlying compute services and other supporting services. There's no additional charge to run the self-hosted integration runtime on multiple nodes.

### Configure availability zone support

**Azure Data Factory core service:** No configuration required. Azure Data Factory core service automatically supports zone redundancy,

**Integration runtimes:**

- *Azure integration runtime:* No configuration required. Azure integration runtime automatically enables zone redundancy.
- *Azure-SSIS integration runtime:* No configuration required. Azure-SSIS integration runtime automatically enables zone redundancy when it's deployed with two or more nodes.
- *Self-hosted integration runtime* requires you to configure your own resiliency, including spreading your nodes across multiple availability zones.

### Capacity planning and management

**Core service:** The Azure Data Factory core service automatically scales based on demand, and you don't need to plan or manage capacity.

**Integration runtimes:** 

- *Azure integration runtime* automatically scales based on demand, and you don't need to plan or manage capacity.
- *Azure-SSIS integration runtime* requires you to explicitly configure the number of nodes that you use. To prepare for availability zone failure, consider *over-provisioning* the capacity of your integration runtime. Over-provisioning allows the solution to tolerate some degree of capacity loss and still continue to function without degraded performance. To learn more about over-provisioning, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).
- *Self-hosted integration runtime* requires you to configure your own capacity and scaling. Consider over-provisioning when you deploy a self-hosted integration runtime.

### Traffic routing between zones

During normal operations, Azure Data Factory automatically distributes pipeline activities, triggers, and other work among healthy instances in each availability zone.

### Zone-down experience

**Detection and response.** The Azure Data Factory platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover in your pipelines or other components.

**Active requests.** Any pipelines and triggers in progress continue to execute, and you won't notice a zone failure. However, activities in progress during a zone failure might fail and be restarted. It's important to design activities to be idempotent, which helps them to recover from zone failures as well as other faults. For more information, see [Transient faults](#transient-faults).

### Failback

When the availability zone recovers, Azure Data Factory automatically fails back to the original zone. You don't need to do anything to initiate a zone failback in your pipelines or other components.

However, if you use the self-hosted integration runtime, you might need to restart your compute resources if they have been stopped.

### Testing for zone failures

For the core service, as well as Azure and Azure-SSIS integration runtimes, Azure Data Factory manages traffic routing, failover, and failback for zone-redundant resources. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

For self-hosted integration runtimes, you can use [Azure Chaos Studio](/azure/chaos-studio/chaos-studio-overview) to simulate an availability zone failure on an Azure virtual machine.

## Multi-region support

Azure Data Factory resources are deployed into a single Azure region. If the region becomes unavailable, your data factory is also unavailable. However, there are approaches you can use to be resilient to region outages depending on whether the data factory is in a paired or nonpaired region, and depending on your requirements and configuration.

### Microsoft-managed failover to a paired region

Azure Data Factory supports Microsoft-managed failover for data factories in *paired regions* (except Brazil South and Southeast Asia). In the unlikely event of a prolonged region failure, Microsoft might elect to initiate a regional failover of your Azure Data Factory instance.

Due to data residency requirements in Brazil South and Southeast Asia, Azure Data Factory data is stored in the local region only by using [Azure Storage zone-redundant storage (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage). For Southeast Asia, all data is stored in Singapore. For Brazil South, all data is stored in Brazil. 

For data factories in *nonpaired regions*, or in Brazil South or Southeast Asia, Microsoft doesn't perform regional failover on your behalf.

> [!IMPORTANT]
> Microsoft-managed failover is triggered by Microsoft. It's likely to happen after a significant delay and is done on a best-effort basis. There are also some exceptions to this process. You might experience some loss of your data factory metadata. Failover of Azure Data Factory resources might happen at a different time to any failover of other Azure services.
>
> If you need to be resilient to region outages, consider using one of the [alternative multi-region approaches](#alternative-multi-region-approaches).

#### Failover of integration runtimes

To prepare for a failover, there may be some additional considerations depending on the integration runtime you use:

- *Azure integration runtime* can be configured to automatically resolve the region it uses. If the region is set to *auto resolve* and there's an outage in the primary region, the Azure integration runtime fails over automatically to the paired region, subject to the failover limitations described in [Microsoft-managed failover to a paired region](#microsoft-managed-failover-to-a-paired-region). To configure the Azure integration runtime region for your activity execution or dispatch in the integration runtime setup, set the region to *auto resolve*.
- *Azure-SSIS integration runtime* failover is managed separately to Microsoft-managed failover of the data factory. To learn more, see [alternative multi-region approaches](#alternative-multi-region-approaches).
- *Self-hosted integration runtime* runs on infrastructure that you're responsible for, and so Microsoft-managed failover doesn't apply to self-hosted integration runtimes. To learn more, see [alternative multi-region approaches](#alternative-multi-region-approaches).

#### Post-failover reconfiguration

Once a Microsoft-managed failover is complete, you can then access your Azure Data Factory pipeline in the paired region.

However, you might need to perform some reconfiguration for integration runtimes or other components after the failover completes, including re-establishing networking configuration.

### Alternative multi-region approaches

If you need your pipelines to be resilient to regional outages and you need control over the failover process, consider using a metadata-driven pipeline:

- **Set up source control for your Azure Data Factory** to track and audit any changes made to your metadata. With this approach, you can also access your metadata JSON files for pipelines, datasets, linked services, and triggers. Azure Data Factory supports different Git repository types (Azure DevOps and GitHub). To learn how to set up source control in Azure Data Factory, see [Source control in Azure Data Factory](../data-factory/source-control.md).

- **Use a continuous integration and delivery (CI/CD) system**, such as Azure DevOps, to manage your pipeline metadata and deployments. With CI/CD, you can quickly restore operations to an instance in another region. If a region is unavailable, you can provision a new data factory manually or through automation. Once the new data factory has been created, you can restore your pipelines, datasets, and linked services JSON from the existing Git repository. For more information, see [BCDR for Azure Data Factory and Azure Synapse Analytics pipelines](/azure/architecture/example-scenario/analytics/pipelines-disaster-recovery).

Depending on the integration runtime you use, there might be additional considerations:

- *Azure-SSIS integration runtime* uses a database stored in Azure SQL Database or Azure SQL Managed Instance. You can configure geo-replication or a failover group for this database. The Azure-SSIS database is then located in a primary Azure region with read-write access (the *primary role*) and is continuously replicated to a secondary region with read-only access (the *secondary role*). If the primary region is lost, a failover is triggered, causing the primary and secondary databases to swap roles.

    You can also configure a dual standby Azure SSIS IR pair that works in sync with Azure SQL Database or Azure SQL Managed Instance failover group.

    For more information, see [Configure Azure-SSIS integration runtime for business continuity and disaster recovery (BCDR)](../data-factory/configure-bcdr-azure-ssis-integration-runtime.md)

- *Self-hosted integration runtime* runs on infrastructure that you manage. If the self-hosted integration runtime is deployed to an Azure virtual machine, you can use [Azure Site Recovery](../site-recovery/site-recovery-overview.md) to trigger [virtual machine failover](../site-recovery/azure-to-azure-architecture.md) to another region.

## Backup and restore

Azure Data Factory supports CI/CD through source control integration, so that you can back up metadata associated with a data factory instance and deploy it into a new environment. To learn more, see [Continuous integration and delivery in Azure Data Factory](../data-factory/continuous-integration-delivery.md).

## Related content

- [Reliability in Azure](./overview.md)
