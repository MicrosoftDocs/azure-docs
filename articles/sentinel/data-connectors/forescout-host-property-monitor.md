---
title: "Forescout Host Property Monitor connector for Microsoft Sentinel"
description: "Learn how to install the connector Forescout Host Property Monitor to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Forescout Host Property Monitor connector for Microsoft Sentinel

The Forescout Host Property Monitor connector allows you to connect host properties from Forescout platform with Microsoft Sentinel, to view, create custom incidents, and improve investigation. This gives you more insight into your organization network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ForescoutHostProperties_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Get 5 latest host property entries**
   ```kusto
ForescoutHostProperties_CL 
   | take 5
   ```



## Prerequisites

To integrate with Forescout Host Property Monitor make sure you have: 

- **Forescout Plugin requirement**: Please make sure Forescout Microsoft Sentinel plugin is running on Forescout platform


## Vendor installation instructions


Instructions on how to configure Forescout Microsoft Sentinel plugin are provided at Forescout Documentation Portal (https://docs.forescout.com/bundle/sentinel-1-0-h)





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/forescout.azure-sentinel-solution-forescout?tab=Overview) in the Azure Marketplace.
