---
title: Release notes for Azure HDInsight 
description: Latest release notes for Azure HDInsight. Get development tips and details for Hadoop, Spark, R Server, Hive, and more.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 01/08/2019
---
# Release notes

This article provides information about the **most recent** Azure HDInsight release updates. For information on earlier releases, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

## Summary

Azure HDInsight is one of the most popular services among enterprise customers for open-source analytics on Azure.

## Release date: 01/09/2019

This release applies both for HDInsight 3.6 and 4.0. HDInsight release is made available to all regions over several days. The release date here indicates the first region release date. If you don't see below changes, please wait for the release being live in your region in several days.

> [!IMPORTANT]  
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight versioning article](hdinsight-component-versioning.md).

## New features
### TLS 1.2 enforcement
Transport Layer Security (TLS) and Secure Sockets Layer (SSL) are cryptographic protocols that provide communications security over a computer network. Learn more about [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security#SSL_1.0.2C_2.0_and_3.0). HDInsight uses TLS 1.2 on public HTTPs endpoints but TLS 1.1 is still supported for backward compatibility. 

With this release, customers can opt into TLS 1.2 only for all connections through the public cluster endpoint. To support this, the new property **minSupportedTlsVersion** is introduced and can be specified during cluster creation. If the property is not set, the cluster still supports TLS 1.0, 1.1 and 1.2, which is the same as today's behavior. Customers can set the value for this property to "1.2", which means that the cluster only supports TLS 1.2 and above. 

### Bring your own key for disk encryption
All managed disks in HDInsight are protected with Azure Storage Service Encryption (SSE). Data on those disks is encrypted by Microsoft-managed keys by default. Starting from this release, you can Bring Your Own Key (BYOK) for disk encryption and manage it using Azure Key Vault. BYOK encryption is a one-step configuration during cluster creation with no additional cost. Just register HDInsight as a managed identity with Azure Key Vault and add the encryption key when you create your cluster. 

## Deprecation
No deprecations for this release. To get ready for upcoming deprecations, see [Upcoming changes](#upcoming-changes).

## Behavior changes
No behavior changes for this release. To get ready for upcoming changes, see [Upcoming changes](#upcoming-changes).

## Upcoming changes
The following changes will happen in upcoming releases. 

### A minimum 4-core VM is required for Head Node 
A minimum 4-core VM is required for Head Node to ensure the high availability and reliability of HDInsight clusters. Starting from April 6th 2020, customers can only choose 4-core or above VM as Head Node for the new HDInsight clusters. Existing clusters will continue to run as expected. 

### ESP Spark cluster node size change 
In the upcoming release, the minimum allowed node size for ESP Spark cluster will be changed to Standard_D13_V2. 
A-series VMs could cause ESP cluster issues because of relatively low CPU and memory capacity. A-series VMs will be deprecated for creating new ESP clusters.

### Moving to Azure virtual machine scale sets
HDInsight now uses Azure virtual machines to provision the cluster. In the upcoming release, HDInsight will use Azure virtual machine scale sets instead. See more about Azure virtual machine scale sets.

### HBase 2.0 to 2.1
In the upcoming HDInsight 4.0 release, HBase version will be upgraded from version 2.0 to 2.1.

## Bug fixes
HDInsight continues to make cluster reliability and performance improvements. 

## Component version change
No component version change for this release. You could find the current component versions for HDInsight 4.0 ad HDInsight 3.6 here.
