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

Learn how to connect directly to Kafka on HDInsight by using an Azure Virtual Network configured for point-to-site communication. Point-to-site configuration provides a VPN gateway that clients can use to connect to the virtual network and communicate directly with the HDInsight cluster.

## Why use VPN

The primary scenarios where you need to directly communicate with Kafka on HDInsight are:

* __Mirroring between two Kafka clusters__. For example, you may want to mirror Kafka topics between an on-premises Kafka cluster and Kafka on HDInsight.

* __Remote consumer or producers__. For example, you may have on-premises applications that need to directly read or write to Kafka on HDInsight.

## How it works

[TBD diagram]

HDInsight is secured inside an Azure Virtual Network. If you create an HDInsight cluster and do not specify a virtual network, one is automatically created. However, this auto-created virtual network is hidden and cannot be modified.

To use VPN to connect to HDInsight, you must instead create the virtual network first. Then specify the virtual network when creating the HDInsight cluster. This gives you full control over the virtual network, including the ability to configure a VPN gateway.

The following list describes the configuration and behavior of the examples in this document:

* __VPN client__: The VPN gateway created in Azure only provides a downloadable VPN client for Windows. See the following links for VPN clients that may work with Linux or OS X clients.

    * [TBD]

* __Client IP addresses__: The VPN gateway uses an IP address pool of 172.16.201.0/24 when assigning IP addresses to clients.

* __Kafka cluster IP addresses__: The IP address used by nodes in the Kafka cluster are not pre-determined; you must retrieve a list of the IP addresses 

## Requirements

* An Azure subscription

* MakeCert (Windows-only) or OpenSSL

## Create certificates

The VPN gateway uses certificates to secure access to the virtual network. The steps in this section demonstrate how self-signed certificates for use with VPN.

### Using OpenSSL

[tbd]

### Using MakeCert

Follow the steps in [How to work with self-signed certificates for Point-to-Site connections](../vpn-gateway/vpn-gateway-certificates-point-to-site.md) to create the certificates needed for the VPN gateway. At the end of the process, you will have three files:

* An exported public key for the __root certificate__. This file has a `.cer` extension. If you open this file in a text editor, the contents are similar to the following:

        blah

* An exported __client certificate__. This file has a `.pfx` extension.

## Create the Virtual Network

## Create the VPN gateway

## Create the Kafka cluster



## Example resource manager template

You can find an example Azure resource manager template that creates a virtual network, VPN gateway (Point-to-site), and Kafka cluster, at [TBD]. 

> [!NOTE]
> The VPN gateway created through this template only provides a downloadable VPN client for Windows.

The following list describes behaviors and limitations of 
The VPN gateway created by this template uses an IP address pool of 172.16.201.0/24 to assign IPs to clients.
