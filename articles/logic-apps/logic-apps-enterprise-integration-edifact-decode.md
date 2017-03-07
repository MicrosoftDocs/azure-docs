---
title: Decode EDIFACT messages - Azure Logic Apps | Microsoft Docs
description: How to use the EDIFACT decoder in the Enterprise Integration Pack for Azure Logic Apps 
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

The Decode EDIFACT message connector validates EDI and partner-specific properties, 
generates XML document for each transaction set, and generates acknowledgment for processed transaction.

## Prereqs
* An Azure account; you can create a [free account](https://azure.microsoft.com/free)
* An Integration Account is required to use Decode EDIFACT message connector. See details on how to create an [Integration Account](logic-apps-enterprise-integration-create-integration-account.md), [partners](logic-apps-enterprise-integration-partners.md), and [EDIFACT agreement](logic-apps-enterprise-integration-edifact.md).

## Decode EDIFACT messages
1. [Create a Logic App](logic-apps-create-a-logic-app.md).
2. This connector does not have any triggers. Use other triggers to start the Logic App, such as a Request trigger.  In the Logic App designer, add a trigger and add an action.  Select Show Microsoft managed APIs in the drop-down list and then enter "EDIFACT" in the search box.  Select Decode EDIFACT Message:
   
    ![search EDIFACT](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage1.png)
3. If you haven’t previously created any connections to Integration Account, you are prompted for the connection details:
   
    ![create integration account](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage2.png)  
4. Enter the Integration Account details.  Properties with an asterisk are required:
   
	| Property | Details |
	| --- | --- |
	| Connection Name * |Enter any name for your connection. |
	| Integration Account * |Enter a name for your integration account. Make sure that your integration account and logic app are in the same Azure location. |

	After you're done, your connection details look similar to this example:

	![integration account created](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage3.png)  

5. Select **Create**.
6. Notice the connection has been created:
   
    ![integration account connection details](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage5.png)  
7. Select EDIFACT flat file message to decode:
   
    ![provide mandatory fields](./media/logic-apps-enterprise-integration-edifact-decode/edifactdecodeimage5.png)  

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

