---
title: 'Logic Apps B2B list of errors and solutions: Azure App Service | Microsoft Docs'
description: Logic Apps B2B list of errors and solutions
services: logic-apps
documentationcenter: .net,nodejs,java
author: padmavc
manager: anneta
editor: ''

ms.assetid: cf44af18-1fe5-41d5-9e06-cc57a968207c
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/02/2017
ms.author: LADocs; padmavc

---

# Logic Apps B2B list of errors and solutions
This article is intended to be a knowledge base of Logic Apps B2B errors and solutions.  It includes a description of the error and actions you can take an approprite action to help correct the error.

## Agreement Resolution

### *No agreement found 

|   |   |  
|---|---|
| Error description | No agreement found with Agreement Resolution Parameters|    
| User action | The agreement should be added to the integration account with agreed business identities. The business identities should match to the input message ids|  
|   |   |

### * No agreement found with identities

|   |   | 
|---|---|
| Error description | No agreement found with identities: 'AS2Identity'::'Partner1' and'AS2Identity'::'Partner3'| 
| User action | Invalid AS2-From or AS2-To configured for agreement. Correct AS2 message AS2-From or AS2-To headers or agreement to match AS2 ids in AS2 message headers with agreement configurations |
|   |   |     

## AS2

### * Missing AS2 message headers  

|   |   |  
|---|---|
| Error description| Invalid AS2 headers. One of 'AS2-To' or 'AS2-From' headers are empty| 
| User action | An AS2 message was received that did not contain the AS2-From or AS2-To or both headers. Check AS2 message AS2-From and AS2-To headers and correct them based on agreement configuraitons |
|  |  | 


### * Missing AS2 message body and headers    

|   |   |  
|---|---|
| Error description| The request content is null or empty | 
| User action | An AS2 message was received that did not contain the message body |
|  |  | 

### * AS2 message decryption failure

|   |   | 
|---|---|
| Error description |  [processed/Error: decryption-failed] | 
| User action | Add @base64ToBinary to AS2Message before sending to partner
```java
            "HTTP": {
                "inputs": {
                    "body": "@base64ToBinary(body('Encode_to_AS2_message')?['AS2Message']?['Content'])",
                    "headers": "@body('Encode_to_AS2_message')?['AS2Message']?['OutboundHeaders']",
                    "method": "POST",
                    "uri": "xxxxx.xxx"
                },
                
``` 

### * MDN decryption failure

|   |   | 
|---|---|
| Error description |  [processed/Error: decryption-failed] | 
| User action | Add @base64ToBinary to MDN before sending to partner
```java
            "Response": {
                "inputs": {
                    "body": "@base64ToBinary(body('Decode_AS2_message')?['OutgoingMDN']?['Content'])",
                    "headers": "@body('Decode_AS2_message')?['OutgoingMDN']?['OutboundHeaders']",
                    "statusCode": 200
                },
                
``` 

### * Missing signing certificate

|   |   |  
|---|---|
| Error description| The Signing Certificate has not been configured for AS2 party.  AS2-From: partner1 AS2-To: partner2 | 
| User action | Configure AS2 agreement settings with correct certificate for signature |
|  |  | 

## X12 and EDIFACT

### * Leading or trailing space found    
    
|   |   | 
|---|---|
| Error description | Error encountered during parsing. The Edifact transaction set with id '123456' contained in interchange (without group) with id '987654', with sender id 'Partner1', receiver id 'Partner2' is being suspended with following errors:\r\nError: 1 (Segment level error)\r\n\tSegmentID: CTA\r\n\tPosition in TS: 11\r\n\t45: Trailing separator found\r\n\r\nError: 2 (Segment level error)\r\n\tSegmentID: NAD\r\n\tPosition in TS: 12\r\n\t45: Trailing separator found\r\n\r\nError: 3 (Segment level error)\r\n\tSegmentID: RFF\r\n\tPosition in TS: 14\r\n\t45: Trailing separator found\r\n\r\nError: 4 (Segment level error)\r\n\tSegmentID: NAD\r\n\tPosition in TS: 17\r\n\t45: Leading Trailing separator found\r\n\r\nError: 5 (Segment level error)\r\n\tSegmentID: RFF\r\n\tPosition in TS: 19\r\n\t45: Trailing separator found\r\n\r\n |
| User action | The agreement receive settings and send settings to be configured to allow leading and trailing space. Edit agreement settings to allow leading and trailing space |
|   |   |

![allowspace](./media/logic-apps-enterprise-integration-b2b-list-errors-solutions/leadingandtrailing.png)

### * Duplicate check has enabled in the agreement

|   |   | 
|---|---| 
| Error description | (Miscellaneous error)\r\n\t25: Duplicate Control Number\r\n\r\nError: 2 (Field level error)\r\n\tSegmentID: \r\n\tPosition in TS: 1\r\n\tData Element ID: \r\n\tPosition in Segment: 13\r\n\tPosition in Field: 1\r\n\tData Value: 000056422\r\n\t25: Duplicate Control Number"
| User action | This error indicates the received message has duplicate control numbers.  The message needs to be corrected for new control number |
|   |   |

### * Missing schema in the agreement

|   |   | 
|---|---| 
| Error description | Error encountered during parsing. The X12 transaction set with id '564220001' contained in functional group with id '56422', in interchange with id '000056422', with sender id '12345678       ', receiver id '87654321       ' is being suspended with following errors:\r\nError: 1 (Miscellaneous error)\r\n\t6: The message has an unknown document type and did not resolve to any of the existing schemas configured in the agreement.\r\n\r\n
| User action | Configure schema in the agreement settings  |
|   |   |

### * Incorrect schema in the agreement

|   |   | 
|---|---| 
| Error description | Error: 1 (Miscellaneous error)\r\n\t22: Invalid Control Structure\r\n\r\nError: 2 (Miscellaneous error)\r\n\t1: Control Number in ISA and IEA do not match\r\n\r\nError: 3 (Miscellaneous error)\r\n\t21: Number Of included groups do not match\r\n\r\nFunctional Group Error Information\r\n\r\nSequence No: 1\r\nFunctional Id: PO\r\nControl Number: 56397\r\n\r\n\r\n\r\nTransaction Set Errors\r\n\r\nSequence No: 1\r\nTS Id code: 850\r\nControl Number: 563970001\r\n\r\nError: 4 (Miscellaneous error)\r\n\t6: The message has an unknown document type and did not resolve to any of the existing schemas configured in the agreement. |
| User action | Configure correct schema in the agreement settings  |
|   |   |

## Flat file

### * Input message with no body

|   |   | 
|---|---|
| Error description | InvalidTemplate. Unable to process template language expressions in action 'Flat_File_Decoding' inputs at line '1' and column '1902': 'Required property 'content' expects a value but got null. Path ''.'. |
| User action | This error indicates the input message does not contain a body |
|   |   | 

## Learn more
[Learn more about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md)