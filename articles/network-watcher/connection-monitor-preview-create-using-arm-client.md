---
title: Create Connection Monitor Preview - ARMClient
titleSuffix: Azure Network Watcher
description: Learn how to create Connection Monitor (Preview) using the ARMClient.
services: network-watcher
documentationcenter: na
author: vinigam
ms.service: network-watcher
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 07/30/2020
ms.author: vinigam
#Customer intent: I need to create a connection montior preview to monitor communication between one VM and another.
---
# Create a Connection Monitor (Preview) using the ARMClient

Learn how to create Connection Monitor (Preview) to monitor communication between your resources using the ARMClient. It supports hybrid and Azure cloud deployments.

## Before you begin 

In connection monitors that you create in Connection Monitor (Preview), you can add both on-premises machines and Azure VMs as sources. These connection monitors can also monitor connectivity to endpoints. The endpoints can be on Azure or any other URL or IP.

Connection Monitor (Preview) includes the following entities:

* **Connection monitor resource** – A region-specific Azure resource. All of the following entities are properties of a connection monitor resource.
* **Endpoint** – A source or destination that participates in connectivity checks. Examples of endpoints include Azure VMs, on-premises agents, URLs, and IPs.
* **Test configuration** – A protocol-specific configuration for a test. Based on the protocol you chose, you can define the port, thresholds, test frequency, and other parameters.
* **Test group** – The group that contains source endpoints, destination endpoints, and test configurations. A connection monitor can contain more than one test group.
* **Test** – The combination of a source endpoint, destination endpoint, and test configuration. A test is the most granular level at which monitoring data is available. The monitoring data includes the percentage of checks that failed and the round-trip time (RTT).

	![Diagram showing a connection monitor, defining the relationship between test groups and tests](./media/connection-monitor-2-preview/cm-tg-2.png)

## Steps to create with sample ARM Template

Use the following code to create a connection monitor by using ARMClient.

```armclient
$connectionMonitorName = "sampleConnectionMonitor"

$ARM = "https://management.azure.com"

$SUB = "subscriptions/<subscription id 1>;"

$NW = "resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher\_<region>"

$body =

"{

location: '<region>',

properties: {

endpoints: [{

name: 'workspace',

resourceId: '/subscriptions/<subscription id>/resourcegroups/<resource group>/providers/Microsoft.OperationalInsights/workspaces/sampleWorkspace',

filter: {

 items: [{

type: 'AgentAddress',

address: '<FQDN of your on-premises agent>'

}]

}

          },

 {

name: 'vm1',

resourceId: '/subscriptions/<subscription id>/resourceGroups/<resource group>/providers/Microsoft.Compute/virtualMachines/<vm-name>'

},

 {

name: 'vm2',

resourceId: '/subscriptions/<subscription id>/resourceGroups/<resource group>/providers/Microsoft.Compute/virtualMachines/<vm-name>'

   },

{

name: 'azure portal'

address: '<URL>'

   },

 {

    name: 'ip',

     address: '<IP>'

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

   // Choose your protocol
   
    testConfigurations: ['http', 'https', 'tcpDisabled', 'icmpDisabled'],

    sources: ['vm1'],

    destinations: ['vm2'],

    disable: true

   }

  ],

  testConfigurations: [{

    name: 'http',

    testFrequencySec: <frequency>,

    protocol: 'HTTP',

    successThreshold: {

     checksFailedPercent: <threshold for checks failed %>,

     roundTripTimeMs: <threshold for RTT>

    }

   }, {

    name: 'https',

    testFrequencySec: <frequency>,

    protocol: 'HTTP',

    httpConfiguration: {

     preferHTTPS: true

    },

    successThreshold: {

     checksFailedPercent: <choose your checks failed threshold>,

     roundTripTimeMs: <choose your RTT threshold>

    }

   }, {

    name: 'tcpEnabled',

    testFrequencySec: <frequency>,

    protocol: 'TCP',

    tcpConfiguration: {

     port: 80

    },

    successThreshold: {

     checksFailedPercent: <choose your checks failed threshold>,

     roundTripTimeMs: <choose your RTT threshold>

    }

   }, {

    name: 'icmpEnabled',

    testFrequencySec: <frequency>,

    protocol: 'ICMP',

    successThreshold: {

     checksFailedPercent: <choose your checks failed threshold>,

     roundTripTimeMs: <choose your RTT threshold>

    }

   }, {

    name: 'icmpDisabled',

    testFrequencySec: <frequency>,

    protocol: 'ICMP',

    icmpConfiguration: {

     disableTraceRoute: true

    },

    successThreshold: {

     checksFailedPercent: <choose your checks failed threshold>,

     roundTripTimeMs: <choose your RTT threshold>

    }

   }, {

    name: 'tcpDisabled',

    testFrequencySec: <frequency>,

    protocol: 'TCP',

    tcpConfiguration: {

     port: 80,

     disableTraceRoute: true

    },

    successThreshold: {

     checksFailedPercent: <choose your checks failed threshold>,

     roundTripTimeMs: <choose your RTT threshold>

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

## Description of Properties

* connectionMonitorName - Name of the Connection monitor resource

* SUB - Subscription ID of the subscription where you want to create connection monitor

* NW  - Network Watcher resource ID in which CM will be created 

* location - Region in which connection monitor will be created

* Endpoints
	* name – Unique name for each endpoint
	* resourceId – For Azure endpoints, resource ID refers to the Azure Resource Manager(ARM) resource ID for virtual machines.For non-Azure endpoints, resource ID refers to the ARM resource ID for the Log Analytics workspace linked to non-Azure agents.
	* address – Applicable only when either resource ID is not specified or if resource ID is Log Analytics workspace. If used with Log Analytics resource ID, this refers to the FQDN of the agent that can be used for monitoring. If used without resource ID, this can be the URL or IP of any public endpoint.
	* filter – For non-Azure endpoints, use filter to select agents from Log Analytics workspace that will be used for monitoring in Connection monitor resource. If filters are not set, all agents belonging to the Log Analytics workspace can be used for monitoring
		* type – Set type as “Agent Address”
		* address – Set address as the FQDN of your on-premises agent

* Test Groups
	* name - Name your test group.
	* testConfigurations - Test Configurations based on which source endpoints connect to destination endpoints
	* sources - Choose from endpoints created above. Azure based source endpoints need to have Azure Network Watcher extension installed and nonAzure based source endpoints need to haveAzure Log Analytics agent installed. To install an agent for your source, see [Install monitoring agents](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview#install-monitoring-agents).
	* destinations -  Choose from endpoints created above. You can monitor connectivity to Azure VMs or any endpoint (a public IP, URL, or FQDN) by specifying them as destinations. In a single test group, you can add Azure VMs, Office 365 URLs, Dynamics 365 URLs, and custom endpoints.
	* disable - Use this field to disable monitoring for all sources and destinations that the test group specifies.

* Test Configurations
	* name - Name of the test configuration.
	* testFrequencySec - Specify how frequently sources will ping destinations on the protocol and port that you specified. You can choose 30 seconds, 1 minute, 5 minutes, 15 minutes, or 30 minutes. Sources will test connectivity to destinations based on the value that you choose. For example, if you select 30 seconds, sources will check connectivity to the destination at least once in a 30-second period.
	* protocol - You can choose TCP, ICMP, HTTP or HTTPS. Depending on the protocol, you can do some protocol specific configs
		* preferHTTPS - Specify whether to use HTTPS over HTTP
		* port - Specify the destination port of your choice.
		* disableTraceRoute - This applies to test groups whose protocol is TCP or ICMP. It stop sources from discovering topology and hop-by-hop RTT.
	* successThreshold - You can set thresholds on the following network parameters:
		* checksFailedPercent - Set the percentage of checks that can fail when sources check connectivity to destinations by using the criteria that you specified. For TCP or ICMP protocol, the percentage of failed checks can be equated to the percentage of packet loss. For HTTP protocol, this field represents the percentage of HTTP requests that received no response.
		* roundTripTimeMs - Set the RTT in milliseconds for how long sources can take to connect to the destination over the test configuration.

## Scale limits

Connection monitors have the following scale limits:

* Maximum connection monitors per subscription per region: 100
* Maximum test groups per connection monitor: 20
* Maximum sources and destinations per connection monitor: 100
* Maximum test configurations per connection monitor: 20 via ARMClient

## Next steps

* Learn [how to analyze monitoring data and set alerts](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview#analyze-monitoring-data-and-set-alerts)
* Learn [how to diagnose issues in your network](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview#diagnose-issues-in-your-network)
