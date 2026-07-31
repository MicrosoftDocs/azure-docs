---
title: Track Your Conditional Azure Credit Offer (CACO)
description: Learn how to track your Conditional Azure Credit Offer (CACO) for a Microsoft Customer Agreement.
author: shrutis06
ms.reviewer: shrshett
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 02/23/2026
ms.author: shrshett
ms.custom: sfi-image-nochange
---

# Track your Conditional Azure Credit Offer (CACO)

A Conditional Azure Credit Offer (CACO) is a contractual agreement in which your organization commits to specific, predefined spending targets within set time periods and receives Azure credits for meeting these targets.

A CACO has multiple milestones with specific spending targets and an associated Azure Credit Offer (ACO) award at the end of each milestone. If you meet a milestone by its due date, you receive the award. If you don't meet a milestone by its due date, the system forfeits the award. The use of milestones can help your organization align rewards with its consumption patterns and business goals.

## Prerequisites

To view CACO details and track milestone progress, you must have any of the following roles:

- **Billing account access**. Owner, Contributor, or Reader role on the Microsoft Customer Agreement billing account.
- **Subscription access**. Owner, Contributor, or Reader role on the subscription where the CACO resource is created.

## Actions for tracking your CACO commitment

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box, enter **cost management + billing**.

3. Under **Services**, select **Cost Management + Billing**.

    :::image type="content" source="../../manage/media/conditional-credit-offer/cost-management-billing-search.png" alt-text="Screenshot that shows a search for Cost Management + Billing in the portal." lightbox="../../manage/media/conditional-credit-offer/cost-management-billing-search.png" :::

4. On the **Billing scopes** pane, select the billing account for which you want to track the commitment.

    :::image type="content" source="../../manage/media/conditional-credit-offer/billing-scopes-list.png" alt-text="Screenshot that shows billing scopes." lightbox="../../manage/media/conditional-credit-offer/billing-scopes-list.png" :::

5. On the left pane, expand **Billing** and select **Benefits**. Then select the **Conditional Azure Credit Offer** tile.  

    :::image type="content" source="../../manage/media/conditional-credit-offer/benefits-page.png" alt-text="Screenshot that shows billing benefits for a Microsoft Customer Agreement, including the Conditional Azure Credit Offer tile." lightbox="../../manage/media/conditional-credit-offer/benefits-page.png" :::

The **Conditional Azure Credit Offer (CACO)** pane has the following sections.

:::image type="content" source="../../manage/media/conditional-credit-offer/conditional-credit-offer-page.png" alt-text="Screenshot of the Conditional Azure Credit Offer pane." lightbox="../../manage/media/conditional-credit-offer/conditional-credit-offer-page.png" :::

### Overall commitment

The **Overall commitment** section displays the total commitment amount for your CACO, across milestones.

### Details

The **Details** section displays other important aspects of your commitment.

| Term | Definition |
| ---- | ---------- |
| **ID** | Identifier that uniquely identifies your CACO. |
| **Start date** | Date when the commitment becomes effective. |
| **End date** | Date when the commitment expires, which is the end date of the final milestone. |
| **Commitment amount** | Aggregated amount that you commit to spend on CACO-eligible products and services across milestones. |
| **Status** | Status of your commitment. |

Your CACO can have one of the following statuses:

- **Scheduled**. The CACO has a future start date and isn't yet active. No eligible Azure spending contributes toward your commitment until you reach the start date.
- **Active**. The CACO is currently in effect. Eligible Azure spending contributes toward fulfilling your commitment.
- **Completed**. You fully met the CACO commitment amount. No further action is required.
- **Expired**. The CACO end date passed without the commitment being fully met. Contact your Microsoft account team for more information.
- **Canceled**. The CACO was terminated before the end date. New Azure spending doesn't contribute toward your CACO commitment. Contact your Microsoft account team for more information.

### Current Milestone

The **Current Milestone** section displays a summary of the current milestone that you need to achieve to earn the associated Azure Credit Offer award.

| Term | Definition |
| --- | ----------- |
| **Spend Target** | Amount that you must spend for this milestone to get the ACO award. |
| **Credit Award** | ACO award amount that you get for meeting the milestone. |
| **Milestone** | Name of the milestone. |
| **Progress** | Amount of spending so far for the milestone. |
| **End date** | Date by which you must meet the milestone. |
| **Status** | Status of the milestone. |

To view the complete list of milestones for your CACO commitment, select **Show all Milestones**. This view provides detailed information about each milestone's progress and status.

:::image type="content" source="../../manage/media/conditional-credit-offer/conditional-credit-offer-milestones.png" alt-text="Screenshot of an example list of all Conditional Azure Credit Offer milestones." lightbox="../../manage/media/conditional-credit-offer/conditional-credit-offer-milestones.png" :::

| Column | Definition |
| ------ | ---------- |
| **Id** | Unique identifier for the milestone. |
| **End Date** | Deadline by which you must achieve the milestone. |
| **Spend target** | Total spending amount required to meet the milestone. |
| **Progress%** | Current progress percentage toward achieving the milestone consumption target. |
| **Credit award** | ACO amount that you get if you meet the milestone. |
| **Status** | Current status of the milestone. |

A milestone can have one of the following statuses:

| Status | Description |
| ------ | ----------- |
| **Scheduled** | The milestone has a future start date and isn't yet active. |
| **Active** | The milestone is currently in progress. Eligible Azure spending contributes toward fulfilling the milestone target. |
| **Pending** | The milestone is pending evaluation. |
| **Completed** | You met the milestone target within the specified timeframe. The system grants the associated ACO award. |
| **Missed** | The milestone deadline passed without your meeting the consumption target. The system forfeits the ACO award that corresponds to this milestone. |
| **Canceled** | The system canceled the milestone before completion. This situation might occur when you modify or terminate the overall CACO commitment. |
| **Removed** | The system removed the milestone from the CACO commitment. This status typically occurs when you renegotiate commitment terms. |

### Transactions

The **Transactions** section displays transactions that decremented your CACO commitment.

| Term | Definition |
| ---- | ----------- |
| **Date** | Date when the event happened. |
| **Description** | Description of the event. |
| **Billing profile** | Billing profile for which the event happened. The billing profile applies only to Microsoft Customer Agreements. |
| **CACO decrement** | Amount of CACO decrement from the event. |
| **Remaining commitment** | Remaining CACO commitment after the event. |

## CACO alerts

Microsoft sends email notifications to billing account admins to help ensure that you meet CACO commitments and milestones on time to receive ACO awards. These alerts provide advance notice so you can take action before forfeiting ACO awards.

### CACO expiry alerts

If you don't reach your CACO target, billing account admins get email notifications at the following intervals:

- 90 days before offer expiry
- 60 days before offer expiry
- 30 days before offer expiry

### Milestone alerts

If you don't meet the milestone target, billing account admins get email alerts at the following intervals:

- 90 days before milestone due date
- 60 days before milestone due date
- 30 days before milestone due date

## Azure services that are eligible for a CACO

CACO spending eligibility differs from a traditional Azure Consumption Commitment in several key areas.

A CACO focuses on actual consumption rather than purchases:

- **Azure prepayments**. For an Azure Consumption Commitment prepayment, purchases count toward commitment but prepayment spending doesn't. A CACO operates on the opposite principle: prepayment purchases don't count toward milestones, but spending those prepayment credits does count toward your commitment.
- **Microsoft Marketplace purchases**. For an Azure Consumption Commitment, Marketplace purchases are eligible for milestone tracking. For a CACO, Marketplace purchases aren't eligible for milestone tracking.

This consumption-focused approach ensures that ACO awards are based on genuine Azure service consumption rather than up-front credit purchases, regardless of the payment method for covering that consumption.

The following table outlines which Azure services and purchases are eligible for tracking CACO spending:

| Service/purchase type | CACO eligibility | Azure Consumption Commitment eligibility | Notes |
| --------------------- | ---------------- | ---------------- | ----- |
| **All consumption pay-as-you-go charges** | ✅ | ✅ | Standard consumption charges count toward CACO milestones. |
| **Azure entitlement purchases (reserved instances and Azure savings plans)** | | | |
| - Up-front/monthly billing | ✅ | ✅ | Initial purchase or monthly payments count toward milestones. |
| - Monthly usage | ❌ | ❌ | Usage that these purchases cover doesn't count. |
| **Azure prepayments (monetary credits)** | | | |
| - Purchase | ❌ | ✅ | CACO doesn't count prepayment purchases. |
| - Prepayment spending | ✅ | ❌ | CACO counts spending of prepayment credits. |
| **Milestone shortfall credit** | | | |
| - Purchase | ❌ | ✅ | Milestone shortfall credit purchase doesn't count toward a CACO. |
| - Credit applied | ✅ | ❌ | Milestone shortfall credit use goes toward a CACO. |
| **Shortfall charge (credit)** | | | |
| - Purchase | ❌ | ✅ | Azure Consumption Commitment shortfall credit purchase doesn't count toward a CACO. |
| - Credit applied | ❌ | ❌ | Azure Consumption Commitment shortfall credit use doesn't go toward a CACO because it's the penalty charge for not fulfilling an Azure Consumption Commitment. |
| **Awarded credits (ACO, outage, goodwill)** | | | |
| - Awarded amount | ❌ | ❌ | Any credits that aren't purchased don't count toward commitments. |
| - Credit applied | ❌ | ❌ | Consumption that awarded credits cover doesn't count. |
| **Microsoft Marketplace** | ❌ | ✅ | Marketplace purchases don't count toward CACO milestones. |

## Support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
