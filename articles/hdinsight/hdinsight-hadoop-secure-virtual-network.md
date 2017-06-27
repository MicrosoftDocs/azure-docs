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

Learn how to use HDInsight with an [Azure Virtual Network](../virtual-network/virtual-networks-overview.md).

## Planning

The following are the questions that you must answer when planning to install HDInsight in a virtual network:

* Do you need to install HDInsight into an existing virtual network? Or are you creating a new network?

    If you are using an existing virtual network, you may need to modify the network configuration before you can install HDInsight.

* Do you want to join the virtual network containing HDInsight to another virtual network or your on-premises network?

    To easily work with resources accross networks, you may need to create a custom DNS and configure DNS forwarding.

* Do you want to restrict inbound or outbound traffic to HDInsight?

    HDInsight must have unrestricted communication with specific IP addresses in the Azure data center. There are also several ports that must be allowed through firewalls for client communication.

## Add HDInsight to an existing virtual network

1. Are you using a classic or Resource Manager deployment model for the virtual network?

    HDInsight 3.4 and greater requires a Resource Manager virtual network. Earlier versions of HDInsight required a classic virtual network, however these versions have been, or will soon be retired.

    If your existing network is a classic virtual network, then you must create a Resource Manager virtual network and then join the two. [Connecting classic VNets to new VNets](../vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md).

    Once joined, HDInsight installed in the Resource Manager network can interact with resources in the classic network.

2. Do you use forced tunneling with the virtual network? HDInsight does not support forced tunneling.

    [TBD - what to do here?]

3. Do you use network security groups, user-defined routes, or Virtual Network Appliances to restrict traffic into or out of the virtual network?

    As a managed service, HDInsight requires unrestricted access to several IP addresses in the Azure data center. To allow communication with these IP addresses, update any existing network security groups or user-defined routes.

    HDInsight also hosts multiple services, which use a variety of ports. Do not block traffic to these ports. For a list of ports to allow through virtual appliance firewalls, see the [Security](#security) section.

    To find your existing security configuration, use the following Azure PowerShell or Azure CLI commands:

    * Network security groups

        ```powershell
        get-azurermnetworksecuritygroup -resourcegroupname <groupname>
        ```

        ```bash
        az network nsg list --resource-group <groupname>
        ```

    * User-defined routes

        ```powershell
        get-azurermroutetable -resourcegroupname <groupname>
        ```

        ```bash
        az network route-table list --resource-group <groupname>
        ```

## Name resolution and custom DNS

Azure provides name resolution for Azure services that are installed in an Azure Virtual Network. This built-in name resolution allows HDInsight to connect to the following resources by using a fully qualified domain name (FQDN):

* Any resource that is publicly available on the internet. For example, microsoft.com, google.com.

* Any resource that is in the same Azure Virtual Network, by using the __internal DNS name__ of the resource. For example, when using the default name resolution, the following are example internal DNS names assigned to HDInsight worker nodes:

    * wn0-hdinsi.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net
    * wn2-hdinsi.0owcbllr5hze3hxdja3mqlrhhe.ex.internal.cloudapp.net

    Both these nodes can communicate directly with each other, and other nodes in HDInsight, by using internal DNS names.

The default name resolution does __not__ allow HDInsight to resolve the names of resources in networks that are joined to the virtual network. For example, it is common to join your on-premises network to the virtual network. With only the default name resolution, HDInsight cannot access resources in the on-premises network by name. The opposite is also true, resources in your on-premises network cannot access resources in the virtual network by name.

To enable name resolution between the virtual network and resources in joined networks, you must perform the following actions:

1. Create a custom DNS server in the Azure Virtual Network where you plan to install HDInsight.

2. Configure the virtual network to use the custom DNS server.

3. Configure forwarding between the DNS servers in the joined networks. For example, the DNS server in your on-premises network.

    > [!NOTE]
    > The process of configuring forwarding depends on the DNS server software that you use. For more information, see the documentation for your DNS server software.

For more information, see the [Name Resolution for VMs and Role Instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-using-your-own-dns-server) document.

> [!WARNING]
> You must create the custom DNS server and configure the virtual network to use it before creating the HDInsight cluster.

## Restricting network traffic

Azure Virtual Networks can be secured use network security groups, user-defined routes, or network virtual appliances. You may use one or more of these methods when securing a network.

* Network security groups allow you to filter inbound and outbound traffic by creating a set of rules that allow or deny traffic. For more information, see the [Filter network traffic with network security groups](../virtual-network/virtual-networks-nsg.md) document.

* User-defined routes define how traffic flows between resources in the network. For more information, see the [User-defined routes and IP forwarding](../virtual-network/virtual-networks-udr-overview.md) document.

* Network virtual appliances

* If you plan on using **network security groups** or **user-defined routes** to secure the network, perform the following actions before installing HDInsight:

    1. Identify the Azure region that you plan to use for HDInsight.

    2. Identify the IP addresses required by HDInsight. For a list of IP addresses by region, see the [Azure management IP addresses](#hdinsight-ip) section.

    3. Create or modify the network security groups for the virtual network to allow traffic on the IP addresses.

    For more information on network security groups or user-defined routes, see the following documentation:

    * [Network security group](../virtual-network/virtual-networks-nsg.md) documentation.

    * [User-defined routes](../virtual-network/virtual-networks-udr-overview.md)

* If you plan on using a network **virtual appliance firewall** to secure the virtual network, you must allow outbound traffic on the following ports:

    * 53
    * 443
    * 1433
    * 11000-11999
    * 14000-14999

For more information on firewall rules for virtual appliances, see the [virtual appliance scenario](../virtual-network/virtual-network-scenario-udr-gw-nva.md) document.

### <a id="hdinsight-ip"></a> Azure management IP addresses

If you use network security groups or user-defined routes to restrict access to the virtual network, then you must allow access to the Azure management IP addresses.

The HDInsight service is a managed service, and requires access to Azure management services during provisioning and while running. Azure management performs the following services:

* Monitor the health of the cluster
* Initiate failover of cluster resources
* Change the number of nodes in the cluster through scaling operations
* Other management tasks

> [!NOTE]
> These operations do not require full access to the internet.

The IP addresses that should be allowed are specific to the region that the HDInsight cluster and Virtual Network reside in. Use the following table to find the IP addresses for the region you are using.

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
> HDInsight doesn't support restricting outbound traffic, only inbound traffic. When defining network security group rules for the subnet that contains HDInsight, __only use inbound rules__.

> [!NOTE]
> If you use a custom DNS server with your virtual network, you must also allow access from __168.63.129.16__. This address is Azure's recursive resolver. For more information, see the [Name resolution for VMs and Role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) document.
