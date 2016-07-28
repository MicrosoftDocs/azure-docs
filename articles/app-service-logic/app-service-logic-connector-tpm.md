<properties 
   pageTitle="Using the BizTalk Trading Partner Management Connector in Logic Apps | Microsoft Azure App Service" 
   description="How to create and configure the BizTalk Trading Partner Management Connector or API app and use it in a logic app in Azure App Service" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="rajeshramabathiran" 
   manager="erikre" 
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="04/20/2016"
   ms.author="rajram"/>

# Get started with BizTalk Trading Partner Management and add it to your Logic App

[AZURE.INCLUDE [app-service-logic-version-message](../../includes/app-service-logic-version-message.md)]


The BizTalk Trading Partner Management (TPM) service lets you define and persist business to business relationships such as partners and agreements along with associated artifacts such as schemas and certificates. These relationships can then be enforced by related API services such as AS2, EDIFACT, and X12.

The TPM API App is the base requirement of the AS2 connector, the X12 API App, and the EDIFACT API App. You can add BizTalk Trading Partner Management to your business workflow and process data as part of a business-to-business workflow within a Logic App. 

## Prerequisites
- Blank SQL Azure database - You have to create a blank SQL Azure database first, before creating a new TPM API App.

## Understanding Partners, Agreements and Profiles
Learn more about [create a trading partner agreement][1].

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).

<!--References-->
[1]: app-service-logic-create-a-trading-partner-agreement.md
