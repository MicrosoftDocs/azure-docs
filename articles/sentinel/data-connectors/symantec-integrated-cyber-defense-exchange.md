---
title: "Symantec Integrated Cyber Defense Exchange connector for Microsoft Sentinel"
description: "Learn how to install the connector Symantec Integrated Cyber Defense Exchange to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Symantec Integrated Cyber Defense Exchange connector for Microsoft Sentinel

Symantec ICDx connector allows you to easily connect your Symantec security solutions logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SymantecICDx_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Summarize by connection source ip**
   ```kusto
SymantecICDx_CL
            
   | summarize count() by connection_src_ip_s
   ```

**Summarize by threat id**
   ```kusto
SymantecICDx_CL
            
   | summarize count() by threat_id_d
   ```



## Vendor installation instructions

Configure and connect Symantec ICDx

1. On the ICDx navigation bar, click **Configuration**.
2. At the top of the **Configuration** screen, click **Forwarders**, and next to Microsoft Sentinel (Log Analytics), click **Add**.
3. In the Microsoft Sentinel (Log Analytics) window that opens, click **Show Advanced**. [See the documentation to set advanced features](https://aka.ms/SymantecICDX-learn-more).
4. Make sure that you set a name for the forwarder and under Azure Destination, set these required fields:
  -   Workspace ID: Paste the Workspace ID from the Microsoft Sentinel portal connector page.
  -   Primary Key: Paste the Primary Key from the Microsoft Sentinel portal connector page.
  -   Custom Log Name: Type the custom log name in the Microsoft Azure portal Log Analytics workspace to which you are going to forward events. The default is SymantecICDx.
5. Click Save and to start the forwarder, go to Options > More and click **Start**.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.symantec_icdx_mss?tab=Overview) in the Azure Marketplace.
