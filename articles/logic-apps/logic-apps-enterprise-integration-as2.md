---
title: Learn to create an AS2 agreement for the Enterprise Integration Pack | Microsoft Docs
description: Learn to create an AS2 agreement for the Enterprise Integration Pack| Azure logic apps
services: logic-apps
documentationcenter: .net,nodejs,java
author: msftman
manager: anneta
editor:

ms.assetid: c9b7e1a9-4791-474c-855f-988bd7bf4b7f
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/29/2016
ms.author: deonhe

---
# Enterprise integration with AS2
## Create an AS2 agreement
To use the enterprise features in Logic apps, you must first create agreements.

### Here's what you need before you get started
* An [integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md) defined in your Azure subscription  
* At least two [partners](logic-apps-enterprise-integration-partners.md) already defined in your integration account  

> [!NOTE]
> When creating an agreement, the content in the agreement file must match the agreement type.    
>
>

After you've [created an integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md) and [added partners](logic-apps-enterprise-integration-partners.md), you can create an agreement by following these steps:  

### From the Azure portal home page
After you log in to the [Azure portal](http://portal.azure.com "Azure portal"):  

1. Select **More services** and enter **integration** in the filter search box. Select **Integration Accounts** from the results list    
![](./media/logic-apps-enterprise-integration-agreements/overview-1.png)    
2. Select the integration account to which you want to add the certificate.
![](./media/logic-apps-enterprise-integration-overview/overview-3.png)  
3. Select the **Agreements** tile. If you don't see the agreements tile, add it first.   
![](./media/logic-apps-enterprise-integration-agreements/agreement-1.png)   
4. Select the **Add** button in the Agreements blade that opens.  
![](./media/logic-apps-enterprise-integration-agreements/agreement-2.png)  
5. Enter a **Name** for your agreement, select **AS2** from the **Agreement Type**, **Host Partner**, **Host Identity**, **Guest Partner**, **Guest Identity** in the Agreements blade.  
![](./media/logic-apps-enterprise-integration-agreements/agreement-3.png)  

Here are a few details you may find useful when configuring the settings for your agreement:

| Property | Description |
| --- | --- |
| Host Partner |An agreement needs both a host and guest partner. The host partner represents the organization that is configuring the agreement. |
| Host Identity |An identifier for the host partner. |
| Guest Partner |An agreement needs both a host and guest partner. The guest partner represents the organization that's doing business with the host partner. |
| Guest Identity |An identifier for the guest partner. |
| Receive Settings |These properties apply to all messages received by an agreement |
| Send Settings |These properties apply to all messages sent by an agreement |

Let's continue:  

1. Select **Receive Settings** to configure how messages received via this agreement are to be handled.  

   * Optionally, you can override the properties in the incoming message. To do this, select the **Override message properties**.
   * Select the **Message should be signed** if you'd like to require all incoming messages to be signed. If you select this option, you need to select the *guest partner public certificate* to validate the signature on the messages.
   * Select the **Message should be encrypted** if you'd like to require all incoming messages to be encrypted.  If you select this option, you need to select the *host partner private certificate* to decrypt the incoming messages.
   * You can also require messages to be compressed. To do this, select the **Message should be compressed**.    
   * Select the **Send MDN** to send sync MDN for the messages received
   * Select the **Send signed MDN** to send signed MDN for the messages received
   * Select the **Send asynchronous MDN** to send async MDN for the messages received     
    ![](./media/logic-apps-enterprise-integration-agreements/agreement-4.png)  

See the table below if you would like to learn more about what the receive settings enable.  

| Property | Description |
| --- | --- |
| Override message properties |Select this to indicate that properties in received messages can be overridden |
| Message should be signed |Enable this to require messages to be digitally signed.  Configure the guest partner public certificate for signature verification  |
| Message should be encrypted |Enable this to require messages to be encrypted. Non-encrypted messages will be rejected. Configure host partner private certificate to decrypt the messages  |
| Message should be compressed |Enable this to require messages to be compressed. Non-compressed messages will be rejected. |
| MDN Text |This is a default MDN to be sent to the message sender |
| Send MDN |Enable this to allow MDNs to be sent. |
| Send signed MDN |Enable this to require MDNs to be signed. |
| MIC Algorithm | |
| Send asynchronous MDN |Enable this to require messages to be sent asynchronously. |
| URL |This is the URL to which the MDNs will be sent. |

Now, let's continue:  

1. Select **Send Settings** to configure how messages sent via this agreement are to be handled.  

   * Select the **Enable message signing** to send signed messages to the partner. If you select this option, you need to select the *host partner private certificate MIC Algorithm* and *host partner private certificate* to sign the messages.
   * Select the **Enable message encryption** to send encrypted messages to the partner. If you select this option, you need to select the *guest partner public certificate algorithm* and *guest partner public certificate* to encrypt the messages.
   * Select the **Message should be compressed** to compress the message
   * Select the **Unfold HTTP headers** to unfold the HTTP content-type header into a single line
   * Select the **Request MDN** to receive sync MDN for the messages sent
   * Select the **Request signed MDN** to receive signed MDN for the messages sent
   * Select the **Request asynchronous MDN** to receive async MDN for the messages sent. If you select this option, you need to provide a URL to which MDNs are sent  
   * Select the **Enable NRR** to enable the non-repudiation of receipt    
   ![](./media/logic-apps-enterprise-integration-agreements/agreement-5.png)  

See the table below if you would like to learn more about what the send settings enable.  

| Property | Description |
| --- | --- |
| Enable message signing |Select this to enable all messages sent from the agreement to be signed. |
| MIC Algorithm |Select the algorithm to use for message signing. Configure the host partner private certificate MIC Algorithm to sign the messages |
| Certificate |Select the certificate to use for message signing. Configure the host partner private certificate to sign the messages |
| Enable message encryption |Select this to encrypt all messages sent from this agreement. Configure the guest partner public certificate algorithm to encrypt the messages |
| Encryption Algorithm |Select the encryption algorithm to use for message encryption. Configure the guest partner public certificate to encrypt the messages |
| Unfold HTTP headers |Select this to unfold the HTTP content-type header into a single line |
| Request MDN |Enable this to request an MDN for all messages sent from this agreement |
| Request signed MDN |Enable to request that all MDNs sent to this agreement are signed |
| Request asynchronous MDN |Enable to request asynchronous MDN to be sent to this agreement |
| URL |The URL to which MDNs will be sent |
| Enable NRR |Select this to enable Non-Repudiation of Receipt |

Select the **Agreements** tile on the Integration Account blade and you will see the newly added agreement listed.  
![](./media/logic-apps-enterprise-integration-agreements/agreement-6.png)

## Next Steps
* [Learn more about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  
