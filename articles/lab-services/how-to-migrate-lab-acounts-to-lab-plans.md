---
title: Migrate lab accounts to lab plans
titleSuffix: Azure Lab Services
description: 'Learn how to migrate lab accounts to lab plans in Azure Lab Services.'
ms.topic: how-to
author: RoseHJM
ms.author: rosemalcolm
ms.date: 11/25/2024

# customer intent: As an Azure Lab Services customer, I want to understand how to migrate from lab accounts (older version) or lab plans (newer version) to access enhanced features for better student experience and supportability.
---

# Migrate from lab accounts to lab plans

[!INCLUDE [Retirement guide](./includes/retirement-banner.md)]

There are two versions of Azure Lab Services.  Labs created from lab accounts use the older version, while labs created from lab plans use the newer version. Learn more about [finding lab version](find-delete-lab-resources.md#find-lab-version). 

Lab plans offer enhanced features such as improved performance, additional VM sizes, and enhanced student experience. There is no learning curve for students and teachers since the Labs Portal remains unchanged. Lab images can be reused from Azure Marketplace and Compute Gallery. 

There are three key steps to adopt lab plans: 

✅ Create a lab plan 

✅ Request capacity for lab plans 

✅ Create a lab

## 1. Create a lab plan
Review [existing lab accounts](how-to-manage-lab-accounts.md#view-lab-accounts) in the [Azure portal](https://portal.azure.com/) under the Lab configuration / Lab settings / Networking section and [create lab plans](quick-create-resources.md#create-a-lab-plan) for those that have virtual network peering disabled or labs no longer require connectivity to a specific network. 

If virtual network peering is enabled, don’t upgrade to lab plans and focus on exploring recommended Microsoft and partner solutions to [develop a retirement plan](retirement-guide.md). Advanced networking scenarios can be complex and may require additional lead time. 

> [!IMPORTANT]
> A lab plan’s resource group name is crucial because educators select it to [create a lab](quick-create-connect-lab.md#create-a-lab). Similarly, a lab plan name is important. If multiple lab plans exist in the resource group, educators will choose from a dropdown when creating a lab.  

## 2. Request capacity for lab plans

When using lab plans, you're assigned a dedicated VM cores quota per subscription. Initially, this quota is limited, so you need to request a core limit increase. 

> [!IMPORTANT]
> A capacity request for lab plans is necessary since lab account VM cores are not automatically available with lab plans. 

Capacity is assigned to your subscription and remains unaffected when creating or deleting lab plans. The first time you create a lab plan, a special Microsoft-managed Azure subscription is created internally to assign your [dedicated VM lab capacity](./capacity-limits.md#per-customer-assigned-capacity). 

[Request a core limit increase](how-to-request-capacity-increase.md?tabs=Labplans) by opening an Azure support ticket with the required region, Lab VM size(s), and total number of cores needed. 

## 3. Create a lab 

Once you have capacity assigned to your subscription, you can create and publish representative labs to validate the educator and student experience.   

Each VM size uses a newer [Azure VM Compute SKU](administrator-guide.md#vm-sizing). If you use an [attached compute gallery](how-to-attach-detach-shared-image-gallery.md), validate your customized images with the new SKU by testing common student workloads. Before creating labs, verify that each image in the compute gallery is replicated to the same regions enabled in your lab plans.

## Optional - Configure lab plans  

While you're waiting for capacity to be assigned, you can continue creating lab plans that will be used for setting up your labs. The following table maps configurations with lab accounts to lab plans: 

1. [Create and configure lab plans](./tutorial-setup-lab-plan.md).
    - If you plan to use a license server, don't forget to enable [advanced networking](./how-to-connect-vnet-injection.md) when creating your lab plans.
    - The lab plan’s resource group name is significant because educators will select the resource group to [create a lab](./tutorial-setup-lab.md#create-a-lab).
    - Likewise, the lab plan name is important.  If more than one lab plan is in the resource group, educators will see a dropdown to choose a lab plan when they create a lab.
1. [Assign permissions](./tutorial-setup-lab-plan.md#add-a-user-to-the-lab-creator-role) to educators that will create labs.
1. Enable [Azure Marketplace images](./specify-marketplace-images.md).
1. [Configure regions for labs](./create-and-configure-labs-admin.md).  You should enable your lab plans to use the regions that you specified in your capacity request.
1. Optionally, [attach an Azure Compute Gallery](./how-to-attach-detach-shared-image-gallery.md).
1. Optionally, configure [integration with Canvas](./lab-services-within-canvas-overview.md) including [adding the app and linking lab plans](./how-to-get-started-create-lab-within-canvas.md). Alternately, configure [integration with Teams](./lab-services-within-teams-overview.md) by [adding the app to Teams groups](./how-to-get-started-create-lab-within-teams.md).

If you're moving from lab accounts, the following table provides guidance on how to map your lab accounts to lab plans:

|Lab account configuration|Lab plan configuration|
|---|---|
|[Role assignments](./concept-lab-services-role-based-access-control.md) </br> - Lab account owner\contributor. </br> - Lab creator\owner\contributor.|Lab plans include new specialized roles. </br>1. [Review roles](./concept-lab-services-role-based-access-control.md). </br>2. [Assign permissions](./tutorial-setup-lab-plan.md#add-a-user-to-the-lab-creator-role).|
|Enabled Marketplace images. </br> - Lab accounts only support Gen1 images from the Marketplace.|Lab plans include settings to enable [Azure Marketplace images](./specify-marketplace-images.md). </br> - Lab plans support Gen1 and Gen2 Marketplace images, so the list of images will be different than what you would see if using lab accounts.|
|[Location](./how-to-create-lab-accounts.md#create-a-lab-account) </br> - Labs are automatically created within the same geolocation as the lab account. </br> - You can't specify the exact region where a lab is created. |Lab plans enable specific control over which regions labs are created. </br> - [Configure regions for labs](./create-and-configure-labs-admin.md).|
|[Attached Azure Compute Gallery](./how-to-attach-detach-shared-image-gallery-1.md)|Lab plans can be attached to the same gallery used by lab accounts. </br>1. [Attach an Azure Compute Gallery](./how-to-attach-detach-shared-image-gallery.md). </br>2. Ensure that you [enable images for the lab plan](./how-to-attach-detach-shared-image-gallery.md#enable-and-disable-images).|

## Optional - Update cost management reports

Update reports to include the new cost entry type, `Microsoft.LabServices/labs`, for labs created using lab plans. [Built-in and custom tags](./cost-management-guide.md#understand-the-entries) allow for [grouping](/azure/cost-management-billing/costs/quick-acm-cost-analysis) in cost analysis. For more information about tracking costs, see [Cost management for Azure Lab Services](./cost-management-guide.md).

## Difference between lab plans and lab accounts

between the two concepts. A lab plan is a set of configurations and settings for labs you create from it. Also, a lab is now an Azure resource in its own right and a sibling resource to lab plans. Learn more about [the difference between lab plans and lab accounts](./concept-lab-accounts-versus-lab-plans.md#difference-between-lab-plans-and-lab-accounts).

If you're moving from lab accounts to lab plans, there's likely to be a time when you're using both your existing lab accounts and using the newer lab plans. Both are still supported, can coexist in your Azure subscription, and can even share the same external resources.

## Next steps

- As an admin, [create a lab plan](quick-create-resources.md).
- As an admin, [manage your lab plan](how-to-manage-lab-plans.md).
- As an educator, [configure and control usage of a lab](how-to-manage-lab-users.md).
