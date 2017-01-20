---
title: Connect clients to Kafka on HDInsight using a VPN gateway | Microsoft Docs
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
ms.date: 01/18/2017
ms.author: larryfr

---

In this document, you will learn how to connect directly to Kafka on HDInsight by using an Azure Virtual Network configured for point-to-site communication. Point-to-site configuration creates a VPN gateway that clients can use to connect to the virtual network, and then communicate directly with the HDInsight cluster.

## Why

The primary scenarios where you need to directly communicate with Kafka on HDInsight are:

* Mirroring between two Kafka clusters

* Remote consumer or producers

## How it works

HDInsight clusters are implemented as several virtual machines inside a virtual network. If you don't specify a virtual network when creating HDInsight, it will create one automaticatlly. However this default virtual network is hidden and only allows communication to the cluster head nodes from the public internet.

By creating a standalone virtual network and specifying it when creating an HDInsight cluster, you can add a VPN gateway that allows remote clients to securely connect directly to HDInsight.

The following are several popular network configurations that you might use with HDInsight:

__Site-to-Site__

__Point-to-Site__

