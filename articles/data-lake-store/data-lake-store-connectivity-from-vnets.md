---
title: Connect to Azure Data Lake Storage Gen1 from VNETs | Microsoft Docs
description: Connect to Azure Data Lake Storage Gen1 from Azure VNETs
services: data-lake-store,data-catalog
documentationcenter: ''
author: esung22
manager: mtillman
editor: cgronlun

ms.assetid: 683fcfdc-cf93-46c3-b2d2-5cb79f5e9ea5
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.date: 01/31/2018
ms.author: elsung

---

# Access Azure Data Lake Storage Gen1 from VMs within an Azure VNET
Azure Data Lake Storage Gen1 is a PaaS service that runs on public Internet IP addresses. Any server that can connect to the public Internet can typically connect to Azure Data Lake Storage Gen1 endpoints as well. By default, all VMs that are in Azure VNETs can access the Internet and hence can access Azure Data Lake Storage Gen1. However, it is possible to configure VMs in a VNET to not have access to the Internet. For such VMs, access to Azure Data Lake Storage Gen1 is restricted as well. Blocking public Internet access for VMs in Azure VNETs can be done using any of the following approaches:

* By configuring Network Security Groups (NSG)
* By configuring User Defined Routes (UDR)
* By exchanging routes via BGP (industry standard dynamic routing protocol), when ExpressRoute is used, that block access to the Internet

In this article, you will learn how to enable access to Azure Data Lake Storage Gen1 from Azure VMs, which have been restricted to access resources using one of the three methods listed previously.

## Enabling connectivity to Azure Data Lake Storage Gen1 from VMs with restricted connectivity
To access Azure Data Lake Storage Gen1 from such VMs, you must configure them to access the IP address for the region where the Azure Data Lake Storage Gen1 account is available. You can identify the IP addresses for your Data Lake Storage Gen1 account regions by resolving the DNS names of your accounts (`<account>.azuredatalakestore.net`). To resolve DNS names of your accounts, you can use tools such as **nslookup**. Open a command prompt on your computer and run the following command:

    nslookup mydatastore.azuredatalakestore.net

The output resembles the following. The value against **Address** property is the IP address associated with your Data Lake Storage Gen1 account.

    Non-authoritative answer:
    Name:    1434ceb1-3a4b-4bc0-9c69-a0823fd69bba-mydatastore.projectcabostore.net
    Address:  104.44.88.112
    Aliases:  mydatastore.azuredatalakestore.net


### Enabling connectivity from VMs restricted by using NSG
When an NSG rule is used to block access to the Internet, then you can create another NSG that allows access to the Data Lake Storage Gen1 IP Address. For more information about NSG rules, see [Network security groups overview](../virtual-network/security-overview.md). For instructions on how to create NSGs, see [How to create a network security group](../virtual-network/tutorial-filter-network-traffic.md).

### Enabling connectivity from VMs restricted by using UDR or ExpressRoute
When routes, either UDRs or BGP-exchanged routes, are used to block access to the Internet, a special route needs to be configured so that VMs in such subnets can access Data Lake Storage Gen1 endpoints. For more information, see [User-defined routes overview](../virtual-network/virtual-networks-udr-overview.md). For instructions on creating UDRs, see [Create UDRs in Resource Manager](../virtual-network/tutorial-create-route-table-powershell.md).

### Enabling connectivity from VMs restricted by using ExpressRoute
When an ExpressRoute circuit is configured, the on-premises servers can access Data Lake Storage Gen1 through public peering. More details on configuring ExpressRoute for public peering is available at [ExpressRoute FAQs](../expressroute/expressroute-faqs.md).

## See also
* [Overview of Azure Data Lake Storage Gen1](data-lake-store-overview.md)
* [Securing data stored in Azure Data Lake Storage Gen1](data-lake-store-security-overview.md)

