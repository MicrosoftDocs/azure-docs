---
title: Managed identity for Azure Operator Insights
description: This article helps you understand managed identity and how it works in Azure Operator Insights.
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: concept-article
ms.date: 03/26/2024
---

# Managed identity for Azure Operator Insights

This article helps you understand managed identity (formerly known as Managed Service Identity/MSI) and how it works in Azure Operator Insights.

## Overview of managed identities

Managed identities eliminate the need to manage credentials. Managed identities provide an identity for service instances to use when connecting to resources that support Microsoft Entra ID (formerly Azure Active Directory) authentication. For example, the service can use a managed identity to access resources like [Azure Key Vault](../key-vault/general/overview.md), where data admins can securely store credentials or access storage accounts. The service uses the managed identity to obtain Microsoft Entra ID tokens.

Microsoft Entra ID offers two types of managed identities:

- **System-assigned:** You can enable a managed identity directly on a resource. When you enable a system-assigned managed identity during the creation of the resource, an identity is created in Microsoft Entra ID tied to that resource's lifecycle. By design, only that Azure resource can use this identity to request tokens from Microsoft Entra ID. When the resource is deleted, Azure automatically deletes the identity for you.

- **User-assigned:** You can also create a managed identity as a standalone resource and associate it with other resources. The identity is managed separately from the resources that use it.

For more general information about managed identities, see [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview).

## User-assigned managed identities in Azure Operator Insights

Azure Operator Insights use a user-assigned managed identity for:

- Encryption with customer-managed keys, also called CMK-based encryption.
- Integration with Microsoft Purview. The managed identity allows the Data Product to manage the collection and the data catalog within the collection.
- Authentication to Azure for an [Azure Operator Insights ingestion agent](ingestion-agent-overview.md) on an Azure VM. The managed identity allows the ingestion agent to access a Data Product's Key Vault. See [use a managed identity for authentication](set-up-ingestion-agent.md#use-a-managed-identity-for-authentication).

When you [create a Data Product](data-product-create.md), you set up the managed identity and associate it with the Data Product. To use the managed identity with Microsoft Purview, you must also [grant the managed identity the appropriate permissions in Microsoft Purview](purview-setup.md#access-and-set-up-your-microsoft-purview-account).

You use Microsoft Entra ID to manage user-assigned managed identities. For more information, see [Create, list, delete, or assign a role to a user-assigned managed identity using the Azure portal](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

## System-assigned managed identities in Azure Operator Insights

Azure Operator Insights Data Products don't support system-assigned managed identities.

Azure Operator Insights ingestion agents on Azure VMs support system-assigned managed identities for accessing a Data Product's Key Vault. See [Use a managed identity for authentication](set-up-ingestion-agent.md#use-a-managed-identity-for-authentication).

## Related content

See [Store credential in Azure Key Vault](../data-factory/store-credentials-in-key-vault.md) for information about when and how to use managed identity.

See [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview) for more background on managed identities for Azure resources, on which managed identity in Azure Operator Insights is based.
