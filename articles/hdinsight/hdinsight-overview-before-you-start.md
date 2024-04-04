---
title: Before you start with Azure HDInsight
description: In Azure HDInsight, few points to be considered before starting to create a cluster.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/16/2023
---

# Consider the below points before starting to create a cluster.

As part of the best practices, consider the following points before starting to create a cluster.

## Bring your own database

HDInsight have two options to configure the databases in the clusters.

1. Bring your own database (external)
1. Default database (internal)
 
During cluster creation, default configuration uses internal database. Once the cluster is created, customer can’t change the database type.  Hence, it's recommended to create and use the external database. You can create custom databases for Ambari, Hive, and Ranger.

For more information, see how to [Set up HDInsight clusters with a custom Ambari DB](./hdinsight-custom-ambari-db.md)
          
## Keep your clusters up to date

To take advantage of the latest HDInsight features, we recommend regularly migrating your HDInsight clusters to the latest version. HDInsight doesn't support in-place upgrades where existing clusters are upgraded to new component versions. You need to create a new cluster with the desired components and platform version and migrate your application to use the new cluster.

As part of the best practices, we recommend you keep your clusters updated on regular basis.

HDInsight release happens every 30 to 60 days. It's always good to move to the latest release as early possible. The recommended maximum duration for cluster upgrades is less than six months.

For more information, see how to [Migrate HDInsight cluster to a newer version](./hdinsight-upgrade-cluster.md).

## Integrating Third-party applications

Microsoft will only support machines that are created by the HDInsight service (for example, HDInsight clusters, edge nodes, and worker nodes). We don't support third-party client machines or moving the HDInsight libraries from a supported machine to an external machine. 

While this third-party integration may work for some time, it is not recommended in production environments because the scenario isn't supported. 

When you open a support request for an unsupported scenario, you'll be asked to ***reproduce the problem in a supported scenario*** so we can investigate. Any fixes provided would be for the supported scenario only. 

### Supported ways to integrate third party applications

* [Install HDInsight applications](hdinsight-apps-install-applications.md): Learn how to install an HDInsight application to your clusters.
* [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an unpublished HDInsight application to HDInsight.
* [Publish HDInsight applications](hdinsight-apps-publish-applications.md): Learn how to publish your custom HDInsight applications to Azure Marketplace.

## Next steps

* [Create Apache Hadoop cluster in HDInsight](./hadoop/apache-hadoop-linux-create-cluster-get-started-portal.md)
* [Create Apache Spark cluster - Portal](./spark/apache-spark-jupyter-spark-sql-use-portal.md)
* [Enterprise security in Azure HDInsight](./domain-joined/hdinsight-security-overview.md)
