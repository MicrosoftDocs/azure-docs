---
title: Understanding the Azure Storage Mover resource hierarchy
description: Understanding the Azure Storage Mover resource hierarchy
author: fauhse
ms.author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 06/13/2022
ms.custom: template-concept
---

# Understanding the Azure Storage Mover resource hierarchy

Several Azure resources are involved in a Storage Mover deployment. This article describes each of these resources, their use, was well as best practices for expressing your migration needs with them.

:::image type="content" source="media/resource-hierarchy/resource-hierarchy.png" alt-text="An image showing the hierarchical relationship of Storage Mover Azure resources further described in the article." lightbox="media/resource-hierarchy/resource-hierarchy-large.png":::

## Overview

Azure Storage Mover is a hybrid cloud service. Hybrid services have a cloud service component and an infrastructure component the administrator of the service runs in their corporate environment. For Storage Mover, that hybrid component is a migration agent. Agents are virtual machines, ran on a host near the source storage.

All aspects of a migration are managed from the cloud service. The exception is the process of registering a migration agent. Registration is needed to create a trust relationship with your storage mover instance. Registration of an agent has to be initiated from the agent and with Azure credentials that allow Owner level permissions of the storage mover resource the agent is to be registered with. After registration is complete, the agent can then be controlled through the cloud service (Azure portal, Azure PowerShell/CLI).

## Storage mover resource

A storage mover resource is the name of the top-level service resource, that you'll deploy in a resource group of your choice. All aspects of the service - of your migration - are controlled from here.

In most cases, deploying a single storage mover resource is best for even the largest migration needs. 
- An agent can only be registered to one storage mover. You'll be able to utilize your agents and manage your migrations better, if all resources find their home in the same storage mover instance.
- When you deploy this resource, your subscription is registered with the resource providers *Microsoft.StorageMover* and *Microsoft.HybridCompute*.
- A storage mover resource has a region you'll assign at the time of it's deployment. The region you select is only determining where control messages and metadata about your migration is stored. The data that is migrated, is sent directly from the agent to the target in Azure Storage. Your files never travel through the Storage Mover service. That means the proximity between source, agent, and target storage is more important for migration performance than the location of your storage mover resource.

:::image type="content" source="media/resource-hierarchy/data-vs-management-path.png" alt-text="Illustrating the previous bullet point by showing two arrows. The first arrow for data traveling to a storage account from the source/agent and a second arrow for only the management/control info to the storage mover resource/service." lightbox="media/resource-hierarchy/data-vs-management-path-large.png"::: 

## Migration agent

Storage Mover is a hybrid service and utilizes one or more migration agents to facilitate migrations. The agent is a virtual machine you'll be running in your network. It's also the name of a resource, parented to the storage mover resource you've deployed in your resource group. 

Your agents appear in your storage mover after they have been registered. Registration creates the trust relationship to the storage mover resource you've selected during registration and enables you to manage all migration related aspects from the cloud service. (Azure portal, Azure PowerShell/CLI)

You can deploy several migration agent VMs and register each with a unique name to the same storage mover resource. If you have migration needs in different locations, it's best to have a migration agent very close to the source storage you'd like to migrate.

> [!TIP]
> The proximity and network quality between your migration agent and the target storage in Azure determine migration velocity in early stages of your migration. The region of the storage mover resource you've deployed doesn't play a role for performance.

> [!NOTE]
> In order to minimize downtime for your workload, you may decide to copy multiple times from source to target. In later copy runs, migration velocity is often more influenced by the speed at which the migration agent can evaluate if a file needs to be copied or not. In later migration stages, local compute and memory resources on an agent become more important to the migration velocity than network quality.

## Migration project

A project allows you to organize your larger scale cloud migration into smaller, more manageable units that make sense for your situation.

The smallest unit of a migration can be defined as the contents of one source moving into one target. But data center migrations are rarely that simple. Often multiple sources support one workload and must be migrated somewhat together for timely failover of the workload to the new cloud storage locations in Azure. 

In a different example, one source may even need to be split into multiple target locations. The reverse is also possible, where you'll need to combine multiple sources into sub-paths of the same target location in Azure.

:::image type="content" source="media/resource-hierarchy/project-illustration.png" alt-text="an image showing the nested relationship of a project into a storage mover resource. It also shows child objects of the resource, called job definitions, described later in this article." lightbox="media/resource-hierarchy/project-illustration-large.png":::

Grouping sources into a project doesn't mean you have to migrate all of them in parallel. You have control over what to run and when to run it. The remaining paragraphs in this article describe additional resources that allow for such fine-grained control.

> [!TIP]
> You can optionally add a description to your project. That might help to keep track of additional information for your project. If you've already created a migration plan elsewhere, the description field can be used to link this project to your plan. You might also use it to record other information a colleague might need later on. You can add descriptions to all storage mover resources and each description can contain up to 1024 characters.

## Job definition

A Job definition is contained in a project. The job definition describes a source, a target, and the migration settings you want to use the next time you start a copy from the defined source to the defined target in Azure.

> [!IMPORTANT]
> Once a job definition was created, source and target information cannot be changed. However, migration settings can be changed any time. They'll take effect at the next time you start a copy.

Here is an example for why changing source and target information is prohibited in a job definition. Let's say you define *Share A* as the source and copy to your target a few times. Let's also assume the the source can be changed in a job definition, and you change it to *Share B*. That can have potentially dangerous consequences.

A common migration setting mirrors source to target. If that is applied to your migration, files from *Share A* might get deleted in the target, as soon as you start copying files from *Share B*. To prevent mistakes, source, target, and their optional sub-path information are locked when a job definition is created. If you want to reuse the same target but use a different source (or vice versa), you'll ave to create a new job definition.

The job definition also keeps a historic record of past copy runs and their results.

## Job run

When you start a job definition, a new resource is implicitly created: a job run resource. The job definition contains all the information the storage mover service needs to start a copy. In a typical migration, you might copy from source to target several times. Each time you start a job definition, that is recorded in a job run.

The job run or *job* in short, is given to the migration agent you've selected. The agent will then have all the necessary information about source, target, and the migration behavior it needs to follow to accomplish the migration you've previously defined.

A job run has a state, progress information and copy result information. You'll find the most critical information about your job run as properties on the job run resource itself. The migration agent has a custom telemetry channel that allows it to store this information directly in the job run resource.

The agent also emits additional information and migration results through the Azure Monitor service:
- **Metrics** are numerical values, recorded over time. They can be plotted using the Azure Monitor service. Some selected metrics are also directly available when managing the job definition / job runs in the portal.
- **Copy logs** are optional. If enabled, every job run has it's own copy log. A log entry is generated for each namespace item the agent encounters in the source, that cannot be copied. Success logs are currently not available.

> [!IMPORTANT]
> Metric information is available by default, but you must opt-in to enable copy logs. That can be done as part of creating your storage mover resource and also later on. If you want to check if copy logs are enabled, or manage details, you can use the *Diagnostic settings* menu on the Azure portal page for your storage mover resource.

Learn more about telemetry, metrics and logs in the [job definition monitoring article](job-definitions-monitor.md).

## Endpoint

Migrations require well defined source and target locations. While the term *endpoint* is often used in networking, here it describes a storage location to a high level of detail. An endpoint contains the path to the storage location and additional information.

While there is a single endpoint resource, the properties of each endpoint may vary, based on the type of endpoint. For example, an NFS share endpoint needs fundamentally different information as compared to an Azure Storage blob container endpoint.

Endpoints are used in the creation of a job definition. Only certain types of endpoints may be used as a source or a target, respectively. Refer to the [Supported sources and targets](service-overview.md#supported-sources-and-targets) section in the Azure Storage Mover overview article.

Endpoints are parented to the top-level storage mover resource and can be reused across different job definitions.

## Next steps

