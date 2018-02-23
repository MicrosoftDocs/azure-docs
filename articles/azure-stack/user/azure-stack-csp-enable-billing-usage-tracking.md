---
title: Enable a Cloud Service Provider to manage your Azure Stack subscription | Microsoft Docs
description: Type the description in Azure Stack.
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
ms.date: 02/22/2018
ms.author: mabrigg
ms.reviewer: alfredop

---

# Enable a Cloud Service Provider to manage your Azure Stack subscription

*Applies to: Azure Stack integrated systems*

If you're using Azure Stack with a Cloud Service Provider (CSP), your access to resource in your Azure subscription and in Azure Stack may be managed by the provider. Or you may manage your own subscription. This article looks at how you can enable your service provider to access your subscription on your behalf, or to make sure the service provider can manage your service.

> [!Note]  
>  If the following steps are skipped, the CSP cannot manage your Azure Stack subscription on your behalf.

## Manage your subscription with a Cloud Service Provider

1. Add your CSP as guest user with the user role to your tenant directory.  For steps on adding a user, see [Add new users to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/add-users-azure-active-directory)
2. The CSP will then create the local Azure Stack subscription for you.
3. You are ready to start using Azure Stack.
3. Your should then create a resource in your subscription to verify that they can manage your resources. For example, you can [Create a Windows virtual machine with the Azure Stack portal](azure-stack-quick-windows-portal.md).

## Enable the Cloud Service Provider to manage your subscription

Add the CSP as owner to your subscription. For steps on adding the CSP user to your subscription, see [Use Role-Based Access Control to manage access to your Azure subscription resources](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure)

## Enable the Cloud Service Provider to manage your subscription using RBAC rights

You can also allow the CSP to manager your resources by granting the CSP Role-Based Access Control (RBAC) rights to your subscription.

1. The CSP gives you user credentials they have created in the CSP Azure AD tenant. This user is used to manage your Azure Stack subscription.
2. Add the CSP provided user as a guest user with the user role in your Azure AD tenant directory. For steps on adding a user, see [Add new users to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/add-users-azure-active-directory).
3. Add the new user from CSP’s directory tenant as an owner to your Azure Stack user subscription. For steps on adding the CSP user to your subscription, see [Use Role-Based Access Control to manage access to your Azure subscription resources](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure).
4. Your CSP should then create a resource in your subscription to verify that they can manage your resources.

## Next steps

  - To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](../azure-stack-billing-and-chargeback.md).
