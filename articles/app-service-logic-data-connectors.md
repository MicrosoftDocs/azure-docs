<properties 
	pageTitle="Microsoft Azure API Apps Data Connectors | API Apps microservice" 
	description="Learn how to create Microsoft Azure Data Connector API Apps and add the API App to your logic App; microservices" 
	services="app-service\logic" 
	documentationCenter="" 
	authors="MSFTMan" 
	manager="dwrede" 
	editor=""/>

<tags
	ms.service="app-service-logic" 
	ms.workload="data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="deonhe"/>


# Data Connectors in Microsoft Azure App Service


## What is an App + Data Services API App Connector
App and Data Services connectors are "API Apps" that can connect to a wide array of data services applications and perform several *Actions* on behalf of the authenticated user. Most of these connectors can also be configured with a *Trigger*. Triggers are events (similar to events in the .NET Framework) that can be configured on some connectors to initiate a workflow. 

For example, an instance of the Dropbox connector can be configured with a *new file* trigger where the trigger executes any time a new file is added to the Dropbox account that's being monitored. This trigger can then be configured to initiate an *Action* that will *Get* the file and upload it to an on-premises SharePoint list.


Here's a brief overview of each of the App and Data Services connectors that are available on the Azure gallery:

<table>
<tr>
<th> Name</th>
<th> Description</th>
<th> Triggers</th>
<th>Actions</th>

<tr>
<td>Azure Media Services
<td>Azure Media Services connector allows you to create end-to-end media workflows with flexible and scalable encoding, packaging, and distribution. You can also securely upload, store, encode and stream video or audio content for both on-demand and live streaming delivery to a wide array of TV, PC and mobile device endpoints.
<td>None
<td>None 
</tr>

<tr>
<td>Azure Service Bus
<td>Azure Service Bus connector lets you send messages from Service Bus entities like Queues and Topics and receive messages from Service Bus entities like Queues and Subscriptions.
<td>New messages
<td>Send message
</tr>
<tr>
<td>Azure Storage Table
<td>Azure Storage Table Connector lets you connect to Azure Storage Table and perform various actions such as Get Entity, Query Entities, Insert Entity, Update Entity, Delete Entity and a trigger to retrieve data.
<td>New entity
<td><li>Get Entity
	<li>Insert entity
	<li>Delete entity
	<li>Update entity
	<li>Query

</tr>

<tr>
<td>Box
<td>Box Connector lets you connect to Box and perform various actions on your files. 
<td>New files added
<td><li>Upload File
<li>Get File
<li>Delete File
<li>List Files
</tr>

<tr>
<td>DB2
<td>The DB2 Connector lets you connect to an IBM DB2 database, on-premises and on an Azure virtual machine running a Windows operating system. Can map Web API and OData API operations to Informix Structured Query Language commands. When using on-premises, VPN or Azure ExpressRoute can be used. This connector also includes the Microsoft Client for DRDA to connect to an Informix server across a TCP/IP network.
<td>None
<td><li>Table Select
<li>Insert
<li>Update
<li>Delete
<li>Custom Statement
</tr>

<tr>
<td>Dropbox
<td>Dropbox Connector lets you connect to Dropbox and perform various actions such as Upload File, Get File, Delete File, List Files and a trigger to retrieve files.
<td>New files added
<td><li>Upload File
<li>Get File
<li>Delete File
<li>List Files
</tr>

<tr>
<td>HDInsight
<td>An HDInsight connector lets you create a Hadoop cluster on Azure and submit various Hadoop jobs such as Hive, Pig, MapReduce, and Streaming MapReduce. Using this connector, you can spin a cluster, submit a job, and wait for the job to complete.
<td>None
<td><li>Create Cluster
		<li>Wait For Cluster Creation
		<li>Submit Pig Job
		<li>Submit Hive Job
		<li>Submit MapReduce Job
		<li>Wait For Job Completion
		<li>Delete Cluster
<li>Submit MapReduce Job
<li>Submit Streaming MapReduce Job
</tr>

<tr>
<td>Informix
<td>The Informix connector connects to an on-premises IBM Informix database, on-premises and on an Azure virtual machine running a Windows operating system. Can map Web API and OData API operations to Informix Structured Query Language commands. When using on-premises, VPN or Azure ExpressRoute can be used. This connector also includes a Microsoft Client for DRDA to connect to an Informix server across a TCP/IP network.
<td>None
<td><li>Table Select
<li>Insert
<li>Update
<li>Delete
<li>Custom Statement
</tr>

<tr>
<td>Microsoft SQL
<td>A Microsoft SQL connector lets you create and modify entries in Microsoft SQL Server and Azure SQL database tables.
<td>Poll data
<td><li>Insert Into Table
	<li>Update Table
	<li>Select From Table
	<li>Delete From Table
	<li>Call Stored Procedure
</tr>

<tr>
<td>MongoDB
<td>A MongoDB connector lets you create, update, delete, and get documents from a MongoDB collection.
<td>New document
<td>	<li>Add Document
		<li>Update Document
		<li>Get Documents
		<li>Upsert Document
		<li>Delete Document
</tr>


<tr>
<td>MQ
<td>The MQ Connector connects to IBM WebSphere MQ Server version 8, on-premises and on an Azure virtual machine running a Windows operating system. When using on-premises, VPN or Azure ExpressRoute can be used. The connector also includes the Microsoft Client for MQ.<br/><br/><strong>Note</strong> Currently cannot be used with Logic Apps.
<td>None
<td>None
</tr>

<tr>
<td>Office 365
<td>An Office 365 connector lets you send and receive emails and manage your calendar and contacts.
<td>New message
<td>	<li>Send Mail
		<li>Reply To Mail
		<li>Send Event
		<li>Add Contact
</tr>

<tr>
<td>OneDrive
<td>OneDrive Connector lets you connect to your personal Microsoft OneDrive storage account and perform various actions such as upload, get, delete, list files.
<td>New file
<td><li>Files: upload, delete, list, download
</tr>

<tr>
<td>Oracle
<td>An Oracle database connector lets you create and modify entries in an Oracle database table.
<td>New data, based on query
<td><li>Table: Insert Into, update, select from, delete from
<li>Call Stored Procedure
</tr>

<tr>
<td>SharePoint Online
<td>A Microsoft SharePoint connector lets you create and modify documents and list items in SharePoint Server or Microsoft SharePoint Online.
<td><li>New document
<li>New list item
<td><li>Document library: Upload, delete and get
<li>List: Insert item

</tr>

<tr>
<td>SharePoint Server
<td>SharePoint Server connector lets you manage documents and list items in your SharePoint server. Default credentials, Windows authentication and forms based authentication are supported. You need to provide a Service Bus Connection String and install the on-premises listener agent before you can connect to the server.
<td><li>New document
<li>New list item
<td><li>Document library: Upload, delete and get
<li>List: Insert item
</tr>
</table>


## Why Use Connectors?

Connectors accelerate app development and even allow non-developers to create fully functional, enterprise grade applications without having to learn a programming language or write any code.

Now that you have an idea of what our App + data services connectors can do, let's look at some simple use cases for these connectors. 

### Monitoring your Dropbox and updating SharePoint
Imagine your company is a construction firm that receives very large files containing blueprints. These files are typically too large to be handled via email so your company sets up a Dropbox account and asks its customers to drop the blueprints into the Dropbox. You could then ask each employee to constantly check the Dropbox folders for new blueprints then upload them to your SharePoint server, however, you are convinced there must be a better way! Luckily, you found out that Microsoft recently released its App + data services connector for Dropbox, Sharepoint and other data services. You can easily create connectors for Dropbox and SharePoint, add them to a Logic app and configure them to upload each new file  from your Dropbox account to your SharePoint list. Since the Dropbox connector has a *new message* trigger, you can use it to notify your Logic app that there is a new file available. The Dropbox connector can then download the file. Your Sharepoint connector can then be configured to upload the file to a SharePoint list using the SharePoint *upload* action. You can do this all, without writing a single line of code.  

Let's get started. 

## Create a Connector
Connector API Apps can be created using the Azure Portal

### Create a SharePoint Connector in the Microsoft Azure Portal

1. In the Azure portal, select **NEW** > **Web + mobile** > **Azure Marketplace**
2. **Search** for the connector or select it from the list. Once selected, a new blade or window opens. Select **Create**. 
3. Enter the following properties for the connector: 
	<table>
	    <tr><th>Property</th> <th>Description</th> </tr>
	    <tr><td>Name</td> <td>Enter any name for your API App. For example, you can name it RulesDiscountTaxCode or APIAppValidateXML</td> </tr>
	    <tr><td>App Service Plan</td> <td>Lists your payment plan. You can change it if you need more or less resources</th> </td>
	    <tr><td>Pricing Tier</td> <td>Read-only property that lists the pricing category within your Azure subscription.</td> </tr>
	    <tr><td>Resource Group</td> <td>Create a new one or use an existing group. Using resource groups explains this property</td> </tr>
	    <tr><td>Subscription</td> <td>Read-only property that lists your current subscription</td> </tr>
	    <tr><td>Location</td> <td>The Geographic location that hosts your Azure service </td></tr>
        <tr><td>Add to Startboard</td> <td>Select this to add the API App to your Starboard (the home page)</td></tr>
	</table> 
4. Select **Create**. Your connector will be created. It may take a while to complete and the Home screen will be displayed during the creation of the connector. Use the Notifications menu item on the left to monitor the status of your connector.

Now that you've created your first connector, consider building a web, mobile or logic app with it. 


### Access Connector using REST APIs

[Access connectors with REST APIs](http://go.microsoft.com/fwlink/p/?LinkId=529766)

## Add your connector to an application 
Microsoft Azure App Service exposes different application types that can use these Connectors. For example, you can create a *Logic* app by combining one or more of your connectors *logically* into a single app.

To use your connectors within your *Logic* app, you select a per-configured connector from the list, add it to your design work-flow, make the needed configuration changes and its ready to be used. 

To follow these steps, you need a Web App, Mobile App, or Logic App. See <> for the specific steps. Once your application is available, add your connectors. Here's how:

Use the following steps to add a connector to a Logic App: 

1. In the Azure portal Startboard (home page), go to the **Marketplace**, and search for your  Logic, Mobile, or Web App. 

	If you are creating a new App, search for Logic App, Mobile App, or Web App. Select the App and in the new blade, select **Create**. [Create a Logic App](app-service-logic-create-a-logic-app.md) lists the steps. 

2. Open your App and select **Triggers and Actions**. 
3. From the **Gallery**, select the connector. It will be added to your app.
4. Configure the connector:
5. Every connector has properties that are specific to the service and environment that it is connecting to. Enter the details for the properties. Keep in mind that some properties are optional.
6. Select **OK** to save your changes.


## Security
Connectors use either OAuth or user names and passwords. 


## Read about Logic Apps and Web Apps
[What are Logic Apps?](app-service-logic-what-are-logic-apps.md) |
[Websites and Web Apps in Azure App Service](app-service-web-app-azure-portal.md) |



## More Connectors
[BizTalk Integration connectors](app-service-logic-integration-connectors.md) |
[Enterprise connectors](app-service-logic-enterprise-connectors.md) |
[Business-to-Business connectors](app-service-logic-b2b-connectors.md) |
[Social connectors](app-service-logic-social-connectors.md) |
[Protocol connectors](app-service-logic-protocol-connectors.md) |
[App and Data Services connectors](app-service-logic-data-connectors.md) |
[Connectors and API Apps List](app-service-logic-connectors-list.md)<br/><br/>
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)
