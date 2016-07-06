<properties 
	pageTitle="Overview of X12 and the Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Learn how to use X12 agreements to create Logic apps" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erikre" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/05/2016" 
	ms.author="deonhe"/>

# Enterprise integration with X12 

## Create an X12 agreement 
Before you can exchange X12 messages, you need to create an X12 agreement and store it in your integration account. The following steps will walk you through the process of creating an X12 agreement.

### Here's what you need before you get started
- An [integration account](./app-service-logic-enterprise-integration-accounts.md) defined in your Azure subscription  
- At least two [partners](./app-service-logic-enterprise-integration-partners.md) already defined in your integration account  

>[AZURE.NOTE]When creating an agreement, the content in the agreement file must match the agreement type.    


After you've [created an integration account](./app-service-logic-enterprise-integration-accounts.md) and [added partners](./app-service-logic-enterprise-integration-partners.md), you can create an X12 agreement by following these steps:  

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
6. Enter a **Name** for your agreement then select the **Agreement type**, **Host Partner**, **Host Identity**,  **Guest Partner**, **Guest Identity**, in the Agreements blade that opens.  
![](./media/app-service-logic-enterprise-integration-x12/x12-1.png)  
7. After you have set the receive settings properties, select the **OK** button 
Let's continue:  
8. Select **Receive Settings** to configure how messages received via this agreement are to be handled.  
9. The Receive Settings control is divided into the following sections, including Identifiers, Acknowledgment, Schemas, Envelopes, Control Numbers, Validations and Internal Settings. Configure these properties based on your agreement with the partner you will be exchanging messages with. Here is a view of these controls, configure them based on how you want this agreement to identify and handle incoming messages:  
![](./media/app-service-logic-enterprise-integration-x12/x12-2.png)  

![](./media/app-service-logic-enterprise-integration-x12/x12-3.png)  
10. Select the **OK** button to save your settings.  

To configure the settings that handle messages you send to partners:  
11. Select **Send Settings** to configure how messages sent via this agreement are to be handled.  

The Send Settings control is divided into the following sections, including Identifiers, Acknowledgment, Schemas, Envelopes, Control Numbers, Character Sets and Separators and  Validation. 

Here is a view of these controls. Make the selections based on how you want to handle messages you send to partners via this agreement:   
![](./media/app-service-logic-enterprise-integration-x12/x12-4.png)  

![](./media/app-service-logic-enterprise-integration-x12/x12-5.png)  

![](./media/app-service-logic-enterprise-integration-x12/x12-6.png)  
12. Select the **OK** button to save your settings.  

We are almost done!  
13. Select the **Agreements** tile on the Integration Account blade and you will see the newly added agreement listed.  
![](./media/app-service-logic-enterprise-integration-agreements/agreement-6.png)

## Learn more
- [Lean more about the Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")  