---
title: X12 messaging - TA1 technical acknowledgment
description: Learn about TA1 technical acknowledgments used for X12 message processing in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 07/15/2021
---

# TA1 technical acknowledgments for X12 message processing in Azure Logic Apps

In X12 messaging, the address receiver reports the status from processing an interchange header and trailer by sending a TA1 technical acknowledgment (ACK). The receiver sends a positive **TA1 ACK** when the Interchange Control Header (ISA) and Interchange Control Trailer (IEA) of the X12-encoded message are valid, regardless the status of the other content. If the ISA and IEA aren't valid, the receiver sends a **TA1 ACK** with an error code instead.

The X12 TA1 technical acknowledgment conforms to the **X12_<*version number*>_TA1.xsd** schema. While the receiver sends the **TA1 ACK** inside an ISA/IEA envelope, the ISA and IEA are no different than any other interchange. The following table describes the segments within the interchange for a **TA1 ACK**:

| TA1 field | Field name | Mapped to incoming interchange | Value |
|-----------|------------|--------------------------------|-------|
| TA101 | Interchange control number | ISA13 - Interchange control number | - |
| TA102 | Interchange Date | ISA09 Interchange Date | - |
| TA103 | Interchange Time | ISA10 - Interchange Time | - |
| TA104 | Interchange ACK Code* <p><p>* Engine behavior is based on data element validation except for security and authentication information, which is based on string comparisons in the configuration information. | N/A | Engine behavior: A, E, or R <p><p>A = Accept <br>E = Interchange accepted with errors <br>R = Interchange rejected or suspended |
| TA105 | Interchange Note Code | N/A | Processing result error code. <p<p>**Note**: For error codes, review the table in [X12 TA1 acknowledgment error codes](logic-apps-enterprise-integration-x12-ta1-acknowledgment-error-codes.md). |
|||||

## Next steps

* [X12 TA1 acknowledgment error codes](logic-apps-enterprise-integration-x12-ta1-acknowledgment-error-codes.md)
