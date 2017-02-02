---
title: Connect to Kafka on HDInsight using a VPN gateway - Azure | Microsoft Docs
description: Learn how to connect client systems directly to Apache Kafka on HDInsight by using a VPN. This connects the client systems directly to the Azure Virtual Network that the HDInsight cluster uses, which allows the client to directly communicate with Kafka and other services on HDInsight.
services: hdinsight
documentationCenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.devlang: ''
ms.topic: article
ms.tgt_pltfrm: 'na'
ms.workload: big-data
ms.date: 01/30/2017
ms.author: larryfr

---

# blah blah blah

Learn how to connect directly to Kafka on HDInsight by using an Azure Virtual Network configured for point-to-site communication. Point-to-site configuration provides a VPN gateway that clients can use to connect to the virtual network and communicate directly with the HDInsight cluster.

## Why use VPN

HDInsight only allows SSH and HTTPS connections over the internet. Kafka clients must connect directly to Zookeeper and the Kafka broker process, which is only available inside the virtual network that contains HDInsight.

> [!NOTE]
> Kafka applications that run directly on the cluster are already inside the virtual network.

The information in this document is primarily for the following scenarios:

* __Mirroring between two Kafka clusters__. For example, you may want to mirror Kafka topics between an on-premises Kafka cluster and Kafka on HDInsight.

* __Remote consumer or producers__. For example, you may have on-premises applications that need to directly read or write to Kafka on HDInsight.

## How it works

[TBD diagram]

HDInsight is secured inside an Azure Virtual Network. If you create an HDInsight cluster and do not specify a virtual network, one is automatically created. However, this auto-created virtual network is hidden and you cannot add a VPN gateway to it.

To use VPN to connect to HDInsight, you must instead create the virtual network first. Then specify the virtual network when creating the HDInsight cluster. This gives you full control over the virtual network, including the ability to configure a VPN gateway.

* __Virtual Network__: blah blah blah

* __VPN gateway__: The VPN gateway created by this template uses an IP address pool of 172.16.201.0/24 to assign IPs to clients, and uses certificate-based authentication.

* __VPN client__: The VPN gateway created in Azure only provides a downloadable VPN client for Windows. See the following links for VPN clients that may work with Linux or OS X clients.

    * [TBD]

## Domain name resolution

One of the limitations of Azure Virtual Networks is that the automatic domain name resolution provided by the virtual network only works for Azure resources. When connecting to the network using the VPN gateway, your client can only use IP addresses to connect to the HDInsight cluster.

While it is possible to create an Azure Virtual Machine to act as a custom DNS server for the virtual network, this is beyond the scope of this document. If you are familiar with configuring a DNS server, see [Manage DNS servers used by a virtual network](../virtual-network/virtual-networks-manage-dns-in-vnet.md) for more information on how to add the DNS server to your virtual network configuration.

> [!NOTE]
> HDInsight automatically uses the DNS server information from the virtual network configuration. There are no HDInsight specific steps to use a custom DNS server.

The information in this document is based on using only IP addresses to access HDInsight over the VPN gateway.

## Create the virtual network and VPN gateway

Follow the steps in the [Configure a Point-to-Site connection using the Azure portal](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md) document to create a new Azure Virtual Network and VPN gateway.

## Create the Kafka cluster

## Configure Kafka

By default, Kafka on HDInsight will return the domain name of the brokers to clients. Since the client cannot resolve domain names for the virtual network, use the following steps to configure Kafka to return IP addresses instead.

1. You need to append the kafka-env template in the Ambari Web UI with the following value. It essentially tells Kafka to use the ip address to register with Zookeeper. One has to switch to using advertised.listeners instead of advertised.host.name.
One can push data into Kafka brokers over vnet peering by using ip addresses
One can also push data into local brokers from the headnode using both ip-address and host name after making this change.
IP_ADDRESS=$(hostname -i)
echo advertised.listeners=$IP_ADDRESS
sed -i.bak -e '/advertised/{/advertised@/!d;}' /usr/hdp/current/kafka-broker/conf/server.properties
echo "advertised.listeners=PLAINTEXT://$IP_ADDRESS:9092" >> /usr/hdp/current/kafka-broker/conf/server.properties

Changing the value of *listeners* from PLAINTEXT://localhost:9092 to PLAINTEXT://0.0.0.0:9092 in Kafka Broker is OPTIONAL. It just tells Kafka to bind on all network interfaces.

## Additional information

For more information on creating an Azure Virtual Network with Point-to-Site VPN gateway, see the following documents:

* [Configure a Point-to-Site connection using the Azure portal](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md)

* [Configure a Point-to-Site connection using Azure PowerShell](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)

For more information on 
