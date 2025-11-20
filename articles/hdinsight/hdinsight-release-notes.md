---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: azure-hdinsight
ms.topic: conceptual
author: yeturis
ms.author: sairamyeturi
ms.reviewer: nijelsf
ms.date: 10/29/2025
---

# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
Subscribe to the [HDInsight Release Notes](./subscribe-to-hdi-release-notes-repo.md) for up-to-date information on HDInsight and all HDInsight versions.

To subscribe, click the **watch** button in the banner and watch out for [HDInsight Releases](https://github.com/Azure/HDInsight/releases/tag/2025-10-29).

## Release Information

### Release date: Oct 29, 2025

> [!NOTE]
> This is a Hotfix / maintenance release for Resource Provider. For more information see, [Resource Provider](.//hdinsight-overview-versioning.md#hdinsight-resource-provider).

Azure HDInsight periodically releases maintenance updates for delivering bug fixes, performance enhancements, and security patches ensuring you stay up to date with these updates guarantees optimal performance and reliability.

This release note applies to

:::image type="icon" source="./media/hdinsight-release-notes/yes-icon.svg" border="false"::: HDInsight 5.1 version.


HDInsight release will be available to all regions over several days. This release note is applicable for image number **2508190809**. [How to check the image number?](./view-hindsight-cluster-image-version.md)

HDInsight uses safe deployment practices, which involve gradual region deployment. It might take up to 10 business days for a new release or a new version to be available in all regions.

**OS versions**

* HDInsight 5.1: Ubuntu 18.04.5 LTS Linux Kernel 5.4

> [!NOTE]
> Ubuntu 18.04 is supported under [Extended Security Maintenance(ESM)](https://techcommunity.microsoft.com/t5/linux-and-open-source-blog/canonical-ubuntu-18-04-lts-reaching-end-of-standard-support/ba-p/3822623) by the Azure Linux team for [Azure HDInsight July 2023](/azure/hdinsight/hdinsight-release-notes-archive#release-date-july-25-2023), release onwards. 

For workload specific versions, see [HDInsight 5.x component versions](./hdinsight-5x-component-versioning.md).

## Issues fixed

* Refactoring and security fixes.

## Updates

* The following standalone drivers are no longer supported with HDInsight.
   * [Hive ODBC driver](https://www.microsoft.com/en-us/download/details.aspx?id=40886)
   * [Spark ODBC driver](https://www.microsoft.com/en-us/download/details.aspx?id=49883)

## Reminder

* HDInsight service has transitioned to use standard load balancers for all its cluster configurations due to [deprecation announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer#main) of Azure basic load balancer.

  > [!IMPORTANT]
  > By default, creation of any new HDInsight cluster happens with Standard Load Balancers. We recommend referring to the [migration guide to recreate the cluster](./load-balancer-migration-guidelines.md).
  > For any assistance, contact [support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

You can always ask us about HDInsight on [Azure HDInsight - Microsoft Q&A](/answers/tags/168/azure-hdinsight).

We're listening: You’re welcome to add more ideas and other topics here and vote for them - [HDInsight Ideas](https://feedback.azure.com/d365community/search/?q=HDInsight) and follow us for more updates on [AzureHDInsight Community](https://www.linkedin.com/groups/14313521/).

> [!NOTE]
> We advise customers to use to latest versions of HDInsight [Images](./view-hindsight-cluster-image-version.md) as they bring in the best of open source updates,  Azure updates, and security fixes. For more information, see, [Best practices](./hdinsight-overview-before-you-start.md).

### Next steps
* [Azure HDInsight: Frequently asked questions](./hdinsight-faq.yml)
* [Configure the OS patching schedule for Linux-based HDInsight clusters](./hdinsight-os-patching.md)
* Previous [release note](/azure/hdinsight/hdinsight-release-notes-archive)
