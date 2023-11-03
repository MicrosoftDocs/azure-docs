---
title: Create business processes to add business context
description: Create a business process so you can add business context about transactions in Standard workflows created with Azure Logic Apps.
ms.service: azure
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 11/15/2023
---

# Create a business process to add business context to Azure resources (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't yet ready production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you create an integration environment and an application group with existing Azure resources, you can add business context about these resources by visually defining one or more business processes. After you create these processes, you can add tracking for key business data by mapping business process stages to operations and data in Standard logic app workflows.

For example, suppose you're the power company, and your customer service team has the following business process to fix power outages:

:::image type="content" source="media/business-process-stages-example.png" alt-text="{alt-text}" lightbox="business-process-stages-example.png":::

This busines process spans multiple Standard logic app resources and their workflows:

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [integration environment](create-integration-environment.md) that includes at least one [application group](create-application-group.md) with existing Azure resources

## Create a business process

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select an application group.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. On the **Business processes** toolbar, select **Create new**.

1. On the **Create business process** pane, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*process-name*> | Name for your business process |
   | **Description** | No | <*process-description*> | Purpose for your business process |
   | **Business identifier** | Yes | <*business-ID*> | This important string or integer ID uniquely identifies a transaction, such as an order number, ticket number, case number, or another similar identifier. |
   | **Type** | Yes | <*ID-data-type*> | Data type for your business identifier: **String** or **Integer** |

1. When you're done, select **Create**.

   The **Business processes** list now includes the business process that you created.

1. Continue to add stages for your business process.

## Add a business process stage

In your business process, add stages and define key business data properties for each stage so that you can get insights into your business process.

1. In the 

## Next steps

- [Map a business process to a Standard logic app workflow](map-business-process-workflow.md)