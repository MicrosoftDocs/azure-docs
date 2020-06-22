---
title: Enable SharePoint User Profile service with Azure AD DS | Microsoft Docs
description: Learn how to configure an Azure Active Directory Domain Services managed domain to support profile synchronization for SharePoint Server
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 938a5fbc-2dd1-4759-bcce-628a6e19ab9d
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 01/21/2020 
ms.author: iainfou

---
# Configure Azure Active Directory Domain Services to support user profile synchronization for SharePoint Server

SharePoint Server includes a service to synchronize user profiles. This feature allows user profiles to be stored in a central location and accessible across multiple SharePoint sites and farms. To configure the SharePoint Server user profile service, the appropriate permissions must be granted in an Azure Active Directory Domain Services (Azure AD DS) managed domain. For more information, see [user profile synchronization in SharePoint Server](https://technet.microsoft.com/library/hh296982.aspx).

This article shows you how to configure Azure AD DS to allow the SharePoint Server user profile sync service.

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, complete the tutorial to [create and configure an Azure Active Directory Domain Services managed domain][create-azure-ad-ds-instance].
* A Windows Server management VM that is joined to the Azure AD DS managed domain.
    * If needed, complete the tutorial to [create a management VM][tutorial-create-management-vm].
* A user account that's a member of the *Azure AD DC administrators* group in your Azure AD tenant.
* A SharePoint service account for the user profile synchronization service.
    * If needed, see [Plan for administrative and service accounts in SharePoint Server][sharepoint-service-account].

## Service accounts overview

In a managed domain, a security group named **AAD DC Service Accounts** exists as part of the *Users* organizational unit (OU). Members of this security group are delegated the following privileges:

- **Replicate Directory Changes** privilege on the root DSE.
- **Replicate Directory Changes** privilege on the *Configuration* naming context (`cn=configuration` container).

The **AAD DC Service Accounts** security group is also a member of the built-in group **Pre-Windows 2000 Compatible Access**.

When added to this security group, the service account for SharePoint Server user profile synchronization service is granted the required privileges to work correctly.

## Enable support for SharePoint Server user profile sync

The service account for SharePoint Server needs adequate privileges to replicate changes to the directory and let SharePoint Server user profile sync work correctly. To provide these privileges, add the service account used for SharePoint user profile synchronization to the **AAD DC Service Accounts** group.

From your Azure AD DS management VM, complete the following steps:

> [!NOTE]
> To edit group membership in a managed domain, you must be signed in to a user account that's a member of the *AAD DC Administrators* group.

1. From the Start screen, select **Administrative Tools**. A list of available management tools is shown that were installed in the tutorial to [create a management VM][tutorial-create-management-vm].
1. To manage group membership, select **Active Directory Administrative Center** from the list of administrative tools.
1. In the left pane, choose your managed domain, such as *aaddscontoso.com*. A list of existing OUs and resources is shown.
1. Select the **Users** OU, then choose the *AAD DC Service Accounts* security group.
1. Select **Members**, then choose **Add...**.
1. Enter the name of the SharePoint service account, then select **OK**. In the following example, the SharePoint service account is named *spadmin*:

    ![Add the SharePoint service account to the AAD DC Service Accounts security group](./media/deploy-sp-profile-sync/add-member-to-aad-dc-service-accounts-group.png)

## Next steps

For more information, see [Grant Active Directory Domain Services permissions for profile synchronization in SharePoint Server](https://technet.microsoft.com/library/hh296982.aspx)

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[tutorial-create-management-vm]: tutorial-create-management-vm.md

<!-- EXTERNAL LINKS -->
[sharepoint-service-account]: /sharepoint/security-for-sharepoint-server/plan-for-administrative-and-service-accounts
