---
title: Convert guest user lifecycle in entitlement management - Microsoft Entra
description: Learn how to convert guest user access package assignments for an access package in entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyATL
manager: amycolannino
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 08/08/2023
ms.author: owinfrey
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about how I can convert an ungoverned guest user access package assignment so that requestors have the resources they need to perform their job.

---

# Manage guest user lifecycle (preview)  

Entitlement management allows you to gain visibility into the state of a guest user's lifecycle through the following viewpoints:

- **Governed** - The guest user is set to be governed.  
- **Ungoverned** - The guest user is set to not be governed.
- **Blank** - The lifecycle for the guest user isn't determined. This happens when the guest user had an access package assigned before managing user lifecycle was possible.

> [!NOTE]
> When a guest user is set as **Governed**, based on ELM tenant settings their account will be deleted or disabled in specified days after their last access package assignment expires.  Learn more about ELM settings here: [Manage external access with Azure Active Directory entitlement management](../fundamentals/6-secure-access-entitlement-managment.md).

You can directly convert ungoverned users to be governed by using the **Mark Guests as Governed (preview)** functionality in the top menu bar.

## Manage guest user lifecycle in the Azure portal

To manage user lifecycle, you'd follow these steps:

**Prerequisite role:** Global administrator, User administrator, Catalog owner, Access package manager or Access package assignment manager

1. In the Azure portal, select **Azure Active Directory** and then select **Identity Governance**.

1. In the left menu, select **Access packages** and then open the access package.

1. In the left menu, select **Assignments**.

1. On the assignments screen, select the user you want to manage the lifecycle for, and then select **Mark guest as governed (Preview)**.
    :::image type="content" source="media/entitlement-management-access-package-assignments/govern-user-lifecycle.png" alt-text="Screenshot of the govern user lifecycle selection." lightbox="media/entitlement-management-access-package-assignments/govern-user-lifecycle.png":::
1. Select save.

## Manage guest user lifecycle programmatically 

To manage user lifecycle programatically using Microsoft Graph, see: [accessPackageSubject resource type](/graph/api/resources/accesspackagesubject).



## Next steps

- [What is entitlement management?](entitlement-management-overview.md)
