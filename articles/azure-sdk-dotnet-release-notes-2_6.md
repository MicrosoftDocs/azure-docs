<properties 
   pageTitle="Azure SDK for .NET 2.6 Release Notes" 
   description="Azure SDK for .NET 2.6 Release Notes" 
   services="app-service/web" 
   documentationCenter=".net" 
   authors="Juliako" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service/web"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="04/29/2015"
   ms.author="juliako"/>


# Azure SDK for .NET 2.6 Release Notes

This document contains the release notes for the Azure SDK for .NET 2.6 release. 

##Service Bus updates:

- Event Hubs: 

	- Now allows targeted access control when sending events by exposing additional publisher endpoint for Event Hubs.
	- Additional stability and improvement added to Event Hubs feature.
	- Adding support of Amqp protocol over WebSocket for messaging and Event Hubs.

##HDInsight Tools for Visual Studio


- **IntelliSense enhancement**: remote metadata suggestion

	Now HDInsight Tools for Visual Studio supports getting remote metadata when you are editing your Hive script. For example, you can type **SELECT * FROM** and all the table names will be shown. Also, the column names will be shown after specifying a table.

- **HDInsight emulator support**

	Now HDInsight Tools for Visual Studio support connecting to HDInsight emulator, so you could develop your Hive scripts locally without introducing any cost, then execute those scripts against your HDInsight clusters. 

	For more information, refer to [this manual](http://go.microsoft.com/fwlink/?LinkID=529540&clcid=0x409).

- **HDInsight Tools for Visual Studio support for generic Hadoop clusters** (Preview)

	Now HDInsight Tools for Visual Studio support generic Hadoop clusters, so you can use HDInsight Tools for Visual Studio to do the following:

	- connect to your cluster, 
	- write Hive query with enhanced IntelliSense/auto-completion support, 
	- view all the jobs in your cluster with an intuitive UI. 

	For more information, refer to [this manual](http://go.microsoft.com/fwlink/?LinkID=529540&clcid=0x409).

##In-Role Cache updates

- **In-Role Cache** was updated to use **Microsoft Azure Storage SDK** version 4.3. Until now, the **In-Role Cache** was using Azure Storage SDK version 1.7.

	Customers using Azure SDK 2.5 or below should update to Azure SDK 2.6 and move to the new version of Azure Storage SDK. Note that Azure Storage version 2011-08-18 will be removed on December 9th, 2015. For more details read [this announcement](http://azure.microsoft.com/blog/2014/08/04/microsoft-azure-storage-service-version-removal/). 

	For more information, see [In-Role Cache for Azure Cache](https://msdn.microsoft.com/library/azure/dn386103.aspx).

##Azure Tools updates

- Azure publishing enhanced to include Azure API Apps as a deployment target.
- API Apps provisioning functionality to enable users with API App creation and provisioning functionality.
- Server Explorer changed to reflect new App Service node, with Web, Mobile, and API apps grouped by Resource Group.
- Add Azure API App Client gesture added to most C# projects that will enable automatic generation of Swagger-enabled API Apps running in a user’s Azure subscription.
- API Apps tooling and App Service nodes in Server Explorer are available in Visual Studio 2013 only. 

##Azure Resource Manager Tools for Visual Studio updates

- The **Cloud Deployment Projects** project type available in the Azure SDK 2.5 has been renamed to **Azure Resource Group**.
- **Cloud Deployment Projects** type of projects created in the Azure SDK 2.5 can be used in 2.6 but deploying the template from Visual Studio will fail. However, deploying with the PowerShell script will still work as it did previously.  For information on how to use **Cloud Deployment Projects** in 2.6 read this [post](http://go.microsoft.com/fwlink/?LinkID=534086).
