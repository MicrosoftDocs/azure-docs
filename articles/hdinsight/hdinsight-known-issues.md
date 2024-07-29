---
title: Azure HDInsight known issues
description: Track known issues for Azure HDInsight, along with troubleshooting steps, actions, and frequently asked questions.
ms.service: hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 03/28/2024
---

# Azure HDInsight known issues

This article lists known issues for the Azure HDInsight service. Before you submit a support request, review this list to see if Microsoft is already aware of the issue that you're experiencing and is addressing it.

For service-level outages or degradation notifications, check the [Azure Service Health status](https://azure.status.microsoft/status) page.

## Summary of known issues

Azure HDInsight Open known issues:

| HDInsight component | Issue description |
|---------------------|-------------------|
| Control Plane | [Component version validation error in ARM templates](./component-version-validation-error-arm-templates.md) |
| Platform | [Cluster reliability issue with older images in HDInsight clusters](./cluster-reliability-issues.md)|
| Platform | [Switch users through the Ambari UI](./hdinsight-known-issues-ambari-users-cache.md)|





## Recently closed known issues

Select the title to view more information about that specific known issue. Fixed issues are removed after 60 days.

| Area                   |Title                    | Issue published date| Status |
|------------------------|-------------------------|-------------------|-------|
|Spark|[Conda Version Regression in a recent HDInsight release](./hdinsight-known-issues-conda-version-regression.md)|October 13, 2023|Closed|

## Next steps

- [Check Azure Service Health status](https://azure.status.microsoft/status)
- [HDInsight cluster management best practices](cluster-management-best-practices.md)
- [HDInsight 5.x component versions](hdinsight-5x-component-versioning.md)
- [Create Apache Hadoop clusters in HDInsight by using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md)
