<properties umbracoNaviHide="0" pageTitle="How To Monitor a Media Services Account" metaKeywords="Windows Azure Media Services, service, media services account, monitor media services" metaDescription="Learn how to monitor a Media Services account." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: Media Services accounts" headerExpose="" footerExpose="" disqusComments="1" />


<h1 id="monitormediaservicesaccount">How to Monitor a Media Services Account</h1>
The Windows Azure Media Services dashboard presents usage metrics and account information that you can use to manage your Media Services account.

Currently, you can only monitor your blob storage usage and until you configure storage monitoring for your Media Services account, no monitoring data is collected and the metrics charts on the dashboard are empty. Similarly to general storage monitoring, you can choose the level of blob storage monitoring - minimal or verbose - and specify the appropriate data retention policy for the service. 

**Note**   Additional costs are associated with examining monitoring data in the Windows Azure (Preview) Management Portal. For more information, see [Storage Analytics and Billing](http://go.microsoft.com/fwlink/?LinkId=256667).

<h2 id="configuremonitoring">How to: Configure monitoring for a Media Services account</h2>

1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666), click **Media Services**, and then click the Media Services account name to open the dashboard. 

	![MediaServices_Dashboard][dashboard]

2. Click the **configure page** link, and scroll down to the **monitoring** settings for the Blob, Table, and Queue services, shown below.

	**Note** Blobs are the only supported storage type in Media Services.

	![StorageOptions][storage_options_scoped]

3. In **monitoring**, set the level of monitoring and the data retention policy for Blobs:

-  To set the monitoring level, select one of the following:

      **Minimal** - Collects metrics such as ingress/egress, availability, latency, and success percentages, which are aggregated for the Blob, Table, and Queue services.

      **Verbose** – In addition to the minimal metrics, collects the same set of metrics for each storage operation in the Windows Azure Storage Service API. Verbose metrics enable closer analysis of issues that occur during application operations. 

      **Off** - Turns off monitoring. Existing monitoring data is persisted through the end of the retention period.

- To set the data retention policy, in **Retention (in days)**, type the number of days of data to retain from 1 to 365 days. If you do not want to set a retention policy, enter zero. If there is no retention policy, it is up to you to delete the monitoring data. We recommend setting a retention policy based on how long you want to retain storage analytics data for your account so that old and unused analytics data can be deleted by the system at no cost.

4. When you finish the monitoring configuration, click **Save**.
You should start seeing monitoring data on the dashboard after about an hour.

Metrics are stored in the storage account in four tables named $MetricsTransactionsBlob, $MetricsTransactionsTable, $MetricsTransactionsQueue, and $MetricsCapacityBlob. For more information, see [Storage Analytics Metrics](http://go.microsoft.com/fwlink/?LinkId=256668).


<!-- Images -->
[dashboard]: ../media/WAMS_Dashboard.png
[storage_options_scoped]: ../media/storagemonitoringoptions_scoped.png