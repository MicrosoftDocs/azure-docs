---
title: Share link to request an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to share link to request an access package in Azure Active Directory entitlement management.
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
# Share link to request an access package in Azure AD entitlement management

Most users in your directory can sign in to the My Access portal and automatically see a list of access packages they can request. However, for external business partner users that are not yet in your directory, you will need to send them a link that they can use to request an access package. 

As long as the catalog for the access package is [enabled for external users](entitlement-management-catalog-create.md) and you have a [policy for the external user's directory](entitlement-management-access-package-request-policy.md), the external user can use the My Access portal link to request the access package.

## Share link to request an access package

**Prerequisite role:** Global administrator, User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. On the Overview page, copy the **My Access portal link**.

    ![Access package overview - My Access portal link](./media/entitlement-management-shared/my-access-portal-link.png)

    It is important that you copy the entire My Access portal link when sending it to an internal business partner. This ensures that the partner will get access to your directory's portal to make their request. The link starts with `myaccess`, includes a directory hint, and ends with an access package ID.  (For US Government, the domain in the My Access portal link will be `myaccess.microsoft.us`.)

    `https://myaccess.microsoft.com/@<directory_hint>#/access-packages/<access_package_id>`

1. Email or send the link to your external business partner. They can share the link with their users to request the access package.

## Next steps

- [Request access to an access package](entitlement-management-request-access.md)
- [Approve or deny access requests](entitlement-management-request-approve.md)