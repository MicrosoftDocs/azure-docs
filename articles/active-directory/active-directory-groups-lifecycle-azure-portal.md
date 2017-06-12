---
title: Set expiration properties for a group (preview) in Azure Active Directory | Microsoft Docs
description: How to set expiration dates and send expiration notifications (preview) for a group in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/12/2017
ms.author: curtand                       

---

# Set expiration properties for an Office 365 group and send expiration notifications
With administrators and information workers able to create and administer their own groups, as scale increases, you there need the ability to set the global options in a tenant for the default expiration behaviors of groups. You can use this functionality to automatically reclaim resource space and prevent address book pollution with groups that are no longer actively used. For example, groups with one or zero members.

1. Open the [Azure portal](https://portal.azure.com) with an account that is a global administrator in your Azure AD tenant.

2. Open Azure AD, select **Users and groups**.

3. Select **Group settings** and then select **Expiration** to open the expiration settings.

4. On the **Expiration** blade, you can:

  - Set the default group expiration interval.
  - Specify an email address where the expiration notifications should be sent when a group has no owner.
  - Select which groups expire. You can enable expiration for **All** groups, you can select from among the groups, or you select **None** to disable expirationfor all groups.

When a group expires, the group is deleted one day after the expiration date, and can still be restored as described in [Restore a deleted Office 365 group in Azure Active Directory] (https://docs.microsoft.com/azure/active-directory/active-directory-groups-restore-azure-portal).
    

## Next steps
These articles provide additional information on Azure AD groups.

* [See existing groups](active-directory-groups-view-azure-portal.md)
* [Manage settings of a group](active-directory-groups-settings-azure-portal.md)
* [Manage members of a group](active-directory-groups-members-azure-portal.md)
* [Manage memberships of a group](active-directory-groups-membership-azure-portal.md)
* [Manage dynamic rules for users in a group](active-directory-groups-dynamic-membership-azure-portal.md)
