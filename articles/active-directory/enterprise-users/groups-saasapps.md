---
title: Use a group to manage access to SaaS apps
description: How to use groups in Microsoft Entra ID to assign access to SaaS applications that are integrated with Microsoft Entra ID.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 09/08/2023
ms.author: barclayn
ms.reviewer: krbain
ms.custom: it-pro
ms.collection: M365-identity-device-management
---
# Using a group to manage access to SaaS applications

Using Microsoft Entra ID, part of Microsoft Entra, with a Microsoft Entra ID P1 or P2 license plan, you can use groups to assign access to a SaaS application that's integrated with Microsoft Entra ID. For example, if you want to assign access for the marketing department to use five different SaaS applications, you can create an Office 365 or security group that contains the users in the marketing department, and then assign that group to these five SaaS applications that are needed by the marketing department. This way you can save time by managing the membership of the marketing department in one place. Users then are assigned to the application when they are added as members of the marketing group, and have their assignments removed from the application when they are removed from the marketing group. This capability can be used with hundreds of applications that you can add from within the Microsoft Entra Application Gallery.

> [!IMPORTANT]
> You can use this feature only after you start a Microsoft Entra ID P1 or P2 trial or purchase Microsoft Entra ID P1 or P2 license plan.
> Group-based assignment is supported only for security groups.
> Nested group memberships are not supported for group-based assignment to applications at this time.

## To assign access for a user or group to a SaaS application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Administrator](../roles/permissions-reference.md#global-administrator).
1. In the search box enter **Enterprise applications** and choose **Enterprise applications** from the search results.
1. Select an application that you added from the Application Gallery to open it.
1. Select **Users and groups**, and then select **Add user**.
1. On **Add Assignment**, select **Users and groups** to open the **Users and groups** selection list.
1. Select as many groups or users as you want, then click or tap **Select** to add them to the **Add Assignment** list. You can also assign a role to a user at this stage.
1. Select **Assign** to assign the users or groups to the selected enterprise application.

## Next steps
These articles provide additional information on Microsoft Entra ID.

* [Managing access to resources with Microsoft Entra groups](../fundamentals/concept-learn-about-groups.md)
* [Application Management in Microsoft Entra ID](../manage-apps/what-is-application-management.md)
* [Microsoft Entra cmdlets for configuring group settings](../enterprise-users/groups-settings-cmdlets.md)
* [What is Microsoft Entra ID?](../fundamentals/whatis.md)
* [Integrating your on-premises identities with Microsoft Entra ID](../hybrid/whatis-hybrid-identity.md)
