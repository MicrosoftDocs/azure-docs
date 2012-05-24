# How to create and manage storage accounts in Windows Azure #
This guide demonstrates how to create and manage storage accounts in the Windows Azure Preview Management Portal. A storage account enables you to use the Windows Azure Blob, Queue, and Table services located in a geographic location. This guide covers the following scenarios: **creating a storage account**, **configuring monitoring and logging**, **turning geo-replication off or on**, **copying and regenerating storage account keys**, and **deleting a storage account**.
## Table of Contents ##
[What is a storage account?][]
[Concepts][]
[How to: Create a storage account][]
[How to: Open the storage account dashboard][]
[How to: Configure monitoring][]
[How to: Configure logging][]
[How to: Turn geo-replication off or on][]
[How to: View, copy, and regenerate storage account keys][]
[How to: Delete a storage account][]
[Next steps][]

## What is a storage account? ##
A storage account gives your applications access to Windows Azure Blob, Table, and Queue services located in a geographic region. You need a storage account to use Windows Azure storage. 

The storage account represents the highest level of the namespace for accessing the storage services. A storage account can contain up to 100 TB of blob, queue, and table data. You can create up to five storage accounts for your Windows Azure subscription. For more information about storage accounts, see [Windows Azure Storage](http://www.windowsazure.com/en-us/home/features/storage/) and [Data Storage Offerings in Windows Azure](http://www.windowsazure.com/en-us/develop/net/fundamentals/cloud-storage/).

Storage costs are based on storage utilization and the number of storage transactions required to add, update, read, and delete stored data. Storage utilization is calculated based on your average usage of storage for blobs, tables, and queues during a billing period. To learn more about your storage pricing, see [Windows Azure Pricing Overview](http://www.windowsazure.com/en-us/pricing/details).
## Concepts ##

- **geo reundant storage (GRS)**   Geo-redundant storage provides the highest level of storage durability by seamlessly replicating your data to a secondary location within the same region. This enables failover in case of a major failure in the primary location. The secondary location is hundreds of miles from the primary location. GRS is implemented throught a feature called *geo-replication*, which is turned on for a storage account by default, but can be turned off if you don’t want to use it (for example, if company policies prevent its use). For more information, see [Introducing Geo-Replication for Windows Azure](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx). 

- **locally redundant storage (LRS)**   Locally redundant storage provides highly durable and available storage within a single location. For locally redundant storage, account data is replicated three times within the same data center. All storage in Windows Azure is locally redundant. For added durability, you can turn on geo-replication. Locally redundant storage is offered at a discount. For pricing information, see [Windows Azure Pricing Overview](http://www.windowsazure.com/en-us/pricing/details/). 

- **affinity group**   An *affinity group* is a geographic grouping of a customer’s cloud service deployments and storage accounts within Windows Azure. An affinity group can improve service performance by locating computer workloads in the same data center or near the target user audience. Also, no billing charges are incurred for egress.

- **storage account endpoints**   The *endpoints* for a storage account represent the highest level of the namespace for accessing blobs, tables, or queues. The default endpoints for a storage account have the following formats: 

    - Blob service: http://*mystorageaccount*.blob.core.windows.net

    - Table service: http://*mystorageaccount*.table.core.windows.net

    - Queue service: http://*mystorageaccount*.queue.core.windows.net

- **storage account URLs**   The URL for accessing an object in a storage account is built by appending the object's location in the storage account to the endpoint. For example, a blob address might have this format: http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

- **storage account keys**   When you create a storage account, Windows Azure generates two 512-bit storage account keys, which are used for authentication when the storage account is accessed. By providing two storage account keys, Windows Azure enables you to regenerate the keys with no interruption to your storage service or access to that service.

- **minimal vs. verbose metrics**   You can configure minimal or verbose metrics in the monitoring settings for your storage account. *Minimal metrics* collects metrics on data such as ingress/egress, availability, latency, and success percentages, which are aggregated for the Blob, Table, and Queue services. *Verbose metrics* collects operations-level detail in addition to service-level aggregates for the same metrics. Verbose metrics enable closer analysis of issues that occur during application operations. For the full list of available metrics, see [Storage Analytics Metrics Table Schema](http://msdn.microsoft.com/en-us/library/windowsazure/hh343264.aspx). For more information about storage monitoring, see [About Storage Analytics Metrics](http://msdn.microsoft.com/en-us/library/windowsazure/hh343258.aspx).

- **logging**   Logging is a configurable feature of storage accounts that enables logging of requests to read, write, and delete blobs, tables, and queues. You configure logging in the Windows Azure Management Portal, but you cannot view the logs in the portal. The logs are stored and accessed in the storage account, in the $logs container. For more information, see [Storage Analytics Overview](http://msdn.microsoft.com/en-us/library/windowsazure/hh343268.aspx).

## How to: Create a storage account  ##
To store files and data in the Blob, Table, and Queue services in Windows Azure, you must create a storage account in the geographic region where you want to store the data. 

A storage account can contain up to 100 TB of blob, table, and queue data. You can create up to five storage accounts for each Windows Azure subscription.

**Note**   For a Windows Azure virtual machine, a storage account is created automatically in the deployment location if the customer does not already have a storage account in that location. The storage account name will be based on the virtual machine name.
### To create a storage account ###

1. Sign in to the [Windows Azure Preview Management Portal](http://windows.azure.com).

2. Click **Create New**, click **Storage**, and then click **Quick Create**.

 ![NewStorageAccount](Media\Storage_NewStorageAccount)

3. In **URL**, enter a subdomain name to use in the storage account URL. To access an object in storage, you will append the object's location to the endpoint. For example, the URL for accessing a blob might be http://*myaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

4. In **Region/Affinity Group**, select a region or affinity group for the storage.  Select an affinity group instead of a region if you want your storage services to be in the same data center with other Windows Azure services that you are using. This can improve performance, and no charges are incurred for egress.

  	**Note**   To create an affinity group, open the **Networks** area of the Management Portal, click **Affinity Group**s, and then click either **Create a new affinity group** or **Create**. You can use affinity groups that you created in the earlier Windows Azure Management Portal. And you can create and manage affinity groups using the Windows Azure Service Management API. For more information, see [Operations on Affinity Groups](http://msdn.microsoft.com/en-us/library/windowsazure/ee460798.aspx).

5. If you don't want geo-replication for your storage account, clear the **Enable Geo-Replication** check box.

 Geo-replication is enabled by default so that, in the event of a major disaster in the primary location, storage fails over to a secondary location. A secondary location in the same region is assigned and cannot be changed. After a geo-failover, the secondary location becomes the primary location for the storage account, and stored data is replicated to a new secondary location.

 If you don't want to use geo-replication, or if your organization's policies won't allow its use, you can turn off geo-replication. This will result in locally redundant storage, which is offered at a discount. Be aware that if you turn off geo-replication, and you later decide to turn it on again, you will incur a one-time charge to replicate your existing data to the secondary location.

6. Click **Create Storage Account**.

Storage account creation can take a while. To check the status, you can monitor the notifications at the bottom of the portal. When storage account creation completes successfully, your new storage account has **Online** status and is ready for use. 

![StoragePage](Media\Storage_StoragePage)
Media file = Media\Storage_StoragePage.png

## How to: Open the storage account dashboard ##
Now that you have created a storage account, let's take a look at the storage account dashboard. The dashboard is the central location for checking a storage account's status, getting information, and managing the account.
### To open the dashboard for a storage account ###
1. In the Preview Management Portal, click **Storage**.

2. Click the name of the storage account in the list to open the dashboard, shown below. (You won't be able to do this until the storage account has Online status and is available for use.)

 ![Dashboard](Media\Storage_Dashboard)

From the dashboard you can perform the following tasks:

- In **quick glance**, find out the storage account status, the primary location, the Windows Azure subscription associated with the storage account, and additional information if geo-replication is enabled.

- In **services**, you'll find the endpoints to use for Blob, Table, and Queue services.

- If monitoring has been configured for the storage account, you can monitor metrics on the metrics chart. By default, monitoring is turned off for a new storage account. To configure monitoring, click **Configure**, and enter the monitoring settings. For more information, see [How to: Configure monitoring]().

**Note**   If you enable Windows Azure Storage Analytics for a storage account outside the Preview Management Portal, the portal by default displays minimal metrics for the storage account. For more information about enabling Storage Analytics, see [Storage Analytics Overview](http://msdn.microsoft.com/en-us/library/windowsazure/hh343268).

- Use **Manage Keys** to view, copy, or regenerate the storage account keys that are required for authentication when storage is accessed. 

- Click **Configure** to open a page for configuring geo-replication, monitoring, and logging for the store account. 

- Click **Monitor** to view a configurable metrics chart and a detailed metrics list.
- Use **Delete** to delete the storage account and all blobs, tables, and queues that it stores.

## How to: Configure monitoring ##

Until you configure monitoring for your storage account, no monitoring data is collected, and the metrics charts on the dashboard and **Monitor** page are empty. For each data management service associated with the storage account (Blob, Queue, and Table), you can choose the level of monitoring - minimal or verbose - and specify the appropriate data retention policy for the service.

**Note**   Additional costs are associated with examining monitoring data in the Management Portal. For more information, see [Storage Analytics and Billing](http://msdn.microsoft.com/en-us/library/windowsazure/hh360997.aspx).

###To configure monitoring for a storage account###


1. In the Preview Management Portal, click **Storage**, and then click the storage account name to open the dashboard.

2. Click **Configure**, and scroll down to the **monitoring** settings for the Blob, Table, and Queue services, shown below.

 ![MonitoringOptions](Media\Storage_MonitoringOptions)

3. In **monitoring**, set the level of monitoring and the data retention policy for each service:

-  To set the monitoring level, select one of the following:

      **Minimal** - Collects metrics such as ingress/egress, availability, latency, and success percentages, which are aggregated for the Blob, Table, and Queue services.

      **Verbose** – In addition to the minimal metrics, collects the same set of metrics for each storage operation in the Windows Azure Storage Service API. Verbose metrics enable closer analysis of issues that occur during application operations. 

      **Off** - Turns off monitoring. Existing monitoring data is persisted through the end of the retention period.

- To set the data retention policy, in **Retention (in days)**, type the number of days of data to retain from 1 365 days. If you do not want to set a retention policy, enter zero. If there is no retention policy, it is up to you to delete the monitoring data. We recommend setting a retention policy based on how long you want to retain storage analytics data for your account so that old and unused analytics data can be deleted by system at no cost.

4. When you finish the monitoring configuration, click **Save**.
You should start seeing monitoring data on the dashboard and the **Monitor** page after about an hour.

Metrics are stored in the storage account in four tables named $MetricsTransactionsBlob, $MetricsTransactionsTable, $MetricsTransactionsQueue, and $MetricsCapacityBlob. For more information, see [Storage Analytics Metrics](http://msdn.microsoft.com/en-us/library/windowsazure/hh343258.aspx).

After you set the monitoring levels and retention policies, you can choose which of the available metrics to monitor in the Management Portal, and which metrics to plot on metrics charts. A default set of metrics are displayed at each monitoring level. You can use **Add Metrics** to add or remove metrics from the metrics list.
### Customize the dashboard ###
On the dashboard, you can choose up to six metrics to plot on the metrics chart from nine available metrics. For each service (Blob, Table, and Queue), the Availability, Success Percentage, and Total Requests metrics are available. The metrics available on the dashboard are the same for minimal or verbose monitoring.
### To customize the metrics chart on the dashboard ###

1. In the Preview Management Portal, click **Storage**, and then click the name of the storage account to open the dashboard.

2. To change the metrics that are plotted on the chart, take one of the following actions:
- To add a new metric to the chart, click the check box by the metric header. In a narrow display, click ***n* more** to access headers that can't be displayed in the header area.

- To hide a metric that is plotted on the chart, clear the check box by the metric header.

           ![Monitoring_nmore](media\storage_Monitoring_nmore)


- To change the time range the metrics chart displays, select 6 hours, 24 hours, or 7 days at the top of the chart.

     ![Monitoring_DisplayPeriod](Media\Storage_Monitoring_DisplayPeriod)

### Customize the Monitor page ###
On the **Monitor** page, you can view the full set of metrics for your storage account. 

- If your storage account has minimal monitoring configured, metrics such as ingress/egress, availability, latency, and success percentages are aggregated from the Blob, Table, and Queue services.

- If your storage account has verbose monitoring configured, the metrics are available at a finer resolution of individual storage operations in addition to the service-level aggregates.

You can add and remove metrics from the metrics table, and you can choose metrics to plot on the metrics chart. 

**Note**   Use the following procedures to choose which storage metrics to view in the metrics charts and table that are displayed in the Preview Management Portal. These settings do not affect the collection, aggregation, and storage of monitoring data in the storage account.

### To add metrics to the metrics table (Monitor page) ###
1. In the Preview Management Portal, click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Monitor**.

 The **Monitor** page opens. By default, the metrics table displays a subset of the metrics that are available for monitoring. The illustration shows the default Monitor display for a storage account with verbose monitoring configured for all three services. Use **Add Metrics** to select the metrics you want to monitor from all available metrics.

 ![Monitoring_VerboseDisplay](Media\Storage_Monitoring_VerboseDisplay)

  **Note**   Consider costs when you select the metrics. There are transaction and egress costs associated with refreshing monitoring displays. For more information, see [Storage Analytics and Billing](http://msdn.microsoft.com/en-us/library/windowsazure/hh360997.aspx).

3. Click **Add Metrics**. 

 The aggregate metrics that are available in minimal monitoring are at the top of the list. If the check box is selected, the metric is displayed in the metrics list. 

 ![AddMetricsInitialDisplay](Media\Storage_AddMetrics_InitialDisplay)

4. Hover over the right side of the dialog box to display a scrollbar that you can drag to scroll additional metrics into view. Drag the scrollbar to scroll through the list.

 ![AddMetricsScrollbar](Media\Storage_AddMetrics_Scrollbar)

5. Click the down arrow by a metric to expand a list of operations the metric is scoped to include. Select each operation that you want to view in the metrics table in the portal.

 In the following illustration, the AUTHORIZATION ERROR PERCENTAGE metric has been expanded.

 ![](Media\Storage_AddMetrics_ExpandCollapse)

6. After you select metrics for all services, click OK (checkmark) to update the monitoring configuration. The selected metrics are added to the metrics table.

7. To delete a metric from the table, click the metric to select it, and then click **Delete Metric**, as shown below.

 ![](Media\Storage_DeleteMetric)

On the **Monitor** page, you can select any six metrics in the metrics table to plot on the metrics chart.
###To customize the metrics chart on the Monitor page###
1. On the **Monitor** page for the storage account, in the metrics table, select up to 6 metrics to plot on the metrics chart. To select a metric, click the check box on its left side. To remove a metric from the chart, clear the check box.

2. To change the time range the metrics chart displays, select **6 hours**, **24 hours**, or **7 days** at the top of the chart.

##How to: Configure logging##

For each of the storage services available with your storage account (Blob, Table, and Queue), you can save diagnostics logs for Read Requests, Write Requests, and/or Delete Requests, and can set the data retention policy for each of the services.

###To configure logging for your storage account###

1. In the Preview Management Portal, click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Configure**, and use the Down arrow on the keyboard to scroll down to **logging** (shown below).

 ![](Media\Storage_LoggingOpions)

3. For each service (Blob, Table, and Queue), configure the following:

- The types of request to log: Read Requests, Write Requests, and Delete Requests

- The number of days to retain the logged data. Enter zero is if you do not want to set a retention policy. If you do not set a retention policy, it is up to you to delete the logs.

4. Click **Save**.

The diagnostics logs are saved in a blob container named $logs in your storage account. For information about accessing the $logs container, see [About Storage Analytics Logging](http://msdn.microsoft.com/en-us/library/windowsazure/hh343262.aspx).

## How to: Turn geo-replication off or on ##

When geo-replication is turned on, the stored content is replicated to a secondary location to enable failover to that location in case of a major disaster in the primary location. The secondary location is in the same region, but is hundreds of miles from the primary location. This is the highest level of storage durability, known as *geo redundant storage* (GRS). Geo-replication is turned on by default. 

If you turn off geo-replication, you have *locally redundant storage* (LRS). For locally redundant storage, account data is replicated three times within the same data center. LRS is offered at discounted rates. Be aware that if you turn off geo-replication, and you later change your mind, you will incur a one-time data cost to replicate your existing data to the secondary location. 

For more information about geo-replication, see [Introducing Geo-Replication for Windows Azure](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx). For pricing information, see [Windows Azure Pricing Overview](http://www.windowsazure.com/en-us/pricing/details/).

### To turn geo-replication on or off for a storage account ###

1. In the Preview Management Portal, click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Configure**.

3. Beside **Geo-Replication**, click **On** or **Off**.

4. Click **Save**.

## How to: View, copy, and regenerate storage account keys ##

Use **Manage Keys** on the dashboard or the **Storage** page to view, copy, and regenerate the storage account keys that are used to access the Blob, Table, and Queue services. 

### Copy a storage account key ###

You can use **Manage Keys** to copy a storage account key to use in a connection string. The connection string requires the storage account name and a key to use in authentication. For information about configuring connection strings to access Windows Azure storage services, see [Configuring Connection Strings](http://msdn.microsoft.com/en-us/library/ee758697.aspx).

### To copy a storage account access key ###
1. In the Preview Management Portal, click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Manage Keys**.

 **Manage Access Keys** opens.

 ![](Media\Storage_ManageKeys)

3. To copy a storage account key, select the key text. Then right-click, and click **Copy**.

### Regenerate storage account keys ###
You should change the access keys to your storage account periodically to help keep your storage connections more secure. Two access keys are assigned to enable you to maintain connections to the storage account using one access key while you regenerate the other access key. The following procedure describes how to do that.

### To regenerate storage account access keys ###
1. Update the connection strings in your application code to reference the secondary access key of the storage account. 

2. Regenerate the primary access key for your storage account. From the dashboard or the **Configure** page, click **Manage Keys**. Click **Regenerate** under the primary access key, and then click **Yes** to confirm you want to generate a new key.

3. Update the connection strings in your code to reference the new primary access key.

4. Regenerate the secondary access key.

## How to: Delete a storage account ##
To remove a storage account that you are no longer using, use **Delete** on the dashboard or the **Configure** page. **Delete** deletes the entire storage account, including all of the blobs, tables, and queues in the account. 

**Warning**  There's no way to restore the content from a deleted storage account. Make sure you back up anything you want to save before you delete the account.

### To delete a storage account ###
1. In the Preview Management Portal, click **Storage**.

2. Click anywhere in the storage account entry except the name, and then click **Delete**.

 -Or-

 Click the name of the storage account to open the dashboard, and then click **Delete**.

3. Click **Yes** to confirm you want to delete the storage account.


## Next steps ##
- Learn more about Windows Azure storage services. See the MSDN Reference: [Storing and Accessing Data in Windows Azure](http://msdn.microsoft.com/en-us/library/gg433040.aspx). Visit the [Windows Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).

- Configure your apps to use Windows Azure Blob, Table, and Queue services. The [Windows Azure Developer Center](http://www.windowsazure.com/en-us/develop/overview/) provides How To Guides for using the Blob, Table, and Queue storage services with your .NET, Node.js, Java, and PHP applications. For instructions specific to a programming language, see the How To Guides for that language.

[What is a storage account?]: #WhatIs
[Concepts]: #Concepts
[How to: Create a storage account]: #HTCreate
[How to: Open the storage account dashboard]: #HTOpenDashboard
[How to: Configure monitoring]: #HTConfigureMonitoring
[How to: Configure logging]: #HTConfigureLogging
[How to: Turn geo-replication off or on]: #HTTurnOnGeo
[How to: View, copy, and regenerate storage account keys]: #HTManageKeys
[How to: Delete a storage account]: #HTDelete
[Next steps]: #NextSteps


[NewSTorageAccount]: ../Media/Storage_NewStorageAccount.png
[NewStorageAccount]: ../Media/Storage_StoragePage.png
[Storage_Dashboard]: ../Media/Storage_Dashboard.png
[MonitoringOptions]: ../Media/Storage_MonitoringOptions.png
[Monitoring_nmore]: ../ Media/Storage_Monitoring_nmore.png
[Monitoring_DisplayPeriod]: ../Media/Storage_Monitoring_DisplayPeriod.png
[Monitoring_VerboseDisplay]: ../Media/Storage_Monitoring_VerboseDisplay.png
[AddMetrics_InitialDisplay]: ../Media/Storage_AddMetrics_InitialDisplay.png
[AddMetrics_Scrollbar]: ../Media/Storage_AddMetrics_Scrollbar.png
[AddMetrics_ExpandCollapse]: ../Media/Storage_AddMetrics_ExpandCollapse.png
[DeleteMetric]: ../Media/Storage_DeleteMetric.png
[LoggingOptions]: ../Media/Storage_LoggingOpions.png
[ManageKeys]: ../Media/Storage_ManageKeys.png