---
title: EDIFACT CONTRL acknowledgments and error codes
description: Learn about CONTRL acknowledgments and error codes for EDIFACT messages in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 08/15/2023
---

# CONTRL acknowledgments and error codes for EDIFACT messages in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

In Azure Logic Apps, you can create workflows that handle EDIFACT messages for Electronic Data Interchange (EDI) communication when you use **EDIFACT** operations. In EDI messaging, acknowledgments provide the status from processing an EDI interchange. When receiving an interchange, the [**EDIFACT Decode** action](logic-apps-enterprise-integration-edifact.md) can return one or more types of acknowledgments to the sender, based on which acknowledgment types are enabled and the specified level of validation.

This topic provides a brief overview about the EDIFACT CONTRL ACK, the CONTRL ACK segments in an interchange, and the error codes used in those segments.

## CONTRL as technical and functional acknowledgment

For EDIFACT-encoded messages, the CONTRL acknowledgment (ACK) works as both a technical acknowledgment *and* functional acknowledgment. The full CONTRL message serves as the functional ACK, while sections in the functional ACK are reused for the technical ACK. For example, if you select both technical and functional ACKs in the agreement properties for the sending partner or in the global properties, the **EDIFACT Decode** action generates two CONTRL messages, a CONTRL technical ACK and a CONTRL functional ACK. The CONTRL ACK conforms to the schema for **EFACT_<*version-number*>_CONTRL.xsd**.

> [!NOTE]
> With EDIFACT message processing in Azure Logic Apps, a CONTRL message, whether for receipt acknowledgment, acceptance, or rejection, is sent as a response to a received 
> interchange that contains only one or more CONTRL messages. In Logic Apps, no CONTRL message is sent as a response to a received interchange that contains only one or more CONTRL messages. 
>
> Errors in received CONTRL messages must be reported by a means other than a CONTRL message. If one or more CONTRL messages are contained in an interchange that contains data messages, 
> the CONTRL message that's generated as a response to that interchange is generated as if no CONTRL messages were contained in the received interchange.

As a technical acknowledgment, the CONTRL message indicates that the interchange recipient received the subject interchange and has the following responsibilities:

* Checked parts of the interchange to confirm the syntactic accuracy of the data elements copied into the reporting Interchange Response (UCI) segment.
* Accepts the responsibility to notify the sender about the acceptance or rejection of the other parts in the interchange.
* Takes reasonable measures to notify the sender.

> [!NOTE]
> A CONTRL technical ACK reports the `Rejected` status only when the incoming EDIFACT message is a duplicate, or errors exist in the envelope, such as an 
> issue with the character set. EDIFACT doesn't report the `Interchange accepted with errors` status in a CONTRL technical ACK, as x12 does using the TA104 
> field in a TA1 acknowledgment. If part of the EDIFACT message is accepted, the CONTRL technical ACK reports `Accepted` status. In some scenarios, 
> if part of the message is rejected, the CONTRL ACK still reports the `Accepted` status. In such scenarios, the UCI5 element might report the error.

As a functional acknowledgment, the CONTRL message reports the status, such as the acceptance or rejection, for the received interchange, group, or message, including any errors or unsupported functionality. The message also indicates that the interchange recipient:

* Received the referenced levels of the acknowledged interchange.
* Checked that no fatal syntactic errors in the acknowledged referenced level prevent further interchange processing.
* Checked that all acknowledged parts of service segments are semantically correct, if no errors are reported.
* Complies with the requested actions in the acknowledged and referenced levels of the service segments.
* Accepted the responsibility to notify the sender by means other than sending a CONTRL message in the following cases:

  * Any syntactic or semantic errors are later found in the relevant part.
  * The part can't be processed for some other reason after the part has been acknowledged in a submitted CONTRL message.

* Takes reasonable measure to make sure such errors are found and to notify the sender.

Rejection implies that the interchange recipient:

* Can't acknowledge the interchange or any relevant parts for reasons indicated in the CONTRL message.
* Won't take any further action on business information contained in the rejected part of the subject interchange.

## CONTRL technical ACK segments

If you select the option to generate a technical acknowledgment in an EDIFACT agreement, or if the **UNB9** message field is set to `2`, a CONTRL message is generated as a technical ACK to report the results from receiving the interchange.

The following table describes the CONTRL technical ACK segments in an interchange and uses the following definitions:

* M = Mandatory
* O = Optional

| Name | Mandatory or optional | Description |
|------|-----------------------|-------------|
| UNH message header | M | The Message Header Segment (UNH) identifies and specifies the message. |
| UCI interchange response | M | Identifies the interchange and indicates the nature of interchange receipt. The UCI segment has a max occurrence of `1`, and as a result, reports the first error found in a control segment. |
| UNT message trailer | M | An error is reported in the UCI5 data element named `Syntax Error Code`. For EDIFACT-encoded messages, no `Accepted with errors` condition exists, as with X12-encoded interchanges. |
||||

### CONTRL technical ACK data elements

The CONTRL technical ACK includes the following data elements:

| Element | Name | Usage |
|---------|------|-------|
| UNH1 | Message reference number | - |
| UNH2 | Message identifier subcomponents | Subcomponents: <p><p>- 1 = CONTRL <br>- 2 = 4 <br>- 3 = 1 <br>- 4 = UN |
| UCI1 | Interchange control number | Mapped from the UNB5 field of the received message. |
| UCI2 | Interchange sender | Mapped from the UNB2 field of the received message. <p><p>- Mandatory: The first subcomponent, or identification. <br>- Optional: The second subcomponent, or code qualifier and the third component, or reverse routing address. |
| UCI3 | Interchange recipient | Mapped from the UNB3 field of the received message. <p><p>- Mandatory: The first subcomponent, or identification. <br>- Optional: The second subcomponent, or code qualifier. |
| UCI4 | Action code | This element is mandatory. Action codes: <p><p>- 8, if the interchange is accepted. <br>- 7, if the interchange is accepted but some transaction sets are rejected. <br>- 4, if the interchange is rejected due to an error in the UNA or UNB segment. |
| UCI5 | Syntax Error Code | This element is conditionally optional and identifies the error condition, if any. |
| UCI6 | Service Segment Tag | This element is conditionally optional and identifies the segment that has the error condition in the UCI5 data element. |
| UCI7 | Data element identification | Identifies the data elements that have the error condition in the UCI5 data element. Subcomponents: <p><p>- Mandatory: Position of erroneous data element in segment. <br>- Conditionally optional: Position of erroneous component data element in segment, and occurrence of erroneous data element in segment. |
| UCI8 | - | - |
| UNT1 | Count of segments | - |
| UNT2 | Message reference number | - |
||||

## CONTRL functional ACK segments

If you select the option to generate a functional acknowledgment in an EDIFACT agreement, or if the **UNB9** message field is set to `1`, a CONTRL message is generated as a functional ACK to report the results from checking the syntax of the interchange.

The following table describes the CONTRL functional ACK segments in an interchange and uses the following definitions:

* M = Mandatory
* O = Optional

| Name | Mandatory or optional | Description |
|------|-----------------------|-------------|
| UNH message header | M | The Message Header Segment (UNH) identifies and specifies the message. |
| UCI segment | M | Identifies the interchange, indicates the status for the interchange receipt, and contains references to the UNA, UNB, and UNZ segments in the received interchange. The UCI segment has a max occurrence of `1`, and as a result, reports the first error found in a control segment. |
| UCF segment | M, if the UNG segment exists | Identifies a group segment, which is encapsulated by the UNG header and UNE trailer, and indicates the nature of any error. |
| UCM segment | M | Identifies a message segment, which is encapsulated by the UNH header and UNT trailer, and indicates the nature of any error. |
| UCS segment | M | Identifies a transaction set and indicates the nature of any error. |
| UCD segment | O, conditionally | Identifies an erroneous composite or component data element and indicates the nature of the error. |
| UNT message trailer | M | If a received CONTRL functional acknowledgment contains only UNH, UCI, and UNT segments, the EDIReceive pipeline processes the acknowledgment as a CONTRL receipt technical ACK. Each segment instance at a reporting level can report only one error, for example, the UCI, UCF, UCM, UCS, and UCD segments. |
||||

### SG loops and CONTRL functional ACK structure

Based on whether the received interchange includes one or more groups, the structure for the CONTRL functional ACK differs.

* If the interchange includes a group, the ACK contains one UCF segment per group. Each UCF segment contains one UCM segment per message. Each UCM segment also includes a series of UCS and UCD segments in tandem.

  The XML form of the ACK message includes the following loop elements:

  * An SG3Loop element that encapsulates each UCF segment.
  * An SG4Loop element that encapsulates each UCM element.
  * An SG5Loop element that encapsulates each pair of UCS and UCD elements.

  SG loop tags don't exist in the native EDI message format.

* If the interchange doesn't include a group, the ACK doesn't contain any UCF segments. Instead, the ACK includes one UCM segment per message. Each UCM segment includes a series of UCS and UCD segments in tandem.

* The XML form of the ACK message includes the following loop elements:

  * An SG1Loop element that encapsulates each UCM element.
  * An SG2Loop element that encapsulates each pair of UCS and UCD elements.

  As with interchanges that include groups, the SG tags don't exist in the native ACK format.

By default and industry usage, SG1/SG4 loops aren't expected for accepted transaction sets. However, to support compliance with standards, you can force generation of SG1/SG4 loops by following these steps:
 
1. In the [Azure portal](https://portal.azure.com), open your integration account.
1. On the integration account menu, under **Settings**, select **Agreements**.
1. Open your EDIFACT agreement, and select **Send Settings**.
1. Under **Acknowledgement**, select **Acknowledgement (CONTRL)**. You can now select **Generate SG1/SG4 loop for accepted transaction sets**.

   If this checkbox is selected, the receive pipeline generates SG1/SG4 loops whether the transaction set is accepted or rejected. Otherwise, these loops are generated only for erroneous transaction sets where UCM5 is not equal to `7`.

### CONTRL functional ACK data elements

The CONTRL message contains several mandatory data elements that are copied from the received interchange. If the data element in the interchange is missing or is syntactically invalid, a syntactically valid CONTRL message can't be generated. The error must be reported by some means other than a CONTRL message.

The CONTRL functional ACK includes the following data elements:

| Element | Name | Usage |
|---------|------|-------|
| UNH1 | Message reference number | - |
| UNH2 | Message identifier subcomponents | Subcomponents: <p><p>- 1 = CONTRL <br>- 2 = 4 <br>- 3 = 1 <br>- 4 = UN |
| UCI1 | Interchange control number | Mapped from the UNB5 field of the received message. |
| UCI2 | Interchange sender | Mapped from the UNB2 field of the received message. <p><p>- Mandatory: The first subcomponent, or identification. <br>- Optional: The second subcomponent, or code qualifier and the third component, or reverse routing address. |
| UCI3 | Interchange recipient | Mapped from the UNB3 field of the received message. <p><p>- Mandatory: The first subcomponent, or identification. <br>- Optional: The second subcomponent, or code qualifier. |
| UCI4 | Action code | This element is mandatory. Action codes: <p><p>- 8, if the interchange is accepted. <br>- 7, if the interchange is accepted but some transaction sets are rejected. <br>- 4, if the interchange is rejected due to an error in the UNA or UNB segment. |
| UCI5 | Syntax Error Code | This element is conditionally optional and identifies the error condition, if any. |
| UCI6 | Service Segment Tag | This element is conditionally optional and identifies the segment that has the error condition in the UCI5 data element. |
| UCI7 | Data element identification | Identifies the data elements that have the error condition in the UCI5 data element. Subcomponents: <p><p>- Mandatory: Position of erroneous data element in segment. <br>- Conditionally optional: Position of erroneous component data element in segment, and occurrence of erroneous data element in segment. |
| UCI8 | - | - |
| UCF1 | Group Reference Number | This element is mandatory and is mapped from the UNG5 field in the received message. |
| UCF2 | Application Sender's Identification | This element is conditionally optional and is mapped from the UNG2 field in the received message along with subcomponents. |
| UCF3 | Application Recipient's Identification | This element is conditionally optional and is mapped from the UNG3 field in the received message along with subcomponents. |
| UCF4 | Action Coded | This element is mandatory, and the code applies to this level and all lower levels. Action codes: <p><p>- 7, if the interchange is accepted. <br>- 4, if the interchange is rejected due to an error in the UNA or UNB segment. |
| UCF5 | Syntax Error, Coded | This element is conditionally optional and identifies the error condition in the group, if any. |
| UCF6 | Service Segment Tag | This element is conditionally optional and identifies the erroneous segment in the group. |
| UCF7 | Data element identification | Identifies the data elements that have the error condition identified in the UCF5 data element. Subcomponents: <p><p>- Mandatory: Position of erroneous data element in segment, and occurrence of erroneous data element in segment. <br>- Conditionally optional: Position of erroneous component data element in segment. |
| UCM1 | Message Reference Number| This element is mandatory and is mapped from the UNH1 field in the received message. |
| UCM2 | Message Identifier | This element is conditionally optional and is mapped from the UNH2 field in the received message along with subcomponents. |
| UCM3 | Action Coded | This element is mandatory, and the code applies to this level and all lower levels. Action codes: <p><p>- 7, if the interchange is accepted. <br>- 4, if the interchange is rejected due to an error in the UNA or UNB segment. |
| UCM4 | Syntax Error, Coded | This element is conditionally optional and identifies the error condition in the group, if any. |
| UCM5 | Service Segment Tag | This element is conditionally optional and identifies the UNH or UNT segment in error. |
| UCM7 | Data element identification | Identifies the data elements that have the error condition identified in the UCM5 data element. Subcomponents: <p><p>- Mandatory: Position of erroneous data element in segment, and occurrence of erroneous data element in segment. <br>- Conditionally optional: Position of erroneous component data element in segment. |
| UCS1 | Segment position in message body | This element is mandatory and is the position count of the erroneous segment, starting with UNH as `1`. To report that a segment is missing, this value is the numerical count position of the last segment that was processed prior to the position for where the missing segment is expected to exist. A missing segment group is denoted by identifying the first segment in the group as missing. |
| UCS2 | Syntax Error Coded | This element is conditionally optional and identifies the error condition in the group, if any. |
| UCD1 | Syntax Error Coded| This element is conditionally optional and identifies the error condition in the group, if any. <p><p>**Note**: If an XSD validation failure occurs, the UCD1 data element reports a code value of `12, Invalid Value`. |
| UCD2 | Data element identification | Identifies the data elements that have the error condition identified in the UCD1 data element. Subcomponents: <p><p>- Mandatory: Position of erroneous data element in segment, and occurrence of erroneous data element in segment. <br>- Conditionally optional: Position of erroneous component data element in segment. |
| UNT1 | Count of segments | - |
| UNT2 | Message reference number | - |
||||

## CONTRL ACK error codes

These errors apply at the interchange, group, message, and data level. When a supported error is found, the entire interchange, group, or transaction set is rejected. EDIFACT-encoded interchanges don't have an `Accepted with errors` condition as X12-encoded messages do.

### Standard EDIFACT CONTRL ACK error codes

The following table lists the supported and supported error codes, as defined by the EDIFACT specification, that are used in the UCI5 field of the CONTRL ACK for EDIFACT message processing in Azure Logic Apps.

| Error code | Condition | Cause | Supported? |
|------------|-----------|-------|------------|
| 2 | Syntax version or level not supported | Notification that the syntax version and (or) level is not supported by the recipient. | No |
| 7 | Interchange recipient not actual recipient | Notification that the interchange recipient (S003) is different from the actual recipient. | No |
| 12 | Invalid value | Notification that the value of a standalone data element, composite data element, or component data element does not conform to the relevant specifications for the value. | Yes |
| 13 | Missing | Notification that a mandatory, or otherwise required, service or user segment, data element, composite data element, or component data element is missing. | Yes |
| 14 | Value not supported in this position | Notification that the recipient does not support use of the specific value of an identified standalone data element, composite data element, or component data element in the position where used. The value might be valid according to the relevant specifications and might be supported if used in another position. | No |
| 15 | Not supported in this position | Notification that the recipient does not support use of the segment type, standalone data element type, composite data element type, or component data element type in the identified position. | Yes |
| 16 | Too many constituents | Notification that the identified segment contained too many data elements or that the identified composite data element contained too many component data elements. | Yes |
| 17 | No agreement | No agreement exists that allows receipt of an interchange, group, message, or package with the value of the identified standalone data element, composite data element, or component data element. | No |
| 18 | Unspecified error | Notification that an error has been identified, but the nature of the error is not reported. | No |
| 19 | Invalid decimal notation | Notification that the character indicated as decimal notation in UNA is invalid, or the decimal notation used in a data element is not consistent with the one indicated in UNA. | No |
| 20 | Character invalid as service character | Notification that a character advised in UNA is invalid as a service character. | No |
| 21 | Invalid character(s) | Notification that one or more characters used in the interchange are not valid characters as defined by the syntax identifier indicated in the UNB segment. The invalid character is part of the referenced-level, or followed immediately after the identified part of the interchange. | Yes |
| 22 | Invalid service character(s) | Notification that the service characters used in the interchange are not valid service characters as advised in the UNA segment or is not one of the default service characters. If the code is used in the UCS or UCD segment, the invalid character followed immediately after the identified part of the interchange. | No |
| 23 | Unknown Interchange sender | Notification that the interchange sender (S002) is unknown. | No |
| 24 | Too old | Notification that the received interchange or group is older than a limit specified in an IA or determined by the recipient. | No |
| 25 | Test indicator not supported | Notification that test processing cannot be performed for the identified interchange, group, message, or package. | No |
| 26 | Duplicate detected | Notification that a possible duplication of a previously received interchange, group, message, or package has been detected. The earlier transmission might have been rejected. | Yes |
| 27 | Security function not supported | Notification that a security function related to the referenced level or data element is not supported. | No |
| 28 | References do not match | Notification that the control reference in the UNB, UNG, UNH, UNO, USH, or USD segment does not match the control reference in the UNZ, UNE, UNT, UNP, UST, or USU segment, respectively. | No |
| 29 | Control count does not match number of instances received | Notification that the number of groups, messages, or segments does not match the number given in the UNZ, UNE, UNT, or UST segment. Or, the length of an object or the length of encrypted data is not equal to the length stated in the UNO, UNP, USD, or USU segment. | Yes |
| 30 | Groups and messages/packages mixed | Notification that groups have been mixed with messages or packages outside of groups in the interchange. | No |
| 31 | More than one message type in group | Notification that different message types are contained in a functional group. | Yes |
| 32 | Lower level empty | Notification for one of the following conditions: <p><p>- The interchange does not contain any messages, packages, or groups. <br>- A group does not contain any messages or packages. | No |
| 33 | Invalid occurrence outside message, package, or group|Notification of an invalid segment or data element in the interchange, between messages, between packages, or between groups. Rejection is reported at the level above. | Yes |
| 34 | Nesting indicator not allowed | Notification that explicit nesting has been used in a message where not permitted. | No |
| 35 | Too many data element or segment repetitions | Notification that a standalone data element, composite data element, or segment is repeated too many times. | Yes |
| 36 | Too many segment group repetitions | Notification that a segment group is repeated too many times. | Yes |
| 37 | Invalid type of character(s) | Notification for one of the following conditions: <p><p>- One or more numeric characters are used in an alphabetic (component) data element. <br>- One or more alphabetic characters are used in a numeric (component) data element. | Yes |
| 38 | Missing digit in front of decimal sign | Notification that a decimal sign is not preceded by one or more digits. | Yes |
| 39 | Data element too long | Notification that the length of the data element received exceeded the maximum length specified in the data element description. | Yes |
| 40 | Data element too short | Notification that the length of the data element received is shorter than the minimum length specified in the data element description. | Yes |
| 41 | Permanent communication network error | Notification that a permanent error was reported by the communication network used for transfer of the interchange. Retransmission of an identical interchange with the same parameters at network level won't succeed. | No |
| 42 | Temporary communication network error | Notification that a temporary error was reported by the communication network used for transfer of the interchange. Retransmission of an identical interchange might succeed. | No |
| 43 | Unknown interchange recipient | Notification that the interchange recipient is not known by a network provider. | No |
| 45 | Trailing separator | Notification for one of the following conditions: <p><p>- The last character before the segment terminator is a data element separator, a component data element separator, or a repeating data element separator. <br>- The last character before a data element separator is a component data element separator or a repeating data element separator. | Yes |
| 46 | Character set not supported | Notification for one of the following conditions: <p><p>- One or more characters used are not in the character set defined by the syntax identifier. <br>- The character set identified by the escape sequence for the code extension technique is not supported by the recipient. | Yes |
| 47 | Envelope functionality not supported | Notification that the envelope structure encountered is not supported by the recipient. | Yes |
| 48 | Dependency Notes condition violated | Notification that an error condition has occurred as the result of a dependency condition violation. | No |
|||||

### Azure Logic Apps CONTRL ACK error codes

The following table lists custom error codes that aren't defined by the EDIFACT specification, but are used in the UCI5 field of the CONTRL ACK for EDIFACT message processing and are specific to Azure Logic Apps.

| Error code | Condition | Cause |
|------------|-----------|-------|
| 70 | Transaction set missing or invalid transaction set Identifier | Notification that the transaction set identifier is missing or invalid. |
| 71 | Transaction set or group control number mismatch | Notification that there is a mismatch with the transaction set or group control numbers. |
| 72 | Unrecognized segment ID | Notification that the segment ID is not recognized. |
| 73 | XML not at correct position | Notification that a problem has occurred when serializing the XML root element. |
| 74 | Too few segment group repetitions | Notification that a segment group repeats less than the required amount. |
| 75 | Too few segment repetitions | Notification that a segment repeats less than the required amount. |
| 76 | Too few data elements found | Notification that there were not enough data elements found. |
||||

## Next steps

[Exchange EDIFACT messages](logic-apps-enterprise-integration-edifact.md)
