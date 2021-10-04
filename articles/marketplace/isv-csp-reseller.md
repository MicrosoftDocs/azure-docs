---
title: Configure ISV to Cloud Reseller Private Offers in Microsoft Partner Center
description: Configure ISV to Cloud Reseller Private Offers in Microsoft Partner Center. 
author:  Microsoft-KaranRao
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
  author: emerb19
  ms.author: emerb
ms.date: 10/07/2021
---

# ISV to Cloud Reseller Private Offers

## Overview

Private Offers let Independent Software Vendors (ISVs) and Cloud Resellers (CSP partners) grow their revenue by creating time-bound customized margins that suit each entity’s business needs.

As an ISV, you can specify the margin and duration to create a wholesale price for your CSP partner. When your partner makes a sale to a customer, Microsoft will make its payments to you off the wholesale price.

As a CSP partner, you can discover all the margins available to you via Partner Center UI or API. For any sale you make, you receive your bill from Microsoft at the wholesale price. You continue to set your customer price and invoice your customer outside of the marketplace. [Learn more about the CSP partner experience for Private Offers]

:::image type="content" source="media/isv-csp-cloud/isv-private-offer-experience.png" alt-text="Shows the progression of the ISV Private Offer experience.":::

:::image type="content" source="media/isv-csp-cloud/csp-private-offer-experience.png" alt-text="Shows the progression of the CSP Private Offer experience.":::

## Prerequisites to create a Private Offer for Cloud Resellers

You must meet these pre-requisites to create a Private Offer for Cloud resellers:

1. You have created a commercial marketplace account in Partner Center.
2. Your account is enrolled in the commercial marketplace program.
3. You have published a transactable and publicly available offer to Azure marketplace.
4. Your offer is opted into the Cloud Reseller channel.
5. You are creating a Private Offer for a Cloud Reseller who is part of Microsoft’s Cloud Solution Provider (CSP) program.

### Supported offer types

Private Offers can be created for all transactable marketplace offer types. This includes SaaS, Azure Virtual Machines, and Azure Applications.

> [!NOTE]
> Margins are applied on all custom meter dimensions your offer may use. Margins are only applied on the software charges set by you, not on the associated Azure infrastructure hardware charges.

## Private Offers dashboard

The Private Offers dashboard is your centralized location to create and manage all your Private Offers. Access it by selecting **Private offers** in the left-nav menu of the commercial marketplace. This dashboard has two tabs:

1. **Customers**: Learn more about Private Offers for Customer once the feature goes into Private Preview in Fall 2021.
2. **Cloud Resellers**: Opens the Cloud Reseller Private Offer dashboard, which lets you:

    - Create new Private Offers
    - View the status of all your Private Offers
    - Clone existing Private Offers
    - Withdraw Private Offers
    - Delete Private Offers

## Create a new Private Offer for Cloud Resellers

1. Sign in to Partner Center.
2. Select Private Offers from the left-nav menu to open the dashboard.
3. Select the **Cloud Resellers** tab.
4. Select **+ New Private Offer**.
5. Enter a Private Offer name. This is a descriptive name that you will use to refer to your Private Offer within Partner Center. This name will not be visible to Cloud Resellers.  

### Offer Setup

The offer setup page lets you define Private Offer terms, notification contact, pricing, and Cloud Resellers.

1. **Private Offer terms** determine the duration during which your Cloud Resellers can discover and sell your Private Offer.

    - To have your Private Offer start immediately, choose a **Start Date** of “As soon as possible”. If all pre-requisites are met, your Private Offer will be made available within 15 minutes after you submit it. If a Private Offer is extended to an existing customer of a Pay-as-you-go-product, this will make the private price applicable for the entire month.
    - To have your Private Offer start in an upcoming month, select **Specific month** and make a selection. The start date for this option will always be the first of the month.
    - Choose the month for your Private Offer's **End date**. This will always be the last date of the month.

2. Provide up to five emails as **Notification Contacts** to receive email updates on the status of your Private Offer. These emails are sent when your Private Offer moves to **Live**, **Ended** or is **Withdrawn**.

3. Configure a **Pricing** margin percentage for up to 10 offers/plans in a Private Offer. The margin the Cloud Reseller receives will be a percentage off your plan's list price in the marketplace.

    - Select **+ Add Offers/plans** to choose the offers/plans you want to provide a Private Offer for.
    - Choose to provide a Private Offer at an offer level (all current and future plans under that Offer will have a private price associated to it) or at a plan level (only the plan you selected will have a private price associated with it).
    - Choose up to 10 offers/plans and then **Add**.
    - Enter the margin percentage to provide to your Cloud Resellers. The margin you provide will be calculated as a percentage off your plan's list price in the marketplace.

    > [!NOTE]
    > Only offers/plans that are transactable in Microsoft AppSource or Azure Marketplace appear in the selection menu.

4. Select the **Cloud Resellers** you authorize to sell your Private Offer.

    1. Select **+Add Cloud Resellers**.
    2. Search for your Cloud Reseller by name/tenant ID. Or, search by applying filters such as regions, skills, or competencies.
    3. Choose the Cloud Resellers and select **Add**.

    > [!NOTE]
    > - You can only select Cloud Resellers who are part of Microsoft’s Cloud Solution Provider (CSP) program. 
    > - Once your Private Offer ends, the Cloud Resellers you authorize can continue to sell your marketplace offer at the list price.
    > - Private offers can be extended to a maximum of 400 Cloud Resellers tenants.

### Review and Submit

This page is where you can review all of the information you've provided.

Once submitted, Private Offers cannot be modified. Ensure your information is accurate.

When you're ready, click **Submit**. You will be returned to the dashboard where you can view the status of your Private Offer. The notification contact(s) will receive an email once the Private Offer is Live.

## View Private Offers status

To view the status of your Private Offer:

1. Select **Private Offers** from the left-nav menu to open the dashboard.
2. Select the **Cloud Resellers** tab.
3. Examine the **Status** column.

The status of the Private Offer will be one of the following:

- **Draft**: You have started the process of creating a Private Offer but have not yet submitted it.
- **In Progress**: You have submitted a Private Offer and it is currently being published in our systems.
- **Live**: Your Private Offer is discoverable and transactable by Cloud Resellers.
- **Ended**: Your Private Offer has expired or passed its end date.

## Clone a Private Offer

Cloning a Private Offers helps you create a new Private Offer quickly.

1. Select **Private Offers** from the left-nav menu to open the dashboard.
2. Select the **Cloud Resellers** tab.
3. Check the box of the Private Offer you want clone.
4. Select **Clone**.
5. Enter a new Private Offer name.
6. Select **Clone**.
7. Edit the details on the Offer Setup page as needed.
8. **Submit** the new Private Offer.

## Withdraw a Private Offer

By withdrawing a Private Offer, your Cloud Resellers will immediately no longer receive a margin and all future purchases will be at the list price.

> [!IMPORTANT]
> Private Offers can only be withdrawn if no Cloud Reseller has sold it to a customer.

To withdraw a Private Offer:

1. Select **Private Offers** from the left-nav menu to open the dashboard.
2. Select the **Cloud Resellers** tab.
3. Check the box of the Private Offer you want to withdraw.
4. Select **Withdraw**.
5. Select **Request withdraw**.
6. Your notification contact(s) will receive an email if your Private Offer has been successfully withdrawn.

## Delete a Private Offer

To delete a Private Offer in draft state:

1. Select **Private Offers** from the left-nav menu to open the dashboard.
2. Select the **Cloud Resellers** tab.
3. Check the box of the Private Offer you want to delete.
4. Select **Delete**.
1. Select **Confirm**.

## Find additional details

While your Private Offer publish is in progress, you can view additional details on its current state:

1. Select **Private Offers** from the left-nav menu to open the dashboard.
2. Select the **Cloud Resellers** tab.
3. Select the “In Progress” hyperlink of the Private Offer in the **Status** column.

The additional details will be one of the following:

- **Cloud Reseller authorization in progress**: We are currently authorizing the given Cloud Reseller to be able to sell your offer.
- **Private Offer publish in progress**: We are currently publishing the given Cloud Reseller's private price.
- **Live**: The Private Offer is now Live for this Cloud Reseller.

## Reporting on Private Offers

The payout amount and agency fee that Microsoft charges is based on the price after margin is applied for line items with an associated margin.

## Next steps

- [FAQs](https://)
