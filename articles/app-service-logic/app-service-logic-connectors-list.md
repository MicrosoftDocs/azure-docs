<properties
	pageTitle="List of available Connectors and API Apps | Microsoft Azure App Service"
	description="Read about the Connectors and API Apps in Azure App Service"
	services="logic-apps"
	documentationCenter=""
	authors="MandiOhlinger"
	manager="erikre"
	editor="cgronlun"/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/01/2016"
	ms.author="mandia"/>


# List of Connectors and API Apps to use in your Logic Apps
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. For the Logic Apps General Availability (GA) version, see [New Connectors List](../connectors/apis-list.md).

Learn about all the available connectors and API Apps created by Microsoft to use within your Logic Apps.

For pricing information and a list of what is included with each Service Tier, see [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/).

> [AZURE.NOTE] To get started with Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic). You can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

## Core Connectors
The following table lists all the available connectors and API Apps created by Microsoft that are available as Core Connectors:

Name | Description
--- | ---
[Bing Translator](https://azure.microsoft.com/marketplace/partners/bing/microsofttranslator/) | Use Bing to translate text into another language.
[HTTP](app-service-logic-connector-http.md) | The HTTP Listener opens an endpoint that acts as an HTTP server and listens to incoming HTTP or HTTPS requests. The HTTP action doesn't require an API App and is supported natively within Logic Apps.
[Slack](app-service-logic-connector-slack.md) | Connect to Slack and post messages to Slack channels.


## Enterprise Integration Connectors
The following table lists all the available Connectors and API Apps created by Microsoft available as Enterprise Integration Connectors:

Name  | Description
------------- | -------------
[BizTalk Rules](app-service-logic-use-biztalk-rules.md) | Use BizTalk Rules to define and control the business logic within an organization. Business policies can be updated without recompiling or without redeploying the associated applications.
[BizTalk XPath Extractor](app-service-logic-xpath-extract.md) | Looks up and extracts data from XML content based on an XPath you choose.
[DB2 Connector](app-service-logic-connector-db2.md) | Connects to an IBM DB2 database on-premises and on an Azure virtual machine running a Windows operating system. Can map Web API and OData API operations to Informix Structured Query Language commands. <br/><br/>No triggers. Actions include table select, insert, update, delete, and custom statement<br/><br/>This connector also includes the Microsoft Client for DRDA to connect to an Informix server across a TCP/IP network.
[File](app-service-logic-connector-file.md) | Using this connector, you can connect to the on-premises file system or network and complete different file tasks, including uploading, deleting, listing files, and more.
[Informix](app-service-logic-connector-informix.md) | Connects to an IBM Informix database, on-premises and on an Azure virtual machine running a Windows operating system. Can map Web API and OData API operations to Informix Structured Query Language commands.<br/><br/>No triggers. Actions include table select, insert, update, delete, and custom statement.<br/><br/>When using on-premises, VPN or Azure ExpressRoute can be used. This connector also includes a Microsoft Client for DRDA to connect to an Informix server across a TCP/IP network.
[Microsoft SQL Server](app-service-logic-connector-sql.md) | Connects to on-premises SQL Server or an Azure SQL Database. You can create, update, get, and delete entries on a SQL database table.
MQ | Connects to IBM WebSphere MQ Server version 8, on-premises and on an Azure virtual machine running a Windows operating system. When using on-premises, VPN or Azure ExpressRoute can be used. The connector also includes the Microsoft Client for MQ.<br/><br/>No triggers. No actions.<br/><br/>**Note** Currently cannot be used with Logic Apps.

## Connectors as Triggers
Several connectors provide triggers for Logic Apps. These triggers are of two types:

1. Poll Triggers: These triggers poll your service at a specified frequency to check for new data. When new data is available, a new instance of your Logic App runs with the data as input. To prevent the same data from being consumed multiple times, the trigger may clean-up data that has been read and passed to the Logic App. Examples of such connectors are File, SQL, and Azure Storage.
2. Push Triggers: These triggers listen for data on an endpoint or for an event to occur. Then, trigger a new instance of a Logic App. Examples of such connectors are HTTP Listener and Twitter.

## Connectors as Actions
Connectors can also be used as actions within your Logic App. Actions are useful for looking up data within the Logic App that can then used in the execution. For example, you may need to look up data from a SQL database for additional information about a customer when processing an order. Or, you may need to write, update or delete data in a destination. You can do this using the actions provided by the connectors. Actions map to operations in API Apps (as defined by their Swagger metadata).

## Create your own Connectors and API Apps
[Connectors and API Apps Reference](http://aka.ms/appservicesconnectorreference)  
[Azure App Service API app triggers](../app-service-api/app-service-api-dotnet-triggers.md)  
[Logic App Reference](https://msdn.microsoft.com/library/azure/dn948510.aspx)

## More on Connectors and API Apps
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)  
[Using the Hybrid Connection Manager in Azure App Service](app-service-logic-hybrid-connection-manager.md)  
[Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md)
