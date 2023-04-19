---
title: "Azure Web Application Firewall (WAF) connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Web Application Firewall (WAF) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Web Application Firewall (WAF) connector for Microsoft Sentinel

Connect to the Azure Web Application Firewall (WAF) for Application Gateway, Front Door, or CDN. This WAF protects your applications from common web vulnerabilities such as SQL injection and cross-site scripting, and lets you customize rules to reduce false positives. Follow these instructions to stream your Microsoft Web application firewall logs into Microsoft Sentinel. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2223546&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AzureDiagnostics (Application Gateways)<br/> AzureDiagnostics (FrontDoors)<br/> AzureDiagnostics (CDN)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-azurewebapplicationfirewal?tab=Overview) in the Azure Marketplace.
