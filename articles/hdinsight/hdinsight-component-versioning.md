---
title: Apache Hadoop components and versions - Azure HDInsight 
description: Learn about the Apache Hadoop components and versions in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/08/2021
---

# Azure HDInsight versions

HDInsight bundles Apache Hadoop environment components and HDInsight platform into a package that is deployed on a cluster. For more details see [how HDInsight versioning works](hdinsight-overview-versioning.md).

## Supported HDInsight versions

This table lists the versions of HDInsight that are available in the Azure portal and other deployment methods like PowerShell, CLI and the .NET SDK.

| HDInsight version | VM OS | Release date| Support type | Support expiration date | Retirement date | High availability |
| --- | --- | --- | --- | --- | --- | ---|
| [HDInsight 4.0](hdinsight-40-component-versioning.md) |Ubuntu 16.0.4 LTS |September 24, 2018 | [Standard](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) | | |Yes |
| [HDInsight 3.6](hdinsight-36-component-versioning.md) |Ubuntu 16.0.4 LTS |April 4, 2017      | [Basic](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) | Standard support expiration - June 30, 2021 <br> Basic support expiration - April 3, 2022 |April 4, 2022 |Yes |

*Starting July 1st, 2021 Microsoft will offer Basic support for certain HDI 3.6 cluster types. See [HDInsight 3.6 component versions](hdinsight-36-component-versioning.md).

## Release notes

For additional release notes on the latest versions of HDInsight, see [HDInsight release notes](hdinsight-release-notes.md).

## Support options for HDInsight versions

Support is defined as a time period that an HDInsight version is supported by Microsoft Customer Service and Support. HDInsight offers two types of support: 
- **Standard support** is a time period in which Microsoft provides updates and support on HDInsight clusters.  
    We recommend building solutions using the most recent fully supported version. 
- **Basic support** is a time period in which Microsoft will provide limited servicing to HDInsight Resource provider. HDInsight images and open-source software (OSS) components will not be serviced.   Only critical security fixes will be patched on HDInsight clusters.  
  Microsoft does not encourage creating new clusters or building any fresh solutions when a version is in Basic support. We recommend migrating existing clusters to the most recent fully supported version. 

**Support expiration** means that Microsoft no longer provides support for the specific HDInsight version. And it may no longer available through the Azure portal for cluster creation.

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
