---
title: Reliability in Azure Data Factory
description: Learn about reliability in Azure Data Factory, including availability zones and multi-region deployments.
author: jonburchel
ms.author: jburchel
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-data-factory
ms.date: 03/04/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Data Factory works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.
---

# Reliability in Azure Data Factory

This article describes reliability support in [Azure Data Factory](../data-factory/introduction.md), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Reliability is a shared responsibility between you and Microsoft, and so this article also covers ways for you to create a reliable solution that meets your needs.

With Azure Data Factory you can create flexible and powerful data pipelines by using a fully managed, serverless data integration service. When you plan for reliability, consider not only the reliability of the data factory, but also related resources that you depend on. Evaluate any [Connections](../data-factory/connector-overview.md) that you create from data factory to other apps, services, and systems, and ensure those resources meet your reliability requirements.

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

Pipeline activities should be *idempotent*, which means that they should be able to be rerun without adverse side effects. If there's a transient fault like a network failure, or even an availability zone outage, Azure Data Factory might rerun pipeline activities.

To avoid duplicate rows being inserted after a transient fault, you can employ these best practices:

- Use unique identifiers - Add a unique ID to reach row before writing to the database, to spot and eliminate duplicates.
- Upsert strategy - for connectors that support upsert, use this approach to check if a row already exists before inserting. If it does, update it. If it doesn't, insert it. For example, SQL commands like `MERGE` or `ON DUPLICATE KEY UPDATE` use this upsert approach.

You can also use strategies discussed in the [data consistency verification in copy activities article.](../data-factory/copy-activity-data-consistency.md)

### Retry policies

With, retry policies, you can configure parts of your pipeline to retry if there's a problem, such as when a resource you connect to has a transient fault. In Azure Data Factory, you can configure retry policies on some types of pipeline objects:

- [Tumbling window triggers](../data-factory/concepts-pipeline-execution-triggers.md#tumbling-window-trigger).
- [Execution activities](../data-factory/concepts-pipelines-activities.md#execution-activities).

To learn how to change or disable retry policies for your data factory triggers and activities, see [Pipeline execution and triggers](../data-factory/concepts-pipeline-execution-triggers.md).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Data Factory supports *zone redundancy*, which provides resiliency to failures in [availability zones](availability-zones-overview.md). This section considers how each part of the Azure Data Factory service support zone redundancy.

### Regions suported

Zone-redundant Azure Data Factory resources can be deployed in [any region that supports availability zones](./availability-zones-region-support.md).

### Considerations

**Core service:** Microsoft manages the components in the core Azure Data Factory service and spreads them across availability zones.

**Integration runtimes:** Zone redundancy support depends on the type of integration runtime you use:

- *Azure integration runtime* supports zone redundancy, and this capability is managed by Microsoft.
- *Azure-SSIS integration runtime* requires that you deploy at least two nodes, which are allocated into different availability zones. <!-- TODO if you deploy three instances are they spread across three zones? -->
- *Self-hosted integration runtime* gives you the responsibility for deploying the compute infrastructure to host the runtime. You can deploy multiple nodes, such as individual VMs, and configure them for high availability. You can then distribute those nodes across multiple availability zones. To learn more, see [High availability and scalability](../data-factory/create-self-hosted-integration-runtime.md#high-availability-and-scalability).

### Cost

**Core service:** No additional cost applies for zone redundancy.

**Integration runtimes:** Cost for zone redundancy differs depending on the type of integration runtime you use:

- *Azure integration runtime* includes zone redundancy at no additional cost.
- *Azure-SSIS integration runtime* requires that you deploy at least two nodes to achieve zone redundancy.
- *Self-hosted integration runtime* requires that you deploy and manage the compute infrastructure. To achieve zone resiliency you need to spread your compute resources across multiple zones. Depending on how many nodes you deploy and how you configure them, you might incur additional costs from the underlying compute services and other supporting services. There's no additional charge to run the self-hosted integration runtime on multiple nodes.

### Configure availability zone support

**Core service:** The Azure Data Factory core service automatically support zone redundancy, so no configuration is required.

**Integration runtimes:**

- *Azure integration runtime* automatically enables zone redundancy, so no configuration is required.
- *Azure-SSIS integration runtime* automatically enables zone redundancy when it's deployed with two or more nodes.
- *Self-hosted integration runtime* require you to configure your own resiliency, including spreading your nodes across multiple availability zones.

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

**Active requests.** Any pipelines and triggers in progress will continue to execute, and you won't notice a zone failure. However, activities in progress during a zone failure might fail and be restarted. It's important to design activities to be idempotent, which helps them to recover from zone failures as well as other faults. For more information, see [Transient faults](#transient-faults).

### Failback

When the availability zone recovers, Azure Data Factory automatically fails back to the original zone. You don't need to do anything to initiate a zone failback in your pipelines or other components.

However, if you use the self-hosted integration runtime, you might need to restart your compute resources if they have been stopped.

### Testing for zone failures

For the core service, as well as Azure and Azure-SSIS integration runtimes, Azure Data Factory manages traffic routing, failover, and failback for zone-redundant resources. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

For self-hosted integration runtimes, you can use [Azure Chaos Studio](/azure/chaos-studio/chaos-studio-overview) to simulate an availability zone failure on an Azure virtual machine.

## Multi-region support

Azure Data Factory resources are deployed into a single Azure region. If the region becomes unavailable, your data factory is also unavailable.

In all regions (except Brazil South and Southeast Asia), Azure Data Factory data is stored and replicated in the [paired region](cross-region-replication-azure.md#azure-paired-regions) to protect against metadata loss. During regional datacenter failures, Microsoft might initiate a regional failover of your Azure Data Factory instance. In most cases, no action is required on your part. When the Microsoft-managed failover has completed, you are able to access your Azure Data Factory in the failover region.

Due to data residency requirements in Brazil South, and Southeast Asia, Azure Data Factory data is stored on [local region only](../storage/common/storage-redundancy.md#locally-redundant-storage). For Southeast Asia, all the data are stored in Singapore. For Brazil South, all data are stored in Brazil. When the region is lost due to a significant disaster, Microsoft won't be able to recover your Azure Data Factory data.  

If you use a [paired region](./regions-paired.md), Microsoft might initiate a failover of Azure Data Factory resources in the affected region to the region pair. However, this is likely to happen after a significant delay and is done on a best-effort basis. There are also some exceptions to this process.

### **Using source control in Azure Data Factory**

To ensure you can track and audit the changes made to your metadata, you should consider setting up source control for your Azure Data Factory. It will also enable you to access your metadata JSON files for pipelines, datasets, linked services, and trigger. Azure Data Factory enables you to work with different Git repository (Azure DevOps and GitHub). 

 Learn how to set up [source control in Azure Data Factory](./source-control.md). 

> [!NOTE]
> If there is a disaster (loss of region), new data factory can be provisioned manually or in an automated fashion. Once the new data factory has been created, you can restore your pipelines, datasets, and linked services JSON from the existing Git repository.

### **Data stores**

Azure Data Factory enables you to move data among data stores located on-premises and in the cloud. To ensure business continuity with your data stores, you should refer to the business continuity recommendations for each of these data stores.

### Integration runtimes

#### Azure integration runtime

In Data Factory, you can set the Azure integration runtime (IR) region for your activity execution or dispatch in the Integration runtime setup. To enable automatic failover in the event of a complete regional outage, set the Region to Auto Resolve. The Azure integration runtime will fail over automatically to paired regions when you select Auto Resolve as the runtime's region.

For other regions, you can create a secondary data factory in another region and fail over manually.

### Azure-SSIS integration runtime

For business continuity and disaster recovery (BCDR), Azure SQL Database/Managed Instance can be configured with a geo-replication/failover group, where SSISDB in a primary Azure region with read-write access (primary role) will be continuously replicated to a secondary region with read-only access (secondary role). When a disaster occurs in the primary region, a failover will be triggered, where the primary and secondary SSISDBs will swap roles.

You can also configure a dual standby Azure SSIS IR pair that works in sync with Azure SQL Database/Managed Instance failover group.

For more informaiton, see [Configure Azure-SSIS integration runtime for business continuity and disaster recovery (BCDR)](../data-factory/configure-bcdr-azure-ssis-integration-runtime.md)

#### Self-hosted integration runtimes

Microsoft-managed failover doesn't apply to self-hosted integration runtime (SHIR) since this infrastructure is typically customer-managed. If the SHIR is set up on Azure VM, then the recommendation is to use [Azure Site Recovery](../site-recovery/site-recovery-overview.md) for handling the [Azure VM failover](../site-recovery/azure-to-azure-architecture.md) to another region.

### Alternative multi-region approaches

If you need your pipelines to be resilient to regional outages, consider managing your pipeline metadata and deployments through a continuous integration and delivery (CI/CD) system like Azure DevOps. Then, you can quickly restore operations to an instance in another region. For more information, see [BCDR for Azure Data Factory and Azure Synapse Analytics pipelines](/azure/architecture/example-scenario/analytics/pipelines-disaster-recovery).

## Backup and restore

Azure Data Factory supports CI/CD through source control integration, which allows you to back up metadata associated with a data factory instance and deploy it into a new environment. To learn more, see [Continuous integration and delivery in Azure Data Factory](../data-factory/continuous-integration-delivery.md).
