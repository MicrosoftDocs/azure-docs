<properties 
	pageTitle="x12 tracking schemas | Microsoft Azure" 
	description="How to X12 messages" 
	authors="padmavc" 
	manager="erikre" 
	editor="" 
	services="logic-apps" 
	documentationCenter=""/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/21/2016"
	ms.author="padmavc"/>

# X12 Tracking Schemas

Following are the supported X12 tracking schemas

* X12 Transaction Set Tracking Schema
* X12 Transaction Set acknowledgement Tracking Schema
* X12 Interchange Tracking Schema
* X12 Interchange acknowledgement Tracking Schema
* X12 Functional Group Tracking Schema
* X12 Functional Group acknowledgement Tracking Schema

## X12 Transaction Set Tracking Schema
````java script

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
            "transactionSetProperties": {
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
| -------- | ------- |
| senderPartnerName | Optional, string.  It contains the X12 message send partner name  |
| receiverPartnerName | Optional, string.  It contains the X12 message receive partner name |
| senderQualifier | Mandatory, string.  It contains the send partner qualifier |
| senderIdentifier | Mandatory, string.  It contains the send partner identifier |
| receiverQualifier | Mandatory, string.  It contains the receive partner qualifier |
| receiverIdentifier | Mandatory, string.  It contains the receive partner identifier |
| agreementName | Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction | Required, string.  It indicates the direction of the message flow, either receive or send |
| interchangeControlNumber | Optional, string.  It contains the interchange control number |
| functionalGroupControlNumber | Optional, string.  It contains the functional control number |
| transactionSetControlNumber | Optional, string.  It contains the transaction set control number |
| CorrelationMessageId | Optional, string.  It contains the correlation message id.  The correlation id is combination of {AgreementName}_{GroupControlNumber}_{TransactionSetControlNumber} |
| messageType | Optional, string. It contains the transaction set or document type |
| isMessageFailed | Mandatory, boolean.  Indicates that whether X12 message either succeeded or failed |
| isTechnicalAcknowledgmentExpected | Mandatory, boolean.  It indicates whether the technical acknowledgement is either configured or not configured in the X12 agreement |
| isFunctionalAcknowledgmentExpected |  Mandatory, boolean.  It indicates whether the functional acknowledgement is either configured or not configured in the X12 agreement |
| needAk2LoopForValidMessages | Mandatory, boolean.  - whether the AK2 loop is requird for valid message or not. - type boolean |
| segmentsCount | Optional, int.  It indicates the number of segments in the X12 transaction set |
|


## X12 Transaction Set Acknowledgement Tracking Schema
````java script

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
            "transactionSetAcknowledgmentProperties": {
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


`````   


| Property | Description |
| -------- | ------- |
| senderPartnerName | Optional, string.  It contains the X12 message sender's partner name |
| receiverPartnerName | Optional, string.  It contains the X12 message receiver's partner name |
| senderQualifier | Mandatory, string.  It contains the send partner qualifier |
| senderIdentifier | Mandatory, string.  It contains the send partner identifier |
| receiverQualifier | Mandatory, string.  It contains the receive partner qualifier |
| receiverIdentifier | Mandatory, string.  It contains the receive partner identifier |
| agreementName | Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction | Required, string.  It indicates the direction of the message flow, either receive or send |
| interchangeControlNumber | Optional, string.  It contains the interchange control number of the functional acknowledgement. The value populates only for send side where functional acknowledgement received for the messages sent to partner |
| functionalGroupControlNumber | Optional, string.  It contains the functional group control number of the functional acknowledgement. The value populates only for send side where functional acknowledgement received for the messages sent to partner |
| isaSegment | Optional, string.  It contains the ISA segment of the message. The value populates only for send side where functional acknowledgement received for the messages sent to partner |
| gsSegment | Optional, string.  It contains the GS segment of the message. The value populates only for send side where functional acknowledgement received for the messages sent to partner |
| respondingfunctionalGroupControlNumber | Optional, string.  It contains the responding interchange control number |
| respondingFunctionalGroupId | Optional, string. It contains the responding functional group id, that maps to AK101 in the acknowledgement |
| respondingtransactionSetControlNumber | Optional, string.  It contains the responding transaction set control number |
| respondingTransactionSetId | Optional, string.  It contains the responding transaction set id, that maps to AK201 in the acknowledgement |
| statusCode | Mandatory, boolean.  It contains the transaction set acknowledgement status code |
| segmentsCount | Mandatory, string.  It contains the acknowledgement status code.  The allowed values are Accepted or Rejected or AccpetedWithErrros |
| processingStatus | Mandatory, string.  It contains the processing status of the acknowledgement.  The allowed values are Received or Generated or Sent |
| CorrelationMessageId | Optional, string.  It contains the correlation message id.  The correlation id is combination of {AgreementName}_{GroupControlNumber}_{TransactionSetControlNumber} |
| isMessageFailed | Mandatory, boolean.  Indicates that whether X12 message either succeeded or failed |
| ak2Segment | Optional, string. It contains the ak2 segment. The ak2 segment contains an acknowledgement for a transaction set within the received functional group |
| ak3Segment | Optional, string. It contains the ak3 segment.  The ak3 segment reports errors in a data segment |
| ak5Segment | Optional, string. It contains the ak5 segment.  The ak5 segment reports whether the transaction set identified in the AK2 segment is accepted or rejected and why  |
|

## X12 Interchange Tracking Schema
````java script

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
            "interchangeProperties": {
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
| -------- | ------- |
| senderPartnerName | Optional, string.  It contains the X12 message sender's partner name | 
| receiverPartnerName | Optional, string.  It contains the X12 message receiver's partner name | 
| senderQualifier | Mandatory, string.  It contains the send partner qualifier |
| senderIdentifier | Mandatory, string.  It contains the send partner identifier |
| receiverQualifier | Mandatory, string.  It contains the receive partner qualifier |
| receiverIdentifier | Mandatory, string.  It contains the receive partner identifier |
| agreementName | Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction | Required, string.  It indicates the direction of the message flow, either receive or send |
| interchangeControlNumber | Optional, string.  It contarins the interchange control number |
| isaSegment | Optional, string.  It contains the message ISA segment |
| isTechnicalAcknowledgmentExpected | Mandatory, boolean.  It indicates whether the technical acknowledgement is either configured or not configured in the X12 agreement |
| isMessageFailed | Mandatory, boolean.  Indicates that whether X12 message either succeeded or failed |
| isa09 | Optional, string.  It contains X12 docuemnt interchange Date |
| isa10 | Optional, string. It contains X12 docuemnt interchange Time |
| isa11 | Optional, string. It contains X12 interchange Control Standards identifier |
| isa12 | Optional, string.  It contains X12 interchange Control Version Number |
| isa14 | Optional, string.  It contains X12 acknowledgement is requested  |
| isa15 | Optional, string.  It contains indicator for test or production |
| isa16 | Optional, string. It contains the element seprator |
|


## X12 Interchange Acknowledgement Tracking Schema
````java script

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
            "technicalAcknowledgmentProperties": {
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
| -------- | ------- |
| senderPartnerName |Optional, string.  It contains the X12 message sender's partner name  | 
| receiverPartnerName | Optional, string.  It contains the X12 message receiver's partner name | 
| senderQualifier | Mandatory, string.  It contains the send partner qualifier |
| senderIdentifier | Mandatory, string.  It contains the send partner identifier |
| receiverQualifier | Mandatory, string.  It contains the receive partner qualifier |
| receiverIdentifier | Mandatory, string.  It contains the receive partner identifier |
| agreementName | Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction | Required, string.  It indicates the direction of the message flow, either receive or send |
| interchangeControlNumber | Optional, string.  It contains the interchange control number of the Technical Acknowledgement.  This is populated for technical acknowledgement received from partners | 
| isaSegment | Optional, string.  It contains the ISA segment for the Technical Acknowledgement.  This is populated for technical acknowledgement received from partners | 
| respondingInterchangeControlNumber | Optional, string.  It contains the interchange control number for the Technical Acknowledgement.  This is populated for technical acknowledgement received from partners | 
| isMessageFailed | Mandatory, boolean.  Indicates that whether X12 message either succeeded or failed | 
| statusCode | Mandatory, string.  It contains the interchange acknowledgement status code.  The allowed values are Accepted/Rejected/AccpetedWithErrros | 
| processingStatus | Mandatory, string.  It contains the acknowledgement status.  The allowed values are Received/Generated/Sent | 
| ta102 | Optional, string. It contains interchange date | 
| ta103 | Optional, string. It contains interchange time | 
| ta105 | Optional, string. It contains interchange note code |
|


## X12 Functional Group Tracking Schema
````java script

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
            "functionalGroupProperties": {
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
| -------- | ------- |
| senderPartnerName | Optional, string.  It contains the X12 message sender's partner name | 
| receiverPartnerName | Optional, string.  It contains the X12 message receiver's partner name | 
| senderQualifier | Mandatory, string.  It contains the send partner qualifier |
| senderIdentifier | Mandatory, string.  It contains the send partner identifier |
| receiverQualifier | Mandatory, string.  It contains the receive partner qualifier |
| receiverIdentifier | Mandatory, string.  It contains the receive partner identifier |
| agreementName | Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction | Required, string.  It indicates the direction of the message flow, either receive or send |
| interchangeControlNumber | Optional, string. It contains the interchange control number |
| functionalGroupControlNumber | Optional - Functional control number - type string |
| gsSegment | Optional, string.  It contains the message GS segment |
| isTechnicalAcknowledgmentExpected | Mandatory, boolean.  It indicates whether the technical acknowledgement is either configured or not configured in the X12 agreement |
| isFunctionalAcknowledgmentExpected | Mandatory, boolean.  It indicates whether the functional acknowledgement is either configured or not configured in the X12 agreement |
| isMessageFailed | Mandatory, boolean.  Indicates that whether X12 message either succeeded or failed |
| gs01 | Optional, string. It contains the functional identifier code |
| gs02 | Optional, string. It contains the application sender's code |
| gs03 | Optional, string. It contains application receiver's code |
| gs04 | Optional, string. It contains the functional group date |
| gs05 | Optional, string. It contains the functional group time |
| gs07 | Optional, string. It containst the responsible agency code |
| gs08 | Optional, stirng. It contains the version/release/industry identifier code - type string |
|


## X12 Functional Group Acknowledgement Tracking Schema
````java script 

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
            "functionalGroupAcknowledgmentProperties": {
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
| -------- | ------- |
| senderPartnerName | Optional, string.  It contains the X12 message sender's partner name | 
| receiverPartnerName | Optional, string.  It contains the X12 message receiver's partner name | 
| senderQualifier | Mandatory, string.  It contains the send partner qualifier |
| senderIdentifier | Mandatory, string.  It contains the send partner identifier |
| receiverQualifier | Mandatory, string.  It contains the receive partner qualifier |
| receiverIdentifier | Mandatory, string.  It contains the receive partner identifier |
| agreementName | Optional, string.  Name of the X12 agreement to which the messages are resolved |
| direction | Required, string.  It indicates the direction of the message flow, either receive or send |
| interchangeControlNumber | Optional, string. It contains the interchange control number. The value populates for send side when a technical acknowledgement received from partners |
| functionalGroupControlNumber | Optional, string. It contains the functional group control number of the technical acknowledgement. The value populates for send side when a technical acknowledgement received from partners |
| isaSegment | Optional - Same as above interchange control number gets populated only in specific cases. - type string |
| gsSegment | Optional - Same as above functional group control number gets populated only in specific cases. - type string |
| respondingfunctionalGroupControlNumber | Optional - control number of the original functional group - type string |
| respondingFunctionalGroupId | Optional - Maps to AK101 in the ack - functional group Id - type string |
| isMessageFailed | Mandatory, boolean.  Indicates that whether X12 message either succeeded or failed |
| statusCode | Mandatory, string.  It contains the acknowledgement status code. The allowed values are Accepted/Rejected/AccpetedWithErrros |
| processingStatus | Mandatory, string.  It contains the processing status of the acknowledgement. The allowed Values are Received/Generated/Sent |
| ak903 | Optional, string. It contains the number of the transaction sets received |
| ak904 | Optional, string. It contains the number of transaction sets accepted in the identified functional group |
| ak9Segment | Optional, string.  Ak9 segment indicates whether the functional group identified in the AK1 segment is accepted or rejected and why |
|



## Next steps

[Learn more about tracking B2B messages](./media/app-service-logic-track-b2b-message.md "Learn more about tracking B2B messages")   
[Learn more about Custom Tracking Schema](./media/app-service-logic-track-integration-account-custom-tracking-shema.md "Learn about Custom Schema")   
[Learn more about AS2 Tracking Schema](./media/app-service-logic-track-integration-account-as2-tracking-shemas.md "Learn about AS2 Schema")   
[Learn more about the Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  