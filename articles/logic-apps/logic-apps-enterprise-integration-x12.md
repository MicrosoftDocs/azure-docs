---
title: Create X12 agreements - Azure Logic Apps | Microsoft Docs
description: How to create X12 agreements for Azure Logic Apps by using the Enterprise Integration Pack
services: logic-apps
documentationcenter: .net,nodejs,java
author: padmavc
manager: anneta
editor: cgronlun

ms.assetid: 7422d2d5-b1c7-4a11-8c9b-0d8cfa463164
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/31/2017
ms.author: padmavc

---
# Enterprise integration with X12

## Prereqs

Before you can exchange X12 messages, you must create an X12 agreement and store that agreement in your integration account. 
The following steps walk you through the process of creating an X12 agreement.

* An [integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md) defined in your Azure subscription  
* At least two [partners](../logic-apps/logic-apps-enterprise-integration-partners.md) configured with EDI X12 qualifier under business identities.   
* Required [Schema](../logic-apps/logic-apps-enterprise-integration-schemas.md) to be uploaded to [integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md)

## Create an X12 agreement

1.	Sign in to the [Azure portal](http://portal.azure.com "Azure portal"). 

2. From the left menu, select **More services**. 

	![Select "More services"](./media/logic-apps-enterprise-integration-x12/account-1.png)

3.	In the filter search box, type "integration". 
In the results list, select **Integration Accounts**.  

	![Filter on "integration", select "Integration Accounts"](./media/logic-apps-enterprise-integration-x12/account-2.png)

3. Select the integration account where you want to add the certificate.

	![Select integration account to add certificate](./media/logic-apps-enterprise-integration-x12/account-3.png)

4. Choose the **Agreements** tile. If you don't see the agreements tile, 
add the tile. 

	![Choose "Agreements" tile](./media/logic-apps-enterprise-integration-agreements/agreement-1.png)

5. In the Agreements blade that opens, choose **Add**.

	![Choose "Add"](./media/logic-apps-enterprise-integration-agreements/agreement-2.png)     

6. Under **Add**, enter a **Name** for your agreement. 
Select **X12** for the agreement type, then select the **Host Partner**, **Host Identity**, **Guest Partner**, and **Guest Identity**.

	![Provide agreement details](./media/logic-apps-enterprise-integration-x12/x12-1.png)  

	| Property | Description |
	| --- | --- |
	| Name |Name of the agreement |
	| Agreement Type | Should be X12 |
	| Host Partner |An agreement needs both a host and guest partner. The host partner represents the organization that is configuring the agreement |
	| Host Identity |An identifier for the host partner |
	| Guest Partner |An agreement needs both a host and guest partner. The guest partner represents the organization that's doing business with the host partner |
	| Guest Identity |An identifier for the guest partner |
	| Receive Settings |These properties apply to all messages received by an agreement |
	| Send Settings |These properties apply to all messages sent by an agreement |  

  > [!NOTE]
  > Resolution of X12 agreement depends on matching the sender qualifier and identifier, 
  > and the receiver qualifier and identifier defined in the partner and incoming message. 
  > If these values change for your partner, update the agreement too.

## Receive Settings

To specify how to handle messages received from your partner through this agreement, 
select **Receive Settings**. Configure these settings based on your agreement with your partner 
and on how you want to identify and handle incoming messages from your partner through this agreement. 

The Receive Settings control is organized into these sections: Identifiers, 
Acknowledgment, Schemas, Envelopes, Control Numbers, Validation, and Internal Settings, 
described here.

### Identifiers

![Set Identifier properties](./media/logic-apps-enterprise-integration-x12/x12-2.png)  

| Property | Description |
| --- | --- |
| ISA1 (Authorization Qualifier) |Select the Authorization qualifier value from the drop-down list. |
| ISA2 |Optional. Enter Authorization information value. If the value you entered for ISA1 is other than 00, enter a minimum of one alphanumeric character and a maximum of 10. |
| ISA3 (Security Qualifier) |Select the Security qualifier value from the drop-down list. |
| ISA4 |Optional. Enter the Security information value. If the value you entered for ISA3 is other than 00, enter a minimum of one alphanumeric character and a maximum of 10. |

### Acknowledgment

![Set Acknowledgement properties](./media/logic-apps-enterprise-integration-x12/x12-3.png) 

| Property | Description |
| --- | --- |
| TA1 expected |Returns a technical acknowledgment to the interchange sender |
| FA expected |Returns a functional acknowledgment to the interchange sender. Then select whether you want the 997 or 999 acknowledgments, based on the schema version |
| Include AK2/IK2 Loop |Enables generation of AK2 loops in functional acknowledgments for accepted transaction sets |

### Schemas

Select a schema for each transaction type (ST1) and Sender Application (GS2). 
The receive pipeline disassembles the incoming message by matching the values for ST1 and GS2 
in the incoming message with the values you set here, and the schema of the incoming message with the schema you set here.

![Select schema](./media/logic-apps-enterprise-integration-x12/x12-33.png) 

| Property | Description |
| --- | --- |
| Version |Select the X12 version |
| Transaction Type (ST01) |Select the transaction type |
| Sender Application (GS02) |Select the sender application |
| Schema |Select the schema file you want to use. Schemas are added to your integration account. |

> [!NOTE]
> Configure the required [Schema](../logic-apps/logic-apps-enterprise-integration-schemas.md) 
> that is uploaded to your [integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md).

### Envelopes

![Specify the separator in a transaction set: choose Standard Identifier or Repetition Seperator](./media/logic-apps-enterprise-integration-x12/x12-34.png)

| Property | Description |
| --- | --- |
| ISA11 Usage |Specifies the separator in a transaction set:</br></br>Select Standard identifier to use "." for decimal notation, rather than the decimal notation of the incoming document in the EDI receive pipeline.</br></br>Select Repetition Separator to specify the separator for repeated occurrences of a simple data element or a repeated data structure. For example, usually "^" is used as the repetition separator. For HIPAA schemas, you can only use "^". |

### Control Numbers

![Select how to handle control number duplicates](./media/logic-apps-enterprise-integration-x12/x12-35.png) 

| Property | Description |
| --- | --- |
| Disallow Interchange Control Number duplicates |Block duplicate interchanges. Checks that the interchange control number (ISA13) for the received interchange control number. If a match is detected, the receive pipeline does not process the interchange. You can specify the number of days at which the check is performed by giving the appropriate value for *Check for duplicate ISA13 every x days*. |
| Disallow Group control number duplicates |Block interchanges with duplicate group control numbers. |
| Disallow Transaction set control number duplicates |Block interchanges with duplicate transaction set control numbers. |

### Validations

![Set Validation properties for received messages](./media/logic-apps-enterprise-integration-x12/x12-36.png) 

| Property | Description |
| --- | --- |
| Message Type |EDI Message types, like 850-Purchase Order or 999-Implementation Acknowledgement |
| EDI Validation |Perform EDI validation on data types as defined by the schema's EDI properties, length restrictions, empty data elements, and trailing separators. |
| Extended Validation |If the data type isn't EDI, validation is on the data element requirement and allowed repetition, enumerations, and data element length validation (min/max). |
| Allow Leading/Trailing Zeroes |Retain any additional leading (or trailing) zero and space characters. Don't remove these characters. |
| Trim Leading/Trailing Zeroes |Remove leading (or trailing) zero and space characters. |
| Trailing Separator Policy |Generates trailing separators on the interchange received from the interchange sender.</br></br>Select Not Allowed when you don't want to allow trailing delimiters and separators in the received interchange. If the interchange contains trailing delimiters and separators, the interchange is declared not valid.</br></br>Select Optional to accept interchanges with or without trailing delimiters and separators.</br></br>Select Mandatory if the interchange must contain trailing delimiters and separators. |

### Internal Settings

![Select internal settings](./media/logic-apps-enterprise-integration-x12/x12-37.png) 

| Property | Description |
| --- | --- |
| Convert implied decimal format *Nn* to a base 10 numeric value |Converts an EDI number that is specified with the format Nn into a base-10 numeric value |
| Create empty XML tags if trailing separators are allowed |Select this check box to have the interchange sender include empty XML tags for trailing separators. |
| Split Interchange as transaction sets - suspend transaction sets on error|Parses each transaction set in an interchange into a separate XML document by applying the appropriate envelope to the transaction set. Suspends only the transactions where the validation fails. |
| Split Interchange as transaction sets - suspend interchange on error|Parses each transaction set in an interchange into a separate XML document by applying the appropriate envelope. Suspends entire interchange if one or more transaction sets in the interchange fail validation. | 
| Preserve Interchange - suspend transaction sets on error |Leaves the interchange intact, creates an XML document for the entire batched interchange. Suspends only the transaction sets that fail validation, while continuing to process all other transaction sets. |
| Preserve Interchange - suspend interchange on error |Leaves the interchange intact, creates an XML document for the entire batched interchange.  Suspends entire interchange if one or more transaction sets in the interchange fail validation. |

After you set the Receive Settings properties, choose **OK**.
Your agreement is ready to handle incoming messages that conform to the schema you selected.

## Send Settings

To specify how to handle messages sent through this agreement, 
select **Send Settings**. Configure these settings based on your agreement with your partner 
and on how you want to identify and handle outgoing messages to your partner.

The Send Settings control is organized into these sections: Identifiers, 
Acknowledgment, Schemas, Envelopes, Character Sets and Separators, 
Control Numbers, and Validation, described here.

### Identifiers

![Set Identifier properties](./media/logic-apps-enterprise-integration-x12/x12-4.png)  

| Property | Description |
| --- | --- |
| Authorization qualifier (ISA1) |Select the Authorization qualifier value from the drop-down list. |
| ISA2 |Enter Authorization information value. If this value is other than 00, then enter a minimum of one alphanumeric character and a maximum of 10. |
| Security qualifier (ISA3) |Select the Security qualifier value from the drop-down list. |
| ISA4 |Enter the Security information value. If this value is other than 00, for the Value (ISA4) text box, then enter a minimum of one alphanumeric value and a maximum of 10. |

### Acknowledgment

![Set Acknowledgement properties](./media/logic-apps-enterprise-integration-x12/x12-5.png)  

| Property | Description |
| --- | --- |
| TA1 expected |Select this checkbox to return a technical (TA1) acknowledgment to the interchange sender. This setting specifies that the host partner who is sending the message requests an acknowledgment from the guest partner in the agreement. These acknowledgments are expected by the host partner based on the Receive Settings of the agreement. |
| FA expected |Select this checkbox to return a functional (FA) acknowledgment to the interchange sender, and then select whether you want the 997 or 999 acknowledgements, based on the schema versions you are working with. These acknowledgments are expected by the host partner based on the Receive Settings of the agreement. |
| FA Version |Select the FA version |

### Schemas

![Select schema to use](./media/logic-apps-enterprise-integration-x12/x12-5.png)  

| Property | Description |
| --- | --- |
| Version |Select the X12 version |
| Transaction Type (ST01) |Select the transaction type |
| SCHEMA |Select the schema to use. Schemas are located in your integration account. If you select schema first, it automatically configures version and transaction type  |

> [!NOTE]
> Configure the required [Schema](../logic-apps/logic-apps-enterprise-integration-schemas.md) 
> that is uploaded to your [integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md).

### Envelopes

![Specify the separator in a transaction set: choose Standard Identifier or Repetition Seperator](./media/logic-apps-enterprise-integration-x12/x12-6.png) 

| Property | Description |
| --- | --- |
| ISA11 Usage |Use this field to specify the separator in a transaction |
| Standard Identifier |Select the Standard identifier to use the decimal notation of “.” |
| Repetition Separator |Select Repetition separator to specify the separator for repeated occurrences of a simple data element or a repeated data structure. For example, usually "^" is used as repetition separator. For HIPAA schemas, you can only use "^". |

### Control Numbers

![Specify Control Number properties](./media/logic-apps-enterprise-integration-x12/x12-8.png) 

| Property | Description |
| --- | --- |
| Control Version Number (ISA12) |Select the version of the X12 standard |
| Usage Indicator (ISA15) |Select the context of an interchange.  The values are information, production data, or test data |
| Schema |Generates the GS and ST segments for an X12-encoded interchange that it sends to the Send Pipeline |
| GS1 |Optional, select a value for the functional code from the drop-down list |
| GS2 |Optional, application sender |
| GS3 |Optional, application receiver |
| GS4 |Optional, select CCYYMMDD or YYMMDD |
| GS5 |Optional, select HHMM, HHMMSS, or HHMMSSdd |
| GS7 |Optional, select a value for the responsible agency from the drop-down list |
| GS8 |Optional, version of the document |
| Interchange Control Number (ISA13) |Required, enter a range of values for the interchange control number. Enter a numeric value with a minimum of 1 and a maximum of 999999999 |
| Group Control Number (GS06) |Required, enter a range of numbers for the group control number. Enter a numeric value with a minimum of 1 and a maximum of 999999999 |
| Transaction Set Control Number (ST02) |Required, enter a range of numbers for the Transaction Set Control number. Enter a range of numeric values with a minimum of 1 and a maximum of 999999999 |
| Prefix |Optional, designated for the range of transaction set control numbers used in acknowledgment. Enter a numeric value for the middle two fields, and an alphanumeric value (if desired) for the prefix and suffix fields. The middle fields are required and contain the minimum and maximum values for the control number |
| Suffix |Optional, designated for the range of transaction set control numbers used in an acknowledgment. Enter a numeric value for the middle two fields and an alphanumeric value (if desired) for the prefix and suffix fields. The middle fields are required and contain the minimum and maximum values for the control number |

### Character Sets and Separators

Other than the character set, you can enter a different set of delimiters to use for each message type. 
If a character set isn't specified for a given message schema, then the default character set is used.

![Specify delimiters to use for message types](./media/logic-apps-enterprise-integration-x12/x12-9.png) 

| Property | Description |
| --- | --- |
| Character Set to be used |To validate the properties, select the X12 character set. The options are Basic, Extended, and UTF8. |
| Schema |Select a schema from the drop-down list. For the selected schema, select the separators set to use. |
| Input Type |Select an input type from the drop-down list. |
| Component element separator |To separate composite data elements, enter a single character. |
| Data Element Separator |To separate simple data elements within composite data elements, enter a single character. |
| Replacement Character |Enter a replacement character. When generating the outbound X12 message, all instances of separator characters in the payload data are replaced with the specified character. |
| Segment Terminator |Enter a single character to indicate the end of an EDI segment. |
| Suffix |Select the character that is used with the segment identifier. If you designate a suffix, then the segment terminator data element can be empty. If the segment terminator is left empty, then you must designate a suffix. |

### Validation

![Set Validation properties for sending messages](./media/logic-apps-enterprise-integration-x12/x12-10.png) 

| Property | Description |
| --- | --- |
| Message Type |Select the message type from the list |
| EDI Validation |Enable validation on the interchange receiver. This validation performs EDI validation on transaction set data elements, validating data types, length restrictions, and empty data elements and trailing separators |
| Extended Validation |Enable extended validation of interchanges received from the interchange sender. This includes validation of field length, optionality, and repeat count in addition to XSD data type validation. You can enable extension validation without enabling EDI validation, or vice versa. |
| Allow Leading/Trailing Zeroes |Specifies that an EDI interchange received from the party doesn't fail validation when a data element in an EDI interchange doesn't conform to its length requirement. The data elment might not conform due to leading (or trailing) zeros or spaces, but does conform to its length requirement when those characters are removed. |
| Trim Leading/Trailing Zeroes |Remove leading (or trailing) zero characters. |
| Trailing Separator Policy |Generates trailing separators on the interchange sent.</br></br>Select Not Allowed if you don't want to allow trailing delimiters and separators in the sent interchange. If the interchange contains trailing delimiters and separators, the interchange is declared invalid.</br></br>Select Optional to send interchanges with or without trailing delimiters and separators.</br></br>Select Mandatory if the sent interchange must contain trailing delimiters and separators. |

1.	After you set the **Send settings** properties, choose **OK**. 
Your agreement is ready to handle outgoing messages that conform to the schema you selected.

2.	To create the agreement, choose **OK**.

3.	On the Integration Account blade, select the **Agreements** tile. The newly added agreement appears. 

	![View the agreement that you created](./media/logic-apps-enterprise-integration-x12/x12-1-5.png)   

## Learn more
* [Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  

