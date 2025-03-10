---
title: Automatically renew your Azure savings plan
titleSuffix: Microsoft Cost Management
description: Learn how you can automatically renew an Azure saving plan to continue getting discounts.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 01/07/2025
ms.author: banders
---

# Automatically renew your Azure savings plan

You can automatically purchase a replacement savings plan when an existing savings plan expires. Automatic renewal provides an effortless way to continue getting savings plan discounts without having to closely monitor a savings plan's expiration. The renewal setting is turned off by default. Enable or disable the renewal setting anytime, up to the expiration of the existing savings plan.
Renewing a savings plan creates a new savings plan when the existing one expires. It doesn't extend the term of the existing savings plan.

## Required renewal permissions

The following conditions are required to renew a savings plan:

Billing admin For Enterprise Agreements (EA) and Microsoft Customer Agreements (MCA):
- You must be either a Billing profile owner or Billing profile contributor of an MCA account
- You must be an EA administrator with write access of an EA account
- You must be a Savings plan purchaser


For Microsoft Partner Agreements (MPA):
- You must be an owner of the existing savings plan.
- You must be an owner of the subscription.

## Set up renewal

In the Azure portal, search for **Savings plan** and select it.

1. Select the savings plan.
1. Select **Renewal**.
1. Select **Automatically renew this savings plan**.

## If you don't automatically renew

Your services continue to run normally. You're charged pay-as-you-go rates for your usage after the savings plan expires. You can't renew an expired savings plan - to continue to receive savings, you can buy a new savings plan.

## Default renewal settings

By default, the renewal inherits all properties except automatic renewal setting from the expiring savings plan. A savings plan renewal purchase has the same billing subscription, term, billing frequency, and savings plan commitment. The new savings plan inherits the scope setting from the expiring savings plan during renewal.
However, you can explicitly set the hourly commitment, billing frequency, and commitment term to optimize your savings.

## When the new savings plan is purchased
A new savings plan is purchased when the existing savings plan expires. We try to prevent any delay between the two savings plan. Continuity ensures that your costs are predictable, and you continue to get discounts.

## Change parent savings plan after setting renewal

If you make any of the following changes to the expiring savings plan, the savings plan renewal is canceled:

- Transferring the savings plan from one account to another
- Renew the enrollment


## New savings plan permissions

Azure copies the permissions from the expiring savings plan to the new savings plan. Additionally, the subscription account administrator of the savings plan purchase has access to the new savings plan.

## Potential renewal problems

Azure may not process the renewal if:

- Payment can't be collected
- A system error occurs during renewal
- The EA agreement is renewed into a different EA

You'll receive an email notification if any of the preceding conditions occur, and the renewal is deactivated.

## Renewal notification

Renewal notification emails are sent 30 days before expiration and again on the expiration date. The sending email address is `azure-noreply@microsoft.com`. You might want to add the email address to your safe senders or allowlist.

Emails are sent to different people depending on your purchase method:

- EA customers - Emails are sent to the notification contacts set in the Azure portal or Enterprise Administrators who are automatically enrolled to receive usage notifications.
- MPA - No email notifications are currently sent for Microsoft Partner Agreement subscriptions.

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

- To learn more about Azure savings plans, see [What are Azure Savings Plan?](savings-plan-compute-overview.md)
