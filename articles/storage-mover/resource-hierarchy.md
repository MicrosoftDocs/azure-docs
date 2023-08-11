---
title: Understanding the Azure Storage Mover resource hierarchy
description: Understanding the Azure Storage Mover resource hierarchy
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: conceptual
ms.date: 07/25/2023
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed
EDIT PASS: not started

Initial doc score: 86
Current doc score: 100 (1570 words and 2 false positive issues)

!########################################################
-->

# Understanding the Azure Storage Mover resource hierarchy

Several Azure resources are involved in a Storage Mover deployment. This article describes each of these resources, their uses, and best practices for expressing your migration needs with them.

:::image type="content" source="media/resource-hierarchy/resource-hierarchy.png" alt-text="An image showing the hierarchical relationship of Storage Mover Azure resources further described in the article." lightbox="media/resource-hierarchy/resource-hierarchy-large.png":::

## Overview

[!INCLUDE [hybrid-service-explanation](includes/hybrid-service-explanation.md)]

## Storage mover resource

A storage mover resource is the name of the top-level service resource that you deploy in a resource group of your choice. All aspects of the service and of your migration are controlled from this resource. In most cases, deploying a single storage mover resource is sufficient for even the largest migrations.

You're better able to utilize your agents and manage your migrations if all resources find their home in the same storage mover instance.

A migration agent can only be registered to one storage mover.

When you deploy the resource, your subscription is registered with the *Microsoft.StorageMover* and *Microsoft.HybridCompute* resource providers. You also assign the region in which control messages and metadata about your migration is stored. The Storage Mover resource itself isn't directly responsible for migrating your data. Instead, a migration agent copies your data from the source and sends it directly to the target in Azure Storage. Because the agent performs most the work, the proximity between source, agent, and target storage is more important for migration performance than your storage mover resource's location.

:::image type="content" source="media/across-articles/data-vs-management-path.png" alt-text="A diagram illustrating the data flow by showing two arrows. The first arrow represents data traveling to a storage account from the source or agent and a second arrow represents only the management or control info to the storage mover resource or service." lightbox="media/across-articles/data-vs-management-path-large.png":::

## Migration agent

Storage Mover is a hybrid service and utilizes one or more migration agents to facilitate migrations. The agent is a virtual machine that runs within your network. It's also the name of a resource, parented to the storage mover resource you've deployed in your resource group.

You can deploy several migration agent VMs and register each with a unique name to the same storage mover resource. If you have migration needs in different locations, it's best to have a migration agent very close to the source storage you'd like to migrate.

Your agents appear in your storage mover after they've been registered. Registration creates the trust relationship with the storage mover resource you've selected during registration. This trust enables you to manage all migration related aspects from the cloud service, either through the Azure portal, Azure PowerShell, or Azure CLI.

> [!TIP]
> The proximity and network quality between your migration agent and the target storage in Azure determine migration velocity in early stages of your migration. The region of the storage mover resource you've deployed doesn't play a role for performance.

> [!NOTE]
> In order to minimize downtime for your workload, you may decide to copy multiple times from source to target. In later copy runs, migration velocity is often influenced more by the speed at which the migration agent can evaluate if a file needs to be copied or not. That means local compute and memory resources on an agent can become more important to the migration velocity than network quality.

## Migration project

A project allows you to organize your larger scale cloud migrations into smaller, more manageable units that make sense for your situation.

The smallest unit of a migration can be defined as the contents of one source moving into one target, but data center migrations are rarely that simple. Often multiple sources support one workload and must be migrated together for timely failover of the workload to the new cloud storage locations in Azure.

In a different example, one source may even need to be split into multiple target locations. The reverse is also possible, where you need to combine multiple sources into subpaths of the same target location in Azure.

:::image type="content" source="media/resource-hierarchy/project-illustration.png" alt-text="an image showing the nested relationship of a project into a storage mover resource. It also shows child objects of the resource, called job definitions, described later in this article." lightbox="media/resource-hierarchy/project-illustration-large.png":::

Grouping sources into a project doesn't mean you have to migrate all of them in parallel. You have control over what to run and when to run it. The remaining sections in this article describe more resources that allow for such fine-grained control.

> [!TIP]
> You can optionally add a description to your project. A description can help to keep track of additional information for your project. If you've already created a migration plan elsewhere, the description field can be used to link this project to your plan. You can also use it to record information a colleague might need later on. You can add descriptions to all storage mover resources and each description can contain up to 1024 characters.

## Job definition

A Job definition is contained within a project. The job definition describes a source, a target, and the migration settings you want to use the next time you start a copy from the defined source to the defined target in Azure.

> [!IMPORTANT]
> After a job definition is created, source and target information cannot be changed. However, migration settings can be changed any time. A change won't affect a running migration job, but will take effect the next time you start a migration job.

It may not seem immediately logical that changing source and target information in an existing job definition isn't permitted. By way of example, imagine you define *Share A* as the migration source and that run several copy operations. Imagine also that you change the migration source to *Share B*. This change could have potentially dangerous consequences.

*Mirroring* is a common migration setting that creates a "mirror" image of a source within a target. If this setting is applied to our example, files from *Share A* might get deleted in the target when the copy operation begins migrating files from *Share B*. To prevent mistakes and maintain the integrity of a job run history, you can't edit a provisioned job definition's source or target. Source, target, and their optional subpath information are locked when a job definition is created. If you want to reuse the same target but use a different source (or vice versa), you're required to create a new job definition.

The job definition also keeps a historic record of past copy runs and their results.

## Job run

When you start a job definition, a new resource is implicitly created: a job run resource. The job definition contains all the information the storage mover service needs to start a copy. In a typical migration, you might copy from source to target several times. Each time you start a job definition, it's recorded in a job run.

The job run is a snapshot of the job definition and given to the migration agent you've selected. The agent then has all the necessary information about source, target, and the migration behavior it needs to follow to accomplish the migration you've previously defined.

> [!IMPORTANT]
> A change to migration settings won't affect a running migration job. At the time of starting a job run, a snapshot of the job definition is taken and executed b the migration agent. You can't change a job run, your only option is to cancel it.

A job run has a state, progress information and copy result information. You find the most critical information about your job run as properties on the job run resource itself. The migration agent has a custom telemetry channel that allows it to store this information directly in the job run resource.

The agent also emits additional information and migration results through the Azure Monitor service:
- **Metrics** are numerical values, recorded over time. They can be plotted using the Azure Monitor service. Some selected metrics are also directly available when managing the job definition / job runs in the portal.
- **Copy logs** are optional. If enabled, every job run has its own copy log. A log entry is generated for each namespace item the agent encounters in the source that can't be copied.

> [!IMPORTANT]
> Metric information is available by default, but you must opt-in to enable copy logs. That can be done as part of creating your storage mover resource and also later on. If you want to check if copy logs are enabled, or manage details, you can use the *Diagnostic settings* menu on the Azure portal page for your storage mover resource.

<!--
Learn more about telemetry, metrics and logs in the job definition monitoring article.
-->

## Endpoint

Migrations require well defined source and target locations. While the term *endpoint* is often used in networking, here it describes a storage location to a high level of detail. An endpoint contains the path to the storage location and additional information.

While there's a single endpoint resource, the properties of each endpoint may vary, based on the type of endpoint. For example, NFS shares, SMB shares, and Azure Storage blob container endpoints each require fundamentally different information.

Endpoints are used in the creation of a job definition. Only certain types of endpoints may be used as a source or a target, respectively. Refer to the [Supported sources and targets](service-overview.md#supported-sources-and-targets) section in the Azure Storage Mover overview article.

Endpoints are parented to the top-level storage mover resource and can be reused across different job definitions.

## Next steps

After understanding the resources involved in an Azure Storage Mover deployment, it's a good idea to start a proof-of-concept deployment. These articles may be good, next reads:

- [Deploy a storage mover resource in your subscription.](storage-mover-create.md)
- [Deploy an Azure Storage Mover agent VM.](agent-deploy.md)
