---
title: Use custom roles for Azure resources in PIM - Azure Active Directory | Microsoft Docs
description: Learn how to use custom roles for Azure resources in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: pim
ms.date: 03/30/2018
ms.author: rolyon
ms.collection: M365-identity-device-management
---

# Use custom roles for Azure resources in PIM

You might need to apply strict Azure Active Directory (Azure AD) Privileged Identity Management (PIM) settings to some members of a role, while providing greater autonomy for others. Consider a scenario in which your organization hires several contract associates to assist in the development of an application that will run in an Azure subscription.

As a resource administrator, you want employees to be eligible for access without requiring approval. However, all contract associates must be approved when they request access to the organization's resources.

Follow the steps outlined in the next section to set up targeted PIM settings for Azure resource roles.

## Create the custom role

To create a custom role for a resource, follow the steps described in [Create custom roles for Azure Role-Based Access Control](../role-based-access-control-custom-roles.md).

When you create custom role, include a descriptive name so you can easily remember which built-in role you intended to duplicate.

> [!NOTE]
> Ensure that the custom role is a duplicate of the built-in role you want to duplicate, and that its scope matches the built-in role.

## Apply PIM settings

After the role is created in your tenant, in the Azure portal, go to the **Privileged Identity Management - Azure resources** pane. Select the resource that the role applies to.

![The "Privileged Identity Management - Azure resources" pane](media/pim-resource-roles-custom-role-policy/aadpim-manage-azure-resource-some-there.png)

[Configure PIM role settings](pim-resource-roles-configure-role-settings.md) that should apply to these members of the role.

Finally, [assign roles](pim-resource-roles-assign-roles.md) to the distinct group of members that you want to target with these settings.

## Next steps

- [Configure Azure resource role settings in PIM](pim-resource-roles-configure-role-settings.md)
- [Custom roles in Azure](../../role-based-access-control/custom-roles.md)
