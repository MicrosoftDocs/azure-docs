---
title: Migrate Batch account certificates to Azure Key Vault
description: Learn how to migrate Batch account certificates to Azure Key Vault and plan for feature end of support.
ms.service: batch
ms.topic: how-to
ms.date: 03/08/2023
---

# Migrate Batch account certificates to Azure Key Vault

On *February 29, 2024*, the Azure Batch account certificates feature will be retired. Learn how to migrate your certificates on Azure Batch accounts using Azure Key Vault in this article.

## About the feature

Certificates are often required in various scenarios such as decrypting a secret, securing communication channels, or [accessing another service](credential-access-key-vault.md). Currently, Azure Batch offers two ways to manage certificates on Batch pools. You can add certificates to a Batch account or you can use the Azure Key Vault VM extension to manage certificates on Batch pools. Only the [certificate functionality on an Azure Batch account](/rest/api/batchservice/certificate) and the functionality it extends to Batch pools via `CertificateReference` to [Add Pool](/rest/api/batchservice/pool/add#certificatereference), [Patch Pool](/rest/api/batchservice/pool/patch#certificatereference), [Update Properties](/rest/api/batchservice/pool/update-properties#certificatereference) and the corresponding references on Get and List Pool APIs are being retired. Additionally, for Linux pools, the environment variable `$AZ_BATCH_CERTIFICATES_DIR` will no longer be defined and populated.

## Feature end of support

[Azure Key Vault](../key-vault/general/overview.md) is the standard, recommended mechanism for storing and accessing secrets and certificates across Azure securely. Therefore, on February 29, 2024, we'll retire the Batch account certificates feature in Azure Batch. The alternative is to use the Azure Key Vault VM Extension and a user-assigned managed identity on the pool to securely access and install certificates on your Batch pools.

After the certificates feature in Azure Batch is retired on February 29, 2024, a certificate in Batch won't work as expected. After that date, you'll no longer be able to add certificates to a Batch account or link these certificates to Batch pools. Pools that continue to use this feature after this date may not behave as expected such as updating certificate references or the ability to install existing certificate references.

## Alternative: Use Azure Key Vault VM extension with pool user-assigned managed identity

Azure Key Vault is a fully managed Azure service that provides controlled access to store and manage secrets, certificates, tokens, and keys. Key Vault provides security at the transport layer by ensuring that any data flow from the key vault to the client application is encrypted. Azure Key Vault gives you a secure way to store essential access information and to set fine-grained access control. You can manage all secrets from one dashboard. Choose to store a key in either software-protected or hardware-protected hardware security modules (HSMs). You also can set Key Vault to auto-renew certificates.

For a complete guide on how to enable Azure Key Vault VM Extension with Pool User-assigned Managed Identity, see [Enable automatic certificate rotation in a Batch pool](automatic-certificate-rotation.md).

## FAQs

- Do `CloudServiceConfiguration` pools support Azure Key Vault VM extension and managed identity on pools?

  No. `CloudServiceConfiguration` pools will be [retired](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/) on the same date as Azure Batch account certificate retirement on February 29, 2024. We recommend that you migrate to `VirtualMachineConfiguration` pools before that date where you'll be able to use these solutions.

- Do user subscription pool allocation Batch accounts support Azure Key Vault?

  Yes. You may use the same Key Vault as specified with your Batch account as for use with your pools, but your Key Vault used for certificates for your Batch pools may be entirely separate.

- Are both Linux and Windows Batch pools supported with the Key Vault VM extension?

  Yes. See the documentation for [Windows](../virtual-machines/extensions/key-vault-windows.md) and [Linux](../virtual-machines/extensions/key-vault-linux.md).

- How do I get references to certificates on Linux Batch Pools since `$AZ_BATCH_CERTIFICATES_DIR` will be removed?

  The Key Vault VM extension for Linux allows you to specify the `certificateStoreLocation`, which is an absolute path to where the certificate will be stored.

- Where can I find best practices for using Azure Key Vault?

  See [Azure Key Vault best practices](../key-vault/general/best-practices.md).

## Next steps

For more information, see [Key Vault certificate access control](../key-vault/certificates/certificate-access-control.md). For more information about Batch functionality related to this migration, see [Azure Batch Pool extensions](create-pool-extensions.md) and [Azure Batch Pool Managed Identity](managed-identity-pools.md).
