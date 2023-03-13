---
title: "VMware ESXi connector for Microsoft Sentinel"
description: "Learn how to install the connector VMware ESXi to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# VMware ESXi connector for Microsoft Sentinel

The [VMware ESXi](https://www.vmware.com/products/esxi-and-esx.html) connector allows you to easily connect your VMWare ESXi logs with Microsoft Sentinel This gives you more insight into your organization's ESXi servers and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | VMwareESXi |
| **Kusto function url** | https://aka.ms/sentinel-vmwareesxi-parser |
| **Log Analytics table(s)** | Syslog (VMwareESXi)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Total Events by Log Type**
   ```kusto
VMwareESXi 

   | summarize count() by ProcessName
   ```

**Top 10 ESXi Hosts Generating Events**
   ```kusto
VMwareESXi 
 
   | summarize count() by HostName 
 
   | top 10 by count_
   ```



## Prerequisites

To integrate with VMware ESXi make sure you have: 

- **VMwareESXi**: must be configured to export logs via Syslog


## Vendor installation instructions


>This data connector depends on a parser based on a Kusto Function to work as expected. [Follow the steps](https://aka.ms/sentinel-vmwareesxi-parser) to use the Kusto function alias, **VMwareESXi**

1. Install and onboard the agent for Linux

Typically, you should install the agent on a different computer from the one on which the logs are generated.

>  Syslog logs are collected only from **Linux** agents.


2. Configure the logs to be collected

Configure the facilities you want to collect and their severities.
 1. Under workspace advanced settings **Configuration**, select **Data** and then **Syslog**.
 2. Select **Apply below configuration to my machines** and select the facilities and severities.
 3.  Click **Save**.


3. Configure and connect the VMware ESXi

1. Follow these instructions to configure the VMWare ESXi to forward syslog: 
 - [VMware ESXi 3.5 and 4.x](https://kb.vmware.com/s/article/1016621) 
 - [VMware ESXi 5.0+](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.monitoring.doc/GUID-9F67DB52-F469-451F-B6C8-DAE8D95976E7.html)
2. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-vmwareesxi?tab=Overview) in the Azure Marketplace.
