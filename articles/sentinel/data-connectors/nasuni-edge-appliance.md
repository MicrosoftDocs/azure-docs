---
title: "Nasuni Edge Appliance connector for Microsoft Sentinel"
description: "Learn how to install the connector Nasuni Edge Appliance to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Nasuni Edge Appliance connector for Microsoft Sentinel

The [Nasuni](https://www.nasuni.com/) connector allows you to easily connect your Nasuni Edge Appliance Notifications and file system audit logs with Microsoft Sentinel. This gives you more insight into activity within your Nasuni infrastructure and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Nasuni](https://github.com/nasuni-labs/Azure-Sentinel) |

## Query samples

**Last 1000 generated events**
   ```kusto
Syslog
            
   | top 1000 by TimeGenerated
   ```

**All events by facility except for cron**
   ```kusto
Syslog
            
   | summarize count() by Facility 
   | where Facility != "cron"
   ```



## Vendor installation instructions

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Follow the configuration steps below to configure your Linux machine to send Nasuni event information to Microsoft Sentinel. Refer to the [Azure Monitor Agent documenation](/azure/azure-monitor/agents/agents-overview) for additional details on these steps.
Configure the facilities you want to collect and their severities.
1. Select the link below to open your workspace agents configuration, and select the Syslog tab.
2. Select Add facility and choose from the drop-down list of facilities. Repeat for all the facilities you want to add.
3. Mark the check boxes for the desired severities for each facility.
4. Click Apply.



3. Configure Nasuni Edge Appliance settings

Follow the instructions in the [Nasuni Management Console Guide](https://view.highspot.com/viewer/629a633ae5b4caaf17018daa?iid=5e6fbfcbc7143309f69fcfcf) to configure Nasuni Edge Appliances to forward syslog events. Use the IP address or hostname of the Linux device running the Azure Monitor Agent in the Servers configuration field for the syslog settings.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/nasunicorporation.nasuni-sentinel?tab=Overview) in the Azure Marketplace.
