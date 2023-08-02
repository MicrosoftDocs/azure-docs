---
title: "Cisco Meraki connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Meraki to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Meraki connector for Microsoft Sentinel

The [Cisco Meraki](https://meraki.cisco.com/) connector allows you to easily connect your Cisco Meraki (MX/MR/MS) logs with Microsoft Sentinel. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | meraki_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Total Events by Log Type**
   ```kusto
CiscoMeraki 
 
   | summarize count() by LogType
   ```

**Top 10 Blocked Connections**
   ```kusto
CiscoMeraki 
 
   | where LogType == "security_event" 
 
   | where Action == "block" 
 
   | summarize count() by SrcIpAddr, DstIpAddr, Action, Disposition 
 
   | top 10 by count_
   ```



## Prerequisites

To integrate with Cisco Meraki make sure you have: 

- **Cisco Meraki**: must be configured to export logs via Syslog


## Vendor installation instructions


**NOTE:** This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias CiscoMeraki and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/CiscoMeraki/Parsers/CiscoMeraki.txt). The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Follow the configuration steps below to get Cisco Meraki device logs into Microsoft Sentinel. Refer to the [Azure Monitor Documentation](/azure/azure-monitor/agents/data-sources-json) for more details on these steps.
 For Cisco Meraki logs, we have issues while parsing the data by OMS agent data using default settings. 
So we advice to capture the logs into custom table **meraki_CL** using below instructions. 
1. Login to the server where you have installed OMS agent.
2. Download config file [meraki.conf](https://aka.ms/sentinel-ciscomerakioms-conf) 
		wget -v https://aka.ms/sentinel-ciscomerakioms-conf -O meraki.conf 
3. Copy meraki.conf to the /etc/opt/microsoft/omsagent/**workspace_id**/conf/omsagent.d/ folder. 
		cp meraki.conf /etc/opt/microsoft/omsagent/<<workspace_id>>/conf/omsagent.d/
4. Edit meraki.conf as follows:

	 a. meraki.conf uses the port **22033** by default. Ensure this port is not being used by any other source on your server

	 b. If you would like to change the default port for **meraki.conf** make sure that you dont use default Azure monitoring /log analytic agent ports I.e.(For example CEF uses TCP port **25226** or **25224**) 

	 c. replace **workspace_id** with real value of your Workspace ID (lines 14,15,16,19)
5. Save changes and restart the Azure Log Analytics agent for Linux service with the following command:
		sudo /opt/microsoft/omsagent/bin/service_control restart
6. Modify /etc/rsyslog.conf file - add below template preferably at the beginning / before directives section 
		$template meraki,"%timestamp% %hostname% %msg%\n" 
7. Create a custom conf file in /etc/rsyslog.d/ for example 10-meraki.conf and add following filter conditions.

	 With an added statement you will need to create a filter which will specify the logs coming from the Cisco Meraki to be forwarded to the custom table.

	 reference: [Filter Conditions — rsyslog 8.18.0.master documentation](https://rsyslog.readthedocs.io/en/latest/configuration/filters.html)

	 Here is an example of filtering that can be defined, this is not complete and will require additional testing for each installation.
		 if $rawmsg contains "flows" then @@127.0.0.1:22033;meraki
		 & stop 
		 if $rawmsg contains "urls" then @@127.0.0.1:22033;meraki
		 & stop
		 if $rawmsg contains "ids-alerts" then @@127.0.0.1:22033;meraki
		 & stop
		 if $rawmsg contains "events" then @@127.0.0.1:22033;meraki
		 & stop
		 if $rawmsg contains "ip_flow_start" then @@127.0.0.1:22033;meraki
		 & stop
		 if $rawmsg contains "ip_flow_end" then @@127.0.0.1:22033;meraki
		 & stop 
8. Restart rsyslog
		 systemctl restart rsyslog


3. Configure and connect the Cisco Meraki device(s)

[Follow these instructions](https://documentation.meraki.com/General_Administration/Monitoring_and_Reporting/Meraki_Device_Reporting_-_Syslog%2C_SNMP_and_API) to configure the Cisco Meraki device(s) to forward syslog. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscomeraki?tab=Overview) in the Azure Marketplace.
