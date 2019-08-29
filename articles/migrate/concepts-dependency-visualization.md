---
title: Dependency visualization in Azure Migrate | Microsoft Docs
description: Provides an overview of assessment calculations in the Server Assessment service in Azure Migrate
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/18/2019
ms.author: hamusa
---

# Dependency visualization

Azure Migrate: Server Assessment assesses groups of on-premises machines for migration to Azure. You can use the dependency visualization functionality in Server Assessment to create groups. This article provides information about this feature.

> [!NOTE]
> The dependency visualization functionality is not available in Azure Government.

## Overview

Dependency visualization in Server Assessment allows you to create high-confidence groups for migration assessments. Using dependency visualization, you can view network dependencies of machines and identify related machines that need to be migrated together to Azure. This functionality is useful in scenarios where you are not completely aware of the machines that constitute your application and need to be migrated together to Azure.

## Before you start

- Make sure you've [created](how-to-add-tool-first-time.md) an Azure Migrate project.
- If you've already created a project, make sure you've [added](how-to-assess.md) the Azure Migrate: Server Assessment tool.
- Make sure you have discovered your machines in Azure Migrate; you can do this by setting up an Azure Migrate appliance for [VMware](how-to-set-up-appliance-vmware.md) or [Hyper-V](how-to-set-up-appliance-hyper-v.md). The appliance discovers on-premises machines, and sends metadata and performance data to Azure Migrate: Server Assessment. [Learn more](migrate-appliance.md).

## How does it work?

Azure Migrate uses the [Service Map](../operations-management-suite/operations-management-suite-service-map.md) solution in [Azure Monitor logs](../log-analytics/log-analytics-overview.md) for dependency visualization.
- To leverage dependency visualization, you need to associate a Log Analytics workspace, either new or existing, with an Azure Migrate project.
- You can only create or attach a workspace in the same subscription where the Azure Migrate project is created.
- To attach a Log Analytics workspace to a project:
    1. In the **Servers** tab, in **Azure Migrate: Server Assessment** tile, click **Overview**.
    2. In **Overview**, click the down arrow to expand **Essentials**.
    3. In **OMS Workspace**, click **Requires configuration**.
    4. In **Configure workspace**, specify whether you want to create a new workspace, or use an existing one:
    
    ![Add workspace](./media/how-to-create-group-machine-dependencies/workspace.png)

- While associating a workspace, you will get the option to create a new workspace or attach an existing one:
  - When you create a new workspace, you need to specify a name for the workspace. The workspace is then created in a region in the same [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) as the migration project.
  - When you attach an existing workspace, you can pick from all the available workspaces in the same subscription as the migration project. Note that only those workspaces are listed which were created in a region where [Service Map is supported](../azure-monitor/insights/vminsights-enable-overview.md#prerequisites). To be able to attach a workspace, ensure that you have 'Reader' access to the workspace.

  > [!NOTE]
  > Once you have attached a workspace to a project, you cannot change it later.

- The associated workspace is tagged with the key **Migration Project**, and value **Project name**, which you can use to search in the Azure portal.
- To navigate to the workspace associated with the project, you can go to **Essentials** section of the project **Overview** page and access the workspace

    ![Navigate Log Analytics workspace](./media/concepts-dependency-visualization/oms-workspace.png)

To use dependency visualization, you need to download and install agents on each on-premises machine that you want to analyze.  

- [Microsoft Monitoring agent(MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows) needs to be installed on each machine. [Learn more](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies#install-the-mma) about how to install the MMA agent.
- The [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent) needs to be installed on each machine. [Learn more](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies#install-the-dependency-agent) about how to install the dependency agent.
- In addition, if you have machines with no internet connectivity, you need to download and install Log Analytics gateway on them.

You don't need these agents on machines you want to assess unless you're using dependency visualization.

## Do I need to pay for it?

The dependency visualization feature is available at no additional charge. Use of the dependency visualization feature in Server Assessment requires Service Map and requires you to associate a Log Analytics workspace, either new or existing, with the Azure Migrate project. The dependency visualization functionality in Server Assessment is free for the first 180 days.

1. Use of any solutions other than Service Map within this Log Analytics workspace will incur [standard Log Analytics](https://azure.microsoft.com/pricing/details/log-analytics/) charges.
2. To support migration scenarios at no additional cost, the Service Map solution will not incur any charges for the first 180 days from the day of associating the Log Analytics workspace with the Azure Migrate project. After 180 days, standard Log Analytics charges will apply.

When you register agents to the workspace, use the ID and the Key given by the project on the install agent steps page.

When the Azure Migrate project is deleted, the workspace is not deleted along with it. Post the project deletion, the Service Map usage will not be free, and each node will be charged as per the paid tier of Log Analytics workspace.

> [!NOTE]
> The dependency visualization feature uses Service Map via a Log Analytics workspace. Since 28 February 2018, with the announcement of Azure Migrate general availability, the feature is now available at no extra charge. You will need to create a new project to make use of the free usage workspace. Existing workspaces before general availability are still chargeable, hence we recommend you to move to a new project.

Learn more about Azure Migrate pricing [here](https://azure.microsoft.com/pricing/details/azure-migrate/).

## How do I manage the workspace?

You can use the Log Analytics workspace outside Azure Migrate. It's not deleted if you delete the Azure Migrate project in which it was created. If you no longer need the workspace, [delete it](../azure-monitor/platform/manage-access.md) manually.

Don't delete the workspace created by Azure Migrate, unless you delete the Azure Migrate project. If you do, the dependency visualization functionality will not work as expected.

## Next steps
- [Group machines using machine dependencies](how-to-create-group-machine-dependencies.md)
- [Learn more](https://docs.microsoft.com/azure/migrate/resources-faq#what-is-dependency-visualization) about the FAQs on dependency visualization.
