---
title: Support for dependency analysis in Azure Migrate Server Assessment
description: Learn about support for dependency analysis with Azure Migrate Server Assessment.
ms.topic: conceptual
ms.date: 03/11/2020
---

# Support matrix for dependency analysis

This article summarizes prerequisites and support requirements for dependency analysis in Azure Migrate:Server Assessment. Dependency analysis helps you to identify dependencies between on-premises machines that you want to assess and migrate to Azure. [Learn](concepts-dependency-visualization.md) about dependency analysis, and [compare](concepts-dependency-visualization.md#compare-agentless-and-agent-based) agent-based dependency analysis with agentless analysis.

## Agentless requirements

The table summarizes the requirements for setting up agentless dependency analysis. 

**Requirement** | **Details** 
--- | --- 
**Before deployment** | You should have an Azure Migrate project in place, with the Azure Migrate: Server Assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises VMWare machines.<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> [Learn how](how-to-set-up-appliance-vmware.md) to set up the Azure Migrate appliance for assessment of VMware VMs.
**VM support** | Currently supported for VMware VMs only.
**Windows VMs** | Windows Server 2016<br/> Windows Server 2012 R2<br/> Windows Server 2012<br/> Windows Server 2008 R2 (64-bit).
**Windows account** |  Fpr dependency analysis, the Azure Migrate appliance needs a local or a domain Administrator account to access Windows VMs.
**Linux VMs** | Red Hat Enterprise Linux 7, 6, 5<br/> Ubuntu Linux 14.04, 16.04<br/> Debian 7, 8<br/> Oracle Linux 6, 7<br/> CentOS 5, 6, 7.
**Linux account** | For dependency analysis, on Linux machines the Azure Migrate appliance needs a user account with Root privilege.<br/><br/> Alternately, the user account needs these permissions on /bin/netstat and /bin/ls files: CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE.
**Required agents** | No agent required on machines you want to analyze.
**VMware tools**: VMware Tools (later than 10.2) must be installed and running on each VM you want to analyze.
**vCenter Server**: Dependency visualization needs a vCenter Server account with read-only access, and privileges enabled for Virtual Machines > Guest Operations.**ESXi hosts**: On ESXi hosts running VMs you want to analyze, the Azure Migrate appliance must be able to connect to TCP port 443.


## Agent-based requirements

The table summarizes what you need to deploy agent-based analysis.

**Requirement** | **Details** 
--- | --- 
**Before deployment** | You should have an Azure Migrate project in place, with the Azure Migrate: Server Assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises machines<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.
**Azure Government** | Dependency visualization isn't available in Azure Government.
**Log Analytics** | Azure Migrate uses the [Service Map](../operations-management-suite/operations-management-suite-service-map.md) solution in [Azure Monitor logs](../log-analytics/log-analytics-overview.md) for dependency visualization.<br/><br/> You associate a new or existing Log Analytics workspace with an Azure Migrate project. The workspace for an Azure Migrate project can't be modified after it's added. <br/><br/> The workspace must be in the same subscription as the Azure Migrate project.<br/><br/> The workspace must reside in the East US, Southeast Asia, or West Europe regions. Workspaces in other regions can't be associated with a project.<br/><br/> The workspace must be in a region in which [Service Map is supported](../azure-monitor/insights/vminsights-enable-overview.md#prerequisites).<br/><br/> In Log Analytics, the workspace associated with Azure Migrate is tagged with the Migration Project key, and the project name.
**Required agents** | On each machine you want to analyze, install the following agents:<br/><br/> The [Microsoft Monitoring agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows).<br/> The [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent).<br/><br/> If on-premises machines aren't connected to the internet, you need to download and install Log Analytics gateway on them. | Learn more about installing the [Dependency agent](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and [MMA](how-to-create-group-machine-dependencies.md#install-the-mma).
**Log Analytics workspace** | The workspace must be in the same subscription as the Azure Migrate project.<br/><br/> Azure Migrate supports workspaces residing in the East US, Southeast Asia and West Europe regions.<br/><br/>  The workspace must be in a region in which [Service Map is supported](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-enable-overview#prerequisites).<br/><br/> The workspace for an Azure Migrate project can't be modified after it's added.
**Costs** | The Service Map solution doesn't incur any charges for the first 180 days (from the day that you associate the Log Analytics workspace with the Azure Migrate project)/<br/><br/> After 180 days, standard Log Analytics charges will apply.<br/><br/> Using any solution other than Service Map in the associated Log Analytics workspace will incur [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics.<br/><br/> When the Azure Migrate project is deleted, the workspace is not deleted along with it. After deleting the project, Service Map usage isn't free, and each node will be charged as per the paid tier of Log Analytics workspace/<br/><br/>If you have projects that you created before Azure Migrate general availability (GA- 28 February 2018), you might have incurred additional Service Map charges. To ensure payment after 180 days only, we recommend that you create a new project, since existing workspaces before GA are still chargeable.
**Management** | When you register agents to the workspace, you use the ID and key provided by the Azure Migrate project.<br/><br/> You can use the Log Analytics workspace outside Azure Migrate.<br/><br/> If you delete the associated Azure Migrate project, the workspace isn't deleted automatically. [Delete it manually](../azure-monitor/platform/manage-access.md).<br/><br/> Don't delete the workspace created by Azure Migrate, unless you delete the Azure Migrate project. If you do, the dependency visualization functionality will not work as expected.
**Internet connectivity** | If machines aren't connected to the internet, you need to install the Log Analytics gateway on them.

## Next steps

- [Try out](how-to-create-group-machine-dependencies-agentless.md)  agentless dependency visualization for VMware VMs.
- [Set up](how-to-create-group-machine-dependencies.md) agent-based dependency analysis.
- Review [common questions](common-questions-discovery-assessment.md#what-is-dependency-visualization) about dependency visualization.


