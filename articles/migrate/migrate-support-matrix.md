---
title: Azure Migrate support matrix
description: Provides a summary of support settings and limitations for the Azure Migrate service.
author: SnehaSudhirG
ms.author: sudhirsneha 
ms.topic: conceptual
ms.date: 01/27/2025
ms.custom: engagement-fy25
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
Create a project | Your Azure account needs permissions to create a project. | Set up for [VMware](tutorial-discover-vmware.md#prepare-an-azure-user-account), [Hyper-V](./tutorial-discover-hyper-v.md#prepare-an-azure-user-account), or [physical servers](./tutorial-discover-physical.md#prepare-an-azure-user-account).
Register the Azure Migrate appliance| Azure Migrate uses a lightweight [Azure Migrate appliance](migrate-appliance.md) to discover and assess servers with Azure Migrate: Discovery and assessment, and to run [agentless migration](server-migrate-overview.md) of VMware VMs with the Migration and modernization tool. This appliance discovers servers, and sends metadata and performance data to Azure Migrate.<br><br> During registration, register providers (Microsoft.OffAzure, Microsoft.Migrate, and Microsoft.KeyVault) are registered with the subscription chosen in the appliance, so that the subscription works with the resource provider. To register, you need Contributor or Owner access on the subscription.<br><br> **VMware**-During onboarding, Azure Migrate creates two Microsoft Entra apps. The first app communicates between the appliance agents and the Azure Migrate service. The app doesn't have permissions to make Azure resource management calls or have Azure RBAC access for resources. The second app accesses an Azure Key Vault created in the user subscription for agentless VMware migration only. In agentless migration, Azure Migrate creates a Key Vault to manage access keys to the replication storage account in your subscription. It has Azure RBAC access on the Azure Key Vault (in the customer tenant) when discovery is initiated from the appliance.<br><br> **Hyper-V**-During onboarding. Azure Migrate creates one Microsoft Entra app. The app communicates between the appliance agents and the Azure Migrate service. The app doesn't have permissions to make Azure resource management calls or have Azure RBAC access for resources. | Set up for [VMware](tutorial-discover-vmware.md#prepare-an-azure-user-account), [Hyper-V](./tutorial-discover-hyper-v.md#prepare-an-azure-user-account), or [physical servers](./tutorial-discover-physical.md#prepare-an-azure-user-account).
Create a key vault for VMware agentless migration | To migrate VMware VMs with agentless Migration and modernization, Azure Migrate creates a Key Vault to manage access keys to the replication storage account in your subscription. To create the vault, you set permissions (Owner, or Contributor and User Access Administrator) on the resource group where the project resides. | [Set up](tutorial-discover-vmware.md#prepare-an-azure-user-account) permissions.

## Supported geographies 

#### [Azure Public cloud](#tab/public)

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
Israel| Israel Central
Italy | North Italy
Japan |  Japan East or Japan West
Jio India | Jio India West 
Korea | Korea Central
Norway | Norway East
Spain  | Spain Central 
Sweden | Sweden Central
Switzerland | Switzerland North
United Arab Emirates | UAE North
United Kingdom | UK South or UK West
United States | Central US or West US 2

> [!NOTE]
> For Switzerland geography, Switzerland West is only available for REST API users and need an approved subscription.

#### [Azure for US Government](#tab/gov)

### Azure Government

**Task** | **Geography** | **Details**
--- | --- | ---
Create project | United States | Metadata is stored in US Gov Arizona, US Gov Virginia
Target assessment | United States | Target regions: US Gov Arizona, US Gov Virginia, US Gov Texas
Target replication | United States | Target regions: US DoD Central, US DoD East, US Gov Arizona, US Gov Iowa, US Gov Texas, US Gov Virginia

#### [Azure operated by 21Vianet](#tab/21via)

**Geography** | **Metadata storage location**
--- | ---
Microsoft Azure operated by 21Vianet | China North 2

---

## VMware assessment and migration

[Review](migrate-support-matrix-vmware.md) the Azure Migrate: Discovery and assessment and Migration and modernization support matrix for VMware VMs.

## Hyper-V assessment and migration

[Review](migrate-support-matrix-hyper-v.md) the Azure Migrate: Discovery and assessment and Migration and modernization support matrix for Hyper-V VMs.

## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Using this version, you can create new projects, discover on-premises servers, and orchestrate assessments and migrations. [Learn more](whats-new.md).
- **Previous version**: For customers using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can't create new projects or perform new discoveries.

## Next steps

- [Assess VMware VMs](./tutorial-assess-vmware-azure-vm.md) for migration.
- [Assess Hyper-V VMs](tutorial-assess-hyper-v.md) for migration.
