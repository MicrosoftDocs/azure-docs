---
title: Kafka 2.4.1 validation error in Azure Resource Manager templates
description: Kafka 2.4.1 validation error in ARM templates Known Issue
ms.service: hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 03/26/2024
---

# Kafka 2.4.1 validation error in ARM templates

**Issue published date**: October 13, 2023

When you're submitting cluster creation requests by using Azure Resource Manager templates (ARM templates), runbooks, PowerShell, the Azure CLI, and other automation tools, you might receive a "BadRequest" error message if you specify `clusterType = "Kafka"`, `HDI version = "5.0"`, and `Kafka version = "2.4.1"`.

## Troubleshooting steps

When you're using [templates or automation tools](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods) to create HDInsight Kafka clusters, choose `componentVersion = "2.4"`. This value enables you to successfully create a Kafka 2.4.1 cluster in HDInsight 5.0.

## Resources

- [Create HDInsight clusters by using automation](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)
- [HDInsight Kafka cluster](/azure/hdinsight/kafka/apache-kafka-introduction)
