---
title: "Quickstart: Get started with Napster Companion API (preview)"
description: Learn how to create a Napster Companion API resource in the Azure portal to start building persistent multimodal AI agents with unified Azure billing.
author: shijoy
ms.author: shijoy
ms.topic: quickstart
ms.date: 05/20/2026
ms.custom:
  - references_regions
  - ignite-2026
#customer intent: As an Azure customer, I want to create a Napster Companion API resource in the portal so that I can begin building persistent multimodal AI agents on Azure.
---

# Quickstart: Get started with Napster Companion API (preview)

In this quickstart, you create an instance of Napster Companion API in the Azure portal. You complete the Basics, Tags, and Review + create tabs to provision the resource in your Azure subscription and associate it with your Napster organization.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Napster Companion API](overview.md#subscribe-to-napster-companion-api).

## Create a Napster Companion API resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- Napster organization details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create a Napster Companion API resource options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group or create a new one.       |

1. Enter the values for each required setting under *Azure resource details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    | Resource name      | Specify a unique name for the resource.   |
    | Region             | Select a region to deploy your resource.  |

1. Enter the values for each required setting under *Napster organization details*.

    | Field             | Action                                                                                                                  |
    |-------------------|-------------------------------------------------------------------------------------------------------------------------|
    | Organization      | Provide the name of the organization. This organization is created automatically on the Napster side.                   |

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Related content

[Manage a Napster Companion API resource](manage.md)
