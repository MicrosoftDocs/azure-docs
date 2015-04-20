<properties 
	pageTitle="Microsoft Azure API Apps Protocol Connectors | API Apps microservice" 
	description="Learn how to create Microsoft Azure Protocol Connector API Apps and add the API App to your logic App; microservices" 
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
	ms.author="deonhe"/>


# Protocol Connectors in Microsoft Azure App Service


## What is a Protocol Connector
Protocol connectors are API Apps* that you can use to create apps that communicate using a wide variety of protocols like HTTP, SMTP, FTP, and so on. 

You can find the protocol connectors in the Microsoft Azure portal by clicking **New** > **Web + mobile** > **Azure Marketplace** > enter the search keyword **protocol** > press enter

The following protocol connectors are available in the Auzre Marketplace:

- SFTP
- POP3
- FTP
- HTTP
- SMTP
- File

Here's a brief description of each of the protocol connectors:

<table>
<tr>
<th> Name</th>
<th> Description</th>
<th> Triggers</th>
<th> Actions</th>

<tr>
<td>SFTP
<td>An SFTP connector lets you download files from or upload files to an SFTP server.
<td>New file available in SFTP Folder

<td>Files: upload, delete, list, and get 

</tr>

<tr>
<td>POP3
<td>A POP3 connector lets you download email from a POP3 server.
<td>New message arrives
<td>N/A
</tr>

<tr>
<td>FTP
<td>An FTP Connector lets you download from or upload files to an FTP server.
<td>New file available in FTP folder
<td>File: upload, get, delete and list
</tr>

<tr>
<td>HTTP
<td>An HTTP connector lets you send data to HTTP servers using the HTTP or HTTPS protocol.
<td>None
<td>Post, get, delete, put
</tr>

<tr>
<td>SMTP
<td>An SMTP connector lets you send email from an SMTP server.
<td>N/A
<td>Send email
</tr>

<tr>
<td>File
<td>A file Connector lets you connect to the on-premises file server and perform actions such as upload, get, delete and list files. There is also a trigger to retrieve files.
<td>New file added to device
<td>File: upload, get, delete and list
</tr>


</table>

Now that you have an idea of what our protocol connectors can do, let's look at some simple use cases for these connectors.

### Monitoring customer feedback ###
Imagine your company recently released a new app and the team wants to know what customers are saying about the app on social media. Each team member could periodically check the various social media sites and guess which keywords customers may use to discuss your app. But, more elegantly, you can simply create a Twitter connector, configure it to monitor Twitter for specific hastags, mentions and keywords. You could then use the SMTP connector to create an email that contains the contents of the matching tweets then send it to your team members. You can then use the an HTTP connector to post these tweets to an internal company website. You can do this all, without writing a single line of code.  

Let's get started. 

## Create a Connector

A Connector can be created using the Azure portal.

### Create a Connector in the Azure Portal

Let's walk through the creation of an SMTP connector using the Azure Marketplace

1. Sign in to the Microsoft Azure [portal](https://manage.windowsazure.com).
2. Select **NEW** > **Web + mobile** > **Azure Marketplace**.
3. In the **Search box** then enter **protocol** then press **Enter**. You can also select it from the list. Once selected, a new blade or window opens. Select **Create**. 
4. Enter the following properties:

<table>
<tr><th>Property</th> <th>Description</th> </tr>
<tr><td>Name</td> <td>Description</td> </tr>
<tr><td>Package Settings</td> <td>Use the package settings property to enter all the authentication details such as user name, password, port number server address, and so on for the SMTP server. </td> </tr>
<tr><td>App Service Plan</td> <td>Lists your payment plan. You can change it if you need more or less resources</th> </td>
<tr><td>Pricing Tier</td> <td>Read-only property that lists the pricing category within your Azure subscription.</td> </tr>
<tr><td>Resource Group</td> <td>Create a new one or use an existing group. Using resource groups explains this property</td> </tr>
<tr><td>Subscription</td> <td>Read-only property that lists your current subscription</td> </tr>
<tr><td>Location</td> <td>The Geographic location that hosts your Azure service</th> </td>
<tr><td>Add to Startboard</td> <td>Select this to add the API App to your Starboard (the home page)</td></tr>
</table> 

### Access connectors using REST APIs
[Access connectors with REST APIs](http://go.microsoft.com/fwlink/p/?LinkId=529766)

## Add a Connector to your application 
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
[App and Data Services connectors](app-service-logic-data-connectors.md) |
[Connectors and API Apps List](app-service-logic-connectors-list.md)<br/><br/>
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)
