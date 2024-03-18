---
title: Azure classic subscription administrators
description: Describes how to prepare for the retirement of the Co-Administrator and Service Administrator roles and how to remove or change these role assignments.
author: rolyon
manager: amycolannino

ms.service: role-based-access-control
ms.topic: how-to
ms.date: 03/15/2024
ms.author: rolyon
ms.reviewer: bagovind
---

# Azure classic subscription administrators

> [!IMPORTANT]
> Classic resources and classic administrators will be [retired on August 31, 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Starting April 3, 2024, you won't be able to add new Co-Administrators. This date was recently extended. Remove unnecessary Co-Administrators and use Azure RBAC for fine-grained access control.

Microsoft recommends that you manage access to Azure resources using Azure role-based access control (Azure RBAC). However, if you're still using the classic deployment model, you'll need to use a classic subscription administrator role: Service Administrator and Co-Administrator. For information about how to migrate your resources from classic deployment to Resource Manager deployment, see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/management/deployment-models.md).

This article describes how to prepare for the retirement of the Co-Administrator and Service Administrator roles and how to remove or change these role assignments.

## Frequently asked questions

Will Co-Administrators and Service Administrator lose access after August 31, 2024?

- Starting on August 31, 2024, Microsoft will start the process to remove access for Co-Administrators and Service Administrator.

What is the equivalent Azure role I should assign for Co-Administrators?

- [Owner](built-in-roles.md#owner) role at subscription scope has the equivalent access. However, Owner is a [privileged administrator role](role-assignments-steps.md#privileged-administrator-roles) and grants full access to manage Azure resources. You should consider a job function role with fewer permissions, reduce the scope, or add a condition.

What is the equivalent Azure role I should assign for Service Administrator?

- [Owner](built-in-roles.md#owner) role at subscription scope has the equivalent access.

What should I do if I have a strong dependency on Co-Administrators or Service Administrator?

- Email ACARDeprecation@microsoft.com and describe your scenario.

## Prepare for Co-Administrators retirement

Use the following steps to help you prepare for the Co-Administrator role retirement.

### Step 1: Review your current Co-Administrators

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Use the Azure portal to [get a list of your Co-Administrators](#view-classic-administrators).

1. Review the [sign-in logs](/entra/identity/monitoring-health/concept-sign-ins) for your Co-Administrators to assess whether they're active users.

### Step 2: Remove Co-Administrators that no longer need access

1. If user is no longer in your enterprise, [remove Co-Administrator](#remove-a-co-administrator).

1. If user was deleted, but their Co-Administrator assignment wasn't removed, [remove Co-Administrator](#remove-a-co-administrator).

    Users that have been deleted typically include the text **(User was not found in this directory)**.

    :::image type="content" source="media/classic-administrators/user-not-found.png" alt-text="Screenshot of user not found in directory and with Co-Administrator role." lightbox="media/classic-administrators/user-not-found.png":::

1. After reviewing activity of user, if user is no longer active, [remove Co-Administrator](#remove-a-co-administrator).

### Step 3: Replace existing Co-Administrators with job function roles

Most users don't need the same permissions as a Co-Administrator. Consider a job function role instead.

1. If a user still needs some access, determine the appropriate [job function role](role-assignments-steps.md#job-function-roles) they need.

1. Determine the [scope](scope-overview.md) user needs.

1. Follow steps to [assign a job function role to user](role-assignments-portal.md).

1. [Remove Co-Administrator](#remove-a-co-administrator).

### Step 4: Replace existing Co-Administrators with Owner role and conditions

Some users might need more access than what a job function role can provide. If you must assign the [Owner](built-in-roles.md#owner) role, consider adding a condition to constrain the role assignment.

1. Assign the [Owner role at subscription scope with conditions](role-assignments-portal-subscription-admin.md) to the user.

1. [Remove Co-Administrator](#remove-a-co-administrator).

## Prepare for Service Administrator retirement

Use the following steps to help you prepare for Service Administrator role retirement. To remove the Service Administrator, you must have at least one user who is assigned the Owner role at subscription scope without conditions to avoid orphaning the subscription. A subscription Owner has the same access as the Service Administrator.

### Step 1: Review your current Service Administrator

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Use the Azure portal to [get your Service Administrator](#view-classic-administrators).

1. Review the [sign-in logs](/entra/identity/monitoring-health/concept-sign-ins) for your Service Administrator to assess whether they're an active user.

### Step 2: Review your current Billing account owners

The user that is assigned the Service Administrator role might also be the same user that is the administrator for your billing account. You should review your current Billing account owners to ensure they are still accurate.

1. Use the Azure portal to [get your Billing account owners](../cost-management-billing/manage/understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

1. Review your list of Billing account owners. If necessary, [update or add another Billing account owner](../cost-management-billing/manage/understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Step 3: Replace existing Service Administrator with Owner role

Your Service Administrator might be a Microsoft account or a Microsoft Entra account. A Microsoft account is a personal account such as Outlook, OneDrive, Xbox LIVE, or Microsoft 365. A Microsoft Entra account is an identity created through Microsoft Entra ID.

1. If Service Administrator user is a Microsoft account and you want this user to keep the same permissions, [assign the Owner role](role-assignments-portal.md) to this user at subscription scope without conditions.

1. If Service Administrator user is a Microsoft Entra account and you want this user to keep the same permissions, [assign the Owner role](role-assignments-portal.md) to this user at subscription scope without conditions.

1. If you want to change the Service Administrator user to a different user, [assign the Owner role](role-assignments-portal.md) to this new user at subscription scope without conditions.

1. [Remove the Service Administrator](#remove-the-service-administrator).

## View classic administrators

Follow these steps to view the Service Administrator and Co-Administrators for a subscription using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and select a subscription.

1. Select **Access control (IAM)**.

1. Select the **Classic administrators** tab to view a list of the Co-Administrators.

    :::image type="content" source="./media/shared/classic-administrators.png" alt-text="Screenshot of Access control (IAM) page with Classic administrators tab selected." lightbox="./media/shared/classic-administrators.png":::

## Remove a Co-Administrator

> [!IMPORTANT]
> Classic resources and classic administrators will be [retired on August 31, 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Starting April 3, 2024, you won't be able to add new Co-Administrators. This date was recently extended. Remove unnecessary Co-Administrators and use Azure RBAC for fine-grained access control.

Follow these steps to remove a Co-Administrator.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and select a subscription.

1. Select **Access control (IAM)**.

1. Select the **Classic administrators** tab to view a list of the Co-Administrators.

1. Add a check mark next to the Co-Administrator you want to remove.

1. Select **Remove**.

1. In the message box that appears, select **Yes**.

    :::image type="content" source="./media/classic-administrators/remove-coadmin.png" alt-text="Screenshot of message box when removing a Co-Administrator." lightbox="./media/classic-administrators/remove-coadmin.png":::

## Add a Co-Administrator

> [!IMPORTANT]
> Classic resources and classic administrators will be [retired on August 31, 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Starting April 3, 2024, you won't be able to add new Co-Administrators. This date was recently extended. Remove unnecessary Co-Administrators and use Azure RBAC for fine-grained access control.
> 
> You only need to add a Co-Administrator if the user needs to manage Azure classic deployments by using [Azure Service Management PowerShell Module](/powershell/azure/servicemanagement/install-azure-ps). If the user only uses the Azure portal to manage the classic resources, you won’t need to add the classic administrator for the user.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and select a subscription.

    Co-Administrators can only be assigned at the subscription scope.

1. Select **Access control (IAM)**.

1. Select the **Classic administrators** tab.

    :::image type="content" source="./media/shared/classic-administrators.png" alt-text="Screenshot of Access control (IAM) page with Classic administrators tab selected." lightbox="./media/shared/classic-administrators.png":::

1. Select **Add** > **Add co-administrator** to open the Add co-administrators pane.

    If the **Add co-administrator** option is disabled, you don't have permissions.

1. Select the user that you want to add and select **Add**.

    :::image type="content" source="./media/classic-administrators/add-coadmin.png" alt-text="Screenshot of Add co-administrator pane to add a Co-Administrator." lightbox="./media/classic-administrators/add-coadmin.png":::

## Add a guest user as a Co-Administrator

To add a guest user as a Co-Administrator, follow the same steps as in the previous [Add a Co-Administrator](#add-a-co-administrator) section. The guest user must meet the following criteria:

- The guest user must have a presence in your directory. This means that the user was invited to your directory and accepted the invite.

For more information, about how to add a guest user to your directory, see [Add Microsoft Entra B2B collaboration users in the Azure portal](../active-directory/external-identities/add-users-administrator.md).

Before you remove a guest user from your directory, you should first remove any role assignments for that guest user. For more information, see [Remove an external user from your directory](./role-assignments-external-users.md#remove-an-external-user-from-your-directory).

### Differences for guest users

Guest users that have been assigned the Co-Administrator role might see some differences as compared to member users with the Co-Administrator role. Consider the following scenario:

- User A with a Microsoft Entra account (work or school account) is the Service Administrator for an Azure subscription.
- User B has a Microsoft account.
- User A assigns the Co-Administrator role to user B.
- User B can do almost everything, but is unable to register applications or look up users in the Microsoft Entra directory.

You would expect that user B could manage everything. The reason for this difference is that the Microsoft account is added to the subscription as a guest user instead of a member user. Guest users have different default permissions in Microsoft Entra ID as compared to member users. For example, member users can read other users in Microsoft Entra ID and guest users cannot. Member users can register new service principals in Microsoft Entra ID and guest users cannot.

If a guest user needs to be able to perform these tasks, a possible solution is to assign the specific Microsoft Entra roles the guest user needs. For example, in the previous scenario, you could assign the [Directory Readers](../active-directory/roles/permissions-reference.md#directory-readers) role to read other users and assign the [Application Developer](../active-directory/roles/permissions-reference.md#application-developer) role to be able to create service principals. For more information about member and guest users and their permissions, see [What are the default user permissions in Microsoft Entra ID?](../active-directory/fundamentals/users-default-permissions.md). For more information about granting access for guest users, see [Assign Azure roles to external users using the Azure portal](role-assignments-external-users.md).

Note that the [Azure built-in roles](../role-based-access-control/built-in-roles.md) are different than the [Microsoft Entra roles](../active-directory/roles/permissions-reference.md). The built-in roles don't grant any access to Microsoft Entra ID. For more information, see [Understand the different roles](../role-based-access-control/rbac-and-directory-admin-roles.md).

For information that compares member users and guest users, see [What are the default user permissions in Microsoft Entra ID?](../active-directory/fundamentals/users-default-permissions.md).

## Change the Service Administrator

Only the Account Administrator can change the Service Administrator for a subscription. By default, when you sign up for an Azure subscription, the Service Administrator is the same as the Account Administrator.

The user with the Account Administrator role can access the Azure portal and manage billing, but they can't cancel subscriptions. The user with the Service Administrator role has full access to the Azure portal and they can cancel subscriptions. The Account Administrator can make themself the Service Administrator.

Follow these steps to change the Service Administrator in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Administrator.

1. Open **Cost Management + Billing** and select a subscription.

1. In the left navigation, select **Properties**.

1. Select **Change service admin**.

    :::image type="content" source="./media/classic-administrators/service-admin.png" alt-text="Screenshot of subscription properties page that shows option to change Service Administrator." lightbox="./media/classic-administrators/service-admin.png":::

1. In the **Edit service admin** page, enter the email address for the new Service Administrator.

    :::image type="content" source="./media/classic-administrators/service-admin-edit.png" alt-text="Screenshot of Edit service admin pane to change Service Administrator." lightbox="./media/classic-administrators/service-admin-edit.png":::

1. Select **OK** to save the change.

## Remove the Service Administrator

To remove the Service Administrator, you must have a user who is assigned the [Owner](built-in-roles.md#owner) role at subscription scope without conditions to avoid orphaning the subscription. A subscription Owner has the same access as the Service Administrator.

1. Sign in to the [Azure portal](https://portal.azure.com) as an [Owner](built-in-roles.md#owner) of a subscription.

1. Open [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and select a subscription.

1. Select **Access control (IAM)**.

1. Select the **Classic administrators** tab.

1. Add a check mark next to the Service Administrator.

1. Select **Remove**.

1. In the message box that appears, select **Yes**.

    :::image type="content" source="./media/classic-administrators/service-admin-remove.png" alt-text="Screenshot of remove classic administrator message when removing a Service Administrator." lightbox="./media/classic-administrators/service-admin-remove.png":::

## Next steps

- [Understand the different roles](../role-based-access-control/rbac-and-directory-admin-roles.md)
- [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md)
- [Understand Microsoft Customer Agreement administrative roles in Azure](../cost-management-billing/manage/understand-mca-roles.md)
