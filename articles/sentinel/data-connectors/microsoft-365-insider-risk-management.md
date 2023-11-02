---
title: "Microsoft 365 Insider Risk Management connector for Microsoft Sentinel"
description: "Learn how to install the connector Microsoft 365 Insider Risk Management to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Microsoft 365 Insider Risk Management connector for Microsoft Sentinel

Microsoft 365 Insider Risk Management is a compliance solution in Microsoft 365 that helps minimize internal risks by enabling you to detect, investigate, and act on malicious and inadvertent activities in your organization. Risk analysts in your organization can quickly take appropriate actions to make sure users are compliant with your organization's compliance standards.

Insider risk policies allow you to:

-   define the types of risks you want to identify and detect in your organization.
-   decide on what actions to take in response, including escalating cases to Microsoft Advanced eDiscovery if needed.

This solution produces alerts that can be seen by Office customers in the Insider Risk Management solution in Microsoft 365 Compliance Center.
[Learn More](https://aka.ms/OfficeIRMConnector) about Insider Risk Management.

These alerts can be imported into Microsoft Sentinel with this connector, allowing you to see, investigate, and respond to them in a broader organizational threat context. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2223721&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert (OfficeIRM)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-insiderriskmanagement?tab=Overview) in the Azure Marketplace.
