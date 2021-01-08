---
title: Enable soft delete on all Azure Key Vaults | Microsoft Docs
description: Use this document to adopt soft-delete for all key vaults.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan
tags: azure-resource-manager

ms.service: key-vault
ms.topic: conceptual
ms.date: 12/15/2020
ms.author: sudbalas

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.
---

# Soft-delete will be enabled on all key vaults

> [!WARNING]
> **Breaking Change**: The ability to opt out of soft-delete will be deprecated soon. Azure Key Vault users and administrators should enable soft-delete on their key vaults immediately.
>
> For Managed HSM, soft-delete is enabled by default and cannot be disabled.

When a secret is deleted from a key vault without soft-delete protection, the secret is permanently deleted. Users can currently opt out of soft-delete during key vault creation but, to protect your secrets from accidental or malicious deletion by a user, Microsoft will soon enable soft-delete protection on **all** key vaults, and users will no longer have the option to opt out or turn soft-delete off.

:::image type="content" source="../media/softdeletediagram.png" alt-text="<alt text>":::

For full details on the soft-delete functionality, see [Azure Key Vault soft-delete overview](soft-delete-overview.md).

## Can my application work with soft delete enabled?

> [!Important] 
> **Please review the following information carefully before turning on soft delete for your key vaults**

Key Vault names are globally unique. The names of secrets stored in a key vault are also unique. You will not be able to reuse the name of a key vault or key vault object that exists in the soft deleted state. 

**Example #1** If your application programmatically creates a key vault named 'Vault A' and later deletes 'Vault A'. The key vault will be moved to the soft deleted state. Your application will not be able to recreate another key vault named 'Vault A' until the key vault is purged from the soft deleted state. 

**Example #2** If your application creates a key named `test key` in key vault A, and later deletes the key from vault A, your application will not be able to create a new key named `test key` in key vault A until the `test key` object is purged from the soft deleted state. 

This may result in conflict errors if you attempt to delete a key vault object and recreate it with the same name without purging it from the soft-deleted state first. This may cause your applications or automation to fail. Consult your dev team prior to making the required application and administration changes below. 

### Application changes

If your application assumes that soft-delete is not enabled and expects that deleted secret or key vault names are available for immediate reuse, your application logic will need to make the following changes in order to adopt this change.

1. Delete the original key vault or secret
2. Purge the key vault or secret in the soft-deleted state.
3. Wait – immediate recreate may result in a conflict.
4. Re-create the key vault with the same name.
5. Implement re-try if the create operation still results in a name conflict error, it may take up to 10 minutes for DNS records to update in the worst-case scenario.

### Administration changes

Security principals that need access to permanently delete secrets must be granted additional access policy permissions to purge these secrets and the key vault.

If you have an Azure Policy on your key vaults that mandates that soft-delete is turned off, this policy will need to be disabled.  You may need to escalate this issue to an administrator that controls Azure Policies applied to your environment. If this policy is not disabled, you may lose the ability to create new key vaults in the scope of the applied policy.

If your organization is subject to legal compliance requirements and cannot allow deleted key vaults and secrets to remain in a recoverable state, for an extended period of time, you will have to adjust the retention period of soft-delete, which is configurable between 7 – 90 days, to meet your organization’s standards.

## Procedures

### Audit your key vaults to check if soft-delete is enabled

1. Log in to the Azure portal.
2. Search for "Azure Policy".
3. Select "Definitions".
4. Under Category, select "Key Vault" in the filter.
5. Select the "Key Vault should have soft delete enabled" policy.
6. Click "Assign".
7. Set the scope to your subscription.
8. Make sure the effect of the policy is set to "Audit".
9. Select "Review + Create".
10. In can take up to 24 hours for a full scan of your environment to complete.
11. In the Azure Policy Blade, click "Compliance".
12. Select the policy you applied.

You should now be able to filter and see which of your key vaults have soft-delete enabled (compliant resources) and which key vaults do not have soft-delete enabled (non-compliant resources).

### Turn on Soft Delete for an existing key vault

1. Log in to the Azure portal.
2. Search for your Key Vault.
3. Select "Properties" under settings.
4. Under Soft-Delete, select the radio button corresponding to "Enable recovery of this vault and its objects".
5. Set the retention period for soft-delete.
6. Select "Save".

### Grant purge access policy permissions to a security principal

1. Log in to the Azure portal.
2. Search for your Key Vault.
3. Select "Access Policies" under settings.
4. Select the service principal you would like to grant access to.
5. For each dropdown under key, secret, and certificate permissions scroll down to "Privileged Operations" and select the "Purge" permission.

## Frequently asked questions

### Does this change affect me?

If you already have soft-delete turned on or if you do not delete and recreate key vault objects with the same name, you likely will not notice any change in the behavior of key vault.

If you have an application that deletes and recreates key vault objects with the same naming conventions frequently, you will have to make changes in your application logic to maintain expected behavior. Please see the "How do I respond to breaking changes?" section above.

### How do I benefit from this change?

Soft delete protection will provide your organization with an additional layer of protection against accidental or malicious deletion. As a key vault administrator, you can restrict access to both recover permissions and purge permissions.

If a user accidentally deletes a key vault or secret, you can grant them access permissions to recover the secret themselves without creating a risk that they permanently delete the secret or key vault. This self-serve process will minimize down-time in your environment and guarantee the availability of your secrets.

### How do I find out if I need to take action?

Please follow the steps above in the section titled "Procedure to Audit Your Key Vaults to Check If Soft-Delete Is On". Any key vault that does not have soft-delete turned on will be affected by this change. Additional tools to help audit will be available soon, and this document will be updated.

### What action do I need to take?

Make sure that you do not have to make changes to your application logic. Once you have confirmed that, turn on soft-delete on all your key vaults.

### By when do I need to take action?

To make sure that your applications are not affected, turn on soft-delete on your key vaults as soon as possible.

## Next steps

- Contact us with any questions regarding this change at [akvsoftdelete@microsoft.com](mailto:akvsoftdelete@microsoft.com).
- Read the [Soft-delete overview](soft-delete-overview.md)
