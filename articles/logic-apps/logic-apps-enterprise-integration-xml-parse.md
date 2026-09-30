---
title: Parse XML using Schemas in Standard workflows
description: Learn how to parse XML documents by using schemas in Standard workflows with Azure Logic Apps. Discover how to work with individual XML elements in your workflows.
services: logic-apps
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 02/25/2026
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to parse XML documents by using an XSD schema so I can work with individual XML elements in my workflow.
---

# Parse XML by using schemas in Standard workflows with Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

In enterprise integration scenarios, such as business-to-business (B2B) or BizTalk migrations, you might need to parse XML documents. Standard logic app workflows in Azure Logic Apps can parse XML using the action named **Parse XML with schema**, which requires an XSD schema.

For example, suppose you regularly receive customer orders or invoices in XML format. Suppose you must access individual XML elements directly in the workflow designer for Azure Logic Apps.

## Limitations

The [Consumption logic app resource and workflow](logic-apps-overview.md#resource-environment-differences) doesn't support this action.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Standard logic app workflow that starts with a trigger so that you can add the **Parse XML with schema** action to your workflow.

- An [integration account resource](enterprise-integration/create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and other items, for use in your enterprise integration and B2B workflows. This resource must meet the following requirements:

  - Is associated with the same Azure subscription as your logic app resource.

  - Exists in the same location or Azure region as your logic app resource where you plan to use the **Parse XML with schema** action.

  - If you're working on a [Standard logic app resource and workflow](logic-apps-overview.md#resource-environment-differences), you can link your integration account to your logic app resource, upload XSD schemas directly to your logic app resource, or both, based on the following scenarios: 

    - If you already have an integration account with the artifacts that you need or want to use, you can link your integration account to multiple Standard logic app resources where you want to use the artifacts. You don't have to upload XSD schemas to each individual logic app. For more information, see [Link your logic app resource to your integration account](enterprise-integration/create-integration-account.md?tabs=standard#link-account).

    - If you don't have an integration account or only plan to use your artifacts across multiple workflows within the *same logic app resource*, you can [directly add schemas to your logic app resource](logic-apps-enterprise-integration-schemas.md) by using either the Azure portal or Visual Studio Code.

    - If you don't have or need an integration account, you can use the upload option. Otherwise, use the linking option. Either way, you can use these artifacts across all child workflows within the same logic app resource.

    You still need an integration account to store other artifacts, such as partners, agreements, and certificates, if you use the [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [EDIFACT](logic-apps-enterprise-integration-edifact.md) operations.

- The XSD schema to use with the **Parse XML with schema** action. Make sure that this schema includes a root element, which looks like the following example:

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

1. In the **Content** box, specify the XML content that you want to parse by using any XML data that you receive in the HTTP request.

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

## Troubleshoot problems

This section describes problems that you might encounter and possible solutions or workarounds to address these problems.

### XML element order isn't preserved

If your XML has repeating elements that appear in mixed order, the **Parse XML with schema** action might not preserve the original order and groups these elements by their name in alphabetical order.

This behavior is expected because the **Parse XML with schema** action converts the XML to JSON. This format doesn't have a way to represent a single ordered list with different types of items. Instead, the action groups the elements by name in alphabetical order.

For example, suppose you have items with the following names in this specific order: `A`, `B`, `B`, `A`:

**Before**

```xml
<Items>
   <A>1</A>
   <B>2</B>
   <A>3</A>
   <B>4</B>
</Items>
```

After the action parses the XML, the resulting JSON groups and reorders these items by name as follows: `A`, `A`, `B`, and `B`:

**After**

```json
{
   "A": ["1", "3"],
   "B": ["2", "4"]
}
```

The **Parse XML with schema** action doesn't have any setting that preserves the order of mixed repeating elements. This limitation results from converting XML to JSON.

The following list describes options for you to fix or work around this problem:

- If you control the schema, design the schema so you have only one repeating list without multiple repeating element types.

  For example, rather than separately repeat `A` and `B`, use a single repeating wrapper element, such as `Item`. Each item then indicates whether `A` or `B` is represented. The system can then keep all the items in a single ordered list and preserve the original order. This option is best for long-term, predictable behavior.

- If the original order is required or critical, don't parse the XML.

  - Avoid breaking up the XML into JSON.
  - Handle the XML document as a whole.
  - Pass the XML document unchanged or transform the content by using XML-based tools such as XSLT.

- Keep this limitation in mind.

  If you can't change the schema or workflow, remember the following:

  - Mixed repeating elements are grouped by element name, losing the original order.
  - Design the downstream logic with this behavior in mind.

## Related content

- [Compose XML with schema](logic-apps-enterprise-integration-xml-compose.md)
