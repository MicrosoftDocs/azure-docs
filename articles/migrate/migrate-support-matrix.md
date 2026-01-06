---
title: Support Matrix
description: This article provides a summary of support settings and limitations for the Azure Migrate service.
author: Vikram1988
ms.author: vibansa
ms.topic: concept-article
ms.reviewer: v-uhabiba
ms.date: 05/08/2025
ms.custom: engagement-fy24
# Customer intent: As a cloud architect, I want to understand the Azure Migrate support matrix so that I can determine the service's capabilities and limitations for assessing and migrating on-premises workloads to Azure effectively.
---

# Azure Migrate support matrix

You can use the [Azure Migrate service](./migrate-services-overview.md) to assess and migrate servers to the Microsoft Azure cloud platform. This article summarizes general support settings and limitations for Azure Migrate scenarios and deployments.

## Supported scenarios

Deployment | Details
--- | ---
Discovery | Discover server metadata and dynamic performance data.
Software inventory | Discover apps, roles, and features running on VMware virtual machines (VMs). Currently, this feature is limited to discovery only. Assessment is currently at the server level. We don't yet offer app, role, or feature-based assessments.
Assessment | Assess on-premises workloads and data running on VMware VMs, Hyper-V VMs, and physical servers. Assess by using Azure Migrate Discovery and Assessment, Microsoft Data Migration Assistant, and tools from other software development companies.
Migration | Migrate workloads and data running on physical servers, VMware VMs, Hyper-V VMs, physical servers, and cloud-based VMs to Azure. Migrate by using Azure Migrate and Modernize, Azure Database Migration Service, and tools from other software development companies.

## Project

Support | Details
--- | ---
Subscription | You can have multiple projects within a subscription.
Azure permissions | Users need Contributor or Owner permissions in the subscription to create a project.
VMware VMs  | Assess up to 35,000 VMware VMs in a single project.
Hyper-V VMs    | Assess up to 35,000 Hyper-V VMs in a single project.

A project can include both VMware VMs and Hyper-V VMs, up to the assessment limits.

## Azure permissions

For Azure Migrate to work with Azure, you need these permissions before you start assessing and migrating servers:

Task | Permissions | Details
--- | --- | ---
Create a project | Your Azure account needs permissions to create a project. | Set up for [VMware](./tutorial-discover-vmware.md#prepare-an-azure-user-account), [Hyper-V](./tutorial-discover-hyper-v.md), or [physical servers](create-project.md).
Register the Azure Migrate appliance| Azure Migrate uses a lightweight [Azure Migrate appliance](migrate-appliance.md) to discover and assess servers with the Azure Migrate Discovery and Assessment tool, and to run [agentless migration](server-migrate-overview.md) of VMware VMs with the Azure Migrate and Modernize tool. This appliance sends metadata and performance data to Azure Migrate.<br><br> During registration, the `Microsoft.OffAzure`, `Microsoft.Migrate`, and `Microsoft.KeyVault` resource providers are registered with the subscription chosen in the appliance, so that the subscription works with the resource providers. To register, you need Contributor or Owner access on the subscription.<br><br> **VMware**: During onboarding, Azure Migrate creates one Microsoft Entra app. The app communicates with the appliance agents and the Azure Migrate service. This app doesn't have permissions to make Azure resource management calls or have Azure role-based access control (RBAC) access for resources. <br><br> **Hyper-V**: During onboarding, Azure Migrate creates one Microsoft Entra app. The app communicates with the appliance agents and the Azure Migrate service. The app doesn't have permissions to make Azure resource management calls or have Azure RBAC access for resources. | Set up for [VMware](./tutorial-discover-vmware.md#prepare-an-azure-user-account), [Hyper-V](./tutorial-discover-hyper-v.md), or [physical servers](create-project.md).
Create a key vault for VMware agentless migration | To migrate VMware VMs with the agentless Azure Migrate and Modernize tool, Azure Migrate creates a key vault to manage access keys to the replication storage account in your subscription. To create the vault, you set permissions (Owner, Contributor, and User Access Administrator) on the resource group where the project resides. | Set up [permissions](./tutorial-discover-vmware.md#prepare-an-azure-user-account).

::: moniker range="migrate-classic"
Refer [this article](prepare-azure-accounts.md) to prepare Azure accounts.

## Supported geographies

### Public cloud

When you create a project in the public cloud, you select a geography. The project and related resources are created in one of the regions in the geography. The Azure Migrate service allocates the region.

The project geography is used only to store discovered metadata. Azure Migrate does not move or store customer data outside the allocated region.

You can create a project in the following geographies in the public cloud. Although you can create projects only in these geographies, you can assess or migrate servers for other target locations.

Geography | Metadata storage location
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
Indonesia| Indonesia Central
Israel| Israel Central
Italy | North Italy
Japan |  Japan East or Japan West
Jio India | Jio India West
Korea | Korea Central
Malaysia | Malaysia West
Mexico | Mexico Central
New Zealand | New Zealand North
Norway | Norway East
Spain  | Spain Central
Sweden | Sweden Central
Switzerland | Switzerland North
United Arab Emirates | UAE North
United Kingdom | UK South or UK West
United States | Central US or West US 2
Chile | Chile Central

> [!NOTE]
> For Switzerland geography, Switzerland West is available only for REST API users and needs an approved subscription.

### Azure Government

Task | Geography | Details
--- | --- | ---
Project creation | United States | Metadata is stored in US Gov Arizona and US Gov Virginia.
Target assessment | United States | Target regions: US Gov Arizona, US Gov Virginia, US Gov Texas.
Target replication | United States | Target regions: US DoD Central, US DoD East, US Gov Arizona, US Gov Iowa, US Gov Texas, US Gov Virginia.

### Azure operated by 21Vianet

Geography | Metadata storage location
--- | ---
Microsoft Azure operated by 21Vianet | China North 2

::: moniker-end

## VMware assessment and migration

[Review](migrate-support-matrix-vmware.md) the support matrix for using the Azure Migrate Discovery and Assessment tool and the Azure Migrate and Modernize tool to discover VMware VMs.

## Hyper-V assessment and migration

[Review](migrate-support-matrix-hyper-v.md) the support matrix for using the Azure Migrate Discovery and Assessment tool and the Azure Migrate and Modernize tool to assess Hyper-V VMs.

## Related content

- [Assess VMware VMs for migration to Azure](./tutorial-assess-vmware-azure-vm.md)
- [Assess Hyper-V VMs for migration to Azure](tutorial-assess-hyper-v.md)
