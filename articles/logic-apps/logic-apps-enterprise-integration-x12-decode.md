---
title: Decode X12 messages - Azure Logic Apps | Microsoft Docs
description: Validate EDI and generate XML for transaction sets with the X12 message decoder in the Enterprise Integration Pack for Azure Logic Apps
services: logic-apps
documentationcenter: .net,nodejs,java
author: padmavc
manager: anneta
editor: ''

ms.assetid: 4fd48d2d-2008-4080-b6a1-8ae183b48131
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/27/2017
ms.author: padmavc

---
# Decode X12 messages for Azure Logic Apps with the Enterprise Integration Pack

With the Decode X12 message connector, you can validate EDI and partner-specific properties, 
generate an XML document for each transaction set, 
and generate acknowledgment for processed transactions. 
To use this connector, you must add the connector to an existing trigger in your logic app.

## Before you start

Here's the items you need:

* An Azure account; you can create a [free account](https://azure.microsoft.com/free)
* An [integration account](logic-apps-enterprise-integration-create-integration-account.md) 
that's already defined and associated with your Azure subscription. 
You must have an integration account to use the Decode X12 message connector.
* At least two [partners](logic-apps-enterprise-integration-partners.md) 
that are already defined in your integration account
* An [X12 agreement](logic-apps-enterprise-integration-x12.md) 
that's already defined in your integration account

## Decode X12 messages

1. [Create a logic app](logic-apps-create-a-logic-app.md).

2. The Decode X12 message connector doesn't have triggers, 
so you must add a trigger for starting your logic app, like a Request trigger. 
In the Logic App Designer, add a trigger, and then add an action to your logic app.

3.	In the search box, enter "x12" for your filter. 
Select **X12 - Decode X12 message**.
   
	![Search for "x12"](media/logic-apps-enterprise-integration-x12-decode/x12decodeimage1.png)  

3. If you haven’t previously created any connections to Integration Account, you are prompted for the connection details:
   
	![integration account connection](media/logic-apps-enterprise-integration-x12-decode/x12decodeimage4.png)\

4. Enter the Integration Account details.  Properties with an asterisk are required:
   
	| Property | Details |
	| --- | --- |
	| Connection Name * |Enter any name for your connection. |
	| Integration Account * |Enter a name for your integration account. Make sure that your integration account and logic app are in the same Azure location. |

	After you're done, your connection details look similar to this example:
   
	![integration account connection created](media/logic-apps-enterprise-integration-x12-decode/x12decodeimage5.png) 

5. Select **Create**.
6. Notice the connection has been created:
   
    ![integration account connection details](media/logic-apps-enterprise-integration-x12-decode/x12decodeimage6.png) 
7. Select X12 flat file message to decode:
   
    ![provide mandatory fields](media/logic-apps-enterprise-integration-x12-decode/x12decodeimage7.png) 

## X12 Decode details

The X12 Decode connector does following:

* Validates the envelope against trading partner agreement
* Generates an XML document for each transaction set.
* Validates EDI and partner-specific properties
  * EDI structural validation, and extended schema validation
  * Validation of the structure of the interchange envelope.
  * Schema validation of the envelope against the control schema.
  * Schema validation of the transaction-set data elements against the message schema.
  * EDI validation performed on transaction-set data elements 
* Verifies that the interchange, group, and transaction set control numbers are not duplicates
  * Checks the interchange control number against previously received interchanges.
  * Checks the group control number against other group control numbers in the interchange.
  * Checks the transaction set control number against other transaction set control numbers in that group.
* Converts the entire interchange to XML 
  * Split Interchange as transaction sets - suspend transaction sets on error: Parses each transaction set in an interchange into a separate XML document. If one or more transaction sets in the interchange fail validation, X12 Decode suspends only those transaction sets.
  * Split Interchange as transaction sets - suspend interchange on error: Parses each transaction set in an interchange into a separate XML document.  If one or more transaction sets in the interchange fail validation, X12 Decode suspends the entire interchange.
  * Preserve Interchange - suspend transaction sets on error: Creates an XML document for the entire batched interchange. X12 Decode suspends only those transaction sets that fail validation, while continuing to process all other transaction sets
  * Preserve Interchange - suspend interchange on error: Creates an XML document for the entire batched interchange. If one or more transaction sets in the interchange fail validation, X12 Decode suspends the entire interchange, 
* Generates a Technical and/or Functional acknowledgment (if configured).
  * A Technical Acknowledgment generates as a result of header validation. The technical acknowledgment reports the status of the processing of an interchange header and trailer by the address receiver.
  * A Functional Acknowledgment generates as a result of body validation. The functional acknowledgment reports each error encountered while processing the received document

## Next steps
[Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack") 

