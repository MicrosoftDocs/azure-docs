---
title: Support for dependency analysis in Azure Migrate Server Assessment
description: Learn about support for dependency analysis with Azure Migrate Server Assessment.
ms.topic: conceptual
ms.date: 03/11/2020
---

# Support matrix for dependency analysis

This article summarizes support requirements and prerequisites for dependency analysis in Azure Migrate:Server Assessment. Dependency analysis helps you to identify dependencies between on-premises machines that you want to assess and migrate to Azure. [Learn](concepts-dependency-visualization.md) about dependency analysis, and [compare](concepts-dependency-visualization.md#compare-agentless-and-agent-based) agent-based dependency analysis with agentless analysis.

## Agentless requirements

The table summarizes the requirements for setting up agentless dependency analysis. 

**Requirement** | **Details** 
--- | --- 
**Before deployment** | You should have an Azure Migrate project in place, with the Azure Migrate: Server Assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises VMWare machines.<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> [Learn how](how-to-set-up-appliance-vmware.md) to set up the Azure Migrate appliance for assessment of VMware VMs.
**Required agents** | No agent required on machines you want to analyze.
**Supported operating systems** | Review the [operating systems](migrate-support-matrix-vmware.md#agentless-dependency-visualization) supported for agentless visualization.
**VMs** | **VMware tools**: VMware Tools must be installed and running on VMs you want to analyze.
**VMware** | **vCenter**: The appliance needs a vCenter Server account with read-only access, and privileges enabled for Virtual Machines > Guest Operations.<br/><br/> **ESXi hosts**: On ESXi hosts running VMs you want to analyze, the Azure Migrate appliance must be able to connect to TCP port 443.
**Azure Migrate appliance** |  On the [Azure Migrate appliance](migrate-appliance.md), you need to add a user account that can be used to access VMs for analysis.<br/><br/> **Windows VMs**: The user account needs to be a local or a domain administrator on the machine.<br/><br/> **Linux VMs**: The root privilege is required on the account. Alternately, the user account requires these two capabilities on /bin/netstat and /bin/ls files: CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE.

## Agent-based requirements

The table summarizes what you need to deploy agent-based analysis.

**Requirement** | **Details** 
--- | --- 
**Before deployment** | You should have an Azure Migrate project in place, with the Azure Migrate: Server Assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises machines<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.
**Required agents** | On each machine you want to analyze, install the following agents:<br/><br/> The [Microsoft Monitoring agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows).<br/> The [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent).<br/><br/> If on-premises machines aren't connected to the internet, you need to download and install Log Analytics gateway on them. | Learn more about installing the [Dependency agent](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and [MMA](how-to-create-group-machine-dependencies.md#install-the-mma).
**Log Analytics** | Azure Migrate uses the [Service Map](../operations-management-suite/operations-management-suite-service-map.md) solution in [Azure Monitor logs](../log-analytics/log-analytics-overview.md) for dependency visualization.<br/><br/> You associate a new or existing Log Analytics workspace with an Azure Migrate project. The workspace for an Azure Migrate project can't be modified after it's added. <br/><br/> The workspace must be in the same subscription as the Azure Migrate project.<br/><br/> The workspace must reside in the East US, Southeast Asia, or West Europe regions. Workspaces in other regions can't be associated with a project.<br/><br/> The workspace must be in a region in which [Service Map is supported](../azure-monitor/insights/vminsights-enable-overview.md#prerequisites).<br/><br/> In Log Analytics, the workspace associated with Azure Migrate is tagged with the Migration Project key, and the project name.
**Costs** | The Service Map solution doesn't incur any charges for the first 180 days (from the day that you associate the Log Analytics workspace with the Azure Migrate project)/<br/><br/> After 180 days, standard Log Analytics charges will apply.<br/><br/> Using any solution other than Service Map in the associated Log Analytics workspace will incur [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics.<br/><br/> When the Azure Migrate project is deleted, the workspace is not deleted along with it. After deleting the project, Service Map usage isn't free, and each node will be charged as per the paid tier of Log Analytics workspace/<br/><br/>If you have projects that you created before Azure Migrate general availability (GA- 28 February 2018), you might have incurred additional Service Map charges. To ensure payment after 180 days only, we recommend that you create a new project, since existing workspaces before GA are still chargeable.
**Management** | When you register agents to the workspace, you use the ID and key provided by the Azure Migrate project.<br/><br/> You can use the Log Analytics workspace outside Azure Migrate.<br/><br/> If you delete the associated Azure Migrate project, the workspace isn't deleted automatically. [Delete it manually](../azure-monitor/platform/manage-access.md).<br/><br/> Don't delete the workspace created by Azure Migrate, unless you delete the Azure Migrate project. If you do, the dependency visualization functionality will not work as expected.

## Next steps

- [Try out](how-to-create-group-machine-dependencies-agentless.md)  agentless dependency visualization for VMware VMs.
- [Set up](how-to-create-group-machine-dependencies.md) agent-based dependency analysis.
- Review [common questions](common-questions-discovery-assessment.md#what-is-dependency-visualization) about dependency visualization.


