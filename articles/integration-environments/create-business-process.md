---
title: Create business processes to add business context
description: Model a business process to add business context about transactions in Standard workflows created with Azure Logic Apps.
ms.service: integration-environments
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 11/15/2023
# CustomerIntent: As a business analyst or business SME, I want a way to visualize my organization's business processes so I can map them to the actual resources that implement these business use cases and scenarios.
---

# Create a business process to add business context to Azure resources (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't ready yet for production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you create an integration environment and an application group with existing Azure resources, you can add business information about these resources by adding flow charts for the business processes that these resources implement. A business process is a sequence of stages that show the flow through a real-world business scenario. This business process also specifies a single business identifer, such as a ticket number, order number, case number, and so on, to identify a transaction that's available across all the stages in the business process and to correlate those stages together.

If your organization wants to capture and track key business data that moves through a business process stage, you can define the specific business properties to capture so that you can later map these properties to operations and data in Standard logic app workflows. For more information, see [What is Azure Integration Environments](overview.md)?

For example, suppose you're a business analyst at a power company. Your company's customer service team has the following business process to resolve a customer ticket for a power outage:

:::image type="content" source="media/create-business-process/business-process-stages-example.png" alt-text="Conceptual diagram shows example power outage business process stages for customer service at a power company." lightbox="media/create-business-process/business-process-stages-example.png":::

For each application group, you can use the process designer to add a flow chart that visually describes this business process, for example:

:::image type="content" source="media/create-business-process/business-process-stages-complete.png" alt-text="Screenshot shows process designer for business process tracking feature in an integration environment." lightbox="media/create-business-process/business-process-stages-complete.png":::

Although this example shows a sequential business process, your process can also have parallel branches to represent decision paths.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [integration environment](create-integration-environment.md) that includes at least one [application group](create-application-group.md) with the Azure resources for your integration solution

## Create a business process

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select an application group.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. On the **Business processes** toolbar, select **Create**.

   :::image type="content" source="media/create-business-process/create-business-process.png" alt-text="Screenshot shows Azure portal, application group, and business processes toolbar with Create new selected." lightbox="media/create-business-process/create-business-process.png":::

1. On the **Create business process** pane, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*process-name*> | Name for your business process that uses only alphanumeric characters, hyphens, underscores, parentheses, or periods. <br><br>**Note**: When you deploy your business process, the platform uses this name to create a table in the Data Explorer database that's associated with your application group. Although you can use the same name as an existing table, which updates that table, for security purposes, create a unique and separate table for each business process. This practice helps you avoid mixing sensitive data with non-sensitive data and is useful for redeployment scenarios. <br><br>This example uses **Resolve-Power-Outage**. |
   | **Description** | No | <*process-description*> | Purpose for your business process |
   | **Business identifier** | Yes | <*business-ID*> | This important and unique ID identifies a transaction, such as an order number, ticket number, case number, or another similar identifier. <br><br>This example uses the **TicketNumber** property value as the identifier. |
   | **Type** | Yes | <*ID-data-type*> | Data type for your business identifier: **String** or **Integer**. <br><br>This example uses the **String** data type. |

   The following example shows the information for the sample business process:

   :::image type="content" source="media/create-business-process/business-process-details.png" alt-text="Screenshot shows pane for Create business process." lightbox="media/create-business-process/business-process-details.png":::

1. When you're done, select **Create**.

   The **Business processes** list now includes the business process that you created.

   :::image type="content" source="media/create-business-process/business-process-created.png" alt-text="Screenshot shows Azure portal, application group, and business processes list with new business process." lightbox="media/create-business-process/business-process-created.png":::

1. Now, add the stages for your business process.

## Add a business process stage

After you create your business process, add the stages in that process.

Suppose you're an integration developer at a power company. You manage a solution for a customer work order processor service that's implemented by multiple Standard logic app resources and their workflows. Your customer service team follows the following business process to resolve a customer ticket for a power outage:

:::image type="content" source="media/create-business-process/business-process-stages-example.png" alt-text="Conceptual diagram shows example power outage business process stages for customer service at a power company." lightbox="media/create-business-process/business-process-stages-example.png":::

1. From the **Business processes** list, select your business process, which opens the process designer.

1. On the designer, select **Add stage**.

   :::image type="content" source="media/create-business-process/add-stage.png" alt-text="Screenshot shows business process designer with Add stage selected." lightbox="media/create-business-process/add-stage.png":::

1. On the **Add stage** pane, provide the following information:

   > [!TIP]
   >
   > To quickly draft the stages in your business process, just provide the stage 
   > name, select **Add**, and then return later to provide the remaining values 
   > when you [map the business process to a Standard logic app workflow](map-business-process-workflow.md).

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*stage-name*> | Name for this process stage that uses only alphanumeric characters, hyphens, underscores, parentheses, or periods. |
   | **Description** | No | <*stage-description*> | Purpose for this stage |
   | **Show data source** | No | True or false | Show or hide the available data sources: <br><br>- **Logic app**: Name for an available Standard logic app resource <br><br>- **Workflow**: Name for the workflow in the selected Standard logic app resource <br><br>- **Action**: Name for the operation that you want to select and map to this stage <br><br>**Note**: If no options appear, the designer didn't find any Standard logic apps in your application group. |
   | **Add property** | No | None | Add a property and value for key business data that your organization wants to capture and track: <br><br>- **Property**: Name for the property, for example, **CustomerName**, **CustomerPhone**, and **CustomerEmail**. The platform automatically includes and captures the transaction timestamp, so you don't have to add this value for tracking. <br><br>- **Type**: Property value's data type, which is either a **String** or **Integer** |
   | **Business identifier** | Yes | <*business-ID*>, read-only | Visible only when **Show data source** is selected. This unique ID identifies a transaction, such as an order number, ticket number, case number, or another similar identifier that exists across all your business stages. This ID is automatically populated from when defined the parent business process. <br><br>In this example, **TicketNumber** is the identifier that's automatically populated. |

   The following example shows a stage named **Create_ticket** without the other values, which you provide when you [map the business process to a Standard logic app workflow](map-business-process-workflow.md):

   :::image type="content" source="media/create-business-process/add-stage-quick.png" alt-text="Screenshot shows pane named Add stage." lightbox="media/create-business-process/add-stage-quick.png":::

1. When you're done, select **Add**.

1. To add another stage, choose one of the following options:

   - Under the last stage, select the plus sign (**+**) for **Add a stage**.
 
   - Between stages, select the plus sign (**+**), and then select either **Add a stage** or **Add a parallel stage**, which creates a decision branch in your business process.

   > [!TIP]
   >
   > To delete a stage, open the stage's shortcut menu, and select **Delete**.

1. Repeat the steps to add a stage as necessary.

   The following example shows a completed business process:

   :::image type="content" source="media/create-business-process/business-process-stages-complete.png" alt-text="Screenshot shows process designer with completed business process stages." lightbox="media/create-business-process/business-process-stages-complete.png":::

1. When you're done, on the process designer toolbar, select **Save**.

1. Now, [define key business data properties to capture for each stage and map each stage to an operation in a Standard logic app workflow](map-business-process-workflow.md#define-business-property) so that you can get insights about your deployed resource.

## Next steps

- [Map a business process to a Standard logic app workflow](map-business-process-workflow.md)
- [Manage a business process](manage-business-process.md)
