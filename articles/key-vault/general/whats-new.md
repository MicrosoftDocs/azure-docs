---
title: What's new for Azure Key Vault
description: Recent updates for Azure Key Vault
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: reference
ms.date: 01/17/2023
ms.author: mbaldwin

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.

---

# What's new for Azure Key Vault

Here's what's new with Azure Key Vault. New features and improvements are also announced on the [Azure updates Key Vault channel](https://azure.microsoft.com/updates/?category=security&query=Key%20vault).

## July 2023

Built-in policy to govern the key rotation configuration in Azure Key Vault. With this policy, you can audit existing keys in key vaults to ensure that all keys are configured for rotation and comply with your organization's standards. 

For more information, see [Configure key rotation governance](../keys/how-to-configure-key-rotation.md#configure-key-rotation-policy-governance)

## June 2023

Key Vault enforces TLS 1.2 or higher for enhanced security. If you're still using an older TLS version, see [Enable support for TLS 1.2 in your environment](/troubleshoot/azure/active-directory/enable-support-tls-environment/#why-this-change-is-being-made) to update your clients and ensure uninterrupted access to Key Vault services. You can monitor TLS version used by clients by monitoring Key Vault logs with sample Kusto query [here](monitor-key-vault.md#sample-kusto-queries).

## May 2023

Azure RBAC is now the recommended authorization system for the Azure Key Vault data plane. Azure RBAC is built on Azure Resource Manager and provides fine-grained access management of Azure resources. With Azure RBAC you control access to resources by creating role assignments, which consist of three elements: a security principal, a role definition (predefined set of permissions), and a scope (group of resources or individual resource).

For more information, please visit [Azure role-based access control (Azure RBAC) vs. access policies | Microsoft Learn](rbac-access-policy.md)

## February 2023

Built-in policy to govern the migration to Azure role-based access control (RBAC) is now in preview. With the built-in policy you can audit existing key vaults and enforce all new key vaults to use the Azure RBAC permission model. See [RBAC migration governance](../general/rbac-migration.md#migration-governance) to learn how to enforce the new built-in policy.

## April 2022

Automated encryption key rotation in Key Vault is now generally available.

For more information, see [Configure key auto-rotation in Key Vault](../keys/how-to-configure-key-rotation.md)

## January 2022

Azure Key Vault service throughput limits have been increased to serve double its previous quota for each vault to help ensure high performance for applications. That is, for secret GET and RSA 2,048-bit software keys, you'll receive 4,000 GET transactions per 10 seconds versus 2,000 per 10 seconds previously. The service quotas are specific to operation type and the entire list can be accessed in [Azure Key Vault Service Limits](./service-limits.md). 

For Azure update announcement, see [General availability: Azure Key Vault increased service limits for all its customers] (https://azure.microsoft.com/updates/azurekeyvaultincreasedservicelimits/)


## December 2021

Automated encryption key rotation in Key Vault is now in preview. You can set a rotation policy on a key to schedule automated rotation and configure expiry notifications through Event Grid integration. 

For more information, see [Configure key auto-rotation in Key Vault](../keys/how-to-configure-key-rotation.md)

## October 2021

Integration of Azure Key Vault with Azure Policy has reached general availability and is now ready for production use. This capability is a step towards our commitment to simplifying secure secrets management in Azure, while also enhancing policy enforcements that you can define on Key Vault, keys, secrets and certificates. Azure Policy allows you to place guardrails on Key Vault and its objects to ensure they're compliant with your organizations security recommendations and compliance regulations. It allows you to perform real time policy-based enforcement and on-demand compliance assessment of existing secrets in your Azure environment. The results of audits performed by policy will be available to you in a compliance dashboard where you'll be able to see a drill-down of which resources and components are compliant and which aren't. Azure policy for Key Vault will provide you with a full suite of built-in policies offering governance of your keys, secrets, and certificates.  

You can learn more about how to [Integrate Azure Key Vault with Azure Policy](./azure-policy.md?tabs=certificates) and assign a new policy. Announcement is linked [here](https://azure.microsoft.com/updates/gaazurepolicyforkeyvault).

## June 2021

Azure Key Vault Managed HSM is generally available. Managed HSM offers a fully managed, highly available, single-tenant, high-throughput, standards-compliant cloud service to safeguard cryptographic keys for your cloud applications, using FIPS 140-2 Level 3 validated HSMs. 

For more information, see [Azure Key Vault Managed HSM Overview](../managed-hsm/overview.md)

## February 2021

Azure role-based access control (RBAC) for Azure Key Vault data plane authorization is now generally available. With this capability, you can now manage RBAC for Key Vault keys, certificates, and secrets with roles assignment scope available from management group to individual key, certificate, and secret. 

For more information, see [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](rbac-guide.md)

## October 2020

> [!WARNING]
> These updates have the potential to impact Azure Key Vault implementations.

To support [soft delete now on by default](#soft-delete-on-by-default), two changes have been made to Azure Key Vault PowerShell cmdlets:

- The DisableSoftDelete and EnableSoftDelete parameters of [Update-AzKeyVault](/powershell/module/az.keyvault/update-azkeyvault) have been deprecated.
- The output of the [Get-AzKeyVaultSecret](/powershell/module/az.keyvault/get-azkeyvaultsecret) cmdlet no longer has the `SecretValueText` attribute.

## July 2020

> [!WARNING]
> These two updates have the potential to impact Azure Key Vault implementations.

### Soft delete on by default

**Soft-delete is required to be enabled for all key vaults**, both new and pre-existing. Over the next few months the ability to opt out of soft delete will be deprecated. For full details on this potentially breaking change, and steps to find affected key vaults and update them beforehand, see the article [Soft-delete will be enabled on all key vaults](soft-delete-change.md).

### Azure TLS certificate changes

Microsoft is updating Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs). This change is being made because the current CA certificates don't comply with one of the CA/Browser Forum Baseline requirements.  For full details, see [Azure TLS Certificate Changes](../../security/fundamentals/tls-certificate-changes.md).

## June 2020

Azure Monitor for Key Vault is now in preview.  Azure Monitor provides comprehensive monitoring of your key vaults by delivering a unified view of your Key Vault requests, performance, failures, and latency. For more information, see [Azure Monitor for Key Vault (preview).](../key-vault-insights-overview.md).

## May 2020

Key Vault "bring your own key" (BYOK) is now generally available. See the [Azure Key Vault BYOK specification](../keys/byok-specification.md), and learn how to [Import HSM-protected keys to Key Vault (BYOK)](../keys/hsm-protected-keys-byok.md).

## March 2020

Private endpoints now available in preview. Azure Private Link Service enables you to access Azure Key Vault and Azure hosted customer/partner services over a Private Endpoint in your virtual network.  Learn how to [Integrate Key Vault with Azure Private Link](private-link-service.md).

## 2019

- Release of the next-generation Azure Key Vault SDKs. For examples of their use, see the Azure Key Vault secret quickstarts for [Python](../secrets/quick-create-python.md), [.NET](../secrets/quick-create-net.md), [Java](../secrets/quick-create-java.md), and [Node.js](../secrets/quick-create-node.md)
- New Azure policies to manage key vault certificates. See the [Azure Policy built-in definitions for Key Vault](../policy-reference.md).
- Azure Key Vault Virtual Machine extension now generally available.  See [Key Vault virtual machine extension for Linux](../../virtual-machines/extensions/key-vault-linux.md) and [Key Vault virtual machine extension for Windows](../../virtual-machines/extensions/key-vault-windows.md).
- Event-driven secrets management for Azure Key Vault now available in Azure Event Grid. For more information, see [the Event Grid schema for events in Azure Key Vault](../../event-grid/event-schema-key-vault.md), and learn how to [Receive and respond to key vault notifications with Azure Event Grid](event-grid-tutorial.md).

## 2018

New features and integrations released this year:

- Integration with Azure Functions. For an example scenario leveraging [Azure Functions](../../azure-functions/index.yml) for key vault operations, see [Automate the rotation of a secret](../secrets/tutorial-rotation.md).
- [Integration with Azure Databricks](./integrate-databricks-blob-storage.md). With this, Azure Databricks now supports two types of secret scopes: Azure Key Vault-backed and Databricks-backed. For more information, see [Create an Azure Key Vault-backed secret scope](/azure/databricks/security/secrets/secret-scopes#--create-an-azure-key-vault-backed-secret-scope)
- [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md).

## 2016

New features released this year:

- Managed storage account keys. Storage Account Keys feature added easier integration with Azure Storage. For more information, see [Managed Storage Account Keys overview](../secrets/overview-storage-keys.md).
- Soft delete. Soft-delete feature improves data protection of your key vaults and key vault objects. For more information, see [Soft-delete overview](./soft-delete-overview.md).

## 2015

New features released this year:
- Certificate management. Added as a feature to the GA version 2015-06-01 on September 26, 2016.

General Availability (version 2015-06-01) was announced on June 24, 2015. The following changes were made at this release:
- Delete a key - "use" field removed.
- Get information about a key - "use" field removed.
- Import a key into a vault - "use" field removed.
- Restore a key - "use" field removed.
- Changed "RSA_OAEP" to "RSA-OAEP" for RSA Algorithms. See [About keys, secrets, and certificates](about-keys-secrets-certificates.md).

Second preview version (version 2015-02-01-preview) was announced April 20, 2015. For more information, see [REST API Update](/archive/blogs/kv/rest-api-update) blog post. The following tasks were updated:

- List the keys in a vault - added pagination support to operation.
- List the versions of a key - added operation to list the versions of a key.
- List secrets in a vault - added pagination support.
- List versions of a secret - add operation to list the versions of a secret.
- All operations - Added created/updated timestamps to attributes.
- Create a secret - added Content-Type to secrets.
- Create a key - added tags as optional information.
- Create a secret - added tags as optional information.
- Update a key - added tags as optional information.
- Update a secret - added tags as optional information.
- Changed max size for secrets from 10 K to 25 K Bytes. See, [About keys, secrets, and certificates](about-keys-secrets-certificates.md).

## 2014

First preview version (version 2014-12-08-preview) was announced on January 8, 2015.

## Next steps

If you have questions, contact us through [support](https://azure.microsoft.com/support/options/).
