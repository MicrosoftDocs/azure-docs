---
title: Get started migrating from Azure Lab Services v1 to Azure Lab Services v2
description: 
ms.topic: 
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/27/2022
---

# Get started migrating from Azure Lab Services v1 to Azure Lab Services v2

**Getting started**

Use the following checklist to get started with Azure Lab Services August 2022 Update:

- Create a simple, temporary lab plan.
- Request capacity.
- Configure shared resources.
- Create additional lab plans.
- Validate images.
- Create and publish labs.
- Update cost management reports.

If you are moving from the current version of Azure Lab Services to the August 2022 Update, there likely will be a time when you're using both lab accounts and lab plans. Lab accounts and lab plans can coexist in your subscription and share the same external resources. However, lab accounts and lab plans do not share capacity. You must request new capacity for lab plans even if you have existing capacity for lab accounts.

With all the new enhancements, it's a good time to revisit your overall lab structure. More than one lab plan might be needed depending on your scenario. For example, the math department may only require one lab plan in one resource group. The computer science department might require multiple lab plans. One lab plan can enable advanced networking and a few custom images. Another lab plan can use basic networking and not enable custom images. Multiple lab plans can be kept in the same resource group.

Let's cover each step to get started with the August 2022 Update in more detail.

1. **Create a simple, temporary lab plan.** Before you request capacity, you must have at least one lab plan in your subscription. You can create a simple, temporary lab plan for the purpose of requesting capacity, and delete the plan afterwards. The first time you create a lab plan, a special Microsoft-managed Azure subscription is automatically created. This subscription isn't visible to you and is used internally to assign you [dedicated capacity](https://learn.microsoft.com/en-us/azure/lab-services/capacity-limits#per-customer-assigned-capacity).
  1. [Create](https://learn.microsoft.com/en-us/azure/lab-services/tutorial-setup-lab-plan) a lab plan.

  - This lab plan can be deleted once capacity is requested.
  - You do _not_ need to enable advanced networking or images; or assign permissions.
  - You can select any region.

1. **Request capacity**. Customers are now assigned their own [dedicated VM cores quota](https://learn.microsoft.com/azure/lab-services/capacity-limits#per-customer-assigned-capacity). This quota is assigned per-subscription. The initial number of VM cores assigned to your subscription is limited, so you will need to request a core limit increase. Even if you are already using lab accounts in the current version of Azure Lab Services, you will still need to request a core limit increase – existing cores in a lab account will _not_ be available when you create a lab plan.
  1. [Request a core limit increase](https://learn.microsoft.com/en-us/azure/lab-services/how-to-request-capacity-increase?tabs=Labplans).
  2. If you created a temporary lab plan, you can delete it at this point. Deleting lab plans has _no_ impact on your subscription or the capacity you have available. Capacity is assigned to your subscription.

The time that it takes to assign capacity varies depending on the VM size, region, and number of cores requested. We recommend the following:

- Request capacity as far in advance as possible.
- Make incremental requests for VM cores rather than making large, bulk requests. For example, when you move from lab accounts to lab plans, you should first request sufficient capacity to set up a few representative labs that serve as a proof-of-concept. Later, you can make additional capacity requests based on your upcoming lab needs.

1. **Configure shared resources**. You can reuse the same Azure Compute Gallery and licensing servers that you use with your lab accounts. Optionally, you can also [configure more licensing servers](https://learn.microsoft.com/en-us/azure/lab-services/how-to-create-a-lab-with-shared-resource) and galleries based on your needs. For VMs that require access to a licensing server, you will create lab plans with [advanced networking](https://learn.microsoft.com/en-us/azure/lab-services/how-to-connect-vnet-injection#connect-the-virtual-network-during-lab-plan-creation) enabled as shown in the next step.
2. **Create additional lab plans**. While you are waiting for capacity to be assigned, you can continue creating lab plans that will be used for setting up your labs.
  1. [Create](https://learn.microsoft.com/en-us/azure/lab-services/tutorial-setup-lab-plan) and configure lab plans.
    - If you plan to use a license server, don't forget to enable [advanced networking](https://learn.microsoft.com/en-us/azure/lab-services/how-to-connect-vnet-injection#connect-the-virtual-network-during-lab-plan-creation) when creating your lab plans.
    - The lab plan's resource group name is significant because educators will select the resource group to [create a lab](https://learn.microsoft.com/en-us/azure/lab-services/tutorial-setup-lab#create-a-lab).
    - Likewise, the lab plan name is important. If more than one lab plan is in the resource group, educators will see a dropdown to choose a lab plan when they create a lab.
  2. [Assign permissions](https://learn.microsoft.com/en-us/azure/lab-services/tutorial-setup-lab-plan#add-a-user-to-the-lab-creator-role) to educators that will create labs.
  3. Enable [Azure Marketplace images](https://learn.microsoft.com/en-us/azure/lab-services/specify-marketplace-images).
  4. [Configure regions for labs](https://learn.microsoft.com/en-us/azure/lab-services/create-and-configure-labs-admin). You should enable your lab plans to use the regions that you specified in your capacity request.
  5. Optionally, [attach an Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/lab-services/how-to-attach-detach-shared-image-gallery).
  6. Optionally, configure [integration with Canvas](https://learn.microsoft.com/en-us/azure/lab-services/lab-services-within-canvas-overview) including [adding the app and linking lab plans](https://learn.microsoft.com/en-us/azure/lab-services/how-to-get-started-create-lab-within-canvas). Alternately, configure [integration with Teams](https://learn.microsoft.com/en-us/azure/lab-services/lab-services-within-teams-overview) by [adding the app to Teams groups](https://learn.microsoft.com/en-us/azure/lab-services/how-to-get-started-create-lab-within-teams).

If you are moving from lab accounts, the following table provides guidance on how to map your lab accounts to lab plans:

| **Lab account configuration** | **Lab plan configuration** |
| --- | --- |
| [Virtual network peering](https://learn.microsoft.com/en-us/azure/lab-services/how-to-connect-peer-virtual-network#configure-at-the-time-of-lab-account-creation) | Lab plans can reuse the same virtual network as lab accounts.
- [Setup advanced networking](https://learn.microsoft.com/en-us/azure/lab-services/how-to-connect-vnet-injection#connect-the-virtual-network-during-lab-plan-creation) when you create the lab plan.
 |
| [Role assignments](https://learn.microsoft.com/en-us/azure/lab-services/administrator-guide-1#manage-identity)
- Lab account owner\contributor.
- Lab creator\owner\contributor.
 | Lab plans include new specialized roles.
- [Review roles](https://learn.microsoft.com/en-us/azure/lab-services/administrator-guide#rbac-roles).
- [Assign permissions](https://learn.microsoft.com/en-us/azure/lab-services/tutorial-setup-lab-plan#add-a-user-to-the-lab-creator-role).
 |
| [Enabled Marketplace images](https://learn.microsoft.com/en-us/azure/lab-services/specify-marketplace-images-1).
Lab accounts only support Gen1 images from the Marketplace. | Lab plans include settings to enable [Azure Marketplace images](https://learn.microsoft.com/en-us/azure/lab-services/specify-marketplace-images).
Lab plans support Gen1 and Gen2 Marketplace images, so the list of images will be different than what you would see if using lab accounts.
 |
| [Location](https://learn.microsoft.com/en-us/azure/lab-services/how-to-manage-lab-accounts#create-a-lab-account)
- Labs are automatically created within the same "geolocation" as the lab account.
- There isn't the ability to specify the exact region where a lab is created.
 | Lab plans enable specific control over which regions labs are created.
- [Configure regions for labs](https://learn.microsoft.com/en-us/azure/lab-services/create-and-configure-labs-admin).
 |
| [Attached Azure Compute Gallery (Shared Image Gallery)](https://learn.microsoft.com/en-us/azure/lab-services/how-to-attach-detach-shared-image-gallery-1) | Lab plans can be attached to the same gallery used by lab accounts.
- [Attach an Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/lab-services/how-to-attach-detach-shared-image-gallery).
- Ensure that you [enable images for the lab plan](https://learn.microsoft.com/azure/lab-services/how-to-attach-detach-shared-image-gallery#enable-and-disable-images).
 |
| Teams integration | Configure lab plans with [Teams integration](https://learn.microsoft.com/en-us/azure/lab-services/lab-services-within-teams-overview) by [adding the app to Teams groups](https://learn.microsoft.com/en-us/azure/lab-services/how-to-get-started-create-lab-within-teams). |

1. **Validate images**. Each of the VM sizes has been remapped to use a newer [Azure VM Compute SKU](https://learn.microsoft.com/en-us/azure/lab-services/administrator-guide#vm-sizing). If using an [attached compute gallery](https://learn.microsoft.com/en-us/azure/lab-services/how-to-attach-detach-shared-image-gallery), you should validate each of your customized images with the new VM Compute SKU by publishing a lab with the image and testing common student workloads. Before creating labs, verify that each image in the compute gallery is replicated to the same regions enabled in your lab plans.
2. **Create and publish labs**. Once you have capacity assigned to your subscription, you can [create and publish](https://learn.microsoft.com/en-us/azure/lab-services/tutorial-setup-lab) representative labs to validate the educator and student experience. Lab administrators and educators should validate performance based on common student workloads.
3. **Update cost management reports.**  Update reports to include the new cost entry type, Microsoft.LabServices/labs, for labs created using the August 2022 Update. [Built-in and custom tags](https://learn.microsoft.com/en-us/azure/lab-services/cost-management-guide#understand-the-entries) allow for [grouping](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/quick-acm-cost-analysis) in cost analysis. For more information about tracking costs, see [Cost management for Azure Lab Services](https://learn.microsoft.com/en-us/azure/lab-services/cost-management-guide).