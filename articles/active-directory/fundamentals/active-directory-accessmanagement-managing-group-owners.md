---
title: How to add and remove Azure Active Directory group owners | Microsoft Docs
description: Learn how to add and remove group owners using the Azure Active Directory portal. 
services: active-directory
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: conceptual
ms.date: 09/04/2018
ms.author: lizross
ms.custom: it-pro
---

# How to add and remove group owners in Azure Active Directory
Azure Active Directory (Azure AD) security groups are owned and managed by group owners. Group owners are assigned to manage a group and its members by a resource owner (administrator). After a group owner has been assigned, only a resource owner can add or remove owners.

## Add an owner to a group
Add additional group owners to a security group using the Azure AD portal.

### To add a group owner
1. Sign in to the [Azure AD portal](https://portal.azure.com) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, select **Groups**, and then select the group for which you want to add an owner (for this example, _MDM policy - West_).

3. On the **MDM policy - West Overview** blade, select **Owners**.

    ![**MDM policy - West Overview** blade with Owners option highlighted](/media/active-directory-accessmanagement-managing-group-owners/add-owners-option-overview-blade.png)

4. On the **MDM policy - West - Owners** blade, select **Add owners**, and then search for and select the user that will be the new group owner, and then choose **Select**.

    ![**MDM policy - West - Owners** blade with Add owners option highlighted](/media/active-directory-accessmanagement-managing-group-owners/add-owners-owners-blade.png)

    After you select the new owner, you can refresh the **Owners** blade and see the name added to the list of owners.

## Remove an owner from a group
Remove an onwer from a security group using the Azure AD portal.

### To remove an owner
1. Sign in to the [Azure AD portal](https://portal.azure.com) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, select **Groups**, and then select the group for which you want to add an owner (for this example, _MDM policy - West_).

3. On the **MDM policy - West Overview** blade, select **Owners**.

    ![**MDM policy - West Overview** blade with Owners option highlighted](/media/active-directory-accessmanagement-managing-group-owners/remove-owners-option-overview-blade.png)

4. On the **MDM policy - West - Owners** blade, select the user you want to remove as a group owner, choose **Remove** from the user's information blade, and select **Yes** to confirm your decision.

    ![User's information blade with Remove option highlighted](/media/active-directory-accessmanagement-managing-group-owners/remove-owner-info-blade.png)

    After you remove the owner, you can return to the **Owners** blade and see the name has been removed from the list of owners.

## Next steps
* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)
* [Azure Active Directory cmdlets for configuring group settings](../users-groups-roles/groups-settings-cmdlets.md)
* [Article Index for Application Management in Azure Active Directory](../active-directory-apps-index.md)
* [What is Azure Active Directory?](active-directory-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](../connect/active-directory-aadconnect.md)
