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

<a name="receive-settings"></a>

## Receive Settings

After you set the agreement properties, you can configure how this agreement identifies and handles inbound messages that you receive from your partner through this agreement.

1. Under **Add**, select **Receive Settings**.

1. Configure these properties based on your agreement with the partner that exchanges messages with you. The **Receive Settings** are organized into these sections:

   * [Identifiers](#inbound-identifiers)
   * [Acknowledgement](#inbound-acknowledgement)
   * [Schemas](#inbound-schemas)
   * [Envelopes](#inbound-envelopes)
   * [Control Numbers](#inbound-control-numbers)
   * [Validations](#inbound-validations)
   * [Internal Settings](#inbound-internal-settings)

   For property descriptions, see the tables in this section.

1. When you're done, make sure to save your settings by selecting **OK**.

<a name="inbound-identifiers"></a>

### Receive Settings - Identifiers

![Identifier properties for inbound messages](./media/logic-apps-enterprise-integration-x12/x12-received-messages-identifiers.png)

| Property | Description |
|----------|-------------|
| **ISA1 (Authorization Qualifier)** | The Authorization Qualifier value that you want to use. The default value is **00 - No Authorization Information Present**. <p>**Note**: If you select other values, specify a value for the **ISA2** property. |
| **ISA2** | The Authorization Information value to use when the **ISA1** property is not **00 - No Authorization Information Present**. This property value must have a minimum of one alphanumeric character and a maximum of 10. |
| **ISA3 (Security Qualifier)** | The Security Qualifier value that you want to use. The default value is **00 - No Security Information Present**. <p>**Note**: If you select other values, specify a value for the **ISA4** property. |
| **ISA4** | The Security Information value to use when the **ISA3** property is not **00 - No Security Information Present**. This property value must have a minimum of one alphanumeric character and a maximum of 10. |
|||

<a name="inbound-acknowledgement"></a>

### Receive Settings - Acknowledgement

![Acknowledgement for inbound messages](./media/logic-apps-enterprise-integration-x12/x12-received-messages-acknowledgement.png)

| Property | Description |
|----------|-------------|
| **TA1 Expected** | Return a technical acknowledgment (TA1) to the interchange sender. |
| **FA Expected** | Return a functional acknowledgment (FA) to the interchange sender. <p>For the **FA Version** property, based on the schema version, select the 997 or 999 acknowledgments. <p>To enable generation of AK2 loops in functional acknowledgments for accepted transaction sets, select **Include AK2 / IK2 Loop**. |
||||

<a name="inbound-schemas"></a>

### Receive Settings - Schemas

In this section, select a [schema](../logic-apps/logic-apps-enterprise-integration-schemas.md) from your [integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md) for each transaction type (ST01) and Sender Application (GS02). The receive pipeline disassembles the incoming message by matching the values and schema that you set in this section with the values for ST01 and GS02 in the incoming message and with the schema of the incoming message.

![Schemas for inbound messages](./media/logic-apps-enterprise-integration-x12/x12-received-messages-schemas.png)

| Property | Description |
|----------|-------------|
| **Version** | The X12 version for the schema |
| **Transaction Type (ST01)** | The transaction type |
| **Sender Application (GS02)** | The sender application |
| **Schema** | The schema file that you want to use |
|||

<a name="inbound-envelopes"></a>

### Receive Settings - Envelopes

![Separators to use in transaction sets for inbound messages](./media/logic-apps-enterprise-integration-x12/x12-received-messages-envelopes.png)

| Property | Description |
|----------|-------------|
| **ISA11 Usage** | The separator to use in a transaction set: <p>- **Standard Identifier**: Use a period (.) for decimal notation, rather than the decimal notation of the incoming document in the EDI receive pipeline. <p>- **Repetition Separator**: Specify the separator for repeated occurrences of a simple data element or a repeated data structure. For example, usually the carat (^) is used as the repetition separator. For HIPAA schemas, you can only use the carat. |
|||

<a name="inbound-control-numbers"></a>

### Receive Settings - Control Numbers

![Handling control number duplicates for inbound messages](./media/logic-apps-enterprise-integration-x12/x12-received-messages-control-numbers.png) 

| Property | Description |
|----------|-------------|
| **Disallow Interchange control number duplicates** | Block duplicate interchanges. Check the interchange control number (ISA13) for the received interchange control number. If a match is detected, the receive pipeline doesn't process the interchange. <p><p>To specify the number of days to perform the check, enter a value for the **Check for duplicate ISA13 every (days)** property. |
| **Disallow Group control number duplicates** | Block interchanges that have duplicate group control numbers. |
| **Disallow Transaction set control number duplicates** | Block interchanges that have duplicate transaction set control numbers. |
|||

<a name="inbound-validations"></a>

### Receive Settings - Validations

If you don't specify any rules, validation uses the **Default** row. Otherwise, after you complete each validation row, a new empty row automatically appears.

![Validations for inbound messages](./media/logic-apps-enterprise-integration-x12/x12-received-messages-validations.png)

| Property | Description |
|----------|-------------|
| **Message Type** | The EDI message type |
| **EDI Validation** | Perform EDI validation on data types as defined by the schema's EDI properties, length restrictions, empty data elements, and trailing separators. |
| **Extended Validation** | If the data type isn't EDI, validation is on the data element requirement and allowed repetition, enumerations, and data element length validation (min or max). |
| **Allow Leading/Trailing Zeroes** | Keep any additional leading or trailing zero and space characters. Don't remove these characters. |
| **Trim Leading/Trailing Zeroes** | Remove any leading or trailing zero and space characters. |
| **Trailing Separator Policy** | Generate trailing separators. <p>- **Not Allowed**: Prohibit trailing delimiters and separators in the received interchange. If the interchange has trailing delimiters and separators, the interchange is declared not valid. <p>- **Optional**: Accept interchanges with or without trailing delimiters and separators. <p>- **Mandatory**: When the interchange must have trailing delimiters and separators. |
|||

<a name="inbound-internal-settings"></a>

### Receive Settings - Internal Settings

![Internal settings for inbound messages](./media/logic-apps-enterprise-integration-x12/x12-received-messages-internal-settings.png)

| Property | Description |
|----------|-------------|
| **Convert implied decimal format Nn to a base 10 numeric value** | Convert an EDI number that is specified with the format "Nn" into a base-10 numeric value. |
| **Create empty XML tags if trailing separators are allowed** | Have the interchange sender include empty XML tags for trailing separators. |
| **Split Interchange as transaction sets - suspend transaction sets on error** | Parse each transaction set that's in an interchange into a separate XML document by applying the appropriate envelope to the transaction set. Suspend only the transactions where the validation fails. |
| **Split Interchange as transaction sets - suspend interchange on error** | Parse each transaction set that's in an interchange into a separate XML document by applying the appropriate envelope. Suspend the entire interchange when one or more transaction sets in the interchange fail validation. |
| **Preserve Interchange - suspend transaction sets on error** | Leave the interchange intact and create an XML document for the entire batched interchange. Suspend only the transaction sets that fail validation, but continue to process all other transaction sets. |
| **Preserve Interchange - suspend interchange on error** |Leaves the interchange intact, creates an XML document for the entire batched interchange. Suspends the entire interchange when one or more transaction sets in the interchange fail validation. |
|||

<a name="send-settings"></a>

## Send Settings

After you set the agreement properties, you can configure how this agreement identifies and handles outbound messages that you send to your partner through this agreement.

1. Under **Add**, select **Send Settings**.

1. Configure these properties based on your agreement with the partner that exchanges messages with you. For property descriptions, see the tables in this section.

   The **Send Settings** are organized into these sections:

   * [Identifiers](#outbound-identifiers)
   * [Acknowledgement](#outbound-acknowledgement)
   * [Schemas](#outbound-schemas)
   * [Envelopes](#outbound-envelopes)
   * [Character Sets and Separators](#outbound-character-sets-separators)
   * [Control Numbers](#outbound-control-numbers)
   * [Validation](#outbound-validation)

1. When you're done, make sure to save your settings by selecting **OK**.

<a name="outbound-identifiers"></a>

### Send Settings - Identifiers

![Identifier properties for outbound messages](./media/logic-apps-enterprise-integration-x12/x12-send-messages-identifiers.png)

| Property | Description |
|----------|-------------|
| **ISA1 (Authorization Qualifier)** | The Authorization Qualifier value that you want to use. The default value is **00 - No Authorization Information Present**. <p>**Note**: If you select other values, specify a value for the **ISA2** property. |
| **ISA2** | The Authorization Information value to use when the **ISA1** property is not **00 - No Authorization Information Present**. This property value must have a minimum of one alphanumeric character and a maximum of 10. |
| **ISA3 (Security Qualifier)** | The Security Qualifier value that you want to use. The default value is **00 - No Security Information Present**. <p>**Note**: If you select other values, specify a value for the **ISA4** property. |
| **ISA4** | The Security Information value to use when the **ISA3** property is not **00 - No Security Information Present**. This property value must have a minimum of one alphanumeric character and a maximum of 10. |
|||

<a name="outbound-acknowledgement"></a>

### Send Settings - Acknowledgement

![Acknowledgement properties for outbound messages](./media/logic-apps-enterprise-integration-x12/x12-send-messages-acknowledgement.png)

| Property | Description |
|----------|-------------|
| **TA1 Expected** | Return a technical acknowledgment (TA1) to the interchange sender. <p>This setting specifies that the host partner, who is sending the message, requests an acknowledgment from the guest partner in the agreement. These acknowledgments are expected by the host partner based on the agreement's Receive Settings. |
| **FA Expected** | Return a functional acknowledgment (FA) to the interchange sender. For the **FA Version** property, based on the schema version, select the 997 or 999 acknowledgements. <p>This settings specifies that the host partner, who is sending the message, requests an acknowledgement from the guest partner in the agreement. These acknowledgments are expected by the host partner based on the agreement's Receive Settings. |
|||

<a name="outbound-schemas"></a>

### Send Settings - Schemas

In this section, select a [schema](../logic-apps/logic-apps-enterprise-integration-schemas.md) from your [integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md) for each transaction type (ST01).

![Schemas for outbound messages](./media/logic-apps-enterprise-integration-x12/x12-send-messages-schemas.png)

| Property | Description |
|----------|-------------|
| **Version** | The X12 version for the schema |
| **Transaction Type (ST01)** | The transaction type for the schema |
| **Schema** | The schema file that you want to use. If you select the schema first, the version and transaction type are automatically set. |
|||

<a name="outbound-envelopes"></a>

### Send Settings - Envelopes

![Separators in a transaction set to use for outbound messages](./media/logic-apps-enterprise-integration-x12/x12-6.png) 

| Property | Description |
|----------|-------------|
| ISA11 Usage |Specifies the separator to use in a transaction set: <p>Select **Standard identifier** to use a period (.) for decimal notation, rather than the decimal notation of the incoming document in the EDI receive pipeline. <p>Select **Repetition Separator** to specify the separator for repeated occurrences of a simple data element or a repeated data structure. For example, usually the carat (^) is used as the repetition separator. For HIPAA schemas, you can only use the carat. |
|||

<a name="outbound-control-numbers"></a>

### Send Settings - Control Numbers

![Control numbers for outbound messages](./media/logic-apps-enterprise-integration-x12/x12-8.png) 

| Property | Description |
|----------|-------------|
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
|||

<a name="outbound-character-sets-separators"></a>

### Send Settings - Character Sets and Separators

Other than the character set, you can enter a different set of delimiters for each message type. 
If a character set isn't specified for a given message schema, then the default character set is used.

![Delimiters for message types in outbound messages](./media/logic-apps-enterprise-integration-x12/x12-9.png) 

> [!TIP]
> To provide special character values, edit the agreement as JSON and provide the ASCII value for the special character.

| Property | Description |
|----------|-------------|
| Character Set to be used |To validate the properties, select the X12 character set. The options are Basic, Extended, and UTF8. |
| Schema |Select a schema from the drop-down list. After you complete each row, a new row is automatically added. For the selected schema, select the separators set that you want to use, based on the separator descriptions below. |
| Input Type |Select an input type from the drop-down list. |
| Component Separator |To separate composite data elements, enter a single character. |
| Data Element Separator |To separate simple data elements within composite data elements, enter a single character. |
| Replacement Character |Enter a replacement character used for replacing all separator characters in the payload data when generating the outbound X12 message. |
| Segment Terminator |To indicate the end of an EDI segment, enter a single character. |
| Suffix |Select the character that is used with the segment identifier. If you designate a suffix, then the segment terminator data element can be empty. If the segment terminator is left empty, then you must designate a suffix. |
|||

<a name="outbound-validation"></a>

### Send Settings - Validation

![Validation properties for outbound messages](./media/logic-apps-enterprise-integration-x12/x12-10.png) 

When you complete each validation row, another is automatically added. 
If you don't specify any rules, then validation uses the "Default" row.

| Property | Description |
|----------|-------------|
| Message Type |Select the EDI message type. |
| EDI Validation |Perform EDI validation on data types as defined by the schema's EDI properties, length restrictions, empty data elements, and trailing separators. |
| Extended Validation |If the data type isn't EDI, validation is on the data element requirement and allowed repetition, enumerations, and data element length validation (min/max). |
| Allow Leading/Trailing Zeroes |Retain any additional leading or trailing zero and space characters. Don't remove these characters. |
| Trim Leading/Trailing Zeroes |Remove leading or trailing zero characters. |
| Trailing Separator Policy |Generate trailing separators. <p>Select **Not Allowed** to prohibit trailing delimiters and separators in the sent interchange. If the interchange has trailing delimiters and separators, the interchange is declared not valid. <p>Select **Optional** to send interchanges with or without trailing delimiters and separators. <p>Select **Mandatory** if the sent interchange must have trailing delimiters and separators. |
|||

## Connector reference

For additional technical details about this connector, such as actions and limits as described by the connector's Swagger file, see the [connector's reference page](https://docs.microsoft.com/connectors/x12/).

> [!NOTE]
> For logic apps in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
> this connector's ISE-labeled version uses the [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) instead.

## Next steps

* Learn about other [connectors for Logic Apps](../connectors/apis-list.md)