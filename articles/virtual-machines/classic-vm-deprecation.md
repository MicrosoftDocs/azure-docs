---
title: We're retiring Azure VMs (classic) on September 1, 2023 
description: This article provides a high-level overview of the retirement of VMs created using the classic deployment model.
author: tanmaygore
manager: vashan
ms.service: virtual-machines
ms.subservice: classic-to-arm-migration
ms.workload: infrastructure-services
ms.custom: devx-track-arm-template
ms.topic: conceptual
ms.date: 02/10/2020
ms.author: tagore
---

# Migrate your IaaS resources to Azure Resource Manager by September 1, 2023 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

In 2014, we launched infrastructure as a service (IaaS) on [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/). We've been enhancing capabilities ever since. Because Azure Resource Manager now has full IaaS capabilities and other advancements, we deprecated the management of IaaS virtual machines (VMs) through [Azure Service Manager](./migration-classic-resource-manager-faq.yml) (ASM) on February 28, 2020. This functionality will be fully retired on September 1, 2023. 

Today, about 90 percent of the IaaS VMs are using Azure Resource Manager. If you use IaaS resources through ASM, start planning your migration now. Complete it by September 1, 2023, to take advantage of [Azure Resource Manager](../azure-resource-manager/management/index.yml).

VMs created using the classic deployment model will follow the [Modern Lifecycle Policy](https://support.microsoft.com/help/30881/modern-lifecycle-policy) for retirement.

## How does this affect me? 

- As of February 28, 2020, customers who didn't utilize IaaS VMs through ASM in the month of February 2020 can no longer create VMs (classic). 
- On September 1, 2023, customers will no longer be able to start IaaS VMs by using ASM. Any that are still running or allocated will be stopped and deallocated. 
- On September 1, 2023, subscriptions that are not migrated to Azure Resource Manager will be informed regarding timelines for deleting any remaining VMs (classic).  

This retirement does *not* affect the following Azure services and functionality: 
- Storage accounts *not* used by VMs (classic) 
- Virtual networks *not* used by VMs (classic) 
- Other classic resources

Azure Cloud Services (classic) retirement was announced in August 2021 [here](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/)

## What resources are available for this migration?

- [Microsoft Q&A](/answers/topics/azure-virtual-machines-migration.html): Microsoft and community support for migration.

- [Azure Migration Support](https://portal.azure.com/#create/Microsoft.Support/Parameters/{"pesId":"6f16735c-b0ae-b275-ad3a-03479cfa1396","supportTopicId":"1135e3d0-20e2-aec5-4ef0-55fd3dae2d58"}): Dedicated support team for technical assistance during migration. Customers without technical support can use [free support capability](https://portal.azure.com/#create/Microsoft.Support/Parameters/%7B%0A%20%20%20%20%22pesId%22%3A%20%22f3dc5421-79ef-1efa-41a5-42bf3cbb52c6%22%2C%0A%20%20%20%20%22supportTopicId%22%3A%20%22794bb734-af1b-e2d5-a757-dac7438009ab%22%2C%0A%20%20%20%20%22contextInfo%22%3A%20%22Migrate%20IAAS%20resources%20from%20Classic%20%28ASM%29%20to%20Azure%20Resource%20Manager%20%28ARM%29%22%2C%0A%20%20%20%20%22caller%22%3A%20%22NoSupportPlanASM2ARM%22%2C%0A%20%20%20%20%22severity%22%3A%20%222%22%0A%7D) provided specifically for this migration. 

- [Microsoft Fast Track](https://www.microsoft.com/fasttrack): Fast track can assist eligible customers with planning & execution for this migration. [Nominate yourself](https://azure.microsoft.com/programs/azure-fasttrack/#nominations) for DC Migration Program.  

- If your company/organization has partnered with Microsoft or works with Microsoft representatives (like cloud solution architects (CSAs) or customer success account managers (CSAMs)), please work with them for additional resources for migration.

## What actions should I take? 

Start planning your migration to Azure Resource Manager, today. 

1. Make a list of all affected VMs: 

   - The VMs of type **virtual machines (classic)** on the [Azure portal's VM pane](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.ClassicCompute%2FVirtualMachines) are all the affected VMs within the subscription. 
   - You can also query Azure Resource Graph by using the [portal](https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/resources%0A%7C%20where%20type%20%3D%3D%20%22microsoft.classiccompute%2Fvirtualmachines%22) or [PowerShell](../governance/resource-graph/concepts/work-with-data.md) to view the list of all flagged VMs (classic) and related information for the selected subscriptions. 
   - On February 8 and September 2, 2020, we sent out emails with subject "Start planning your IaaS VM migration to Azure Resource Manager" to subscription owners. The email provides a list of all subscriptions and VMs (classic) VMs in it. Please use them to build this list. 

1. [Learn more](./migration-classic-resource-manager-overview.md) about migrating your [Linux](./migration-classic-resource-manager-plan.md) and [Windows](./migration-classic-resource-manager-plan.md) VMs (classic) to Azure Resource Manager. For more information, see [Frequently asked questions about classic to Azure Resource Manager migration](./migration-classic-resource-manager-faq.yml).

1. We recommend starting the planning by using the [platform support migration tool](./migration-classic-resource-manager-overview.md) to migrate your existing VMs with three easy steps: validate, prepare, and commit. The tool is designed to migrate your VMs within minimal to no downtime. 

   - The first step, validate, has no impact on your existing deployment and provides a list of all unsupported scenarios for migration. 
   - Go through the [list of workarounds](./migration-classic-resource-manager-overview.md#unsupported-features-and-configurations) to fix your deployment and make it ready for migration. 
   - Ideally after all validation errors are fixed, you should not encounter any issues during the prepare and commit steps. After the commit is successful, your deployment is live migrated to Azure Resource Manager and can then be managed through new APIs exposed by Azure Resource Manager. 

   If the migration tool is not suitable for your migration, you can explore [other compute offerings](/azure/architecture/guide/technology-choices/compute-decision-tree) for the migration. Because there are many Azure compute offerings, and they're different from one another, we can't provide a platform-supported migration path to them.  

1. For technical questions, issues, and help with adding subscriptions to the allowlist, [contact support](https://portal.azure.com/#create/Microsoft.Support/Parameters/{"pesId":"6f16735c-b0ae-b275-ad3a-03479cfa1396","supportTopicId":"8a82f77d-c3ab-7b08-d915-776b4ff64ff4"}).

1. Complete the migration as soon as possible to prevent business impact and to take advantage of the improved performance, security, and new features of Azure Resource Manager.
