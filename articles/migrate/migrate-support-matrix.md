---
title: Azure Migrate support matrix
description: Provides a summary of support settings and limitations for the Azure Migrate service.
author: ms-psharma
ms.author: panshar
ms.manager: abhemraj
ms.topic: conceptual
ms.date: 07/23/2020
---

# Azure Migrate support matrix

You can use the [Azure Migrate service](./migrate-services-overview.md) to assess and migrate machines to the Microsoft Azure cloud. This article summarizes general support settings and limitations for Azure Migrate scenarios and deployments.

## Supported assessment/migration scenarios

The table summarizes supported discovery, assessment, and migration scenarios.

**Deployment** | **Details** 
--- | --- 
**Discovery** | You can discover machine metadata, and dynamic performance data.
**App-discovery** | You can discover apps, roles, and features running on VMware VMs. Currently this feature is limited to discovery only. Assessment is currently at the machine level. We don't yet offer app, role, or feature-based assessments. 
**Assessment** | Assess on-premises workloads and data running on VMware VMs, Hyper-V VMs, and physical servers. Assess using Azure Migrate: Server Assessment, Microsoft Data Migration Assistant (DMA), as well as other tools and ISV offerings.
**Migration** | Migrate workloads and data running on physical servers, VMware VMs, Hyper-V VMs, physical servers, and cloud-based VMS to Azure. Migrate using Azure Migrate: Server Assessment and Azure Database Migration Service (DMS), and well as other tools and ISV offerings.

> [!NOTE]
> Currently, ISV tools can't send data to Azure Migrate in Azure Government. You can use integrated Microsoft tools, or use partner tools independently.

## Supported tools


Specific tool support is summarized in the table.

**Tool** | **Assess** | **Migrate** 
--- | --- | ---
Azure Migrate: Server Assessment | Assess [VMware VMs](./tutorial-discover-vmware.md), [Hyper-V VMs](./tutorial-discover-hyper-v.md), and [physical servers](./tutorial-discover-physical.md). |  Not available (N/A)
Azure Migrate: Server Migration | N/A | Migrate [VMware VMs](tutorial-migrate-vmware.md), [Hyper-V VMs](tutorial-migrate-hyper-v.md), and [physical servers](tutorial-migrate-physical-virtual-machines.md).
[Carbonite](https://www.carbonite.com/data-protection-resources/resource/Datasheet/carbonite-migrate-for-microsoft-azure) | N/A | Migrate VMware VMs, Hyper-V VMs, physical servers, public cloud workloads. 
[Cloudamize](https://www.cloudamize.com/platform#tab-0)| Assess VMware VMs, Hyper-V VMs, physical servers, public cloud workloads. | N/A
[Corent Technology](https://go.microsoft.com/fwlink/?linkid=2084928) | Assess and migrate VMware VMs, Hyper-V VMs, physical servers, public cloud workloads. |  Migrate VMware VMs, Hyper-V VMs, physical servers, public cloud workloads.
[Device 42](https://go.microsoft.com/fwlink/?linkid=2097158) | Assess VMware VMs, Hyper-V VMs, physical servers, public cloud workloads.| N/A
[DMA](/sql/dma/dma-overview?view=sql-server-2017) | Assess SQL Server databases. | N/A
[DMS](../dms/dms-overview.md) | N/A | Migrate SQL Server, Oracle, MySQL, PostgreSQL, MongoDB. 
[Lakeside](https://go.microsoft.com/fwlink/?linkid=2104908) | Assess virtual desktop infrastructure (VDI) | N/A
[Movere](https://www.movere.io/) | Assess VMware VMs, Hyper-V VMs, Xen VMs, physical machines, workstations (including VDI), public cloud workloads | N/A
[RackWare](https://go.microsoft.com/fwlink/?linkid=2102735) | N/A | Migrate VMWare VMs, Hyper-V VMs, Xen VMs, KVM VMs, physical machines, public cloud workloads 
[Turbonomic](https://go.microsoft.com/fwlink/?linkid=2094295)  | Assess VMware VMs, Hyper-V VMs, physical servers, public cloud workloads. | N/A
[UnifyCloud](https://go.microsoft.com/fwlink/?linkid=2097195) | Assess VMware VMs, Hyper-V VMs, physical servers, public cloud workloads, and SQL Server databases. | N/A
[Webapp Migration Assistant](https://appmigration.microsoft.com/) | Assess web apps | Migrate web apps.


## Azure Migrate projects

**Support** | **Details**
--- | ---
Subscription | You can have multiple Azure Migrate projects in a subscription.
Azure permissions | You need Contributor or Owner permissions in the subscription to create an Azure Migrate project.
VMware VMs  | Assess up to 35,000 VMware VMs in a single project.
Hyper-V VMs    | Assess up to 35,000 Hyper-V VMs in a single project.

A project can include both VMware VMs and Hyper-V VMs, up to the assessment limits.

## Azure permissions

For Azure Migrate to work with Azure you need these permissions before you start assessing and migrating machines.

**Task** | **Permissions** | **Details**
--- | --- | ---
Create an Azure Migrate project | Your Azure account needs permissions to create a project. | Set up for [VMware](./tutorial-discover-vmware.md#prepare-an-azure-user-account), [Hyper-V](./tutorial-discover-hyper-v.md#prepare-an-azure-user-account), or [physical servers](./tutorial-discover-physical.md#prepare-an-azure-user-account).
Register the Azure Migrate appliance| Azure Migrate uses a lightweight [Azure Migrate appliance](migrate-appliance.md) to assess machines with Azure Migrate: Server Assessment, and to run [agentless migration](server-migrate-overview.md) of VMware VMs with Azure Migrate: Server Migration. This appliance discovers machines, and sends metadata and performance data to Azure Migrate.<br/><br/> During registration, register providers (Microsoft.OffAzure, Microsoft.Migrate, and Microsoft.KeyVault) are registered with the subscription chosen in the appliance, so that the subscription works with the resource provider. To register, you need Contributor or Owner access on the subscription.<br/><br/> **VMware**-During onboarding, Azure Migrate creates two Azure Active Directory (Azure AD) apps. The first app communicates between the appliance agents and the Azure Migrate service. The app doesn't have permissions to make Azure resource management calls or have Azure RBAC access for resources. The second app accesses an Azure Key Vault created in the user subscription for agentless VMware migration only. In agentless migration, Azure Migrate creates a Key Vault to manage access keys to the replication storage account in your subscription. It has Azure RBAC access on the Azure Key Vault (in the customer tenant) when discovery is initiated from the appliance.<br/><br/> **Hyper-V**-During onboarding. Azure Migrate creates one Azure AD app. The app communicates between the appliance agents and the Azure Migrate service. The app doesn't have permissions to make Azure resource management calls or have Azure RBAC access for resources. | Set up for [VMware](./tutorial-discover-vmware.md#prepare-an-azure-user-account), [Hyper-V](./tutorial-discover-hyper-v.md#prepare-an-azure-user-account), or [physical servers](./tutorial-discover-physical.md#prepare-an-azure-user-account).
Create a key vault for VMware agentless migration | To migrate VMware VMs with agentless Azure Migrate: Server Migration, Azure Migrate creates a Key Vault to manage access keys to the replication storage account in your subscription. To create the vault, you set permissions (Owner, or Contributor and User Access Administrator) on the resource group in which the Azure Migrate project resides. | [Set up](./tutorial-discover-vmware.md#prepare-an-azure-user-account) permissions.

## Supported geographies (public cloud)

You can create an Azure Migrate project in a number of geographies in the public cloud.

- Although you can only create projects in these geographies, you can assess or migrate machines for other target locations.
- The project geography is only used to store the discovered metadata.
- When you create a project, you select a geography. The project and related resources are created in one of the regions in the geography. The region is allocated by the Azure Migrate service.

**Geography** | **Metadata storage location**
--- | ---
Asia Pacific | East Asia or Southeast Asia
Australia | Australia East or Australia Southeast
Brazil | Brazil South
Canada | Canada Central or Canada East
Europe | North Europe or West Europe
France | France Central
India | Central India or South India
Japan |  Japan East or Japan West
Korea | Korea Central or Korea South
Switzerland | Switzerland North
United Kingdom | UK South or UK West
United States | Central US or West US 2

> [!NOTE]
> For Switzerland geography, Switzerland West is only available for REST API users and need an approved subscription.

## Supported geographies (Azure Government)

**Task** | **Geography** | **Details**
--- | --- | ---
Create project | United States | Metadata is stored in US Gov Arizona, US Gov Virginia
Target assessment | United States | Target regions: US Gov Arizona, US Gov Virginia, US Gov Texas
Target replication | United States | Target regions: US DoD Central, US DoD East, US Gov Arizona, US Gov Iowa, US Gov Texas, US Gov Virginia


## VMware assessment and migration

[Review](migrate-support-matrix-vmware.md) the Azure Migrate: Server Assessment and Azure Migrate: Server Migration support matrix for VMware VMs.

## Hyper-V assessment and migration

[Review](migrate-support-matrix-hyper-v.md) the Azure Migrate: Server Assessment and Azure Migrate: Server Migration support matrix for Hyper-V VMs.



## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Using this version you can create new Azure Migrate projects, discover on-premises assesses, and orchestrate assessments and migrations. [Learn more](whats-new.md).
- **Previous version**: For customer using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can't create new Azure Migrate projects or perform new discoveries.

## Next steps

- [Assess VMware VMs](./tutorial-assess-vmware-azure-vm.md) for migration.
- [Assess Hyper-V VMs](tutorial-assess-hyper-v.md) for migration.
