---
title: Azure Migrate support matrix
description: Provides a summary of support settings and limitations for the Azure Migrate service.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 02/25/2019
ms.author: raynew
---

# Azure Migrate support matrix

You can use the [Azure Migrate service](migrate-overview.md) to assess and migrate machines to the Microsoft Azure cloud. This article summarizes general support settings and limitations for Azure Migrate scenarios and deployments.


## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version**: Using this version you can create new Azure Migrate projects, discover on-premises assesses, and orchestrate assessments and migrations. [Learn more](whats-new.md#azure-migrate-new-version).
- **Previous version**: For customer using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can't create new Azure Migrate projects or perform new discoveries.

## Supported migration scenarios

The table summarizes supported migration scenarios.

**Deployment** | **Details*** 
--- | --- 
**On-premises assessment** | Assess on-premises workloads and data running on VMware VMs and Hyper-V VMs. Assess using Azure Migrate Server Assessment and Microsoft Data Migration Assistant (DMA), as well as third-party tools that include Cloudamize, Corent Tech, and Turbonomic Server.
**On-premises migration to Azure** | Migrate workloads and data running on physical servers, VMware VMs, Hyper-V VMs, and on AWS/GCP instances, to Azure. Migrate using Azure Migrate Server Assessment and Azure Database Migration Service (DMS), and well as using third-party tools that include Carbonite and CorentTech.

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
Subscription | You can have a single Azure Migrate project in a subscription.
Azure permissions | You need Contributor or Owner permissions in the subscription to create an Azure Migrate project.
VMware VMs  | Assess up to 35,000 VMware VMs in a single project.
Hyper-V VMs	| Assess up to 10,000 Hyper-V VMs in a single project.

A project can include both VMware VMs and Hyper-V VMs, up to the assessment limits.


## VMware assessment and migration

[Review](migrate-support-matrix-vmware.md) the Azure Migrate Server Assessment and Server Migration support matrix for VMware VMs.

## Hyper-V assessment and migration

[Review](migrate-support-matrix-hyper-v.md) the Azure Migrate Server Assessment and Server Migration support matrix for Hyper-V VMs.


## Next steps

- [Assess VMware VMs](tutorial-assess-vmware.md) for migration.
- [Assess Hyper-V VMs](tutorial-assess-hyper-v.md) for migration.

