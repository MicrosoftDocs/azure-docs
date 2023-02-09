---
title: Learn how to connect Apache Kafka cluster with VM in different VNet on Azure HDInsight.
description: Learn how to do Apache Kafka operations using a Apache Kafka REST proxy on Azure HDInsight.
ms.service: hdinsight
ms.topic: how-to
ms.date: 02/15/2023


# How to connect Kafka cluster with VM in different VNet

Learn how to connect Kafka cluster with VM in different VNet

This Document lists steps that must be followed to set up connectivity between VM and HDI Kafka residing in two different VNet. 

|Steps|Referance Document|
|---|---|
|1. Create two different VNETs where HDI Kafka cluster and VM will be hosted respectively.| [Create a virtual network using the Azure portal](https://learn.microsoft.com/azure/virtual-network/quick-create-portal)| | 
|2. Note that these two  VNETs must be peered, so that IP addresses of their subnets must not overlap with each other.| [Create a virtual network using the Azure portal](https://learn.microsoft.com/azure/virtual-network/quick-create-portal)|
|3. After the above steps are completed, we can create HDInsight Kafka cluster in one VNet. This is like how HDInsight clusters are created in portal with the VNet option.|[Create an Apache Kafka cluster](/azure/hdinsight/kafka/apache-kafka-get-started.md#create-an-apache-kafka-cluster)|
