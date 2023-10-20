---
title: Add users to a dynamic group - tutorial
description: In this tutorial, you use groups with user membership rules to add or remove users automatically
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: tutorial
ms.date: 09/08/2023
ms.author: barclayn
ms.reviewer: krbain
ms.custom: "it-pro;seo-update-azuread-jan"
#Customer intent: As a new Microsoft Entra identity administrator, I want to automatically add or remove users, so I don't have to manually do it."
ms.collection: M365-identity-device-management
---

# Tutorial: Add or remove group members automatically

In Microsoft Entra ID, part of Microsoft Entra, you can automatically add or remove users to security groups or Microsoft 365 groups, so you don't always have to do it manually. Whenever any properties of a user or device change, Microsoft Entra ID evaluates all dynamic group rules in your Microsoft Entra organization to see if the change should add or remove members.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create an automatically populated group of guest users from a partner company
> * Assign licenses to the group for the partner-specific features for guest users to access
> * Bonus: secure the **All users** group by removing guest users so that, for example, you can give your member users access to internal-only sites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

This feature requires one Microsoft Entra ID P1 or P2 license for you as the global administrator of the organization. If you don't have one, in Microsoft Entra ID, select **Licenses** > **Products** > **Try/Buy**.

You're not required to assign licenses to the users for them to be members in dynamic groups. You only need the minimum number of available Microsoft Entra ID P1 licenses in the organization to cover all such users. 

## Create a group of guest users

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

First, you'll create a group for your guest users who all are from a single partner company. They need special licensing, so it's often more efficient to create a group for this purpose.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Administrator](../roles/permissions-reference.md#global-administrator).
1. Select Microsoft Entra ID.
2. Select **Groups** > **All groups** > **New group**.
   ![select command to start a new group](./media/groups-dynamic-tutorial/new-group.png)
3. On the **Group** blade:
  
   * Select **Security** as the group type.
   * Enter `Guest users Contoso` as the name and description for the group.
   * Change **Membership type** to **Dynamic User**.
   
4. Select **Owners** and in the **Add Owners** blade search for any desired owners. Click on the desired owners to add to the selection.
5. Click **Select** to close the **Add Owners** blade.  
6. Select **Edit dynamic query** in the **Dynamic user members** box.
7. On the **Dynamic membership rules** blade:

   * In the **Property** field, click on the existing value and select **userType**. 
   * Verify that the **Operator** field has **Equals** selected.  
   * Select the **Value** field and enter **Guest**. 
   * Click the **Add Expression** hyperlink to add another line.
   * In the **And/Or** field, select **And**.
   * In the **Property** field, select **companyName**.
   * Verify that the **Operator** field has **Equals** selected.
   * In the **Value** field, enter **Contoso**.
   * Click **Save** to close the **Dynamic membership rules** blade.
   
8. On the **Group** blade, select **Create** to create the group.

## Assign licenses

Now that you have your new group, you can apply the licenses that these partner users need.

1. In the Microsoft Entra admin center browse to **Identity** > **Billing** > **Licenses** > **All products**, select one or more licenses, and then select **Assign**.
2. Select **Users and groups**, and select the **Guest users Contoso** group, and save your changes.
3. **Assignment options** allow you to turn on or off the service plans included the licenses that you selected. When you make a change, be sure to click **OK** to save your changes.
4. To complete the assignment, on the **Assign license** pane, click **Assign** at the bottom of the pane.

## Remove guests from All users group

Perhaps your ultimate administrative plan is to assign all of your guest users to their own groups by company. You can also now change the **All users** group so that it is reserved for only members users in your organization. Then you can use it to assign apps and licenses that are specific to your home organization.

   ![Change All users group to members only](./media/groups-dynamic-tutorial/all-users-edit.png)

## Clean up resources

### To remove the guest users group

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Groups Administrator](../roles/permissions-reference.md#groups-administrator).
1. Browse to **Groups** > **All groups**. 
1. Select the **Guest users Contoso** group, select the ellipsis (...), and then select **Delete**. When you delete the group, any assigned licenses are removed.

### To restore the All Users group

1. Select **Identity** > **Groups** > **All groups**. Select the name of the **All users** group to open the group.
1. Select **Dynamic membership rules**, clear all the text in the rule, and select **Save**.

## Next steps

In this tutorial, you learned how to:
> [!div class="checklist"]
> * Create a group of guest users
> * Assign licenses to your new group
> * Change All users group to members only

Advance to the next article to learn more group-based licensing basics
> [!div class="nextstepaction"]
> [Group licensing basics](../fundamentals/concept-group-based-licensing.md)
