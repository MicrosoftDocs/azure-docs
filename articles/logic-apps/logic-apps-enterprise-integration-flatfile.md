---
title: Encode or decode flat files
description: Encode or decode flat files for enterprise integration in Azure Logic Apps by using the Enterprise Integration Pack
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, logicappspm
ms.topic: article
ms.date: 04/28/2020
---

# Encode and decode flat files in Azure Logic Apps by using the Enterprise Integration Pack

Before you send XML content to a business partner in a business-to-business (B2B) scenario, you might want to encode that content first. By building a logic app, you can use the **Flat File** connector to encode and decode flat files. Your logic app can get this XML content from various sources, such as an HTTP request trigger, another app, or other [connectors supported by Azure Logic Apps](../connectors/apis-list.md). For more information, see [What is Azure Logic Apps](logic-apps-overview.md)?

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app where you want to use the **Flat File** connector and a trigger that starts your logic app's workflow. The **Flat File** connector provides only actions, not triggers. You can use either the trigger or another action to feed the XML content into your logic app for encoding or decoding. If you're new to logic apps, review [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) that's associated with your Azure subscription and linked to the logic app where you plan to use the **Flat File** connector. Both your logic app and integration account must exist in the same location or Azure region.

* A flat file [schema]() that you use for encoding or decoding the XML content

* At least two [trading partners](../logic-apps/logic-apps-enterprise-integration-partners.md) that you've already defined in your integration account.

## Add flat file encode action

1. Create a logic app and [link it to your integration account](logic-apps-enterprise-integration-accounts.md "Learn to link an integration account to a Logic app"). This account contains the schema you will use to encode the XML data.  

1. In the Logic App Designer, add the **When an HTTP request is received** trigger to your logic app.

1. Add the flat file encoding action, as follows:

   a. Select the **plus** sign.

   b. Select the **Add an action** link (appears after you have selected the plus sign).

   c. In the search box, enter *Flat* to filter all the actions to the one that you want to use.

   d. Select the **Flat File Encoding** option from the list.   

      ![Screenshot of Flat File Encoding option](media/logic-apps-enterprise-integration-flatfile/flatfile-2.png)   

1. On the **Flat File Encoding** dialog box, select the **Content** text box.  

   ![Screenshot of Content text box](media/logic-apps-enterprise-integration-flatfile/flatfile-3.png)  

1. Select the body tag as the content that you want to encode. The body tag will populate the content field.     

   ![Screenshot of body tag](media/logic-apps-enterprise-integration-flatfile/flatfile-4.png)  

1. Select the **Schema Name** list box, and choose the schema you want to use to encode the input content.    

   ![Screenshot of Schema Name list box](media/logic-apps-enterprise-integration-flatfile/flatfile-5.png)  

1. Save your work.

   ![Screenshot of Save icon](media/logic-apps-enterprise-integration-flatfile/flatfile-6.png)  

At this point, you are finished setting up your flat file encoding connector. In a real world application, you may want to store the encoded data in a line-of-business application, such as Salesforce. Or you can send that encoded data to a trading partner. You can easily add an action to send the output of the encoding action to Salesforce, or to your trading partner, by using any one of the other connectors provided.

You can now test your connector by making a request to the HTTP endpoint, and including the XML content in the body of the request.  

## Create the flat file decoding connector

> [!NOTE]
> To complete these steps, you need to have a schema file already uploaded into you integration account.

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