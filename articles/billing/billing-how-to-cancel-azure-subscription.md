---
title: Cancel your Azure subscription | Microsoft Docs
description: Describes how to cancel your Azure subscription, like the Free Trial subscription
services: ''
documentationcenter: ''
author: genlin
manager: narmstr
editor: ''
tags: billing

ms.assetid: 3051d6b0-179f-4e3a-bda4-3fee7135eac5
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/03/2017
ms.author: genli

---
# Cancel your Azure subscription
You can cancel your Azure subscription as the Account Administrator. After you cancel the subscription, your access to Azure services and resources will end.

Before you cancel your subscription:

* Back up your data. For example, if you're storing data in Azure storage or SQL, download a copy. If you have a virtual machine, save an image of it locally.
* Shut down your services. Go to the [resources page in the management portal](https://ms.portal.azure.com/?flight=1#blade/HubsExtension/Resources/resourceType/Microsoft.Resources%2Fresources), and **Stop** any running virtual machines, applications, or other services.
* Consider migrating your data. See [Move resources to new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md).

If you cancel a paid [Azure Support plan](https://azure.microsoft.com/support/plans/), you will still be billed monthly for the rest of the 6-months term.

## Cancel subscription via the Azure portal
1. Log on to the [Azure portal](https://portal.azure.com) as the Account Administrator.

   > [!NOTE]
   > Only the  account administrator can cancel subscriptions. For more information about how to find out who is the account administrator of the subscription, see the [Frequently asked questions](billing-subscription-transfer.md#faq).
   >
   >

2. On the Hub menu, select **Subscriptions**.

    ![Subscription button](./media/billing-download-azure-invoice-daily-usage-date/submenu.png)

3. In the subscriptions blade, select the subscription you want to cancel and click **Cancel Sub** to launch the cancel blade.

    ![cancel_ibiza](./media/billing-how-to-cancel-azure-subscription/cancel_ibiza.png)
4. Enter the subscripton name and choose a cancellation reason and click the **Cancel Sub** button at the bottom of the cancel blade.

> [!NOTE]
> It will take up to 10 minutes for the cancellation to be reflected in the portal but billing will be stopped immediately.
>
>

## Cancel subscription via the Azure Account Center
1. Log on to the [Azure Account Center](https://account.windowsazure.com/subscriptions) as the Account Administrator.
2. Under **Click a subscription to view details and usage**, select the subscription that you want to cancel.

    ![selectsub](./media/billing-how-to-cancel-azure-subscription/Selectsub.png)
3. On the right side of the page, select **Cancel Subscription**.

    ![cancelsub](./media/billing-how-to-cancel-azure-subscription/cancelsub.png)
4. Select **Yes, cancel my subscription**.

    ![cancelbox](./media/billing-how-to-cancel-azure-subscription/cancelbox.png)
5. Click ![checkbutton](./media/billing-how-to-cancel-azure-subscription/checkbutton.png) to close the dialog window and return to your subscription page.

After you cancel your subscription, we wait 90 days before permanently deleting your data in case you need to access it or change your mind. For more information, see [Microsoft Trust Center - How we manage your data](https://go.microsoft.com/fwLink/p/?LinkID=822930&clcid=0x409).

## Reactivate subscription
If you canceled your Pay-As-You-Go subscription accidentally, you can [reactivate it in the Accounts Center](billing-subscription-become-disable.md).

## Need help? Contact support.
If you still have further questions, please [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
