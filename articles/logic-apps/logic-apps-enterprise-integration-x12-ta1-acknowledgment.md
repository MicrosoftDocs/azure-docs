---
title: "X12 TA1 Acknowledgment | Microsoft Docs"
description: X12 TA1 Acknowledgement in Logic Apps X12 message processing with Enterprise Integration Pack
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: article
ms.date: 07/15/2021
---

# X12 TA1 Acknowledgment
The X12 TA1 technical acknowledgment reports the status of the processing of an interchange header and trailer by the address receiver. When the ISA and IEA of the X12-encoded message are valid, a positive TA1 ACK is sent, whatever the status of the other content is. If not, TA1 ACK with an error code is sent.  
  
 The X12 TA1 acknowledgment conforms to the X12_\<version number\>_TA1.xsd schema. The TA1 ACK is sent inside an ISA/IEA envelope. The ISA and IEA are no different than any other interchange.  
  
 The segments within the interchange of a TA1 ACK are shown in the following table.  
  
|Field in TA1|Name of Field|Mapped to Incoming Interchange|Value|  
|------------------|-------------------|------------------------------------|-----------|  
|TA101|Interchange control number|ISA13 - Interchange control number|-|  
|TA102|Interchange Date|ISA09 Interchange Date|-|  
|TA103|Interchange Time|ISA10 – Interchange Time|-|  
|TA104|Interchange ACK Code*|N/A|Engine behavior: A, E, or R<br /><br /> A = Accept<br /><br /> E = Interchange accepted with errors<br /><br /> R = Interchange rejected/suspended|  
|TA105|Interchange Note Code|N/A|Processing result error code. **Note:**  See table in [X12 TA1 Acknowledgment Error Codes](./logic-apps-enterprise-integration-x12-ta1-acknowledgment-error-codes.md).|  
  
 \* Engine behavior is based off data element validation; except for security and authentication information, which will be based off string comparisons in configuration information.
