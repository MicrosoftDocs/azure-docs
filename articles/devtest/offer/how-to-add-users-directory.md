---
title: Add users and assign access to your Azure subscription
description: A how-to guide for adding users to your Azure credit subscription and managing their access with role-based controls.
ms.author: amast
author: joseb-rdc
ms.service: visual-studio-family
ms.subservice: subscriptions
ms.topic: how-to 
ms.date: 07/09/2026
ms.custom: devtestoffer
---

# Add users and assign access to your Azure subscription  

To access and manage subscription resources, users must exist in the associated Microsoft Entra directory. Access within a subscription is governed by Azure role-based access control (Azure RBAC), which works with Microsoft Entra ID.

Before adding users, determine your business hierarchy and the level of access required for each role.  

## Why do I need to add users?

Determine whether you need to add a new user to your subscription. Common scenarios include:  

- Grant IT access to monitor and enforce security requirements
- Collaborate with team members on development or API work
- Provide subscription-level access across all resource groups
- Limit access to specific resources or resource groups
- Improve visibility and transparency while isolating specific parts of work as needed
- Add external contributors, such as consultants
- Enable collaboration for testing and preproduction validation

## Where do I add users and their roles within my subscription?

Microsoft Entra ID provides identity management, while [Azure role-based access control](../../role-based-access-control/overview.md) \(Azure RBAC\) defines access to resources. After determining the need to add a user, identify where to add them and the scope of access required. Scope defines the set of resources a user can access.

If projects require IT oversight for security, assign an administrative role at the management group level to provide broad access accross the subscription.

In contrast, collaborators might only require access to the resource group or resource level.  

For more information, see the [Azure RBAC overview](../../role-based-access-control/overview.md).

To add or delete users by using Microsoft Entra ID, see:

- [Add or delete users - Microsoft Entra ID | Microsoft Docs](../../active-directory/fundamentals/add-users-azure-active-directory.md)  

- [Steps to assign an Azure role - Azure RBAC | Microsoft Docs](../../role-based-access-control/role-assignments-steps.md)  
