---
title: Create and edit plans for an Azure Container offer in Microsoft AppSource.
description: Create and edit plans for an Azure Container offer in Microsoft AppSource.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: keferna
ms.author: keferna
ms.date: 03/30/2021
---

# Create and edit plans for an Azure Container offer

This overview page lets you create different plan options within the same offer. Plans (formerly called SKUs) can differ in terms of in where they are available (Azure Global or Azure Government) and the image referenced by the plan. Your offer must contain at least one plan.

You can create up to 100 plans for each offer: up to 45 of these can be private. Learn more about private plans in [Private offers in the Microsoft commercial marketplace](private-offers.md).

After you create a plan, the **Plan overview** page shows:

- Plan names
- Pricing model
- Azure regions (Global or Government)
- Current publishing status
- Any available actions

The actions available for a plan vary depending on the current status of your plan. They include:

- **Delete draft** if the plan status is a Draft.
- **Stop sell plan** if the plan status is Published Live.

## Edit a plan

Select a plan **Name** to edit its details.

## Create a plan

To set up a new plan, select **+ Create new plan**.

Enter a unique **Plan ID** for each plan. This ID will be visible to customers in the product's web address. Use only lowercase letters and numbers, dashes, or underscores, and a maximum of 50 characters. You cannot change the Plan ID after you select **Create**.

Enter a **Plan name**. Customers see this name when deciding which plan to select within your offer. Each plan in this offer must have a unique name. For example, you might use an offer name of **Windows Server** with plans **Windows Server 2016** and **Windows Server 2019**.

Select **Create** and continue below.

## Next steps

- [+ Create new plan](azure-container-plan-setup.md), or
- Exit plan setup and continue with optional [Co-sell with Microsoft](marketplace-co-sell.md), or
- [Review and publish your offer](review-publish-offer.md)
