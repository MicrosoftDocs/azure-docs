<properties 
	pageTitle="List of Connectors and API Apps | Azure" 
	description="Read about the Connectors and API Apps in Azure App Service; microservices architecture" 
	services="app-service" 
	documentationCenter="" 
	authors="MandiOhlinger" 
	manager="dwrede" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/22/2015" 
	ms.author="mandia"/>


# Connectors and API Apps List in Microsoft Azure App Service

The following table lists all the available connectors and API Apps created by Microsoft, in alphabetical order: 

	Name  | Description
------------- | ------------- 
AS2 Connector | The AS2 connector can receive and send messages using the AS2 transport protocol in business-to-business communications. Data is transported securely and reliably over the Internet using digital certificates and encryption.<br/><br/>[Business-to-Business connectors](app-service-logic-b2b-connectors.md)
Azure HDInsight | Azure HDInsight deploys and provisions Apache Hadoop clusters in the cloud, and provides a software framework designed to manage, analyze, and report on big data. This connector creates a Hadoop cluster on Azure and submit different Hadoop jobs such as Hive, Pig, MapReduce, and Streaming MapReduce. Using this connector, you can spin a cluster, submit a job, and wait for the job to complete.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors.md)
Azure Mobile Services | Azure Mobile Services brings together a set of Azure services that enable back-end capabilities for mobile apps. Using this connector, you can connect to Azure Mobile Services and can create, update, get, delete entries, and make custom API calls on a table. <br/><br/>[App + Data Services connectors](app-service-logic-data-connectors.md)
Azure Service Bus | Azure Service Bus is a generic, cloud-based messaging system for connecting just about anything. It enables the exchange of messages in a loosely coupled way for improved scale and reliability. Using this connector, you can send messages from Service Bus entities like Queues and Topics and receive messages from Service Bus entities like Queues and Subscriptions.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors.md)
Azure Storage Blob | Azure Storage Blob stores large amounts of unstructured data, such as text or binary data, that can be accessed from anywhere in the world. Using this connector, you can connect to Blob storage and can Upload Blob, Get Blob, Delete Blob, List Blobs in Container, Snapshot Blob, Copy Blob, and use a trigger to retrieve Blobs.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors.md)
Azure Storage Table | Azure Storage Table service stores large amounts of structured data. The service is a NoSQL datastore which is ideal for storing structured, non-relational data. This connector connects to an Azure Storage Table and can Get Entity, Query Entities, Insert Entity, Update Entity, Delete Entity, and use a trigger to retrieve data.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors.md)
BizTalk EDIFACT | The EDIFACT API App receives and sends messages using the EDIFACT protocol in business-to-business communications.<br/><br/>[Business-to-Business connectors](app-service-logic-b2b-connectors.md)
BizTalk X12 | The X12 API App receives and sends messages using the X12 protocol in business-to-business communications.<br/><br/>[Business-to-Business connectors](app-service-logic-b2b-connectors.md)
BizTalk Flat File Encoder | Provides interoperability between flat file data (like excel and csv) and XML data. This API App can convert a flat file instance to XML and vice versa.<br/><br/>[BizTalk Integration connectors](app-service-logic-integration-connectors.md)
BizTalk JSON Encoder | Provides interoperability between JSON and XML data. This API App can convert a JSON instance to XML and vice versa.<br/><br/>[BizTalk Integration connectors](app-service-logic-integration-connectors.md)
BizTalk Rules | BizTalk Rules define and control the structure, operation, and strategy of an organization. Business policies can be updated without recompiling and redeploying the associated applications.<br/><br/>[BizTalk Integration connectors](app-service-logic-integration-connectors.md)
BizTalk Trading Partner Management | The Trading Partner Management API App defines and persists business-to-business relationships using partners, agreements, and schemas and certificates used in agreements. These relationships are enforced using the AS2, EDIFACT, and X12 API Apps.<br/><br/>[Business-to-Business connectors](app-service-logic-b2b-connectors.md)
BizTalk Transform Service | The BizTalk Transform API App converts data from one format to another format. You can also upload an existing map (.trfm file), view the graphical representation of the map that shows the links between the source and target schemas, and use 'Test’ functionality with a sample input XML content. Different built-in functions are also available, including string manipulations, conditional assignment, arithmetic expressions, date time formatters, looping, and so on.<br/><br/>[BizTalk Integration connectors](app-service-logic-integration-connectors.md)
BizTalk XML Validator | The Validator API App validates XML data against predefined XML schemas. You can use existing schemas or generate schemas based on a flat file instance, JSON instance, or existing connectors.<br/><br/>[BizTalk Integration connectors](app-service-logic-integration-connectors.md)
BIzTalk XPath Extractor | The Extractor API App looks up and extracts data from XML content based on a given XPath.<br/><br/>[BizTalk Integration connectors](app-service-logic-integration-connectors.md)
Box | Box is a file sharing service. The Box Connector connects to Box and can Upload File, Get File, Delete File, List Files, and uses a trigger to retrieve files.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors)
Chatter | Chatter is an enterprise social network. The Chatter Connector connects to Chatter and can Post Message, Search and use a trigger to retrieve new messages.<br/><br/>[Social connectors](app-service-logic-social-connectors.md)
DropBox | Dropbox is a file hosting service. Using this connector, you can connect to Dropbox and can Upload File, Get File, Delete File, List Files, and use a trigger to retrieve files.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors)
Facebook | Facebook is a social networking service. The Facebook connector connects to Facebook and can publish a message, video, photos, offers, and so on. You can also retrieve messages, comments, events, user feeds, user information about different likes, including books, games, movies, and so on. This connector also includes a trigger to retrieve new messages posted on a page.<br/><br/>[Social connectors](app-service-logic-social-connectors.md)
File  | The File Connector enables customers to send or upload files to a file system or network, and receive or download files from a file system or network. Using this connector, you can connect to the on-premises file server and can Upload File, Get File, Delete File, List File, and also use a trigger to retrieve files.<br/><br/>[Protocol connectors](app-service-logic-protocol-connectors.md)
FTP<br/>FTPS | The FTP (File Transfer Protocol) is a popular network protocol to transfer files from one host to another. The FTP Connector can Upload File, Get File, Delete File, List Files and also use a trigger to retrieve files.<br/><br/>[Protocol connectors](app-service-logic-protocol-connectors.md)
HTTP<br/>HTTPS | HTTP Listener opens an endpoint that acts as a HTTP server and listens to incoming HTTP requests.<br/><br/>[Protocol connectors](app-service-logic-protocol-connectors.md)
HTTP<br/>HTTPS | HTTP Connector send datas to HTTP servers using the HTTP or HTTPS protocol.<br/><br/>[Protocol connectors](app-service-logic-protocol-connectors.md)
Marketo | Marketo develops marketing automation software that provides inbound marketing, social marketing, CRM, and other related services. The Marketo Connector connects to Marketo and can Create/Update Leads, Get Lead Changes, Schedule Campaign, Request Campaign, Get Leads, Get Campaigns/List info, Add Leads to List, and Remove Leads from List.<br/><br/>[Enterprise connectors](app-service-logic-enterprise-connectors.md)
Microsoft Office 365 | The Office 365 Connector can send and receive emails, manage your calendar, and manage your contacts using your Office 365 account. You can also send, receive and get emails, create and delete events in your calendar, and create, update, get, and delete your contacts.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors)
Microsoft OneDrive | Microsoft OneDrive is a file hosting service. The OneDrive Connector  connects to your personal Microsoft OneDrive and can Upload File, Get File, Delete File, List Files, and use a trigger to retrieve files.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors)
Microsoft SharePoint | Microsoft SharePoint connector connects to on-premises Microsoft SharePoint Server or SharePoint Online, manage documents, and list items. You can also create, update, get, and delete documents and list items. Different authentication methods such as default credentials, OAuth 2.0, Windows authentication, and Form-Based authentication are supported. <br/><br/>[App + Data Services connectors](app-service-logic-data-connectors)
Microsoft SQL Server | The Microsoft SQL connector connects to on-premises SQL Server or Azure SQL Database. You can create, update, get, and delete entries on a SQL database table.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors)
Microsoft Yammer | Microsoft Yammer is an enterprise social network. The Yammer connector connects to Yammer, includes a Post Message action, and a trigger to retrieve new messages.<br/><br/>[Social connectors](app-service-logic-social-connectors.md)
MongoDB | The MongoDB connector connects to Mongo Server Database (cloud or on-premises) and create, update, get, and delete entries on a MongoDB collection.<br/><br/>[Enterprise connectors](app-service-logic-enterprise-connectors.md)
Oracle Database | The Oracle Database connector connects to on-premises Oracle Database and  can create, update, get, and delete entries on a database table. <br/><br/>[App + Data Services connectors](app-service-logic-data-connectors)
POP3<br/>IMAP | POP3 (Post Office Protocol) is the protocol used by an email client to retrieve email from a mail server. The POP3 Connector connects to a POP3 server and includes a trigger to retrieve emails with attachments.<br/><br/>[Protocol connectors](app-service-logic-protocol-connectors.md)
Quickbooks | Using the QuickBooks connector, you can create, update, read, delete, and query different entities from Intuit QuickBooks like customers, items, invoices, and so on.<br/><br/>[Enterprise connectors](app-service-logic-enterprise-connectors.md)
Salesforce | The Salesforce connector manages different entities such as Accounts, Leads, Opportunities, Cases, and so on in your Salesforce account. You can also create, update, upsert, query, and delete various entities.<br/><br/>[Enterprise connectors](app-service-logic-enterprise-connectors.md)
SAP | The SAP connector connects to an on-premises SAP server and invokes RFCs, BAPIs and tRFCs, and send IDOCs.<br/><br/>[Enterprise connectors](app-service-logic-enterprise-connectors.md)
SFTP | The SFTP (SSH File Transfer Protocol) is a common protocol that is used to securely transfer files. The SFTP Connector can Upload File, Get File, Delete File, List Files, and use a trigger to retrieve files.<br/><br/>[Protocol connectors](app-service-logic-protocol-connectors.md)
SMTP | SMTP (Simple Mail Transfer Protocol) is the protocol used between a mail client and a mail server to send mails. The SMTP Connector connects to a SMTP server and send email with attachments. <br/><br/>[Protocol connectors](app-service-logic-protocol-connectors.md)
SugarCRM | The SugarCRM connector connects to SugarCRM Online and can create, update, read, and delete different types of modules like accounts, contacts, products, and so on.<br/><br/>[Enterprise connectors](app-service-logic-enterprise-connectors.md)
Twilio | Twilio is a communication oriented SaaS service. The Twilio Connector connects to Twilio and can Send Messages, Get Messages, List Messages, List Usage, Get Available Toll Free Numbers, Get Available Mobile Numbers, Get Available Local Numbers, List Incoming Phone Numbers, Get Incoming Phone Number, and Add Incoming Phone Number.<br/><br/>[Social connectors](app-service-logic-social-connectors.md)
Twitter | Twitter is an online social networking service that enables users to send and read short 140-character messages. The Twitter Connector connects to Twitter and can Get user Timeline, Search Tweets, Get Followers, Get Friends, Search User, Get Home Timeline, Get Mentions Timeline, Post Tweet, Post Tweet to User, and Send Direct Message. The Twitter Connector also uses triggers such as Get Tweets by Keyword, Get Tweets by User Handle, and Get Tweets by Hashtag.<br/><br/>[Social connectors](app-service-logic-social-connectors.md)


## More Connectors

[BizTalk Integration connectors](app-service-logic-integration-connectors.md)<br/>
[Enterprise connectors](app-service-logic-enterprise-connectors.md)<br/>
[Business-to-Business connectors](app-service-logic-b2b-connectors.md)<br/>
[Social connectors](app-service-logic-social-connectors.md)<br/>
[Protocol connectors](app-service-logic-protocol-connectors.md)<br/>
[App + Data Services connectors](app-service-logic-data-connectors)<br/>
