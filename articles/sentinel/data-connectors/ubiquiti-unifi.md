---
title: "Ubiquiti UniFi (Preview) connector for Microsoft Sentinel"
description: "Learn how to install the connector Ubiquiti UniFi (Preview) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Ubiquiti UniFi (Preview) connector for Microsoft Sentinel

The [Ubiquiti UniFi](https://www.ui.com/) data connector provides the capability to ingest [Ubiquiti UniFi firewall, dns, ssh, AP events](https://help.ui.com/hc/en-us/articles/204959834-UniFi-How-to-View-Log-Files) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Ubiquiti_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Clients (Source IP)**
   ```kusto
UbiquitiAuditEvent
 
   | summarize count() by SrcIpAddr
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**UbiquitiAuditEvent**](https://aka.ms/sentinel-UbiquitiUnifi-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >  This data connector has been developed using Enterprise System Controller Release Version: 5.6.2 (Syslog)

1. Install and onboard the agent for Linux or Windows

Install the agent on the Server to which the Ubiquiti logs are forwarder from Ubiquiti device (e.g.remote syslog server)

> Logs from Ubiquiti Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure the logs to be collected

Follow the configuration steps below to get Ubiquiti logs into Microsoft Sentinel. Refer to the [Azure Monitor Documentation](/azure/azure-monitor/agents/data-sources-json) for more details on these steps.
1. Configure log forwarding on your Ubiquiti controller: 

	 i. Go to Settings > System Setting > Controller Configuration > Remote Logging and enable the Syslog and Debugging (optional) logs (Refer to [User Guide](https://dl.ui.com/guides/UniFi/UniFi_Controller_V5_UG.pdf) for detailed instructions).
2. Download config file [Ubiquiti.conf](https://aka.ms/sentinel-UbiquitiUnifi-conf).
3. Login to the server where you have installed Azure Log Analytics agent.
4. Copy Ubiquiti.conf to the /etc/opt/microsoft/omsagent/**workspace_id**/conf/omsagent.d/ folder.
5. Edit Ubiquiti.conf as follows:

	 i. specify port which you have set your Ubiquiti device to forward logs to (line 4)

	 ii. replace **workspace_id** with real value of your Workspace ID (lines 14,15,16,19)
5. Save changes and restart the Azure Log Analytics agent for Linux service with the following command:
		sudo /opt/microsoft/omsagent/bin/service_control restart




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ubiquitiunifi?tab=Overview) in the Azure Marketplace.
