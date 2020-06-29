---
title: Azure Key Vault moving a vault to a different subscription | Microsoft Docs
description: Guidance on moving a key vault to a different subscription.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 05/05/2020
ms.author: sudbalas
Customer intent: As a key vault administrator, I want to move my vault to another subscription.
---

# Moving an Azure Key Vault to another subscription

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Overview

**Moving a key vault to another subscription will cause a breaking change to your environment.**

Make sure you understand the impact of this change and follow the guidance in this article carefully before deciding to move key vault to a new subscription.

When you create a key vault, it is automatically tied to the default Azure Active Directory tenant ID for the subscription in which it is created. All access policy entries are also tied to this tenant ID. If you move your Azure subscription from tenant A to tenant B, your existing key vaults will be inaccessible by the service principals (users and applications) in tenant B. To fix this issue, you need to:

* Change the tenant ID associated with all existing key vaults in the subscription to tenant B.
* Remove all existing access policy entries.
* Add new access policy entries associated with tenant B.

## Limitations

Some service principals (users and applications) are bound to a specific tenant. If you move your key vault to a subscription in another tenant, there is a chance that you will not be able to restore access to a specific service principal. Check to make sure that all essential service principals exist in the tenant where you are moving your key vault.

## Design considerations

Your organization may have implemented Azure Policy with enforcement or exclusions at the subscription level. There may be a different set of policy assignments in the subscription where your key vault currently exists and the subscription where you are moving your key vault. A conflict in policy requirements has the potential to break your applications.

### Example

You have an application connected to key vault that creates certificates that are valid for two years. The subscription where you are attempting to move your key vault has a policy assignment that blocks the creation of certificates that are valid for longer than one year. After moving your key vault to the new subscription the operation to create a certificate that is valid for two years will be blocked by an Azure policy assignment.

### Solution

Make sure that you go to the Azure Policy page on the Azure portal and look at the policy assignments for your current subscription as well as the subscription you are moving to and ensure that there are no mismatches.

## Prerequisites

* Contributor level access or higher to the current subscription where your key vault exists.
* Contributor level access or higher to the subscription where you want to move your key vault.
* A resource group in the new subscription.

## Procedure

### Initial steps (moving Key Vault)

1. Log in to the Azure portal
2. Navigate to your key vault
3. Click on the "Overview" tab
4. Select the "Move" button
5. Select "Move to another subscription" from the dropdown options
6. Select the resource group where you want to move your key vault
7. Acknowledge the warning regarding moving resources
8. Select "OK"

### Additional steps (post move)

Now that you have moved your key vault to the new subscription, you need to update the tenant ID and remove old access policies. Here are tutorials for these steps in PowerShell and Azure CLI.

```azurepowershell
Select-AzSubscription -SubscriptionId <your-subscriptionId>                # Select your Azure Subscription
$vaultResourceId = (Get-AzKeyVault -VaultName myvault).ResourceId          # Get your key vault's Resource ID 
$vault = Get-AzResource –ResourceId $vaultResourceId -ExpandProperties     # Get the properties for your key vault
$vault.Properties.TenantId = (Get-AzContext).Tenant.TenantId               # Change the Tenant that your key vault resides in
$vault.Properties.AccessPolicies = @()                                     # Access policies can be updated with real
                                                                           # applications/users/rights so that it does not need to be                             # done after this whole activity. Here we are not setting 
                                                                           # any access policies. 
Set-AzResource -ResourceId $vaultResourceId -Properties $vault.Properties  # Modifies the key vault's properties.

Clear-AzContext                                                            #Clear the context from PowerShell
Connect-AzAccount                                                          #Log in again to confirm you have the correct tenant id
````

```azurecli
az account set -s <your-subscriptionId>                                    # Select your Azure Subscription
tenantId=$(az account show --query tenantId)                               # Get your tenantId
az keyvault update -n myvault --remove Properties.accessPolicies           # Remove the access policies
az keyvault update -n myvault --set Properties.tenantId=$tenantId          # Update the key vault tenantId
```

Now that your vault is associated with the correct tenant ID and old access policy entries are removed, set new access policy entries with the Azure PowerShell [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/Set-azKeyVaultAccessPolicy) cmdlet or the Azure CLI [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command.

If you are using a managed identity for Azure resources, you will need to update it to the new Azure AD tenant as well. For more information on managed identities, see [Provide Key Vault authentication with a managed identity](managed-identity.md).

If you are using MSI, you'll also have to update the MSI identity since the old identity will no longer be in the correct AAD tenant.


