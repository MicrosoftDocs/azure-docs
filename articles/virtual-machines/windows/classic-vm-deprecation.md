---
title: We’re retiring Azure Classic VMs on March 1, 2023 
description: Article provides a high level overview of Classic VM Retirement
services: virtual-machines-windows
documentationcenter: ''
author: tanmaygore
manager: vashan
editor: ''
tags: azure-resource-manager

ms.assetid: 78492a2c-2694-4023-a7b8-c97d3708dcb7
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.topic: article
ms.date: 02/06/2020
ms.author: tagore
---


# Migrate your IaaS resources to Azure Resource Manager by March 1, 2023 
In 2014, we launched IaaS on Azure Resource Manager, and have been enhancing capabilities ever since. Because it replaces IaaS resources from Azure Service Manager (ASM), classic VMs will be retired on March 1, 2023. 
If you use IaaS resources from ASM, please migrate by March 1, 2023. We encourage you to make the switch sooner to take advantage of these feature enhancements: 
- Enables deploying complex applications through templates. 
- Includes scalable, parallel deployment for virtual machines into availability sets. 
- Provides lifecycle management of compute, network and storage independently. 
- Enables security by default with the enforcement of virtual machines in a virtual network.


## How does this affect me? 
Starting September 1, 2021, you will no longer be able to create classic VMs using ASM. 
Beginning March 1, 2023, you will no longer be able to start any classic VMs using ASM. Any remaining VMs in a running or stopped-allocated state will be moved to a stopped-deallocated state. 
We will not immediately delete remaining VMs. After March 1, 2023, we will notify remaining subscriptions who have not moved, about our timelines to delete remaining VMs. 
The following Azure services and functionality will NOT be impacted by this retirement: Cloud Services, storage accounts NOT used by classic VMs, and virtual networks (VNets) NOT used by classic VMs. 


## What actions should I take? 
You should migrate your existing VMs from Azure Service Manager (ASM) to Azure Resource Manager (ARM) using our platform supported migration.  
[Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/migration-classic-resource-manager-overview) about migrating your ASM resources to ARM. 

If you have questions, please [contact us](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). 
