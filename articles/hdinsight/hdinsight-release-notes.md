---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 10/26/2023
---

# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
Subscribe to the [HDInsight Release Notes](./subscribe-to-hdi-release-notes-repo.md) for up-to-date information on HDInsight and all HDInsight versions.

In this release HDI 5.1 version is moved to General Availability (GA) stage.

To subscribe, click the “watch” button in the banner and watch out for [HDInsight Releases](https://github.com/Azure/HDInsight/releases).

## Release date:  October 26, 2023

This release applies to HDInsight 4.x and 5.x HDInsight release will be available to all regions over several days. This release is applicable for image number **2310140056**. [How to check the image number?](./view-hindsight-cluster-image-version.md)

HDInsight uses safe deployment practices, which involve gradual region deployment. it might take up to 10 business days for a new release or a new version to be available in all regions.

**OS versions**

* HDInsight 4.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4
* HDInsight 5.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4
* HDInsight 5.1: Ubuntu 18.04.5 LTS Linux Kernel 5.4

For workload specific versions, see 

* [HDInsight 5.x component versions](./hdinsight-5x-component-versioning.md)
* [HDInsight 4.x component versions](./hdinsight-40-component-versioning.md)

## What's new

* HDInsight announces the General availability of HDInsight 5.1 starting November 1, 2023. This release brings in a full stack refresh to the [open source components](./hdinsight-5x-component-versioning.md#open-source-components-available-with-hdinsight-5x) and the integrations from Microsoft. 
    * Latest Open Source Versions – [HDInsight 5.1](./hdinsight-5x-component-versioning.md) comes with the latest stable [open-source version](./hdinsight-5x-component-versioning.md#open-source-components-available-with-hdinsight-5x) available. Customers can benefit from all latest open source features, Microsoft performance improvements, and Bug fixes. 
    * Secure – The latest versions come with the most recent security fixes, both open-source security fixes and security improvements by Microsoft. 
    * Lower TCO – With performance enhancements customers can lower the operating cost, along with [enhanced autoscale](https://techcommunity.microsoft.com/t5/analytics-on-azure-blog/enhanced-autoscale-capabilities-in-hdinsight-clusters/ba-p/3811271).
   
* Cluster permissions for secure storage  
  * Customers can specify (during cluster creation) whether a secure channel should be used for HDInsight cluster nodes to connect the storage account.
    
* HDInsight Cluster Creation with Custom VNets.
  * To improve the overall security posture of the HDInsight clusters, HDInsight clusters using custom VNETs need to ensure that the user needs to have permission for `Microsoft Network/virtualNetworks/subnets/join/action` to perform create operations. Customer might face creation failures if this check is not enabled.
    
 * Non-ESP ABFS clusters [Cluster Permissions for Word Readable] 
     * Non-ESP ABFS clusters restrict non-Hadoop group users from executing Hadoop commands for storage operations. This change improves cluster security posture.
       
* In-line quota update.
   * Now you can request quota increase directly from the My Quota page, with the direct API call it is much faster. In case the API call fails, you can create a new support request for quota increase.

## ![Icon showing coming soon.](./media/hdinsight-release-notes/clock.svg) Coming soon

* The max length of cluster name will be changed to 45 from 59 characters, to improve the security posture of clusters. This change will be rolled out to all regions starting upcoming release.

* Basic and Standard A-series VMs Retirement.
   * On August 31, 2024, we will retire Basic and Standard A-series VMs. Before that date, you need to migrate your workloads to Av2-series VMs, which provide more memory per vCPU and faster storage on solid-state drives (SSDs).
   * To avoid service disruptions, [migrate your workloads](https://aka.ms/Av1retirement) from Basic and Standard A-series VMs to Av2-series VMs before August 31, 2024.

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

You can always ask us about HDInsight on [Azure HDInsight - Microsoft Q&A](/answers/tags/168/azure-hdinsight)

We are listening: You’re welcome to add more ideas and other topics here and vote for them - [HDInsight Ideas](https://feedback.azure.com/d365community/search/?q=HDInsight) and follow us for more updates on [AzureHDInsight Community](https://www.linkedin.com/groups/14313521/)

> [!NOTE]
> This release addresses the following CVEs released by [MSRC](https://msrc.microsoft.com/update-guide/vulnerability) on September 12, 2023. The action is to update to the latest image 2308221128 or 2310140056. Customers are advised to plan accordingly. 

| CVE | Severity | CVE Title | Remark |
| - | - | - | - |
| [CVE-2023-38156](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-38156) |	Important | Azure HDInsight Apache Ambari Elevation of Privilege Vulnerability |Included on image 2308221128 or 2310140056 |
| [CVE-2023-36419](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-36419) | Important | Azure HDInsight Apache Oozie Workflow Scheduler Elevation of Privilege Vulnerability | Apply [Script action](https://hdiconfigactions2.blob.core.windows.net/msrc-script/script_action.sh) on your clusters, or update to 2310140056 image |

> [!NOTE]
> We advise customers to use to latest versions of HDInsight [Images](./view-hindsight-cluster-image-version.md) as they bring in the best of open source updates,  Azure updates and security fixes. For more information, see [Best practices](./hdinsight-overview-before-you-start.md).

### Next steps
* [Azure HDInsight: Frequently asked questions](./hdinsight-faq.yml)
* [Configure the OS patching schedule for Linux-based HDInsight clusters](./hdinsight-os-patching.md)
