---
title: "X12 997 Acknowledgment Error Codes | Microsoft Docs"
description: X12 Acknowledgement error code for X12 message processing in Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 07/15/2021
---
# X12 997 Acknowledgment Error Codes
This topic lists the error codes used within the segments of an X12 997 acknowledgment. For more information about these segments, see [X12 997 Acknowledgment](./logic-apps-enterprise-integration-x12-997-acknowledgment.md).  
  
 Each table indicates which error codes specified by the X12 specification are supported in Logic App X12 message processing and which are unsupported.  
  
 **AK304 Error Codes**  
  
 The following table lists the error codes used in the AK304 data element of the AK3 segment (Data Segment Note).  
  
|Error Code|Condition|Supported?|  
|----------------|---------------|----------------|  
|1|Unrecognized segment ID|Yes|  
|2|Unexpected segment|Yes|  
|3|Mandatory segment missing|Yes|  
|4|Loop occurs over maximum times|Yes|  
|5|Segment exceeds maximum use|Yes|  
|6|Segment not in defined transaction set|Yes|  
|7|Segment not in proper sequence|Yes|  
|8|Segment has data element errors|Yes|  
|511|Trailing separators encountered (custom code)|Yes|  
  
 **AK403 Error Codes**  
  
 The following table lists the error codes used in the AK403 data element of the AK4 segment (Data Element Note).  
  
|Error Code|Condition|Supported?|  
|----------------|---------------|----------------|  
|1|Mandatory data element missing|Yes|  
|2|Conditional required data element missing|Yes|  
|3|Too many data elements|Yes|  
|4|Data element is too short|Yes|  
|5|Data element is too long|Yes|  
|6|Invalid character in data element|Yes|  
|7|Invalid code value|Yes|  
|8|Invalid date|Yes|  
|9|Invalid time|Yes|  
|10|Exclusion condition violated|Yes|  
  
 **AK501 Error Codes**  
  
 The following table lists the error codes used in the AK501 data element of the AK5 segment (Transaction Set Response Trailer).  
  
|Error Code|Condition|Supported?|  
|----------------|---------------|----------------|  
|A|Accepted|Yes|  
|E|Accepted but errors were noted|Yes<br /><br /> Note: None of the error codes lead to a status of "E".|  
|M|Rejected, message authentication code (MAC) failed|No|  
|P|Partially accepted, at least one transaction set was rejected|Yes|  
|R|Rejected|Yes|  
|W|Rejected, assurance failed validity tests|No|  
|X|Rejected, content after decryption could not be analyzed|No|  
  
 **AK502 through AK506 Error Codes**  
  
 The following table lists the error codes used in the AK502 through AK506 data elements of the AK5 segment (Transaction Set Response Trailer).  
  
|Error Code|Condition|Supported?/<br />Correlated with AK501?|  
|----------------|---------------|------------------------------------------|  
|1|Transaction set not supported|Yes/R|  
|2|Transaction set trailer missing|Yes/R|  
|3|Transaction set control number in header and trailer do not match|Yes/R|  
|4|Number of included segments does not match actual count|Yes/R|  
|5|One or more segments in error|Yes/R|  
|6|Missing or invalid transaction set identifier|Yes/R|  
|7|Missing or invalid transaction set control number (a duplicate transaction number may have occurred)|Yes/R|  
|8 through 27|-|No|  
  
 **AK901 Error Codes**  
  
 The following table lists the error codes used in the AK901 data elements of the AK9 segment (Functional Group Response Trailer).  
  
|Error Code|Condition|Supported?/<br />Correlated with AK501?|  
|----------------|---------------|------------------------------------------|  
|A|Accepted|Yes|  
|E|Accepted, but errors were noted|Yes|  
|M|Rejected, message authentication code (MAC) failed|No|  
|P|Partially accepted, at least one transaction set was rejected|Yes|  
|R|Rejected|Yes|  
|W|Rejected, assurance failed validity tests|No|  
|X|Rejected, content after decryption could not be analyzed|No|  
  
 **AK905 through AK909 Error Codes**  
  
 The following table lists the error codes used in the AK905 through AK909 data elements of the AK9 segment (Functional Group Response Trailer).  
  
|Error Code|Condition|Supported?/<br />Correlated with AK501?|  
|----------------|---------------|------------------------------------------|  
|1|Functional group not supported|No|  
|2|Functional group version not supported|No|  
|3|Functional group trailer missing|Yes|  
|4|Group control number in the functional group header and trailer do not agree|Yes|  
|5|Number of included transaction sets does not match actual count|Yes|  
|6|Group control number violates syntax (a duplicate group control number may have occurred)|Yes|  
|7 through 26|-|No|  
  
## See Also  
 [X12 997 Acknowledgment](./logic-apps-enterprise-integration-x12-997-acknowledgment.md)
