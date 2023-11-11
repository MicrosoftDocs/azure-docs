---
title: Map business processes to Standard workflows
description: Map business process stages to operations in Standard workflows created with Azure Logic Apps.
ms.service: azure
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 11/15/2023
# CustomerIntent: As an integration developer, I want a way to map previously business process stages to actual resources that implement these business use cases and scenarios.
---

# Map a business process to a Standard logic app workflow (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't ready yet for production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you create a business process for an application group in an integration environment, you can capture key business data for each stage in your business process. For this task, you specify the properties that your organization wants to track for each stage. You then map that stage to an actual operation and the corresponding data in a Standard logic app workflow created with Azure Logic Apps.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [integration environment](create-integration-environment.md) that contains an [application group](create-application-group.md), which has at least the [Standard logic app resources, workflows, and operations](../logic-apps/create-single-tenant-workflows-azure-portal.md) for mapping to your business process stages

- A [business process with the stages](create-business-process.md) where you want to define the key business data to capture, and then map to actual operations and property values in a Standard logic app workflow

  > [!NOTE]
  >
  > You can't start mapping if your application group doesn't contain 
  > any Standard logic app resources, workflows, and operations.

<a name="define-business-property"></a>

## Define a key business property to capture

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page, select the application group that has the business process that you want.

1. On the application group menu, under **Business process tracking**, select **Business processes**.

1. From the **Business processes** list, select the business process that you want.

1. On the process designer, select the stage where you want to define the business properties to capture.

1. On the **Edit stage** pane, under **Properties**, on each row, provide the following information about each business property value to capture:

   | Property | Type |
   |----------|------|
   | Name for the business property | **String** or **Integer** |

   If you need to add another property, select **Add property**.

   This example specifies to track the business properties named **CustomerName**, **CustomerPhone**, and **CustomerEmail**:

   :::image type="content" source="media/map-business-process-workflow/define-business-properties-tracking.png" alt-text="Screenshot shows process designer, selected process stage, opened pane for Edit stage, and defined business properties to track." lightbox="media/map-business-process-workflow/define-business-properties-tracking.png":::

1. When you're done, continue on to map the current stage to an actual Standard logic app workflow operation and the data that you want.

<a name="map-stage"></a>

## Map a business process stage

After you define the business properties to capture, map the stage to an operation and the data that you want to capture in a Standard logic app workflow.

> [!NOTE]
>
> You can't start mapping if your application group doesn't contain 
> any Standard logic app resources, workflows, and operations.

### Map stage to logic app workflow operation

1. On the **Edit stage** pane, select **Show data source**.

   :::image type="content" source="media/map-business-process-workflow/show-data-source.png" alt-text="Screenshot shows opened pane for Edit stage and selected box for Show data source." lightbox="media/map-business-process-workflow/show-data-source.png":::

1. From the **Logic app** list, select the Standard logic app resource.

1. From the **Workflow** list, select the workflow.

1. Under the **Action** box, select **Select an action to map to the stage**.

1. On the read-only workflow designer, select the operation that you want to map.

   The Standard logic app workflow designer in Azure Logic Apps opens in read-only mode. To the designer's right side, a pane shows the following items:

   | Item | Description |
   |------|-------------|
   | **Workflow position** | Shows the currently selected operation in the Standard logic app workflow. |
   | **Properties** | Shows the business properties that you previously specified. |
   | **Business ID** | Specifies the actual value for mapping to the business identifier that you previously specified. This identifier represents a unique value for a specific transaction such as an order number, case number, or ticket number that exists across all your business stages. <br><br>This example uses the identifier named **TicketNumber** to correlate events across the different systems in the example business process, which include CRM, Work Order Management, and Marketing. |

   :::image type="content" source="media/map-business-process-workflow/open-read-only-workflow-designer.png" alt-text="Screenshot shows read-only Standard workflow designer and opened pane with selected workflow operation, business properties, and business ID." lightbox="media/map-business-process-workflow/open-read-only-workflow-designer.png":::

1. Continue on to map your business properties to operation outputs.

### Map business properties to operation outputs

In the **Properties** section, follow these steps to map each property's value to the output from an operation in the workflow.

1. For each property to map, select inside the property value box, and then select the dynamic content option (lightning icon):

   :::image type="content" source="media/map-business-process-workflow/map-first-property.png" alt-text="Screenshot shows read-only Standard workflow designer, Properties section, and first property edit box with dynamic content option selected." lightbox="media/map-business-process-workflow/map-first-property.png":::

   The dynamic content list opens and shows the available operations and their outputs. This list shows only those operations and the outputs that precede the currently selected operation.

1. Choose one of the following options:

   - If you can use the output as provided, select that output.

     :::image type="content" source="media/map-business-process-workflow/first-property-value-select-output.png" alt-text="Screenshot shows open dynamic content list for first property with output selected." lightbox="media/map-business-process-workflow/first-property-value-select-output.png":::

   - If you have to convert the output into another format or value, you can build an expression that uses the provided functions to produce the necessary result.

     1. To close the dynamic content list, select inside the property value box.

     1. Now select the expression editor option (formula icon):

        :::image type="content" source="media/map-business-process-workflow/open-expression-editor.png" alt-text="Screenshot shows selected option to open expression editor for first property." lightbox="media/map-business-process-workflow/open-expression-editor.png":::

        The expression editor opens and shows the functions that you can use to build an expression:

        :::image type="content" source="media/map-business-process-workflow/first-property-value-expression-editor.png" alt-text="Screenshot shows open expression editor for first property with functions to select." lightbox="media/map-business-process-workflow/first-property-value-expression-editor.png":::

     1. From the [**Function** list](../logic-apps/workflow-definition-language-functions-reference.md), select the function to start your expression.

     1. To include the operation's output in your expression, next the **Function** list label, select **Dynamic content**, and select the output that you want.

     1. When you're done with your expression, select **Add**.

        Your expression resolves to a token and appears in the property value box.

1. For each property, repeat the preceding steps as necessary.

1. Continue on to map the business identifier to an operation output.

### Map business identifier to an operation output

In the **Business identifier** section, follow these steps to map the previously defined business identifier to an operation output.

1. Select inside the **Business ID** box, and then select the dynamic content option (lightning icon).

1. Choose one of the following options:

   - If you can use the output as provided, select that output.

     > [!NOTE]
     >
     > Make sure to select a value that exists in each business process stage, 
     > which means in each workflow that you map to each business stage.

   - If you have to convert the output into another format or value, you can build an expression that uses the provided functions to produce the necessary result. Follow the earlier steps for building such an expression.

1. When you're done, select **Continue**, which returns you to the **Edit stage** pane.

   After you finish mapping an operation to a business stage, the platform sends the selected information to your database in Azure Data Explorer.

1. On the **Edit stage** pane, select **Save**.

The following example shows a completely mapped business process stage:

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions-complete.png" alt-text="Screenshot shows opened pane for Edit stage, and complete mapping to workflow operation, business properties, and business identifier.":::

## Finish mapping your business process

1. Repeat the steps to [map a business process stage](#map-stage) as necessary.

1. Save the changes to your business process often. On the process designer toolbar, select **Save**.

1. When you finish, save your business process one more time.

Now, deploy your business process and tracking profile.

## Next steps

[Deploy business process and tracking profile](deploy-business-process.md)
