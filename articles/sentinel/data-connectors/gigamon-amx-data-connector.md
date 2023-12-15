---
title: "Gigamon AMX Data connector for Microsoft Sentinel"
description: "Learn how to install the connector Gigamon AMX Data to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 11/29/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Gigamon AMX Data connector for Microsoft Sentinel

Use this data connector to integrate with Gigamon Application Metadata Exporter (AMX) and get data sent directly to Microsoft Sentinel. 

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Gigamon_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Gigamon](https://www.gigamon.com/) |

## Query samples

**List all artifacts**
   ```kusto
Gigamon_CL
   ```



## Vendor installation instructions

Gigamon Data Connector

1. Application Metadata Exporter (AMX) application converts the output from the Application Metadata Intelligence (AMI) in CEF format into JSON format and sends it to the cloud tools and Kafka.
 2. The AMX application can be deployed only on a V Series Node and can be connected to Application Metadata Intelligence running on a physical node or a virtual machine.
 3. The AMX application and the AMI are managed by GigaVUE-FM. This application is supported on VMware ESXi, VMware NSX-T, AWS and Azure.
  





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/gigamon-inc.microsoft-sentinel-solution-gigamon?tab=Overview) in the Azure Marketplace.
