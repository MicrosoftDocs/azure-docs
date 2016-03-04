<properties
	pageTitle="List of Microsoft-managed APIs | Microsoft Azure App Service"
	description="Get a complete list of the Microsoft-Managed APIs you can use to build Logic apps in Azure App Service"
	services="app-service\logic"
	documentationCenter=""
	authors="MSFTMAN"
	manager="erikre"
	editor=""
    tags="connectors"/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/02/2016"
	ms.author="deonhe"/>

# List of Managed APIs

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [Connectors List](../app-service-logic/app-service-logic-connectors-list.md). 

Select an icon to learn how to quickly leverage these APIs to build  apps that call these services. These APIs can be used to build logic apps and or PowerApps or both.

For pricing information and a list of what is included with each Service Tier, see [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).

> [AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic). You can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

|APIs||||
|-----------|-----------|-----------|-----------|
|[![API Icon][blobicon]<br/>**Azure Blob**][azureblobdoc]|[![API Icon][bingsearchicon]<br/>**Bing Search**][bingsearchdoc]|[![API Icon][boxicon]<br/>**Box**][boxDoc]|[![API Icon][crmonlineicon]<br/>**CRM Online**][crmonlinedoc]|
|[![API Icon][dropboxicon]<br/>**Dropbox**][dropboxdoc]|[![API Icon][facebookicon]<br/>**Facebook**][facebookdoc]|[![API Icon][ftpicon]<br/>**FTP**][ftpdoc]|[![API Icon][googledriveicon]<br/>**Google Drive**][googledrivedoc]|
|[![API Icon][microsofttranslatoricon]<br/>**Translator**][microsofttranslatordoc]|[![API Icon][office365icon]<br/>**Office 365**<br/>**Outlook**][office365outlookdoc]|[![API Icon][office365icon]<br/>**Office 365**<br/>**Users**][office365usersdoc]|[![API Icon][office365icon]<br/>**Office 365**<br/>**Video**][office365videodoc]|
|[![API Icon][onedriveicon]<br/>**OneDrive**][onedrivedoc]|[![API Icon][salesforceicon]<br/>**Salesforce**][salesforcedoc]|[![API Icon][servicebusicon]<br/>**Service Bus**][servicebusdoc]|[![API Icon][sftpicon]<br/>**SFTP**][sftpdoc]|
|[![API Icon][sharepointicon]<br/>**SharePoint**<br/>**Online**][sharepointdoc]|[![API Icon][slackicon]<br/>**Slack**<br/>][slackdoc]|[![API Icon][smtpicon]<br/>**SMTP**][smtpdoc]|[![API Icon][sqlicon]<br/>**SQL Azure**][sqldoc]|
|[![API Icon][twilioicon]<br/>**Twilio**][twiliodoc]|[![API Icon][twittericon]<br/>**Twitter**][twitterdoc]|[![API Icon][yammericon]<br/>**Yammer**][yammerdoc] | |


### APIs can be triggers
Several APIs provide triggers that can notify your app when specific events occur. For example, the FTP API has the OnUpdatedFile trigger. You can build an either a logic app or a PowerApp that listens to this trigger and takes an action whenever the trigger is fired.

There are two types of triggers:  

* Poll Triggers: These triggers poll your service at a specified frequency to check for new data. When new data is available, a new instance of your app runs with the data as input. To prevent the same data from being consumed multiple times, the trigger may clean-up data that has been read and passed to your app.
* Push Triggers: These triggers listen for data on an endpoint or for an event to occur. Then, triggers a new instance of your app. The twitter API is one such example.


### APIs can be actions
APIs can also be used as actions within your apps. Actions are useful for looking up data which can then be used in the execution of your app. For example, you may need to look up customer data from a SQL database when processing an order. Or, you may need to write, update or delete data in a destination table. You can do this using the actions provided by the APIs. Actions map to operations that are defined in the Swagger metadata.


[What's new](../app-service-logic/app-service-logic-schema-2015-08-01.md)  
[Build a logic app now](../app-service-logic/app-service-logic-create-a-logic-app.md)  
[Get started with PowerApps now](../power-apps/powerapps-get-started-azure-portal.md)  

<!--API Documentation-->
[azureblobdoc]: ./create-api-azureblobstorage.md "Connect to Azure blob to manage files in your blob container."
[bingsearchDoc]: ./create-api-bingsearch.md "Search Bing for web, images, news and video."
[boxDoc]: ./create-api-box.md "Connects to Box and can upload, get, delete, list, and more file tasks."
[crmonlinedoc]: ./create-api-crmonline.md "Connect to Dynamics CRM Online and do more with your CRM Online data."
[dropboxdoc]: ./create-api-dropbox.md "Connect to Dropbox and can get, delete, list, and more file tasks."
[exceldoc]: ./create-api-excel.md "Connect to Excel."
[facebookdoc]: ./create-api-facebook.md "Connect to Facebook to post to a timeline, get a page feed, and more."
[ftpdoc]: ./create-api-ftp.md "Connects to an FTP / FTPS server and do different FTP tasks, including uploading, getting, deleting files, and more."
[googledrivedoc]: ./create-api-googledrive.md "Connect to GoogleDrive and interact with your data."
[microsofttranslatordoc]: ./create-api-microsofttranslator.md
[office365outlookdoc]: ./create-api-office365-outlook.md "The Office 365 Connector can send and receive emails, manage your calendar, and manage your contacts using your Office 365 account."
[officeunifieddoc]: ./create-api-bingsearch.md
[office365usersdoc]: ./create-api-office365-users.md
[office365videodoc]: ./create-api-office365-video.md
[onedrivedoc]: ./create-api-onedrive.md "Connects to your personal Microsoft OneDrive and upload, delete, list files, and more."
[salesforcedoc]: ./create-api-salesforce.md "Connect to your Salesforce account and manage  accounts, leads, opportunities, and more."
[servicebusdoc]: ./create-api-servicebus.md "Can send messages from Service Bus Queues and Topics and receive messages from Service Bus Queues and Subscriptions."
[sharepointdoc]: ./create-api-sharepointonline.md "Connects to SharePoint Online to manage documents and list items."
[slackdoc]: ./create-api-slack.md "Connect to Slack and post messages to Slack channels."
[sftpdoc]: ./create-api-sftp.md "Connects to SFTP and can upload, get, delete files, and more."
[smtpdoc]: ./create-api-smtp.md "Connects to a SMTP server and can send email with attachments."
[sqldoc]: ./create-api-sqlazure.md "Connects to SQL Azure Database. You can create, update, get, and delete entries on a SQL database table."
[twiliodoc]: ./create-api-twilio.md "Connects to Twilio and can send and get messages, get available numbers, managing incoming phone numbers, and more."
[twitterdoc]: ./create-api-twitter.md "Connects to Twitter and get timelines, post tweets, and more."
[yammerdoc]: ./create-api-yammer.md "Connects to Yammer to post messages and get new messages."

<!--Icon references-->
[blobicon]: ./media/apis-list/blobicon.png
[bingsearchicon]: ./media/apis-list/bingsearchicon.png
[boxicon]: ./media/apis-list/boxicon.png
[ftpicon]: ./media/apis-list/ftpicon.png
[crmonlineicon]: ./media/apis-list/dynamicscrmicon.png
[dropboxicon]: ./media/apis-list/dropboxicon.png
[excelicon]: ./media/apis-list/excelicon.png
[facebookicon]: ./media/apis-list/facebookicon.png
[googledriveicon]: ./media/apis-list/googledriveicon.png
[microsofttranslatoricon]: ./media/apis-list/translatoricon.png
[office365icon]: ./media/apis-list/office365icon.png
[onedriveicon]: ./media/apis-list/onedriveicon.png
[salesforceicon]: ./media/apis-list/salesforceicon.png
[servicebusicon]: ./media/apis-list/servicebusicon.png
[sftpicon]: ./media/apis-list/sftpicon.png
[sharepointicon]: ./media/apis-list/sharepointicon.png
[slackicon]: ./media/apis-list/slackicon.png
[smtpicon]: ./media/apis-list/smtpicon.png
[sqlicon]: ./media/apis-list/sqlicon.png
[twilioicon]: ./media/apis-list/twilioicon.png
[twittericon]: ./media/apis-list/twittericon.png
[yammericon]: ./media/apis-list/yammericon.png
