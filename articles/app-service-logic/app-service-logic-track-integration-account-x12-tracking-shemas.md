---
title: x12 tracking schemas | Microsoft Docs
description: Learn more about X12 tracking shema
author: padmavc
manager: erikre
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: a5413f80-eaad-4bcf-b371-2ad0ef629c3d
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/31/2016
ms.author: padmavc

---
# X12 Tracking Schemas
Supported X12 tracking schemas are

* X12 Transaction Set Tracking Schema
* X12 Transaction Set acknowledgement Tracking Schema
* X12 Interchange Tracking Schema
* X12 Interchange acknowledgement Tracking Schema
* X12 Functional Group Tracking Schema
* X12 Functional Group acknowledgement Tracking Schema

## X12 Transaction Set Tracking Schema
````java

    {
            "agreementProperties": {
                "senderPartnerName": "",
                "receiverPartnerName": "",
                "senderQualifier": "",
                "senderIdentifier": "",
                "receiverQualifier": "",
                "receiverIdentifier": "",
                "agreementName": ""
            },
            "messageProperties": {
                "direction": "",
                "interchangeControlNumber": "",
                "functionalGroupControlNumber": "",
                "transactionSetControlNumber": "",
                "CorrelationMessageId": "", 
                "messageType": "",
                "isMessageFailed": "",
                "isTechnicalAcknowledgmentExpected": "",
                "isFunctionalAcknowledgmentExpected": "",
                "needAk2LoopForValidMessages":  "",
                "segmentsCount": ""
            }
    }
````

| Property | Description |
| --- | --- |
| senderPartnerName |Optional, string.  It indicates the X12 message send partner name |
| receiverPartnerName |Optional, string.  It indicates the X12 message receive partner name |
| senderQualifier |Mandatory, string.  It indicates the send partner qualifier |
| senderIdentifier |Mandatory, string.  It indicates the send partner identifier |
| receiverQualifier |Mandatory, string.  It indicates the receive partner qualifier |
| receiverIdentifier |Mandatory, string.  It indicates the receive partner identifier |
| agreementName |Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction |Mandatory, enum.  It indicates the direction of the message flow.  The allowed values are receive or send |
| interchangeControlNumber |Optional, string.  It indicates the interchange control number |
| functionalGroupControlNumber |Optional, string.  It indicates the functional control number |
| transactionSetControlNumber |Optional, string.  It indicates the transaction set control number |
| CorrelationMessageId |Optional, string.  It indicates the correlation message id.  The correlation id is combination of {AgreementName}*{GroupControlNumber}*{TransactionSetControlNumber} |
| messageType |Optional, string. It indicates the transaction set or document type |
| isMessageFailed |Mandatory, boolean.  indicates that whether X12 message either succeeded or failed |
| isTechnicalAcknowledgmentExpected |Mandatory, boolean.  It indicates whether the technical acknowledgement is either configured or not configured in the X12 agreement |
| isFunctionalAcknowledgmentExpected |Mandatory, boolean.  It indicates whether the functional acknowledgement is either configured or not configured in the X12 agreement |
| needAk2LoopForValidMessages |Mandatory, boolean.  - whether the AK2 loop is  required for valid message or not. - type boolean |
| segmentsCount |Optional, int.  It indicates the number of segments in the X12 transaction set |

## X12 Transaction Set Acknowledgement Tracking Schema
````java

    {
            "agreementProperties": {
                "senderPartnerName": "",
                "receiverPartnerName": "",
                "senderQualifier": "",
                "senderIdentifier": "",
                "receiverQualifier": "",
                "receiverIdentifier": "",
                "agreementName": ""
            },
            "messageProperties": {
                "direction": "",
                "interchangeControlNumber": "",
                "functionalGroupControlNumber": "",
                "isaSegment": "",
                "gsSegment": "",
                "respondingfunctionalGroupControlNumber": "",
                "respondingFunctionalGroupId": "",
                "respondingtransactionSetControlNumber": "",
                "respondingTransactionSetId": "",
                "statusCode": "",
                "processingStatus": "",
                "CorrelationMessageId": ""
                "isMessageFailed": "",
                "ak2Segment": "",
                "ak3Segment": "",
                "ak5Segment": ""
            }
    }
````

| Property | Description |
| --- | --- |
| senderPartnerName |Optional, string.  It indicates the X12 message sender's partner name |
| receiverPartnerName |Optional, string.  It indicates the X12 message receiver's partner name |
| senderQualifier |Mandatory, string.  It indicates the send partner qualifier |
| senderIdentifier |Mandatory, string.  It indicates the send partner identifier |
| receiverQualifier |Mandatory, string.  It indicates the receive partner qualifier |
| receiverIdentifier |Mandatory, string.  It indicates the receive partner identifier |
| agreementName |Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction |Mandatory, enum.  It indicates the direction of the message flow.  The allowed values are receive or send |
| interchangeControlNumber |Optional, string.  It indicates the interchange control number of the functional acknowledgement. The value populates only for send side where functional acknowledgement received for the messages sent to partner |
| functionalGroupControlNumber |Optional, string.  It indicates the functional group control number of the functional acknowledgement. The value populates only for send side where functional acknowledgement received for the messages sent to partner |
| isaSegment |Optional, string.  It indicates the ISA segment of the message. The value populates only for send side where functional acknowledgement received for the messages sent to partner |
| gsSegment |Optional, string.  It indicates the GS segment of the message. The value populates only for send side where functional acknowledgement received for the messages sent to partner |
| respondingfunctionalGroupControlNumber |Optional, string.  It indicates the responding interchange control number |
| respondingFunctionalGroupId |Optional, string. It indicates the responding functional group id, that maps to AK101 in the acknowledgement |
| respondingtransactionSetControlNumber |Optional, string.  It indicates the responding transaction set control number |
| respondingTransactionSetId |Optional, string.  It indicates the responding transaction set id, that maps to AK201 in the acknowledgement |
| statusCode |Mandatory, boolean.  It indicates the transaction set acknowledgement status code |
| segmentsCount |Mandatory, enum.  It indicates the acknowledgement status code.  The allowed values are Accepted or Rejected or AccpetedWithErrros |
| processingStatus |Mandatory, enum.  It indicates the processing status of the acknowledgement.  The allowed values are Received or Generated or Sent |
| CorrelationMessageId |Optional, string.  It indicates the correlation message id.  The correlation id is combination of {AgreementName}*{GroupControlNumber}*{TransactionSetControlNumber} |
| isMessageFailed |Mandatory, boolean.  indicates that whether X12 message either succeeded or failed |
| ak2Segment |Optional, string. It indicates the ak2 segment. The ak2 segment indicates an acknowledgement for a transaction set within the received functional group |
| ak3Segment |Optional, string. It indicates the ak3 segment.  The ak3 segment reports errors in a data segment |
| ak5Segment |Optional, string. It indicates the ak5 segment.  The ak5 segment reports whether the transaction set identified in the AK2 segment is accepted or rejected and why |

## X12 Interchange Tracking Schema
````java

    {
            "agreementProperties": {
                "senderPartnerName": "",
                "receiverPartnerName": "",
                "senderQualifier": "",
                "senderIdentifier": "",
                "receiverQualifier": "",
                "receiverIdentifier": "",
                "agreementName": ""
            },
            "messageProperties": {
                "direction": "",
                "interchangeControlNumber": "",
                "isaSegment": "",
                "isTechnicalAcknowledgmentExpected": "",
                "isMessageFailed": "",
                "isa09": "",
                "isa10": "",
                "isa11": "",
                "isa12": "",
                "isa14": "",
                "isa15": "",
                "isa16": ""
            }
    }
````

| Property | Description |
| --- | --- |
| senderPartnerName |Optional, string.  It indicates the X12 message sender's partner name |
| receiverPartnerName |Optional, string.  It indicates the X12 message receiver's partner name |
| senderQualifier |Mandatory, string.  It indicates the send partner qualifier |
| senderIdentifier |Mandatory, string.  It indicates the send partner identifier |
| receiverQualifier |Mandatory, string.  It indicates the receive partner qualifier |
| receiverIdentifier |Mandatory, string.  It indicates the receive partner identifier |
| agreementName |Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction |Mandatory, enum.  It indicates the direction of the message flow.  The allowed values are receive or send |
| interchangeControlNumber |Optional, string.  It indicates the interchange control number |
| isaSegment |Optional, string.  It indicates the message ISA segment |
| isTechnicalAcknowledgmentExpected |Mandatory, boolean.  It indicates whether the technical acknowledgement is either configured or not configured in the X12 agreement |
| isMessageFailed |Mandatory, boolean.  indicates that whether X12 message either succeeded or failed |
| isa09 |Optional, string.  It indicates X12 document interchange Date |
| isa10 |Optional, string. It indicates X12 document interchange Time |
| isa11 |Optional, string. It indicates X12 interchange Control Standards identifier |
| isa12 |Optional, string.  It indicates X12 interchange Control Version Number |
| isa14 |Optional, string.  It indicates X12 acknowledgement is requested |
| isa15 |Optional, string.  It indicates indicator for test or production |
| isa16 |Optional, string. It indicates the element separator |

## X12 Interchange Acknowledgement Tracking Schema
````java
    {
            "agreementProperties": {
                "senderPartnerName": "",
                "receiverPartnerName": "",
                "senderQualifier": "",
                "senderIdentifier": "",
                "receiverQualifier": "",
                "receiverIdentifier": "",
                "agreementName": ""
            },
            "messageProperties": {
                "direction": "",
                "interchangeControlNumber": "",
                "isaSegment": "",
                "respondingInterchangeControlNumber": "",
                "isMessageFailed": "",
                "statusCode": "",
                "processingStatus": "",
                "ta102": "",
                "ta103": "",
                "ta105": ""
            }
    }
````

| Property | Description |
| --- | --- |
| senderPartnerName |Optional, string.  It indicates the X12 message sender's partner name |
| receiverPartnerName |Optional, string.  It indicates the X12 message receiver's partner name |
| senderQualifier |Mandatory, string.  It indicates the send partner qualifier |
| senderIdentifier |Mandatory, string.  It indicates the send partner identifier |
| receiverQualifier |Mandatory, string.  It indicates the receive partner qualifier |
| receiverIdentifier |Mandatory, string.  It indicates the receive partner identifier |
| agreementName |Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction |Mandatory, enum.  It indicates the direction of the message flow.  The allowed values are receive or send |
| interchangeControlNumber |Optional, string.  It indicates the interchange control number of the Technical Acknowledgement.  This is populated for technical acknowledgement received from partners |
| isaSegment |Optional, string.  It indicates the ISA segment for the Technical Acknowledgement.  This is populated for technical acknowledgement received from partners |
| respondingInterchangeControlNumber |Optional, string.  It indicates the interchange control number for the Technical Acknowledgement.  This is populated for technical acknowledgement received from partners |
| isMessageFailed |Mandatory, boolean.  indicates whether X12 message either succeeded or failed |
| statusCode |Mandatory, enum.  It indicates the interchange acknowledgement status code.  The allowed values are Accepted/Rejected/AccpetedWithErrros |
| processingStatus |Mandatory, enum.  It indicates the acknowledgement status.  The allowed values are Received/Generated/Sent |
| ta102 |Optional, string. It indicates the interchange date |
| ta103 |Optional, string. It indicates the interchange time |
| ta105 |Optional, string. It indicates the interchange note code |

## X12 Functional Group Tracking Schema
````java

    {
            "agreementProperties": {
                "senderPartnerName": "",
                "receiverPartnerName": "",
                "senderQualifier": "",
                "senderIdentifier": "",
                "receiverQualifier": "",
                "receiverIdentifier": "",
                "agreementName": ""
            },
            "messageProperties": {
                "direction": "",
                "interchangeControlNumber": "",
                "functionalGroupControlNumber": "",
                "gsSegment": "",
                "isTechnicalAcknowledgmentExpected": "",
                "isFunctionalAcknowledgmentExpected": "",
                "isMessageFailed": "",
                "gs01": "",
                "gs02": "",
                "gs03": "",
                "gs04": "",
                "gs05": "",
                "gs07": "",
                "gs08": ""
            }
    }
````

| Property | Description |
| --- | --- |
| senderPartnerName |Optional, string.  It indicates the X12 message sender's partner name |
| receiverPartnerName |Optional, string.  It indicates the X12 message receiver's partner name |
| senderQualifier |Mandatory, string.  It indicates the send partner qualifier |
| senderIdentifier |Mandatory, string.  It indicates the send partner identifier |
| receiverQualifier |Mandatory, string.  It indicates the receive partner qualifier |
| receiverIdentifier |Mandatory, string.  It indicates the receive partner identifier |
| agreementName |Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction |Mandatory, enum.  It indicates the direction of the message flow.  The allowed values are receive or send |
| interchangeControlNumber |Optional, string. It indicates the interchange control number |
| functionalGroupControlNumber |Optional - Functional control number - type string |
| gsSegment |Optional, string.  It indicates the message GS segment |
| isTechnicalAcknowledgmentExpected |Mandatory, boolean.  It indicates whether the technical acknowledgement is either configured or not configured in the X12 agreement |
| isFunctionalAcknowledgmentExpected |Mandatory, boolean.  It indicates whether the functional acknowledgement is either configured or not configured in the X12 agreement |
| isMessageFailed |Mandatory, boolean.  indicates that whether X12 message either succeeded or failed |
| gs01 |Optional, string. It indicates the functional identifier code |
| gs02 |Optional, string. It indicates the application sender's code |
| gs03 |Optional, string. It indicates application receiver's code |
| gs04 |Optional, string. It indicates the functional group date |
| gs05 |Optional, string. It indicates the functional group time |
| gs07 |Optional, string. It indicates the responsible agency code |
| gs08 |Optional, string. It indicates the version/release/industry identifier code - type string |

## X12 Functional Group Acknowledgement Tracking Schema
````java
    {
            "agreementProperties": {
                "senderPartnerName": "",
                "receiverPartnerName": "",
                "senderQualifier": "",
                "senderIdentifier": "",
                "receiverQualifier": "",
                "receiverIdentifier": "",
                "agreementName": ""
            },
            "messageProperties": {
                "direction": "",
                "interchangeControlNumber": "",
                "functionalGroupControlNumber": "",
                "isaSegment": "",
                "gsSegment": "",
                "respondingfunctionalGroupControlNumber": "",
                "respondingFunctionalGroupId": "",
                "isMessageFailed": "",
                "statusCode": "",
                "processingStatus": "",
                "ak903": "",
                "ak904": "",
                "ak9Segment": ""
            }
    }
````

| Property | Description |
| --- | --- |
| senderPartnerName |Optional, string.  It indicates the X12 message sender's partner name |
| receiverPartnerName |Optional, string.  It indicates the X12 message receiver's partner name |
| senderQualifier |Mandatory, string.  It indicates the send partner qualifier |
| senderIdentifier |Mandatory, string.  It indicates the send partner identifier |
| receiverQualifier |Mandatory, string.  It indicates the receive partner qualifier |
| receiverIdentifier |Mandatory, string.  It indicates the receive partner identifier |
| agreementName |Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction |Mandatory, enum.  It indicates the direction of the message flow.  The allowed values are receive or send |
| interchangeControlNumber |Optional, string. It indicates the interchange control number. The value populates for send side when a technical acknowledgement received from partners |
| functionalGroupControlNumber |Optional, string. It indicates the functional group control number of the technical acknowledgement. The value populates for send side when a technical acknowledgement received from partners |
| isaSegment |Optional - Same as above interchange control number gets populated only in specific cases. - type string |
| gsSegment |Optional - Same as above functional group control number gets populated only in specific cases. - type string |
| respondingfunctionalGroupControlNumber |Optional - control number of the original functional group - type string |
| respondingFunctionalGroupId |Optional - Maps to AK101 in the ack - functional group Id - type string |
| isMessageFailed |Mandatory, boolean.  indicates that whether X12 message either succeeded or failed |
| statusCode |Mandatory, enum.  It indicates the acknowledgement status code. The allowed values are Accepted/Rejected/AccpetedWithErrros |
| processingStatus |Mandatory, enum.  It indicates the processing status of the acknowledgement. The allowed Values are Received/Generated/Sent |
| ak903 |Optional, string. It indicates the number of the transaction sets received |
| ak904 |Optional, string. It indicates the number of transaction sets accepted in the identified functional group |
| ak9Segment |Optional, string.  Ak9 segment indicates whether the functional group identified in the AK1 segment is accepted or rejected and why |

## Next steps
[Learn more about monitoring B2B messages](app-service-logic-monitor-b2b-message.md "Learn more about tracking B2B messages")   
[Tracking B2B messages in OMS Portal](app-service-logic-track-b2b-messages-omsportal.md "Tracking B2B messages")   
[Learn more about Custom Tracking Schema](app-service-logic-track-integration-account-custom-tracking-shema.md "Learn about Custom Schema")   
[Learn more about AS2 Tracking Schema](app-service-logic-track-integration-account-as2-tracking-shemas.md "Learn about AS2 Schema")   
[Learn more about the Enterprise Integration Pack](app-service-logic-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  

