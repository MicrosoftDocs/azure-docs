---
title: Configure ISV to customer private offers in Microsoft Partner Center for Azure Marketplace
description: Configure ISV to customer private offers in Microsoft Partner Center for Azure Marketplace. 
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: emerb19
ms.author: emerb
ms.date: 04/28/2022
---

# ISV to customer private offers

Private offers allow publishers and customers to transact one or more products in Azure Marketplace by creating time-bound pricing with customized terms. This article explains the requirements and steps for a publisher to create a private offer for a customer in Azure Marketplace. Private offers aren't yet available in Microsoft AppSource.

This is what the private offer experience looks like from the publisher's perspective:

:::image type="content" source="media/isv-customer/isv-private-offer-experience.png" alt-text="Shows the progression of the ISV private offer experience with customers.":::

This is what the private offer experience looks like from the customer's perspective:

:::image type="content" source="media/isv-customer/customer-private-offer-experience.png" alt-text="Shows the progression of the customer's private offer experience with ISVs.":::

## Benefits of private offers

Private offers provide new deal-making capabilities to the marketplace that can't be achieved with private plans.

- **Time-bound discount** – Specify a start/end date for the discounted price. When the private offer ends, customers fall back to the publicly listed price.
- **Custom terms and contract upload** – Extend unique terms to each customer privately. By accepting your offer, the customer is accepting your terms. Attaching a PDF of your contract to the private offer is easy; no more plain text or amending the Microsoft Standard Contract.
- **Send by email** – Rather than coaching customers on where to find their offer in the Azure portal, email customers a link directly to their private offer. Save time by sending this email to anyone in the customer's company responsible for accepting the offer.
- **Deals expire** – Add urgency to the sales process by specifying the date by which the customer must accept the offer or it expires.
- **Faster arrival** – Private offers are available for purchase within 15 minutes (private plans take up to 48 hours to arrive).
- **Bundle discounts** – Select multiple products/plans to receive a discount; customers can accept the private offer for all of them at once.
- **Target a company** – Private offers are sent to an organization, not a tenant.

## Private offer prerequisites

Creating a private offer for a customer has these prerequisites:

- You've created a [commercial marketplace account](create-account.md) in Partner Center.
- Your account is enrolled in the commercial marketplace program.
- The offer you want to sell privately has been published to the marketplace and is publicly transactable.

## Supported offer types

Private offers can be created for all transactable marketplace offer types: SaaS, Azure Virtual Machines, and Azure Applications.

> [!NOTE]
> Discounts are applied on all custom meter dimensions your offer may use. They are only applied on the software charges set by you, not on the associated Azure infrastructure hardware charges.

## Private offers dashboard

Create and manage private offers from the **Private offers** dashboard in Partner Center's left-nav menu. This dashboard has two tabs:

- **Customers** – Create a private offer for a customer in Azure Marketplace. This opens the Customers private offer dashboard, which lets you:

    - Create new private offers
    - View the status of all your private offers
    - Clone existing private offers
    - Withdraw private offers
    - Delete private offers

- **CSP Partners** – Create a private offer for a CSP partner. See [ISV to CSP partner private offers](isv-csp-reseller.md).

    The **Customers** tab looks like this:

    :::image type="content" source="media/isv-customer/customer-tab.png" alt-text="Shows the private offers customer tab in Partner Center.":::

## Create a private offer for a customer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview).
2. Select the **Marketplace offers** workspace.
3. Select **Private offers** from the left-nav menu.
4. Select the **Customers** tab.
5. Select **+ New private offer**.
6. Enter a private offer name. This is a descriptive name for use within Partner Center and will be visible to your customer in the Azure portal.

### Offer setup

Use this page to define private offer terms, notification contacts, and pricing for your customer.

- **Customer Information** – Specify the billing account for the customer receiving this private offer. This will only be available to the configured customer billing account and the customer will need to be an owner or contributor or signatory on the billing account to accept the offer.

    > [!NOTE]
    > Customers can find their billing account in the [Azure portal ](https://aka.ms/PrivateOfferAzurePortal) under **Cost Management + Billing** > **Properties** > **ID**. A user in the customer organization should have access to the billing account to see the ID in Azure Portal. See [Billing account scopes in the Azure portal](../cost-management-billing/manage/view-all-accounts.md).

    :::image type="content" source="media/isv-customer/customer-properties.png" alt-text="Shows the offer Properties tab in Partner Center.":::

- **Private offer terms** – Specify the duration, accept-by date, and terms:

    - **Start date** – Choose **Accepted date** if you want the private offer to start as soon as the customer accepts it. If a private offer is extended to an existing customer of a Pay-as-you-go product, this will make the private price applicable for the entire month. To have your private offer start in an upcoming month, select **Specific month** and choose one. The start date for this option will always be the first day of the selected month.
    - **End date** – Choose the month for your private offer's **End date**. This will always be the last day of the selected month.
    - **Accept by** – Choose the expiration date for your private offer. Your customer must accept the private offer prior to this date.
    - **Terms and conditions** – Optionally, upload a PDF with terms and conditions your customer must accept as part of the private offer.

        > [!NOTE]
        > Your terms and conditions must adhere to Microsoft supported billing models, offer types, and the [Microsoft Publisher Agreement](/legal/marketplace/msft-publisher-agreement).

- **Notification Contacts** – Provide up to five emails in your organization as **Notification Contacts** to receive email updates on the status of your private offer. These emails are sent when your offer status changes to **Pending acceptance**, **Accepted**, or **Expired**. You must also provide a **Prepared by** email address, which will be displayed to the customer in the private offer listing in the Azure portal.

- **Pricing** – Configure the percentage-based discount or absolute price for up to 10 offers/plans in a private offer. For a percentage-based discount, the customer will receive this discount off your plan's list price in the marketplace.

    - Select **+ Add Offers/plans** to choose the offers/plans you want to provide a private offer for.
    - Choose to provide a custom price or discount at either an offer level (all current and future plans under that offer will have a discount associated to it) or at a plan level (only the plan you selected will have a private price associated with it).
    - Choose up to 10 offers/plans and select **Add**.
    - Enter the discount percentage or configure the absolute price for each item in the pricing table.
    - Absolute pricing lets you input a specific price for the private offer. You can only customize the price based on the same pricing model, billing term, and dimensions of the public offer. You can't change to a new pricing model or billing term or add dimensions.

        > [!NOTE]
        > Only public offers/plans that are transactable in Microsoft Azure Marketplace appear in the selection menu.

### Review and submit

Use this page to review the information you've provided. Once submitted, a private offer is locked for edits. You can still withdraw a private offer while it's pending acceptance by the customer.

When you're ready, select **Submit**. You'll be returned to the dashboard where you can view the offer's status. The notification contact(s) will be emailed once the offer is ready to be shared with your customer.

> [!NOTE]
> Microsoft will not send an email to your customer. You can copy the private offer link and share it with your customer for acceptance. Your customer will also be able to see the private offer under the **Private Offer Management** blade in the Azure portal.

## Clone a private offer

You can clone an existing offer and update its customer information to send it to different customers so you don't have to start from scratch. Or, update the offer/plan pricing to send additional discounts to the same customer.

1. Select **Private offers** from the left-nav menu.
2. Select the **Customers** tab.
3. Check the box of the private offer to clone.
4. Select **Clone**.
5. Enter a new private offer name.
6. Select **Clone**.
7. Edit the details on the **Offer setup** page as needed.
8. **Submit** the new private offer.

## Withdraw a private offer

Withdrawing a private offer means your customer will no longer be able to access it. A private offer can only be withdrawn if your customer hasn't accepted it.

To withdraw a private offer:

1. Select **Private offers** from the left-nav menu.
2. Select the **Customers** tab.
3. Check the box of the private offer to withdraw.
4. Select **Withdraw**.
5. Select **Request withdraw**.
6. Your offer status will be updated to **Draft** and can now be edited, if desired.

Once you withdraw a private offer, your customer will no longer be able to access it in the commercial marketplace.

## Delete a private offer

To delete a private offer in **Draft** status:

1. Select **Private offers** from the left-nav menu.
2. Select the **Customers** tab.
3. Check the box of the private offer to delete.
4. Select **Delete**.
5. Select **Confirm**.

This action will permanently delete your private offer. You can only delete private offers in **Draft** status.

## View private offer status

To view the status of a private offer:

1. Select **Private offers** from the left-nav menu.
2. Select the **Customer** tab.
3. Check the **Status** column.

The status of the private offer will be one of the following:

- **Draft** – You've started the process of creating a private offer but haven't submitted it yet.
- **In Progress** – A private offer you submitted is currently being published; this can take up to 15 minutes.
- **Pending acceptance** – Your private offer is pending customer acceptance. Ensure you've sent the private offer link to your customer.
- **Accepted** – Your private offer was accepted by your customer. Once accepted, the private offer can't be changed.
- **Expired** – Your private offer expired before the customer accepted it. You can withdraw the private offer to make changes and submit it again.
- **Ended** – Your private offer has passed its end date.

## Reporting on private offers

The payout amount and agency fee that Microsoft charges is based on the private price after the percentage-based discount or absolute price was applied to the products in your private offer.

## Next steps

**Further reading**

- [Frequently Asked Questions](isv-customer-faq.yml) about configuring ISV to customer private offers

**Video tutorials (YouTube)**

- [Private Offer Overview of ISV to Customer Offers](https://www.youtube.com/watch?v=SNfEMKNmstY)
- [ISV to Customer Private Offer Creation](https://www.youtube.com/watch?v=WPSM2_v4JuE)
- [ISV to Customer Private Offer Acceptance](https://www.youtube.com/watch?v=HWpLOOtfWZs)
- [ISV to Customer Private Offer Purchase Experience](https://www.youtube.com/watch?v=mPX7gqdHqBk)
