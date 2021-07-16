---
title: "EDIFACT CONTRL Message as Technical Acknowledgment | Microsoft Docs"
description: "EDIFACT CONTRL Message as Technical Acknowledgment in Logic Apps EDIFACT message processing with Enterprise Integration Pack"
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 07/15/2021
---

# EDIFACT CONTRL Message as Technical Acknowledgment
If you have selected to generate a technical acknowledgment in business profile settings or trading partner agreement (or fallback agreement if no agreement is defined between the two business profiles), or if the UNB9 field in the message is set to "2", a CONTRL message will be generated as a technical acknowledgment. This ACK reports the results of the receipt of the interchange.  
  
 The CONTRL technical ACK includes the following segments:  
  
- UNH message header (mandatory)  
  
- UCI interchange response that identifies the subject interchange and indicates the nature of interchange receipt (mandatory). The UCI segment has a max occurrence of 1; as a result, it reports the first error encountered in one of the control segments.  
  
- UNT message trailer (mandatory).  
  
  An error is reported in the UCI5, "Syntax Error Code", data element. There is no "accepted with errors" condition for EDIFACT-encoded interchanges, as there is with X12-encoded interchanges.  
  
> [!NOTE]
>  A CONTRL receipt (EDIFACT technical acknowledgment) reports a status of “Rejected” only when the incoming EDIFACT message is a duplicate or there are errors in the envelope (for example, an issue with the character set). EDIFACT does not report a state of “Interchange accepted with errors” in the CONTRL technical acknowledgment, as X12 does in the TA104 field in a TA1 acknowledgment. If part of the EDIFACT message is accepted, the CONTRL technical acknowledgment will report “Accepted”. In some scenarios, part of the message will be rejected, but the CONTRL acknowledgment will still report a status of “Accepted”. In such scenarios, the UCI5 element may report the error.  
  
 The CONTRL technical ACK includes the following data elements:  
  
|Data Element|Name|Usage|  
|------------------|----------|-----------|  
|UNH1|Message reference number|-|  
|UNH2|Message identifier subcomponents|The subcomponents are:<br /><br /> - 1 = CONTRL<br /><br /> - 2 = 4<br /><br /> - 3 = 1<br /><br /> - 4 = UN|  
|UCI1|Interchange control number|Mapped from the UNB5 field of the received message.|  
|UCI2|Interchange sender|Mapped from the UNB2 field of the received message. The first subcomponent (identification) is mandatory. The second subcomponent (code qualifier) and the third component (reverse routing address) are optional.|  
|UCI3|Interchange recipient|Mapped from the UNB3 field of the received message. The first subcomponent (identification) is mandatory. The second subcomponent (code qualifier) is optional.|  
|UCI4|Action code|The action codes are:<br /><br /> - 8 if the interchange is accepted<br /><br /> - 7 if the interchange is accepted but some transaction sets are rejected<br /><br /> - 4 if the interchange is rejected because of an error in the UNA or UNB segment<br /><br /> This is a mandatory data element.|  
|UCI5|Syntax Error Code|Identifies the error condition (if any). For more information, see [EDIFACT CONTRL Acknowledgment Error Codes](./logic-apps-enterprise-integration-vedifact-contrl-acknowledgment-error-codes.md).<br /><br /> This data element has conditional optionality.|  
|UCI6|Service Segment Tag|Identifies the segment that has the error condition identified in the UCI.5 data element.<br /><br /> This data element has conditional optionality.|  
|UCI7|Data element identification|Identifies the data elements that have the error condition identified in the UCI.5 data element. The subcomponents of UCI7 are:<br /><br /> - Position of erroneous data element in segment (mandatory)<br /><br /> - Position of erroneous component data element in segment (conditional optionality)<br /><br /> - Occurrence of erroneous data element in segment (conditional optionality)|  
|UCI8|-|-|  
|UNT1|Count of segments|-|  
|UNT2|Message reference number|-|