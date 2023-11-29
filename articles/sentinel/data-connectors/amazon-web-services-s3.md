---
title: "Amazon Web Services S3 connector for Microsoft Sentinel (preview)"
description: "Learn how to install the connector Amazon Web Services S3 to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Amazon Web Services S3 connector for Microsoft Sentinel (preview)

This connector allows you to ingest AWS service logs, collected in AWS S3 buckets, to Microsoft Sentinel. The currently supported data types are: 
* AWS CloudTrail
* VPC Flow Logs
* AWS GuardDuty

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AWSGuardDuty<br/> AWSVPCFlow<br/> AWSCloudTrail<br/> |
| **Data collection rules support** | [Supported as listed](/azure/azure-monitor/logs/tables-feature-support) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-amazonwebservices?tab=Overview) in the Azure Marketplace.
