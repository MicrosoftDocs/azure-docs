---
title: Plan setup for a virtual machine offer on Azure Marketplace
description: Plan setup for a virtual machine offer in the Microsoft commercial marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 02/18/2022
---

# Plan setup for a virtual machine offer

## Plan setup

Set the high-level configuration for the type of plan, specify whether it reuses a technical configuration from another plan, and identify the Azure regions where the plan should be available. Your selections here determine which fields are displayed on other panes for the same plan.

### Azure regions

Your plan must be made available in at least one Azure region.

Select **Azure Global** to make your plan available to customers in all Azure Global regions that have commercial marketplace integration. For more information, see [Geographic availability and currency support](marketplace-geo-availability-currencies.md).

Select **Azure Government** to make your plan available in the [Azure Government](../azure-government/documentation-government-welcome.md) region. This region provides controlled access for customers from US federal, state, local, or tribal entities, and for partners who are eligible to serve them. You, as the publisher, are responsible for any compliance controls, security measures, and best practices. Azure Government uses physically isolated datacenters and networks (located in the US only).

Before you publish to [Azure Government](../azure-government/documentation-government-manage-marketplace-partners.md), test and validate your plan in the environment, because certain endpoints may differ. To set up and test your plan, request a trial account from the [Microsoft Azure Government trial](https://azure.microsoft.com/global-infrastructure/government/request/) page.

> [!NOTE]
> After your plan is published and available in a specific Azure region, you can't remove that region.

### Azure Government certifications

This option is visible only if you selected **Azure Government** as the Azure region in the preceding section.

Azure Government services handle data that's subject to certain government regulations and requirements. For example, FedRAMP, NIST 800.171 (DIB), ITAR, IRS 1075, DoD L4, and CJIS. To bring awareness to your certifications for these programs, you can provide up to 100 links that describe them. These can be either links to your listing on the program directly or links to descriptions of your compliance with them on your own websites. These links are visible to Azure Government customers only.

Select **Save draft** before continuing to the next tab in the left-nav Plan menu, **Plan listing**.

## Next steps

- [Plan listing](azure-vm-plan-listing.md)
