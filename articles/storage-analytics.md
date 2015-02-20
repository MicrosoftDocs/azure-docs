<properties 
	pageTitle="Storage Analytics" 
	description="How to manage concurrency for the Blob, Queue, Table, and File services" 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="10/08/2014" 
	ms.author="tamram"/>

# Storage Analytics

Azure Storage Analytics performs logging and provides metrics data for a storage account. You can use this data to trace requests, analyze usage trends, and diagnose issues with your storage account.

To use Storage Analytics, you must enable it individually for each service you want to monitor. You can enable it from the [Azure Management Portal](https://manage.windowsazure.com/); for details, see [How To Monitor a Storage Account](http://www.windowsazure.com/en-us/manage/services/storage/how-to-monitor-a-storage-account/). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the [Get Blob Service Properties](https://msdn.microsoft.com/en-us/library/hh452239.aspx), [Get Queue Service Properties](https://msdn.microsoft.com/en-us/library/hh452243.aspx), and [Get Table Service Properties](https://msdn.microsoft.com/en-us/library/hh452238.aspx) operations to enable Storage Analytics for each service.

The aggregated data is stored in a well-known blob (for logging) and in well-known tables (for metrics), which may be accessed using the Blob service and Table service APIs.

Storage Analytics has a 20TB limit on the amount of stored data that is independent of the total limit for your storage account. For more information on billing and data retention policies, see [Storage Analytics and Billing](https://msdn.microsoft.com/en-us/library/hh360997.aspx). For more information on storage account limits, see [Azure Storage Scalability and Performance Targets](https://msdn.microsoft.com/en-us/library/dn249410.aspx).

For an in-depth guide on using Storage Analytics and other tools to identify, diagnose, and troubleshoot Azure Storage-related issues, see [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](http://azure.microsoft.com/en-us/documentation/articles/storage-monitoring-diagnosing-troubleshooting/).


