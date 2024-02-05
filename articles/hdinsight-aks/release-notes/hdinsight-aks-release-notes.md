---
title: Release notes for Azure HDInsight on AKS  
description: Latest release notes for Azure HDInsight on AKS. Get development tips and details for Trino, Flink, Spark, and more.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 02/05/2024
---

# Azure HDInsight on AKS release notes

This article provides information about the **most recent** Azure HDInsight on AKS release updates. 

## Summary

Azure HDInsight on AKS is a new version of HDInsight, which runs on Kubernetes and brings in the best of the open source on Kubernetes. It's gaining popularity among enterprise customers for open-source analytics on Azure Kubernetes Services.

> [!NOTE]
> To understand about HDInsight on AKS versioning and support, refer to the **[versioning page](../versions.md)**.

You can refer to [What's new](../whats-new.md) page for all the details of the features currently in public preview for this release.

## Release Information

### Release date: February 05, 2024

**This release applies to the following**

- Cluster Pool Version: 1.0
- Cluster Version: 1.1.0
- AKS version: 1.27

### New Features

- Workload Identity support by default from 1.1 release.
- Trino clusters support Trino 426 from 1.1.x release
- Trino cluster shape adds simplified hive metastore and catalogs configuration
- Trino cluster shape now supports load-based autoscale
- Trino cluster shape adds sharded sql connector
- Flink clusters now support Flink 1.17 from 1.1.x release
- Flink SQL Gateway is now supported from 1.1.x release of Flink on session clusters.

### Bug Fixes
- [Trino] Create failed due to an internalservererror Http2ConnectionException
- Trino cluster shape  improves system catalogs caching
- Trino cluster shape improves Power BI timestamp timezones handling

### Known issues

- **Workload identity limitation:**
  - There is a limitation when transitioning to workload identity. This is due to the permission-sensitive nature of FIC operations.
    
    Two available options to address this limitation:
    
    1. **Option 1:**
       - Cannot support the deletion of a cluster by deleting the resource group.
       - Cluster deletion requests must be triggered by the application/user/principal with FIC/delete permissions.
       - If FIC deletion fails, the high-level cluster deletion will also fail.
    1.  **Option 2:**
         - On the Resource Provider side, ignore FIC deletion errors to unblock the cluster deletion workflow.
         - Clusters can be deleted by deleting the resource group.
         - However, FICs will be leaked in the user's Managed Service Identity (MSI).


### New regions
- East Asia

 
### Operating System version

- Mariner OS 2.0

**Workload versions**

|Workload|Version|
| -------- | -------- |
|Trino | 426 |
|Flink | 1.17 |
|Apache Spark | 3.3.1 |

**Supported Java and Scala versions**

|Workload |Java|Scala|
| ----------- | -------- | -------- |
|Trino |Open JDK 17.0.7  |- |
|Flink  |Open JDK 11.0.21 |2.12.7 |
|Spark  |Open JDK 1.8.0_345  |2.12.15 |

The preview is available in the following [regions](../overview.md#region-availability-public-preview).

If you have any more questions, contact [Azure Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) or refer to the [Support options](../hdinsight-aks-support-help.md) page. If you have product specific feedback, write us on [aka.ms/askhdinsight](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR6HHTBN7UDpEhLm8BJmDhGJURDhLWEhBVE5QN0FQRUpHWDg4ODlZSDA4RCQlQCN0PWcu).

### Next steps

- [Azure HDInsight on AKS : Frequently asked questions](../faq.md)
- [Create a cluster pool and cluster](../quickstart-create-cluster.md)
