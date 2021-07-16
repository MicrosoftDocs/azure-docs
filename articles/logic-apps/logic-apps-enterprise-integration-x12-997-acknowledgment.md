---
title: X12 997 acknowledgments and error codes
description: Learn about 997 functional acknowledgments and error codes for X12 messages in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: article
ms.date: 07/15/2021
---

# 997 functional acknowledgments and error codes for X12 messages in Azure Logic Apps

The X12 997 functional acknowledgment reports the status of a received interchange. It reports each error encountered while processing the received document. Logic App  [X12 Decode](.\logic-apps-enterprise-integration-x12-decode.md) always generates a 4010 compliant 997; however, X12 Encode and Decode can also validate a 5010 compliant 997.  
  
 Like all X12 transaction sets, the 997 ACK is sent inside a GS/GE envelope. The ST and SE are no different than any other transaction set.  

In Azure Logic Apps, you can create logic app workflows that handle X12 messages by using **X12** operations. In X12 messaging, 

by sending a 997 functional acknowledgment (ACK)

the address receiver reports the status from processing an interchange header and trailer by sending a TA1 technical acknowledgment (ACK). The receiver sends a positive **TA1 ACK** when the Interchange Control Header (ISA) and Interchange Control Trailer (IEA) of the X12-encoded message are valid, regardless the status of the other content. If the ISA and IEA aren't valid, the receiver sends a **TA1 ACK** with an error code instead.

This topic provides a brief overview about X12 TA1 technical acknowledgments, including the segments inside a TA1 ACK interchange and the error codes used in those segments. If you're looking for EDIFACT messages instead, review [Exchange EDIFACT messages](logic-apps-enterprise-integration-edifact.md). For more information, review the following documentation:

* [Exchange X12 messages for B2B enterprise integration](logic-apps-enterprise-integration-x12.md)
* [What is Azure Logic Apps](logic-apps-overview.md)
* [B2B enterprise integration solutions with Azure Logic Apps and Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md)

## Transaction set segments for 997 ACK

The segments within the transaction set of a 997 ACK are shown in the following table.  

The X12 TA1 technical acknowledgment conforms to the schema for **X12_<*version number*>_TA1.xsd**. Although the receiver sends the **TA1 ACK** inside an ISA/IEA envelope, the ISA and IEA are no different than any other interchange. The following table describes the segments within the interchange for a **TA1 ACK**:


|Position|Segment<br />ID|Name|Req.<br />Des.|Max. Use|Loop<br />Repeat|  
|--------------|-----------------|----------|----------------|--------------|------------------|  
|010|ST|Transaction Set Header (for the acknowledgment)|M|1|-|  
|020|AK1|Functional Group Response Header|M|1|-|  
|030|AK2|Transaction Set Response Header|O|1|999999 <br />(Loop ID = AK2)|  
|040|AK3|Data Segment Note|O|1|999999 <br />(Loop ID = AK2/AK3)|  
|050|AK4|Data Element Note|O|99|-|  
|060|AK5|Transaction Set Response Trailer|M|1|-|  
|070|AK9|Functional Group Response Trailer|M|1|-|  
|080|SE|Transaction Set Trailer (for the acknowledgment)|M|1|-|  
  
- Req. Des. = Requirement Designation  
  
- M = Mandatory  
  
- O = Optional  
  
  The AK segments are described below. The segments in the AK2 to AK5 loop provide information about an error with a transaction set.  
  
### AK1  

The mandatory AK1 segment identifies the functional group being acknowledged with the following data elements:  
  
-   AK101 is the functional group ID (GS01) of the functional group being acknowledged.  
-   AK102 is the group control number (GS06 and GE02) of the functional group being acknowledged.  
-   AK103 is optional and is the EDI implementation version sent in the GS08 of the original transaction. AK103 supports inbound 5010 compliant 997.  
  
## AK2  

The optional AK2 segment contains an acknowledgment for a transaction set within the received functional group. If there are multiple AK2 segments, they will be sent as a series of loops. Each AK2 loop identifies a transaction set in the order that it was received. The AK2 segment identifies the transaction set with two data elements:  
  
- AK201 is the transaction set ID (ST01) of the transaction set being acknowledged.  
  
- AK202 is the transaction set control number (ST02 and SE02) of the transaction set being acknowledged.  
  
- AK203 is optional and is the EDI implementation version sent in the ST03 of the original transaction. AK203 supports inbound 5010 compliant 997.  
  
  An AK2 loop will contain AK3, AK4, and AK5 segments if a transaction set is in error. For more information, see the descriptions for these segments below.  
  
  You can specify that AK2 segments are generated for all transaction sets, whether accepted or rejected, or only for rejected transaction sets. Logic App will generate AK2 segments for accepted transaction sets (where AK501 == A) if you select the **Include AK2 Loop for accepted transaction sets** check box in the **Acknowledgements** page of the Agreement Properties dialog box for an agreement between two business profiles (or the **Acknowledgements** page of the X12 Settings tab for a business profile). Otherwise, Logic App will generate AK2 loops only for rejected transaction sets. If an agreement is not resolved for the interchange being responded to, the 997 generation settings default to the fallback agreement settings, and AK2 segments are not generated for accepted transaction sets.  
  
## AK3  
 The optional AK3 segment reports errors in a data segment and identifies the location of the data segment. An AK3 segment is created for each segment in a transaction set that has one or more errors. If there are multiple AK3 segments, they will be sent as a series of loops (one segment per loop). The AK3 segment has four data elements that specify the location of each segment in error and reports the type of syntactical error found at that location:  
  
-   AK301 identifies the segment in error with its X12 segment ID, for example, NM1.  
  
-   AK302 is the segment count of the segment in error. The ST segment is "1" and each segment increments the segment count by one.  
  
-   AK303 identifies a bounded loop: a loop surrounded by an LS segment and a LE segment. AK303 contains the values of the LS and LE segments that bound the segment in error.  
  
-   AK304 is the error code for the error in the data segment. AK304 is optional, but is required if an error exists for the identified segment. For a list of the AK304 error codes, see [X12 997 Acknowledgment Error Codes](./logic-apps-enterprise-integration-x12-997-acknowledgment-error-codes.md).  
  
## AK4  
 The optional AK4 segment reports errors in a data element or composite data structure, and identifies the location of the data element. It is sent when the AK304 data element is "8", "Segment has data element errors". It can repeat up to 99 times within each AK3 segment. The AK4 segment has four data elements that specify the location of each data element or composite data structure in error and reports the type of syntactical error found at that location.  
  
-   AK401 is a composite data element with fields AK41.1, AK41.2 and AK41.3. AK401-1 identifies the data element or composite data structure in error with its numerical count. For example, if the second data element in the segment has an error, AK401 equals "2". AK401-2 identifies the numerical count of the component data element in a composite data structure that has an error. When AK401 reports an error on a data structure that is not composite, AK401-2 is not valued.  
  
     AK41.3 is optional and is the repeating data element position. AK41.3 supports inbound 5010 compliant 997.  
  
-   AK402 is optional and identifies the simple X12 data element number of the element in error. For example, NM101 is simple X12 data element number 98.  
  
-   AK403 is mandatory and reports the error of the identified element. For a list of the AK403 error codes, see [X12 997 Acknowledgment Error Codes](./logic-apps-enterprise-integration-x12-997-acknowledgment-error-codes.md).  
  
-   AK404 is optional, and contains a copy of the identified data element in error. AK404 is not used if the error indicates an invalid character.  
  
## AK5  
 The AK5 segment reports whether the transaction set identified in the AK2 segment is accepted or rejected and why. The AK5 segment is mandatory if the optional AK2 loop is included in the acknowledgment. The AK4 segment has one mandatory data element that specifies the status of the transaction set and from one to five optional data elements that provide error codes based on the syntax editing of the transaction set.  
  
-   AK501 specifies whether the identified transaction set is accepted or rejected. For a list of the AK501 error codes, see [X12 997 Acknowledgment Error Codes](./logic-apps-enterprise-integration-x12-997-acknowledgment-error-codes.md).  
  
-   AK502 through AK506 indicates the nature of the error. For a list of the AK501 error codes, see [X12 997 Acknowledgment Error Codes](./logic-apps-enterprise-integration-x12-997-acknowledgment-error-codes.md).  
  
## AK9  
 The mandatory AK9 segment indicates whether the functional group identified in the AK1 segment is accepted or rejected and why. The AK9 segment has four mandatory data elements that specify the status of the transaction set and the nature of any error, and from one to five optional elements that specify any noted errors.  
  
-   AK901 is mandatory and specifies whether the functional group identified in AK1 is accepted or rejected. For a list of the AK901 error codes, see [X12 997 Acknowledgment Error Codes](./logic-apps-enterprise-integration-x12-997-acknowledgment-error-codes.md).  
  
-   AK902 specifies the number of transaction sets included in the identified functional group trailer (GE01).  
  
-   AK903 specifies the number of transaction sets received.  
  
-   AK904 specifies the number of transaction sets accepted in the identified functional group.  
  
-   AK905 through AK909 can indicate from one to five errors noted in the identified functional group. For a list of the AK905 through AK909 error codes, see [X12 997 Acknowledgment Error Codes](./logic-apps-enterprise-integration-x12-997-acknowledgment-error-codes.md).  

## Error codes
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
  
## Next steps