---
title: What's new for Azure Key Vault
description: Recent updates for Azure Key Vault
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: reference
ms.date: 01/12/2020
ms.author: mbaldwin

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.

---

# What's new for Azure Key Vault

Here's what's new with Azure Key Vault. New features and improvements are also announced on the [Azure updates Key Vault channel](https://azure.microsoft.com/updates/?category=security&query=Key%20vault).

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

**Soft-delete is required to be enabled for all key vaults**, both new and pre-existing. Over the next few months the ability to opt out of soft delete will be deprecated. For full details on this potentially breaking change, as well as steps to find affected key vaults and update them beforehand, see the article [Soft-delete will be enabled on all key vaults](soft-delete-change.md).

### Azure TLS certificate changes

Microsoft is updating Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs). This change is being made because the current CA certificates do not comply with one of the CA/Browser Forum Baseline requirements.  For full details, see [Azure TLS Certificate Changes](../../security/fundamentals/tls-certificate-changes.md).

## June 2020

Azure Monitor for Key Vault is now in preview.  Azure Monitor provides comprehensive monitoring of your key vaults by delivering a unified view of your Key Vault requests, performance, failures, and latency. For more information, see [Azure Monitor for Key Vault (preview).](../../azure-monitor/insights/key-vault-insights-overview.md).

## May 2020

Key Vault "bring your own key" (BYOK) is now generally available. See the [Azure Key Vault BYOK specification](../keys/byok-specification.md), and learn how to [Import HSM-protected keys to Key Vault (BYOK)](../keys/hsm-protected-keys-byok.md).

## March 2020

Private endpoints now available in preview. Azure Private Link Service enables you to access Azure Key Vault and Azure hosted customer/partner services over a Private Endpoint in your virtual network.  Learn how to [Integrate Key Vault with Azure Private Link](private-link-service.md).

## 2019

- Release of the next-generation Azure Key Vault SDKs. For examples of their use, see the Azure Key Vault secret quickstarts for [Python](../secrets/quick-create-python.md), [.NET](../secrets/quick-create-net.md), [Java](../secrets/quick-create-java.md), and [Node.js](../secrets/quick-create-node.md)
- New Azure policies to manage key vault certificates. See the [Azure Policy built-in definitions for Key Vault](../policy-reference.md).
- Azure Key Vault Virtual Machine extension now generally available.  See [Key Vault virtual machine extension for Linux](../../virtual-machines/extensions/key-vault-linux.md) and [Key Vault virtual machine extension for Windows](../../virtual-machines/extensions/key-vault-windows.md).
- Event-driven secrets management for Azure Key Vault now available in Azure Event Grid. For more information, see [the Event Grid schema for events in Azure Key Vault](../../event-grid/event-schema-key-vault.md], and learn how to [Receive and respond to key vault notifications with Azure Event Grid](event-grid-tutorial.md).

## 2018

New features and integrations released this year:

- Integration with Azure Functions. For an example scenario leveraging [Azure Functions](../../azure-functions/index.yml) for key vault operations, see [Automate the rotation of a secret](../secrets/tutorial-rotation.md).
- [Integration with Azure Databricks](/azure/databricks/scenarios/store-secrets-azure-key-vault). With this, Azure Databricks now supports two types of secret scopes: Azure Key Vault-backed and Databricks-backed. For more information, see [Create an Azure Key Vault-backed secret scope](/azure/databricks/security/secrets/secret-scopes#--create-an-azure-key-vault-backed-secret-scope)
- [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md).

## 2016

New features released this year:

- Managed storage account keys. Storage Account Keys feature added easier integration with Azure Storage. See the overview topic for more information, [Managed Storage Account Keys overview](../secrets/overview-storage-keys.md).
- Soft delete. Soft-delete feature improves data protection of your key vaults and key vault objects. See the overview topic for more information, [Soft-delete overview](./soft-delete-overview.md).

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

If you have additional questions, please contact us through [support](https://azure.microsoft.com/support/options/).
