---
title: Decode AS2 messages - Azure Logic Apps | Microsoft Docs
description: How to use the AS2 decoder in the Enterprise Integration Pack for Azure Logic Apps
services: logic-apps
documentationcenter: .net,nodejs,java
author: padmavc
manager: anneta
editor: ''

ms.assetid: cf44af18-1fe5-41d5-9e06-cc57a968207c
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/27/2016
ms.author: padmavc

---
# Decode AS2 messages for Azure Logic Apps with the Enterprise Integration Pack 

To establish security and reliability while transmitting messages, use the Decode AS2 message connector. 
This connector provides digital signing, decryption, and acknowledgements through Message Disposition Notifications (MDN).

## Before you start

Here's the items you need:

* An Azure account; you can create a [free account](https://azure.microsoft.com/free)
* An Integration Account is required to use Decode AS2 message connector. See details on [how to create an Integration Account](logic-apps-enterprise-integration-create-integration-account.md), [partners](logic-apps-enterprise-integration-partners.md) and an [AS2 agreement](../logic-apps/logic-apps-enterprise-integration-as2.md)

## Decode AS2 messages
1. [Create a Logic App](../logic-apps/logic-apps-create-a-logic-app.md).
2. This connector does not have any triggers. Use other triggers to start the Logic App, such as a Request trigger.  In the Logic App designer, add a trigger and add an action.  Select Show Microsoft managed APIs in the drop-down list, and then enter “AS2” in the search box.  Select AS2 – Decode AS2 Message:
   
    ![Search AS2](media/logic-apps-enterprise-integration-as2-decode/as2decodeimage1.png)

3. If you didn't previously create any connections to your integration account, 
you're prompted to create that connection now:
   
    ![Create integration connection](media/logic-apps-enterprise-integration-as2-decode/as2decodeimage2.png)

4. Name your connection, and select the integration account that you want to connect. 
Properties with an asterisk are required.
   
	| Property | Details |
	| --- | --- |
	| Connection Name * |Enter any name for your connection. |
	| Integration Account * |Enter a name for your integration account. Make sure that your integration account and logic app are in the same Azure location. |

	After you're done, your connection details look similar to this example:

	![integration connection](media/logic-apps-enterprise-integration-as2-decode/as2decodeimage3.png)

5. Select **Create**.
6. Notice the connection has been created.  Now, proceed with the other steps in your Logic App:
   
    ![integration connection created](media/logic-apps-enterprise-integration-as2-decode/as2decodeimage4.png) 
7. Select Body and Headers from Request outputs:
   
    ![provide mandatory fields](media/logic-apps-enterprise-integration-as2-decode/as2decodeimage5.png) 

## AS2 decoder details
The Decode AS2 connector does the following: 

* Processes AS2/HTTP headers
* Verifies the signature (if configured)
* Decrypts the messages (if configured)
* Decompresses the message (if configured)
* Reconciles a received MDN with the original outbound message
* Updates and correlates records in the non-repudiation database
* Writes records for AS2 status reporting
* The output payload contents are base64 encoded
* Determines whether an MDN is required, and whether the MDN should be synchronous or asynchronous based on configuration in AS2 agreement
* Generates a synchronous or asynchronous MDN (based on agreement configurations)
* Sets the correlation tokens and properties on the MDN

## Try it yourself
Try it out. Use the [AS2 logic app template and scenario](https://azure.microsoft.com/documentation/templates/201-logic-app-as2-send-receive/) to deploy a fully operational logic app.

## Next steps
[Learn more about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md) 

