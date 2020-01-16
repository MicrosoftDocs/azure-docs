---
title: VMware assessment support in Azure Migrate
description: Learn about VMware assessment support in Azure Migrate.
ms.topic: conceptual
ms.date: 01/08/2020
---

# Support matrix for VMware assessment 

This article summarizes support settings and limitations for assessing VMware VMs with [Azure Migrate: Server Assessment](migrate-services-overview.md#azure-migrate-server-migration-tool). If you're looking for information about migrating VMware VMs to Azure, review the [migration support matrix](migrate-support-matrix-vmware-migration.md).

## Overview

To assess on-premises machines for migration to Azure with this article, you add the Azure Migrate: Server Assessment tool to an Azure Migrate project. You deploy the [Azure Migrate appliance](migrate-appliance.md). The appliance continuously discovers on-premises machines, and sends configuration and performance data to Azure. After machine discovery, you gather discovered machines into groups, and run an assessment for a group.


## Limitations

**Support** | **Details**
--- | ---
**Assessment limits**| Discover and assess up to 35,000 VMware VMs in a single [project](migrate-support-matrix.md#azure-migrate-projects).
**Project limits** | You can create multiple projects in an Azure subscription. A project can include VMware VMs, Hyper-V VMs, and physical servers, up to the assessment limits.
**Discovery** | The Azure Migrate appliance can discover up to 10,000 VMware VMs on a vCenter Server.
**Assessment** | You can add up to 35,000 machines in a single group.<br/><br/> You can assess up to 35,000 VMs in a single assessment.

[Learn more](concepts-assessment-calculation.md) about assessments.


## Application discovery

In addition to discovering machines, Azure Migrate: Server Assessment can discover apps, role, and features running on machines. Discovering your app inventory allows you to identify and plan a migration path tailored for your on-premises workloads. 

**Support** | **Details**
--- | ---
**Discovery** | Discovery is agentless, using machine guest credentials, and remotely accessing machines using WMI and SSH calls.
**Supported machines** | On-premises VMware VMs.
**Machine operating system** | All Windows and Linux versions.
**vCenter credentials** | A vCenter Server account with read-only access, and privileges enabled for Virtual Machines > Guest Operations.
**VM credentials** | Currently supports the use of one credential for all Windows servers, and one credential for all Linux servers.<br/><br/> You create a guest user account for Windows VMs, and a regular/normal user account (non-sudo access) for all Linux VMs.
**VMware tools** | VMware tools must be installed and running on VMs you want to discover.
**Port access** | On ESXi hosts running VMs you want to discover, the Azure Migrate appliance must be able to connect to TCP port 443.
**Limits** | For app-discovery  you can discover up to 10000 per appliance. 

## VMware requirements

**VMware** | **Details**
--- | ---
**vCenter Server** | Machines you want to discovery and assess must be managed by vCenter Server version 5.5, 6.0, 6.5, or 6.7.
**Permissions (assessment)** | vCenter Server read-only account.
**Permissions (app-discovery)** | vCenter Server account with read-only access, and privileges enabled for Virtual machines > Guest Operations.
**Permissions (dependency visualization)** | Center Server account with read-only access, and privileges enabled for **Virtual machines** > **Guest Operations**.


## Azure Migrate appliance requirements

Azure Migrate uses the [Azure Migrate appliance](migrate-appliance.md) for discovery and assessment. The appliance for VMware is deployed using an OVA template, imported into vCenter Server. 

- Learn about [appliance requirements](migrate-appliance.md#appliance---vmware) for VMware.
- Learn about [URLs](migrate-appliance.md#url-access) the appliance needs to access.

## Port access

**Device** | **Connection**
--- | ---
Appliance | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br/><br/> Inbound connections on port 44368 to remotely access the appliance management app using the URL: ```https://<appliance-ip-or-name>:44368``` <br/><br/>Outbound connections on port 443, 5671 and 5672 to send discovery and performance metadata to Azure Migrate.
vCenter server | Inbound connections on TCP port 443 to allow the appliance to collect configuration and performance metadata for assessments. <br/><br/> The appliance connects to vCenter on port 443 by default. If the vCenter server listens on a different port, you can modify the port when you set up discovery.

## Agent-based dependency visualization

[Dependency visualization](concepts-dependency-visualization.md) helps you to visualize dependencies across machines that you want to assess and migrate. For agent-based visualization, requirements and limitations are summarized in the following table


**Requirement** | **Details**
--- | ---
**Deployment** | Before you deploy dependency visualization you should have an Azure Migrate project in place, with the Azure Migrate: Server Assessment tool added to the project. You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises machines.<br/><br/> Dependency visualization isn't available in Azure Government.
**Service Map** | Agent-based dependency visualization uses the [Service Map](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-service-map) solution in [Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview).<br/><br/> To deploy, you associate a new or existing Log Analytics workspace with an Azure Migrate project.
**Log Analytics workspace** | The workspace must be in the same subscription as the Azure Migrate project.<br/><br/> Azure Migrate supports workspaces residing in the East US, Southeast Asia and West Europe regions.<br/><br/>  The workspace must be in a region in which [Service Map is supported](https://docs.microsoft.com/azure/azure-monitor/insights/vminsights-enable-overview#prerequisites).<br/><br/> The workspace for an Azure Migrate project can't be modified after it's added.
**Charges** | The Service Map solution doesn't incur any charges for the first 180 days (from the day that you associated the Log Analytics workspace with the Azure Migrate project).<br/><br/> After 180 days, standard Log Analytics charges will apply.<br/><br/> Using any solution other than Service Map in the associated Log Analytics workspace will incur standard Log Analytics charges.<br/><br/> If you delete the Azure Migrate project, the workspace isn't deleted with it. After deleting the project, Service Map isn't free, and each node will be charged as per the paid tier of Log Analytics workspace.
**Agents** | Agent-based dependency visualization requires two agents to be installed on each machine you want to analyze.<br/><br/> - [Microsoft Monitoring agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows)<br/><br/> - [Dependency agent](https://docs.microsoft.com/azure/azure-monitor/platform/agents-overview#dependency-agent). 
**Internet connectivity** | If machines aren't connected to the internet, you need to install the Log Analytics gateway on them.


## Agentless dependency visualization

This option is currently in preview. [Learn more](how-to-create-group-machine-dependencies-agentless.md). Requirements are summarized in the following table.

**Requirement** | **Details**
--- | ---
**Deployment** | Before you deploy dependency visualization you should have an Azure Migrate project in place, with the Azure Migrate: Server Assessment tool added to the project. You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises machines.
**VM support** | Currently supported for VMware VMs only.
**Windows VMs** | Windows Server 2016<br/> Windows Server 2012 R2<br/> Windows Server 2012<br/> Windows Server 2008 R2 (64-bit)
**Linux VMs** | Red Hat Enterprise Linux 7, 6, 5<br/> Ubuntu Linux 14.04, 16.04<br/> Debian 7, 8<br/> Oracle Linux 6, 7<br/> CentOS 5, 6, 7.
**Windows account** |  Visualization needs a user account with Guest access.
**Linux account** | Visualization needs a user account with Root privilege.<br/><br/> Alternately, the user account needs these permissions on /bin/netstat and /bin/ls files: CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE.
**VM agents** | No agent needed on the VMs.
**VMware tools** | VMware tools must be installed and running on VMs you want to analyze.
**vCenter credentials** | A vCenter Server account with read-only access, and privileges enabled for Virtual Machines > Guest Operations.
**Port access** | On ESXi hosts running VMs you want to analyze, the Azure Migrate appliance must be able to connect to TCP port 443.



## Next steps

- [Review](best-practices-assessment.md) best practices for creating assessments.
- [Prepare for VMware](tutorial-prepare-vmware.md) assessment.
