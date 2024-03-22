---
title: Archived release notes for Azure HDInsight on AKS 
description: Archived release notes for Azure HDInsight on AKS. Get development tips and details for Trino, Flink, and Spark.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 03/21/2024
---

# Azure HDInsight on AKS archived release notes

Azure HDInsight on AKS is one of the most popular services among enterprise customers for open-source analytics on Azure. If you would like to subscribe on release notes, watch releases on this [GitHub repository](https://github.com/Azure/HDInsight-on-aks/releases).

### Release date: February 05, 2024

**This release applies to the following**

- Cluster Pool Version: 1.1
- Cluster Version: 1.1.0
- AKS version: 1.27

> [!TIP]
> To create a new HDInsight on AKS cluster on 1.1.0, you are required to create a new cluster pool with version 1.1

### New Features

- [Workload Identity](/azure/aks/workload-identity-overview) is supported by default for cluster pools on 1.1
- Trino clusters support Trino 426 from 1.1.0 release
  - HDInsight on AKS now includes all changes up to Trino 426 with several notable improvements provided by the community. Learn more about Trino [here](https://trino.io/docs/current/release/release-426.html).
- Trino cluster shape now supports load-based autoscale from 1.1.0 release
  - Trino on HDInsight on AKS now supports load-based autoscale making cluster more cost efficient. Learn more about it [here](/azure/hdinsight-aks/hdinsight-on-aks-autoscale-clusters).
- Trino cluster shape adds simplified hive metastore and catalogs configuration
  - HDInsight on AKS has simplified external Hive metastore configuration for Trino cluster. you can now specify external metastore in config.properties and enable it for each catalog with single parameter. Learn more about enhancements [here](/azure/hdinsight-aks/trino/trino-connect-to-metastore).
- Trino cluster shape adds sharded sql connector
- Flink clusters now support Flink 1.17.0 from HDInsight on AKS 1.1.0 release
  -   HDInsight on AKS now supports Flink 1.17.0 release, with significant improvements on checkpoints, subtask level flame graph, watermark alignments. Learn more about the Flink 1.17 release [here](https://nightlies.apache.org/flink/flink-docs-release-1.17/release-notes/flink-1.17/)
- Flink [SQL Gateway](https://flink.apache.org/2023/03/23/announcing-the-release-of-apache-flink-1.17/#sql-client--gateway) is now supported from HDInsight on AKS 1.1.0 release with Flink session clusters 

### Bug Fixes & CVEs

- This release includes several critical CVE fixes across the platform and open source components.
- Trino cluster shape excludes system tables from caching automatically
- Trino cluster shape improves Power BI timestamp timezones handling

### Known issues

- **Workload identity limitation:**
  - There's a known [limitation](/azure/aks/workload-identity-overview#limitations) when transitioning to workload identity. This is due to the permission-sensitive nature of FIC operations. Users can't perform deletion of a cluster by deleting the resource group. Cluster deletion requests must be triggered by the application/user/principal with FIC/delete permissions. In case, the FIC deletion fails, the high-level cluster deletion will also fail.


### New regions
- East Asia

 
### Operating System version

- Mariner OS 2.0

**Workload versions**

|Workload|Version|
| -------- | -------- |
|Trino | 426 |
|Flink | 1.17.0 |
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



## Release date: December 13, 2023

**This hotfix release applies to the following**

- Cluster Pool Version: 1.0
- Cluster Version: 1.0.6

#### Known Issues

- **Secure Tenants User Interface Support**
  -   This release addresses an issue where the open source component web URLs for HDInsight on AKS Clusters were inaccessible. For applying this fix, reach out to Azure support to enable this on your subscription/tenant.
 
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




