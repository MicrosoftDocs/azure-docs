---
title: "include file"
description: "include file"
services: healthcare-apis
ms.service: fhir
ms.topic: "include"
ms.date: 07/26/2023
ms.author: kesheth
ms.custom: "include file"
---

### Allowing specific IP addresses from other Azure regions to access the Azure storage account

In the Azure portal, go to the ADLS Gen2 account and select the **Networking** blade. 
   
Select **Enabled from selected virtual networks and IP addresses**. Under the Firewall section, specify the IP address in the **Address range** box. Add IP ranges to allow access from the internet or your on-premises networks. You can find the IP address in the table below for the Azure region where the FHIR service is provisioned.

|**Azure Region**         |**Public IP Address** |
|:----------------------|:-------------------|
| Australia East       | 20.53.44.80       |
| Canada Central       | 20.48.192.84      |
| Central US           | 52.182.208.31     |
| East US              | 20.62.128.148     |
| East US 2            | 20.49.102.228     |
| East US 2 EUAP       | 20.39.26.254      |
| Germany North        | 51.116.51.33      |
| Germany West Central | 51.116.146.216    |
| Japan East           | 20.191.160.26     |
| Korea Central        | 20.41.69.51       |
| North Central US     | 20.49.114.188     |
| North Europe         | 52.146.131.52     |
| South Africa North   | 102.133.220.197   |
| South Central US     | 13.73.254.220     |
| Southeast Asia       | 23.98.108.42      |
| Switzerland North    | 51.107.60.95      |
| UK South             | 51.104.30.170     |
| UK West              | 51.137.164.94     |
| West Central US      | 52.150.156.44     |
| West Europe          | 20.61.98.66       |
| West US 2            | 40.64.135.77      |

### Allowing specific IP addresses to access the Azure storage account in the same region

The configuration process for IP addresses in the same region is just like above except a specific IP address range in Classless Inter-Domain Routing (CIDR) format is used instead (i.e., 100.64.0.0/10). The reason why the IP address range (100.64.0.0 – 100.127.255.255) must be specified is because an IP address for the FHIR service will be allocated each time an operation request is made.

> [!NOTE] 
> It is possible that a private IP address within the range of 10.0.2.0/24 may be used, but there is no guarantee that the operation will succeed in such a case. You can retry if the operation request fails, but until an IP address within the range of 100.64.0.0/10 is used, the request will not succeed. This network behavior for IP address ranges is by design. The alternative is to configure the storage account in a different region.
