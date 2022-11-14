---
title: "Microsoft Purview Insider Risk Management connector for Microsoft Sentinel"
description: "Learn how to install the connector Microsoft Purview Insider Risk Management to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/14/2022
ms.service: microsoft-sentinel
ms.author: cwatson
ms.custom: miss-catalog
---

# Microsoft Purview Insider Risk Management connector for Microsoft Sentinel

This solution enables insider risk management teams to investigate risk-based behavior across 25+ Microsoft products. This solution is a better-together story between Microsoft Sentinel and Microsoft Purview Insider Risk Management.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[API-based connections](../connect-azure-windows-microsoft-services.md#api-based-connections)**<br><br>Also available in the [Microsoft Purview Insider Risk Management solution](../sentinel-solutions-catalog.md#domain-solutions) |
| **License and other prerequisites** | <ul><li>Valid subscription for Microsoft 365 E5/A5/G5, or their accompanying Compliance or IRM add-ons.<li>[Microsoft Purview Insider Risk Management](/microsoft-365/compliance/insider-risk-management) fully onboarded, and [IRM policies](/microsoft-365/compliance/insider-risk-management-policies) defined and producing alerts.<li>[Microsoft 365 IRM configured](/microsoft-365/compliance/insider-risk-management-settings#export-alerts-preview) to enable the export of IRM alerts to the Office 365 Management Activity API in order to receive the alerts through the Microsoft Sentinel connector.)
| **Log Analytics table(s)** | SecurityAlert |
| **Data query filter** | `SecurityAlert`<br>`| where ProductName == "Microsoft Purview Insider Risk Management"` |
| **Supported by** | Microsoft |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-insiderriskmanagement?tab=Overview) in the Azure Marketplace.