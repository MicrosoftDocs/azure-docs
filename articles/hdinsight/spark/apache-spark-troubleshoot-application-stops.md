---
title: Apache Spark Streaming application stops after 24 days in Azure HDInsight
description: An Apache Spark Streaming application stops after executing for 24 days and there are no errors in the log files. 
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 07/12/2023
---

# Scenario: Apache Spark Streaming application stops after executing for 24 days in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Apache Spark components in Azure HDInsight clusters.

## Issue

An Apache Spark Streaming application stops after executing for 24 days and there are no errors in the log files.

## Cause

The `livy.server.session.timeout` value controls how long Apache Livy should wait for a session to complete. Once the session length reaches the `session.timeout` value, the Livy session and the application are automatically killed.

## Resolution

For long running jobs, increase the value of `livy.server.session.timeout` using the Ambari UI. You can access the Livy configuration from the Ambari UI using the URL `https://<yourclustername>.azurehdinsight.net/#/main/services/LIVY/configs`.

Replace `<yourclustername>` with the name of your HDInsight cluster as shown in the portal.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
