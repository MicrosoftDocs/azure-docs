---
title: Azure classic subscription administrators
description: Describes the retirement of the Co-Administrator and Service Administrator roles and how to convert these role assignments.
author: rolyon
manager: amycolannino

ms.service: role-based-access-control
ms.topic: how-to
ms.date: 09/23/2024
ms.author: rolyon
ms.reviewer: bagovind
---

# Azure classic subscription administrators

> [!IMPORTANT]
> As of **August 31, 2024**, Azure classic administrator roles (along with Azure classic resources and Azure Service Manager) are retired and no longer supported. If you still have active Co-Administrator or Service Administrator role assignments, convert these role assignments to Azure RBAC immediately.

Microsoft recommends that you manage access to Azure resources using Azure role-based access control (Azure RBAC). If you're still using the classic deployment model, you'll need to migrate your resources from classic deployment to Resource Manager deployment. For more information, see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/management/deployment-models.md).

This article describes the retirement of the Co-Administrator and Service Administrator roles and how to convert these role assignments.

## Frequently asked questions

What happens to classic administrator role assignments after August 31, 2024?

- Co-Administrator and Service Administrator roles are retired and no longer supported. You should convert these role assignments to Azure RBAC immediately.

How do I know what subscriptions have classic administrators?

- You can use an Azure Resource Graph query to list subscriptions with Service Administrator or Co-Administrator role assignments. For steps see [List classic administrators](#list-classic-administrators).

What is the equivalent Azure role I should assign for Co-Administrators?

- [Owner](built-in-roles.md#owner) role at subscription scope has the equivalent access. However, Owner is a [privileged administrator role](role-assignments-steps.md#privileged-administrator-roles) and grants full access to manage Azure resources. You should consider a job function role with fewer permissions, reduce the scope, or add a condition.

What is the equivalent Azure role I should assign for Service Administrator?

- [Owner](built-in-roles.md#owner) role at subscription scope has the equivalent access.

Why do I need to migrate to Azure RBAC?

- Azure RBAC offers fine grained access control, compatibility with Microsoft Entra Privileged Identity Management (PIM), and full audit logs support. All future investments will be in Azure RBAC.

What about the Account Administrator role?

- The Account Administrator is the primary user for your billing account. Account Administrator isn't being deprecated and you don't need to convert this role assignment. Account Administrator and Service Administrator might be the same user. However, you only need to convert the Service Administrator role assignment.

What should I do if I lose access to a subscription?

- If you remove your classic administrators without having at least one Owner role assignment for a subscription, you will lose access to the subscription and the subscription will be orphaned. To regain access to a subscription, you can do the following:

    - Follow steps to [elevate access to manage all subscriptions in a tenant](elevate-access-global-admin.md).
    - Assign the Owner role at subscription scope for a user.
    - Remove elevated access.

What should I do if I have a strong dependency on Co-Administrators or Service Administrator?

- Email ACARDeprecation@microsoft.com and describe your scenario.

## List classic administrators

# [Azure portal](#tab/azure-portal)

Follow these steps to list the Service Administrator and Co-Administrators for a subscription using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open **Subscriptions** and select a subscription.

1. Select **Access control (IAM)**.

1. Select the **Classic administrators** tab to view a list of the Co-Administrators.

    :::image type="content" source="./media/shared/classic-administrators.png" alt-text="Screenshot of Access control (IAM) page with Classic administrators tab selected." lightbox="./media/shared/classic-administrators.png":::

# [Azure Resource Graph](#tab/azure-resource-graph)

Follow these steps to list the number of Service Administrators and Co-Administrators in your subscriptions using Azure Resource Graph.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open the **Azure Resource Graph Explorer**.

1. Select **Scope** and set the scope for the query.

    Set scope to **Directory** to query your entire tenant, but you can narrow the scope to particular subscriptions.

    :::image type="content" source="./media/shared/resource-graph-scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows Scope selection." lightbox="./media/shared/resource-graph-scope.png":::

1. Select **Set authorization scope** and set the authorization scope to **At, above and below** to query all resources at the specified scope.

    :::image type="content" source="./media/shared/resource-graph-authorization-scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows Set authorization scope pane." lightbox="./media/shared/resource-graph-authorization-scope.png":::

1. Run the following query to list the number Service Administrators and Co-Administrators based on the scope.

    ```kusto
    authorizationresources
    | where type == "microsoft.authorization/classicadministrators"
    | mv-expand role = parse_json(properties).role
    | mv-expand adminState = parse_json(properties).adminState
    | where adminState == "Enabled"
    | where role in ("ServiceAdministrator", "CoAdministrator")
    | summarize count() by subscriptionId, tostring(role)
    ```

    The following shows an example of the results. The **count_** column is the number of Service Administrators or Co-Administrators for a subscription.

    :::image type="content" source="./media/classic-administrators/resource-graph-classic-admin-list.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows the number Service Administrators and Co-Administrators based on the subscription." lightbox="./media/classic-administrators/resource-graph-classic-admin-list.png":::

---

## Co-Administrators retirement

If you still have classic administrators, use the following steps to help you convert Co-Administrator role assignments.

### Step 1: Review your current Co-Administrators

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Use the Azure portal or Azure Resource Graph to [list of your Co-Administrators](#list-classic-administrators).

1. Review the [sign-in logs](/entra/identity/monitoring-health/concept-sign-ins) for your Co-Administrators to assess whether they're active users.

### Step 2: Remove Co-Administrators that no longer need access

1. If user is no longer in your enterprise, [remove Co-Administrator](#how-to-remove-a-co-administrator).

1. If user was deleted, but their Co-Administrator assignment wasn't removed, [remove Co-Administrator](#how-to-remove-a-co-administrator).

    Users that have been deleted typically include the text **(User was not found in this directory)**.

    :::image type="content" source="media/classic-administrators/user-not-found.png" alt-text="Screenshot of user not found in directory and with Co-Administrator role." lightbox="media/classic-administrators/user-not-found.png":::

1. After reviewing activity of user, if user is no longer active, [remove Co-Administrator](#how-to-remove-a-co-administrator).

### Step 3: Convert Co-Administrators to job function roles

Most users don't need the same permissions as a Co-Administrator. Consider a job function role instead.

1. If a user still needs some access, determine the appropriate [job function role](role-assignments-steps.md#job-function-roles) they need.

1. Determine the [scope](scope-overview.md) user needs.

1. Follow steps to [assign a job function role to user](role-assignments-portal.yml).

1. [Remove Co-Administrator](#how-to-remove-a-co-administrator).

### Step 4: Convert Co-Administrators to Owner role with conditions

Some users might need more access than what a job function role can provide. If you must assign the [Owner](built-in-roles.md#owner) role, consider adding a condition or using Microsoft Entra Privileged Identity Management (PIM) to constrain the role assignment.

1. Assign the Owner role with conditions.

    For example, assign the [Owner role at subscription scope with conditions](role-assignments-portal-subscription-admin.yml). If you have PIM, make the user [eligible for Owner role assignment](/entra/id-governance/privileged-identity-management/pim-resource-roles-assign-roles).

1. [Remove Co-Administrator](#how-to-remove-a-co-administrator).

### Step 5: Convert Co-Administrators to Owner role

If a user must be an administrator for a subscription, assign the [Owner](built-in-roles.md#owner) role at subscription scope. 

- Follow the steps in [How to convert a Co-Administrator with Owner role](#how-to-convert-a-co-administrator-to-owner-role).

### How to convert a Co-Administrator to Owner role

The easiest way to covert a Co-Administrator role assignment to the [Owner](built-in-roles.md#owner) role at subscription scope is to use the **Remediate** steps.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open **Subscriptions** and select a subscription.

1. Select **Access control (IAM)**.

1. Select the **Classic administrators** tab to view a list of the Co-Administrators.

1. For the Co-Administrator you want to convert to the Owner role, under the **Remediate** column, select the **Assign RBAC role** link.

1. In the **Add role assignment** pane, review the role assignment.

    :::image type="content" source="./media/classic-administrators/remediate-assign-role.png" alt-text="Screenshot of Add role assignment pane after selecting Assign RBAC role link." lightbox="./media/classic-administrators/remediate-assign-role.png":::

1. Select **Review + assign** to assign the Owner role and remove the Co-Administrator role assignment.

### How to remove a Co-Administrator

Follow these steps to remove a Co-Administrator.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open **Subscriptions** and select a subscription.

1. Select **Access control (IAM)**.

1. Select the **Classic administrators** tab to view a list of the Co-Administrators.

1. Add a check mark next to the Co-Administrator you want to remove.

1. Select **Delete**.

1. In the message box that appears, select **Yes**.

    :::image type="content" source="./media/classic-administrators/remove-coadmin.png" alt-text="Screenshot of message box when removing a Co-Administrator." lightbox="./media/classic-administrators/remove-coadmin.png":::

## Service Administrator retirement

If you still have classic administrators, use the following steps to help you convert the Service Administrator role assignment. Before you remove the Service Administrator, you must have at least one user who is assigned the Owner role at subscription scope without conditions to avoid orphaning the subscription. A subscription Owner has the same access as the Service Administrator.

### Step 1: Review your current Service Administrator

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Use the Azure portal or Azure Resource Graph to [list your Service Administrator](#list-classic-administrators).

1. Review the [sign-in logs](/entra/identity/monitoring-health/concept-sign-ins) for your Service Administrator to assess whether they're an active user.

### Step 2: Review your current Billing account owners

The user that is assigned the Service Administrator role might also be the same user that is the administrator for your billing account. You should review your current Billing account owners to ensure they are still accurate.

1. Use the Azure portal to [get your Billing account owners](../cost-management-billing/manage/understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

1. Review your list of Billing account owners. If necessary, [update or add another Billing account owner](../cost-management-billing/manage/understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Step 3: Convert Service Administrator to Owner role

Your Service Administrator might be a Microsoft account or a Microsoft Entra account. A Microsoft account is a personal account such as Outlook, OneDrive, Xbox LIVE, or Microsoft 365. A Microsoft Entra account is an identity created through Microsoft Entra ID.

1. If Service Administrator user is a Microsoft account and you want this user to keep the same permissions, [convert the Service Administrator to Owner role](#how-to-convert-the-service-administrator-to-owner-role).

1. If Service Administrator user is a Microsoft Entra account and you want this user to keep the same permissions, [convert the Service Administrator to Owner role](#how-to-convert-the-service-administrator-to-owner-role).

1. If you want to change the Service Administrator user to a different user, [assign the Owner role](role-assignments-portal.yml) to this new user at subscription scope without conditions. Then, [remove the Service Administrator](#how-to-remove-the-service-administrator).

### How to convert the Service Administrator to Owner role

The easiest way to convert the Service Administrator role assignment to the [Owner](built-in-roles.md#owner) role at subscription scope is to use the **Remediate** steps.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open **Subscriptions** and select a subscription.

1. Select **Access control (IAM)**.

1. Select the **Classic administrators** tab to view the Service Administrator.

1. For the Service Administrator, under the **Remediate** column, select the **Assign RBAC role** link.

1. In the **Add role assignment** pane, review the role assignment.

    :::image type="content" source="./media/classic-administrators/remediate-assign-role.png" alt-text="Screenshot of Add role assignment pane after selecting Assign RBAC role link." lightbox="./media/classic-administrators/remediate-assign-role.png":::

1. Select **Review + assign** to assign the Owner role and remove the Service Administrator role assignment.

### How to remove the Service Administrator

> [!IMPORTANT]
> To remove the Service Administrator, you must have a user who is assigned the [Owner](built-in-roles.md#owner) role at subscription scope without conditions to avoid orphaning the subscription. A subscription Owner has the same access as the Service Administrator.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open **Subscriptions** and select a subscription.

1. Select **Access control (IAM)**.

1. Select the **Classic administrators** tab.

1. Add a check mark next to the Service Administrator.

1. Select **Delete**.

1. In the message box that appears, select **Yes**.

    :::image type="content" source="./media/classic-administrators/service-admin-remove.png" alt-text="Screenshot of remove classic administrator message when removing a Service Administrator." lightbox="./media/classic-administrators/service-admin-remove.png":::

## Next steps

- [Understand the different roles](../role-based-access-control/rbac-and-directory-admin-roles.md)
- [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml)
- [Understand Microsoft Customer Agreement administrative roles in Azure](../cost-management-billing/manage/understand-mca-roles.md)
