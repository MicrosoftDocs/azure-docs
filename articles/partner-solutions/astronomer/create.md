---
title: "Quickstart: Get started with Apache Airflow on Astro"
description: Learn how to create an Astro resource in the Azure portal.
ms.topic: quickstart
ms.date: 02/07/2025
ms.custom:
  - references_regions
  - ignite-2023
---

# Quickstart: Get started with Apache Airflow on Astro

In this quickstart, you create an instance of Apache Airflow on Astro.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Apache Airflow on Astro](overview.md#subscribe-to-apache-airflow-on-astro).

## Create an Astro resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- Astro organization details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create an Astro Organization options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group or create a new one.       |

1. Enter the values for each required setting under *Azure Resource details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    | Resource name      | Specify a unique name for the resource.   |
    | Region             | Select a region to deploy your resource.  |

1. Enter the values for each required setting under *Astro organization details*.

    | Field             | Action                                                                                           |
    |-------------------|--------------------------------------------------------------------------------------------------|
    | Organization      | Choose to create a new organization, or associate your resource with an existing organization.   |
    | Workspace Name    | Choose a name for your workspace.                                                                |

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

[Manage an Astro resource](manage.md)

