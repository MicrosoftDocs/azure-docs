<properties 
	pageTitle="Dashboard, Monitor, Scale, Configure, and Hybrid Connections in BizTalk Services | Microsoft Azure" 
	description="Learn about the controls and monitor performance on the classic portal tabs for BizTalk Services: Dashboard, Monitor, Scale, Configure, and Hybrid Connections. MABS, WABS" 
	services="biztalk-services" 
	documentationCenter="" 
	authors="MandiOhlinger" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="biztalk-services" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/16/2016" 
	ms.author="mandia"/>




# Review the Dashboard, Monitor, Scale, Configure, and Hybrid Connection tabs

After you create your BizTalk Service and deploy your application, you can change some of the BizTalk Service settings and monitor the application performance. 

When you open the Azure classic portal, you are automatically placed at the **ALL ITEMS** tab. To view your BizTalk Service, select your BizTalk Service in the **ALL ITEMS** tab or select the **BIZTALK SERVICES** tab; and then select your BizTalk Service name.

This opens a new window with the following tabs. This topic describes these tabs.

## Quick Start (![Quick Start][QuickStart])
Depending on the BizTalk Services Edition, all options listed may not be available. 
<table border="1">
    <tr>
        <td><strong>Get the tools</strong></td>
        <td>Download the BizTalk Services SDK to install the Visual Studio project templates on your on-premises development computer. These templates create the <strong>BizTalk Services</strong> (bridge) and the <strong>BizTalk Service Artifacts</strong> (Transform) Visual Studio projects that are deployed to your BizTalk Service.
        <br/><br/>
		<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=302335"> How do I Start Using the Azure BizTalk Services SDK </a> and <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=241589">Installing the Azure BizTalk Services SDK</a> lists the steps to get started.
        </td>
    </tr>
    <tr>
        <td><strong>Create partner agreements</strong></td>
        <td>Opens the Azure BizTalk Services Portal hosted on Azure where you add partners and create X12, AS2, and EDIFACT EDI agreements.
        <br/><br/>
        <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=303653">Configuring Components for EDI Messaging on BizTalk Services Portal</a> lists the steps to get started.
        </td>
    </tr>

<tr>
        <td><strong>Learn more about BizTalk Services</strong></td>
        <td>Go to the <a HREF="http://azure.microsoft.com/documentation/services/biztalk-services/">learning center</a> to learn more about Azure BizTalk Services.</td>
</tr>
</table>


In the task bar at the bottom, you can:

<table border="1">

<tr>
<td><strong>Manage</strong> your application deployment</td>
<td>Opens the Azure BizTalk Services portal. The BizTalk Services Portal is the entrance to EDI configuration, including adding partners and creating X12, AS2, and EDIFACT agreements.
<br/><br/>
This is the same as <strong>Create partner agreements</strong> on the <strong>Quick Start</strong> tab.
<br/><br/>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=303653">Configuring Components for EDI Messaging on BizTalk Services Portal</a> provides more information on the BizTalk Services Portal.</td>
</tr>

<tr>
<td><strong>Connection Information</strong> of the Access Control Namespace</td>
<td>When you select Connection Information, then the Access Control Namespace, Default Issuer, and Default Key are displayed. You can copy these values.
<br/><br/>
You can also open the Access Control Portal. <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=285670">Create an Access control Namespace</a> provides more information on the Access Control Portal.</td>
</tr>

<tr>
<td><strong>Sync Keys</strong> in the Storage Account</td>
<td>When you create a Storage account, a Primary Key and Secondary Key are automatically created. These encryption Keys control access to your Storage Account. Your BizTalk Service automatically uses the Primary Key. <strong>Sync Keys</strong> enable users to switch between the Primary Key and the Secondary Key without disrupting the BizTalk Service.
<br/><br/>
For example, you want the BizTalk Service to use a new Primary Key for the Storage Account. To do this:
<br/><br/>
<ol>
<li>Select your BizTalk Service and select <strong>Sync Keys</strong>. Select the Secondary Key. When you do this, the BizTalk Service starts using the Secondary Key.</li>
<li>In the Azure classic portal, select your Storage account and Regenerate the Primary Key. Remember, your BizTalk Service is using the Secondary Key.</li>
<li>Select your BizTalk Service and select <strong>Sync Keys</strong>. Now, select the Primary Key. This is the new Primary Key you regenerated.</li>
<li>In the Azure classic portal, select your Storage account and Regenerate the Secondary Key.</li>
</ol>
<br/>
This process is called "rollover keys". The purpose is to enable users to switch between the Primary Key and the Secondary Key without disrupting the BizTalk Service.</td>
</tr>

<tr>
<td><strong>Delete</strong> your application</td>
<td>When you select Delete, your BizTalk Service and all items deployed to it are removed.</td>
</tr>
</table>


## Dashboard
Depending on the BizTalk Services Edition, all options listed may not be available. 

When you select your BizTalk Service name, the Dashboard tab is displayed. In Dashboard, you can:

##### Usage Overview: Shows the number of used Hybrid Connections
Also displays the data usage in GB. 

##### Metric Graph: Shows a fixed list of performance metrics
These metrics provide real-time values regarding the health of the BizTalk Service. You can also choose the **Relative** or **Absolute** values and the time range **Interval** of the metrics that are displayed in the graph. 

For a description of these performance metrics, go to [Available Metrics](#Metrics) in this topic.


##### Quick Glance: Lists your BizTalk Service properties

<table border="1">

<tr>
<td><strong>Update Tracking Database credentials</strong></td>
<td>Changes the user name and password used to log into the Tracking Database.</td>
</tr>
<tr>
<td><strong>Update SSL Certificate</strong></td>
<td>Can update the BizTalk Service to use a different SSL certificate. A self-signed SSL certificate is automatically created when you <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=302280">create the BizTalk Service</a>.</td>
</tr>
<tr>
<td><strong>Download Certificate</strong></td>
<td>You can download the SSL certificate used by your BizTalk Service to a local machine.</td>
</tr>
<tr>
<td><strong>Status</strong></td>
<td>Displays the current status of your BizTalk Service. See <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=329870">BizTalk Services: Service state chart</a>. </td>
</tr>
<tr>
<td><strong>Service URL</strong></td>
<td>The URL for your BizTalk Service. This is the same as the <strong>Domain URL</strong> entered when your BizTalk Service is created.</td>
</tr>
<tr>
<td><strong>Public Virtual IP (VIP) Address</strong></td>
<td>The IP address assigned to your BizTalk Service. It is used for all input endpoints and is the source address for outbound traffic. This IP address belongs to your BizTalk Service as long as it is created. If you delete the BizTalk Service, the IP address is assigned to another BizTalk Service.</td>
</tr>
<tr>
<td><strong>ACS Namespace</strong></td>
<td>Authenticates with the BizTalk Service.</td>
</tr>
<tr>
<td><strong>Edition</strong></td>
<td>Lists the Edition entered when the BizTalk Service is created.</td>
</tr>
<tr>
<td><strong>Location</strong></td>
<td>Displays the geographic region that hosts your BizTalk Service.</td>
</tr>
<tr>
<td><strong>Created</strong></td>
<td>Displays the date and time the BizTalk Service was created.</td>
</tr>
<tr>
<td><strong>Tracking Database</strong></td>
<td>The Azure SQL Database name that stores the tracking tables used by your BizTalk Service. 
<br/><br/>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=302280">Requirements Explained</a>  provides details on the Tracking Database.</td>
</tr>
<tr>
<td><strong>Monitoring/Archiving Storage</strong></td>
<td>The Azure Storage account name that stores the monitoring output of your BizTalk Service.
<br/><br/>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=302280">Requirements Explained</a>  provides details on the Storage account.</td>
</tr>
<tr>
<td><strong>Subscription Name</strong></td>
<td>Lists the subscription that hosts your BizTalk Service. The subscription governs access to the Azure classic portal.</td>
</tr>
<tr>
<td><strong>Subscription ID</strong></td>
<td>When a subscription is created, a subscription ID is automatically generated. When using REST APIs, you may need to enter the Subscription ID.</td>
</tr>
</table>

[BizTalk Services: Provisioning Using Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=302280) lists the steps to create a BizTalk Service.


##### Manage, Connection Information, Sync Keys, and Delete in the task bar:

<table border="1">

<tr>
<td><strong>Manage</strong> your application deployment</td>
<td>Opens the Azure BizTalk Services Portal. The BizTalk Services Portal is the entrance to EDI configuration, including adding partners and creating X12, AS2, and EDIFACT agreements.
<br/><br/>
This is the same as <strong>Create partner agreements</strong> on the <strong>Quick Start</strong> tab.
<br/><br/>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=303653">Configuring Components for EDI Messaging on BizTalk Services Portal</a> provides more information on the BizTalk Services Portal.</td>
</tr>
<tr>
<td><strong>Connection Information</strong> of the Access Control Namespace</td>
<td>Displays the Access Control Namespace, Default Issuer, and Default Key values; which can be copied.
<br/><br/>
You can also open the Access Control Portal. This Access Control Portal is the same as using the Active Directory option in the left navigation pane.
<br/><br/>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=285670">Managing Your ACS Namespace</a> provides more information on the Access Control Portal.</td>
</tr>
<tr>
<td><strong>Sync Keys</strong> in the Storage Account</td>
<td>When you create a Storage account, a Primary Key and Secondary Key are automatically created. These encryption Keys control access to your Storage Account. Your BizTalk Service automatically uses the Primary Key. <strong>Sync Keys</strong> enable users to switch between the Primary Key and the Secondary Key without disrupting the BizTalk Service.
<br/><br/>
For example, you want the BizTalk Service to use a new Primary Key for the Storage Account. To do this:
<br/><br/>
<ol>
<li>Select your BizTalk Service and select <strong>Sync Keys</strong>. Select the Secondary Key. When you do this, the BizTalk Service starts using the Secondary Key.</li>
<li>In the Azure classic portal, select your Storage account and Regenerate the Primary Key. Remember, your BizTalk Service is using the Secondary Key.</li>
<li>Select your BizTalk Service and select <strong>Sync Keys</strong>. Now, select the Primary Key. This is the new Primary Key you regenerated.</li>
<li>In the Azure classic portal, select your Storage account and Regenerate the Secondary Key.</li>
</ol>
<br/>
This process is called "rollover keys". The purpose is to enable users to switch between the Primary Key and the Secondary Key without disrupting the BizTalk Service.</td>
</tr>

<tr>
<td><strong>Delete</strong> your application</td>
<td>Your BizTalk Service and all items deployed to it are removed.</td>
</tr>
</table>


## Monitor
Does not apply to the Free Edition.

When you select your BizTalk Service name, the Monitor tab is available and displays the following:

##### Metric Graph: Displays the selected performance metrics
These metrics provide real-time values regarding the health of the BizTalk Service. You choose which performance metrics are displayed. A maximum of six performance metrics can be displayed simultaneously. 

You can also choose the **Relative** or **Absolute** values and the time range **Interval** of the metrics that are displayed. 

##### To remove or display metrics in the graph:
1. Select the **Monitor** tab.
2. Select **Add Metrics** in the task bar:  
![Select Add Metrics][AddMetrics]
3. Check the performance metrics you want to display.
4. Select the checkmark to return to the **Monitor** tab.
5. Select the circle next to the metric to display that metric's value in the graph.  

	For example, the **CPU Usage** metric is grayed out; its output is not displayed in the graph:  
![CPU Usage metric is grayed out][GrayedMetric]  

	Select the grayed out circle to enable the **CPU Usage** metric to display its output in the graph:  
![CPU Usage metric is enabled][EnabledMetric]

6. To remove a metric from the display graph and the list, select **Delete Metric** in the task bar. To add the metric back to the list, select **Add Metrics** in the task bar, check the metric, and select the checkmark to return to the **Monitor** tab. Select the grayed out circle to enable the metric.

## <a name="Metrics"></a>Available Metrics
The following performance counters/metrics are available:

<table border="1">

<tr>
<td><strong>RountdTrip Latency</strong></td>
<td>Displays the average time taken in milliseconds (ms) to process a message from the time the message is received until the message is fully processed by the BizTalk Service across all bridges. Only messages successfully processed are counted.<br/><br/>
When the following events occur, a timestamp is created:
<ul>
<li>Message enters the gateway</li>
<li>Message is routed to the destination</li>
<li>Destination response is received</li>
<li>Destination acknowledgement response sent to the gateway</li>
</ul>
<br/>
This metric shows the result of the following calculation:
<br/><br/>
[Destination acknowledgement response sent to the gateway] - [Message enters the gateway]</td>
</tr>
<tr>
<td><strong>Failures At Source</strong></td>
<td>Displays the total number of messages that failed by the BizTalk Service when pulling messages from the source endpoints.</td>
</tr>
<tr>
<td><strong>CPU Usage</strong></td>
<td>Lists the average %Processor Time of all role instances.</td>
</tr>
<tr>
<td><strong>Processing Latency</strong></td>
<td>Displays the average time taken In milliseconds (ms) to process a message by the BizTalk Service across all bridges, excluding the time spent in destinations. Only messages successfully processed are counted.<br/><br/>
When each of the following events occur, a timestamp is created:

<ul>
<li>Message enters the gateway</li>
<li>Message is routed to the destination</li>
<li>Destination response is received</li>
<li>Destination acknowledgement response sent to the gateway</li>
</ul>
<br/>This metric shows the result of the following calculation:<br/><br/>
[Destination acknowledgement response sent to the gateway] - [Message enters the gateway] - [Destination response is received] + [Message is routed to the destination]</td>
</tr>
<tr>
<td><strong>Failures In Process</strong></td>
<td>Displays the total number of messages that failed during processing by the BizTalk Service across all the bridges within a time interval.</td>
</tr>
<tr>
<td><strong>Messages Sent</strong></td>
<td>Displays the total number of messages sent by the BizTalk Service across all bridges within a time interval. This metric is incremented when a message sent from a pipeline reaches the route destination. This metric does not indicate that a message is successfully processed.<br/><br/>
In a Request-Reply scenario, the metric is incremented when the route destination sends a receipt acknowledgement back to the pipeline.</td>
</tr>
<tr>
<td><strong>Messages Received</strong></td>
<td>Displays the total number of messages received by the BizTalk Service across all bridges within a time interval. This metric is incremented when a new message is received by the pipeline.</td>
</tr>
<tr>
<td><strong>Messages In Process</strong></td>
<td>Displays the total number of messages currently being processed by the BizTalk Service within a time interval.</td>
</tr>
<tr>
<td><strong>Messages Processed</strong></td>
<td>Displays the total number of messages successfully processed by the BizTalk Service across all bridges within a time interval. This metric is incremented when a message is successfully received by the pipeline and successfully routed to the destination.</td>
</tr>
</table>


## Scale
In the Scale tab, you can add or subtract the number of units used by your BizTalk Service. By default, there is one Unit configured. Additional Units can be added to scale your BizTalk Service. When you increase the scale, you are increasing throughput. The amount of resources also increases, including deployed bridges, agreements, LOB connections, and processing power. For example, you increase the scale from 1 Unit to 2 Units. In this situation, you can deploy double the number of bridges, double the agreements, double the LOB connections, and double the processing power.

Some BizTalk editions do not offer a scale option. In this situation, one Unit is permitted. To determine how many units your edition can be scaled, refer to [BizTalk Services: Editions Chart](biztalk-editions-feature-chart.md).

Increasing the number of units may impact pricing. If you increase the Units, selecting **Save** displays a message that tells you if billing is impacted. You then choose to continue. When you increase the number of Units, the BizTalk Service status changes from Active to Updating. In the Updating state, your BizTalk Service continues to run.

[BizTalk Services: Editions Chart](biztalk-editions-feature-chart.md) defines a "Unit".


## Configure
Does not apply to Hybrid Connections.

Sets the Backup Status to None or Automatic. When set to None, no backups are automatically created. When set to Automatic, you configure the backup location, the frequency of the backup, and how long to keep the backup files. 

[BizTalk Services: Backup and Restore](biztalk-backup-restore.md) provides the details. 


## <a name="HybridConnections"></a>Hybrid Connections
Hybrid Connections connect an Azure application, like Websites or Mobile Services, to an on-premises resource that uses a static TCP port, such as SQL Server, MySQL, HTTP Web APIs, and most custom Web Services. Hybrid Connections are managed in  BizTalk Services in the Azure classic portal.

To create Hybrid Connections in Azure Websites, see [Hybrid Connection: Connect an Azure Web Site to an On-Premises Resource](http://go.microsoft.com/fwlink/p/?LinkId=397538).

To use Hybrid Connections in Azure Mobile Services, see [Azure Mobile Services and Hybrid Connections](../mobile-services/mobile-services-dotnet-backend-hybrid-connections-get-started.md).

To create or manage Hybrid Connections in Azure BizTalk Services, see [Hybrid Connections](integration-hybrid-connection-overview.md).



## Next
Now that you're familiar with the different tabs, you can learn more about the Azure BizTalk Services features:

- [BizTalk Services: Throttling](biztalk-throttling-thresholds.md)  
- [BizTalk Services: Issuer Name and Issuer Key](biztalk-issuer-name-issuer-key.md)  
- [BizTalk Services: Backup and Restore](biztalk-backup-restore.md)

## See Also
- [Hybrid Connections](integration-hybrid-connection-overview.md)  
- [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](biztalk-editions-feature-chart.md)  
- [BizTalk Services: Provisioning Using Azure classic portal](biztalk-provision-services.md)  
- [BizTalk Services: BizTalk Service State Chart](biztalk-service-state-chart.md)  
- [How do I Start Using the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)

[QuickStart]: ./media/biztalk-dashboard-monitor-scale-tabs/QuickStartIcon.png
[AddMetrics]: ./media/biztalk-dashboard-monitor-scale-tabs/WABS_AddMetrics.png
[GrayedMetric]: ./media/biztalk-dashboard-monitor-scale-tabs/WABS_GrayedMetric.png
[EnabledMetric]: ./media/biztalk-dashboard-monitor-scale-tabs/WABS_EnabledMetric.png
 
