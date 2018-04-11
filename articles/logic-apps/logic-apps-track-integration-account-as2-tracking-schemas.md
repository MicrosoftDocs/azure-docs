---
title: AS2 tracking schemas for B2B monitoring - Azure Logic Apps | Microsoft Docs
description: Use AS2 tracking schemas to monitor B2B messages from transactions in your Azure Integration Account.
author: padmavc
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: f169c411-1bd7-4554-80c1-84351247bf94
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/27/2017
ms.author: LADocs; padmavc

ms.custom: H1Hack27Feb2017 

---
# Start or enable tracking of AS2 messages and MDNs to monitor success, errors, and message properties
You can use these AS2 tracking schemas in your Azure integration account to help you monitor business-to-business (B2B) transactions:

* AS2 message tracking schema
* AS2 MDN tracking schema

## AS2 message tracking schema
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

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | AS2 message sender's partner name. (Optional) |
| receiverPartnerName | String | AS2 message receiver's partner name. (Optional) |
| as2To | String | AS2 message receiver’s name, from the headers of the AS2 message. (Mandatory) |
| as2From | String | AS2 message sender’s name, from the headers of the AS2 message. (Mandatory) |
| agreementName | String | Name of the AS2 agreement to which the messages are resolved. (Optional) |
| direction | String | Direction of the message flow, receive or send. (Mandatory) |
| messageId | String | AS2 message ID, from the headers of the AS2 message (Optional) |
| dispositionType |String | Message Disposition Notification (MDN) disposition type value. (Optional) |
| fileName | String | File name, from the header of the AS2 message. (Optional) |
| isMessageFailed |Boolean | Whether the AS2 message failed. (Mandatory) |
| isMessageSigned | Boolean | Whether the AS2 message was signed. (Mandatory) |
| isMessageEncrypted | Boolean | Whether the AS2 message was encrypted. (Mandatory) |
| isMessageCompressed |Boolean | Whether the AS2 message was compressed. (Mandatory) |
| correlationMessageId | String | AS2 message ID, to correlate messages with MDNs. (Optional) |
| incomingHeaders |Dictionary of JToken | Incoming AS2 message header details. (Optional) |
| outgoingHeaders |Dictionary of JToken | Outgoing AS2 message header details. (Optional) |
| isNrrEnabled | Boolean | Use default value if the value is not known. (Mandatory) |
| isMdnExpected | Boolean | Use default value if the value is not known. (Mandatory) |
| mdnType | Enum | Allowed values are **NotConfigured**, **Sync**, and **Async**. (Mandatory) |

## AS2 MDN tracking schema
````java

    {
        "agreementProperties": {
                "senderPartnerName": "",
                "receiverPartnerName": "",
                "as2To": "",
                "as2From": "",
                "agreementName": "g"
            },
            "messageProperties": {
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

| Property | Type | Description |
| --- | --- | --- |
| senderPartnerName | String | AS2 message sender's partner name. (Optional) |
| receiverPartnerName | String | AS2 message receiver's partner name. (Optional) |
| as2To | String | Partner name who receives the AS2 message. (Mandatory) |
| as2From | String | Partner name who sends the AS2 message. (Mandatory) |
| agreementName | String | Name of the AS2 agreement to which the messages are resolved. (Optional) |
| direction |String | Direction of the message flow, receive or send. (Mandatory) |
| messageId | String | AS2 message ID. (Optional) |
| originalMessageId |String | AS2 original message ID. (Optional) |
| dispositionType | String | MDN disposition type value. (Optional) |
| isMessageFailed |Boolean | Whether the AS2 message failed. (Mandatory) |
| isMessageSigned |Boolean | Whether the AS2 message was signed. (Mandatory) |
| isNrrEnabled | Boolean | Use default value if the value is not known. (Mandatory) |
| statusCode | Enum | Allowed values are **Accepted**, **Rejected**, and **AcceptedWithErrors**. (Mandatory) |
| micVerificationStatus | Enum | Allowed values are **NotApplicable**, **Succeeded**, and **Failed**. (Mandatory) |
| correlationMessageId | String | Correlation ID. The original messaged ID (the message ID of the message for which MDN is configured). (Optional) |
| incomingHeaders | Dictionary of JToken | Indicates incoming message header details. (Optional) |
| outgoingHeaders |Dictionary of JToken | Indicates outgoing message header details. (Optional) |

## Next steps
* Learn more about the [Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md).    
* Learn more about [monitoring B2B messages](logic-apps-monitor-b2b-message.md).   
* Learn more about [B2B custom tracking schemas](logic-apps-track-integration-account-custom-tracking-schema.md).   
* Learn more about [X12 tracking schemas](logic-apps-track-integration-account-x12-tracking-schema.md).   
* Learn about [tracking B2B messages in the Operations Management Suite portal](../logic-apps/logic-apps-track-b2b-messages-omsportal.md).
