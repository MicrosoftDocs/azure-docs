---
title: "Zscaler Private Access connector for Microsoft Sentinel"
description: "Learn how to install the connector Zscaler Private Access to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Zscaler Private Access connector for Microsoft Sentinel

The [Zscaler Private Access (ZPA)](https://help.zscaler.com/zpa/what-zscaler-private-access) data connector provides the capability to ingest [Zscaler Private Access events](https://help.zscaler.com/zpa/log-streaming-service) into Microsoft Sentinel. Refer to [Zscaler Private Access documentation](https://help.zscaler.com/zpa) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | ZPAEvent |
| **Kusto function url** | https://aka.ms/sentinel-ZscalerPrivateAccess-parser |
| **Log Analytics table(s)** | ZPA_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto

ZPAEvent

   | sort by TimeGenerated
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-ZscalerPrivateAccess-parser) to create the Kusto Functions alias, **ZPAEvent**


> [!NOTE]
   >  This data connector has been developed using Zscaler Private Access version: 21.67.1

1. Install and onboard the agent for Linux or Windows

Install the agent on the Server where the Zscaler Private Access logs are forwarded.

> Logs from Zscaler Private Access Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure the logs to be collected

Follow the configuration steps below to get Zscaler Private Access logs into Microsoft Sentinel. Refer to the [Azure Monitor Documentation](/azure/azure-monitor/agents/data-sources-json) for more details on these steps.
Zscaler Private Access logs are delivered via Log Streaming Service (LSS). Refer to [LSS documentation](https://help.zscaler.com/zpa/about-log-streaming-service) for detailed information
1. Configure [Log Receivers](https://help.zscaler.com/zpa/configuring-log-receiver). While configuring a Log Receiver, choose **JSON** as **Log Template**.
2. Download config file [zpa.conf](https://aka.ms/sentinel-ZscalerPrivateAccess-conf) 
		wget -v https://aka.ms/sentinel-zscalerprivateaccess-conf -O zpa.conf
3. Login to the server where you have installed Azure Log Analytics agent.
4. Copy zpa.conf to the /etc/opt/microsoft/omsagent/**workspace_id**/conf/omsagent.d/ folder.
5. Edit zpa.conf as follows:

	 a. specify port which you have set your Zscaler Log Receivers to forward logs to (line 4)

	 b. zpa.conf uses the port **22033** by default. Ensure this port is not being used by any other source on your server

	 c. If you would like to change the default port for **zpa.conf** make sure that it should not get conflict with default AMA agent ports I.e.(For example CEF uses TCP port **25226** or **25224**) 

	 d. replace **workspace_id** with real value of your Workspace ID (lines 14,15,16,19)
5. Save changes and restart the Azure Log Analytics agent for Linux service with the following command:
		sudo /opt/microsoft/omsagent/bin/service_control restart




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-zscalerprivateaccess?tab=Overview) in the Azure Marketplace.
