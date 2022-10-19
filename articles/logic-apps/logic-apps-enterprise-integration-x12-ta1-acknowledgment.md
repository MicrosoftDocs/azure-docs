---
title: X12 TA1 acknowledgments and error codes
description: Learn about TA1 technical acknowledgments and error codes used for X12 messages in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 08/20/2022
---

# TA1 technical acknowledgments and error codes for X12 messages in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

In Azure Logic Apps, you can create workflows that handle X12 messages for Electronic Data Interchange (EDI) communication when you use **X12** operations. In EDI messaging, acknowledgments provide the status from processing an EDI interchange. When receiving an interchange, the [**X12 Decode** action](logic-apps-enterprise-integration-x12-decode.md) can return one or more types of acknowledgments to the sender, based on which acknowledgment types are enabled and the specified level of validation.

For example, the receiver reports the status from validating the Interchange Control Header (ISA) and Interchange Control Trailer (IEA) in the received X12-encoded message by sending a *TA1 technical acknowledgment (ACK)*. If this header and trailer are valid, the receiver sends a positive TA1 ACK, no matter the status of other content. If the header and trailer aren't valid, the receiver sends a **TA1 ACK** with an error code instead.

The X12 TA1 ACK conforms to the schema for **X12_<*version number*>_TA1.xsd**. The receiver sends the TA1 ACK in an ISA and IEA envelope. However, this ISA and IEA envelope are no different than in any other interchange.

This topic provides a brief overview about the X12 TA1 ACK, including the TA1 ACK segments in an interchange and the error codes used in those segments. For other related information, review the following documentation:

* [X12 997 functional acknowledgments and error codes](logic-apps-enterprise-integration-x12-997-acknowledgment.md)
* [Exchange X12 messages for B2B enterprise integration](logic-apps-enterprise-integration-x12.md)
* [Exchange EDIFACT messages for B2B enterprise integration](logic-apps-enterprise-integration-edifact.md)
* [What is Azure Logic Apps](logic-apps-overview.md)
* [B2B enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md)

<a name="ta1-ack-segments"></a>

## TA1 ACK segments

The following table describes the TA1 ACK segments in an interchange:

| TA1 field | Field name | Mapped to incoming interchange | Value |
|-----------|------------|--------------------------------|-------|
| TA101 | Interchange control number | ISA13 - Interchange control number | - |
| TA102 | Interchange Date | ISA09 - Interchange Date | - |
| TA103 | Interchange Time | ISA10 - Interchange Time | - |
| TA104 | Interchange ACK Code* | N/A | * Engine behavior is based on data element validation with the exception of security and authentication information, which are based on string comparisons in the configuration information. <p>The engine behavior (TA104) value is A, E, or R, based on the following definitions: <p><p>A = Accept <br>E = Interchange accepted with errors <br>R = Interchange rejected or suspended. <p><p>For more information, review [TA1 ACK error codes](#ta1-ack-error-codes). |
| TA105 | Interchange Note Code | N/A | Processing result error code. For more information, review [TA1 ACK error codes](#ta1-ack-error-codes). |
|||||

<a name="ta1-ack-error-codes"></a>

## TA1 ACK error codes

This section covers the error codes used in [TA1 ACK segments](#ta1-ack-segments). The following table lists supported and unsupported error codes, as defined by the X12 specification, for X12 message processing in Azure Logic Apps. In the **Engine behavior** column, the TA104 values have the following definitions:

* A = Accept
* E = Interchange accepted with errors
* R = Interchange rejected or suspended

| Condition | Engine behavior <br>(TA104 value) | TA105 value | Supported? |
|-----------|-----------------------------------|-------------|------------|
| Success | A | 000 | Yes |
| The Interchange Control Numbers in the header ISA 13 and trailer IEA02 do not match | E | 001 | Yes |
| Standard in ISA11 (Control Standards) is not supported | E | 002 | Yes, if an ID mismatch exists. |
| Version of the controls is not supported | E | 003 | No, error code 017 is used instead. |
| Segment Terminator is Invalid* <p><p>* The segment terminator can have the following valid combinations: <p><p>- Segment Terminator char only. <br>- Segment Terminator character followed by suffix 1 and suffix 2. | R | 004 | Yes |
| Invalid Interchange ID Qualifier for Sender | R | 005 | Yes, if an ID mismatch exists. |
| Invalid Interchange Sender ID | E | 006 | Yes, if receiving an interchange on a receive port that requires authentication. <p><p>**Note**: Sender ID-related properties are reviewed. If these properties are inconsistent, or if party settings are unavailable due to not being set, the interchange is rejected. |
| Invalid Interchange ID Qualifier for Receiver | R | 007 | Yes, if an ID mismatch exists. |
| Invalid Interchange Receiver ID | E | 008 | No* <p><p>* Supported if receiving an interchange on a receive port that requires authentication. Sender ID-related properties are reviewed. If these properties are inconsistent, or if party settings are unavailable due to not being set, the interchange is rejected. |
| Unknown Interchange Receiver ID | E | 009 | Yes |
| Invalid Authorization Information Qualifier value | R | 010 | Yes, if an ID mismatch exists. |
| Invalid Authorization Information value | R | 011 | Yes, if party is set up or valued. |
| Invalid Security Information Qualifier value | R | 012 | Yes, if an ID mismatch exists. |
| Invalid Security Information value | R | 013 | Yes, if party is set up or valued. |
| Invalid Interchange Date value | R | 014 | Yes |
| Invalid Interchange Time value | R | 015 | Yes |
| Invalid Interchange Standards Identifier value | R | 016 | Yes |
| Invalid Interchange Version ID value | R | 017 | Yes, indicating that the enum value is not valid. |
| Invalid Interchange Control Number value | R | 018 | Yes |
| Invalid Acknowledgment Requested value | E | 019 | Yes |
| Invalid Test Indicator value | E | 020 | Yes |
| Invalid Number of Included Groups value | E | 021 | Yes |
| Invalid Control Structure | R | 022 | Yes |
| Improper (Premature) End-of-File (Transmission) | R | 023 | Yes |
| Invalid Interchange Content, for example, Invalid GS segment | R | 024 | Yes |
| Duplicate Interchange Control Number | R, based on settings | 025 | Yes |
| Invalid Data Element Separator | R | 026 | Yes |
| Invalid Component Element Separator | R | 027 | Yes |
| Invalid Delivery Date in Deferred Delivery Request | - | - | No |
| Invalid Delivery Time in Deferred Delivery Request | - | - | No |
| Invalid Delivery Time Code in Deferred Delivery Request | - | - | No |
| Invalid Grade of Service | - | - | No |
||||

## Next steps

* [Exchange X12 messages for B2B enterprise integration](logic-apps-enterprise-integration-x12.md)