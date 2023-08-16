---
title: X12 997 acknowledgments and error codes
description: Learn about 997 functional acknowledgments and error codes for X12 messages in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 08/15/2023
---

# 997 functional acknowledgments and error codes for X12 messages in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

In Azure Logic Apps, you can create workflows that handle X12 messages for Electronic Data Interchange (EDI) communication when you use **X12** operations. In EDI messaging, acknowledgments provide the status from processing an EDI interchange. When receiving an interchange, the [**X12 Decode** action](logic-apps-enterprise-integration-x12-decode.md) can return one or more types of acknowledgments to the sender, based on which acknowledgment types are enabled and the specified level of validation.

For example, the receiver reports the status from validating the Functional Group Header (GS) and Functional Group Trailer (GE) in the received X12-encoded message by sending a *997 functional acknowledgment (ACK)* along with each error that happens during processing. The **X12 Decode** action always generates a 4010-compliant 997 ACK, while both the [**X12 Encode** action](logic-apps-enterprise-integration-x12-encode.md) and **X12 Decode** action can validate a 5010-compliant 997 ACK.

The receiver sends the 997 ACK inside a Functional Group Header (GS) and Functional Group Trailer (GE) envelope. However, this GS and GE envelope is no different than in any other transaction set.

This topic provides a brief overview about the X12 997 ACK, including the 997 ACK segments in an interchange and the error codes used in those segments. For other related information, review the following documentation:

* [X12 TA1 technical acknowledgments and error codes](logic-apps-enterprise-integration-x12-ta1-acknowledgment.md)
* [Exchange X12 messages for B2B enterprise integration](logic-apps-enterprise-integration-x12.md)
* [Exchange EDIFACT messages for B2B enterprise integration](logic-apps-enterprise-integration-edifact.md)
* [What is Azure Logic Apps](logic-apps-overview.md)
* [B2B enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md)

<a name="997-ack-segments"></a>

## 997 ACK segments

The following table describes the 997 ACK segments in an interchange and uses the following definitions:

* M = Mandatory
* O = Optional

| Position | Segment ID | Name | Required designation <br>(Req. Des.) | Maximum use | Loop repeat |
|----------|------------|------|--------------------------------------|-------------|-------------|
| 010 | ST | Transaction Set Header, for the acknowledgment | M | 1 | - |
| 020 | AK1 | Functional Group Response Header | M | 1 | - |
| 030 | AK2 | Transaction Set Response Header | O | 1 | 999999 <br>(Loop ID = AK2) |
| 040 | AK3 | Data Segment Note | O | 1 | 999999 <br>(Loop ID = AK2 or AK3) |
| 050 | AK4 | Data Element Note| O | 9 9 | - |
| 060 | AK5 | Transaction Set Response Trailer | M | 1 | - |
| 070 | AK9 | Functional Group Response Trailer | M | 1 | - |
| 080 | SE | Transaction Set Trailer, for the acknowledgment | M | 1 | - |
|||||||

The following sections provide more information about each AK segment. In the AK2 to AK5 loop, the segments provide information about an error with a transaction set.

### AK1

The mandatory AK1 segment identifies the functional group to acknowledge by using the following data elements:

| Element | Description |
|---------|-------------|
| AK101 | Mandatory, identifies the functional group ID (GS01) for the functional group to acknowledge. |
| AK102 | Mandatory, identifies the group control number (GS06 and GE02) for the functional group to acknowledge. |
| AK103 | Optional, identifies the EDI implementation version sent in the GS08 from the original transaction. AK103 supports an inbound 5010-compliant 997 ACK. |
|||

### AK2

The optional AK2 segment contains an acknowledgment for a transaction set in the received functional group. If multiple AK2 segments exist, they're sent as a series of loops. Each AK2 loop identifies a transaction set using the order received. If a transaction set is in error, an AK2 loop contains AK3, AK4, and AK5 segments. For more information, review the segment descriptions later in this topic.

The AK2 segment identifies the transaction set by using the following data elements:

| Element | Description |
|---------|-------------|
| AK201 | Mandatory, identifies the transaction set ID (ST01) of the transaction set to acknowledge. |
| AK202 | Mandatory, identifies the transaction set control number (ST02 and SE02) of the transaction set to acknowledge. |
| AK203 | Optional, identifies the EDI implementation version sent in the ST03 of the original transaction. AK203 supports inbound 5010-compliant 997. |
|||

#### Generate AK2 segments

You can specify that AK2 segments are generated for *all* accepted and rejected transaction sets, or *only* for rejected transaction sets. Otherwise, Azure Logic Apps generates AK2 loops *only* for rejected transaction sets. If an agreement doesn't resolve for the interchange being responded to, the 997 generation settings default to the fallback agreement settings, and AK2 segments are not generated for accepted transaction sets.

To have Azure Logic Apps generate AK2 segments for accepted transaction sets where AK501 == A, follow these steps:

1. In the Azure portal, open your integration account, and then open the X12 agreement artifact between your X12 trading partners.

1. Open the **Receive Settings** pane, make sure that **FA Expected** appears selected. You can then select **Include AK2 / IK2 Loop**.

### AK3

The optional AK3 segment reports errors in a data segment and identifies the location of the data segment. An AK3 segment is created for each segment in a transaction set that has one or more errors. If multiple AK3 segments exist, they're sent as a series of loops with one segment per loop. The AK3 segment specifies the location of each segment in error and reports the type of syntactical error found at that location by using the following data elements:

| Element | Description |
|---------|-------------|
| AK301 | Mandatory, identifies the segment in error with the X12 segment ID, for example, NM1. |
| AK302 | Mandatory, identifies the segment count of the segment in error. The ST segment is `1`, and each segment increments the segment count by one. |
| AK303 | Mandatory, identifies a bounded loop, which is a loop surrounded by a Loop Start (LS) segment and a Loop End (LE) segment. AK303 contains the values of the LS and LE segments that bound the segment in error. |
| AK304 | Optional, specifies the code for the error in the data segment. Although AK304 is optional, the element is required when an error exists for the identified segment. For AK304 error codes, review [997 ACK error codes - Data Segment Note](#997-ack-error-codes). |
|||

### AK4

The optional AK4 segment reports errors in a data element or composite data structure, and identifies the location of the data element. An AK4 segment is sent when the AK304 data element is `"8", "Segment has data element errors"` and can repeat up to 99 times within each AK3 segment. The AK4 segment specifies the location of each data element or composite data structure in error and reports the type of syntactical error found at that location by using the following data elements:

| Element | Description |
|---------|-------------|
| AK401 | Mandatory, a composite data element with the following fields: AK41.1, AK41.2, and AK41.3 <p><p>- AK401.1: Identifies the data element or composite data structure in error using its numerical count. For example, if the second data element in the segment has an error, AK401 equals `2`. <br>AK401.2: Identifies the numerical count of the component data element in a composite data structure that has an error. When AK401 reports an error on a data structure that is not composite, AK401.2 is not valued. <br>- AK41.3: Optional, this field is the repeating data element position. AK41.3 supports inbound 5010 compliant-997. |
| AK402 | Optional, identifies the simple X12 data element number of the element in error. For example, NM101 is the simple X12 data element number 98. |
| AK403 | Mandatory, reports the error of the identified element. For AK403 error codes, review [997 ACK error codes - Data Element Note](#997-ack-error-codes). |
| AK404 | Optional, contains a copy of the identified data element in error. AK404 is not used if the error indicates an invalid character. |
|||

### AK5

The AK5 segment reports whether the transaction set identified in the AK2 segment is accepted or rejected and why. The AK5 segment is mandatory when the optional AK2 loop is included in the acknowledgment. The AK4 segment specifies the status of the transaction set using a single mandatory data element and provides error codes using between one to five optional data elements, based on the syntax editing of the transaction set.

| Element | Description |
|---------|-------------|
| AK501 | Mandatory, specifies whether the identified transaction set is accepted or rejected. For AK501 error codes, review [997 ACK error codes - Transaction Response Trailer](#997-ack-error-codes). |
| AK502 - AK506 | Optional, indicate the nature of the error. For AK502 error codes, review [997 ACK error codes - Transaction Set Response Trailer](#997-ack-error-codes). |
|||

### AK9

The mandatory AK9 segment indicates whether the functional group identified in the AK1 segment is accepted or rejected and why. The AK9 segment specifies the status of the transaction set and the nature of any error by using four mandatory data elements. The segment specifies any noted errors by using between one to five optional elements.

| Element | Description |
|---------|-------------|
| AK901 | Mandatory, specifies whether the functional group identified in AK1 is accepted or rejected. For AK901 error codes, review [997 ACK error codes - Functional Group Response Trailer](#997-ack-error-codes). |
| AK902 | Mandatory, specifies the number of transaction sets included in the identified functional group trailer (GE01). |
| AK903 | Mandatory, specifies the number of transaction sets received. |
| AK904 | Mandatory, specifies the number of transaction sets accepted in the identified functional group. |
| AK905 - AK909 | Optional, indicates from one to five errors noted in the identified functional group. For AK905 to AK909 error codes, review [997 ACK error codes - Functional Group Response Trailer](#997-ack-error-codes). |
|||

<a name="997-ack-error-codes"></a>

## 997 ACK error codes

This section covers the error codes used in [997 ACK segments](#997-ack-segments).  Each table lists the supported and unsupported error codes, as defined by the X12 specification, for X12 message processing in Azure Logic Apps.

### AK304 error codes - Data Segment Note

The following table lists the error codes used in the AK304 data element of the AK3 segment (Data Segment Note):

| Error code | Condition | Supported? |
|------------|-----------|------------|
| 1 | Unrecognized segment ID | Yes |
| 2 | Unexpected segment | Yes |
| 3 | Mandatory segment missing | Yes |
| 4 | Loop occurs over maximum times | Yes |
| 5 | Segment exceeds maximum use | Yes |
| 6 | Segment not in defined transaction set | Yes |
| 7 | Segment not in proper sequence | Yes |
| 8 | Segment has data element errors | Yes |
| 511 | Trailing separators encountered (custom code) | Yes |
||||

### AK403 error codes  - Data Element Note

The following table lists the error codes used in the AK403 data element of the AK4 segment (Data Element Note):

| Error code | Condition | Supported? |
|------------|-----------|------------|
| 1 | Mandatory data element missing | Yes |
| 2 | Conditional required data element missing | Yes |
| 3 | Too many data elements | Yes |
| 4 | Data element is too short | Yes |
| 5 | Data element is too long | Yes |
| 6 | Invalid character in data element | Yes |
| 7 | Invalid code value | Yes |
| 8 | Invalid date | Yes |
| 9 | Invalid time | Yes |
| 10 | Exclusion condition violated | Yes |
||||

### AK501 error codes - Transaction Set Response Trailer

The following table lists the error codes used in the AK501 data element of the AK5 segment (Transaction Set Response Trailer):

| Error code | Condition | Supported? |
|------------|-----------|------------|
| A | Accepted | Yes |
| E | Accepted but errors were noted | Yes <p><p>**Note**: No error codes lead to a status of `E`. |
| M | Rejected, message authentication code (MAC) failed | No |
| P | Partially accepted, at least one transaction set was rejected | Yes |
| R | Rejected | Yes |
| W | Rejected, assurance failed validity tests | No |
| X | Rejected, content after decryption could not be analyzed | No |
||||

### AK502 to AK506 error codes - Transaction Set Response Trailer

The following table lists the error codes used in the AK502 to AK506 data elements of the AK5 segment (Transaction Set Response Trailer):

| Error code | Condition | Supported or <br>correlated with AK501? |
|------------|-----------|-----------------------------------------|
| 1 | Transaction set not supported | Yes, R |
| 2 | Transaction set trailer missing | Yes, R |
| 3 | Transaction set control number in header and trailer do not match | Yes, R |
| 4 | Number of included segments does not match actual count | Yes, R |
| 5 | One or more segments in error | Yes, R |
| 6 | Missing or invalid transaction set identifier | Yes, R |
| 7 | Missing or invalid transaction set control number, a duplicate transaction number may have occurred | Yes, R |
| 8 through 27 | - | No |
||||

### AK901 error codes - Functional Group Response Trailer

The following table lists the error codes used in the AK901 data elements of the AK9 segment (Functional Group Response Trailer):

| Error code | Condition | Supported or <br>correlated with AK501? |
|------------|-----------|-----------------------------------------|
| A | Accepted | Yes |
| E | Accepted, but errors were noted | Yes |
| M | Rejected, message authentication code (MAC) failed | No |
| P | Partially accepted, at least one transaction set was rejected | Yes |
| R | Rejected | Yes |
| W | Rejected, assurance failed validity tests | No |
| X | Rejected, content after decryption could not be analyzed | No |
||||

### AK905 to AK909 error codes - Functional Group Response Trailer

The following table lists the error codes used in the AK905 to AK909 data elements of the AK9 segment (Functional Group Response Trailer):

| Error code | Condition | Supported or <br>correlated with AK501? |
|------------|-----------|-----------------------------------------|
| 1 | Functional group not supported | No |
| 2 | Functional group version not supported | No |
| 3 | Functional group trailer missing | Yes |
| 4 | Group control number in the functional group header and trailer do not agree | Yes |
| 5 | Number of included transaction sets does not match actual count | Yes |
| 6 | Group control number violates syntax, a duplicate group control number may have occurred | Yes |
| 7 to 26 | - | No |
||||

## Next steps

* [Exchange X12 messages for B2B enterprise integration](logic-apps-enterprise-integration-x12.md)