---
title: "EDIFACT CONTRL Acknowledgment | Microsoft Docs"
description: "EDIFACT CONTRL Acknowledgment in Logic Apps EDIFACT message processing with Enterprise Integration Pack"
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 07/15/2021
---
# EDIFACT CONTRL Acknowledgment
The CONTRL acknowledgment (ACK) serves as both technical and functional acknowledgment for EDIFACT-encoded messages. As a technical acknowledgment, the CONTRL message indicates receipt of an interchange. As a functional acknowledgment, the CONTRL message indicates acceptance or rejection of the received interchange, group, or message, with a list of errors or unsupported functionality.  
  
 The full CONTRL message serves as the functional ACK. Sections of the functional ACK are reused for the technical ACK. If you have selected both technical and functional ACKs in the party properties for a sending party or in global properties, Logic App EDIFACT Decode action will generate two CONTRL messages: a technical CONTRL ACK and a functional CONTRL ACK.  
  
 The CONTRL ACK conforms to the EFACT_\<Version number\>_CONTRL.xsd schema.  
  
## Technical Acknowledgement  
 A technical ACK implies that the recipient of the interchange:  
  
-   has received the subject interchange;  
  
-   acknowledges the parts of the subject interchange that have been checked in order to ensure that the data elements copied into the reporting UCI segment are syntactically correct;  
  
-   has accepted responsibility for notifying the sender of acknowledgement or rejection of the other parts of the subject interchange;  
  
-   and has taken reasonable precautions in order to ensure that the sender is so notified.  
  
## Functional Acknowledgement  
 A functional ACK implies that the recipient of the interchange:  
  
- has received the referenced levels(s) of the interchange acknowledged;  
  
- has checked that there are no fatal syntactic errors in the acknowledged referenced level that prevents further processing of the interchange;  
  
- has checked that all acknowledged parts of service segments are semantically correct (if no errors are reported);  
  
- will comply with the actions requested in the acknowledged referenced-levels of the service segments;  
  
- has accepted responsibility for notifying the sender by other means than sending a CONTRL message if any syntactic or semantic errors as described above, are later detected in the relevant part, or the part cannot be processed for some other reason after the part has been acknowledged in a submitted CONTRL message;  
  
- and has taken reasonable precautions in order to ensure that such errors are detected and that the sender is notified.  
  
  Rejection implies that the recipient of the interchange:  
  
- cannot acknowledge the subject interchange, or the relevant parts of it, for reasons indicated in the CONTRL message;  
  
- and will not take any further action on business information contained in the rejected part of the subject interchange.  

### EDIFACT CONTRL Message as Functional Acknowledgment
If you have selected to generate a functional acknowledgment in EDIFACT agreement, or if the UNB9 field in the message is set to "1", a CONTRL message will be generated as a functional acknowledgment (ACK). This ACK reports the results of syntax checks of the interchange.  
  
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
|UCF5|Syntax Error, Coded|Identifies the error condition in the group (if any). <br /><br /> This data element has conditional optionality.|  
|UCF6|Service Segment Tag|Identifies the erroneous segment in the group.<br /><br /> This data element has conditional optionality.|  
|UCF7|Data element identification|Identifies the data elements that have the error condition identified in the UCF5 data element. The subcomponents of UCF7 are:<br /><br /> - Position of erroneous data element in segment (mandatory)<br /><br /> - Position of erroneous component data element in segment (conditional optionality)<br /><br /> - Occurrence of erroneous data element in segment (mandatory)|  
|UCM1|Message Reference Number|Mapped from the UNH1 field of the received message.<br /><br /> This is a mandatory data element.|  
|UCM2|Message Identifier|Mapped from the UNH2 field of the received message along with sub components<br /><br /> This is a conditional data element.|  
|UCM3|Action Coded|The action codes are:<br /><br /> - 7 if the interchange is accepted<br /><br /> - 4 if the interchange is rejected because of an error in the UNA or UNB segment<br /><br /> The code applies to this level and all lower levels.<br /><br /> This is a mandatory data element.|  
|UCM4|Syntax Error, Coded|Identifies the error condition in the group (if any). For more information, see [EDIFACT CONTRL Acknowledgment Error Codes](./logic-apps-enterprise-integration-edifact-contrl-acknowledgment-error-codes.md).<br /><br /> This data element has conditional optionality.|  
|UCM5|Service Segment Tag|Identifies the UNH or UNT segment in error.<br /><br /> This data element has conditional optionality.|  
|UCM7|Data element identification|Identifies the data elements that have the error condition identified in the UCM5 data element. The subcomponents of UCM7 are:<br /><br /> - Position of erroneous data element in segment (mandatory)<br /><br /> - Position of erroneous component data element in segment (conditional optionality)<br /><br /> - Occurrence of erroneous data element in segment (mandatory)|  
|UCS1|Segment position in message body|Count of the position of the erroneous segment, starting with UNH as 1. To report that a segment is missing, this is the numerical count position of the last segment that was processed before the position where the missing segment was expected to be. A missing segment group is denoted by identifying the first segment in the group as missing.<br /><br /> This is a mandatory data element.|  
|UCS2|Syntax Error Coded|Identifies the error condition in the group (if any). <br /><br /> This data element has conditional optionality.|  
|UCD1|Syntax Error Coded|Identifies the error condition in the group (if any). <br /><br /> This data element has conditional optionality.<br /><br /> **Note:** If an XSD validation failure occurs, the UCD1 data element will report a code value of 12, Invalid Value.|  
|UCD2|Data element identification|Identifies the data elements that have the error condition identified in the UCD1 data element. The subcomponents of UCD2 are:<br /><br /> - Position of erroneous data element in segment (mandatory)<br /><br /> - Position of erroneous component data element in segment (conditional optionality)<br /><br /> - Occurrence of erroneous data element in segment (mandatory)|  
|UNT1|Count of segments|-|  
|UNT2|Message reference number|-|

## EDIFACT CONTRL Acknowledgment Error Codes
This topic lists the error codes used within the segments of an EDIFACT CONTRL acknowledgment. For more information about these segments.  

 These errors apply to the interchange, group, message, and data level. On encountering a supported error, the entire interchange, group, or transaction set is rejected. There is no "accepted with errors" condition for EDIFACT-encoded interchanges.  

 **Standard EDIFACT Error Codes**  

 The following table lists the error codes used in the UCI5 field of the EDIFACT CONTRL ACK. This table indicates which error codes specified by the EDIFACT specification are supported in Logic App EDIFACT message processing and which are unsupported.  

|Error Code|Condition|Cause|Supported?|  
|----------------|---------------|-----------|----------------|  
|2|Syntax version or level not supported|Notification that the syntax version and/or level is not supported by the recipient.|No|  
|7|Interchange recipient not actual recipient|Notification that the Interchange recipient (S003) is different from the actual recipient.|No|  
|12|Invalid value|Notification that the value of a standalone data element, composite data element, or component data element does not conform to the relevant specifications for the value.|Yes|  
|13|Missing|Notification that a mandatory (or otherwise required) service or user segment, data element, composite data element, or component data element is missing.|Yes|  
|14|Value not supported in this position|Notification that the recipient does not support use of the specific value of an identified standalone data element, composite data element, or component data element in the position where it is used. The value may be valid according to the relevant specifications and may be supported if it is used in another position.|No|  
|15|Not supported in this position|Notification that the recipient does not support use of the segment type, standalone data element type, composite data element type, or component data element type in the identified position.|Yes|  
|16|Too many constituents|Notification that the identified segment contained too many data elements or that the identified composite data element contained too many component data elements.|Yes|  
|17|No agreement|No agreement exists that allows receipt of an interchange, group, message, or package with the value of the identified standalone data element, composite data element, or component data element.|No|  
|18|Unspecified error|Notification that an error has been identified, but the nature of the error is not reported.|No|  
|19|Invalid decimal notation|Notification that the character indicated as decimal notation in UNA is invalid, or the decimal notation used in a data element is not consistent with the one indicated in UNA.|No|  
|20|Character invalid as service character|Notification that a character advised in UNA is invalid as a service character.|No|  
|21|Invalid character(s)|Notification that one or more character(s) used in the interchange is not a valid character as defined by the syntax identifier indicated in the UNB segment. The invalid character is part of the referenced-level, or followed immediately after the identified part of the interchange.|Yes|  
|22|Invalid service character(s)|Notification that the service character(s) used in the interchange is not a valid service character as advised in the UNA segment or is not one of the default service characters. If the code is used in the UCS or UCD segment, the invalid character followed immediately after the identified part of the interchange.|No|  
|23|Unknown Interchange sender|Notification that the interchange sender (S002) is unknown.|No|  
|24|Too old|Notification that the received interchange or group is older than a limit specified in an IA or determined by the recipient.|No|  
|25|Test indicator not supported|Notification that test processing cannot be performed for the identified interchange, group, message, or package.|No|  
|26|Duplicate detected|Notification that a possible duplication of a previously received interchange, group, message, or package has been detected. The earlier transmission may have been rejected.|Yes|  
|27|Security function not supported|Notification that a security function related to the referenced level or data element is not supported.|No|  
|28|References do not match|Notification that the control reference in the UNB, UNG, UNH, UNO, USH, or USD segment does not match the control reference in the UNZ, UNE, UNT, UNP, UST, or USU segment, respectively.|No|  
|29|Control count does not match number of instances received|Notification that the number of groups, messages, or segments does not match the number given in the UNZ, UNE, UNT, or UST segment; or that the length of an object or the length of encrypted data is not equal to the length stated in the UNO, UNP, USD, or USU segment.|Yes|  
|30|Groups and messages/packages mixed|Notification that groups have been mixed with messages/packages outside of groups in the interchange.|No|  
|31|More than one message type in group|Notification that different message types are contained in a functional group.|Yes|  
|32|Lower level empty|Notification that the interchange does not contain any messages, packages, or groups; or that a group does not contain any messages or packages.|No|  
|33|Invalid occurrence outside message, package, or group|Notification of an invalid segment or data element in the interchange, between messages, between packages, or between groups. Rejection is reported at the level above.|Yes|  
|34|Nesting indicator not allowed|Notification that explicit nesting has been used in a message where it shall not be used.|No|  
|35|Too many data element or segment repetitions|Notification that a standalone data element, composite data element, or segment is repeated too many times.|Yes|  
|36|Too many segment group repetitions|Notification that a segment group is repeated too many times.|Yes|  
|37|Invalid type of character(s)|Notification that one or more numeric characters are used in an alphabetic (component) data element or that one or more alphabetic characters are used in a numeric (component) data element.|Yes|  
|38|Missing digit in front of decimal sign|Notification that a decimal sign is not preceded by one or more digits.|Yes|  
|39|Data element too long|Notification that the length of the data element received exceeded the maximum length specified in the data element description.|Yes|  
|40|Data element too short|Notification that the length of the data element received is shorter than the minimum length specified in the data element description.|Yes|  
|41|Permanent communication network error|Notification that a permanent error was reported by the communication network used for transfer of the interchange. Re-transmission of an identical interchange with the same parameters at network level will not succeed.|No|  
|42|Temporary communication network error|Notification that a temporary error was reported by the communication network used for transfer of the interchange. Re-transmissions of an identical interchange may succeed.|No|  
|43|Unknown interchange recipient|Notification that the interchange recipient is not known by a network provider.|No|  
|45|Trailing separator|Notification of one of the following:<br /><br /> - The last character before the segment terminator is a data element separator, a component data element separator, or a repeating data element separator, or<br /><br /> - The last character before a data element separator is a component data element separator or a repeating data element separator.|Yes|  
|46|Character set not supported|Notification that one or more characters used are not in the character set defined by the syntax identifier; or the character set identified by the escape sequence for the code extension technique is not supported by the recipient.|Yes|  
|47|Envelope functionality not supported|Notification that the envelope structure encountered is not supported by the recipient.|Yes|  
|48|Dependency Notes condition violated|Notification that an error condition has occurred as the result of a dependency condition violation.|No|  

 **Logic App EDIFACT error codes**  

 The following table lists error codes used in the UCI5 field of the EDIFACT CONTRL ACK that are not part of the EDIFACT specification. These are custom codes that are specific to Logic App.  

|Error Code|Condition|Cause|  
|----------------|---------------|-----------|  
|70|Transaction set missing or invalid transaction set Identifier|Notification that the transaction set identifier is missing or invalid.|  
|71|Transaction set or group control number mismatch|Notification that there is a mismatch with the transaction set or group control numbers.|  
|72|Unrecognized segment ID|Notification that the segment ID is not recognized.|  
|73|XML not at correct position|Notification that a problem has occurred when serializing the XML root element.|  
|74|Too few segment group repetitions|Notification that a segment group repeats less than the required amount.|  
|75|Too few segment repetitions|Notification that a segment repeats less than the required amount.|  
|76|Too few data elements found|Notification that there were not enough data elements found.|
  
