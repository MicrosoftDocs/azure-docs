---
title: Connectors for Azure Logic Apps | Microsoft Docs
description: Choose from Microsoft-managed connectors to build and create logic apps
services: logic-apps
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: f1f1fd50-b7f9-4d13-824a-39678619aa7a
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/11/2017
ms.author: mandia; ladocs

---
# Connectors list
View all the available connectors that can be used in Logic Apps. There are standard connectors, integration account connectors, and enterprise connectors:

* **Standard connectors**: Automatically available and included when you use logic apps. Some examples include Service Bus, DropBox, GoogleDrive, Power BI, Oracle Database, OneDrive, and many more.

* **Integration account connectors**: These are available when you purchase an integration account. Using these connectors, you can transform and validate XML, process business-to-business messages with AS2 / X12 / EDIFACT, and encode and decode flat files. If you work with BizTalk Server, then these connectors are a good fit to expand your BizTalk workflows into Azure.  

    BizTalk Server also has a [Logic Apps adapter](https://msdn.microsoft.com/library/mt787163.aspx) that includes receiving from a logic app, and sending to a logic app.

* **Enterprise connectors**: Includes MQ and SAP. These are also an additional cost. 

[Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps/) and [Pricing model](../logic-apps/logic-apps-pricing.md) provide more details on the costs. 

## Most popular and some favorite standard connectors

| |  |  |  |
| --- | --- | --- | --- |
| [![API Icon][AzureBlobStorageicon]<br/>**Azure Blob<br/>Storage**][AzureBlobStoragedoc] | If you want to automate any tasks with your storage account, then you should look at this connector. Supports CRUD (create, read, update, delete) operations, and is in the top five for logic apps.  |  [![API Icon][Service-Busicon]<br/>**Service Bus**][Service-Busdoc] | The most popular connector within logic apps, it includes triggers and actions to do common SB tasks with queues, and subscriptions. |
| [![API Icon][Dynamics-365icon]<br/>**Dynamics 365<br/>CRM Online**][Dynamics-365doc] | CRM Online - need we say more?! This was one of the most-asked for connectors, and now it's available. It has triggers and actions to help automate workflows with leads, and more. |  [![API Icon][SharePointicon]<br/>**SharePoint<br/>Online**][SharePointdoc] | If you do anything with SharePoint, and could benefit from automation, we recommend looking at this connector with logic apps. It includes triggers and actions to work with lists, files, and folders. |
| [![API Icon][FTPicon]<br/>**FTP**][FTPdoc] | If your FTP server is accessible from the internet, then you can automate workflows to update files, get a list of files in a folder, or even start a workflow when a file is added. SFTP is also available with the SFTP connector. |  [![API Icon][SQL-Servericon]<br/>**SQL Server**][SQL-Serverdoc] | The second most popular connector within logic apps. It can be used with an on-premises SQL Server, and an Azure SQL Database. This is an actions-only connector (no triggers), and is used in a workflow with another connector. | 
| [![API Icon][Office-365-Outlookicon]<br/>**Office 365<br/>Outlook**][office365-outlookdoc] | Lots of triggers, and a lot more actions to use Office 365 email and events within your workflows. This connector also includes an *approval email* action to make it easier to approve vacation requests, expense reports, and so on. | [![API Icon][HTTP-Requesticon]<br/>**Request / Response**][HTTP-Requestdoc] | This connector provides an HTTPS URL. When the logic app receives a POST request to this URL, the logic app starts. If you use the logic app adapter in BizTalk Server to send a message, then you use this URL within your send port. |
| [![API Icon][Twittericon]<br/>**Twitter**][Twitterdoc] | Easily sign-in with a Twitter account, and then start a workflow when a new tweet is posted. Then, save these tweets to a SQL database or SharePoint list. This connector has triggers and actions. | 


## Integration account connectors 

|  |  |  |  |
| --- | --- | --- | --- |
| [![API Icon][xmlvalidateicon]<br/>**XML <br/>validation**][xmlvalidatedoc] |[![API Icon][xmltransformicon]<br/>**XML<br/> transform**][xmltransformdoc] |[![API Icon][flatfileicon]<br/>**Flat file</br> encoding**][flatfiledoc] |[![API Icon][flatfiledecodeicon]<br/>**Flat file</br> decoding**][flatfiledecodedoc] |
| [![API Icon][as2icon]<br/>**AS2</br> decoding**][as2decode] |[![API Icon][as2icon]<br/>**AS2</br> encoding**][as2encode] |[![API Icon][x12icon]<br/>**X12</br> decoding**][x12decode] |[![API Icon][x12icon]<br/>**X12</br> encoding**][x12encode] |
| [![API Icon][x12icon]<br/>**EDIFACT</br> decoding**][EDIFACTdecode] |[![API Icon][x12icon]<br/>**EDIFACT</br> encoding**][EDIFACTencode] | | |

## Enterprise connectors

To create logic apps for B2B scenarios that include EAI and EDI, include these enterprise connectors.

|  |  |
| --- | --- |
|![API Icon][MQicon]<br/>**MQ**|[![API Icon][SAPicon]<br/>**SAP**][sapconnector]|


## Complete list

| | | | | | | | | | | | | | | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| <a name="1">1</a> | <a name="a">A</a> | <a name="b">B</a> | <a name="c">C</a> | <a name="d">D</a> | <a name="e">E</a> | <a name="f">F</a> | <a name="g">G</a> | <a name="h">H</a> | <a name="i">I</a> | <a name="j">J</a> | <a name="l">L</a> | <a name="m">M</a> | <a name="o">O</a> | <a name="p">P</a> | <a name="q">Q</a> | <a name="r">R</a> | <a name="s">S</a> | <a name="t">T</a> | <a name="u">U</a> | <a name="v">V</a> | <a name="w">W</a> | <a name="x">X</a> | <a name="y">Y</a> | <a name="z">Z</a> |

| | |
|---|---|
|[](#1)10to8 Appointment Scheduling<br/><br/>[](#a)Act!<br/>appFigures<br/>[AS2][as2doc]<br/>Asana<br/>Azure API Management<br/>Azure App Services<br/>Azure Automation<br/>[Azure Blob Storage][azureblobstoragedoc]<br/>Azure Data Lake<br/>Azure DocumentDB<br/>[Azure Functions][azure-functionsdoc]<br/>[Azure Logic Apps][nested-logic-appdoc]<br/>AzureML<br/>Azure Queues<br/>Azure Resource Manager<br/>[Azure SQL Database][sql-serverdoc]<br/><br/>[](#b)Basecamp 2<br/>Basecamp 3<br/>Bing Search<br/>Bitbucket<br/>Bitly<br/>BizTalk Server<br/>Blogger<br/>Box<br/>Buffer<br/><br/>[](#c)Campfire<br/>Capsule CRM<br/>Chatter<br/>Common Data Service<br/>Computer Vision API<br/>Control<br/>[Custom APIs / web apps][api/web-appdoc]<br/><br/>[](#d)Data Operations<br/>[DB2][db2doc]<br/>Disqus<br/>DocuSign<br/>Do Until<br/>Dropbox<br/>[Dynamics 365 CRM Online][Dynamics-365doc]<br/>Dynamics 365 for Financials<br/>Dynamics 365 for Operations<br/>Dynamics NAV<br/><br/>[](#e)Easy Redmine<br/>EDIFACT<br/>[Event Hubs][event-hubs-doc]<br/>Eventbrite<br/><br/>[](#f)Face API<br/>Facebook<br/>[File System][filesystemdoc]<br/>[Flat File][flatfiledoc]<br/>For Each<br/>FreshBooks<br/>Freshdesk<br/>[FTP][ftpdoc]<br/><br/>[](#g)GitHub<br/>Gmail<br/>Google Calendar<br/>Google Contacts<br/>Google Drive<br/>Google Sheets<br/>Google Tasks<br/>GoToMeeting<br/>GoToTraining<br/>GoToWebinar<br/><br/>[](#h)Harvest<br/>HelloSign<br/>HipChat<br/>HTTP<br/><br/>[](#i)[Informix][informixdoc]<br/>Infusionsoft<br/>Inoreader<br/>Insightly<br/>Instagram<br/>Instapaper<br/>Integration Account<br/>Intercom | [](#j)JIRA<br/><br/>[](#l)LeanKit<br/>LiveChat<br/>LUIS<br/><br/>[](#m)MailChimp<br/>Mandrill<br/>Medium<br/>Microsoft Translator<br/>MQ<br/>MSN Weather<br/>Muhimbi<br/>MySQL<br/><br/>[](#o)[Office 365 Outlook][office365-outlookdoc]<br/>Office 365 Users<br/>OneDrive<br/>OneDrive for Business<br/>OneNote (Business)<br/>[Oracle Database][oracle-db-doc]<br/>Outlook Tasks<br/>Outlook.com<br/><br/>[](#p)PagerDuty<br/>Pinterest<br/>Pipedrive<br/>Pivotal Tracker<br/>Power BI<br/>Project Online<br/><br/>[](#q)Query<br/><br/>[](#r)Recurrence<br/>Redmine<br/>[Request / Response][http-requestdoc]<br/>RSS<br/><br/>[](#s)[Salesforce][salesforcedoc]<br/>[SAP Application Server][sapconnector]<br/>[SAP Message Server][sapconnector]<br/>Schedule<br/>Scope<br/>SendGrid<br/>[Service Bus][service-busdoc]<br/>SFTP<br/>[SharePoint Online][sharepointdoc]<br/>Slack<br/>Smartsheet<br/>SMTP<br/>SparkPost<br/>[SQL Server][sql-serverdoc]<br/>Stripe<br/>Switch Case<br/>SurveyMonkey<br/><br/>[](#t)Teradata<br/>Text Analytics<br/>Todoist<br/>Toodledo<br/>[Transform XML][xmltransformdoc]<br/>Trello<br/>Twilio<br/>[Twitter][twitterdoc]<br/>Typeform<br/><br/>[](#u)UserVoice<br/><br/>[](#v)Variables<br/>Vimeo<br/>Visual Studio Team Services<br/><br/>[](#w)Wordpress<br/>Wunderlist<br/><br/>[](#x)[X12][x12doc]<br/>[XML Validation][xmlvalidatedoc]<br/><br/>[](#y)Yammer<br/>YouTube<br/><br/>[](#z)Zendesk |


> [!TIP]
> To get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic Apps](https://tryappservice.azure.com/?appservice=logic). You can immediately create a short-lived starter logic app. No credit cards required; no commitments.



## Connectors as triggers

Some connectors provide triggers that can notify your app when specific events happen. For example, the FTP connector has the `OnUpdatedFile` trigger that notifies your app when a file is updated. 

You can build a logic app, PowerApp, or Flow that listens to this trigger, and performs an action whenever the trigger fires.

There are two types of triggers:  

* *Poll triggers*: These triggers poll your service at a specified frequency to check for new data. 

    When new data is available, a new instance of your app runs with the data as input. To prevent the same data from being consumed multiple times, the trigger might clean up data that has been read and passed to your app.

* *Push triggers*: These triggers listen for data on an endpoint, or for an event to happen, then triggers a new instance of your app. The Twitter connector is an example.

## Connectors as actions

Connectors also provide actions that you can use in your app's workflow. For example, your app can look up data that you can then use when running your app. More specifically, you can look up customer data from a SQL database when processing an order. 

Or, you might need to write, update, or delete data in a destination table. Actions map to operations that are defined in the Swagger metadata.

## Custom connectors and certification for Microsoft Azure

To call into APIs that run custom code or aren't available as connectors, you can  extend the Logic Apps platform by [creating REST-based API Apps as custom connectors](../logic-apps/logic-apps-create-api-app.md). 

If you want to make your custom API Apps public and available to use in Azure, then submit your nominations to the [Microsoft Azure Certified program](https://azure.microsoft.com/marketplace/programs/certified/logic-apps/).

## Get help

To ask questions, answer questions, and see what other Azure Logic Apps users are doing, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

To help improve Logic Apps and connectors, vote on or submit ideas at the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps
* [Create your first logic app](../logic-apps/logic-apps-create-a-logic-app.md)
* [Create custom APIs for logic apps](../logic-apps/logic-apps-create-api-app.md)
* [Monitor your logic apps](../logic-apps/logic-apps-monitor-your-logic-apps.md)

<!--Connectors Documentation-->

[api/web-appdoc]: ../logic-apps/logic-apps-custom-hosted-api.md "Integrate logic apps with App Service API Apps"
[azureblobstoragedoc]: ./connectors-create-api-azureblobstorage.md "Manage files in your blob container with Azure blob storage connector"
[azure-functionsdoc]: ../logic-apps/logic-apps-azure-functions.md "Integrate logic apps with Azure Functions"
[db2doc]: ./connectors-create-api-db2.md "Connect to IBM DB2 in the cloud or on-premises. Update a row, get a table, and more"
[Dynamics-365doc]: ./connectors-create-api-crmonline.md "Connect to Dynamics CRM Online so you can work with CRM Online data"
[event-hubs-doc]: ./connectors-create-api-azure-event-hubs.md "Connect to Azure Event Hubs. Receive and send events between logic apps and Event Hubs"
[filesystemdoc]: ../logic-apps/logic-apps-using-file-connector.md "Connect to an on-premises file system"
[ftpdoc]: ./connectors-create-api-ftp.md "Connect to an FTP / FTPS server for FTP tasks, like uploading, getting, deleting files, and more"
[http-requestdoc]: ./connectors-native-reqres.md "Add actions for HTTP requests and responses to your logic apps"
[informixdoc]: ./connectors-create-api-informix.md "Connect to Informix in the cloud or on-premises. Read a row, list the tables, and more"
[nested-logic-appdoc]: ../logic-apps/logic-apps-http-endpoint.md "Integrate logic apps with nested workflows"
[office365-outlookdoc]: ./connectors-create-api-office365-outlook.md "Connect to your Office 365 account. Send and receive emails, manage your calendar and contacts, and more"
[oracle-db-doc]: ./connectors-create-api-oracledatabase.md "Connect to an Oracle database to add, insert, delete rows, and more"
[salesforcedoc]: ./connectors-create-api-salesforce.md "Connect to your Salesforce account. Manage accounts, leads, opportunities, and more"
[sapconnector]: ../logic-apps/logic-apps-using-sap-connector.md "Connect to an on-premises SAP system"
[service-busdoc]: ./connectors-create-api-servicebus.md "Send messages from Service Bus Queues and Topics and receive messages from Service Bus Queues and Subscriptions"
[sharepointdoc]: ./connectors-create-api-sharepointonline.md "Connect to SharePoint Online. Manage documents, list items, and more"
[sql-serverdoc]: ./connectors-create-api-sqlazure.md "Connect to Azure SQL Database or SQL server. Create, update, get, and delete entries in a SQL database table."
[twitterdoc]: ./connectors-create-api-twitter.md "Connect to Twitter. Get timelines, post tweets, and more"

[as2doc]: ../logic-apps/logic-apps-enterprise-integration-as2.md "Learn about enterprise integration AS2."
[x12doc]: ../logic-apps/logic-apps-enterprise-integration-x12.md "Learn about enterprise integration X12"
[flatfiledoc]:../logic-apps/logic-apps-enterprise-integration-flatfile.md "Learn about enterprise integration flat file."
[flatfiledecodedoc]:../logic-apps/logic-apps-enterprise-integration-flatfile.md "Learn about enterprise integration flat file."
[xmlvalidatedoc]: ../logic-apps/logic-apps-enterprise-integration-xml-validation.md "Learn about enterprise integration XML validation."
[xmltransformdoc]: ../logic-apps/logic-apps-enterprise-integration-transform.md "Learn about enterprise integration transforms."
[as2decode]: ../logic-apps/logic-apps-enterprise-integration-as2-decode.md "Learn about enterprise integration AS2 decode"
[as2encode]:../logic-apps/logic-apps-enterprise-integration-as2-encode.md "Learn about enterprise integration AS2 encode"
[X12decode]: ../logic-apps/logic-apps-enterprise-integration-X12-decode.md "Learn about enterprise integration X12 decode"
[X12encode]: ../logic-apps/logic-apps-enterprise-integration-X12-encode.md "Learn about enterprise integration X12 encode"
[EDIFACTdecode]: ../logic-apps/logic-apps-enterprise-integration-EDIFACT-decode.md "Learn about enterprise integration EDIFACT decode"
[EDIFACTencode]: ../logic-apps/logic-apps-enterprise-integration-EDIFACT-encode.md "Learn about enterprise integration EDIFACT encode"



[boxDoc]: ./connectors-create-api-box.md "Connect to Box. Upload, get, delete, list your files, and more"
[delaydoc]: ./connectors-native-delay.md "Perform delayed actions"
[dropboxdoc]: ./connectors-create-api-dropbox.md "Connect to Dropbox. Upload, get, delete, list your files, and more"
[facebookdoc]: ./connectors-create-api-facebook.md "Connect to Facebook. Post to a timeline, get a page feed, and more"
[githubdoc]: ./connectors-create-api-github.md "Connect to GitHub and track issues"
[google-drivedoc]: ./connectors-create-api-googledrive.md "Connect to GoogleDrive so you can work with your data"
[google-sheetsdoc]: ./connectors-create-api-googlesheet.md "Connect to Google Sheets so you can can modify your sheets"
[google-tasksdoc]: ./connectors-create-api-googletasks.md "Connects to Google Tasks so you can manage your tasks"
[google-calendardoc]: ./connectors-create-api-googlecalendar.md "Connects to Google Calendar and can manage calendar."
[httpdoc]: ./connectors-native-http.md "Make HTTP calls with the HTTP connector"
[http-responsedoc]: ./connectors-native-reqres.md "Add actions for HTTP requests and responses to your logic apps"
[http-swaggerdoc]: ./connectors-native-http-swagger.md "Make HTTP calls with HTTP + Swagger connector"
[instagramdoc]: ./connectors-create-api-instagram.md "Connect to Instagram. Trigger or act on events"
[mailchimpdoc]: ./connectors-create-api-mailchimp.md "Connect to your MailChimp account. Manage and automate mails"
[mandrilldoc]: ./connectors-create-api-mandrill.md "Connect to Mandrill for communication"
[microsoft-translatordoc]: ./connectors-create-api-microsofttranslator.md "Connect to Microsoft Translator. Translate text, detect languages, and more" 
[office365-usersdoc]: ./connectors-create-api-office365-users.md 
[office365-videodoc]: ./connectors-create-api-office365-video.md "Get video info, video lists and channels, and playback URLs for Office 365 videos"
[onedrivedoc]: ./connectors-create-api-onedrive.md "Connect to your personal Microsoft OneDrive. Upload, delete, list files, and more"
[onedrive-for-businessdoc]: ./connectors-create-api-onedriveforbusiness.md "Connect to your business Microsoft OneDrive. Upload, delete, list your files, and more"
[outlook.comdoc]: ./connectors-create-api-outlook.md "Connect to your Outlook mailbox. Manage your email, calendars, contacts, and more"
[project-onlinedoc]: ./connectors-create-api-projectonline.md "Connect to Microsoft Project Online. Manage your projects, tasks, resources, and more"
[querydoc]: ./connectors-native-query.md "Select and filter arrays with the Query action"
[recurrencedoc]:  ./connectors-native-recurrence.md "Trigger recurring actions for logic apps"
[rssdoc]: ./connectors-create-api-rss.md "Publish and retrieve feed items, trigger operations when a new item is published to an RSS feed."
[sendgriddoc]: ./connectors-create-api-sendgrid.md "Connect to SendGrid. Send email and manage receipient lists"
[sftpdoc]: ./connectors-create-api-sftp.md "Connect to your SFTP account. Upload, get, delete files, and more"
[slackdoc]: ./connectors-create-api-slack.md "Connect to Slack and post messages to Slack channels"
[smtpdoc]: ./connectors-create-api-smtp.md "Connect to a SMTP server and send email with attachments"
[sparkpostdoc]: ./connectors-create-api-sparkpost.md "Connects to SparkPost for communication"
[trellodoc]: ./connectors-create-api-trello.md "Connect to Trello. Manage your projects and organize anything with anyone"
[twiliodoc]: ./connectors-create-api-twilio.md "Connect to Twilio. Send and get messages, get available numbers, manage incoming phone numbers, and more"
[webhookdoc]: ./connectors-native-webhook.md "Add Webhook actions and triggers to your logic apps"
[wunderlistdoc]: ./connectors-create-api-wunderlist.md "Connect to Wunderlist. Manage your tasks and to-do lists, keep your life in sync, and more"
[yammerdoc]: ./connectors-create-api-yammer.md "Connect to Yammer. Post messages, get new messages, and more"
[youtubedoc]: ./connectors-create-api-youtube.md "Connect to YouTube. Manage your videos and channels"


<!--Icon references-->
[appFiguresicon]: ./media/apis-list/appfigures.png
[Asanaicon]: ./media/apis-list/asana.png
[Azure-Automation-icon]: ./media/apis-list/azure-automation.png
[AzureBlobStorageicon]: ./media/apis-list/azureblob.png
[Azure-Data-Lake-icon]: ./media/apis-list/azure-data-lake.png
[Azure-DocumentDBicon]: ./media/apis-list/azure-documentdb.png
[Azure-MLicon]: ./media/apis-list/azureml.png
[Azure-Resource-Manager-icon]: ./media/apis-list/azure-resource-manager.png
[Azure-Queues-icon]: ./media/apis-list/azure-queues.png
[Basecamp-3icon]: ./media/apis-list/basecamp.png
[Bitbucket-icon]: ./media/apis-list/bitbucket.png
[Bitlyicon]: ./media/apis-list/bitly.png
[BizTalk-Servericon]: ./media/apis-list/biztalk.png
[Bloggericon]: ./media/apis-list/blogger.png
[Boxicon]: ./media/apis-list/box.png
[Campfireicon]: ./media/apis-list/campfire.png
[Cognitive-Services-Text-Analyticsicon]: ./media/apis-list/cognitiveservicestextanalytics.png
[DB2icon]: ./media/apis-list/db2.png
[Dropboxicon]: ./media/apis-list/dropbox.png
[Dynamics-365icon]: ./media/apis-list/dynamicscrmonline.png
[Dynamics-365-for-Financialsicon]: ./media/apis-list/madeira.png
[Dynamics-365-for-Operationsicon]: ./media/apis-list/dynamicsax.png
[Easy-Redmineicon]: ./media/apis-list/easyredmine.png
[Event-Hubs-icon]: ./media/apis-list/eventhubs.png
[Facebookicon]: ./media/apis-list/facebook.png
[FTPicon]: ./media/apis-list/ftp.png
[GitHubicon]: ./media/apis-list/github.png
[Google-Calendaricon]: ./media/apis-list/googlecalendar.png
[Google-Driveicon]: ./media/apis-list/googledrive.png
[Google-Sheetsicon]: ./media/apis-list/googlesheet.png
[Google-Tasksicon]: ./media/apis-list/googletasks.png
[HideKeyicon]: ./media/apis-list/hidekey.png
[HipChaticon]: ./media/apis-list/hipchat.png
[Informixicon]: ./media/apis-list/informix.png
[Insightlyicon]: ./media/apis-list/insightly.png
[Instagramicon]: ./media/apis-list/instagram.png
[Instapapericon]: ./media/apis-list/instapaper.png
[JIRAicon]: ./media/apis-list/jira.png
[MailChimpicon]: ./media/apis-list/mailchimp.png
[Mandrillicon]: ./media/apis-list/mandrill.png
[Microsoft-Translatoricon]: ./media/apis-list/microsofttranslator.png
[MQicon]: ./media/apis-list/mq.png
[Office-365-Outlookicon]: ./media/apis-list/office365.png
[Office-365-Usersicon]: ./media/apis-list/office365users.png
[Office-365-Videoicon]: ./media/apis-list/office365video.png
[OneDriveicon]: ./media/apis-list/onedrive.png
[OneDrive-for-Businessicon]: ./media/apis-list/onedriveforbusiness.png
[Oracle-DB-icon]: ./media/apis-list/oracle-db.png
[Outlook.comicon]: ./media/apis-list/outlook.png
[PagerDutyicon]: ./media/apis-list/pagerduty.png
[Pinteresticon]: ./media/apis-list/pinterest.png
[Project-Onlineicon]: ./media/apis-list/projectonline.png
[Redmineicon]: ./media/apis-list/redmine.png
[RSSicon]: ./media/apis-list/rss.png
[Common-Data-Serviceicon]: ./media/apis-list/runtimeservice.png
[Salesforceicon]: ./media/apis-list/salesforce.png
[SAPicon]: ./media/apis-list/sap.png
[SendGridicon]: ./media/apis-list/sendgrid.png
[Service-Busicon]: ./media/apis-list/servicebus.png
[SFTPicon]: ./media/apis-list/sftp.png
[SharePointicon]: ./media/apis-list/sharepointonline.png
[Slackicon]: ./media/apis-list/slack.png
[Smartsheeticon]: ./media/apis-list/smartsheet.png
[SMTPicon]: ./media/apis-list/smtp.png
[SparkPosticon]: ./media/apis-list/sparkpost.png
[SQL-Servericon]: ./media/apis-list/sql.png
[Todoisticon]: ./media/apis-list/todoist.png
[Trelloicon]: ./media/apis-list/trello.png
[Twilioicon]: ./media/apis-list/twilio.png
[Twittericon]: ./media/apis-list/twitter.png
[Vimeoicon]: ./media/apis-list/vimeo.png
[Visual-Studio-Team-Servicesicon]: ./media/apis-list/visualstudioteamservices.png
[WordPressicon]: ./media/apis-list/wordpress.png
[Wunderlisticon]: ./media/apis-list/wunderlist.png
[Yammericon]: ./media/apis-list/yammer.png
[YouTubeicon]: ./media/apis-list/youtube.png

<!-- Primitive Icons -->
[API/Web-Appicon]: ./media/apis-list/api.png
[Azure-Functionsicon]: ./media/apis-list/function.png
[Delayicon]: ./media/apis-list/delay.png
[FileSystemIcon]: ./media/apis-list/filesystem.png
[HTTPicon]: ./media/apis-list/http.png
[HTTP-Requesticon]: ./media/apis-list/request.png
[HTTP-Responseicon]: ./media/apis-list/response.png
[HTTP-Swaggericon]: ./media/apis-list/http_swagger.png
[Nested-Logic-Appicon]: ./media/apis-list/workflow.png
[Recurrenceicon]: ./media/apis-list/recurrence.png
[Queryicon]: ./media/apis-list/query.png
[Webhookicon]: ./media/apis-list/webhook.png

<!-- EIP Icons -->
[as2icon]: ./media/apis-list/as2new.png
[x12icon]: ./media/apis-list/x12new.png
[flatfileicon]: ./media/apis-list/flatfileencoding.png
[flatfiledecodeicon]: ./media/apis-list/flatfiledecoding.png
[xmlvalidateicon]: ./media/apis-list/xmlvalidation.png
[xmltransformicon]: ./media/apis-list/xsltransform.png
