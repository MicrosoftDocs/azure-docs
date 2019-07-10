---
title: Overview of enterprise security features in Azure HDInsight
description: Learn the various features that support enterprise security in Azure HDInsight.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.topic: conceptual
ms.date: 07/11/2019
#Customer intent: As a user of Azure HDInsight, I want to learn the features that Azure HDInsight offers to ensure security at various system layers.
---

# Overview of enterprise security features in Azure HDInsight

Azure HDInsight offers a number of features to address your enterprise security needs at different system levels. For most of these solutions, you can choose whether or not you want to activate them, and they are not turned on by default. This flexibility allows you to choose the security features that are most important to you and helps you avoid paying for features that you don't want. This also means that it is your responsibility to make sure that the correct solutions are enabled for your setup and environment. Security at the physical and virtualized infrastructure layers are handled by HDInsight and do not require any action on your part.

This article will mention security solutions at different system layers which you can select to meet your needs. It will also provide links to help you find more information on how to proceed with those different features.

## Layered security model

The following table summarizes the major system security areas and the security solutions available to you in each part.

| Security area | Solution available |
|---|---|
| Data Access Security | Configure [access control lists ACLs](../../storage/blobs/data-lake-storage-access-control.md) for Azure Data Lake Storage Gen1 and Gen2  |
| Data Access Security | Enable the ["Secure transfer required"](../../storage/common/storage-require-secure-transfer.md) property on storage accounts. |
| Data Access Security | Configure [Azure Storage firewalls](../../storage/common/storage-network-security.md) and virtual networks |
| Data Access Security | Ensure [TLS encryption](../../storage/common/storage-security-tls.md) is enabled for data in transit. |
| Data Access Security | Configure [customer-managed keys](../../storage/common/storage-encryption-keys-portal.md) for Azure Storage encryption |
| Application and middleware security | Integrate with AAD-DS and [Configure Authentication](apache-domain-joined-configure-using-azure-adds.md) |
| Application and middleware security | Configure [Apache Ranger Authorization](apache-domain-joined-run-hive.md) policies |
| Application and middleware security | Use [Azure Monitor logs](../hdinsight-hadoop-oms-log-analytics-tutorial.md) |
| Operating system security | Create clusters with most recent secure base image |
| Operating system security | Ensure [OS Patching](../hdinsight-os-patching.md) on regular intervals |
| Network security | Configure a [virtual network](../hdinsight-extend-hadoop-virtual-network.md) |
| Network security | Configure [Inbound network security group (NSG) rules](../hdinsight-extend-hadoop-virtual-network.md#networktraffic) |
| Network security | Configure [Outbound traffic restriction](../hdinsight-restrict-outbound-traffic.md) with Firewall (preview) |

## Next steps

* Find out about the [Enterprise Security Package](apache-domain-joined-introduction.md) which allows you to join your HDInsight cluster to an Active Directory domain and control user authorization using familiar tools and processes.
