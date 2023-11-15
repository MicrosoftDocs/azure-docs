---
title: Managed identity for Azure Operator Insights
description: This article helps you understand managed identity and how it works in Azure Operator Insights.
author: bettylew
ms.author: bettylew
ms.service: operator-insights
ms.topic: concept-article
ms.date: 10/18/2023
---

# Managed identity for Azure Operator Insights

This article helps you understand managed identity (formerly known as Managed Service Identity/MSI) and how it works in Azure Operator Insights.

## Overview

Managed identities eliminate the need to manage credentials. Managed identities provide an identity for the service instance when connecting to resources that support Microsoft Entra ID (formerly Azure Active Directory) authentication. For example, the service can use a managed identity to access resources like [Azure Key Vault](../key-vault/general/overview.md), where data admins can securely store credentials or access storage accounts. The service uses the managed identity to obtain Microsoft Entra ID (formerly Azure Active Directory) tokens.

There are two types of supported managed identities:

- **System-assigned:** You can enable a managed identity directly on a service instance. When you allow a system-assigned managed identity during the creation of the service, an identity is created in Microsoft Entra ID (formerly Azure Active Directory) tied to that service instance's lifecycle. By design, only that Azure resource can use this identity to request tokens from Azure AD. So when the resource is deleted, Azure automatically deletes the identity for you.

- **User-assigned:** You can also create a managed identity as a standalone Azure resource. You can [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md). In user-assigned managed identities, the identity is managed separately from the resources that use it.

Managed identity provides the below benefits:

- [Store credential in Azure Key Vault](../data-factory/store-credentials-in-key-vault.md), in which case-managed identity is used for Azure Key Vault authentication.

- Access data stores or computes using managed identity authentication, including Azure Blob storage, Azure Data Explorer, Azure Data Lake Storage Gen1, Azure Data Lake Storage Gen2, Azure SQL Database, Azure SQL Managed Instance, Azure Synapse Analytics, REST, Databricks activity, Web activity, and more.

- Managed identity is also used to encrypt/decrypt data and metadata using the customer-managed key stored in Azure Key Vault, providing double encryption.

## System-assigned managed identity

>[!NOTE]
> System-assigned managed identity is not currently supported with Azure Operator Insights Data Product Resource.

## User-assigned managed identity

You can create, delete, manage user-assigned managed identities in Microsoft Entra ID (formerly Azure Active Directory). For more details refer to [Create, list, delete, or assign a role to a user-assigned managed identity using the Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).

Once you have created a user-assigned managed identity, you must supply the credentials during or after [Azure Operator Insights Data Product Resource creation](../data-factory/credentials.md).

## Related content

See [Store credential in Azure Key Vault](../data-factory/store-credentials-in-key-vault.md) for information about when and how to use managed identity.

See [Managed Identities for Azure Resources Overview](../active-directory/managed-identities-azure-resources/overview.md) for more background on managed identities for Azure resources, on which managed identity in Azure Operator Insights is based.
