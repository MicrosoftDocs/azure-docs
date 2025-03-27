---
title: "Quickstart: Get started with Apache Kafka & Apache Flink on Confluent Cloud through Azure portal"
description: Learn how to create resources for Apache Kafka & Apache Flink on Confluent Cloud in the Azure portal.
ms.topic: quickstart
ms.date: 02/07/2025

---

# Quickstart: Get started with Apache Kafka & Apache Flink on Confluent Cloud

In this quickstart, you use the Azure portal to create an instance of Apache Kafka® & Apache Flink® on Confluent Cloud™.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Confluent Cloud](overview.md#subscribe-to-confluent-cloud)

## Create a Confluent resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

## Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- Confluent organization details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create a Confluent organization options inside of the Azure portal's working pane with the Basics tab displayed.":::

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

1. Enter the values for each required setting under *Confluent organization details*.

    | Field             | Action                                                                                           |
    |-------------------|--------------------------------------------------------------------------------------------------|
    | Organization      | Choose to create a new organization, or associate your resource with an existing organization.   |

    > [!NOTE]
    > If you choose to associate your resource with an existing organization, the resource is billed to that organization's plan. 

    Select the **Change plan** link to change your [billing plan](overview.md#billing).

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Manage a Confluent Cloud resource](manage.md)
