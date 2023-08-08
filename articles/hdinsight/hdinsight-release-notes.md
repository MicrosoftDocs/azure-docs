---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 08/08/2023
---

# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
Subscribe to the [HDInsight Release Notes](./subscribe-to-hdi-release-notes-repo.md) for up-to-date information on HDInsight and all HDInsight versions.

To subscribe, click the “watch” button in the banner and watch out for [HDInsight Releases](https://github.com/Azure/HDInsight/releases).

## Release date: July 25, 2023

This release applies to HDInsight 4.x and 5.x HDInsight release will be available to all regions over several days. This release is applicable for image number **2307201242**. [How to check the image number?](./view-hindsight-cluster-image-version.md)

HDInsight uses safe deployment practices, which involve gradual region deployment. it may take up to 10 business days for a new release or a new version to be available in all regions.

**OS versions**

* HDInsight 4.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4
* HDInsight 5.0: Ubuntu 18.04.5 LTS Linux Kernel 5.4
* HDInsight 5.1: Ubuntu 18.04.5 LTS Linux Kernel 5.4

For workload specific versions, see 

* [HDInsight 5.x component versions](./hdinsight-5x-component-versioning.md)
* [HDInsight 4.x component versions](./hdinsight-40-component-versioning.md)

## ![Icon showing Whats new.](./media/hdinsight-release-notes/whats-new.svg) What's new
* HDInsight 5.1 is now supported with ESP cluster.  
* Upgraded version of Ranger 2.3.0 and Oozie 5.2.1 are now part of HDInsight 5.1
* The Spark 3.3.1 (HDInsight 5.1) cluster comes with Hive Warehouse Connector (HWC) 2.1, which works together with the Interactive Query (HDInsight 5.1) cluster.

> [!IMPORTANT]
> This release addresses the following CVEs released by [MSRC](https://msrc.microsoft.com/update-guide/vulnerability) on August 8, 2023. The action is to update to the latest image **2307201242**. Customers are advised to plan accordingly. 

|CVE | Severity| CVE Title|
|-|-|-|
|[CVE-2023-35393](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-35393)|	Important|Azure Apache Hive Spoofing Vulnerability|
|[CVE-2023-35394](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-35394)|	Important|Azure HDInsight Jupyter Notebook Spoofing Vulnerability|
|[CVE-2023-36877](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-36877)|	Important|Azure Apache Oozie Spoofing Vulnerability|
|[CVE-2023-36881](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-36881)|	Important|Azure Apache Ambari Spoofing Vulnerability|
|[CVE-2023-38188](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-38188)|	Important|Azure Apache Hadoop Spoofing Vulnerability|
 

## ![Icon showing coming soon.](./media/hdinsight-release-notes/clock.svg) Coming soon

* The max length of cluster name will be changed to 45 from 59 characters, to improve the security posture of clusters. Customers need to plan for the updates before 30, September 2023.
* Cluster permissions for secure storage  
  * Customers can specify (during cluster creation) whether a secure channel should be used for HDInsight cluster nodes to contact the storage account. 
* In-line quota update.
   * Request quotas increase directly from the My Quota page, which will be a direct API call, which is faster. If the API call fails, then customers need to create a new support request for quota increase.
* HDInsight Cluster Creation with Custom VNets.
  * To improve the overall security posture of the HDInsight clusters, HDInsight clusters using custom VNETs need to ensure that the user needs to have permission for `Microsoft Network/virtualNetworks/subnets/join/action` to perform create operations. Customers would need to plan accordingly as this change would be a mandatory check to avoid cluster creation failures before 30, September 2023. 
* Basic and Standard A-series VMs Retirement.
   * On 31 August 2024, we'll retire Basic and Standard A-series VMs. Before that date, you need to migrate your workloads to Av2-series VMs, which provide more memory per vCPU and faster storage on solid-state drives (SSDs). To avoid service disruptions, [migrate your workloads](https://aka.ms/Av1retirement) from Basic and Standard A-series VMs to Av2-series VMs before 31, August 2024.
* Non-ESP ABFS clusters [Cluster Permissions for Word Readable] 
  * Plan to introduce a change in non-ESP ABFS clusters, which restricts non-Hadoop group users from executing Hadoop commands for storage operations. This change to improve cluster security posture. Customers need to plan for the updates before 30 September 2023. 

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

You can always ask us about HDInsight on [Azure HDInsight - Microsoft Q&A](https://learn.microsoft.com/answers/tags/168/azure-hdinsight)

You’re welcome to add more proposals and ideas and other topics here and vote for them - [HDInsight Community (azure.com)](https://feedback.azure.com/d365community/search/?q=HDInsight) and follow us for more  updates on [twitter](https://twitter.com/AzureHDInsight)

 > [!NOTE]
 > We advise customers to use to latest versions of HDInsight [Images](./view-hindsight-cluster-image-version.md) as they bring in the best of open source updates,  Azure updates and security fixes. For more information, see [Best practices](./hdinsight-overview-before-you-start.md).

### Next steps
* [Azure HDInsight: Frequently asked questions](./hdinsight-faq.yml)
* [Configure the OS patching schedule for Linux-based HDInsight clusters](./hdinsight-os-patching.md)
