---
title: Connectors for Azure Logic Apps | Microsoft Docs
description: Automate workflows with connectors for Azure Logic Apps, including built-in, managed, on-premises, integration account, and enterprise connectors
services: logic-apps
ms.service: logic-apps
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.suite: integration
ms.topic: article
ms.date: 08/23/2018
---

# Connectors for Azure Logic Apps

Connectors play an integral part when you create automated workflows with Azure Logic Apps. 
By using connectors in your logic apps, you expand the capabilities for your on-premises 
and cloud apps to perform tasks with the data that you create and already have. 

While Logic Apps offers [~200+ connectors](https://docs.microsoft.com/connectors), 
this article describes popular and more commonly used connectors that are successfully 
used by thousands of apps and millions of executions for processing data and information. 
Connectors are available as either built-ins or managed connectors. 

> [!NOTE]
> For the full list of connectors and each connector's reference information, 
> such as actions, any triggers, and limits, you can find the full list 
> under the [Connectors overview](https://docs.microsoft.com/connectors).

* [**Built-ins**](#built-ins): These built-in actions and triggers help you 
create logic apps that run on custom schedules, communicate with other endpoints, 
receive and respond to requests, and call Azure functions, Azure API Apps (Web Apps), 
your own APIs managed and published with Azure API Management, and nested logic apps 
that can receive requests. You can also use built-in actions that help you 
organize and control your logic app's workflow, and also work with data.

* **Managed connectors**: These connectors provide triggers and actions 
for accessing other services and systems. Some connectors require that 
you first create connections that are managed by Azure Logic Apps. 
Managed connectors are organized into these groups:

  |   |   |
  |---|---|
  | [**Managed API connectors**](#managed-api-connectors) | Create logic apps that use services such as Azure Blob Storage, Office 365, Dynamics, Power BI, OneDrive, Salesforce, SharePoint Online, and many more. | 
  | [**On-premises connectors**](#on-premises-connectors) | After you install and set up the [on-premises data gateway][gateway-doc], these connectors help your logic apps access on-premises systems such as SQL Server, SharePoint Server, Oracle DB, file shares, and others. | 
  | [**Integration account connectors**](#integration-account-connectors) | Available when you create and pay for an integration account, these connectors transform and validate XML, encode and decode flat files, and process business-to-business (B2B) messages with AS2, EDIFACT, and X12 protocols. | 
  | [**Enterprise connectors**](#enterprise-connectors) | Provide access to enterprise systems such as SAP and IBM MQ for an additional cost. |
  ||| 

  For example, if you're using Microsoft BizTalk Server, your logic apps 
  can connect to and communicate with your BizTalk Server by using the 
  [BizTalk Server connector](#on-premises-connectors). 
  You can then extend or perform BizTalk-like operations in your logic apps by 
  using the [integration account connectors](#integration-account-connectors). 

> [!NOTE] 
> For the full list of connectors and each connector's reference information, 
> such as actions and any triggers, which are defined by a Swagger description, 
> plus any limits, you can find the full list under the 
> [Connectors overview](/connectors/). For pricing information, see 
> [Logic Apps pricing details](https://azure.microsoft.com/pricing/details/logic-apps/) 
> and the [Logic Apps pricing model](../logic-apps/logic-apps-pricing.md). 

<a name="built-ins"></a>

## Built-ins

Logic Apps provides built-in triggers and actions 
so you can create schedule-based workflows, 
help your logic apps communicate with other apps and services, 
control the workflow through your logic apps, 
and manage or manipulate data. 

|   |   |   |   | 
|---|---|---|---| 
| [![API icon][schedule-icon]<br/>**Schedule**][recurrence-doc] | - Run your logic app on a specified schedule, ranging from basic to complex recurrences, with the **Recurrence** trigger. <p>- Pause your logic app for a specified duration with the **Delay** action. <p>- Pause your logic app until the specified date and time with the **Delay until** action. | [![API icon][http-icon]<br/>**HTTP**][http-doc] | Communicate with any endpoint over HTTP with both triggers and actions for HTTP, HTTP + Swagger, and HTTP + Webhook. | 
| [![API icon][http-request-icon]<br/>**Request**][http-request-doc] | - Make your logic app callable from other apps or services, trigger on Event Grid resource events, or trigger on responses to Azure Security Center alerts with the **Request** trigger. <p>- Send responses to an app or service with the **Response** action. | [![API icon][batch-icon]<br/>**Batch**][batch-doc] | - Process messages in batches with the **Batch messages** trigger. <p>- Call logic apps that have existing batch triggers with the **Send messages to batch** action. | 
| [![API icon][azure-functions-icon]<br/>**Azure Functions**][azure-functions-doc] | Call Azure functions that run custom code snippets (C# or Node.js) from your logic apps. | [![API icon][azure-api-management-icon]</br>**Azure API Management**][azure-api-management-doc] | Call triggers and actions defined by your own APIs that you manage and publish with Azure API Management. | 
| [![API icon][azure-app-services-icon]<br/>**Azure App Services**][azure-app-services-doc] | Call Azure API Apps, or Web Apps, hosted on Azure App Service. The triggers and actions defined by these apps appear like any other first-class triggers and actions when Swagger is included. | [![API icon][azure-logic-apps-icon]<br/>**Azure<br/>Logic Apps**][nested-logic-app-doc] | Call other logic apps that start with a Request trigger. | 
||||| 

### Control workflow

Here are built-in actions for structuring and 
controlling the actions in your logic app's workflow:

|   |   |   |   | 
|---|---|---|---| 
| [![Built-in Icon][condition-icon]<br/>**Condition**][condition-doc] | Evaluate a condition and run different actions based on whether the condition is true or false. | [![Built-in Icon][for-each-icon]</br>**For each**][for-each-doc] | Perform the same actions on every item in an array. | 
| [![Built-in Icon][scope-icon]<br/>**Scope**][scope-doc] | Group actions into *scopes*, which get their own status after the actions in the scope finish running. | [![Built-in Icon][switch-icon]</br>**Switch**][switch-doc] | Group actions into *cases*, which are assigned unique values except for the default case. Run only that case whose assigned value matches the result from an expression, object, or token. If no matches exist, run the default case. | 
| [![Built-in Icon][terminate-icon]<br/>**Terminate**][terminate-doc] | Stop an actively running logic app workflow. | [![Built-in Icon][until-icon]<br/>**Until**][until-doc] | Repeat actions until the specified condition is true or some state has changed. | 
||||| 

### Manage or manipulate data

Here are built-in actions for working with data outputs and their formats:  

|   |   | 
|---|---| 
| ![Built-in Icon][data-operations-icon]<br/>**Data Operations** | Perform operations with data: <p>- **Compose**: Create a single output from multiple inputs with various types. <br>- **Create CSV table**: Create a comma-separated-value (CSV) table from an array with JSON objects. <br>- **Create HTML table**: Create an HTML table from an array with JSON objects. <br>- **Filter array**: Create an array from items in another array that meet your criteria. <br>- **Join**: Create a string from all items in an array and separate those items with the specified delimiter. <br>- **Parse JSON**: Create user-friendly tokens from properties and their values in JSON content so you can use those properties in your workflow. <br>- **Select**: Create an array with JSON objects by transforming items or values in another array and mapping those items to specified properties. | 
| ![Built-in Icon][date-time-icon]<br/>**Date Time** | Perform operations with timestamps: <p>- **Add to time**: Add the specified number of units to a timestamp. <br>- **Convert time zone**: Convert a timestamp from the source time zone to the target time zone. <br>- **Current time**: Return the current timestamp as a string. <br>- **Get future time**: Return the current timestamp plus the specified time units. <br>- **Get past time**: Return the current timestamp minus the specified time units. <br>- **Subtract from time**: Subtract a number of time units from a timestamp. |
| [![Built-in Icon][variables-icon]<br/>**Variables**][variables-doc] | Perform operations with variables: <p>- **Append to array variable**: Insert a value as the last item in an array stored by a variable. <br>- **Append to string variable**: Insert a value as the last character in a string stored by a variable. <br>- **Decrement variable**: Decrease a variable by a constant value. <br>- **Increment variable**: Increase a variable by a constant value. <br>- **Initialize variable**: Create a variable and declare its data type and initial value. <br>- **Set variable**: Assign a different value to an existing variable. |
|  |  | 

<a name="managed-api-connectors"></a>

## Managed API connectors

Here are the more popular connectors for automating tasks, 
processes, and workflows with these services or systems:

|   |   |   |   | 
|---|---|---|---| 
| [![API icon][azure-service-bus-icon]<br/>**Azure Service Bus**][azure-service-bus-doc] | Manage asynchronous messages, sessions, and topic subscriptions with the most commonly used connector in Logic Apps. | [![API icon][sql-server-icon]<br/>**SQL Server**][sql-server-doc] | Connect to your SQL Server on premises or an Azure SQL Database in the cloud so you can manage records, run stored procedures, or perform queries. | 
| [![API icon][office-365-outlook-icon]<br/>**Office 365<br/>Outlook**][office-365-outlook-doc] | Connect to your Office 365 email account so you can create and manage emails, tasks, calendar events and meetings, contacts, requests, and more. | [![API icon][azure-blob-storage-icon]<br/>**Azure Blob<br/>Storage**][azure-blob-storage-doc] | Connect to your storage account so you can create and manage blob content. | 
| [![API icon][sftp-icon]<br/>**SFTP**][sftp-doc] | Connect to SFTP servers you can access from the internet so you can work with your files and folders. | [![API icon][sharepoint-online-icon]<br/>**SharePoint<br/>Online**][sharepoint-online-doc] | Connect to SharePoint Online so you can manage files, attachments, folders, and more. | 
| [![API icon][dynamics-365-icon]<br/>**Dynamics 365<br/>CRM Online**][dynamics-365-doc] | Connect to your Dynamics 365 account so you can create and manage records, items, and more. | [![API icon][ftp-icon]<br/>**FTP**][ftp-doc] | Connect to FTP servers you can access from the internet so you can work with your files and folders. | 
| [![API icon][salesforce-icon]<br/>**Salesforce**][salesforce-doc] | Connect to your Salesforce account so you can create and manage items such as records, jobs, objects, and more. | [![API icon][twitter-icon]<br/>**Twitter**][twitter-doc] | Connect to your Twitter account so you can manage tweets, followers, your timeline, and more. Save your tweets to SQL, Excel, or SharePoint. | 
| [![API icon][azure-event-hubs-icon]<br/>**Azure Event Hubs**][azure-event-hubs-doc] | Consume and publish events through an Event Hub. For example, get output from your logic app with Event Hubs, and then send that output to a real-time analytics provider. | [![API icon][azure-event-grid-icon]<br/>**Azure Event**</br>**Grid**][azure-event-grid-doc] | Monitor events published by an Event Grid, for example, when Azure resources or third-party resources change. | 
||||| 

<a name="on-premises-connectors"></a>

## On-premises connectors 

Here are some commonly used connectors that provide 
access to data and resources in on-premises systems. 
Before you can create a connection to an on-premises system, 
you must first [download, install, and set up an on-premises data gateway][gateway-doc]. 
This gateway provides a secure communication channel without 
having to set up the necessary network infrastructure. 

|   |   |   |   |   | 
|---|---|---|---|---| 
| ![API icon][biztalk-server-icon]<br/>**BizTalk**</br> **Server** | [![API icon][file-system-icon]<br/>**File</br> System**][file-system-doc] | [![API icon][ibm-db2-icon]<br/>**IBM DB2**][ibm-db2-doc] | [![API icon][ibm-informix-icon]<br/>**IBM**</br> **Informix**][ibm-informix-doc] | ![API icon][mysql-icon]<br/>**MySQL** | 
| [![API icon][oracle-db-icon]<br/>**Oracle DB**][oracle-db-doc] | ![API icon][postgre-sql-icon]<br/>**PostgreSQL** | [![API icon][sharepoint-server-icon]<br/>**SharePoint</br> Server**][sharepoint-server-doc] | [![API icon][sql-server-icon]<br/>**SQL</br> Server**][sql-server-doc] | ![API icon][teradata-icon]<br/>**Teradata** | 
||||| 

<a name="integration-account-connectors"></a>

## Integration account connectors 

Here are connectors for building business-to-business (B2B) 
solutions with your logic apps when you create and pay for an 
[integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md), 
which is available through the Enterprise Integration Pack (EIP) in Azure. 
With this account, you can create and store B2B artifacts such as trading partners, 
agreements, maps, schemas, certificates, and so on. To use these artifacts, 
associate your logic apps with your integration account. If you currently 
use BizTalk Server, these connectors might seem familiar already.

|   |   |   |   | 
|---|---|---|---| 
| [![API icon][as2-icon]<br/>**AS2</br> decoding**][as2-decode-doc] | [![API icon][as2-icon]<br/>**AS2</br> encoding**][as2-encode-doc] | [![API icon][edifact-icon]<br/>**EDIFACT</br> decoding**][edifact-decode-doc] | [![API icon][edifact-icon]<br/>**EDIFACT</br> encoding**][edifact-encode-doc] | 
| [![API icon][flat-file-decode-icon]<br/>**Flat file</br> decoding**][flat-file-decode-doc] | [![API icon][flat-file-encode-icon]<br/>**Flat file</br> encoding**][flat-file-encode-doc] | [![API icon][integration-account-icon]<br/>**Integration<br/>account**][integration-account-doc] | [![API icon][liquid-icon]<br/>**Liquid**</br>**transforms**][json-liquid-transform-doc] | 
| [![API icon][x12-icon]<br/>**X12</br> decoding**][x12-decode-doc] | [![API icon][x12-icon]<br/>**X12</br> encoding**][x12-encode-doc] | [![API icon][xml-transform-icon]<br/>**XML**</br>**transforms**][xml-transform-doc] | [![API icon][xml-validate-icon]<br/>**XML <br/>validation**][xml-validate-doc] |  
||||| 

<a name="enterprise-connectors"></a>

## Enterprise connectors

Your logic apps can access enterprise systems, such as SAP and IBM MQ:

|   |   | 
|---|---| 
| [![API icon][ibm-mq-icon]<br/>**IBM MQ**][ibm-mq-doc] | [![API icon][sap-icon]<br/>**SAP**][sap-connector-doc] |
||| 

## More about triggers and actions

Some connectors provide *triggers* that notify your logic app when specific events happen. 
So when these events happen, the trigger creates and runs an instance of your logic app. 
For example, the FTP connector provides a "When a file is added or modified" trigger 
that starts your logic app when a file gets updated. 

Logic Apps provides these kinds of triggers:  

* *Polling triggers*: These triggers poll your service 
at a specified frequency and checks for new data. 

  When new data is available, a new instance of your logic app 
  gets created and runs with the data that's passed in as input. 

* *Push triggers*: These triggers listen for new data at an endpoint 
or for an event to happen, which creates and runs new instance of your logic app.

* *Recurrence trigger*: This trigger creates and runs an instance 
of your logic app based on a specified schedule.

Connectors also provide *actions* that perform tasks in your logic app's workflow. 
For example, your logic app can read data and use this data in later steps of your logic app. 
More specifically, your logic app can find customer data from a SQL database, 
and process this data later in your logic app's workflow. 

For more about triggers and actions, see the 
[Connectors overview](connectors-overview.md). 

## Custom APIs and connectors 

To call APIs that run custom code or aren't available as connectors, 
you can extend the Logic Apps platform by 
[creating custom API Apps](../logic-apps/logic-apps-create-api-app.md). 
You can also [create custom connectors](../logic-apps/custom-connector-overview.md) 
for *any* REST or SOAP-based APIs, which make those APIs 
available to any logic app in your Azure subscription.
To make custom API Apps or connectors public for anyone to use in Azure, 
you can [submit connectors for Microsoft certification](../logic-apps/custom-connector-submit-certification.md).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

* To submit or vote on ideas for Azure Logic Apps and connectors, 
visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

* Are the docs missing articles or details you think are important? 
If yes, you can help by adding to the existing articles or by writing your own. 
The documentation is open source and hosted on GitHub. 
Get started at the Azure documentation's [GitHub repository](https://github.com/Microsoft/azure-docs). 

## Next steps

* Find the [connectors' full list](https://docs.microsoft.com/connectors)
* [Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md)
* [Create custom connectors for logic apps](https://docs.microsoft.com/connectors/custom-connectors/)
* [Create custom APIs for logic apps](../logic-apps/logic-apps-create-api-app.md)

<!--Misc doc links-->
[gateway-doc]: ../logic-apps/logic-apps-gateway-connection.md "Connect to data sources on-premises from logic apps with on-premises data gateway"

<!--Built-ins doc links-->
[azure-functions-doc]: ../logic-apps/logic-apps-azure-functions.md "Integrate logic apps with Azure Functions"
[azure-api-management-doc]: ../api-management/get-started-create-service-instance.md "Create an Azure API Management service instance for managing and publishing your APIs"
[azure-app-services-doc]: ../logic-apps/logic-apps-custom-hosted-api.md "Integrate logic apps with App Service API Apps"
[azure-service-bus-doc]: ./connectors-create-api-servicebus.md "Send messages from Service Bus Queues and Topics and receive messages from Service Bus Queues and Subscriptions"
[batch-doc]: ../logic-apps/logic-apps-batch-process-send-receive-messages.md "Process messages in groups, or as batches"
[condition-doc]: ../logic-apps/logic-apps-control-flow-conditional-statement.md "Evaluate a condition and run different actions based on whether the condition is true or false"
[delay-doc]: ./connectors-native-delay.md "Perform delayed actions"
[for-each-doc]: ../logic-apps/logic-apps-control-flow-loops.md#foreach-loop "Perform the same actions on every item in an array"
[http-doc]: ./connectors-native-http.md "Make HTTP calls with the HTTP connector"
[http-request-doc]: ./connectors-native-reqres.md "Add actions for HTTP requests and responses to your logic apps"
[http-response-doc]: ./connectors-native-reqres.md "Add actions for HTTP requests and responses to your logic apps"
[http-swagger-doc]: ./connectors-native-http-swagger.md "Make HTTP calls with HTTP + Swagger connector"
[http-webook-doc]: ./connectors-native-webhook.md "Add HTTP webhook actions and triggers to your logic apps"
[nested-logic-app-doc]: ../logic-apps/logic-apps-http-endpoint.md "Integrate logic apps with nested workflows"
[query-doc]: ./connectors-native-query.md "Select and filter arrays with the Query action"
[recurrence-doc]:  ./connectors-native-recurrence.md "Trigger recurring actions for logic apps"
[scope-doc]: ../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md "Organize actions into groups, which get their own status after the actions in group finish running" 
[switch-doc]: ../logic-apps/logic-apps-control-flow-switch-statement.md "Organize actions into cases, which are assigned unique values. Run only the case whose value matches the result from an expression, object, or token. If no matches exist, run the default case"
[terminate-doc]: ../logic-apps/logic-apps-workflow-actions-triggers.md#terminate-action "Stop or cancel an actively running workflow for your logic app"
[until-doc]: ../logic-apps/logic-apps-control-flow-loops.md#until-loop "Repeat actions until the specified condition is true or some state has changed"
[variables-doc]: ../logic-apps/logic-apps-create-variables-store-values.md "Perform operations with variables, such as initialize, set, increment, decrement, and append to string or array variable"

<!--Managed API doc links-->
[azure-blob-storage-doc]: ./connectors-create-api-azureblobstorage.md "Manage files in your blob container with Azure blob storage connector"
[azure-event-grid-doc]: ../event-grid/monitor-virtual-machine-changes-event-grid-logic-app.md " Monitor events published by an Event Grid, for example, when Azure resources or third-party resources change"
[azure-event-hubs-doc]: ./connectors-create-api-azure-event-hubs.md "Connect to Azure Event Hubs. Receive and send events between logic apps and Event Hubs"
[box-doc]: ./connectors-create-api-box.md "Connect to Box. Upload, get, delete, list your files, and more"
[dropbox-doc]: ./connectors-create-api-dropbox.md "Connect to Dropbox. Upload, get, delete, list your files, and more"
[dynamics-365-doc]: ./connectors-create-api-crmonline.md "Connect to Dynamics CRM Online so you can work with CRM Online data"
[facebook-doc]: ./connectors-create-api-facebook.md "Connect to Facebook. Post to a timeline, get a page feed, and more"
[file-system-doc]: ../logic-apps/logic-apps-using-file-connector.md "Connect to an on-premises file system"
[ftp-doc]: ./connectors-create-api-ftp.md "Connect to an FTP / FTPS server for FTP tasks, like uploading, getting, deleting files, and more"
[github-doc]: ./connectors-create-api-github.md "Connect to GitHub and track issues"
[google-calendar-doc]: ./connectors-create-api-googlecalendar.md "Connects to Google Calendar and can manage calendar."
[google-drive-doc]: ./connectors-create-api-googledrive.md "Connect to GoogleDrive so you can work with your data"
[google-sheets-doc]: ./connectors-create-api-googlesheet.md "Connect to Google Sheets so you can modify your sheets"
[google-tasks-doc]: ./connectors-create-api-googletasks.md "Connects to Google Tasks so you can manage your tasks"
[ibm-db2-doc]: ./connectors-create-api-db2.md "Connect to IBM DB2 in the cloud or on-premises. Update a row, get a table, and more"
[ibm-informix-doc]: ./connectors-create-api-informix.md "Connect to Informix in the cloud or on-premises. Read a row, list the tables, and more"
[ibm-mq-doc]: ./connectors-create-api-mq.md "Connect to IBM MQ on-premises or in Azure to send and receive messages"
[instagram-doc]: ./connectors-create-api-instagram.md "Connect to Instagram. Trigger or act on events"
[mailchimp-doc]: ./connectors-create-api-mailchimp.md "Connect to your MailChimp account. Manage and automate mails"
[mandrill-doc]: ./connectors-create-api-mandrill.md "Connect to Mandrill for communication"
[microsoft-translator-doc]: ./connectors-create-api-microsofttranslator.md "Connect to Microsoft Translator. Translate text, detect languages, and more" 
[office-365-outlook-doc]: ./connectors-create-api-office365-outlook.md "Connect to your Office 365 account. Send and receive emails, manage your calendar and contacts, and more"
[office-365-users-doc]: ./connectors-create-api-office365-users.md 
[office-365-video-doc]: ./connectors-create-api-office365-video.md "Get video info, video lists and channels, and playback URLs for Office 365 videos"
[onedrive-doc]: ./connectors-create-api-onedrive.md "Connect to your personal Microsoft OneDrive. Upload, delete, list files, and more"
[onedrive-for-business-doc]: ./connectors-create-api-onedriveforbusiness.md "Connect to your business Microsoft OneDrive. Upload, delete, list your files, and more"
[oracle-db-doc]: ./connectors-create-api-oracledatabase.md "Connect to an Oracle database to add, insert, delete rows, and more"
[outlook.com-doc]: ./connectors-create-api-outlook.md "Connect to your Outlook mailbox. Manage your email, calendars, contacts, and more"
[project-online-doc]: ./connectors-create-api-projectonline.md "Connect to Microsoft Project Online. Manage your projects, tasks, resources, and more"
[rss-doc]: ./connectors-create-api-rss.md "Publish and retrieve feed items, trigger operations when a new item is published to an RSS feed."
[salesforce-doc]: ./connectors-create-api-salesforce.md "Connect to your Salesforce account. Manage accounts, leads, opportunities, and more"
[sap-connector-doc]: ../logic-apps/logic-apps-using-sap-connector.md "Connect to an on-premises SAP system"
[sendgrid-doc]: ./connectors-create-api-sendgrid.md "Connect to SendGrid. Send email and manage recipient lists"
[sftp-doc]: ./connectors-create-api-sftp.md "Connect to your SFTP account. Upload, get, delete files, and more"
[sharepoint-server-doc]: ./connectors-create-api-sharepointserver.md "Connect to SharePoint on-premises server. Manage documents, list items, and more"
[sharepoint-online-doc]: ./connectors-create-api-sharepointonline.md "Connect to SharePoint Online. Manage documents, list items, and more"
[slack-doc]: ./connectors-create-api-slack.md "Connect to Slack and post messages to Slack channels"
[smtp-doc]: ./connectors-create-api-smtp.md "Connect to an SMTP server and send email with attachments"
[sparkpost-doc]: ./connectors-create-api-sparkpost.md "Connects to SparkPost for communication"
[sql-server-doc]: ./connectors-create-api-sqlazure.md "Connect to Azure SQL Database or SQL Server. Create, update, get, and delete entries in a SQL database table."
[trello-doc]: ./connectors-create-api-trello.md "Connect to Trello. Manage your projects and organize anything with anyone"
[twilio-doc]: ./connectors-create-api-twilio.md "Connect to Twilio. Send and get messages, get available numbers, manage incoming phone numbers, and more"
[twitter-doc]: ./connectors-create-api-twitter.md "Connect to Twitter. Get timelines, post tweets, and more"
[wunderlist-doc]: ./connectors-create-api-wunderlist.md "Connect to Wunderlist. Manage your tasks and to-do lists, keep your life in sync, and more"
[yammer-doc]: ./connectors-create-api-yammer.md "Connect to Yammer. Post messages, get new messages, and more"
[youtube-doc]: ./connectors-create-api-youtube.md "Connect to YouTube. Manage your videos and channels"

<!--Enterprise Intregation Pack doc links-->
[as2-doc]: ../logic-apps/logic-apps-enterprise-integration-as2.md "Learn about enterprise integration AS2."
[as2-decode-doc]: ../logic-apps/logic-apps-enterprise-integration-as2-decode.md "Learn about enterprise integration AS2 decode"
[as2-encode-doc]:../logic-apps/logic-apps-enterprise-integration-as2-encode.md "Learn about enterprise integration AS2 encode"
[edifact-decode-doc]: ../logic-apps/logic-apps-enterprise-integration-EDIFACT-decode.md "Learn about enterprise integration EDIFACT decode"
[edifact-encode-doc]: ../logic-apps/logic-apps-enterprise-integration-EDIFACT-encode.md "Learn about enterprise integration EDIFACT encode"
[flat-file-decode-doc]:../logic-apps/logic-apps-enterprise-integration-flatfile.md "Learn about enterprise integration flat file."
[flat-file-encode-doc]:../logic-apps/logic-apps-enterprise-integration-flatfile.md "Learn about enterprise integration flat file."
[integration-account-doc]: ../logic-apps/logic-apps-enterprise-integration-metadata.md "Look up schemas, maps, partners, and more in your integration account"
[json-liquid-transform-doc]: ../logic-apps/logic-apps-enterprise-integration-liquid-transform.md "Learn about JSON transformations with Liquid"
[x12-doc]: ../logic-apps/logic-apps-enterprise-integration-x12.md "Learn about enterprise integration X12"
[x12-decode-doc]: ../logic-apps/logic-apps-enterprise-integration-X12-decode.md "Learn about enterprise integration X12 decode"
[x12-encode-doc]: ../logic-apps/logic-apps-enterprise-integration-X12-encode.md "Learn about enterprise integration X12 encode"
[xml-transform-doc]: ../logic-apps/logic-apps-enterprise-integration-transform.md "Learn about enterprise integration transforms."
[xml-validate-doc]: ../logic-apps/logic-apps-enterprise-integration-xml-validation.md "Learn about enterprise integration XML validation."

<!-- Built-ins icons -->
[azure-api-management-icon]: ./media/apis-list/azure-api-management.png
[azure-app-services-icon]: ./media/apis-list/azure-app-services.png
[azure-functions-icon]: ./media/apis-list/azure-functions.png
[azure-logic-apps-icon]: ./media/apis-list/azure-logic-apps.png
[batch-icon]: ./media/apis-list/batch.png
[condition-icon]: ./media/apis-list/condition.png
[data-operations-icon]: ./media/apis-list/data-operations.png
[date-time-icon]: ./media/apis-list/date-time.png
[for-each-icon]: ./media/apis-list/for-each-loop.png
[http-icon]: ./media/apis-list/http.png
[http-request-icon]: ./media/apis-list/request.png
[http-response-icon]: ./media/apis-list/response.png
[http-swagger-icon]: ./media/apis-list/http-swagger.png
[http-webhook-icon]: ./media/apis-list/http-webhook.png
[schedule-icon]: ./media/apis-list/recurrence.png
[scope-icon]: ./media/apis-list/scope.png
[switch-icon]: ./media/apis-list/switch.png
[terminate-icon]: ./media/apis-list/terminate.png
[until-icon]: ./media/apis-list/until.png
[variables-icon]: ./media/apis-list/variables.png

<!--Managed API icons-->
[appfigures-icon]: ./media/apis-list/appfigures.png
[asana-icon]: ./media/apis-list/asana.png
[azure-automation-icon]: ./media/apis-list/azure-automation.png
[azure-blob-storage-icon]: ./media/apis-list/azure-blob-storage.png
[azure-cognitive-services-text-analytics-icon]: ./media/apis-list/azure-cognitive-services-text-analytics.png
[azure-data-lake-icon]: ./media/apis-list/azure-data-lake.png
[azure-document-db-icon]: ./media/apis-list/azure-document-db.png
[azure-event-grid-icon]: ./media/apis-list/azure-event-grid.png
[azure-event-grid-publish-icon]: ./media/apis-list/azure-event-grid-publish.png
[azure-event-hubs-icon]: ./media/apis-list/azure-event-hubs.png
[azure-ml-icon]: ./media/apis-list/azure-ml.png
[azure-queues-icon]: ./media/apis-list/azure-queues.png
[azure-resource-manager-icon]: ./media/apis-list/azure-resource-manager.png
[azure-service-bus-icon]: ./media/apis-list/azure-service-bus.png
[basecamp-3-icon]: ./media/apis-list/basecamp.png
[bitbucket-icon]: ./media/apis-list/bitbucket.png
[bitly-icon]: ./media/apis-list/bitly.png
[biztalk-server-icon]: ./media/apis-list/biztalk.png
[blogger-icon]: ./media/apis-list/blogger.png
[box-icon]: ./media/apis-list/box.png
[campfire-icon]: ./media/apis-list/campfire.png
[common-data-service-icon]: ./media/apis-list/common-data-service.png
[dropbox-icon]: ./media/apis-list/dropbox.png
[dynamics-365-icon]: ./media/apis-list/dynamics-crm-online.png
[dynamics-365-financials-icon]: ./media/apis-list/dynamics-365-financials.png
[dynamics-365-operations-icon]: ./media/apis-list/dynamics-365-operations.png
[easy-redmine-icon]: ./media/apis-list/easyredmine.png
[facebook-icon]: ./media/apis-list/facebook.png
[file-system-icon]: ./media/apis-list/file-system.png
[ftp-icon]: ./media/apis-list/ftp.png
[github-icon]: ./media/apis-list/github.png
[google-calendar-icon]: ./media/apis-list/google-calendar.png
[google-drive-icon]: ./media/apis-list/google-drive.png
[google-sheets-icon]: ./media/apis-list/google-sheet.png
[google-tasks-icon]: ./media/apis-list/google-tasks.png
[hipchat-icon]: ./media/apis-list/hipchat.png
[ibm-db2-icon]: ./media/apis-list/ibm-db2.png
[ibm-informix-icon]: ./media/apis-list/ibm-informix.png
[ibm-mq-icon]: ./media/apis-list/ibm-mq.png
[insightly-icon]: ./media/apis-list/insightly.png
[instagram-icon]: ./media/apis-list/instagram.png
[instapaper-icon]: ./media/apis-list/instapaper.png
[jira-icon]: ./media/apis-list/jira.png
[mailchimp-icon]: ./media/apis-list/mailchimp.png
[mandrill-icon]: ./media/apis-list/mandrill.png
[microsoft-translator-icon]: ./media/apis-list/microsoft-translator.png
[mysql-icon]: ./media/apis-list/mysql.png
[office-365-outlook-icon]: ./media/apis-list/office-365.png
[office-365-users-icon]: ./media/apis-list/office-365-users.png
[office-365-video-icon]: ./media/apis-list/office-365-video.png
[onedrive-icon]: ./media/apis-list/onedrive.png
[onedrive-for-business-icon]: ./media/apis-list/onedrive-business.png
[oracle-db-icon]: ./media/apis-list/oracle-db.png
[outlook.com-icon]: ./media/apis-list/outlook.png
[pagerduty-icon]: ./media/apis-list/pagerduty.png
[pinterest-icon]: ./media/apis-list/pinterest.png
[postgre-sql-icon]: ./media/apis-list/postgre-sql.png
[project-online-icon]: ./media/apis-list/projecton-line.png
[redmine-icon]: ./media/apis-list/redmine.png
[rss-icon]: ./media/apis-list/rss.png
[salesforce-icon]: ./media/apis-list/salesforce.png
[sap-icon]: ./media/apis-list/sap.png
[send-grid-icon]: ./media/apis-list/sendgrid.png
[sftp-icon]: ./media/apis-list/sftp.png
[sharepoint-online-icon]: ./media/apis-list/sharepoint-online.png
[sharepoint-server-icon]: ./media/apis-list/sharepoint-server.png
[slack-icon]: ./media/apis-list/slack.png
[smartsheet-icon]: ./media/apis-list/smartsheet.png
[smtp-icon]: ./media/apis-list/smtp.png
[sparkpost-icon]: ./media/apis-list/sparkpost.png
[sql-server-icon]: ./media/apis-list/sql.png
[teradata-icon]: ./media/apis-list/teradata.png
[todoist-icon]: ./media/apis-list/todoist.png
[trello-icon]: ./media/apis-list/trello.png
[twilio-icon]: ./media/apis-list/twilio.png
[twitter-icon]: ./media/apis-list/twitter.png
[vimeo-icon]: ./media/apis-list/vimeo.png
[visual-studio-team-services-icon]: ./media/apis-list/visual-studio-team-services.png
[wordpress-icon]: ./media/apis-list/wordpress.png
[wunderlist-icon]: ./media/apis-list/wunderlist.png
[yammer-icon]: ./media/apis-list/yammer.png
[youtube-icon]: ./media/apis-list/youtube.png

<!-- Enterprise Integration Pack icons -->
[as2-icon]: ./media/apis-list/as2.png
[edifact-icon]: ./media/apis-list/edifact.png
[flat-file-encode-icon]: ./media/apis-list/flat-file-encoding.png
[flat-file-decode-icon]: ./media/apis-list/flat-file-decoding.png
[integration-account-icon]: ./media/apis-list/integration-account.png
[liquid-icon]: ./media/apis-list/liquid-transform.png
[x12-icon]: ./media/apis-list/x12.png
[xml-validate-icon]: ./media/apis-list/xml-validation.png
[xml-transform-icon]: ./media/apis-list/xsl-transform.png