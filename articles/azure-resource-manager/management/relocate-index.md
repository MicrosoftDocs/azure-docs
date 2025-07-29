---
title: How to relocate cloud workloads
description: Discover the process for relocating cloud workloads and applications to another region.
author: SomilGanguly
ms.author: ssumner
ms.date: 12/18/2023
ms.reviewer: ssumner
ms.topic: conceptual
ms.custom: internal
keywords: cloud adoption, cloud framework, cloud adoption framework
---
# Relocate cloud workloads

The relocate guidance shows you how to set up a relocation project and relocate one or more workloads.

:::image type="content" source="./media/relocate/relocate.svg" alt-text="Diagram showing the relocation process. There are two phases and five steps. The first phase is the Initiate phase, and it has one step called Initiate. The second phase is the Move phase, and it has four steps that you repeat for each workload. The steps are Evaluate, Select, Migrate, and Cutover." lightbox="./media/relocate/relocate.svg" border="false":::

## What is relocation?

Relocation is the process of moving a workload or workload component in Azure to a different Azure region. A workload is a collection of applications, environments, services, and data that support a defined process. A workload can have one or many applications. Relocating a single or multi-app workload to a different region is a type of migration and has similarities with the process defined in the [migration to Azure guidance](/azure/cloud-adoption-framework/migrate/). But relocation also has its own solutions and considerations to implement, and the relocate guidance here outlines these distinctive features to help you navigate the relocation process.

:::image type="content" source="./media/relocate/single-multi-workload.png" alt-text="Diagram showing a single-app workload and a multi-app workload. There's a workload with a single application in it. The other workload has n applications in it, representing an indefinite number of applications. The applications in each workload show a production and nonproduction environments. In each environment, there's three representational services, one for compute, one for the database, and the other for an indefinite number of other Azure services." lightbox="./media/relocate/single-multi-workload.png" border="false":::

## Why relocate?

Relocation adds flexibility that can help you optimize cost and performance throughout the lifecycle of your workloads. When workloads are first deployed or migrated to Azure, you make a decision about their region. However, as time passes, you should review that decision to see if a different region might be a better fit. For example, another region could have services or capabilities unavailable in the current region, or you might want to move your workload closer to a new customer base. Data residency laws might change, or budgets could shift. Rather than work around these changes and encounter cost or performance issues, a relocation might be the best way to proceed for your workload.

| Relocation drivers | Examples |
| --- | --- |
| Business developments | Respond to business changes and expand your global footprint. |
| Compliance | Meet data sovereignty and residency requirements. |
| Proximity | Provide lower latency to end users. |

## How to relocate

Relocation has two phases. The first phase is to initiate the relocation project. The second phase is to move the workload by planning and executing the relocation. Here's an overview of each phase:

- *Initiate phase*: The initiate phase has a single-step also called Initiate. The goal of the Initiate phase is to set up the relocation project, get stakeholder approval, and identify workloads for relocation.

- *Move phase*: The Move phase is a four-step process to plan and move a workload to a different region. The steps in the Move Phase are (1) evaluate, (2) select, (3) migrate, and (4) cutover. After you cut over the final workload, you need to officially close to the relocation project.

| Relocate steps | Main goal |
| --- | --- |
|1. Initiate | Establish relocation project. |
|2. Evaluate| Conduct workload discovery. |
|3. Select| Pick the right relocation method. |
|4. Migrate| Relocate the workload. |
|5. Cutover| Direct traffic to new location. |

These phases define the lifecycle of a relocation project. It's important to note that not every resource supports relocation. Some require redeployment. For more information, see [Move operation support for resources](/azure/azure-resource-manager/management/move-support-resources).

## Assumptions

You should read relocation best practices and use them as guidance for each workload relocation. The following articles detail how you should approach each step. The content highlights critical areas to focus on but also refers you to other documentation for deeper technical insight. It assumes a basic understanding of Azure regions and service availability. For more information, see:

- [Azure regions selection guide](/azure/cloud-adoption-framework/ready/azure-setup-guide/regions)
- [Special conditions to consider when moving a resource](/azure/azure-resource-manager/management/move-support-resources)
- [Azure Products by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/)
- [Azure regions and availability zones](/azure/reliability/availability-zones-overview)
- [List of region pairs](/azure/reliability/cross-region-replication-azure#azure-cross-region-replication-pairings-for-all-geographies)
- [Azure Services](/azure/reliability/availability-service-by-category)
- [How to move resources](/azure/resource-mover/move-region-within-resource-group)

Whether you're relocating multiple workloads or just one, you can aid the success of relocation with some formal relocation planning. The Initiate phase provides required guidance.

> [!div class="nextstepaction"]
> [Initiate](./relocate-initiate.md)