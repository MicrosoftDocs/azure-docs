---
title: Hide or delete access package in entitlement management - Azure AD
description: Learn how to hide or delete an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: msaburnley
manager: daveba
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 10/15/2019
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about how I can edit an access package so that requestors have the resources they need to perform their job.

---
# Hide or delete an access package in Azure AD entitlement management

Access packages are discoverable by default. This means that if a policy allows a user to request the access package, they will automatically see the access package listed in their My Access portal. However, you can change the **Hidden** setting so that the access package is not listed in user's My Access portal.

This article describes how to hide or delete an access package.

## Change the Hidden setting

Follow these steps to change the **Hidden** setting for an access package.

**Prerequisite role:** Global administrator, User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. On the Overview page, click **Edit**.

1. Set the **Hidden** setting.

    If set to **No**, the access package will be listed in the user's My Access portal.

    If set to **Yes**, the access package will not be listed in the user's My Access portal. The only way a user can view the access package is if they have the direct **My Access portal link** to the access package. For more information, see [Share link to request an access package](entitlement-management-access-package-settings.md).

## Delete an access package

An access package can only be deleted if it has no active user assignments. Follow these steps to delete an access package.

**Prerequisite role:** Global administrator, User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. In the left menu, click **Assignments** and remove access for all users.

1. In the left menu, click **Overview** and then click **Delete**.

1. In the delete message that appears, click **Yes**.

## Next steps

- [View, add, and remove assignments for an access package](entitlement-management-access-package-assignments.md)
- [View reports and logs](entitlement-management-reports.md)
