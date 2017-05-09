---
title: Decode EDIFACT messages - Azure Logic Apps | Microsoft Docs
description: Validate EDI and generate XML for transaction sets with the EDIFACT message decoder in the Enterprise Integration Pack for Azure Logic Apps
services: logic-apps
documentationcenter: .net,nodejs,java
author: padmavc
manager: anneta
editor: 

ms.assetid: 0e61501d-21a2-4419-8c6c-88724d346e81
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/27/2017
ms.author: padmavc

---

# Decode EDIFACT messages for Azure Logic Apps with the Enterprise Integration Pack

With the Decode EDIFACT message connector, you can validate EDI and partner-specific properties, 
generate an XML document for each transaction set, 
and generate acknowledgment for processed transactions. 
To use this connector, you must add the connector to an existing trigger in your logic app.

## Before you start

Here's the items you need:

* An Azure account; you can create a [free account](https://azure.microsoft.com/free)
* An [integration account](logic-apps-enterprise-integration-create-integration-account.md) 
that's already defined and associated with your Azure subscription. 
You must have an integration account to use the Decode EDIFACT message connector. 
* At least two [partners](logic-apps-enterprise-integration-partners.md) 
that are already defined in your integration account
* An [EDIFACT agreement](logic-apps-enterprise-integration-edifact.md) 
that's already defined in your integration account

## Decode EDIFACT messages

1. [Create a logic app](logic-apps-create-a-logic-app.md).

2. The Decode EDIFACT message connector doesn't have triggers, 
so you must add a trigger for starting your logic app, like a Request trigger. 
In the Logic App Designer, add a trigger, and then add an action to your logic app.

3. In the search box, enter "EDIFACT" as your filter. 
Select **Decode EDIFACT Message**.
   
    ![search EDIFACT](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage1.png)

3. If you didn't previously create any connections to your integration account, 
you're prompted to create that connection now. Name your connection, 
and select the integration account that you want to connect.
   
    ![create integration account](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage2.png)

	Properties with an asterisk are required.

	| Property | Details |
	| --- | --- |
	| Connection Name * |Enter any name for your connection. |
	| Integration Account * |Enter a name for your integration account. Make sure that your integration account and logic app are in the same Azure location. |

4. When you're done to finish creating your connection, choose **Create**. 
Your connection details should look similar to this example:

	![integration account details](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage3.png)  

5. After your connection is created, as shown in this example, 
select the EDIFACT flat file message to decode.

	![integration account connection created](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage4.png)  

	For example:

	![Select EDIFACT flat file message for decoding](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage5.png)  

## EDIFACT decoder details

The Decode EDIFACT connector performs these tasks: 

* Resolve the agreement by matching the sender qualifier & identifier and receiver qualifier & identifier
* Splits multiple interchanges in a single message into separate.
* Validates the envelope against trading partner agreement
* Disassembles the interchange.
* Validates EDI and partner-specific properties includes
  * Validation of the structure of the interchange envelope.
  * Schema validation of the envelope against the control schema.
  * Schema validation of the transaction-set data elements against the message schema.
  * EDI validation performed on transaction-set data elements
* Verifies that the interchange, group, and transaction set control numbers are not duplicates (if configured) 
  * Checks the interchange control number against previously received interchanges. 
  * Checks the group control number against other group control numbers in the interchange. 
  * Checks the transaction set control number against other transaction set control numbers in that group.
* Generates an XML document for each transaction set.
* Converts the entire interchange to XML 
  * Split Interchange as transaction sets - suspend transaction sets on error: Parses each transaction set in an interchange into a separate XML document. If one or more transaction sets in the interchange fail validation, then EDIFACT Decode suspends only those transaction sets. 
  * Split Interchange as transaction sets - suspend interchange on error: Parses each transaction set in an interchange into a separate XML document.  If one or more transaction sets in the interchange fail validation, then EDIFACT Decode suspends the entire interchange.
  * Preserve Interchange - suspend transaction sets on error: Creates an XML document for the entire batched interchange. EDIFACT Decode suspends only those transaction sets that fail validation, while continuing to process all other transaction sets
  * Preserve Interchange - suspend interchange on error: Creates an XML document for the entire batched interchange. If one or more transaction sets in the interchange fail validation, then EDIFACT Decode suspends the entire interchange, 
* Generates a Technical (control) and/or Functional acknowledgment (if configured).
  * A Technical Acknowledgment or the CONTRL ACK reports the results of a syntactical check of the complete received interchange.
  * A functional acknowledgment acknowledges accept or reject a received interchange or a group

## Next steps
[Learn more about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack") 

