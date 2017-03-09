---
title: Manage access to Azure billing using roles | Microsoft Docs
description: 
services: ''
documentationcenter: ''
author: vikramdesai01
manager: vikramdesai01
editor: ''
tags: billing

ms.assetid: e4c4d136-2826-4938-868f-a7e67ff6b025
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/22/2017
ms.author: vikdesai

---
# Manage access to billing information for Azure using role-based access control

You can grant access to view Azure billing information to members of your team by assigning one of the following user roles: Account Administrator, Service Administrator, Co-administrator, Owner, Contributor, Reader, and Billing Reader. They would have access to billing information in the [Azure portal](https://portal.azure.com/), and they can use the Billing API to download invoices. For more information about who can grant roles, and which roles can do what, see [Roles in Azure RBAC](../active-directory/role-based-access-built-in-roles.md).

## Adding users to the Billing Reader role

The Billing Reader role has read-only access to subscription billing information in Azure portal, and no access to services such as VMs and storage accounts. Assign the Billing Reader role to someone that needs access to the subscription billing information but not the ability to manage Azure services. This role is appropriate for users in an organization who only perform financial and cost management for Azure subscriptions.

1. Select your subscription from the [Subscriptions blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in Azure portal.
    
2. Select **Access control (IAM)** and then click **Add**.

    ![Screenshot shows IAM in the subscription blade](./media/billing-manage-access/select-iam.PNG)
    
3. Choose **Billing Reader** in the **Select a role** page.

    ![Screenshot shows Billing Reader in the popup view](./media/billing-manage-access/select-roles.PNG)
 
3. Type the email for the user you want to invite, then click **OK** to send the invitation.

    ![Screenshot that shows to enter email to invite someone](./media/billing-manage-access/add-user.PNG)
    
4. Follow instructions in the invite email to log in as a Billing Reader.

    ![Screenshot that shows what the Billing Reader can see in Azure portal](./media/billing-manage-access/billing-reader-view.png)

> [!NOTE]
> The Billing Reader feature is in preview, and may not be available for Azure Germany.

## Adding users to other roles 

Users in other roles, such as Owner or Contributor, can access not just billing information, but Azure services as well. To manage these roles, see [Add or change Azure administrator roles that manage the subscription or services](billing-add-change-azure-subscription-administrator.md).

## Who can access the [Account Center](https://account.windowsazure.com)?

Only the Account Administrator can log in to the Account center. The Account Administrator is the legal owner of the subscription. By default, the person who signed up for or bought the Azure subscription is the Account Administrator, unless the [subscription ownership was transferred](billing-subscription-transfer.md) to somebody else. The Account Administrator can create subscriptions, cancel subscriptions, change the billing address for a subscription, and manage access policies for the subscription.