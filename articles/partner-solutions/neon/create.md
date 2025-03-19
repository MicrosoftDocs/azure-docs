---
title: "Quickstart: Create a  Neon Serverless Postgres (Preview) resource"
description: Learn how to create a resource for  Neon Serverless Postgres (Preview) using the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: quickstart
ms.date: 12/02/2024

---
# Quickstart: Create a Neon Serverless Postgres (Preview) resource

This quickstart shows you how to create a Neon Serverless Postgres (Preview) resource using the Azure portal.

## Prerequisites

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/). Make sure you're an *Owner* or a *Contributor* in the subscription.

## Setup

Begin by signing in to the [Azure portal](https://portal.azure.com/).

## Create a Neon Serverless Postgres resource

To create your Neon Serverless Postgres resource, start at the Azure portal home page.

1. Search for the Neon Serverless Postgres resource provider by typing **Neon Serverless Postgres** the header search bar.

1. Choose **Neon Serverless Postgres** from the *Services* search results.

1. Select the **+ Create** option.

The **Create a Neon Serverless Postgres** Resource pane opens to the *Basics* tab by default.

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure Resource details
- New Organization details

   :::image type="content" source="media/create/basics-tab.png" alt-text="Screenshot from the Azure portal showing the Basics tab to create a new Neon resource.":::

There are required fields in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    |Field  |Action  |
    |---------|---------|
    |Subscription    |Select a subscription from your existing subscriptions.         |
    |Resource group     |Use an existing resource group or create a new one.          |

1. Enter the values for each required setting under *Azure Resource details*.

    |Field |Action  |
    |---------|---------|
    |Resource name     |Specify a unique name for the resource.    |
    |Region     |Select a region to deploy your resource.         |

1. Enter the values for each required setting under *New Organization details*.

    |Field  |Action  |
    |---------|---------|
    |Organization     |Specify a name for the organization.   |
    |Plan    |Select the **Change plan** link and choose the plan you want.        |

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.

### Tags tab (optional)

If you wish, you can optionally create a tag for your Neon Serverless Postgres resource, then select the **Review + create** button at the bottom of the page. 

### Review + create tab

> [!NOTE]
> The view automation template link directs you to a downloadable [ARM template](../../azure-resource-manager/templates/overview.md). 

If the review identifies errors, a red dot appears next each section where errors exist. Fields with errors are highlighted in red. 

1. Open each section with errors and fix the errors.

1. Select the **Review + create** button again.

1. Select the **Create** button.

Once the resource is created, select **Go to Resource** to navigate to the Neon resource. 

## Next steps

> [!div class="nextstepaction"]
> [Manage your Neon  integration through the portal](manage.md)
