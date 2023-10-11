---
title: Assign or remove licenses
description: Instructions about how to assign or remove Microsoft Entra ID licenses from your users or groups.
services: active-directory
author: barclayn
manager: amycolannino
ms.assetid: f8b932bc-8b4f-42b5-a2d3-f2c076234a78
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
ms.date: 09/12/2023
ms.author: barclayn
ms.reviewer: jeffsta
---

# Assign or remove licenses in the Azure portal

Many Microsoft Entra services require you to license each of your users or groups (and associated members) for that service. Only users with active licenses will be able to access and use the licensed Microsoft Entra services for which that's true. Licenses are applied per tenant and don't transfer to other tenants. 

## Available license plans

There are several Microsoft Entra ID license plans:

- Microsoft Entra ID Free

- Microsoft Entra ID P1

- Microsoft Entra ID P2

For specific information about each license plan and the associated licensing details, see [What license do I need?](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing). To sign up for Microsoft Entra ID P1 or P2 license plans see [here](./get-started-premium.md).

Not all Microsoft services are available in all locations. Before a license can be assigned to a group, you must specify the **Usage location** for all members. You can set this value in **Identity** > **Users** > **All users** > *select a user* > **Properties**. When assigning licenses to a group or bulk updates such as disabling the synchronization status for the organization, any user whose usage location isn't specified inherits the location of the tenant.

## View license plans and plan details

You can view your available service plans, including the individual licenses, check pending expiration dates, and view the number of available assignments.

### To find your service plan and plan details

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Directory Reader](../roles/permissions-reference.md#directory-readers).

1. Browse to **Identity** > **Billing** > **Licenses**.

1. Select **All products** to view the All Products page and to see the **Total**, **Assigned**, **Available**, and **Expiring soon** numbers for your license plans.

    :::image type="content" source="media/license-users-groups/license-products-blade-with-products.png" alt-text="services page - with service license plans - associated license info":::

    > [!NOTE]
    > The numbers are defined as: 
    > - Total: Total number of licenses purchased
    > - Assigned: Number of licenses assigned to users
    > - Available: Number of licenses available for assignment including expiring soon
    > - Expiring soon: Number of licenses expiring soon

1. Select a plan name to see its licensed users and groups.

## Assign licenses to users or groups

Anyone who has a business need to use a licensed Microsoft Entra service must have the required licenses. You can add licensing rights to users or to an entire group.

### To assign a license to a user

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [License Administrator](../roles/permissions-reference.md#license-administrator).

1. Browse to **Identity** > **Billing** > **Licenses**.

1. Select the name of the license plan you want to assign to the user.

1. After you select the license plan, select **Assign**.

    ![services page, with highlighted license plan selection and Assign options](media/license-users-groups/license-products-blade-with-assign-option-highlight.png)

1. On the **Assign** page, select **Users and groups**, and then search for and select the user you're assigning the license.

    ![Assign license page, with highlighted search and Select options](media/license-users-groups/assign-license-blade-with-highlight.png)

1. Select **Assignment options**, make sure you have the appropriate license options turned on, and then select **OK**.

    ![License option page, with all options available in the license plan](media/license-users-groups/license-option-blade-assignments.png)

    The **Assign license** page updates to show that a user is selected and that the assignments are configured.

    > [!NOTE]
    > Not all Microsoft services are available in all locations. Before a license can be assigned to a user, you must specify the **Usage location**. You can set this value in **Identity** > **Users** > **All users** > *select a user* > **Properties**. When assigning licenses to a group or bulk updates such as disabling the synchronization status for the organization, any user whose usage location isn't specified inherits the location of the tenant.

1. Select **Assign**.

    The user is added to the list of licensed users and has access to the included Microsoft Entra services.
    > [!NOTE]
    > Licenses can also be assigned directly to a user from the user's **Licenses** page. If a user has a license assigned through a group membership and you want to assign the same license to the user directly, it can be done only from the **Products** page mentioned in step 1 only.

### To assign a license to a group

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [License Administrator](../roles/permissions-reference.md#license-administrator).

1. Browse to **Identity** > **Billing** > **Licenses**.

1. Select the name of the license plan you want to assign to the group.

    ![Products blade, with highlighted product license plan](media/license-users-groups/license-products-blade-with-product-highlight.png)

1. On the **Product** page, select **Assign**.

    ![Products page, with highlighted Assign option](media/license-users-groups/license-products-blade-with-assign-option-highlight.png)

1. On the **Assign** page, select **Users and groups**, and then search for and select the group you're assigning the license.

    ![Assign license page, with highlighted search and Select options 2](media/license-users-groups/assign-group-license-blade-with-highlight.png)

1. Select **Assignment options**, make sure you have the appropriate license options turned on, and then select **OK**.

    ![License option page, with all options available in the license plan 2](media/license-users-groups/license-option-blade-group-assignments.png)

    The **Assign license** page updates to show that a user is selected and that the assignments are configured.

1. Select **Assign**.

    The group is added to the list of licensed groups and all of the members have access to the included Microsoft Entra services.

## Remove a license

You can remove a license from a user's Microsoft Entra user page, from the group overview page for a group assignment, or starting from the Microsoft Entra ID **Licenses** page to see the users and groups for a license.

### To remove a license from a user

1. On the **Licensed users** page for the service plan, select the user that should no longer have the license. For example, *Alain Charon*.

1. Select **Remove license**.

    ![Licensed users page with Remove license option highlighted](media/license-users-groups/license-products-user-blade-with-remove-option-highlight.png)

> [!IMPORTANT]
> Licenses that a user inherits from a group can't be removed directly. Instead, you have to remove the user from the group from which they're inheriting the license.

### To remove a license from a group

1. On the **Licensed groups** page for the license plan, select the group that should no longer have the license.

1. Select **Remove license**.

    ![Licensed groups page with Remove license option highlighted 2](media/license-users-groups/license-products-group-blade-with-remove-option-highlight.png)
    
    > [!NOTE]
    > When an on-premises user account synced to Microsoft Entra falls out of scope for the sync or when the sync is removed, the user is soft-deleted in Microsoft Entra ID. When this occurs, licenses assigned to the user directly or via group-based licensing will be marked as **suspended** rather than **deleted**.

## Next steps

After you've assigned your licenses, you can perform the following processes:

- [Identify and resolve license assignment problems](../enterprise-users/licensing-groups-resolve-problems.md)

- [Add licensed users to a group for licensing](../enterprise-users/licensing-groups-migrate-users.md)

- [Scenarios, limitations, and known issues using groups to manage licensing in Microsoft Entra ID](../enterprise-users/licensing-group-advanced.md)

- [Add or change profile information](./how-to-manage-user-profile-info.md)
