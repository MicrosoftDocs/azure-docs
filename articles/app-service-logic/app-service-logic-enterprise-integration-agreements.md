<properties 
	pageTitle="Overview of partners and Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Learn how to use partners with the Enterprise Integration Pack and Logic apps" 
	services="logic-apps" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erikre" 
	editor="cgronlun"/>

<tags 
	ms.service="logic-apps" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="deonhe"/>


# Learn about agreements and Enterprise Integration Pack

## Overview
Agreements are the cornerstone of business-to-business (B2B) communications, allowing business entities to communicate seamlessly using industry standard protocols.  

## What is an agreement?

An agreement, as far as the Enterprise Integration Pack is concerned, is a communications arrangement between B2B trading partners. An agreement is based on the communications the partners wish to achieve and is protocol or transport specific.

Enterprise integration supports three protocol/transport standards:  

- [AS2](./app-service-logic-enterprise-integration-as2.md)
- [X12](./app-service-logic-enterprise-integration-x12.md)
- [EDIFACT](./app-service-logic-enterprise-integration-edifact.md)

## Why use agreements
Some of the common benefits of using agreements are:
- Enables different organizations and businesses to be able to exchange information in a well known format.  
- Improves efficiency when conducting B2B transactions  
- Easy to create, manage and use them when creating enterprise integration apps  

## How to create agreements
- [Create an AS2 agreement](./app-service-logic-enterprise-integration-as2.md)   
- [Create an X12 agreement](./app-service-logic-enterprise-integration-x12.md)   

## How to use an agreement
After creating an agreement, you can use it via the Azure portal to create [Logic apps](./app-service-logic-what-are-logic-apps.md "Learn about Logic apps") with B2B features.

## How to edit an agreement
You can edit any agreement by following these steps:  
1. Select the Integration account that contains the agreement you wish to modify.  
2. Select the **Agreements** tile  
3. Select the agreement you wish to modify on the **Agreements** blade  
4. Select **Edit** from the menu above   
5. On the Edit menu that opens, make you changes then select the **OK** button to save the changes  

## How to delete an agreement
You can delete any agreement by following these steps from within the integration account that contains the agreement you wish to delete:   
1. Select the **Agreements** tile  
2. Select the agreement you wish to delete on the **Agreements** blade  
3. Select **Delete** from the menu above  
4. Confirm that you really want to delete the agreement  
5. Notice that the agreement is no longer listed on the Agreements blade  
 

## Next steps
- [Create an AS2 agreement](./app-service-logic-enterprise-integration-as2.md)  

