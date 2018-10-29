---
title: Migrate on-premises Apache Hadoop clusters to Azure HDInsight - motivation and benefits
description: Learn the motivation and benefits for migrating on-premises Hadoop clusters to Azure HDInsight.
services: hdinsight
author: hrasheed-msft
ms.reviewer: ashishth
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: hrasheed
---
# Migrate on-premises Apache Hadoop clusters to Azure HDInsight - motivation and benefits

This article is the first in a series on best-practices for migrating on-premises Apache Hadoop eco-system deployments to Azure HDInsight. This series of articles is for people who are responsible for the design, deployment, and migration of Apache Hadoop solutions in Azure HDInsight. The roles that may benefit from these articles include cloud architects, Hadoop administrators, and DevOps engineers. Software developers, data engineers, and data scientists should also benefit from the explanation of how different types of clusters work in the cloud.

## Why to migrate to Azure HDInsight

Azure HDInsight is a cloud distribution of the Hadoop components from the [Hortonworks Data Platform(HDP)](https://hortonworks.com/products/data-center/hdp/). Azure HDInsight makes it easy, fast, and cost-effective to process massive amounts of data. HDInsight includes the most popular open-source frameworks such as:

- Apache Hadoop
- Apache Spark
- Apache Hive with LLAP
- Apache Kafka
- Apache Storm
- Apache HBase
- R

## Advantages that Azure HDInsight offers over on-premises Hadoop

- **Low cost** - Costs can be reduced by [creating clusters on demand](../hdinsight-hadoop-create-linux-clusters-adf.md) and paying only for what you use. Decoupled compute and storage provides flexibility by keeping the data volume independent of the cluster size.
- **Automated cluster creation** - Automated cluster creation requires minimal setup and configuration. Automation can be used for on-demand clusters.
- **Managed hardware and configuration** - There's no need to worry about the physical hardware or infrastructure with an HDInsight cluster. Just specify the configuration of the cluster, and Azure sets it up.
- **Easily scalable** - HDInsight enables you to [scale](../hdinsight-administer-use-portal-linux.md) workloads up or down. Azure takes care of data redistribution and workload rebalancing without interrupting data processing jobs.
- **Global availability** -  HDInsight is available in more [regions](https://azure.microsoft.com/regions/services/) than any other big data analytics offering. Azure HDInsight is also available in Azure Government, China, and Germany, which allows you to meet your enterprise needs in key sovereign areas.
- **Secure and compliant** - HDInsight enables you to protect your enterprise data assets with [Azure Virtual Network](../hdinsight-extend-hadoop-virtual-network.md), [encryption](../hdinsight-hadoop-create-linux-clusters-with-secure-transfer-storage.md), and integration with [Azure Active Directory](../domain-joined/apache-domain-joined-introduction.md). HDInsight also meets the most popular industry and government [compliance standards](https://azure.microsoft.com/overview/trusted-cloud).
- **Simplified version management** - Azure HDInsight manages the version of Hadoop eco-system components and keeps them up-to-date. Software updates are usually a complex process for on-premises deployments.
- **Smaller clusters optimized for specific workloads with fewer dependencies between components** -  A typical on-premises Hadoop setup uses a single cluster that serves many purposes. With Azure HDInsight, workload-specific clusters can be created. Creating clusters for specific workloads removes the complexity of maintaining a single cluster with growing complexity.
- **Productivity** - You can use various tools for Hadoop and Spark in your preferred development environment.
- **Extensibility with custom tools or third-party applications** - HDInsight clusters can be extended with installed components and can also be integrated with the other big data solutions by using [one-click](https://azure.microsoft.com/services/hdinsight/partner-ecosystem/) deployments from the Azure Market place.
- **Easy management, administration, and monitoring** - Azure HDInsight integrates with [Azure Log Analytics](../hdinsight-hadoop-oms-log-analytics-tutorial.md) to provide a single interface with which you can monitor all your clusters.
- **Integration with other Azure services** - HDInsight can easily be integrated with other popular Azure services such as the following:

    - Azure Data Factory (ADF)
    - Azure Blob Storage
    - Azure Data Lake Storage Gen2
    - Azure Cosmos DB
    - Azure SQL Database
    - Azure Analysis Services

- **Self-healing processes and components** - HDInsight constantly checks the infrastructure and open-source components using its own monitoring infrastructure. It also automatically recovers critical failures such as unavailability of open-source components and nodes. Alerts are triggered in Ambari if any OSS component is failed.

For more information, see the article [What is Azure HDInsight and the Hadoop technology stack](../hadoop/apache-hadoop-introduction.md).

## Migration planning process

The following steps are recommended for planning a migration of on-premises Hadoop clusters to Azure HDInsight:

1. Understand the current on-premises deployment and topologies.
2. Understand the current project scope, timelines, and team expertise.
3. Understand the Azure requirements.
4. Build out a detailed plan based on best practices.

## Next steps

Read the next article in this series:

- [Architecture best practices for on-premises to Azure HDInsight Hadoop migration](apache-hadoop-on-premises-migration-best-practices-architecture.md)