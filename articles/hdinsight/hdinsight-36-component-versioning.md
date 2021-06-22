---
title: Apache Hadoop components and versions - Azure HDInsight 3.6 
description: Learn about the Apache Hadoop components and versions in Azure HDInsight 3.6.
ms.service: hdinsight
ms.topic: conceptual
author: deshriva
ms.author: deshriva
ms.date: 02/08/2021
---

# HDInsight 3.6 component versions

In this article, you learn about the Apache Hadoop environment components and versions in Azure HDInsight 3.6.

## Support for HDInsight 3.6

Starting July 1st, 2021 Microsoft will offer Basic support for certain HDI 3.6 cluster types.
The table below lists the support timeframe for HDInsight 3.6 cluster types.

| Cluster Type                    | Framework version | Standard support expiration       | Basic support expiration date | Retirement date |
|---------------------------------|-------------------|-----------------------------------|------------------------------|-----------------|
| HDInsight 3.6 Hadoop            | 2.7.3             | June 30, 2021                     | April 3, 2022                | April 4, 2022 |
| HDInsight 3.6 Spark             | 2.3               | June 30, 2021                     | April 3, 2022                | April 4, 2022 |
| HDInsight 3.6 Kafka             | 1.1               | June 30, 2021                     | April 3, 2022                | April 4, 2022 |
| HDInsight 3.6 HBase             | 1.1               | June 30, 2021                     | April 3, 2022                | April 4, 2022 |
| HDInsight 3.6 Interactive Query | 2.1               | June 30, 2021                     | April 3, 2022                | April 4, 2022 |
| HDInsight 3.6 Storm             | 1.1               | June 30, 2021                     | April 3, 2022                | April 4, 2022 |
| HDInsight 3.6  ML Services      | 9.3               | -                                 | -                            | December 31, 2020 |
| HDInsight 3.6 Spark             | 2.2               | -                                 | -                            | June 30, 2020 |
| HDInsight 3.6 Spark             | 2.1               | -                                 | -                            | June 30, 2020 |
| HDInsight 3.6 Kafka             | 1.0               | -                                 | -                            | June 30, 2020 |

## Apache components available with HDInsight version 3.6

The OSS component versions associated with HDInsight 3.6 are listed in the following table.

| Component              | HDInsight 3.6 (default)     |
|------------------------|-----------------------------|
| Apache Hadoop and YARN | 2.7.3                       |
| Apache Tez             | 0.7.0                       |
| Apache Pig             | 0.16.0                      |
| Apache Hive            | (2.1.0 on ESP Interactive Query) |
| Apache Tez Hive2       | 0.8.4                       |
| Apache Ranger          | 0.7.0                       |
| Apache HBase           | 1.1.2                       |
| Apache Sqoop           | 1.4.6                       |
| Apache Oozie           | 4.2.0                       |
| Apache Zookeeper       | 3.4.6                       |
| Apache Storm           | 1.1.0                       |
| Apache Mahout          | 0.9.0+                      |
| Apache Phoenix         | 4.7.0                       |
| Apache Spark           | 2.3.2.                      |
| Apache Livy            | 0.4.                        |
| Apache Kafka           | 1.1                         |
| Apache Ambari          | 2.6.0                       |
| Apache Zeppelin        | 0.7.3                       |
| Mono                   | 4.2.1                       |

## Next steps

- [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Enterprise Security Package](./enterprise-security-package.md)
- [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
