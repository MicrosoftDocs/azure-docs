---
title: Cancel your Azure subscription | Microsoft Docs
description: Describes how to cancel your Azure subscription, like the Free Trial subscription
author: bandersmsft
manager: amberb
tags: billing
ms.assetid: 3051d6b0-179f-4e3a-bda4-3fee7135eac5
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/03/2019
ms.author: banders

---
# Cancel your subscription for Azure

Only an Azure subscription [Account Administrator](billing-subscription-transfer.md#whoisaa) can cancel an Azure subscription. An Azure subscription administrator can also [assign another user as a subscription administrator](billing-add-change-azure-subscription-administrator.md#assign-a-user-as-an-administrator-of-a-subscription) so that they can cancel a subscription. After you cancel the subscription, your access to Azure services and resources ends.

Before you cancel your subscription:

* Back up your data. For example, if you're storing data in Azure storage or SQL, download a copy. If you have a virtual machine, save an image of it locally.
* Shut down your services. Go to the [resources page in the management portal](https://ms.portal.azure.com/?flight=1#blade/HubsExtension/Resources/resourceType/Microsoft.Resources%2Fresources), and **Stop** any running virtual machines, applications, or other services.
* Consider migrating your data. See [Move resources to new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md).
* You must delete all resources and all resource groups. Deleting them is required before you can cancel a subscription. Each resource group must be deleted individually. During resource group deletion, you must confirm deletion by typing the resource group name.
* If you have any custom roles that reference this subscription in `AssignableScopes`, you should update those custom roles to remove the subscription. If you try to update a custom role after you cancel a subscription, you might get an error. For more information, see [Troubleshoot problems with custom roles](../role-based-access-control/troubleshooting.md#problems-with-custom-roles) and [Custom roles for Azure resources](../role-based-access-control/custom-roles.md).

If you cancel a paid Azure Support plan, you are still billed for the rest of the subscription term. For more information, see [Azure support plans](https://azure.microsoft.com/support/plans/).

## Cancel subscription using the Azure portal

1. Select your subscription from the [Subscriptions page in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).
2. Select the subscription that you want to cancel.
3. Select **Overview**, and then select **Cancel subscription**.

    ![Screenshot that shows the Cancel button](./media/billing-how-to-cancel-azure-subscription/cancel_ibiza.png)
3. Follow prompts and finish cancellation.

## What happens after I cancel my subscription?

After you cancel, billing is stopped immediately. However, it can take up to 10 minutes for the cancellation to show in the portal. If you cancel in the middle of a billing period, we send the final bill on your typical invoice date after the period ends.

After you cancel, your services are disabled. That means your virtual machines are de-allocated, temporary IP addresses are freed, and storage is read-only.

We wait 90 days before permanently deleting your data in case you need to access it or you change your mind. We don't charge you for retaining the data. To learn more, see [Microsoft Trust Center - How we manage your data](https://go.microsoft.com/fwLink/p/?LinkID=822930&clcid=0x409).

## Reactivate subscription

If you cancel your Pay-As-You-Go subscription accidentally, you can [reactivate it in the Accounts Center](billing-subscription-become-disable.md).

If your subscription is not Pay-As-You-Go, contact support within 90 days of cancellation to reactivate your subscription.

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
