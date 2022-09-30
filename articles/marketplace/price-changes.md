---
title: Learn about changing the prices of offers in the commercial marketplace (Partner Center)
description: Learn about changing the prices of offers in the commercial marketplace using Partner Center.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: keferna 
ms.author: keferna 
ms.reviewer: keferna 
ms.date: 04/01/2022
---

# Changing prices in active commercial marketplace offers

The price change feature allows publishers to change the prices of marketplace offers transacted through Microsoft. This article describes how to change the price of an offer.

Publishers can update the prices of previously published plans and publish the price changes to the marketplace. Microsoft schedules price changes in the future to align with future billing cycles.

If the price of an offer increased, existing customers of the offer receive an email notification prior to the increase becoming effective. The product listing page on Microsoft AppSource and Azure Marketplace will start displaying a notice of the upcoming increased price.

Once the price change becomes effective, customers will be billed at the new price. If locked into a contract, they will continue to receive the contract price for the length of the contract term. Contract renewals will receive the new price.

The price change experience for publishers and customers:

:::image type="content" source="media/price-change-experience.png" lightbox="media/price-change-experience.png" alt-text="Screenshot shows the price change experience for ISVs and new and existing customers.":::

### Feature benefits

The price change feature provides the following benefits:

- **Easy to change prices** – Publishers can increase or decrease the prices of offers without having to create a new plan with the new price and retire the previous plan, including offers published solely to the preview phase.
- **Automatic billing of the new price** – Once the price change becomes effective, existing customers will automatically be billed the new price without any action needed on their part.
- **Customer notifications** – Customers will be notified of price increases through email and on the product listing page of the marketplace.

### Sample scenarios

The price change feature supports the following scenarios:

- Increase or decrease the [monthly/yearly flat fee](#changing-the-flat-fee-of-a-saas-or-azure-app-offer).
- Increase or decrease the [per-user monthly/yearly SaaS fee](#changing-the-per-user-fee-of-a-saas-offer).
- Increase or decrease the [price per unit of a meter dimension](#changing-the-meter-dimension-of-a-saas-or-azure-app-offer).
- Increase or decrease the [price per core or per core size](#changing-the-core-price-of-a-virtual-machine).

### Supported offer types

The ability to change prices is available for both public and private plans of offers transacted through Microsoft.

Supported offer types:
- Azure application (Managed App)
- Software as a service (SaaS)
- Azure virtual machine.

Price changes for the following offer types are not yet supported:
- Dynamics 365 apps on Dataverse and Power Apps
- Power BI visual
- Azure container

### Unsupported scenarios and limitations

The price change feature does not support the following scenarios:

- Price changes on hidden plans.
- Price changes on plans available in Azure Government cloud.
- Price increase and decrease on the same plan. To make both changes, first schedule the price decrease. Once it becomes effective, publish the price increase. See [Plan for a price change](#plan-a-price-change) below.
- Canceling and modifying a price change through Partner Center. To cancel a price update, contact [support](https://go.microsoft.com/fwlink/?linkid=2056405).
- Changing prices from free or $0 to paid.
- Changing prices via APIs.

Price changes will go through full certification. To avoid delays in scheduling it, don't make other changes to the offer along with the price change.

## Plan a price change

When planning a price change, consider the following:

| Consideration | Impact | Behavior |
| --- | --- | --- |
| Type of price change | This dictates how far into the future the price will be scheduled. | - Price decreases are scheduled for the first of the next month.<br> - Price increases are scheduled for the first of a future month, at least 90 days after the price change is published.<br> |
| Offer type | This dictates when you need to publish the price change via Partner Center. | Price changes must be published before the cut-off times below to be scheduled for the next month (based on type of price change):<br> - Software as a service offer: Four days before the end of the month.<br> - Virtual machine offer: Six days before the end of the month.<br> - Azure application offer: 14 days before the end of the month.<br> |

#### Examples

For a price decrease to a Software as a service offer to take effect on the first of the next month, publish the price change at least four days before the end of the current month.

For a price increase to a Software as a service offer to take effect on the first of a future month, 90 days out, publish the price change at least four days before the end of the current month.

## Changing the flat fee of a SaaS or Azure app offer

To update the monthly or yearly price of a SaaS or Azure app offer:

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview).
2. Select the offer to update from the table of offers.
3. Select the plan to update from the **Plan Overview** page.
4. Select the plan's **Pricing and Availability** page.
5. Scroll to the **Pricing** section of the page and locate the billing term and price.
6. To change prices specific for a market:
    1. Export the prices using **Export pricing data**.
    2. Update the prices for each market in the downloaded spreadsheet and save it.
    3. Import the spreadsheet using **Import pricing data**.
7. To change prices across all markets, edit the desired **billing term price** box.

    > [!NOTE]
    > If the plan is available in multiple markets, the new price for each market is calculated according to current exchange rates.

8. Select **Save draft**.
9. Confirm you understand the effects of changing the price by entering the **ID of the plan**.
10. Verify the current and new prices on the **Compare** page, which is accessible from the top of the pricing and availability page.
11. When you're ready to publish your updated offer pricing, select **Review and publish** from any page.
12. Select **Publish** to submit the updated offer. Your offer will go through the standard [validation and publishing steps](review-publish-offer.md#validation-and-publishing-steps).
13. Review the offer preview once it's available and select **Go-live** to publish the new prices.

Once publishing is complete, you will receive an email with the effective date of the new price.

### How this price change affects customers

Existing customers maintain their contract price for the length of the term. A contract renewal receives the new price in effect at that time.

New customers are billed the price in effect when they purchase.

## Changing the per-user fee of a SaaS offer

To update the per user monthly or yearly fee of a SaaS offer:

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview).
2. Select the offer to update from the table of offers.
3. Select the plan to update from the **Plan Overview** page.
4. Select the plan's **Pricing and Availability** page.
5. Scroll to the **Pricing** section of the page and locate the billing term and price.
6. To change prices specific for a market:
    1. Export the prices using **Export pricing data**.
    2. Update the prices for each market in the downloaded spreadsheet and save it.
    3. Import the spreadsheet using **Import pricing data**.
7. To change prices across all markets, edit the desired **billing term price** box.

    > [!NOTE]
    > If the plan is available in multiple markets, the new price for each market is calculated according to current exchange rates.

8. Select **Save draft**.
9. Confirm you understand the effects of changing the price by entering the **ID of the plan**.
10. Verify the current and new prices on the **Compare** page, which is accessible from the top of the pricing and availability page.
11. When you're ready to publish your updated offer pricing, select **Review and publish** from any page.
12. Select **Publish** to submit the updated offer. Your offer will go through the standard [validation and publishing steps](review-publish-offer.md#validation-and-publishing-steps).
13. Review the offer preview once it's available and select **Go-live** to publish the new prices.

Once publishing is complete, you will receive an email with the effective date of the new price.

### How this price change affects customers

Existing customers maintain their contract price for the length of the term. If a customer adds or removes a user while in the contract, the new seat number will use the contract price. A contract renewal receives the new price in effect at that time.

New customers are billed the price in effect when they purchase.

## Changing the meter dimension of a SaaS or Azure app offer

To update the price per unit of a meter dimension of a SaaS or Azure app offer:

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview).
2. Select the offer to update from the table of offers.
3. Select the plan to update from the **Plan Overview** page.
4. Select the plan's **Pricing and Availability** page.
5. Scroll to the **Marketplace Metering Service dimension** section of the page.
6. To change prices specific for a market:
    1. Export the prices using **Export pricing data**.
    2. Locate the sheet for the dimension to update in the downloaded spreadsheet; it will be labeled with the dimension ID.
    3. Update the price per unit for each market and save it.
    4. Import the spreadsheet using **Import pricing data**.
1. To change prices across all markets:
    1. Locate the dimension to update.
    1. Edit the **Price per unit in USD** box.

    > [!NOTE]
    > If the plan is available in multiple markets, the new price for each market is calculated according to current exchange rates.

8. Select **Save draft**.
9. Confirm you understand the effects of changing the price by entering the **ID of the plan**.
10. Verify the current and new prices on the **Compare** page, which is accessible from the top of the pricing and availability page.
11. When you're ready to publish your updated offer pricing, select **Review and publish** from any page.
12. Select **Publish** to submit the updated offer. Your offer will go through the standard [validation and publishing steps](review-publish-offer.md#validation-and-publishing-steps).
13. Review the offer preview once it's available and select **Go-live** to publish the new prices.

Once publishing is complete, you will receive an email with the effective date of the new price.

### How this price change affects customers

Customers are billed the new price for overage usage if it is consumed after the new price is in effect.

## Changing the core price of a virtual machine

To update the price per core or per core size of a VM offer.

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview).
2. Select the offer to update from the table of offers.
3. Select the plan to update from the **Plan Overview** page.
4. Select the plan's **Pricing and Availability** page.
5. Scroll to the **Pricing** section of the page.
6. To change prices specific for a market:

    **Option 1**: You do the currency conversion:
    1. Under **Select a price entry**, select the **Per market and core size** option.
    2. Under **Select a market to customize prices**, select the **market** you want to change the price for.
    3. Update the price per hour for each core size.
    4. Repeat if you want to update prices for several markets.

    **Option 2**: Export to a spreadsheet:
    1. Export the prices using **Export pricing data**.
    2. Update the market and core size prices in the downloaded spreadsheet and save it.
    3. Import the spreadsheet using **Import pricing data**.

7. To change prices across all markets:

    > [!NOTE]
    > If the plan is available in multiple markets, the new price for each market is calculated according to current exchange rates.

    1. **Per core**: Edit the price per core in the **USD/hour** box.
    2. **Per core size**: Edit each core size in the **Price per hour in USD** box.

8. Select **Save draft**.
9. Confirm you understand the effects of changing the price by entering the **ID of the plan**.
10. Verify the current and new prices on the **Compare** page, which is accessible from the top of the pricing and availability page.
11. When you're ready to publish your updated offer pricing, select **Review and publish** from any page.
12. Select **Publish** to submit the updated offer. Your offer will go through the standard [validation and publishing steps](review-publish-offer.md#validation-and-publishing-steps).
13. Review the offer preview once it's available and select **Go-live** to publish the new prices.

Once publishing is complete, you will receive an email with the effective date of the new price.

### How this price change affects customers

Customers are billed the new price for consumption of the resource that happens after the new price is in effect.

## Canceling or modifying a price change

To modify an already scheduled price change, request the cancellation by submitting a [support request](https://partner.microsoft.com/support/?stage=1) that includes the Plan ID, price, and the market (if the change was market-specific).

If the price change was an increase, we will email customers a second time to inform them the price increase has been canceled.

After the price change is canceled, follow the steps in the appropriate part of this document to schedule a new price change with the needed modifications.

## Next steps

- Sign in to [Partner Center](https://go.microsoft.com/fwlink/?linkid=2166002).
