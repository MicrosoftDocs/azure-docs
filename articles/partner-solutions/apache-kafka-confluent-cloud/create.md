---
title: Create Apache Kafka & Apache Flink on Confluent Cloud through Azure portal
description: This article describes how to use the Azure portal to create an instance of Apache Kafka & Apache Flink on Confluent Cloud.
# customerIntent: As a developer I want create a new instance of Apache Kafka & Apache Flink on Confluent Cloud using the Azure portal.
ms.topic: quickstart
ms.date: 01/23/2024

---

# QuickStart: Get started with Apache Kafka & Apache Flink on Confluent Cloud - Azure portal

In this quickstart, you'll use the Azure portal to create an instance of Apache Kafka® & Apache Flink® on Confluent Cloud™.

## Prerequisites

- [!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to New Relic](overview.md#subscribe-to-new-relic).

## Create a New Relic resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

## Create resource

After you've selected the offer for Apache Kafka & Apache Flink on Confluent Cloud, you're ready to set up the application.

1. If you selected private offers in the previous section, you'll have two options for plan types:

    - Confluent Cloud - Pay-as-you-go
    - Commitment - for commit plan

   If you didn't select private offers, you'll only have the pay-as-you-go option.

   Pick the plan to use, and select **Subscribe**.

    :::image type="content" source="media/create/setup-subscribe.png" alt-text="Set up and subscribe.":::

## Basics tab

1. On the **Create a Confluent organization** basics page, provide the following values. When you've finished, select **Next: Tags**.

    :::image type="content" source="media/create/setup-basics.png" alt-text="Form to set up Confluent Cloud resource.":::

    | Property | Description |
    | ---- | ---- |
    | **Subscription** | From the drop-down menu, select the Azure subscription to deploy to. You must have _Owner_ or _Contributor_ access. |
    | **Resource group** | Specify whether you want to create a new resource group or use an existing resource group. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../../azure-resource-manager/management/overview.md). |
    | **Resource name** | Instance name is automatically generated based on the name of the Confluent organization. |
    | **Region** | From the drop-down menu, select one of these regions: Australia East, Canada Central, Central US, East US, East US 2, France Central, North Europe, Southeast Asia, UK South, West Central US, West Europe, West US 2 |
    | **Organization** | To create a new Confluent organization, select **Create a new organization** and provide a name for the Confluent organization. To link to an existing Confluent organization, select **Link Subscription to an existing organization** option, sign in to your Confluent account, and select the existing organization. |
    | **Plan** | Optionally change plan. |
    | **Billing term** | Prefilled based on the selected billing plan. |
    | **Price + Payment options** | Prefilled based on the selected Confluent plan. |
    | **Subtotal** | Prefilled based on the selected Confluent plan. |

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Manage the Confluent Cloud resource](manage.md)
