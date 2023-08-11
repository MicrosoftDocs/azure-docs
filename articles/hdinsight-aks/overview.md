---
title: What is Azire HDInsight on AKS?
description: An introduction to Azure HDInsight on AKS.
ms.custom: references_regions
ms.service: hdinsight-aks
ms.topic: overview
ms.date: 08/11/2023
---

# What is HDInsight on AKS?
 
HDInsight on AKS is a modern, reliable, secure, and fully managed Platform as a Service (PaaS), which runs on Azure Kubernetes Service (AKS). HDInsight on AKS allows you to deploy popular Open-Source Analytics workloads like Apache Spark, Apache Flink and Trino without the overhead of managing and monitoring containers. 
You can build end-to-end petabyte scale Big Data applications spanning Streaming through Apache Flink, Data Engineering & Machine Learning using Apache Spark and powerful query engine of Trino.

All these capabilities combined with HDInsight on AKS’s strong developer focus enables enterprises and digital natives with deep technical expertise to build and operate applications that are right fit for their needs. HDInsight on AKS allows developers to access all the rich configurations provided by Open-Source software and the extensibility to seamlessly include other ecosystem offerings. This offering empowers developers to test and tune their applications to extract the best performance at optimal cost. 

HDInsight on AKS integrates seamlessly with the entire Azure ecosystem shortening implementation cycles and improving time to realize value.
 
:::image type="content" source="./media/overview/hdinsight-on-aks-advantages.png" alt-text="Diagram showing the HDInsight on AKS advantages." border="true" lightbox="./media/overview/hdinsight-on-aks-advantages.png":::
 
 ## Technical architecture

 HDInsight on AKS introduces the concept of Cluster Pools and Clusters, which allow you to realize the complete value of data lakehouse. Cluster pools allow you to use multiple compute workloads on a single data lake, thereby removing the overhead of network management and resource planning. 
 
* **Cluster pools** are a logical grouping of clusters, which helps in building robust interoperability across multiple cluster types and allow enterprises to have the clusters in the same virtual network. Cluster pools provide rapid and cost-effective access to all the cluster types created on-demand and at scale. 
<br>One cluster pool corresponds to one cluster in AKS infrastructure. 
* **Clusters** are individual compute workloads, such as Apache Spark, Apache Flink, and Trino, which can be created rapidly in few minutes with preset configurations and few clicks.

You can create the pool with a single cluster or a combination of cluster types, which are based on the need and can custom configure the following options:

* Storage 
* Network
* Logging
* Monitoring

The following diagram shows the logical technical architecture of components installed in a default cluster pool. The clusters are isolated using [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) in AKS cluster.
 
:::image type="content" source="./media/overview/hdinsight-on-aks-technical-architecture.png" alt-text="Diagram showing the HDInsight on AKS architecture." border="true" lightbox="./media/overview/hdinsight-on-aks-technical-architecture.png":::
 
## Modernized cloud-native compute platform

The latest version of HDInsight is orchestrated using AKS, which enables the platform to be more robust and empowers the users to handle the clusters effectively. Provisioning of clusters on HDInsight on AKS is fast and reliable, making it easy to manage clusters and perform in-place upgrades. With vast SKU choices and flexible subscription models, modernizing data lakehouses using open-source, cloud-native, and scalable infrastructure on HDInsight on AKS can meet all your analytics needs.
  
:::image type="content" source="./media/overview/modernized-on-cloud-native-platform.png" alt-text="Diagram showing the HDInsight on AKS how it's modernized on cloud native compute platform.":::
 
**Key features include:**
* Fast cluster creation and scaling.
* Ease of maintenance and periodic security updates.
* Cluster resiliency powered by modern cloud-native AKS.
* Native support for modern auth with OAuth, and Azure Active Directory (Microsoft Entra ID).
* Deep integration with Azure Services – Azure Data Factory (ADF), Power BI, Azure Monitor.

## Connectivity to HDInsight 

HDInsight on AKS version can connect seamlessly with HDInsight. You can reap the benefits of using needed cluster types in a hybrid model that is, interoperate with cluster types of HDInsight using the same storage and metastore across both the offerings. 

:::image type="content" source="./media/overview/connectivity-diagram.png" alt-text="Diagram showing connectivity concepts.":::

**The following scenarios are supported.**

* [Flink connecting to HBase](./flink/use-flink-to-sink-kafka-message-into-hbase.md)
* [Flink connecting to Kafka](./flink/join-stream-from-kafka-with-table-from-filesystem.md)
* Spark connecting to HBase
* Spark connecting to Kafka

## Security architecture

HDInsight on AKS is secure by default. It enables enterprises to protect enterprise data assets with Azure Virtual Network, encryption, and integration with Azure Active Directory (Microsoft Entra ID). It also meets the most popular industry and government compliance standards upholding the Azure standards. With over 30 certifications that help protect data along with periodic updates, health advisor notifications, service health analytics, along with best-in-class Azure security standards. HDInsight on AKS offers several methods to address your enterprise security needs by default.
For more information, see [HDInsight on AKS Security](./concept-security.md).

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
