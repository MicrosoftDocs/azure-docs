

# **BizTalk Services: Dashboard, Monitor and Scale tabs**

The first time you open the Windows Azure Management Portal, you are automatically placed at the **ALL ITEMS** tab. The columns in the **ALL ITEMS** tab can be sorted. To view your BizTalk Service, select your BizTalk Service in the **ALL ITEMS** tab or click the **BIZTALK SERVICES** tab; and then click your BizTalk Service name.

This opens a new window with the following options:

[Quick Start](#QuickStart)

[Dashboard](#Dashboard)

[Monitor](#Monitor)

[Scale](#Scale)

This topic describes these tabs.


##<a name="QuickStart"></a>**Quick Start**

When you click your BizTalk Service name, the Quick Start tab is displayed. In the Quick Start tab, you can do the following:


<table border>
<tr bgcolor="FAF9F9">
        <td><b>Option</b></td>
        <td><b>Description</b></td>
</tr>
    <tr>
        <td>Get the tools</td>

        <td>Download the BizTalk Services SDK to install the Visual Studio project templates on your on-premise development computer. These templates create the <b>BizTalk Services</b> (bridge) and the <b>BizTalk Service Artifacts</b> (Transform) Visual Studio projects that are deployed to your BizTalk Service.

        <br><br>
		<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=302335"> How do I Start Using the Windows Azure BizTalk Services SDK </a> and <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=241589">Installing the Windows Azure BizTalk Services SDK - June 2013 Preview</a> lists the steps to get started.
        </td>
    </tr>

    <tr>
        <td>Create partner agreements</td>

        <td>Opens the Windows Azure BizTalk Services Portal hosted on Windows Azure where you add partners and create X12 and AS2 EDI agreements.

        <br><br>

        <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=303653">Configuring Components for EDI Messaging on BizTalk Services Portal</a> lists the steps to get started.
        </td>
    </tr>

<tr>
        <td>Learn more about BizTalk Services</td>

        <td>Go to the learning center to learn more about Azure BizTalk Services.</td>
</tr>

</table>


In the task bar at the bottom, you can **Manage** the BizTalk Service, **Sync Keys** of the Storage Account, or **Delete** the BizTalk Service:


<table border>
<tr bgcolor="FAF9F9">
        <td><b>Option</b></td>
        <td><b>Description</b></td>
</tr>
<tr>
<td>Manage</td>
<td>When you click Manage, the Windows Azure BizTalk Services Portal opens. The BizTalk Services Portal is the entrance to EDI configuration, including adding partners and creating AS2 and X12 agreements.
<br><br>
This is the same as <b>Create partner agreements</b> on the <b>Quick Start</b> tab.
<br><br>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=303653">Configuring Components for EDI Messaging on BizTalk Services Portal</a> provides more information on the BizTalk Services Portal.</td>
</tr>

<tr>
<td>Sync Keys</td>
<td>When you create a Storage account, a Primary Key and Secondary Key are automatically created. These Keys control access to your Storage Account. Your BizTalk Service automatically uses the Primary Key. <b>Sync Keys</b> enable users to switch between the Primary Key and the Secondary Key without disrupting the BizTalk Service.
<br><br>
For example, you want the BizTalk Service to use a new Primary Key for the Storage Account. To do this:
<br><br>
<ol>
<li>Click your BizTalk Service and click <b>Sync Keys</b>. Select the Secondary Key. When you do this, the BizTalk Service starts using the Secondary Key.</li>
<li>In the Windows Azure Management Portal, click your Storage account and Regenerate the Primary Key. Remember, your BizTalk Service is using the Secondary Key.</li>
<li>Click your BizTalk Service and click <b>Sync Keys</b>. Now, select the Primary Key. This is the new Primary Key you regenerated.</li>
<li>In the Windows Azure Management Portal, click your Storage account and Regenerate the Secondary Key.</li>
</ol>
<br>
This process is called “rollover keys”. The purpose is to enable users to switch between the Primary Key and the Secondary Key without disrupting the BizTalk Service.</td>
</tr>

<tr>
<td>Delete</td>
<td>When you click Delete, your BizTalk Service and all items deployed to it are removed.</td>
</tr>
</table>


##<a name="Dashboard"></a>**Dashboard**

The Dashboard displays the following information:

#### **Metric Graph**

A graph that shows a fixed list of performance metrics. These metrics provide real-time values regarding the health of your BizTalk Service. Metrics include:

- CPU Usage
- Failures at Source
- Failures in Process
- Messages Processed
- Messages Received
- Processing Latency

For a description of these performance metrics, go to [Available Metrics](#Metrics) in this topic.

##### **Relative or Absolute**
The graph shows trends, displaying only the current value of each metric; which is the **Relative** option. To display a Y axis to see the absolute values, select **Absolute**.

##### **Interval**
Modifies the time range the metrics are displayed in the graph. Options include:

- 1 Hour
- 1 Day
- 7 Days


#### **Quick Glance**

Lists your BizTalk Service properties, including the following:

<table border>
<tr bgcolor="FAF9F9">
        <td><b>Option</b></td>
        <td><b>Description</b></td>
</tr>
<tr>
<td>Update Tracking Database credentials</td>
<td>Changes the user name and password used to log into the Tracking Database.<br><br>
When you provision the BizTalk Service, you enter a user name and password to log into the Tracking Database. Using this option, you can modify your BizTalk Service to use a different user name and password to log into the Tracking Database.<br><br>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=302280">BizTalk Services: Provisioning Using Windows Azure Management Portal</a> lists the steps to provision a BizTalk Service.</td>
</tr>
<tr>
<td>Update SSL Certificate</td>
<td>Can enter a different SSL certificate.<br><br>
When you provision the BizTalk Service, you enter a SSL certificate. Using this option, you can modify your BizTalk Service to use a different SSL certificate.<br><br>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=302280">BizTalk Services: Provisioning Using Windows Azure Management Portal</a> lists the steps to provision a BizTalk Service.</td>
</tr>
<tr>
<td>Status</td>
<td>Shows the current status of your BizTalk Service.</td>
</tr>
<tr>
<td>Service URL</td>
<td>This URL routes to your BizTalk Service. This is the same as the <b>Domain URL</b> entered when your BizTalk Service is provisioned. </td>
</tr>
<tr>
<td>Public virtual IP address (VIP)</td>
<td>This IP address is assigned to your BizTalk Service. It is used for all input endpoints and is the source address for outbound traffic. This IP address belongs to your BizTalk Service as long as it is provisioned. If you delete the BizTalk Service, the IP address is assigned to another service deployment.</td>
</tr>
<tr>
<td>Edition</td>
<td>Lists the Edition. Options include Developer, Basic, Standard, and Premium. This is the same Edition entered when the BizTalk Service is provisioned. <br><br>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=302281">BizTalk Services: Developer, Basic, Standard and Premium Editions Chart</a> lists the edition differences, including costs.</td>
</tr>
<tr>
<td>Location</td>
<td>Shows the geographic region that hosts your BizTalk Service. This is the same as the <b>Region</b> entered when the BizTalk Service is provisioned.</td>
</tr>
<tr>
<td>ACS Namespace</td>
<td>Authenticates with BizTalk Service. This is the same <b>ACS Namespace</b> entered when the BizTalk Service is provisioned.</td>
</tr>
<tr>
<td>Tracking Database</td>
<td>the SQL Database name that stores the tracking tables used by your BizTalk Service. This is the same <b>Tracking Database</b> entered when the BizTalk Service is provisioned.</td>
</tr>
<tr>
<td>Monitoring/Archiving Storage</td>
<td>The Storage account name that stores the monitoring output of your BizTalk Service. This is the same <b>Monitoring/Archiving Storage Account</b> entered when the BizTalk Service is provisioned.</td>
</tr>
<tr>
<td>Subscription Name</td>
<td>The subscription governs access to the Windows Azure Management Portal. This is the same <b>Subscription</b> name selected when the BizTalk Service is provisioned.</td>
</tr>
<tr>
<td>Subscription ID</td>
<td>The subscription governs access to the Windows Azure Management Portal. When a subscription is created, a subscription ID is automatically generated. When using REST APIs, you may need to enter the Subscription ID.</td>
</tr>
</table>

[BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280) lists the steps to provision a BizTalk Service.


#### **Manage, Sync Keys and Delete**
In the task bar at the bottom, you can **Manage** the BizTalk Service, **Sync Keys** of the Storage Account, or **Delete** the BizTalk Service:

<table border>
<tr bgcolor="FAF9F9">
        <td><b>Option</b></td>
        <td><b>Description</b></td>
</tr>
<tr>
<td>Manage</td>
<td>When you click Manage, the Windows Azure BizTalk Services Portal opens. The BizTalk Services Portal is the entrance to EDI configuration, including adding partners and creating AS2 and X12 agreements.
<br><br>
This is the same as <b>Create partner agreements</b> on the <b>Quick Start</b> tab.
<br><br>
<a HREF="http://go.microsoft.com/fwlink/p/?LinkID=303653">Configuring Components for EDI Messaging on BizTalk Services Portal</a> provides more information on the BizTalk Services Portal.</td>
</tr>

<tr>
<td>Sync Keys</td>
<td>When you create a Storage account, a Primary Key and Secondary Key are automatically created. These Keys control access to your Storage Account. Your BizTalk Service automatically uses the Primary Key. <b>Sync Keys</b> enable users to switch between the Primary Key and the Secondary Key without disrupting the BizTalk Service.
<br><br>
For example, you want the BizTalk Service to use a new Primary Key for the Storage Account. To do this:
<br><br>
<ol>
<li>Click your BizTalk Service and click <b>Sync Keys</b>. Select the Secondary Key. When you do this, the BizTalk Service starts using the Secondary Key.</li>
<li>In the Windows Azure Management Portal, click your Storage account and Regenerate the Primary Key. Remember, your BizTalk Service is using the Secondary Key.</li>
<li>Click your BizTalk Service and click <b>Sync Keys</b>. Now, select the Primary Key. This is the new Primary Key you regenerated.</li>
<li>In the Windows Azure Management Portal, click your Storage account and Regenerate the Secondary Key.</li>
</ol>
<br>
This process is called “rollover keys”. The purpose is to enable users to switch between the Primary Key and the Secondary Key without disrupting the BizTalk Service.</td>
</tr>

<tr>
<td>Delete</td>
<td>When you click Delete, your BizTalk Service and all items deployed to it are removed.</td>
</tr>
</table>


##<a name="Monitor"></a>**Monitor**

The Monitor tab displays the following information: 

#### **Metric Graph**

A graph that displays the selected performance metrics. These metrics provide real-time values regarding the health of your BizTalk Service. You choose which performance metrics are displayed. A maximum of six performance metrics can be displayed simultaneously.


##### **Relative or Absolute**
The graph shows trends, displaying only the current value of each metric; which is the **Relative** option. To display a Y axis to see the absolute values, select **Absolute**.


##### **Interval**
Modifies the time range the metrics are displayed in the graph. Options include:

- 1 Hour
- 1 Day
- 7 Days


#### **To remove or display metrics in the graph**

>1. Click the **Monitor** tab.
>2. Click **Add Metrics** in the task bar:<br>
![Click Add Metrics][AddMetrics]
>3. Check the performance metrics you want to display on the **Monitor** tab.
>4. Click the checkmark to return to the **Monitor** tab.
>5. Click the circle next to the metric to display that metric’s value in the graph.<br>
For example, the **CPU Usage** metric is grayed out; its output is not displayed in the graph:<br>
![CPU Usage metric is grayed out][GrayedMetric]
<br>
Click the grayed out circle to enable the **CPU Usage** metric to display its output in the graph:<br>
![CPU Usage metric is enabled][EnabledMetric]

>6. To remove a metric from the display graph and the list, click **Delete Metric** in the task bar. Clicking **Delete Metric** removes the metric from the Monitor tab. To add the metric back to the list, click **Add Metrics** in the task bar, check the metric, and click the checkmark to return to the **Monitor** tab. Click the grayed out circle to enable the metric in the graph.

##<a name="Metrics"></a>**Available Metrics**

The following performance counters/metrics are available:

<table border>
<tr bgcolor="FAF9F9">
<td><b>Metric</b></td>
<td><b>Description</b></td>
</tr>
<tr>
<td>CPU Usage</td>
<td>Enabled by default. Lists the average %Processor Time of all role instances.</td>
</tr>
<tr>
<td>Failures At Source</td>
<td>Enabled by default. A performance metric that displays the total number of messages that failed by the BizTalk Service when pulling messages from the source endpoints.</td>
</tr>
<tr>
<td>Failures In Process</td>
<td>Enabled by default. A performance metric that displays the total number of messages that failed during processing by the BizTalk Service across all the bridges within a time interval.</td>
</tr>
<tr>
<td>Messages In Process</td>
<td>A performance metric that displays the total number of messages currently being processed by the BizTalk Service within a time interval.</td>
</tr>
<tr>
<td>Messages Processed</td>
<td>Enabled by default. A performance metric that displays the total number of messages successfully processed by the BizTalk Service across all bridges within a time interval. This metric is incremented when a message is successfully received by the pipeline and successfully routed to the destination.</td>
</tr>
<tr>
<td>Messages Received</td>
<td>Enabled by default. A performance metric that displays the total number of messages received by the BizTalk Service across all bridges within a time interval. This metric is incremented when a new message is received by the pipeline.</td>
</tr>
<tr>
<td>Messages Sent</td>
<td>A performance metric that displays the total number of messages sent by the BizTalk Service across all bridges within a time interval. This metric is incremented when a message sent from a pipeline reaches the route destination. This metric does not indicate that a message is successfully processed.<br><br>
In a Request-Reply scenario, the metric is incremented when the route destination sends a receipt acknowledgement back to the pipeline.</td>
</tr>
<tr>
<td>Processing Latency</td>
<td>In milliseconds (ms), this performance metric displays the average time taken to process a message by the BizTalk Service across all bridges, excluding the time spent in destinations. Only messages successfully processed are counted.<br><br>
When each of the following events occur, a timestamp is created:

<bl>
<li>Message enters the gateway</li>
<li>Message is routed to the destination</li>
<li>Destination response is received</li>
<li>Destination acknowledgement response sent to the gateway</li>
</bl>
<br>This metric shows the result of the following calculation:<br><br>
[Destination acknowledgement response sent to the gateway] – [Message enters the gateway] – [Destination response is received] + [Message is routed to the destination]</td>
</tr>
<tr>
<td>RountdTrip Latency</td>
<td>In milliseconds (ms), this performance metric displays the average time taken to process a message from the time it is received until it is fully processed by the BizTalk Service across all bridges. Only messages successfully processed are counted.<br><br>
When the following events occur, a timestamp is created:
<bl>
<li>Message enters the gateway</li>
<li>Message is routed to the destination</li>
<li>Destination response is received</li>
<li>Destination acknowledgement response sent to the gateway</li>
</bl>
<br>
This metric shows the result of the following calculation:
<br><br>
[Destination acknowledgement response sent to the gateway] – [Message enters the gateway]</td>
</tr>
</table>


##<a name="Scale"></a>**Scale**

In the Scale tab, you can add or subtract the number of units used by your BizTalk Service. By default, there is one Unit configured. Additional Units can be added to scale your BizTalk Service. When you increase the scale, you are increasing throughput. The amount of resources also increases, including deployed bridges, agreements, LOB connections, and processing power. For example, you increase the scale from 1 Unit to 2 Units. In this situation, you can deploy double the number of bridges, double the agreements, double the LOB connections, and double the processing power.

Some BizTalk editions do not offer a scale option. In this situation, one Unit is permitted. To determine how many units your edition can be scaled, refer to [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279).

Increasing the number of units may impact pricing. If you increase the Units, clicking **Save** displays a message that tells you if billing is impacted. You then choose to continue. When you increase the number of Units, the BizTalk Service status changes from Active to Updating. In the Updating state, your BizTalk Service continues to run.



## **Next**

Now that you’re familiar with the different tabs, you can learn more about the Windows Azure BizTalk Services features:

[BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)<br>
[BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)

## **See Also**
[BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br>
[BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br>
[How do I Start Using the Windows Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)

[AddMetrics]: ../Media/WABS_AddMetrics.png
[GrayedMetric]: ../Media/WABS_GrayedMetric.png
[EnabledMetric]: ../Media/WABS_EnabledMetric.png