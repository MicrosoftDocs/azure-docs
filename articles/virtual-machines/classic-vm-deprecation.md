---
title: We’re retiring Azure Classic VMs on March 1, 2023 
description: Article provides a high-level overview of Classic VM retirement
author: tanmaygore
manager: vashan
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: conceptual
ms.date: 02/10/2020
ms.author: tagore
---

# Migrate your IaaS resources to Azure Resource Manager by March 1, 2023 

In 2014, we launched IaaS on Azure Resource Manager, and have been enhancing capabilities ever since. Because [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) now has full IaaS capabilities and other advancements, we deprecated the management of IaaS VMs through [Azure Service Manager](https://docs.microsoft.com/azure/virtual-machines/windows/migration-classic-resource-manager-faq#what-is-azure-service-manager-and-what-does-it-mean-by-classic) on February 28, 2020 and this functionality will be fully retired on March 1, 2023. 

Today, about 90% of the IaaS VMs are using Azure Resource Manager. If you use IaaS resources through Azure Service Manager (ASM), start planning your migration now and complete it by March 1, 2023 to take advantage of [Azure Resource Manager](../azure-resource-manager/management/index.yml).

Classic VMs will be following the [Modern Lifecycle Policy](https://support.microsoft.com/help/30881/modern-lifecycle-policy) for retirement.

## How does this affect me? 

- Starting February 28, 2020, customers who did not utilize IaaS VMs through Azure Service Manager (ASM) in the month of February 2020 will no longer be able to create classic VMs. 
- On March 1, 2023, customers will no longer be able to start IaaS VMs using Azure Service Manager and any that are still running or allocated will be stopped and deallocated. 
- On March 1, 2023, subscriptions that are not migrated to Azure Resource Manager will be informed regarding timelines for deleting any remaining Classic VMs.  

The following Azure services and functionality will **NOT** be impacted by this retirement: 
- Cloud Services 
- Storage accounts **not** used by classic VMs 
- Virtual networks (VNets) **not** used by classic VMs. 
- Other classic resources

## What actions should I take? 

- Start planning your migration to Azure Resource Manager, today. 

- [Learn more](./windows/migration-classic-resource-manager-overview.md) about migrating your classic [Linux](./linux/migration-classic-resource-manager-plan.md) and [Windows](./windows/migration-classic-resource-manager-plan.md) VMs to Azure Resource Manager.

- For more information, refer to the [Frequently asked questions about classic to Azure Resource Manager migration](./windows/migration-classic-resource-manager-faq.md)

- For technical questions, issues, and adding subscriptions to the allow list, [contact support](https://ms.portal.azure.com/#create/Microsoft.Support/Parameters/{"pesId":"6f16735c-b0ae-b275-ad3a-03479cfa1396","supportTopicId":"8a82f77d-c3ab-7b08-d915-776b4ff64ff4"}).

- For other questions not part of FAQ and feedback, comment below.

- Complete the migration as soon as possible to prevent business impact and leverage improved performance, security & new features provided by Azure Resource Manager. 

## What resources are provided to me for this migration?

- [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-virtual-machines-migration.html): Microsoft & community support for migration

- [Azure Migration Support](https://ms.portal.azure.com/#create/Microsoft.Support/Parameters/{"pesId":"6f16735c-b0ae-b275-ad3a-03479cfa1396","supportTopicId":"1135e3d0-20e2-aec5-4ef0-55fd3dae2d58"}): Dedicated support team for technical assistance during migration

- [Microsoft Fast Track](https://www.microsoft.com/fasttrack): Microsoft Fast Track team can provide technical assistance during migration to eligible customers. 

- If your company/organization has partnered with microsoft and/or work with Microsoft representative like (Cloud Solution Architect (CSA), Technical Account Managers (TAMs)), please work with them for additional resources for migration. 

