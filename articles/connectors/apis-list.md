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
	ms.date="07/15/2016"
	ms.author="deonhe"/>

# List of connectors

Select an icon to learn how to quickly leverage these connectors to build workflows that call these services.

## Standard connectors

|Connectors||||
|-----------|-----------|-----------|-----------|
|[![API Icon][API/Web-Appicon]<br/>**API/Web App**][API/Web-Appdoc]|[![API Icon][Azure-Blobicon]<br/>**Azure Blob**][Azure-Blobdoc]|[![API Icon][Azure~Functionsicon]<br/>**Azure<br/>Functions**][Azure~Functionsdoc]|[![API Icon][Boxicon]<br/>**Box**][Boxdoc]|
|[![API Icon][CRM-Onlineicon]<br/>**CRM Online**][CRM-Onlinedoc]|[![API Icon][Delayicon]<br/>**Delay**][Delaydoc]|[![API Icon][Dropboxicon]<br/>**Dropbox**][Dropboxdoc]|[![API Icon][Facebookicon]<br/>**Facebook**][Facebookdoc]|
|[![API Icon][FTPicon]<br/>**FTP**][FTPdoc]|[![API Icon][GitHubicon]<br/>**GitHub**][GitHubdoc]|[![API Icon][Google-Driveicon]<br/>**Google Drive**][Google-Drivedoc]|![API Icon][Google-Sheetsicon]<br/>**Google Sheets**|
|![API Icon][Google-Tasksicon]<br/>**Google Tasks**|![API Icon][Google~Calendaricon]<br/>**Google<br/>Calendar**|[![API Icon][HTTPicon]<br/>**HTTP**][HTTPdoc]|[![API Icon][HTTP-Swaggericon]<br/>**HTTP Swagger**][HTTP-Swaggerdoc]|
|[![API Icon][HTTP~Requesticon]<br/>**HTTP<br/>Request**][HTTP~Requestdoc]|[![API Icon][HTTP~Responseicon]<br/>**HTTP<br/>Response**][HTTP~Responsedoc]|![API Icon][Instagramicon]<br/>**Instagram**|[![API Icon][MailChimpicon]<br/>**MailChimp**][MailChimpdoc]|
|![API Icon][Mandrillicon]<br/>**Mandrill**|[![API Icon][Nested~Logic-Appicon]<br/>**Nested<br/>Logic App**][Nested~Logic-Appdoc]|[![API Icon][Office-365~Outlookicon]<br/>**Office 365<br/>Outlook**][Office-365~Outlookdoc]|[![API Icon][Office-365~Usersicon]<br/>**Office 365<br/>Users**][Office-365~Usersdoc]|
|[![API Icon][Office-365~Videoicon]<br/>**Office 365<br/>Video**][Office-365~Videodoc]|[![API Icon][OneDriveicon]<br/>**OneDrive**][OneDrivedoc]|[![API Icon][OneDrive-for~Businessicon]<br/>**OneDrive for<br/>Business**][OneDrive-for~Businessdoc]|[![API Icon][Outlookicon]<br/>**Outlook**][Outlookdoc]|
|[![API Icon][Project-Onlineicon]<br/>**Project Online**][Project-Onlinedoc]|[![API Icon][Queryicon]<br/>**Query**][Querydoc]|[![API Icon][Recurrenceicon]<br/>**Recurrence**][Recurrencedoc]|[![API Icon][RSSicon]<br/>**RSS**][RSSdoc]|
|[![API Icon][Salesforceicon]<br/>**Salesforce**][Salesforcedoc]|[![API Icon][SendGridicon]<br/>**SendGrid**][SendGriddoc]|[![API Icon][Service-Busicon]<br/>**Service Bus**][Service-Busdoc]|[![API Icon][SFTPicon]<br/>**SFTP**][SFTPdoc]|
|[![API Icon][SharePointicon]<br/>**SharePoint**][SharePointdoc]|[![API Icon][Slackicon]<br/>**Slack**][Slackdoc]|[![API Icon][SMTPicon]<br/>**SMTP**][SMTPdoc]|![API Icon][SparkPosticon]<br/>**SparkPost**|
|[![API Icon][SQLicon]<br/>**SQL**][SQLdoc]|[![API Icon][Translatoricon]<br/>**Translator**][Translatordoc]|[![API Icon][Trelloicon]<br/>**Trello**][Trellodoc]|[![API Icon][Twilioicon]<br/>**Twilio**][Twiliodoc]|
|[![API Icon][Twittericon]<br/>**Twitter**][Twitterdoc]|[![API Icon][Webhookicon]<br/>**Webhook**][Webhookdoc]|[![API Icon][Wunderlisticon]<br/>**Wunderlist**][Wunderlistdoc]|[![API Icon][Yammericon]<br/>**Yammer**][Yammerdoc]|
|![API Icon][YouTubeicon]<br/>**YouTube**||||

> [AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic). You can immediately create a short-lived starter Logic app in App Service. No credit cards required; no commitments.

## Enterprise Integration Pack (EIP) connectors
Use the EIP connectors to create Logic apps for B2B scenarios that include EAI and EDI.  
 
|EIP connectors ||||
|-----------|-----------|-----------|-----------|
|[![API Icon][as2icon]<br/>**AS2</br>encode/decode**][as2doc]|[![API Icon][x12icon]<br/>**X12</br>encode/decode**][x12Doc]|[![API Icon][xmlvalidateicon]<br/>**XML <br/>validation**][xmlvalidatedoc]|[![API Icon][xmltransformicon]<br/>**XML<br/> transform**][xmltransformdoc]|
|[![API Icon][flatfileicon]<br/>**Flat file</br>encode**][flatfiledoc]|[![API Icon][flatfiledecodeicon]<br/>**Flat file</br>decode**][flatfiledecodedoc]|||

<!-- TODO: Add Functions, App Service, and Nested Workflow Icons -->
### Connectors can be triggers
Several connectors provide triggers that can notify your app when specific events occur. For example, the FTP connector has the OnUpdatedFile trigger. You can build an either a Logic app, PowerApp or Flow that listens to this trigger and takes an action whenever the trigger is fired.

There are two types of triggers:  

* Poll Triggers: These triggers poll your service at a specified frequency to check for new data. When new data is available, a new instance of your app runs with the data as input. To prevent the same data from being consumed multiple times, the trigger may clean-up data that has been read and passed to your app.
* Push Triggers: These triggers listen for data on an endpoint or for an event to occur. Then, triggers a new instance of your app. The twitter connector is one such example.

### Connectors can be actions
Connectors can also be used as actions within your apps. Actions are useful for looking up data which can then be used in the execution of your app. For example, you may need to look up customer data from a SQL database when processing an order. Or, you may need to write, update or delete data in a destination table. You can do this using the actions provided by the connectors. Actions map to operations that are defined in the Swagger metadata.

## Next Steps

- [Build a logic app now](../app-service-logic/app-service-logic-create-a-logic-app.md)  
- [Create a custom connector](../app-service-logic/app-service-logic-create-api-app.md)
- [Monitor your logic apps](../app-service-logic/app-service-logic-monitor-your-logic-apps.md)

<!--Connectors Documentation-->
[azure-blobdoc]: ./connectors-create-api-azureblobstorage.md "Connect to Azure blob to manage files in your blob container."
[boxDoc]: ./connectors-create-api-box.md "Connects to Box and can upload, get, delete, list, and more file tasks."
[crm-onlinedoc]: ./connectors-create-api-crmonline.md "Connect to Dynamics CRM Online and do more with your CRM Online data."
[dropboxdoc]: ./connectors-create-api-dropbox.md "Connect to Dropbox and can get, delete, list, and more file tasks."
[facebookdoc]: ./connectors-create-api-facebook.md "Connect to Facebook to post to a timeline, get a page feed, and more."
[ftpdoc]: ./connectors-create-api-ftp.md "Connects to an FTP / FTPS server and do different FTP tasks, including uploading, getting, deleting files, and more."
[google-drivedoc]: ./connectors-create-api-googledrive.md "Connect to GoogleDrive and interact with your data."
[translatordoc]: ./connectors-create-api-microsofttranslator.md
[office-365~outlookdoc]: ./connectors-create-api-office365-outlook.md "The Office 365 Connector can send and receive emails, manage your calendar, and manage your contacts using your Office 365 account."
[office-365~usersdoc]: ./connectors-create-api-office365-users.md
[office-365~videodoc]: ./connectors-create-api-office365-video.md
[onedrivedoc]: ./connectors-create-api-onedrive.md "Connects to your personal Microsoft OneDrive and upload, delete, list files, and more."
[onedrive-for~businessdoc]: ./connectors-create-api-onedriveforbusiness.md "Connects to your business Microsoft OneDrive and uploads, deletes, lists your files, and more."
[outlookdoc]: ./connectors-create-api-outlook.md "Connect to your Outlook mailbox and access your email and more."
[project-onlinedoc]: ./connectors-create-api-projectonline.md "Connects to Microsoft Project Online."
[rssdoc]: ./connectors-create-api-rss.md "RSS connector allows the users to publish and retrieve feed items. It also allows the users to trigger operations when a new item is published to the feed."
[salesforcedoc]: ./connectors-create-api-salesforce.md "Connect to your Salesforce account and manage  accounts, leads, opportunities, and more."
[sendgriddoc]: ./connectors-create-api-sendgrid.md "Connects to Microsoft Project Online."
[service-busdoc]: ./connectors-create-api-servicebus.md "Can send messages from Service Bus Queues and Topics and receive messages from Service Bus Queues and Subscriptions."
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
[httpdoc]: ./connectors-native-http.md "HTTP connector to make HTTP calls."
[http~requestdoc]: ./connectors-native-reqres.md "Request and Response actions."
[http~responsedoc]: ./connectors-native-reqres.md "Request and Response actions."
[delaydoc]: ./connectors-native-delay.md "Learn about the delay action."
[http-swaggerdoc]: ./connectors-native-httpswagger.md "HTTP + Swagger connector to make HTTP calls."
[querydoc]: ./connectors-native-query.md "Query action to select and filter arrays."
[webhookdoc]: ./connectors-native-webhook.md "Webhook action and trigger for logic apps."
[azure~functionsdoc]: ../app-service-logic/app-service-logic-azure-functions.md "Integrate logic apps with Azure Functions."
[api/web-appdoc]: ../app-service-logic/app-service-logic-custom-hosted-api.md "Integrate logic apps with App Service API Apps."
[nested~logic-appdoc]: ../app-service-logic/app-service-logic-http-endpoint.md "Integrate logic apps with a nested workflow."
[recurrencedoc]:  ./connectors-native-recurrence.md "Recurrence trigger for logic apps."
[google-sheetsdoc]: ./connectors-create-api-googlesheet.md "Connects to Google Sheets and can modify sheets."
[google-tasksdoc]: ./connectors-create-api-googletasks.md "Connects to Google Tasks and can manage tasks."
[google~calendardoc]: ./connectors-create-api-googlecalendar.md "Connects to Google Calendar and can manage calendar."
[instagramdoc]: ./connectors-create-api-instagram.md "Connects to Instagram and can trigger or act on events."
[mandrilldoc]: ./connectors-create-api-mandrill.md "Connects to Mandrill and can be used for communication."
[youtubedoc]: ./connectors-create-api-youtube.md "Connects to YouTube and can interact with videos and channels."
[sparkpostdoc]: ./connectors-create-api-sparkpost.md "Connects to SparkPost and can be used for communication."

<!--Icon references-->
[Azure-Blobicon]: ./media/apis-list/azureblob.png
[Boxicon]: ./media/apis-list/box.png
[FTPicon]: ./media/apis-list/ftp.png
[GitHubicon]: ./media/apis-list/github.png
[CRM-Onlineicon]: ./media/apis-list/dynamicscrmonline.png
[Dropboxicon]: ./media/apis-list/dropbox.png
[Facebookicon]: ./media/apis-list/facebook.png
[Google-Driveicon]: ./media/apis-list/googledrive.png
[MailChimpicon]: ./media/apis-list/mailchimp.png
[Translatoricon]: ./media/apis-list/microsofttranslator.png
[Office-365~Outlookicon]: ./media/apis-list/office365.png
[Office-365~Usersicon]: ./media/apis-list/office365.png
[Office-365~Videoicon]: ./media/apis-list/sharepointonline.png
[OneDriveicon]: ./media/apis-list/onedrive.png
[OneDrive-for~Businessicon]: ./media/apis-list/onedriveforbusiness.png
[Outlookicon]: ./media/apis-list/outlook.png
[Project-Onlineicon]: ./media/apis-list/projectonline.png
[RSSicon]: ./media/apis-list/rss.png
[Salesforceicon]: ./media/apis-list/salesforce.png
[SendGridicon]: ./media/apis-list/sendgrid.png
[Service-Busicon]: ./media/apis-list/servicebus.png
[SFTPicon]: ./media/apis-list/sftp.png
[SharePointicon]: ./media/apis-list/sharepointonline.png
[Slackicon]: ./media/apis-list/slack.png
[SMTPicon]: ./media/apis-list/smtp.png
[SQLicon]: ./media/apis-list/sql.png
[Trelloicon]: ./media/apis-list/trello.png
[Twilioicon]: ./media/apis-list/twilio.png
[Twittericon]: ./media/apis-list/twitter.png
[Wunderlisticon]: ./media/apis-list/wunderlist.png
[Yammericon]: ./media/apis-list/yammer.png
[Google~Calendaricon]: ./media/apis-list/googlecalendar.png
[Google-Tasksicon]: ./media/apis-list/googletasks.png
[Google-Sheetsicon]: ./media/apis-list/googlesheet.png
[Mandrillicon]: ./media/apis-list/mandrill.png
[SparkPosticon]: ./media/apis-list/sparkpost.png
[Instagramicon]: ./media/apis-list/instagram.png
[YouTubeicon]: ./media/apis-list/youtube.png
[HTTPicon]: ./media/apis-list/http.png
[HTTP~Requesticon]: ./media/apis-list/request.png
[HTTP~Responseicon]: ./media/apis-list/response.png
[Delayicon]: ./media/apis-list/delay.png
[HTTP-Swaggericon]: ./media/apis-list/http_swagger.png
[Queryicon]: ./media/apis-list/query.png
[Webhookicon]: ./media/apis-list/webhook.png
[Azure~Functionsicon]: ./media/apis-list/function.png
[API/Web-Appicon]: ./media/apis-list/api.png
[Nested~Logic-Appicon]: ./media/apis-list/workflow.png
[Recurrenceicon]: ./media/apis-list/recurrence.png

<!-- EIP Icons -->
[as2icon]: ./media/apis-list/as2new.png
[x12icon]: ./media/apis-list/x12new.png
[flatfileicon]: ./media/apis-list/flatfileencoding.png
[flatfiledecodeicon]: ./media/apis-list/flatfiledecoding.png
[xmlvalidateicon]: ./media/apis-list/xmlvalidation.png
[xmltransformicon]: ./media/apis-list/xsltransform.png