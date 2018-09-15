---
title: HDInsight 4.0 version overview - Azure
description: Compare HDInsight 3.6 to the new HDInsight 4.0 with new features, limitations, and upgrade recommendations.
ms.service: hdinsight
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.topic: overview
ms.date: 09/24/2018
---

# HDInsight 4.0 version overview

Azure HDInsight (HDI) 4.0 is a cloud distribution of the Hadoop components from the [Hortonworks Data Platform (HDP) 3.0](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/release-notes/content/relnotes.html). HDP 3.0 benefits from [Apache Hadoop 3.1](https://hadoop.apache.org/docs/r3.1.0/) which includes containerization for faster application deployment, cost-saving support for GPU resources, and scalability and availability with NameNode federation. As with any major release, it is important to thoroughly test your components before implementing the latest version in a production environment. HDI 4.0 is available for you to begin the upgrade process, but HDI 3.6 will remain the default option to prevent accidental mishaps. 

## What's new with HDInsight 4.0?

### Hive metastore

HiveServer now uses a remote Metastore database, which is configured in `hive-site.xml`.

Learn more about [Apache Hive 3](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/hive-overview/content/hive_whats_new_in_this_release_hive.html).

### Hive transactional tables data

HDI 4.0 includes Apache Hive 3, which requires ACID (atomicity, consistency, isolation, and durability) compliance for transactional tables residing in the Hive warehouse. ACID compliant tables, and the table data, are accessed and managed by Hive. Data in CRUD (create, retrieve, update, and delete) tables must be in Optimized Row Column (ORC) file format, but insert-only tables support all file formats.

Learn more about [Apache Hive 3](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/hive-overview/content/hive_whats_new_in_this_release_hive.html).

### Spark metastore

Hive uses the **hive** catalog, and Spark uses the **spark** catalog, which are created automatically in your HDI 4.0 cluster.

Learn more about [Apache Spark](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/spark-overview/content/analyzing_data_with_apache_spark.html).

### Ranger DB

Ranger is now included by default in HDI 4.0 and has the following improvements:

* Support for multiple NameNodes in a federated cluster
* Support for read-only Ranger admin users
* Time-bound and temporary authorization policies and policy conditions
* Auditing for Usersync operations
* Ability to label policies, filter/search and show policies by labels

Learn more about [Apache Ranger](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/security-overview/content/whats_new_in_this_release_ranger.html).

### Oozie DB

Apache Oozie 4.3.1 is included in HDI 4.0 with the following changes:

* Oozie can no longer run Hive actions. Hive CLI was removed due to security risk leaving HiveServer2 actions as the only option.

* You can exclude unwanted dependencies from share lib by including an exclude pattern in your **job.properties** file.

Learn more about [Apache Oozie](https://docs.hortonworks.com/HDPDocuments/HDP3/HDP-3.0.0/release-notes/content/patch_oozie.html).

## Limitations

* HDI 4.0 does not support OMS metrics on secure clusters.

## Next steps

* [Azure HDInsight Documentation](index.yml)
