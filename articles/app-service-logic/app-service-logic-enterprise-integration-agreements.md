<properties 
	pageTitle="Overview of Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Use the features of Enterprise Integration Pack to enable business process and integration scenarios using Microsoft Azure App service" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erickre" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="deonhe"/>


# Enterprise integration agreements

## Overview
Agreements are the cornerstone of business-to-business (B2B) communications, allowing business entities to communicate seamlessly using industry standard protocols.  

## What is an agreement?

An agreement, as far as the enterprise integration suite is concerned, is a communications arrangement between B2B trading partners. An agreement is based on the communications the partners wish to achieve and is protocol or transport specific.

Enterprise integration supports three protocol/transport standards:

- [AS2](./app-service-logic-enterprise-integration-as2.md)
- [X12](./app-service-logic-enterprise-integration-x12.md)
- [EDIFACT](./app-service-logic-enterprise-integration-edifact.md) (coming soon)

## Why use agreements?
Some of the common benefits of using agreements are:
- Enables different organizations and businesses to be able to exchange information in a well known format.
- Improves efficiency when conducting B2B transactions
- Easy to create, manage and use them when creating enterprise integration apps

## How to create agreements?
### Here's what you need before you get started
- An [integration account](./app-service-logic-enterprise-integration-accounts.md) defined in your Azure subscription
- At least two [partners](./app-service-logic-enterprise-integration-partners.md) already defined in your integration account  

>[AZURE.NOTE]When creating an agreement, the content in the agreement file must match the agreement type. 

## Create an agreement
After you've [created an integration account](./app-service-logic-enterprise-integration-accounts.md) and [added partners](./app-service-logic-enterprise-integration-partners.md), you can create an agreement by following these steps: 

### From the Azure portal home page

After you log into the [Azure portal](http://portal.azure.com "Azure portal"):  
1. Select **Browse** from the menu on the left.  

>[AZURE.TIP]If you don't see the **Browse** link, you may need to expand the menu first. Do this by selecting the **Show menu** link that's located at the top left of the collapsed menu.  

![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)    
2. Type *integration* into the filter search box then select **Integration Accounts** from the list of results.       
 ![](./media/app-service-logic-enterprise-integration-overview/overview-2.png)  
3. In the **Integration Accounts** blade that opens up, select the integration account in which you will create the agreement. If you don't see any integration accounts lists, [create one first](./app-service-logic-enterprise-integration-accounts.md "All about integration accounts").  
![](./media/app-service-logic-enterprise-integration-overview/overview-3.png)  
4.  Select the **Agreements** tile. If you don't see the agreements tile, add it first.   
![](./media/app-service-logic-enterprise-integration-agreements/agreement-1.png)  
5. Select the **Add** button in the Agreements blade that opens.  
![](./media/app-service-logic-enterprise-integration-agreements/agreement-2.png)  
6. Enter a **Name** for your agreement then select the **Host Partner**, **Host Identity**,  **Guest Partner**, **Guest Identity**, in the Agreements blade that opens.  
![](./media/app-service-logic-enterprise-integration-agreements/agreement-3.png)  

Here are a few details you may find useful when configuring the settings for your agreement: 
  
|Property|Description|
|----|----|
|Host Partner|An agreement needs both a host and guest partner. The host partner represents the organization that is configuring the agreement.|
|Host Identity|An identifier for the host partner. This is used for todo: _______ |
|Guest Partner|An agreement needs both a host and guest partner. The guest partner represents the organization that's doing business with the host partner.|
|Guest Identity|An identifier for the guest partner. This is used for todo: _______ |
|Receive Settings|These properties apply to all messages received by an agreement|
|Send Settings|These properties apply to all messages sent by an agreement|  
Let's continue:  
7. Select **Receive Settings** to configure how messages received via this agreement are to be handled.  
 
 - Optionally, you can override the properties in the incoming message. To do this, select the **Override message properties** checkbox.
  - Select the **Message should be signed** checkbox if you'd like to require all incoming messages to be signed. If you select this option, you will also need to select the **Certificate** that will be used to validate the signature on the messages.
  - Optionally, you can require messages to be encrypted as well. To do this, select the **Message should be encrypted** checkbox. You would then need to select the **Certificate** that will be used to decode the incoming messages.
  - You can also require messages to be compressed. To do this, select the **Message should be compressed** checkbox.  
![](./media/app-service-logic-enterprise-integration-agreements/agreement-4.png) 

See the table below if you would like to learn more about what the receive settings enable.

|Property|Description|
|----|----|
|Override message properties|Select this to indicate that properties in received messages can be overridden |
|Message should be signed|Enable this to require messages to be digitally signed|
|Message should be encrypted|Enable this to require messages to be encrypted. Non-encrypted messages will be rejected.|
|Message should be compressed|Enable this to require messages to be compressed. Non-compressed messages will be rejected.|
|MDN Text|This is a default MDN to be sent to the message sender|
|Send MDN|Enable this to allow MDNs to be sent.|
|Send signed MDN|Enable this to require MDNs to be signed.|
|MIC Algorithm||
|Send asynchronous MDN|Enable this to require messages to be sent asynchronously.|
|URL|This is the URL to which messages will be sent.|
Now, let's continue:  
8. Select **Send Settings** to configure how messages sent via this agreement are to be handled.  
![](./media/app-service-logic-enterprise-integration-agreements/agreement-5.png)  

See the table below if you would like to learn more about what the send settings enable.  

|Property|Description|
|----|----|
|Enable message signing|Select this checkbox to enable all messages sent from the agreement to be signed.|
|MIC Algorithm|Select the algorithm to use in message signing|
|Certificate|Select the certificate to use in message signing|
|Enable message encryption|Select this checkbox to encrypt all messages sent from this agreement.|
|Encryption Algorithm|Select the encryption algorithm to use in message encryption|
|Unfold HTTP headers||
|Request MDN|Enable this checkbox to request an MDN for all messages sent from this agreement|
|Request signed MDN|Enable to request that all MDNs sent to this agreement are signed|
|Request asynchronous MDN|Enable to request asynchronous MDN to be sent to this agreement|
|URL|The URL to which MDNs will be sent|
|Enable NRR||
We are almost done!  
9. Select the **Agreements** tile on the Integration Account blade and you will see the newly added agreement listed.  
![](./media/app-service-logic-enterprise-integration-agreements/agreement-6.png)  
    

### From PowerShell:
- todo: 


## How to use an agreement?
After uploading your agreement, you can use it via the Azure portal or via PowerShell to create enterprise integration apps.

### From the Azure portal home page
- Will give an overview and point to a sample doc that highlights many of the features of enterprise integration
- todo -- blocked since there isn't a way to link the integration account to logic apps from the portal

### From PowerShell:
1. Will have powershell sample code here
2. todo

### Example
Here's an example that .... 

## How to edit an agreement?
You can edit any agreement by following these steps:
1. Select the Integration account that contains the agreement you wish to modify.  
2. Select the **Agreements** tile  
3. Select the agreement you wish to modify on the **Agreements** blade  
4. Select **Edit** from the menu above.   
5. On the Edit menu that opens, make you changes then select the **OK** button to save the changes.  

### From PowerShell 
1. todo: Will have ps code to edit an agreement

## How to delete an agreement?
Deleting an agreement can be done via the portal or via PowerShell.

### From the Azure portal home page
You can delete any agreement by following these steps:
1. Select the Integration account that contains the agreement you wish to delete.  
2. Select the **Agreements** tile  
3. Select the agreement you wish to delete on the **Agreements** blade.  
4. Select **Delete** from the menu above.  
5. If you really want to delete the agreement, select **Yes** on the delete confirmation message box.  
6. Select the Agreements tile and notice the deleted agreement is no longer there.  

### From PowerShell:
1. todo: Will have ps code to delete an agreement

## Next steps
- [Create an application using agreements]()
- [See more samples]()
