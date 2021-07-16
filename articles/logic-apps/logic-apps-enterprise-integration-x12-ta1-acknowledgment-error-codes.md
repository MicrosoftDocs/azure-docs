---
title: X12 messaging - TA1 technical acknowledgment error codes
description: Error codes for TA1 technical acknowledgments used for X12 message processing in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 07/15/2021
---

# X12 TA1 technical acknowledgment error codes

This topic describes the error codes used in the segments of an [X12 TA1 technical acknowledgment](logic-apps-enterprise-integration-x12-ta1-acknowledgment.md). The following table lists the error codes, as defined by the X12 specification, that are supported and unsupported for X12 message processing in Azure Logic Apps. In the **Engine behavior** column, the TA104 values have the following definitions:

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
| Invalid Security Information Qualifier value | R | 012 | Yes, if an ID mismatch exiss. |
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

* [X12 TA1 technical acknowledgment](logic-apps-enterprise-integration-x12-ta1-acknowledgment.md)
