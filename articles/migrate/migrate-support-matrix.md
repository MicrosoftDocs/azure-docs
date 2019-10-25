---
title: Azure Migrate support matrix
description: Provides a summary of support settings and limitations for the Azure Migrate service.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: raynew
---

# Azure Migrate support matrix

You can use the [Azure Migrate service](migrate-overview.md) to assess and migrate machines to the Microsoft Azure cloud. This article summarizes general support settings and limitations for Azure Migrate scenarios and deployments.


## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Using this version you can create new Azure Migrate projects, discover on-premises assesses, and orchestrate assessments and migrations. [Learn more](whats-new.md#release-version-july-2019).
- **Previous version**: For customer using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can't create new Azure Migrate projects or perform new discoveries.

## Supported assessment/migration scenarios

The table summarizes supported discovery, assessment, and migration scenarios.

**Deployment** | **Details** 
--- | --- 
**App-specific discovery** | You can discover apps, roles, and features running on VMware VMs. Currently this feature is limited to discovery only. Assessment is currently at the machine level. We don't yet offer app, role, or feature-specific assessment. 
**On-premises assessment** | Assess on-premises workloads and data running on VMware VMs and Hyper-V VMs. Assess using Azure Migrate Server Assessment and Microsoft Data Migration Assistant (DMA), as well as third-party tools that include Cloudamize, Corent Tech, and Turbonomic Server.
**On-premises migration to Azure** | Migrate workloads and data running on physical servers, VMware VMs, Hyper-V VMs, physical servers, and cloud-based VMS to Azure. Migrate using Azure Migrate Server Assessment and Azure Database Migration Service (DMS), and well as using third-party tools that include Carbonite and CorentTech.

Specific tool support is summarized as follows.

**Tool** | **Assessment/Migration** | **Details**
--- | --- | ---
Azure Migrate Server Assessment | Assessment | Try out server assessment for [Hyper-V](tutorial-prepare-hyper-v.md) and [VMware](tutorial-prepare-vmware.md).
Cloudamize | Assessment | [Learn more](https://www.cloudamize.com/platform#tab-0).
CorentTech | Assessment | [Learn more](https://www.corenttech.com/).
Turbonomic | Assessment | [Learn more](https://turbonomic.com/solutions/technologies/azure-cloud/).
Azure Migrate Server Migration | Migration | Try out server migration for [Hyper-V](tutorial-migrate-hyper-v.md) and [VMware](tutorial-migrate-vmware.md).
Carbonite | Migration | [Learn more](https://www.carbonite.com/data-protection-resources/resource/Datasheet/carbonite-migrate-for-microsoft-azure).
CorentTech | Migration | [Learn more](https://www.corenttech.com/).


## Azure Migrate projects

**Support** | **Details**
--- | ---
Subscription | You can have multiple Azure Migrate projects in a subscription.
Azure permissions | You need Contributor or Owner permissions in the subscription to create an Azure Migrate project.
VMware VMs  | Assess up to 35,000 VMware VMs in a single project.
Hyper-V VMs	| Assess up to 35,000 Hyper-V VMs in a single project.

A project can include both VMware VMs and Hyper-V VMs, up to the assessment limits.

## Supported geographies

You can create an Azure Migrate project in a number of geographies. Although you can only create projects in these geographies, you can assess or migrate machines for other target locations. The project geography is only used to store the discovered metadata.

**Geography** | **Metadata storage location**
--- | ---
Azure Government | US Gov Virginia
Asia Pacific | East Asia or Southeast Asia
Australia | Australia East or Australia Southeast
Brazil | Brazil South
Canada | Canada Central or Canada East
Europe | North Europe or West Europe
France | France Central
India | Central India or South India
Japan |  Japan East or Japan West
Korea | Korea Central or Korea South
United Kingdom | UK South or UK West
United States | Central US or West US 2


 > [!NOTE]
 > Support for Azure Government is currently only available for the [older version](https://docs.microsoft.com/azure/migrate/migrate-services-overview#azure-migrate-versions) of Azure Migrate.



## VMware assessment and migration

[Review](migrate-support-matrix-vmware.md) the Azure Migrate Server Assessment and Server Migration support matrix for VMware VMs.

## Hyper-V assessment and migration

[Review](migrate-support-matrix-hyper-v.md) the Azure Migrate Server Assessment and Server Migration support matrix for Hyper-V VMs.


## Next steps

- [Assess VMware VMs](tutorial-assess-vmware.md) for migration.
- [Assess Hyper-V VMs](tutorial-assess-hyper-v.md) for migration.

