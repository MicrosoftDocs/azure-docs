---
title: Reliability in Azure Data Factory
description: Learn about reliability in Azure Data Factory, including availability zones, multi-region deployments, and resilient pipeline practices.
author: jonburchel
ms.author: jburchel
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-data-factory
ms.date: 04/04/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Data Factory works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.
---

# Reliability in Azure Data Factory

This article describes reliability support in [Azure Data Factory](../data-factory/introduction.md). It covers intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

You can use Data Factory to create flexible and powerful data pipelines for serverless data integration and data transformation. As a result, when you define your [business continuity plan](concept-business-continuity-high-availability-disaster-recovery.md) for reliability, you need to consider the reliability requirements and guidance for:

- *Data Factory pipelines*.

- *Integration runtimes (IRs)*, which connect to data stores and perform activities defined in your pipeline.

- *Data stores that connect to the data factory.* To help ensure that data stores meet your business continuity requirements, consult their product reliability documentation and guidance.

## Reliability architecture overview

Data Factory consists of multiple infrastructure components. Each component supports infrastructure reliability in various ways. 

The components of Data Factory include:

- **The core Data Factory service**, which manages pipeline triggers and oversees the coordination of pipeline activities. The core service also manages metadata for each component in the data factory. Microsoft manages the core service.

- **[Integration runtimes (IRs)](../data-factory/concepts-integration-runtime.md#integration-runtime-types)**, which perform specific activities within a pipeline. There are different types of IRs.

    - *Microsoft-managed IRs*, which include the Azure IR and the Azure-SQL Server Integration Services (Azure-SSIS) IR. Microsoft manages the components that make up these runtimes. In some scenarios, you configure settings that affect the resiliency of your IRs.
    
    - *Self-hosted integration runtimes (SHIRs)*. Microsoft provides software that you can run on your own compute infrastructure to perform some parts of your Data Factory pipelines. You're responsible for the deployment and management of compute resources, and for the resiliency of those compute resources.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

When you use Data Factory, it's important to prepare for transient faults, especially when you design pipelines and activities.

### Idempotence

Your pipeline activities should be *idempotent*, which means that they can be rerun multiple times without causing any adverse effects. If a transient fault like a network failure or an availability zone outage occurs, Data Factory might rerun pipeline activities. This rerun can create duplicate records.

To prevent duplicate record insertion because of a transient fault, implement the following best practices:

-  *Use unique identifiers* for each record before you write to the database. This approach can help you find and eliminate duplicate records.

-  *Use an upsert strategy* for connectors that support upsert. Before duplicate record insertion occurs, use this approach to check whether a record already exists. If it does exist, update it. If it doesn't exist, insert it. For example, SQL commands like `MERGE` or `ON DUPLICATE KEY UPDATE` use this upsert approach.

- *Use copy action strategies.* For more information, see [Data consistency verification in copy activity](../data-factory/copy-activity-data-consistency.md).

### Retry policies

You can use retry policies to configure parts of your pipeline to retry if there's a problem, like transient faults in connected resources. In Data Factory, you can configure retry policies on the following pipeline object types:

- [Tumbling window triggers](../data-factory/concepts-pipeline-execution-triggers.md#tumbling-window-trigger)
- [Execution activities](../data-factory/concepts-pipelines-activities.md#execution-activities)

For more information about how to change or disable retry policies for your data factory triggers and activities, see [Pipeline runs and triggers](../data-factory/concepts-pipeline-execution-triggers.md).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Data Factory supports zone redundancy, which provides resiliency to failures in [availability zones](availability-zones-overview.md). This section describes how each part of the Data Factory service supports zone redundancy.

### Regions supported

Zone-redundant Data Factory resources can be deployed in [any region that supports availability zones](./availability-zones-region-support.md).

### Considerations

**Core service:** Microsoft manages the components in the core Data Factory service and spreads them across availability zones.

**IRs:** Zone redundancy support depends on the type of IR that you use.

- *An Azure IR* supports zone redundancy, and Microsoft manages this capability.

- *An Azure-SSIS IR* requires you to deploy at least two nodes. These nodes are allocated into different availability zones automatically.

- *A SHIR* gives you the responsibility for deploying the compute infrastructure to host the runtime. You can deploy multiple nodes, such as individual virtual machines (VMs), and configure them for high availability. You can then distribute those nodes across multiple availability zones. For more information, see [High availability and scalability](../data-factory/create-self-hosted-integration-runtime.md#high-availability-and-scalability).

### Cost

**Core service:** No extra cost applies for zone redundancy.

**IRs:** The cost of zone redundancy varies depending on the type of IR that you use.

- *An Azure IR* includes zone redundancy at no extra cost.

- *An Azure-SSIS IR* requires you to deploy at least two nodes to achieve zone redundancy. For more information about how each node is billed, see [Pricing example: Run SSIS packages on an Azure-SSIS IR](../data-factory/pricing-examples-ssis-on-azure-ssis-integration-runtime.md#pricing-model-for-azure-ssis-integration-runtime).

- *A SHIR* requires you to deploy and manage the compute infrastructure. To achieve zone resiliency, you need to spread your compute resources across multiple zones. Depending on the number of nodes that you deploy and how you configure them, you might incur extra costs from the underlying compute services and other supporting services. There's no extra charge to run the SHIR on multiple nodes.

### Configure availability zone support

**Core service:** No configuration required. The Data Factory core service automatically supports zone redundancy.

**IRs:**

- *An Azure IR:* No configuration required. The Azure IR automatically enables zone redundancy.

- *An Azure-SSIS IR:* No configuration required. An Azure-SSIS IR automatically enables zone redundancy when it's deployed with two or more nodes.

- *A SHIR* requires you to configure your own resiliency, which includes spreading your nodes across multiple availability zones.

### Capacity planning and management

**Core service:** The Data Factory core service scales automatically based on demand, and you don't need to plan or manage capacity.

**IRs:** 

- *An Azure IR* scales automatically based on demand, and you don't need to plan or manage capacity.

- *An Azure-SSIS IR* requires you to specifically configure the number of nodes that you use. To prepare for availability zone failure, consider over-provisioning the capacity of your IR. Over-provisioning allows the solution to tolerate some degree of capacity loss and still continue to function without degraded performance. For more information, see [Manage capacity by over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

- *A SHIR* requires you to configure your own capacity and scaling. Consider over-provisioning when you deploy a SHIR.

### Normal operations

This section describes what to expect when Data Factory resources are configured for zone redundancy and all availability zones are operational.

- **Traffic routing between zones:** During normal operations, Data Factory automatically distributes pipeline activities, triggers, and other work among healthy instances in each availability zone.

### Zone-down experience

This section describes what to expect when Data Factory resources are configured for zone redundancy and there's an availability zone outage.

- **Detection and response:** The Data Factory platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover in your pipelines or other components.

- **Notification**: Azure Data Factory doesn't notify you when a zone is down. However, you can use [Azure Resource Health](/azure/service-health/resource-health-overview) to monitor for the health of your data factory. If a zone is down, the data factory in that zone will show as unavailable. You can also use [Azure Service Health](/azure/service-health/overview) to understand the overall health of the Azure Data Factory service, including any zone failures.
  
  Set up alerts on these services to receive notifications of zone-level problems. For more information, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal) and [Create and configure Resource Health alerts](/azure/service-health/resource-health-alert-arm-template-guide).

- **Active requests:** Any pipelines and triggers in progress continue to run, and you don't experience any immediate disruption from a zone failure. However, activities in progress during a zone failure might fail and be restarted. It's important to design activities to be idempotent, which helps them recover from zone failures and other faults. For more information, see [Transient faults](#transient-faults).

### Zone recovery

When the availability zone recovers, Data Factory automatically fails back to the original zone. You don't need to do anything to initiate a zone failback in your pipelines or other components.

However, if you use a SHIR, you might need to restart your compute resources if they've been stopped.

### Testing for zone failures

For the core service, and for Azure and Azure-SSIS IRs, Data Factory manages traffic routing, failover, and failback for zone-redundant resources. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

For SHIRs, you can use [Azure Chaos Studio](/azure/chaos-studio/chaos-studio-overview) to simulate an availability zone failure on an Azure VM.

## Multi-region support

Data Factory resources are deployed into a single Azure region. If the region becomes unavailable, your data factory is also unavailable. However, there are approaches that you can use to help ensure resilience to region outages. These approaches depend on whether the data factory is in a paired or nonpaired region and on your specific requirements and configuration.

### Microsoft-managed failover to a paired region

Data Factory supports Microsoft-managed failover for data factories in paired regions, except for Brazil South and Southeast Asia. In the unlikely event of a prolonged region failure, Microsoft might initiate a regional failover of your Data Factory instance.

Because of data residency requirements in Brazil South and Southeast Asia, Data Factory data is stored only in the local region by using [Azure Storage zone-redundant storage](../storage/common/storage-redundancy.md#zone-redundant-storage). For Southeast Asia, all data is stored in Singapore. For Brazil South, all data is stored in Brazil. 

For data factories in nonpaired regions, or in Brazil South or Southeast Asia, Microsoft doesn't perform regional failover on your behalf.

> [!IMPORTANT]
> Microsoft triggers Microsoft-managed failover. It's likely to occur after a significant delay and is done on a best-effort basis. There are also some exceptions to this process. You might experience some loss of your data factory metadata. The failover of Data Factory resources might occur at a time that's different from the failover time of other Azure services.
>
> If you need to be resilient to region outages, consider using one of the [alternative multi-region approaches](#alternative-multi-region-approaches).

#### Failover of IRs

To prepare for a failover, there might be some extra considerations, depending on the IR that you use.

- You can configure the *Azure IR* to automatically resolve the region that it uses. If the region is set to *auto resolve* and there's an outage in the primary region, the Azure IR automatically fails over to the paired region. This failover is subject to [limitations](#microsoft-managed-failover-to-a-paired-region). To configure the Azure IR region for your activity implementation or dispatch in the IR setup, set the region to *auto resolve*.

- *Azure-SSIS IR* failover is managed separately from a Microsoft-managed failover of the data factory. For more information, see [Alternative multi-region approaches](#alternative-multi-region-approaches).

- *A SHIR* runs on infrastructure that you're responsible for, so a Microsoft-managed failover doesn't apply to SHIRs. For more information, see [Alternative multi-region approaches](#alternative-multi-region-approaches).

#### Post-failover reconfiguration

After a Microsoft-managed failover is complete, you can access your Data Factory pipeline in the paired region. However, after the failover completes, you might need to perform some reconfiguration for IRs or other components. This process includes re-establishing the networking configuration.

### Alternative multi-region approaches

If you need your pipelines to be resilient to regional outages and you need control over the failover process, consider using a metadata-driven pipeline.

- **Set up source control for Data Factory** to track and audit any changes to your metadata. You can use this approach to access your metadata JSON files for pipelines, datasets, linked services, and triggers. Data Factory supports different Git repository types, like Azure DevOps and GitHub. For more information, see [Source control in Data Factory](../data-factory/source-control.md).

- **Use a continuous integration and continuous delivery (CI/CD) system**, such as Azure DevOps, to manage your pipeline metadata and deployments. You can use CI/CD to quickly restore operations to an instance in another region. If a region is unavailable, you can provision a new data factory manually or through automation. After the new data factory is created, you can restore your pipelines, datasets, and linked services JSON from the existing Git repository. For more information, see [Business continuity and disaster recovery (BCDR) for Data Factory and Azure Synapse Analytics pipelines](/azure/architecture/example-scenario/analytics/pipelines-disaster-recovery).

Depending on the IR that you use, there might be other considerations.

- *An Azure-SSIS IR* uses a database stored in Azure SQL Database or Azure SQL Managed Instance. You can configure geo-replication or a failover group for this database. The Azure-SSIS database is located in a primary Azure region that has read-write access. The database is continuously replicated to a secondary region that has read-only access. If the primary region is unavailable, a failover triggers, which causes the primary and secondary databases to swap roles.

    You can also configure a dual standby Azure SSIS IR pair that works in sync with an Azure SQL Database or SQL Managed Instance failover group.

    For more information, see [Configure an Azure-SSIS IR for BCDR](../data-factory/configure-bcdr-azure-ssis-integration-runtime.md).

- *A SHIR* runs on infrastructure that you manage. If the SHIR is deployed to an Azure VM, you can use [Azure Site Recovery](../site-recovery/site-recovery-overview.md) to trigger [VM failover](../site-recovery/azure-to-azure-architecture.md) to another region.

## Backup and restore

Data Factory supports CI/CD through source control integration, so that you can back up the metadata of a data factory instance. CI/CD pipelines deploy this metadata seamlessly into a new environment. For more information, see [CI/CD in Data Factory](../data-factory/continuous-integration-delivery.md).

## Service-level agreement

The service-level agreement (SLA) for Azure Data Factory describes the expected availability of the service. This agreement also describes the conditions to meet for achieving this expectation. To understand these conditions, make sure that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [Reliability in Azure](./overview.md)
