---
title: Encode or decode flat files
description: Encode or decode flat files for enterprise integration in Azure Logic Apps by using the Enterprise Integration Pack
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, logicappspm
ms.topic: article
ms.date: 05/12/2020
---

# Encode and decode flat files in Azure Logic Apps by using the Enterprise Integration Pack

Before you send XML content to a business partner in a business-to-business (B2B) scenario, you might want to encode that content first. By building a logic app, you can encode and decode flat files by using the **Flat File** connector. Your logic app can get this XML content from various sources, such as the Request trigger, another app, or other [connectors supported by Azure Logic Apps](../connectors/apis-list.md). For more information, see [What is Azure Logic Apps](logic-apps-overview.md)?

## Prerequisites

* An Azure subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app where you want to use the **Flat File** connector and a trigger that starts your logic app's workflow. The **Flat File** connector provides only actions, not triggers. You can use either the trigger or another action to feed the XML content into your logic app for encoding or decoding. If you're new to logic apps, review [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) that's associated with your Azure subscription and [linked to the logic app](logic-apps-enterprise-integration-accounts.md#link-account) where you plan to use the **Flat File** connector. Both your logic app and integration account must exist in the same location or Azure region.

* A flat file [schema](logic-apps-enterprise-integration-schemas.md) that you've uploaded to your integration account for encoding or decoding the XML content

* At least two [trading partners](logic-apps-enterprise-integration-partners.md) that you've already defined in your integration account

## Add flat file encode action

1. In the [Azure portal](https://portal.azure.com), open your logic app in the Logic App Designer.

1. Under the trigger or action in your logic app, select **New step** > **Add an action**. This example uses the Request trigger, which is named **When a HTTP request is received**, and handles inbound requests from outside the logic app.

   This example uses the following JSON schema that describes the payload from the inbound request:

   ```json
   {
      "type": "object",
       "properties": {
          "member": {
             "type": "string"
          }
      }
   }
   ```

   ```xml
   {
      "member": "<member><firstName>Sophia</firstName><lastName>Owen</lastName><address><street>123456 Any Street</street><city>Any Town</city><state>Any State</state><postalCode>10000</postalCode></address></member>"
   }

1. Under **Choose an action**, enter `flat file`. From the actions list, select this action: **Flat File Encoding**

   ![Select "Flat File Encoding" action](./media/logic-apps-enterprise-integration-flatfile/select-flat-file-encoding.png)

1. Click inside the **Content** box so that the dynamic content list appears. From the list, in the **When a HTTP request is received** section, select the **Body** property, which contains the request body output from the trigger and the content to encode.

   ![Select content to encode from dynamic content list](./media/logic-apps-enterprise-integration-flatfile/select-content-to-encode.png)

   > [!TIP]
   > If you don't see the **Body** property in the dynamic content list, 
   > select **See more** next to the **When a HTTP request is received** section label.

1. From the **Schema Name** list, select the schema that's in your linked integration account to use for encoding.

   ![Select schema to use for encoding](./media/logic-apps-enterprise-integration-flatfile/select-schema-for-encoding.png)

   > [!NOTE]
   > If no schema appears in the list, your integration account doesn't contain any schema files to use for encoding. 
   > Upload the schema that you want to use to your integration account.

1. Save your logic app. To test your connector, make a request to the HTTPS endpoint, which appears in the Request trigger's **HTTP POST URL** property, and include XML content in the body of the request.

You're now done with setting up your flat file encoding action. In a real world app, you might want to store the encoded data in a line-of-business (LOB) app, such as Salesforce. Or, you can send the encoded data to a trading partner. To send the output from the encoding action to Salesforce or to your trading partner, use the other [connectors available in Azure Logic Apps](../connectors/apis-list.md).

## Add flat file decode action

1. In the Logic App Designer, add the **When an HTTP request is received** trigger to your logic app.

1. Add the flat file decoding action, as follows:

   a. Select the **plus** sign.

   b. Select the **Add an action** link (appears after you have selected the plus sign).

   c. In the search box, enter *Flat* to filter all the actions to the one that you want to use.

   d. Select the **Flat File Decoding** option from the list.   

      ![Screenshot of Flat File Decoding option](media/logic-apps-enterprise-integration-flatfile/flatfile-2.png)   

1. Select the **Content** control. This produces a list of the content from earlier steps that you can use as the content to decode. Notice that the *Body* from the incoming HTTP request is available to be used as the content to decode. You can also enter the content to decode directly into the **Content** control.

1. Select the *Body* tag. Notice the body tag is now in the **Content** control.

1. Select the name of the schema that you want to use to decode the content. The following screenshot shows that *OrderFile* is the selected schema name. This schema name had been uploaded into the integration account previously.

   ![Screenshot of Flat File Decoding dialog box](media/logic-apps-enterprise-integration-flatfile/flatfile-decode-1.png) 

1. Save your work.

   ![Screenshot of Save icon](media/logic-apps-enterprise-integration-flatfile/flatfile-6.png)    

You're now finished with setting up your flat file decoding connector. In a real world app, you might want to store the decoded data in a line-of-business application such as Salesforce. You can easily add an action to send the output of the decoding action to Salesforce.

You can now test your connector by making a request to the HTTP endpoint and including the XML content you want to decode in the body of the request.  

## Next steps

* [Learn about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md)