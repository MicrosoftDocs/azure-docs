---
title: What is Azure HDInsight on AKS? (Preview)
description: An introduction to Azure HDInsight on AKS.
ms.custom: references_regions
ms.service: hdinsight-aks
ms.topic: overview
ms.date: 08/29/2023
---

# What is HDInsight on AKS? (Preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]
 
HDInsight on AKS is a modern, reliable, secure, and fully managed Platform as a Service (PaaS) that runs on Azure Kubernetes Service (AKS). HDInsight on AKS allows you to deploy popular Open-Source Analytics workloads like Apache Spark™, Apache Flink®️, and Trino without the overhead of managing and monitoring containers.

You can build end-to-end, petabyte-scale Big Data applications spanning streaming through Apache Flink, data engineering and machine learning using Apache Spark, and Trino's powerful query engine.

All these capabilities combined with HDInsight on AKS’s strong developer focus enables enterprises and digital natives with deep technical expertise to build and operate applications that are right fit for their needs. HDInsight on AKS allows developers to access all the rich configurations provided by open-source software and the extensibility to seamlessly include other ecosystem offerings. This offering empowers developers to test and tune their applications to extract the best performance at optimal cost.

HDInsight on AKS integrates with the entire Azure ecosystem, shortening implementation cycles and improving time to realize value.
 
:::image type="content" source="./media/overview/hdinsight-on-aks-advantages.png" alt-text="Diagram showing the HDInsight on AKS advantages." border="true" lightbox="./media/overview/hdinsight-on-aks-advantages.png":::
 
 ## Technical architecture

 HDInsight on AKS introduces the concept of cluster pools and clusters, which allow you to realize the complete value of data lakehouse. Cluster pools allow you to use multiple compute workloads on a single data lake, thereby removing the overhead of network management and resource planning. 
 
* **Cluster pools** are a logical grouping of clusters that help build robust interoperability across multiple cluster types and allow enterprises to have the clusters in the same virtual network. Cluster pools provide rapid and cost-effective access to all the cluster types created on-demand and at scale. One cluster pool corresponds to one cluster in AKS infrastructure. 
* **Clusters** are individual compute workloads, such as Apache Spark, Apache Flink, and Trino that can be created rapidly in few minutes with preset configurations.

You can create the pool with a single cluster or a combination of cluster types, which are based on the need and can custom configure the following options:

* Storage 
* Network
* Logging
* Monitoring

The following diagram shows the logical technical architecture of components installed in a default cluster pool. The clusters are isolated using [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) in AKS clusters.

:::image type="content" source="./media/overview/hdinsight-on-aks-technical-architecture.png" alt-text="Diagram showing the HDInsight on AKS architecture." border="true" lightbox="./media/overview/hdinsight-on-aks-technical-architecture.png":::

## Modernized cloud-native compute platform

The latest version of HDInsight is orchestrated using AKS, which enables the platform to be more robust and empowers the users to handle the clusters effectively. Provisioning of clusters on HDInsight on AKS is fast and reliable, making it easy to manage clusters and perform in-place upgrades. With vast SKU choices and flexible subscription models, modernizing data lakehouses using open-source, cloud-native, and scalable infrastructure on HDInsight on AKS can meet all your analytics needs.
  
:::image type="content" source="./media/overview/modernized-on-cloud-native-platform.png" alt-text="Diagram showing the HDInsight on AKS how it's modernized on cloud native compute platform.":::
 
**Key features include:**
* Fast cluster creation and scaling.
* Ease of maintenance and periodic security updates.
* Cluster resiliency powered by modern cloud-native AKS.
* Native support for modern auth with OAuth, and Microsoft Entra ID.
* Deep integration with Azure Services – Azure Data Factory (ADF), Power BI, Azure Monitor.

## Connectivity to HDInsight 

HDInsight on AKS can connect seamlessly with HDInsight. You can reap the benefits of using needed cluster types in a hybrid model. Interoperate with cluster types of HDInsight using the same storage and metastore across both the offerings. 

[HDInsight](/azure/hdinsight/) offers Apache Kafka®, Apache HBase® and other analytics workloads in Platform as a Service (PaaS) formfactor.

:::image type="content" source="./media/overview/connectivity-diagram.png" alt-text="Diagram showing connectivity concepts.":::

**The following scenarios are supported:**

* [Apache Flink connecting to Apache HBase](./flink/use-flink-to-sink-kafka-message-into-hbase.md)
* [Apache Flink connecting to Apache Kafka](./flink/join-stream-kafka-table-filesystem.md)
* Apache Spark connecting to Apache HBase
* Apache Spark connecting to Apache Kafka

## Security architecture

HDInsight on AKS is secure by default. It enables enterprises to protect enterprise data assets with Azure Virtual Network, encryption, and integration with Microsoft Entra ID. It also meets the most popular industry and government compliance standards upholding the Azure standards. With over 30 certifications that help protect data along with periodic updates, health advisor notifications, service health analytics, along with best-in-class Azure security standards. HDInsight on AKS offers several methods to address your enterprise security needs by default.
For more information, see [HDInsight on AKS security](./concept-security.md).

:::image type="content" source="./media/overview/security-concept.png" alt-text="Diagram showing the security concept.":::
 
## Region availability (public preview)

* West Europe
* Central India
* UK South
* Korea Central
* East US 2
* West US 2
* West US 3
* East US

> [!Note]
> - The Trino brand and trademarks are owned and managed by the [Trino Software Foundation](https://trino.io/foundation.html). No endorsement by The Trino Software Foundation is implied by the use of these marks.
> - Apache Spark, Spark and the Spark logo are trademarks of the [Apache Software Foundation](https://www.apache.org/) (ASF).
> - Apache, Apache Kafka, Kafka and the Kafka logo are trademarks of the [Apache Software Foundation](https://www.apache.org/) (ASF).
> - Apache, Apache Flink, Flink and the Flink logo are trademarks of the [Apache Software Foundation](https://www.apache.org/) (ASF).
> - Apache HBase, HBase and the HBase logo are trademarks of the [Apache Software Foundation](https://www.apache.org/) (ASF).
> - Apache®, Apache Spark™, Apache HBase®, Apache Kafka®, and Apache Flink® are either registered trademarks or trademarks of the [Apache Software Foundation](https://www.apache.org/) in the United States and/or other countries. No endorsement by The Apache Software Foundation is implied by the use of these marks.


