---
title: Reliability in Azure Data Factory
description: Learn about reliability in Azure Data Factory, including availability zones and multi-region deployments.
author: jonburchel
ms.author: jburchel
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-data-factory
ms.date: 02/06/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand how Azure Data Factory works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow in different situations.
---

# Reliability in Azure Data Factory

This article describes reliability support in [Azure Data Factory](../data-factory/introduction.md), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft, and so this article also covers ways for you to create a resilient solution that meets your needs.

When including Azure Data Factory resources in your [business continuity planning](./concept-business-continuity-high-availability-disaster-recovery.md), it's important that you consider not only the reliability of the data factory, but also the following Azure resources:

* [Connections](../data-factory/connector-overview.md) that you create from data factory to other apps, services, and systems. 

* [On-premises data gateways](/data-integration/gateway/service-gateway-onprem), which are Azure resources that you create and use in your data factory to access data in on-premises systems. Each gateway resource represents a separate [data gateway installation](/data-integration/gateway/service-gateway-install) on a local computer. You can configure an on-premises data gateway for high availability by using multiple computers. For more information, see [High availability support](/data-integration/gateway/plan-scale-maintain).

## Redundancy

Azure Data Factory consists of multiple infrastructure components, which have different types of support for infrastructure resiliency:

- The core Azure Data Factory service, which manages pipeline triggers, coordinates pipeline execution, and manages metadata about each component in the data factory. The core service is managed by Microsoft.

- Integration runtimes, which execute certain activities within a pipeline. There are different types of integration runtimes:

    - Microsoft-managed integration runtimes. Microsoft manages the components that make up these runtimes. <!-- TODO confirm that this applies to all of them -->
    
    - Self-hosted integration runtimes. Microsoft provides software that you can run on your own compute infrastructure to execute some parts of your Azure Data Factory pipelines. You're responsible for deploying and managing compute resources, and for the resiliency of those compute resources.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

In Azure Data Factory, you can configure retry policies on some types of pipeline objects:

- [Tumbling window triggers](../data-factory/concepts-pipeline-execution-triggers.md#tumbling-window-trigger).
- [Execution activities](../data-factory/concepts-pipelines-activities.md#execution-activities).

To learn how to change or disable retry policies for your data factory triggers and activities, see [Pipeline execution and triggers](../data-factory/concepts-pipeline-execution-triggers.md).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

The core Azure Data Factory service automatically supports *zone redundancy*, which provides resiliency to failures in [availability zones](availability-zones-overview.md). Microsoft manages the components in the core service and spreads them across availability zones.

Microsoft-managed integration runtimes also support zone redundancy, and this capability is managed by Microsoft. <!-- TODO need to confirm about SSIS -->

If you use a self-hosted integration runtime, you're responsible for deploying the compute infrastructure to host the runtime. You can deploy multiple nodes, such as individual VMs, and configure them for high availability. You can then distribute those nodes across multiple availability zones. To learn more, see [High availability and scalability](../data-factory/create-self-hosted-integration-runtime.md#high-availability-and-scalability).

### Region support

Zone-redundant Azure Data Factory resources can be deployed in [any region that supports availability zones](./availability-zones-region-support.md).

### Traffic routing between zones

<!-- TODO I assume Microsoft manages distributing requests among resources spanning AZs -->

### Zone-down experience

**Detection and response.**
- For the core Azure Data Factory service as well as Microsoft-managed integration runtimes, tThe Azure Data Factory platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover in your pipelines or other core platform components.
- For self-hosted integration runtimes, <!-- TODO confirm behaviour - I think the software handles this itself? -->

**Active requests.** <!-- What happens here to the pipeline? Would you expect any interruptions, delays, retries, etc? -->

**Traffic rerouting.** When a zone is unavailable, Azure Data Factory automatically reruns active requests on compute resources in an available zone.

### Failback

<!-- What happens here to the pipeline? -->

When the availability zone recovers, Azure Data Factory automatically fails back to the original zone.

### Testing for zone failures

For the core services and Microsoft-hosted integration runtimes, Azure Data Factory manages traffic routing, failover, and failback for zone-redundant resources. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

For self-hosted integration runtimes, you can use [Azure Chaos Studio](/azure/chaos-studio/chaos-studio-overview) to simulate an availability zone failure.

## Multi-region support

Azure Data Factory is by default a single-region service. If a region-wide outage occurs, the Azure Data Factory instance will not available. 

However, to maintain high availability, you'll want to maintain data redundancy across two regions by considering the following multi-region deployment options:
    
- **Automated recovery** with Azure integration runtime (IR) and automatic failover to the secondary paired region.
- **User-managed recovery** with GitHub and continuous integration and continuous delivery (CI/CD) for managed failover and quick deployment to a secondary region for immediate recovery.


### Region support

Azure Data Factory supports multi-region deployments in all regions where Azure Data Factory is available. However, the following regions have specific data residency requirements that prohibit multi-region support:

- *Brazil South*, where all data is stored in the Brazil [local region only](/azure/storage/common/storage-redundancy.md#locally-redundant-storage).

- *Southeast Asia*, where all data is stored in the Singapore [local region only](/azure/storage/common/storage-redundancy.md#locally-redundant-storage).

>[!IMPORTANT]
>If the local region is lost due to a rare but significant disaster, Microsoft cannot recover the Azure Data Factory data.

### Considerations

- Automated recovery for multi-region requires deployment on Azure [paired regions](./regions-paired.md).

### Cost

User-managed recovery integrates Azure Data Factory with Git by using CI/CD, and optionally uses a secondary region that has all the necessary infrastructure configurations as a backup. This scenario might incur added costs. To estimate costs, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).

For examples of Azure Data Factory pricing, see [Understanding Azure Data Factory pricing through examples](/azure/data-factory/pricing-concepts)

### Configure multi-region support


- **Automated recovery.** To learn how to set up automated recovery for a region pair, see [Set up automated recovery](/azure/architecture/example-scenario/analytics/pipelines-disaster-recovery#set-up-automated-recovery). 

- **User-managed recovery.** To learn how to setup user-managed recovery, see [Set up user-managed recovery through CI/CD](#set-up-user-managed-recovery-through-cicd).


### Traffic routing between regions

When you configure multi-region support in an active/passive deployment architecture, all pipelines run in the primary region. The secondary region is used only in the event of a failover.


### Data replication between regions


Azure Data Factory supports both automated and user-managed data replication for the following data:

- **Metadata**
    - Pipeline
    - Datasets
    - Linked services
    - Integration runtime
    - Triggers
    - Monitoring data

- **Pipeline**
    - Triggers
    - Activity runs

For information on how user-managed data replication with CI/CD works, see [Continuous integration and delivery in Azure Data Factory](/azure/data-factory/continuous-integration-delivery).


### Region-down experience

#### Automated failover

*Paired regions only*. If you have selected **Auto Resolve** during multi-region setup, then the Integration runtime (IR) automatically fails over to the paired region. In a failover, Azure Data Factory recovers the production pipelines. If you need to validate your recovered pipelines, you can back up the Azure Resource Manager templates for your production pipelines in secret storage, and compare the recovered pipelines to the backups.

Although the failover process is automated, you still need to manually manage the following tasks:

- For managed virtual networks, users needs to manually switch to the secondary region.

- Azure managed automatic failover doesn't apply to self-hosted integration runtime (SHIR), because the infrastructure is customer-managed. For guidance on setting up multiple nodes for higher availability with SHIR, see [Create and configure a self-hosted integration runtime](/azure/data-factory/create-self-hosted-integration-runtime#high-availability-and-scalability).

- To configure BCDR for Azure-SSIS IR, see [Configure Azure-SSIS integration runtime for business continuity and disaster recovery (BCDR)](/azure/data-factory/configure-bcdr-azure-ssis-integration-runtime).

Linked services aren't fully enabled after failover, because of pending private endpoints in the newer network of the region. You need to configure private endpoints in the recovered region. You can automate private endpoint creation by using the [approval API](/powershell/module/az.network/approve-azprivateendpointconnection).


#### User-managed failover
- Use Git and CI/CD to recover pipelines manually in case of Data Factory pipeline deletion or outage.
- Failover to a pre-configured secondary region by deploying the data factory in the secondary region and then provisioning it as primary. This option requires that you have deployed an active/passive implementation.


## Testing for region failures
<!-- Do we place this here? -->
The Azure Global team conducts regular BCDR drills, and Azure Data Factory participate in these drills. The BCDR drill simulates a region failure and fails over Azure services to a paired region without any customer involvement. 


> [!NOTE]
> If there's a disaster (loss of region), a new data factory can be provisioned manually or in an automated fashion. Once you create the new data factory, you can restore your pipelines, datasets, and linked services JSON from an existing Git repository if you have setup [source control in Azure Data Factory](../data-factory/source-control.md).


## Backup and restore
Azure Data Factory supports continuous Integration and Delivery (CI/CD) through source control integration, which allows you to backup metadata associated with a data factory instance and deploy it into a new environment easily. Learn more about using CI/CD to manage your resources in the [Azure Data Factory CI/CD documentation](../data-factory/continuous-integration-delivery.md).


## Related content

[BCDR for Azure Data Factory](/azure/architecture/example-scenario/analytics/pipelines-disaster-recovery)