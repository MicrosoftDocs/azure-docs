---
title: Create business processes to add business context
description: Model a business process to add business context about transactions in Standard workflows created with Azure Logic Apps.
ms.service: logic-apps
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 06/07/2024
# CustomerIntent: As a business analyst or business SME, I want a way to visualize my organization's business processes so I can map them to the actual resources that implement these business use cases and scenarios.
---

# Create a business process to add business context to Azure resources (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't ready yet for production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can add business information about Azure resources in your integration solution by creating flow charts for the business processes that these resources implement. A business process is a sequence of stages that show the flow through a real-world business scenario. This business process also specifies a single business identifer or *transaction ID*, such as a ticket number, order number, case number, and so on, to identify a transaction that's available across all the stages in the business process and to correlate those stages together.

If your organization wants to capture and track key business data that moves through a business process stage, you can define the specific business properties to capture so that you can later map these properties to operations and data in Standard logic app workflows. For more information, see [What is Azure Integration Environments](overview.md)?

For example, suppose you're a business analyst at a power company. Your company's customer service team has the following business process to resolve a customer ticket for a power outage:

:::image type="content" source="media/create-business-process/business-process-stages-example.png" alt-text="Conceptual diagram shows example power outage business process stages for customer service at a power company." lightbox="media/create-business-process/business-process-stages-example.png":::

After you create a **Business Process** resource in Azure, you can use the process designer to create a flow chart that visually describes this business process, for example:

:::image type="content" source="media/create-business-process/business-process-stages-complete.png" alt-text="Screenshot shows process designer for business process tracking feature in an integration environment." lightbox="media/create-business-process/business-process-stages-complete.png":::

Although this example shows a sequential business process, your process can also have parallel branches to represent decision paths.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing or new [Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-and-database)

  This Azure resource is required to store the business property values, or transactions, that you want capture and track throughout your business process and across your workflows. When you create a business process, you specify the cluster, database, and table to use for storing the desired data.

  > [!NOTE]
  >
  > Although Business Process Tracking doesn't incur charges during preview, Azure Data 
  > Explorer incurs charges, based on the selected pricing option. For more information, see 
  > [Azure Data Explorer pricing](https://azure.microsoft.com/pricing/details/data-explorer/#pricing).

## Create a business process

1. In the [Azure portal](https://portal.azure.com) search box, enter and select **Business Process Tracking**.

   :::image type="content" source="media/create-business-process/select-business-process-tracking.png" alt-text="Screenshot shows Azure portal search box with business process tracking entered." lightbox="media/create-business-process/select-business-process-tracking.png":::

1. On the **Business Process Tracking** toolbar, select **Create**.

1. On the **Create business process** page, on the **Basics** tab, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription*> | The Azure subscription to use for your business process. |
   | **Resource group** | Yes | <*Azure-resource-group-name*> | A new or existing Azure resource group. <br><br>This example uses **City-Power-and-Light-RG**. |
   | **Business process name** | Yes | <*process-name*> | A name for your business process that uses only alphanumeric characters, hyphens, underscores, parentheses, or periods. <br><br>This example uses **Resolve-Power-Outage**. |
   | **Description** | No | <*process-description*> | The purpose for your business process |
   | **Region** | Yes | <*Azure-region*> | The Azure region for your business process. |

   The following example shows the information for the sample business process:

   :::image type="content" source="media/create-business-process/business-process-details.png" alt-text="Screenshot shows page for Create business process with Basics tab selected." lightbox="media/create-business-process/business-process-details.png":::

1. When you're done, select **Next: Transaction ID**. On the **Transaction ID** tab, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Transaction ID** | Yes | <*transaction-ID*> | This important and unique ID identifies a transaction, such as an order number, ticket number, case number, or another similar identifier. <br><br>This example uses the **TicketNumber** property value as the identifier. |
   | **Data type** | Yes | <*ID-data-type*> | The data type for your business identifier: **String** or **Integer**. <br><br>This example uses the **String** data type. |

   > [!NOTE]
   >
   > Although you can define only a single transaction ID when you create a business process, 
   > you can later define more transaction IDs to track when you add a stage to your business process.

   The following example shows the sample transaction ID:

   :::image type="content" source="media/create-business-process/define-transaction-id.png" alt-text="Screenshot shows page for Create business process page with Transaction Id tab selected." lightbox="media/create-business-process/define-transaction-id.png":::

1. When you're done, select **Next: Data storage**. On the **Data storage** tab, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription*> | The Azure subscription for your Data Explorer instance |
   | **Cluster** | Yes | <*cluster-name*> | The name for the cluster in your Data Explorer instance. |
   | **Database** | Yes | <*database-name*> | The name for the database in your Data Explorer instance. |
   | **Table** | Yes | <*table-name*> | The name for the table to create or use. To update an existing table, select the option to **Use an existing table**. <br><br>**Note**: Although you can use the same name as an existing table, which updates that table, for security purposes, create a unique and separate table for each business process. This practice helps you avoid mixing sensitive data with non-sensitive data and is useful for redeployment scenarios. |
   | **Use an existing table** | No | Enabled or disabled | To update an existing table, select this option. |

1. When you're done, select **Review + create**.

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
