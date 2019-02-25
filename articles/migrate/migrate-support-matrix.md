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

You can use the [Azure Migrate service](migrate-overview.md) to assess and migrate machines to the Microsoft Azure cloud. This articles summarizes general support settings and limitations for Azure Migrate scenarios and deployments.


## Azure Migrate versions

There are two versions of the Azure Migrate service:

- **Current version (in public preview)**: Using the current version of Azure Migrate, you can assess on-premises VMware VMs and Hyper-V VMs for migration to Azure, and migrate VMware VMs. [Learn more](migrate-overview.md#azure-migrate-public-preview).
- **Classic version**: Using the classic version of Azure Migrate, you can assess on-premises VMware VMs for migration to Azure.

This article calls out differences in support and limitations as required.

## Support migration scenarios

The table summarizes typical migration scenarios and the tools we recommend that you use to assess and perform migrations to Azure.

**Deployment** | **Public preview** | **Classic version**
--- | --- | --- | ---
**Assess on-premises VMware VMs** | ![Yes][green] | ![Yes][green]
**Migrate on-premises VMware VMs to Azure** | ![Yes][green] | ![No][red]
**Migrate VMware VMs<br/><br/> (large-scale/automated)** | ![No][red]<br/><br/> Use [Azure Site Recovery] (https://docs.microsoft.com/azure/site-recovery/migrate-tutorial-on-premises-azure) during public preview. | ![No][red] | ![No][red]
**Assess on-premises Hyper-V VMs** | ![Yes][green] | ![No][red]
**Migrate on-premises Hyper-V VMs to Azure** | ![No][red]<br/><br/> Use [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/migrate-tutorial-on-premises-azure) during public preview.| ![No][red]  | ![No][red]
**Migrate Windows Server 2008/2008 R2 servers** | ![No][red]<br/><br/> Use [Azure Site Recovery] | ![No][red](https://docs.microsoft.com/azure/site-recovery/migrate-tutorial-windows-server-2008) | ![No][red]
**Migrate SQL Server 2008/2008 R2 databases** | ![No][red]<br/><br/> Use the [Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview). | ![No][red] | ![No][red]

## Azure Migrate project limitations (classic)

In Azure Migrate classic version you create Azure Migrate projects. Projects have the following limitations:

- You can have up to 20 Azure Migrate projects in a subscription.
- You can have up to 1500 VMs in a single project.
- You can create projects in these locations.

    **Geography** | **Storage location**
    --- | ---
    United States | West Central US or East US
    Azure Government | US Gov Virginia
    Asia | Southeast Asia
    Europe | North Europe or West Europe
    United States | East US or West Central US


    - The project location is used to store the metadata discovered during the migration assessment.
    - This doesn't restrict your ability to create assessments for other target Azure regions.
    - Metadata is stored in one of the regions in the specified geography.
    
    
## Support for discovery and assessment

**Support** | **Details**
--- | ---
**VM discovery** | You can discover up to 1500 VMs at once.
**VM assessment** | You can assess up to 1500 VMs in a single assessment.
**VM support** | In the latest version of Azure Migrate you can discover and assess VMware VMs managed by vCenter Server 5.5, 6.0 or 6.5.<br/><br/> You can discover and assess Hyper-V VMs.
**Dependency visualization** | Dependency visualization isn't supported for assessment using the public preview.<br/><br/> If you use dependency visualization with Azure Migrate classic version during migration assessment, the Log Analytics workspace is created in the same region as the project. Dependency visualization isn't available in Azure Government. 
  



## Support for migration

**Support** | **Details**
--- | ---
**Migration limits** | During the public preview, you can simultaneously migrate up to five VMs. Performance might be impacted over this limit.
**VM disks** | A single VM that you migrate can have up to 16 disks.<br/><br/> The combined maximum of five VMs can have a a total of 20 or less disks. If you have more, migrate VMs in batches.
**VM change rate** | During migration, each VM disk can have an average data change rate (write bytes/sec) of up to 5 MBps.<br/><br/> Higher rates are supported, but performance will vary depending on available upload throughput, overlapping writes etc.
**Azure disks** | VMs can only be migrated to managed disks (standard HHD, premium SSD) in Azure.
**Supported VMware VMs** | You can migrate VMware VMs running:<br/><br/> **Windows (64 or 32-bit)**: Windows Server 2016/2012 R2/2012/2008 R2/2008/2003<br/><br/> **Linux**: Red Hat Enterprise Linux 7.0+/6.5+, CentOS 7.0+/6.5+, SUSE Linux Enterprise Server 12 SP1+, Ubuntu 14.04/16.04/18.04LTS, Debian 7/8
**VM settings** | VMs with UEFI boot can't be migrated.<br/><br/> Encrypted disks and volumes (Bitlocker, cryptfs) can't be migrated.<br/><br/> RDM devices/passthrough disks can't be replicated.<br/><br/> NFS volumes on VMs can't be replicated.
    





## Next steps

- [Assess VMware VMs](tutorial-server-assessment-vmware.md) for migration.
- [Assess Hyper-V VMs](tutorial-server-assessment-hyper-v.md) for migration.


[green]: ./media/migrate-support-matrix/green.png
[yellow]: ./media/migrate-support-matrix/yellow.png
[red]: ./media/migrate-support-matrix/red.png
