---
title: AS2 MDN acknowledgements
description: Learn about Message Disposition Notification (MDN) acknowledgments for AS2 messages in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: S-Jindal
ms.author: shivamjindal
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 08/04/2021
---

# MDN acknowledgments for AS2 messages in Azure Logic Apps

In Azure Logic Apps, you can create workflows that handle AS2 messages for Electronic Data Interchange (EDI) communication when you use **AS2** operations. In EDI messaging, acknowledgments provide the status from processing an EDI interchange. When receiving an interchange, the [**AS2 Decode** action](logic-apps-enterprise-integration-as2.md#decode) can return a message disposition notification (MDN) or acknowledgment to the sender. An MSDN verifies the following items:

* The receiving partner successfully received the original message.

  The sending partner compares the `MessageID` for the originally sent message with the `original-message-id` field that the receiver includes in the MDN.

* The receiving partner verified the integrity of the exchanged data.

  The sending partner compares the message integrity check (MIC), which is calculated from the payload in the originally sent message, with the MIC that the receiver calculated from the payload in the received message and included in the `Received-content-MIC` field in the MDN, if signed.

  > [!NOTE]
  > An MDN can be signed, but not encrypted or compressed.

* Non-repudiation of receipt

  The sending partner compares the signed MDN with the receiving partner's public key and verifies that the returned MIC value in the MDN is the same as the MIC for the original message payload stored in the non-repudiation database.

> [!NOTE]
> If you enable sending an MDN in response, your logic app attempts to return an MDN to report the status of AS2 message processing, 
> even if an error occurs during processing. The AS2 transmission isn't complete until the sender receives and verifies the MDN.
> A synchronous MDN serves as an HTTP response, for example, a `200 OK` status.

This topic provides a brief overview about the AS2 MDN ACK, including the properties used to generate the acknowledgment, the MDN headers to use, and the MIC. For other related information, review the following documentation:

* [Exchange AS2 messages for B2B enterprise integration in Azure Logic Apps](logic-apps-enterprise-integration-as2.md)
* [AS2 message settings](logic-apps-enterprise-integration-as2-message-settings.md)
* [What is Azure Logic Apps](logic-apps-overview.md)

## Properties to generate an MDN

The AS2 Decode action generates an MDN using a trading partner's AS2 agreement properties if the **Use agreement settings for validation and MDN instead of message header** property is selected on the one-way agreement tab in the **Agreement Properties** dialog box. In this instance, the AS2-From property in the message header will be used in generating the MDN, but other properties will be taken from the party's AS2 agreement settings.

If the option to override AS2 property is not selected, or the party’s AS2 agreement is available, the receive action will generate the MDN using the AS2 header tags in the incoming message.  

## MDN Headers

An MDN contains the following headers:

| Headers | Description |
|---------|-------------|
| HTTP/AS2 | For more information, review [AS2 message settings](logic-apps-enterprise-integration-as2-message-settings.md).
| Transfer layer | This header includes the `Content-Type` header that includes the signed multipart message, the algorithm for the MIC, the signature formatting protocol, and the outermost multipart boundary sub-headers. |
| First part | The first part of the multipart signed message is the embedded MDN. This part is human readable. |
| Second part | The second part of the multipart signed message contains the digital signature, a reference to the original message, the disposition type and status, and the MIC value. This part is machine readable. |
|||


The `AS2-From` header, `AS2-To` header, and MessageID context property are used to correlate an MDN to the AS2 message that it is responding to. The `Original-Message-ID` header in an MDN comes from the Message-ID header of the AS2 message that the MDN is responding to.

## MIC

The Message Integrity Check (MIC), or MIC digest, verifies that an MDN correlates to the payload in the originally sent message. This MIC digest is included in the second part of the multipart signed MDN message in the `Received-Content-MIC` extension field.

The MIC is base64 encoded. It is determined from the **MIC Algorithm** drop-down (enabled if **Send Signed MDN** property is checked) in the **Sender MDN Settings** page of the AS2 receive or send action settings in the **Agreement Properties** dialog box. Users can choose from various hash algorithms for MIC generation. Supported algorithms are:

- SHA1
- MD5
- SHA2-256
- SHA2-384
- SHA2-512

For example, this This snapshot depicts how the MDN properties look like in the AS2 Receive Settings dialog box.

![MDN-Acknowledgement-Settings](./media/logic-apps-enterprise-integration-as2-message-settings/MDN-settings.png)
