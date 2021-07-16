---
title: "EDIFACT CONTRL Acknowledgment Error Codes | Microsoft Docs"
description: "EDIFACT CONTRL Acknowledgment error codes in Logic Apps EDIFACT message processing with Enterprise Integration Pack"
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 07/15/2021
---

# EDIFACT CONTRL Acknowledgment Error Codes
This topic lists the error codes used within the segments of an EDIFACT CONTRL acknowledgment. For more information about these segments, see [EDIFACT CONTRL Acknowledgment](./logic-apps-enterprise-integration-edifact-contrl-acknowledgment.md).  
  
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
  
 **Logic App Specific EDIFACT Error Codes**  
  
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