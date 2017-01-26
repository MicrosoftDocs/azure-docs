---
title: Create an AS2 agreement for the Enterprise Integration Pack | Microsoft Docs
description: Create an AS2 agreement for the Enterprise Integration Pack | Azure Logic Apps
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
To use the enterprise features in Logic Apps, you must first create agreements.

### Before you get started
* Create an [integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md) in your Azure subscription.  
* Define at least two [partners](logic-apps-enterprise-integration-partners.md) in your integration account.  

> [!NOTE]
> When you create an agreement, the content in the agreement file must match the agreement type.    
>
>

After you've [created an integration account](../logic-apps/logic-apps-enterprise-integration-accounts.md) and [added partners](logic-apps-enterprise-integration-partners.md), you can create an agreement by following these steps:  

### Step 1: Begin creating the agreement

1. Sign in to the [Azure portal](http://portal.azure.com "Azure portal").  
2. Select **More services**, enter **integration** in the filter search box, and then select **Integration Accounts** in the results list.

 ![](./media/logic-apps-enterprise-integration-agreements/overview-1.png)    
3. Select the integration account that you want to add the certificate to.

 ![](./media/logic-apps-enterprise-integration-overview/overview-3.png)  
4. Select the **Agreements** tile. If the Agreements tile is not displayed, add it.

 ![](./media/logic-apps-enterprise-integration-agreements/agreement-1.png)   
5. On the **Agreements** blade, select **Add**.

 ![](./media/logic-apps-enterprise-integration-agreements/agreement-2.png)  
6. Enter a name for your agreement, select **AS2** in the **Agreement type** drop-down list, and enter the appropriate information in the **Host Partner**, **Host Identity**, **Guest Partner**, and **Guest Identity** drop-down lists.

 ![](./media/logic-apps-enterprise-integration-agreements/agreement-3.png)  

 The following table describes the terms in the **Add** dialog box:

| Property | Description |
| --- | --- |
| Host Partner | An agreement needs both a host and guest partner. The host partner represents the organization that is configuring the agreement. |
| Host Identity | An identifier for the host partner. |
| Guest Partner | An agreement needs both a host and guest partner. The guest partner represents the organization that is doing business with the host partner. |
| Guest Identity | An identifier for the guest partner. |
| Receive Settings | The properties that apply to all messages that are received by the agreement. |
| Send Settings | The properties that apply to all messages that are sent by the agreement. |

### Step 2: Complete the **Receive Settings** fields

Configure how to handle messages that are received via this agreement. To do so, select **Receive Settings**, and then:   

1. You can optionally override the properties of incoming messages by selecting the **Override message properties** check box.
2. To require all incoming messages to be signed, select the **Message should be signed** check box. If you select this option, also validate the signature on the messages by selecting **guest partner public certificate** in the **Certificate** drop-down list.
3. To require all incoming messages to be encrypted, select the **Message should be encrypted** check box. If you select this option, also decrypt the incoming messages by selecting **host partner private certificate** in the **Certificate** drop-down list.
4. To require messages to be compressed, select the **Message should be compressed** check box.    
5. To send synchronous MDNs for received messages, select the **Send MDN** check box.
6. To send signed MDNs for received messages, select the **Send signed MDN** check box.
7. To send asynchronous MDNs for received messages, select the **Send asynchronous MDN** check box.
8. Click **OK**, and then go to "Step 3: Complete the **Send Settings** fields."

 ![](./media/logic-apps-enterprise-integration-agreements/agreement-4.png)  

The following table describes the **Receive Settings** properties.  

| Property | Description |
| --- | --- |
| Override message properties | Indicates that properties in received messages can be overridden. |
| Message should be signed | Requires messages to be digitally signed. Under **Certificate**, configure the guest partner public certificate for signature verification.  |
| Message should be encrypted | Requires messages to be encrypted. Non-encrypted messages will be rejected. Under **Certificate**, configure the host partner private certificate for decrypting the messages.  |
| Message should be compressed | Requires messages to be compressed. Non-compressed messages will be rejected. |
| MDN Text | Enter the default message disposition notification (MDN) to be sent to the message sender. |
| Send MDN | Requires MDNs to be sent. |
| Send signed MDN | Requires MDNs to be signed. |
| MIC Algorithm | Select the algorithm to use to sign messages. Configures the host partner private certificate message-integrity check (MIC) Algorithm for signing the messages. |
| Send asynchronous MDN | Requires messages to be sent asynchronously. |
| URL | Enter the URL that the MDNs are to be sent to. |

### Step 3: Complete the **Send Settings** fields  

Configure how to handle messages that are sent via this agreement. To do so, select **Send Settings**, and then:  

1. To send signed messages to the partner, select the **Enable message signing** check box. If you select this option, you also need to sign the messages by selecting **host partner private certificate MIC Algorithm** in the **MIC Algorithm** drop-down list and selecting **host partner private certificate** in the **Certificate** drop-down list.
2. To send encrypted messages to the partner, select the **Enable message encryption** check box. If you select this option, encrypt the messages by selecting **guest partner public certificate algorithm** in the **Encryption Algorithm" drop-down list and selecting **guest partner public certificate** in the **Certificate** drop-down list.
3. To compress the message, select the **Enable message compression** check box.
4. To unfold the HTTP content-type header into a single line, select the **Unfold HTTP headers** check box.
5. To receive synchronous MDNs for the sent messages, select the **Request MDN** check box.
6. To receive signed MDNs for the sent messages, select the **Request signed MDN** check box.
7. To receive asynchronous MDNs for the sent messages, select the **Request asynchronous MDN** check box. If you select this option, enter a URL that the MDNs are to be sent to.  
8. To require non-repudiation of receipt, select the **Enable NRR** check box.
9. Click **OK**.

 ![](./media/logic-apps-enterprise-integration-agreements/agreement-5.png)  

The following table describes the **Send Settings** properties.  

| Property | Description |
| --- | --- |
| Enable message signing | Requires all messages that are sent from the agreement to be signed. |
| MIC Algorithm | Select the algorithm to use to sign messages. Configures the host partner private certificate MIC Algorithm for signing the messages. |
| Certificate | Select the certificate to use to sign messages. Configures the host partner private certificate for signing the messages. |
| Enable message encryption | Requires encryption of all messages that are sent from this agreement. Configures the guest partner public certificate algorithm for encrypting the messages. |
| Encryption Algorithm | Select the encryption algorithm to use for message encryption. Configures the guest partner public certificate for encrypting the messages. |
| Certificate | Select the certificate to use to encrypt messages. Configures the guest partner private certificate for encrypting the messages. |
| Enable message compression | Requires compression of all messages that are sent from this agreement. |
| Unfold HTTP headers | Places the HTTP content-type header onto a single line. |
| Request MDN | Requires an MDN for all messages that are sent from this agreement. |
| Request signed MDN | Requires all MDNs that are sent to this agreement to be signed. |
| Request asynchronous MDN | Requires asynchronous MDNs to be sent to this agreement. |
| URL | Enter the URL that the MDNs are to be sent to. |
| Enable NRR | Requires non-repudiation of receipt (NRR), a communication attribute that provides evidence that the data was received as addressed. |

### Step 4: View the agreements list
To view the newly added agreement, select the **Agreements** tile on the **Integration Account** blade.

![](./media/logic-apps-enterprise-integration-agreements/agreement-6.png)

## Next steps
* [Learn more about the Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack").  
