---
title: VMware assessment support in Azure Migrate
description: Learn about support for VMware VM assessment with Azure Migrate Server Assessment.
ms.topic: conceptual
ms.date: 06/08/2020
---

# Support matrix for VMware assessment 

This article summarizes prerequisites and support requirements when you discover and assess VMware VMs for migration to Azure, using the [Azure Migrate:Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool) tool. To assess VMware VMs, you create an Azure Migrate project, and add the Server Assessment tool to the project. After the tool is added, you deploy the Azure Migrate appliance. The appliance continuously discovers on-premises machines, and sends machine metadata and performance data to Azure. After discovery is complete, you gather discovered machines into groups, and run an assessment for a group. 

If you want to migrate VMware VMs to Azure, review the [migration support matrix](migrate-support-matrix-vmware-migration.md).



## Limitations

**Support** | **Details**
--- | ---
**Project limits** | You can create multiple projects in an Azure subscription.<br/><br/> You can discover and assess up to 35,000 VMware VMs in a single [project](migrate-support-matrix.md#azure-migrate-projects). A project can also include physical servers, and Hyper-V VMs, up to the assessment limits for each.
**Discovery** | The Azure Migrate appliance can discover up to 10,000 VMware VMs on a vCenter Server.
**Assessment** | You can add up to 35,000 machines in a single group.<br/><br/> You can assess up to 35,000 VMs in a single assessment.

[Learn more](concepts-assessment-calculation.md) about assessments.


## VMware requirements

**VMware** | **Details**
--- | ---
**vCenter Server** | Machines you want to discover and assess must be managed by vCenter Server version 5.5, 6.0, 6.5, or 6.7.
**Permissions** | Server Assessment needs a vCenter Server read-only account for discovery and assessment.<br/><br/> If you want to do application discovery or dependency visualization, the account need privileges enable for **Virtual Machines** > **Guest Operations**.

## VM requirements
**VMware** | **Details**
--- | ---
**VMware VMs** | All operating systems can be assessed for migration. 


## Azure Migrate appliance requirements

Azure Migrate uses the [Azure Migrate appliance](migrate-appliance.md) for discovery and assessment. You can deploy the appliance as a VMWare VM using an OVA template, imported into vCenter Server, or using a [PowerShell script](deploy-appliance-script.md).

- Learn about [appliance requirements](migrate-appliance.md#appliance---vmware) for VMware.
- In Azure Government, you must deploy the appliance [using the script](deploy-appliance-script-government.md).
- Review the URLs that the appliance needs to access in [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.


## Port access requirements

**Device** | **Connection**
--- | ---
**Appliance** | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br/><br/> Inbound connections on port 44368 to remotely access the appliance management app using the URL: ```https://<appliance-ip-or-name>:44368``` <br/><br/>Outbound connections on port 443 (HTTPS), to send discovery and performance metadata to Azure Migrate.
**vCenter server** | Inbound connections on TCP port 443 to allow the appliance to collect configuration and performance metadata for assessments. <br/><br/> The appliance connects to vCenter on port 443 by default. If the vCenter server listens on a different port, you can modify the port when you set up discovery.
**ESXi hosts** | If you want to do [app discovery](how-to-discover-applications.md), or [agentless dependency analysis](concepts-dependency-visualization.md#agentless-analysis), then the appliance connects to ESXi hosts on TCP port 443, to discover applications, to and run agentless dependency visualization on VMs.

## Application discovery requirements

In addition to discovering machines, Server Assessment can discover apps, roles, and features running on machines. Discovering your app inventory allows you to identify and plan a migration path tailored for your on-premises workloads. 

**Support** | **Details**
--- | ---
**Supported machines** | App discovery is currently supported for VMware VMs only.
**Discovery** | App discovery is agentless. It uses machine guest credentials, and remotely accesses machines using WMI and SSH calls.
**VM support** | App-discovery is supported for VMs running all  Windows and Linux versions.
**vCenter** | The vCenter Server read-only account used for assessment, needs privileges enabled for **Virtual Machines** > **Guest Operations**, in order to interact with the VM for application discovery.
**VM access** | App discovery needs a local user account on the VM for application discovery.<br/><br/> Azure Migrate currently supports the use of one credential for all Windows servers, and one credential for all Linux servers.<br/><br/> You create a guest user account for Windows VMs, and a regular/normal user account (non-sudo access) for all Linux VMs.
**VMware tools** | VMware tools must be installed and running on VMs you want to discover. <br/><br/> The VMware tools version must be later than 10.2.0.
**PowerShell** | VMs must have PowerShell version 2.0 or later installed.
**Port access** | On ESXi hosts running VMs you want to discover, the Azure Migrate appliance must be able to connect to TCP port 443.
**Limits** | For app-discovery, you can discover up to 10000 VMs on each Azure Migrate appliance.


## Dependency analysis requirements (agentless)

[Dependency analysis](concepts-dependency-visualization.md) helps you to identify dependencies between on-premises machines that you want to assess and migrate to Azure. The table summarizes the requirements for setting up agentless dependency analysis.

**Requirement** | **Details**
--- | --- 
**Before deployment** | You should have an Azure Migrate project in place, with the Server Assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises VMWare machines.<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> [Learn how](how-to-set-up-appliance-vmware.md) to set up the Azure Migrate appliance for assessment of VMware VMs.
**Supported machines** | Currently supported for VMware VMs only.
**Windows VMs** | Windows Server 2016<br/> Windows Server 2012 R2<br/> Windows Server 2012<br/> Windows Server 2008 R2 (64-bit).
**vCenter Server credentials** | Dependency visualization needs a vCenter Server account with read-only access, and privileges enabled for Virtual Machines > Guest Operations.
**Windows VM permissions** |  For dependency analysis, the Azure Migrate appliance needs a domain administrator account, or a local admin account, to access Windows VMs.
**Linux VM permissions** | Red Hat Enterprise Linux 7, 6, 5<br/> Ubuntu Linux 14.04, 16.04<br/> Debian 7, 8<br/> Oracle Linux 6, 7<br/> CentOS 5, 6, 7.
**Linux account** | For dependency analysis, on Linux machines the Azure Migrate appliance needs a user account with Root privilege.<br/><br/> Alternately, the user account needs these permissions on /bin/netstat and /bin/ls files: CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE.
**Required agents** | No agent required on machines you want to analyze.
**VMware Tools** | VMware Tools (later than 10.2) must be installed and running on each VM you want to analyze.

**PowerShell** | Windows VMs must have PowerShell version 2.0 or above installed.
**Port access** | On ESXi hosts running VMs you want to analyze, the Azure Migrate appliance must be able to connect to TCP port 443.


## Dependency analysis requirements (agent-based)

[Dependency analysis](concepts-dependency-visualization.md) helps you to identify dependencies between on-premises machines that you want to assess and migrate to Azure. The table summarizes the requirements for setting up agent-based dependency analysis. 

**Requirement** | **Details** 
--- | --- 
**Before deployment** | You should have an Azure Migrate project in place, with the Azure Migrate: Server Assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises machines<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.
**Supported machines** | Supported for all machines.
**Azure Government** | Dependency visualization isn't available in Azure Government.
**Log Analytics** | Azure Migrate uses the [Service Map](../operations-management-suite/operations-management-suite-service-map.md) solution in [Azure Monitor logs](../log-analytics/log-analytics-overview.md) for dependency visualization.<br/><br/> You associate a new or existing Log Analytics workspace with an Azure Migrate project. The workspace for an Azure Migrate project can't be modified after it's added. <br/><br/> The workspace must be in the same subscription as the Azure Migrate project.<br/><br/> The workspace must reside in the East US, Southeast Asia, or West Europe regions. Workspaces in other regions can't be associated with a project.<br/><br/> The workspace must be in a region in which [Service Map is supported](../azure-monitor/insights/vminsights-enable-overview.md#prerequisites).<br/><br/> In Log Analytics, the workspace associated with Azure Migrate is tagged with the Migration Project key, and the project name.
**Required agents** | On each machine you want to analyze, install the following agents:<br/><br/> The [Microsoft Monitoring agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows).<br/> The [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent).<br/><br/> If on-premises machines aren't connected to the internet, you need to download and install Log Analytics gateway on them.<br/><br/> Learn more about installing the [Dependency agent](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and [MMA](how-to-create-group-machine-dependencies.md#install-the-mma).
**Log Analytics workspace** | The workspace must be in the same subscription as the Azure Migrate project.<br/><br/> Azure Migrate supports workspaces residing in the East US, Southeast Asia, and West Europe regions.<br/><br/>  The workspace must be in a region in which [Service Map is supported](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-enable-overview#prerequisites).<br/><br/> The workspace for an Azure Migrate project can't be modified after it's added.
**Costs** | The Service Map solution doesn't incur any charges for the first 180 days (from the day that you associate the Log Analytics workspace with the Azure Migrate project)/<br/><br/> After 180 days, standard Log Analytics charges will apply.<br/><br/> Using any solution other than Service Map in the associated Log Analytics workspace will incur [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics.<br/><br/> When the Azure Migrate project is deleted, the workspace is not deleted along with it. After deleting the project, Service Map usage isn't free, and each node will be charged as per the paid tier of Log Analytics workspace/<br/><br/>If you have projects that you created before Azure Migrate general availability (GA- 28 February 2018), you might have incurred additional Service Map charges. To ensure payment after 180 days only, we recommend that you create a new project, since existing workspaces before GA are still chargeable.
**Management** | When you register agents to the workspace, you use the ID and key provided by the Azure Migrate project.<br/><br/> You can use the Log Analytics workspace outside Azure Migrate.<br/><br/> If you delete the associated Azure Migrate project, the workspace isn't deleted automatically. [Delete it manually](../azure-monitor/platform/manage-access.md).<br/><br/> Don't delete the workspace created by Azure Migrate, unless you delete the Azure Migrate project. If you do, the dependency visualization functionality will not work as expected.
**Internet connectivity** | If machines aren't connected to the internet, you need to install the Log Analytics gateway on them.
**Azure Government** | Agent-based dependency analysis isn't supported.


## Next steps

- [Review](best-practices-assessment.md) best practices for creating assessments.
- [Prepare for VMware](tutorial-prepare-vmware.md) assessment.

