---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/27/2024
---

# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
Subscribe to the [HDInsight Release Notes](./subscribe-to-hdi-release-notes-repo.md) for up-to-date information on HDInsight and all HDInsight versions.

To subscribe, click the **watch** button in the banner and watch out for [HDInsight Releases](https://github.com/Azure/HDInsight/releases).

## Release Information

### Release date: May 16, 2024

This release note applies to 

:::image type="icon" source="./media/hdinsight-release-notes/yes-icon.svg" border="false"::: HDInsight 5.0 version.

:::image type="icon" source="./media/hdinsight-release-notes/yes-icon.svg" border="false"::: HDInsight 4.0 version. 


HDInsight release will be available to all regions over several days. This release note is applicable for image number **2405081840**. [How to check the image number?](./view-hindsight-cluster-image-version.md)

HDInsight uses safe deployment practices, which involve gradual region deployment. It might take up to 10 business days for a new release or a new version to be available in all regions.

**OS versions**

* HDInsight 5.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4
* HDInsight 4.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4

> [!NOTE]
> Ubuntu 18.04 is supported under [Extended Security Maintenance(ESM)](https://techcommunity.microsoft.com/t5/linux-and-open-source-blog/canonical-ubuntu-18-04-lts-reaching-end-of-standard-support/ba-p/3822623) by the Azure Linux team for [Azure HDInsight July 2023](/azure/hdinsight/hdinsight-release-notes-archive#release-date-july-25-2023), release onwards. 

For workload specific versions, see [HDInsight 5.x component versions](./hdinsight-5x-component-versioning.md).

## Fixed issues

* Added API in gateway to get token for Keyvault, as part of the SFI initiative.
* In the new Log monitor `HDInsightSparkLogs` table, for log type `SparkDriverLog`, some of the fields were missing. For example, `LogLevel & Message`. This release adds the missing fields to schemas and fixed formatting for `SparkDriverLog`.
* Livy logs not available in Log Analytics monitoring `SparkDriverLog` table, which was due to an issue with Livy log source path and log parsing regex in `SparkLivyLog` configs.
* Any HDInsight cluster, using ADLS Gen2 as a primary storage account can leverage MSI based access to any of the Azure resources (for example, SQL, Keyvaults) which is used within the application code. 

  
## :::image type="icon" border="false" source="./media/hdinsight-release-notes/clock.svg"::: Coming soon

* [Basic and Standard A-series VMs Retirement](https://azure.microsoft.com/updates/basic-and-standard-aseries-vms-on-hdinsight-will-retire-on-31-august-2024/).
   * On August 31, 2024, we'll retire Basic and Standard A-series VMs. Before that date, you need to migrate your workloads to Av2-series VMs, which provide more memory per vCPU and faster storage on solid-state drives (SSDs).
   * To avoid service disruptions, [migrate your workloads](https://aka.ms/Av1retirement) from Basic and Standard A-series VMs to Av2-series VMs before August 31, 2024.
* Retirement Notifications for [HDInsight 4.0](https://azure.microsoft.com/updates/basic-and-standard-aseries-vms-on-hdinsight-will-retire-on-31-august-2024/) and  [HDInsight 5.0](https://azure.microsoft.com/updates/hdinsight5retire/).
 
If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

You can always ask us about HDInsight on [Azure HDInsight - Microsoft Q&A](/answers/tags/168/azure-hdinsight).

We're listening: You’re welcome to add more ideas and other topics here and vote for them - [HDInsight Ideas](https://feedback.azure.com/d365community/search/?q=HDInsight) and follow us for more updates on [AzureHDInsight Community](https://www.linkedin.com/groups/14313521/).

> [!NOTE]
> We advise customers to use to latest versions of HDInsight [Images](./view-hindsight-cluster-image-version.md) as they bring in the best of open source updates,  Azure updates and security fixes. For more information, see [Best practices](./hdinsight-overview-before-you-start.md).

### Next steps
* [Azure HDInsight: Frequently asked questions](./hdinsight-faq.yml)
* [Configure the OS patching schedule for Linux-based HDInsight clusters](./hdinsight-os-patching.md)
* Previous [release note](/azure/hdinsight/hdinsight-release-notes-archive#release-date--january-10-2024)
