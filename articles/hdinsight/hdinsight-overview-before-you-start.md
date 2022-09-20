---
title: Before you start with Azure HDInsight
description: In Azure HDInsight, few points to be considered before starting to create a cluster.
ms.service: hdinsight
ms.topic: overview
ms.date: 09/20/2022
---

# Before you start

The following points should be considered before starting to create a cluster.

1. Bring your own database

By default, HDInsight creates a default database during creation. Databases cant' be changed after the cluster is created.

We recommend using custom databases for Ambari, Hive, and Ranger. 

To learn more on how to [Set up HDInsight clusters with a custom Ambari DB](/azure/hdinsight/hdinsight-custom-ambari-db.md) and [Use external metadata stores in Azure HDInsight](/azure/hdinsight/hdinsight-use-external-metadata-stores.md)
          
2. Keep your clusters up to date

To take advantage of the latest HDInsight features, we recommend regularly migrating your HDInsight clusters to the latest version. HDInsight doesn't support in-place upgrades where existing clusters are upgraded to new component versions. You need to create a new cluster with the desired components and platform version and migrate your application to use the new cluster.

We recommend updating each version (updates every 30-45 days). The recommended period is less than six months.

To learn more on how to [Set up HDInsight clusters with a custom Ambari DB](/azure/hdinsight/hdinsight-custom-ambari-db) and [Migrate HDInsight cluster to a newer version](/azure/hdinsight/hdinsight-upgrade-cluster)

## Next steps

* [Create Apache Hadoop cluster in HDInsight](./hadoop/apache-hadoop-linux-create-cluster-get-started-portal.md)
* [Create Apache Spark cluster - Portal](./spark/apache-spark-jupyter-spark-sql-use-portal.md)
* [Enterprise security in Azure HDInsight](./domain-joined/hdinsight-security-overview.md)
