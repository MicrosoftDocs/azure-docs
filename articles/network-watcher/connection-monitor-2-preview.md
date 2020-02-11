---
title: Connection Monitor (Preview) | Microsoft Docs
description: Learn how to use Connection Monitor (Preview) to monitor network communication in a distributed environment.
services: network-watcher
documentationcenter: na
author: vinynigam
manager: agummadi
editor: ''
tags: azure-resource-manager

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/27/2020
ms.author: vinigam
ms.custom: mvc
#Customer intent: I need to monitor communication between a VM and another VM. If the communication fails, I need to know why so that I can resolve the problem. 
---
# Unified connectivity monitoring in Connection Monitor (Preview)

Connection Monitor (Preview) provides unified end-to-end connection monitoring in Azure Network Watcher. The Connection Monitor feature supports hybrid and Azure cloud deployments. Azure Network Watcher provides tools to monitor, diagnose, and view connectivity-related metrics for your Azure deployments.

Here are some use cases for Connection Monitor (Preview):

- Your front-end web server VM communicates with a database server VM in a multiple-tier application. You want to check network connectivity between the two VMs.
- You want VMs in the East US region to ping VMs in the Central US region, and you want to compare cross-region network latencies.
- You have multiple on-premises office sites in Seattle and in Ashburn, Virginia. Your office sites connect to Office 365 URLs. For your users of Office 365 URLs, you want to compare the latencies in Seattle with those in Ashburn.
- Your hybrid application needs connectivity to an Azure Storage endpoint. You want to compare the latencies of the on-premises site and the Azure application that connect to the same Azure Storage endpoint.
- You want to check the connectivity between your on-premises setups and the Azure VMs that host your cloud application.

In its preview phase, Connection Monitor combines the best of two features: the Network Watcher [Connection Monitor](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview#monitor-communication-between-a-virtual-machine-and-an-endpoint) feature, and the Network Performance Monitor (NPM) [Service Connectivity Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/network-performance-monitor-service-connectivity) feature.

Here are some benefits of Connection Monitor (Preview):

* Unified, intuitive experience for Azure and hybrid monitoring needs
* Cross-region, cross-workspace connectivity monitoring
* Higher probing frequencies and better visibility into network performance
* Faster alerting for your hybrid deployments
* Support for connectivity checks that are based on HTTP, TCP, and ICMP 
* Metrics and Log Analytics support for both Azure and non-Azure test setups

![Diagram showing how Connection Monitor interacts with Azure VMs, non-Azure hosts, endpoints, and data storage locations](./media/connection-monitor-2-preview/hero-graphic.png)

Follow the steps in the next sections to start using Connection Monitor (Preview) for monitoring.

## Step 1: Install monitoring agents

Connection Monitor relies on lightweight executable files to run connectivity checks.  It supports connectivity checks from both Azure environments and on-premises environments. The executable file that you use depends on whether your VM is hosted on Azure or on-premises.

### Agents for Azure virtual machines

To make Connection Monitor recognize your Azure VMs as monitoring sources, install the Network Watcher Agent virtual machine extension on them. This extension is also known as the *Network Watcher extension*. Azure virtual machines require the extension to trigger end-to-end monitoring and other advanced functionality. 

You can install the Network Watcher extension when you [create a VM](https://docs.microsoft.com/azure/network-watcher/connection-monitor#create-the-first-vm). You can also separately install, configure, and troubleshoot the Network Watcher extension for [Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/network-watcher-linux) and [Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/network-watcher-windows).

Rules for a network security group (NSG) or firewall can block communication between the source and destination. Connection Monitor detects this issue and shows it as a diagnostic message in the topology. To enable connection monitoring, ensure that NSG and firewall rules allow packets over TCP or ICMP between the source and destination.

### Agents for on-premises machines

To make Connection Monitor recognize your on-premises machines as sources for monitoring, install the Log Analytics agent on the machines. Then enable the Network Performance Monitor solution. These agents are linked to Log Analytics workspaces, so you need to set up the workspace ID and primary key before they can start monitoring.

To install the Log Analytics agent for Windows machines, see [Azure Monitor virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/oms-windows).

If the path includes firewalls or network virtual appliances (NVAs), then make sure that the destination is reachable.

## Step 2: Enable Network Watcher on your subscription

All subscriptions that have a virtual network use Network Watcher. When you create a virtual network in your subscription, Network Watcher is automatically enabled in the virtual network's region and subscription. This automatic enabling doesn't affect your resources or incur a charge. Ensure that Network Watcher isn't explicitly disabled on your subscription. 

For more information, see [Enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create).

## Step 3: Create a connection monitor 

Connection Monitor monitors communication at regular intervals. It informs you of changes in reachability, latency, and network topology between source agents and destination endpoints. 

Sources can be Azure VMs or on-premises machines that have an installed monitoring agent. Destination endpoints can be Office 365 URLs, Dynamics 365 URLs, custom URLs, Azure VM resource IDs, IPv4, IPv6, FQDN, or any domain name.

### Access Connection Monitor (Preview)

1. On the Azure portal home page, go to **Network Watcher**.
1. On the left, in the **Monitoring** section, select **Connection Monitor (Preview)**.
1. You see all of the connection monitors that were created in Connection Monitor (Preview). To see the connection monitors that were created in the classic experience of Connection Monitor, go to the **Connection Monitor** tab.

    ![Screenshot showing connection monitors that were created in Connection Monitor (Preview)](./media/connection-monitor-2-preview/cm-resource-view.png)


### Create a connection monitor

Connection monitors that are created in Connection Monitor (Preview) provide the ability to add both on-premises and Azure VMs as sources. They can also monitor connectivity to endpoints. The endpoints can be on Azure or any other URL or IP.

A connection monitor includes the following entities:

* **Connection monitor resource** – A region-specific Azure resource. All of the following entities are properties of a connection monitor resource.
* **Endpoint** – A source or destination that participates in connectivity checks. Examples of endpoints include Azure VMs, on-premises agents, URLs, and IPs.
* **Test configuration** – A protocol-specific configuration for a test. Based on the protocol you chose, you can define the port, thresholds, test frequency, and other parameters.
* **Test group** – The group that contains source endpoints, destination endpoints, and test configurations. A connection monitor can contain more than one test group.
* **Test** – The combination of a source endpoint, destination endpoint, and test configuration. A test is the lowest level at which monitoring data is available. The monitoring data includes the percentage of checks that failed and the round-trip time (RTT).

 ![Diagram showing a connection monitor, defining the relationship between test groups and tests](./media/connection-monitor-2-preview/cm-tg-2.png)

#### Create a connection monitor from the Azure portal

To create a connection monitor from the Azure portal, follow these steps:

1. On the **Connection Monitor (Preview)** dashboard, in the upper-left, select **Create**.
1. On the **Basic** tab, enter information for your connection monitor:
   * **Connection Monitor Name** – Add the name of your connection monitor. Use the standard naming rules for Azure resources.
   * **Subscription** – Choose a subscription for your connection monitor.
   * **Region** – Choose a region for your connection monitor resource. You can select only the source VMs that are created in this region.
   * **Workspace configuration** - Your workspace holds your monitoring data. You can use a custom workspace or the default workspace. 
       * To use the default workspace that the connection monitor creates, select the check box. 
       * To choose a custom workspace, clear this box. Then choose the subscription and region for your custom workspace. 
1. At the bottom of the tab, select **Next: Test groups**.

   ![Screenshot showing the Basics tab in Connection Monitor](./media/connection-monitor-2-preview/create-cm-basics.png)

1. On the **Test groups** tab, select **+ Test group**. To set up your test groups, see [Create test groups in Connection Monitor](#Create-test-groups-in-connection-monitor). 
1. At the bottom of the tab, select **Next: Review + create** to review your connection monitor.

   ![Screenshot showing the Test groups tab and the pane where you add test group details](./media/connection-monitor-2-preview/create-tg.png)

1. On the **Review + create** tab, review the basic information and test groups before you create the connection monitor. If you need to edit the connection monitor:
   * To edit basic details, select the pencil icon.
   * To edit a test group, select it.

   > [!NOTE] 
   > The **Review + create** tab shows the cost per month during the Connection Monitor preview stage. Currently, the **CURRENT COST** column shows no charge. When Connection Monitor becomes generally available, this column will show a monthly charge. 
   > 
   > Even in the Connection Monitor preview stage, Log Analytics ingestion charges apply.

1. When you're ready to create the connection monitor, at the bottom of the **Review + create** tab, select **Create**.

   ![Screenshot of Connection Monitor, showing the Review + create tab](./media/connection-monitor-2-preview/review-create-cm.png)

Connection Monitor (Preview) creates the connection monitor resource in the background.

#### Create a connection monitor by using ARMClient

Use the following code to create a connection monitor by using ARMClient.

```armclient
$connectionMonitorName = "sampleConnectionMonitor"

$ARM = "[https://](https://apac01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fbrazilus.management.azure.com&amp;data=02%7C01%7CManasi.Sant%40microsoft.com%7Cd900da4ed7f24366842108d68022159b%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636837281231186904&amp;sdata=qHL8zWjkobY9MatRpAVbODwboKSQAqqEFOMnjmfyOnU%3D&amp;reserved=0)management.azure.com"

$SUB = "subscriptions/\&lt;subscription id 1\&gt;"

$NW = "resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher\_centraluseuap"

$body =

"{

location: 'eastus',

properties: {

endpoints: [{

name: 'workspace',

resourceId: '/subscriptions/\&lt;subscription id\&gt;/resourcegroups/\&lt;resource group\&gt;/providers/Microsoft.OperationalInsights/workspaces/sampleWorkspace',

filter: {

 items: [{

type: 'AgentAddress',

address: '\&lt;FQDN of your on-premises agent'

}]

}

          },

 {

name: 'vm1',

resourceId: '/subscriptions/\&lt;subscription id\&gt;/resourceGroups/\&lt;resource group\&gt;/providers/Microsoft.Compute/virtualMachines/\&lt;vm-name\&gt;'

},

 {

name: 'vm2',

resourceId: '/subscriptions/\&lt;subscription id\&gt;/resourceGroups/\&lt;resource group\&gt;/providers/Microsoft.Compute/virtualMachines/\&lt;vm-name\&gt;'

   },

{

name: 'azure portal'

address: '\&lt;URL\&gt;'

   },

 {

    name: 'ip',

     address: '\&lt;IP\&gt;'

 }

  ],

  testGroups: [{

    name: 'Connectivity to Azure Portal and Public IP',

    testConfigurations: ['http', 'https', 'tcpEnabled', 'icmpEnabled'],

    sources: ['vm1', 'workspace'],

    destinations: ['azure portal', 'ip']

   },

{

    name: 'Connectivty from Azure VM 1 to Azure VM 2',

    testConfigurations: ['http', 'https', 'tcpDisabled', 'icmpDisabled'],

    sources: ['vm1'],

    destinations: ['vm2'],

    disable: true

   }

  ],

  testConfigurations: [{

    name: 'http',

    testFrequencySec: 60,

    protocol: 'HTTP',

    successThreshold: {

     checksFailedPercent: 50,

     roundTripTimeMs: 3.4

    }

   }, {

    name: 'https',

    testFrequencySec: 60,

    protocol: 'HTTP',

    httpConfiguration: {

     preferHTTPS: true

    },

    successThreshold: {

     checksFailedPercent: 50,

     roundTripTimeMs: 3.4

    }

   }, {

    name: 'tcpEnabled',

    testFrequencySec: 30,

    protocol: 'TCP',

    tcpConfiguration: {

     port: 80

    },

    successThreshold: {

     checksFailedPercent: 30,

     roundTripTimeMs: 5.2

    }

   }, {

    name: 'icmpEnabled',

    testFrequencySec: 90,

    protocol: 'ICMP',

    successThreshold: {

     checksFailedPercent: 50,

     roundTripTimeMs: 3.4

    }

   }, {

    name: 'icmpDisabled',

    testFrequencySec: 120,

    protocol: 'ICMP',

    icmpConfiguration: {

     disableTraceRoute: true

    },

    successThreshold: {

     checksFailedPercent: 50,

     roundTripTimeMs: 3.4

    }

   }, {

    name: 'tcpDisabled',

    testFrequencySec: 45,

    protocol: 'TCP',

    tcpConfiguration: {

     port: 80,

     disableTraceRoute: true

    },

    successThreshold: {

     checksFailedPercent: 30,

     roundTripTimeMs: 5.2

    }

   }

  ]

 }

} "
```

Here's the deployment command:
```
armclient PUT $ARM/$SUB/$NW/connectionMonitors/$connectionMonitorName/?api-version=2019-07-01 $body -verbose
```

### Create test groups in a connection monitor

Each test group in a connection monitor includes sources and destinations that get tested on network parameters. They're tested for the percentage of checks that fail and the RTT over test configurations.

#### Create a test group from the Azure portal

In the Azure portal, to create a test group in a connection monitor, you specify values for the following fields:

* **Disable Test Group** – You can select this field to disable monitoring for all sources and destinations that the test group specifies. This selection is cleared by default.
* **Name** – Name your test group.
* **Sources** – You can specify both Azure VMs and on-premises machines as sources if agents are installed on them. Refer to [Step 1](#step-1:-install-monitoring-agents) to install an agent for your source.
   * To choose Azure agents, select the **Azure Agents** tab. Here you see only VMs that are bound to the region that you specified when you created the connection monitor. By default, VMs are grouped into the subscription that they belong to. These groups are collapsed. 
   
       You can drill down from the Subscription level to other levels in the hierarchy:

      ```Subscription -\&gt; resource groups -\&gt; VNETs -\&gt; Subnets -\&gt; VMs with agents Y```

      You can also change the value of the **Group by** field to start the tree from any other level. For example, if you group by virtual network, you see the VMs that have agents in the hierarchy `VNETs -\&gt; Subnets -\&gt; VMs with agents`.

      ![Screenshot of Connection Monitor, showing the Add Sources panel and the Azure Agents tab](./media/connection-monitor-2-preview/add-azure-sources.png)

   * To choose on-premises agents, select the **Non–Azure Agents** tab. By default, agents are grouped into workspaces by region. These workspaces are only those that have the Network Performance Monitor solution configured. 
   
       If you need to add Network Performance Monitor to your workspace, get it from [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.NetworkMonitoringOMS?tab=Overview). For information about how to add Network Performance Monitor, see [Monitoring solutions in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/solutions). 
   
        In the **Create Connection Monitor** view, on the **Basics** tab,
        the default region is selected. If you change the region, you can choose agents from workspaces in the new region. You can also change the value of the **Group by** field to group by subnets.

      ![Screenshot of Connection Monitor, showing the Add Sources panel and the Non-Azure Agents tab](./media/connection-monitor-2-preview/add-non-azure-sources.png)


   * To review the Azure and Non-Azure agents that you selected, go to the **Review** tab.

      ![Screenshot of Connection Monitor, showing the Add Sources panel and the Review tab](./media/connection-monitor-2-preview/review-sources.png)

    * When you finish setting up sources, at the bottom of the **Add Sources** panel, select **Done**.

* **Destinations** – You can monitor connectivity to Azure VMs or any endpoint (a public IP, URL, or FQDN) by specifying them as destinations. In a single test group, you can add Azure VMs, Office 365 URLs, Dynamics 365 URLs, or custom endpoints.

    * To choose Azure VMs as destinations, select the **Azure VMs** tab. By default, the Azure VMs are grouped into a subscription hierarchy that's in the same region that you selected in the **Create Connection Monitor** view, on the **Basics** tab. You can change the region and choose Azure VMs from the newly selected region. 

       ![Screenshot of the Add Destinations pane, showing the Azure VMs tab](./media/connection-monitor-2-preview/add-azure-dests1.png)

       Then you can drill down from Subscription level to other levels in the hierarchy, like the Azure Agents level.

       ![Screenshot of the Add Destinations pane, showing the Subscription level](./media/connection-monitor-2-preview/add-azure-dests2.png)

    * To choose endpoints as destinations, select the **Endpoints** tab. The list of endpoints includes Office 365 test URLs and Dynamics 365 test URLs, grouped by name. In addition to these endpoints, you can choose an endpoint that was created in other test groups in the same connection monitor. To add a new endpoint, on the right, select **+ Endpoints**. Then provide an endpoint name and a URL, IP, or FQDN.

       ![Screenshot showing where to add endpoints as destinations in Connection Monitor](./media/connection-monitor-2-preview/add-endpoints.png)

    * To review the Azure and non-Azure agents that you chose, select the **Review** tab.
    * When you finish choosing destinations, select **Done**.

* **Test configurations** – You can associate test configurations in a test group. The Azure portal allows only one test configuration per test group, but you can use ARMClient to add more.

    * **Name** – Name the test configuration.
    * **Protocol** – Choose TCP, ICMP, or HTTP. To change HTTP to HTTPS, select **HTTP** as the protocol, and select **443** as the port.
        * **Create network test configuration** – This check box appears only if you select **HTTP** in the **Protocol** field. Select this box to create another test configuration that uses the same sources and destinations that you specified in steps 3 and 4 over TCP or ICMP protocol. The newly created test configuration is named `<the name of your test configuration>_networkTestConfig`.
        * **Disable traceroute** – This field applies to test groups whose protocol is TCP or ICMP. Select this box to stop sources from discovering topology and hop-by-hop round-trip time.
    * **Destination port** – You can customize this field with a destination port of your choice.
    * **Test Frequency** – Use this field to choose how frequently sources will ping destinations on the protocol and port that you specified. You can choose 30 seconds, 1 minute, 5 minutes, 15 minutes, or 30 minutes. Sources will test connectivity to destinations based on the value that you choose.  For example, if you select 30 seconds, sources will check connectivity to the destination at least once in a 30-second period.
    * **Success Threshold** – You can set thresholds on the following network parameters:
       * **Checks failed** – Set the percentage of checks that can fail when sources check connectivity to destinations by using the criteria that you specified. For TCP or ICMP protocol, the percentage of failed checks can be equated to the percentage of packet loss. For HTTP protocol, this field represents the number of HTTP requests that received no response.
       * **Round trip time** – Set the round-trip time in milliseconds for how long sources can take to connect to the destination over the test configuration.
    
       ![Screenshot showing where to set up a test configuration in Connection Monitor](./media/connection-monitor-2-preview/add-test-config.png)

All sources and destinations that you add to a test group by using the test configuration get broken down to individual tests. Here's an example of how sources and destinations are broken down:

* Test Group: TG1
* Sources: 3 (A, B, C)
* Destinations: 2 (D, E)
* Test Configuration: 2 (Config 1, Config 2)
* Tests Created: Total = 12

| Test number | Source | Destination | Test configuration |
| --- | --- | --- | --- |
| 1 | A | D | Config 1 |
| 2 | A | D | Config 2 |
| 3 | A | E | Config 1 |
| 4 | A | E | Config 2 |
| 5 | B | D | Config 1 |
| 6 | B | D | Config 2 |
| 7 | B | E | Config 1 |
| 8 | B | E | Config 2 |
| 9 | C | D | Config 1 |
| 10 | C | D | Config 2 |
| 11 | C | E | Config 1 |
| 12 | C | E | Config 2 |

### Observe scale limits

Connection monitors have the following scale limits:

* Maximum connection monitors per subscription per region: 100
* Maximum test groups per connection monitor: 20
* Maximum sources and destinations per connection monitor: 100
* Maximum test configurations per connection monitor: 
    * 20 via ARMClient
    * 2 via the Azure portal

## Step 4: Set up data analysis and alerts

After you create a connection monitor, sources check connectivity to destinations based on your test configuration.

### Checks in a test

Based on the protocol that you chose in the test configuration, Connection Monitor (Preview) runs a series of checks for the source destination pair according to the test frequency you chose.

If you use HTTP, the service calculates the number of HTTP responses that returned a response code. The result determines the percentage of failed checks. To calculate RTT, the service measures the time taken to receive the response from an HTTP call.

If you use TCP or ICMP, the service calculates the packet percentage to determine the percentage of failed checks. To calculate RTT, the service measures the time taken to receive the ACK for the packets that were sent. If you enabled traceroute data for your network tests, you can see hop-by-hop loss and latency for your on-premises network.

### States of a test

Based on the data that the checks return, each test can have the following states:

* **Pass** – Actual values for the percentage of failed checks and RTT are within the specified thresholds.
* **Fail** – Actual values for the percentage of failed checks or RTT exceeded the specified thresholds. If no threshold is specified, then a test reaches the Fail state when the percentage of failed checks is 100.
* **Warning** – No criteria was specified for the percentage of failed checks. In the absence of specified criteria, Connection Monitor (Preview) automatically assigns a threshold. When that threshold is exceeded, the test status changes to Warning.

### Data collection, analysis, and alerts

The data that Connection Monitor (Preview) collects is stored in the Log Analytics workspace. This is the workspace that you set up when you created the connection monitor. 

Monitoring data is also available in Azure Monitor Metrics. You can use Log Analytics to keep your monitoring data for as long as you want. Azure Monitor stores metrics for only 30 days by default. 

You can [set metric-based alerts on the data](https://azure.microsoft.com/blog/monitor-at-scale-in-azure-monitor-with-multi-resource-metric-alerts/).

#### Monitoring dashboards

On the monitoring dashboards, you see a list of the connection monitors that you can access for your subscriptions, regions, time stamps, sources, and destination types.

When you go to Connection Monitor (Preview) from Network Watcher, you can view data by:

* **Connection Monitor** – List of all connection monitors created for your subscriptions, regions, time stamps, sources, and destination types. This is the default view.
* **Test groups** – List of all test groups created for your subscriptions, regions, time stamps, sources, and destination types. These test groups aren't filtered by connection monitor.
* **Test** – List of all tests that run for your subscriptions, regions, time stamps, sources, and destination types. These tests aren't filtered by connection monitors or test groups.

In the following image, the three views are indicated by the [1] arrow in the following image.

On the dashboard, you can expand each connection monitor to see its test groups. Then you can expand each test group to see the tests that run in it. 

You can filter a list based on:

* **Top-level filters** – Choose subscriptions, regions, time stamp sources, and destination types. See the [2] box in the following image.
* **State-based filters** – Filter by the state of the connection monitor, test group, or test. See the [3] arrow in the following image.
* **Custom filters** – Choose **Select all** to do a generic search. To search by a specific entity, select from the drop-down list. See the [4] arrow in the following image.

![Screenshot showing how to filter views of connection monitors, test groups, and tests in Connection Monitor (Preview)](./media/connection-monitor-2-preview/cm-view.png)

For example, to look at all tests in Connection Monitor (Preview) where the source IP is 10.192.64.56:
1. Change the view to **Test**.
1. In the search field, type *10.192.64.56*
1. In the drop-down list, select **Sources**.

To show only failed tests in Connection Monitor (Preview) where the source IP is 10.192.64.56:
1. Change the view to **Test**.
1. For the state-based filter, select **Fail**.
1. In the search field, type *10.192.64.56*
1. In the drop-down list, select **Sources**.

To show only failed tests in Connection Monitor (Preview) where the destination is Outlook.Office365.com:
1. Change view to **Test**.
1. For the state-based filter, select **Fail**.
1. In the search field, enter *outlook.office365.com*
1. In the drop-down list, select **Destinations**.

   ![Screenshot showing a view that's filtered to show only failed tests for the Outlook.Office365.com destination](./media/connection-monitor-2-preview/tests-view.png)

To view the trends in RTT and the percentage of failed checks for a connection monitor:
1. Select the connection monitor that you want to investigate. By default, the monitoring data is organized by test group.

   ![Screenshot showing metrics for a connection monitor, displayed by test group](./media/connection-monitor-2-preview/cm-drill-landing.png)

1. Choose the test group that you want to investigate.

   ![Screenshot showing where to select a test group](./media/connection-monitor-2-preview/cm-drill-select-tg.png)

    You see your test group's top five failed tests, based on the RTT or percentage of failed checks. For each test, you see the RTT and trend lines for the percentage of failed checks.
1. Select a test from the list, or choose another test to investigate. For your time interval and the percentage of failed checks, you see threshold and actual values. For RTT, you see the values for threshold, average, minimum, and maximum.

   ![Screenshot showing a test's results for RTT and percentage of failed checks](./media/connection-monitor-2-preview/cm-drill-charts.png)

1. Change the time interval to view more data.
1. Change the view to see sources, destinations, or test configurations. 
1. Choose a source based on failed tests, and investigate the top five failed tests. For example, choose **View by** > **Sources** and **View by** > **Destinations** to investigate the relevant tests in the connection monitor.

   ![RTT2](./media/connection-monitor-2-preview/cm-drill-select-source.png)

To view the trends in RTT and the percentage of failed checks for a test group:

1. Select the Test Group you want to investigate in detail
1. By default, you'll view monitoring data by "Source + Destination + Test Configuration (Test) "

   ![RTT3](./media/connection-monitor-2-preview/tg-drill.png)

1. Choose the Test you want to investigate in detail
1. For the time interval selected, for the percentage of failed checks, you'll see threshold and actual values. For RTT msec, you'll see threshold, avg, min, and max values. You'll also see fired alerts specific to the test you selected.
1. Change the time interval to view more data
1. You can change the view in Step b and choose to view by sources, destinations, or test configurations. Then choose an entity to investigate the top 5 failed tests.  For example: Choose View by: Sources and Destinations to investigate all the tests that run between that combination in the selected Connection Monitor.

To view the trends in RTT and the percentage of failed checks for a test:
1. Select the Source + Destination + Test Configuration you want to investigate in detail
1. For the time interval selected, for checks failed %, you'll see threshold and actual values. For RTT msec, you'll see threshold, avg, min, and max values. You'll also see fired alerts specific to the test you selected.

   ![Test1](./media/connection-monitor-2-preview/test-drill.png)

1. You can also select **Topology** to see the network topology at any point in time.

   ![Test2](./media/connection-monitor-2-preview/test-topo.png)

1. You can select any hop of link for Azure network to see the issues identified by Connection Monitor. This capability isn't available for on-premises networks at the moment.

   ![Test3](./media/connection-monitor-2-preview/test-topo-hop.png)

#### Log queries in Azure Monitor Log Analytics

Use Log Analytics to create custom views of your monitoring data. All data displayed in the UI is populated from Log Analytics. You can perform interactive analysis of data in the repository and correlate data from different sources like agent health and other Log Analytics based applications. You can also export the data to Excel, Power BI, or a shareable link.

#### Metrics in Azure Monitor

For Connection Monitor that were created before the Connection Monitor (Preview) experience, all 4 metrics would be available. For Connection Monitors created through Connection Monitor (Preview) experience, data will be available only for the Metrics tagged with "(Preview)".

Resource Type - Microsoft.Network/networkWatchers/connectionMonitors

| Metric | Metric Display Name | Unit | Aggregation Type | Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| ProbesFailedPercent | % Probes Failed | Percent | Average | % of connectivity monitoring probes failed | No Dimensions |
| AverageRoundtripMs | Avg. Round-trip Time (ms) | MilliSeconds | Average | Average network round-trip time (ms) for connectivity monitoring probes sent between source and destination |             No Dimensions |
| ChecksFailedPercent (Preview) | % Checks Failed (Preview) | Percent | Average | % of checks failed for a test | * ConnectionMonitorResourceId <br> * SourceAddress <br> *  SourceName <br> * SourceResourceId <br> *  SourceType <br> * Protocol <br> * DestinationAddress <br> * DestinationName <br> * DestinationResourceId <br> * DestinationType <br> * DestinationPort <br> *  TestGroupName <br> *  TestConfigurationName <br> * Region |
| RoundTripTimeMs (Preview) | Round-trip Time (ms) (Preview) | Milliseconds | Average | Round-trip time (ms) for checks sent between source and destination. This value is not averaged | * ConnectionMonitorResourceId <br> * SourceAddress <br> *  SourceName <br> * SourceResourceId <br> *  SourceType <br> * Protocol <br> * DestinationAddress <br> * DestinationName <br> * DestinationResourceId <br> * DestinationType <br> * DestinationPort <br> *  TestGroupName <br> *  TestConfigurationName <br> * Region |

 ![Monitor Metrics](./media/connection-monitor-2-preview/monitor-metrics.png)

#### Metric alerts in Azure Monitor

To create an alert:

1. Choose your Connection Monitor resource created using Connection Monitor (Preview)
2. Ensure that **Metric** shows up as signal type for the resource selected in the previous step
3. In Add Condition, choose Signal Name as ChecksFailedPercent(Preview) or RoundTripTimeMs(Preview) and Signal Type as Metrics. Eg: Choose ChecksFailedPercent(Preview)
4. All the dimensions applicable as per metrics will be listed.  Choose the dimension name and dimension value. Eg: Choose Source Address and provide IP address of any source involved in Connection Monitor resource chosen in Step 1
5. In Alert Logic, choose:
   1. Condition Type – Static
   2. Condition and Threshold
   3. Aggregation Granularity and Frequency of Evaluation – Connection Monitor (Preview) updates data every 1 minute.
6.  In actions, choose your action group
7. Provide alert details
8. Create alert rule

   ![Alerts](./media/connection-monitor-2-preview/mdm-alerts.jpg)

## Step 5: Diagnose issues in your network

Connection Monitor will help you diagnose issues corresponding to the Connection Monitor resource and in your network. Issues in your hybrid network will be detected by the Log Analytics agents  you installed in Step 1 and issues in Azure will be detected by the Network Watcher Extension.  Issues in hybrid network will be visible in the Diagnostics page and issues in Azure Network will be visible in the network topology.

For networks with on-premises VMs as sources, we detect:

* Request timed out
* Endpoint not resolved by DNS – temporary or persistent. URL invalid.
* No hosts found.
* Source unable to connect to destination. Target not reachable through ICMP.
* Certificate-related issue - Client certificate required to authenticate agent, Certificate Relocation List not accessible, host name of the endpoint doesn't match the certificate's subject or subject alternate name, root certificate missing in source's Local Computer Trusted Certification Authorities store, SSL certificate expired/invalid/revoked, incompatible

For networks with Azure VMs are sources, we detect:

* Agent Issues – Agent stopped, Failed DNS resolution, No application/listener listening on destination port, Socket could not be opened
* VM state issues – starting, stopping, stopped, deallocating, deallocated, rebooting, not allocated
* Missing ARP table entry
* Traffic blocked because of local firewall issues, NSG rules
* VNET Gateway – Missing routes, Tunnel between two gateways is disconnected or missing or second gateway not found by tunnel, No peering info found
* Missing route in MS Edge.
* Traffic stopped because of system routes or UDR
* BGP not enabled on gateway connection
* DIP Probe down at the Load Balancer
