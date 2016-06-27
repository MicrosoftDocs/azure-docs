<properties 
	pageTitle="Overview of Enterprise Integration | Microsoft Azure App Service" 
	description="Use the features of Enterprise Integration to enable business process and integration scenarios using Microsoft Azure App service" 
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

# Enterprise integration suite (EIS)

## Overview

## What is the enterprise integration suite?
The Enterprise Integration suite is Microsoft's cloud-based solution for seamlessly enabling business-to-business (B2B) communications. The suite uses industry standard protocols including [AS2](./app-service-logic-enterprise-integration-as2.md), [X12](./app-service-logic-enterprise-integration-x12.md) and EDIFACT (coming soon) to exchanges messages between business partners. Messages can be optionally secured using both encryption and digital signatures. 

The suite allows organizations that use different protocols and formats to exchange messages electronically by transforming the different formats into a format that both organizations' systems can interpret and take action. 

If you are familiar with BizTalk Server or Microsoft Azure BizTalk Services, you'll find it easy to use the Enterprise Integration features because most of the concepts are similar. 

Architecturally, the Enterprise Integration suite is based on **integration accounts** that store all the artifacts that can be used to design, deploy and maintain your B2B apps. An integration account is basically a cloud-based container where you store artifacts such as schemas, partners, certificates and agreements. These artifacts can then be used in Logic apps to build B2B workflows. Before you can use the artifacts in a Logic app, you just need to link your integration account to your Logic app. After linking them, your Logic app will have access to the integration account's artifacts.  
![](./media/app-service-logic-enterprise-integration-overview/overview-0.png)  

- todo:
- Talk about limits here (size of uploads?, others)  
- How it relates to BizTalk scenarios
- How it relates to v1 of logic apps schema?
- Moving from earlier versions (V1, MABS, etc.)
- Relationship with App service/API apps and Logic apps

## Why should you use enterprise integration?
todo:
### Key features that solve customer problems
todo:

## How to use enterprise integration?
You can build and manage B2B apps using Enterprise Integration via the Logic apps designer on the **Azure portal** or by using PowerShell. 

### From the Azure management portal
- todo:

### From PowerShell
- todo: 


## What are come common scenarios?
- todo:
- incoming order, transformed for internal system --> Order processed -> Order confirmation returned to customer
- Jon: VETER -- reference in the MABS docs ... leverage that doc here
- EDI
- EAI
- etc.


## How much does it cost?
For pricing information and a list of what is included with each service tier, see [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).

## Here's what you need to get started now
- todo:
- An Azure subscription (anything else special in Azure? Any region limitations, etc.?)  
- Visual Studio -- Is this required only for some scenarios? If yes, which ones? -- needed to create maps & schemas in vS
- An integration account

## Learn more about:
- [Schemas](./app-service-logic-enterprise-integration-schemas.md "Lean about enterprise integration schemas")
- [Maps](./app-service-logic-enterprise-integration-maps.md "Lean about enterprise integration schemas")
- [Certificates](./app-service-logic-enterprise-integration-certificates.md "Lean about enterprise integration schemas")
- [Partners](./app-service-logic-enterprise-integration-partners.md "Lean about enterprise integration schemas")





