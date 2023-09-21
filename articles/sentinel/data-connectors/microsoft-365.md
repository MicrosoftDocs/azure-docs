---
title: "Microsoft 365 connector for Microsoft Sentinel"
description: "Learn how to install the connector Microsoft 365 (formerly, Office 365) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Microsoft 365 connector for Microsoft Sentinel

The Microsoft 365 (formerly, Office 365) activity log connector provides insight into ongoing user activities. You will get details of operations such as file downloads, access requests sent, changes to group events, set-mailbox and details of the user who performed the actions. By connecting Microsoft 365 logs into Microsoft Sentinel you can use this data to view dashboards, create custom alerts, and improve your investigation process. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2219943&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | OfficeActivity (SharePoint)<br/> OfficeActivity (Exchange)<br/> OfficeActivity (Teams)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-office365?tab=Overview) in the Azure Marketplace.
