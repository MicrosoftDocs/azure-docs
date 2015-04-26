<properties 
	pageTitle="Monitor a Media Services Account - Azure" 
	description="Describes how to configure monitoring for your Media Services account in Azure." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/05/2015" 
	ms.author="juliako"/>





#<a id="monitormediaservicesaccount"></a>How to Monitor a Media Services Account

This article is part of the [Media Services Video on Demand workflow](media-services-video-on-demand-workflow.md) and [Media Services Live Streaming workflow](media-services-live-streaming-workflow.md) series. 

The Azure Media Services dashboard presents usage metrics and account information that you can use to manage your Media Services account.

You can monitor the number of queued encoding jobs, failed encoding tasks, active encoding jobs represented by the input and output data from the encoder, as well as the blob storage usage associated with your Media Services account. In addition, if you are streaming content to customers, you can retrieve various streaming metrics as well. You can choose to monitor your data for the last 6 hours, 24 hours or 7 days.
 
>[AZURE.NOTE] Additional costs are associated with monitoring storage data in the Azure Management Portal. For more information, see [Storage Analytics and Billing](http://go.microsoft.com/fwlink/?LinkId=256667).

##<a id="configuremonitoring"></a>How to: Monitoring a Media Services account

1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666), click **Media Services**, and then click the Media Services account name to open the dashboard. 

	![MediaServices_Dashboard][dashboard]

2. To monitor your encoding jobs or data, simply begin submitting encoding jobs to Media Services, or start streaming content to customers through the use of Azure Media On-Demand Streaming. You should start seeing monitoring data on the dashboard after about an hour.

##<a id="configuringstorage"></a>How to: Monitoring your blob storage usage (Optional)
1. Click the **STORAGE ACCOUNT** name under the **quick glance** section.
2. On the storage account page, click the **configure page** link, and scroll down to the **monitoring** settings for the Blob, Table, and Queue services, shown below.

	>[AZURE.NOTE] Blobs are the only supported storage type in Media Services.

	![StorageOptions][storage_options_scoped]

3. In **monitoring**, set the level of monitoring and the data retention policy for Blobs:

-  To set the monitoring level, select one of the following:

      **Minimal** - Collects metrics such as ingress/egress, availability, latency, and success percentages, which are aggregated for the Blob, Table, and Queue services.

      **Verbose** - In addition to the minimal metrics, collects the same set of metrics for each storage operation in the Azure Storage Service API. Verbose metrics enable closer analysis of issues that occur during application operations. 

      **Off** - Turns off monitoring. Existing monitoring data is persisted through the end of the retention period.

- To set the data retention policy, in **Retention (in days)**, type the number of days of data to retain from 1 to 365 days. If you do not want to set a retention policy, enter zero. If there is no retention policy, it is up to you to delete the monitoring data. We recommend setting a retention policy based on how long you want to retain storage analytics data for your account so that old and unused analytics data can be deleted by the system at no cost.

4. When you finish the monitoring configuration, click **Save**.
Similar to Media Services metrics, you should start seeing monitoring data on the dashboard after about an hour.
Metrics are stored in the storage account in four tables named $MetricsTransactionsBlob, $MetricsTransactionsTable, $MetricsTransactionsQueue, and $MetricsCapacityBlob. For more information, see [Storage Analytics Metrics](http://go.microsoft.com/fwlink/?LinkId=256668).


<!-- Images -->
[dashboard]: ./media/media-services-monitor-services-account/media-services-dashboard.png
[storage_options_scoped]: ./media/media-services-monitor-services-account/storagemonitoringoptions_scoped.png

