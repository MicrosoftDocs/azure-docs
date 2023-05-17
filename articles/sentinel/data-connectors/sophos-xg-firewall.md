---
title: "Sophos XG Firewall connector for Microsoft Sentinel"
description: "Learn how to install the connector Sophos XG Firewall to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Sophos XG Firewall connector for Microsoft Sentinel

The [Sophos XG Firewall](https://www.sophos.com/products/next-gen-firewall.aspx) allows you to easily connect your Sophos XG Firewall logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigations. Integrating Sophos XG Firewall with Microsoft Sentinel provides more visibility into your organization's firewall traffic and will enhance security monitoring capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (SophosXGFirewall)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |

## Query samples

**Top 10 Denied Source IPs**
   ```kusto
SophosXGFirewall 

   | where Log_Type == "Firewall" and Status == "Deny" 

   | summarize count() by Src_IP 

   | top 10 by count_
   ```

**Top 10 Denied Destination IPs**
   ```kusto
SophosXGFirewall 

   | where Log_Type == "Firewall" and Status == "Deny" 

   | summarize count() by Dst_IP 

   | top 10 by count_
   ```



## Prerequisites

To integrate with Sophos XG Firewall make sure you have: 

- **Sophos XG Firewall**: must be configured to export logs via Syslog


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias Sophos XG Firewall and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Sophos%20XG%20Firewall/Parsers/SophosXGFirewall.txt), on the second line of the query, enter the hostname(s) of your Sophos XG Firewall device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the Sophos XG Firewall

[Follow these instructions](https://community.sophos.com/kb/123184#How%20to%20configure%20the%20Syslog%20Server) to enable syslog streaming. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sophosxgfirewall?tab=Overview) in the Azure Marketplace.
