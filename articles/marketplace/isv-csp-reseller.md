---
title: Configure ISV to CSP partner private offers in Microsoft Partner Center
description: Configure ISV to CSP partner private offers in Microsoft Partner Center. 
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: emerb19
ms.author: emerb
ms.date: 04/28/2022
---

# ISV to CSP partner private offers

## Overview

Private offers let Independent Software Vendors (ISVs) and partners in the Cloud Solution Provider (CSP) program grow their revenue by creating time-bound customized margins that suit each entity’s business needs.

As an ISV, you can specify the margin and duration to create a wholesale price for your CSP partner. When your partner makes a sale to a customer, Microsoft will make its payments to you off the wholesale price.

As a CSP partner, you can discover all the margins available to you via Partner Center UI or API. For any sale you make, you receive your bill from Microsoft at the wholesale price. You continue to set your customer price and invoice your customer outside of the marketplace. Learn more about the CSP partner experience for private offers at [Discover margins configured by ISVs](/partner-center/csp-commercial-marketplace-margins).

:::image type="content" source="media/isv-csp-cloud/isv-private-offer-experience.png" alt-text="Shows the progression of the ISV private offer experience.":::

:::image type="content" source="media/isv-csp-cloud/csp-private-offer-experience.png" alt-text="Shows the progression of the CSP private offer experience.":::

> [!NOTE]
> If you only publish your offer to Microsoft AppSource (so it is not available through Azure Marketplace) and opted it in to be sold by partners in the Cloud Solution Provider (CSP) program, there may be a delay with your offer displaying for CSP partners to purchase in their portal. Please contact [support](./support.md) if you believe your offer is not available for your CSP partner to transact.

## Prerequisites to create a private offer for CSP partners

You must meet these prerequisites to create a private offer for CSP partners:

- You have created a commercial marketplace account in Partner Center.
- Your account is enrolled in the commercial marketplace program.
- You have published a transactable and publicly available offer to Azure Marketplace.
- Your offer is opted in to the Cloud Reseller channel.
- You are creating a private offer for a partner who is part of Microsoft’s Cloud Solution Provider (CSP) program.

### Supported offer types

Private offers can be created for all transactable marketplace offer types. This includes SaaS, Azure Virtual Machines, and Azure Applications.

> [!NOTE]
> Margins are applied on all custom meter dimensions your offer may use. Margins are only applied on the software charges set by you, not on the associated Azure infrastructure hardware charges.

## Private offers dashboard

Create and manage private offers from the **Private offers** dashboard in Partner Center’s left-nav menu. This dashboard has two tabs:

- **Customers**: Create a private offer for a customer in Azure Marketplace. See [ISV to customer private offers](isv-customer.md).
- **CSP partners**: Create a private offer for a CSP partner in Azure Marketplace. This opens the **CSP Partner** private offer dashboard, which lets you:
    - Create new private offers
    - View the status of all your private offers
    - Clone existing private offers
    - Withdraw private offers
    - Delete private offers

## Create a private offer for a CSP partner

1. Sign in to Partner Center.
2. Select **Private offers** from the left-nav menu to open the dashboard.
3. Select the **CSP partners** tab.
4. Select **+ New Private offer**.
5. Enter a private offer name. This is a descriptive name that you will use to refer to your private offer within Partner Center. This name will not be visible to CSP partners.  

### Offer setup

The offer setup page lets you define private offer terms, notification contact, pricing, and CSP partners.

1. **Private offer terms** determine the duration during which your CSP partners can discover and sell your private offer.

    - To have your private offer start immediately, choose a **Start Date** of “As soon as possible”. If all prerequisites are met, your private offer will be made available within 15 minutes after you submit it. If a private offer is extended to an existing customer of a Pay-as-you-go-product, this will make the private price applicable for the entire month.
    - To have your private offer start in an upcoming month, select **Specific month** and make a selection. The start date for this option will always be the first of the month.
    - Choose the month for your private offer's **End date**. This will always be the last date of the month.

2. Provide up to five emails as **Notification Contacts** to receive email updates on the status of your private offer. These emails are sent when your private offer moves to **Live**, **Ended**, or is **Withdrawn**.

3. Configure the percentage-based margins <!-- or absolute **Pricing** -->for up to ten offers/plans in a private offer. Margin can be given at an offer level so it applies to all plans within the offer, or it can be given only for a specific plan. The margin the CSP partner receives will be a percentage off your plan's list price in the marketplace.
    <!--- *Absolute price* can be used to specify a price point higher, lower, or equal to the publicly listed plan price; it can only be applied at a plan level and does not apply to Virtual Machine offer types. You can only customize the price based on the same pricing model, billing term, and dimensions of the public offer; you cannot change to a new pricing model or billing term or add dimensions.<br><br> -->

    1. Select **+ Add Offers/plans** to choose the offers/plans you want to provide a private offer for.
    1. Choose to provide a custom price or margin at either an offer level (all current and future plans under that offer will have a margin associated to it) or at a plan level (only the plan you selected will have a private price associated with it).
    1. Choose up to ten offers/plans and select **Add**.
    1. Enter the margin percentage <!-- or configure the absolute price -->for each item in the pricing table.

    > [!NOTE]
    > Only offers/plans that are transactable in Microsoft AppSource or Azure Marketplace appear in the selection menu.

4. Select the **CSP partners** you authorize to sell your private offer.

    1. Select **+Add CSP partners**.
    2. Search for your CSP partners by name/tenant ID. Or, search by applying filters such as regions, skills, or competencies.
    3. Choose the CSP partners and select **Add**.

    > [!NOTE]
    > - You can only select CSP partners who are part of Microsoft’s Cloud Solution Provider (CSP) program. 
    > - Once your private offer ends, the CSP partners you authorize can continue to sell your marketplace offer at the list price.
    > - Private offers can be extended to a maximum of 400 CSP partners tenants.

5. Optional: To extend a private offer to individual customers of a CSP partner, choose **All customers selected** for that CSP partner.

    1. Choose **Select customers**.
    2. Under **Provide customer tenant ID**, select **+Add**.
    3. Enter the customer’s tenant ID. You can add up to 25 customers for the CSP partner, who will need to provide the customer tenant IDs.
    4. Click **Add**.

### Review and submit

This page is where you can review all the information you've provided. Once submitted, private offers cannot be modified. Ensure your information is accurate.

When you're ready, select **Submit**. You will be returned to the dashboard where you can view the status of your private offer. The notification contact(s) will receive an email once the private offer is live.

## View private offers status

To view the status of your private offer:

1. Select **Private offers** from the left-nav menu to open the dashboard.
2. Select the **CSP partners** tab.
3. Examine the **Status** column.

The status of the private offer will be one of the following:

- **Draft** – You have started the process of creating a private offer but have not yet submitted it.
- **In Progress** – You have submitted a private offer and it is currently being published in our systems.
- **Live** – Your private offer is discoverable and transactable by CSP partners.
- **Ended** – Your private offer has expired or passed its end date.

## Clone a private offer

Cloning a private offer helps you create a new private offer quickly.

1. Select **Private offers** from the left-nav menu to open the dashboard.
2. Select the **CSP partners** tab.
3. Check the box of the private offer you want to clone.
4. Select **Clone**.
5. Enter a new private offer name.
6. Select **Clone**.
7. Edit the details on the Offer Setup page as needed.
8. **Submit** the new private offer.

## Withdraw a private offer

By withdrawing a private offer, your CSP partners will immediately no longer receive a margin and all future purchases will be at the list price.

> [!IMPORTANT]
> Private offers can only be withdrawn if no CSP partner has sold it to a customer.

To withdraw a private offer:

1. Select **Private offers** from the left-nav menu to open the dashboard.
2. Select the **CSP partners** tab.
3. Check the box of the private offer you want to withdraw.
4. Select **Withdraw**.
5. Select **Request withdraw**.
6. Your notification contact(s) will receive an email if your private offer has been successfully withdrawn.

## Delete a private offer

To delete a private offer in draft state:

1. Select **Private offers** from the left-nav menu to open the dashboard.
2. Select the **CSP partners** tab.
3. Check the box of the private offer you want to delete.
4. Select **Delete**.
5. Select **Confirm**.

## Find additional details

While your private offer publish is in progress, you can view additional details on its current state:

1. Select **Private offers** from the left-nav menu to open the dashboard.
2. Select the **CSP partners** tab.
3. Select the **In Progress** link of the private offer in the **Status** column.

The additional details will be one of the following:

- **CSP partner authorization in progress** – We are currently authorizing the given CSP partner to be able to sell your offer.
- **Private offer publish in progress** – We are currently publishing the given CSP partner's private price.
- **Live** – The private offer is now Live for this CSP partner.

## Reporting on private offers

The payout amount and agency fee that Microsoft charges is based on the price after margin is applied for line items with an associated margin.

## Next steps

**Further reading**

- [Frequently Asked Questions](./isv-csp-faq.yml) about configuring ISV to CSP partner private offers

**Video tutorials (YouTube)**

- [Private Offers for CSP Partners Overview](https://www.youtube.com/watch?v=FWfpAZsPyzg)
- [Private Offer Creation by ISVs for CSP Partners](https://www.youtube.com/watch?v=B0ZPXrE_aio)
- [The CSP Partner Private Offer Purchase Process](https://www.youtube.com/watch?v=1GM_YrUHVT4)
