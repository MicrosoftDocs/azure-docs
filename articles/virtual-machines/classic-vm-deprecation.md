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
In 2014, we launched IaaS on Azure Resource Manager, and have been enhancing capabilities ever since. Because it replaces IaaS resources from Azure Service Manager (ASM), classic VMs will be retired on March 1, 2023. 
If you use IaaS resources from ASM, please migrate by March 1, 2023. We encourage you to make the switch sooner to take advantage of these feature enhancements: 
- Enables deploying complex applications through templates. 
- Includes scalable, parallel deployment for virtual machines into availability sets. 
- Provides lifecycle management of compute, network, and storage independently. 
- Enables security by default with the enforcement of virtual machines in a virtual network.


## How does this affect me? 

1. Starting September 1, 2021, you will no longer be able to create classic VMs using ASM. 
2. Beginning March 1, 2023, you will no longer be able to start any classic VMs using ASM. Any remaining VMs in a running or stopped-allocated state will be moved to a stopped-deallocated state.  We will not immediately delete remaining VMs. 
3. After March 1, 2023, we will notify remaining subscriptions who have not moved, about our timelines to delete remaining VMs. 


The following Azure services and functionality will NOT be impacted by this retirement: 
- Cloud Services 
- Storage accounts **not** used by classic VMs 
- Virtual networks (VNets) **not** used by classic VMs. 


## What actions should I take? 

Start to migrate your existing VMs from classic (Azure Service Manager) to the Azure Resource Manager deployment model using our platform supported migration.  

Learn more about migrating your classic [Linux](./linux/migration-classic-resource-manager-overview.md) and [Windows](./windows/migration-classic-resource-manager-overview.md) VMs to Azure Resource Manager. 

If you have questions, please [contact us](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). 

## Next steps

Create a plan to migrate your classic [Linux](./linux/migration-classic-resource-manager-plan.md) or [Windows](./windows/migration-classic-resource-manager-plan.md) VMs to Resource Manager.
