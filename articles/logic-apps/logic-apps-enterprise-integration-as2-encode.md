---
title: Encode AS2 messages in Azure logic apps | Microsoft Docs
description: How to use the AS2 encoder included with the Enterprise Integration Pack and Logic apps
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
# Get started with Encode AS2 Message
Connect to Encode AS2 Message to establish security and reliability while transmitting messages. It provides digital signing, encryption, and acknowledgements via Message Disposition Notifications (MDN), which also leads to support for Non-Repudiation.

## Prereqs
* An Azure account; you can create a [free account](https://azure.microsoft.com/free)
* An Integration Account is required to use Encode AS2 message connector. See details on how to create an [Integration Account](logic-apps-enterprise-integration-create-integration-account.md), [partners](logic-apps-enterprise-integration-partners.md) and an [AS2 agreement](logic-apps-enterprise-integration-as2.md)

## Encode AS2 messages
1. [Create a logic app](logic-apps-create-a-logic-app.md).
2. This connector does not have any triggers. Use other triggers to start the Logic App, such as a Request trigger.  In the Logic App designer, add a trigger and add an action.  Select Show Microsoft managed APIs in the drop-down list and then enter “AS2” in the search box.  Select AS2 – Encode AS2 Message:
   
    ![search AS2](./media/logic-apps-enterprise-integration-as2-encode/as2decodeimage1.png)
3. If you haven’t previously created any connections to Integration Account, you are prompted for the connection details:
   
    ![create connection to integration account](./media/logic-apps-enterprise-integration-as2-encode/as2encodeimage1.png)  
4. Enter the Integration Account details.  Properties with an asterisk are required:
   
   | Property | Details |
   | --- | --- |
   | Connection Name * |Enter any name for your connection |
   | Integration Account * |Enter the Integration Account name. Be sure your Integration Account and Logic app are in the same Azure location |
   
      Once complete, your connection details look similar to the following:
   
      ![integration connection established](./media/logic-apps-enterprise-integration-as2-encode/as2encodeimage2.png)  
5. Select **Create**.
6. Notice the connection has been created.  Provide AS2-From, AS2-To identifiers (as configured in agreement) and Body (the message payload) details:
   
    ![provide mandatory fields](./media/logic-apps-enterprise-integration-as2-encode/as2encodeimage3.png)

## AS2 encoder details
The Encode AS2 connector does the following: 

* Applies AS2/HTTP headers
* Signs outgoing messages (if configured)
* Encrypts outgoing messages (if configured)
* Compresses the message (if configured)

## Try it yourself
Try it out. Use the [AS2 logic app template and scenario](https://azure.microsoft.com/documentation/templates/201-logic-app-as2-send-receive/) to deploy a fully operational logic app.

## Next steps
[Learn more about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack") 

