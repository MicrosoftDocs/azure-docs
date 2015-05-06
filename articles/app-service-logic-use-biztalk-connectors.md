<properties 
   pageTitle="Using connectors" 
   description="Using connectors" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="anuragdalmia" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/20/2015"
   ms.author="prkumar"/>

#Connectors#
Connectors are API Apps that allow you to connect to data and services running in the cloud or on-premises. Connectors make it easy to get to the data with a variety of built-in triggers and actions that can be easily accessed in Logic Apps and more.

Azure App Services provides a number of connectors out of the box:

##Standard Connectors##
* [Azure Service Bus connector]
* [Azure Storage Blob connector]
* Azure Webjobs connector
* [Box connector]
* [Chatter connector]
* [DropBox connector]
* [Facebook connector]
* [File connector]
* [FTP connector]
* [HDInsight connector]
* [HTTP connector]
* [Office 365 connector]
* [OneDrive connector]
* [Oracle connector]
* [POP3 connector]
* [QuickBooks connector]
* [Salesforce connector]
* [SFTP connector]
* [Sharepoint connector]
* [Slack connector]
* [SMTP connector]
* [SQL connector]
* [SugarCRM connector]
* [Twilio connector]
* [Twitter connector]
* Wait connector
* [Yammer connector]

##Premium Connectors and API Apps##
* AS2 Connector
* BizTalk EDIFACT
* BizTalk Flat File Encoder
* BizTalk Transform Service
* BizTalk Rules
* BizTalk X12
* BizTalk XPath Extractor
* BizTalk XML Validator
* DB2 Connector
* Informix Connector
* Oracle Database Connector
* MQ Connector
* [SAP connector]
 
For additional details, please refer to the Connector API Reference [http://aka.ms/appservicesconnectorreference](http://aka.ms/appservicesconnectorreference).

##Connectors and Logic Apps##
Logic Apps are composed of triggers and actions. Some connectors can be used as triggers to instantiate a workflow based on an event or the availability of some data. Connectors are also used as actions to read and write data or perform other actions supported by the connector.

###Connectors as Triggers###
Several connectors provide triggers for Logic Apps. These triggers are of two types:

1. Poll Triggers: These triggers will poll your service of interest at a specified frequency to check for new data. When new data is available, a new instance of your Logic App will run with the data as input. The trigger may perform additional tasks like clean-up of the data that has been read and passed on to the Logic App, to prevent the same data from being consumed multiple times. Examples of such connectors are File, SQL and Azure Storage.
2. Push Triggers: These triggers listen for data on an endpoint or for an event to occur and trigger a new instance of a Logic App. Examples of such connectors are HTTP Listener and Twitter.

###Connectors as Actions###
Connectors can also be used as actions as a part of your Logic App. Actions are useful for looking up data in the Logic App to be used in the execution, for example, you may need to look up data from a SQL DB for additional information about a customer when processing an order. Alternatively, you may need to write, update or delete data in a destination, for which you can use the actions provided by the connectors. Actions map to operations in API apps (as defined by their Swagger metadata).


<!-- Links -->

[Box connector]: app-service-logic-connector-box.md
[Facebook connector]: app-service-logic-connector-facebook.md
[Salesforce connector]: app-service-logic-connector-salesforce.md
[Twitter connector]: app-service-logic-connector-twitter.md
[SAP connector]: app-service-logic-connector-sap.md
[FTP connector]: app-service-logic-connector-ftp.md
[HTTP connector]: app-service-logic-connector-http.md
[Azure Storage Blob connector]: app-service-logic-connector-azurestorageblob.md
[Office 365 connector]: app-service-logic-connector-office365.md
[Sharepoint connector]: app-service-logic-connector-sharepoint.md
[SugarCRM connector]: app-service-logic-connector-sugarcrm.md
[QuickBooks connector]: app-service-logic-connector-quickbooks.md
[Yammer connector]: app-service-logic-connector-yammer.md
[Twilio connector]: app-service-logic-connector-twilio.md
[SMTP connector]: app-service-logic-connector-smtp.md
[SFTP connector]: app-service-logic-connector-sftp.md
[POP3 connector]: app-service-logic-connector-pop3.md
[DropBox connector]: app-service-logic-connector-dropbox.md
[Chatter connector]: app-service-logic-connector-chatter.md
[HDInsight connector]: app-service-logic-connector-hdinsight.md
[Azure Service Bus connector]: app-service-logic-connector-azureservicebus.md
[Oracle connector]: app-service-logic-connector-oracle.md
[SQL connector]: app-service-logic-connector-sql.md
[OneDrive connector]: app-service-logic-connector-onedrive.md
[File connector]: app-service-logic-connector-file.md
[Slack connector]: app-service-logic-connector-slack.md

