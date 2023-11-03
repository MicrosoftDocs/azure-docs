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

For example, suppose you're the power company, and your customer service team has the following business process to resolve customer tickets for power outages:

:::image type="content" source="media/create-business-process/business-process-stages-example.png" alt-text="Conceptual diagram shows example power outage business process stages for customer service at a power company." lightbox="media/business-process-stages-example.png":::

With the business process designer in your integration environment, you can visually describe this business process, for example:

:::image type="content" source="media/create-business-process/business-process-stages-complete.png" alt-text="Screenshot shows business process designer in the busines process tracking feature in an integration environment." lightbox="media/create-business-process/business-process-stages-complete.png":::

Although this example shows a sequential business process, your process can also have parallel branches to represent decision paths.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [integration environment](create-integration-environment.md) that includes at least one [application group](create-application-group.md) with existing Azure resources.

## Create a business process

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select an application group.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. On the **Business processes** toolbar, select **Create new**.

1. On the **Create business process** pane, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*process-name*> | Name for your business process that uses only alphanumeric characters, hyphens, underscores, parentheses, or periods. <br><br>**Note**: When you deploy your business process, the platform uses this name to create a table in the Data Explorer database that's associated with your application group. Although you can use the same name as an existing table, which updates that table, for security purposes, create a unique and separate table for each business process. This practice helps you avoid mixing sensitive data with non-sensitive data and is useful for redeployment scenarios. <br><br>This example uses **Track-Power-Outages**. |
   | **Description** | No | <*process-description*> | Purpose for your business process |
   | **Business identifier** | Yes | <*business-ID*> | This important and unique ID identifies a transaction, such as an order number, ticket number, case number, or another similar identifier. <br><br>This example uses the **TicketNumber** property value as the identifier. |
   | **Type** | Yes | <*ID-data-type*> | Data type for your business identifier: **String** or **Integer**. <br><brThis example uses the **String** data type. |

1. When you're done, select **Create**.

   The **Business processes** list now includes the business process that you created.

1. Continue to add stages for your business process.

## Add a business process stage

After you create your business process, add stages and define key business data properties for each stage so that you can get insights into your business process.

1. From the **Business processes** list, select your business process to open the business process designer.

1. On the designer, select **Add stage**. On the **Add stage** pane, provide the following information:

   > [!TIP]
   >
   > To quickly draft the stages in your business process, just provide 
   > the name, and then update the remaining values later.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*stage-name*> | Name for this process stage that uses only alphanumeric characters, hyphens, underscores, parentheses, or periods. |
   | **Description** | No | <*stage-description*> | Purpose for this stage |
   | **Show data source** | No | True or false | Show or hide the available data sources: <br><br>- **Logic app**: Name for an available Standard logic app resource <br><br>- **Workflow**: Name for the workflow in the selected Standard logic app resource <br><br>= **Action**: Name for the operation that you want to select and map to this stage <br><br>**Note**: If no options appear, the designer didn't find any Standard logic apps in your application group. |
   | **Add property** | No | None | Add the properties and values for the key business data that your organization wants to track: <br><br>- **Property**: Name for the property, for example, **CustomerName**, **CustomerPhone**, and **CustomerEmail** and **SiteID**. <br><br>**Note**: The platform automatically captures the transaction timestamp, so you don't have to add this value for tracking. <br><br>- **Type**: Property value's data type, which is either a **String** or **Integer** |
   | **Business identifier** | Yes | <*business-ID*>, read-only | This unique ID identifies a transaction, such as an order number, ticket number, case number, or another similar identifier. In this example, the **TicketNumber** identifier is prepopulated from when you defined the parent business process. |

1. When you're done, select **Add**.

1. To add another stage, choose one of the following options:

   - Under the last stage, select **Add stage**. 
 
   - Between stages, select the plus sign (**+**), and then select either **Add stage** or **Add a parallel stage**, which creates a decision branch in your business process.

1. Repeat the steps to add a stage as necessary.

1. When you're done, on the toolbar, select **Save**.

## Next steps

- [Map a business process to a Standard logic app workflow](map-business-process-workflow.md)