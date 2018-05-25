---
title: Delete an Azure Active Directory tenant directory | Microsoft Docs
description: Explains how tompreare an Azure AD tenant directory dor deletion and now to delete 
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: article
ms.date: 05/25/201
ms.author: curtand

ms.reviewer: jeffsta
ms.custom: it-pro

---
# How to delete an Azure Active Directory tenant
Only an Azure Active Directory (Azure AD) global administrator can delete an Azure AD tenant directory from the portal. When a tenant is deleted, all resources that are contained in the tenant are also deleted. Your task is to minimize the resources in the tenant before you delete.

* If you are signed in with a work or school account, you can't delete your home directory. For example, if you are signed in as joe@contoso.onmicrosoft.com, you can't delete the tenant that has contoso.onmicrosoft.com as its default domain. 
* If you are signed in with a Microsoft account, you are authenticated outside of the tenant directory and thus can delete it.

## How to prepare to delete an Azure AD tenant

Azure AD requires that certain conditions are met to delete a directory. This reduces risk that deleting a directory negatively impacts users or applications, such as the ability of users to sign in to Office 365 or access resources in Azure. For example, if a directory for a subscription is unintentionally deleted, then users can't access the Azure resources for that subscription.

The following conditions are checked:

* The only user in the directory should be the global administrator who is to delete the directory. Any other users must be deleted before the directory can be deleted. If users are synchronized from on-premises, then sync must be turned off, and the users must be deleted in the cloud directory using the Azure portal or Azure PowerShell cmdlets. There is no requirement to delete groups or contacts, such as contacts added from the Office 365 Admin Center.
* There can be no applications in the directory. Any applications must be deleted before the directory can be deleted.
* No multi-factor authentication providers can be linked to the directory.
* There can be no subscriptions for any Microsoft Online Services such as Microsoft Azure, Office 365, or Azure AD Premium associated with the directory. For example, if a default directory was created for you in Azure, you cannot delete this directory if your Azure subscription still relies on this directory for authentication. Similarly, you can't delete a directory if another user has associated a subscription with it. 

## To delete an Azure AD tenant directory

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that is the Global admininstrator for the tenant directory.
2. Select **Azure Active Directory**.
3. Switch to the tenant you want to delete.
4. Select **Delete directory**.

