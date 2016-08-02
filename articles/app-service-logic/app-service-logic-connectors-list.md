<properties
	pageTitle="List of available Connectors and API Apps | Microsoft Azure App Service"
	description="Read about the Connectors and API Apps in Azure App Service"
	services="logic-apps"
	documentationCenter=""
	authors="MandiOhlinger"
	manager="erikre"
	editor="cgronlun"/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="07/28/2016"
	ms.author="mandia"/>


# List of Connectors and API Apps to use in your Logic Apps
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the Logic Apps General Availability (GA) version, see [New Connectors List](../connectors/apis-list.md).

Learn about all the available connectors and API Apps created by Microsoft to use within your Logic Apps.

For pricing information and a list of what is included with each Service Tier, see [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).

> [AZURE.NOTE] To get started with Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic). You can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

## Core Connectors
The following table lists all the available connectors and API Apps created by Microsoft that are available as Core Connectors:

Name | Description
--- | ---
[Azure Service Bus](app-service-logic-connector-azureservicebus.md) | Can send messages from Service Bus Queues and Topics and receive messages from Service Bus Queues and Subscriptions.
[Bing Translator](https://azure.microsoft.com/marketplace/partners/microsoft_com/bingtranslator) | Use Bing to translate text into another language.
[HTTP](app-service-logic-connector-http.md) | The HTTP Listener opens an endpoint that acts as an HTTP server and listens to incoming HTTP or HTTPS requests. The HTTP action doesn't require an API App and is supported natively within Logic Apps.
[Microsoft Office 365](app-service-logic-connector-office365.md) | The Office 365 Connector can send and receive emails, manage your calendar, and manage your contacts using your Office 365 account.
[QuickBooks](app-service-logic-connector-quickbooks.md) | You can  complete different tasks including create, update, and query different entities from Intuit QuickBooks like customers, items, invoices, and so on.
[Slack](app-service-logic-connector-slack.md) | Connect to Slack and post messages to Slack channels.
[Wait](app-service-logic-connector-wait.md) | Use this connector to delay the execution of your app. You can delay the app for a specific duration or until an occurrence at a specific time.


## Enterprise Integration Connectors
The following table lists all the available Connectors and API Apps created by Microsoft available as Enterprise Integration Connectors:

Name  | Description
------------- | -------------
[AS2 Connector](app-service-logic-connector-as2.md) | Can receive and send messages using the AS2 transport protocol. Data is transported securely and reliably using digital certificates and encryption.
[BizTalk EDIFACT](app-service-logic-connector-edifact.md) | Receives and sends messages using the EDIFACT protocol in business-to-business communications.
[BizTalk Flat File Encoder](app-service-logic-flatfile-encoder.md) | Provides interoperability between flat file data (like excel and csv) and XML data. This API App can convert a flat file instance to XML and vice versa.
[BizTalk JSON Encoder](app-service-logic-connector-jsonencoder.md) | An encoder and decoder that helps your app interop between JSON and XML data. It can convert a given JSON instance to XML and vice versa.
[BizTalk Rules](app-service-logic-use-biztalk-rules.md) | Use BizTalk Rules to define and control the business logic within an organization. Business policies can be updated without recompiling or without redeploying the associated applications.
[BizTalk Trading Partner Management](app-service-logic-connector-tpm.md) | Defines and persists business-to-business relationships using partners, agreements, and schemas and certificates used in agreements. These relationships are enforced using the AS2, EDIFACT, and X12 API Apps.
[BizTalk Transform Service](app-service-logic-transform-xml-documents.md) | Converts data from one format to another format. You can also upload an existing map (.trfm file), view the links between the source and target schemas, and use 'Test’ functionality with sample input XML content. Different built-in functions are also available, including string manipulations, conditional assignment, and more.
[BizTalk X12](app-service-logic-connector-x12.md) | Receives and sends messages using the X12 protocol in business-to-business communications.
[BizTalk XML Validator](app-service-logic-xml-validator.md) | Validates XML data against predefined XML schemas. You can use existing schemas or generate schemas based on a flat file instance, JSON instance, or existing connectors.
[BizTalk XPath Extractor](app-service-logic-xpath-extract.md) | Looks up and extracts data from XML content based on an XPath you choose.
[DB2 Connector](app-service-logic-connector-db2.md) | Connects to an IBM DB2 database on-premises and on an Azure virtual machine running a Windows operating system. Can map Web API and OData API operations to Informix Structured Query Language commands. <br/><br/>No triggers. Actions include table select, insert, update, delete, and custom statement<br/><br/>This connector also includes the Microsoft Client for DRDA to connect to an Informix server across a TCP/IP network.
[File](app-service-logic-connector-file.md) | Using this connector, you can connect to the on-premises file system or network and complete different file tasks, including uploading, deleting, listing files, and more.
[FTP<br/>FTPS](app-service-logic-connector-ftp.md) | Connects to an FTP / FTPS server and do different FTP tasks, including uploading, getting, deleting files, and more.
[Informix](app-service-logic-connector-informix.md) | Connects to an IBM Informix database, on-premises and on an Azure virtual machine running a Windows operating system. Can map Web API and OData API operations to Informix Structured Query Language commands.<br/><br/>No triggers. Actions include table select, insert, update, delete, and custom statement.<br/><br/>When using on-premises, VPN or Azure ExpressRoute can be used. This connector also includes a Microsoft Client for DRDA to connect to an Informix server across a TCP/IP network.
[Microsoft SQL Server](app-service-logic-connector-sql.md) | Connects to on-premises SQL Server or an Azure SQL Database. You can create, update, get, and delete entries on a SQL database table.
MQ | Connects to IBM WebSphere MQ Server version 8, on-premises and on an Azure virtual machine running a Windows operating system. When using on-premises, VPN or Azure ExpressRoute can be used. The connector also includes the Microsoft Client for MQ.<br/><br/>No triggers. No actions.<br/><br/>**Note** Currently cannot be used with Logic Apps.
[Oracle Database](app-service-logic-connector-oracle.md) | Connects to on-premises Oracle Database and  can create, update, get, and delete entries on a database table.
[POP3](app-service-logic-connector-pop3.md) (Post Office Protocol)| Connect to a POP3 server to retrieve emails with attachments.
[SAP](app-service-logic-connector-sap.md) | Connects to an on-premises SAP server and invokes RFCs, BAPIs and tRFCs, and send IDOCs.

## Connectors as Triggers
Several connectors provide triggers for Logic Apps. These triggers are of two types:

1. Poll Triggers: These triggers poll your service at a specified frequency to check for new data. When new data is available, a new instance of your Logic App runs with the data as input. To prevent the same data from being consumed multiple times, the trigger may clean-up data that has been read and passed to the Logic App. Examples of such connectors are File, SQL, and Azure Storage.
2. Push Triggers: These triggers listen for data on an endpoint or for an event to occur. Then, trigger a new instance of a Logic App. Examples of such connectors are HTTP Listener and Twitter.

## Connectors as Actions
Connectors can also be used as actions within your Logic App. Actions are useful for looking up data within the Logic App that can then used in the execution. For example, you may need to look up data from a SQL database for additional information about a customer when processing an order. Or, you may need to write, update or delete data in a destination. You can do this using the actions provided by the connectors. Actions map to operations in API Apps (as defined by their Swagger metadata).

## Create your own Connectors and API Apps
[Connectors and API Apps Reference](http://aka.ms/appservicesconnectorreference)  
[Azure App Service API app triggers](../app-service-api/app-service-api-dotnet-triggers.md)  
[Logic App Reference](https://msdn.microsoft.com/library/azure/dn948510.aspx)

## More on Connectors and API Apps
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)  
[Using the Hybrid Connection Manager in Azure App Service](app-service-logic-hybrid-connection-manager.md)  
[Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md)
