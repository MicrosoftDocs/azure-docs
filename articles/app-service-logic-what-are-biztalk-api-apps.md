<properties 
	pageTitle="What are Connectors and BizTalk API Apps" 
	description="Learn about API Apps, Connectors and BizTalk API Apps" 
	services="app-service\logic" 
	documentationCenter="" 
	authors="joshtwist" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/30/2015" 
	ms.author="jtwist"/>

# What are Connectors and BizTalk API Apps

Azure App Services is built atop a principle of extensibility and common connectivity through API Apps. A *Connector* is a type of API App that focuses on connectivity. Connectors, like any other API App, are used from Web Apps, Mobile Apps, and Logic Apps. Connectors make it easy to connect to existing services and help manage authentication, provide monitoring, analytics, and more.

Any developer can create their own API Apps and deploy them privately, and in the future can share and monetize them through the marketplace. 

![API Apps Marketplace](./media/app-service-learn-about-flows-preview/Marketplace.png)

To accelerate developers building solutions with Azure App Services, the Microsoft Azure team added a number of connectors to the marketplace to satisfy many common scenarios. Furthermore, to extend the reach of App Services to complex and advanced integration scenarios, a number of Premium and BizTalk capabilities are also available.

[Connectors and API Apps List in Microsoft Azure App Service](app-service-logic-connectors-list.md)

For Development purposes, you can use all the connectors and all the API Apps, including their full functionality, available in all the service tiers. For Production scenarios, some connector groups, such as the Premium, BizTalk EAI, and BizTalk EDI connectors, are only available when you use the Premium tier. More details are available at [App Service Pricing](http://azure.microsoft.com/en-us/pricing/details/app-service/).


## Protocol Connectors
App Services was born of the web and favors communication using HTTP and sharing metadata through open formats like Swagger. Of course, businesses need to communicate across a variety of protocols. The Protocol connectors can bridge the gap and make communicating with Services using FTP, SFTP, POP3/IMAP, SMTP, and SOAP services as easy as making an HTTP call.  

[Protocol Connectors in Microsoft Azure App Service](app-service-logic-protocol-connectors.md)


## SaaS Connectors
App Services' SaaS connectors provide a turnkey way to connect your web, mobile, and logic apps to some of the biggest names in SaaS today, including Office 365, SalesForce, Sugar CRM, OneDrive, DropBox, Marketo, even Facebook and many more.

[Social Connectors in Microsoft Azure App Service](app-service-logic-social-connectors.md)

[App + Data Services Connectors in Microsoft Azure App Service](app-service-logic-data-connectors.md)


## Premium Connectors 
The Premium connectors extend the reach of App Services further into the enterprise with connectivity for SAP, Siebel, Oracle, DB2, and more.

[Enterprise Connectors in Microsoft Azure App Service](app-service-logic-enterprise-connectors.md)


## BizTalk API Apps
Building business critical apps requires more than just connectivity. Based on the foundation of Microsoft's industry leading integration platform - BizTalk Server - the BizTalk API Apps provide advanced integration capabilities that can be snapped into your Web, Mobile and Logic Apps with ease. Includes Batching and Debatching, VETR (Validate, Extract, Transform and Route), and support for EDI formats like X12, EDIFACT, and AS2.

[Business-to-Business Connectors and API Apps in Microsoft Azure App Service](app-service-logic-b2b-connectors.md)<br/>

[BizTalk Integration API Apps in Microsoft Azure App Service](app-service-logic-integration-connectors.md)