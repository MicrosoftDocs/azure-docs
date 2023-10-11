---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/10/2023
---

# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
Subscribe to the [HDInsight Release Notes](./subscribe-to-hdi-release-notes-repo.md) for up-to-date information on HDInsight and all HDInsight versions.

To subscribe, click the “watch” button in the banner and watch out for [HDInsight Releases](https://github.com/Azure/HDInsight/releases).

## Release date:  September 7, 2023

This release applies to HDInsight 4.x and 5.x HDInsight release will be available to all regions over several days. This release is applicable for image number **2308221128**. [How to check the image number?](./view-hindsight-cluster-image-version.md)

HDInsight uses safe deployment practices, which involve gradual region deployment. it may take up to 10 business days for a new release or a new version to be available in all regions.

**OS versions**

* HDInsight 4.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4
* HDInsight 5.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4
* HDInsight 5.1: Ubuntu 18.04.5 LTS Linux Kernel 5.4

For workload specific versions, see 

* [HDInsight 5.x component versions](./hdinsight-5x-component-versioning.md)
* [HDInsight 4.x component versions](./hdinsight-40-component-versioning.md)

> [!IMPORTANT]
> This release addresses the following CVEs released by [MSRC](https://msrc.microsoft.com/update-guide/vulnerability) on September 12, 2023. The action is to update to the latest image **2308221128**. Customers are advised to plan accordingly. 

|CVE | Severity| CVE Title| Remark |
|-|-|-|-|
|[CVE-2023-38156](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-38156)|	Important | Azure HDInsight Apache Ambari Elevation of Privilege Vulnerability |Included on 2308221128 image |
|[CVE-2023-36419](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-36419) | Important | Azure HDInsight Apache Oozie Workflow Scheduler Elevation of Privilege Vulnerability | Apply [Script action](https://hdiconfigactions2.blob.core.windows.net/msrc-script/script_action.sh) on your clusters |

## ![Icon showing coming soon.](./media/hdinsight-release-notes/clock.svg) Coming soon

* The max length of cluster name will be changed to 45 from 59 characters, to improve the security posture of clusters. This change will be implemented by September 30, 2023.
* Cluster permissions for secure storage  
  * Customers can specify (during cluster creation) whether a secure channel should be used for HDInsight cluster nodes to contact the storage account. 
* In-line quota update.
   * Request quotas increase directly from the My Quota page, which will be a direct API call, which is faster. If the APdI call fails, then customers need to create a new support request for quota increase.
* HDInsight Cluster Creation with Custom VNets.
  * To improve the overall security posture of the HDInsight clusters, HDInsight clusters using custom VNETs need to ensure that the user needs to have permission for `Microsoft Network/virtualNetworks/subnets/join/action` to perform create operations. Customers would need to plan accordingly as this change would be a mandatory check to avoid cluster creation failures before September 30, 2023. 
* Basic and Standard A-series VMs Retirement.
   * On August 31, 2024, we'll retire Basic and Standard A-series VMs. Before that date, you need to migrate your workloads to Av2-series VMs, which provide more memory per vCPU and faster storage on solid-state drives (SSDs). To avoid service disruptions, [migrate your workloads](https://aka.ms/Av1retirement) from Basic and Standard A-series VMs to Av2-series VMs before August 31, 2024.
* Non-ESP ABFS clusters [Cluster Permissions for Word Readable] 
  * Plan to introduce a change in non-ESP ABFS clusters, which restricts non-Hadoop group users from executing Hadoop commands for storage operations. This change to improve cluster security posture. Customers need to plan for the updates before September 30, 2023. 

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

You can always ask us about HDInsight on [Azure HDInsight - Microsoft Q&A](/answers/tags/168/azure-hdinsight)

You’re welcome to add more proposals and ideas and other topics here and vote for them - [HDInsight Community (azure.com)](https://feedback.azure.com/d365community/search/?q=HDInsight).

 > [!NOTE]
 > We advise customers to use to latest versions of HDInsight [Images](./view-hindsight-cluster-image-version.md) as they bring in the best of open source updates,  Azure updates and security fixes. For more information, see [Best practices](./hdinsight-overview-before-you-start.md).

### Next steps
* [Azure HDInsight: Frequently asked questions](./hdinsight-faq.yml)
* [Configure the OS patching schedule for Linux-based HDInsight clusters](./hdinsight-os-patching.md)
