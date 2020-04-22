---
title: Send and receive X12 messages for B2B
description: Exchange X12 messages for B2B enterprise integration scenarios by using Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, logicappspm
ms.topic: article
ms.date: 04/23/2020
---

# Exchange X12 messages for B2B enterprise integration in Azure Logic Apps with Enterprise Integration Pack

To work with X12 messages in Azure Logic Apps, you can use the X12 connector, which provides triggers and actions for managing X12 communication. For information about EDIFACT messages instead, see [Exchange EDIFACT messsages](logic-apps-enterprise-integration-edifact.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app from where you want to use the X12 connector and a trigger that starts your logic app's workflow. The X12 connector provides only actions, not triggers. If you're new to logic apps, review [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) that's associated with your Azure subscription and linked to the logic app where you plan to use the X12 connector. Both your logic app and integration account must exist in the same location or Azure region.

* At least two [trading partners](../logic-apps/logic-apps-enterprise-integration-partners.md) that you've already defined in your integration account by using the X12 identity qualifier.

* A [schema](../logic-apps/logic-apps-enterprise-integration-schemas.md) to use for XML validation that you've already added to your integration account. If you're working with Health Insurance Portability and Accountability Act (HIPAA) schemas, see [Settings for HIPAA schemas](#hipaa-schemas).

* Before you can use the X12 connector, you must create an X12 [agreement](../logic-apps/logic-apps-enterprise-integration-agreements.md) between your trading partners and store that agreement in your integration account.

* If you use [Azure Key Vault](../key-vault/general/overview.md) for certificate management, check that your vault keys permit the **Encrypt** and **Decrypt** operations. Otherwise, the encoding and decoding actions fail.

  In the Azure portal, go to the key in your key vault, review your key's **Permitted operations**, and confirm that the **Encrypt** and **Decrypt** operations are selected, for example:

  ![Check vault key operations](media/logic-apps-enterprise-integration-x12/key-vault-permitted-operations.png)

<a name="receive-message-settings"></a>

## Receive message settings

After you set the agreement properties, you can configure how this agreement identifies and handles inbound messages that you receive from your partner through this agreement.

1. Under **Add**, select **Receive Settings**.

1. Configure these properties based on your agreement with the partner that exchanges messages with you. For property descriptions, see the tables in this section.

   The **Receive Settings** are organized into these sections:

   * Identifiers
   * Acknowledgment
   * Schemas
   * Envelopes
   * Control Numbers
   * Validations
   * Internal Settings

1. After you're done, make sure to save your settings by selecting **OK**.

<a name="receive-identifiers"></a>

### Identifiers

![Set identifier properties](./media/logic-apps-enterprise-integration-x12/x12-2.png)

| Property | Required | Description |
|----------|----------|-------------|
| **ISA1 (Authorization Qualifier)** | Yes | The Authorization qualifier value |
| **ISA2** | No | The Authorization information value. If the value that you entered for ISA1 is other than 00, enter a minimum of one alphanumeric character and a maximum of 10. |
| **ISA3 (Security Qualifier)** | Yes | The Security qualifier value |
| **ISA4** | No | The Security information value. If the value you entered for ISA3 is other than 00, enter a minimum of one alphanumeric character and a maximum of 10. |
||||

<a name="receive-acknowledgment"></a>

### Acknowledgment

![Set acknowledgement properties](./media/logic-apps-enterprise-integration-x12/x12-3.png) 

| Property | Required | Description |
|----------|----------|-------------|
| **TA1 Expected** | No | Return a technical acknowledgment to the interchange sender. |
| **FA Expected** | No | Return a functional acknowledgment to the interchange sender. Based on the schema version, select either the 997 or 999 acknowledgments. |
| **Include AK2 / IK2 Loop** | No | Enable generation of AK2 loops in functional acknowledgments for accepted transaction sets. |
||||

<a name="receive-schemas"></a>

### Schemas

In this section, select a [schema](../logic-apps/logic-apps-enterprise-integration-schemas.md) from your [integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md) for each transaction type (ST1) and Sender Application (GS2). The receive pipeline disassembles the incoming message by matching the values and schema that you set in this section with the values for ST1 and GS2 in the incoming message and with the schema of the incoming message.

![Select schema](./media/logic-apps-enterprise-integration-x12/x12-33.png) 

| Property | Description |
|----------|-------------|
| **Version** | The X12 version |
| **Transaction Type (ST01)** | The transaction type |
| **Sender Application (GS02)** | The sender application |
| **Schema** | The schema file that you want to use |
|||

<a name="receive-envelopes"></a>

### Envelopes

![Settings for the separator to use in a transaction set](./media/logic-apps-enterprise-integration-x12/x12-34.png)

| Property | Description |
|----------|-------------|
| **ISA11 Usage** | The separator to use in a transaction set: <p>- **Standard Identifier**: Use a period (.) for decimal notation, rather than the decimal notation of the incoming document in the EDI receive pipeline. <p>- **Repetition Separator**: Specify the separator for repeated occurrences of a simple data element or a repeated data structure. For example, usually the carat (^) is used as the repetition separator. For HIPAA schemas, you can only use the carat. |
|||

<a name="receive-control-numbers"></a>

### Control Numbers

![Settings for handling control number duplicates](./media/logic-apps-enterprise-integration-x12/x12-35.png) 

| Property | Description |
|----------|-------------|
| **Disallow Interchange control number duplicates** | Block duplicate interchanges. Check the interchange control number (ISA13) for the received interchange control number. If a match is detected, the receive pipeline doesn't process the interchange. <p><p>To specify the number of days to perform the check, enter a value for the **Check for duplicate ISA13 every (days)** property. |
| **Disallow Group control number duplicates** | Block interchanges that have duplicate group control numbers. |
| **Disallow Transaction set control number duplicates** | Block interchanges that have duplicate transaction set control numbers. |
|||

<a name="receive-validation"></a>

### Validation

If you don't specify any rules, validation uses the **Default** row. Otherwise, after you complete each validation row, a new empty row automatically appears.

![Validation properties for received messages](./media/logic-apps-enterprise-integration-x12/x12-36.png) 

| Property | Description |
|----------|-------------|
| **Message Type** | The EDI message type |
| **EDI Validation** | Perform EDI validation on data types as defined by the schema's EDI properties, length restrictions, empty data elements, and trailing separators. |
| **Extended Validation** | If the data type isn't EDI, validation is on the data element requirement and allowed repetition, enumerations, and data element length validation (min or max). |
| **Allow Leading/Trailing Zeroes** | Keep any additional leading or trailing zero and space characters. Don't remove these characters. |
| **Trim Leading/Trailing Zeroes** | Remove any leading or trailing zero and space characters. |
| **Trailing Separator Policy** | Generate trailing separators. <p>- **Not Allowed**: Prohibit trailing delimiters and separators in the received interchange. If the interchange has trailing delimiters and separators, the interchange is declared not valid. <p>- **Optional**: Accept interchanges with or without trailing delimiters and separators. <p>- **Mandatory**: When the interchange must have trailing delimiters and separators. |
|||

<a name="receive-internal"></a>

### Internal Settings

![Internal settings for received messages](./media/logic-apps-enterprise-integration-x12/x12-received-messages-internal-settings.png)

| Property | Description |
|----------|-------------|
| **Convert implied decimal format Nn to a base 10 numeric value** | Convert an EDI number that is specified with the format "Nn" into a base-10 numeric value. |
| **Create empty XML tags if trailing separators are allowed** | Have the interchange sender include empty XML tags for trailing separators. |
| **Split Interchange as transaction sets - suspend transaction sets on error** | Parse each transaction set that's in an interchange into a separate XML document by applying the appropriate envelope to the transaction set. Suspend only the transactions where the validation fails. |
| **Split Interchange as transaction sets - suspend interchange on error** | Parse each transaction set that's in an interchange into a separate XML document by applying the appropriate envelope. Suspend the entire interchange when one or more transaction sets in the interchange fail validation. |
| **Preserve Interchange - suspend transaction sets on error** | Leave the interchange intact and create an XML document for the entire batched interchange. Suspend only the transaction sets that fail validation, but continue to process all other transaction sets. |
| **Preserve Interchange - suspend interchange on error** |Leaves the interchange intact, creates an XML document for the entire batched interchange. Suspends the entire interchange when one or more transaction sets in the interchange fail validation. |
|||

<a name="send-message-settings"></a>

## Send message settings

After you set the agreement properties, you can configure how this agreement identifies and handles outbound messages that you send to your partner through this agreement.

1. Under **Add**, select **Send Settings**.

1. Configure these properties based on your agreement with the partner that exchanges messages with you. For property descriptions, see the tables in this section.

   The **Send Settings** are organized into these sections: Identifiers, Acknowledgment, Schemas, Envelopes, Character Sets and Separators, Control Numbers, and Validation.

1. After you're done, make sure to save your settings by selecting **OK**.

### Identifiers

![Set identifier properties](./media/logic-apps-enterprise-integration-x12/x12-4.png)  

| Property | Description |
| --- | --- |
| Authorization qualifier (ISA1) |Select the Authorization qualifier value from the drop-down list. |
| ISA2 |Enter Authorization information value. If this value is other than 00, then enter a minimum of one alphanumeric character and a maximum of 10. |
| Security qualifier (ISA3) |Select the Security qualifier value from the drop-down list. |
| ISA4 |Enter the Security information value. If this value is other than 00, for the Value (ISA4) text box, then enter a minimum of one alphanumeric value and a maximum of 10. |

### Acknowledgment

![Set acknowledgement properties](./media/logic-apps-enterprise-integration-x12/x12-5.png)  

| Property | Description |
| --- | --- |
| TA1 expected |Return a technical acknowledgment (TA1) to the interchange sender. This setting specifies that the host partner who is sending the message requests an acknowledgment from the guest partner in the agreement. These acknowledgments are expected by the host partner based on the Receive Settings of the agreement. |
| FA expected |Return a functional acknowledgment (FA) to the interchange sender. Select whether you want the 997 or 999 acknowledgements, based on the schema versions you are working with. These acknowledgments are expected by the host partner based on the Receive Settings of the agreement. |
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

![Specify the separator in a transaction set: choose Standard Identifier or Repetition Separator](./media/logic-apps-enterprise-integration-x12/x12-6.png) 

| Property | Description |
| --- | --- |
| ISA11 Usage |Specifies the separator to use in a transaction set: <p>Select **Standard identifier** to use a period (.) for decimal notation, rather than the decimal notation of the incoming document in the EDI receive pipeline. <p>Select **Repetition Separator** to specify the separator for repeated occurrences of a simple data element or a repeated data structure. For example, usually the carat (^) is used as the repetition separator. For HIPAA schemas, you can only use the carat. |

### Control numbers

![Specify control number properties](./media/logic-apps-enterprise-integration-x12/x12-8.png) 

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

### Character sets and separators

Other than the character set, you can enter a different set of delimiters for each message type. 
If a character set isn't specified for a given message schema, then the default character set is used.

![Specify delimiters for message types](./media/logic-apps-enterprise-integration-x12/x12-9.png) 

| Property | Description |
| --- | --- |
| Character Set to be used |To validate the properties, select the X12 character set. The options are Basic, Extended, and UTF8. |
| Schema |Select a schema from the drop-down list. After you complete each row, a new row is automatically added. For the selected schema, select the separators set that you want to use, based on the separator descriptions below. |
| Input Type |Select an input type from the drop-down list. |
| Component Separator |To separate composite data elements, enter a single character. |
| Data Element Separator |To separate simple data elements within composite data elements, enter a single character. |
| Replacement Character |Enter a replacement character used for replacing all separator characters in the payload data when generating the outbound X12 message. |
| Segment Terminator |To indicate the end of an EDI segment, enter a single character. |
| Suffix |Select the character that is used with the segment identifier. If you designate a suffix, then the segment terminator data element can be empty. If the segment terminator is left empty, then you must designate a suffix. |

> [!TIP]
> To provide special character values, edit the agreement as JSON and provide the ASCII value for the special character.

### Validation

![Set validation properties for sending messages](./media/logic-apps-enterprise-integration-x12/x12-10.png) 

When you complete each validation row, another is automatically added. 
If you don't specify any rules, then validation uses the "Default" row.

| Property | Description |
| --- | --- |
| Message Type |Select the EDI message type. |
| EDI Validation |Perform EDI validation on data types as defined by the schema's EDI properties, length restrictions, empty data elements, and trailing separators. |
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

	![Choose "Agreements" tile](./media/logic-apps-enterprise-integration-x12/x12-1-5.png)   

## Connector reference

For more technical details about this connector, such as actions and limits as described by the connector's Swagger file, see the [connector's reference page](https://docs.microsoft.com/connectors/x12/). 

> [!NOTE]
> For logic apps in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
> this connector's ISE-labeled version uses the [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) instead.

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)