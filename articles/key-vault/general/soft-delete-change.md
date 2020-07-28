---
title: Soft Delete Update | Microsoft Docs
description: Use this document to adopt soft-delete on for all key vaults.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 07/27/2020
ms.author: sudbalas

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.
---
# Soft Delete will be enabled on all key vaults

> [!WARNING]
> Breaking Change: Notice to all Azure Key Vault users and administrators, enable soft-delete on your key vaults immediately. The ability to opt out of soft-delete will be deprecated by the end of the year and soft-delete protection will automatically be turned on for all key vaults.

## Overview

When you create a new key vault, soft-delete is enabled by default. Users currently can turn off soft-delete before creating a key vault. By the end of 2020, the Key Vault default behavior will change such that soft-delete protection will be on for all key vaults. Every new key vault and every existing key vault will automatically have soft-delete protection turned on with no ability to turn it off.

## Reason for change

Microsoft does not have access to secrets stored in your key vault. When a secret is deleted from key vault without soft-delete protection, the secret is permanently and irrecoverably deleted. To protect your secrets from accidental  or malicious deletion by a user, Microsoft is enabling soft-delete protection on all key vaults with no ability to turn it off.

Soft Delete offers users the following additional protections:

1. Once a secret, key, certificate, or key vault is deleted, it will remain recoverable for a configurable period of 7 to 90 calendar days. If no configuration is specified the default recovery period will be set to 90 days. This provides users with sufficient time to notice an accidental secret deletion and respond.
2. When soft-delete protection is turned on, two operations must be made to permanently delete a secret. First a user must delete the object, which puts it into the soft-deleted state. Second, a user must purge the object in the soft-deleted state. The purge operation requires additional access policy permissions. These additional protections reduce the risk of a user accidentally or maliciously deleting a secret or a key vault.  
3. To purge a secret in the soft-deleted state, a service principal must be granted an additional “purge” access policy permission. The purge access policy permission is not granted by default to any service principal including key vault and subscription owners and must be deliberately set. By requiring an elevated access policy permission to purge a soft-deleted secret, it reduces the probability of accidentally deleting a secret.

## New experience diagram

:::image type="content" source="../media/softdeletediagram.png" alt-text="<alt text>":::

## How do I respond to breaking changes

When an object is in the soft-deleted state an object with the same name cannot be created.  For example, if you delete a key named ‘test key’ in key vault A, you will not be able to create a new key named ‘test key’ in key vault A until the deleted key in the soft-deleted state is purged.

### Application changes

If your application assumes that soft-delete is not enabled and expects that deleted secret or key vault names are available for immediate reuse, your application logic will need to make the following changes in order to adopt this change.

1. Delete the original key vault or secret
2. Purge the key vault or secret in the soft-deleted state.
3. Wait – immediate recreate may result in a conflict.
4. Re-create the key vault with the same name.
5. Implement re-try if the create operation still results in a name conflict error, it may take up to 10 minutes for DNS records to update in the worst-case scenario.

### Administration changes

Security principals  that need access to permanently delete secrets must be granted additional access policy permissions to purge these secrets and the key vault.

If you have an Azure Policy on your key vaults that mandates that soft-delete is turned off, this policy will need to be disabled.  You may need to escalate this issue to an administrator that controls Azure Policies applied to your environment. If this policy is not disabled, you may lose the ability to create new key vaults in the scope of the applied policy.

If your organization is subject to has legal compliance requirements such as GDPR and cannot allow deleted key vaults and secrets to remain in a recoverable state, for an extended period of time, you will have to adjust the retention period of soft-delete, which is configurable between 7 – 90 days, to meet your organization’s standards.

## Procedures

### Audit your key vaults to check if soft-delete is enabled

1. Log in to the Azure Portal.
2. Search for “Azure Policy”.
3. Select “Definitions”.
4. Under Category, select “Key Vault” in the filter.
5. Select the “Key Vault Objects Should Be Recoverable” policy.
6. Click “Assign”.
7. Set the scope to your subscription.
8. Select “Review + Create”.
9. In can take up to 24 hours for a full scan of your environment to complete.
10. In the Azure Policy Blade, click “Compliance”.
11. Select the policy you applied.

You should now be able to filter and see which of your key vaults have soft-delete enabled (compliant resources) and which key vaults do not have soft-delete enabled (non -compliant resourced).

### Turn on Soft Delete for an existing key vault

1. Log in to the Azure Portal.
2. Search for your Key Vault.
3. Select “Properties” under settings.
4. Under Soft-Delete, select the radio button corresponding to “Enable recovery. of this vault and its objects”.
5. Set the retention period for soft-delete.
6. Select “Save”.

### Grant purge access policy permissions to a security principal

1. Log in to the Azure Portal.
2. Search for your Key Vault.
3. Select “Access Policies” under settings.
4. Select the service principal you would like to grant access to.
5. For each dropdown under key, secret, and certificate permissions scroll all the way down to “Privileged Operations” and select the “Purge” permission.

## Frequently Asked Questions

1. **Does this change affect me?**

    If you already have soft-delete turned on or if you do not delete and recreate key vault objects with the same name, you likely will not notice any change in the behavior of key vault.

    If you have an application that deletes and recreates key vault objects with the same naming conventions frequently, you will have to make changes in your application logic to maintain expected behavior. Please see the “How do I respond to breaking changes?” section above.

2. **How do I benefit from this change?**

    Soft delete protection will provide your organization with an additional layer of protection against accidental or malicious deletion. As a key vault administrator, you can restrict access to both recover permissions and purge permissions.

    If a user accidentally deletes a key vault or secret, you can grant them access permissions to recover the secret themselves without creating a risk that they permanently delete the secret or key vault. This self-serve process will minimize down-time in your environment and guarantee the availability of your secrets.

3. **How do I find out if I need to take action?**

    Please follow the steps above in the section titled “Procedure to Audit Your Key Vaults to Check If Soft-Delete Is On”. Any key vault that does not have soft-delete turned on will be affected by this change. Additional tools to help audit will be available soon, and this document will be updated.

4. **What action do I need to take?**

    Make sure that you do not have to make changes to your application logic. Once you have confirmed that, turn on soft-delete on all your key vaults. This will make sure that you will not be affected by a breaking change when soft-delete is turned on for all key vaults at the end of the year.

5. **By when do I need to take action?**

    Soft delete will be turned on for all key vaults by the end of the year. To make sure that your applications are not affected, please turn on soft-delete on your key vaults as soon as possible.

6. **What will happen if I don’t take any action?**
    If you do not take any action, soft-delete will automatically be turned on for all of your key vaults at the end of the year. This may result in conflict errors if you attempt to delete a key vault object and recreate it with the same name without purging it from the soft-deleted state first. This may cause your applications or automation to fail.

## Contact us

If you have any questions regarding this change, please reach out to akvsoftdelete@microsoft.com.