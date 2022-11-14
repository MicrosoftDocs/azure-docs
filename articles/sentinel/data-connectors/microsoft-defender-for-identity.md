---
title: "Microsoft Defender for Identity connector for Microsoft Sentinel"
description: "Learn how to install the connector Microsoft Defender for Identity to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/14/2022
ms.service: microsoft-sentinel
ms.author: cwatson
ms.custom: miss-solution
---

# Microsoft Defender for Identity connector for Microsoft Sentinel

The Microsoft Defender for Identity solution for Microsoft Sentinel allows you to ingest security alerts reported in the Microsoft Defender for Identity platform to get better insights into the identity posture of your organization’s Active Directory environment.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](connect-azure-windows-microsoft-services.md#api-based-connections)** |
| **Log Analytics table(s)** | SecurityAlert |
| **DCR support** | [Workspace transformation DCR](../../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | Microsoft |

## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-mdefenderforidentity?tab=Overview) in the Azure Marketplace.