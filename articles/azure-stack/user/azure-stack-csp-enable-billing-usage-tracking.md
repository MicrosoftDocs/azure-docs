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
3. Your CSP should then create a resource in your subscription to verify that they can manage your resources. For example, they can [Create a Windows virtual machine with the Azure Stack portal](azure-stack-quick-windows-portal.md).

## Enable the Cloud Service Provider to manage your subscription

Add the CSP as owner to your subscription. For steps on adding the CSP user to your subscription, see [Use Role-Based Access Control to manage access to your Azure subscription resources](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure)

## Enable the Cloud Service Provider to manage your subscription using RBAC rights

You can also allow the CSP to manager your resources by granting the CSP Role-Based Access Control (RBAC) rights to your subscription. The CSP will use a guest user account. 

Guest users are user accounts from other directory tenants that have been granted access to resources in your directory. To support guest user, you must use Azure AD and enable support for multi-tenancy. When supported, you can invite a guest user to access resources in your directory tenant, which enables collaboration with outside organizations.
 
To invite guest users, cloud operators and users can use [Azure AD B2B collaboration](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b). Invited users get access to documents, resources, and applications from your directory while you maintain control over your own resources and data.
 
As a guest user, you can log into another organizations directory tenant. To do so, you must append that organizations directory name to the portal URL. For example if you belong to contoso.com but want to log into the Fabrikam directory, you use https://portal.local.azurestack.external/fabrikam.onmicrosoft.com. 

## Next steps

  - To learn more about how to retrieve resource usage information from Azure Stack, see [Usage and billing in Azure Stack](../azure-stack-billing-and-chargeback.md).
