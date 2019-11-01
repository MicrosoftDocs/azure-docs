---
title: Dependency visualization in Azure Migrate
description: Provides an overview of assessment calculations in the Server Assessment service in Azure Migrate
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 10/23/2019
ms.author: hamusa
---

# Dependency visualization

This article describes the dependency visualization feature in Azure Migrate: Server Assessment.

Dependency visualization helps you to understand dependencies across machines that you want to assess and migrate. You typically use dependency mapping when you want to assess machines with higher levels of confidence.

- In Azure Migrate: Server Assessment, you gather machines together into groups for assessment. Groups usually consist of machines that you want to migrate together, and dependency visualization helps you to cross-check machine dependencies, so that you can group machines accurately.
- Using visualization, you can discover interdependent systems that need to migrate together. You can identify whether running systems are still in use, or whether systems can be decommissioned instead of migrated.
- Visualizing dependencies helps ensure that nothing is left behind, and avoid surprise outages during migration.
- This feature is especially useful if you're not completely aware of machines that are part of apps, and thus should be migrated together to Azure.


> [!NOTE]
> The dependency visualization functionality is not available in Azure Government.

## Agent-based and agentless

There are two options for deploying dependency visualization:

- **Agentless dependency visualization**: This option is currently in preview. It doesn't require you to install any agents on machines. 
    - It works by capturing the TCP connection data from machines for which it's enabled. [Learn more](how-to-create-group-machine-dependencies-agentless.md).
After dependency discovery is started, the appliance gathers data from machines at a polling interval of five minutes.
    - The following data is collected:
        - TCP connections
        - Names of processes that have active connections
        - Names of installed applications that run the above processes
        - No. of connections detected at every polling interval
- **Agent-based dependency visualization**: To use agent-based dependency visualization, you need to download and install the following agents on each on-premises machine that you want to analyze.  
    - [Microsoft Monitoring agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows) needs to be installed on each machine. [Learn more](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies#install-the-mma) about how to install the MMA agent.
    - The [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent) needs to be installed on each machine. [Learn more](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies#install-the-dependency-agent) about how to install the dependency agent.
    - In addition, if you have machines with no internet connectivity, you need to download and install Log Analytics gateway on them.

## Agent-based requirements

### What do I need to deploy dependency visualization?

Before you deploy dependency visualization you should have an Azure Migrate project in place, with the Azure Migrate: Server Assessment tool added to the project. You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises machines.

[Learn more](how-to-assess.md) about adding the tool, and deploying an appliance for [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.


### How does it work?

Azure Migrate uses the [Service Map](../operations-management-suite/operations-management-suite-service-map.md) solution in [Azure Monitor logs](../log-analytics/log-analytics-overview.md) for dependency visualization.

- To leverage dependency visualization, you need to associate a Log Analytics workspace (new or existing), with an Azure Migrate project.
- The workspace must be in the same subscription as that in which you create the Azure Migrate project.
- Azure Migrate supports workspaces residing in the East US, Southeast Asia and West Europe regions. Workspaces in other regions can't be associated with a project. Also, note that the workspace must be in a region in which [Service Map is supported](../azure-monitor/insights/vminsights-enable-overview.md#prerequisites).
- The workspace for an Azure Migrate project can't be modified after it's added.
- In Log Analytics, the workspace associated with Azure Migrate is tagged with the Migration Project key, and the project name.

    ![Navigate Log Analytics workspace](./media/concepts-dependency-visualization/oms-workspace.png)



### Do I need to pay for it?

Dependency visualization requires Service Map and an associated Log Analytics workspace. 

- The Service Map solution doesn't incur any charges for the first 180 days. This is from the day that you associated the Log Analytics workspace with the Azure Migrate project.
- After 180 days, standard Log Analytics charges will apply.
- Using any solution other than Service Map in the associated Log Analytics workspace will incur [standard Log Analytics](https://azure.microsoft.com/pricing/details/log-analytics/) charges.
- When the Azure Migrate project is deleted, the workspace is not deleted along with it. After deleting the project, Service Map usage isn't free, and each node will be charged as per the paid tier of Log Analytics workspace.

Learn more about Azure Migrate pricing [here](https://azure.microsoft.com/pricing/details/azure-migrate/).

> [!NOTE]
> If you have projects that you created before Azure Migrate general availability in 28 February 2018, you might have incurred additional Service Map charges. To ensure you only pay after 180 days, we recommend that you create a new project, since existing workspaces before general availability are still chargeable.



### How do I manage the workspace?

- When you register agents to the workspace, you use the ID and key provided by the Azure Migrate project.
- You can use the Log Analytics workspace outside Azure Migrate.
- If you delete the associated Azure Migrate project, the workspace isn't deleted automatically. You need to [delete it manually](../azure-monitor/platform/manage-access.md).
- Don't delete the workspace created by Azure Migrate, unless you delete the Azure Migrate project. If you do, the dependency visualization functionality will not work as expected.

## Next steps
- [Group machines using machine dependencies](how-to-create-group-machine-dependencies.md)
- [Learn more](https://docs.microsoft.com/azure/migrate/resources-faq#what-is-dependency-visualization) about the FAQs on dependency visualization.


