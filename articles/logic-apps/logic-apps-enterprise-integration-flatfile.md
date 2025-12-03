---
title: Encode or Decode XML in Flat Files
description: Learn to exchange XML by encoding or decoding flat files for business-to-business (B2B) integrations using workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 12/02/2025
ms.custom: sfi-image-nochange
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to exchange XML content between trading partners in B2B workflows.
---

# Encode and decode XML content in flat files for workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

When you exchange XML content with a trading partner in a business-to-business (B2B) integration, you must often encode the content before you send it. When you receive encoded XML content, you must decode that content before you can use it.

This guide shows how to encode and decode XML in your workflows by using the **Flat File** built-in connector actions and a flat file schema.

## Connector technical reference

The **Flat File** encoding and decoding actions are available for Consumption logic app workflows and Standard logic app workflows.

| Logic app | Environment |
|-----------|-------------|
| Consumption | Multitenant Azure Logic Apps |
| Standard | Single-tenant Azure Logic Apps, App Service Environment v3 (Windows plans only), and hybrid deployment |

For more information, see [Integration account built-in connectors](../connectors/built-in.md#b2b-built-in-operations).

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The logic app resource and workflow where you want to use the **Flat File** operations.

  **Flat File** operations don't include any triggers. Your workflow can start with any trigger or use any action to bring in the source XML.
  
  The examples in this article use the **Request** trigger named **When an HTTP request is received**.

  For more information, see:

  - [Create a Consumption logic app workflow using the Azure portal](quickstart-create-example-consumption-workflow.md)

  - [Create a Standard logic app workflow using the Azure portal](create-single-tenant-workflows-azure-portal.md)

- An [integration account resource](enterprise-integration/create-integration-account.md) to define and store artifacts for enterprise integration and B2B workflows.

  - Both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

  - Before you start working with **Flat File** operations, you must [link your Consumption logic app](enterprise-integration/create-integration-account.md?tabs=consumption#link-account) or [link your Standard logic app](enterprise-integration/create-integration-account.md?tabs=standard#link-account) to the integration account for working with artifacts such as trading partners and agreements. You can link an integration account to multiple Consumption or Standard logic app resources to share the same artifacts.

  > [!TIP]
  >
  > If you're not working with B2B artifacts such as trading partners and agreements in Standard workflows, you might not need an integration account. Instead, you can upload schemas directly to your Standard logic app resource. Either way, you can use the same schema across all child workflows in the same logic app resource. To use the same schema across multiple logic app resources, you must use and link an integration account.

- A flat file schema that specifies how to encode or decode XML content.

  In Standard workflows, **Flat File** operations let you select a schema from a linked integration account or that you previously uploaded to your logic app, but not both.

  For more information, see [Add schemas to integration accounts](logic-apps-enterprise-integration-schemas.md).

[!INCLUDE [api-test-http-request-tools-bullet](../../includes/api-test-http-request-tools-bullet.md)]

## Limitations

- XML content that you want to decode must be encoded in UTF-8 format.

- In your flat file schema, make sure the contained XML groups don't have excessive numbers of the `max count` property set to a value *greater than 1*. Avoid nesting an XML group with a `max count` property value greater than 1 inside another XML group with a `max count` property greater than 1.

- When Azure Logic Apps parses the flat file schema, and when the schema allows the choice of the next fragment, Azure Logic Apps generates a *symbol* and a *prediction* for that fragment. If the schema allows too many constructs, for example, more than 100,000, the schema expansion becomes very large, which consumes too much resources and time.

## Upload schema

After you create your schema, upload the schema based on your workflow:

- Consumption: [Add schemas to integration accounts for Consumption workflows](logic-apps-enterprise-integration-schemas.md?tabs=consumption#add-schema)

- Standard: [Add schemas to integration accounts for Standard workflows](logic-apps-enterprise-integration-schemas.md?tabs=standard#add-schema)

## Add a flat file encoding action

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. In the designer, open your workflow.

   If your workflow doesn't have a trigger or any other actions that your workflow needs, add those operations first.

   This example uses the **Request** trigger named **When an HTTP request is received**. To add a trigger, see [Add a trigger to start your workflow](add-trigger-action-workflow.md#add-trigger).

1. In the designer, follow these [general steps](add-trigger-action-workflow.md#add-action) to add the built-in action named **Flat File Encoding**.

   The action information pane opens with the **Parameters** tab selected.

1. In the action's **Content** parameter, provide the XML content to encode, which is either output from the trigger or from a previous action, by following these steps:

   1. Select inside the **Content** box, then select the lightning icon to open the dynamic content list.

   1. From the dynamic content list, select the XML content to encode.
   
   The following example shows the opened dynamic content list, the output from the **When an HTTP request is received** trigger, and the selected **Body** content from the trigger output.

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/select-content-to-encode.png" alt-text="Screenshot shows the Azure portal, workflow designer, Flat File Encoding action, and Content parameter with dynamic content list and content selected for encoding." lightbox="./media/logic-apps-enterprise-integration-flatfile/select-content-to-encode.png":::

   > [!NOTE]
   >
   > If **Body** doesn't appear in the dynamic content list, next to the **When an HTTP request is received** section label, select **See more**. You can also directly enter the content to encode in the **Content** box.

1. From the **Schema Name** list, select your schema.

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/select-encoding-schema.png" alt-text="Screenshot shows the designer and opened Schema Name list with selected schema for encoding." lightbox="./media/logic-apps-enterprise-integration-flatfile/select-encoding-schema.png":::

   > [!NOTE]
   >
   > If the schema list is empty, the cause might be:
   >
   > - The logic app resource isn't linked to an integration account.
   > - The linked integration account doesn't contain any schema files.
   > - The logic app resource doesn't contain any schema files. This reason applies only to Standard logic apps.

1. To add other optional parameters to the action, select those parameters from the **Advanced parameters** list.

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Mode of empty node generation** | **ForcedDisabled** or **HonorSchemaNodeProperty** or **ForcedEnabled** | The mode to use for empty node generation with flat file encoding. <br><br>For BizTalk, the flat file schema has a property that controls empty node generation. You can follow the empty node generation property behavior for your flat file schema. Alternatively, you can use this setting to have Azure Logic Apps generate or omit empty nodes. For more information, see [Tags for empty elements](https://www.w3.org/TR/xml/#dt-empty). |
   | **XML Normalization** | **Yes** or **No** | The setting to enable or disable XML normalization in flat file encoding. For more information, see [XmlTextReader.Normalization](/dotnet/api/system.xml.xmltextreader.normalization). |

1. Save your workflow. On the designer toolbar, select **Save**.

## Add a flat file decoding action

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. In the designer, open your workflow.

   If your workflow doesn't have a trigger or any other actions that your workflow needs, add those operations first.

   This example uses the **Request** trigger named **When an HTTP request is received**. To add a trigger, see [Add a trigger to start your workflow](add-trigger-action-workflow.md#add-trigger).

1. In the designer, follow these [general steps](add-trigger-action-workflow.md#add-action) to add the built-in action named **Flat File Decoding**.

1. In the action's **Content** parameter, provide the XML content to decode, either as output from the trigger or from a previous action by following these steps:

   1. Select inside the **Content** box, then select the lightning icon to open the dynamic content list.

   1. From the dynamic content list, select the XML content to decode.
   
   The following example shows the opened dynamic content list, the output from the **When an HTTP request is received** trigger, and the selected **Body** content from the trigger output.

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/select-content-to-decode.png" alt-text="Screenshot shows the Azure portal, workflow designer, Flat File Decoding action, and Content parameter with dynamic content list and content selected for decoding." lightbox="./media/logic-apps-enterprise-integration-flatfile/select-content-to-decode.png":::

   > [!NOTE]
   >
   > If **Body** doesn't appear in the dynamic content list, select **See more** next to the **When an HTTP request is received** section label. You can also directly enter the content to decode in the **Content** box.

1. From the **Schema Name** list, select your schema.

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/select-decoding-schema.png" alt-text="Screenshot shows the designer and opened Schema Name list with selected schema for decoding." lightbox="./media/logic-apps-enterprise-integration-flatfile/select-decoding-schema.png":::

   > [!NOTE]
   >
   > If the schema list is empty, the cause might be:
   >
   > - The logic app resource isn't linked to an integration account.
   > - The linked integration account doesn't contain any schema files.
   > - The logic app resource doesn't contain any schema files. This reason applies only to Standard logic apps.

1. Save your workflow. On the designer toolbar, select **Save**.

You're now done with setting up your flat file decoding action. In a real world app, you might want to store the decoded data in a line-of-business (LOB) app, such as Salesforce. Or, you can send the decoded data to a trading partner. To send the output from the decoding action to Salesforce or to your trading partner, use the other connectors available in Azure Logic Apps:

- [Managed connectors in Azure Logic Apps](../connectors/managed.md)
- [Built-in connectors in Azure Logic Apps](../connectors/built-in.md)

## Test your workflow

To trigger your workflow, follow these steps:

1. In the **Request** trigger, find the **HTTP POST URL** parameter, and copy the URL.

1. Open your HTTP request tool and use its instructions to send an HTTP request to the copied URL, including the method that the **Request** trigger expects.

   This example uses the `POST` method with the URL.

1. Include the XML content that you want to encode or decode in the request body.

1. After your workflow finishes running, go to the workflow's run history, and examine the **Flat File** action's inputs and outputs.

## Related content

- [Process XML messages and flat files in Azure Logic Apps](logic-apps-enterprise-integration-xml.md)



