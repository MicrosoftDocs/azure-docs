---
title: "EDIFACT CONTRL Message as Functional Acknowledgment | Microsoft Docs"
description: "EDIFACT CONTRL Message as Functional Acknowledgment in Logic Apps EDIFACT message processing with Enterprise Integration Pack"
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 07/15/2021
---
# EDIFACT CONTRL Message as Functional Acknowledgment
If you have selected to generate a functional acknowledgment in business profile settings or trading partner agreement (or fallback agreement if no agreement is defined between the two business profiles), or if the UNB9 field in the message is set to "1", a CONTRL message will be generated as a functional acknowledgment (ACK). This ACK reports the results of syntax checks of the interchange.  
  
 The CONTRL functional ACK includes the following segments:  
  
- UNH message header (mandatory)  
  
- A UCI segment that identifies the subject interchange and indicates the status interchange receipt, and contains references to the UNA, UNB, and UNZ segments of the received interchange (mandatory). The UCI segment has a max occurrence of 1; as a result, it reports the first error encountered in one of the control segments.  
  
- A UCF segment that identifies a group segment (encapsulated by the UNG header and UNE trailer) and indicates the nature of any error (mandatory if the UNG segment exists)  
  
- A UCM segment that identifies a message segment (encapsulated by the UNH header and UNT trailer) and indicates the nature of any error (mandatory)  
  
- A UCS segment that identifies a transaction set and indicates the nature of any error (mandatory)  
  
- A UCD segment that identifies an erroneous composite or component data element and indicates the nature of the error (conditional)  
  
- UNT message trailer (mandatory).  
  
  If a received CONTRL functional acknowledgment only contains UNH, UCI, and UNT segments, the EDIReceive pipeline will process the acknowledgment as a CONTRL receipt (technical) acknowledgment.  
  
  Each instance of a segment at a reporting level (i.e., the UCI, UCF, UCM, UCS, and UCD segments) can report only one error.  
  
> [!NOTE]
>  The CONTRL message contains several mandatory data elements that will be copied from the received interchange. If the data element in the interchange is missing or is syntactically invalid, a syntactically valid CONTRL message cannot be generated. The error must then be reported by some means other than a CONTRL message.  
> 
> [!NOTE]
>  In Logic App EDIFACT message processing, a CONTRL message (receipt acknowledgment, acceptance, or rejection) is sent in response to a received interchange that contains only one or more CONTRL messages. In Logic App, no CONTRL message (receipt acknowledgment, acceptance, or rejection) is sent in response to a received interchange that contains only one or more CONTRL messages. Errors in received CONTRL messages must be reported by a means other than a CONTRL message. If one or more CONTRL messages are contained in an interchange that contains data messages, the CONTRL message generated as a response to that interchange will be generated as if no CONTRL messages were contained in the received interchange.  
  
 **SG Loops**  
  
 The CONTRL functional ACK will be structured differently depending upon whether the received interchange includes one or more groups. If the interchange includes a group, the ACK will contain one UCF segment per group. Each UCF segment will contain one UCM segment per message, and each UCM segment will include a series of UCS and UCD segments in tandem.  
  
 The XML form of the ACK message will include an SG3Loop element that encapsulates each UCF segment, an SG4Loop element that encapsulates each UCM element, and an SG5Loop element that encapsulates each pair of UCS and UCD elements. SG loop tags are not present in the native EDI format of the message.  
  
 If the interchange does not include a group, the ACK will not contain any UCF segments. Instead it will include one UCM segment per message, and each UCM segment will include a series of UCS and UCD segments in tandem.  
  
 The XML form of the ACK message will include an SG1Loop element that encapsulates each UCM element, and an SG2Loop element that encapsulates each pair of UCS and UCD elements. As with interchanges that include groups, the SG tags are not present in the native format of the ACK.  
  
> [!NOTE]
>  By default and industry usage, SG1/SG4 loops are not expected for accepted transaction sets. However, to support compliance with standards, you can force generation of SG1/SG4 by selecting the **Generate SG1/SG4 loop for accepted transaction sets** checkbox in the **Acknowledgements** page of the Agreement Properties dialog box for an agreement between two business profiles (or the **Acknowledgements** page of the EDI Settings tab for a business profile). If this checkbox is selected, the receive pipeline will generate SG1/SG4 loops whether the transaction set is accepted or rejected. Otherwise, these loops will be generated only for erroneous transaction sets (for which UCM5 != 7).  
  
 **Data Elements**  
  
 The CONTRL functional ACK includes the following data elements:  
  
|Data Element|Name|Usage|  
|------------------|----------|-----------|  
|UNH1|Message reference number|-|  
|UNH2|Message identifier subcomponents|The subcomponents are:<br /><br /> - 1 = CONTRL<br /><br /> - 2 = 4<br /><br /> - 3 = 1<br /><br /> - 4 = UN|  
|UCI1|Interchange control number|Mapped from the UNB5 field of the received message.|  
|UCI2|Interchange sender|Mapped from the UNB2 field of the received message. The first subcomponent (identification) is mandatory. The second subcomponent (code qualifier) and the third component (reverse routing address) are optional.|  
|UCI3|Interchange recipient|Mapped from the UNB3 field of the received message. The first subcomponent (identification) is mandatory. The second subcomponent (code qualifier) is optional.|  
|UCI4|Action code|The action codes are:<br /><br /> - 8 if the interchange is accepted<br /><br /> - 7 if the interchange is accepted but some transaction sets are rejected<br /><br /> - 4 if the interchange is rejected because of an error in the UNA or UNB segment<br /><br /> This is a mandatory data element.|  
|UCI5|Syntax Error Code|Identifies the error condition in reception of the interchange (if any). For more information, see [EDIFACT CONTRL Acknowledgment Error Codes](./logic-apps-enterprise-integration-edifact-contrl-acknowledgment-error-codes.md).<br /><br /> This data element has conditional optionality.|  
|UCI6|Service Segment Tag|Identifies the segment that has the error condition identified in the UCI.5 data element.<br /><br /> This data element has conditional optionality.|  
|UCI7|Data element identification|Identifies the data elements that have the error condition identified in the UCI.5 data element. The subcomponents of UCI7 are:<br /><br /> - Position of erroneous data element in segment (mandatory)<br /><br /> - Position of erroneous component data element in segment (conditional optionality)<br /><br /> - Occurrence of erroneous data element in segment (conditional optionality)|  
|UCI8|-|-|  
|UCF1|Group Reference Number|Mapped from the UNG5 field of the received message.<br /><br /> This is a mandatory data element.|  
|UCF2|Application Sender’s Identification|Mapped from the UNG2 field of the received message along with sub components<br /><br /> This is a conditional data element.|  
|UCF3|Application Recipient’s Identification|Mapped from the UNG3 field of the received message along with sub components.<br /><br /> This is a conditional data element.|  
|UCF4|Action Coded|The action codes are:<br /><br /> - 7 if the interchange is accepted<br /><br /> - 4 if the interchange is rejected because of an error in the UNA or UNB segment<br /><br /> The code applies to this level and all lower levels.<br /><br /> This is a mandatory data element.|  
|UCF5|Syntax Error, Coded|Identifies the error condition in the group (if any). For more information, see [EDIFACT CONTRL Acknowledgment Error Codes](./logic-apps-enterprise-integration-edifact-contrl-acknowledgment-error-codes.md).<br /><br /> This data element has conditional optionality.|  
|UCF6|Service Segment Tag|Identifies the erroneous segment in the group.<br /><br /> This data element has conditional optionality.|  
|UCF7|Data element identification|Identifies the data elements that have the error condition identified in the UCF5 data element. The subcomponents of UCF7 are:<br /><br /> - Position of erroneous data element in segment (mandatory)<br /><br /> - Position of erroneous component data element in segment (conditional optionality)<br /><br /> - Occurrence of erroneous data element in segment (mandatory)|  
|UCM1|Message Reference Number|Mapped from the UNH1 field of the received message.<br /><br /> This is a mandatory data element.|  
|UCM2|Message Identifier|Mapped from the UNH2 field of the received message along with sub components<br /><br /> This is a conditional data element.|  
|UCM3|Action Coded|The action codes are:<br /><br /> - 7 if the interchange is accepted<br /><br /> - 4 if the interchange is rejected because of an error in the UNA or UNB segment<br /><br /> The code applies to this level and all lower levels.<br /><br /> This is a mandatory data element.|  
|UCM4|Syntax Error, Coded|Identifies the error condition in the group (if any). For more information, see [EDIFACT CONTRL Acknowledgment Error Codes](./logic-apps-enterprise-integration-edifact-contrl-acknowledgment-error-codes.md).<br /><br /> This data element has conditional optionality.|  
|UCM5|Service Segment Tag|Identifies the UNH or UNT segment in error.<br /><br /> This data element has conditional optionality.|  
|UCM7|Data element identification|Identifies the data elements that have the error condition identified in the UCM5 data element. The subcomponents of UCM7 are:<br /><br /> - Position of erroneous data element in segment (mandatory)<br /><br /> - Position of erroneous component data element in segment (conditional optionality)<br /><br /> - Occurrence of erroneous data element in segment (mandatory)|  
|UCS1|Segment position in message body|Count of the position of the erroneous segment, starting with UNH as 1. To report that a segment is missing, this is the numerical count position of the last segment that was processed before the position where the missing segment was expected to be. A missing segment group is denoted by identifying the first segment in the group as missing.<br /><br /> This is a mandatory data element.|  
|UCS2|Syntax Error Coded|Identifies the error condition in the group (if any). For more information, see [EDIFACT CONTRL Acknowledgment Error Codes](./logic-apps-enterprise-integration-edifact-contrl-acknowledgment-error-codes.md).<br /><br /> This data element has conditional optionality.|  
|UCD1|Syntax Error Coded|Identifies the error condition in the group (if any). For more information, see [EDIFACT CONTRL Acknowledgment Error Codes](./logic-apps-enterprise-integration-edifact-contrl-acknowledgment-error-codes.md).<br /><br /> This data element has conditional optionality.<br /><br /> **Note:** If an XSD validation failure occurs, the UCD1 data element will report a code value of 12, Invalid Value.|  
|UCD2|Data element identification|Identifies the data elements that have the error condition identified in the UCD1 data element. The subcomponents of UCD2 are:<br /><br /> - Position of erroneous data element in segment (mandatory)<br /><br /> - Position of erroneous component data element in segment (conditional optionality)<br /><br /> - Occurrence of erroneous data element in segment (mandatory)|  
|UNT1|Count of segments|-|  
|UNT2|Message reference number|-|