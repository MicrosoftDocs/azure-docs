---
title: "Quickstart: Create a Neon Serverless Postgres Resource"
description: Learn how to create a resource for Neon Serverless Postgres by using the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: quickstart
ms.date: 05/06/2025
---
# Quickstart: Create a Neon Serverless Postgres resource

This quickstart shows you how to create a Neon Serverless Postgres resource by using the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]

- You must [subscribe to Neon](overview.md#subscribe-to-neon).

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The **Basics** tab has sections for details about the project, the Azure resource, and the Neon organization. Red asterisks identify required settings.

:::image type="content" source="media/create/basics-tab.png" alt-text="Screenshot of the Azure portal that shows the Basics tab to create a new Neon resource.":::

1. Under **Project details**, enter these values:

    |Setting              |Action                                                          |
    |-------------------|----------------------------------------------------------------|
    |**Subscription**       |Select a subscription from your existing subscriptions.         |
    |**Resource group**     |Use an existing resource group or create a new one.             |

1. Under **Azure Resource details**, enter these values:

    |Setting             |Action                                            |
    |------------------|--------------------------------------------------|
    |**Resource name**     |Specify a unique name for the resource.           |
    |**Region**            |Select a region to deploy your resource.          |

1. Under **New Organization details**, enter these values:

    |Setting            |Action                                                               |
    |-----------------|---------------------------------------------------------------------|
    |**Organization name**     |Specify a name for the organization.                                 |
    |**Plan**             |Select the **Change Plan** link and choose the plan that you want.        |

    The remaining settings update themselves to reflect the details of the plan that you selected for this new organization.

1. Select **Next**.

### Project tab

In Neon, everything starts with a project: the top-level object in the Neon object hierarchy. When you create a project, a default branch and database are automatically created for your project to help you get started.

:::image type="content" source="media/create/project-tab.png" alt-text="Screenshot of the Azure portal that shows the Project tab for a Neon resource.":::

On the **Project** tab, enter the values for each setting, or continue with the default values for your project.

|Setting              |Action                                                             |
|-------------------|-------------------------------------------------------------------|
|**Project name**       |Specify a name for your Neon project.                              |
|**Postgres version**   |Choose a Postgres version for your project.                        |
|**Database name**      |Specify a name for your first database in the project.             |
|**Project region**     |Choose the region for your database.                               |

> [!NOTE]
> The **Project region** value on this pane corresponds to your database. Don't confuse this value with the **Region** value from the **Basics** tab, which is where your Azure resource is deployed.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage your resource](manage.md)
