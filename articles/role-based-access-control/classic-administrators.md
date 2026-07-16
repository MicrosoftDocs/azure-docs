---
title: Azure classic subscription administrators
description: Describes the retirement of the Co-Administrator and Service Administrator roles.
author: rolyon
manager: pmwongera

ms.service: role-based-access-control
ms.topic: how-to
ms.date: 05/06/2026
ms.author: rolyon
ms.reviewer: bagovind
ms.custom: sfi-image-nochange
---

# Azure classic subscription administrators

[!INCLUDE [classic-administrators-retirement-note](./includes/classic-administrators-retirement-note.md)]

This article describes the retirement of the Co-Administrator and Service Administrator roles.

## Frequently asked questions

What happened to classic administrator role assignments after August 31, 2024?

- Co-Administrator and Service Administrator roles were retired and are no longer supported.

What happened to classic administrator role assignments after December 2025?

- Azure automatically assigned the Owner role at subscription scope to users in the public cloud who were still assigned the Co-Administrator or Service Administrator role. For more information, see [Automatic assignment to Owner role](#automatic-assignment-to-owner-role).

What happened to the Classic Administrators tab in the Azure portal?

- As of May 2026, the **Classic Administrators** tab has been removed from the Azure portal. Classic administrator roles are fully retired.

What is the equivalent Azure role for Co-Administrators?

- [Owner](built-in-roles.md#owner) role at subscription scope has the equivalent access. However, Owner is a [privileged administrator role](role-assignments-steps.md#privileged-administrator-roles) and grants full access to manage Azure resources. You should consider a job function role with fewer permissions, reduce the scope, or add a condition.

What is the equivalent Azure role for Service Administrator?

- [Owner](built-in-roles.md#owner) role at subscription scope has the equivalent access.

What about the Account Administrator role?

- The Account Administrator is the primary user for your billing account. Account Administrator isn't being deprecated and you don't need to convert this role assignment. Account Administrator and Service Administrator might be the same user.

What should I do if I lose access to a subscription?

- If your classic administrators were removed without having at least one Owner role assignment for a subscription, the subscription might be orphaned. To regain access to a subscription, you can do the following:

    - Follow steps to [elevate access to manage all subscriptions in a tenant](elevate-access-global-admin.md).
    - Assign the Owner role at subscription scope for a user.
    - Remove elevated access.

## Automatic assignment to Owner role

Starting in December 2025, Azure automatically assigned classic administrators the Owner role at subscription scope. These role assignments have the following properties:

- description: `The Classic Admin role was converted to an Azure Owner role on behalf of the user due to Classic Admin retirement`
- createdBy: `0469d4cd-df37-4d93-8a61-f8c75b809164`

:::image type="content" source="./media/classic-administrators/classic-administrator-owner-description.png" alt-text="Screenshot of Access control (IAM) page that shows the description for an Owner role assignment that was automatically assigned." lightbox="./media/classic-administrators/classic-administrator-owner-description.png":::

If you have an Owner role assignment with this description and the user no longer needs access, you should [remove the role assignment](role-assignments-remove.md).

## Next steps

- [Understand the different roles](../role-based-access-control/rbac-and-directory-admin-roles.md)
- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
