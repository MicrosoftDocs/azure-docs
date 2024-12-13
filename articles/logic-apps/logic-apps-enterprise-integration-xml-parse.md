---
title: Parse XML using schemas
description: Learn how to parse XML documents using schemas in Standard workflows with Azure Logic Apps.
services: logic-apps
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 12/03/2024
---

# Parse XML using schemas in Standard workflows with Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In enterprise integration business-to-business (B2B) or BizTalk migration scenarios, you might have to parse XML documents. Your Standard logic app workflow can parse XML by using the action named **Parse XML with schema**, which requires an XSD schema.

For example, suppose you regularly receive customer orders or invoices that use XML as the exchange format and need to access individual XML elements in the workflow designer for Azure Logic Apps.

## Limitations

This action is currently not yet supported for the [Consumption logic app resource and workflow](logic-apps-overview.md#resource-environment-differences).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Standard logic app workflow that already starts with a trigger so that you can add the **Parse XML with schema** action to your workflow.

* An [integration account resource](enterprise-integration/create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and so on, for use in your enterprise integration and B2B workflows. This resource has to meet the following requirements:

  * Is associated with the same Azure subscription as your logic app resource.

  * Exists in the same location or Azure region as your logic app resource where you plan to use the **Parse XML with schema** action.

  * If you're working on a [Standard logic app resource and workflow](logic-apps-overview.md#resource-environment-differences), you can link your integration account to your logic app resource, upload XSD schemas directly to your logic app resource, or both, based on the following scenarios: 

    * If you already have an integration account with the artifacts that you need or want to use, you can link your integration account to multiple Standard logic app resources where you want to use the artifacts. That way, you don't have to upload XSD schemas to each individual logic app. For more information, review [Link your logic app resource to your integration account](enterprise-integration/create-integration-account.md?tabs=standard#link-account).

    * If you don't have an integration account or only plan to use your artifacts across multiple workflows within the *same logic app resource*, you can [directly add schemas to your logic app resource](logic-apps-enterprise-integration-schemas.md) using either the Azure portal or Visual Studio Code.
   
    So, if you don't have or need an integration account, you can use the upload option. Otherwise, you can use the linking option. Either way, you can use these artifacts across all child workflows within the same logic app resource.

  You still need an integration account to store other artifacts, such as partners, agreements, and certificates, along with using the [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [EDIFACT](logic-apps-enterprise-integration-edifact.md) operations.

* The XSD schema to use with the **Parse XML with schema** action. Make sure that this schema includes a root element, which looks like the following example:

   ```xml
   <xs:element name="Root">
      <....>
   </xs:element>
   ```

## Add a Parse XML with schema action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app and workflow in the designer.

1. If you have a blank workflow that doesn't have a trigger, [follow these general steps to add any trigger you want](create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger). Otherwise, continue to the next step.

   This example uses the **Request** trigger.

1. Under the step in your workflow where you want to add the **Parse XML with schema** action, [follow these general steps to add the action named **Parse XML with schema**](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. In the **Content** box, specify the XML content that you want to parse using any XML data that you receive in the HTTP request.

   1. To select outputs from previous operations in the workflow, in the **Parse XML with schema** action, select inside the **Content** box, and select the dynamic content list option (lightning icon).

   1. From the dynamic content list, select the token for the content that you want to parse.

      This example selects the **Body** token from the trigger.

      :::image type="content" source="media/logic-apps-enterprise-integration-xml-parse/open-dynamic-content-list-standard.png" alt-text="Screenshot shows Standard workflow with opened dynamic content list.":::

1. From the **Source** list, select the location where you uploaded your XSD schema, either your **LogicApp** resource or your **IntegrationAccount**.

1. From the **Name** list, select your XSD schema.

1. When you're done, save your workflow.

   You're now finished setting up your **Parse XML with schema** action. In a real-world app, you might want to store the parsed data in a line-of-business (LOB) app such as Salesforce. To send the parsed output to Salesforce, add a Salesforce action.

1. To test your parsing action, trigger and run your workflow. For example, for the **Request** trigger, send a request to the trigger's endpoint URL.

   The **Parse XML with schema** action runs after your workflow is triggered and when XML content is available for parsing.

## Advanced parameters

The following table describes the advanced parameters available in this action:

| Parameter | Value | Description |
|-----------|-------|-------------|
| **DTD Processing** | - **Ignore** <br>- **Parse** <br>- **Prohibit** | Specify how to handle the XML document type definition (DTD). |
| **Normalize XML** | **No** or **Yes** | Whether to normalize XML content. |
| **Ignore Whitespace?** | **No** or **Yes** | Whether to parse or ignore insignificant whitespace, such as spaces, tabs, and blank lines in XML documents. |
| **Ignore XML Processing Instructions?** | **No** or **Yes** | Whether to follow or ignore the XML processing instructions. | 
| **Ignore XML Attributes** | **No** or **Yes** | Whether to write or ignore XML attributes. |
| **Use Fully Qualified Names?** | **No** or **Yes** | Whether to use simpler local names or fully qualified XML names. |
| **Root Node Qualified Name** | <*root-node-qualified-name*> | The root node's qualified name in case the schema contains multiple unreferenced element definitions. |

## Related content
	
- [Compose XML with schema](logic-apps-enterprise-integration-xml-compose.md)
