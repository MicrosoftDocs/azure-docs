---
title: Secure Spark and Kafka – Spark streaming integration scenario - Azure HDInsight
description: Learn how to secure Spark and Kafka streaming integration.
ms.service: hdinsight
ms.topic: how-to
ms.date: 10/20/2022
---

# Secure Spark and Kafka – Spark streaming integration scenario

Learn how to execute a Spark job in a secure Spark cluster that reads from a topic in secure Kafka cluster, provided the virtual networks are same/peered.

**Pre-requisites**

1. Create a secure Kafka cluster and secure spark cluster with the same AADDS domain and same vnet. If you prefer not to create both clusters in the same vnet, you can create them in two separate vnets and pair the vnets also. If you prefer not to create both clusters in the same vnet.
1. If your clusters are in different vnets, see here [Connect virtual networks with virtual network peering using the Azure portal](/azure/virtual-network/tutorial-connect-virtual-networks-portal)
1. Create key tabs for two users.  For example, `alicetest` and `bobadmin`. 
