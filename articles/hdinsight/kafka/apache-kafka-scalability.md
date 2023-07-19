---
title: Apache Kafka increase scale - Azure HDInsight 
description: Learn how to configure managed disks for Apache Kafka cluster on Azure HDInsight to increase scalability.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 05/11/2023
---

# Configure storage and scalability for Apache Kafka on HDInsight

Learn how to configure the number of managed disks used by [Apache Kafka](https://kafka.apache.org/) on HDInsight.

Kafka on HDInsight uses the local disk of the virtual machines in the HDInsight cluster. Since Kafka is very I/O heavy, [Azure Managed Disks](../../virtual-machines/managed-disks-overview.md) is used to provide high throughput and provide more storage per node. If traditional virtual hard drives (VHD) were used for Kafka, each node is limited to 1 TB. With managed disks, you can use multiple disks to achieve 16 TB for each node in the cluster.

The following diagram provides a comparison between Kafka on HDInsight before managed disks, and Kafka on HDInsight with managed disks:

:::image type="content" source="./media/apache-kafka-scalability/kafka-with-managed-disks-architecture.png" alt-text="kafka with managed disks architecture" border="false":::

## Configure managed disks: Azure portal

1. Follow the steps in the [Create an HDInsight cluster](../hdinsight-hadoop-create-linux-clusters-portal.md) to understand the common steps to create a cluster using the portal. Don't complete the portal creation process.

2. From the **Configuration & Pricing** section, use the __Number of Nodes__ field to configure the number of disks.

    > [!NOTE]  
    > The type of managed disk can be either __Standard__ (HDD) or __Premium__ (SSD). Premium disks are used with DS and GS series VMs. All other VM types use standard.

    :::image type="content" source="./media/apache-kafka-scalability/azure-portal-cluster-configuration-pricing-kafka-disks.png" alt-text="cluster size section with the disks per worker node highlighted" border="true":::

## Configure managed disks: Resource Manager template

To control the number of disks used by the worker nodes in a Kafka cluster, use the following section of the template:

```json
"dataDisksGroups": [
    {
        "disksPerNode": "[variables('disksPerWorkerNode')]"
    }
    ],
```

## Next steps

For more information on working with Apache Kafka on HDInsight, see the following documents:

* [Use MirrorMaker to create a replica of Apache Kafka on HDInsight](apache-kafka-mirroring.md)
* [Use Apache Spark with Apache Kafka on HDInsight](../hdinsight-apache-spark-with-kafka.md)
* [Connect to Apache Kafka through an Azure Virtual Network](apache-kafka-connect-vpn-gateway.md)

* [HDInsight blog on managed disks with Apache Kafka](https://azure.microsoft.com/blog/announcing-public-preview-of-apache-kafka-on-hdinsight-with-azure-managed-disks/)
