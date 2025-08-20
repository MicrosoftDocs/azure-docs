---
title: Manage a Neon Resource Through the Azure Portal
description: This article describes management functions for Neon in the Azure portal.
author: ProfessorKendrick
ms.topic: how-to
ms.date: 05/06/2025
---

# Manage your Neon integration through the Azure portal

This article describes how to manage a Neon resource in the Azure portal.

## Resource overview

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="Screenshot of a Neon resource overview in the Azure portal." lightbox="media/manage/resource-overview.png":::

The details under **Essentials** include:

- Resource group
- Location
- Subscription
- Subscription ID
- Tags
- Portal URL
- Resource ID
- Status
- Subscribed plan

To manage your resource, select the links next to the corresponding details.

Below the essentials, you can go to other details about your resource by selecting the links.

## Access a Neon account

To access your Neon account, select **Neon Console** on the working pane.

:::image type="content" source="media/manage/set-password.png" alt-text="Screenshot of a Neon resource overview in the Azure portal. The Neon Console link is emphasized.":::

If you don't have a Neon account for your Azure email address, you're prompted to configure your account and set a password.

## View and create projects

When you create your first Neon organization, a default project is created for you. You can view and create your projects from the resource overview.

### View projects

To view your projects, select **Projects** in the sidebar.

To view a specific project, select the project's name.

### Create a project

1. On the menu bar, select **+ Create Project**.

    The **Create Project** pane appears.

    :::image type="content" source="media/manage/create-project.png" alt-text="Screenshot of the pane for creating a Neon project in the Azure portal.":::

1. Enter the values for each setting, or continue with the default values for your project.

    |Setting              |Action                                                             |
    |-------------------|-------------------------------------------------------------------|
    |**Project name**       |Specify a name for your Neon project.                              |
    |**Postgres version**   |Choose a Postgres version for your project.                        |
    |**Database name**      |Specify a name for your first database in the project.             |
    |**Project region**     |Choose the region for your database.                               |

    > [!NOTE]
    > The **Project region** value on this pane corresponds to your database. Don't confuse this value with the **Region** value from the **Basics** tab, which is where your Azure resource is deployed.

1. Select **Create**.

### Add a branch to a project

A branch is a copy-on-write clone of your data. You can create a branch from a current or past state.

Each Neon project is created with a root branch called **main**. The first branch that you create is branched from the project's root branch. Subsequent branches can branch off the root branch or from a previously created branch.

To create a branch:

1. Open the project.

1. On the menu bar, select **+ Create Branch**.

    The **Create new Branch** pane appears.

    :::image type="content" source="media/manage/create-branch.png" alt-text="Screenshot of the button for creating a branch and the pane for creating a branch.":::

1. Enter the values for each setting.

1. Select **Create**.

### Connect to a database

You can connect clients and applications to a Neon database via a connection string.

To generate a connection string:

1. Open your project or branch.

1. On the menu bar, select **Connect to database**.

1. Verify the default values, or select new values in each dropdown list.

1. Select the copy icon next to the connection string.

    :::image type="content" source="media/manage/connect.png" alt-text="Screenshot of the options for connecting to a database, with the copy icon emphasized.":::

## Delete a resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

## Get Support

Contact [Neon](https://neon.tech/docs/introduction/support) for customer support. 

You can also request support in the Azure portal from the [resource overview](#resource-overview).  

Select **Support + Troubleshooting** > **New support request** from the service menu, then choose the link to [log a support request in the Neon portal](https://neon.tech/docs/introduction/support). 

## Related content

- [Neon Serverless Postgres developer resources and tools](tools.md)
