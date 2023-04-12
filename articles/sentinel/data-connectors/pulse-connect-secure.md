---
title: "Pulse Connect Secure connector for Microsoft Sentinel"
description: "Learn how to install the connector Pulse Connect Secure to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Pulse Connect Secure connector for Microsoft Sentinel

The [Pulse Connect Secure](https://www.pulsesecure.net/products/pulse-connect-secure/) connector allows you to easily connect your Pulse Connect Secure logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigations. Integrating Pulse Connect Secure with Microsoft Sentinel provides more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (PulseConnectSecure)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Failed Logins by User**
   ```kusto
PulseConnectSecure 
 
   | where vpn_message startswith 'Login failed'
 
   | summarize count() by vpn_user 
 
   | top 10 by count_ 
   ```

**Top 10 Failed Logins by IP Address**
   ```kusto
PulseConnectSecure 
 
   | where vpn_message startswith 'Login failed'
 
   | summarize count() by client_ip 
 
   | top 10 by count_  
   ```



## Prerequisites

To integrate with Pulse Connect Secure make sure you have: 

- **Pulse Connect Secure**: must be configured to export logs via Syslog


## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected which is deployed as part of the solution. To view the function code in Log Analytics, open Log Analytics/Microsoft Sentinel Logs blade, click Functions and search for the alias Pulse Connect Secure and load the function code or click [here](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Pulse%20Connect%20Secure/Parsers/PulseConnectSecure.txt), on the second line of the query, enter the hostname(s) of your Pulse Connect Secure device(s) and any other unique identifiers for the logstream. The function usually takes 10-15 minutes to activate after solution installation/update.

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the Pulse Connect Secure

[Follow the instructions](https://docs.pulsesecure.net/WebHelp/Content/PCS/PCS_AdminGuide_8.2/Configuring Syslog.htm) to enable syslog streaming of Pulse Connect Secure logs. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-pulseconnectsecure?tab=Overview) in the Azure Marketplace.
