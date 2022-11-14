---
title: "Azure Web Application Firewall connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Web Application Firewall (WAF) solution for Microsoft Sentinel to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/14/2022
ms.service: microsoft-sentinel
ms.author: cwatson
ms.custom: miss-solution
---

# Azure Web Application Firewall (WAF) solution for Microsoft Sentinel

The Azure Web Application Firewall (WAF) solution for Microsoft Sentinel allows you to ingest Diagnostic Metrics from Application Gateway, Front Door and CDN into Microsoft Sentinel.

## Connector attribute

| Connector attribute | Description |
| --- | --- |
| **Data ingestion method** | **Azure service-to-service integration: <br>[Diagnostic settings-based connections](../connect-azure-windows-microsoft-services.md?tabs=SA#diagnostic-settings-based-connections)** |
| **Log Analytics table(s)** | AzureDiagnostics |
| **DCR support** | Not currently supported |
| **Recommended diagnostics** | **Application Gateway**<br><li>ApplicationGatewayAccessLog<li>ApplicationGatewayFirewallLog<br>**Front Door**<li>FrontdoorAccessLog<li>FrontdoorWebApplicationFirewallLog<br>**CDN WAF policy**<li>WebApplicationFirewallLogs |
| **Supported by** | Microsoft |

## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-azurewebapplicationfirewal?tab=Overview) in the Azure Marketplace.