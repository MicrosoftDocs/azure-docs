---
title: "F5 BIG-IP connector for Microsoft Sentinel"
description: "Learn how to install the connector F5 BIG-IP to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# F5 BIG-IP connector for Microsoft Sentinel

The F5 firewall connector allows you to easily connect your F5 logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | F5Telemetry_LTM_CL<br/> F5Telemetry_system_CL<br/> F5Telemetry_ASM_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [F5 Networks](https://support.f5.com/csp/home) |

## Query samples

**Count how many LTM logs have been generated from different client IP addresses over time**
   ```kusto
F5Telemetry_LTM_CL
            
   | summarize count() by client_ip_s, TimeGenerated
            
   | sort by TimeGenerated
   ```

**Present the System Telemetry host names**
   ```kusto
F5Telemetry_system_CL
            
   | project hostname_s
            
   | sort by TimeGenerated
   ```

**Count how many ASM logs have been generated from different locations**
   ```kusto
F5Telemetry_ASM_CL
            
   | summarize count() by geo_location_s
   ```



## Vendor installation instructions

Configure and connect F5 BIGIP

To connect your F5 BIGIP, you have to post a JSON declaration to the system’s API endpoint. For instructions on how to do this, see [Integrating the F5 BGIP with Microsoft Sentinel](https://aka.ms/F5BigIp-Integrate).





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/f5-networks.f5_bigip_mss?tab=Overview) in the Azure Marketplace.
