---
title: Enterprise Security Package for Azure HDInsight
description: Learn the Enterprise Security Package components and versions in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 09/19/2023
---

# Enterprise Security Package for Azure HDInsight

Enterprise Security is an optional package that you can add on your HDInsight cluster as part of create cluster workflow. The Enterprise Security Package supports:

* Integration with Active Directory for authentication.

    In the past, you created HDInsight clusters with local admin user and local SSH user. The local admin user can access all the files, folders, tables, and columns.  With  Enterprise Security Package, you enable Azure role-based access control by integrating HDInsight with your Azure Active Directory Domain Services.

    For more information, see:

    * [An introduction to Apache Hadoop security with domain-joined HDInsight clusters](./domain-joined/hdinsight-security-overview.md)

    * [Plan Azure domain-joined Apache Hadoop clusters in HDInsight](./domain-joined/apache-domain-joined-architecture.md)

    * [Configure domain-joined sandbox environment](./domain-joined/apache-domain-joined-configure-using-azure-adds.md)

    * [Configure Domain-joined HDInsight clusters using Azure Active Directory Domain Services](./domain-joined/apache-domain-joined-configure-using-azure-adds.md)

* Authorization for data

  * Integration with Apache Ranger for authorization for Hive, Spark SQL, and Yarn Queues.
  * You can set access control on files and folders.

    For more information, see [Configure Apache Hive policies in Domain-joined HDInsight](./domain-joined/apache-domain-joined-run-hive.md)

* View the audit logs to monitor accesses and the configured policies.

## Supported cluster types

Currently, only the following cluster types support the Enterprise Security Package:

* Hadoop
* Spark
* Kafka
* HBase
* Interactive Query

## Support for Azure Data Lake Storage

The Enterprise Security Package supports using Azure Data Lake Storage as both the primary storage and the add-on storage.

## Pricing and service level agreement (SLA)

For information on pricing and SLA for the Enterprise Security Package, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Next steps

* [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
* [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
* [Azure HDInsight release notes](./hdinsight-release-notes.md)
* [Apache components on HDInsight](./hdinsight-component-versioning.md)
