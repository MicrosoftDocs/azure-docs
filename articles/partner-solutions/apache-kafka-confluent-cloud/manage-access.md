---
title: Use Confluent Access Management in the Azure portal
titlesuffix: partner-solutions
description: This article describes how to use Confluent Access Management in the Azure portal to add, delete and manage users.
ms.service: partner-services
subservice: confluent
ms.topic: how-to
ms.date: 1/31/2024
# CustomerIntent: As an organization admin, I want to manage user permissions in Apache Kafka & Apache Flink on Confluent Cloud so that I can add, delete and manage users.
---

# How to manage user permissions in a Confluent organization

User access management is a feature that enables the organization admin to add, view and remove users and roles inside a Confluent organization. By managing user permissions, you can ensure that only authorized users can access and perform actions on your Confluent Cloud resources.

This guide presents step by step instructions to manage users and roles in Apache Kafka® & Apache Flink® on Confluent Cloud™ - An Azure Native ISV Service, via Azure portal.

The following actions are supported:

* Adding a user to a Confluent organization.
* Viewing a user's role permissions in a Confluent organization.
* Adding or removing role permissions assigned to a user in a Confluent organization.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* An existing Confluent organization.
* Required permission: Azure subscription Owner, or subscription Contributor with minimum permission AccountAdmin in the Confluent Organization.

## Add a user to a Confluent organization

Follow the steps below to add a user to a Confluent organization.

1. Open your Confluent organization in the Azure portal and select **Confluent Account and Access** from the left menu. The page shows a list of users who currently belong to this Confluent organization. The same list is visible under **Accounts & access** in the Confluent portal.

    :::image type="content" source="media/manage-access/account-and-access.png" alt-text="Screenshot of the Azure platform showing the Confluent Account and Access menu.":::

   > [!TIP]
   > If you get the error "You do not have enough permissions on the organization to perform this operation", make sure that you have the required permissions. You must be a subscription Owner or Contributor.

1. Select **Add User**. A new pane opens with a list of users who belong to your tenant.

    :::image type="content" source="media/manage-access/add-user.png" alt-text="Screenshot of the Azure platform showing the Add user option.":::

1. Select the user you want to add and select **Add User**.

    :::image type="content" source="media/manage-access/select-user-to-add.png"alt-text="Screenshot of the Azure platform showing choosing a user to add.":::

1. A notification indicates that the user has been added. The newly added user is listed in the Confluent Account and Access page and in the Confluent portal.

## View a user's permissions

Review permissions assigned to a user in their Confluent resource.

1. The Confluent Account and Access page shows the list of users in your current Confluent organization. Select **Manage Permissions** on the right end of the user you want to see the permissions for.
1. A pane opens, showing permissions. It shows that the newly added user doesn't have any permission in this Confluent organization yet. Optionally select the chevron next to the organization to expand into user permissions view for all environments and clusters.

    :::image type="content" source="media/manage-access/view-roles.png"alt-text="Screenshot of the Azure platform showing roles attributed to a user.":::

## Assign a permission to a user

Give the new user some permissions in your Confluent organization.

1. In your Confluent organization, select **Confluent Account and Access** from the left menu and select **Manage Permissions** on the right end of the user you want to assign a permission to.
1. Select **Add Role** to get a list of role permissions available.  

    :::image type="content" source="media/manage-access/add-role.png"alt-text="Screenshot of the Azure platform showing the Add Role option.":::

1. Check the list of role permissions available, select the one you want to assign to the user, then select **Add Role**.

    :::image type="content" source="media/manage-access/select-role.png"alt-text="Screenshot of the Azure platform showing how to assign a role to a user.":::

1. A notification indicates that the new user role has been added. The list of assigned roles for the user is updated with the newly added role.

## Remove a user's permissions

Remove a permission assigned to a user in the Confluent organization.

1. In your Confluent organization, select **Confluent Account and Access** from the left menu and select **Manage Permissions** on the right end of the user whose permission you want to remove.
1. In **Manage Permissions**, select **Remove Role**.

    :::image type="content" source="media/manage-access/remove-role.png"alt-text="Screenshot of the Azure platform showing selecting a Confluent organization role to remove.":::

1. Under **Enter Role Name to be removed**, enter the name of the role you want to remove. Optionally select the copy icon next to the name of the role to copy and then paste it in the text box. Select **Remove Role**.
  
    :::image type="content" source="media/manage-access/confirm-role-removal.png"alt-text="Screenshot of the Azure platform showing confirmation of Confluent organization role removal.":::

1. The role is removed and you see the refreshed roles.

## Related content

* For help with troubleshooting, see [Troubleshooting Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md).
* If you need to contact support, see [Get support for Confluent Cloud resource](get-support.md).
* To learn more about managing Confluent Cloud, go to [Manage the Confluent Cloud resource](manage.md).
