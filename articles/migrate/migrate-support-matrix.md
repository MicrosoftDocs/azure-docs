---
title: Azure Migrate support matrix
description: Provides a summary of support settings and limitations for the Azure Migrate service.
author: jyothisuri
ms.author: jsuri
ms.manager: abhemraj
ms.topic: conceptual
ms.date: 01/03/2023
ms.custom: engagement-fy23
---

# Azure Migrate support matrix

You can use the [Azure Migrate service](./migrate-services-overview.md) to assess and migrate servers to the Microsoft Azure cloud. This article summarizes general support settings and limitations for Azure Migrate scenarios and deployments.

## Supported assessment/migration scenarios

The table summarizes supported discovery, assessment, and migration scenarios.

**Deployment** | **Details**
--- | ---
**Discovery** | You can discover server metadata, and dynamic performance data.
**Software inventory** | You can discover apps, roles, and features running on VMware VMs. Currently this feature is limited to discovery only. Assessment is currently at the server level. We don't yet offer app, role, or feature-based assessments.
**Assessment** | Assess on-premises workloads and data running on VMware VMs, Hyper-V VMs, and physical servers. Assess using Azure Migrate: Discovery and assessment, Microsoft Data Migration Assistant (DMA), as well as other tools and ISV offerings.
**Migration** | Migrate workloads and data running on physical servers, VMware VMs, Hyper-V VMs, physical servers, and cloud-based VMS to Azure. Migrate using the Migration and modernization tool and Azure Database Migration Service (DMS), and well as other tools and ISV offerings.

> [!NOTE]
> Currently, ISV tools can't send data to Azure Migrate in Azure Government. You can use integrated Microsoft tools, or use partner tools independently.

## Supported tools

Specific tool support is summarized in the table.

**Tool** | **Assess** | **Migrate**
--- | --- | ---
Azure Migrate: Discovery and assessment | Assess [VMware VMs](./tutorial-discover-vmware.md), [Hyper-V VMs](./tutorial-discover-hyper-v.md), and [physical servers](./tutorial-discover-physical.md). |  Not available (N/A)
Migration and modernization | N/A | Migrate [VMware VMs](tutorial-migrate-vmware.md), [Hyper-V VMs](tutorial-migrate-hyper-v.md), and [physical servers](tutorial-migrate-physical-virtual-machines.md).
[Carbonite](https://www.carbonite.com/data-protection-resources/resource/Datasheet/carbonite-migrate-for-microsoft-azure) | N/A | Migrate VMware VMs, Hyper-V VMs, physical servers, and other cloud workloads.
[Cloudamize](https://www.cloudamize.com/platform#tab-0)| Assess VMware VMs, Hyper-V VMs, physical servers, and other cloud workloads. | N/A
[CloudSphere](https://go.microsoft.com/fwlink/?linkid=2157454)| Assess VMware VMs, Hyper-V VMs, physical servers, and other cloud workloads. | N/A
[Corent Technology](https://go.microsoft.com/fwlink/?linkid=2084928) | Assess VMware VMs, Hyper-V VMs, physical server sand other cloud workloads. |  Migrate VMware VMs, Hyper-V VMs, physical servers, public cloud workloads.
[Device 42](https://go.microsoft.com/fwlink/?linkid=2097158) | Assess VMware VMs, Hyper-V VMs, physical servers, and other cloud workloads.| N/A
[DMA](/sql/dma/dma-overview) | Assess SQL Server databases. | N/A
[DMS](../dms/dms-overview.md) | N/A | Migrate SQL Server, Oracle, MySQL, PostgreSQL, MongoDB.
[Lakeside](https://go.microsoft.com/fwlink/?linkid=2104908) | Assess virtual desktop infrastructure (VDI) | N/A
[Movere](https://www.movere.io/) | Assess VMware VMs, Hyper-V VMs, Xen VMs, physical servers, workstations (including VDI) and other cloud workloads. | N/A
[RackWare](https://go.microsoft.com/fwlink/?linkid=2102735) | N/A | Migrate VMware VMs, Hyper-V VMs, Xen VMs, KVM VMs, physical servers, and other cloud workloads
[Turbonomic](https://go.microsoft.com/fwlink/?linkid=2094295)  | Assess VMware VMs, Hyper-V VMs, physical servers, and other cloud workloads. | N/A
[UnifyCloud](https://go.microsoft.com/fwlink/?linkid=2097195) | Assess VMware VMs, Hyper-V VMs, physical servers and other cloud workloads, and SQL Server databases. | N/A
[Webapp Migration Assistant](https://appmigration.microsoft.com/) | Assess web apps | Migrate web apps.
[Zerto](https://go.microsoft.com/fwlink/?linkid=2157322) | N/A |  Migrate VMware VMs, Hyper-V VMs, physical servers, and other cloud workloads.

## Project

**Support** | **Details**
--- | ---
Subscription | Can have multiple projects within a subscription.
Azure permissions | Users need Contributor or Owner permissions in the subscription to create a project.
VMware VMs  | Assess up to 35,000 VMware VMs in a single project.
Hyper-V VMs    | Assess up to 35,000 Hyper-V VMs in a single project.

A project can include both VMware VMs and Hyper-V VMs, up to the assessment limits.

## Azure permissions

For Azure Migrate to work with Azure you need these permissions before you start assessing and migrating servers.

**Task** | **Permissions** | **Details**
--- | --- | ---
Create a project | Your Azure account needs permissions to create a project. | Set up for [VMware](./tutorial-discover-vmware.md#prepare-an-azure-user-account), [Hyper-V](./tutorial-discover-hyper-v.md#prepare-an-azure-user-account), or [physical servers](./tutorial-discover-physical.md#prepare-an-azure-user-account).
Register the Azure Migrate appliance| Azure Migrate uses a lightweight [Azure Migrate appliance](migrate-appliance.md) to discover and assess servers with Azure Migrate: Discovery and assessment, and to run [agentless migration](server-migrate-overview.md) of VMware VMs with the Migration and modernization tool. This appliance discovers servers, and sends metadata and performance data to Azure Migrate.<br><br> During registration, register providers (Microsoft.OffAzure, Microsoft.Migrate, and Microsoft.KeyVault) are registered with the subscription chosen in the appliance, so that the subscription works with the resource provider. To register, you need Contributor or Owner access on the subscription.<br><br> **VMware**-During onboarding, Azure Migrate creates two Azure Active Directory (Azure AD) apps. The first app communicates between the appliance agents and the Azure Migrate service. The app doesn't have permissions to make Azure resource management calls or have Azure RBAC access for resources. The second app accesses an Azure Key Vault created in the user subscription for agentless VMware migration only. In agentless migration, Azure Migrate creates a Key Vault to manage access keys to the replication storage account in your subscription. It has Azure RBAC access on the Azure Key Vault (in the customer tenant) when discovery is initiated from the appliance.<br><br> **Hyper-V**-During onboarding. Azure Migrate creates one Azure AD app. The app communicates between the appliance agents and the Azure Migrate service. The app doesn't have permissions to make Azure resource management calls or have Azure RBAC access for resources. | Set up for [VMware](./tutorial-discover-vmware.md#prepare-an-azure-user-account), [Hyper-V](./tutorial-discover-hyper-v.md#prepare-an-azure-user-account), or [physical servers](./tutorial-discover-physical.md#prepare-an-azure-user-account).
Create a key vault for VMware agentless migration | To migrate VMware VMs with agentless Migration and modernization, Azure Migrate creates a Key Vault to manage access keys to the replication storage account in your subscription. To create the vault, you set permissions (Owner, or Contributor and User Access Administrator) on the resource group where the project resides. | [Set up](./tutorial-discover-vmware.md#prepare-an-azure-user-account) permissions.

## Supported geographies 

### Public cloud

You can create a project in many geographies in the public cloud.

- Although you can only create projects in these geographies, you can assess or migrate servers for other target locations.
- The project geography is only used to store the discovered metadata. 
- When you create a project, you select a geography. The project and related resources are created in one of the regions in the geography. The region is allocated by the Azure Migrate service. Azure Migrate does not move or store customer data outside of the region allocated.

**Geography** | **Metadata storage location**
--- | ---
Africa | South Africa or North Africa
Asia Pacific | East Asia
Australia | Australia East or Australia Southeast
Brazil | Brazil South
Canada | Canada Central or Canada East
Europe | North Europe or West Europe
France | France Central
Germany | Germany West Central
India | Central India or South India
Japan |  Japan East or Japan West
Jio India | Jio India West 
Korea | Korea Central
Norway | Norway East
Sweden | Sweden Central
Switzerland | Switzerland North
United Arab Emirates | UAE North
United Kingdom | UK South or UK West
United States | Central US or West US 2

> [!NOTE]
> For Switzerland geography, Switzerland West is only available for REST API users and need an approved subscription.

### Azure Government

**Task** | **Geography** | **Details**
--- | --- | ---
Create project | United States | Metadata is stored in US Gov Arizona, US Gov Virginia
Target assessment | United States | Target regions: US Gov Arizona, US Gov Virginia, US Gov Texas
Target replication | United States | Target regions: US DoD Central, US DoD East, US Gov Arizona, US Gov Iowa, US Gov Texas, US Gov Virginia

### Azure operated by 21Vianet (Microsoft Azure operated by 21Vianet)

**Geography** | **Metadata storage location**
--- | ---
Microsoft Azure operated by 21Vianet | China North 2

## VMware assessment and migration

[Review](migrate-support-matrix-vmware.md) the Azure Migrate: Discovery and assessment and Migration and modernization support matrix for VMware VMs.

## Hyper-V assessment and migration

[Review](migrate-support-matrix-hyper-v.md) the Azure Migrate: Discovery and assessment and Migration and modernization support matrix for Hyper-V VMs.

## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Using this version you can create new projects, discover on-premises assesses, and orchestrate assessments and migrations. [Learn more](whats-new.md).
- **Previous version**: For customer using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can't create new projects or perform new discoveries.

## Next steps

- [Assess VMware VMs](./tutorial-assess-vmware-azure-vm.md) for migration.
- [Assess Hyper-V VMs](tutorial-assess-hyper-v.md) for migration.
