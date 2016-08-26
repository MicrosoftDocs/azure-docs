<properties
	pageTitle="List of Microsoft-managed connectors for use in Microsoft Azure Logic apps | Microsoft Azure App Service | Microsoft Azure"
	description="Get a complete list of the Microsoft-Managed connectors you can use to build Logic apps in Azure App Service"
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
	ms.topic="get-started-article"
	ms.date="07/07/2016"
	ms.author="deonhe"/>

# List of connectors

>[AZURE.NOTE] This version of the article applies to Logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [Connectors List](../app-service-logic/app-service-logic-connectors-list.md). 

For pricing information and a list of what is included with each Service Tier, see [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).

> [AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic). You can immediately create a short-lived starter Logic app in App Service. No credit cards required; no commitments.

## Standard connectors

Select an icon to learn how to quickly leverage these connectors to build  apps that call these services. These connectors can be used to build Logic apps, PowerApps and Flows.

|Connectors||||
|-----------|-----------|-----------|-----------|
|[![API Icon][blobicon]<br/>**Azure Blob**][azureblobdoc]|[![API Icon][boxicon]<br/>**Box**][boxDoc]|[![API Icon][crmonlineicon]<br/>**CRM Online**][crmonlinedoc]|[![API Icon][dropboxicon]<br/>**Dropbox**][dropboxdoc]|
|[![API Icon][facebookicon]<br/>**Facebook**][facebookdoc]|[![API Icon][ftpicon]<br/>**FTP**][ftpdoc]|[![API Icon][githubicon]<br/>**GitHub**][githubdoc]|[![API Icon][googledriveicon]<br/>**Google Drive**][googledrivedoc]|
|[![API Icon][mailchimpicon]<br/>**MailChimp**][mailchimpdoc]|[![API Icon][microsofttranslatoricon]<br/>**Translator**][microsofttranslatordoc]|[![API Icon][office365icon]<br/>**Office 365**<br/>**Outlook**][office365outlookdoc]|[![API Icon][office365icon]<br/>**Office 365**<br/>**Users**][office365usersdoc]|
|[![API Icon][office365icon]<br/>**Office 365**<br/>**Video**][office365videodoc]|[![API Icon][onedriveicon]<br/>**OneDrive**][onedrivedoc]|[![API Icon][onedriveicon]<br/>**OneDrive<br/>for Business**][onedriveforbusinessdoc]|[![API Icon][outlookicon]<br/>**Outlook**][outlookdoc]|
|[![API Icon][projectonlineicon]<br/>**Project<br/>Online**][projectonlinedoc]|[![API Icon][rssicon]<br/>**RSS**][rssdoc]|[![API Icon][salesforceicon]<br/>**Salesforce**][salesforcedoc]|[![API Icon][sendgridicon]<br/>**SendGrid**][sendgriddoc]|
|[![API Icon][servicebusicon]<br/>**Service Bus**][servicebusdoc]|[![API Icon][sftpicon]<br/>**SFTP**][sftpdoc]|[![API Icon][sharepointicon]<br/>**SharePoint**<br/>**Online**][sharepointdoc]|[![API Icon][slackicon]<br/>**Slack**<br/>][slackdoc]|
|[![API Icon][smtpicon]<br/>**SMTP**][smtpdoc]|[![API Icon][sqlicon]<br/>**SQL Azure**][sqldoc]|[![API Icon][trelloicon]<br/>**Trello**][trellodoc]|[![API Icon][twilioicon]<br/>**Twilio**][twiliodoc]|
|[![API Icon][twittericon]<br/>**Twitter**][twitterdoc]|[![API Icon][wunderlisticon]<br/>**Wunderlist**][wunderlistdoc]|[![API Icon][yammericon]<br/>**Yammer**][yammerdoc] | |

## Enterprise Integration Pack (EIP) connectors
Use the EIP connectors to create Logic apps for B2B scenarios that include EAI and EDI.  
 
|EIP connectors ||||
|-----------|-----------|-----------|-----------|
|[![API Icon][as2icon]<br/>**AS2</br>encode/decode**][as2doc]|[![API Icon][x12icon]<br/>**X12</br>encode/decode**][x12Doc]|[![API Icon][xmlvalidateicon]<br/>**XML <br/>validation**][xmlvalidatedoc]|[![API Icon][xmltransformicon]<br/>**XML<br/> transform**][xmltransformdoc]|
|[![API Icon][flatfileicon]<br/>**Flat file</br>encode**][flatfiledoc]|[![API Icon][flatfiledecodeicon]<br/>**Flat file</br>decode**][flatfiledecodedoc]|||


### Connectors can be triggers
Several connectors provide triggers that can notify your app when specific events occur. For example, the FTP connector has the OnUpdatedFile trigger. You can build an either a Logic app, PowerApp or Flow that listens to this trigger and takes an action whenever the trigger is fired.

There are two types of triggers:  

* Poll Triggers: These triggers poll your service at a specified frequency to check for new data. When new data is available, a new instance of your app runs with the data as input. To prevent the same data from being consumed multiple times, the trigger may clean-up data that has been read and passed to your app.
* Push Triggers: These triggers listen for data on an endpoint or for an event to occur. Then, triggers a new instance of your app. The twitter connector is one such example.


### Connectors can be actions
Connectors can also be used as actions within your apps. Actions are useful for looking up data which can then be used in the execution of your app. For example, you may need to look up customer data from a SQL database when processing an order. Or, you may need to write, update or delete data in a destination table. You can do this using the actions provided by the connectors. Actions map to operations that are defined in the Swagger metadata.


[What's new](../app-service-logic/app-service-logic-schema-2015-08-01.md)  
[Build a Logic app now](../app-service-logic/app-service-logic-create-a-logic-app.md)  
[Get started with PowerApps now](../power-apps/powerapps-get-started-azure-portal.md)  
[Migrate existing Logic apps to the latest schema version](connectors-schema-migration.md) 

<!--Connectors Documentation-->
[azureblobdoc]: ./connectors-create-api-azureblobstorage.md "Connect to Azure blob to manage files in your blob container."
[bingsearchDoc]: ./connectors-create-api-bingsearch.md "Search Bing for web, images, news and video."
[boxDoc]: ./connectors-create-api-box.md "Connects to Box and can upload, get, delete, list, and more file tasks."
[crmonlinedoc]: ./connectors-create-api-crmonline.md "Connect to Dynamics CRM Online and do more with your CRM Online data."
[dropboxdoc]: ./connectors-create-api-dropbox.md "Connect to Dropbox and can get, delete, list, and more file tasks."
[exceldoc]: ./connectors-create-api-excel.md "Connect to Excel."
[facebookdoc]: ./connectors-create-api-facebook.md "Connect to Facebook to post to a timeline, get a page feed, and more."
[ftpdoc]: ./connectors-create-api-ftp.md "Connects to an FTP / FTPS server and do different FTP tasks, including uploading, getting, deleting files, and more."
[googledrivedoc]: ./connectors-create-api-googledrive.md "Connect to GoogleDrive and interact with your data."
[microsofttranslatordoc]: ./connectors-create-api-microsofttranslator.md
[office365outlookdoc]: ./connectors-create-api-office365-outlook.md "The Office 365 Connector can send and receive emails, manage your calendar, and manage your contacts using your Office 365 account."
[officeunifieddoc]: ./connectors-create-api-bingsearch.md
[office365usersdoc]: ./connectors-create-api-office365-users.md
[office365videodoc]: ./connectors-create-api-office365-video.md
[onedrivedoc]: ./connectors-create-api-onedrive.md "Connects to your personal Microsoft OneDrive and upload, delete, list files, and more."
[onedriveforbusinessdoc]: ./connectors-create-api-onedriveforbusiness.md "Connects to your business Microsoft OneDrive and uploads, deletes, lists your files, and more."
[outlookdoc]: ./connectors-create-api-outlook.md "Connect to your Outlook mailbox and access your email and more."
[projectonlinedoc]: ./connectors-create-api-projectonline.md "Connects to Microsoft Project Online."
[rssdoc]: ./connectors-create-api-rss.md "RSS connector allows the users to publish and retrieve feed items. It also allows the users to trigger operations when a new item is published to the feed."
[salesforcedoc]: ./connectors-create-api-salesforce.md "Connect to your Salesforce account and manage  accounts, leads, opportunities, and more."
[sendgriddoc]: ./connectors-create-api-sendgrid.md "Connects to Microsoft Project Online."
[servicebusdoc]: ./connectors-create-api-servicebus.md "Can send messages from Service Bus Queues and Topics and receive messages from Service Bus Queues and Subscriptions."
[sharepointdoc]: ./connectors-create-api-sharepointonline.md "Connects to SharePoint Online to manage documents and list items."
[slackdoc]: ./connectors-create-api-slack.md "Connect to Slack and post messages to Slack channels."
[sftpdoc]: ./connectors-create-api-sftp.md "Connects to SFTP and can upload, get, delete files, and more."
[githubdoc]: ./connectors-create-api-github.md "Connects to GitHub and can track issues."
[mailchimpdoc]: ./connectors-create-api-mailchimp.md "Send Better Email."
[smtpdoc]: ./connectors-create-api-smtp.md "Connects to a SMTP server and can send email with attachments."
[sqldoc]: ./connectors-create-api-sqlazure.md "Connects to SQL Azure Database. You can create, update, get, and delete entries on a SQL database table."
[trellodoc]: ./connectors-create-api-trello.md "Trello is the free,  flexible, and visual way to organize anything with anyone."
[twiliodoc]: ./connectors-create-api-twilio.md "Connects to Twilio and can send and get messages, get available numbers, managing incoming phone numbers, and more."
[twitterdoc]: ./connectors-create-api-twitter.md "Connects to Twitter and get timelines, post tweets, and more."
[wunderlistdoc]: ./connectors-create-api-wunderlist.md "Keep your life in sync."
[yammerdoc]: ./connectors-create-api-yammer.md "Connects to Yammer to post messages and get new messages."
[as2doc]: ../app-service-logic/app-service-logic-enterprise-integration-as2.md "Learn about enterprise integration AS2."
[x12doc]: ../app-service-logic/app-service-logic-enterprise-integration-x12.md "Learn about enterprise integration X12"
[flatfiledoc]: ../app-service-logic/app-service-logic-enterprise-integration-flatfile.md "Learn about enterprise integration flat file."
[flatfiledecodedoc]: ../app-service-logic/app-service-logic-enterprise-integration-flatfile.md/#how-to-create-the-flat-file-decoding-connector "Learn about enterprise integration flat file."
[xmlvalidatedoc]: ../app-service-logic/app-service-logic-enterprise-integration-xml.md "Learn about enterprise integration XML validation."
[xmltransformdoc]: ../app-service-logic/app-service-logic-enterprise-integration-transform.md "Learn about enterprise integration transforms."

<!--Icon references-->
[blobicon]: ./media/apis-list/blobicon.png
[bingsearchicon]: ./media/apis-list/bingsearchicon.png
[boxicon]: ./media/apis-list/boxicon.png
[ftpicon]: ./media/apis-list/ftpicon.png
[githubicon]: ./media/apis-list/githubicon.png
[crmonlineicon]: ./media/apis-list/dynamicscrmicon.png
[dropboxicon]: ./media/apis-list/dropboxicon.png
[excelicon]: ./media/apis-list/excelicon.png
[facebookicon]: ./media/apis-list/facebookicon.png
[googledriveicon]: ./media/apis-list/googledriveicon.png
[mailchimpicon]: ./media/apis-list/mailchimpicon.png
[microsofttranslatoricon]: ./media/apis-list/translatoricon.png
[office365icon]: ./media/apis-list/office365icon.png
[onedriveicon]: ./media/apis-list/onedriveicon.png
[onedriveforbusinessicon]: ./media/apis-list/onedriveforbusinessicon.png
[outlookicon]: ./media/apis-list/outlookicon.png
[projectonlineicon]: ./media/apis-list/projectonlineicon.png
[rssicon]: ./media/apis-list/rssicon.png
[salesforceicon]: ./media/apis-list/salesforceicon.png
[sendgridicon]: ./media/apis-list/sendgridicon.png
[servicebusicon]: ./media/apis-list/servicebusicon.png
[sftpicon]: ./media/apis-list/sftpicon.png
[sharepointicon]: ./media/apis-list/sharepointicon.png
[slackicon]: ./media/apis-list/slackicon.png
[smtpicon]: ./media/apis-list/smtpicon.png
[sqlicon]: ./media/apis-list/sqlicon.png
[trelloicon]: ./media/apis-list/trelloicon.png
[twilioicon]: ./media/apis-list/twilioicon.png
[twittericon]: ./media/apis-list/twittericon.png
[wunderlisticon]: ./media/apis-list/wunderlisticon.png
[yammericon]: ./media/apis-list/yammericon.png
[as2icon]: ./media/apis-list/as2new.png
[x12icon]: ./media/apis-list/x12new.png
[flatfileicon]: ./media/apis-list/flatfileencoding.png
[flatfiledecodeicon]: ./media/apis-list/flatfiledecoding.png
[xmlvalidateicon]: ./media/apis-list/xmlvalidation.png
[xmltransformicon]: ./media/apis-list/xsltransform.png
