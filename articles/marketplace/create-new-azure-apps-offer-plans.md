---
title: How to create plans for your Azure application offer
description: Learn how to create plans for your Azure application offer in Partner Center.
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 11/06/2020
---

# How to create plans for your Azure application offer

Offers sold through the Microsoft commercial marketplace must have at least one plan to list your offer in the commercial marketplace. You can create a variety of plans with different options within the same offer. These plans (sometimes referred to as SKUs) can differ in terms of plan type (_solution template_ or _managed application_), monetization, or audience. For general guidance on plans, see [Plans and pricing for commercial marketplace offers](plans-pricing.md).

## Create a plan

1. Near the top of the **Plan overview** tab, select **+ Create new plan**.
1. In the dialog box that appears, in the **Plan ID** box, enter a unique plan ID. This ID will be visible to customers in the product URL. Use up to 50 lowercase alphanumeric characters, dashes, or underscores. You cannot modify the plan ID after you select **Create**.
1. In the **Plan name** box, enter a unique name for this plan. Customers will see this name when deciding which plan to select within your offer. Use a maximum of 50 characters.
1. Select **Create**.

## Define the plan setup

The **Plan setup** tab enables you to set the type of plan, whether it reuses the technical configuration from another plan, and what Azure regions the plan should be available in. Your answers on this tab will affect which fields are displayed on other tabs for this plan.

### Select the plan type

- From the **Type of plan** list, select either **Solution template** or **Managed application**.

A **Solution template** plan is managed entirely by the customer. A **Managed application** plan enables publishers to manage the application on behalf of the customer. For details on these two plan types, see [Types of plans](plan-azure-application-offer.md#types-of-plans).

### Re-use technical configuration (optional)

If you’ve created more than one plan of the same type within this offer and the technical configuration is identical between them, you can reuse the technical configuration from another plan. This setting cannot be changed after this plan is published.

#### To re-use technical configuration

1. Select the **This plan reuses the technical configuration from another plan of the same type** check box.
1. In the list that appears, select the base plan you want.

> [!NOTE]
> When you re-use packages from another plan, the entire **Technical configuration** tab disappears from this plan. The Technical configuration details from the other plan, including any updates that you make in the future, are used for this plan as well.

### Select Azure regions (clouds)

Your plan must be made available in at least one Azure region. After your plan is published and available in a specific Azure region, you can't remove that region from your offer.

#### Azure Global region

The **Azure Global** check box is selected by default. This makes your plan available to customers in all Azure Global regions that have commercial marketplace integration. For Managed Application plans, you can select with markets you want to make your plan available.

To remove your offer from this region, clear the **Azure Global** check box.

#### Azure Government region

This region provides controlled access for customers from U.S. federal, state, local, or tribal entities, as well as partners eligible to serve them. You, as the publisher, are responsible for any compliance controls, security measures, and best practices. Azure Government uses physically isolated data centers and networks (located in the U.S. only).

Azure Government services handle data that is subject to certain government regulations and requirements. For example, FedRAMP, NIST 800.171 (DIB), ITAR, IRS 1075, DoD L4, and CJIS. To bring awareness to your certifications for these programs, you can provide up to 100 links that describe them. These can be either links to your listing on the program directly or links to descriptions of your compliance with them on your own websites. These links are visible to Azure Government customers only.

##### To select the Azure Government region

1. Select the **Azure Government** check box.
1. Under **Azure Government certifications**, select **+ Add certification (max 100)**.
1. In the boxes that appear, provide a name and link to a certification.
1. To add another certification, repeat steps 2 and 3.

Select **Save draft** before continuing to the next tab: Plan listing.

## Define the plan listing

The **Plan listing** tab is where you configure listing details of the plan. This tab displays specific information that shows the difference between plans in the same offer. You can define the plan name, summary, and description as you want them to appear in the commercial marketplace.

1. In the **Plan name** box, the name you provided earlier for this plan appears here. You can change it at any time. This name will appear in the commercial marketplace as the title of your offer's software plan and is limited to 100 characters.
1. In the **Plan summary** box, provide a short summary of your plan (not the offer). This summary is limited to 100 characters.
1. In the **Plan description** box, explain what makes this software plan unique and any differences from other plans within your offer. Don't describe the offer, just the plan. This description may contain up to 2,000 characters.
1. Select **Save draft** before continuing.

## Next steps

Do one of the following:

- If you’re configuring a solution template plan, go to [Configure a solution template plan](create-new-azure-apps-offer-solution.md).
- If you’re configuring a managed application plan, go to [Configure a managed application plan](create-new-azure-apps-offer-managed.md).
