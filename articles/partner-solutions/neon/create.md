---
title: "Quickstart: Create a  Neon Serverless Postgres resource"
description: Learn how to create a resource for  Neon Serverless Postgres using the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: quickstart
ms.date: 05/06/2025
---
# Quickstart: Create a Neon Serverless Postgres resource

This quickstart shows you how to create a Neon Serverless Postgres resource using the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Neon](overview.md#subscribe-to-neon).

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure Resource details
- New Organization details

   :::image type="content" source="media/create/basics-tab.png" alt-text="Screenshot from the Azure portal showing the Basics tab to create a new Neon resource.":::

There are required fields in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    |Field              |Action                                                          |
    |-------------------|----------------------------------------------------------------|
    |Subscription       |Select a subscription from your existing subscriptions.         |
    |Resource group     |Use an existing resource group or create a new one.             |

1. Enter the values for each required setting under *Azure Resource details*.

    |Field             |Action                                            |
    |------------------|--------------------------------------------------|
    |Resource name     |Specify a unique name for the resource.           |
    |Region            |Select a region to deploy your resource.          |

1. Enter the values for each required setting under *New Organization details*.

    |Field            |Action                                                               |
    |-----------------|---------------------------------------------------------------------|
    |Organization     |Specify a name for the organization.                                 |
    |Plan             |Select the **Change plan** link and choose the plan you want.        |

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.

### Project tab

In Neon, everything starts with a project: the top-level object in the Neon object hierarchy. When you create a project, a default branch and database is automatically created for your project to help you get started.

:::image type="content" source="media/create/project-tab.png" alt-text="Screenshot from the Azure portal showing the Project tab for the Neon resource.":::

- Enter the values for each setting, or continue with the default values for your project.

    
    |Field              |Action                                                             |
    |-------------------|-------------------------------------------------------------------|
    |Project name       |Specify a name for your Neon project.                              |
    |Postgres version   |Choose a Postgres version for your project.                        |
    |Database name      |Specify a name for your first database in the project.             |
    |Project region     |Choose the region for your database.                               |

    > [!NOTE]
    > The *Project region* in this tab corresponds to your database. 
    > Don't confuse this value with the *Region* from the Basics tab, which is where your Azure resource is deployed. 

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage your resource](manage.md)
