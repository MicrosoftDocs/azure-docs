---
title: "Flare connector for Microsoft Sentinel"
description: "Learn how to install the connector Flare to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Flare connector for Microsoft Sentinel

[Flare](https://flare.systems/platform/) connector allows you to receive data and intelligence from Flare on Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Firework_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Flare](https://flare.io/company/contact/) |

## Query samples

**Flare Activities -- All**
   ```kusto
Firework_CL
 
   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Flare make sure you have: 

- **Required Flare permissions**: only Flare organization administrators may configure the Microsoft Sentinel integration.


## Vendor installation instructions

1. Creating an Alert Channel for Microsoft Sentinel


As an organization administrator, authenticate on [Flare](https://app.flare.systems) and access the [team page](https://app.flare.systems#/team) to create a new alert channel.


Click on 'Create a new alert channel' and select 'Microsoft Sentinel'. Enter your Shared Key And WorkspaceID. Save the Alert Channel. 
 For more help and details, see our [Azure configuration documentation](/azure/sentinel/connect-data-sources).


   {0}


   {0} 

2. Associating your alert channel to an alert feed


At this point, you may configure alerts to be sent to Microsoft Sentinel the same way that you would configure regular email alerts.


For a more detailed guide, refer to the Flare documentation.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/flaresystmesinc1617114736428.flare-systems-firework-sentinel?tab=Overview) in the Azure Marketplace.
