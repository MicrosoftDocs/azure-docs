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

The IP addresses that Azure Integration Runtime uses depends on the region where your Azure integration runtime is located. *All* Azure integration runtimes that are in the same region use the same IP address ranges.

> [!IMPORTANT]  
> Data flows does not use these IPs currently. 
>
> You can use these IP ranges for Data Movement, Pipeline and External activities executions. These IP ranges can be used for whitelisting in data stores/ Network Security Group (NSG)/ Firewalls for inbound access from Azure Integration runtime. 

## Azure Integration Runtime IP addresses: Specific regions

Allow traffic from the IP addresses listed for the Azure Integration runtime in the specific Azure region where your resources are located:

|                | Region              | IP addresses                                                 |
| -------------- | ------------------- | ------------------------------------------------------------ |
| Asia           | East Asia           | 20.189.104.128/25, </br>20.189.106.0/26, </br>13.75.39.112/28 |
| &nbsp;         | Southeast Asia      | 20.43.128.128/25, </br>20.43.130.0/26, </br>40.78.236.176/28 |
| Australia      | Australia East      | 20.37.193.0/25,</br>20.37.193.128/26,</br>13.70.74.144/28    |
| &nbsp;         | Australia Southeast | 20.42.225.0/25,</br>20.42.225.128/26,</br>13.77.53.160/28    |
| Brazil         | Brazil South        | 191.235.224.128/25,</br>191.235.225.0/26,</br>191.233.205.160/28 |
| Canada         | Canada Central      | 52.228.80.128/25,</br>52.228.81.0/26,</br>13.71.175.80/28    |
| Europe         | North Europe        | 20.38.82.0/23,</br>20.38.80.192/26,</br>13.69.230.96/28      |
| &nbsp;         | West Europe         | 40.74.26.0/23,</br>40.74.24.192/26,</br>13.69.67.192/28      |
| France         | France Central      | 20.43.40.128/25,</br>20.43.41.0/26,</br>40.79.132.112/28     |
| India          | Central India       | 52.140.104.128/25,</br>52.140.105.0/26,</br>20.43.121.48/28  |
| Japan          | Japan East          | 20.43.64.128/25,</br>20.43.65.0/26,</br>13.78.109.192/28     |
| Korea          | Korea Central       | 20.41.64.128/25,</br>20.41.65.0/26,</br>52.231.20.64/28      |
| South Africa   | South Africa North  | 102.133.124.104/29,</br>102.133.216.128/25,</br>102.133.217.0/26 |
| United Kingdom | UK South            | 51.104.24.128/25,</br>51.104.25.0/26,</br>51.104.9.32/28     |
| United States  | Central US          | 20.37.154.0/23,</br>20.37.156.0/26,</br>20.44.10.64/28       |
|                | East US             | 20.42.2.0/23,</br>20.42.4.0/26,</br>40.71.14.32/28           |
|                | East US2            | 20.41.2.0/23,</br>20.41.4.0/26,</br>20.44.17.80/28           |
|                | East US 2 EUAP      | 20.39.8.128/26,</br>20.39.8.96/27,</br>40.75.35.144/28       |
|                | North Central US    | 40.80.185.0/25,</br>40.80.185.128/26,</br>52.162.111.48/28   |
|                | South Central US    | 40.119.9.0/25,</br>40.119.9.128/26,</br>13.73.244.32/28      |
|                | West Central US     | 52.150.137.128/25,</br>52.150.136.192/26,</br>13.71.199.0/28 |
|                | West US             | 40.82.250.0/23,</br>40.82.249.64/26,</br>13.86.219.208/28    |
|                | West US2            | 20.42.132.0/23,</br>20.42.129.64/26,</br>13.66.143.128/28    |

## Known issue with Azure Storage

* When connecting to Azure Storage account, IP network rules have no effect on requests originating from the Azure integration runtime in the same region as the storage account. For more details, please [refer this article](https://docs.microsoft.com/azure/storage/common/storage-network-security#grant-access-from-an-internet-ip-range). 

  Instead, we suggest using [trusted services while connecting to Azure Storage](https://techcommunity.microsoft.com/t5/azure-data-factory/data-factory-is-now-a-trusted-service-in-azure-storage-and-azure/ba-p/964993). 

## Next steps

* [Security considerations for data movement in Azure Data Factory](data-movement-security-considerations.md)
