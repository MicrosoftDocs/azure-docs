---
title: Release notes for Azure HDInsight on AKS  
description: Latest release notes for Azure HDInsight on AKS. Get development tips and details for Trino, Flink, Spark, and more.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 12/20/2023
---

# Azure HDInsight on AKS release notes

This article provides information about the **most recent** Azure HDInsight on AKS release updates. 

## Summary

Azure HDInsight on AKS is a new version of HDInsight, which runs on Kubernetes and brings in the best of the open source on Kubernetes. It's gaining popularity among enterprise customers for open-source analytics on Azure Kubernetes Services.

> [!NOTE]
> To understand about HDInsight on AKS versioning and support, refer to the **[versioning page](../versions.md)**.

You can refer to [What's new](../whats-new.md) page for all the details of the features currently in public preview for this release.

## Release Information

### Release date: December 13, 2023

**This hotfix release applies to the following**

- Cluster Pool Version: 1.0
- Cluster Version: 1.0.6

#### Known Issues

- **Secure Tenants User Interface Support**
  -   This release addresses an issue where the open source component web URLs for HDInsight on AKS Clusters were inaccessible.
 
  **How to apply the Hotfix**
  -  Recreate Your Cluster
    -  To apply this hotfix, existing users are required to recreate their [cluster](../quickstart-create-cluster.md) on an existing cluster pool. 
 
### Operating System version

- Mariner OS 2.0

**Workload versions**

|Workload|Version|
| -------- | -------- |
|Trino | 410 |
|Flink | 1.16 |
|Apache Spark | 3.3.1 |

**Supported Java and Scala versions**

|Java|Scala|
| -------- | -------- |
|8, JDK 1.8.0_345 |2.12.10 |

The preview is available in the following [regions](../overview.md#region-availability-public-preview).

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) or refer to the [Support options](../hdinsight-aks-support-help.md) page.

### Next steps

- [Azure HDInsight on AKS : Frequently asked questions](../faq.md)
- [Create a cluster pool and cluster](../quickstart-create-cluster.md)
