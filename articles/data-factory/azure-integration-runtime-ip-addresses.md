---
title: Azure Integration Runtime IP addresses
description: Learn which IP addresses you must allow inbound traffic from, in order to properly configure firewalls for securing network access to data stores.
services: data-factory
ms.author: abnarain
author: nabhishek
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 01/06/2020
---

# Azure Integration Runtime IP addresses

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The IP addresses that Azure Integration Runtime uses depends on the region where your Azure integration runtime is located. *All* Azure integration runtimes that are in the same region use the same IP address ranges.

> [!IMPORTANT]  
> Data flows don't support the use of fixed IP ranges.
>
> You can use these IP ranges for Data Movement, Pipeline and External activities executions. These IP ranges can be used for whitelisting in data stores/ Network Security Group (NSG)/ Firewalls for inbound access from Azure Integration runtime. 

## Azure Integration Runtime IP addresses: Specific regions

Allow traffic from the IP addresses listed for the Azure Integration runtime in the specific Azure region where your resources are located. You can get an IP range list of service tags from the [service tags IP range download link](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#discover-service-tags-by-using-downloadable-json-files). For example, if the Azure region is **AustraliaEast**, you can get an IP range list from **DataFactory.AustraliaEast**.


## Known issue with Azure Storage

* When connecting to Azure Storage account, IP network rules have no effect on requests originating from the Azure integration runtime in the same region as the storage account. For more details, please [refer this article](https://docs.microsoft.com/azure/storage/common/storage-network-security#grant-access-from-an-internet-ip-range). 

  Instead, we suggest using [trusted services while connecting to Azure Storage](https://techcommunity.microsoft.com/t5/azure-data-factory/data-factory-is-now-a-trusted-service-in-azure-storage-and-azure/ba-p/964993). 

## Next steps

* [Security considerations for data movement in Azure Data Factory](data-movement-security-considerations.md)
