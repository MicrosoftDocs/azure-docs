---
title: Managed identities in Azure HDInsight
description: Provides an overview of managed identities in Azure HDInsight.
services: hdinsight
author: hrasheed-msft
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 03/12/2019
ms.author: hrasheed

---
# Managed identities in Azure HDInsight

A managed identity is an identity registered in Azure Active Directory (Azure AD) whose credentials are managed by Azure. With managed identities, you don't need to register service principals in Azure AD or maintain credentials such as certificates.

Azure services have two types of managed identities: system-assigned and user-assigned. HDInsight uses user-assigned managed identities. A user-assigned managed identity is created as a standalone Azure resource. Azure creates an identity in the Azure AD tenant that's trusted by the subscription in use. After the identity is created, the identity can be assigned to one or more Azure service instances.

## How does Azure HDInsight implement and use managed identities

In Azure HDInsight, managed identities are provisioned on each node of the cluster. Each managed identity is backed by a service principal and certificate, which are also installed on each cluster node. The service principal and thumbprint is available in the cluster manifest and the certificate is available at the `/var/lib/waagent` location.

## Managed identity scenarios in Azure HDInsight

Managed identities are used in Azure HDInsight in multiple scenarios. See the related documents for detailed setup and configuration instructions:

* [Azure Data Lake Storage Gen2](hdinsight-hadoop-use-data-lake-storage-gen2.md#create-a-user-managed-identity)
* [Enterprise Security Package](apache-domain-joined-configure-using-azure-adds.md#create-and-authorize-a-managed-identity)
* [Kafka Bring Your Own Key (BYOK)](kafka/apache-kafka-byok.md#get-started-with-byok)

## Next steps

* [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)