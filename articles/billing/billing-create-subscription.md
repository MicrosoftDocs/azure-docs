---
title: Create an additional Azure subscription | Microsoft Docs
description: Learn how to add a new Azure subscription in the Azure portal.
services: 'billing'
documentationcenter: ''
author: jrosson
manager: jrosson
editor: ''


ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/28/2018
ms.author: banders

---
# Create an additional subscription in the Azure portal

You can create an additional subscriptions for your Enterprise Agreement or Microsoft Customer Agreement billing account in the Azure portal. You may want an additional subscription to avoid hitting subscription limits, to create separate environments for security, or to isolate data for compliance reasons.

To create additional subscriptions for your organization's Enterprise Agreement, you must have the Account Owner role on the Enterprise Agreement enrollment. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](billing-understand-ea-roles.md)

To create additional subscriptions for your Microsoft Customer Agreement billing account, you must have permission on the invoice section which is billed for the subscription or the billing profile or billing account of the invoice section. To view the list of roles that can create additional subscriptions, see [Subscription billing roles and tasks](billing-understand-mca-roles.md#subscription-billing-roles-and-tasks). To provide others permission to create Azure subscriptions for your billing account, see [Give others permission to create Azure subscriptions](#give-others-permission).


If you don't already have an Azure subscription, create a [free account](https://azure.microsoft.com/free).

## Create an additional Azure subscription 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Subscriptions**.

   ![Screenshot that shows search in portal for subscription](./media/billing-create-subscription/billing-search-subscription-portal.png)

1. Select **Add**.

   ![Screenshot that shows the Add button in Subscriptions view](./media/billing-create-subscription/subscription-add.png)

1. If you have access to multiple billing accounts, select the billing account for which you want to create the subscription.

   ![Screenshot that shows create subscription page](./media/billing-mca-create-subscription/billing-mca-create-azure-subscription.png)

1. Fill the form and click **Create**. The tables below lists the fields on the form for each type of billing account.

**Enterprise Agreement**
|Field  |Definition  |
|---------|---------|
|Name     | The name helps you to easily identify the subscription in the Azure portal.  |
|Offer     | Select EA Dev/Test, if you plan to use this subscription for development or testing workloads else use Microsoft Azure Enterprise. DevTest offer must be enabled for your enrollment account.|

**Microsoft Customer Agreement**
|Field  |Definition  |
|---------|---------|
|Billing profile     | The charges for your subscription will be billed to the selected billing profile. If you have access to only one billing profile, the selection will be greyed out.     |
|Invoice section     | The charges for your subscription will be billed to this section of the billing profile's invoice. If you have access to only one invoice section, the selection will be greyed out.  |
|Plan     | Select Microsoft Azure Plan for DevTest, if you plan to use this subscription for development or testing workloads else use Microsoft Azure Plan. If only one plan is enabled for the billing profile, the selection will be greyed out.  |
|Name     | The name helps you to easily identify the subscription in the Azure portal.  |



You can also create additional subscriptions programmatically. For more information, see [Programmatically create Azure Enterprise subscriptions](../azure-resource-manager/programmatically-create-subscription.md).

## Next steps

- [Add or change Azure subscription administrators](billing-add-change-azure-subscription-administrator.md)
- [Move resources to new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md?toc=/azure/billing/TOC.json)
- [Create management groups for resource organization and management](../governance/management-groups/create.md?toc=/azure/billing/TOC.json)
- [Cancel your subscription for Azure](billing-how-to-cancel-azure-subscription.md)

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
