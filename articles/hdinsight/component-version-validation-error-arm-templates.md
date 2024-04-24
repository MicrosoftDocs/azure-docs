---
title: Component version validation error in Azure Resource Manager templates
description: Component version validation error in ARM templates Known Issue
ms.service: hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 03/26/2024
---

# Component version validation error in ARM templates

**Issue published date**: October 13, 2023

When you're submitting cluster creation requests by using Azure Resource Manager templates (ARM templates), runbooks, PowerShell, the Azure CLI, and other automation tools, you might receive a "BadRequest" error message if you specify the full component version, for example: `clusterType = "Kafka"`, `HDI version = "5.0"`, and `Kafka version = "2.4.1"`.

## Troubleshooting steps

When you're using [templates or automation tools](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods) to create HDInsight clusters, choose one of the bellow versions (Major.minor) as `componentVersion`: 


| Cluster type| HDInsight 4.0 | HDInsight 5.0| HDInsight 5.1|
|---------------------|-------------------|-------------------|-------------------|
| Hadoop | 3.1 |- |3.3|
| Spark |2.4 |3.1|3.3|
| Kafka |2.1|2.4|3.2|
| Hbase | 2.1| -|2.4|
| InteractiveHive |3.1 |3.1|3.1|

This value enables you to successfully create HDInsight clusters. The below snippet shows how to add the component version in the template:

 `"clusterDefinition": {
                    "kind": "[parameters('clusterKind')]",
                    "componentVersion": {
                        "Hadoop": "3.1"
                    },`


> [!NOTE]
> Spark 2.4 has [reached EOL](https://azure.microsoft.com/updates/azure-hdinsight-spark-24-approaching-eol/) and is no longer under support by Microsoft. HDInsight versions 4.0 and 5.0 are under basic support. Migrate to [HDInsight 5.1](./hdinsight-5x-component-versioning.md) or [HDInsight on AKS](/azure/hdinsight-aks/) by 31 March 2025. 



## Resources

- [Create HDInsight clusters by using automation](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)
- [HDInsight Kafka cluster](/azure/hdinsight/kafka/apache-kafka-introduction)
