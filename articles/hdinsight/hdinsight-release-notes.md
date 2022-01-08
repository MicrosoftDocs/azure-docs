---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, Hive, and more.
ms.custom: references_regions
ms.service: hdinsight
ms.topic: conceptual
ms.date: 12/27/2021
---
# Azure HDInsight release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.
If you would like to subscribe on release notes, watch releases on [this GitHub repository](https://github.com/hdinsight/release-notes/releases).

## Release date: 12/27/2021

This release applies for HDInsight 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, wait for the release being live in your region over several days.

The OS versions for this release are:
- HDInsight 4.0: Ubuntu 18.04.5 LTS

HDInsight 4.0 image has been updated to mitigate Log4j vulnerability as described in [Microsoft’s Response to CVE-2021-44228 Apache Log4j 2.](https://msrc-blog.microsoft.com/2021/12/11/microsofts-response-to-cve-2021-44228-apache-log4j2/)

> [!Note]
> * Any HDI 4.0 clusters created post 27 Dec 2021 00:00 UTC are created with an updated version of the image which mitigates the log4j vulnerabilities. Hence, customers need not patch/reboot these clusters.
> * For new HDInsight 4.0 clusters created between 16 Dec 2021 at 01:15 UTC and 27 Dec 2021 00:00 UTC, HDInsight 3.6 or in pinned subscriptions after 16 Dec 2021 the patch is auto applied within the hour in which the cluster is created, however customers must then reboot their nodes for the patching to complete (except for Kafka Management nodes, which are automatically rebooted).
