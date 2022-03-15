---
title: Apache Hadoop components and versions - Azure HDInsight 
description: Learn about the Apache Hadoop components and versions in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/15/2022
---

# Azure HDInsight versions

HDInsight bundles Apache Hadoop environment components and HDInsight platform into a package that is deployed on a cluster. For more details see [how HDInsight versioning works](hdinsight-overview-versioning.md).

## Supported HDInsight versions

This table lists the versions of HDInsight that are available in the Azure portal and other deployment methods like PowerShell, CLI and the .NET SDK.

| HDInsight version | VM OS | Release date| Support type | Support expiration date | Retirement date | High availability |
| --- | --- | --- | --- | --- | --- | ---|
| [HDInsight 4.0](hdinsight-40-component-versioning.md) |Ubuntu 18.0.4 LTS |September 24, 2018 | [Standard](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) | | |Yes |
| [HDInsight 3.6](hdinsight-36-component-versioning.md) |Ubuntu 16.0.4 LTS |April 4, 2017      | [Basic](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) | Standard support expired on June 30, 2021 for all cluster types.<br> Basic support expires on September 30, 2022. See [HDInsight 3.6 component versions](hdinsight-36-component-versioning.md) for cluster type details. |October 1, 2022 |Yes |

**Support expiration** means that Microsoft no longer provides support for the specific HDInsight version. And it may no longer available through the Azure portal for cluster creation.

**Retirement** means that existing clusters of an HDInsight version continue to run as is. New clusters of this version can't be created through any means, which includes the CLI and SDKs. Other control plane features, such as manual scaling and autoscaling, are not guaranteed to work after retirement date. Support isn't available for retired versions.

## Support options for HDInsight versions

Support is defined as a time period that an HDInsight version is supported by Microsoft Customer Service and Support. HDInsight offers two types of support: 
- **Standard support**
- **Basic support**

### Standard support

Standard support provides updates and support on HDInsight clusters. Microsoft recommends building solutions using the most recent fully supported version. 

Standard support includes the following:
- Ability to create support requests on HDInsight 4.0 clusters.
- Support for troubleshooting solutions built on 4.0 clusters. 
- Requests to restart services or nodes.
- Root cause analysis investigations on support requests.
- Root cause analysis or fixes to improve job or query performance.
- Root cause analysis or fixes to improve customer-initiated changes, e.g., changing service configurations or issues due to custom script actions.
- Product updates for critical security fixes until version retirement.
- Scoped product updates to the HDInsight Resource provider.
- Selective fixes or changes to HDInsight 4.0 images or open-source software (OSS) component versions.

### Basic support

Basic support provides limited servicing to the HDInsight Resource provider. HDInsight images and open-source software (OSS) components will not be serviced. Only critical security fixes will be patched on HDInsight clusters. 

Basic support includes the following:
- Continued use of existing HDInsight 3.6 clusters.
- Ability for existing HDInsight 3.6 customers to create new 3.6 clusters.
- Ability to scale HDInsight 3.6 clusters up and down via autoscale or manual scale.
- Scoped product updates to the HDInsight Resource provider.
- Product updates for critical security fixes until version retirement.
- Ability to create support requests on HDInsight 3.6 clusters.
- Requests to restart services or nodes.

Basic support does not include the following:
- Fixes or changes to HDInsight 3.6 images or open-source software (OSS) component versions.
- Support for troubleshooting solutions built on 3.6 clusters. 
- Adding new features or functionality.
- Support for advice or ad-hoc queries.
- Root cause analysis investigations on support requests.
- Root cause analysis or fixes to improve job or query performance.
- Root cause analysis or fixes to improve customer-initiated changes, e.g., changing service configurations or issues due to custom script actions.

Microsoft does not encourage creating analytics pipelines or solutions on clusters in basic support. We recommend migrating existing clusters to the most recent fully supported version. 

## HDInsight 3.6 to 4.0 Migration Guides
- [Migrate Apache Spark 2.1 and 2.2 workloads to 2.3 and 2.4](spark/migrate-versions.md).
- [Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0](interactive-query/apache-hive-migrate-workloads.md).
- [Migrate Apache Kafka workloads to Azure HDInsight 4.0](kafka/migrate-versions.md).
- [Migrate an Apache HBase cluster to a new version](hbase/apache-hbase-migrate-new-version.md).
- [Migrate Azure HDInsight 3.6 Apache Storm to HDInsight 4.0 Apache Spark](storm/migrate-storm-to-spark.md).

## Release notes

For additional release notes on the latest versions of HDInsight, see [HDInsight release notes](hdinsight-release-notes.md).

## Versioning considerations
- Once a cluster is deployed with an image, that cluster is not automatically upgraded to newer image version. When creating new clusters, most recent image version will be deployed.
- Customers should test and validate that applications run properly when using new HDInsight version.
- HDInsight reserves the right to change the default version without prior notice. If you have a version dependency, specify the HDInsight version when you create your clusters.
- HDInsight may retire an OSS component version before retiring the HDInsight version.

## Next steps

- [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Enterprise Security Package](./enterprise-security-package.md)
- [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
