---
title: "Microsoft Sysmon For Linux connector for Microsoft Sentinel"
description: "Learn how to install the connector Microsoft Sysmon For Linux to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Microsoft Sysmon For Linux connector for Microsoft Sentinel

[Sysmon for Linux](https://github.com/Sysinternals/SysmonForLinux) provides detailed information about process creations, network connections and other system events.
[Sysmon for linux link:]. The Sysmon for Linux connector uses [Syslog](https://aka.ms/sysLogInfo) as its data ingestion method. This solution depends on ASIM to work as expected. [Deploy ASIM](https://aka.ms/DeployASIM) to get the full value from the solution.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (Sysmon)<br/> |
| **Data collection rules support** | [Workspace transform DCR](../../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Events by ActingProcessName**
   ```kusto
vimProcessCreateLinuxSysmon
            
   | summarize count() by ActingProcessName
             
   | top 10 by count_
   ```



## Vendor installation instructions


>This data connector depends on ASIM parsers based on a Kusto Functions to work as expected. [Deploy the parsers](https://aka.ms/ASimSysmonForLinuxARM) 

 The following functions will be deployed:

 - vimFileEventLinuxSysmonFileCreated, vimFileEventLinuxSysmonFileDeleted

 - vimProcessCreateLinuxSysmon, vimProcessTerminateLinuxSysmon

 - vimNetworkSessionLinuxSysmon 

[Read more](https://aka.ms/AboutASIM)

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.

1.  Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
2.  Select **Apply below configuration to my machines** and select the facilities and severities.
3.  Click **Save**.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sysmonforlinux?tab=Overview) in the Azure Marketplace.