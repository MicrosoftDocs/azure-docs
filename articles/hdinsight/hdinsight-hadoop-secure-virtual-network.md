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

* If you use Network Security Groups or user-defined routes to restrict access to the virtual network, you must add exceptions for the Azure health monitoring endpoints. These services are required by HDInsight. For more information, see the [Security]()TBD) section of this document.

    If you are not sure if your existing network uses Network Security Groups or user-defined routes, see the following sections of this document:

    * [How to check for existing Network Security Groups]()

    * [How to check for existing user-defined routes]()

* If you use a Network Virtual Appliance firewall, you must configure the appliance to allow the ports used by HDInsight. For more information, see the [Security](tbd) section of this document.

* If you are using forced tunneling, you must [TBD].

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

Azure provides name resolution for Azure services that are installed in an Azure Virtual Network. This allows HDInsight to connect to the following resources by using a fully qualified domain name (FQDN):

* Any resource that is publicly available on the internet. For example, microsoft.com, google.com.

* Any resource that is in the same Azure Virtual Network, by using the __internal DNS name__ of the resource. For example, when using the default name resolution, the following are example internal DNS names assigned to HDInsight worker nodes:

    * wn0-hdinsi.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net
    * wn2-hdinsi.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net

    Both these nodes can communicate directly with each other, and other nodes in HDInsight, by using internal DNS names.

The default name resolution does __not__ allow HDInsight to resolve the names of resources in networks that are joined to the virtual network. For example, it is common to join the your on-premises network to the virtual network. With only the default name resolution, HDInsight cannot access resources in the on-premises network by name. The opposite is also true, resources in your on-premises network cannot access resources in the virtual network by name.

To enable name resolution between the virtual network and resources in joined networks, you must perform the following actions:

1. Create a custom DNS server in the Azure Virtual Network where you plan to install HDInsight.

2. Configure the virtual network to use the custom DNS server.

3. Configure forwarding between the DNS server in the virtual network and the DNS server in the joined network. For example, the DNS server in your on-premises network.

    > [!NOTE]
    > The process of configuring forwarding depends on the DNS server software that you use. For more information, see the documentation for your DNS server software.

For more information, see the [Name Resolution for VMs and Role Instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) document.

> [!WARNING]
> You must create the custom DNS server and configure the virtual network to use it before creating the HDInsight cluster.

## Security

Azure Virtual Networks can be secured use Network Security Groups, user-defined routes, or Network Virtual Appliances such as firewalls. You may use one or more of these when securing a network. If you plan on using HDInsight in a secured virtual network, you must perform the following actions:

* Allow unrestricted inbound and outbound access to the IP addresses of the Azure management services. For a list of IP addresses, see the [Required IP addresses](#hdinsight-ip) section.


###<a id="hdinsight-ip"></a> Required IP addresses

The HDInsight service is a managed service, and requires access to Azure management services during provisioning and while running. Azure management performs the following services:

* Monitor the health of the cluster
* Initiate failover of cluster resources
* Change the number of nodes in the cluster through scaling operations
* Other management tasks

> [!NOTE]
> These operations do not require full access to the internet. When restricting internet access, allow inbound access on port 443 for the following IP addresses. This allows Azure to manage HDInsight:

If you restrict access to the virtual network you must allow access to the managment IP addresses. The IP addresses that should be allowed are specific to the region that the HDInsight cluster and Virtual Network reside in. Use the following table to find the IP addresses for the region you are using.

| Country | Region | Allowed IP addresses | Allowed port |
| ---- | ---- | ---- | ---- |
| Brazil | Brazil South | 191.235.84.104</br>191.235.87.113 | 443 |
| Canada | Canada East | 52.229.127.96</br>52.229.123.172 | 443 |
| &nbsp; | Canada Central | 52.228.37.66</br>52.228.45.222 | 443 |
| Germany | Germany Central | 51.4.146.68</br>51.4.146.80 | 443 |
| &nbsp; | Germany Northeast | 51.5.150.132</br>51.5.144.101 | 443 |
| India | Central India | 52.172.153.209</br>52.172.152.49 | 443 |
| Japan | Japan East | 13.78.125.90</br>13.78.89.60 | 443 |
| &nbsp; | Japan West | 40.74.125.69</br>138.91.29.150 | 443 |
| United Kingdom | UK West | 51.141.13.110</br>51.141.7.20 | 443 |
| &nbsp; | UK South | 51.140.47.39</br>51.140.52.16 | 443 |
| United States | West Central US | 52.161.23.15</br>52.161.10.167 | 443 |
| &nbsp; | West US 2 | 52.175.211.210</br>52.175.222.222 | 443 |

__If your region is not listed in the table__, allow traffic to port __443__ on the following IP addresses:

* 168.61.49.99
* 23.99.5.239
* 168.61.48.131
* 138.91.141.162

> [!IMPORTANT]
> HDInsight doesn't support restricting outbound traffic, only inbound traffic. When defining Network Security Group rules for the subnet that contains HDInsight, __only use inbound rules__.

> [!NOTE]
> If you use a custom DNS server with your virtual network, you must also allow access from __168.63.129.16__. This is the address of Azure's recursive resolver. For more information, see the [Name resolution for VMs and Role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) document.

### Network security groups

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
```