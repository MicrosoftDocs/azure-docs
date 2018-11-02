---
title: Understand your bill for Azure Enterprise | Microsoft Docs
description: Learn how to read and understand your usage and bill for Azure customers with a Enterprise Agreement
services: ''
documentationcenter: ''
author: adpick
manager: dougeby
editor: ''
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/02/2018
ms.author: cwatson

---
# Understand your bill for Azure customers with an Enterprise Agreement

Azure customers with an Enterprise Agreement (EA customers) may receive an invoice when they exceed the organization's credit or use product or services that aren't covered by the credit.

A credit is also known as a monetary commitment. EA customers make an upfront monetary commitment or credit when they add Azure. But you can add more credit to your Enterprise Agreement by contacting your Microsoft account manager or reseller.  

## When credit exceeded or doesn't apply

You get one or more invoices for the following situations:

- **Service overage**: Your organization's usage costs exceeds your credit balance.
- **Charges billed separately**: The products or services your organization used aren't covered by the credit. You're invoiced for the following products or services regardless of your credit balance:
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
- **Marketplace charges**: These are resources that have been created by third-party software vendors. Usage of these resources aren't covered by your organization's credit.

When you have charges due for both service overages and services not covered by the credit during the billing period, you get one invoice that includes both types of charges. Marketplaces charges are always invoiced separately.

## Review charges

To review and verify the charges on your invoice, you must be an Enterprise Administrator, or Account Owner or Department Admin with the view charges policy enabled. For more information, see Understand Azure Enterprise Agreement administrative roles in Azure. If you don't know who the Enterprise Admin is for your organization, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

### Review service overage invoice

Compare your total usage amount from the Enterprise portal in **Reports** > **Usage Summary** with your service overage invoice. The amounts on the **Usage Summary** don't include tax.

1. Sign in to the [Enterprise portal](https://ea.azure.com).
1. Select **Reports**.
1. On the top right-hand corner of the tab, switch the view from **M** to **C** to match the period on the invoice.
 
   ![Screenshot that shows M + C option  on Usage summary.](./media/billing-understand-your-bill-ea/ea-portal-usage-sumary-cm-option.png)

1. The **Total Usage** amount should match the **Total Extended Amount** on your service overage invoice. The following table lists the terms and descriptions shown on the invoice and on the **Usage Summary** in the Azure portal:

   |Invoice term|Usage summary term|Description|
   |---|---|---|
   |Total Extended Amount|Total Usage|The total pre-tax usage charge for the specific period before the credit is applied.|
   |Commitment Usage|Commitment Usage|The credit to be applied during that specific period.|
   |Total Sale|Service Overage|The total usage charge that exceeds your credit amount. This amount doesn't include tax.|
   |Tax Amount|Not applicable|Tax that applies to the total sale amount for the specific period.|
   |Total Amount|Not applicable|The amount due for the invoice after the credit is applied and tax is added.|
1. To get more information about your charges, go to **Download Usage** > **Advanced Report Download**. This report doesn't include taxes or charges for reservations or marketplace products.

      ![Screenshot that shows Advanced report Download on the Download usage tab.](./media/billing-understand-your-bill-ea/ea-portal-download-usage-advanced.png)

### Review marketplace invoice

Compare your Azure marketplace total on **Reports** > **Usage Summary** in the Enterprise portal with your marketplace invoice. The amounts on the **Usage Summary** don't include tax. The **Usage Summary** may show usage-based or one-time charges depending on the product or service.

1. Sign in to the [Enterprise portal](https://ea.azure.com).
1. Select **Reports**.
1. On the top right-hand corner of the tab, switch the view from **M** to **C** to match the period on the invoice.

     ![Screenshot that shows M + C option  on Usage summary.](./media/billing-understand-your-bill-ea/ea-portal-usage-sumary-cm-option.png)

1. The **Azure Marketplace** total should match the **Total Sale** on your marketplace invoice.
1. To get more information about your usage-based charges, go to **Download Usage**. Under **Marketplace Charges**, select **Download**. This report doesn't include taxes or show one-time purchases.

     ![Screenshot that shows download option under Marketplace charges.](./media/billing-understand-your-bill-ea/ea-portal-download-usage-marketplace.png)

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.