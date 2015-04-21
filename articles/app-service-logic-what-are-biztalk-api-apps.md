<properties 
	pageTitle="What are Connectors and BizTalk API Apps" 
	description="Learn about API Apps, Connectors and BizTalk API Apps" 
	services="app-service\logic" 
	documentationCenter="" 
	authors="MandiOhlinger" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="mandia"/>

# What are Connectors and BizTalk API Apps

Azure App Services is built atop a principle of extensibility and common connectivity through API Apps. A *Connector* is a type of API App that focuses on connectivity. Connectors, like any other API App, are used from Web Apps, Mobile Apps, and Logic Apps. Connectors make it easy to connect to existing services and help manage authentication, provide monitoring, analytics, and more.

Any developer can create their own API Apps and deploy them privately. In the future, developers can share and monetize their custom-created API Apps through the marketplace. 

![API Apps Marketplace](./media/app-service-learn-about-flows-preview/Marketplace.png)

To accelerate developers building solutions with Azure App Service, the Azure team added a number of connectors to the marketplace to satisfy many common scenarios. Furthermore, to extend the reach of App Service to complex and advanced integration scenarios, a number of Premium and BizTalk capabilities are also available.

In Azure App Service, there are different Service "Tiers" available. All Tiers include all the connectors and API Apps, including their full functionality.  

[App Service Pricing](http://azure.microsoft.com/pricing/details/app-service/) describes these Services Tiers and also lists what is included in these tiers. The following sections describe the various categories of BizTalk API Apps and Connectors.


## Standard Connectors
App Service comes with a rich set of connectors that provide a turnkey way to connect your web, mobile, and logic apps to some of the biggest names in SaaS today, including Office 365, SalesForce, Sugar CRM, OneDrive, DropBox, Marketo, Facebook, and many more. It also includes a set of connectors to communicate  with external Services using FTP, SFTP, POP3/IMAP, SMTP, and SOAP; which are as easy as making an HTTP call.  

## Premium Connectors 
The Premium connectors extend the reach of App Services further into the enterprise with connectivity to SAP, Oracle, DB2, Informix, and WebSphere MQ. 

## EAI and EDI Services
Building business critical apps require more than just connectivity. Based on the foundation of Microsoft's industry leading integration platform - BizTalk Server - the BizTalk API Apps provide advanced integration capabilities that can be snapped into your Web, Mobile and Logic Apps with ease. Some of these integration capabilities include Validate, Extract, Transform, Encoders, Trading Partner Management and support for EDI formats like X12, EDIFACT, and AS2.


## Rules
Business rules encapsulates the policies and decisions that control business processes. Typically, rules are dynamic and change over time for different reasons, including business plans, regulations, and many other reasons. BizTalk Rules in App Services lets you to decouple these policies from your application code and make the change process simpler and faster.


## Connector and API App list
See [Connectors and API Apps List](app-service-logic-connectors-list.md) for a complete list of connectors and API Apps included in each category, including the Standard Connectors, BizTalk EAI, Premium Connectors, and so on.
