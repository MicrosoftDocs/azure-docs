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
> This capability is in public preview and isn't yet ready production use. For more information, see the 
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

1. On the **Edit stage** pane, under **Properties**, on each row, provide the following information for each business property to capture and track:

   | Property | Type |
   |----------|------|
   | Name for the business property | **String** or **Integer** |

   If you need to add another property, select **Add property**.

1. When you're done, continue on to map the current stage to an actual Standard logic app workflow operation and the data that you want.

<a name="map-stage"></a>

## Map a business process stage

After you previously defined the business properties to capture, map the stage to an operation and the data that you want to capture in a Standard logic app workflow.

> [!NOTE]
>
> You can't start mapping if your application group doesn't contain 
> any Standard logic app resources, workflows, and operations.

1. On the **Edit stage** pane, select **Show data source**.

1. From the **Logic app** list, select the Standard logic app resource.

1. From the **Workflow** list, select the workflow.

1. Under the **Action** box, select **Select an action to map to the stage**.

   The Standard logic app workflow designer in Azure Logic Apps opens in read-only mode. To the designer's right side, a pane shows the following items:
   
   - The **Workflow position** box reflects the currently selected operation.

   - The **Properties** section shows the business properties that you previously specified.

   - The **Business ID** box specifies the actual value for mapping to the business identifier that you previously specified. This identifier represents a unique value for a specific transaction such as an order number, case number, or ticket number that exists across all your business stages.
   
     This example uses the identifier named **TicketNumber** to correlate events across the different systems in the example business process, which include CRM, Work Order Management, and Marketing.

1. On the read-only workflow designer, select the operation that you want to map.

   In the right-side pane, the **Workflow position** box changes to show the selected operation.

1. In the **Properties** section, follow these steps to map each property's value to the output from an operation in the workflow.

   1. For each property to map, select inside the property value box.

   1. To view the available outputs, select the dynamic value content list option (lightning icon).

      The dynamic content list opens and shows the available operations and outputs that you can select. This list shows only those operations and the outputs that precede the currently selected operation.

   1. In the dynamic content list, under the operation that you want, review the available outputs.
   
   1. If you find the output that you want, choose one of the following options:

      - If you can use the output as provided, select that output, and then select **Add**.

      - If you have to convert the output into another format or value, you can build an expression that uses functions to produce the necessary result.

        1. To close the dynamic content list, select outside the property value box.

        1. Select inside the property value box again.

        1. To open the expression editor, select the formula icon.

        1. From the [**Function** list](../logic-apps/workflow-definition-language-functions-reference.md), select the function to start your expression.

        1. To include the operation's output in your expression, next the **Function** list label, select **Dynamic content**, and select the output that you want.

        1. When you're done, select **Add**.

           Your expression resolves to a token and appears in the property value box.

   1. Repeat the preceding steps as necessary for each property.

1. To specify the value to use for the previously specified business identifier, follow these steps:

   1. Select inside the **Business ID** box.

   1. To view the available outputs, select the dynamic value content list option (lightning icon).

      The dynamic content list opens and shows the available operations and outputs that you can select. This list shows only those operations and the outputs that precede the currently selected operation.

   1. In the dynamic content list, under the operation that you want, review the available outputs.
   
   1. If you find the output that you want, choose one of the following options:

      - If you can use the output as provided, select that output, and then select **Add**.

      - If you have to convert the output into another format or value, you can build an expression that uses functions to produce the necessary result. Follow the earlier steps for building such an expression.

      > [!NOTE]
      >
      > Make sure to select a value that's available in each workflow.

1. When you're done, select **Continue**.

1. Back on the **Edit stage** pane, select **Save**.

1. To save the whole business process, On the process designer toolbar, select **Save**.

1. Continue to another business stage and repeat the previous steps to map that stage.

1. When you're done, make sure to save your whole business process one more time.

Now, you're ready to deploy your business process and tracking profile.

## Next steps

[Deploy business process and tracking profile](deploy-business-process.md)