---
description: "Learn more about: MDN Messages"
title: "MDN Messages | Microsoft Docs"
ms.custom: ""
ms.date: "07/16/2021"
ms.reviewer: ""
ms.suite: ""
ms.topic: "article"
caps.latest.revision: 1
author: "S-Jindal"
ms.author: "shivamjindal"
manager: "ashish.shah"
---
# MDN Messages
Message Disposition Notification (MDN) is the acknowledgment sent in response to an AS2 message. If an MDN is enabled, the AS2 transmission is not complete until the MDN has been received and verified. The Logic App will attempt to return an MDN to indicate the status of message processing, even if an error occurred in processing the AS2 message.
  
The MDN provides verification of the following:  
  
-   **That the original message was successfully received by the receiving party**. The sender of the original message verifies whether the receiving party successfully received the message by comparing the MessageID of the original sent message with the `original-message-id` field that the receiver included in the MDN.  
  
-   **That the integrity of the data exchanged was verified by the receiving partner**. The sender of the original message verifies the integrity by comparing the MIC that was calculated from the original sent message payload, with the MIC that the receiver calculated on the received message payload and included in the Received-content-MIC field of the MDN (if signed).  
  
-   **That there is a non-repudiation of receipt**. The sender does this by verifying the signed MDN with the receiving partner's public key, and by verifying that the returned MIC value in the MDN is the same as the MIC for the original message payload stored in the non-repudiation database.  
  
    > [!NOTE]
    >  A synchronous MDN serves as an HTTP Response, e.g., 200 OK.  
    
  
## Properties Used to Generate the MDN  
 The AS2 receive workflow action will generate an MDN using a party's AS2 agreement properties if the **Use agreement settings for validation and MDN instead of message header** property is selected on the one-way agreement tab in the **Agreement Properties** dialog box. In this instance, the AS2-From property in the message header will be used in generating the MDN, but other properties will be taken from the party's AS2 agreement settings.  
  
 If the option to override AS2 property is not selected, or the party’s AS2 agreement is available, the receive action will generate the MDN using the AS2 header tags in the incoming message.  
  
 An MDN can be signed, but it cannot be encrypted or compressed.  

  
## MDN Headers  
 The MDN contains the following headers:  
  
- **HTTP/AS2 headers**. For more information, see [AS2 Messages](logic-apps-enterprise-integration-as2-message-settings.md).  
  
- **Transfer Layer**. This includes the Content-Type header that includes the signed multipart message, the algorithm for the MIC, the signature formatting protocol, and the outermost multipart boundary subheaders.  
  
- **First Part**. The first part of the multipart signed message is the embedded MDN. It is human readable.  
  
- **Second Part**. The second part of the multipart signed message contains the digital signature, a reference to the original message, the disposition type and status, and the MIC value. It is machine readable.  
  
  The AS2-From header, AS2-To header, and MessageID context property are used to correlate an MDN to the AS2 message that it is responding to. The Original-Message-ID header in an MDN comes from the Message-ID header of the AS2 message that the MDN is responding to.  
  
## MIC  
 The Message Integrity Check (MIC) is used to verify that an MDN correlates to the original sent message payload. The MIC digest is included in the Received-Content-MIC extension field in the second part of the multipart signed MDN message.
  
 The MIC is base64 encoded. It is determined from the **MIC Algorithm** drop-down (enabled if **Send Signed MDN** property is checked) in the **Sender MDN Settings** page of the AS2 receive or send action settings in the **Agreement Properties** dialog box. Users can choose from various hash algorithms for MIC generation. Supported algorithms are:
- SHA1
- MD5
- SHA2-256
- SHA2-384
- SHA2-512

This snapshot depicts how the MDN properties look like in the AS2 Receive Settings dialog box.

![MDN-Acknowledgement-Settings](./media/logic-apps-enterprise-integration-as2-message-settings/MDN-settings.png)
