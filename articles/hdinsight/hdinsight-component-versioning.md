---
title: Apache Hadoop components and versions - Azure HDInsight 
description: Learn about the Apache Hadoop components and versions in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
author: deshriva
ms.author: deshriva
ms.date: 02/08/2021
---

# Azure HDInsight versions

HDInsight bundles Apache Hadoop environment components and HDInsight platform into a package that is deployed on a cluster. For more details see [how HDInsight versioning works](hdinsight-overview-versioning.md).

## Supported HDInsight versions

This table lists the versions of HDInsight that are available in the Azure portal and other deployment methods like PowerShell, CLI and the .NET SDK.

| HDInsight version | VM OS | Release date | Support expiration date | Retirement date | High availability |
| --- | --- | --- | --- | --- | --- |
| [HDInsight 4.0](hdinsight-40-component-versioning.md) |Ubuntu 16.0.4 LTS |September 24, 2018 | | |Yes |
| [HDInsight 3.6](hdinsight-36-component-versioning.md) |Ubuntu 16.0.4 LTS |April 4, 2017      | *June 30, 2021 |June 30, 2021 |Yes |

*We are extending the support timeframe for certain HDInsight 3.6 cluster types. See [HDInsight 3.6 component versions](hdinsight-36-component-versioning.md).

## Release notes

For additional release notes on the latest versions of HDInsight, see [HDInsight release notes](hdinsight-release-notes.md).

## Support options for HDInsight versions

HDInsight offers Standard support which is defined as a time period that an HDInsight version is supported by Microsoft Customer Service and Support.

**Support expiration** means that Microsoft no longer provides support for the specific HDInsight version. And it's no longer available through the Azure portal for cluster creation.

**Retirement** means that existing clusters of an HDInsight version continue to run as is. New clusters of this version can't be created through any means, which includes the CLI and SDKs. Other control plane features, such as manual scaling and autoscaling, are not guaranteed to work after retirement date. Support isn't available for retired versions.

## Versioning considerations
- Once a cluster is deployed with an image, that cluster is not automatically upgraded to newer image version. When creating new clusters, most recent image version will be deployed.
- Customers should test and validate that applications run properly when using new HDInsight version.
- HDInsight reserves the right to change the default version without prior notice. If you have a version dependency, specify the HDInsight version when you create your clusters.
- HDInsight may retire an OSS component version before retiring the HDInsight version.

## Next steps

- [Cluster setup for Apache Hadoop, Spark, and more on HDInsight](hdinsight-hadoop-provision-linux-clusters.md)
- [Enterprise Security Package](./enterprise-security-package.md)
- [Work in Apache Hadoop on HDInsight from a Windows PC](hdinsight-hadoop-windows-tools.md)