---
title: 'Quickstart: Create a management group with portal'
description: In this quickstart, you use Azure portal to create a management group to organize your resources into a resource hierarchy.
ms.date: 02/05/2021
ms.topic: quickstart
ms.custom:
  - mode-portal
---
# Quickstart: Create a management group

Management groups are containers that help you manage access, policy, and compliance across multiple
subscriptions. Create these containers to build an effective and efficient hierarchy that can be
used with [Azure Policy](../policy/overview.md) and [Azure Role Based Access
Controls](../../role-based-access-control/overview.md). For more information on management groups,
see [Organize your resources with Azure management groups](overview.md).

The first management group created in the directory could take up to 15 minutes to complete. There
are processes that run the first time to set up the management groups service within Azure for your
directory. You receive a notification when the process is complete. For more information, see
[initial setup of management groups](./overview.md#initial-setup-of-management-groups).

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- Any Azure AD user in the tenant can create a management group without the management group write
  permission assigned to that user if
  [hierarchy protection](./how-to/protect-resource-hierarchy.md#setting---require-authorization)
  isn't enabled. This new management group becomes a child of the Root Management Group or the
  [default management group](./how-to/protect-resource-hierarchy.md#setting---default-management-group)
  and the creator is given an "Owner" role assignment. Management group service allows this ability
  so that role assignments aren't needed at the root level. No users have access to the Root
  Management Group when it's created. To avoid the hurdle of finding the Azure AD Global Admins to
  start using management groups, we allow the creation of the initial management groups at the root
  level.

### Create in portal

1. Log into the [Azure portal](https://portal.azure.com).

1. Select **All services** > **Management + governance**.

1. Select **Management Groups**.

1. Select **+ Add management group**.

   :::image type="content" source="./media/main.png" alt-text="Screenshot of the Management groups page showing child management groups and subscriptions.":::

1. Leave **Create new** selected and fill in the management group ID field.

   - The **Management Group ID** is the directory unique identifier that is used to submit commands
     on this management group. This identifier isn't editable after creation as it's used throughout
     the Azure system to identify this group. The
     [root management group](./overview.md#root-management-group-for-each-directory) is
     automatically created with an ID that is the Azure Active Directory ID. For all other
     management groups, assign a unique ID.
   - The display name field is the name that is displayed within the Azure portal. A separate
     display name is an optional field when creating the management group and can be changed at any time.

   :::image type="content" source="./media/create_context_menu.png" alt-text="Screenshot of the 'Add management group' options for creating a new management group.":::

1. Select **Save**.

## Clean up resources

To remove the management group created, follow these steps:

1. Select **All services** > **Management + governance**.

1. Select **Management Groups**.

1. Find the management group created above, select it, then select **Details** next to the name.
   Then select **Delete** and confirm the prompt.

## Next steps

In this quickstart, you created a management group to organize your resource hierarchy. The
management group can hold subscriptions or other management groups.

To learn more about management groups and how to manage your resource hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with management groups](./manage.md)
