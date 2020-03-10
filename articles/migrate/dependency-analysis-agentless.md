---
title: Agentless dependency analysis in Azure Migrate Server Assessment
description: Describes how to use agentless dependency analysis for assessment with Azure Migrate Server Assessment.
ms.topic: conceptual
ms.date: 03/11/2020
---

# Agentless dependency analysis

This article describes agentless dependency analysis in Azure Migrate:Server Assessment. Dependency analysis helps you to identify dependencies between on-premises machines that you want to assess and migrate to Azure. [Learn](concepts-dependency-visualization.md) about dependency analysis, and [compare](concepts-dependency-visualization.md#compare-agentless-and-agent-based) agentless analysis with agent-based.


## Requirements

**Requirement** | **Details** 
--- | --- 
**Before deployment** | You should have an Azure Migrate project in place, with the Azure Migrate: Server Assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises VMWare machines.<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> [Learn how](how-to-set-up-appliance-vmware.md) to set up the Azure Migrate appliance for assessment of VMware VMs.
**Required agents** | No agent required on machines you want to analyze.
**Supported operating systems** | Review the [operating systems](migrate-support-matrix-vmware.md#agentless-dependency-visualization) supported for agentless visualization.
**VMs** | **VMware tools**: VMware Tools must be installed and running on VMs you want to analyze.
**VMware** | **vCenter**: The appliance needs a vCenter Server account with read-only access, and privileges enabled for Virtual Machines > Guest Operations.<br/><br/> **ESXi hosts**: On ESXi hosts running VMs you want to analyze, the Azure Migrate appliance must be able to connect to TCP port 443.
**Azure Migrate appliance** |  On the [Azure Migrate appliance](migrate-appliance.md), you need to add a user account that can be used to access VMs for analysis.<br/><br/> **Windows VMs**: The user account needs to be a local or a domain administrator on the machine.<br/><br/> **Linux VMs**: The root privilege is required on the account. Alternately, the user account requires these two capabilities on /bin/netstat and /bin/ls files: CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE.


## Collected data

Agentless dependency visualization works by capturing TCP connection data from machines for which it's enabled. After dependency discovery starts, the appliance gathers this data from machines by polling every five minutes:
- Source machine server name, process, application name
- Destination server name, process, application name, and port.



## Next steps
- [Try out](how-to-create-group-machine-dependencies-agentless.md)  agentless dependency visualization for VMware VMs.
- Review [common questions](common-questions-discovery-assessment.md#what-is-dependency-visualization) about dependency visualization.


