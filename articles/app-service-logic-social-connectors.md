<properties 
	pageTitle="Microsoft Azure API Apps Social Connectors | API Apps microservice" 
	description="Learn how to create Microsoft Azure Social Connector API Apps and add the API App to your logic App; microservices" 
	services="app-service\logic" 
	documentationCenter="" 
	authors="MandiOhlinger" 
	manager="dwrede" 
	editor=""/>

<tags
	ms.service="app-service-logic" 
	ms.workload="connectors" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="mandia"/>

# Social Connectors in Microsoft Azure App Service


## What is a Social API App Connector
Social connectors are "API Apps" that can connect to social applications and perform several *Actions* on behalf of the authenticated user. Most connectors can also be configured with a *Trigger*. Triggers are events (similar to events in the .NET Framework) that can be configured on some connectors. Triggers can then initiate the actions that have been configured for the connector (or any other connector). For example, an instance of the Twitter connector can be configured with a *new message* trigger where the trigger is defined as any new tweet that mentions @VisualStudio. This trigger can then be configured to initiate an *Action* to retweet the tweet. 

The following social connectors are available from Microsoft:

- Facebook
- Twitter
- Chatter
- Yammer
- Twilio

Here's a brief description of each of the social connectors:

<table>
<tr>
<th> Name</th>
<th> Description</th>
<th> Triggers</th>
<th>Actions</th>

<tr>
<td>Facebook
<td>A Facebook Connector allows you to post and read messages, comments, events and statuses from your Facebook feed. You can also post videos and photos.
<td>New post
<td><li>Publish post
	<li>Publish photo 
</tr>

<tr>
<td>Twitter
<td>A Twitter connector lets you perform several operations such as post, receive tweets, and search tweets. You can also use a Twitter connector to keep up with what's happening on Twitter, getting details such as tweets, time lines, friends and followers.
<td>New tweets
<td><li>Search tweets
	<li>Tweet
	<li>Get User Timeline
	<li>Retweet
</tr>

<tr>
<td>Chatter
<td>A Chatter Connector can be used to read, post and search messages on your chatter feed.
<td>New message
<td><li>Post message
<li>Search message
</tr>

<tr>
<td>Yammer
<td>A Yammer connector allows you to post and read messages from Yammer groups.
<td>New messages
<td><li>Post message	
	<li>Get message from group\feed	
</tr>

<tr>
<td>Twilio
<td>A Twilio connector lets you send and receive SMSes from your Twilio account. It also lets you retrieve phone numbers, and usage data.
<td>N/A
<td><li>Messages: send, list, get and search
	<li>Phone numbers:buy, list, and get local and toll-free numbers
</tr>
</table>


Now that you have an idea of what our social connectors can do, let's look at some simple use cases for these connectors.

## Why Use Connectors?

Connectors accelerate app development and even allow non-developers to create fully functional, enterprise grade applications without having to learn a programming language or write any code. 

### Monitoring customer feedback ###
Imagine your company recently released a new app and the team wants to know what customers are saying about the app on social media. Each team member could periodically check the various social media sites and guess which keywords customers may use to discuss your app. But, more elegantly, you can simply create a Twitter connector, configure it to monitor Twitter for specific hastags, mentions and keywords. You could then use the SMTP connector to send an email that contains the contents of the matching tweets to your team members. You can do something similar by monitoring Facebook and Yammer and sending an SMS, via a Twilio connector, to your DevOps team if the contents of the Facebook or Yammer posts indicate that there may be a critical issue that your customers hit. You can do this all, without writing a single line of code.  

Let's get started. 


## Create a Connector
Connectors can be created at the Azure Portal 

### Create a Social Connector in the Microsoft Azure Portal

1. In the Azure portal, select **NEW** > **Web + mobile** > **Azure Marketplace**.
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
[Protocol connectors](app-service-logic-protocol-connectors.md) |
[App + Data Services connectors](app-service-logic-data-connectors.md) |
[Connectors and API Apps List](app-service-logic-connectors-list.md)<br/><br/>
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)
