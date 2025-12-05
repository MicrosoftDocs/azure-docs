---
title: Add Metadata to Find B2B Artifacts in Workflows
description: Learn to add metadata for B2B artifacts such as trading partners, agreements, schemas, and maps in integration accounts. Find artifacts using this metadata in workflows for Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 12/03/2025
ms.custom: sfi-image-nochange
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to add custom metadata for B2B artifacts in an integration account so my workflow can more easily find the correct artifacts to use.
---

# Add metadata to find B2B artifacts in workflows for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To help your workflow quickly find the correct business-to-business (B2B) artifacts to use at runtime, you can add custom metadata as key-value pairs to artifacts such as trading partners, agreements, schemas, and maps. Custom metadata for artifacts help you accomplish the following goals or tasks:

- Enforce naming conventions.
- Support reuse and avoid duplicate definitions.
- Route payloads to the correct encode or decode steps.
- Provide more control over moving artifacts through development, test, and production.
- Apply the correct validation or transformation without hardcoded logic.
- Facilitate tracking, traceability, governance, and auditing.
- Ease migration from BizTalk Server to Azure Logic Apps.

The following list describes example useful metadata, based on artifact type:

| Artifact | Metadata |
|----------|----------|
| Partner | - Business identity such as AS2, X12, or EDIFACT <br>- Trading name <br>- Contact and support information <br>- Certificate thumbprints <br>- Allowed protocols <br>- Expected acknowledgments such as MDN, TA1, or 997 |
| Agreement | - Host and guest partners <br>- Encryption or signature policies <br>- Retry and timeout rules <br>- Content type <br>- Batching settings <br>- Acknowledgment behavior |
| Schemas and maps | - Message type <br>- Version <br>- Namespace <br>- Source control URL <br>- Change notes <br>- Compatibility matrix for which agreements or workflows consume these artifacts |

For tracking purposes and feeding B2B tracking tables or dashboards, useful metadata includes correlation properties such as interchange number, group number, transaction set ID as well as workflow run ID, partner and agreement IDs, status, and timestamps.

This guide shows how to add metadata to an artifact in an integration account, find the artifact using the **Integration Account** built-in action named **Integration account artifact lookup**, and reference the artifact metadata in your workflow.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The logic app resource and workflow where you want to get and use the artifact metadata.

  Your workflow can start with any trigger and needs an action that works with the metadata after retrieval. This example uses the **Request** trigger named **When an HTTP request is received**, which can dynamically pass in the artifact name from an incoming HTTPS request.

  For more information, see:

  - [Create a Consumption workflow in Azure Logic Apps](quickstart-create-example-consumption-workflow.md)

  - [Create a Standard workflow in Azure Logic Apps](create-single-tenant-workflows-azure-portal.md)

- An [integration account resource](enterprise-integration/create-integration-account.md) that contains the artifacts where you want to add metadata.

  You can add custom metadata to the following artifacts:

  - [Partner](logic-apps-enterprise-integration-partners.md)
  - [Agreement](logic-apps-enterprise-integration-agreements.md)
  - [Schema](logic-apps-enterprise-integration-schemas.md)
  - [Map](logic-apps-enterprise-integration-maps.md)

  This guide's example uses a partner artifact named **TradingPartner1**.

  - Both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

  - Before you start working with the **Integration account artifact lookup** action, you must [link your Consumption logic app](enterprise-integration/create-integration-account.md?tabs=consumption#link-account) or [link your Standard logic app](enterprise-integration/create-integration-account.md?tabs=standard#link-account) to the integration account. You can link an integration account to multiple Consumption or Standard logic app resources to share the same artifacts.

## Add metadata to an artifact

Follow these steps to add custom metadata for a B2B artifact in your integration account.

1. In the [Azure portal](https://portal.azure.com), go to your integration account resource.

1. On the resource sidebar, under **Settings**, select the artifact category.

   This example adds metadata to a trading partner artifact, so in this scenario, the example selects **Partners**.

1. On the artifact category page, select the artifact, then select **Edit**. 

   The following example shows the edit page for a partner artifact named **TradingPartner1**.

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/edit-partner-metadata.png" alt-text="Screenshot shows Azure portal, integration account, and Partners page with TradingPartner1 and Edit button selected.":::

1. Under **Metadata**, in the **Key** and **Value** columns, enter your custom metadata as a key-value pair. When you're done, select **OK**.

   The following example shows sample metadata as key-value pairs:

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/add-partner-metadata.png" alt-text="Screenshot shows the Edit pane for TradingPartner1 with three key-value pairs highlighted and OK selected.":::

1. To view this metadata in the JavaScript Object Notation (JSON) definition for the artifact, next to **Edit**, select **Edit as JSON** instead.

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/partner-metadata.png" alt-text="Screenshot shows the JSON code for TradingPartner1 with three key-value pairs highlighted.":::

## Find the artifact

Follow these steps to find the artifact and associated metadata in your integration account. The example looks up a specific trading partner artifact.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource. Open the workflow in the designer.

1. In the designer, follow these [general steps](create-workflow-with-trigger-or-action.md#add-action) to add the **Integration Account** built-in action named **Integration account artifact lookup**, which finds the specified artifact and metadata.

1. Provide the following information for the artifact, based on your workflow type:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | - Consumption: **artifactName** <br><br>- Standard: **Artifact name** | Yes | <*artifact-name*> | The artifact name, which you can enter as a hardcoded name or as dynamic output from the trigger or previous action in the workflow. |
   | - Consumption: **artifactType** <br><br>- Standard: **Artifact type** | Yes | **Agreement**, **Map**, **Partner**, or **Schema** | The artifact type. |

   1. To provide the artifact name as output from the trigger or previous action, follow these steps:
   
      1. Select inside the **artifactName** or **Artifact name** box, then select the lightning icon to open the dynamic content list.

      1. In the dynamic list, under the trigger or action name, select the output that specifies the artifact name.

   1. For **artifactType** or **Artifact type**, select the artifact type. In this example, the type is **Partner**.

      :::image type="content" source="media/logic-apps-enterprise-integration-metadata/artifact-lookup-information.png" alt-text="Screenshot shows the Integration Account Artifact Lookup action with the artifact type and artifact name parameters highlighted." lightbox="media/logic-apps-enterprise-integration-metadata/artifact-lookup-information.png":::

1. Save your workflow.

## Reference artifact metadata in workflow

Follow these steps to use the retrieved artifact metadata in your workflow. The example references the metadata from the retrieved artifact in the previous section.

1. In the designer, under the **Integration account artifact lookup** action, follow these [general steps](create-workflow-with-trigger-or-action.md#add-action) to add the action you want.

   This example continues with the **HTTP** built-in action, which sends an HTTP request from the workflow to a specified destination.

1. In the action pane, provide information about how you want to use the artifact metadata.

   This example uses the `routingUrl` metadata as the HTTP request destination. The following table specifies sample values for the **HTTP** action in this example:

   | Parameter | Required | Value | Description | Example value |
   |-----------|----------|-------|-------------|---------------|
   | **URI** | Yes | <*destination-URL*> | The endpoint URL for where you want to send the request. | To reference the partner's `routingUrl` metadata, follow these steps: <br><br>1. Select inside the **URI** box. <br><br>2. Select the function icon to open the expression editor. <br><br>3. In the editor, enter an expression like the following example, based on your workflow type:<br><br>**Consumption**<br><br>`outputs('Integration_Account_Artifact_Lookup')?['properties']?['metadata']['routingUrl']` <br><br>**Standard**<br><br>`outputs('Integration_account_artifact_lookup')?['properties']?['metadata']['routingUrl']` <br><br>4. When you're done, select **Add**. |
   | **Method** | Yes | <*HTTP-method*> | The HTTP operation to run. | This example uses the **GET** operation. |
   | **Headers** | No | <*header-values*> | Any header outputs from the trigger to pass through the **HTTP** action. | To pass in the `Content-Type` value from the trigger header, under **Headers**, follow these steps for the first row: <br><br>1. In the first column, enter `Content-Type` as the header name. <br><br>2. In the second column, use the expression editor to enter the following expression as the header value: <br><br>`triggeroutputs()?['headers']['Content-Type']` <br><br>To pass in the `Host` value from the trigger header, under **Headers**, follow these steps for the second row: <br><br>1. In the first column, enter `Host` as the header name. <br><br>2. In the second column, use the expression editor to enter the following expression as the header value: <br><br>`triggeroutputs()?['headers']['Host']` |
   | **Body** | No | <*body-content*> | Any other content to pass through the **HTTP** action's `body` property. | To pass the artifact's `properties` values to the **HTTP** action, follow these steps: <br><br>1. Select inside the **Body** box, then select the lightning icon to open the dynamic content list. If no outputs appear, select **See more**. <br><br>2. From the dynamic content list, under **Integration Account Artifact Lookup**, select **Properties**. |

   For the example scenario, the **HTTP** action uses the following sample values:

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/add-http-action-values.png" alt-text="Screenshot shows the designer, HTTP action, and HTTP action information pane with example values highlighted." lightbox="media/logic-apps-enterprise-integration-metadata/add-http-action-values.png":::

1. To confirm the information in the HTTP action, view your workflow's underlying JSON definition. On the designer toolbar, select **Code view**.

   The workflow's underlying JSON definition appears, for example:

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/finished-http-action-definition.png" alt-text="Screenshot shows the JSON definition for the HTTP action with the body, headers, method, and URI properties highlighted." lightbox="media/logic-apps-enterprise-integration-metadata/finished-http-action-definition.png":::

1. Return to the designer. On the code view toolbar, select **Designer**.

   Any expressions that you entered in the designer now appear resolved, for example:

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/resolved-expressions.png" alt-text="Screenshot of the designer with the URI, Headers, and Body expressions now resolved.":::

## Related content

- [Add agreements between partners](logic-apps-enterprise-integration-agreements.md)
