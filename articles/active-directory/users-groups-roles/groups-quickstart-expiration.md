---
title: Expiration policy quickstart for Office 365 groups - Azure Active Directory | Microsoft Docs
description: Expiration for Office 365 groups - Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: quickstart
ms.date: 05/06/2019
ms.author: curtand
ms.reviewer: krbain
ms.custom: it-pro
#As a new Azure AD identity administrator, I want user-created Office 365 groups in my tenant to expire so I can reduce the number of unused groups.
ms.collection: M365-identity-device-management
---
# Quickstart: Set Office 365 groups to expire in Azure Active Directory

In this quickstart, you set the expiration policy for your Office 365 groups. When users can set up their own groups, unused groups can multiply. One way to manage unused groups is to set those groups to expire, to reduce the maintenance of manually deleting groups.

Expiration policy is simple:

* Group owners are notified to renew an expiring group
* A group that is not renewed is deleted
* A deleted Office 365 group can be restored within 30 days by a group owner or by an Azure AD administrator

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisite

 The least-privileged role required to set up group expiration is User administrator in the organization.

## Turn on user creation for groups

1. Sign in to the [Azure portal](https://portal.azure.com) with a User administrator account.

2. Select **Groups**, and then select **General**.
  
   ![Self-service group settings page](./media/groups-quickstart-expiration/self-service-settings.png)

3. Set  **Users can create Office 365 groups** to **Yes**.

4. Select **Save** to save the groups settings when you're done.

## Set group expiration

1. Sign in to the [Azure portal](https://portal.azure.com), select **Azure Active Directory** > **Groups** > **Expiration** to open the expiration settings.
  
   ![Expiration settings page for group](./media/groups-quickstart-expiration/expiration-settings.png)

2. Set the expiration interval. Select a preset value or enter a custom value over 31 days. 

3. Provide an email address where expiration notifications should be sent when a group has no owner.

4. For this quickstart, set **Enable expiration for these Office 365 groups** to **All**.

5. Select **Save** to save the expiration settings when you're done.

That's it! In this quickstart, you successfully set the expiration policy for the selected Office 365 groups.

## Clean up resources

### To remove the expiration policy

1. Ensure that you are signed in to the [Azure portal](https://portal.azure.com) with an account that is the Global Administrator for your tenant.
2. Select **Azure Active Directory** > **Groups** > **Expiration**.
3. Set **Enable expiration for these Office 365 groups** to **None**.

### To turn off user creation for groups

1. Select **Azure Active Directory** > **Groups** > **General**. 
2. Set **Users can create Office 365 groups in Azure portals** to **No**.

## Next steps

For more information about expiration including PowerShell instructions and technical constraints, see the following article:

> [!div class="nextstepaction"]
> [Expiration policy PowerShell](groups-lifecycle.md)
