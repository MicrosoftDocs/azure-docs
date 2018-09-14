---
title: Dependency visualization in Azure Migrate | Microsoft Docs
description: Provides an overview of assessment calculations in the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 09/14/2018
ms.author: raynew
---

# Dependency visualization

The [Azure Migrate](migrate-overview.md) services assesses groups of on-premises machines for migration to Azure. To group machines together, you can use dependency visualization. This article provides information about this feature.


## Overview

Dependency visualization in Azure Migrate allows you to create groups for migration assess with increased confidence. Using dependency visualization you can view the network dependencies of specific machines, or across a group of machines. This is useful to ensure that no functionality or lost (or machines forgotten) in the migration process, when apps and workloads run across multiple machines.  

## How does it work?

Azure Migrate uses the [Service Map](../operations-management-suite/operations-management-suite-service-map.md) solution in [Log Analytics](../log-analytics/log-analytics-overview.md) for dependency visualization.
- When you create an Azure Migration project, a Log Analytics workspace is created in your subscription.
- The workspace name is the name you specify for the migration project, prefixed with **migrate-**, and optionally suffixed with a number.
- Navigate to the Log Analytics workspace from the **Essentials** section of the project **Overview** page.
- The created workspace is tagged with the key **Migration Project**, and value **project name**. You can use these to search in the Azure portal.  

    ![Log Analytics workspace](./media/concepts-dependency-visualization/oms-workspace.png)

To use dependency visualization, you need to download and install agents on each on-premises machine that you want to analyze.  

## Do I need to pay for it?

Azure Migrate is available at no additional charge. Use of the dependency visualization features in Azure Migrate require Service Map. At the creation of an Azure Migrate project, Azure Migrate will automatically create a new Log Analytics workspace on your behalf.

> [!NOTE]
> The dependency visualization feature uses Service Map via a Log Analytics workspace. Since 28 February 2018, with the announcement of Azure Migrate general availability, the feature is now available at no extra charge. You will need to create a new project to make use of the free usage workspace. Existing workspaces before general availaibility are still chargable, hence we recommend you to move to a new project.

1. Use of any solutions other than Service Map within this Log Analytics workspace will incur standard Log Analytics charges.
2. To support migration scenarios at no additional cost, the Service Map solution will not incur any charges for the first 180 days from creation of the Azure Migrate project, after which standard charges will apply.
3. Only the workspace created as part of the project creation, will be free for use.

When you register agents to the workspace, use the ID and the Key given by the project on the install agent steps page. You cannot use an existing workspace and associate it with the Azure Migrate project.

When the Azure Migrate project is deleted, the workspace is not deleted along with it. Post the project deletion, the Service Map usage will not be free and each node will be charged as per the paid tier of Log Analytics workspace.

Learn more about Azure Migrate pricing [here](https://azure.microsoft.com/pricing/details/azure-migrate/).

## How do I manage the workspace?

You can use the Log Analytics workspace outside Azure Migrate. It's not deleted if you delete the migration project in which it was created. If you no longer need the workspace, [delete it](../log-analytics/log-analytics-manage-access.md) manually.

Don't delete the workspace created by Azure Migrate, unless you delete the migration project. If you do, dependencies don't work as expected.

## Next steps

[Group machines using machine dependencies](how-to-create-group-machine-dependencies.md)
