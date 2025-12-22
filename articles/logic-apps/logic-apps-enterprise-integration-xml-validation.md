---
title: Validate XML in B2B Workflows
description: Learn how to validate XML in B2B workflows using schemas in Azure Logic Apps so you can make sure messages meet trading partner requirements.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 12/09/2025
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to validate XML using schemas before trading partners process messages in B2B workflows.
---

# Validate XML using schemas in B2B workflows with Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

In enterprise integration business-to-business (B2B) scenarios, trading partners that communicate with each other based on an agreement need to make sure their messages are valid before any data processing can start.

This guide shows how your logic app workflow can validate XML messages and documents using a predefined [schema](logic-apps-enterprise-integration-schemas.md) and the **XML Operations** action that validates XML.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The logic app resource and workflow where you want to validate XML.

  Your workflow must start with a trigger, but you can use any trigger that works for your scenario. For more information, see these [general steps](create-workflow-with-trigger-or-action.md#add-trigger) to add any trigger you want.

  The examples in this guide use the [**Request** trigger named **When an HTTP request is received**](../connectors/connectors-native-reqres.md), which waits until an external caller sends a request to the trigger. Alternatively, you can use the [**Schedule** trigger named **Recurrence**](../connectors/connectors-native-recurrence.md).

- An [integration account resource](./enterprise-integration/create-integration-account.md) to define and store artifacts for use in your enterprise integration and B2B workflows across multiple logic app resources.

  - Both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

  - The [schema](logic-apps-enterprise-integration-schemas.md) to use for validating XML content.

- Before you start working with XML operations that use artifacts such as schemas in an integration account, you must [link your Consumption logic app](enterprise-integration/create-integration-account.md?tabs=consumption#link-account) or [link your Standard logic app](enterprise-integration/create-integration-account.md?tabs=standard#link-account) to the integration account. You can then use the artifacts across workflows in multiple logic app resources.

  You can optionally add specific artifacts directly to a Standard logic app resource. However, only workflows in the same resource can work with those artifacts.

[!INCLUDE [api-test-http-request-tools-bullet](../../includes/api-test-http-request-tools-bullet.md)]

  If you use a trigger that waits for a request to start the workflow, you need an HTTP request tool to test the trigger and workflow.

## Add a validate XML action

1. In the [Azure portal](https://portal.azure.com), open the logic app resource. Open your workflow in the designer.

1. On the designer, follow these [general steps](create-workflow-with-trigger-or-action.md?tabs=standard#add-action) to add the **XML Operations** action with the name that matches your workflow type:

   | Workflow | Action name |
   |----------|-------------|
   | Consumption | **XML Validation** |
   | Standard | **Validate XML** |

1. To view the source options for your XML content, follow these steps:

   1. Select inside the **Content** box, then select an option:

      | XML content source | Select | Description |
      |--------------------|--------|-------------|
      | Output from a previous workflow operation | Lightning icon | Open the dynamic content list so you can select the output from the trigger or a previous action. |
      | Output from an expression | Function icon | Open the expression editor so you can use an expression function or build an expression to produce the XML content. |

      This example continues with the dynamic content list, for example:

      :::image type="content" source="./media/logic-apps-enterprise-integration-xml-validation/open-dynamic-content-list.png" alt-text="Screenshot shows the Azure portal, workflow designer, selected validate XML action, cursor in Content box, and opened dynamic content list." lightbox="./media/logic-apps-enterprise-integration-xml-validation/open-dynamic-content-list.png":::

   1. From the dynamic content list, select the output with the XML content from the operation you want.

      This example selects the **Body** output from the trigger named **When an HTTP request is received**.

1. To specify the schema for validation, follow the steps for your workflow type:

   - **Consumption**

     From the **Schema Name** list, select the schema from the linked integration account.

   - **Standard**

     1. From the **Schema source** list, select **IntegrationAccount** or **LogicApp**.

        This example selects **IntegrationAccount**.

     1. From the **Schema name** list, select the schema.

1. When you're done, save your workflow.

You're now finished with setting up your validate XML action. In a real world app, you might want to store the validated data in a line-of-business (LOB) app such as SalesForce. To send the validated output to Salesforce, add a **Salesforce** action.

## Test your workflow

Confirm that the workflow works the way that you expect.

1. On the designer, select the trigger named **When an HTTP request is received**.

1. From the **HTTP URL** property, copy and save the endpoint URL for the trigger.

1. On the designer toolbar, select **Run** > **Run**.

1. To fire the **Request** trigger, use your preferred HTTP request tool to send a request with the XML content to the trigger's endpoint URL.

   The validate XML action runs after the trigger fires and XML content is available for validation.

1. To review the status for each operation, inputs, and outputs, follow the steps in [Review workflow run history](view-workflow-status-run-history.md#review-workflow-run-history).

## Related content

- [Add schemas for XML validation in Azure Logic Apps](logic-apps-enterprise-integration-schemas.md)
- [Transform XML for workflows in Azure Logic Apps](logic-apps-enterprise-integration-transform.md)
- [B2B enterprise integration workflows with Azure Logic Apps](logic-apps-enterprise-integration-overview.md)
- [What is Azure Logic Apps](logic-apps-overview.md)
