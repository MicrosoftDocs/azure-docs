---
title: Connection Monitor (Preview) | Microsoft Docs
description: Learn how to use Connection Monitor (Preview) to monitor network communication in a distributed environment
services: network-watcher
documentationcenter: na
author: vinynigam
manager: agummadi
editor: ''
tags: azure-resource-manager
Customer intent: I need to monitor communication between a VM and another VM. If the communication fails, I need to know why, so that I can resolve the problem. 

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/27/2020
ms.author: vinigam
ms.custom: mvc
---
# Unified connectivity monitoring with Connection Monitor (Preview)

Connection Monitor (Preview) provides unified end-to-end connection monitoring capabilities in Azure Network Watcher for hybrid and Azure cloud deployments. Azure Network Watcher provides tools to monitor, diagnose, and view connectivity-related metrics for your Azure deployments.

Key Use Cases:

- You have a front-end web server VM that communicates with a database server VM in a multi-tier application. You want to check network connectivity between the two VMs.
- You want VMs in East US region to ping VMs in Central US region and compare cross region network latencies
- You have multiple on-premise office sites in cities like Seattle. connecting to Office 365 URLs. You want to compare the latencies experienced by users using Office 365 URLs from  Seattle and Ashburn.
- You have a hybrid application set up that needs connectivity to an Azure Storage Endpoint. You want to compare latencies between an on-premise site and the Azure application both connecting to the same Azure Storage Endpoint.
- You want to check connectivity from Azure VMs hosting your cloud application to your on-premise setups.

In this preview phase, the solution brings together the best of two key capabilities - Network Watcher's [Connection Monitor](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview#monitor-communication-between-a-virtual-machine-and-an-endpoint) and Network Performance Monitor(NPM)'s [Service Connectivity Monitor](https://docs.microsoft.com/azure/azure-monitor/insights/network-performance-monitor-service-connectivity).

Highlights:

* Unified, intuitive experience for Azure and hybrid monitoring needs
* Cross region, cross workspace connectivity monitoring
* Higher probing frequencies and better visibility into network performance
* Faster alerting for your hybrid deployments
* Support for HTTP, TCP, and ICMP based connectivity checks
* Metrics and Log Analytics support for both Azure and non-Azure test setups

![Connection Monitor](./media/connection-monitor-2-preview/hero-graphic.png)

Follow the steps mentioned below to start monitoring using Connection Monitor (Preview)

## Step 1: Install monitoring agents

Connection Monitor relies on lightweight executables to run connectivity checks.  We support connectivity checks from both Azure and on-premises environments. The specific executable to be used depends on whether your VM is hosted on Azure or on-premises.

### Agents for Azure virtual machines

For Connection Monitor to recognize your Azure VMs as source for monitoring, you need to install the Network Watcher Agent virtual machine extension (also known as Network Watcher extension) on them. The Network Watcher Agent extension is a requirement for triggering end to end monitoring and other advanced functionality on Azure virtual machines. You can [create a VM and install the Network Watcher extension](https://docs.microsoft.com/azure/network-watcher/connection-monitor#create-the-first-vm)[on it](https://docs.microsoft.com/azure/network-watcher/connection-monitor#create-the-first-vm).  You can also install, configure, and troubleshoot Network Watcher extension for [Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/network-watcher-linux) and [Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/network-watcher-windows) separately.

If NSG or firewall rules are blocking communication between source and destination, Connection Monitor will detect the issue and show it as a diagnostic message in the topology. To enable connection monitoring, ensure that NSG and firewall rules allow packets over TCP or ICMP between source and destination.

### Agents for on-premise machines

For Connection Monitor to recognize your on-premise machines as sources for monitoring, you would need to install the Log Analytics agent on the machines and enable Network Performance Monitoring solution. These agents are linked to Log Analytics workspaces and need workspace ID and primary key set up before they can start monitoring.

To install Log Analytics agent for Windows machines, follow the instructions mentioned in [this link](https://docs.microsoft.com/azure/virtual-machines/extensions/oms-windows)

Ensure that the destination is reachable if there are firewalls or virtual network appliances (NVA) in the path.

## Step 2: Enable Network Watcher on your subscription

All subscriptions with a VNET are enabled with Network Watcher. When you create a virtual network in your subscription, Network Watcher will be enabled automatically in that Virtual Network's region and subscription. There's no impact to your resources or associated charge for automatically enabling Network Watcher. Ensure that Network Watcher isn't explicitly disabled on your subscription. For more information, see [Enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create).

## Step 3: Create Connection Monitor 

_Connection Monitor_ monitors communication at regular intervals and informs you of reachability, latency, and network topology changes between source agents and destination endpoints. Sources may be Azure VMs or on-premise machines that have a monitoring agent installed. Destination Endpoints can be Office 365 URLs, Dynamics 365 URLs, Custom URLs, Azure VM resource IDs, IPv4, IPv6, FQDN, or any domain name.

### Accessing Connection Monitor (Preview)

1. From the Azure portal home page, visit Network Watcher
2. Click "Connection Monitor (Preview)" tab in the Monitoring section in Network Watcher's left pane.
3. You can see all Connection Monitors that are created using Connection Monitor (Preview) experience. All Connection Monitors created using the classic experience of Connection Monitor tab will be visible in Connection Monitor tab.

    ![Create a Connection Monitor](./media/connection-monitor-2-preview/cm-resource-view.png)


### Creating a Connection Monitor

Connection Monitors created using Connection Monitor (Preview) provide the ability to add both on-premises and Azure VMs as sources and monitor connectivity to endpoints, which can span Azure or any other URL/IP.

Following are the entities in a Connection Monitor:

* Connection Monitor Resource – Region specific Azure resource. All the entities mentioned below are properties of a Connection Monitor resource.
* Endpoints – All sources and destinations that participate in connectivity checks are called as endpoints. Examples of endpoint – Azure VMs, On-Premise agents, URLs, IPs
* Test Configuration – Each test configuration is protocol specific. Based on the protocol chosen, you can define port, thresholds, test frequency, and other parameters
* Test Group – Each test group contains source endpoints, destination endpoints, and test configurations. Each Connection Monitor can contain more than one test groups
* Test – Combination of a source endpoint, destination endpoint, and test configuration make one test. Test is lowest level at which monitoring data (checks failed % and RTT) is available

 ![Create a Connection Monitor](./media/connection-monitor-2-preview/cm-tg-2.png)

#### From portal

To create a Connection Monitor, follow the below mentioned steps:

1. In Connection Monitor (Preview) dashboard, click "Create" from top-left corner.
2. In the Basic tab, enter information for your connection monitor
   1. Connection Monitor Name – Name of your Connection Monitor. Standard naming rules for Azure resources apply here.
   2. Subscription – Choose a subscription for your Connection Monitor.
   3. Region – Choose a region for your Connection Monitor resource. You can only select the source VMs that are created in this region.
   4. Workspace Configuration - You can use either the default workspace created by Connection Monitor to store your monitoring data by clicking the default checkbox. To choose a custom workspace, uncheck this box. Choose the subscription and region to select the workspace, which will hold your monitoring data.
   5. Click "Next: Test Groups" to add test groups

      ![Create a Connection Monitor](./media/connection-monitor-2-preview/create-cm-basics.png)

3. In the test groups tab, click "+ Test Group" to add a Test Group. Use _Creating Test Groups in Connection Monitor_ to add test groups. Click "Review + create" to review your Connection Monitor.

   ![Create a Connection Monitor](./media/connection-monitor-2-preview/create-tg.png)

4. In the "Review + create" tab, review basic information and test groups before you create the Connection Monitor. To edit Connection Monitor from the "Review + create" view:
   1. To edit the basic details, use the pencil icon as specified by box 1 in the image 2
   2. To edit the individual test groups, click the test group that you want to edit to open the test group in edit mode.
   3. Current Cost/month indicated the cost during preview. There's currently no charge to using Connection Monitor,so this column will show zero. Actual cost/month indicated the price that will be charged after General Availability. Do note, log analytics ingestion charges will apply even during the preview.

5. In the "Review + create" tab, click the "create" button to create the Connection Monitor.

   ![Create a Connection Monitor](./media/connection-monitor-2-preview/review-create-cm.png)

6.  Connection Monitor (Preview) will create the Connection Monitor resource in the background.

#### From Armclient

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

address: '\&lt;FQDN of your on-premise agent'

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

Deployment command:
```
armclient PUT $ARM/$SUB/$NW/connectionMonitors/$connectionMonitorName/?api-version=2019-07-01 $body -verbose
```

### Creating test groups in Connection Monitor

Each test group in Connection Monitor includes sources and destination that get tested on network parameters of Checks Failed and RTT over test configurations.

#### From portal

To create a Test Group in a Connection Monitor, you specify the value for the below mentioned fields:

1. Disable Test Group – Checking this field will disable monitoring for all sources and destinations specified in the test group. You'll see this option unchecked by default.
2. Name – Name of your test group
3. Sources – You can specify both Azure VMs and On-Premise machines as sources if agents are installed in them. Refer to Step 1 to install agent specific to your source.
   1. Click on "Azure Agents" tab to select Azure agents. You'll only see those VMs listed which are bound to the region you specified at the time of creating the Connection Monitor. VMs are by default grouped into the subscription they belong to and the groups are collapsed. You can drill down from Subscriptions level to other levels in the hierarchy:

      ```Subscription -\&gt; resource groups -\&gt; VNETs -\&gt; Subnets -\&gt; VMs with agents Y```

      You can also change the value of "Group by" field to start the tree from any other level. For example:  Group by – VNET will show the VMs with agents in the hierarchy VNETs -\&gt; Subnets -\&gt; VMs with agents.

      ![Add Sources](./media/connection-monitor-2-preview/add-azure-sources.png)

   2. Click on "Non – Azure Agents" tab to select on-premise agents. By default, you'll see agents grouped into workspaces in a region.Only those workspaces that have Network Performance Monitor solution configured will be listed. Add the Network Performance Monitor solution to your workspace from the [Azure marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.NetworkMonitoringOMS?tab=Overview). You also can use the process described in [Add Azure Monitor solutions from the Solutions Gallery](https://docs.microsoft.com/azure/azure-monitor/insights/solutions) .By default, you'll see the region selected in the Basic Info tab in the Create Connection Monitor view. You can change the region and choose agents from workspaces from the newly selected region. You can also change the value of "Group by" field to group on subnets.

      ![Non-Azure Sources](./media/connection-monitor-2-preview/add-non-azure-sources.png)


   3. Click "Review "to review the Azure and Non-Azure agents selected.

      ![Review Sources](./media/connection-monitor-2-preview/review-sources.png)

   4. Click "Done" once you're done selecting the sources.

4. Destinations – You can monitor connectivity to Azure VMs or any endpoint (Public IP, URL, FQDN) by specifying them as destinations. In a single test group, you can add Azure VMs, O365 URLs, D365 URLs, or custom endpoints.

   1. Click on "Azure VMs" tab to select Azure VMs as destinations. By default, you'll see Azure VMs grouped into subscription hierarchy in the same region that was selected in the Basic Info tab in the Create Connection Monitor view. You can change the region and choose Azure VMs from the newly selected region. You can drill down from Subscriptions level to other levels in the hierarchy, like Azure Agents.

      ![Add Destinations](./media/connection-monitor-2-preview/add-azure-dests1.png)<br>

      ![Add Destinations 2](./media/connection-monitor-2-preview/add-azure-dests2.png)

   2. Click on "Endpoints" tab to select Endpoints as destinations. Endpoint list will be populated with O365 and D365 test URLs, grouped by name.  You can also choose an endpoint created in other test groups in the same Connection Monitor. To add a new endpoint, click "+ Endpoint" from top-right corner of the screen and provide endpoint URL/IP/FQDN and name

      ![Add Endpoints](./media/connection-monitor-2-preview/add-endpoints.png)

   3. Click "Review" to review the Azure and Non-Azure agents selected.
   4. Click "Done" once you're done selecting the sources.

5. Test Configuration – You can associate any number of test configurations in a given test group. Portal restricts it to one test configuration per test group, but use Armclient to add more.
   1. Name – Name for the test configuration
   2. Protocol – You can choose between TCP, ICMP, or HTTP. To change HTTP to HTTPS, select HTTP as protocol and 443 as port
   3. Create Network Test Configuration– You'll see this checkbox only if you select HTTP in the Protocol field. Enable this field to create another test configuration using the same sources and destinations specified in step 3 and 4 over TCP/ICMP protocol. The newly created test configuration is named "\&lt;name specified in 5.a\&gt;\_networkTestConfig"
   4. Disable Traceroute – This field will be applicable for test groups with TCP or ICMP as protocol.  Check this field to stop sources from discovering topology and hop-by-hop round-trip time.
   5. Destination Port –You can customize this field to put in a destination port of your choice.
   6. Test Frequency – This field decides how frequently sources will ping destinations on the protocol and port specified above. You can choose between 30 seconds, 1 minute, 5 minutes, 15 minutes, and 30 minutes. Sources will test connectivity to destinations based on the value you choose.  For example, if you select 30 seconds, sources will check connectivity to destination at least once in 30 seconds-period.
   7. Health Thresholds – You can set thresholds on the network parameters mentioned below
      1. Checks Failed in % - Percentage of checks failed when sources check connectivity to destination over the criteria specified above. For TCP/ICMP protocol, checks failed in % can be equated to packet loss %. For HTTP protocol, this field represents the number of http requests that didn't get a response.
      2. RTT in milliseconds – Round-trip time in milliseconds when sources connect to destination over the test configuration specified above.

      ![Add TG](./media/connection-monitor-2-preview/add-test-config.png)

All sources and destinations added to a test group with the test configuration specified get broken down to individual tests. For example:

* Test Group: TG1
* Sources: 3 (A, B, C)
* Destinations: 2 (D, E)
* Test Configuration: 2 (Config 1, Config 2)
* Tests Created: Total = 12

| **Test Number** | **Source** | **Destination** | **Test Config Name** |
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

### Scale limits

* Max # of Connection Monitors per subscription per region– 100
* Max # of test groups per Connection Monitor - 20
* Max # sources + destinations per Connection Monitor – 100
* Max # of test configurations per Connection Monitor – 20 via Armclient. 2 via Portal.

## Step 4:  Data analysis and alerts

Once a Connection Monitor is created, sources check connectivity to destinations based on the test configuration specified.

### Checks in a test

Based on the protocol selected by a user in the test configuration, Connection Monitor (Preview) runs a series of checks for the source destination pair over the chosen test frequency.

If HTTP is selected, the service calculates the number of HTTP responses that returned a response code to determine the checks failed %.  To calculate RTT we measure the time taken to receive the response of an HTTP call.

If TCP or ICMP is selected, the service calculates packet % to determine checks failed %. To calculate RTT we measure the time taken to receive the ACK for packets sent. If you have enabled traceroute data for your network tests, you can see hop-by-hop loss and latency for your on-premise network.

### States of a test

Based on the data returned by checks in a test, each test can then have the following states:

* Pass = When actual values for Checks Failed % and RTT are within specified thresholds
* Fail = When actual values for Checks Failed % or RTT cross specified thresholds. If no threshold is specified, then a test is marked fail when checks failed % = 100%
* Warning – When criteria for checks failed % isn't specified. In such a case, Connection Monitor (Preview) uses an auto set criterion as threshold and when that threshold is breached status of the test is set to "Warning"

### Data collection, analysis and alerts

All the data collected by Connection Monitor (Preview) is stored in the Log Analytics workspace configured at the time of Connection Monitor creation. Monitoring data is also available in Azure Monitor Metrics. You can use Log Analytics to keep your monitoring data for as long as you like but Azure Monitor stores metrics by default for 30 days**.** You can then [set metric based alerts on the data](https://azure.microsoft.com/blog/monitor-at-scale-in-azure-monitor-with-multi-resource-metric-alerts/).

#### Monitoring dashboards in Connection Monitor solution

You'll see a list of your Connection Monitor that you have access to for a given selection of subscriptions, regions, timestamp, source, and destination types.

When you navigate to Connection Monitor (Preview) from Network Watcher service, you can choose to **View By**:

* Connection Monitor (default) – List of all Connection Monitors created for chosen subscriptions, regions, timestamp, source, and destination types
* Test Groups – List of all Test Groups created for chosen subscriptions, regions, timestamp, source, and destination types. These test groups aren't filtered on Connection Monitor
* Tests – List of all Tests running for chosen subscriptions, regions, timestamp, source and destination types. These tests aren't filtered on Connection Monitor or Test Groups.

You can expand each Connection Monitor into the Test Groups and each Test Group into the various individual tests that are running in it in the dashboard. Marked as [1] in the image below.

You can filter this list based on:

* Top-Level filters - Subscriptions, regions, timestamp source, and destination types. Marked as [2] in the image below.
* State-Based Filters - Second Level Filter on state of Connection Monitor/ Test Group/ Test. Marked as [3] in the image below.
* Search Field –Choose "All" to do a generic search. To search on any specific entity, use the dropdown to narrow down search results. Marked as [4] in the image below.

![Filter Tests](./media/connection-monitor-2-preview/cm-view.png)

For example:

1. To look at all tests across all Connection Monitor (Preview) where source IP = 10.192.64.56:
   1. Change view by to "Tests"
   2. Search Filed = 10.192.64.56
   3. Use dropdown next to value to select "Sources"
2. To filter out only failed tests across all Connection Monitor (Preview) where source IP = 10.192.64.56
   1. Change view by to "Tests"
   2. Select "Fail" from State-Based Filters.
   3. Search Field = 10.192.64.56
   4. Use dropdown next to value to select "Sources"
3. To filter out only failed tests across all Connection Monitor (Preview) where destination is outlook.office365.com
   1. Change view by to "Tests"
   2. Select "Fail" from State-Based Filters.
   3. Search Field = outlook.office365.com
   4. Use dropdown next to value to select "Destinations"

   ![Failed Tests](./media/connection-monitor-2-preview/tests-view.png)

To view the trends of checks failed % and RTT for:

1. Connection Monitor
   1. Click the Connection Monitor you want to investigate in detail
   2. By default, you'll view monitoring data by "Test Groups"

      ![View Metrics by](./media/connection-monitor-2-preview/cm-drill-landing.png)

   3. Choose the Test Group you want to investigate in detail

      ![Metrics by TG](./media/connection-monitor-2-preview/cm-drill-select-tg.png)

   4. You'll see top 5 failed tests on checks failed % or RTT msecs for the test group you chose in the previous step. For each test, you'll see trendlines for checks failed %, and RTT msec
   5. Select a test from the list above, or choose another test to investigate in detail.
   6. For the time interval selected, for checks failed %, you'll see threshold and actual values. For RTT msec, you'll see threshold, avg, min, and max values.

      ![RTT](./media/connection-monitor-2-preview/cm-drill-charts.png)

  7. Change the time interval to view more data
  8. You can change the view in Step b and choose to view by sources, destinations, or test configurations. Then choose a source based on failed tests and investigate the top 5 failed tests.  For example: Choose View by: Sources and Destinations to investigate all the tests that run between that combination in the selected Connection Monitor.

      ![RTT2](./media/connection-monitor-2-preview/cm-drill-select-source.png)

2. Test Group
   1. Click the Test Group you want to investigate in detail
   2. By default, you'll view monitoring data by "Source + Destination + Test Configuration (Test) "

      ![RTT3](./media/connection-monitor-2-preview/tg-drill.png)

   3. Choose the Test you want to investigate in detail
   4. For the time interval selected, for checks failed %, you'll see threshold and actual values. For RTT msec, you'll see threshold, avg, min, and max values. You'll also see fired alerts specific to the test you selected.
   5. Change the time interval to view more data
   6. You can change the view in Step b and choose to view by sources, destinations, or test configurations. Then choose an entity to investigate the top 5 failed tests.  For example: Choose View by: Sources and Destinations to investigate all the tests that run between that combination in the selected Connection Monitor.

3. Test
   1. Click the Source + Destination + Test Configuration you want to investigate in detail
   2. For the time interval selected, for checks failed %, you'll see threshold and actual values. For RTT msec, you'll see threshold, avg, min, and max values. You'll also see fired alerts specific to the test you selected.

      ![Test1](./media/connection-monitor-2-preview/test-drill.png)

   3. You can also click on "Topology" to see the network topology at any point in time.

      ![Test2](./media/connection-monitor-2-preview/test-topo.png)

   4. You can click on any hop of link for Azure network to see the issues identified by Connection Monitor. This capability isn't available for on-premise networks at the moment.

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
2. Ensure that "Metric" shows up as signal type for the resource selected in the previous step
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

For networks with on-premise VMs as sources, we detect:

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
