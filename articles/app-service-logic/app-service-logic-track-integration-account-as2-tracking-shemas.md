<properties 
	pageTitle="as2 tracking schema | Microsoft Azure" 
	description="How to track AS2 messages" 
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

# AS2 Tracking Schemas

Following are the supported AS2 tracking schemas

* AS2 Message Tracking Schema
* AS2 MDN Tracking Schema

## AS2 Message Tracking Schema
````java

    {
       "agreementProperties": {  
            "senderPartnerName": "",  
            "receiverPartnerName": "",  
            "as2To": "",  
            "as2From": "",  
            "agreementName": ""  
        },  
        "messageProperties": {
            "direction": "",
            "messageId": "",
            "dispositionType": "",
            "fileName": "",
            "isMessageFailed": "",
            "isMessageSigned": "",
            "isMessageEncrypted": "",
            "isMessageCompressed": "",
            "correlationMessageId": "",
            "incomingHeaders": {
            },
            "outgoingHeaders": {
            },
        "isNrrEnabled": "",
        "isMdnExpected": "",
        "mdnType": ""
        }
    }
````

| Property | Description |
| -------- | ------- |
| senderPartnerName | Optional, string.  It indicates the AS2 message sender's partner name |
| receiverPartnerName | Optional, string.  It indicates the AS2 message receiver's partner name |
| as2To | Required, string.  It indicates the AS2 message receiver’s name that is included in the headers of the AS2 message |
| as2From | Required, string. It indicates the AS2 message sender’s name that is included in the headers of the AS2 message |
| agreementName | Optional, string.  Name of the AS2 agreement to which the messages are resolved |
| direction | Required, string.  It indicates the direction of the message flow, either receive or send |
| messageId | Optional, string.  It indicates the AS2 Message ID that is included in the headers of the AS2 message |
| dispositionType | Optional, string. It indicates the MDN disposition type value |
| fileName | Optional, string.  It indicates the file name that is included in the header of the AS2 message |
| isMessageFailed | Mandatory, boolean.  indicates that whether AS2 message was failed or not |
| isMessageSigned | Mandatory, boolean.  indicates that whether AS2 message was signed or not |
| isMessageEncrypted | Mandatory, boolean.  indicates that whether AS2 message was encrypted or not |
| isMessageCompressed | Mandatory, boolean. indicates that whether AS2 message was compressed or not |
| correlationMessageId | Optional, string. It indicates AS2messageid to correlate messages with MDNs |
| incomingHeaders | Optional, dictinaryy of Jtoken.  It indicates incoming AS2 message header details |
| outgoingHeaders | Optional, dictionary of Jtoken.  It indicates outgoing AS2 message header details |
| isNrrEnabled | Mandatory, boolean.  Use default value if the value is not known |
| isMdnExpected | Mandatory, boolean. Use default value if the value is not known |
| mdnType | Mandatory, string. The allowed values are NotConfigured or Sync or Async |


## AS2 MDN Tracking Schema

````java

    {
        "agreementProperties": {
                "senderPartnerName": "",
                "receiverPartnerName": "",
                "as2To": "",
                "as2From": "",
                "agreementName": "g"
            },
            "mdnProperties": {
                "direction": "",
                "messageId": "",
                "originalMessageId": "",
                "dispositionType": "",
                "isMessageFailed": "",
                "isMessageSigned": "",
                "isNrrEnabled": "",
                "statusCode": "",
                "micVerificationStatus": "",
                "correlationMessageId": "",
                "incomingHeaders": { 
                },
                "outgoingHeaders": { 
                }
            }
    }
````

| Property | Description |
| -------- | ------- |
| senderPartnerName | Optional, string. It indicates the AS2 message sender's partner name |
| receiverPartnerName | Optional, string. It indicates the AS2 message receiver's partner name |
| as2To | Required, string. It indicates the partner name who receives that AS2 message  |
| as2From | Required, string. It indicates the partner name who sends that AS2 message |
| agreementName | Optional, string. Name of the AS2 agreement to which the messages are resolved |
| direction | Required, string. It indicates the direction of the message flow, either receive or send |
| messageId | Optional, string. It indicates the AS2 message id |
| originalMessageId | Optional, string. It indicates the AS2 original message id |
| dispositionType | Optional, string. It indicates the MDN disposition type value |
| isMessageFailed | Mandatory, boolean.  indicates that whether AS2 message was failed or not  |
| isMessageSigned | Mandatory, boolean.  Indicates that whether AS2 message was signed or not |
| isNrrEnabled | Mandatory - type boolean - default value if not known |
| statusCode | Requires - Allowed values - Accepted/Rejected/AcceptedWithErrros |
| micVerificationStatus | Mandatory - Allowed values - NotApplicable/Succeeded/Failed |
| correlationMessageId | Optional, string.  It indicates the correlation id.  The correlation id is the original messaged Id (messages id of the message for which MDN is configured) |
| incomingHeaders | Optional - Dictionary of JTokens |
| outgoingHeaders | Optional - Dictionary of JTokens |



## Next steps

[Learn more about the Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")    
[Learn more about tracking B2B messages](./media/app-service-logic-track-b2b-message.md "Learn more about tracking B2B messages")   
[Learn more about B2B Custom Tracking Schema](./media/app-service-logic-track-integration-account-custom-tracking-shema.md "Learn about Custom Schema")   
[Learn more about X12 Tracking Schema](./media/app-service-logic-track-integration-account-x12-tracking-schemas.md "Learn about X12 Tracking Schema")   
[Learn more about the Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  

