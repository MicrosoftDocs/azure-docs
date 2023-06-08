---
title: "Cynerio Security Events connector for Microsoft Sentinel"
description: "Learn how to install the connector Cynerio Security Events to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 04/29/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cynerio Security Events connector for Microsoft Sentinel

The [Cynerio](https://www.cynerio.com/) connector allows you to easily connect your Cynerio Security Events with Microsoft Sentinel, to view IDS Events. This gives you more insight into your organization network security posture and improves your security operation capabilities. 

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CynerioEvent_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Cynerio](https://cynerio.com) |

## Query samples

**SSH Connections events in the last 24 hours**
   ```kusto
CynerioEvent_CL
 
   | where date_t > ago(24h) and title_s == 'SSH Connection'
   ```



## Vendor installation instructions

Configure and connect Cynerio

Cynerio can integrate with and export events directly to Microsoft Sentinel via Azure Server. Follow these steps to establish integration:

1. In the Cynerio console, go to Settings > Integrations tab (default), and click on the **+Add Integration** button at the top right.

2. Scroll down to the **SIEM** section.

3. On the Microsoft Sentinel card, click the Connect button.

4. The Integration Details window opens. Use the parameters below to fill out the form and set up the connection.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cynerio1681887657820.cynerio-medical-device-security-sentinel-connector?tab=Overview) in the Azure Marketplace.
