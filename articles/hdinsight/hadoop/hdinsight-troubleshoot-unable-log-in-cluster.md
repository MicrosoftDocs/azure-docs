---
title: Unable to log into Azure HDInsight cluster
description: Troubleshoot why unable to log into Apache Hadoop cluster in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 05/26/2023
---

# Scenario: Unable to log into Azure HDInsight cluster

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

Unable to log into Azure HDInsight cluster.

## Cause

Reasons may vary. Keep in mind that when logging in to the cluster or app dashboards, use your "cluster login" or HTTP credentials. When connecting remotely, use your Secure Shell (SSH) or Remote Desktop credentials.

## Resolution

To resolve common issues, try one or more of the following steps.

* Try opening the cluster dashboard in a new browser tab in privacy mode.

* If you cannot recall your SSH credentials, you can [reset the credentials within the Ambari UI](../hdinsight-administer-use-portal-linux.md#change-passwords).

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
