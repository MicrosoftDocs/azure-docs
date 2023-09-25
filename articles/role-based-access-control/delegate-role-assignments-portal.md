---
title: Delegate the Azure role assignment task to others with conditions (preview) - Azure ABAC
description: How to delegate the Azure role assignment task with conditions to other users by using Azure attribute-based access control (Azure ABAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: how-to
ms.workload: identity
ms.date: 09/20/2023
ms.author: rolyon

#Customer intent: As a dev, devops, or it admin, I want to delegate the Azure role assignment task to other users who are closer to the decision, but want to limit the scope of the role assignments.
---

# Delegate the Azure role assignment task to others with conditions (preview)

> [!IMPORTANT]
> Delegating Azure role assignments with conditions is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

As an administrator, you might get several requests to grant access to Azure resources that you want to delegate to someone else. You could assign a user the [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator) roles, but these are highly privileged roles. This article describes a more secure way to [delegate the role assignment task](delegate-role-assignments-overview.md) to other users in your organization, but add restrictions for those role assignments. For example, you can constrain the roles that can be assigned or constrain the principals the roles can be assigned to.

The following diagram shows how a delegate with conditions can only assign the Backup Contributor or Backup Reader roles to only the Marketing or Sales groups.

:::image type="content" source="./media/delegate-role-assignments-portal/delegate-role-assignments.png" alt-text="Diagram that shows an administrator delegating role assignments with conditions." lightbox="./media/delegate-role-assignments-portal/delegate-role-assignments.png":::

## Prerequisites

[!INCLUDE [Azure role assignment prerequisites](../../includes/role-based-access-control/prerequisites-role-assignments.md)]

## Step 1: Determine the permissions the delegate needs

To help determine the permissions the delegate needs, answer the following questions:

- What roles can the delegate assign?
- What types of principals can the delegate assign roles to?
- Which principals can the delegate assign roles to?
- Can delegate remove any role assignments?

Once you know the permissions that delegate needs, you use the following steps to add a condition to the delegate's role assignment. For example conditions, see [Examples to delegate Azure role assignments with conditions (preview)](delegate-role-assignments-examples.md).

## Step 2: Start a new role assignment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Follow the steps to [open the Add role assignment page](role-assignments-portal.md).

1. On the **Roles** tab, select the **Privileged administrator roles** tab.

1. Select the **Role Based Access Control Administrator (Preview)** role.

    The **Conditions** tab appears.

    You can select any role that includes the `Microsoft.Authorization/roleAssignments/write` or `Microsoft.Authorization/roleAssignments/delete` actions, such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator), but [Role Based Access Control Administrator (Preview)](built-in-roles.md#role-based-access-control-administrator-preview) has fewer permissions.

1. On the **Members** tab, find and select the delegate.

## Step 3: Add a condition

There are two ways that you can add a condition. You can use a condition template or you can use an advanced condition editor.

# [Template](#tab/template)

1. On the **Conditions** tab under **Delegation type**, select the **Constrained (recommended)** option.

    | Option | Select this option to |
    | --- | --- |
    | **Constrained (recommended)** | Pick the roles or principals the user can use in role assignments |
    | **Not constrained** | Allow the user to assign any role to any principal |

    :::image type="content" source="./media/shared/condition-constrained.png" alt-text="Screenshot of Add role assignment with the Constrained option selected." lightbox="./media/shared/condition-constrained.png":::

1. Select **Add condition**.

    The Add role assignment condition page appears with a list of condition templates.

    :::image type="content" source="./media/shared/condition-templates.png" alt-text="Screenshot of Add role assignment condition with a list of condition templates." lightbox="./media/shared/condition-templates.png":::

1. Select a condition template and then select **Configure**.

    | Condition template | Select this template to |
    | --- | --- |
    | Constrain roles | Constrain the roles a user can assign |
    | Constrain roles and principal types | Constrain the roles a user can assign and the types of principals the user can assign roles to |
    | Constrain roles and principals | Constrain the roles a user can assign and the principals the user can assign roles to |

1. In the configure pane, add the required configurations.

    :::image type="content" source="./media/delegate-role-assignments-portal/condition-template-configure-pane.png" alt-text="Screenshot of configure pane for a condition with selection added." lightbox="./media/delegate-role-assignments-portal/condition-template-configure-pane.png":::

1. Select **Save** to add the condition to the role assignment.

# [Condition editor](#tab/condition-editor)

If the condition templates don't work for your scenario or if you want more control, you can use the condition editor.

### Open condition editor

1. On the **Conditions** tab under **Delegation type**, select the **Constrained (recommended)** option.

    | Option | Select this option to |
    | --- | --- |
    | **Constrained (recommended)** | Pick the roles or principals the user can use in role assignments |
    | **Not constrained** | Allow the user to assign any role to any principal |

    :::image type="content" source="./media/shared/condition-constrained.png" alt-text="Screenshot of Add role assignment with the Constrained option selected." lightbox="./media/shared/condition-constrained.png":::

1. Select **Add condition**.

    The Add role assignment condition page appears with a list of condition templates.

    :::image type="content" source="./media/shared/condition-templates.png" alt-text="Screenshot of Add role assignment condition with a list of condition templates." lightbox="./media/shared/condition-templates.png":::

1. Select **Open advanced condition editor**.

    The Add role assignment condition page appears.

1. For the **Editor type** option, leave the default **Visual** selected.

### Add action

1. In the **Add action** section, select **Add action**.

    The Select an action pane appears. This pane is a filtered list of actions based on the role assignment that will be the target of your condition.

    :::image type="content" source="./media/delegate-role-assignments-portal/delegate-role-assignments-actions-select.png" alt-text="Screenshot of Select an action pane to delegate role assignments with conditions." lightbox="./media/delegate-role-assignments-portal/delegate-role-assignments-actions-select.png":::

1. Select the **Create or update role assignments** action you want to allow if the condition is true.

    > [!TIP]
    > If you select both **Create or update role assignments** and **Delete a role assignment** actions, you won't be able add a condition expression. If you want to target both of these actions, you must add two conditions. For more information, see [Example: Constrain roles](delegate-role-assignments-examples.md#example-constrain-roles).

### Build expressions

1. In the **Build expression** section, select **Add expression**.

    Here is where you build the expression to constrain role assignments the delegate can add.

1. In the **Attribute source** list, select **Request**.

1. In the **Attribute** list, select one of the following attributes for the left side of the expression.

    - [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) is used to constrain the roles the delegate can assign.
    - [Principal ID](conditions-authorization-actions-attributes.md#principal-id) is used to constrain the specific principals the delegate can assign roles to.
    - [Principal type](conditions-authorization-actions-attributes.md#principal-type) is used to constrain the types of principals (users, groups, or service principals) that the delegate can assign roles to.

1. In the **Operator** list, select an operator.

    Depending on the attribute and the expression you want to build, you typically select these operators, which allow you to select one or more values for the right side of the expression.

    | Attribute | Common operator |
    | --- | --- |
    | **Role definition ID** | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
    | **Principal ID** | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
    | **Principal type** | [ForAnyOfAnyValues:StringEqualsIgnoreCase](conditions-format.md#foranyofanyvalues) |

1. In the **Value** box, enter one or more values for the right side of the expression.

    :::image type="content" source="./media/shared/delegate-role-assignments-expression.png" alt-text="Screenshot of Build expression section to delegate role assignments with conditions." lightbox="./media/shared/delegate-role-assignments-expression.png":::

1. Add additional expressions as needed.

    > [!TIP]
    > When you add multiple expressions to delegate role assignments with conditions, you typically use the **And** operator between expressions instead of the default **Or** operator.

1. Select **Save** to add the condition to the role assignment.

---

## Step 4: Assign role with condition to delegate

1. On the **Review + assign** tab, review the role assignment settings.

1. Select **Review + assign** to assign the role.

   After a few moments, the delegate is assigned the Role Based Access Control Administrator role with your role assignment conditions.

## Step 5: Delegate assigns roles with conditions

- Delegate can now follow steps to [assign roles](role-assignments-portal.md).

    :::image type="content" source="./media/shared/groups-constrained.png" alt-text="Diagram of role assignments constrained to specific roles and specific groups." lightbox="./media/shared/groups-constrained.png":::

    When the delegate tries to assign roles in the Azure portal, the list of roles will be filtered to just show the roles they can assign.

    :::image type="content" source="./media/shared/constrained-roles-assign.png" alt-text="Screenshot of role assignments constrained to specific roles." lightbox="./media/shared/constrained-roles-assign.png":::

    If there is a condition for principals, the list of principals available for assignment are also filtered.

    :::image type="content" source="./media/shared/constrained-principals-assign.png" alt-text="Screenshot of role assignments constrained to specific groups." lightbox="./media/shared/constrained-principals-assign.png":::

    If the delegate attempts to assign a role that is outside the conditions using an API, the role assignment fails with an error. For more information, see [Symptom - Unable to assign a role](./troubleshooting.md#symptom---unable-to-assign-a-role).

## Next steps

- [Delegate Azure access management to others](delegate-role-assignments-overview.md)
- [Authorization actions and attributes](conditions-authorization-actions-attributes.md)
