---
title: Azure HDInsight headnode goes to unresponsive state
description: Azure HDInsight – Headnode unresponsive due to /tmp disk usage leak in latest HDInsight 5.1 releases
ms.service: azure-hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 12/10/2025
---

# Azure HDInsight headnode goes to unresponsive state due to disk usage issue

Certain Azure HDInsight 5.1 cluster versions contain an issue where temporary OpenSSL-related directories accumulate under /tmp/tmp-*openssl. These directories are not automatically cleaned up by the system as intended. Over time, this leads to a disk usage spike to 100% on the headnodes, causing cluster instability and headnode unresponsiveness.

## Symptoms

  * Headnode becomes unreachable or slow.
  * YARN/DFS operations fail due to lack of disk space.
  * Health probes report headnode unhealthy.
  * Logs show No space left on device errors.
  * SSH sessions may fail or commands hang due to full /tmp.

## Impact

Affects HDInsight clusters as below:
  * Causes /tmp to reach 100% utilization.
  * Headnodes enter unresponsive/unhealthy state.
  * Can affect job submission, Ambari access, and essential HDInsight control-plane operations.

## Root cause

A regression in the latest HDInsight 5.1 release introduced an issue where OpenSSL temporary directories created in /tmp/tmp-*openssl do not get cleaned up automatically as expected.

## Recommended steps

To resolve this issue, run the following [script action](/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux#script-action-to-a-running-cluster) on headnodes

   `https://hdiconfigactions.blob.core.windows.net/openssl-patch/openssltmpclean.sh`

>[!IMPORTANT]
> Automated cleanup included in the code path does not execute as expected. The cron-based cleanup is the recommended and supported mitigation until a patched HDInsight image is released.

## Resources

- [Script action to a running cluster](/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux#script-action-to-a-running-cluster)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)








