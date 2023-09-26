---
title: "Sophos Cloud Optix connector for Microsoft Sentinel"
description: "Learn how to install the connector Sophos Cloud Optix to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 06/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Sophos Cloud Optix connector for Microsoft Sentinel

The [Sophos Cloud Optix](https://www.sophos.com/products/cloud-optix.aspx) connector allows you to easily connect your Sophos Cloud Optix logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's cloud security and compliance posture and improves your cloud security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SophosCloudOptix_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Sophos](https://www.sophos.com/en-us/support) |

## Query samples

**Top 10 Optix alerts raised for your cloud environment(s)**
   ```kusto
SophosCloudOptix_CL
 
   | summarize count() by alertDescription_s
 
   | top 10 by count_
   ```

**Top 5 environments with High severity Optix alerts raised**
   ```kusto
SophosCloudOptix_CL
 
   | where severity_s == 'HIGH'
 
   | summarize count() by accountId_s
 
   | top 5 by count_
   ```



## Vendor installation instructions

1. Get the Workspace ID and the Primary Key

Copy the Workspace ID and Primary Key for your workspace.




2. Configure the Sophos Cloud Optix Integration

In Sophos Cloud Optix go to [Settings->Integrations->Microsoft Sentinel](https://optix.sophos.com/#/integrations/sentinel) and enter the Workspace ID and Primary Key copied in Step 1.


3. Select Alert Levels

In Alert Levels, select which Sophos Cloud Optix alerts you want to send to Microsoft Sentinel.


4. Turn on the integration

To turn on the integration, select Enable, and then click Save.




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/sophos.sophos_cloud_optix_mss?tab=Overview) in the Azure Marketplace.
