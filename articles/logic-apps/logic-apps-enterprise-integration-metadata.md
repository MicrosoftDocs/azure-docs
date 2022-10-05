---
title: Manage integration account artifact metadata
description: Add or get artifact metadata from integration accounts in Azure Logic Apps with Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/7/2022
#Customer intent: As a Logic Apps user, I want to define custom metadata for integration account artifacts so that my logic app can use that metadata.
---

# Manage artifact metadata in integration accounts with Azure Logic Apps and Enterprise Integration Pack

You can define custom metadata for artifacts in integration accounts 
and get that metadata during runtime for your logic app to use. 
For example, you can provide metadata for artifacts, such as partners, 
agreements, schemas, and maps. All these artifact types store metadata by using key-value pairs. 

In this how-to guide, you add metadata to an integration account artifact. Then you add steps to a logic app to retrieve and use the metadata values.

## Prerequisites

* An Azure subscription. If you don't have a subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* A basic [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
that has the artifacts where you want to add metadata, for example: 

  * [Partner](logic-apps-enterprise-integration-partners.md)
  * [Agreement](logic-apps-enterprise-integration-agreements.md)
  * [Schema](logic-apps-enterprise-integration-schemas.md)
  * [Map](logic-apps-enterprise-integration-maps.md)

* A logic app that's linked to the integration account with the artifact metadata that you want to use.
  * If you don't have a logic app, learn [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md).
  * If you have a logic app that's not linked to an integration account, learn [how to link logic apps to integration accounts](logic-apps-enterprise-integration-create-integration-account.md#link-account). 

* A trigger in your logic app, such as **Request** or **HTTP**, or an action that you can use to manage artifact metadata.

## Add metadata to artifacts

1. Sign in to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> 
with your Azure account credentials. Find and open your integration account.

1. Select the artifact where you want to add metadata, and then select **Edit**. 

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/edit-partner-metadata.png" alt-text="Screenshot of the Partners page of an integration account in the Azure portal. A partner named TradingPartner1 and Edit are called out.":::

1. In the **Edit** window, enter the metadata details for that artifact, and then select **OK**. For example, see the following screenshot:

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/add-partner-metadata.png" alt-text="Screenshot of the Edit page for TradingPartner1. Under Metadata, three key-value pairs are called out. The OK button is also called out.":::

1. To view this metadata in the JavaScript Object Notation (JSON) 
definition for the integration account, select **Edit as JSON** 
so that the JSON editor opens: 

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/partner-metadata.png" alt-text="Screenshot of the JSON code that contains information about TradingPartner1. Under the metadata line, three key-value pairs are called out.":::

## Get artifact metadata

1. In the Azure portal, open the logic app that's 
linked to your integration account. 

1. In the Logic app designer, decide where to add a step to get the metadata. This step often follows a trigger.
   - To add the new step to the end of the workflow, select **New step**.
   - To add the new step before the end of the workflow, hover over the place where you'd like to insert the step. Select the **plus sign (+)** that appears, and then select **Add an action**.

1. In the search box, enter **integration account**. 
Under the search box, select **All**. From the actions list, 
select this action: **Integration Account Artifact Lookup - Integration Account**.

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/integration-account-artifact-lookup.png" alt-text="Screenshot of a new step in the Logic app designer. The search box, the All tab, and the Integration Account Artifact Lookup action are called out.":::

1. Provide the following information for the artifact that you want to find:

   | Property | Required | Value | Description | 
   |----------|---------|-------|-------------| 
   | **Artifact Type** | Yes | **Schema**, **Map**, **Partner**, **Agreement**, or a custom type | The type for the artifact you want | 
   | **Artifact Name** | Yes | <*artifact-name*> | The name for the artifact you want | 
   ||| 

   For example, you might want to get the metadata for a trading partner artifact. In that case, select **Partner** for the **Artifact Type**. For the **Artifact Name**, select the **name** trigger output from the dynamic content list. The following screenshot shows these values:

   :::image type="content" source="media/logic-apps-enterprise-integration-metadata/artifact-lookup-information.png" alt-text="Screenshot of the Logic app designer. In the Integration Account Artifact Lookup step, the Artifact Type and Artifact Name boxes are called out.":::

1. Add the action that you want for handling that metadata. For example, to use an **HTTP** action, follow these steps:

   1. Under the **Integration Account Artifact Lookup** action, select **New step**. 

   1. In the search box, enter **http**. Under the search box, 
   select **Built-in**, and then select this action: **HTTP - HTTP**.

      :::image type="content" source="media/logic-apps-enterprise-integration-metadata/http-action.png" alt-text="Screenshot of the Logic app designer. The search box of a new step contains http. That box, the Built-in tab, and an HTTP action are called out.":::

   1. Provide information for the artifact metadata that you want to manage. 

      For example, suppose you want to get the `routingUrl` metadata 
      that you added earlier. Here are the property 
      values that you might specify: 

      | Property | Required | Value | Description | Example value |
      |----------|----------|-------|-------------|-------|
      | **Method** | Yes | <*operation-to-run*> | The HTTP operation to run on the artifact. | This HTTP action uses the **GET** method. | 
      | **URI** | Yes | <*metadata-location*> | The endpoint where you want to send the outgoing request. | To access the `routingUrl` metadata value from the artifact that you retrieved, select the **URI** box. Then enter an expression like this one into the expression editor:<br><br>`outputs('Integration_Account_Artifact_Lookup')['properties']['metadata']['routingUrl']` | 
      | **Headers** | No | <*header-values*> | Any header outputs from the trigger that you want to pass into the HTTP action. | To pass in the `Content-Type` value from the trigger header, select the **Value** box of a **Headers** row. Then enter an expression like this one in the expression editor: `triggeroutputs()['headers']['Content-Type']`<br><br>To pass in the `Host` value from the trigger header, use an expression like this one in the expression editor: `triggeroutputs()['headers']['Host']` |
      | **Body** | No | <*body-content*> | Any other content that you want to pass through the HTTP action's `body` property. | To pass the artifact's `properties` values into the HTTP action:<br><br>1. Select the **Body** box to make the dynamic content list appear. If no properties appear, select **See more**.<br>2. From the dynamic content list, under **Integration Account Artifact Lookup**, select **Properties**. | 
      |||||

      The following screenshot shows the example values:

      :::image type="content" source="media/logic-apps-enterprise-integration-metadata/add-http-action-values.png" alt-text="Screenshot of an HTTP step in the designer. The Dynamic content Properties value is called out, along with the Method, URI, Headers, and Body boxes.":::

   1. To check the information you provided for the HTTP action, 
   view your logic app's JSON definition. On the Logic App 
   Designer toolbar, choose **Code view** so the app's JSON 
   definition appears, for example:

      ![Logic app JSON definition](media/logic-apps-enterprise-integration-metadata/finished-logic-app-definition.png)

      After you switch back to the Logic App Designer, 
      any expressions you used now appear resolved, 
      for example:

      ![Resolved expressions in Logic App Designer](media/logic-apps-enterprise-integration-metadata/resolved-expressions.png)

## Next steps

* [Learn more about agreements](logic-apps-enterprise-integration-agreements.md)
