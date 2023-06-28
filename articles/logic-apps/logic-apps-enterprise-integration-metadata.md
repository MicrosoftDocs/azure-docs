---
title: Manage artifact metadata in integration accounts
description: In Azure Logic Apps, retrieve metadata that you add to an integration account artifact. Use that metadata in a logic app workflow.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/12/2022
#Customer intent: As an Azure Logic Apps developer, I want to define custom metadata for integration account artifacts so that my logic app workflow can use that metadata.
---

# Manage artifact metadata in integration accounts for Azure Logic Apps

You can define custom metadata for artifacts in integration accounts and get that metadata during runtime for your logic app workflow to use. For example, you can provide metadata for artifacts, such as partners, agreements, schemas, and maps. All these artifact types store metadata as key-value pairs. 

This how-to guide shows how to add metadata to an integration account artifact. You can then use actions in your workflow to retrieve and use the metadata values.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An [integration account](logic-apps-enterprise-integration-create-integration-account.md) that has the artifacts where you want to add metadata. The artifacts can be the following types:

  * [Partner](logic-apps-enterprise-integration-partners.md)
  * [Agreement](logic-apps-enterprise-integration-agreements.md)
  * [Schema](logic-apps-enterprise-integration-schemas.md)
  * [Map](logic-apps-enterprise-integration-maps.md)

* The logic app workflow where you want to use the artifact metadata. Make sure that your workflow has at least a trigger, such as the **Request** or **HTTP** trigger, and the action that you want to use for working with artifact metadata. The example in this article uses the **Request** trigger named **When a HTTP request is received**.

  For more information, see the following documentation:

  * [Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps](quickstart-create-example-consumption-workflow.md)

  * [Create an example Standard logic app workflow in single-tenant Azure Logic Apps](create-single-tenant-workflows-azure-portal.md)

* Make sure to [link your integration account to your Consumption logic app resource](logic-apps-enterprise-integration-create-integration-account.md?tabs=azure-portal%2Cconsumption#link-account) or [to your Standard logic app workflow](logic-apps-enterprise-integration-create-integration-account.md?tabs=azure-portal%2Cstandard#link-account).

## Add metadata to artifacts

1. In the [Azure portal](https://portal.azure.com), go to your integration account.

1. Select the artifact where you want to add metadata, and then select **Edit**. 

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/edit-partner-metadata.png" alt-text="Screenshot of Azure portal, integration account, and 'Partners' page with 'TradingPartner1' and 'Edit' button selected.":::

1. On the **Edit** pane, enter the metadata details for that artifact, and then select **OK**. The following screenshot shows three metadata key-value pairs:

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/add-partner-metadata.png" alt-text="Screenshot of the 'Edit' pane for 'TradingPartner1'. Under 'Metadata', three key-value pairs are highlighted and 'OK' is selected.":::

1. To view this metadata in the integration account's JavaScript Object Notation (JSON) definition, select **Edit as JSON**, which opens the JSON editor.

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/partner-metadata.png" alt-text="Screenshot of the JSON code that contains information about 'TradingPartner1'. In the 'metadata' object, three key-value pairs are highlighted.":::

## Get artifact metadata

1. In the Azure portal, open the logic app resource that's linked to your integration account.

1. On the logic app navigation menu, select **Logic app designer**.

1. In the designer, add the **Integration Account Artifact Lookup** action to get the metadata.

   1. Under the trigger or an existing action, select **New step**.

   1. Under the **Choose an operation** search box, select **Built-in**. In the search box, enter **integration account**.

   1. From the actions list, select the action named **Integration Account Artifact Lookup**.

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/integration-account-artifact-lookup.png" alt-text="Screenshot of the designer for a Consumption logic app workflow with the 'Integration Account Artifact Lookup' action selected.":::

1. Provide the following information for the artifact that you want to find:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Artifact Type** | Yes | **Schema**, **Map**, **Partner**, **Agreement**, or a custom type | The type for the artifact you want to get |
   | **Artifact Name** | Yes | <*artifact-name*> | The name for the artifact you want to get |

   This example gets the metadata for a trading partner artifact by following these steps:

   1. For **Artifact Type**, select **Partner**.

   1. For **Artifact Name**, click inside the edit box. When the dynamic content list appears, select the **name** output from the trigger.

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/artifact-lookup-information.png" alt-text="Screenshot of the 'Integration Account Artifact Lookup' action with the 'Artifact Type' and 'Artifact Name' properties highlighted.":::

1. Now, add the action that you want to use for using the metadata. This example continues with the built-in **HTTP** action.

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/http-action.png" alt-text="Screenshot of the designer search box with 'http' entered, the 'Built-in' tab highlighted, and the HTTP action selected.":::

1. Provide the following information for the artifact metadata that you want the HTTP action to use.

   For example, suppose you want to get the `routingUrl` metadata that you added earlier. Here are the property values that you might specify: 

   | Property | Required | Value | Description | Example value |
   |----------|----------|-------|-------------|---------------|
   | **Method** | Yes | <*operation-to-run*> | The HTTP operation to run on the artifact. | Use the **GET** method for this HTTP action. |
   | **URI** | Yes | <*metadata-location*> | The endpoint where you want to send the outgoing request. | To reference the `routingUrl` metadata value from the artifact that you retrieved, follow these steps: <br><br>1. Click inside the **URI** box. <br><br>2. In the dynamic content list that opens, select **Expression**. <br><br>3. In the expression editor, enter an expression like the following example:<br><br>`outputs('Integration_Account_Artifact_Lookup')['properties']['metadata']['routingUrl']` <br><br>4. When you're done, select **OK**. |
   | **Headers** | No | <*header-values*> | Any header outputs from the trigger that you want to pass to the HTTP action. | To pass in the `Content-Type` value from the trigger header, follow these steps for the first row under **Headers**: <br><br>1. In the first column, enter `Content-Type` as the header name. <br><br>2. In the second column, use the expression editor to enter the following expression as the header value: <br><br>`triggeroutputs()['headers']['Content-Type']` <br><br>To pass in the `Host` value from the trigger header, follow these steps for the second row under **Headers**: <br><br>1. In the first column, enter `Host` as the header name. <br><br>2. In the second column, use the expression editor to enter the following expression as the header value: <br><br>`triggeroutputs()['headers']['Host']` |
   | **Body** | No | <*body-content*> | Any other content that you want to pass through the HTTP action's `body` property. | To pass the artifact's `properties` values to the HTTP action: <br><br>1. Click inside the **Body** box to open the dynamic content list. If no properties appear, select **See more**. <br><br>2. From the dynamic content list, under **Integration Account Artifact Lookup**, select **Properties**. |

   The following screenshot shows the example values:

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/add-http-action-values.png" alt-text="Screenshot of the designer with an HTTP action. Some property values are highlighted. The dynamic content list is open with 'Properties' highlighted.":::

1. To check the information that you provided for the HTTP action, you can view your workflow's JSON definition. On the designer toolbar, select **Code view**.

   The workflow's JSON definition appears, as shown in the following example:

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/finished-http-action-definition.png" alt-text="Screenshot of the HTTP action's JSON definition with the 'body', 'headers', 'method', and 'URI' properties highlighted.":::

1. On the code view toolbar, select **Designer**.

   Any expressions that you entered in the designer now appear resolved.

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/resolved-expressions.png" alt-text="Screenshot of the designer with the 'URI', 'Headers', and 'Body' expressions now resolved.":::

## Next steps

* [Learn more about agreements](logic-apps-enterprise-integration-agreements.md)
