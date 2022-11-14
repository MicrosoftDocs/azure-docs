---
title: "Microsoft Office 365 for connector for Microsoft Sentinel"
description: "Learn how to install the Microsoft Office 365 data connector to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/14/2022
ms.service: microsoft-sentinel
ms.author: cwatson
ms.custom: legacy
---

# Microsoft Office 365 data connector for Microsoft Sentinel

The Office 365 activity log connector provides insight into ongoing user activities. You will get details of operations such as file downloads, access requests sent, changes to group events, set-mailbox and details of the user who performed the actions.​ By connecting Office 365 logs into Microsoft Sentinel you can use this data to view dashboards, create custom alerts, and improve your investigation process.​

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](../connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **License prerequisites/<br>Cost information** | Your Office 365 deployment must be on the same tenant as your Microsoft Sentinel workspace.<br>Other charges may apply. |
| **Log Analytics table(s)** | OfficeActivity |
| **DCR support** | [Workspace transformation DCR](../../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |
