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

* __Kafka cluster IP addresses__: The IP address used by nodes in the Kafka cluster are not pre-determined; you must retrieve a list of the IP addresses.

## Examples (script & template)

You can find PowerShell, Azure CLI 2.0 (preview), and Azure template examples that create an Azure Virtual Network, VPN gateway, and Kafka on HDInsight cluster at [TBD].

## Using the Azure portal


### Create a virtual network and gateway

Follow the steps in the [Configure a Point-to-Site connection using the Azure portal](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md) document to create a new Azure Virtual Network and VPN gateway.

## Create the Kafka cluster

Once the Virtual Network has been created, use the following steps to install Kafka in the virtual network:

## Additional information

For more information on creating an Azure Virtual Network with Point-to-Site VPN gateway, see the following documents:

* [Configure a Point-to-Site connection using the Azure portal](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md)

* [Configure a Point-to-Site connection using Azure PowerShell](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)

For more information on 
