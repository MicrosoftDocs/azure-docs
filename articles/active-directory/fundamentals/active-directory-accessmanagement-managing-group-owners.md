---
title: Next steps for access management using groups - Azure AD | Microsoft Docs
description: Advanced How-to's for managing security groups and how to use these groups to manage access to a resource.
services: active-directory
documentationcenter: ''
author: eross-msft
manager: mtillman
editor: ''
ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: conceptual
ms.date: 09/11/2018
ms.author: lizross
ms.custom: it-pro
---

# Managing owners for a group
Once a resource owner has assigned access to a resource to an Azure AD group, the membership of the group is managed by the group owner. The resource owner effectively delegates the permission to assign users to the resource to the owner of the group.

## Add an owner to a group

1. In the [Azure AD admin center](https://aad.portal.azure.com), select **Users and groups**.
2. Select **All groups**, and then open the group that you want to add owners to.
3. Select **Add Owners**.
4. On the **Add owners** page, select the user that you want to add as the owner of this group, and make sure this name is added to the **Selected** pane.

## Remove an owner from a group

1. In the [Azure AD admin center](https://aad.portal.azure.com), select **Users and groups**.
2. Select **All groups**, and then open the group from which you want to remove owners.
3. Select the **Owners** tab.
4. Select the owner that you want to remove from this group, and then select **Remove**.

## Additional information
These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)
* [Azure Active Directory cmdlets for configuring group settings](../users-groups-roles/groups-settings-cmdlets.md)
* [Application Management in Azure Active Directory](../manage-apps/what-is-application-management.md)
* [What is Azure Active Directory?](active-directory-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](../connect/active-directory-aadconnect.md)
