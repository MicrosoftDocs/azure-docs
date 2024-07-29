---
title: Conda Version Regression in a recent HDInsight release
description: Known issue affecting image version 5.1.3000.0.2308052231
ms.service: hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 02/22/2024
---

# Conda version regression in a recent HDInsight release

**Issue published date**: October 13, 2023

In the latest Azure HDInsight release, the conda version was mistakenly downgraded to 4.2.9. This regression is fixed in an upcoming release, but currently it can affect Spark job execution and result in script action failures. Conda 4.3.30 is the expected version in 5.0 and 5.1 clusters, so follow the steps to mitigate the issue.

> [!IMPORTANT]  
> This issue affects clusters with image version 5.1.3000.0.2308052231. Learn how to [view the image version of an HDInsight cluster](./view-hindsight-cluster-image-version.md). 

## Recommended steps

1. Use Secure Shell (SSH) to connect to any virtual machine (VM) in the cluster.
2. Switch to the root user: `sudo su`.
3. Check the conda version: `/usr/bin/anaconda/bin/conda info`.
4. If the version is 4.2.9, run the following [script action](/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux#script-action-to-a-running-cluster) on all nodes to upgrade the cluster to conda version 4.3.30:

   `https://hdiconfigactions2.blob.core.windows.net/hdi-sre-workspace/conda_update_4_3_30_patch.sh`

## Resources

- [Script action to a running cluster](/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux#script-action-to-a-running-cluster)
- [Safely manage a Python environment on Azure HDInsight by using script actions](/azure/hdinsight/spark/apache-spark-python-package-installation)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)
