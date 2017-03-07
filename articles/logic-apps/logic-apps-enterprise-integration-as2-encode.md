---
title: Encode AS2 messages - Azure Logic Apps | Microsoft Docs
description: How to use the AS2 encoder in the Enterprise Integration Pack for Azure Logic Apps
services: logic-apps
documentationcenter: .net,nodejs,java
author: padmavc
manager: anneta
editor: ''

ms.assetid: 332fb9e3-576c-4683-bd10-d177a0ebe9a3
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/27/2017
ms.author: padmavc

---
# Encode AS2 messages for Azure Logic Apps with the Enterprise Integration Pack

To establish security and reliability while transmitting messages, use the Encode AS2 message connector. 
This connector provides digital signing, encryption, and acknowledgements through Message Disposition Notifications (MDN), 
which also leads to support for Non-Repudiation.

## Before you start

Here's the items you need:

* An Azure account; you can create a [free account](https://azure.microsoft.com/free)
* An Integration Account is required to use Encode AS2 message connector. See details on how to create an [Integration Account](logic-apps-enterprise-integration-create-integration-account.md), [partners](logic-apps-enterprise-integration-partners.md) and an [AS2 agreement](logic-apps-enterprise-integration-as2.md)

## Encode AS2 messages

1. [Create a logic app](logic-apps-create-a-logic-app.md).

2. This connector does not have any triggers. Use other triggers to start the Logic App, such as a Request trigger.  In the Logic App designer, add a trigger and add an action.  Select Show Microsoft managed APIs in the drop-down list and then enter “AS2” in the search box.  Select AS2 – Encode AS2 Message:
   
	![search AS2](./media/logic-apps-enterprise-integration-as2-encode/as2decodeimage1.png)

3. If you didn't previously create any connections to your integration account, 
you're prompted to create that connection now:
   
	![create connection to integration account](./media/logic-apps-enterprise-integration-as2-encode/as2encodeimage1.png)  

4. Enter the Integration Account details.  Properties with an asterisk are required:
   
	| Property | Details |
	| --- | --- |
	| Connection Name * |Enter any name for your connection |
	| Integration Account * |Enter the Integration Account name. Be sure your Integration Account and Logic app are in the same Azure location |

	After you're done, your connection details look similar to this example:
   
	![integration connection established](./media/logic-apps-enterprise-integration-as2-encode/as2encodeimage2.png)

5. Select **Create**.
6. Notice the connection has been created.  Provide AS2-From, AS2-To identifiers (as configured in agreement) and Body (the message payload) details:
   
    ![provide mandatory fields](./media/logic-apps-enterprise-integration-as2-encode/as2encodeimage3.png)

## AS2 encoder details

The Encode AS2 connector performs these tasks: 

* Applies AS2/HTTP headers
* Signs outgoing messages (if configured)
* Encrypts outgoing messages (if configured)
* Compresses the message (if configured)

## Try it yourself
Try it out. Use the [AS2 logic app template and scenario](https://azure.microsoft.com/documentation/templates/201-logic-app-as2-send-receive/) to deploy a fully operational logic app.

## Next steps
[Learn more about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack") 

