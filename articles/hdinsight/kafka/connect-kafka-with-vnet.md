---
title: Connect HDInsight Kafka cluster with client VM in different VNet on Azure HDInsight
description: Learn how to connect HDInsight Kafka cluster with Client VM in different VNet on Azure HDInsight
ms.service: hdinsight
ms.topic: tutorial
ms.date: 10/08/2023
---

# Connect HDInsight Kafka cluster with client VM in different VNet

This article describes the steps to set up the connectivity between a virtual machine (VM) and HDInsight Kafka cluster residing in two different virtual networks (VNet).

## Connect HDInsight Kafka cluster with client VM in different VNet

1. Create two different virtual networks where HDInsight Kafka cluster and VM are hosted respectively. For more information, see [Create a virtual network using Azure portal](/azure/virtual-network/quick-create-portal).

1. Peer these two virtual networks, so that IP addresses of their subnets must not overlap with each other. For more information, see [Connect virtual networks with virtual network peering using the Azure portal](/azure/virtual-network/tutorial-connect-virtual-networks-portal).
