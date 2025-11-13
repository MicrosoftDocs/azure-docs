---
title: "Create a Confluent Cloud Resource - Azure Portal"
description: Learn how to begin using Apache Kafka & Apache Flink on Confluent Cloud by creating an instance in the Azure portal.
ms.topic: quickstart
ms.date: 02/07/2025
ms.custom: sfi-image-nochange

#customer intent: As a developer, I want to learn how to create a new instance of Apache Kafka & Apache Flink on Confluent Cloud by using the Azure portal so that I can create my own resources.
---

# Quickstart: Create a Confluent resource in the Azure portal

In this quickstart, you use the Azure portal to create a resource in Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]

- You must [subscribe to Confluent Cloud](overview.md#subscribe-to-confluent-cloud).

## Create a Confluent resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

## Basics

The **Basics** tab has three sections:

- **Project details**
- **Azure resource details**
- **Confluent organization details**

:::image type="content" source="media/create/basics-tab.png" alt-text="Screenshot that shows the options to create a Confluent organization on the Basics tab in the Azure portal.":::

Each section has required settings to configure (identified with red asterisks).

1. Under **Project details**, enter or select values for these settings:

    | Name | Action |
    | --- | --- |
    | **Subscription**        | Select an existing subscription.   |
    | **Resource group**      | Select an existing resource group, or create a new one.       |

1. Under **Azure resource details**, enter or select values for these settings:

    | Name | Action |
    | --- | --- |
    | **Resource name**      | Enter a unique name for the resource.   |
    | **Region**             | Select an Azure region for the resource deployment.  |

1. Under **Confluent organization details**, enter or select values for these settings:

    | Name | Action |
    | --- | --- |
    | **Organization**      | Select an existing organization, or create a new one.   |

    > [!NOTE]
    > If you select an existing organization, the resource is billed to that organization's billing plan.

    To change your [billing plan](overview.md#billing), select **Change plan**.

    If you create a new organization, the remaining fields refresh to reflect the details of the plan you select for the new organization.

1. Select **Next**.

### Tags (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create

[!INCLUDE [review-create](../includes/review-create.md)]

## Related content

- [Manage your Confluent Cloud resource](manage.md)
