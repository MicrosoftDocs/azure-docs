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

Resiliency is a shared responsibility between you and Microsoft, and so this article also covers ways for you to create a resilient solution that meets your needs.

Azure Data Factory helps you to create flexible and powerful data pipelines by using a fully managed, serverless data integration service. When you plan for resiliency, consider not only the reliability of the data factory, but also related resources that you depend on. Evaluate any [Connections](../data-factory/connector-overview.md) that you create from data factory to other apps, services, and systems, and ensure those resources meet your reliabillity requirements.

## Reliability architecture overview

Azure Data Factory consists of multiple infrastructure components, which have different types of support for infrastructure resiliency:

- The core Azure Data Factory service, which manages pipeline triggers, coordinates pipeline execution, and manages metadata about each component in the data factory. The core service is managed by Microsoft.

- Integration runtimes, which execute certain activities within a pipeline. There are different types of integration runtimes:

    - Microsoft-managed integration runtimes. Microsoft manages the components that make up these runtimes.
    
    - Self-hosted integration runtimes. Microsoft provides software that you can run on your own compute infrastructure to execute some parts of your Azure Data Factory pipelines. You're responsible for deploying and managing compute resources, and for the resiliency of those compute resources.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

When you use Azure Data Factory, it's important to prepare for transient faults, especially when you design pipelines and activities.

### Idempotence

Pipeline activities should be *idempotent*, which means that they should be able to be rerun without adverse side effects. If there's a transient fault like a network failure, or even an availability zone outage, Azure Data Factory might rerun pipeline activities.

### Retry policies

Retry policies enable you to configure parts of your pipeline to retry if there's a problem, like if another system has a transient fault. In Azure Data Factory, you can configure retry policies on some types of pipeline objects:

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

**Integration runtimes:** Microsoft-managed integration runtimes also support zone redundancy, and this capability is managed by Microsoft. However, when you use the SSIS IR, you need to deploy at least two nodes, which will then be allocated into different availability zones.

If you use a self-hosted integration runtime, you're responsible for deploying the compute infrastructure to host the runtime. You can deploy multiple nodes, such as individual VMs, and configure them for high availability. You can then distribute those nodes across multiple availability zones. To learn more, see [High availability and scalability](../data-factory/create-self-hosted-integration-runtime.md#high-availability-and-scalability).

### Cost

**Core service:** No additional cost applies for zone redundancy.

**Integration runtimes:** Cost for zone redundancy differs depending on the type of integration runtime you use:

- When you use the Microsoft-managed integration runtime, zone redundancy is included at no additional cost.
- When you use the SSIS integration runtime, you must deploy at least two nodes to achieve zone redundancy.
- When you use a self-hosted integration runtime, you need to deploy and manage the compute infrastructure across multiple zones. Depending on how many nodes you deploy and how you configure them, you might incur additional costs from the underlying compute services and other supporting services. There's no additional charge to run the self-hosted integration runtime on multiple nodes.

### Configure availability zone support

**Core service:** The Azure Data Factory core service automatically support zone redundancy, so no configuration is required.

**Integration runtimes:**

- The Microsoft-managed integration runtime automatically enables zone redundancy, so no configuration is required.
- The SSIS integration runtime automatically supports zone redundancy when it's deployed with two or more nodes.
- Self-hosted integration runtimes require you to configure your own resiliency, including spreading those nodes across multiple availability zones.

### Capacity planning and management

**Core service:** The Azure Data Factory core service automatically scales based on demand, and you don't need to plan or manage capacity.

**Integration runtimes:** 
- The Microsoft-managed integration runtime automatically scales based on demand, and you don't need to plan or manage capacity.
- The SSIS integration runtime requires you to explicitly configure the number of nodes that you use. To prepare for availability zone failure, consider *over-provisioning* the capacity of your integration runtime. Over-provisioning allows the solution to tolerate some degree of capacity loss and still continue to function without degraded performance. To learn more about over-provisioning, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).
- Self-hosted integration runtimes require you to configure your own capacity and scaling. Consider over-provisioning when you deploy a self-hosted integration runtime.

### Traffic routing between zones

Azure Data Factory automatically distributes pipeline activities, triggers, and other work among instances in each availability zone.

### Zone-down experience

**Detection and response.** The Azure Data Factory platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover in your pipelines or other components.

**Active requests.** Any pipelines and triggers in progress will continue to execute, and you won't notice a zone failure.

    Activities in progress might fail and get restarted. It's important to design activities to be idempotent, which helps them to recover from zone failures as well as other faults. For more information, see [Transient faults](#transient-faults).

### Failback

When the availability zone recovers, Azure Data Factory automatically fails back to the original zone. You don't need to do anything to initiate a zone failback in your pipelines or other components.

### Testing for zone failures

For the core services and Microsoft-hosted integration runtimes, Azure Data Factory manages traffic routing, failover, and failback for zone-redundant resources. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

For self-hosted integration runtimes, you can use [Azure Chaos Studio](/azure/chaos-studio/chaos-studio-overview) to simulate an availability zone failure on an Azure virtual machine.

## Multi-region support

Azure Data Factory resources are deployed into a single Azure region. If the region becomes unavailable, your data factory is also unavailable.

If you use a [paired region](./regions-paired.md), Microsoft might automatically fail over Azure Data Factory resources to the region pair. However, this is likely to happen after a significant delay and is done on a best-effort basis, so if you require resiliency to region failures, you should follow the approach described in the next section.

### Alternative multi-region approaches

If you need your pipelines to be resilient to regional outages, consider managing your pipeline metadata and deployments through a continuous integration and delivery (CI/CD) system like Azure DevOps. Then, you can quickly restore operations to an instance in another region. For more information, see [BCDR for Azure Data Factory and Azure Synapse Analytics pipelines](/azure/architecture/example-scenario/analytics/pipelines-disaster-recovery).

## Backup and restore

Azure Data Factory supports CI/CD through source control integration, which allows you to back up metadata associated with a data factory instance and deploy it into a new environment. To learn more, see [Continuous integration and delivery in Azure Data Factory](../data-factory/continuous-integration-delivery.md).
