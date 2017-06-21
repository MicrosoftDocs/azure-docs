---
title: HDInsight in a secured virtual network - Azure | Microsoft Docs
description: Learn how to use Azure Virtual Network to secure communication with HDInsight. You can use a virtual network to restrict inbound and outbound traffic to HDInsight, while securely connecting to other Azure resources or resources in your data center.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 06/21/2017
ms.author: larryfr

---
# Secure HDInsight using an Azure Virtual Network

Meta: This document offers planning and reference material about using HDInsight in a secured virtual network.

Learn how to use Azure Virtual Networks with HDInsight to enable the following scenarios:

* Restrict access to HDInsight. For example, prevent inbound traffic from the internet.

* Directly access services on HDInsight that aren't exposed over the Internet. For example, directly work with Kafka brokers or use the HBase Java API.

* Directly connect services to HDInsight. For example, use Oozie to import or export data to a SQL Server within your data center.

* Create solutions that involve multiple HDInsight clusters. For example, use Spark or Storm to analyze data stored in Kafka.

For more information on Azure Virtual Networks, see the [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) documentation.

## Planning checklist



## Filtering: Network security groups

Network security groups (NSG) allow you to filter traffic by:

* Source and destination IP address
* Port
* Protocol

To learn more, see the [Network security group](../virtual-network/virtual-networks-nsg.md) documentation.

When using network security groups with HDInsight, you must allow inbound traffic 

## Filtering: Network virtual appliances

Network Virtual Appliances (NVA) allow you to perform network functions such as adding a firewall to your virtual network or filtering traffic between virtual networks. For a list of available virtual appliances, see the [Azure marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances).

## Routing: User-defined routes

    * User-defined routes (UDR) allow you to create custom route tables that control how traffic is routed for the subnets in a virtual network. To learn more, see the [User-defined routes](../virtual-network/virtual-networks-udr-overview.md) documentation.

### how to check for existing NSGs

```powershell
get-azurermnetworksecuritygroup -resourcegroupname <groupname>
```

```bash
az network nsg list --resource-group <groupname>
```

### How to check for existing UDRs

```powershell
get-azurermroutetable -resourcegroupname <groupname>
```

```bash
az network route-table list --resource-group <groupname>
```