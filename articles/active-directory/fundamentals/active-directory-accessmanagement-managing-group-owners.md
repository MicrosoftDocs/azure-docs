---
title: Add or remove group owners - Azure Active Directory | Microsoft Docs
description: Instructions about how to add or remove group owners using Azure Active Directory. 
services: active-directory
author: msaburnley
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 09/11/2018
ms.author: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Add or remove group owners in Azure Active Directory
Azure Active Directory (Azure AD) groups are owned and managed by group owners. Group owners can be users or service principals, and are able to manage the group including membership. Only existing group owners or group-managing administrators can assign group owners. Group owners aren't required to be members of the group.

When a group has no owner, group-managing administrators are still able to manage the group. It is recommended for every group to have at least one owner. Once owners are assgined to a group, the last owner of the group cannot be removed. Please make sure to select another owner before removing the last owner from the group.

## Add an owner to a group
Below are instructions for adding a user as an owner to a group using the Azure AD portal. To add a service principal as an owner of a group, follow the instructions to do so using [PowerShell](https://docs.microsoft.com/powershell/module/Azuread/Add-AzureADGroupOwner?view=azureadps-2.0).

### To add a group owner
1. Sign in to the [Azure portal](https://portal.azure.com) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, select **Groups**, and then select the group for which you want to add an owner (for this example, *MDM policy - West*).

3. On the **MDM policy - West Overview** page, select **Owners**.

    ![MDM policy - West Overview page with Owners option highlighted](media/active-directory-accessmanagement-managing-group-owners/add-owners-option-overview-blade.png)

4. On the **MDM policy - West - Owners** page, select **Add owners**, and then search for and select the user that will be the new group owner, and then choose **Select**.

    ![MDM policy - West - Owners page with Add owners option highlighted](media/active-directory-accessmanagement-managing-group-owners/add-owners-owners-blade.png)

    After you select the new owner, you can refresh the **Owners** page and see the name added to the list of owners.

## Remove an owner from a group
Remove an owner from a group using Azure AD.

### To remove an owner
1. Sign in to the [Azure portal](https://portal.azure.com) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, select **Groups**, and then select the group for which you want to remove an owner (for this example, *MDM policy - West*).

3. On the **MDM policy - West Overview** page, select **Owners**.

    ![MDM policy - West Overview page with Owners option highlighted](media/active-directory-accessmanagement-managing-group-owners/remove-owners-option-overview-blade.png)

4. On the **MDM policy - West - Owners** page, select the user you want to remove as a group owner, choose **Remove** from the user's information page, and select **Yes** to confirm your decision.

    ![User's information page with Remove option highlighted](media/active-directory-accessmanagement-managing-group-owners/remove-owner-info-blade.png)

    After you remove the owner, you can return to the **Owners** page and see the name has been removed from the list of owners.

## Next steps
- [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

- [Azure Active Directory cmdlets for configuring group settings](../users-groups-roles/groups-settings-cmdlets.md)

- [Use groups to assign access to an integrated SaaS app](../users-groups-roles/groups-saasapps.md)

- [Integrating your on-premises identities with Azure Active Directory](../hybrid/whatis-hybrid-identity.md)

- [Azure Active Directory cmdlets for configuring group settings](../users-groups-roles/groups-settings-v2-cmdlets.md)
