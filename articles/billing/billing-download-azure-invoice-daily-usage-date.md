---
title: How to get your Azure billing invoice and daily usage data | Microsoft Docs
description: Describes how to download your Azure billing invoice and daily usage data
services: ''
documentationcenter: ''
author: genlin
manager: ruchic
editor: ''
tags: billing

ms.assetid: 6d568d1d-3bd6-4348-97d0-1098b5fe0661
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/03/2017
ms.author: genli

---
# How to get your Azure billing invoice and daily usage data
You can opt-in and configure additional recipients to receive your invoice statement attached to your monthly billing email. You can also download your invoice from the [Azure Portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Only the account administrator has permission to get to the billing invoice and usage information. To find out who is the account administrator of the subscription, see the [Transferring ownership of an Azure subscription - FAQ](billing-subscription-transfer.md#faq).

## Get your invoice over email
1. Select your subscription from the subscriptions blade. You have to opt-in for each subscription you own. Click Send my invoice, you may not see this if you are not the account admin. Then **opt in**.

Opt in from the resource menu of your subscription
2. Once you've accepted the agreement you can configure additional recipients:Configure recipients of your invoice.
3. You can also access this blade deep link in your monthly statement notification email:Link in Invoice Blade

## I can't access the email settings blade:
* You must be the account administrator to configure this setting, not sure what this means? Learn more here.
* If you have a monthly invoice but aren't receiving an email, make sure you have your communication email properly set.
* This feature is only available in the direct channel and may not be available for certain subscriptions such as support offers or Azure in Open.

## Get invoice from Azure portal
You can view the daily usage from the Azure portal but only the invoice is available for download.

1. Sign in to the [Azure portal](https://portal.azure.com) as the account administrator. 
2. On the Hub menu, select **Subscriptions**. 

    ![Screenshot that shows the Subscription option](./media/billing-download-azure-invoice-daily-usage-date/submenu.png) 

3. In the **Subscriptions** blade, select the subscription that you want to view, and then select **Billing & usage**. 

    ![Screenshot that shows the Billing & usage option](./media/billing-download-azure-invoice-daily-usage-date/billingandusage.png) 

4. On the **Billing & usage** blade, click **Download Invoice** to view a copy of your pdf invoice. 

    ![Screenshot that shows billing periods, the download option, and total charges for each billing period](./media/billing-download-azure-invoice-daily-usage-date/billing4.png)

5. You can view your daily usage by clicking the billing period. 

For more information about your invoice see [Understand your bill for Microsoft Azure](billing-understand-your-bill.md).

## Get usage from the Azure Account Center
1. Sign into the [Azure Account Center](https://account.windowsazure.com/subscriptions) as the account administrator.
2. Select the subscription for which you want the invoice and usage information.
3. Select **BILLING HISTORY**. 

    ![Screenshot that shows billing history option](./media/billing-download-azure-invoice-daily-usage-date/Billinghisotry.png)

4. You can see your statements for the last six billing periods and the current unbilled period. 

    ![Screenshot that shows billing periods, options to download invoice and daily usage, and total charges for each billing period](./media/billing-download-azure-invoice-daily-usage-date/billingSum.png)

5. Select **View Current Statement** to see an estimate of your charges at the time the estimate was generated. This information is only updated daily and may not include all your usage. Your monthly invoice may differ from this estimate.

    ![Screenshot that shows the View Current Statement option](./media/billing-download-azure-invoice-daily-usage-date/billingSum2.png)

    ![Screenshot that shows the estimate of current charges](./media/billing-download-azure-invoice-daily-usage-date/billingSum3.png)

6. Select **Download Usage** to download the daily usage data as a CSV file. If you see two versions available, download version 2.

    ![Screenshot that shows the Download Usage option](./media/billing-download-azure-invoice-daily-usage-date/DLusage.png)

For more information about your daily usage, see [Understand your bill for Microsoft Azure](billing-understand-your-bill.md).

## <a name="noinvoice"></a> Why don't I see an invoice for the last billing period?
There could be several reasons that you don't see an invoice:
- You have a monthly credit amount with your subscription that you didn't exceed or you have a free trial. An invoice isn't generated unless you owe money.
- It's less than 30 days from the day you subscribed to Azure.
- The invoice isn't generated yet. Wait until the end of the billing period.

## Need help? Contact support.
If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

