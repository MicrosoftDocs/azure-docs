---
title: Managed identities in Azure HDInsight
description: Provides an overview of the implementation of managed identities in Azure HDInsight.
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

There are two types of managed identities: system-assigned and user-assigned. Azure HDInsight uses user-assigned managed identities. A system-assigned managed identity is created in Azure AD and then enabled directly on a particular Azure service instance automatically. The life of a system-assigned managed identity is then tied to the life of the service instance that it's enabled on. A user-assigned managed identity is created as a standalone Azure resource which you can then assign to one or more Azure service instances.

## How does HDInsight implement managed identities?

In Azure HDInsight, managed identities are provisioned on each node of the cluster. For some Azure services, managed identities are implemented with an endpoint that you can use to acquire access tokens for interacting with other Azure services on your own. In Azure HDInsight, however, managed identity components are only usable by the HDInsight service. There is currently no supported method for you to generate access tokens using the managed identities installed on HDInsight cluster nodes.

## Create a managed identity

Managed identities can be created with any of the following methods:

* [Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md)
* [Azure PowerShell](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-powershell.md)
* [Azure Resource Manager](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-arm.md)
* [Azure CLI](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md)

The remaining steps for configuring the managed identity depend on the scenario where it will be used.

## Managed identity scenarios in Azure HDInsight

Managed identities are used in Azure HDInsight in multiple scenarios. See the related documents for detailed setup and configuration instructions:

* [Azure Data Lake Storage Gen2](hdinsight-hadoop-use-data-lake-storage-gen2.md#create-a-user-managed-identity)
* [Enterprise Security Package](domain-joined/apache-domain-joined-configure-using-azure-adds.md#create-and-authorize-a-managed-identity)
* [Kafka Bring Your Own Key (BYOK)](kafka/apache-kafka-byok.md#get-started-with-byok)

## Next steps

* [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)