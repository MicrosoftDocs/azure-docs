---
title: Exchange EDIFACT messages in B2B workflows
description: Exchange EDIFACT messages between partners by creating workflows with Azure Logic Apps and Enterprise Integration Pack.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/29/2021
---

# Exchange EDIFACT messages using workflows in Azure Logic Apps

To send and receive EDIFACT messages in workflows that you create using Azure Logic Apps, use the **EDIFACT** connector, which provides triggers and actions that support and manage EDIFACT communication.

This article shows how to add the EDIFACT encoding and decoding actions to an existing logic app workflow. Although you can use any trigger to start your workflow, the examples use the [Request](../connectors/connectors-native-reqres.md) trigger. For more information about the **EDIFACT** connector's triggers, actions, and limits version, review the [connector's reference page](/connectors/edifact/) as documented by the connector's Swagger file.

## Limits

For information about the EDIFACT connector limits for workflows running in [multi-tenant Azure Logic Apps, single-tenant Azure Logic Apps, or the integration service environment (ISE)](logic-apps-overview.md#resource-environment-differences), review the [B2B protocol limits for message sizes](logic-apps-limits-and-config.md#b2b-protocol-limits).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An [integration account resource](logic-apps-enterprise-integration-create-integration-account.md) where you define and store artifacts, such as trading partners, agreements, certificates, and so on, for use in your enterprise integration and B2B workflows. This resource has to meet the following requirements:

  * Is associated with the same Azure subscription as your logic app resource.

  * Exists in the same location or Azure region as your logic app resource.

  * When you use the [**Logic App (Consumption)** resource type](logic-apps-overview.md#resource-environment-differences) and the **EDIFACT** operations, your logic app resource doesn't need a link to your integration account. However, you still need this account to store artifacts, such as partners, agreements, and certificates, along with using the EDIFACT, [X12](logic-apps-enterprise-integration-x12.md), or [AS2](logic-apps-enterprise-integration-as2.md) operations. Your integration account still has to meet other requirements, such as using the same Azure subscription and existing in the same location as your logic app resource.

  * When you use the [**Logic App (Standard)** resource type](logic-apps-overview.md#resource-environment-differences) and the **EDIFACT** operations, your workflow requires a connection to your integration account that you create directly from your workflow when you add the AS2 operation.

* At least two [trading partners](logic-apps-enterprise-integration-partners.md) in your integration account. The definitions for both partners must use the same *business identity* qualifier, which is **ZZZ - Mutually Defined** for this scenario.

* An [EDIFACT agreement](logic-apps-enterprise-integration-agreements.md) in your integration account between the trading partners that participate in your workflow. Each agreement requires a host partner and a guest partner. The content in the messages between you and the other partner must match the agreement type.

  > [!IMPORTANT]
  > The EDIFACT connector supports only UTF-8 characters. If your output contains 
  > unexpected characters, check that your EDIFACT messages use the UTF-8 character set.

* The logic app resource and workflow where you want to use the EDIFACT operations.

  If you're new to logic apps, review [What is Azure Logic Apps](logic-apps-overview.md) and [Quickstart: Create your first logic app](quickstart-create-first-logic-app-workflow.md).

## Configure how your agreement handles received messages

Now that you've set the agreement properties, you can configure how this agreement identifies and handles incoming messages received from your partner through this agreement.

1. Under **Add**, select **Receive Settings**.
Configure these properties based on your agreement 
with the partner that exchanges messages with you. 
For property descriptions, see the tables in this section.

   **Receive Settings** is organized into these sections: 
   Identifiers, Acknowledgment, Schemas, Control Numbers, 
   Validation, and Internal Settings.

   ![Configure "Receive Settings"](./media/logic-apps-enterprise-integration-edifact/edifact-2.png)  

2. After you're done, make sure to save your settings by choosing **OK**.

Now your agreement is ready to handle incoming 
messages that conform to your selected settings.

### Identifiers

| Property | Description |
| --- | --- |
| UNB6.1 (Recipient Reference Password) |Enter an alphanumeric value ranging between 1 and 14 characters. |
| UNB6.2 (Recipient Reference Qualifier) |Enter an alphanumeric value with a minimum of one character and a maximum of two characters. |

### Acknowledgments

| Property | Description |
| --- | --- |
| Receipt of Message (CONTRL) |Select this checkbox to return a technical (CONTRL) acknowledgment to the interchange sender. The acknowledgment is sent to the interchange sender based on the Send Settings for the agreement. |
| Acknowledgement (CONTRL) |Select this checkbox to return a functional (CONTRL) acknowledgment to the interchange sender The acknowledgment is sent to the interchange sender based on the Send Settings for the agreement. |

### Schemas

| Property | Description |
| --- | --- |
| UNH2.1 (TYPE) |Select a transaction set type. |
| UNH2.2 (VERSION) |Enter the message version number. (Minimum, one character; maximum, three characters). |
| UNH2.3 (RELEASE) |Enter the message release number. (Minimum, one character; maximum, three characters). |
| UNH2.5 (ASSOCIATED ASSIGNED CODE) |Enter the assigned code. (Maximum, six characters. Must be alphanumeric). |
| UNG2.1 (APP SENDER ID) |Enter an alphanumeric value with a minimum of one character and a maximum of 35 characters. |
| UNG2.2 (APP SENDER CODE QUALIFIER) |Enter an alphanumeric value, with a maximum of four characters. |
| SCHEMA |Select the previously uploaded schema you want to use from your associated integration account. |

### Control numbers

| Property | Description |
| --- | --- |
| Disallow Interchange Control Number duplicates |To block duplicate interchanges, select this property. If selected, the EDIFACT Decode Action checks that the interchange control number (UNB5) for the received interchange does not match a previously processed interchange control number. If a match is detected, then the interchange is not processed. |
| Check for duplicate UNB5 every (days) |If you chose to disallow duplicate interchange control numbers, you can specify the number of days when to perform the check by giving the appropriate value for this setting. |
| Disallow Group control number duplicates |To block interchanges with duplicate group control numbers (UNG5), select this property. |
| Disallow Transaction set control number duplicates |To block interchanges with duplicate transaction set control numbers (UNH1), select this property. |
| EDIFACT Acknowledgement Control Number |To designate the transaction set reference numbers for use in an acknowledgment, enter a value for the prefix, a range of reference numbers, and a suffix. |

### Validation

When you complete each validation row, another is automatically added. 
If you don't specify any rules, then validation uses the "Default" row.

| Property | Description |
| --- | --- |
| Message Type |Select the EDI message type. |
| EDI Validation |Perform EDI validation on data types as defined by the schema's EDI properties, length restrictions, empty data elements, and trailing separators. |
| Extended Validation |If the data type isn't EDI, validation is on the data element requirement and allowed repetition, enumerations, and data element length validation (min/max). |
| Allow Leading/Trailing Zeroes |Retain any additional leading or trailing zero and space characters. Don't remove these characters. |
| Trim Leading/Trailing Zeroes |Remove leading or trailing zero and space characters. |
| Trailing Separator Policy |Generate trailing separators. <p>Select **Not Allowed** to prohibit trailing delimiters and separators in the received interchange. If the interchange has trailing delimiters and separators, the interchange is declared not valid. <p>Select **Optional** to accept interchanges with or without trailing delimiters and separators. <p>Select **Mandatory** when the received interchange must have trailing delimiters and separators. |

### Internal settings

| Property | Description |
| --- | --- |
| Create empty XML tags if trailing separators are allowed |Select this check box to have the interchange sender include empty XML tags for trailing separators. |
| Split Interchange as transaction sets - suspend transaction sets on error|Parses each transaction set in an interchange into a separate XML document by applying the appropriate envelope to the transaction set. Suspend only the transaction sets that fail validation. |
| Split Interchange as transaction sets - suspend interchange on error|Parses each transaction set in an interchange into a separate XML document by applying the appropriate envelope. Suspend the entire interchange when one or more transaction sets in the interchange fail validation. | 
| Preserve Interchange - suspend transaction sets on error |Leaves the interchange intact, creates an XML document for the entire batched interchange. Suspend only the transaction sets that fail validation, while continuing to process all other transaction sets. |
| Preserve Interchange - suspend interchange on error |Leaves the interchange intact, creates an XML document for the entire batched interchange. Suspend the entire interchange when one or more transaction sets in the interchange fail validation. |

## Configure how your agreement sends messages

You can configure how this agreement identifies and handles outgoing 
messages that you send to your partners through this agreement.

1.	Under **Add**, select **Send Settings**.
Configure these properties based on your agreement 
with your partner who exchanges messages with you. 
For property descriptions, see the tables in this section.

	**Send Settings** is organized into these sections: 
	Identifiers, Acknowledgment, Schemas, Envelopes, 
	Character Sets and Separators, Control Numbers, and Validations.

	![Configure "Send Settings"](./media/logic-apps-enterprise-integration-edifact/edifact-3.png)    

2. After you're done, 
make sure to save your settings by choosing **OK**.

Now your agreement is ready to handle outgoing 
messages that conform to your selected settings.

### Identifiers

| Property | Description |
| --- | --- |
| UNB1.2 (Syntax version) |Select a value between **1** and **4**. |
| UNB2.3 (Sender Reverse Routing Address) |Enter an alphanumeric value with a minimum of one character and a maximum of 14 characters. |
| UNB3.3 (Recipient Reverse Routing Address) |Enter an alphanumeric value with a minimum of one character and a maximum of 14 characters. |
| UNB6.1 (Recipient Reference Password) |Enter an alphanumeric value with a minimum of one and a maximum of 14 characters. |
| UNB6.2 (Recipient Reference Qualifier) |Enter an alphanumeric value with a minimum of one character and a maximum of two characters. |
| UNB7 (Application Reference ID) |Enter an alphanumeric value with a minimum of one character and a maximum of 14 characters |

### Acknowledgment

| Property | Description |
| --- | --- |
| Receipt of Message (CONTRL) |Select this checkbox if the hosted partner expects to receive a technical (CONTRL) acknowledgment. This setting specifies that the hosted partner, who is sending the message, requests an acknowledgement from the guest partner. |
| Acknowledgement (CONTRL) |Select this checkbox if the hosted partner expects to receive a functional (CONTRL) acknowledgment. This setting specifies that the hosted partner, who is sending the message, requests an acknowledgement from the guest partner. |
| Generate SG1/SG4 loop for accepted transaction sets |If you chose to request a functional acknowledgement, select this checkbox to force generation of SG1/SG4 loops in functional CONTRL acknowledgments for accepted transaction sets. |

### Schemas

| Property | Description |
| --- | --- |
| UNH2.1 (TYPE) |Select a transaction set type. |
| UNH2.2 (VERSION) |Enter the message version number. |
| UNH2.3 (RELEASE) |Enter the message release number. |
| SCHEMA |Select the schema to use. Schemas are located in your integration account. To access your schemas, first link your integration account to your Logic app. |

### Envelopes

| Property | Description |
| --- | --- |
| UNB8 (Processing Priority Code) |Enter an alphabetical value that is not more than one character long. |
| UNB10 (Communication Agreement) |Enter an alphanumeric value with a minimum of one character and a maximum of 40 characters. |
| UNB11 (Test Indicator) |Select this checkbox to indicate that the interchange generated is test data |
| Apply UNA Segment (Service String Advice) |Select this checkbox to generate a UNA segment for the interchange to be sent. |
| Apply UNG Segments (Function Group Header) |Select this checkbox to create grouping segments in the functional group header in the messages sent to the guest partner. The following values are used to create the UNG segments: <p>For **UNG1**, enter an alphanumeric value with a minimum of one character and a maximum of six characters. <p>For **UNG2.1**, enter an alphanumeric value with a minimum of one character and a maximum of 35 characters. <p>For **UNG2.2**, enter an alphanumeric value, with a maximum of four characters. <p>For **UNG3.1**, enter an alphanumeric value with a minimum of one character and a maximum of 35 characters. <p>For **UNG3.2**, enter an alphanumeric value, with a maximum of four characters. <p>For **UNG6**, enter an alphanumeric value with a minimum of one and a maximum of three characters. <p>For **UNG7.1**, enter an alphanumeric value with a minimum of one character and a maximum of three characters. <p>For **UNG7.2**, enter an alphanumeric value with a minimum of one character and a maximum of three characters. <p>For **UNG7.3**, enter an alphanumeric value with a minimum of 1 character and a maximum of 6 characters. <p>For **UNG8**, enter an alphanumeric value with a minimum of one character and a maximum of 14 characters. |

### Character sets and separators

Other than the character set, you can enter a different set of delimiters to be used for each message type. 
If a character set is not specified for a given message schema, then the default character set is used.

| Property | Description |
| --- | --- |
| UNB1.1 (System Identifier) |Select the EDIFACT character set to be applied on the outgoing interchange. |
| Schema |Select a schema from the drop-down list. After you complete each row, a new row is automatically added. For the selected schema, select the separators set that you want to use, based on the separator descriptions below. |
| Input Type |Select an input type from the drop-down list. |
| Component Separator |To separate composite data elements, enter a single character. |
| Data Element Separator |To separate simple data elements within composite data elements, enter a single character. |
| Segment Terminator |To indicate the end of an EDI segment, enter a single character. |
| Suffix |Select the character that is used with the segment identifier. If you designate a suffix, then the segment terminator data element can be empty. If the segment terminator is left empty, then you must designate a suffix. |

### Control numbers

| Property | Description |
| --- | --- |
| UNB5 (Interchange Control Number) |Enter a prefix, a range of values for the interchange control number, and a suffix. These values are used to generate an outgoing interchange. The prefix and suffix are optional, while the control number is required. The control number is incremented for each new message; the prefix and suffix remain the same. |
| UNG5 (Group Control Number) |Enter a prefix, a range of values for the interchange control number, and a suffix. These values are used to generate the group control number. The prefix and suffix are optional, while the control number is required. The control number is incremented for each new message until the maximum value is reached; the prefix and suffix remain the same. |
| UNH1 (Message Header Reference Number) |Enter a prefix, a range of values for the interchange control number, and a suffix. These values are used to generate the message header reference number. The prefix and suffix are optional, while the reference number is required. The reference number is incremented for each new message; the prefix and suffix remain the same. |

### Validation

When you complete each validation row, another is automatically added. 
If you don't specify any rules, then validation uses the "Default" row.

| Property | Description |
| --- | --- |
| Message Type |Select the EDI message type. |
| EDI Validation |Perform EDI validation on data types as defined by the EDI properties of the schema, length restrictions, empty data elements, and trailing separators. |
| Extended Validation |If the data type isn't EDI, validation is on the data element requirement and allowed repetition, enumerations, and data element length validation (min/max). |
| Allow Leading/Trailing Zeroes |Retain any additional leading or trailing zero and space characters. Don't remove these characters. |
| Trim Leading/Trailing Zeroes |Remove leading or trailing zero characters. |
| Trailing Separator Policy |Generate trailing separators. <p>Select **Not Allowed** to prohibit trailing delimiters and separators in the sent interchange. If the interchange has trailing delimiters and separators, the interchange is declared not valid. <p>Select **Optional** to send interchanges with or without trailing delimiters and separators. <p>Select **Mandatory** if the sent interchange must have trailing delimiters and separators. |

## Find your created agreement

1.	After you finish setting all your agreement properties, 
on the **Add** page, choose **OK** to finish creating your agreement 
and return to your integration account.

	Your newly added agreement now appears in your **Agreements** list.

2.	You can also view your agreements in your integration account overview. 
On your integration account menu, choose **Overview**, then select the **Agreements** tile. 

	![Screenshot that shows the Agreements tile.](./media/logic-apps-enterprise-integration-edifact/edifact-4.png)   

## Connector reference

For more technical details about this connector, such as actions and limits as described by the connector's Swagger file, see the [connector's reference page](/connectors/edifact/).

> [!NOTE]
> For logic apps in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
> this connector's ISE-labeled version uses the [B2B message limits for ISE](../logic-apps/logic-apps-limits-and-config.md#b2b-protocol-limits).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
