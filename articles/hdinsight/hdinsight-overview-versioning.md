---
title: Versioning overview 
description: Learn how versioning works in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: deshriva
ms.date: 02/08/2021
---

# How versioning works in HDInsight

HDInsight bundles Apache Hadoop components and HDInsight Resource provider into a package that is deployed on a cluster.

## HDInsight Resource provider

Resources in Azure are made available by a Resource provider. HDInsight Resource provider (HDI RP) is responsible for creating, managing, and deleting clusters.

## HDInsight Images

HDInsight uses images to put together OSS components that can be deployed on a cluster. These images contain the base Ubuntu operating system and core components such as Spark, Hadoop, Kafka, HBase or Hive.

## Versioning in HDInsight

HDInsight periodically upgrades images and HDI RP to include new improvements and features.

New HDInsight version may be created when one or more of the following are true:

- Major changes or updates to HDI RP functionality
- Major releases of OSS components
- Major changes to Ubuntu operating system

New image version is created when one or more of the following are true:

- Major/Minor releases and updates of OSS components
- Patches or fixes for a component in the image
