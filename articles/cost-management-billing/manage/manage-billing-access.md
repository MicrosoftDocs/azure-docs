---
title: Manage access to Azure billing | Microsoft Docs
description: Learn how to give access to your Azure billing information for members of your team.
services: ''
documentationcenter: ''
author: vikramdesai01
manager: amberb
editor: ''
tags: billing

ms.assetid: e4c4d136-2826-4938-868f-a7e67ff6b025
ms.service: cost-management-billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 12/02/2018
ms.author: banders
ms.custom: seodec18
---
# Manage access to billing information for Azure

You can provide others access to the billing information for your account in the Azure portal. The type of billing roles and the instructions to provide access to the billing information vary by the type of your billing account. To determine the type of your billing account, see [Check the type of your billing account](#check-the-type-of-your-billing-account).

The article applies to customers with Microsoft Online Service program accounts. If you're an Azure customer with an Enterprise Agreement (EA) and are the Enterprise Administrator, you can give permissions to the Department Administrators and Account Owners in the Enterprise portal. For more information, see [Understand Azure Enterprise Agreement administrative roles in Azure](understand-ea-roles.md). If you are a Microsoft Customer Agreement customer, see, [Understand Microsoft Customer Agreement administrative roles in Azure](understand-mca-roles.md).

## Account administrators for Microsoft Online Service program accounts

An Account Administrator is the only owner for a Microsoft Online Service Program billing account. The role is assigned to a person who signed up for Azure. Account Administrators are authorized to perform various billing tasks like create subscriptions, view invoices or change the billing for a subscription.

## Give others access to view billing information

Account administrator can grant others access to Azure billing information by assigning one of the following roles on a subscription in their account.

- Service Administrator
- Co-administrator
- Owner
- Contributor
- Reader
- Billing reader

These roles have access to billing information in the [Azure portal](https://portal.azure.com/). People that are assigned these roles can also use the [Billing APIs](usage-rate-card-overview.md) to programmatically get invoices and usage details.

To assign roles, see [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md).

** If you're an EA customer, an Account Owner can assign the above role to other users of their team. But for these users to view billing information, the Enterprise Administrator must enable AO view charges in the Enterprise portal.


### <a name="opt-in"></a> Allow users to download invoices

After an Account administrator has assigned the appropriate roles to other users, they must turn on access to download invoices in the Azure portal. Invoices older than December 2016 are available only to the Account Administrator.

1. Sign in to the [Azure portal](https://portal.azure.com/), as an Account Administrator,

1. Search on **Cost Management + Billing**.

    ![Screenshot that shows Azure portal search](./media/manage-billing-access/billing-search-cost-management-billing.png)

1. Select **Subscriptions** from the left-hand pane. Depending on your access, you may need to select a billing scope and then select **Subscriptions**.

    ![Screenshot that shows selecting subscriptions](./media/manage-billing-access/billing-select-subscriptions.png)

1. Select **Invoices** and then **Access to invoice**.

    ![Screenshot shows how to delegate access to invoices](./media/manage-billing-access/aa-optin01.png)

1. Select **On** and save.

    ![Screenshot shows on-off to delegate access to invoice](./media/manage-billing-access/aa-optinallow01.png)

The Account Administrator can also configure to have invoices sent via email. To learn more, see [Get your invoice in email](download-azure-invoice-daily-usage-date.md).

## Give read-only access to billing

Assign the Billing Reader role to someone that needs read-only access to the subscription billing information but not the ability to manage or create Azure services. This role is appropriate for users in an organization who are responsible for the financial and cost management for Azure subscriptions.

The Billing Reader feature is in preview, and does not yet support non-global clouds.

1. Sign in to the [Azure portal](https://portal.azure.com/), as an Account Administrator,

1. Search on **Cost Management + Billing**.

    ![Screenshot that shows Azure portal search](./media/manage-billing-access/billing-search-cost-management-billing.png)

1. Select **Subscriptions** from the left-hand pane. Depending on your access, you may need to select a billing scope and then select **Subscriptions**.

    ![Screenshot that shows selecting subscriptions](./media/manage-billing-access/billing-select-subscriptions.png)

1. Select **Access control (IAM)**.
1. Select **Add** from the top of the page.

    ![Screenshot that shows clicking add role assignment](./media/manage-billing-access/billing-click-add-role-assignment.png)

1. In the **Role** drop-down list, choose **Billing Reader**.
1. In the **Select** textbox, type the name or email for the user you want to add.
1. Select the user.
1. Select **Save**.
    ![Screenshot that shows clicking add role assignment](./media/manage-billing-access/billing-save-role-assignment.png)

1. After a few moments, the user is assigned the Billing Reader role for the subscription.

** If you're an EA customer, an Account Owner or Department Administrator can assign the Billing Reader role to team members. But for that Billing Reader to view billing information for the department or account, the Enterprise Administrator must enable  **AO view charges** or **DA view charges** policies in the Enterprise portal.

## Check the type of your billing account
[!INCLUDE [billing-check-account-type](../../../includes/billing-check-account-type.md)]

## Next steps

- Users in other roles, such as Owner or Contributor, can access not just billing information, but Azure services as well. To manage these roles, see [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md).
- For more information about roles, see [Built-in roles for Azure resources](../../role-based-access-control/built-in-roles.md).

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
