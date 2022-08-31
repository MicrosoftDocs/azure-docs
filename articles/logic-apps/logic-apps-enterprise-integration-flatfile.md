---
title: Encode or decode flat files
description: Encode or decode flat files for enterprise integration in Azure Logic Apps by using the Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/01/2022
---

# Encode and decode flat files in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Before you send XML content to a business partner in a business-to-business (B2B) scenario, you might want to encode that content first. If you receive encoded XML content, you'll need to decode that content first. When you're building a logic app workflow in Azure Logic Apps, you can encode and decode flat files by using the **Flat File** built-in connector actions and a flat file schema for encoding and decoding. You can use **Flat File** actions in multi-tenant Consumption logic app workflows and single-tenant Standard logic app workflows.

> [!NOTE]
>
> In Standard logic app workflows, the **Flat File** actions are currently in preview.

While no **Flat File** triggers are available, you can use any trigger or action to feed the source XML content into your workflow for encoding or decoding. For example, you can use a built-in connector trigger, a managed or Azure-hosted connector trigger available for Azure Logic Apps, or even another app.

This article shows how to add the **Flat File** encoding and decoding actions to your workflow.

* Upload the flat file schema to your integration account for Consumption logic app workflows or to your Standard logic app resource for use in any child workflow.
* Add a **Flat File** encoding or decoding action to your workflow.
* Select the schema that you want to use.

For more information, review the following documentation:

* [Consumption versus Standard logic apps](logic-apps-overview.md#resource-type-and-host-environment-differences)
* [Integration account built-in connectors](../connectors/built-in.md#integration-account-built-in)
* [[schema](logic-apps-enterprise-integration-schemas.md) for encoding and decoding the XML content.
* [Built-in connectors overview for Azure Logic Apps](../connectors/built-in.md)
* [Managed or Azure-hosted connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The logic app workflow, blank or existing, where you want to use the **Flat File** action.

  If you have a blank workflow, use any trigger that you want to start the workflow. This example uses the Request trigger.

* Your logic app resource and workflow. Flat file operations don't have any triggers available, so your workflow has to minimally include a trigger. For more information, review the following documentation:

  * [Quickstart: Create your first Consumption logic app workflow with multi-tenant Azure Logic Apps](quickstart-create-first-logic-app-workflow.md)

  * [Create a Standard logic app workflow with single-tenant Azure Logic Apps](create-single-tenant-workflows-azure-portal.md)

* A flat file schema for encoding and decoding the XML content.

  To create schemas, you can use the following tools:

  * Visual Studio 2019 and the [Microsoft Azure Logic Apps Enterprise Integration Tools Extension](https://aka.ms/vsenterpriseintegrationtools).

  * Visual Studio 2015 and the [Microsoft Azure Logic Apps Enterprise Integration Tools for Visual Studio 2015 2.0 extension](https://aka.ms/vsmapsandschemas).

  > [!NOTE]
  >
  > * Don't install the extension alongside the BizTalk Server extension. Having both extensions might 
  > produce unexpected behavior. Make sure that you only have one of these extensions installed.
  >
  > * On high resolution monitors, you might experience a display problem with the map designer in 
  > Visual Studio. To resolve this display problem, either restart Visual Studio in DPI-unaware mode, 
  > or add the DPIUNAWARE registry value.

* Based on whether you're working on a Consumption or Standard logic app workflow, you'll need an [integration account resource](logic-apps-enterprise-integration-create-integration-account.md). Usually, you need this resource when you want to define and store artifacts for use in enterprise integration and B2B workflows.

  > [!IMPORTANT]
  >
  > To work together, both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

  * If you're working on a Consumption logic app workflow, your logic app resource requires a [link to your integration account](logic-apps-enterprise-integration-create-integration-account.md?tabs=consumption#link-account).

  * If you're working on a Standard logic app workflow, you can link your your logic app resource to your integration account, upload encoding schemas directly to your logic app resource, or both, based on the following scenarios:

    * If you already have an integration account with the artifacts that you need or want to use, you can link your integration account to multiple Standard logic app resources where you want to use the artifacts. That way, you don't have to upload schemas to each individual logic app. For more information, review [Link your logic app resource to your integration account](logic-apps-enterprise-integration-create-integration-account.md?tabs=standard#link-account).

    * Some Azure-hosted integration account connectors, such as AS2, EDIFACT, and X12, let you create a connection to your integration account. If you're just using these connectors, you don't need the link.

    * The **Flat File** built-in connector lets you select a schema that you previously uploaded to your logic app resource or to a linked integration account, but not both. You can then use this artifact across all child workflows within the same logic app resource.

    So, if you don't have or need an integration account, you can use the upload option. Otherwise, you can use the linking option. Either way, you can use these artifacts across all child workflows within the same logic app resource.

## Limitations

* In your flat file schema, make sure the contained XML groups don't have excessive numbers of the `max count` property set to a value *greater than 1*. Avoid nesting an XML group with a `max count` property value greater than 1 inside another XML group with a `max count` property greater than 1.

* When Azure Logic Apps parses the flat file schema, and whenever the schema allows the choice of the next fragment, Azure Logic Apps generates a *symbol* and a *prediction* for that fragment. If the schema allows too many such constructs, for example, more than 100,000, the schema expansion becomes excessively large, which consumes too much resources and time.

## Upload schema

After you create your schema, you now have to upload the schema based on the following scenario:

* If you're working on a Consumption logic app workflow, [upload your template to your integration account](#upload-schema-integration-account).

If you're working on a Standard logic app workflow, you can [upload your schema to your integration account](#upload-schema-integration-account), or [upload your schema to your logic app resource](#upload-schema-standard-logic-app).

<a name="upload-schema-integration-account"></a>

### Upload schema to integration account


<a name="upload-schema-standard-logic-app"></a>

### Upload schema to Standard logic app


## Add a Flat File encoding action

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer, if not already open.

1. If your workflow doesn't have a trigger or any other actions that your workflow needs, add those operations first. Flat File operations don't have any triggers available.

   This example continues with the Request trigger named **When a HTTP request is received**.

1. On the workflow designer, under the step where you want to add the Flat File action, select **New step**.

1. Under the **Choose an operation** search box, select **All**. In the search box, enter **flat file**.

1. From the actions list, select the action named **Flat File Encoding**.

   ![Screenshot showing Azure portal and Consumption workflow designer with `flat file` in search box and `Flat File Encoding` action selected.](./media/logic-apps-enterprise-integration-flatfile/flat-file-encoding-consumption.png)

1. In the action's **Content** property, provide the output from the trigger or a previous action that you want to encoding by following these steps:

   1. Click inside the **Content** box so that the dynamic content list appears.

   1. From the dynamic content list, select the flat file content that you want to encode.
   
      For this example, from the dynamic content list, under **When a HTTP request is received**, select the **Body** token, which represents the body content output from the trigger.

   ![Screenshot showing the Consumption designer and the "Content" property with dynamic content list and content selected for encoding.](./media/logic-apps-enterprise-integration-flatfile/select-content-to-encode-consumption.png)

   > [!TIP]
   > If the **Body** property doesn't appear in the dynamic content list, 
   > select **See more** next to the **When a HTTP request is received** section label.
   > You can also directly enter the content to decode in the **Content** box.

1. From the **Schema Name** list, select your schema.

   ![Screenshot showing the Consumption designer and the opened "Schema Name" list with selected schema to use for encoding.](./media/logic-apps-enterprise-integration-flatfile/select-encoding-schema-consumption.png)

   > [!NOTE]
   >
   > If the schema list is empty, either your logic app resource isn't linked to your 
   > integration account or your integration account doesn't contain any schema files.

1. Save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. If you have a blank workflow that doesn't have a trigger, add any trigger you want. Otherwise, continue to the next step.

   This example uses the Request trigger, which is named **When a HTTP request is received**, and handles inbound requests from outside the logic app workflow. To add the Request trigger, follow these steps:

   1. On the designer, select **Choose an operation**. In the **Choose an operation** pane that opens, under the search box, select **Built-in**.

   1. In the search box, enter `HTTP request`. From the triggers list, select the Request trigger named **When an HTTP request is received**.

     > [!TIP]
     > Providing a JSON schema is optional. If you have a sample payload from the inbound request, 
     > select **Use sample payload to generate schema**, enter the sample payload, and select **Done**. 
     > The schema appears in the **Request Body JSON Schema** box.

1. Under the step in your workflow where you want to add the **Flat File Encoding** action, choose an option:

   * To add the **Flat File Encoding** action at the end of your workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the **Flat File Encoding** action between existing steps, select the plus sign (**+**) that appears between those steps, and then select **Insert a new step**.

1. In the **Choose an operation** pane that opens, under the search box, select **Built-in**.

1. In the search box, enter `flat file`. From the actions list, select the action named **Flat File Encoding**.

   ![Screenshot showing the Azure portal and Standard workflow designer with "flat file" in search box and the "Flat File Encoding" action selected.](./media/logic-apps-enterprise-integration-flatfile/flat-file-encoding-standard.png)

1. Click inside the **Content** box so that the dynamic content list appears. From the list, in the **When a HTTP request is received** section, select the **Body** property, which contains the request body output from the trigger and the content to encode.

   ![Screenshot showing the Standard workflow designer and the "Content" property with dynamic content list and content selected for encoding.](./media/logic-apps-enterprise-integration-flatfile/select-content-to-encode-standard.png)

   > [!TIP]
   > If the **Body** property doesn't appear in the dynamic content list, 
   > select **See more** next to the **When a HTTP request is received** section label.
   > You can also directly enter the content to encode in the **Content** box.

1. From the **Name** list, select the schema that you previously uploaded to your logic app resource for encoding, for example:

   ![Screenshot showing the Standard workflow designer and the opened "Name" list with selected schema to use for encoding.](./media/logic-apps-enterprise-integration-flatfile/select-encoding-schema-standard.png)

   > [!NOTE]
   > If no schema appears in the list, your Standard logic app resource doesn't contain any schema files to use for encoding. 
   > Learn how to [upload the schemma that you want to use to your Standard logic app resource](logic-apps-enterprise-integration-schemas.md).

1. Save your workflow. On the designer toolbar, select **Save**.

---

## Add Flat File Decoding action

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. If you have a blank workflow that doesn't have a trigger, add any trigger you want. Otherwise, continue to the next step.

   This example uses the Request trigger, which is named **When a HTTP request is received**, and handles inbound requests from outside the logic app workflow. To add the Request trigger, follow these steps:

   1. Under the designer search box, select **Built-in**. In the designer search box, enter `HTTP request`.

   1. From the triggers list, select the Request trigger named **When an HTTP request is received**.

   > [!TIP]
   > Providing a JSON schema is optional. If you have a sample payload from the inbound request, 
   > select **Use sample payload to generate schema**, enter the sample payload, and select **Done**. 
   > The schema appears in the **Request Body JSON Schema** box.

1. Under the step in your workflow where you want to add the **Flat File Decoding** action, choose an option:

   * To add the **Flat File Decoding** action at the end of your workflow, select **New step**.

   * To add the **Flat File Decoding** action between existing steps, move your pointer over the arrow that connects those steps so that the plus sign (**+**) appears. Select that plus sign, and then select **Add an action**.

1. In the **Choose an operation** search box, enter `flat file`. From the actions list, select the action named **Flat File Decoding**.

   ![Screenshot showing the Azure portal and the Consumption designer with "flat file" in search box and the "Flat File Decoding" action selected.](./media/logic-apps-enterprise-integration-flatfile/flat-file-decoding-consumption.png)

1. Click inside the **Content** box so that the dynamic content list appears. From the list, in the **When a HTTP request is received** section, select the **Body** property, which contains the request body output from the trigger and the content to decode.

   ![Screenshot showing the Consumption designer and the "Content" property with dynamic content list and content selected for decoding.](./media/logic-apps-enterprise-integration-flatfile/select-content-to-decode-consumption.png)

   > [!TIP]
   > If the **Body** property doesn't appear in the dynamic content list, 
   > select **See more** next to the **When a HTTP request is received** section label. 
   > You can also directly enter the content to decode in the **Content** box.

1. From the **Schema Name** list, select the schema that's in your linked integration account to use for decoding, for example:

   ![Screenshot showing the Consumption designer and the opened "Schema Name" list with selected schema to use for decoding.](./media/logic-apps-enterprise-integration-flatfile/select-decoding-schema-consumption.png)

   > [!NOTE]
   > If no schema appears in the list, your integration account doesn't contain any schema files 
   > to use for decoding. Upload the schema that you want to use to your integration account.

1. Save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. If you have a blank workflow that doesn't have a trigger, add any trigger you want. Otherwise, continue to the next step.

   This example uses the Request trigger, which is named **When a HTTP request is received**, and handles inbound requests from outside the logic app workflow. To add the Request trigger, follow these steps:

   1. On the designer, select **Choose an operation**. In the **Choose an operation** pane that opens, under the search box, select **Built-in**.

   1. In the search box, enter `HTTP request`. From the triggers list, select the Request trigger named **When an HTTP request is received**.

     > [!TIP]
     > Providing a JSON schema is optional. If you have a sample payload from the inbound request, 
     > select **Use sample payload to generate schema**, enter the sample payload, and select **Done**. 
     > The schema appears in the **Request Body JSON Schema** box.

1. Under the step in your workflow where you want to add the **Flat File Decoding** action, choose an option:

   * To add the **Flat File Decoding** action at the end of your workflow, select the plus sign (**+**), and then select **Add an action**.

   * To add the **Flat File Decoding** action between existing steps, select the plus sign (**+**) that appears between those steps, and then select **Insert a new step**.

1. In the **Choose an operation** pane that opens, under the search box, select **Built-in**.

1. In the search box, enter `flat file`. From the actions list, select the action named **Flat File Decoding**.

   ![Screenshot showing the Azure portal and Standard workflow designer with "flat file" in search box and the "Flat File Decoding" action selected.](./media/logic-apps-enterprise-integration-flatfile/flat-file-decoding-standard.png)

1. Click inside the **Content** box so that the dynamic content list appears. From the list, in the **When a HTTP request is received** section, select the **Body** property, which contains the request body output from the trigger and the content to decode.

   ![Screenshot showing the Standard workflow designer and the "Content" property with dynamic content list and content selected for decoding.](./media/logic-apps-enterprise-integration-flatfile/select-content-to-decode-standard.png)

   > [!TIP]
   > If the **Body** property doesn't appear in the dynamic content list, 
   > select **See more** next to the **When a HTTP request is received** section label.
   > You can also directly enter the content to decode in the **Content** box.

1. From the **Name** list, select the schema that you previously uploaded to your logic app resource for decoding, for example:

   ![Screenshot showing the Standard workflow designer and the opened "Name" list with selected schema to use for decoding.](./media/logic-apps-enterprise-integration-flatfile/select-decoding-schema-standard.png)

   > [!NOTE]
   > If no schema appears in the list, your Standard logic app resource doesn't contain any schema files to use for decoding. 
   > Learn how to [upload the schema that you want to use to your Standard logic app resource](logic-apps-enterprise-integration-schemas.md).

1. Save your workflow. On the designer toolbar, select **Save**.

---

You're now done with setting up your flat file decoding action. In a real world app, you might want to store the decoded data in a line-of-business (LOB) app, such as Salesforce. Or, you can send the decoded data to a trading partner. To send the output from the decoding action to Salesforce or to your trading partner, use the other [connectors available in Azure Logic Apps](../connectors/apis-list.md).


## Test your workflow

By using Postman or a similar tool and the POST method, send a call to the Request trigger's URL and include the JSON input to transform, for example:

To test your workflow, send a request to the HTTPS endpoint, which appears in the Request trigger's **HTTP POST URL** property, and include the XML content that you want to encode or decode in the request body.


## Next steps

* Learn more about the [Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md)
