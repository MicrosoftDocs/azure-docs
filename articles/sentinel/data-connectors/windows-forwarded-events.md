---
title: "Windows Forwarded Events connector for Microsoft Sentinel"
description: "Learn how to install the connector Windows Forwarded Events to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/17/2022
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Windows Forwarded Events connector for Microsoft Sentinel

You can stream all Windows Event Forwarding (WEF) logs from the Windows Servers connected to your Microsoft Sentinel workspace using Azure Monitor Agent (AMA).
	This connection enables you to view dashboards, create custom alerts, and improve investigation.
	This gives you more insight into your organization’s network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | WindowsEvents<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-windowsforwardedevents?tab=Overview) in the Azure Marketplace.
