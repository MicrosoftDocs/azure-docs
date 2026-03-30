---
title: Azure HDInsight ESP cluster creation issues due to Ranger service startup
description: Azure HDInsight ESP cluster creation issues due to Ranger service startup
ms.service: azure-hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 10/12/2025
---

# Azure HDInsight ESP cluster creation issues due to Ranger service startup

**Issue published date**: December 10, 2025

In the Azure HDInsight release, the Ranger was mistakenly designed to Managed Identity for authentication. This regression is fixed in an latest release.

> [!IMPORTANT]  
> This issue affects clusters with image version 5.1.3000.0.2501080039. Learn how to [view the image version of an HDInsight cluster](./view-hindsight-cluster-image-version.md). 

## Recommended steps

1. Kindly verify if the Azure Subscription is pinned to specific HDInsight version.
2. Unpin the subscription with help of Azure support team.
3. Recreate the Azure HDInsight cluster with image version 2508190809.


## Resources

- [Supported HDInsight versions](./hdinsight-component-versioning.md#supported-hdinsight-versions).

- [Release Note for HDInsight](./hdinsight-release-notes.md)





