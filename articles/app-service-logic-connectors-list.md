<properties 
	pageTitle="List of Connectors and API Apps | Azure" 
	description="Read about the Connectors and API Apps in Azure App Service; microservices architecture" 
	services="app-service\logic" 
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
	ms.date="03/31/2015" 
	ms.author="mandia"/>


# Connectors and API Apps List in Microsoft Azure App Service
This topic lists all the available connectors and API Apps created by Microsoft. 

For pricing information and a list of what is included with each Service Tier, see [Azure App Service Pricing](http://azure.microsoft.com/pricing/details/app-service/).


## Standard Connectors
The following table lists all the available connectors and API Apps created by Microsoft that are available with the Standard Connectors: 

<table border="1">
<tr bgcolor="FAF9F9">
        <th>Name</th>
        <th>Description</th>
</tr>

<tr>
<td colspan="2"><strong>App + Data Services connectors</strong><br/><br/><a HREF="http://azure.microsoft.com/documentation/articles/app-service-logic-data-connectors/"> App + Data Services Connectors</a> provides more detailed information on these connectors.</td>
</tr>

<tr>
<td>Azure HDInsight</td>
<td>Azure HDInsight deploys and provisions Apache Hadoop clusters in the cloud, and provides a software framework designed to manage, analyze, and report on big data. This connector creates a Hadoop cluster on Azure and submit different Hadoop jobs such as Hive, Pig, MapReduce, and Streaming MapReduce. Using this connector, you can spin a cluster, submit a job, and wait for the job to complete.</td>
</tr>

<tr>
<td>Azure Service Bus</td>
<td>Azure Service Bus is a generic, cloud-based messaging system for connecting just about anything. It enables the exchange of messages in a loosely coupled way for improved scale and reliability. Using this connector, you can send messages from Service Bus entities like Queues and Topics and receive messages from Service Bus entities like Queues and Subscriptions.</td>
</tr>

<tr>
<td>Azure Storage Blob</td>
<td>Azure Storage Blob stores large amounts of unstructured data, such as text or binary data, that can be accessed from anywhere in the world. Using this connector, you can connect to Blob storage and can Upload Blob, Get Blob, Delete Blob, List Blobs in Container, Snapshot Blob, Copy Blob, and use a trigger to retrieve Blobs.</td>
</tr>

<tr>
<td>Box</td>
<td>Box is a file sharing service. The Box Connector connects to Box and can Upload File, Get File, Delete File, List Files, and uses a trigger to retrieve files.</td>
</tr>

<tr>
<td>Dropbox</td>
<td>Dropbox is a file hosting service. Using this connector, you can connect to Dropbox and can Upload File, Get File, Delete File, List Files, and use a trigger to retrieve files.</td>
</tr>

<tr>
<td>Microsoft Office 365</td>
<td>The Office 365 Connector can send and receive emails, manage your calendar, and manage your contacts using your Office 365 account. You can also send, receive and get emails, create and delete events in your calendar, and create, update, get, and delete your contacts.</td>
</tr>

<tr>
<td>Microsoft OneDrive</td>
<td>Microsoft OneDrive is a file hosting service. The OneDrive Connector  connects to your personal Microsoft OneDrive and can Upload File, Get File, Delete File, List Files, and use a trigger to retrieve files.</td>
</tr>

<tr>
<td>Microsoft SharePoint</td>
<td>Microsoft SharePoint connector connects to on-premises Microsoft SharePoint Server or SharePoint Online, manage documents, and list items. You can also create, update, get, and delete documents and list items. Different authentication methods such as default credentials, OAuth 2.0, Windows authentication, and Form-Based authentication are supported.</td>
</tr>

<tr>
<td>Microsoft SQL Server</td>
<td>The Microsoft SQL connector connects to on-premises SQL Server or Azure SQL Database. You can create, update, get, and delete entries on a SQL database table.</td>
</tr>

<tr>
<td colspan="2"><strong>Social Connectors</strong><br/><br/><a HREF="http://azure.microsoft.com/documentation/articles/app-service-logic-social-connectors/">Social Connectors</a> provides more detailed information on these connectors.</td>
</tr>

<tr>
<td>Chatter</td>
<td>Chatter is an enterprise social network. The Chatter Connector connects to Chatter and can Post Message, Search and use a trigger to retrieve new messages.</td>
</tr>

<tr>
<td>Facebook</td>
<td>Facebook is a social networking service. The Facebook connector connects to Facebook and can publish a message, video, photos, offers, and so on. You can also retrieve messages, comments, events, user feeds, user information about different likes, including books, games, movies, and so on. This connector also includes a trigger to retrieve new messages posted on a page.</td>
</tr>

<tr>
<td>Microsoft Yammer</td>
<td>Microsoft Yammer is an enterprise social network. The Yammer connector connects to Yammer, includes a Post Message action, and a trigger to retrieve new messages.</td>
</tr>

<tr>
<td>Twilio</td>
<td>Twilio is a communication oriented SaaS service. The Twilio Connector connects to Twilio and can Send Messages, Get Messages, List Messages, List Usage, Get Available Toll Free Numbers, Get Available Mobile Numbers, Get Available Local Numbers, List Incoming Phone Numbers, Get Incoming Phone Number, and Add Incoming Phone Number.</td>
</tr>

<tr>
<td>Twitter</td>
<td>Twitter is an online social networking service that enables users to send and read short 140-character messages. The Twitter Connector connects to Twitter and can Get user Timeline, Search Tweets, Get Followers, Get Friends, Search User, Get Home Timeline, Get Mentions Timeline, Post Tweet, Post Tweet to User, and Send Direct Message. The Twitter Connector also uses triggers such as Get Tweets by Keyword, Get Tweets by User Handle, and Get Tweets by Hashtag.</td>
</tr>

<tr>
<td colspan="2"><strong>Protocol Connectors</strong><br/><br/><a HREF="http://azure.microsoft.com/documentation/articles/app-service-logic-protocol-connectors/">Protocol Connectors</a> provides more detailed information on these connectors.</td>
</tr>

<tr>
<td>File</td>
<td>The File Connector enables customers to send or upload files to a file system or network, and receive or download files from a file system or network. Using this connector, you can connect to the on-premises file server and can Upload File, Get File, Delete File, List File, and also use a trigger to retrieve files.</td>
</tr>

<tr>
<td>FTP<br/>FTPS</td>
<td>The FTP (File Transfer Protocol) is a popular network protocol to transfer files from one host to another. The FTP Connector can Upload File, Get File, Delete File, List Files and also use a trigger to retrieve files.</td>
</tr>

<tr>
<td>HTTP Listener</td>
<td>HTTP Listener opens an endpoint that acts as a HTTP server and listens to incoming HTTP requests.</td>
</tr>

<tr>
<td>POP3<br/>IMAP</td>
<td>POP3 (Post Office Protocol) is the protocol used by an email client to retrieve email from a mail server. The POP3 Connector connects to a POP3 server and includes a trigger to retrieve emails with attachments.</td>
</tr>

<tr>
<td>SFTP</td>
<td>The SFTP (SSH File Transfer Protocol) is a common protocol that is used to securely transfer files. The SFTP Connector can Upload File, Get File, Delete File, List Files, and use a trigger to retrieve files.</td>
</tr>

<tr>
<td>SMTP</td>
<td>SMTP (Simple Mail Transfer Protocol) is the protocol used between a mail client and a mail server to send mails. The SMTP Connector connects to a SMTP server and send email with attachments.</td>
</tr>

<tr>
<td colspan="2"><strong>Enterprise Connectors</strong><br/><br/><a HREF="http://azure.microsoft.com/documentation/articles/app-service-logic-enterprise-connectors">Enterprise Connectors</a> provides more detailed information on these connectors.</td>
</tr>

<tr>
<td>Marketo</td>
<td>Marketo develops marketing automation software that provides inbound marketing, social marketing, CRM, and other related services. The Marketo Connector connects to Marketo and can Create/Update Leads, Get Lead Changes, Schedule Campaign, Request Campaign, Get Leads, Get Campaigns/List info, Add Leads to List, and Remove Leads from List.</td>
</tr>

<tr>
<td>QuickBooks</td>
<td>Using the QuickBooks connector, you can create, update, read, delete, and query different entities from Intuit QuickBooks like customers, items, invoices, and so on.</td>
</tr>

<tr>
<td>Salesforce</td>
<td>The Salesforce connector manages different entities such as Accounts, Leads, Opportunities, Cases, and so on in your Salesforce account. You can also create, update, upsert, query, and delete various entities.</td>
</tr>

<tr>
<td>SugarCRM</td>
<td>The SugarCRM connector connects to SugarCRM Online and can create, update, read, and delete different types of modules like accounts, contacts, products, and so on.</td>
</tr>

</table>


## BizTalk EAI API Apps
The following table lists all the available API Apps created by Microsoft that are available in BizTalk EAI Services: 

	Name  | Description
------------- | -------------
BizTalk Flat File Encoder | Provides interoperability between flat file data (like excel and csv) and XML data. This API App can convert a flat file instance to XML and vice versa.
BizTalk Transform Service | The BizTalk Transform API App converts data from one format to another format. You can also upload an existing map (.trfm file), view the graphical representation of the map that shows the links between the source and target schemas, and use 'Test’ functionality with a sample input XML content. Different built-in functions are also available, including string manipulations, conditional assignment, arithmetic expressions, date time formatters, looping, and so on.
BizTalk XML Validator | The Validator API App validates XML data against predefined XML schemas. You can use existing schemas or generate schemas based on a flat file instance, JSON instance, or existing connectors.
BizTalk XPath Extractor | The Extractor API App looks up and extracts data from XML content based on a given XPath.

See [BizTalk Integration connectors](app-service-logic-integration-connectors.md) for more information and details on these API Apps.


## BizTalk EDI Connectors and API Apps
The following table lists all the available connectors and API Apps created by Microsoft that are available in BizTalk EDI Services: 

	Name  | Description
------------- | -------------
AS2 Connector | The AS2 connector can receive and send messages using the AS2 transport protocol in business-to-business communications. Data is transported securely and reliably over the Internet using digital certificates and encryption.
BizTalk EDIFACT | The EDIFACT API App receives and sends messages using the EDIFACT protocol in business-to-business communications.
BizTalk X12 | The X12 API App receives and sends messages using the X12 protocol in business-to-business communications.
BizTalk Trading Partner Management | The Trading Partner Management API App defines and persists business-to-business relationships using partners, agreements, and schemas and certificates used in agreements. These relationships are enforced using the AS2, EDIFACT, and X12 API Apps.

See [Business-to-Business connectors](app-service-logic-b2b-connectors.md) for more information and details on these API Apps.


## BizTalk Rules API App
The following table lists all the available API Apps created by Microsoft available in  BizTalk Rules: 

	Name  | Description
------------- | -------------
BizTalk Rules | BizTalk Rules define and control the structure, operation, and strategy of an organization. Business policies can be updated without recompiling and redeploying the associated applications.

See [BizTalk Integration connectors](app-service-logic-integration-connectors.md) for more information and details on this API App.


## Premium Connectors
The following table lists all the available Connectors and API Apps created by Microsoft available in Premium Connectors: 

	Name  | Description
------------- | -------------
DB2 Connector | The DB2 Connector connects to an IBM DB2 database, on-premises and on an Azure virtual machine running a Windows operating system. Can map Web API and OData API operations to Informix Structured Query Language commands. Actions include table select, insert, update, delete, and custom statement<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors.md)
Informix | The Informix connector connects to an on-premises IBM Informix database, on-premises and on an Azure virtual machine running a Windows operating system. Can map Web API and OData API operations to Informix Structured Query Language commands. Actions include table select, insert, update, delete, and custom statement.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors.md)
MQ | The MQ Connector connects to IBM WebSphere MQ Server, on-premises and on an Azure virtual machine running a Windows operating system.<br/><br/><strong>Note</strong> Currently cannot be used with Logic Apps.<br/><br/>[App + Data Services connectors](app-service-logic-data-connectors.md)
Oracle Database | The Oracle Database connector connects to on-premises Oracle Database and  can create, update, get, and delete entries on a database table. <br/><br/>[App + Data Services connectors](app-service-logic-data-connectors.md)
SAP | The SAP connector connects to an on-premises SAP server and invokes RFCs, BAPIs and tRFCs, and send IDOCs.<br/><br/>[Enterprise connectors](app-service-logic-enterprise-connectors.md)


## Create your own Connectors and API Apps
See [Create connectors with REST APIs](http://go.microsoft.com/fwlink/p/?LinkId=529766). 


## More Connectors

[BizTalk Integration connectors](app-service-logic-integration-connectors.md)<br/>
[Enterprise connectors](app-service-logic-enterprise-connectors.md)<br/>
[Business-to-Business connectors](app-service-logic-b2b-connectors.md)<br/>
[Social connectors](app-service-logic-social-connectors.md)<br/>
[Protocol connectors](app-service-logic-protocol-connectors.md)<br/>
[App + Data Services connectors](app-service-logic-data-connectors.md)<br/><br/>
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)
