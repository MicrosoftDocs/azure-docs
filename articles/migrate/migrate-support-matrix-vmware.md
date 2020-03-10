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
**VMware tools** | VMware tools must be installed and running on VMs you want to discover. <br/> If your VMware tools version is between 9.10 - 10.2.0, please ensure you upgrade it to beyond 10.2.0.
**Port access** | On ESXi hosts running VMs you want to discover, the Azure Migrate appliance must be able to connect to TCP port 443.
**Limits** | For app-discovery  you can discover up to 10000 per appliance. 

## VMware requirements

**VMware** | **Details**
--- | ---
**vCenter Server** | Machines you want to discovery and assess must be managed by vCenter Server version 5.5, 6.0, 6.5, or 6.7.
**Permissions (assessment)** | vCenter Server read-only account.
**Permissions (app-discovery)** | vCenter Server account with read-only access, and privileges enabled for **Virtual machines > Guest Operations**.
**Permissions (dependency visualization)** | Center Server account with read-only access, and privileges enabled for **Virtual machines** > **Guest Operations**.


## Azure Migrate appliance requirements

Azure Migrate uses the [Azure Migrate appliance](migrate-appliance.md) for discovery and assessment. The appliance for VMware is deployed using an OVA template, imported into vCenter Server. 

- Learn about [appliance requirements](migrate-appliance.md#appliance---vmware) for VMware.
- Learn about [URLs](migrate-appliance.md#url-access) the appliance needs to access.

## Port access

**Device** | **Connection**
--- | ---
Appliance | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br/><br/> Inbound connections on port 44368 to remotely access the appliance management app using the URL: ```https://<appliance-ip-or-name>:44368``` <br/><br/>Outbound connections on port 443 (HTTPS), 5671 and 5672 (AMQP) to send discovery and performance metadata to Azure Migrate.
vCenter server | Inbound connections on TCP port 443 to allow the appliance to collect configuration and performance metadata for assessments. <br/><br/> The appliance connects to vCenter on port 443 by default. If the vCenter server listens on a different port, you can modify the port when you set up discovery.
ESXi Hosts | **Required only for [application discovery](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#application-discovery) and [agentless dependency visualization](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#agentless-dependency-visualization)** <br/><br/> The appliance connects to ESXi hosts on TCP port 443 to discover applications and run agentless dependency visualization on the VMs running on the hosts.

## Dependency visualization

[Dependency visualization](concepts-dependency-visualization.md) helps you to visualize dependencies across machines that you want to assess and migrate. [Review prerequisites and support](support-matrix-dependency-analysis.md) for dependency visualization.


## Next steps

- [Review](best-practices-assessment.md) best practices for creating assessments.
- [Prepare for VMware](tutorial-prepare-vmware.md) assessment.
