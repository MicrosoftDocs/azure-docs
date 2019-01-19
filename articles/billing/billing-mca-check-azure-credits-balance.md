---
title: Track Azure credits balance for Billing profile | Microsoft Docs
description: Learn to check Azure credits balance for your Billing profile.
services: ''
documentationcenter: ''
author: amberbhargava
manager: amberb
editor: cwatson
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/17/2019
ms.author: amberb

---
# Track Azure credits balance for your Billing profile

You can check the Azure credits for your billing profile in the Azure portal. Use these credits to pay for products that are eligible for credits. 

You are charged when you use products that aren't covered by the credits or your usage exceeds your credits balance. For more information, see [Products that aren't covered by Azure credits](#Products-that-aren't-covered-by-Azure-credits)

This article describes how to use Azure portal to check credits balance for your Billing profile.

## Check credits balance on the Azure portal

1. Sign in to the [Azure portal]( http://portal.azure.com).

2. Select **Cost Management + Billing** from the lower-left side of the portal.

3. If you have access to just one Billing profile, select **Azure credits** from the left-hand pane.

4. If you have access to a Billing account, select **Billing profiles** from the left-hand pane. Select a Billing profile from the list and then select **Azure credits** from the left-hand pane.

5. If you have access to multiple Billing profiles, select a Billing profile then select **Azure credits** from the left-hand pane.

6. If you have access to multiple Billing accounts, select a Billing account then select **Billing profiles** from the left-hand pane. Select a Billing profile from the list and then select **Azure credits** from the left-hand pane.

6. The Azure credits page shows the following information:

| Term               | Definition                           |
|--------------------|--------------------------------------------------------|
| Estimated balance  | Estimated amount of credits you have after considering all billed and pending transactions |
| Current balance    | Amount of credits that is currently available for you to spend. It doesn't include any pending transactions |
| Transactions       | All billing transactions that are applied to your Azure credits |

>[!Note] 
>When your estimated balance drops to 0, all your future charges including the credits eligible charges will count towards the due amount on your next invoice. 

![Screenshot of credits balance and transactions for a Billing profile](./media/billing-mca-check-azure-credits-balance/credits-overview.PNG)

7.  Select **Credits list** to view list of credits for the Billing profile. The credits list provides the following information:

![Screenshot of credits lists for a Billing profile](./media/billing-mca-check-azure-credits-balance/credits-list.PNG)

| Term                 | Definition                           |
|----------------------|--------------------------------------------------------|
| Source               | The acquisition source of the credit |
| Start date           | The date when you acquired the credit |
| Expiration date      | The date when the credit expires |
| Remaining amount     | The balance when your last invoice was generated |
| Original amount      | The original amount of credit |
| Status               | The current status of credit. Status can be active, used, expired, or expiring |

[!INCLUDE [Check if you have access to a Billing account for Microsoft Customer Agreement](../../includes/billing-check-mca.md)]

## How credits are applied in Microsoft customer agreement

In Microsoft customer agreement, you use Billing profiles to customize how you pay your invoices. A Billing profile contains information like billing address and payment methods. A monthly invoice is generated for each billing profile and you use the payment methods to pay for the invoice.

Azure credits is one of the payment methods. You can add credits or Microsoft can provide you credits. You assign these credits to a billing profile. When an invoice is generated for the billing profile, credits are first applied to the total charges to calculate the amount that you need to pay. You use your payment methods other than credits to pay the amount. 

## Products that aren't covered by Azure credits

 The following products aren't covered by your Azure credits. You're invoiced for using these products regardless of your credit balance:
- Canonical
- Citrix XenApp Essentials
- Citrix XenDesktop 
- Registered User
- Openlogic
- Remote Access Rights XenApp Essentials Registered User
- Ubuntu Advantage
- Visual Studio Enterprise (Monthly)
- Visual Studio Enterprise (Annual)
- Visual Studio Professional (Monthly)
- Visual Studio Professional (Annual)
- Azure Marketplace charges

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
