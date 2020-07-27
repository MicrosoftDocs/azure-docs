---
title: Convert JSON and XML with Liquid templates
description: Transform JSON and XML by using Liquid templates as maps in Azure Logic Apps
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, logicappspm
ms.topic: article
ms.date: 07/25/2020

# Customer intent: As a developer, I want to convert JSON and XML by using Liquid templates as maps in Azure Logic Apps
---

# Transform JSON and XML using Liquid templates as maps in Azure Logic Apps

You can perform basic JSON transformations in your logic apps by using native data operation actions such as **Compose** or **Parse JSON**. To perform advanced JSON transformations, you can create templates, which you use as maps, with [Liquid](https://shopify.github.io/liquid/), which is an open-source template language for flexible web apps. A Liquid template defines how to transform JSON output and supports more complex JSON transformations, such as iterations, control flows, variables, and so on.

Before you can perform a Liquid transformation in your logic app, you must first create a Liquid template that defines the JSON to JSON mapping and [upload the template as a map in your integration account](../logic-apps/logic-apps-enterprise-integration-maps.md). When you add the **Transform JSON to JSON - Liquid** action to your logic app, you can select this map for the action to use. This article shows you how to create a Liquid template, upload the template to your integration account, add the Liquid transform action to your logic app, and select the template that you want to use.

## Prerequisites

* An Azure subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* A basic [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md)

* Basic knowledge about [Liquid template language](https://shopify.github.io/liquid/)

  > [!NOTE]
  > The **Transform JSON to JSON - Liquid** action uses the 
  > [DotLiquid implementation for Liquid](http://dotliquidmarkup.org/) 
  > and in specific cases, differs from the [Shopify implementation for Liquid](https://shopify.github.io/liquid). 
  > For more information, see [Liquid template considerations](#template-considerations).

## Create the template

1. Create the Liquid template that you use as a map for the JSON transformation. You can use any editing tool that you want.

   For this example, create the sample Liquid template as described in this section:

   ```json
   {%- assign deviceList = content.devices | Split: ', ' -%}

   {
      "fullName": "{{content.firstName | Append: ' ' | Append: content.lastName}}",
      "firstNameUpperCase": "{{content.firstName | Upcase}}",
      "phoneAreaCode": "{{content.phone | Slice: 1, 3}}",
      "devices" : [
         {%- for device in deviceList -%}
            {%- if forloop.Last == true -%}
            "{{device}}"
            {%- else -%}
            "{{device}}",
            {%- endif -%}
         {%- endfor -%}
      ]
   }
   ```

1. Save the template by using the `.liquid` extension. This example uses `SimpleJsonToJsonTemplate.liquid`.

## Upload the template

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account credentials.

1. In the Azure portal search box, enter `integration accounts`, and select **Integration accounts**.

   ![Find "Integration accounts"](./media/logic-apps-enterprise-integration-liquid-transform/find-integration-accounts.png)

1. Find and select your integration account.

   ![Select integration account](./media/logic-apps-enterprise-integration-liquid-transform/select-integration-account.png)

1. On the **Overview** pane, under **Components**, select **Maps**.

    ![Select "Maps" tile](./media/logic-apps-enterprise-integration-liquid-transform/select-maps-tile.png)

1. On the **Maps** pane, select **Add** and provide these details for your map:

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Name** | `JsonToJsonTemplate` | The name for your map, which is "JsonToJsonTemplate" in this example |
   | **Map type** | **liquid** | The type for your map. For JSON to JSON transformation, you must select **liquid**. |
   | **Map** | `SimpleJsonToJsonTemplate.liquid` | An existing Liquid template or map file to use for transformation, which is "SimpleJsonToJsonTemplate.liquid" in this example. To find this file, you can use the file picker. For map size limits, see [Limits and configuration](../logic-apps/logic-apps-limits-and-config.md#artifact-capacity-limits). |
   |||

   ![Add Liquid template](./media/logic-apps-enterprise-integration-liquid-transform/add-liquid-template.png)

## Add the Liquid transformation action

1. In the Azure portal, follow these steps to [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

1. In the Logic App Designer, add the [Request trigger](../connectors/connectors-native-reqres.md#add-request) to your logic app.

1. Under the trigger, choose **New step**. In the search box, enter `liquid` as your filter, and select this action: **Transform JSON to JSON - Liquid**

   ![Find and select Liquid action](./media/logic-apps-enterprise-integration-liquid-transform/search-action-liquid.png)

1. Open the **Map** list, and select your Liquid template, which is "JsonToJsonTemplate" in this example.

   ![Select map](./media/logic-apps-enterprise-integration-liquid-transform/select-map.png)

   If the maps list is empty, most likely your logic app is not linked to your integration account. 
   To link your logic app to the integration account that has the Liquid template or map, follow these steps:

   1. On your logic app menu, select **Workflow settings**.

   1. From the **Select an Integration account** list, select your integration account, and select **Save**.

      ![Link logic app to integration account](./media/logic-apps-enterprise-integration-liquid-transform/link-integration-account.png)

1. Now add the **Content** property to this action. Open the **Add new parameter** list, and select **Content**.

   ![Add "Content" property to action](./media/logic-apps-enterprise-integration-liquid-transform/add-content-property-to-action.png)

1. To set the **Content** property value, click inside the **Content** box so that the dynamic content list appears. Select the **Body** token, which represents the body content output from the trigger.

   ![Select "Body" token for "Content" property value](./media/logic-apps-enterprise-integration-liquid-transform/select-body.png)

   When you're done, the action looks like this example:

   ![Finished "Transform JSON to JSON" action](./media/logic-apps-enterprise-integration-liquid-transform/finished-transform-action.png)

## Test your logic app

Post JSON input to your logic app from [Postman](https://www.getpostman.com/postman) or a similar tool. 
The transformed JSON output from your logic app looks like this example:
  
![Example output](./media/logic-apps-enterprise-integration-liquid-transform/example-output-jsontojson.png)

<a name="template-considerations"></a>

## Liquid template considerations

* A Liquid template uses the [file size limits for maps](../logic-apps/logic-apps-limits-and-config.md#artifact-capacity-limits) in Azure Logic Apps.

* The **Transform JSON to JSON - Liquid** action uses the [DotLiquid implementation](http://dotliquidmarkup.org/). In specific cases, this implementation differs from the [Shopify specification](https://shopify.github.io/liquid/basics/introduction/). Here are the known differences:

  * Your template can use Liquid filters, which follow the [DotLiquid](https://github.com/dotliquid/dotliquid/wiki/DotLiquid-for-Developers#create-your-own-filters) and C# naming conventions. In Azure Logic Apps, the **Transform JSON to JSON - Liquid** action uses *sentence casing*, so make sure that the filter names in your template also use sentence casing. Otherwise, the filters won't work. For more information, see [Shopify Liquid filters](https://shopify.github.io/liquid/basics/introduction/#filters) and [DotLiquid Liquid filters](https://github.com/dotliquid/dotliquid/wiki/DotLiquid-for-Developers#create-your-own-filters).

  * The **Transform JSON to JSON - Liquid** action natively outputs a string. In Azure Logic Apps, the **Transform JSON to JSON - Liquid** action merely indicates that the template's text output must be interpreted as a string. You need to escape the backslash character (`\`) and any other reserved JSON characters.

  * For the `Replace` standard filter, the [Shopify implementation](https://shopify.github.io/liquid/filters/replace/) uses [simple string matching](https://github.com/Shopify/liquid/issues/202), while the [DotLiquid implementation](https://github.com/dotliquid/dotliquid/blob/b6a7d992bf47e7d7dcec36fb402f2e0d70819388/src/DotLiquid/StandardFilters.cs#L425) uses regular expression (RegEx) matching. Both implementations appear to work the same way until you use an RegEx-reserved character or an escape character in the match parameter.

    So, to work around this behavior, rather than use the Shopify version:

    `| Replace: '"' , '\"'`

    Use the DotLiquid version instead:

    `| Replace: '\\' , '\\'`

    The `\\` is required for the `Replace` search "string" because the DotLiquid implementation uses RegEx pattern matching, which differs from the Shopify implementation that uses simple string matching.

    > [!NOTE]
    > Due to the Liquid transform action using sentence casing, the Replace filter appears as `Replace` in the following 
    > sample maps, Shopify examples, and when you use [DotLiquid online](http://dotliquidmarkup.org/try-online).

    These examples show the difference in Replace filter behaviors when you use the RegEx-reserved character, `\`:

    * Shopify version:

      `{ "Date": "{{ 'MMM "EEE - SS BNBN KLJLsample\\' | Replace: '\\', '\\' | Replace: '"', '\"'}}"}`

      Succeeds with this result:

      `{ "Date": "MMM \"EEE - SS BNBN KLJLsample\\\\"}`

    * DotLiquid version:

      `{ "Date": "{{ 'MMM "EEE - SS BNBN KLJLsample\\' | Replace: '\', '\\' | Replace: '"', '\"'}}"}`

      Fails with this error:

      `{ "Date": "Liquid error: parsing "\" - Illegal \ at end of pattern."}`

## Other transformations using Liquid

Liquid is not limited to only JSON transformations. You can also use Liquid to perform other transformations, for example:

* [JSON to text](#json-text)
* [XML to JSON](#xml-json)
* [XML to text](#xml-text)

<a name="json-text"></a>

### Transform JSON to text

Here's the Liquid template that's used for this example:

```json
{{content.firstName | Append: ' ' | Append: content.lastName}}
```

Here are the sample inputs and outputs:

![Example output JSON to text](./media/logic-apps-enterprise-integration-liquid-transform/example-output-jsontotext.png)

<a name="xml-json"></a>

### Transform XML to JSON

Here's the Liquid template that's used for this example:

``` json
[{% JSONArrayFor item in content -%}
      {{item}}
  {% endJSONArrayFor -%}]
```

Here are the sample inputs and outputs:

![Example output XML to JSON](./media/logic-apps-enterprise-integration-liquid-transform/example-output-xmltojson.png)

<a name="xml-text"></a>

### Transform XML to text

Here's the Liquid template that's used for this example:

``` json
{{content.firstName | Append: ' ' | Append: content.lastName}}
```

Here are the sample inputs and outputs:

![Example output XML to text](./media/logic-apps-enterprise-integration-liquid-transform/example-output-xmltotext.png)

## Next steps

* [Learn more about maps](../logic-apps/logic-apps-enterprise-integration-maps.md)
* [Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)