---
title: Enable soft-delete on all key vault objects - Azure Key Vault | Microsoft Docs
description: Use this document to adopt soft-delete for all key vaults and to make application and administration changes to avoid conflict errors.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.topic: conceptual
ms.date: 03/31/2021
ms.author: mbaldwin

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.
---

# Soft-delete will be enabled on all key vaults

> [!WARNING]
> Breaking change: the ability to opt out of soft-delete will be deprecated soon. Azure Key Vault users and administrators should enable soft-delete on their key vaults immediately.
>
> For Azure Key Vault Managed HSM, soft-delete is enabled by default and can't be disabled.

When a secret is deleted from a key vault without soft-delete protection, the secret is permanently deleted. Users can currently opt out of soft-delete during key vault creation. However, Microsoft will soon enable soft-delete protection on all key vaults to protect secrets from accidental or malicious deletion by a user. Users will no longer be able to opt out of or turn off soft-delete.

:::image type="content" source="../media/softdeletediagram.png" alt-text="Diagram showing how a key vault is deleted with soft-delete protection versus without soft-delete protection.":::

For full details on the soft-delete functionality, see [Azure Key Vault soft-delete overview](soft-delete-overview.md).

## Can my application work with soft-delete enabled?

> [!Important] 
> Review the following information carefully before turning on soft-delete for your key vaults.

Key vault names are globally unique. The names of secrets stored in a key vault are also unique. You won't be able to reuse the name of a key vault or key vault object that exists in the soft-deleted state. 

For example, if your application programmatically creates a key vault named "Vault A" and later deletes "Vault A," the key vault will be moved to the soft-deleted state. Your application won't be able to re-create another key vault named "Vault A" until the key vault is purged from the soft-deleted state. 

Also, if your application creates a key named `test key` in "Vault A" and later deletes that key, your application won't be able to create a new key named `test key` in "Vault A" until the `test key` object is purged from the soft-deleted state. 

Attempting to delete a key vault object and re-create it with the same name without purging it from the soft-deleted state first can cause conflict errors. These errors might cause your applications or automation to fail. Consult your dev team before you make the following required application and administration changes. 

### Application changes

If your application assumes that soft-delete isn't enabled and expects that deleted secret or key vault names are available for immediate reuse, you'll need to make the following changes to your application logic.

1. Delete the original key vault or secret.
1. Purge the key vault or secret in the soft-deleted state.
1. Wait for the purge to complete. Immediate re-creation might result in a conflict.
1. Re-create the key vault with the same name.
1. If the create operation still results in a name conflict error, try re-creating the key vault again. Azure DNS records might take up to 10 minutes to update in the worst-case scenario.

### Administration changes

Security principals that need access to permanently delete secrets must be granted more access policy permissions to purge these secrets and the key vault.

Disable any Azure policy on your key vaults that mandates that soft-delete is turned off. You might need to escalate this issue to an administrator who controls Azure policies applied to your environment. If this policy isn't disabled, you might lose the ability to create new key vaults in the scope of the applied policy.

If your organization is subject to legal compliance requirements and can't allow deleted key vaults and secrets to remain in a recoverable state for an extended period of time, you'll have to adjust the retention period of soft-delete to meet your organization's standards. You can configure the retention period to last from 7 to 90 days.

## Procedures

### Audit your key vaults to check if soft-delete is enabled

1. Sign in to the Azure portal.
1. Search for **Azure Policy**.
1. Select **Definitions**.
1. Under **Category**, select **Key Vault** in the filter.
1. Select the **Key Vault should have soft-delete enabled** policy.
1. Select **Assign**.
1. Set the scope to your subscription.
1. Make sure the effect of the policy is set to **Audit**.
1. Select **Review + Create**. A full scan of your environment might take up to 24 hours to complete.
1. In the **Azure Policy** pane, select **Compliance**.
1. Select the policy you applied.

You can now filter and see which key vaults have soft-delete enabled (compliant resources) and which key vaults don't have soft-delete enabled (non-compliant resources).

### Turn on soft-delete for an existing key vault

1. Sign in to the Azure portal.
1. Search for your key vault.
1. Select **Properties** under **Settings**.
1. Under **Soft-Delete**, select the **Enable recovery of this vault and its objects** option.
1. Set the retention period for soft-delete.
1. Select **Save**.

### Grant purge access policy permissions to a security principal

1. Sign in to the Azure portal.
1. Search for your key vault.
1. Select **Access Policies** under **Settings**.
1. Select the service principal you'd like to grant access to.
1. Move through each drop-down menu under **Key**, **Secret**, and **Certificate permissions** until you see **Privileged Operations**. Select the **Purge** permission.

## Frequently asked questions

### Does this change affect me?

If you already have soft-delete turned on or if you don't delete and re-create key vault objects with the same name, you likely won't notice any change in the behavior of the key vault.

If you have an application that deletes and re-creates key vault objects with the same naming conventions frequently, you'll have to make changes in your application logic to maintain expected behavior. See the [Application changes](#application-changes) section in this article.

### How do I benefit from this change?

Soft-delete protection provides your organization with another layer of protection against accidental or malicious deletion. As a key vault administrator, you can restrict access to both recover permissions and purge permissions.

If a user accidentally deletes a key vault or secret, you can grant them access permissions to recover the secret themselves without creating the risk that they permanently delete the secret or key vault. This self-serve process will minimize downtime in your environment and guarantee the availability of your secrets.

### How do I find out if I need to take action?

Follow the steps in the [Audit your key vaults to check if soft delete is enabled](#audit-your-key-vaults-to-check-if-soft-delete-is-enabled) section in this article. This change will affect any key vault that doesn't have soft-delete turned on.

### What action do I need to take?

After you've confirmed that you don't have to make changes to your application logic, turn on soft-delete on all of your key vaults.

### When do I need to take action?

To make sure that your applications aren't affected, turn on soft-delete on your key vaults as soon as possible.

## Next steps

- Contact us with any questions about this change at [akvsoftdelete@microsoft.com](mailto:akvsoftdelete@microsoft.com).
- Read the [Soft-delete overview](soft-delete-overview.md).
