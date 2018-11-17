---
title: Enable a Cloud Service Provider to manage your Azure Stack subscription | Microsoft Docs
description: Enable the service provider to access a subscription in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/15/2018
ms.author: sethm
ms.reviewer: alfredop

---

# Enable a Cloud Service Provider to manage your Azure Stack subscription

*Applies to: Azure Stack integrated systems*

If you're using Azure Stack with a Cloud Service Provider (CSP), you might choose to manage your own subscription to access resources in Azure and in Azure Stack. You can also let the provider manage your subscription for you. This article shows you how to:

 * Give your service provider access your subscription.
 * Make sure the service provider can manage your service.

> [!Note]
>  If the CSP isn't managing your account, and you skip the following steps, the CSP can't manage your Azure Stack subscription for you.

## Manage your subscription with a Cloud Service Provider

Add the CSP as **user** to your subscription.

1. Add your CSP as guest user with the user role to your tenant directory.  For steps on adding a user, see [Add new users to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/add-users-azure-active-directory)
2. The CSP creates the local Azure Stack subscription for you.
3. You are ready to start using Azure Stack.
4. Your CSP should create a resource in your subscription to verify that they can also manage your resources. For example, they can [Create a Windows virtual machine with the Azure Stack portal](azure-stack-quick-windows-portal.md).

## Enable the Cloud Service Provider to manage your subscription using RBAC rights

Add the CSP as **owner** to your subscription.

1. Add your CSP as guest user to your tenant directory.  For steps on adding a user, see [Add new users to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/add-users-azure-active-directory)
2. Add the Owner role to the CSP guest user. For steps on adding the CSP user to your subscription, see [Use Role-Based Access Control to manage access to your Azure subscription resources](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)
3. The CSP creates the local Azure Stack subscription for you.
4. You are ready to start using Azure Stack.
5. Your CSP should create a resource in your subscription to verify that they can manage your resources.

## Next steps

To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](../azure-stack-billing-and-chargeback.md).
