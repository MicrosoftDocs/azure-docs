---
title: Track your Conditional Azure Credit Offer (CACO)
description: Learn how to track your Conditional Azure Credit Offer (CACO) for a Microsoft Customer Agreement.
author: shrutis06
ms.reviewer: shrshett
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 05/27/2026
ms.author: shrshett
ms.custom: sfi-image-nochange
---

# Track your Conditional Azure Credit Offer (CACO)

A Conditional Azure Credit Offer (CACO) is a contractual agreement in which your organization commits to specific, predefined spend targets within set time periods and receives Azure credits for meeting these targets. A CACO is composed of multiple milestones with specific spend targets and an associated ACO award at the end of each milestone, allowing your organization to align rewards with your consumption patterns and business goals.

### Types of CACO

| Type | Description |
|------|-------------|
| **CACO** | Credits are awarded based on your total Azure consumption across all eligible services. |
| **Service-Specific CACO (SS-CACO)** | Only consumption of specific Azure services, product families, or regions counts toward your milestone targets. Credits earned can be applied across your Azure usage as with any ACO. |

Both types follow the same milestone-based structure, tracking experience, and alerting. The key difference is that SS-CACO applies an additional eligibility filter — only consumption of configured services, products, or regions counts toward milestones.

You can have a CACO and one or more SS-CACO offers active simultaneously. The same eligible Azure spend counts toward both your CACO and SS-CACO milestones concurrently. However, you can't have two SS-CACO offers that target the same set of services or products during the same time period.


## Prerequisites

To view CACO details, you must have any of the following roles:

**Billing Account Access**
- Owner, Contributor, or Reader role on the Microsoft Customer Agreement (MCA) billing account

**Subscription Access** 
- Owner, Contributor, or Reader role on the subscription where the CACO resource is created

> [!NOTE]
> You only need permissions at one of these levels to view CACO details and track milestone progress.

## Track your CACO Commitment

### [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **Cost Management + Billing**.  
    :::image type="content" source="../../manage/media/conditional-credit-offer/cost-management-billing-search.png" alt-text="Screenshot showing search in portal for Cost Management + Billing." lightbox="../../manage/media/conditional-credit-offer/cost-management-billing-search.png" :::
3. In the billing scopes page, select the billing account for which you want to track the commitment. 
    :::image type="content" source="../../manage/media/conditional-credit-offer/billing-scopes-list.png" alt-text="Screenshot that shows Billing Scopes." lightbox="../../manage/media/conditional-credit-offer/billing-scopes-list.png" :::
4. Select **Benefits** from the left-hand side and then select the **Conditional Azure Credit Offer (CACO)** tile.  
    :::image type="content" source="../../manage/media/conditional-credit-offer/benefits-page.png" alt-text="Screenshot that shows selecting the CACO tab for MCA." lightbox="../../manage/media/conditional-credit-offer/benefits-page.png" :::

> [!NOTE]
> If your billing account has multiple CACO offers (for example, a CACO and one or more Service-Specific CACOs), the portal displays a list view showing all active offers. Select any offer from the list to view its details, milestone progress, and transactions.

## CACO page overview

The CACO detail page has the following sections. These sections apply to both CACO and SS-CACO offers.

#### Overall commitment 

:::image type="content" source="../../manage/media/conditional-credit-offer/conditional-credit-offer-page.png" alt-text="Screenshot of CACO page." lightbox="../../manage/media/conditional-credit-offer/conditional-credit-offer-page.png" :::

The overall commitment displays the total commitment amount for your CACO, across milestones.

#### Details

The Details section displays other important aspects of your commitment.

| Term | Definition |
|---|---|
| ID | An identifier that uniquely identifies your CACO. |
| Type | Whether this is a CACO or a Service-Specific CACO (SS-CACO). |
| Start date | The date when the commitment becomes effective. |
| End date | The date when the commitment expires, which is the end date of the last milestone. |
| Commitment amount | The aggregated amount you commit to spend on CACO-eligible products/services across milestones. |
| Status | The status of your commitment. |

Your CACO can have one of the following statuses:

- **Scheduled:** The CACO has a future start date and isn't yet active. No eligible Azure spend contributes toward your commitment until the start date is reached.
- **Active:** The CACO is currently in effect. Eligible Azure spend contributes toward fulfilling your commitment.
- **Completed:** The CACO commitment amount is fully met. No further action is required.
- **Expired:** The CACO end date passes without the commitment being fully met. Contact your Microsoft Account team for more information.
- **Canceled:** The CACO is terminated before the end date. New Azure spend doesn't contribute toward your CACO commitment. Contact your Microsoft Account team for more information.

#### Upcoming Milestone

The Upcoming Milestone section displays the next milestone that needs to be achieved to earn the associated ACO award.

| Term | Definition |
|---|---|
| Start Date | The date when the milestone period begins |
| End Date | The date by which the milestone must be met |
| Consumption target | The spending amount required to achieve this milestone |
| Target ACO | The Azure Credit Offer award amount you receive for meeting this milestone |
| Status | Whether the milestone is active, pending, met, or missed |

You can select **Show all Milestones** to view the complete list of milestones for your CACO commitment.

#### Transactions

This section displays transactions that decremented your CACO commitment.

| Term | Definition |
|---|---|
| Date | The date when the event happened |
| Description | A description of the event |
| Billing profile | The billing profile for which the event happened. The billing profile only applies to Microsoft Customer Agreements. |
| CACO decrement | The amount of CACO decrement from the event |
| Remaining commitment | The remaining CACO commitment after the event |

## CACO Milestones

Every CACO offer consists of one or many milestones with a target amount, date, and corresponding credit award for meeting the milestone amount. 

- **Met milestone:** If you meet a milestone by its due date, you receive the corresponding ACO (Azure Credit Offer) award associated with that milestone.

- **Missed milestone:** If you don't meet a milestone by its due date, the system forfeits the ACO award corresponding to that milestone.

### Milestone models

CACO offers (both CACO and SS-CACO) use one of two milestone models:

#### Time-bound milestones

Milestones have specific start and end dates. Credits are awarded only if the spend target for each milestone is met within its timeframe. If a milestone is missed, the corresponding credit is forfeited.

**Example – Time-bound milestones:**

A customer has three milestones over a 12-month offer, each evaluated at its deadline:

| Milestone | Period | Cumulative Target | Cumulative Spend at Deadline | Result | ACO Award |
|---|---|---:|---:|---|---:|
| 1 | Jan–Mar | $150,000 | $100,000 | ❌ Missed | Forfeited |
| 2 | Jan–Jun | $200,000 | $210,000 | ✅ Met | $15,000 |
| 3 | Jan–Dec | $300,000 | $290,000 | ❌ Missed | Forfeited |

> [!NOTE]
> Each milestone is evaluated independently at its deadline. Credits for missed milestones are forfeited even if the cumulative target is reached later.

#### Flexible milestones

All milestones share the same overall end date. Credits are awarded as cumulative targets are reached at any point during the offer period, regardless of order. This model supports scenarios where workload adoption may ramp up gradually.

**Example – Flexible milestones:**

The same customer has three milestones, all with the same end date:

| Milestone | Period | Cumulative Target | Cumulative Spend When Met | Result | ACO Award |
|---|---|---:|---:|---|---:|
| 1 | Jan–Dec | $150,000 | $170,000 (May) | ✅ Met | $10,000 |
| 2 | Jan–Dec | $250,000 | $250,000 (Sep) | ✅ Met | $20,000 |
| 3 | Jan–Dec | $300,000 | $290,000 (Dec) | ❌ Missed | Forfeited |

> [!NOTE]
> With flexible milestones, credits are awarded as soon as each cumulative target is reached, regardless of when during the offer period. This allows you to continue earning credits even if early adoption is slower than expected.

### All Milestones

When you select **Show all Milestones**, you can view a comprehensive list of all milestones associated with your CACO commitment. This view provides detailed information about each milestone's progress and status.

:::image type="content" source="../../manage/media/conditional-credit-offer/conditional-credit-offer-milestones.png" alt-text="Screenshot of all CACO milestones." lightbox="../../manage/media/conditional-credit-offer/conditional-credit-offer-milestones.png" :::

| Column | Definition |
|---|---|
| ID | The unique identifier for each milestone (for example, Milestone1, Milestone2, Milestone3) |
| End Date | The deadline by which the milestone must be achieved |
| Consumption target | The total spending amount required to meet this milestone |
| Progress% | The current progress percentage toward achieving the milestone consumption target |
| ACO award | The Azure Credit Offer amount you receive if the milestone is met |
| Status | The current status of the milestone |

**Milestone statuses:**

| Status | Description |
|--------|-------------|
| Scheduled | The milestone has a future start date and isn't yet active. |
| Active | The milestone is currently in progress and eligible Azure spend contributes toward fulfilling the milestone target. |
| Pending | The milestone is pending evaluation. |
| Completed | The milestone target is successfully met within the specified timeframe and the system grants the associated ACO award. |
| Missed | The milestone deadline passes without meeting the consumption target. The system forfeits the ACO award corresponding to this milestone. |
| Canceled | The system cancels the milestone before completion. This situation may occur when you modify or terminate the overall CACO commitment. |
| Removed | The system removes the milestone from the CACO commitment. This status typically occurs when you renegotiate commitment terms. |


## CACO Alerts

Microsoft sends email notifications to Billing Account Admins to help ensure CACO commitments and milestones are met on time to receive ACO awards. These alerts apply to both CACO and SS-CACO offers.

### CACO expiry alerts

If your CACO target isn't reached, email notifications are sent to Billing Account Admins at the following intervals before the CACO end date:

- 90 days before expiry
- 60 days before expiry
- 30 days before expiry

### Milestone alerts

Email alerts are sent to Billing Account Admins at the following intervals before each milestone due date if the milestone target isn't met:

- 90 days before milestone due date
- 60 days before milestone due date
- 30 days before milestone due date

---

## Eligible spend

CACO spend eligibility differs from traditional MACC (Microsoft Azure Consumption Commitment) in several key areas. The following table compares eligibility across MACC and CACO:

| Service/Purchase Type | MACC | CACO | Notes |
|----------------------|:---:|:---:|--------|
| **All consumption pay-as-you-go charges** | ✅ | ✅ | |
| **Azure 1st party entitlement purchases (RI/Savings Plans)** |  |  |  |
| - Upfront/Monthly Billing | ✅ | ✅ | Initial purchase or monthly payments count toward milestones |
| - Monthly Usage | ❌ | ❌ | Usage covered by these purchases doesn't count |
| **Azure Pre-payments (Monetary Credits)** |  |  |  |
| - Purchase | ✅ | ❌ | **Key Difference**: CACO doesn't count prepayment purchases |
| - Prepayment Spend | ❌ | ✅ | **Key Difference**: CACO counts spending of prepayment credits |
| **MACC Milestone Shortfall Credit** |  |  |  |
| - Purchase | ✅ | ❌ | Milestone shortfall credit purchase doesn't count toward CACO |
| - Credit Applied | ❌ | ✅ | Milestone shortfall credit use goes towards CACO |
| **MACC Shortfall Charge (Credit)** |  |  |  |
| - Purchase | ✅ | ❌ | MACC shortfall credit purchase doesn't count toward CACO |
| - Credit Applied | ❌ | ❌ | Penalty charge for not fulfilling MACC commitment |
| **Awarded Credits (ACO, Outage, Goodwill)** |  |  |  |
| - Awarded Amount | ❌ | ❌ | Any credits that aren't purchased don't count towards commitments |
| - Credit Applied | ❌ | ❌ | Consumption covered by awarded credits doesn't count |
| **Azure Marketplace** | ✅ | ❌ | **Key Difference**: Marketplace purchases don't count toward CACO milestones |

> [!NOTE]
> **For Service-Specific CACO (SS-CACO):** The same eligibility rules as CACO apply, but with an additional filter — only consumption of configured services, product families, or regions counts toward your milestones. For example, pay-as-you-go charges and prepayment spend only count if they are for an eligible service. Entitlement purchases (RI/Savings Plans) only count if the product is eligible.

### Key Differences from MACC

**CACO focuses on actual consumption rather than purchases:**
- **Azure Prepayments**: Unlike MACC where prepayment purchases count toward commitment but prepayment spending doesn't, CACO operates on the opposite principle — prepayment purchases don't count toward milestones, but spending those prepayment credits does count toward your CACO commitment.
- **Marketplace purchases**: Not eligible for CACO milestone tracking (unlike MACC).

This consumption-focused approach ensures that ACO awards are based on genuine Azure service consumption rather than upfront credit purchases, regardless of the payment method used to cover that consumption.

---


## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
