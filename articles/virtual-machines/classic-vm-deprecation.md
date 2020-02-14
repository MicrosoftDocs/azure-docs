---
title: We’re retiring Azure Classic VMs on March 1, 2023 
description: Article provides a high-level overview of Classic VM retirement
services: virtual-machines
author: tanmaygore
manager: vashan
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.topic: article
ms.date: 02/10/2020
ms.author: tagore
---

# Migrate your IaaS resources to Azure Resource Manager by March 1, 2023 

In 2014, we launched IaaS on Azure Resource Manager, and have been enhancing capabilities ever since. Because it replaces IaaS resources from Azure Service Manager (ASM), we have started a 3 year retirement process for classic VMs beginning February 24th, 2020 and ending on March 1, 2023. 

If you use IaaS resources from ASM, please start planning today and complete migration by March 1, 2023. We encourage you to make the switch sooner to take all the advantages of [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/).  

## How does this affect me? 

1) On March 1st, 2023, all active Classic VMs will be a stopped/ deallocated but will not deleted immediately.
2) On March 1st, 2023, we will notify remaining subscriptions who have not migrated to ARM, about our timelines for deleting any remaining Classic VMs. 

The following Azure services and functionality will **NOT** be impacted by this retirement: 
- Cloud Services 
- Storage accounts **not** used by classic VMs 
- Virtual networks (VNets) **not** used by classic VMs. 

## What actions should I take? 

Start to migrate your existing VMs from classic (Azure Service Manager) to the Azure Resource Manager deployment model using our platform supported migration.  

Learn more about migrating your classic [Linux](./linux/migration-classic-resource-manager-overview.md) and [Windows](./windows/migration-classic-resource-manager-overview.md) VMs to Azure Resource Manager. 

For additional information, refer to the [Frequently asked questions about classic to Azure Resource Manager migration](https://docs.microsoft.com/azure/virtual-machines/windows/migration-classic-resource-manager-faq)

ADDITIONAL INFORMATION TO BE ADDED HERE


## Next steps

Create a plan to migrate your classic [Linux](./linux/migration-classic-resource-manager-plan.md) or [Windows](./windows/migration-classic-resource-manager-plan.md) VMs to Resource Manager.
