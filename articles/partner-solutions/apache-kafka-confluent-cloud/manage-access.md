---
title: Use Confluent Access Management in the Azure portal
titlesuffix: partner-solutions
description: This article describes how to use Confluent Access Management in the Azure portal to add, delete and manage users.
ms.service: partner-services
subservice: confluent
ms.topic: how-to
ms.date: 11/27/2023
# CustomerIntent: As an organization admin, I want to manage user permissions in Apache Kafka on Confluent Cloud so that I can add, delete and manage users.
---

# How to manage user permissions in a Confluent organization

This guide presents step by step instructions to manage user permissions in Apache Kafka on Confluent Cloud, in the Azure portal. User access management enables the organization admin to add, view and remove users and roles inside a Confluent organization.

The following actions are supported:

* Adding a user to the Confluent Organization
* Viewing role permissions for a user.
* Adding or removing role permissions for a user.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* An existing Confluent organization.
* Required permission: Subscription Owner or Contributor.

## Add users to a Confluent Organization

Follow the steps below to add users to a Confluent Organization.

1. In your Confluent Organization in the Azure portal, select **Confluent Account and Access** from the left menu. The page shows a list of users who currently belong to this Confluent organization. The same list is visible under **Accounts & access** in the Confluent portal.

    :::image type="content" source="media/manage-access/account-and-access.png" alt-text="Screenshot of the Azure platform showing the Confluent Account and Access menu.":::

1. Select **Add User**. A new blade opens with a list of users who belong to your tenant.

    :::image type="content" source="media/manage-access/add-user.png" alt-text="Screenshot of the Azure platform showing the Add user option.":::

1. Select the user you want to add and select **Add User**.

    :::image type="content" source="media/manage-access/select-user-to-add.png"alt-text="Screenshot of the Azure platform showing choosing a user to add.":::

1. A notification appears, stating that the user has been added. The newly added user is listed in **Confluent Account and Access** and in the Confluent portal.

## View role permissions for a user

Review permissions assigned to a user.

1. The Confluent Account and Access page shows the list of users in your current Confluent organization. Open the context menu on the right end of the user you want to see the permissions for and select **Manage Permissions**.
1. A page opens, showing permissions. It shows that the newly added user doesn't have any permission in this Confluent organization yet. Optionally select the chevron next to the organization to expand into user permissions view for all environments and clusters.

    :::image type="content" source="media/manage-access/view-roles.png"alt-text="Screenshot of the Azure platform showing roles attributed to a user.":::

## Assign a role permissions to a user in Confluent Organization

Give the new user some permissions in your Confluent Organization.

1. Select **Add Role** to get a list of role permissions available.  

    :::image type="content" source="media/manage-access/add-role.png"alt-text="Screenshot of the Azure platform showing the Add Role option.":::

1. Check the list of role permissions available, select the one you want to assign to the user, then select **Add Role**.

    :::image type="content" source="media/manage-access/select-role.png"alt-text="Screenshot of the Azure platform showing how to assign a role to a user.":::

1. A notification indicates that the new user role has been added. The list of assigned roles for the user is updated with the newly added role.

## Remove Role permissions for a user in Confluent Organization 

Remove a permission assigned to a user. 

1. In **Manage Permissions**, select **Remove Role**.

    :::image type="content" source="media/manage-access/remove-role.png"alt-text="Screenshot of the Azure platform showing selecting a Confluent organization role to remove.":::

1. Under **Enter Role Name to be removed**, enter the name of the role you want to remove. Optionally select the copy icon next to the name of the role to copy and then paste it in the text box. Select **Remove Role**.
  
    :::image type="content" source="media/manage-access/confirm-role-removal.png"alt-text="Screenshot of the Azure platform showing selecting a Confluent organization role to remove.":::

1. The role has now been removed and you see the refreshed roles.

## Next steps

* For help with troubleshooting, see [Troubleshooting Apache Kafka on Confluent Cloud solutions](troubleshoot.md).
* If you need to contact support, see [Get support for Confluent Cloud resource](get-support.md).
* To learn more about managing Confluent Cloud, go to [Manage the Confluent Cloud resource](manage.md).