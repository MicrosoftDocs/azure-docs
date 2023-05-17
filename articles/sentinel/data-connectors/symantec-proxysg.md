---
title: "Symantec ProxySG connector for Microsoft Sentinel"
description: "Learn how to install the connector Symantec ProxySG to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Symantec ProxySG connector for Microsoft Sentinel

The [Symantec ProxySG](https://www.broadcom.com/products/cyber-security/network/gateway/proxy-sg-and-advanced-secure-gateway) allows you to easily connect your Symantec ProxySG logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigations. Integrating Symantec ProxySG with Microsoft Sentinel provides more visibility into your organization's network proxy traffic and will enhance security monitoring capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (SymantecProxySG)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Top 10 Denied Users**
   ```kusto
SymantecProxySG 
 
   | where sc_filter_result == 'DENIED' 
 
   | summarize count() by cs_userdn 
 
   | top 10 by count_
   ```

**Top 10 Denied Client IPs**
   ```kusto
SymantecProxySG 
 
   | where sc_filter_result == 'DENIED' 
 
   | summarize count() by c_ip 
 
   | top 10 by count_
   ```



## Prerequisites

To integrate with Symantec ProxySG make sure you have: 

- **Symantec ProxySG**: must be configured to export logs via Syslog


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias Symantec Proxy SG and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/SymantecProxySG/Parsers/SymantecProxySG/SymantecProxySG.txt), on the second line of the query, enter the hostname(s) of your Symantec Proxy SG device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the Symantec ProxySG

[Follow these instructions](https://knowledge.broadcom.com/external/article/166529/sending-access-logs-to-a-syslog-server.html) to enable syslog streaming of **Access** Logs. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-symantec-proxysg?tab=Overview) in the Azure Marketplace.
