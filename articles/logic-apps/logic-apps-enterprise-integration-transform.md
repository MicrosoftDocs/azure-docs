---
title: Transform XML for B2B enterprise integration
description: Transform XML using maps in Azure Logic Apps with Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/26/2021
---

# Transform XML for workflows in Azure Logic Apps

In enterprise integration business-to-business (B2B) scenarios, you might have to convert XML between formats. In Azure Logic Apps, your logic app workflow can transform XML using an Extensible Stylesheet Language Transformation (XSLT) map and the **Transform XML** action. A map is an XML document that describes how to convert data from XML to another format. This document consists of a source XML schema as input and a target XML schema as output.  You can use different built-in functions to help manipulate or control the data, including string manipulations, conditional assignments, arithmetic expressions, date time formatters, and even looping constructs.

For example, suppose you regularly receive B2B orders or invoices from a customer that uses the YearMonthDay date format (YYYYMMDD). However, your organization uses the MonthDayYear date format (MMDDYYYY). You can create and use a map that transforms the YearMonthDay format to the MonthDayYear format before storing the order or invoice details in your customer activity database.

After you [create a map](logic-apps-enterprise-integration-maps.md#create-maps) and confirm that the map works, you add this map to the integration account that's linked to your multi-tenant Consumption plan-based logic app or ISE plan-based logic app, or you can add that map directly to your single-tenant Standard plan-based logic app. For more information, review [Add XSLT maps for XML transformation in Azure Logic Apps](logic-apps-enterprise-integration-maps.md). Assuming that your workflow includes the **Transform XML** action, the action runs when your workflow is triggered and when XML content is available for transformation.

If you're new to logic apps, review the following documentation:

* [What is Azure Logic Apps - Resource type and host environments](logic-apps-overview.md#resource-type-and-host-environment-differences)

* [Create an integration workflow with single-tenant Azure Logic Apps (Standard)](create-single-tenant-workflows-azure-portal.md)

* [Create single-tenant logic app workflows](create-single-tenant-workflows-azure-portal.md)

* [Usage metering, billing, and pricing models for Azure Logic Apps](logic-apps-pricing.md)

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A logic app workflow that already starts with a trigger so that you can add the **Transform XML** action where necessary in your workflow.

* If you're using the **Logic App (Standard)** resource type, you don't need an integration account. Instead, you can add maps directly to your logic app resource in either the Azure portal or Visual Studio Code. Only XSLT 1.0 is currently supported. You can then use these maps across multiple workflows within the *same logic app resource*.

* If you're using the **Logic App (Consumption)** resource type, you need to have an [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) where you can store your maps and other artifacts to use in enterprise integration and business-to-business (B2B) solutions. This resource has to meet the following requirements:

  * Is associated with the same Azure subscription as your logic app resource.

  * Exists in the same location or Azure region as your logic app resource where you plan to use the **Transform XML** action.

  * Is [linked](logic-apps-enterprise-integration-create-integration-account.md#link-account) to your logic app resource where you want to use the **Transform XML** action.

## Add Transform XML action

1. In the [Azure portal](https://portal.azure.com), open your logic app and workflow in designer view.

1. If you have a blank logic app that doesn't have a trigger, add any trigger you want. This example uses the Request trigger. Otherwise, continue to the next step.

   To add the Request trigger, in the designer search box, enter `HTTP request`, and select the Request trigger named **When an HTTP request is received**.

1. Under the step in your workflow where you want to add the **Transform XML** action, choose one of the following steps:

   For a Consumption or ISE plan-based logic app, choose a step:

   * To add the **Transform XML** action at the end of your workflow, select **New step**.

   * To add the **Transform XML** action between existing steps, move your pointer over the arrow that connects those steps so that the plus sign (**+**) appears. Select that plus sign, and then select **Add an action**.

   For a Standard plan-based logic app, choose a step:

   * To add the **Transform XML** action at the end of your workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the **Transform XML** action between existing steps, select the plus sign (**+**) that appears between those steps, and then select **Add an action**.

1. Under **Choose an operation**, select **Built-in**. In the search box, enter `transform xml`. From the actions list, select **Transform XML**.

1. To specify the XML content for transformation, you can use any XML data you receive in the HTTP request. Click inside the **Content** box so that the dynamic content list appears.

   The dynamic content list shows property tokens that represent the outputs from the previous steps in the workflow. If the list doesn't show an expected property, check the trigger or action heading in the list and whether you can select **See more**.

   For a Consumption or ISE plan-based logic app, the designer looks like this example:

   ![Screenshot showing multi-tenant designer with opened dynamic content list, cursor in "Content" box, and opened dynamic content list.](./media/logic-apps-enterprise-integration-transform/open-dynamic-content-list-multi-tenant.png)

   For a Standard plan-based logic app, the designer looks like this example:

   ![Screenshot showing single-tenant designer with opened dynamic content list, cursor in "Content" box, and opened dynamic content list](./media/logic-apps-enterprise-integration-transform/open-dynamic-content-list-single-tenant.png)

1. From the dynamic content list, select the property token for the content you want to validate.

   This example selects the **Body** token from the trigger.

   > [!NOTE]
   > Make sure that the content you select is XML. If the content is not XML or is base64-encoded, you must specify an expression 
   > that processes the content. For example, you can use [expression functions](workflow-definition-language-functions-reference.md), 
   > such as `base64ToBinary()` to decode content or `xml()` to process the content as XML.

1. To specify the map to use for transformation, open the **Map** list, and select the map that you previously added.

1. When you're done, make sure to save your logic app workflow.

   You're now finished setting up your **Transform XML** action. In a real world app, you might want to store the transformed data in a line-of-business (LOB) app such as SalesForce. To send the transformed output to Salesforce, add a Salesforce action.

1. To test your transformation action, trigger and run your workflow. For example, for the Request trigger, send a request to the trigger's endpoint URL.

## Advanced capabilities

### Reference assembly or custom code from maps

In **Logic App (Consumption)** workflows, the **Transform XML** action supports maps that reference an external assembly. For more information, review [Add XSLT maps for workflows in Azure Logic Apps](logic-apps-enterprise-integration-maps.md#add-assembly).

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