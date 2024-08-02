---
title: Troubleshooting response codes for SMS
description: include file
services: azure-communication-services
author: slpavkov
manager: aakanmu

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 7/22/2024
ms.topic: include
ms.custom: include file
ms.author: slpavkov
---
## SMS error codes

The SMS SDK uses the following error codes to help you troubleshoot SMS issues. The error codes are exposed through the `DeliveryStatusDetails` field in the SMS delivery report. 

| Code | Message | Advice |
| --- | --- | --- |
| 2000 | Message Delivered Successfully. |  |
| 4000 | Message is rejected due to fraud detection. | Ensure you aren't exceeding the maximum number of messages allowed for your number. |
| 4001 | Message is rejected due to invalid Source/From number format| Ensure the To number is in E.164 format and From number format is in E.164 or Short code format. |
| 4002 | Message is rejected due to invalid Destination/To number format. | Ensure the To number is in E.164 format |
| 4003 | Message failed to deliver due to unsupported destination. | Check if the destination you're trying to send to is supported. |
| 4004 | Message failed to deliver since Destination/To number doesn't exist. | Ensure the To number you're sending to is valid. |
| 4005 | Message blocked by Destination carrier. |  |
| 4006 | The Destination/To number isn't reachable. | Try resending the message at a later time. |
| 4007 | The Destination/To number opted out of receiving messages from you. | Mark the Destination/To number as opted out so that no further message attempts are made to the number. |
| 4008 | You exceeded the maximum number of messages allowed for your profile. | Ensure you aren't exceeding the maximum number of messages allowed for your number or use queues to batch the messages. |
| 4009 | Message rejected by Microsoft Entitlement System. | Most often this happens if fraudulent activity is detected. Contact support for more details. |
| 4010 | Message was blocked due to the toll-free number not being verified. | [Review unverified sending limits](../../sms/sms-faq.md#toll-free-verification) and submit toll-free verification as soon as possible. |
| 5000 | Message failed to deliver. Reach out Microsoft support team for more details. | File a support request through the Azure portal. |
| 5001 | Message failed to deliver due to temporary unavailability of application/system. |  |
| 5002 | Carrier does not support delivery report | Most often this happens if a carrier does not support delivery reports. No action required as message may have been delivered already. |
| 9999 | Message failed to deliver due to unknown error/failure. | Try resending the message. |