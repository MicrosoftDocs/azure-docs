---
title: Transform XML in enterprise integration workflows
description: Transform XML using maps in Azure Logic Apps with Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/08/2024
---

# Transform XML in workflows with Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

In enterprise integration business-to-business (B2B) scenarios, you might have to convert XML between formats. Your logic app workflow can transform XML by using the **Transform XML** action and a predefined [*map*](logic-apps-enterprise-integration-maps.md).

For example, suppose you regularly receive B2B orders or invoices from a customer that uses the YearMonthDay date format (YYYYMMDD). However, your organization uses the MonthDayYear date format (MMDDYYYY). You can create and use a map that transforms the YearMonthDay format to the MonthDayYear format before storing the order or invoice details in your customer activity database.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A logic app workflow that already starts with a trigger so that you can add the **Transform XML** action where necessary in your workflow.

* An [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and so on, for use in your enterprise integration and B2B workflows. This resource has to meet the following requirements:

  * Is associated with the same Azure subscription as your logic app resource.

  * Exists in the same location or Azure region as your logic app resource where you plan to use the **Transform XML** action.

  * If you're working on a [Consumption logic app resource and workflow](logic-apps-overview.md#resource-environment-differences), your integration account requires the following items:

    * The [map](logic-apps-enterprise-integration-maps.md) to use for transforming XML content.

    * A [link to your logic app resource](logic-apps-enterprise-integration-create-integration-account.md#link-account).

  * If you're working on a [Standard logic app resource and workflow](logic-apps-overview.md#resource-environment-differences), you can link your integration account to your logic app resource, upload maps directly to your logic app resource, or both, based on the following scenarios: 

    * If you already have an integration account with the artifacts that you need or want to use, you can link your integration account to multiple Standard logic app resources where you want to use the artifacts. That way, you don't have to upload maps to each individual logic app. For more information, review [Link your logic app resource to your integration account](logic-apps-enterprise-integration-create-integration-account.md?tabs=standard#link-account).

    * If you don't have an integration account or only plan to use your artifacts across multiple workflows within the *same logic app resource*, you can [directly add maps to your logic app resource](logic-apps-enterprise-integration-maps.md) using either the Azure portal or Visual Studio Code.

      > [!NOTE]
      > 
      > The Liquid built-in connector lets you select a map that you previously uploaded to your logic app resource or to a linked integration account, but not both.

    So, if you don't have or need an integration account, you can use the upload option. Otherwise, you can use the linking option. Either way, you can use these artifacts across all child workflows within the same logic app resource.

  You still need an integration account to store other artifacts, such as partners, agreements, and certificates, along with using the [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [EDIFACT](logic-apps-enterprise-integration-edifact.md) operations.

## Add Transform XML action

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app and workflow in the designer.

1. If you have a blank workflow that doesn't have a trigger, [follow these general steps to add any trigger you want](create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger). Otherwise, continue to the next step.

   This example uses the **Request** trigger.

1. Under the step in your workflow where you want to add the **Transform XML** action, [follow these general steps to add the action named **Transform XML**](create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. In the **Content** box, specify the XML content that you want to transform using any XML data that you receive in the HTTP request.

   1. To select outputs from previous operations in the workflow, in the **Transform XML** action, click inside the **Content** box, and select the dynamic content list option (lightning icon).

   1. From the dynamic content list, select the token for the content that you want to transform.

      ![Screenshot shows Standard workflow with opened dynamic content list.](./media/logic-apps-enterprise-integration-transform/open-dynamic-content-list-standard.png)

      This example selects the **Body** token from the trigger.

      > [!NOTE]
      >
      > Make sure that you select XML content. If the content isn't XML or is base64-encoded, 
      > you must specify an expression that processes the content. For example, you can use 
      > [expression functions](workflow-definition-language-functions-reference.md), 
      > such as `base64ToBinary()` to decode content or `xml()` to process the content as XML.

1. From the **Map Source** list, select the location where you uploaded your map, either your **LogicApp** resource or your **IntegrationAccount**.

1. From the **Map** list, select your map.

1. When you're done, save your workflow.

   You're now finished setting up your **Transform XML** action. In a real world app, you might want to store the transformed data in a line-of-business (LOB) app such as SalesForce. To send the transformed output to Salesforce, add a Salesforce action.

1. To test your transformation action, trigger and run your workflow. For example, for the Request trigger, send a request to the trigger's endpoint URL.

   The **Transform XML** action runs after your workflow is triggered and when XML content is available for transformation.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and workflow in the designer.

1. If you have a blank workflow that doesn't have a trigger, [follow these general steps to add any trigger you want](create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger). Otherwise, continue to the next step.

   This example uses the **Request** trigger.

1. Under the step in your workflow where you want to add the **Transform XML** action, [follow these general steps to add the action named **Transform XML**](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

1. In the **Content** box, specify the XML content that you want to transform using any XML data that you receive in the HTTP request.

   1. To select outputs from previous operations in the workflow, in the **Transform XML** action, click inside the **Content** box, which opens the dynamic content list.

   1. From the dynamic content list, select the token for the content that you want to transform.

   ![Screenshot shows Consumption workflow with opened dynamic content list and cursor in Content box.](./media/logic-apps-enterprise-integration-transform/open-dynamic-content-list-consumption.png)

      This example selects the **Body** token from the trigger.

      > [!NOTE]
      >
      > Make sure that you select XML content. If the content isn't XML or is base64-encoded, 
      > you must specify an expression that processes the content. For example, you can use 
      > [expression functions](workflow-definition-language-functions-reference.md), 
      > such as `base64ToBinary()` to decode content or `xml()` to process the content as XML.

1. From the **Map** list, select your map.

1. When you're done, save your workflow.

   You're now finished setting up your **Transform XML** action. In a real world app, you might want to store the transformed data in a line-of-business (LOB) app such as SalesForce. To send the transformed output to Salesforce, add a Salesforce action.

1. To test your transformation action, trigger and run your workflow. For example, for the Request trigger, send a request to the trigger's endpoint URL.

   The **Transform XML** action runs after your workflow is triggered and when XML content is available for transformation.

---

## Advanced capabilities

### Reference assemblies or call custom code from maps

The **Transform XML** action supports referencing external assemblies from maps, which enable directly calling custom .NET code from XSLT maps. For more information, see [Add XSLT maps for workflows in Azure Logic Apps](logic-apps-enterprise-integration-maps.md).

### Reference extension objects

In Standard workflows, the **Transform XML** action supports specifying an XML extension object to use with your map.

1. In the **Transform XML** action, open the **Advanced parameters** list, and select **XML Extension Object**, which adds the parameter to the action.

1. In the **XML Extension Object** box, specify your extension object, for example:

   :::image type="content" source="media/logic-apps-enterprise-integration-transform/xml-extension-object-standard.png" alt-text="Screenshot shows Transform XML action with XML Extension Object parameter and value." lightbox="media/logic-apps-enterprise-integration-transform/xml-extension-object-standard.png":::

### Byte order mark

By default, the response from the transformation starts with a byte order mark (BOM). You can access this functionality only when you work in the code view editor. To disable this functionality, set the `transformOptions` property to `disableByteOrderMark`:

```json
"Transform_XML": {
    "inputs": {
        "content": "@{triggerBody()}",
        "integrationAccount": {
            "map": {
                "name": "TestMap"
            }
        },
        "transformOptions": "disableByteOrderMark"
    },
    "runAfter": {},
    "type": "Xslt"
}
```

## Next steps

* [Add XSLT maps for XML transformation in Azure Logic Apps](logic-apps-enterprise-integration-maps.md)
* [Validate XML for workflows in Azure Logic Apps](logic-apps-enterprise-integration-xml-validation.md)
