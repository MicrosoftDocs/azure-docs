---
title: Use Confluent Access Management in the Azure Portal
titlesuffix: partner-solutions
description: Learn how to use Confluent access management in the Azure portal to add, delete, and manage users and user permissions in a Confluent organization.
ms.service: partner-services
subservice: confluent
ms.topic: how-to
ms.date: 09/19/2025

#customer intent: As an organization admin, I want to learn how to manage user permissions in Apache Kafka & Apache Flink on Confluent Cloud so that I can add, delete, and manage users in my organization.
---

# Manage users and user permissions in a Confluent organization

An organization admin can add, view, and remove users and roles inside a Confluent organization in the Azure portal. By managing user permissions, you can ensure that only authorized users can access and complete actions on your Confluent Cloud resources on Azure.

Complete the steps described in the next sections to manage users and roles in Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service.

You can complete these actions in the Azure portal:

* Add a user to your Confluent organization.
* View a user's role permissions in your Confluent organization.
* Add or remove role permissions assigned to a user in your Confluent organization.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* A Confluent organization.
* The Owner or Contributor role for the Azure subscription.
* At least AccountAdmin permissions for your Confluent organization.

## Add a user

To add a user to a Confluent organization:

1. In the Azure portal, go to your Confluent organization.
1. In the left pane, under **Confluent entity management**, select **Account and Access**. A list of users who belong to the Confluent organization appears.

   :::image type="content" source="media/manage-access/account-and-access.png" alt-text="Screenshot that shows the Confluent Account and Access menu in the Azure portal." lightbox="media/manage-access/account-and-access.png":::

   > [!TIP]
   > If the error message "You do not have enough permissions on the organization to perform this operation" appears, make sure that you have the required permissions. You must be assigned the Owner or Contributor role for the Azure subscription.

1. Select **Add User**.

    :::image type="content" source="media/manage-access/add-user.png" alt-text="Screenshot that shows the Add user option in the Azure portal." lightbox="media/manage-access/add-user.png":::

1. In **Add New User**, select the user to add, and then select **Add User**.

    :::image type="content" source="media/manage-access/select-user-to-add.png" alt-text="Screenshot that the Add New User page in the Azure portal." lightbox="media/manage-access/select-user-to-add.png":::

A notification indicates that the user is added. The newly added user is listed on the **Confluent Account and Access** page and in the Confluent portal.

## View a user's permissions

To review the permissions assigned to a user for a Confluent resource:

1. In the Azure portal, go to the **Confluent Account and Access** page to view the list of users in your Confluent organization.
1. To the right of the user whose permissions you want to view, select **Manage Permissions**.
1. View the user permissions in the pane that opens. A newly added user doesn't have any permission in the Confluent organization yet.

Optionally, you can select the chevron (**>**) next to the organization to expand user permissions for all environments and clusters in your Confluent organization.

:::image type="content" source="media/manage-access/view-roles.png" alt-text="Screenshot that shows roles attributed to a user in a Confluent organization in the Azure portal." lightbox="media/manage-access/view-roles.png":::

## Assign a permission to a user

To grant a new user permission in your Confluent organization:

1. In the Azure portal, go to the **Confluent Account and Access** page to view the list of users in your Confluent organization.
1. To the right of the user you want to assign permissions to, select **Manage Permissions**.
1. Select **Add Role** to get a list of available role permissions.  

    :::image type="content" source="media/manage-access/add-role.png" alt-text="Screenshot that shows the Add Role option in the Azure portal." lightbox="media/manage-access/add-role.png":::

1. Select the role you want to assign to the user, and then select **Add Role**.

    :::image type="content" source="media/manage-access/select-role.png" alt-text="Screenshot that shows how to assign a role to a user in the Azure portal." lightbox="media/manage-access/select-role.png":::

A notification indicates that the new user role is added. The list of assigned roles for the user is updated to include the newly added role.

## Remove a user's permission

To remove a permission assigned to a user in a Confluent organization:

1. In the Azure portal, go to the **Account and Access** page to view the list of users in your Confluent organization.
1. To the right of the user, select **Manage Permissions**.
1. In **Manage Permissions**, select **Remove Role**.

    :::image type="content" source="media/manage-access/remove-role.png" alt-text="Screenshot that shows the Remove Role option in the Azure portal." lightbox="media/manage-access/remove-role.png":::

1. Under **Enter Role Name to be removed**, enter the name of the role you want to remove.

    Optionally, you can select the copy icon next to the name of the role to copy the role name. Paste the role name in the text box. Select **Remove Role**.
  
    :::image type="content" source="media/manage-access/confirm-role-removal.png" alt-text="Screenshot that shows how to remove a role in the Azure portal." lightbox="media/manage-access/confirm-role-removal.png":::

The role is removed and the list of role assignments is updated.

## Related content

* [Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md)
* [Get support for Confluent Cloud resources](get-support.md)
* [Manage your Confluent Cloud resource](manage.md)
