---
title: Expiration policy quickstart for Office 365 groups in Azure Active Directory | Microsoft Docs
description: Expiration for Office 365 groups - Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: quickstart
ms.date: 06/18/2018
ms.author: curtand
ms.reviewer: krbain
ms.custom: it-pro
#As a new Azure AD identity administrator, I want user-created Office 365 groups in my tenant to expire so I can reduce the number of unused groups.
---
# Quickstart: Set Office 365 groups to expire in Azure Active Directory

In this quickstart, you set the expiration policy for your Office 365 groups. When you set those groups to expire, you don't have to delete as many unused user-created groups. Group owners are notified to renew an expiring group, and a group that is not renewed is deleted. A deleted Office 365 group can be restored within 30 days by a group owner or by an Azure AD administrator.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin. 

## Prerequisite
You must be a Global administrator or User Account administrator in the tenant to set up group expiration.

## Turn on self-service for Office 365 groups

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that's a Global administrator or User Account administrator for the directory.

2. Select **Groups**, and then select **General**.
  
  ![Self-service group settings](./media/groups-quickstart-expiration/self-service-settings.png)

3. Set  **Users can create Office 365 groups** to **Yes**.

4. Select **Save** to save the groups settings when you're done.

## Set group expiration

1. In the [Azure AD admin center](https://aad.portal.azure.com), select **Azure Active Directory** > **Groups** > **Expiration** to open the expiration settings.
  
  ![Expiration settings](./media/groups-quickstart-expiration/expiration-settings.png)

2. Set the expiration interval. Select a preset value or enter a custom value over 31 days. 

3. Provide an email address where expiration notifications should be sent when a group has no owner. 

4. Select which groups should expire. You can enable expiration for **All** Office 365 groups, only **Selected** Office 365 groups, or **None** of the groups in the tenant.

5. Select **Save** to save the expiration settings when you're done.

That's it! In this quickstart, you successfully set the expiration policy for the selected Office 365 groups.


## Next steps
For more information about expiration including technical constraints, adding a list of custom blocked words, and end user experiences across Office 365 apps, see the following article containing those expiration policy details:

> [!div class="nextstepaction"]
> [Expiration policy all details](active-directory-groups-lifecycle-azure-portal.md)