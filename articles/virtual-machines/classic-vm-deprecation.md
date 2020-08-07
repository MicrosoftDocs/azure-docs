---
title: We’re retiring Azure Classic VMs on March 1, 2023 
description: Article provides a high-level overview of Classic VM retirement
author: tanmaygore
manager: vashan
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 02/10/2020
ms.author: tagore
---

# Migrate your IaaS resources to Azure Resource Manager by March 1, 2023 

In 2014, we launched IaaS on Azure Resource Manager, and have been enhancing capabilities ever since. Because [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) now has full IaaS capabilities and other advancements, we deprecated the management of IaaS VMs through Azure Service Manager on February 28, 2020 and this functionality will be fully retired on March 1, 2023. 

Today, about 90% of the IaaS VMs are using Azure Resource Manager. If you use IaaS resources through Azure Service Manager (ASM), start planning your migration now and complete it by March 1, 2023 to take advantage of [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/).

Classic VMs will be following the [Modern Lifecycle Policy](https://support.microsoft.com/help/30881/modern-lifecycle-policy) for retirement.

## How does this affect me? 

1) Starting February 28, 2020, customers who did not utilize IaaS VMs through Azure Service Manager (ASM) in the month of February 2020 will no longer be able to create classic VMs. 
2) On March 1, 2023, customers will no longer be able to start IaaS VMs using Azure Service Manager and any that are still running or allocated will be stopped and deallocated. 
2) On March 1, 2023, subscriptions who have not migrated to Azure Resource Manager will be informed regarding timelines for deleting any remaining Classic VMs.  

The following Azure services and functionality will **NOT** be impacted by this retirement: 
- Cloud Services 
- Storage accounts **not** used by classic VMs 
- Virtual networks (VNets) **not** used by classic VMs. 
- Other classic resources

## What actions should I take? 

- Start planning your migration to Azure Resource Manager, today. 

- [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/migration-classic-resource-manager-overview) about migrating your classic [Linux](./linux/migration-classic-resource-manager-plan.md) and [Windows](./windows/migration-classic-resource-manager-plan.md) VMs to Azure Resource Manager.

- For more information, refer to the [Frequently asked questions about classic to Azure Resource Manager migration](https://docs.microsoft.com/azure/virtual-machines/windows/migration-classic-resource-manager-faq)

- For technical questions, issues and subscription whitelisting [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

- For other questions not part of FAQ and feedback, comment below.
