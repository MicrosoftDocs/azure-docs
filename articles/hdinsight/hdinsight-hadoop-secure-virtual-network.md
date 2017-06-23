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

## Planning

The following is a checklist of actions you must take before installing HDInsight into an Azure Virtual Network:

* New or existing virtual network
* Type of virtual network
* Available IP addresses
* Name resolution
* Security

## New or existing virtual network

When adding HDInsight to an existing virtual network, you may need to make modifications to the network configuration. Use the following information to understand changes that you must make:

* If you use Network Security Groups or user-defined routes to restrict access to the virtual network, you must add exceptions for the Azure health monitoring endpoints. These services are required by HDInsight.

    If you are not sure if your existing network uses Network Security Groups or user-defined routes, see the following sections of this document:

    * [How to check for existing Network Security Groups]()

    * [How to check for existing user-defined routes]()

* If you use a Network Virtual Appliance firewall, you must allow the following ports through the firewall:



### How to check for existing Network Security Groups

```powershell
get-azurermnetworksecuritygroup -resourcegroupname <groupname>
```

```bash
az network nsg list --resource-group <groupname>
```

### How to check for existing user-defined routes

```powershell
get-azurermroutetable -resourcegroupname <groupname>
```

```bash
az network route-table list --resource-group <groupname>

## Type of virtual network

The type of virtual network used with HDInsight depends on the operating system used for the cluster.

| HDInsight operating system | Classic virtual network | Resource Manager virtual network |
| ---- | ---- | ---- |
| Linux | no | yes |
| Windows | yes | no |

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdi-version-33-nearing-retirement-date).

To access resources in an incompatible virtual network, join the two networks. For more information on joining networks, see [Connecting classic VNets to new VNets](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md).

## Available IP addresses

When you create a subnet within a virtual network, you set the number of internal IP addresses that are available in the subnet. You must create a subnet that has enough IP addresses for HDInsight.

HDInsight clusters consist of multiple nodes, such as head nodes, worker nodes, and Zookeeper nodes. Each node is implemented as an Azure Virtual Machine. Each virtual machine is allocated a single internal IP address. The type and default number of nodes vary by cluster type. You can modify the number of worker nodes in a cluster during or after cluster creation. For more information, see the [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md) document.

Use the following to determine how many IP addresses you should allocate.

* Determine how many nodes are used by your planned HDInsight configuration. HDInsight also creates two gateways, which use two more IP addresses. The subnet must contain at least this number of IP addresses.

* Allocate additional worker nodes if you plan on scaling out the cluster. Scaling out the cluster adds additional worker nodes. There must be an available (unused) IP address for each worker node added.

## Name resolution and custom DNS

Azure provides name resolution for Azure services that are installed in an Azure Virtual Network. This allows HDInsight to connect to the following resources by using a fully qualified domain name (FQDN).

* Any resource that is publicly available on the internet. For example, microsoft.com, google.com.

* Any resource that is in the same Azure Virtual Network. For example, an Azure Virtual Machine in the same virtual network.

The default name resolution does __not__ allow HDInsight to resolve the names of resources in networks that are joined to the virtual network. For example, it is common to join the your on-premises network to the virtual network. With only the default name resolution, HDInsight cannot access resources in the on-premises network by name. The opposite is also true, resources in your on-premises network cannot access resources in the virtual network by name.

To enable name resolution between the virtual network and resources in joined networks, you must perform the following actions:

1. Create a custom DNS server in the Azure Virtual Network that where you plan to install HDInsight.

    > [!WARNING]
    > You must create the custom DNS server and configure the virtual network to use it before creating the HDInsight cluster.

2. Configure forwarding between the DNS server in the virtual network and the DNS server in the joined network. For example, the DNS server in your on-premises network.

    > [!NOTE]
    > The process of configuring forwarding depends on the DNS server software that you use. For more information, see the documentation for your DNS server software.

For more information, see the [Name Resolution for VMs and Role Instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) document.

## Security

* __Forced tunneling__: HDInsight does not support the forced tunneling configuration of Azure Virtual Network.

* __Restricting network traffic__: 

    * __Network Security Groups__: You must allow unrestricted access to several Azure IPs. For the list of IPs, see the [required IP addresses](#hdinsight-ip) section.

        For more information, see the [Network Security Groups](#using-network-security-groups) section.

    * __User-defined routes__: You must define routes to several Azure IPs. For the list of IPs, see the [required IP addresses](#hdinsight-ip) section.

        For more information, see the [User-defined routes](#user-defined-routes) section.

## Network security groups

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


```