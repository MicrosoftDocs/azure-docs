---
title: Enable a Cloud Service Provider to manage your Azure Stack subscription | Microsoft Docs
description: Enable the service provider to access a subscription in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/27/2018
ms.author: mabrigg
ms.reviewer: alfredop

---

# Enable a Cloud Service Provider to manage your Azure Stack subscription

*Applies to: Azure Stack integrated systems*

If you're using Azure Stack with a Cloud Service Provider (CSP), your access to resources in your Azure subscription and in Azure Stack may be managed by the provider. Or you may manage your own subscription. This article looks at how you can enable your service provider to access your subscription on your behalf, or to make sure the service provider can manage your service.

> [!Note]  
>  If the following steps are skipped, and the CSP isn't already managing your account, then the CSP will not be able to manage your Azure Stack subscription on your behalf.

## Manage your subscription with a Cloud Service Provider

1. Add your CSP as guest user with the user role to your tenant directory.  For steps on adding a user, see [Add new users to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/add-users-azure-active-directory)
2. The CSP will then create the local Azure Stack subscription for you.
3. You are ready to start using Azure Stack.
3. Your CSP should then create a resource in your subscription to verify that they can also manage your resources. For example, they can [Create a Windows virtual machine with the Azure Stack portal](azure-stack-quick-windows-portal.md).

## Enable the Cloud Service Provider to manage your subscription using RBAC rights

Add the CSP as owner to your subscription. 

1. Add your CSP as guest user. with the owner role to your tenant directory.  For steps on adding a user, see [Add new users to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/add-users-azure-active-directory)
2. Add Owner role to the CSP guest user. For steps on adding the CSP user to your subscription, see [Use Role-Based Access Control to manage access to your Azure subscription resources](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure)
3. The CSP will then create the local Azure Stack subscription for you.
4. You are ready to start using Azure Stack.
5. Your CSP should then create a resource in your subscription to verify that they can manage your resources. 

## Next steps

  - To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](../azure-stack-billing-and-chargeback.md).
