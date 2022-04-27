---
title: Create plans for a virtual machine offer on Azure Marketplace
description: Create plans for a virtual machine offer on Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 02/18/2022
---

# Create plans for a virtual machine offer

On the **Plan overview** page (select from the left-nav menu in Partner Center) you can provide a variety of plan options within the same offer. An offer requires at least one plan (formerly called a SKU), which can vary by monetization audience, Azure region, features, or virtual machine (VM) images.

You can create up to 100 plans for each offer and up to 45 of these plans can be private. Learn more about private plans in [Private offers in the Microsoft commercial marketplace](private-offers.md).

After you create your plans, select the **Plan overview** tab to display:

- Plan names
- License models
- Audience (public or private)
- Current publishing status
- Available actions

The actions available on this pane vary depending on the current status of your plan.

- If the plan status is a draft, you can **Delete draft**.
- If the plan status is published live, you can either **Deprecate plan** or **Sync private audience**.

## Create a new plan

Select **+ Create new plan** at the top.

In the **New plan** dialog box, enter a unique **Plan ID** for each plan in this offer. This ID will be visible to customers in the product web address. Use only lowercase letters and numbers, dashes, or underscores, and a maximum of 50 characters.

> [!NOTE]
> The plan ID can't be changed after you select **Create**.

Enter a **Plan name**. Customers see this name when they're deciding which plan to select within your offer. Create a unique name that clearly points out the differences between plans. For example, you might enter **Windows Server** with *Pay-as-you-go*, *BYOL*, *Advanced*, and *Enterprise* plans.

Select **Create**. The **Plan setup** page appears.

## Next steps

- [Plan setup](azure-vm-plan-setup.md)
