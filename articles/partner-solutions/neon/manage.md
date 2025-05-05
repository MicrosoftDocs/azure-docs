---
title: Manage a Neon resource through the Azure portal
description: This article describes management functions for Neon on the Azure portal.
author: ProfessorKendrick
ms.topic: how-to
ms.date: 04/23/2025
---

# Manage your Neon integration through the portal

This article describes how to manage the settings for Neon for Azure.

## Resource overview

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of a Pure Storage resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

The *Essentials* details include:

- Resource group
- Location
- Subscription
- Subscription ID
- Tags

To manage your resource, select the links next to corresponding details.

Below the essentials, you can navigate to other details about your resource by selecting the links.
 
## Projects

When you create your first Neon organization, a default project is created for you. You can create and view your projects from the Azure resource.

### View projects

To view your projects, Choose the projects tab from the menu.

To view a specific project, select the project's name.

### Add a branch to a project

A branch is a copy-on-write clone of your data.  You can create a branch from a current or past state.  Each Neon project is created with a root branch called main.  The first branch that you create is branched from the project's root branch.  Subsequent branches can branch off the root branch or from a previously created branch.

1. To create a new branch, open your project and select **+ Create new Branch** from the menu bar in the working pane.

    The **Create new Branch** flyout appears in the right side of the working pane.

1. Enter the values for each setting.

    |Field              |Action                                                             |
    |-------------------|-------------------------------------------------------------------|
    |Branch name        |Specify a name for your Branch.                                    |
    |Parent branch      |Select the parent branch for your new branch.                      |

1. Select the **Create** button.

### Create a new project

1. From the menu bar in the working pane, select **+ Create project**.

    The **Create project** flyout appears in the right side of the working pane.

    :::image type="content" source="media/manage/create-project.png" alt-text="":::

1. Enter the values for each setting, or continue with the default values for your project.

    |Field              |Action                                                             |
    |-------------------|-------------------------------------------------------------------|
    |Project name       |Specify a name for your Neon project.                              |
    |Postgres version   |Choose a Postgres version for your project.                        |
    |Database name      |Specify a name for your first database in the project.             |
    |Project region     |Choose the region for your database.                               |

    > [!NOTE]
    > The *Project region* in this tab corresponds to your database. 
    > Don't confuse this value with the *Region* from the Basics tab, which is where your Azure resource is deployed.

1. Select the **Create** button.

## Single sign-on

Single sign-on (SSO) is already enabled when you create your Neon resource.

[!INCLUDE [sso](../includes/sso.md)]

> [!NOTE] 
> The first time you access this URL, depending on your Azure tenant settings, you might be asked to verify your email address on the Neon portal. Once the email address is verified, you can access the Neon portal.

## Delete a Neon resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

## Related content

[Neon Serverless Postgres developer resources and tools](tools.md)
