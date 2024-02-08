---
title: Archived release notes for Azure HDInsight on AKS 
description: Archived release notes for Azure HDInsight on AKS. Get development tips and details for Trino, Flink, and Spark.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 02/07/2024
---

# Azure HDInsight on AKS archived release notes

Azure HDInsight on AKS is one of the most popular services among enterprise customers for open-source analytics on Azure. If you would like to subscribe on release notes, watch releases on this [GitHub repository](https://github.com/Azure/HDInsight-on-aks/releases).

## Release date: December 13, 2023

**This hotfix release applies to the following**

- Cluster Pool Version: 1.0
- Cluster Version: 1.0.6

#### Known Issues

- **Secure Tenants User Interface Support**
  -   This release addresses an issue where the open source component web URLs for HDInsight on AKS Clusters were inaccessible. For applying this fix, please reach out to Azure support to enable this on your subscription/tenant.
 
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

|Workload |Java|Scala|
| ----------- | -------- | -------- |
|Trino |Open JDK 17.0.7  |- |
|Flink  |Open JDK 11.0.21 |2.12.7 |
|Spark  |Open JDK 1.8.0_345  |2.12.15 |

The preview is available in the following [regions](../overview.md#region-availability-public-preview).

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) or refer to the [Support options](../hdinsight-aks-support-help.md) page.




