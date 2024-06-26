---
title: Map business processes to Standard workflows
description: Map your business process stages to operations and outputs in Standard logic app workflows from Azure Logic Apps.
ms.service: azure-business-process-tracking
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 06/07/2024
# CustomerIntent: As an integration developer, I want a way to map previously business process stages to actual resources that implement these business use cases and scenarios.
---

# Map a business process to a Standard logic app workflow (Preview)

> [!NOTE]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you finish creating your business process, you can map each stage, transaction ID, and business properties to actual operations and outputs in a Standard logic app workflow that you created using Azure Logic Apps.

## Prerequisites

- Access to the Azure account and subscription associated with the **Business process** resource that you want to map.

  > [!NOTE]
  >
  > If you're using an [Azure integration environment and application groups](../integration-environments/overview.md) 
  > to organize your Azure resources, and you want to map your business process to Azure resources in your 
  > integration environment, all your Azure resources must use the same subscription, including your business 
  > processes and integration environment. If you're not using an Azure integration environment, you can map 
  > your business process to Azure resources where you have access.

- A [**Business process** resource with the stages and business property values](create-business-process.md) that you want to map to the corresponding operations and output values in Standard logic app workflows.

- All the Standard logic app workflows that you want to map your business process stages. For more information, see [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md)?

<a name="map-stage"></a>

## Map a business process stage

1. On the process editor toolbar, turn on **Show data source settings**.

1. After the **Data source settings** section appears with the following options, select the values for the Standard logic app workflow that you want to map to your stage:

   | Setting | Description |
   |---------|-------------|
   | **Subscription** | The Azure subscription for your Standard logic app resource. |
   | **Logic app** | The Standard logic app resource with the workflow that you want to map. |
   | **Workflow** | The workflow that you want to map. |

   For example, the following **Edit stage** pane shows the **Data source settings** section:

   :::image type="content" source="media/map-business-process-workflow/show-data-source.png" alt-text="Screenshot shows opened pane named **Edit stage**, enabled option named Show data source settings, and section named Data source settings." lightbox="media/map-business-process-workflow/show-data-source.png":::

1. After you select your workflow, under **Properties to track**, select the now-active link named **Select data sources**.

   The Standard logic app workflow designer in Azure Logic Apps opens in read-only mode. To the designer's right side, the **Select data sources** pane appears with the previously defined key business properties.

1. On the read-only workflow designer, select the operation that you want to map.

   This example selects the **Send message** operation.

1. In the **Select data sources** pane, under **Point-in-time action**, the selected operation appears.

   :::image type="content" source="media/map-business-process-workflow/open-read-only-workflow-designer.png" alt-text="Screenshot shows read-only Standard workflow designer and opened pane with selected workflow operation, business properties, and business ID." lightbox="media/map-business-process-workflow/open-read-only-workflow-designer.png":::

1. To continue by mapping your transaction ID and business properties to operation outputs, select **Next**.

<a name="map-outputs"></a>

## Map transaction ID and business properties to operation outputs

In the **Properties** section, follow these steps to map each property's value to the output from an operation in the workflow. You must completely map all properties before you can deploy your business process.

1. For the transaction ID and each business property, select inside the property value box, and then select the dynamic content option (lightning icon):

   :::image type="content" source="media/map-business-process-workflow/map-first-property.png" alt-text="Screenshot shows read-only Standard workflow designer, Properties section, and first property edit box with dynamic content option selected." lightbox="media/map-business-process-workflow/map-first-property.png":::

   The dynamic content list opens and shows the available operations and their outputs. This list shows only those operations and the outputs that precede the currently selected operation.

1. Choose one of the following options:

   - If you can use the output as provided, select that output.

     > [!NOTE]
     >
     > Make sure to select a value that exists in each business process stage, 
     > which means in each workflow that you map to each business stage.

     For **TicketNumber**, this example selects the **Body int23_ticketnumber** output from the **Parse JSON - Canonical Message** operation:

     :::image type="content" source="media/map-business-process-workflow/first-property-value-select-output.png" alt-text="Screenshot shows dynamic content list for first property with output selected." lightbox="media/map-business-process-workflow/first-property-value-select-output.png":::

   - If you have to convert the output into another format or value, you can build an expression that uses the provided functions to produce the necessary result.

     1. To close the dynamic content list, select inside the property value box.

     1. Now select the expression editor option (formula icon):

        :::image type="content" source="media/map-business-process-workflow/open-expression-editor.png" alt-text="Screenshot shows selected option to open expression editor for first property." lightbox="media/map-business-process-workflow/open-expression-editor.png":::

        The expression editor opens and shows the functions that you can use to build an expression:

        :::image type="content" source="media/map-business-process-workflow/first-property-value-expression-editor.png" alt-text="Screenshot shows expression editor for first property with functions to select." lightbox="media/map-business-process-workflow/first-property-value-expression-editor.png":::

     1. From the [**Function** list](../logic-apps/workflow-definition-language-functions-reference.md), select the function to start your expression.

     1. To include the operation's output in your expression, next the **Function** list label, select **Dynamic content**, and select the output that you want.

     1. When you're done with your expression, select **Add**.

        Your expression resolves to a token and appears in the property value box.

1. Continue mapping each business property to an operation output by repeating the preceding steps.

   The following example shows complete mappings between business properties and operation outputs:

   :::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions.png" alt-text="Screenshot shows pane named Select data sources, and complete mapping between business properties and workflow operation outputs." lightbox="media/map-business-process-workflow/map-properties-workflow-actions.png":::

1. When you're done, select **Next**.

   The platform returns you to the process editor and the **Edit stage** pane. The following example shows a complete mapped business process stage:

   :::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions-complete.png" alt-text="Screenshot shows opened pane for Edit stage, and complete mapping to workflow operation, business properties, and business identifier." lightbox="media/map-business-process-workflow/map-properties-workflow-actions-complete.png":::

1. On the **Edit stage** pane, select **Save stage**.

1. Validate your mappings, or continue mapping any other stages that you might have.

## Validate mappings

As you build your business process, you can check your mappings before you deploy. That way, you can find errors or problems earlier when your process is less complex and is easier to troubleshoot.

If you wait until you finish or deploy, and your process is long or complex, you might find that your process has more errors than expected, which might take longer to resolve or prove difficult to troubleshoot.

1. Before you validate your mappings, make sure to completely map all existing stages. Otherwise, unmapped stages generate errors.

1. When you're ready, on the editor toolbar, select **Validate**.

  The Azure portal shows notifications for any errors or problems that exist.

## Finish mapping your business process

1. [Repeat the preceding steps to map each business process stage](#map-stage) as necessary.

1. Save the changes to your business process often. On the process designer toolbar, select **Save**.

1. When you finish, save your business process one more time.

Now, continue on to [deploy your business process and tracking profile](deploy-business-process.md).

## Next step

> [!div class="nextstepaction"]
> [Deploy business process and tracking profile](deploy-business-process.md)
