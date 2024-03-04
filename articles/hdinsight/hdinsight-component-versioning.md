---
title: Open-source components and versions - Azure HDInsight 
description: Learn about the open-source components and versions in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 07/27/2023
---

# Azure HDInsight versions

HDInsight bundles open-source components and HDInsight platform into a package that deployed on a cluster. For more information, see [how HDInsight versioning works](hdinsight-overview-versioning.md).

## Supported HDInsight versions

This table lists the versions of HDInsight that are available in the Azure portal and other deployment methods like PowerShell, CLI and the .NET SDK.

| HDInsight version | VM OS | Release date| Support type | Support expiration date | Retirement date | High availability |
| --- | --- | --- | --- | --- | --- | ---|
| [HDInsight 5.1](./hdinsight-5x-component-versioning.md) |Ubuntu 18.0.4 LTS |Feb 27, 2023 | [Standard](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) | Not announced |Not announced| Yes |
| [HDInsight 4.0](hdinsight-40-component-versioning.md) |Ubuntu 18.0.4 LTS |September 24, 2018 | [Standard](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) | Not announced | Not announced |Yes |

**Support expiration** means that Microsoft no longer provides support for the specific HDInsight version. You may not be able to create clusters from the Azure portal.

**Retirement** means that existing clusters of an HDInsight version continue to run as is. You can't create new clusters of this version through any means, which includes the CLI and SDKs. Other control plane features, such as manual scaling and autoscaling, not guaranteed to work after retirement date. Support isn't available for retired versions.

## Support options for HDInsight versions

Support defined as a time period that an HDInsight version supported by Microsoft Customer Service and Support. HDInsight offers two types of support: 
- **Standard support**
- **Basic support**

### Standard support

Standard support provides updates and support on HDInsight clusters. Microsoft recommends building solutions using the most recent fully supported version. 

Standard support includes
- Ability to create support requests for the cluster.
- Support for troubleshooting solutions built on the cluster(s). 
- Requests to restart services or nodes.
- Root cause analysis investigations on support requests.
- Root cause analysis or fixes to improve job or query performance.
- Root cause analysis or fixes to improve customer-initiated changes, for example, changing service configurations or issues due to custom script actions.
- Product updates for critical security fixes until version retirement.
- Scoped product updates to the HDInsight Resource provider.
- Selective fixes or changes to HDInsight images or open-source software (OSS) component versions.

### Basic support

Basic support provides limited servicing to the HDInsight Resource provider. HDInsight images and open-source software (OSS) components won't be serviced. Only critical security fixes patched on HDInsight clusters. 

Basic support includes
- Continued use of existing clusters.
- Ability for existing HDInsight customers to create new clusters in the same version.
- Ability to scale clusters up and down via autoscale or manual scale.
- Scoped product updates to the HDInsight Resource provider.
- Product updates for critical security fixes until version retirement.
- Ability to create support requests for the cluster.
- Requests to restart services or nodes.

Basic support doesn't include
- Fixes or changes to HDInsight images or open-source software (OSS) component versions.
- Support for troubleshooting solutions built on the cluster version. 
- Adding new features or functionality.
- Support for advice or ad-hoc queries.
- Root cause analysis investigations on support requests.
- Root cause analysis or fixes to improve job or query performance.
- Root cause analysis or fixes to improve customer-initiated changes, for example, changing service configurations or issues due to custom script actions.

Microsoft doesn't encourage creating analytics pipelines or solutions on clusters in basic support. We recommend migrating existing clusters to the most recent fully supported version. 

## HDInsight 3.6 to 4.0 Migration Guides
- [Migrate Azure HDInsight 3.6 Hive workloads to HDInsight 4.0](interactive-query/apache-hive-migrate-workloads.md).
- [Migrate Apache Kafka workloads to Azure HDInsight 4.0](kafka/migrate-versions.md).
- [Migrate an Apache HBase cluster to a new version](hbase/apache-hbase-migrate-new-version.md).

## Release notes

For extra release notes on the latest versions of HDInsight, see [HDInsight release notes](hdinsight-release-notes.md).

## Versioning considerations
- Once a cluster deployed with an image, that cluster can't automatically upgrade to newer image version. When you create new clusters, most recent image version deployed.
- Customers should test and validate that applications run properly when using new HDInsight version.
- HDInsight reserves the right to change the default version without prior notice. If you have a version dependency, specify the HDInsight version when you create your clusters.
- HDInsight may retire an OSS component version before retiring the HDInsight version.

## Next steps

- [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Enterprise Security Package](./enterprise-security-package.md)
- [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)
