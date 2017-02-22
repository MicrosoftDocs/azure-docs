---
title: Managing access to Azure billing | Microsoft Docs
description: 
services: ''
documentationcenter: ''
author: vikdesai
manager: vikdesai
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
# How to manage access to billing information for Azure

Access to viewing billing information in Azure portal is granted to users in certain roles on the Azure subscription. The user roles who have access to billing information are Account Administrator, Service Administrator, Co-administrator, Owner, Contributor, Reader and Billing Reader. They would have access to billing information in the [Azure portal](https://portal.azure.com/), and they can access the Billing API to download invoices.

> [!NOTE]
> Only the Account Administrator can access the [Azure Account Center](https://account.windowsazure.com). 

## Adding users to the Billing Reader role

A Billing Reader has read-only access to subscription billing information in Azure portal, and no access to services such as VMs and storage accounts. The common use case for the Billing Reader role is delegating access to billing information for a subscription without giving any access to service management. This role is appropriate for users in an organization who only perform financial and cost management for Azure subscriptions. Users in this role can view cost information in the Azure portal and download invoices for the subscription.

1. Select your subscription from the [Subscriptions blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in Azure portal.
    
2. Select **Access control (IAM)** and then click **Add**.

    ![Screenshot shows to click IAM in the subscription blade](./media/billing-manage-access/select-iam.PNG)
    
3. Choose **Billing Reader** in the "Select a role" page.

    ![Screenshot shows to Billing Reader in the popup view](./media/billing-manage-access/select-roles.PNG)
 
3. Type the email for the user you want to invite, then click **OK** to send the invitation.

    ![Screenshot that shows to enter email to invite someone](./media/billing-manage-access/add-user.PNG)
    
4. The invited user then follows instructions in the invitation email to finish getting access.

## Adding users as other roles 

Other roles such as Owner or Contributor have access not just to billing information, but Azure services as well. To manage these roles, see [Add or change Azure administrator roles that manage the subscription or services](billing-add-change-azure-subscription-administrator).

The user roles who have access to billing information are Account Administrator, Service Administrator, Co-administrator, Owner, Contributor, Reader and Billing Reader.

## Who can access the [Account Center](https://account.windowsazure.com)?

Only the Account Administrator can log in to the Account center. The Account Administrator is the legal owner of the subscription. By default, the person who signed up for or bought the Azure subscription is the Account Administrator, unless the subscription ownership was transferred to somebody else. The Account Administrator can create subscriptions, cancel subscriptions, change the billing for a subscription, and change the Service Administrator as well as other roles.